/**
 * The plane is bent toward the camera by its distance from the middle of the viewport, like the
 * inside of a tube cut in half: flat in the centre, rising on both sides. World units are pixels.
 * `uCup` adds a bowl on top, for the transition to a project page.
 */
export const vertexShader = /* glsl */ `
  uniform float uDepth;
  uniform float uHalfHeight;
  uniform float uCup;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    float distanceFromMiddle = world.y / uHalfHeight;
    world.z += uDepth * distanceFromMiddle * distanceFromMiddle;
    // A bowl around the middle of the screen: the centre stays put and the edges come forward.
    float fromCentre = length(world.xy) / uHalfHeight;
    world.z += uCup * fromCentre * fromCentre;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * Cover-fit picture with a zoom, clipped to a rounded rectangle with a soft edge. A focus pull
 * blurs each row of the picture by its distance from the focal line `uFocus`, like depth of field;
 * `uShutter` dips the exposure for a frame and `uShake` slides the picture like an unsteady hand.
 * With a depth map, `uLook` moves the point of view: each pixel slides by its depth, so near
 * parts travel further than far ones. `uParallax` is the largest slide, 0 turns the effect off.
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
  uniform sampler2D uDepthMap;
  uniform vec2 uLook;
  uniform float uParallax;
  uniform vec3 uTint;
  uniform float uTintMix;
  varying vec2 vUv;

  const int TAPS = 24;
  const float MAX_BLUR = 0.009;
  const float GOLDEN_ANGLE = 2.39996323;
  const int DEPTH_PASSES = 4;
  // Growth of each tap's footprint at full defocus: a tap then covers the gap to its neighbours, so
  // bright edges blur smoothly instead of leaving a ring of separate, line-like copies.
  const float TAP_SOFTNESS = 3.0;

  vec2 pictureUv(vec2 surface) {
    return (surface - 0.5) * uRatio / uZoom + 0.5 + uShake;
  }

  // Each pass samples the depth where the previous one landed. A few passes settle on the pixel
  // that really faces the viewer, which keeps edges from smearing at this small amplitude.
  vec2 parallaxShift(vec2 base) {
    vec2 uv = base;
    for (int i = 0; i < DEPTH_PASSES; i++) {
      uv = base + uLook * uParallax * (texture2D(uDepthMap, uv).r - 0.5);
    }
    return uv - base;
  }

  void main() {
    vec2 shift = uParallax > 0.0 ? parallaxShift(pictureUv(vUv)) : vec2(0.0);
    float defocus = uBlur * smoothstep(0.0, 0.6, abs(vUv.y - uFocus));
    vec4 color = texture2D(uMap, pictureUv(vUv) + shift);

    // Taken outside the branch below: derivatives read inside it are undefined along its edge, where
    // they picked a wrong mip level and drew a thin line at each border of the in-focus band.
    vec2 gradX = dFdx(pictureUv(vUv));
    vec2 gradY = dFdy(pictureUv(vUv));

    if (defocus > 0.002) {
      float soften = 1.0 + TAP_SOFTNESS * defocus;
      // Vogel disc: even taps, softened by a mip bias so they merge.
      vec2 spread = vec2(1.0, uSize.x / uSize.y) * MAX_BLUR * defocus;
      vec4 sum = color;
      for (int i = 0; i < TAPS; i++) {
        float angle = float(i) * GOLDEN_ANGLE;
        float reach = sqrt((float(i) + 0.5) / float(TAPS));
        vec2 tap = pictureUv(vUv + vec2(cos(angle), sin(angle)) * reach * spread) + shift;
        sum += textureGrad(uMap, tap, gradX * soften, gradY * soften);
      }
      color = sum / float(TAPS + 1);
    }
    color.rgb *= 1.0 - 0.22 * uShutter;
    color.rgb = mix(color.rgb, uTint, uTintMix);

    vec2 corner = abs((vUv - 0.5) * uSize) - (uSize * 0.5 - uRadius);
    float edge = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - uRadius;
    float coverage = 1.0 - smoothstep(-1.0, 0.5, edge);

    gl_FragColor = vec4(color.rgb, color.a * coverage);
    #include <colorspace_fragment>
  }
`;
