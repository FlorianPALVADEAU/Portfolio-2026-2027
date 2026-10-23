import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { BowTie } from "./bow-tie";
import { animateDuck, type Input, newMemory } from "./duck-animation";
import { feltTexture } from "./textures";

const FEATHERS = "#f4f1ea";
const BILL = "#e29a14";
const EYE = "#120e0c";

/**
 * A white domestic duck, drawn as a faceted sculpture rather than a toy: a long neck, a small head
 * with a slim bill and beads for eyes, wings folded flat, and one bow tie as its only dress. It is
 * made of a few shapes, so there is nothing to download. It turns its body and head after the
 * pointer (wandering by itself when nobody moves one), blinks, and a press makes it quack and flap.
 */
export function Duck({ input }: { input: RefObject<Input> }) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const jaw = useRef<Mesh>(null);
  const leftWing = useRef<Mesh>(null);
  const rightWing = useRef<Mesh>(null);
  const leftEye = useRef<Mesh>(null);
  const rightEye = useRef<Mesh>(null);
  const memory = useRef(newMemory());
  const felt = useMemo(feltTexture, []);
  const feathers = {
    color: FEATHERS,
    roughness: 0.92,
    bumpMap: felt,
    bumpScale: 1,
    flatShading: true,
  } as const;

  useFrame((_state, delta) => {
    animateDuck(
      { root, head, jaw, leftWing, rightWing, leftEye, rightEye },
      input.current,
      memory.current,
      performance.now() / 1000,
      Math.min(delta, 0.05),
    );
  });

  return (
    <group ref={root}>
      {/* Body: a streamlined hull, with the tail lifted behind it. */}
      <mesh scale={[0.85, 0.72, 1.4]} position={[0, 0, -0.25]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial {...feathers} />
      </mesh>
      <mesh position={[0, 0.3, -1.75]} rotation={[-1.1, 0, 0]} scale={[0.3, 0.5, 0.12]}>
        <coneGeometry args={[1, 1, 5]} />
        <meshStandardMaterial {...feathers} />
      </mesh>

      {/* Wings, folded flat along the flanks. */}
      <mesh
        ref={leftWing}
        position={[0.74, 0.15, -0.3]}
        rotation={[0.08, 0, 0.3]}
        scale={[0.13, 0.5, 0.95]}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial {...feathers} />
      </mesh>
      <mesh
        ref={rightWing}
        position={[-0.74, 0.15, -0.3]}
        rotation={[0.08, 0, -0.3]}
        scale={[0.13, 0.5, 0.95]}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial {...feathers} />
      </mesh>

      {/* A long neck, leaning forward from the chest. */}
      <mesh position={[0, 0.92, 0.6]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1.0, 12]} />
        <meshStandardMaterial {...feathers} />
      </mesh>
      <group position={[0, 0.42, 1.02]} rotation={[0.2, 0, 0]} scale={1.35}>
        <BowTie />
      </group>

      {/* Head: turns on a pivot at the top of the neck. */}
      <group ref={head} position={[0, 1.38, 0.88]}>
        <mesh scale={[0.92, 0.85, 1.2]} position={[0, 0.12, 0.1]}>
          <icosahedronGeometry args={[0.5, 2]} />
          <meshStandardMaterial {...feathers} />
        </mesh>
        <mesh scale={[0.24, 0.08, 0.6]} position={[0, 0.04, 0.72]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={BILL} roughness={0.6} flatShading />
        </mesh>
        <mesh ref={jaw} scale={[0.2, 0.05, 0.54]} position={[0, -0.04, 0.68]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={BILL} roughness={0.6} flatShading />
        </mesh>
        {[1, -1].map((side) => (
          <mesh
            key={side}
            ref={side === 1 ? leftEye : rightEye}
            position={[side * 0.36, 0.22, 0.3]}
          >
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshStandardMaterial color={EYE} roughness={0.15} metalness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
