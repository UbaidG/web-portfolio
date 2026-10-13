import React, { useEffect } from "react";
import type { CertificationItem } from "../data/portfolioData";

interface CertificateDetailLightboxProps {
  cert: CertificationItem | null;
  onClose: () => void;
}

export const CertificateDetailLightbox: React.FC<CertificateDetailLightboxProps> = ({ cert, onClose }) => {
  useEffect(() => {
    if (!cert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cert, onClose]);

  if (!cert) return null;

  return (
    <div className="cert-lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cert-lightbox-card" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close-btn" onClick={onClose} aria-label="Close certificate">
          ✕
        </button>

        <div className="lightbox-content-grid">
          <div className="lightbox-frame-view">
            {cert.image ? (
              <img src={`${import.meta.env.BASE_URL}${cert.image}`} alt={cert.name} className="lightbox-full-img" />
            ) : (
              <div className="lightbox-no-img">No preview available</div>
            )}
          </div>

          <div className="lightbox-details-col">
            <span className="lightbox-category-tag">{cert.category || "Certificate"}</span>

            <h3 className="lightbox-title">{cert.name}</h3>

            <div className="lightbox-meta-list">
              <div className="meta-row">
                <span className="meta-label">Issued By</span>
                <strong className="meta-val">{cert.issuer}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">Date Completed</span>
                <strong className="meta-val">{cert.date}</strong>
              </div>
              {cert.category && (
                <div className="meta-row">
                  <span className="meta-label">Domain</span>
                  <strong className="meta-val">{cert.category}</strong>
                </div>
              )}
            </div>

            <div className="lightbox-actions-row">
              {cert.pdfUrl && (
                <a
                  href={`${import.meta.env.BASE_URL}${cert.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="lofty-btn-solid"
                >
                  View PDF <span className="btn-arrow-icon">↗</span>
                </a>
              )}
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="lofty-btn-outline">
                  Verify on Coursera <span className="btn-arrow-icon">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
