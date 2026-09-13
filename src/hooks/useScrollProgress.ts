import { RefObject, useEffect, useState } from "react";

export function useScrollProgress(
  targetRef: RefObject<HTMLElement>,
  enabled = true,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      return;
    }

    let frame = 0;
    let mounted = true;

    const measure = () => {
      frame = 0;
      if (!mounted || !targetRef.current) return;

      const element = targetRef.current;
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      const current = -element.getBoundingClientRect().top;
      const nextProgress = Math.max(0, Math.min(1, current / distance));

      setProgress((previous) =>
        Math.abs(previous - nextProgress) > 0.001 ? nextProgress : previous,
      );
    };

    const requestMeasure = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    requestMeasure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      mounted = false;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, [enabled, targetRef]);

  return progress;
}
