import { useMemo } from "react";
import { bowTieTexture } from "./textures";

/** A bow tie in a loud fish-and-dots print, made of two wings and a knot. */
export function BowTie() {
  const print = useMemo(bowTieTexture, []);
  return (
    <group>
      {[1, -1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.19, 0, 0]}
          rotation={[0, 0, (side * Math.PI) / 2]}
          scale={[1, 1, 0.45]}
        >
          <coneGeometry args={[0.2, 0.34, 3]} />
          <meshStandardMaterial map={print} roughness={0.85} flatShading side={2} />
        </mesh>
      ))}
      <mesh scale={[1, 1, 0.8]}>
        <boxGeometry args={[0.1, 0.13, 0.1]} />
        <meshStandardMaterial map={print} roughness={0.85} />
      </mesh>
    </group>
  );
}
