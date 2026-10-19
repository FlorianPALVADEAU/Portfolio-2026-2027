"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { Vector3 } from "three";

type SceneCanvasProps = { active: boolean };

const RING_COUNT = 17;
const RADIUS = 2.4;
const SEGMENTS = 96;
const IDLE_SPEED = 0.12;
const PARALLAX = 0.25;
const EASING = 3;

/** Latitude circles of a sphere: concentric when seen from the pole, a globe from the side. */
function ringPoints(index: number): Float32Array {
  const latitude = (index / (RING_COUNT - 1) - 0.5) * Math.PI * 0.94;
  const radius = Math.cos(latitude) * RADIUS;
  const y = Math.sin(latitude) * RADIUS;
  const points = new Float32Array((SEGMENTS + 1) * 3);
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2;
    points.set([Math.cos(angle) * radius, y, Math.sin(angle) * radius], i * 3);
  }
  return points;
}

function readAccent(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  return value || "#8ab4ff";
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

function Rings() {
  const group = useRef<Group>(null);
  const accent = useAccent();
  const rings = useMemo(() => Array.from({ length: RING_COUNT }, (_, i) => ringPoints(i)), []);
  const target = useMemo(() => new Vector3(), []);

  useFrame(({ pointer }, delta) => {
    const current = group.current;
    if (!current) return;
    target.set(pointer.y * PARALLAX, 0, pointer.x * PARALLAX);
    current.rotation.y += delta * IDLE_SPEED;
    current.rotation.x += (target.x + 0.35 - current.rotation.x) * Math.min(1, delta * EASING);
    current.rotation.z += (target.z - current.rotation.z) * Math.min(1, delta * EASING);
  });

  return (
    <group ref={group}>
      {rings.map((positions, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: rings are static and never reorder
        <lineLoop key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={accent} transparent opacity={0.35} />
        </lineLoop>
      ))}
    </group>
  );
}

export default function SceneCanvas({ active }: SceneCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
    >
      <Rings />
    </Canvas>
  );
}
