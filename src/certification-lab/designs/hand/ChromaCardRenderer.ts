import { invert3, squareToQuad, type Quad } from "./homography";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrame;
uniform sampler2D uCert;
uniform mat3 uInvH;
uniform vec2 uImg;
uniform float uHasCert;
uniform float uCardAspect;
uniform float uCertAspect;
uniform float uGreenRef;
const vec3 CREAM = vec3(0.984, 0.973, 0.961);

void main() {
  vec4 f = texture2D(uFrame, vUv);
  float k = smoothstep(0.03, 0.22, f.g - max(f.r, f.b));
  vec3 base = f.rgb;
  base.g = min(base.g, min(max(base.r, base.b), base.r * 0.75 + base.b * 0.25 + 0.02));
  if (k <= 0.0) {
    gl_FragColor = vec4(base, 1.0);
    return;
  }

  vec3 p = uInvH * vec3(vUv * uImg, 1.0);
  vec2 uv = p.xy / p.z;
  vec3 face = CREAM;

  if (uHasCert > 0.5) {
    float pad = 0.07;
    vec2 avail = vec2(uCardAspect - 2.0 * pad, 1.0 - 2.0 * pad);
    vec2 size = avail.x / avail.y > uCertAspect
      ? vec2(uCertAspect * avail.y, avail.y)
      : vec2(avail.x, avail.x / uCertAspect);
    vec2 sizeUv = vec2(size.x / uCardAspect, size.y);
    vec2 origin = (1.0 - sizeUv) * 0.5;
    vec2 cuv = (uv - origin) / sizeUv;
    if (cuv.x >= 0.0 && cuv.x <= 1.0 && cuv.y >= 0.0 && cuv.y <= 1.0) {
      face = texture2D(uCert, cuv).rgb;
    }
    float edge = min(min(uv.x, 1.0 - uv.x) * uCardAspect, min(uv.y, 1.0 - uv.y));
    face *= mix(0.94, 1.0, smoothstep(0.0, 0.035, edge));
  }

  float shade = clamp(f.g / uGreenRef, 0.86, 1.08);
  gl_FragColor = vec4(mix(base, face * shade, k), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

function makeTexture(gl: WebGLRenderingContext) {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return t;
}

/**
 * Draws a video/still frame and replaces its chroma-green card face with a certificate warped by
 * the card's homography. Anything covering the green (the thumb) stays on top automatically.
 */
export class ChromaCardRenderer {
  private gl: WebGLRenderingContext;
  private frameTex: WebGLTexture;
  private certTex: WebGLTexture;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private currentFrame: TexImageSource | null = null;
  private currentCert: TexImageSource | null | undefined = undefined;
  greenRef = 0.85;

  constructor(private canvas: HTMLCanvasElement, width: number, height: number) {
    canvas.width = width;
    canvas.height = height;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
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

    for (const name of ["uFrame", "uCert", "uInvH", "uImg", "uHasCert", "uCardAspect", "uCertAspect", "uGreenRef"]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    this.frameTex = makeTexture(gl);
    this.certTex = makeTexture(gl);
    gl.uniform1i(this.u.uFrame, 0);
    gl.uniform1i(this.u.uCert, 1);
    gl.uniform2f(this.u.uImg, width, height);
    gl.viewport(0, 0, width, height);
  }

  setFrame(img: TexImageSource) {
    if (img === this.currentFrame) return;
    this.currentFrame = img;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.frameTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  }

  setCert(img: (TexImageSource & { width: number; height: number }) | null) {
    if (img === this.currentCert) return;
    this.currentCert = img;
    const gl = this.gl;
    gl.uniform1f(this.u.uHasCert, img ? 1 : 0);
    if (!img) return;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.certTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.uniform1f(this.u.uCertAspect, img.width / img.height);
  }

  setQuad(q: Quad) {
    const inv = invert3(squareToQuad(q));
    // GLSL mat3 is column-major.
    this.gl.uniformMatrix3fv(this.u.uInvH, false, [inv[0], inv[3], inv[6], inv[1], inv[4], inv[7], inv[2], inv[5], inv[8]]);
    const w = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
    const h = Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]);
    this.gl.uniform1f(this.u.uCardAspect, w / h);
  }

  draw() {
    const gl = this.gl;
    gl.uniform1f(this.u.uGreenRef, this.greenRef);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.frameTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.certTex);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose() {
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.canvas.width = 1;
  }
}

/** Downscales a certificate image into a canvas so the shader samples it without heavy aliasing. */
export function prepareCertTexture(img: HTMLImageElement, maxWidth = 640) {
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const c = document.createElement("canvas");
  c.width = Math.round(img.naturalWidth * scale);
  c.height = Math.round(img.naturalHeight * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c;
}
