import React, { useEffect } from "react";
import { CertificationItem } from "../../data/portfolioData";

interface CertificateLightboxProps {
  cert: CertificationItem | null;
  onClose: () => void;
}

export const CertificateLightbox: React.FC<CertificateLightboxProps> = ({ cert, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!cert) return null;

  return (
    <div className="lab-lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lab-lightbox-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="lab-lightbox-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="lab-lightbox-body">
          <div className="lab-lightbox-image-container">
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.name}
                className="lab-lightbox-img"
              />
            ) : (
              <div className="lab-lightbox-placeholder">
                <span className="lab-placeholder-crest">📜</span>
                <span>{cert.name}</span>
              </div>
            )}
          </div>

          <div className="lab-lightbox-details">
            <div className="lab-lightbox-badges">
              <span className="lab-badge-issuer">{cert.issuer}</span>
              {cert.category && <span className="lab-badge-cat">{cert.category}</span>}
              <span className="lab-badge-date">{cert.date}</span>
            </div>

            <h3 className="lab-lightbox-title">{cert.name}</h3>

            <p className="lab-lightbox-desc">
              Verified credential issued by <strong>{cert.issuer}</strong> ({cert.date}). Demonstrates proficiency
              in {cert.category || "applied computing and engineering"}.
            </p>

            <div className="lab-lightbox-actions">
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="lab-btn lab-btn--primary"
                >
                  Verify Credential ↗
                </a>
              )}
              {cert.pdfUrl && (
                <a
                  href={cert.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="lab-btn lab-btn--secondary"
                >
                  View Official PDF ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
