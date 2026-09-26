import React, { useRef, useEffect, useState } from "react";
import { portfolioData } from "../data/portfolioData";

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

  useEffect(() => {
    // Check if user has uploaded a custom video file
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

      // If video exists, sync video time to scroll progress
      if (videoRef.current && videoRef.current.duration) {
        videoRef.current.currentTime = progress * videoRef.current.duration;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasVideo]);

  // Calculate liquid fill and overflow dynamics based on scroll
  const cupScale = 1 + scrollProgress * 0.12;
  const overflowOpacity = Math.min(Math.max((scrollProgress - 0.25) / 0.45, 0), 1);
  const liquidCascadeHeight = Math.max((scrollProgress - 0.4) / 0.6, 0); // 0 to 1
  const textRevealOpacity = Math.min(Math.max((scrollProgress - 0.45) / 0.35, 0), 1);
  const textTranslateY = (1 - textRevealOpacity) * 40;

  return (
    <section className="espresso-pour-hero" ref={containerRef}>
      <div className="espresso-pour-sticky">
        {/* Ambient Warm Coffee Lighting */}
        <div
          className="espresso-ambient-glow"
          style={{
            opacity: 0.6 + scrollProgress * 0.4,
            transform: `scale(${1 + scrollProgress * 0.3})`,
          }}
        />

        {/* Hero Copy (Initial State) */}
        <div
          className="espresso-hero-initial-copy"
          style={{
            opacity: Math.max(1 - scrollProgress * 2.2, 0),
            transform: `translateY(${-scrollProgress * 80}px)`,
          }}
        >
          <div className="espresso-hero-badge">
            <span className="badge-pulse" />
            <span>Machine Learning Engineer · Real-Time Systems</span>
          </div>
          <h1 className="espresso-hero-title">
            Precision extraction.
            <br />
            <em>Dependable intelligence.</em>
          </h1>
          <p className="espresso-hero-sub">
            {portfolioData.personal.shortBio}
          </p>

          <div className="espresso-hero-buttons">
            <a className="espresso-btn-primary" href={`mailto:${portfolioData.personal.email}`}>
              Say hello <span aria-hidden="true">↗</span>
            </a>
            <a
              className="espresso-btn-secondary"
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Read Resume <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="espresso-scroll-cue">
            <span>Scroll to extract & overflow</span>
            <div className="scroll-needle">
              <span
                className="scroll-needle-pip"
                style={{ transform: `translateY(${scrollProgress * 24}px)` }}
              />
            </div>
          </div>
        </div>

        {/* Cup Centerpiece / Video Stage */}
        <div
          className="espresso-cup-stage"
          style={{
            transform: `translate(-50%, -50%) scale(${cupScale})`,
          }}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src="/designs/coffee-overflow.mp4"
              muted
              playsInline
              preload="auto"
              className="espresso-stage-video"
            />
          ) : (
            <div className="espresso-stage-composite">
              {/* Start Frame: 95% filled crema cup */}
              <img
                src={`${import.meta.env.BASE_URL}designs/espresso-start.jpg`}
                alt="Espresso cup with crema at the brim"
                className="espresso-frame-img start-frame"
                style={{ opacity: 1 - overflowOpacity }}
              />

              {/* End Frame: Espresso overflowing and cascading */}
              <img
                src={`${import.meta.env.BASE_URL}designs/espresso-overflow.jpg`}
                alt="Espresso overflowing over ceramic cup"
                className="espresso-frame-img overflow-frame"
                style={{ opacity: overflowOpacity }}
              />

              {/* Liquid Gloss Sheen Highlight */}
              <div
                className="espresso-liquid-shimmer"
                style={{
                  opacity: Math.sin(scrollProgress * Math.PI) * 0.8,
                }}
              />
            </div>
          )}

          {/* Machine Telemetry Tag */}
          <div
            className="espresso-telemetry-tag"
            style={{ opacity: Math.max(1 - scrollProgress * 1.5, 0.2) }}
          >
            <div className="telemetry-item">
              <span className="telemetry-label">PRESSURE</span>
              <span className="telemetry-val">9.0 BAR</span>
            </div>
            <div className="telemetry-sep" />
            <div className="telemetry-item">
              <span className="telemetry-label">EXTRACTION</span>
              <span className="telemetry-val">
                {(scrollProgress * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Liquid Flood Curtain - Fills the section from the cup downwards */}
        <div
          className="espresso-liquid-flood-curtain"
          style={{
            transform: `scaleY(${liquidCascadeHeight})`,
            transformOrigin: "bottom center",
          }}
        >
          <div className="liquid-flood-surface-wave" />
        </div>

        {/* Text and Proof Metrics Emerging Behind/Inside the Liquid Cascade */}
        <div
          className="espresso-revealed-manifesto"
          style={{
            opacity: textRevealOpacity,
            transform: `translate(-50%, calc(-50% + ${textTranslateY}px))`,
            pointerEvents: textRevealOpacity > 0.4 ? "auto" : "none",
          }}
        >
          <div className="manifesto-eyebrow">
            <span>EXTRACTION COMPLETE · STAGE 01</span>
            <span className="manifesto-bar" />
          </div>

          <h2 className="manifesto-headline">
            "From sparse data points to systems that hold their shape in production."
          </h2>

          <p className="manifesto-lead">
            Like dialing in the perfect espresso grind, building reliable AI requires
            fine-grained telemetry, disciplined prompt graphs, and low-latency infrastructure.
          </p>

          {/* Proof Metrics Row */}
          <div className="manifesto-proof-metrics">
            {portfolioData.proofMetrics.map((metric) => (
              <div className="manifesto-metric-card" key={metric.label}>
                <span className="metric-number">{metric.value}</span>
                <span className="metric-tag">{metric.label}</span>
                <span className="metric-desc">{metric.context}</span>
              </div>
            ))}
          </div>

          {onOpenVideoSpec && (
            <button
              className="manifesto-spec-link"
              onClick={onOpenVideoSpec}
            >
              <span>Want to render this background as real AI video? View Camera & Lighting Prompt Spec →</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
