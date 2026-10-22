"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  type Mesh,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";
import { coverRatio, type ReelCover, sharpSource } from "./reel-cover";
import { followTarget, pinchTarget } from "./reel-physics";
import { fragmentShader, vertexShader } from "./reel-shader";

/** Distance in px between the camera and the page plane: one world unit is one screen pixel. */
const CAMERA_DISTANCE = 1000;
/** How far, in px, the top and bottom edges of the viewport come toward the camera at full speed. */
const DEPTH = 100;
const DEPTH_SMALL = 60;
const WIDE_SCREEN = 1024;
/** Planes beyond this many px outside the viewport are not drawn. */
const CULL_MARGIN = 240;
const RADIUS = 24;
const HOVER_ZOOM = 0.05;
/** Size of the full-screen plane against the viewport, so the lean and the bowl never show a gap. */
const OVERSCAN = 1.3;
/** Distance in px the edges of the viewport come toward the camera at full bowl. */
const CUP_DEPTH = 260;

/** Largest slide of the picture, as a share of its size, at full shake. */
const SHAKE_X = 0.01;
const SHAKE_Y = 0.003;
/** Largest slide of the picture between its nearest and farthest pixels, as a share of its size. */
const PARALLAX = 0.034;

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/** Unsteady-hand offset: two out-of-phase waves per axis, never beyond the shake limits. */
function handShake(seconds: number, strength: number): [number, number] {
  const x = 0.6 * Math.sin(seconds * 12.7) + 0.4 * Math.sin(seconds * 22 + 1.3);
  const y = 0.6 * Math.sin(seconds * 10.2 + 0.6) + 0.4 * Math.sin(seconds * 19.5 + 2.1);
  return [x * SHAKE_X * strength, y * SHAKE_Y * strength];
}

type Bend = { current: number };

/** Keeps one world unit equal to one pixel at the page plane, and measures how fast the page moves. */
function Rig({ bend }: { bend: Bend }) {
  const camera = useThree((state) => state.camera);
  const height = useThree((state) => state.size.height);
  const lastY = useRef(0);

  useEffect(() => {
    if (!("fov" in camera)) return;
    camera.fov = (2 * Math.atan(height / 2 / CAMERA_DISTANCE) * 180) / Math.PI;
    camera.updateProjectionMatrix();
    lastY.current = window.scrollY;
  }, [camera, height]);

  useFrame((_, delta) => {
    const seconds = Math.max(delta, 0.001);
    const velocity = (window.scrollY - lastY.current) / seconds;
    lastY.current = window.scrollY;
    bend.current = followTarget(bend.current, pinchTarget(velocity), Math.min(seconds, 0.1));
  });

  return null;
}

function Cover({ cover, bend }: { cover: ReelCover; bend: Bend }) {
  const size = useThree((state) => state.size);
  const mesh = useRef<Mesh>(null);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [depthMap, setDepthMap] = useState<Texture | null>(null);

  const { geometry, material, uniforms } = useMemo(() => {
    const uniforms = {
      uMap: { value: null as Texture | null },
      uRatio: { value: [1, 1] as [number, number] },
      uSize: { value: [1, 1] as [number, number] },
      uZoom: { value: 1 },
      uRadius: { value: RADIUS },
      uDepth: { value: 0 },
      uHalfHeight: { value: 1 },
      uBlur: { value: 0 },
      uFocus: { value: 0.5 },
      uShutter: { value: 0 },
      uShake: { value: [0, 0] as [number, number] },
      uDepthMap: { value: null as Texture | null },
      uLook: { value: [0, 0] as [number, number] },
      uParallax: { value: 0 },
      uCup: { value: 0 },
      uTint: { value: new Color() },
      uTintMix: { value: 0 },
    };
    return {
      geometry: new PlaneGeometry(1, 1, 24, 24),
      material: new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true }),
      uniforms,
    };
  }, []);

  useEffect(() => {
    const { image } = cover;
    let current: Texture | null = null;
    let cancelled = false;
    const show = (source: HTMLImageElement) => {
      // An <img> reports its rendered size to three, not its natural one, so the pixels go through a
      // canvas of the real size.
      const pixels = document.createElement("canvas");
      pixels.width = source.naturalWidth;
      pixels.height = source.naturalHeight;
      pixels.getContext("2d")?.drawImage(source, 0, 0);
      const next = new Texture(pixels);
      next.colorSpace = SRGBColorSpace;
      next.anisotropy = 4;
      next.needsUpdate = true;
      const previous = current;
      current = next;
      setTexture(next);
      previous?.dispose();
    };
    // The card's picture shows first; the sharp one replaces it once it has arrived.
    const sharpen = () => {
      const sharp = new Image();
      sharp.decoding = "async";
      sharp.onload = () => {
        if (!cancelled) show(sharp);
      };
      sharp.src = sharpSource(image.currentSrc || image.src, window.location.href);
    };
    const load = () => {
      show(image);
      sharpen();
    };
    if (image.complete && image.naturalWidth > 0) load();
    else image.addEventListener("load", load, { once: true });
    return () => {
      cancelled = true;
      image.removeEventListener("load", load);
      current?.dispose();
    };
  }, [cover]);

  useEffect(() => {
    if (!cover.depthSrc) return;
    let cancelled = false;
    let loaded: Texture | null = null;
    new TextureLoader().load(cover.depthSrc, (depth) => {
      if (cancelled) {
        depth.dispose();
        return;
      }
      // Depth is data, not colour: no colour space and no mipmaps, so values stay exact.
      depth.generateMipmaps = false;
      loaded = depth;
      setDepthMap(depth);
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, [cover.depthSrc]);

  // The DOM frame keeps its layout, alt text and focus ring; only its pixels give way to the plane.
  useEffect(() => {
    if (!texture) return;
    cover.frame.style.opacity = "0";
    return () => {
      cover.frame.style.opacity = "";
    };
  }, [texture, cover.frame]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(() => {
    const plane = mesh.current;
    if (!plane) return;
    const box = cover.frame.getBoundingClientRect();
    const { fill } = cover.state;
    // A cover that fills the screen is drawn wherever its card is, even far out of sight.
    const visible =
      Boolean(texture) &&
      (fill > 0 || (box.bottom > -CULL_MARGIN && box.top < size.height + CULL_MARGIN));
    plane.visible = visible;
    if (!(visible && texture)) return;

    const { tilt, grow, zoom, hover, blur, focus, shutter, shake, lookX, lookY } = cover.state;
    const { cup, lean, tint, tintColor } = cover.state;
    const width = lerp(box.width * grow, size.width * OVERSCAN, fill);
    const height = lerp(box.height * grow, size.height * OVERSCAN, fill);
    const pixels = texture.image as HTMLCanvasElement;
    const depth = size.width >= WIDE_SCREEN ? DEPTH : DEPTH_SMALL;

    plane.position.set(
      (box.left + box.width / 2 - size.width / 2) * (1 - fill),
      -(box.top + box.height / 2 - size.height / 2) * (1 - fill),
      0,
    );
    plane.renderOrder = fill > 0 ? 10 : 0;
    plane.scale.set(width, height, 1);
    plane.rotation.z = (-(tilt + lean) * Math.PI) / 180;
    uniforms.uMap.value = texture;
    uniforms.uRatio.value = coverRatio(pixels.width / pixels.height, width / height);
    uniforms.uSize.value = [width, height];
    // Zooming in by exactly the room the shake needs keeps the picture inside its frame.
    const parallax = depthMap ? PARALLAX * hover : 0;
    const reach = Math.max(SHAKE_X, SHAKE_Y) * shake + parallax / 2;
    uniforms.uZoom.value = (zoom * (1 + HOVER_ZOOM * hover)) / (1 - 2 * reach);
    uniforms.uShake.value = handShake(performance.now() / 1000, shake);
    uniforms.uDepthMap.value = depthMap;
    uniforms.uLook.value = [lookX, lookY];
    uniforms.uParallax.value = parallax;
    uniforms.uRadius.value = RADIUS * (1 - fill);
    uniforms.uCup.value = CUP_DEPTH * cup;
    uniforms.uTint.value.setRGB(...tintColor, SRGBColorSpace);
    uniforms.uTintMix.value = tint;
    uniforms.uBlur.value = blur;
    uniforms.uFocus.value = focus;
    uniforms.uShutter.value = shutter;
    uniforms.uDepth.value = depth * bend.current;
    uniforms.uHalfHeight.value = size.height / 2;
    cover.state.ready = true;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} />;
}

/** One fixed canvas that draws every cover; it only runs while the works are on screen. */
export default function ReelCanvas({
  covers,
  container,
}: {
  covers: ReelCover[];
  container: HTMLElement;
}) {
  const [active, setActive] = useState(false);
  const bend = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      {
        rootMargin: "200px 0px",
      },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [container]);

  return (
    <div
      aria-hidden="true"
      data-reel-canvas
      className={`pointer-events-none fixed inset-0 z-30 ${active ? "" : "invisible"}`}
    >
      <Canvas
        // R3F turns pointer events back on for its root, which would swallow the cursor and links.
        style={{ pointerEvents: "none" }}
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, CAMERA_DISTANCE], near: 10, far: 4000 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Rig bend={bend} />
        {covers.map((cover) => (
          <Cover key={cover.id} cover={cover} bend={bend} />
        ))}
      </Canvas>
    </div>
  );
}
