import React, { useState, useEffect } from "react";
import { portfolioData, CertificationItem } from "../data/portfolioData";

export const CertificateWallGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = [
    { label: "All Accreditations", key: "All" },
    { label: "AI & Deep Learning", key: "AI & ML" },
    { label: "Cloud & ML Systems", key: "Cloud & Architecture" },
    { label: "Project Management", key: "Project Management" },
    { label: "Foundations", key: "Foundations" },
  ];

  const filteredCerts = portfolioData.certifications.filter((cert) => {
    if (activeCategory === "All") return true;
    return cert.category === activeCategory;
  });

  // Pre-calculated organic resting tilt angles for the salon wall feel
  const restAngles = [-1.4, 1.2, -0.8, 1.6, -1.8, 0.6, -1.1, 1.5, -0.7, 1.3, -1.6, 0.9];

  return (
    <section className="cert-wall-section" id="certifications">
      {/* Studio Lighting Wall Header */}
      <div className="cert-wall-header">
        <span className="lofty-tag">ACCREDITATIONS & RECOGNITION</span>
        <h2 className="cert-wall-title">The Credentials Gallery Wall</h2>
        <p className="cert-wall-subtitle">
          Official machine learning specializations, cloud systems, and professional management degrees hung in
          artisanal walnut frames. Hover over any frame to interact with the hanging suspension, or click to inspect.
        </p>

        {/* Category Filter Pills */}
        <div className="cert-wall-filters">
          {categories.map((cat) => {
            const count =
              cat.key === "All"
                ? portfolioData.certifications.length
                : portfolioData.certifications.filter((c) => c.category === cat.key).length;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                className={`cert-filter-pill ${isActive ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span>{cat.label}</span>
                <span className="filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Artisanal Gallery Wall Container with Picture Rail */}
      <div className="cert-wall-gallery-container">
        {/* Brass Hanging Rail */}
        <div className="cert-wall-rail" aria-hidden="true">
          <div className="rail-rod" />
          <div className="rail-finial left" />
          <div className="rail-finial right" />
        </div>

        {/* Gallery Grid */}
        <div className="cert-wall-grid">
          {filteredCerts.map((cert, idx) => {
            const restAngle = restAngles[idx % restAngles.length];
            const baseUrl = import.meta.env.BASE_URL;
            const thumbUrl = cert.image ? `${baseUrl}${cert.image}` : "";

            return (
              <div
                className="cert-frame-wrapper"
                key={cert.name}
                style={{ "--rest-rot": `${restAngle}deg` } as React.CSSProperties}
              >
                {/* Brass Mounting Pin & Braided Hanging Cords */}
                <div className="frame-mount">
                  <div className="mount-nail-pin" />
                  <div className="mount-cord cord--left" />
                  <div className="mount-cord cord--right" />
                </div>

                {/* The Suspended Wooden Picture Frame */}
                <div
                  className="cert-picture-frame"
                  onClick={() => setSelectedCert(cert)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View certificate for ${cert.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedCert(cert);
                    }
                  }}
                >
                  {/* Passe-Partout Matting */}
                  <div className="frame-matting">
                    {/* Inner Certificate Artwork / Preview */}
                    <div className="frame-artwork-slot">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={cert.name}
                          className="cert-thumb-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="cert-thumb-fallback">
                          <span className="fallback-issuer">{cert.issuer}</span>
                          <span className="fallback-name">{cert.name}</span>
                        </div>
                      )}
                      {/* Glass Sheen Reflection */}
                      <div className="frame-glass-sheen" />
                      {/* Hover Hint Overlay */}
                      <div className="frame-inspect-overlay">
                        <span className="inspect-pill">Inspect Credential ↗</span>
                      </div>
                    </div>
                  </div>

                  {/* Brass Engraved Museum Plaque */}
                  <div className="frame-museum-plaque">
                    <div className="plaque-top">
                      <span className="plaque-issuer">{cert.issuer}</span>
                      <span className="plaque-date">{cert.date}</span>
                    </div>
                    <h4 className="plaque-title" title={cert.name}>
                      {cert.name}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Detailed Inspection */}
      {selectedCert && (
        <div
          className="cert-lightbox-backdrop"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cert-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedCert(null)}
              aria-label="Close certificate inspection modal"
            >
              ✕
            </button>

            <div className="lightbox-content-grid">
              {/* Full Image in Gallery Frame */}
              <div className="lightbox-frame-view">
                {selectedCert.image ? (
                  <img
                    src={`${import.meta.env.BASE_URL}${selectedCert.image}`}
                    alt={selectedCert.name}
                    className="lightbox-full-img"
                  />
                ) : (
                  <div className="lightbox-no-img">No preview available</div>
                )}
              </div>

              {/* Certificate Details Column */}
              <div className="lightbox-details-col">
                <span className="lightbox-category-tag">
                  {selectedCert.category || "Official Accreditation"}
                </span>

                <h3 className="lightbox-title">{selectedCert.name}</h3>

                <div className="lightbox-meta-list">
                  <div className="meta-row">
                    <span className="meta-label">Issued By</span>
                    <strong className="meta-val">{selectedCert.issuer}</strong>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Date Completed</span>
                    <strong className="meta-val">{selectedCert.date}</strong>
                  </div>
                  {selectedCert.category && (
                    <div className="meta-row">
                      <span className="meta-label">Domain</span>
                      <strong className="meta-val">{selectedCert.category}</strong>
                    </div>
                  )}
                </div>

                <div className="lightbox-actions-row">
                  {selectedCert.pdfUrl && (
                    <a
                      href={`${import.meta.env.BASE_URL}${selectedCert.pdfUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="lofty-btn-solid"
                    >
                      Open PDF Document <span className="btn-arrow-icon">↗</span>
                    </a>
                  )}
                  {selectedCert.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="lofty-btn-outline"
                    >
                      Verify on Coursera <span className="btn-arrow-icon">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
