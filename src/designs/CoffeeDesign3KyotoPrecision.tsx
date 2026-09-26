import React, { useEffect, useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { useLenis } from "../hooks/useLenis";
import { ContactFooter } from "../components/ContactFooter";

export const CoffeeDesign3KyotoPrecision: React.FC = () => {
  useLenis(true);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollPercent(window.scrollY / totalScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="portfolio portfolio--kyoto" id="top">
      {/* Left Vertical Capillary Drip Guide */}
      <div className="kyoto-capillary-rail" aria-hidden="true">
        <div className="capillary-tube">
          <div
            className="capillary-liquid"
            style={{ height: `${scrollPercent * 100}%` }}
          />
          <div
            className="capillary-amber-drop"
            style={{ top: `${scrollPercent * 100}%` }}
          />
        </div>
        <span className="capillary-label">
          FLOW: {(0.15 + scrollPercent * 0.05).toFixed(2)} mL/min
        </span>
      </div>

      {/* Cyber-Barista Precision Header */}
      <header className="kyoto-nav-header">
        <div className="kyoto-nav-inner">
          <div className="kyoto-brand">
            <span className="kyoto-status-dot" />
            <span className="kyoto-name">UBAID GHANTE</span>
            <span className="kyoto-role-tag">ML // AGENTIC SYSTEMS</span>
          </div>

          <nav className="kyoto-nav-menu">
            <a href="#lab-overview" className="kyoto-nav-link">01_OVERVIEW</a>
            <a href="#telemetry" className="kyoto-nav-link">02_TELEMETRY</a>
            <a href="#chapters" className="kyoto-nav-link">03_SYSTEMS</a>
            <a href="#lab-works" className="kyoto-nav-link">04_PROJECTS</a>
          </nav>

          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="kyoto-cta-terminal"
          >
            PING_ENGINEER ↗
          </a>
        </div>
      </header>

      <main className="kyoto-main-shell">
        {/* Section 01: Hero Split-Screen with Cold Drip Apparatus */}
        <section className="kyoto-hero-section" id="lab-overview">
          <div className="kyoto-hero-content">
            <div className="kyoto-hero-tag">
              <span className="tag-bracket">[</span>
              <span>CALIBRATION PROTOCOL 2026.09</span>
              <span className="tag-bracket">]</span>
            </div>

            <h1 className="kyoto-hero-headline">
              DETERMINISTIC
              <br />
              <span className="amber-glow-text">SLOW-DRIP</span>
              <br />
              INTELLIGENCE.
            </h1>

            <p className="kyoto-hero-lead">
              Production agentic workflows, real-time voice systems, and ML
              infrastructure tuned for high-stress reliability. Drop by drop,
              parameter by parameter.
            </p>

            <div className="kyoto-hero-actions">
              <a
                href={`mailto:${portfolioData.personal.email}`}
                className="kyoto-action-btn primary"
              >
                Connect Directly ↗
              </a>
              <a
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="kyoto-action-btn secondary"
              >
                Inspect Resume ↗
              </a>
            </div>
          </div>

          {/* Kyoto Apparatus Visual Stage with Live Telemetry */}
          <div className="kyoto-apparatus-stage">
            <div className="apparatus-image-wrapper">
              <img
                src={`${import.meta.env.BASE_URL}designs/cold-drip-tower.jpg`}
                alt="Kyoto cold drip slow extraction tower with amber droplet"
                className="apparatus-img"
              />
              <div className="apparatus-scanline" />

              {/* HUD Telemetry Overlay */}
              <div className="apparatus-hud">
                <div className="hud-metric">
                  <span className="hud-label">EXTRACTION RATE</span>
                  <span className="hud-val">1 DROP / 4.2 SEC</span>
                </div>
                <div className="hud-metric">
                  <span className="hud-label">INFERENCE LATENCY</span>
                  <span className="hud-val">&lt; 180 MS</span>
                </div>
                <div className="hud-metric">
                  <span className="hud-label">CORE ARCHITECTURE</span>
                  <span className="hud-val">LANGGRAPH + vLLM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Telemetry Performance Gauges */}
        <section className="kyoto-telemetry-section" id="telemetry">
          <div className="kyoto-section-label">
            <span>// TELEMETRY_VALIDATION</span>
            <span className="label-rule" />
          </div>

          <div className="kyoto-gauges-grid">
            {portfolioData.proofMetrics.map((metric, i) => (
              <div className="kyoto-gauge-card" key={metric.label}>
                <div className="gauge-header">
                  <span className="gauge-code">PARAM_0{i + 1}</span>
                  <span className="gauge-status">VERIFIED</span>
                </div>
                <div className="gauge-value">{metric.value}</div>
                <div className="gauge-label">{metric.label}</div>
                <p className="gauge-context">{metric.context}</p>
                <div className="gauge-bar">
                  <div
                    className="gauge-bar-fill"
                    style={{ width: `${80 + (i % 3) * 8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 03: Pinned Split-Screen Experience & Chapters */}
        <section className="kyoto-chapters-section" id="chapters">
          <div className="kyoto-section-label">
            <span>// DEPLOYMENT_CHAPTERS</span>
            <span className="label-rule" />
          </div>

          <div className="kyoto-split-showcase">
            {/* Left Sticky Pinned Monitor */}
            <div className="kyoto-sticky-monitor">
              <div className="monitor-frame">
                <div className="monitor-header">
                  <span className="monitor-title">STATION_0{activeProjectIdx + 1} // ACTIVE_SYSTEM</span>
                  <span className="monitor-badge">LIVE</span>
                </div>
                <div className="monitor-body">
                  <div className="monitor-big-code">
                    {portfolioData.experiences[activeProjectIdx]?.company || "Korn Ferry"}
                  </div>
                  <div className="monitor-role">
                    {portfolioData.experiences[activeProjectIdx]?.role}
                  </div>
                  <div className="monitor-metric-box">
                    <span>RECORDED IMPACT:</span>
                    <strong>{portfolioData.experiences[activeProjectIdx]?.metrics || "High Scale"}</strong>
                  </div>
                  <div className="monitor-tech-chips">
                    {portfolioData.experiences[activeProjectIdx]?.tech.slice(0, 6).map((t) => (
                      <span key={t} className="monitor-chip">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Scrolling Chapters */}
            <div className="kyoto-scroll-chapters">
              {portfolioData.experiences.map((exp, idx) => (
                <article
                  className={`kyoto-chapter-card ${activeProjectIdx === idx ? "active" : ""}`}
                  key={exp.id}
                  onMouseEnter={() => setActiveProjectIdx(idx)}
                >
                  <div className="card-top-meta">
                    <span className="card-period">{exp.period}</span>
                    <span className="card-loc">{exp.location}</span>
                  </div>
                  <h3 className="card-company">{exp.company}</h3>
                  <h4 className="card-role">{exp.role}</h4>
                  <p className="card-summary">{exp.summary}</p>

                  <ul className="card-highlights">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx}>
                        <span className="bullet-glow">▹</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="card-tags">
                    {exp.tech.map((t) => (
                      <span className="kyoto-tech-tag" key={t}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 04: Laboratory Projects Catalog */}
        <section className="kyoto-projects-section" id="lab-works">
          <div className="kyoto-section-label">
            <span>// PRODUCTION_WORKS_CATALOG</span>
            <span className="label-rule" />
          </div>

          <div className="kyoto-projects-grid">
            {portfolioData.projects.map((proj, idx) => (
              <div className="kyoto-project-item" key={proj.id}>
                <div className="proj-corner-index">0{idx + 1}</div>
                <div className="proj-category">{proj.category}</div>
                <h3 className="proj-title">{proj.title}</h3>
                <p className="proj-tagline">{proj.tagline}</p>
                <p className="proj-desc">{proj.description}</p>

                <div className="proj-tech-list">
                  {proj.tech.map((t) => (
                    <span className="proj-tag" key={t}>{t}</span>
                  ))}
                </div>

                {proj.github && (
                  <div className="proj-action-row">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="proj-github-btn"
                    >
                      {proj.linkLabel || "View Code Repository"} ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 05: Calibration Sheet (Education & Certifications) */}
        <section className="kyoto-calibration-section">
          <div className="kyoto-section-label">
            <span>// ACCREDITATION_LOG</span>
            <span className="label-rule" />
          </div>

          <div className="kyoto-log-container">
            <div className="log-column">
              <h3 className="log-col-title">ACADEMIC FOUNDATION</h3>
              {portfolioData.education.map((edu) => (
                <div className="log-entry" key={edu.school}>
                  <div className="log-time">{edu.period}</div>
                  <h4 className="log-institution">{edu.school}</h4>
                  <p className="log-degree">{edu.degree}</p>
                  <div className="log-score-stamp">
                    <span>SCORE: </span>
                    <strong>{edu.score}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="log-column">
              <h3 className="log-col-title">INDUSTRY CERTIFICATIONS</h3>
              <div className="log-cert-grid">
                {portfolioData.certifications.map((cert) => (
                  <div className="cert-stamp-card" key={cert.name}>
                    <div className="cert-top">
                      <span className="cert-issuer-badge">{cert.issuer} VERIFIED</span>
                      <span className="cert-stamp-date">{cert.date}</span>
                    </div>
                    <div className="cert-title">{cert.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ContactFooter eyebrow="System ready for incoming transmission" />
      </main>
    </div>
  );
};
