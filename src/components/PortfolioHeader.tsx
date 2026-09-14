import React from "react";
import { portfolioData } from "../data/portfolioData";

interface PortfolioHeaderProps {
  edition?: string;
}

const links = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
];

export const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  edition,
}) => (
  <header className="site-header site-header--origin">
    <a className="site-brand" href="#top" aria-label="Ubaid Ghante home">
      <span className="site-brand__mark">UG</span>
      <span className="site-brand__name">Ubaid Ghante</span>
    </a>

    {edition ? <span className="site-header__edition">{edition}</span> : null}

    <nav className="site-nav" aria-label="Primary navigation">
      {links.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
      <a
        className="site-nav__resume"
        href={portfolioData.personal.resumeUrl}
        target="_blank"
        rel="noreferrer"
      >
        Resume <span aria-hidden="true">↗</span>
      </a>
    </nav>
  </header>
);
