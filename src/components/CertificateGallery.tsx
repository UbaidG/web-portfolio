import React from "react";
import type { CertificationItem } from "../data/portfolioData";
import { CERT_GROUPS } from "../data/certGroups";
import { asset } from "../lib/asset";

interface CertificateGalleryProps {
  onInspect: (cert: CertificationItem) => void;
}

export const CertificateGallery: React.FC<CertificateGalleryProps> = ({ onInspect }) => (
  <div className="cert-gallery-mobile" role="region" aria-label="Certificates by subject">
    {CERT_GROUPS.map((group) => {
      const headingId = `cert-gallery-${group.key}`;

      return (
        <section className="cert-gallery-group" key={group.key} aria-labelledby={headingId}>
          <h3 id={headingId}>{group.label}</h3>
          <div className="cert-gallery-grid">
            {group.certs.map((cert) => (
              <button
                key={cert.id ?? cert.name}
                type="button"
                className="cert-gallery-card"
                aria-label={`View certificate: ${cert.name}`}
                onClick={() => onInspect(cert)}
              >
                {cert.image ? (
                  <img src={asset(cert.image)} alt={cert.name} loading="lazy" draggable={false} />
                ) : (
                  <span className="cert-gallery-missing">{cert.name}</span>
                )}
              </button>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);
