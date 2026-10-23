"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { type RefObject, Suspense, useEffect } from "react";
import { Duck } from "./duck";
import type { Input } from "./duck-animation";

/** Below this width-to-height ratio the stage is a phone's: the camera moves in on the head. */
const PORTRAIT_RATIO = 0.95;
type View = { position: [number, number, number]; target: [number, number, number] };
const FULL_BODY: View = { position: [0, 1.5, 2.15], target: [0, 0.88, 0] };
const CLOSE_UP: View = { position: [0, 2.85, 4.1], target: [0, 2.75, 0] };

function Rig() {
  const camera = useThree((state) => state.camera);
  const { width, height } = useThree((state) => state.size);

  useEffect(() => {
    const view = width / height < PORTRAIT_RATIO ? CLOSE_UP : FULL_BODY;
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
