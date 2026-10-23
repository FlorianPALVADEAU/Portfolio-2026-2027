import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { animateDuck, type Input, type Memory, newMemory } from "./duck-animation";
import { feltTexture } from "./swiss-cross";
import { Cowbell, Hat, Scarf } from "./swiss-outfit";

const FEATHERS = "#fbf8f1";
const BEAK = "#ff9a1f";

/**
 * A big white domestic duck in Swiss dress. Everything is built from a few shapes, so there is
 * nothing to download. It turns its body, head and eyes after the pointer (wandering by itself
 * when nobody is moving one), swings its cowbell, blinks, and a press makes it quack and flap.
 */
export function Duck({ input }: { input: RefObject<Input> }) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const jaw = useRef<Mesh>(null);
  const leftWing = useRef<Mesh>(null);
  const rightWing = useRef<Mesh>(null);
  const leftEye = useRef<Group>(null);
  const rightEye = useRef<Group>(null);
  const leftPupil = useRef<Mesh>(null);
  const rightPupil = useRef<Mesh>(null);
  const bell = useRef<Group>(null);

  const memory = useRef<Memory>(newMemory());
  const felt = useMemo(feltTexture, []);
  const materialProps = { roughness: 0.9, bumpMap: felt, bumpScale: 1.2 } as const;

  useFrame((_state, delta) => {
    animateDuck(
      { root, head, jaw, leftWing, rightWing, leftEye, rightEye, leftPupil, rightPupil, bell },
      input.current,
      memory.current,
      performance.now() / 1000,
      Math.min(delta, 0.05),
    );
  });

  return (
    <group ref={root}>
      {/* Body, tail and wings. */}
      <mesh scale={[0.95, 0.8, 1.2]} position={[0, 0, -0.1]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color={FEATHERS} {...materialProps} />
      </mesh>
      <mesh scale={[0.5, 0.36, 0.55]} position={[0, 0.28, -1.3]} rotation={[0.55, 0, 0]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={FEATHERS} {...materialProps} />
      </mesh>
      <mesh ref={leftWing} scale={[0.2, 0.55, 0.75]} position={[0.97, 0.12, -0.15]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={FEATHERS} {...materialProps} />
      </mesh>
      <mesh ref={rightWing} scale={[0.2, 0.55, 0.75]} position={[-0.97, 0.12, -0.15]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={FEATHERS} {...materialProps} />
      </mesh>

      {/* Feet. */}
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} scale={[0.3, 0.07, 0.4]} position={[x, -0.84, 0.5]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshStandardMaterial color={BEAK} {...materialProps} />
        </mesh>
      ))}

      {/* Neck. */}
      <mesh position={[0, 0.78, 0.5]} rotation={[0.25, 0, 0]}>
        <capsuleGeometry args={[0.36, 0.5, 12, 24]} />
        <meshStandardMaterial color={FEATHERS} {...materialProps} />
      </mesh>

      <Scarf />
      <Cowbell ref={bell} />

      {/* Head: it turns on its own pivot at the base of the neck. */}
      <group ref={head} position={[0, 1.18, 0.62]}>
        <group position={[0, 0.2, 0]}>
          <mesh scale={[1, 0.95, 1.05]}>
            <sphereGeometry args={[0.64, 48, 32]} />
            <meshStandardMaterial color={FEATHERS} {...materialProps} />
          </mesh>
          <mesh scale={[0.36, 0.13, 0.42]} position={[0, -0.06, 0.64]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color={BEAK} roughness={0.55} />
          </mesh>
          <mesh ref={jaw} scale={[0.32, 0.1, 0.36]} position={[0, -0.2, 0.6]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color={BEAK} roughness={0.55} />
          </mesh>
          {[
            { side: 1, eye: leftEye, pupil: leftPupil },
            { side: -1, eye: rightEye, pupil: rightPupil },
          ].map(({ side, eye, pupil }) => (
            <group key={side} ref={eye} position={[side * 0.29, 0.14, 0.5]}>
              <mesh>
                <sphereGeometry args={[0.13, 24, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh ref={pupil} position={[0, 0, 0.085]}>
                <sphereGeometry args={[0.075, 20, 14]} />
                <meshStandardMaterial color="#15110f" roughness={0.2} />
              </mesh>
            </group>
          ))}
          <Hat />
        </group>
      </group>
    </group>
  );
}
