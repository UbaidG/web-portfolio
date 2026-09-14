import { RefObject, useEffect } from "react";

export function useHorizontalScroll(
  sectionRef: RefObject<HTMLElement>,
  trackRef: RefObject<HTMLElement>,
  enabled = true,
): void {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !enabled) return;

    const mediaQuery = window.matchMedia(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let horizontalDistance = 0;

    const clearStyles = () => {
      section.style.height = "";
      section.style.removeProperty("--horizontal-distance");
      track.style.transform = "";
    };

    const applyProgress = () => {
      frame = 0;
      if (!mediaQuery.matches) return;

      const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const current = -section.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, current / scrollDistance));

      track.style.transform = `translate3d(${-horizontalDistance * progress}px, 0, 0)`;
      section.style.setProperty("--horizontal-progress", progress.toFixed(4));
    };

    const measure = () => {
      horizontalDistance = Math.max(0, track.scrollWidth - section.clientWidth);
      section.style.height = `${window.innerHeight + horizontalDistance}px`;
      section.style.setProperty("--horizontal-distance", `${horizontalDistance}px`);
      applyProgress();
    };

    const requestMeasure = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    const handleModeChange = () => {
      if (mediaQuery.matches) {
        requestMeasure();
      } else {
        clearStyles();
      }
    };

    window.addEventListener("scroll", applyProgress, { passive: true });
    window.addEventListener("resize", requestMeasure);
    if (mediaQuery.matches) requestMeasure();

    mediaQuery.addEventListener("change", handleModeChange);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", applyProgress);
      window.removeEventListener("resize", requestMeasure);
      mediaQuery.removeEventListener("change", handleModeChange);
      clearStyles();
    };
  }, [enabled, sectionRef, trackRef]);
}
