import React from "react";

/**
 * Procedural vector illustrations for Loftylab-inspired process stickers
 * and project showcase preview media slots.
 *
 * NOTE FOR USER:
 * These act as high-fidelity interactive fallbacks.
 * When you provide custom assets for [ASSET GAP 2] and [ASSET GAP 3],
 * you can drop your SVG/PNG files into /public/designs/ and reference them.
 */

// --------------------------------------------------------------------------
// [ASSET GAP 2]: 3 Roasting Pipeline Centerpiece Sticker SVGs
// --------------------------------------------------------------------------

export const SourcingStickerIcon: React.FC = () => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "54px", height: "54px" }}
    aria-label="Data and system design"
  >
    {/* Chemex Pour-over outline */}
    <path
      d="M26 14H54L46 36L58 64C59.5 67.5 56.5 70 53 70H27C23.5 70 20.5 67.5 22 64L34 36L26 14Z"
      stroke="#1b1411"
      strokeWidth="3"
      strokeLinejoin="round"
      fill="#fdfbf7"
    />
    {/* Wood collar & tie */}
    <rect x="31" y="33" width="18" height="7" rx="2" fill="#e27338" />
    <line x1="40" y1="40" x2="40" y2="47" stroke="#b84c14" strokeWidth="2" strokeLinecap="round" />
    {/* Liquid level */}
    <path
      d="M25 56C30 54 50 54 55 56L57 63C57.5 65 56 67 54 67H26C24 67 22.5 65 23 63L25 56Z"
      fill="#2b5641"
      opacity="0.3"
    />
    {/* Graph network nodes radiating */}
    <line x1="40" y1="20" x2="30" y2="28" stroke="#2b5641" strokeWidth="2" strokeDasharray="2 2" />
    <line x1="40" y1="20" x2="50" y2="28" stroke="#2b5641" strokeWidth="2" strokeDasharray="2 2" />
    <circle cx="40" cy="20" r="3.5" fill="#2b5641" />
    <circle cx="30" cy="28" r="3" fill="#e27338" />
    <circle cx="50" cy="28" r="3" fill="#e27338" />
    {/* Fresh coffee leaf */}
    <path
      d="M50 12C57 10 62 16 60 22C54 22 49 18 50 12Z"
      fill="#2b5641"
      stroke="#1b1411"
      strokeWidth="1.5"
    />
  </svg>
);

export const ExtractionStickerIcon: React.FC = () => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "54px", height: "54px" }}
    aria-label="Real-time AI"
  >
    {/* Espresso Portafilter Handle */}
    <rect x="10" y="32" width="22" height="7" rx="3.5" fill="#1b1411" stroke="#1b1411" strokeWidth="2" />
    {/* Portafilter Basket */}
    <path
      d="M32 27H62L58 45C57.5 48 55 50 52 50H42C39 50 36.5 48 36 45L32 27Z"
      fill="#fdfbf7"
      stroke="#1b1411"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Ears / Wings */}
    <rect x="29" y="27" width="5" height="4" rx="1" fill="#e27338" />
    <rect x="60" y="27" width="5" height="4" rx="1" fill="#e27338" />
    {/* Golden Crema Droplet */}
    <path
      d="M47 54C47 54 43 59 43 62C43 64.2 44.8 66 47 66C49.2 66 51 64.2 51 62C51 59 47 54 47 54Z"
      fill="#e27338"
    />
    {/* Lightning Bolt / Speed Flash */}
    <path
      d="M62 14L53 26H59L50 40L64 24H57L62 14Z"
      fill="#e27338"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Sound wave arcs */}
    <path
      d="M65 48C68 51 68 56 65 59"
      stroke="#2b5641"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M69 44C74 49 74 61 69 66"
      stroke="#2b5641"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

export const CuppingStickerIcon: React.FC = () => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "54px", height: "54px" }}
    aria-label="MLOps and quality"
  >
    {/* Cupping Tasting Bowl */}
    <path
      d="M20 38C20 38 22 62 40 62C58 62 60 38 60 38H20Z"
      fill="#fdfbf7"
      stroke="#1b1411"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Coffee brew liquid inside bowl */}
    <ellipse cx="40" cy="40" rx="18" ry="5" fill="#3d281d" />
    <ellipse cx="40" cy="40" rx="12" ry="2.5" fill="#c4682c" opacity="0.6" />
    {/* Silver Cupping Spoon resting across */}
    <path
      d="M16 26L38 42C40 43.5 43 43 44 41C45 39 44 37 42 35.5L20 20C17 18 14 20 14 22C14 24 15 25 16 26Z"
      fill="#e27338"
      stroke="#1b1411"
      strokeWidth="2"
    />
    {/* Radar Evaluation / Gauge Arc */}
    <path
      d="M25 24C29 18 36 15 44 15C55 15 64 22 67 32"
      stroke="#2b5641"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="3 3"
    />
    <circle cx="44" cy="15" r="3" fill="#2b5641" />
    <circle cx="67" cy="32" r="3" fill="#e27338" />
    {/* 99.2% Quality Star */}
    <path
      d="M48 24L50 20L52 24L56 25L53 28L54 32L50 30L46 32L47 28L44 25L48 24Z"
      fill="#e27338"
    />
  </svg>
);

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
