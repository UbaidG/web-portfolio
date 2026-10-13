export interface RopePoint {
  x: number;
  y: number;
  px: number;
  py: number;
  pinned: boolean;
}

/** Verlet rope/chain with fixed segment length; used for receipt paper and drying lines. */
export class Rope {
  points: RopePoint[];
  segment: number;
  gravity: number;
  friction: number;
  iterations: number;

  constructor(
    coords: { x: number; y: number; pinned?: boolean }[],
    { gravity = 900, friction = 0.985, iterations = 8 } = {}
  ) {
    this.points = coords.map((c) => ({ x: c.x, y: c.y, px: c.x, py: c.y, pinned: !!c.pinned }));
    this.segment = coords.length > 1 ? Math.hypot(coords[1].x - coords[0].x, coords[1].y - coords[0].y) : 0;
    this.gravity = gravity;
    this.friction = friction;
    this.iterations = iterations;
  }

  step(dt: number) {
    const h = Math.min(dt, 1 / 30);
    for (const p of this.points) {
      if (p.pinned) continue;
      const vx = (p.x - p.px) * this.friction;
      const vy = (p.y - p.py) * this.friction;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + this.gravity * h * h;
    }
    for (let k = 0; k < this.iterations; k++) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const a = this.points[i];
        const b = this.points[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.0001;
        const diff = (d - this.segment) / d;
        if (a.pinned && b.pinned) continue;
        if (a.pinned) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else if (b.pinned) {
          a.x += dx * diff;
          a.y += dy * diff;
        } else {
          a.x += dx * diff * 0.5;
          a.y += dy * diff * 0.5;
          b.x -= dx * diff * 0.5;
          b.y -= dy * diff * 0.5;
        }
      }
    }
  }

  /** Pushes points within `radius` of (x, y) along the pointer's velocity. */
  disturb(x: number, y: number, vx: number, vy: number, radius: number, strength = 0.012) {
    for (const p of this.points) {
      if (p.pinned) continue;
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < radius) {
        const f = (1 - d / radius) * strength;
        p.px -= vx * f;
        p.py -= vy * f;
      }
    }
  }
}
