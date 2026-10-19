"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { BufferAttribute, BufferGeometry, Color, type Points, ShaderMaterial } from "three";
import { fragmentShader, vertexShader } from "./shaders";
import { SHAPE_COUNT, SHAPE_OFFSETS, shapes } from "./shapes";

type SceneCanvasProps = { active: boolean };

const WIDE_SCREEN = 768;
const DAMPING = 2.5;
const FALLBACK_ACCENT = "#8ab4ff";

/** Small deterministic generator: the cloud must look the same on every load and in tests. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGeometry(count: number): BufferGeometry {
  const geometry = new BufferGeometry();
  const random = seeded(7);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) seeds[i] = random();

  shapes.forEach((shape, index) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) positions.set(shape(i, count, random), i * 3);
    geometry.setAttribute(`aShape${index}`, new BufferAttribute(positions, 3));
  });
  // `position` must exist for three to draw; the shader ignores it.
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  return geometry;
}

function readAccent(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  return value || FALLBACK_ACCENT;
}

/** Follows the active theme: the accent token changes whenever the root attributes do. */
function useAccent(): string {
  const [accent, setAccent] = useState(readAccent);
  useEffect(() => {
    const observer = new MutationObserver(() => setAccent(readAccent()));
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  return accent;
}

function scrollStage(): number {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  return range > 0 ? (window.scrollY / range) * (SHAPE_COUNT - 1) : 0;
}

function Particles() {
  const accent = useAccent();
  const size = useThree((state) => state.size);
  const wide = size.width >= WIDE_SCREEN;
  const count = wide ? 14000 : 6000;
  const cloud = useRef<Points>(null);
  const stage = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => buildGeometry(count), [count]);
  const { material, uniforms } = useMemo(() => {
    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 2.6 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
      uPointer: { value: [0, 0] },
      uOffsets: { value: [...SHAPE_OFFSETS] as number[] },
      uColor: { value: new Color(FALLBACK_ACCENT) },
      uOpacity: { value: 0.55 },
    };
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms,
    });
    return { material, uniforms };
  }, []);

  useEffect(() => {
    uniforms.uColor.value.set(accent);
  }, [accent, uniforms]);

  useEffect(() => {
    uniforms.uOffsets.value = wide ? [...SHAPE_OFFSETS] : SHAPE_OFFSETS.map(() => 0);
    uniforms.uOpacity.value = wide ? 0.55 : 0.35;
  }, [wide, uniforms]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    const blend = Math.min(1, delta * DAMPING);
    stage.current += (scrollStage() - stage.current) * blend;
    const uniforms = material.uniforms;
    if (!(uniforms.uProgress && uniforms.uTime && uniforms.uPointer)) return;
    uniforms.uProgress.value = stage.current;
    uniforms.uTime.value += delta;
    uniforms.uPointer.value = [pointer.current.x, pointer.current.y];
    if (cloud.current)
      cloud.current.rotation.y = stage.current * 0.35 + uniforms.uTime.value * 0.03;
  });

  return <points ref={cloud} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function SceneCanvas({ active }: SceneCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
    >
      <Particles />
    </Canvas>
  );
}
