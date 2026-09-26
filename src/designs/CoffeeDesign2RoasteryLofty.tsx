import React, { useRef } from "react";
import { portfolioData } from "../data/portfolioData";
import { useLenis } from "../hooks/useLenis";
import { ContactFooter } from "../components/ContactFooter";

export const CoffeeDesign2RoasteryLofty: React.FC = () => {
  useLenis(true);
  const heroRef = useRef<HTMLElement>(null);

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
            <a href="#works" className="lofty-nav-item">Selected Works</a>
          </nav>
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="lofty-nav-cta"
          >
            Say Hello ↗
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section: Large Condensed Typography + Floating Badges */}
        <section className="lofty-hero" ref={heroRef}>
          <div className="lofty-hero-inner">
            {/* Floating Sticker Badges */}
            <div className="lofty-badge badge-top-left">
              <span>⚡ 170M+ Profiles</span>
            </div>
            <div className="lofty-badge badge-top-right">
              <span>🎓 9.3 CGPA First Class</span>
            </div>
            <div className="lofty-badge badge-mid-left">
              <span>🎙️ Real-Time Voice AI</span>
            </div>
            <div className="lofty-badge badge-mid-right">
              <span>☕ Machine Learning Engineer</span>
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
                Start a Conversation ↗
              </a>
              <a
                className="lofty-btn-outline"
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Latex Resume ↗
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

              return (
                <article
                  className="lofty-stacked-card"
                  key={exp.id}
                  style={{
                    backgroundColor: theme.bg,
                    color: theme.color,
                    top: `${stickyTop}px`,
                    transform: `rotate(${rotation})`,
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

        {/* Section 05: Selected Work / Works Grid (Loftylab Editorial Style) */}
        <section className="lofty-works-section" id="works">
          <div className="lofty-section-header">
            <span className="lofty-tag">THE MENU / SELECTED WORKS</span>
            <h2>Production AI architectures built to scale.</h2>
          </div>

          <div className="lofty-works-grid">
            {portfolioData.projects.map((proj, idx) => (
              <div className="lofty-work-card" key={proj.id}>
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
                      {proj.linkLabel || "View Repository"} ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 06: Education & Certifications */}
        <section className="lofty-credentials-section">
          <div className="lofty-section-header">
            <span className="lofty-tag">FOUNDATIONS</span>
            <h2>Academics and Industry Certifications.</h2>
          </div>

          <div className="lofty-credentials-grid">
            <div className="credentials-column">
              <h3>Education</h3>
              {portfolioData.education.map((item) => (
                <div className="edu-card" key={item.school}>
                  <span className="edu-period">{item.period}</span>
                  <h4>{item.school}</h4>
                  <p>{item.degree}</p>
                  <strong className="edu-score">{item.score}</strong>
                </div>
              ))}
            </div>

            <div className="credentials-column">
              <h3>Certifications</h3>
              <div className="cert-list">
                {portfolioData.certifications.map((cert) => (
                  <div className="cert-item" key={cert.name}>
                    <span className="cert-issuer-tag">{cert.issuer}</span>
                    <span className="cert-name">{cert.name}</span>
                    <span className="cert-date">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ContactFooter eyebrow="Let's brew something great together" />
      </main>
    </div>
  );
};
