import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, Info, Check, ExternalLink } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

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
    title: "Space Odyssey",
    tagline: "Deep Space Station & Mission Telemetry",
    badge: "Theme: Space",
    scrollEffect: "Orbital gravity trajectory + telemetry HUD mission sync",
    threeFeature: "3D DamagedHelmet astronaut helmet tumbling down center + asteroid debris swarm",
    palette: "Deep space void (#030712), neon cyan (#22d3ee), starlight white",
    accent: "#22d3ee",
  },
  {
    id: 2,
    title: "Casino Royale",
    tagline: "Monte Carlo High-Roller & Playing Cards",
    badge: "Theme: Casino",
    scrollEffect: "Physical chip roll & wobble down center + playing card deal reveal",
    threeFeature: "Heavy 3D gold-embossed casino chip + cascading poker chip & dice swarm",
    palette: "Casino baize green (#06140e), gold bullion (#f59e0b), neon scarlet",
    accent: "#f59e0b",
  },
  {
    id: 3,
    title: "Cyber Arcana",
    tagline: "Holographic Tarot Deck of AI Architectures",
    badge: "Theme: Cards",
    scrollEffect: "Card fan 3D spline + arcana reveal on scroll progress",
    threeFeature: "3D thick holographic tarot card with gold edges + floating card suits swarm",
    palette: "Mystic obsidian (#07060b), radiant gold (#eab308), deep violet",
    accent: "#eab308",
  },
  {
    id: 4,
    title: "Oryzo Coaster & Beans",
    tagline: "Exact Oryzo.ai Tumbling Coaster & Coffee Bean Swarm",
    badge: "Theme: Oryzo.ai",
    scrollEffect: "Vertical coaster tumble & wobble + side-by-side 5-star reviews matching screenshot",
    threeFeature: "Procedural 3D cork coaster + river of 3D roasted coffee beans deflecting on cursor",
    palette: "Warm espresso (#140e0a), roasted caramel (#ea580c), cream (#f7efe6)",
    accent: "#ea580c",
  },
  {
    id: 5,
    title: "Lusion Cinema",
    tagline: "Movie Frames, Laser Vectors & Fullscreen Scenes",
    badge: "Theme: Lusion.co",
    scrollEffect: "Diving into fullscreen frames + dynamic laser vector lines drawing on scroll",
    threeFeature: "3D Primary Ion Drive engine + floating laser shards and vector crosshairs",
    palette: "Pure cinema black (#000000), laser cyan, stark white typography",
    accent: "#06b6d4",
  },
  {
    id: 6,
    title: "Neon Arcade Collider",
    tagline: "Tokyo Cyber Pinball & Playable High-Scores",
    badge: "Theme: Arcade",
    scrollEffect: "Heavy 3D chrome pinball tumbling down track + live score multiplier combos",
    threeFeature: "3D pinball + glowing arcade token swarm pulled into cursor gravity well",
    palette: "Cyberpunk purple (#090214), hot magenta (#ec4899), neon cyan (#06b6d4)",
    accent: "#ec4899",
  },
];

interface DesignSwitcherProps {
  activeDesign: number;
  onSelectDesign: (id: number) => void;
}

export function DesignSwitcher({ activeDesign, onSelectDesign }: DesignSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Keyboard shortcut listener (1..6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        onSelectDesign(num);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectDesign]);

  const activeOption = DESIGN_OPTIONS.find((d) => d.id === activeDesign) || DESIGN_OPTIONS[3];

  return (
    <>
      {/* Floating Pill Bar */}
      <aside aria-label="Portfolio design switcher" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-auto max-w-[95vw]">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/90 backdrop-blur-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
          {/* Main button opening switcher list */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white transition-all text-xs font-mono font-medium"
            title="Click to view all 6 cinematic design options"
          >
            <Layers size={14} className="text-white/80" />
            <span className="hidden sm:inline text-white/50">Theme:</span>
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
              const isActive = opt.id === activeDesign;
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
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[101] w-[92vw] max-w-4xl p-5 rounded-2xl bg-[#0d0d12]/95 backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  Select from 6 Cinematic Thematic Experiences
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Themes: Space, Casino, Cards, Oryzo Coaster & Coffee Beans, Lusion Movie, and Neon Arcade. Press keys 1-6 anytime.
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
                const isCurrent = opt.id === activeDesign;
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
            className="fixed bottom-24 right-6 z-[101] w-[90vw] max-w-md p-5 rounded-2xl bg-[#0d0d12]/95 backdrop-blur-3xl border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Info size={15} className="text-cyan-400" />
                Active Theme: #{activeOption.id} {activeOption.title}
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
                <span className="font-semibold text-white/90">Creative Theme:</span>
                <p className="mt-0.5 text-white/60">{activeOption.tagline}</p>
              </div>
              <div>
                <span className="font-semibold text-white/90">Scroll Physics:</span>
                <p className="mt-0.5 text-white/60">{activeOption.scrollEffect}</p>
              </div>
              <div>
                <span className="font-semibold text-white/90">3D WebGL / Swarm Engine:</span>
                <p className="mt-0.5 text-white/60">{activeOption.threeFeature}</p>
              </div>
              <div>
                <span className="font-semibold text-white/90">Palette:</span>
                <p className="mt-0.5 text-white/60">{activeOption.palette}</p>
              </div>
              <div className="pt-2 border-t border-white/10 text-[11px] text-white/50 flex justify-between items-center">
                <span>Updated with Aug 2026 Resume</span>
                <a
                  href={portfolioData.personal.resumeUrl}
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
