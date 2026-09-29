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
import { HeroModels } from "../components/HeroModels";
import { ScrollCompanionLine } from "../components/ScrollCompanionLine";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#approach", label: "Approach" },
  { href: "#works", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#certifications", label: "Certificates" },
];

export const CoffeeDesign2RoasteryLofty: React.FC = () => {
  useLenis(true);
  const heroRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deckDepths, setDeckDepths] = useState<number[]>(() =>
    portfolioData.experiences.map(() => 0)
  );

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Must match the breakpoint where roastery.css drops the sticky deck
    const flatDeckQuery = window.matchMedia("(max-width: 640px)");

    let ticking = false;
    const updateDeck = () => {
      const depths: number[] = portfolioData.experiences.map(() => 0);
      const N = portfolioData.experiences.length;

      for (let j = 1; j < N && !flatDeckQuery.matches; j++) {
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
    flatDeckQuery.addEventListener("change", handleScroll);
    updateDeck();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      flatDeckQuery.removeEventListener("change", handleScroll);
    };
  }, []);

  const skillsList1 = [
    "Python",
    "LangGraph",
    "CrewAI",
    "FastAPI",
    "Docker",
    "Kubernetes",
    "AWS Bedrock",
    "Azure OpenAI",
    "PyTorch",
    "Datadog",
    "Arize AX",
  ];

  const skillsList2 = [
    "Agentic AI",
    "Real-time Voice AI",
    "RAG",
    "MCP Servers",
    "NER",
    "PHI/PII Masking",
    "Neo4j & GraphRAG",
    "Time-Series ML",
    "Computer Vision",
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
          <a href="#top" className="lofty-nav-logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-brand">UG</span>
          </a>
          <nav className="lofty-nav-links">
            {navLinks.map((link) => (
              <a href={link.href} className="lofty-nav-item" key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="lofty-nav-cta"
          >
            Say Hello <span className="btn-arrow-icon">↗</span>
          </a>
          <button
            type="button"
            className={`lofty-nav-toggle${menuOpen ? " is-open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="lofty-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="toggle-bar" />
            <span className="toggle-bar" />
          </button>
        </div>

        {menuOpen && (
          <>
            <div
              className="lofty-mobile-menu-backdrop"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <nav className="lofty-mobile-menu" id="lofty-mobile-menu">
              {navLinks.map((link, idx) => (
                <a
                  href={link.href}
                  className="lofty-mobile-menu-item"
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mobile-menu-idx">{String(idx + 1).padStart(2, "0")}</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </>
        )}
      </header>

      <ScrollCompanionLine />

      <main>
        {/* Hero Section: Large Condensed Typography + 3D Models */}
        <section className="lofty-hero" ref={heroRef}>
          <div className="lofty-hero-inner">
            <p className="lofty-hero-kicker">Ubaid Ghante · Machine Learning Engineer</p>

            <h1 className="lofty-hero-headline">
              I BUILD
              <br />
              <span className="headline-highlight">AI AGENTS</span>
              <br />
              THAT SHIP
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
                View Resume <span className="btn-arrow-icon">↗</span>
              </a>
            </div>
          </div>

          <HeroModels />

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
            <span className="lofty-tag">ABOUT ME</span>
            <h2 className="lofty-manifesto-headline">
              I DESIGN{" "}
              <span
                className="lofty-inline-sticker sticker--matcha"
                title="LangChain, CrewAI, n8n and MCP servers"
              >
                <span className="inline-icon-group" aria-hidden="true">
                  <img
                    className="inline-icon"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/langchain.svg`}
                    alt=""
                  />
                  <img
                    className="inline-icon"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/crewai.svg`}
                    alt=""
                  />
                </span>{" "}
                AGENTIC AI
              </span>{" "}
              AND REAL-TIME{" "}
              <span
                className="lofty-inline-sticker sticker--ochre"
                title="LiveKit, ElevenLabs, Deepgram, OpenAI and Cartesia"
              >
                <span className="inline-icon-group" aria-hidden="true">
                  <img
                    className="inline-icon"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/livekit.svg`}
                    alt=""
                  />
                  <img
                    className="inline-icon"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/elevenlabs.svg`}
                    alt=""
                  />
                </span>{" "}
                VOICE AI
              </span>
              , THEN SHIP BOTH WITH{" "}
              <span
                className="lofty-inline-sticker sticker--espresso"
                title="FastAPI, Docker, Kubernetes and GitHub Actions"
              >
                <span className="inline-icon-group" aria-hidden="true">
                  <img
                    className="inline-icon"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/docker.svg`}
                    alt=""
                  />
                  <img
                    className="inline-icon"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/kubernetes.svg`}
                    alt=""
                  />
                </span>{" "}
                MLOPS
              </span>{" "}
              AND{" "}
              <span
                className="lofty-inline-sticker sticker--cream"
                title="Datadog and Arize AX"
              >
                <span className="inline-icon-group" aria-hidden="true">
                  <img
                    className="inline-icon"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/datadog.svg`}
                    alt=""
                  />
                  <img
                    className="inline-icon inline-icon--wide"
                    src={`${import.meta.env.BASE_URL}assets/tech-icons/arize.svg`}
                    alt=""
                  />
                </span>{" "}
                MONITORING
              </span>{" "}
              BUILT IN FROM DAY ONE.
            </h2>
            <p className="lofty-manifesto-sub">
              4+ years of production ML and software engineering across talent intelligence, banking
              compliance, and healthcare. I care about the unglamorous parts
              (clean data, evaluation, monitoring) that keep AI useful after
              launch.
            </p>
          </div>
        </section>

        {/* Tech Stack Double Marquee */}
        <section className="lofty-cupping-section" id="stack">
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
        </section>

        {/* Section 03: Proof Metrics Grid (Loftylab High-Contrast Cards) */}
        <section className="lofty-metrics-section" id="impact">
          <div className="lofty-section-header">
            <span className="lofty-tag">IMPACT</span>
            <h2>Numbers from production, not notebooks.</h2>
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
            <span className="lofty-tag">EXPERIENCE</span>
            <h2>Where I've shipped ML systems.</h2>
            <p className="lofty-section-sub">
              Four ML roles across talent intelligence, banking compliance, and
              healthcare AI since 2023, built on software engineering work
              since 2020.
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
                        <span className="meta-loc"> · {exp.location}</span>
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
                        <span className="badge-side-title">HIGHLIGHT</span>
                        <strong className="badge-side-val">{exp.metrics}</strong>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="lofty-earlier-exp">
            <span className="lofty-tag">EARLIER EXPERIENCE</span>
            <ul className="earlier-exp-list">
              {portfolioData.earlierExperience.map((item) => (
                <li className="earlier-exp-row" key={item.id}>
                  <div className="earlier-exp-head">
                    <div>
                      <h4 className="earlier-exp-role">{item.role}</h4>
                      <span className="earlier-exp-company">
                        {item.company} · {item.type}
                      </span>
                    </div>
                    <span className="earlier-exp-period">{item.period}</span>
                  </div>
                  {item.highlights && (
                    <p className="earlier-exp-desc">{item.highlights.join(" ")}</p>
                  )}
                  <div className="earlier-exp-foot">
                    <div className="stacked-tech-cloud">
                      {item.tech.map((t) => (
                        <span className="stacked-tech-chip" key={t}>{t}</span>
                      ))}
                    </div>
                    {item.proofUrl && (
                      <a
                        className="earlier-exp-link"
                        href={`${import.meta.env.BASE_URL}${item.proofUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Experience letter <span className="btn-arrow-icon">↗</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section: How I Work (3-Stage Process Grid inspired by Loftylab) */}
        <section className="lofty-pipeline-section" id="approach">
          <div className="lofty-section-header">
            <span className="lofty-tag">HOW I WORK</span>
            <h2>From prototype to production.</h2>
            <p className="lofty-section-sub">
              The three things I focus on in every ML system I build.
            </p>
          </div>

          <div className="lofty-pipeline-grid">
            {/* Stage 1: Sourcing & Architecture */}
            <div className="lofty-pipeline-card card--matcha">
              <div className="pipeline-card-top">
                <span className="pipeline-step-idx">01</span>
                <span className="pipeline-phase-badge">DATA & DESIGN</span>
              </div>
              <div className="pipeline-sticker-container">
                {/* [USER ASSET GAP 2: pipeline_sourcing.svg] */}
                <div className="pipeline-sticker-diecut sticker-float-1">
                  <SourcingStickerIcon />
                </div>
              </div>
              <div className="pipeline-card-bottom">
                <h3 className="pipeline-title">Get the Data Right</h3>
                <p className="pipeline-desc">
                  Modeling the data and the workflow before the prompts: graph databases, agent flows, and models that hold up on sparse, real-world data.
                </p>
                <div className="pipeline-card-tags">
                  <span>Neo4j</span>
                  <span>LangGraph</span>
                  <span>Apache Spark</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Extraction & Latency */}
            <div className="lofty-pipeline-card card--ochre">
              <div className="pipeline-card-top">
                <span className="pipeline-step-idx">02</span>
                <span className="pipeline-phase-badge">REAL-TIME AI</span>
              </div>
              <div className="pipeline-sticker-container">
                {/* [USER ASSET GAP 2: pipeline_extraction.svg] */}
                <div className="pipeline-sticker-diecut sticker-float-2">
                  <ExtractionStickerIcon />
                </div>
              </div>
              <div className="pipeline-card-bottom">
                <h3 className="pipeline-title">Build for Live Use</h3>
                <p className="pipeline-desc">
                  Voice pipelines, agent workflows, and MCP servers that respond fast enough for live conversations and real users.
                </p>
                <div className="pipeline-card-tags">
                  <span>LiveKit</span>
                  <span>Deepgram</span>
                  <span>MCP</span>
                </div>
              </div>
            </div>

            {/* Stage 3: Cupping & Guardrails */}
            <div className="lofty-pipeline-card card--espresso">
              <div className="pipeline-card-top">
                <span className="pipeline-step-idx">03</span>
                <span className="pipeline-phase-badge">MLOPS & QUALITY</span>
              </div>
              <div className="pipeline-sticker-container">
                {/* [USER ASSET GAP 2: pipeline_cupping.svg] */}
                <div className="pipeline-sticker-diecut sticker-float-3">
                  <CuppingStickerIcon />
                </div>
              </div>
              <div className="pipeline-card-bottom">
                <h3 className="pipeline-title">Ship and Monitor</h3>
                <p className="pipeline-desc">
                  Containerized deployments with CI/CD, observability from day one, and PHI/PII masked before data leaves the pipeline.
                </p>
                <div className="pipeline-card-tags">
                  <span>Kubernetes</span>
                  <span>Arize AX</span>
                  <span>PHI/PII Masking</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: Selected Work / Works Grid (Loftylab Editorial Style) */}
        <section className="lofty-works-section" id="works">
          <div className="lofty-section-header">
            <span className="lofty-tag">SELECTED PROJECTS</span>
            <h2>Projects across voice, vision, and health AI.</h2>
          </div>

          <div className="lofty-works-grid">
            {portfolioData.projects.map((proj, idx) => (
              <div className="lofty-work-card" key={proj.id}>
                {/* [USER ASSET GAP 3: Project Showcase Media Slot (16:9)] */}
                <ProjectPreviewMedia
                  projectId={proj.id}
                  category={proj.category}
                  title={proj.title}
                  tech={proj.tech}
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
            <h2>Education</h2>
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
