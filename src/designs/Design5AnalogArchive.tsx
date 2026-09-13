import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Sliders,
  Disc,
  Download,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export function Design5AnalogArchive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tapeCounter] = useState(170);
  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "skills">("projects");

  // Three.js 3D Mechanical Analog Gyroscope / Compute Wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    let handleResize: () => void;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 14);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create 3D matte analog gyroscope assembly
      const group = new THREE.Group();
      scene.add(group);

      // Outer gimbal ring
      const ring1Geo = new THREE.TorusGeometry(4.5, 0.2, 16, 64);
      const matteCharcoal = new THREE.MeshStandardMaterial({
        color: 0x262624,
        roughness: 0.8,
        metalness: 0.2,
      });
      const ring1 = new THREE.Mesh(ring1Geo, matteCharcoal);
      group.add(ring1);

      // Mid gimbal ring (brass/amber tint)
      const ring2Geo = new THREE.TorusGeometry(3.5, 0.18, 16, 64);
      const matteAmber = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.6,
        metalness: 0.4,
      });
      const ring2 = new THREE.Mesh(ring2Geo, matteAmber);
      group.add(ring2);

      // Inner core rotor with stepped teeth
      const coreGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.6, 32);
      const matteCore = new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        roughness: 0.7,
        metalness: 0.3,
      });
      const core = new THREE.Mesh(coreGeo, matteCore);
      core.rotation.x = Math.PI / 2;
      group.add(core);

      // Mechanical directional lights
      const warmLight = new THREE.DirectionalLight(0xfef3c7, 2.5);
      warmLight.position.set(5, 10, 8);
      scene.add(warmLight);

      const redAccent = new THREE.DirectionalLight(0xef4444, 1.2);
      redAccent.position.set(-8, -5, -4);
      scene.add(redAccent);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      let clock = new THREE.Clock();

      const animate = () => {
        const time = clock.getElapsedTime();
        const scrollY = window.scrollY * 0.002;

        ring1.rotation.x = time * 0.3 + scrollY;
        ring1.rotation.y = time * 0.2;

        ring2.rotation.y = -time * 0.4 - scrollY * 1.5;
        ring2.rotation.z = time * 0.2;

        core.rotation.z = time * 0.8 + scrollY * 3;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();

      handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);
    } catch (err) {
      console.warn("WebGL renderer initialization skipped or failed:", err);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#141311] text-[#e7e5e0] font-vintage selection:bg-[#f59e0b] selection:text-black overflow-x-hidden crt-screen">
      {/* 3D Analog Gyroscope Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-45" />

      {/* Analog Control Bar */}
      <header className="relative z-20 border-b border-[#292825] bg-[#1a1816]/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-[#f59e0b] text-black font-bold flex items-center justify-center text-xs shadow-md">
              70s
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                <span>LAB_ARCHIVE // UBAID GHANTE</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-white/40 font-mono">SERIES 2026-AUG &middot; 170M TAPE REEL</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Vintage Mechanical 7-Segment Tape Counter */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-black border border-[#383530] rounded text-xs font-mono text-[#f59e0b]">
              <Disc size={12} className="text-white/40 animate-spin" />
              <span>INDEX: 00{tapeCounter}</span>
            </div>

            <a
              href={PORTFOLIO_DATA.personal.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black transition-all text-xs font-bold"
            >
              <Download size={12} />
              <span>PUNCH_CARD.PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Analog Chassis View */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-28">
        {/* Analog Master Console Header */}
        <div className="analog-chassis rounded-xl p-8 sm:p-12 mb-16 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#292825] mb-8">
            <div>
              <div className="text-xs text-[#f59e0b] tracking-widest uppercase mb-2 flex items-center gap-2">
                <Sliders size={14} />
                <span>OPERATIONAL CONSOLE // DIETER RAMS SYSTEM 10</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4">
                UBAID GHANTE
              </h1>
              <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
                Machine Learning Engineer. Architecting autonomous multi-agent pipelines, custom banking MCP servers, and enterprise Kubernetes MLOps with timeless mathematical rigor.
              </p>
            </div>

            {/* Hardware Status Dial Plate */}
            <div className="p-4 rounded bg-black/50 border border-[#2e2b26] min-w-[200px]">
              <div className="text-[10px] text-white/40 uppercase mb-2">SYSTEM TELEMETRY</div>
              <div className="space-y-1.5 text-xs text-white/80">
                <div className="flex justify-between">
                  <span>SCALE:</span>
                  <span className="text-[#f59e0b] font-bold">170M+ PROFILES</span>
                </div>
                <div className="flex justify-between">
                  <span>LATENCY:</span>
                  <span className="text-emerald-400 font-bold">&lt; 320ms</span>
                </div>
                <div className="flex justify-between">
                  <span>EXP:</span>
                  <span className="text-white font-bold">3+ YEARS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Stepper Switches */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PORTFOLIO_DATA.personal.stats.map((stat, i) => (
              <div key={i} className="p-4 rounded bg-[#1b1a18] border border-[#2e2b26]">
                <span className="text-[10px] text-[#f59e0b] block uppercase">REGISTER_{i + 1}</span>
                <span className="text-2xl sm:text-3xl font-bold text-white block mt-1">{stat.value}</span>
                <span className="text-xs font-bold text-white/90 block">{stat.label}</span>
                <span className="text-[10px] text-white/40 block mt-0.5">{stat.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Selection Switches */}
        <div className="flex gap-2 mb-10 pb-2 border-b border-[#292825]">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "projects"
                ? "bg-[#f59e0b] text-black shadow-md"
                : "bg-[#1b1a18] text-white/60 hover:text-white border border-[#2e2b26]"
            }`}
          >
            Tape A: Systems & Projects
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "experience"
                ? "bg-[#f59e0b] text-black shadow-md"
                : "bg-[#1b1a18] text-white/60 hover:text-white border border-[#2e2b26]"
            }`}
          >
            Tape B: Industry Record
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "skills"
                ? "bg-[#f59e0b] text-black shadow-md"
                : "bg-[#1b1a18] text-white/60 hover:text-white border border-[#2e2b26]"
            }`}
          >
            Tape C: Technical Registry
          </button>
        </div>

        {/* Tab Content: Projects */}
        {activeTab === "projects" && (
          <div className="grid md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="analog-chassis rounded-xl p-6 relative flex flex-col justify-between hover:border-[#f59e0b] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-[#292825]">
                    <span className="text-[#f59e0b] font-bold">CASSETTE #{idx + 1} &middot; {proj.category}</span>
                    {proj.stats && (
                      <span className="text-white/80 font-bold">
                        {proj.stats.label}: {proj.stats.value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{proj.title}</h3>
                  <div className="text-xs text-white/50 mb-3">{proj.subtitle}</div>
                  <p className="text-xs text-white/70 leading-relaxed mb-6">{proj.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6 pt-3 border-t border-[#292825]">
                    {proj.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] rounded bg-black/40 text-white/70 border border-[#292825]">
                        {t}
                      </span>
                    ))}
                  </div>

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#f59e0b] hover:underline"
                    >
                      <span>INSPECT_PUNCH_RECORD &rarr;</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Experience */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            {PORTFOLIO_DATA.experiences.map((exp, idx) => (
              <div key={idx} className="analog-chassis rounded-xl p-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3 pb-2 border-b border-[#292825]">
                  <h3 className="text-xl font-bold text-white">
                    {exp.company} &mdash; <span className="text-[#f59e0b]">{exp.role}</span>
                  </h3>
                  <span className="text-xs text-white/50">{exp.period}</span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed mb-6">{exp.summary}</p>

                <div className="space-y-2 mb-6">
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <span className="text-[#f59e0b]">&bull;</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#292825]">
                  {exp.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] rounded bg-black/40 text-white/60 border border-[#292825]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Skills */}
        {activeTab === "skills" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PORTFOLIO_DATA.skills).map(([category, items], idx) => (
              <div key={idx} className="analog-chassis rounded-xl p-6">
                <h4 className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider mb-4 pb-2 border-b border-[#292825]">
                  {category}
                </h4>
                <div className="space-y-1.5">
                  {items.map((skill) => (
                    <div key={skill} className="flex items-center justify-between text-xs py-1 text-white/70">
                      <span>{skill}</span>
                      <span className="text-[10px] text-white/30 font-mono">CALIBRATED</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analog Footer Chassis */}
        <footer className="mt-20 analog-chassis rounded-xl p-8 text-center">
          <div className="text-xs text-[#f59e0b] font-bold uppercase mb-2">PUNCH REGISTER READY FOR DISPATCH</div>
          <h3 className="text-2xl font-bold text-white mb-6">SIGNAL LINE: {PORTFOLIO_DATA.personal.email}</h3>

          <div className="flex justify-center gap-4">
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="px-6 py-2.5 rounded bg-[#f59e0b] text-black font-bold text-xs uppercase hover:bg-white transition-all shadow-md"
            >
              SEND DIRECT WIRE
            </a>
            <a
              href={PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded border border-[#2e2b26] text-white/80 text-xs hover:border-white transition-colors"
            >
              LINKEDIN ARCHIVE
            </a>
            <a
              href={PORTFOLIO_DATA.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded border border-[#2e2b26] text-white/80 text-xs hover:border-white transition-colors"
            >
              GITHUB VAULT
            </a>
          </div>

          <div className="mt-8 text-[10px] text-white/30">
            RECORDED ON ANALOG MAGNETIC MEDIUM &middot; 2026 UBAID GHANTE
          </div>
        </footer>
      </main>
    </div>
  );
}
