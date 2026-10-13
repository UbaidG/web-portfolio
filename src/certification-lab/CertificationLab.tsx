import React, { Suspense, useEffect, useState } from "react";
import type { CertificationItem } from "../data/portfolioData";
import type { DesignId } from "./types";
import { LAB_DESIGNS } from "./registry";
import { LabHeader } from "./components/LabHeader";
import { CertificateLightbox } from "./components/CertificateLightbox";

import "./lab-shell.css";

const readHashDesign = (): DesignId => {
  const id = window.location.hash.replace("#", "");
  return (LAB_DESIGNS.find((d) => d.meta.id === id)?.meta.id ?? "hand") as DesignId;
};

export const CertificationLab: React.FC = () => {
  const [activeId, setActiveId] = useState<DesignId>(readHashDesign);
  const [inspected, setInspected] = useState<CertificationItem | null>(null);
  const [scrub, setScrub] = useState<number | null>(null);

  useEffect(() => {
    window.history.replaceState(null, "", `#${activeId}`);
  }, [activeId]);

  useEffect(() => {
    const onHash = () => setActiveId(readHashDesign());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const active = LAB_DESIGNS.find((d) => d.meta.id === activeId) ?? LAB_DESIGNS[0];
  const { Component } = active;

  return (
    <div className="lab-root">
      <LabHeader
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          window.scrollTo({ top: 0 });
        }}
      />

      <main className="lab-stage-host">
        <Suspense fallback={<div className="lab-loading">Loading design…</div>}>
          <Component key={activeId} onInspect={setInspected} manualScrub={scrub} />
        </Suspense>
      </main>

      <div className="lab-scrub">
        <label>
          <input
            type="checkbox"
            checked={scrub !== null}
            onChange={(e) => setScrub(e.target.checked ? 0 : null)}
          />
          Scrub
        </label>
        {scrub !== null && (
          <>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={scrub}
              onChange={(e) => setScrub(parseFloat(e.target.value))}
            />
            <span>{Math.round(scrub * 100)}%</span>
          </>
        )}
      </div>

      <CertificateLightbox cert={inspected} onClose={() => setInspected(null)} />
    </div>
  );
};
