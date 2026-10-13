import React from "react";

/**
 * Procedural vector illustrations for the project showcase preview media slots.
 *
 * NOTE FOR USER:
 * These act as high-fidelity interactive fallbacks.
 * When you provide custom assets for [ASSET GAP 3],
 * you can drop your SVG/PNG files into /public/designs/ and reference them.
 */

// --------------------------------------------------------------------------
// [ASSET GAP 3]: Project Showcase Procedural Preview Media Slots
// --------------------------------------------------------------------------

interface ProjectPreviewProps {
  projectId: string;
  category: string;
  title: string;
  tech?: string[];
}

export const ProjectPreviewMedia: React.FC<ProjectPreviewProps> = ({
  projectId,
  category,
  title,
  tech = [],
}) => {
  return (
    <div className="work-preview-container" title={`${title} preview`}>
      {/* Top Header Bar with status dots */}
      <div className="preview-top-bar">
        <div className="preview-traffic-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <span className="preview-slot-badge">
          ~/{projectId}
        </span>
      </div>

      {/* Procedural Visualizer Canvas */}
      <div className="preview-visualizer-canvas">
        {projectId === "voice-agent" && (
          <div className="viz-voice-wave">
            <svg viewBox="0 0 320 100" fill="none" className="viz-svg">
              {/* Dynamic waveform lines */}
              <path
                d="M10 50 Q 40 10, 70 50 T 130 50 T 190 20 T 250 80 T 310 50"
                stroke="#e27338"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M10 50 Q 50 80, 90 50 T 170 30 T 230 65 T 310 50"
                stroke="#2b5641"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />
              {/* Frequency bars */}
              {[25, 45, 75, 55, 90, 65, 40, 85, 95, 60, 35, 70].map((h, i) => (
                <rect
                  key={i}
                  x={40 + i * 20}
                  y={50 - h / 2}
                  width="4"
                  height={h}
                  rx="2"
                  fill={i % 2 === 0 ? "#e27338" : "#2b5641"}
                  opacity="0.8"
                />
              ))}
            </svg>
            <div className="viz-footer-label">
              <span>● LiveKit WebRTC</span>
              <span>Deepgram STT</span>
              <span>Cartesia TTS</span>
            </div>
          </div>
        )}

        {projectId === "stitchit" && (
          <div className="viz-vision-grid">
            <svg viewBox="0 0 320 100" fill="none" className="viz-svg">
              {/* Swin Transformer hierarchical window grids */}
              {[0, 1, 2, 3].map((row) =>
                [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={20 + col * 35}
                    y={12 + row * 20}
                    width="28"
                    height="16"
                    rx="3"
                    fill={
                      (row + col) % 3 === 0
                        ? "#e27338"
                        : (row + col) % 2 === 0
                          ? "#2b5641"
                          : "#f3ede3"
                    }
                    opacity="0.85"
                  />
                ))
              )}
              {/* Feature vectors connection */}
              <circle cx="160" cy="50" r="26" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              <circle cx="160" cy="50" r="16" fill="#1b1411" />
              <text x="160" y="54" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                MATCH
              </text>
            </svg>
            <div className="viz-footer-label">
              <span>● Swin Transformer</span>
              <span>PANNs Audio</span>
              <span>Neo4j Graph</span>
            </div>
          </div>
        )}

        {projectId === "genai-dashboard" && (
          <div className="viz-sql-pipeline">
            <svg viewBox="0 0 320 100" fill="none" className="viz-svg">
              {/* Natural Language Prompt -> SQL Query Node -> Masked NER */}
              <rect x="20" y="28" width="75" height="42" rx="8" fill="#2b5641" />
              <text x="57" y="47" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                NL Query
              </text>
              <text x="57" y="59" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7">
                Text Input
              </text>

              <line x1="95" y1="49" x2="125" y2="49" stroke="#e27338" strokeWidth="2" markerEnd="url(#arrow)" />

              <rect x="125" y="24" width="80" height="50" rx="8" fill="#e27338" />
              <text x="165" y="46" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                SQL Gen
              </text>
              <text x="165" y="58" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="7">
                OpenAI
              </text>

              <line x1="205" y1="49" x2="235" y2="49" stroke="#e27338" strokeWidth="2" />

              <rect x="235" y="28" width="70" height="42" rx="8" fill="#1b1411" stroke="#ffffff" strokeWidth="1.5" />
              <text x="270" y="47" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                PHI Masked
              </text>
              <text x="270" y="59" textAnchor="middle" fill="#e27338" fontSize="7">
                HF NER
              </text>
            </svg>
            <div className="viz-footer-label">
              <span>● Text-to-SQL</span>
              <span>NER Privacy</span>
              <span>Auto Charting</span>
            </div>
          </div>
        )}

        {projectId !== "voice-agent" &&
          projectId !== "stitchit" &&
          projectId !== "genai-dashboard" && (
            <div className="viz-generic-pipeline">
              <svg viewBox="0 0 320 100" fill="none" className="viz-svg">
                {/* Node graph representation */}
                <circle cx="60" cy="50" r="18" fill="#2b5641" />
                <circle cx="160" cy="30" r="16" fill="#e27338" />
                <circle cx="160" cy="70" r="16" fill="#1b1411" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="260" cy="50" r="20" fill="#e27338" />

                <line x1="78" y1="50" x2="144" y2="30" stroke="#c4b5aa" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="78" y1="50" x2="144" y2="70" stroke="#c4b5aa" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="176" y1="30" x2="240" y2="50" stroke="#c4b5aa" strokeWidth="2" />
                <line x1="176" y1="70" x2="240" y2="50" stroke="#c4b5aa" strokeWidth="2" />

                <text x="60" y="54" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  DATA
                </text>
                <text x="160" y="34" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  MODEL
                </text>
                <text x="160" y="74" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  EVAL
                </text>
                <text x="260" y="54" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  DEPLOY
                </text>
              </svg>
              <div className="viz-footer-label">
                <span>● {category}</span>
                {tech.slice(0, 2).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
