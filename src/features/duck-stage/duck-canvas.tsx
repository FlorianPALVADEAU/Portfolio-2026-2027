"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { type RefObject, Suspense, useEffect } from "react";
import { Duck } from "./duck";
import type { Input } from "./duck-animation";

/** Below this width-to-height ratio the stage is tall and narrow, a phone's or a tablet's. */
const PORTRAIT_RATIO = 0.95;
type Vec3 = [number, number, number];
type View = { position: Vec3; target: Vec3 };
const FULL_BODY: View = { position: [0, 1.45, 2.15], target: [0, 0.83, 0] };
/** The same framing as the full body, pulled back just far enough that the body fits the width. */
const PORTRAIT: View = { position: [0, 1.55, 2.5], target: [0, 1.02, 0] };
/** Distance times aspect ratio at which the body spans nearly the whole width of the stage. */
const FIT_WIDTH = 1.52;

function viewFor(width: number, height: number): View {
  const ratio = width / height;
  if (ratio >= PORTRAIT_RATIO) return FULL_BODY;
  const [x, y, z] = PORTRAIT.position;
  const [, ty, tz] = PORTRAIT.target;
  const scale = FIT_WIDTH / ratio / Math.hypot(y - ty, z - tz);
  return { position: [x, ty + (y - ty) * scale, tz + (z - tz) * scale], target: PORTRAIT.target };
}

function Rig() {
  const camera = useThree((state) => state.camera);
  const { width, height } = useThree((state) => state.size);

  useEffect(() => {
    const view = viewFor(width, height);
    camera.position.set(...view.position);
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
  }, [camera, width, height]);

  return null;
}

export default function DuckCanvas({ input }: { input: RefObject<Input> }) {
  return (
    <Canvas
      // The page, not the canvas, listens for the pointer: the duck follows it everywhere.
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.75]}
      camera={{ fov: 34, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Rig />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 7, 5]} intensity={3.4} />
      <directionalLight position={[-5, 2, -3]} intensity={1.2} color="#8ab4ff" />
      {/* Backlight: a soft rim around the toy's edge, from behind and above. */}
      <directionalLight position={[0, 4, -6]} intensity={2.2} color="#b4ccff" />
      <Suspense fallback={null}>
        <Duck input={input} />
      </Suspense>
    </Canvas>
  );
}
