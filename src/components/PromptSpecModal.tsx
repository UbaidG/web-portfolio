import React, { useState } from "react";
import { COFFEE_OVERFLOW_VIDEO_SPEC } from "../data/videoPromptSpec";

interface PromptSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptSpecModal: React.FC<PromptSpecModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const spec = COFFEE_OVERFLOW_VIDEO_SPEC;

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(spec.masterPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="prompt-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spec-modal-title"
      onClick={onClose}
    >
      <div
        className="prompt-modal-panel prompt-modal-panel--v2"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="prompt-modal-header">
          <div>
            <span className="prompt-modal-badge">
              4-Frame Video & Camera Direction (White Stone & Pan Down)
            </span>
            <h2 id="spec-modal-title">{spec.title}</h2>
          </div>
          <button
            className="prompt-modal-close"
            onClick={onClose}
            aria-label="Close specification modal"
          >
            ✕
          </button>
        </header>

        <div className="prompt-modal-content">
          <p className="prompt-modal-concept">{spec.concept}</p>

          {/* 4-Frame Sequence Showcase */}
          <div className="prompt-modal-four-frames">
            <div className="four-frames-header">
              <span className="frames-heading">4 Keyframe Stills Sequence</span>
              <span className="frames-note">
                Static camera during fill (Frames 1-2) → Pan-down initiates ONLY on stone flow (Frames 3-4)
              </span>
            </div>

            <div className="four-frames-grid">
              {spec.keyframes.map((frame) => (
                <div className="four-frame-card" key={frame.number}>
                  <div className="four-frame-top">
                    <span className="frame-num-pill">Frame 0{frame.number}</span>
                    <span className="frame-time-pill">{frame.timecode}</span>
                  </div>
                  <div className="four-frame-img-box">
                    <img
                      src={frame.imageUrl}
                      alt={frame.phase}
                      className="four-frame-img"
                    />
                  </div>
                  <h4 className="four-frame-phase">{frame.phase}</h4>
                  <p className="four-frame-desc">{frame.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Master Prompt Box */}
          <div className="prompt-box-section">
            <div className="prompt-box-header">
              <div>
                <span className="prompt-box-label">
                  New Improved Master Prompt (White Stone + Synchronized Pan Down)
                </span>
                <span className="prompt-box-sub">
                  Copy & paste into Sora, Runway Gen-3, Kling 1.5, or Luma Dream Machine
                </span>
              </div>
              <button
                className={`prompt-copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyPrompt}
              >
                {copied ? "✓ Copied to Clipboard" : "Copy Master Prompt"}
              </button>
            </div>
            <pre className="prompt-text-block">{spec.masterPromptText}</pre>
          </div>

          {/* Technical Specs Grid */}
          <div className="prompt-specs-grid">
            <div className="spec-card">
              <h4>🎥 Camera & Synchronized Pan-Down</h4>
              <ul>
                <li><strong>Lens:</strong> {spec.cameraSetup.lens}</li>
                <li><strong>Focal Length:</strong> {spec.cameraSetup.focalLength}</li>
                <li><strong>Aperture:</strong> {spec.cameraSetup.aperture}</li>
                <li><strong>Initial Angle:</strong> {spec.cameraSetup.angle}</li>
                <li><strong>Pan-Down Rule:</strong> {spec.cameraSetup.panDownMotion}</li>
                <li><strong>Capture Speed:</strong> {spec.cameraSetup.framerate}</li>
              </ul>
            </div>

            <div className="spec-card">
              <h4>💡 High-Key Studio Lighting</h4>
              <ul>
                <li><strong>Key Light:</strong> {spec.lightingSetup.keyLight}</li>
                <li><strong>Fill Light:</strong> {spec.lightingSetup.fillLight}</li>
                <li><strong>Ambient Fill:</strong> {spec.lightingSetup.ambient}</li>
                <li><strong>Color Temp:</strong> {spec.lightingSetup.temperature}</li>
                <li><strong>Atmosphere:</strong> {spec.lightingSetup.volumetric}</li>
              </ul>
            </div>

            <div className="spec-card">
              <h4>🏛️ White Stone & Website Transition</h4>
              <ul>
                <li><strong>Plinth Surface:</strong> {spec.environmentAesthetics.plinthSurface}</li>
                <li><strong>Teapot:</strong> {spec.environmentAesthetics.teapot}</li>
                <li><strong>Cup:</strong> {spec.environmentAesthetics.cup}</li>
                <li><strong>Seamless White:</strong> {spec.environmentAesthetics.websiteTransition}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
