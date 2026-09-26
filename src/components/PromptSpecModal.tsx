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
    navigator.clipboard.writeText(spec.promptText);
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
        className="prompt-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="prompt-modal-header">
          <div>
            <span className="prompt-modal-badge">Video & Asset Direction</span>
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

          {/* Keyframes Comparison */}
          <div className="prompt-modal-keyframes">
            <div className="keyframe-card">
              <div className="keyframe-tag">Start Frame (0.0s)</div>
              <img
                src={spec.startFrameUrl}
                alt="Start frame of espresso cup"
                className="keyframe-img"
              />
              <p className="keyframe-desc">{spec.startFrameDescription}</p>
            </div>
            <div className="keyframe-arrow">→</div>
            <div className="keyframe-card">
              <div className="keyframe-tag">End Frame (5.0s / Cascade)</div>
              <img
                src={spec.endFrameUrl}
                alt="End frame of overflowing espresso"
                className="keyframe-img"
              />
              <p className="keyframe-desc">{spec.endFrameDescription}</p>
            </div>
          </div>

          {/* Master Prompt Box */}
          <div className="prompt-box-section">
            <div className="prompt-box-header">
              <span className="prompt-box-label">Master Prompt (Copy & Paste for Video AI)</span>
              <button
                className={`prompt-copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyPrompt}
              >
                {copied ? "✓ Copied to Clipboard" : "Copy Prompt"}
              </button>
            </div>
            <pre className="prompt-text-block">{spec.promptText}</pre>
          </div>

          {/* Technical Specs Grid */}
          <div className="prompt-specs-grid">
            <div className="spec-card">
              <h4>🎥 Camera & Optics</h4>
              <ul>
                <li><strong>Lens:</strong> {spec.cameraSetup.lens}</li>
                <li><strong>Focal Length:</strong> {spec.cameraSetup.focalLength}</li>
                <li><strong>Aperture:</strong> {spec.cameraSetup.aperture}</li>
                <li><strong>Angle:</strong> {spec.cameraSetup.angle}</li>
                <li><strong>Motion:</strong> {spec.cameraSetup.motion}</li>
                <li><strong>Capture:</strong> {spec.cameraSetup.framerate}</li>
              </ul>
            </div>

            <div className="spec-card">
              <h4>💡 Studio Lighting</h4>
              <ul>
                <li><strong>Key Light:</strong> {spec.lightingSetup.keyLight}</li>
                <li><strong>Rim Light:</strong> {spec.lightingSetup.rimLight}</li>
                <li><strong>Ambient Fill:</strong> {spec.lightingSetup.ambient}</li>
                <li><strong>Temperature:</strong> {spec.lightingSetup.temperature}</li>
                <li><strong>Atmosphere:</strong> {spec.lightingSetup.volumetric}</li>
              </ul>
            </div>

            <div className="spec-card">
              <h4>🎨 Art & Room Direction</h4>
              <ul>
                <li><strong>Plinth Surface:</strong> {spec.environmentAesthetics.surface}</li>
                <li><strong>Backdrop:</strong> {spec.environmentAesthetics.backdrop}</li>
                <li><strong>Ceramicware:</strong> {spec.environmentAesthetics.propDetails}</li>
                <li><strong>Compatible Engines:</strong> {spec.suggestedTools.join(", ")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
