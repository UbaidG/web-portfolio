const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const RIPPLES = 10;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uCert;
uniform float uDev;
uniform float uShow;
uniform float uTime;
uniform float uAspect;
uniform vec4 uRect;
uniform vec4 uRip[${RIPPLES}];

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  vec2 disp = vec2(0.0);
  float spec = 0.0;
  for (int i = 0; i < ${RIPPLES}; i++) {
    vec4 r = uRip[i];
    float age = uTime - r.z;
    if (r.w <= 0.0 || age < 0.0 || age > 5.0) continue;
    vec2 d = (uv - r.xy) * vec2(uAspect, 1.0);
    float dist = length(d);
    float front = age * 0.32;
    float env = exp(-abs(dist - front) * 16.0) * exp(-age * 1.1) * r.w;
    float w = sin((dist - front) * 75.0) * env;
    disp += (d / (dist + 1e-4)) * w * 0.007;
    spec += max(w, 0.0);
  }
  disp += vec2(sin(uv.y * 9.0 + uTime * 1.3), cos(uv.x * 7.0 + uTime * 1.1)) * 0.0012;
  vec2 suv = uv + disp;

  vec3 rgb = vec3(0.0);
  float a = 0.0;
  vec2 puv = (suv - uRect.xy) / (uRect.zw - uRect.xy);
  if (uShow > 0.0 && puv.x > 0.0 && puv.x < 1.0 && puv.y > 0.0 && puv.y < 1.0) {
    vec3 cert = texture2D(uCert, puv).rgb;
    float lum = dot(cert, vec3(0.299, 0.587, 0.114));
    float n = noise(puv * vec2(16.0, 12.0)) * 0.6 + noise(puv * 70.0) * 0.4;
    float th = uDev * 1.45 - lum * 0.9 - n * 0.3 + 0.05;
    float k = smoothstep(0.0, 0.35, th);
    vec3 paper = vec3(0.96, 0.94, 0.9);
    vec3 c = mix(paper, cert, k);
    float edge = min(min(puv.x, 1.0 - puv.x), min(puv.y, 1.0 - puv.y));
    c *= mix(0.86, 1.0, smoothstep(0.0, 0.03, edge));
    rgb = c * vec3(1.0, 0.7, 0.5) * 0.92;
    a = uShow;
  }

  float hl = clamp(spec * 1.4, 0.0, 1.0) * 0.4;
  rgb = rgb * a + vec3(1.0, 0.78, 0.55) * hl;
  a = max(a, hl);
  gl_FragColor = vec4(rgb, a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

/** Renders a print developing in a tray of liquid, with ripples that bend the image. */
export class DevelopRenderer {
  private gl: WebGLRenderingContext;
  private tex: WebGLTexture;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private ripples = new Float32Array(RIPPLES * 4);
  private nextRipple = 0;
  private cert: TexImageSource | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const n of ["uCert", "uDev", "uShow", "uTime", "uAspect", "uRect", "uRip"]) this.u[n] = gl.getUniformLocation(prog, n);
    this.tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(this.u.uCert, 0);
  }

  resize(w: number, h: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.u.uAspect, w / h);
  }

  /** Print rectangle in canvas uv (top-left origin). */
  setRect(x0: number, y0: number, x1: number, y1: number) {
    this.gl.uniform4f(this.u.uRect, x0, y0, x1, y1);
  }

  setCert(img: TexImageSource | null) {
    if (img === this.cert) return;
    this.cert = img;
    if (!img) return;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  }

  ripple(u: number, v: number, time: number, strength: number) {
    const i = this.nextRipple * 4;
    this.ripples[i] = u;
    this.ripples[i + 1] = v;
    this.ripples[i + 2] = time;
    this.ripples[i + 3] = strength;
    this.nextRipple = (this.nextRipple + 1) % RIPPLES;
  }

  draw(time: number, dev: number, show: number) {
    const gl = this.gl;
    gl.uniform1f(this.u.uTime, time);
    gl.uniform1f(this.u.uDev, dev);
    gl.uniform1f(this.u.uShow, this.cert ? show : 0);
    gl.uniform4fv(this.u.uRip, this.ripples);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose() {
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.canvas.width = 1;
  }
}
