import React from "react";
import { portfolioData } from "../data/portfolioData";

export const ProofStrip: React.FC = () => (
  <section
    className="proof-strip"
    aria-label="Selected proof points"
  >
    {portfolioData.proofMetrics.slice(0, 4).map((metric) => (
      <div className="proof-strip__item" key={metric.label}>
        <strong>{metric.value}</strong>
        <span>{metric.label}</span>
        <small>{metric.context}</small>
      </div>
    ))}
  </section>
);
