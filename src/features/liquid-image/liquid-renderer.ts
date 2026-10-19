export type LiquidRenderer = {
  /** Moves the ripple to a point of the picture, in 0..1 with the origin at the bottom left. */
  pointTo: (u: number, v: number) => void;
  /** Starts or stops the ripple; it eases in and out. */
  hover: (on: boolean) => void;
  resize: () => void;
  destroy: () => void;
};

const vertexShader = /* glsl */ `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

/**
 * Draws the picture the way `object-fit: cover; object-position: top` would, with a soft ripple
 * around the pointer: a gentle lens that magnifies the picture and a wave that travels out of it.
 */
const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform sampler2D uMap;
  uniform vec2 uVisible;
  uniform vec2 uOffset;
  uniform vec2 uPointer;
  uniform float uStrength;
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 delta = vUv - uPointer;
    delta.x *= uAspect;
    float distance = length(delta);
    vec2 direction = delta / (distance + 0.06);

    float lens = exp(-distance * distance * 14.0) * uStrength;
    float wave = sin(distance * 28.0 - uTime * 4.0) * 0.01 * exp(-distance * 3.0) * uStrength;
    vec2 shift = delta * 0.28 * lens + direction * wave;
    shift.x /= uAspect;

    gl_FragColor = texture2D(uMap, (vUv - shift) * uVisible + uOffset);
  }
`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

/** Returns null when WebGL is missing or the shaders do not build, so the picture stays static. */
export function createLiquidRenderer(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
): LiquidRenderer | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  if (!(vertex && fragment && program)) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram is not a React hook
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const locations = {
    visible: uniform("uVisible"),
    offset: uniform("uOffset"),
    pointer: uniform("uPointer"),
    strength: uniform("uStrength"),
    time: uniform("uTime"),
    aspect: uniform("uAspect"),
  };

  const state = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, strength: 0, target: 0, time: 0 };
  let frame = 0;

  function draw() {
    gl?.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function tick() {
    state.strength += (state.target - state.strength) * 0.08;
    state.x += (state.targetX - state.x) * 0.15;
    state.y += (state.targetY - state.y) * 0.15;
    state.time += 1 / 60;
    gl?.uniform2f(locations.pointer, state.x, state.y);
    gl?.uniform1f(locations.strength, state.strength);
    gl?.uniform1f(locations.time, state.time);
    draw();
    const settled = state.target === 0 && state.strength < 0.002;
    frame = settled ? 0 : requestAnimationFrame(tick);
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    gl?.viewport(0, 0, canvas.width, canvas.height);

    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const visibleX = canvasAspect > imageAspect ? 1 : canvasAspect / imageAspect;
    const visibleY = canvasAspect > imageAspect ? imageAspect / canvasAspect : 1;
    gl?.uniform2f(locations.visible, visibleX, visibleY);
    gl?.uniform2f(locations.offset, (1 - visibleX) / 2, 1 - visibleY);
    gl?.uniform1f(locations.aspect, canvasAspect);
    draw();
  }

  resize();

  return {
    pointTo(u, v) {
      state.targetX = u;
      state.targetY = v;
    },
    hover(on) {
      state.target = on ? 1 : 0;
      if (!frame) frame = requestAnimationFrame(tick);
    },
    resize,
    // The context is kept: the canvas may be given a new renderer, as React does in development.
    destroy() {
      cancelAnimationFrame(frame);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
