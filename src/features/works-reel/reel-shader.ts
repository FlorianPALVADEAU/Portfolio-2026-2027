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

/**
 * Cover-fit picture with a zoom, clipped to a rounded rectangle with a soft edge. A focus pull
 * blurs each row of the picture by its distance from the focal line `uFocus`, like depth of field;
 * `uShutter` dips the exposure for a frame and `uShake` slides the picture like an unsteady hand.
 */
export const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uRatio;
  uniform vec2 uSize;
  uniform float uZoom;
  uniform float uRadius;
  uniform float uBlur;
  uniform float uFocus;
  uniform float uShutter;
  uniform vec2 uShake;
  varying vec2 vUv;

  const int TAPS = 24;
  const float MAX_BLUR = 0.009;
  const float GOLDEN_ANGLE = 2.39996323;

  vec2 pictureUv(vec2 surface) {
    return (surface - 0.5) * uRatio / uZoom + 0.5 + uShake;
  }

  void main() {
    float defocus = uBlur * smoothstep(0.0, 0.6, abs(vUv.y - uFocus));
    vec4 color = texture2D(uMap, pictureUv(vUv));

    if (defocus > 0.002) {
      // Vogel disc: even taps, no visible banding at this radius.
      vec2 spread = vec2(1.0, uSize.x / uSize.y) * MAX_BLUR * defocus;
      vec4 sum = color;
      for (int i = 0; i < TAPS; i++) {
        float angle = float(i) * GOLDEN_ANGLE;
        float reach = sqrt((float(i) + 0.5) / float(TAPS));
        sum += texture2D(uMap, pictureUv(vUv + vec2(cos(angle), sin(angle)) * reach * spread));
      }
      color = sum / float(TAPS + 1);
    }
    color.rgb *= 1.0 - 0.22 * uShutter;

    vec2 corner = abs((vUv - 0.5) * uSize) - (uSize * 0.5 - uRadius);
    float edge = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - uRadius;
    float coverage = 1.0 - smoothstep(-1.0, 0.5, edge);

    gl_FragColor = vec4(color.rgb, color.a * coverage);
    #include <colorspace_fragment>
  }
`;
