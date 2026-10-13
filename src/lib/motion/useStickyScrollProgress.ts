import { useEffect, useRef, useState } from "react";

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
  runwayRef: React.RefObject<HTMLElement>,
  manualProgress: number | null,
  smoothing = 0.12
) {
  const progress = useRef(0);
  const manual = useRef(manualProgress);
  manual.current = manualProgress;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const target = manual.current ?? readRunwayProgress(runwayRef.current);
      const diff = target - progress.current;
      progress.current = Math.abs(diff) < 0.0005 ? target : progress.current + diff * smoothing;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [runwayRef, smoothing]);

  return progress;
}

/** Same as `useScrollProgressRef` but as React state, for designs that render from progress directly. */
export function useStickyScrollProgress(
  runwayRef: React.RefObject<HTMLElement>,
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
