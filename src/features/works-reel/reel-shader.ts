/**
 * The plane is bent toward the camera by its distance from the middle of the viewport, like the
 * inside of a tube cut in half: flat in the centre, rising on both sides. World units are pixels.
 */
export const vertexShader = /* glsl */ `
  uniform float uDepth;
  uniform float uHalfHeight;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    float distanceFromMiddle = world.y / uHalfHeight;
    world.z += uDepth * distanceFromMiddle * distanceFromMiddle;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/** Cover-fit picture with a zoom, clipped to a rounded rectangle with a soft edge. */
export const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uRatio;
  uniform vec2 uSize;
  uniform float uZoom;
  uniform float uRadius;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * uRatio / uZoom + 0.5;
    vec4 color = texture2D(uMap, uv);

    vec2 corner = abs((vUv - 0.5) * uSize) - (uSize * 0.5 - uRadius);
    float edge = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - uRadius;
    float coverage = 1.0 - smoothstep(-1.0, 0.5, edge);

    gl_FragColor = vec4(color.rgb, color.a * coverage);
    #include <colorspace_fragment>
  }
`;
