import React, { useRef } from "react";
import { EspressoPourHero } from "../components/EspressoPourHero";
import { ContactFooter } from "../components/ContactFooter";
import { PortfolioHeader } from "../components/PortfolioHeader";
import { ProjectCard } from "../components/ProjectCard";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import { useLenis } from "../hooks/useLenis";
import { portfolioData } from "../data/portfolioData";

export const CoffeeDesign1EspressoLab: React.FC = () => {
  // Initialize Lenis smooth scroll
  useLenis(true);

  const experienceRef = useRef<HTMLElement>(null);
  const experienceTrackRef = useRef<HTMLDivElement>(null);
  useHorizontalScroll(experienceRef, experienceTrackRef);

  const projects = portfolioData.projects;

  return (
    <div className="portfolio portfolio--espresso" id="top">
      <PortfolioHeader />

      <main>
        {/* Design 1 Signature: The Espresso Pour Hero with liquid overflow and revealed text */}
        <EspressoPourHero />

        {/* Section 02: Introduction & Engineering Philosophy */}
        <section className="origin-introduction section-shell" id="about">
          <div className="origin-introduction__label">
            <span>About the work</span>
            <span>02 / 06</span>
          </div>
          <div className="origin-introduction__copy">
            <p className="eyebrow">A practical point of view</p>
            <h2>
              The best systems feel quiet when they are working.
            </h2>
            <p>
              I work across model behavior, product constraints, and the
              infrastructure between them. That means building the agent, but
              also the observability, data path, and human interface that make
              the agent useful.
            </p>
          </div>
        </section>

        {/* Section 03: Selected Chapters / Experience */}
        <section
          className="origin-experience section-shell"
          id="experience"
          ref={experienceRef}
        >
          <div className="origin-experience__sticky">
            <div className="section-heading origin-experience__heading">
              <p className="eyebrow">Experience / selected chapters</p>
              <h2>From graph data to agent systems.</h2>
              <p>
                A chronological look at the problems, tools, and teams behind
                the work.
              </p>
              <div className="origin-experience__cue" aria-hidden="true">
                <span>Scroll horizontally</span>
                <span>→ → →</span>
              </div>
            </div>

            <div className="origin-experience__viewport">
              <div className="origin-experience__list" ref={experienceTrackRef}>
                {portfolioData.experiences.map((experience, index) => (
                  <article className="origin-chapter" key={experience.id}>
                    <div className="origin-chapter__number">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="origin-chapter__rule" />
                    </div>
                    <div className="origin-chapter__body">
                      <div className="origin-chapter__meta">
                        <span>{experience.period}</span>
                        {experience.location && <span>{experience.location}</span>}
                      </div>
                      <h3>{experience.company}</h3>
                      <p className="origin-chapter__role">{experience.role}</p>
                      <p className="origin-chapter__summary">{experience.summary}</p>
                      <ul>
                        {experience.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                      <div className="origin-chapter__tech">
                        {experience.tech.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                    </div>
                    {experience.metrics && (
                      <strong className="origin-chapter__metric">
                        {experience.metrics}
                      </strong>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: Selected Projects / The Menu */}
        <section className="origin-work section-shell" id="work">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">Selected work / the menu</p>
              <h2>Useful things, made carefully.</h2>
            </div>
            <p>
              Systems spanning voice AI, medical computer vision, graph neural networks, and clinical
              retrieval.
            </p>
          </div>
          <div className="origin-work__grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* Section 05: Education & Certifications */}
        <section className="origin-education section-shell">
          <div className="origin-education__heading">
            <p className="eyebrow">Training / continued practice</p>
            <h2>Curiosity, with receipts.</h2>
          </div>
          <div className="origin-education__content">
            <div>
              {portfolioData.education.map((item) => (
                <div className="origin-education__item" key={item.school}>
                  <span>{item.period}</span>
                  <div>
                    <h3>{item.school}</h3>
                    <p>{item.degree}</p>
                    <strong>{item.score}</strong>
                  </div>
                </div>
              ))}
            </div>
            <div className="origin-certifications">
              <span className="eyebrow">Certifications / Jan 2026</span>
              {portfolioData.certifications.map((certification) => (
                <p key={certification.name}>
                  <span>{certification.issuer}</span>
                  {certification.name}
                </p>
              ))}
            </div>
          </div>
        </section>

        <ContactFooter eyebrow="The door is open" />
      </main>
    </div>
  );
};
