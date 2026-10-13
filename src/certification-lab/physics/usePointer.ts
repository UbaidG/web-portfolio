import { useEffect, useRef } from "react";

export interface PointerState {
  /** Position in px relative to the element's top-left. */
  x: number;
  y: number;
  /** Position normalised to -1..1 from the element's centre. */
  nx: number;
  ny: number;
  /** Velocity in px/s, smoothed. */
  vx: number;
  vy: number;
  inside: boolean;
  down: boolean;
  width: number;
  height: number;
}

/** Tracks the pointer relative to `ref` without causing re-renders; read `.current` inside a frame loop. */
export function usePointer(ref: React.RefObject<HTMLElement>) {
  const state = useRef<PointerState>({
    x: -9999,
    y: -9999,
    nx: 0,
    ny: 0,
    vx: 0,
    vy: 0,
    inside: false,
    down: false,
    width: 1,
    height: 1,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastT = performance.now();
    let lastX = 0;
    let lastY = 0;

    const update = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const s = state.current;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = performance.now();
      const dt = Math.max((now - lastT) / 1000, 1 / 240);
      s.vx = s.vx * 0.6 + ((x - lastX) / dt) * 0.4;
      s.vy = s.vy * 0.6 + ((y - lastY) / dt) * 0.4;
      lastT = now;
      lastX = x;
      lastY = y;
      s.x = x;
      s.y = y;
      s.width = r.width;
      s.height = r.height;
      s.nx = (x / r.width) * 2 - 1;
      s.ny = (y / r.height) * 2 - 1;
      s.inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    };
    const onDown = (e: PointerEvent) => {
      update(e);
      state.current.down = true;
    };
    const onUp = () => {
      state.current.down = false;
    };
    const onLeave = () => {
      state.current.inside = false;
    };
    const decay = window.setInterval(() => {
      state.current.vx *= 0.8;
      state.current.vy *= 0.8;
    }, 50);

    window.addEventListener("pointermove", update, { passive: true });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.clearInterval(decay);
      window.removeEventListener("pointermove", update);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);

  return state;
}
