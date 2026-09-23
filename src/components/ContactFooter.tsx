import React, { useState } from "react";
import { CoffeeBeanStreamCanvas } from "./CoffeeBeanStreamCanvas";
import { portfolioData } from "../data/portfolioData";

interface ContactFooterProps {
  eyebrow?: string;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  eyebrow = "Open to thoughtful systems work",
}) => {
  const [copied, setCopied] = useState(false);

  const handleStartConversation = () => {
    // Copy email to clipboard immediately so it never fails even if mailto is unhandled
    if (navigator.clipboard) {
      navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3500);
      });
    }
  };

  const mailtoHref = `mailto:${portfolioData.personal.email}?subject=${encodeURIComponent("Conversation from Portfolio — Ubaid Ghante")}`;

  return (
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
        <a
          className="button button--solid"
          href={mailtoHref}
          onClick={handleStartConversation}
          title={`Email ${portfolioData.personal.email} (click to open mail client & copy address)`}
        >
          {copied ? "Email copied to clipboard! ✓" : "Start a conversation"}{" "}
          <span aria-hidden="true">↗</span>
        </a>
        <a
          className="button button--quiet"
          href={portfolioData.personal.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          title="Open LinkedIn Profile"
        >
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="contact-footer__meta">
        <a
          href={mailtoHref}
          onClick={handleStartConversation}
          title="Click to copy email address"
        >
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
};
