import React, { useCallback, useRef, useState } from "react";
import type { CertificationItem } from "../data/portfolioData";
import { ALL_CERTS } from "../data/certGroups";
import { FilingCabinet } from "./cabinet/FilingCabinet";
import { CertificateDetailLightbox } from "./CertificateDetailLightbox";
import { useFrame } from "../lib/motion/useFrame";
import { clamp01 } from "../lib/motion/easing";

export const CertificateCabinet: React.FC = () => {
  const [selected, setSelected] = useState<CertificationItem | null>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setSelected(null), []);

  // Header drifts slower than the page and fades in as the background darkens behind it.
  useFrame(() => {
    const intro = introRef.current;
    const header = headerRef.current;
    if (!intro || !header) return;
    const r = intro.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < -vh || r.top > vh * 1.5) return;
    const t = clamp01((vh - r.top) / (r.height + vh * 0.2));
    header.style.transform = `translate3d(0, ${(0.5 - t) * 140}px, 0)`;
    header.style.opacity = String(clamp01((t - 0.18) * 2.4));
  });

  return (
    <section className="cert-cabinet-section" id="certifications">
      <div className="cert-cabinet-intro" ref={introRef}>
        <div className="cert-cabinet-header" ref={headerRef}>
          <span className="lofty-tag">CERTIFICATIONS</span>
          <h2>Always learning.</h2>
          <p>
            {ALL_CERTS.length} certificates from IBM, Google, AWS, and the University of Michigan, filed by
            subject. Scroll to pull each drawer open; click any certificate to view it.
          </p>
        </div>
      </div>

      <FilingCabinet runwayHeight="520vh" className="cab-stage--site" showIndex={false} onInspect={setSelected} />

      <CertificateDetailLightbox cert={selected} onClose={close} />
    </section>
  );
};
