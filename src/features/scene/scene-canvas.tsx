"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

type SceneCanvasProps = { active: boolean };

function Sphere() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.15;
  });
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[2.2, 3]} />
      <meshBasicMaterial color={accent || "#8ab4ff"} wireframe transparent opacity={0.35} />
    </mesh>
  );
}

export default function SceneCanvas({ active }: SceneCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
    >
      <Sphere />
    </Canvas>
  );
}
