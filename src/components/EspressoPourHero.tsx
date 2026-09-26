import React, { useRef, useEffect, useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { COFFEE_OVERFLOW_VIDEO_SPEC } from "../data/videoPromptSpec";

interface EspressoPourHeroProps {
  onOpenVideoSpec?: () => void;
}

export const EspressoPourHero: React.FC<EspressoPourHeroProps> = ({
  onOpenVideoSpec,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const frames = COFFEE_OVERFLOW_VIDEO_SPEC.keyframes;

  useEffect(() => {
    // Check if user has dropped in a custom video
    const testVideo = document.createElement("video");
    testVideo.src = `${import.meta.env.BASE_URL}designs/coffee-overflow.mp4`;
    testVideo.oncanplay = () => setHasVideo(true);
    testVideo.onerror = () => setHasVideo(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height - windowHeight;
      if (totalDist <= 0) return;

      const current = -rect.top;
      const progress = Math.min(Math.max(current / totalDist, 0), 1);
      setScrollProgress(progress);

      // If video exists, sync video scrubbing with scroll progress
      if (videoRef.current && videoRef.current.duration) {
        videoRef.current.currentTime = progress * videoRef.current.duration;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasVideo]);

  // Frame interpolation based on scroll progress across 4 keyframes:
  // 0.0 - 0.25: Frame 1 (Teapot Pour)
  // 0.25 - 0.50: Frame 2 (Filled to Brim)
  // 0.50 - 0.75: Frame 3 (Overflow Begins)
  // 0.75 - 1.00: Frame 4 (Pan Down & White Stone Cascade)
  const currentFrameIdx = Math.min(Math.floor(scrollProgress * 4), 3);

  // Pan down motion effect: Camera translates down only in phases 3 and 4
  const panDownTranslateY = scrollProgress > 0.55
    ? (scrollProgress - 0.55) * 120
    : 0;

  // Text manifesto reveal when coffee reaches bottom of white stone
  const textRevealOpacity = Math.min(Math.max((scrollProgress - 0.55) / 0.35, 0), 1);
  const textTranslateY = (1 - textRevealOpacity) * 30;

  return (
    <section className="espresso-pour-hero white-stone-theme" ref={containerRef}>
      <div className="espresso-pour-sticky">
        {/* Soft high-key morning daylight ambient glow */}
        <div
          className="espresso-ambient-glow white-glow"
          style={{
            opacity: 0.85,
            transform: `scale(${1 + scrollProgress * 0.15})`,
          }}
        />

        {/* Initial Hero Headline (Fades out gently as you scroll) */}
        <div
          className="espresso-hero-initial-copy white-stone-copy"
          style={{
            opacity: Math.max(1 - scrollProgress * 2.2, 0),
            transform: `translateY(${-scrollProgress * 60}px)`,
            pointerEvents: scrollProgress > 0.35 ? "none" : "auto",
          }}
        >
          <div className="espresso-hero-badge white-stone-badge">
            <span className="badge-pulse amber-pulse" />
            <span>Machine Learning Engineer · Single-Origin AI</span>
          </div>

          <h1 className="espresso-hero-title dark-text">
            Precision extraction.
            <br />
            <em>Dependable intelligence.</em>
          </h1>

          <p className="espresso-hero-sub dark-sub">
            {portfolioData.personal.shortBio}
          </p>

          <div className="espresso-hero-buttons">
            <a className="espresso-btn-primary" href={`mailto:${portfolioData.personal.email}`}>
              Say hello <span aria-hidden="true">↗</span>
            </a>
            <a
              className="espresso-btn-secondary dark-secondary"
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Read Resume <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="espresso-scroll-cue dark-cue">
            <span>Scroll to watch teapot pour, brim fill & white stone cascade</span>
            <div className="scroll-needle white-needle">
              <span
                className="scroll-needle-pip amber-pip"
                style={{ transform: `translateY(${scrollProgress * 24}px)` }}
              />
            </div>
          </div>
        </div>

        {/* 4-Frame White Stone Visual Stage */}
        <div
          className="espresso-cup-stage white-stone-stage"
          style={{
            transform: `translate(-50%, calc(-50% - ${panDownTranslateY}px))`,
          }}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src={`${import.meta.env.BASE_URL}designs/coffee-overflow.mp4`}
              muted
              playsInline
              preload="auto"
              className="espresso-stage-video"
            />
          ) : (
            <div className="espresso-stage-composite white-composite">
              {/* Frame 1: Teapot Pour */}
              <img
                src={frames[0].imageUrl}
                alt="Teapot pouring coffee into white ceramic cup"
                className="espresso-frame-img"
                style={{
                  opacity: scrollProgress <= 0.25 ? 1 : Math.max(1 - (scrollProgress - 0.25) * 5, 0),
                }}
              />

              {/* Frame 2: Filled to Brim (Meniscus Dome) */}
              <img
                src={frames[1].imageUrl}
                alt="Coffee filled right to the brim of the cup"
                className="espresso-frame-img"
                style={{
                  opacity:
                    scrollProgress > 0.2 && scrollProgress <= 0.55
                      ? Math.min((scrollProgress - 0.2) * 5, 1) * Math.max(1 - (scrollProgress - 0.5) * 5, 0)
                      : 0,
                }}
              />

              {/* Frame 3: Overflow Begins onto White Stone */}
              <img
                src={frames[2].imageUrl}
                alt="Coffee overflowing cup rim onto white stone"
                className="espresso-frame-img"
                style={{
                  opacity:
                    scrollProgress > 0.48 && scrollProgress <= 0.75
                      ? Math.min((scrollProgress - 0.48) * 5, 1) * Math.max(1 - (scrollProgress - 0.7) * 5, 0)
                      : 0,
                }}
              />

              {/* Frame 4: Camera Pan Down & Cascading down Fluted White Stone */}
              <img
                src={frames[3].imageUrl}
                alt="Camera panned down tracking coffee cascading down white stone plinth into white floor"
                className="espresso-frame-img"
                style={{
                  opacity: scrollProgress > 0.68 ? Math.min((scrollProgress - 0.68) * 5, 1) : 0,
                }}
              />
            </div>
          )}

          {/* Phase Telemetry Tag */}
          <div className="espresso-telemetry-tag white-telemetry">
            <div className="telemetry-item">
              <span className="telemetry-label">PHASE</span>
              <span className="telemetry-val">0{currentFrameIdx + 1} // 04</span>
            </div>
            <div className="telemetry-sep" />
            <div className="telemetry-item">
              <span className="telemetry-label">CAMERA</span>
              <span className="telemetry-val">
                {scrollProgress > 0.55 ? "PANNING DOWN ▾" : "LOCKED AT EYE LEVEL"}
              </span>
            </div>
          </div>
        </div>

        {/* Revealed Manifesto Text & Proof Metrics Over White Stone Floor */}
        <div
          className="espresso-revealed-manifesto white-stone-manifesto"
          style={{
            opacity: textRevealOpacity,
            transform: `translate(-50%, calc(-50% + ${textTranslateY}px))`,
            pointerEvents: textRevealOpacity > 0.4 ? "auto" : "none",
          }}
        >
          <div className="manifesto-eyebrow dark-eyebrow">
            <span>EXTRACTION COMPLETE · STAGE 01</span>
            <span className="manifesto-bar dark-bar" />
          </div>

          <h2 className="manifesto-headline dark-headline">
            "From sparse data points to systems that hold their shape in production."
          </h2>

          <p className="manifesto-lead dark-lead">
            Like dialing in the perfect espresso grind, building reliable AI requires
            fine-grained telemetry, disciplined prompt graphs, and low-latency infrastructure.
          </p>

          {/* Proof Metrics Row */}
          <div className="manifesto-proof-metrics white-proof-metrics">
            {portfolioData.proofMetrics.map((metric) => (
              <div className="manifesto-metric-card white-metric-card" key={metric.label}>
                <span className="metric-number">{metric.value}</span>
                <span className="metric-tag dark-metric-tag">{metric.label}</span>
                <span className="metric-desc dark-metric-desc">{metric.context}</span>
              </div>
            ))}
          </div>

          {onOpenVideoSpec && (
            <button
              className="manifesto-spec-link dark-spec-link"
              onClick={onOpenVideoSpec}
            >
              <span>View 4-Frame White Stone Camera & Pan-Down Video Prompts →</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
