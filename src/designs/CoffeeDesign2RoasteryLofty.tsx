import React, { useRef, useState, useEffect } from "react";
import { portfolioData } from "../data/portfolioData";
import { useLenis } from "../hooks/useLenis";
import { ContactFooter } from "../components/ContactFooter";
import {
  SourcingStickerIcon,
  ExtractionStickerIcon,
  CuppingStickerIcon,
  ProjectPreviewMedia,
} from "../components/LoftyProcessSVGs";
import { CertificateWallGallery } from "../components/CertificateWallGallery";
import { MortarboardHat } from "../components/MortarboardHat";

export const CoffeeDesign2RoasteryLofty: React.FC = () => {
  useLenis(true);
  const heroRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [deckDepths, setDeckDepths] = useState<number[]>(() =>
    portfolioData.experiences.map(() => 0)
  );

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const updateDeck = () => {
      const depths: number[] = portfolioData.experiences.map(() => 0);
      const N = portfolioData.experiences.length;

      for (let j = 1; j < N; j++) {
        const nextCard = cardRefs.current[j];
        if (!nextCard) continue;

        const rect = nextCard.getBoundingClientRect();
        const targetTop = 90 + j * 32;
        const range = 260;
        const progress = Math.max(
          0,
          Math.min(1, (targetTop + range - rect.top) / range)
        );

        if (progress > 0) {
          for (let i = 0; i < j; i++) {
            depths[i] += progress;
          }
        }
      }

      setDeckDepths(depths);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateDeck);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateDeck();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const skillsList1 = [
    "LangGraph",
    "FastAPI",
    "Docker",
    "Kubernetes",
    "PyTorch",
    "vLLM",
    "Datadog",
    "Arize AX",
  ];

  const skillsList2 = [
    "Agentic AI",
    "Real-time Voice Systems",
    "Graph Neural Networks",
    "PHI/PII Masking",
    "Apache Spark",
    "Medical Computer Vision",
    "RAG & Evaluation",
  ];

  // Card background schemes inspired by Loftylab (Ochre, Matcha, Cream, Espresso)
  const cardThemes = [
    {
      bg: "#e27338",
      color: "#ffffff",
      accent: "#ffe6d6",
      numberColor: "rgba(255,255,255,0.4)",
    },
    {
      bg: "#2b5641",
      color: "#ffffff",
      accent: "#b5e2cc",
      numberColor: "rgba(255,255,255,0.4)",
    },
    {
      bg: "#f3ede3",
      color: "#231815",
      accent: "#c4682c",
      numberColor: "rgba(35,24,21,0.25)",
    },
    {
      bg: "#1b1411",
      color: "#fcfaf7",
      accent: "#e27338",
      numberColor: "rgba(255,255,255,0.3)",
    },
  ];

  return (
    <div className="portfolio portfolio--roastery" id="top">
      {/* Floating Pill Navigation Header (Loftylab Style) */}
      <header className="lofty-nav-dock">
        <div className="lofty-nav-pill">
          <a href="#top" className="lofty-nav-logo">
            <span className="logo-roast-bean">☕</span>
            <span className="logo-brand">UG / ROASTERY</span>
          </a>
          <nav className="lofty-nav-links">
            <a href="#about" className="lofty-nav-item">About</a>
            <a href="#cupping" className="lofty-nav-item">Cupping Notes</a>
            <a href="#experience" className="lofty-nav-item">Experience</a>
            <a href="#pipeline" className="lofty-nav-item">Pipeline</a>
            <a href="#works" className="lofty-nav-item">Works</a>
            <a href="#certifications" className="lofty-nav-item">Certificates</a>
          </nav>
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="lofty-nav-cta"
          >
            Say Hello <span className="btn-arrow-icon">↗</span>
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section: Large Condensed Typography + Floating Badges */}
        <section className="lofty-hero" ref={heroRef}>
          <div className="lofty-hero-inner">
            {/* Floating Die-Cut Sticker Badges with Spring Wobble Physics */}
            <div
              className="lofty-badge badge-top-left"
              style={{ "--rot": "-6deg" } as React.CSSProperties}
            >
              <span className="badge-sticker-spark">⚡</span>
              <span>170M+ Profiles</span>
            </div>
            <div
              className="lofty-badge badge-top-right"
              style={{ "--rot": "5deg" } as React.CSSProperties}
            >
              <span className="badge-sticker-spark">🎓</span>
              <span>9.3 CGPA First Class</span>
            </div>
            <div
              className="lofty-badge badge-mid-left"
              style={{ "--rot": "4deg" } as React.CSSProperties}
            >
              <span className="badge-sticker-spark">🎙️</span>
              <span>Real-Time Voice AI</span>
            </div>
            <div
              className="lofty-badge badge-mid-right"
              style={{ "--rot": "-5deg" } as React.CSSProperties}
            >
              <span className="badge-sticker-spark">☕</span>
              <span>Machine Learning Engineer</span>
            </div>
            <div
              className="lofty-badge badge-bottom-left"
              style={{ "--rot": "-3deg" } as React.CSSProperties}
            >
              <span className="badge-sticker-spark">🎯</span>
              <span>99.2% Accuracy PHI</span>
            </div>
            <div
              className="lofty-badge badge-bottom-right"
              style={{ "--rot": "3deg" } as React.CSSProperties}
            >
              <span className="badge-sticker-spark">✦</span>
              <span>Single-Origin AI</span>
            </div>

            <p className="lofty-hero-kicker">Machine Learning Engineer · Single-Origin AI</p>

            <h1 className="lofty-hero-headline">
              WE ENGINEER
              <br />
              <span className="headline-highlight">INTELLIGENCE</span>
              <br />
              YOU CAN RELY ON
            </h1>

            <p className="lofty-hero-lede">
              {portfolioData.personal.shortBio}
            </p>

            <div className="lofty-hero-actions">
              <a
                className="lofty-btn-solid"
                href={`mailto:${portfolioData.personal.email}`}
              >
                Start a Conversation <span className="btn-arrow-icon">↗</span>
              </a>
              <a
                className="lofty-btn-outline"
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Latex Resume <span className="btn-arrow-icon">↗</span>
              </a>
            </div>
          </div>

          {/* Scalloped Wave Mask Transition (Loftylab Signature) */}
          <div className="lofty-scallop-divider" aria-hidden="true">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              preserveAspectRatio="none"
              className="lofty-scallop-svg"
            >
              <path
                d="M0,0 C120,90 240,90 360,0 C480,90 600,90 720,0 C840,90 960,90 1080,0 C1200,90 1320,90 1440,0 L1440,120 L0,120 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </section>

        {/* Section: Specialty Roastery Manifesto with Inline Interactive Stickers */}
        <section className="lofty-manifesto-section" id="about">
          <div className="lofty-manifesto-inner">
            <div className="lofty-tag-pill">
              <span>☕ CRAFT PHILOSOPHY & ROAST PROFILE</span>
            </div>
            <h2 className="lofty-manifesto-headline">
              WE ROAST PRODUCTION-GRADE{" "}
              <span
                className="lofty-inline-sticker sticker--matcha"
                title="LangGraph & Multi-agent pipelines"
              >
                <span className="inline-icon">🤖</span> AGENTIC WORKFLOWS
              </span>{" "}
              AND STREAMING{" "}
              <span
                className="lofty-inline-sticker sticker--ochre"
                title="Ultra-low latency audio inference"
              >
                <span className="inline-icon">🎙️</span> VOICE AI
              </span>{" "}
              EXTRACTED FOR{" "}
              <span
                className="lofty-inline-sticker sticker--espresso"
                title="<250ms time-to-first-token"
              >
                <span className="inline-icon">⚡</span> SUB-250MS LATENCY
              </span>
              , BRINGING SINGLE-ORIGIN CRAFTSMANSHIP FROM{" "}
              <span
                className="lofty-inline-sticker sticker--cream"
                title="Strict eval benchmarks and Datadog/Arize AX guardrails"
              >
                <span className="inline-icon">☕</span> MODEL WEIGHTS
              </span>{" "}
              TO SCALABLE REAL-WORLD INFRASTRUCTURE.
            </h2>
            <p className="lofty-manifesto-sub">
              Hover over any sticker badge to inspect the roast profile, or scroll down to explore the production chapters.
            </p>
          </div>
        </section>

        {/* Section 02: Cupping Notes / Double Marquee */}
        <section className="lofty-cupping-section" id="cupping">
          <div className="lofty-section-header">
            <span className="lofty-tag">CUPPING NOTES & STACK</span>
            <h2>Single-origin craft, scalable production infrastructure.</h2>
          </div>

          {/* Row 1 Marquee */}
          <div className="lofty-marquee-track">
            <div className="lofty-marquee-inner">
              {[...skillsList1, ...skillsList1, ...skillsList1].map((skill, i) => (
                <div className="lofty-marquee-pill pill-ochre" key={`r1-${i}`}>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 Marquee (Reverse) */}
          <div className="lofty-marquee-track reverse">
            <div className="lofty-marquee-inner reverse">
              {[...skillsList2, ...skillsList2, ...skillsList2].map((skill, i) => (
                <div className="lofty-marquee-pill pill-matcha" key={`r2-${i}`}>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cupping Still Feature Asset */}
          <div className="lofty-cupping-asset-banner">
            <div className="cupping-asset-frame">
              <img
                src={`${import.meta.env.BASE_URL}designs/roastery-cupping.jpg`}
                alt="Specialty coffee cupping table and beans"
                className="cupping-asset-img"
              />
              <div className="cupping-asset-overlay">
                <span className="cupping-origin-badge">ORIGIN: PUNE, INDIA</span>
                <p className="cupping-quote">
                  "Production agentic workflows, real-time voice systems, and ML
                  infrastructure built with care for the details that make them
                  dependable."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Proof Metrics Grid (Loftylab High-Contrast Cards) */}
        <section className="lofty-metrics-section" id="about">
          <div className="lofty-section-header">
            <span className="lofty-tag">PROVEN YIELD</span>
            <h2>Numbers measured in production, not notebooks.</h2>
          </div>

          <div className="lofty-metrics-grid">
            {portfolioData.proofMetrics.map((item, idx) => (
              <div className="lofty-metric-box" key={item.label}>
                <div className="metric-box-num">{String(idx + 1).padStart(2, "0")}</div>
                <div className="metric-box-val">{item.value}</div>
                <div className="metric-box-label">{item.label}</div>
                <p className="metric-box-context">{item.context}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 04: Loftylab Pinned Stacking Cards for Experience */}
        <section className="lofty-stacking-section" id="experience">
          <div className="lofty-section-header">
            <span className="lofty-tag">EXPERIENCE CHAPTERS</span>
            <h2>Stacked chapters of engineering leadership.</h2>
            <p className="lofty-section-sub">
              Scroll down to watch each production chapter stack onto the viewport.
            </p>
          </div>

          <div className="lofty-cards-stack-container">
            {portfolioData.experiences.map((exp, index) => {
              const theme = cardThemes[index % cardThemes.length];
              const rotation = index % 2 === 0 ? "-1.2deg" : "1.2deg";
              const stickyTop = 90 + index * 32;

              const depth = deckDepths[index] || 0;
              const scale = Math.max(0.88, 1 - depth * 0.04);
              const translateY = -depth * 10;
              const brightness = Math.max(0.78, 1 - depth * 0.06);

              return (
                <article
                  className="lofty-stacked-card"
                  key={exp.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  style={{
                    backgroundColor: theme.bg,
                    color: theme.color,
                    top: `${stickyTop}px`,
                    transform: `rotate(${rotation}) translateY(${translateY}px) scale(${scale})`,
                    filter: `brightness(${brightness})`,
                    transformOrigin: "center top",
                  }}
                >
                  <div className="stacked-card-header">
                    <span
                      className="stacked-card-number"
                      style={{ color: theme.numberColor }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="stacked-card-meta">
                      <span className="meta-period">{exp.period}</span>
                      {exp.location && (
                        <span className="meta-loc">· {exp.location}</span>
                      )}
                    </div>
                  </div>

                  <div className="stacked-card-main">
                    <div className="stacked-card-text">
                      <h3 className="stacked-company">{exp.company}</h3>
                      <h4 className="stacked-role">{exp.role}</h4>
                      <p className="stacked-summary">{exp.summary}</p>

                      <div className="stacked-highlights-list">
                        {exp.highlights.map((h, hIdx) => (
                          <div className="stacked-highlight-item" key={hIdx}>
                            <span className="highlight-bullet">✦</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      <div className="stacked-tech-cloud">
                        {exp.tech.map((t) => (
                          <span
                            className="stacked-tech-chip"
                            key={t}
                            style={{
                              borderColor: theme.accent,
                              color: theme.color,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {exp.metrics && (
                      <div className="stacked-card-badge-side">
                        <span className="badge-side-title">KEY IMPACT</span>
                        <strong className="badge-side-val">{exp.metrics}</strong>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section: The Roasting Pipeline (3-Stage Process Grid inspired by Loftylab) */}
        <section className="lofty-pipeline-section" id="pipeline">
          <div className="lofty-section-header">
            <span className="lofty-tag">THE ROASTING PIPELINE</span>
            <h2>How we roast raw models into dependable systems.</h2>
            <p className="lofty-section-sub">
              A systematic 3-stage process bridging data sourcing, streaming inference, and production cupping.
            </p>
          </div>

          <div className="lofty-pipeline-grid">
            {/* Stage 1: Sourcing & Architecture */}
            <div className="lofty-pipeline-card card--matcha">
              <div className="pipeline-card-top">
                <span className="pipeline-step-idx">01</span>
                <span className="pipeline-phase-badge">SOURCING & GRAPH</span>
              </div>
              <div className="pipeline-sticker-container">
                {/* [USER ASSET GAP 2: pipeline_sourcing.svg] */}
                <div
                  className="pipeline-sticker-diecut sticker-float-1"
                  title="[ASSET GAP 2: pipeline_sourcing.svg]"
                >
                  <SourcingStickerIcon />
                </div>
              </div>
              <div className="pipeline-card-bottom">
                <h3 className="pipeline-title">Single-Origin Architecture</h3>
                <p className="pipeline-desc">
                  Curating clean training lineages, graph schemas across 170M+ profiles, and resilient DAG pipelines.
                </p>
                <div className="pipeline-card-tags">
                  <span>Graph Neural Nets</span>
                  <span>LangGraph</span>
                  <span>Apache Spark</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Extraction & Latency */}
            <div className="lofty-pipeline-card card--ochre">
              <div className="pipeline-card-top">
                <span className="pipeline-step-idx">02</span>
                <span className="pipeline-phase-badge">EXTRACTION & SPEED</span>
              </div>
              <div className="pipeline-sticker-container">
                {/* [USER ASSET GAP 2: pipeline_extraction.svg] */}
                <div
                  className="pipeline-sticker-diecut sticker-float-2"
                  title="[ASSET GAP 2: pipeline_extraction.svg]"
                >
                  <ExtractionStickerIcon />
                </div>
              </div>
              <div className="pipeline-card-bottom">
                <h3 className="pipeline-title">Sub-250ms Extraction</h3>
                <p className="pipeline-desc">
                  Serving vLLM, WebRTC voice agents, and streaming token pipelines dialed in for real-time human conversation.
                </p>
                <div className="pipeline-card-tags">
                  <span>LiveKit Voice</span>
                  <span>vLLM Serving</span>
                  <span>WebSocket Pipelines</span>
                </div>
              </div>
            </div>

            {/* Stage 3: Cupping & Guardrails */}
            <div className="lofty-pipeline-card card--espresso">
              <div className="pipeline-card-top">
                <span className="pipeline-step-idx">03</span>
                <span className="pipeline-phase-badge">CUPPING & QUALITY</span>
              </div>
              <div className="pipeline-sticker-container">
                {/* [USER ASSET GAP 2: pipeline_cupping.svg] */}
                <div
                  className="pipeline-sticker-diecut sticker-float-3"
                  title="[ASSET GAP 2: pipeline_cupping.svg]"
                >
                  <CuppingStickerIcon />
                </div>
              </div>
              <div className="pipeline-card-bottom">
                <h3 className="pipeline-title">Observability Cupping</h3>
                <p className="pipeline-desc">
                  Continuous evaluation, automated hallucination detection, 99.2% PHI redaction, and Datadog/Arize AX tracing.
                </p>
                <div className="pipeline-card-tags">
                  <span>Arize AX</span>
                  <span>Datadog APM</span>
                  <span>99.2% PHI Masking</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: Selected Work / Works Grid (Loftylab Editorial Style) */}
        <section className="lofty-works-section" id="works">
          <div className="lofty-section-header">
            <span className="lofty-tag">THE MENU / SELECTED WORKS</span>
            <h2>Production AI architectures built to scale.</h2>
          </div>

          <div className="lofty-works-grid">
            {portfolioData.projects.map((proj, idx) => (
              <div className="lofty-work-card" key={proj.id}>
                {/* [USER ASSET GAP 3: Project Showcase Media Slot (16:9)] */}
                <ProjectPreviewMedia
                  projectId={proj.id}
                  category={proj.category}
                  title={proj.title}
                />

                <div className="work-card-top">
                  <span className="work-category-badge">{proj.category}</span>
                  <span className="work-idx">0{idx + 1}</span>
                </div>
                <h3 className="work-title">{proj.title}</h3>
                <p className="work-tagline">{proj.tagline}</p>
                <p className="work-desc">{proj.description}</p>

                <div className="work-tech-row">
                  {proj.tech.map((t) => (
                    <span className="work-tech-pill" key={t}>{t}</span>
                  ))}
                </div>

                {proj.github && (
                  <div className="work-card-bottom">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="work-link-btn"
                    >
                      {proj.linkLabel || "View Repository"} <span className="btn-arrow-icon">↗</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 06: Academic Foundations */}
        <section className="lofty-credentials-section" id="education">
          <div className="lofty-section-header">
            <span className="lofty-tag">ACADEMIC FOUNDATIONS</span>
            <h2>University Degrees & Scholastic Honors.</h2>
          </div>

          <div className="lofty-credentials-grid-edu">
            {portfolioData.education.map((item, idx) => (
              <div
                className={`edu-card${idx === 0 ? " edu-card--featured" : ""}`}
                key={item.school}
              >
                {idx === 0 && <MortarboardHat />}
                <span className="edu-period">{item.period}</span>
                <h4>{item.school}</h4>
                <p>{item.degree}</p>
                <strong className="edu-score">{item.score}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Section 07: The Credentials Gallery Wall (Hanging Certificates with Physical Swings) */}
        <CertificateWallGallery />

        <ContactFooter eyebrow="Let's brew something great together" />
      </main>
    </div>
  );
};
