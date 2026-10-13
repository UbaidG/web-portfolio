import React from "react";
import type { DesignId } from "../types";
import { LAB_DESIGNS } from "../registry";

interface LabHeaderProps {
  activeId: DesignId;
  onSelect: (id: DesignId) => void;
}

export const LabHeader: React.FC<LabHeaderProps> = ({ activeId, onSelect }) => {
  const active = LAB_DESIGNS.find((d) => d.meta.id === activeId)?.meta ?? LAB_DESIGNS[0].meta;

  return (
    <header className="lab-header">
      <div className="lab-header-row">
        <a href={import.meta.env.BASE_URL} className="lab-back">
          ← Portfolio
        </a>
        <span className="lab-wordmark">Certification Lab</span>
      </div>

      <nav className="lab-tabs" aria-label="Design prototypes">
        {LAB_DESIGNS.map(({ meta }, idx) => (
          <button
            key={meta.id}
            className={`lab-tab ${meta.id === activeId ? "is-active" : ""}`}
            onClick={() => onSelect(meta.id)}
          >
            <span className="lab-tab-idx">0{idx + 1}</span>
            {meta.name}
          </button>
        ))}
      </nav>

      <div className="lab-brief">
        <p className="lab-brief-tagline">{active.tagline}</p>
        <ul>
          {active.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </header>
  );
};
