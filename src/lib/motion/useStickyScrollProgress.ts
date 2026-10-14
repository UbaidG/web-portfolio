import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from "react";
import { clamp01, easeInOutCubic } from "./easing";

interface ProgressTransition {
  from: number;
  to: number;
  startedAt: number;
  duration: number;
}

export interface ScrollProgressRef extends MutableRefObject<number> {
  snapTo(value: number): void;
  transitionTo(value: number, duration?: number): void;
  cancelTransition(): void;
}

/** Raw 0..1 progress of a tall runway scrolled past its sticky 100vh stage. */
export function readRunwayProgress(el: HTMLElement | null) {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, -rect.top / total));
}

/**
 * Smoothed scroll progress kept in a ref (no re-renders). Designs with their own frame loop read
 * `ref.current` each frame. `manualProgress` (the lab scrub slider) overrides page scroll.
 */
export function useScrollProgressRef(
  runwayRef: RefObject<HTMLElement>,
  manualProgress: number | null,
  smoothing = 0.12
): ScrollProgressRef {
  const progress = useRef(0);
  const manual = useRef(manualProgress);
  const transition = useRef<ProgressTransition | null>(null);
  const api = useRef<ScrollProgressRef | null>(null);
  manual.current = manualProgress;

  if (!api.current) {
    const controls = progress as ScrollProgressRef;
    controls.snapTo = (value: number) => {
      progress.current = clamp01(value);
      transition.current = null;
    };
    controls.transitionTo = (value: number, duration = 560) => {
      const target = clamp01(value);
      if (duration <= 0 || Math.abs(target - progress.current) < 0.0005) {
        controls.snapTo(target);
        return;
      }
      transition.current = {
        from: progress.current,
        to: target,
        startedAt: performance.now(),
        duration,
      };
    };
    controls.cancelTransition = () => {
      transition.current = null;
    };
    api.current = controls;
  }

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const activeTransition = transition.current;
      if (activeTransition) {
        const elapsed = performance.now() - activeTransition.startedAt;
        const t = clamp01(elapsed / activeTransition.duration);
        progress.current =
          activeTransition.from +
          (activeTransition.to - activeTransition.from) * easeInOutCubic(t);
        if (t >= 1) transition.current = null;
      } else {
        const target = manual.current ?? readRunwayProgress(runwayRef.current);
        const diff = target - progress.current;
        progress.current = Math.abs(diff) < 0.0005 ? target : progress.current + diff * smoothing;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [runwayRef, smoothing]);

  return api.current;
}

/** Same as `useScrollProgressRef` but as React state, for designs that render from progress directly. */
export function useStickyScrollProgress(
  runwayRef: RefObject<HTMLElement>,
  manualProgress: number | null,
  smoothing = 0.12
) {
  const ref = useScrollProgressRef(runwayRef, manualProgress, smoothing);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      if (Math.abs(ref.current - last) > 0.0002) {
        last = ref.current;
        setProgress(ref.current);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ref]);

  return progress;
}
