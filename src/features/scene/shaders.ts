export const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform float uOffsets[5];

  attribute vec3 aShape0;
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute vec3 aShape3;
  attribute vec3 aShape4;
  attribute float aSeed;

  varying float vDepth;
  varying float vSeed;

  vec3 shapeAt(int index) {
    if (index == 0) return aShape0 + vec3(uOffsets[0], 0.0, 0.0);
    if (index == 1) return aShape1 + vec3(uOffsets[1], 0.0, 0.0);
    if (index == 2) return aShape2 + vec3(uOffsets[2], 0.0, 0.0);
    if (index == 3) return aShape3 + vec3(uOffsets[3], 0.0, 0.0);
    return aShape4 + vec3(uOffsets[4], 0.0, 0.0);
  }

  void main() {
    float stage = clamp(uProgress, 0.0, 4.0);
    int from = int(floor(min(stage, 3.999)));
    float mixing = smoothstep(0.0, 1.0, stage - float(from));
    // Each point leaves a little earlier or later so the morph ripples instead of snapping.
    mixing = smoothstep(0.0, 1.0, clamp(mixing * 1.6 - aSeed * 0.6, 0.0, 1.0));

    vec3 position3 = mix(shapeAt(from), shapeAt(from + 1), mixing);

    float drift = uTime * 0.35 + aSeed * 6.2831;
    position3 += vec3(sin(drift), cos(drift * 1.3), sin(drift * 0.7)) * 0.05;

    vec4 viewPosition = modelViewMatrix * vec4(position3, 1.0);

    // Pointer repulsion in view space, strongest for points near the cursor.
    vec2 toPointer = viewPosition.xy - uPointer * vec2(4.5, 3.0);
    float push = smoothstep(1.6, 0.0, length(toPointer));
    viewPosition.xy += normalize(toPointer + 0.0001) * push * 0.55;

    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * uPixelRatio * (1.0 + push * 1.2) * (6.0 / -viewPosition.z);
    vDepth = clamp((-viewPosition.z - 4.0) / 8.0, 0.0, 1.0);
    vSeed = aSeed;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vDepth;
  varying float vSeed;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.15, distanceToCenter);
    float alpha = disc * uOpacity * mix(1.0, 0.25, vDepth) * (0.6 + 0.4 * vSeed);
    gl_FragColor = vec4(uColor, alpha);
  }
`;
