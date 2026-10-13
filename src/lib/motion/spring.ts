export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/** Damped harmonic spring integrated with semi-implicit Euler; stable for dt up to ~1/30s. */
export class Spring {
  value: number;
  target: number;
  velocity = 0;
  stiffness: number;
  damping: number;
  mass: number;

  constructor(value = 0, { stiffness = 170, damping = 18, mass = 1 }: SpringConfig = {}) {
    this.value = value;
    this.target = value;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
  }

  step(dt: number) {
    const h = Math.min(dt, 1 / 30);
    const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
    this.velocity += (force / this.mass) * h;
    this.value += this.velocity * h;
    return this.value;
  }

  impulse(v: number) {
    this.velocity += v;
  }

  snap(v: number) {
    this.value = v;
    this.target = v;
    this.velocity = 0;
  }

  get resting() {
    return Math.abs(this.velocity) < 0.001 && Math.abs(this.value - this.target) < 0.001;
  }
}
