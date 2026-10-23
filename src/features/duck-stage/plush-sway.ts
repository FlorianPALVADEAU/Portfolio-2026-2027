import type { Material, Vector2 } from "three";

export type Sway = { value: Vector2 };

/**
 * Makes a stuffed toy feel stuffed. The model is one rigid mesh with no skeleton, so the vertex
 * shader bends it instead: the higher a point sits on the toy (its local `z`), the further it
 * follows `uSway`, which the animation pushes when the pointer moves and lets spring back. The
 * head swings and the feet stay planted, like fabric over stuffing.
 */
export function addPlushSway(material: Material, sway: Sway, base: number, top: number): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSway = sway;
    shader.uniforms.uBase = { value: base };
    shader.uniforms.uTop = { value: top };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec2 uSway;\nuniform float uBase;\nuniform float uTop;",
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float lift = smoothstep(uBase, uTop, position.z);
        transformed.xy += uSway * lift * lift;`,
      );
  };
  material.customProgramCacheKey = () => "plush-sway";
}
