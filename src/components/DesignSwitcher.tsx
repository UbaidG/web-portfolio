import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, Info, Check, ExternalLink } from "lucide-react";

export interface DesignOption {
  id: number;
  title: string;
  tagline: string;
  badge: string;
  scrollEffect: string;
  threeFeature: string;
  palette: string;
  accent: string;
}

export const DESIGN_OPTIONS: DesignOption[] = [
  {
    id: 1,
    title: "Kinetic Atelier",
    tagline: "Fluid Editorial & Kinetic Skew",
    badge: "Lusion / Oryzo Vibe",
    scrollEffect: "Inertial velocity skewing + magnetic depth parallax + ticker ribbons",
    threeFeature: "Three.js interactive fluid undulating ribbon mesh with specular glass refraction",
    palette: "Deep obsidian, crisp ivory, and electric tangerine (#ff5500)",
    accent: "#ff5500",
  },
  {
    id: 2,
    title: "Cyber Terminal",
    tagline: "Autonomous Agent Telemetry HUD",
    badge: "Sci-Fi HUD & Scanlines",
    scrollEffect: "Camera perspective depth rush + diagnostic viewport crosshair locking",
    threeFeature: "Interactive 3D wireframe tensor hyper-lattice morphing topology across sections",
    palette: "Pitch black (#07080c), radioactive emerald (#00ff9d), and cyan telemetry (#00e5ff)",
    accent: "#00ff9d",
  },
  {
    id: 3,
    title: "Swiss Blueprint",
    tagline: "Architectural Systems & CAD Grid",
    badge: "Bauhaus / Vignelli Modernism",
    scrollEffect: "Horizontal runway orthographic CAD slide & lock with snapping dimension lines",
    threeFeature: "3D isometric wireframe MLOps cluster architecture with dynamic shadow casting",
    palette: "Deep drafting slate (#0b111e), blueprint grid, crisp white, and safety orange (#ff6b35)",
    accent: "#38bdf8",
  },
  {
    id: 4,
    title: "Ethereal Aurora",
    tagline: "Organic Silicon & Bioluminescent Waves",
    badge: "Liquid Glass & Caustics",
    scrollEffect: "Liquid glass morphing + scroll-driven wave interference + chromatic dispersion",
    threeFeature: "Custom WebGL procedural caustic noise shader undulating with cursor & scroll",
    palette: "Velvet midnight, soft peach, iridescent lilac (#c084fc), and mint glow (#2dd4bf)",
    accent: "#c084fc",
  },
  {
    id: 5,
    title: "Analog Archive",
    tagline: "1970s Braun / Vintage Bell Labs Telemetry",
    badge: "Dieter Rams & CRT Telemetry",
    scrollEffect: "Reel-to-reel magnetic tape feed + tactile stepping snaps + CRT scanlines",
    threeFeature: "3D mechanical analog compute gyroscope with matte materials spinning on scroll delta",
    palette: "Industrial matte charcoal (#121110), warm bone white, and phosphor amber (#f59e0b)",
    accent: "#f59e0b",
  },
  {
    id: 6,
    title: "Spatial Gallery",
    tagline: "Minimalist Luxury Exhibition & Z-Dolly",
    badge: "Spatial Museum Retrospective",
    scrollEffect: "3D Z-axis camera dolly along corridor spline + rotating glass project plinths",
    threeFeature: "Full Three.js spatial gallery hall with volumetric lighting shafts & pedestals",
    palette: "Pitch void (#000000), stark gallery spotlights, champagne gold (#e2d4b7), platinum",
    accent: "#e2d4b7",
  },
];

interface DesignSwitcherProps {
  currentDesign: number;
  onSelectDesign: (id: number) => void;
}

export function DesignSwitcher({ currentDesign, onSelectDesign }: DesignSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Keyboard shortcut listener (1..6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        onSelectDesign(num);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectDesign]);

  const activeOption = DESIGN_OPTIONS.find((d) => d.id === currentDesign) || DESIGN_OPTIONS[0];

  return (
    <>
      {/* Floating Pill Bar */}
      <aside aria-label="Portfolio design switcher" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-auto max-w-[95vw]">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          {/* Main button opening switcher list */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white transition-all text-xs font-mono font-medium"
            title="Click to view all 6 design options"
          >
            <Layers size={14} className="text-white/80" />
            <span className="hidden sm:inline text-white/50">Design:</span>
            <span className="font-semibold text-white">
              #{activeOption.id} {activeOption.title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/90">
              {isOpen ? "Close" : "Switch (1-6)"}
            </span>
          </button>

          {/* Quick 1-6 selector buttons */}
          <div className="flex items-center gap-1">
            {DESIGN_OPTIONS.map((opt) => {
              const isActive = opt.id === currentDesign;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectDesign(opt.id)}
                  className={`relative w-8 h-8 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                  style={isActive ? { backgroundColor: opt.accent, color: "#000" } : {}}
                  title={`[${opt.id}] ${opt.title} — ${opt.tagline}`}
                >
                  {opt.id}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Info toggle button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              showInfo ? "bg-white/20 text-white" : "text-white/40 hover:text-white hover:bg-white/10"
            }`}
            title="Design specifications & architectural critique"
          >
            <Info size={15} />
          </button>
        </div>
      </aside>

      {/* Expanded Design Picker Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[101] w-[92vw] max-w-4xl p-5 rounded-2xl bg-[#0d0d12]/95 backdrop-blur-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  Select from 6 Radical Portfolio Designs
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Each design features distinct typography, color palette, custom Three.js 3D elements, and unique scroll choreography. Press keys 1-6 anytime.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80"
              >
                Done
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DESIGN_OPTIONS.map((opt) => {
                const isCurrent = opt.id === currentDesign;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectDesign(opt.id);
                      setIsOpen(false);
                    }}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${
                      isCurrent
                        ? "bg-white/[0.08] border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.06)] ring-1 ring-white/30"
                        : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${opt.accent}20`,
                            color: opt.accent,
                            border: `1px solid ${opt.accent}40`,
                          }}
                        >
                          #{opt.id} {opt.badge}
                        </span>
                        {isCurrent && <Check size={16} className="text-emerald-400" />}
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-white/60 mt-1 font-medium">{opt.tagline}</p>

                      <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1.5 text-[11px]">
                        <p className="text-white/45">
                          <span className="text-white/70 font-medium">Scroll:</span> {opt.scrollEffect}
                        </p>
                        <p className="text-white/45">
                          <span className="text-white/70 font-medium">3D:</span> {opt.threeFeature}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/[0.04]">
                      <span>Press &apos;{opt.id}&apos; to activate</span>
                      <span className="group-hover:translate-x-1 transition-transform text-white/70 font-mono">
                        Select &rarr;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[101] w-[90vw] max-w-md p-5 rounded-2xl bg-[#0d0d12]/95 backdrop-blur-3xl border border-white/15 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Info size={15} className="text-cyan-400" />
                Active Design: #{activeOption.id} {activeOption.title}
              </h4>
              <button
                onClick={() => setShowInfo(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/70">
              <div>
                <span className="font-semibold text-white/90">Creative Concept:</span>
                <p className="mt-0.5 text-white/60">{activeOption.tagline}</p>
              </div>
              <div>
                <span className="font-semibold text-white/90">Scroll Physics:</span>
                <p className="mt-0.5 text-white/60">{activeOption.scrollEffect}</p>
              </div>
              <div>
                <span className="font-semibold text-white/90">3D WebGL / Shader Engine:</span>
                <p className="mt-0.5 text-white/60">{activeOption.threeFeature}</p>
              </div>
              <div>
                <span className="font-semibold text-white/90">Curated Palette:</span>
                <p className="mt-0.5 text-white/60">{activeOption.palette}</p>
              </div>
              <div className="pt-2 border-t border-white/10 text-[11px] text-white/50 flex justify-between items-center">
                <span>Updated with Aug 2026 Resume</span>
                <a
                  href={PORTFOLIO_DATA.personal.resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  Resume PDF <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Needed for the modal link
import { PORTFOLIO_DATA } from "../data/portfolioData";
