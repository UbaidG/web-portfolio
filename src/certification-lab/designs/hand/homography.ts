export type Vec2 = [number, number];
export type Quad = [Vec2, Vec2, Vec2, Vec2]; // TL, TR, BR, BL
/** Row-major 3x3 matrix. */
export type Mat3 = [number, number, number, number, number, number, number, number, number];

/** Homography mapping the unit square (0,0)-(1,1) onto `q`. */
export function squareToQuad(q: Quad): Mat3 {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (sx * dy2 - dx2 * sy) / den;
  const h = (dx1 * sy - sx * dy1) / den;
  return [x1 - x0 + g * x1, x3 - x0 + h * x3, x0, y1 - y0 + g * y1, y3 - y0 + h * y3, y0, g, h, 1];
}

export function invert3(m: Mat3): Mat3 {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const det = a * A + b * B + c * C || 1e-9;
  return [
    A / det,
    -(b * i - c * h) / det,
    (b * f - c * e) / det,
    B / det,
    (a * i - c * g) / det,
    -(a * f - c * d) / det,
    C / det,
    -(a * h - b * g) / det,
    (a * e - b * d) / det,
  ];
}

/** CSS matrix3d that maps an element of size w x h (transform-origin 0 0) onto quad `q`. */
export function quadToCssMatrix(q: Quad, w: number, h: number): string {
  const [a, b, c, d, e, f, g, hh, i] = squareToQuad(q);
  const A = a / w;
  const B = b / h;
  const D = d / w;
  const E = e / h;
  const G = g / w;
  const H = hh / h;
  return `matrix3d(${A},${D},0,${G},${B},${E},0,${H},0,0,1,0,${c},${f},0,${i})`;
}

export const lerpQuad = (a: Quad, b: Quad, t: number): Quad =>
  a.map((p, k) => [p[0] + (b[k][0] - p[0]) * t, p[1] + (b[k][1] - p[1]) * t]) as Quad;

export const quadCenter = (q: Quad): Vec2 => [
  (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4,
  (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4,
];

/** Axis-aligned rect of size w x h centred at (cx, cy), rotated by `rot` radians. */
export function rectQuad(cx: number, cy: number, w: number, h: number, rot: number): Quad {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const pts: Vec2[] = [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ];
  return pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]) as Quad;
}

export const transformQuad = (q: Quad, fn: (p: Vec2) => Vec2): Quad => q.map(fn) as Quad;

/** Rotates `q` about pivot `p` by `rot` radians and then translates by (tx, ty). */
export function rotateQuad(q: Quad, p: Vec2, rot: number, tx = 0, ty = 0): Quad {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return transformQuad(q, ([x, y]) => {
    const dx = x - p[0];
    const dy = y - p[1];
    return [p[0] + dx * c - dy * s + tx, p[1] + dx * s + dy * c + ty];
  });
}
