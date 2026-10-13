import { useEffect, useRef } from "react";

/** Runs `cb(dt, time)` every animation frame; the latest callback is always used without re-subscribing. */
export function useFrame(cb: (dt: number, time: number) => void) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      cbRef.current(dt, now / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}
