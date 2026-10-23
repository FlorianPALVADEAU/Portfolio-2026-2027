import { forwardRef, useMemo } from "react";
import type { Group } from "three";
import { SWISS_RED, swissCrossTexture } from "./swiss-cross";

const BRASS = "#c8a02a";
const LEATHER = "#6b3f22";

/** A red alpine hat with the white cross on its crown. Sits on the head, tilted back to show the face. */
export function Hat() {
  const cross = useMemo(swissCrossTexture, []);
  return (
    <group position={[0, 0.5, -0.02]} rotation={[-0.18, 0, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.06, 48]} />
        <meshStandardMaterial color={SWISS_RED} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.38, 0.5, 0.56, 48]} />
        <meshStandardMaterial color={SWISS_RED} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.3, 0.452]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshStandardMaterial map={cross} roughness={0.8} />
      </mesh>
      {/* A small white feather, because every Swiss hat needs one. */}
      <mesh position={[0.36, 0.55, -0.05]} rotation={[0.2, 0, -0.9]} scale={[0.07, 0.34, 0.03]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** A red scarf around the neck, with an end that hangs down the chest. */
export function Scarf() {
  const cross = useMemo(swissCrossTexture, []);
  return (
    <group position={[0, 0.86, 0.5]} rotation={[0.3, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.15, 20, 48]} />
        <meshStandardMaterial color={SWISS_RED} roughness={0.9} />
      </mesh>
      <mesh position={[0.2, -0.38, 0.42]} rotation={[-0.25, 0, 0.12]}>
        <boxGeometry args={[0.3, 0.55, 0.06]} />
        <meshStandardMaterial map={cross} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** A cowbell on a leather strap. The group swings from its top; the caller turns it. */
export const Cowbell = forwardRef<Group>(function Cowbell(_props, ref) {
  return (
    <group position={[0, 0.62, 0.78]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.34]}>
        <torusGeometry args={[0.56, 0.035, 12, 48]} />
        <meshStandardMaterial color={LEATHER} roughness={0.8} />
      </mesh>
      <group ref={ref}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.24, 0.34, 24]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.32} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.07, 16, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.32} />
        </mesh>
      </group>
    </group>
  );
});
