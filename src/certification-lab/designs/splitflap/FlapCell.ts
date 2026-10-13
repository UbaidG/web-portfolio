export const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&/-.:'·";
const N = CHARSET.length;
const indexOf = (c: string) => Math.max(0, CHARSET.indexOf(c));

/**
 * One split-flap character. Each step drops the upper flap (current glyph) to the hinge,
 * then swings the lower flap (next glyph) down into place, like a Solari board.
 */
export class FlapCell {
  readonly el: HTMLElement;
  private topStatic: HTMLElement;
  private bottomStatic: HTMLElement;
  private flapTop: HTMLElement;
  private flapBottom: HTMLElement;
  private flapTopGlyph: HTMLElement;
  private flapBottomGlyph: HTMLElement;

  current = " ";
  target = " ";
  private queue: string[] = [];
  private wait = 0;
  private t = 0;
  private stepping = false;
  private stepDur = 0.055;
  private to = " ";
  cooldown = 0;

  constructor(el: HTMLElement) {
    this.el = el;
    const [ht, hb, ft, fb] = Array.from(el.children) as HTMLElement[];
    this.topStatic = ht.firstElementChild as HTMLElement;
    this.bottomStatic = hb.firstElementChild as HTMLElement;
    this.flapTop = ft;
    this.flapBottom = fb;
    this.flapTopGlyph = ft.firstElementChild as HTMLElement;
    this.flapBottomGlyph = fb.firstElementChild as HTMLElement;
  }

  get busy() {
    return this.stepping || this.queue.length > 0;
  }

  /** Spins forward through the charset to `c`, starting after `delay` seconds. */
  setTarget(c: string, delay: number) {
    const ch = CHARSET.includes(c) ? c : " ";
    this.target = ch;
    const from = indexOf(this.queue.length ? this.queue[this.queue.length - 1] : this.stepping ? this.to : this.current);
    const to = indexOf(ch);
    const dist = (to - from + N) % N;
    if (dist === 0) return;
    const len = Math.min(dist, 7 + Math.floor(Math.random() * 6));
    const path: string[] = [];
    for (let k = len - 1; k >= 0; k--) path.push(CHARSET[(to - k + N) % N]);
    this.queue = path;
    this.wait = delay;
    this.stepDur = 0.045 + Math.random() * 0.025;
  }

  /** A short burst of random glyphs that lands back on the target, triggered by a fast cursor. */
  riffle(steps: number) {
    if (this.busy || this.cooldown > 0) return;
    const path: string[] = [];
    for (let i = 0; i < steps; i++) path.push(CHARSET[1 + Math.floor(Math.random() * 36)]);
    path.push(this.target);
    this.queue = path;
    this.wait = 0;
    this.stepDur = 0.04;
    this.cooldown = 0.5;
  }

  update(dt: number) {
    if (this.cooldown > 0) this.cooldown -= dt;
    if (!this.stepping) {
      if (!this.queue.length) return;
      if (this.wait > 0) {
        this.wait -= dt;
        return;
      }
      this.to = this.queue.shift()!;
      this.topStatic.textContent = this.to;
      this.flapTopGlyph.textContent = this.current;
      this.flapBottomGlyph.textContent = this.to;
      this.flapTop.style.visibility = "visible";
      this.flapBottom.style.visibility = "visible";
      this.t = 0;
      this.stepping = true;
    }

    this.t += dt / this.stepDur;
    if (this.t < 0.5) {
      this.flapTop.style.transform = `rotateX(${-180 * this.t}deg)`;
      this.flapBottom.style.transform = "rotateX(90deg)";
    } else {
      this.flapTop.style.transform = "rotateX(-90deg)";
      this.flapBottom.style.transform = `rotateX(${(1 - Math.min(1, this.t)) * 180}deg)`;
    }

    if (this.t >= 1) {
      this.current = this.to;
      this.bottomStatic.textContent = this.to;
      this.flapTop.style.visibility = "hidden";
      this.flapBottom.style.visibility = "hidden";
      this.stepping = false;
    }
  }
}
