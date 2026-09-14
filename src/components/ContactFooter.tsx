import React from "react";
import { CoffeeBeanStreamCanvas } from "./CoffeeBeanStreamCanvas";
import { portfolioData } from "../data/portfolioData";

interface ContactFooterProps {
  eyebrow?: string;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  eyebrow = "Open to thoughtful systems work",
}) => (
  <footer className="contact-footer contact-footer--origin" id="contact">
    <CoffeeBeanStreamCanvas />
    <div className="contact-footer__copy">
      <p className="eyebrow">{eyebrow}</p>
      <h2>Let&apos;s make the next system useful.</h2>
      <p>
        For machine learning, agentic workflows, or real-time voice systems,
        reach out directly.
      </p>
    </div>

    <div className="contact-footer__actions">
      <a className="button button--solid" href={`mailto:${portfolioData.personal.email}`}>
        Start a conversation <span aria-hidden="true">↗</span>
      </a>
      <a
        className="button button--quiet"
        href={portfolioData.personal.linkedinUrl}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn <span aria-hidden="true">↗</span>
      </a>
    </div>

    <div className="contact-footer__meta">
      <a href={`mailto:${portfolioData.personal.email}`}>
        {portfolioData.personal.email}
      </a>
      <span>{portfolioData.personal.phone}</span>
      <a
        href={portfolioData.personal.githubUrl}
        target="_blank"
        rel="noreferrer"
      >
        github.com/Ubaid-Ghante
      </a>
      <span>© {new Date().getFullYear()} Ubaid Ghante</span>
    </div>
  </footer>
);
