import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Terminal,
  Cpu,
  Radio,
  Download,
  Database,
  ExternalLink,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export function Design2CyberTerminal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Terminal log stream state
  const [terminalLogs] = useState<string[]>([
    "[SYS_INIT] Autonomous Agent Telemetry Subsystem Online",
    "[MLOPS] Kubernetes cluster connected — 170M+ user profile shard verified",
    "[MCP] Custom banking & compliance MCP server initialized",
    "[MODEL_POLL] Latency < 320ms | Voice Agent STT-LLM-TTS stream healthy",
  ]);

  // Three.js 3D Tensor Hyper-Structure
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    let handleResize: () => void;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 15;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Outer wireframe icosahedron
      const outerGeo = new THREE.IcosahedronGeometry(7, 2);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      scene.add(outerMesh);

      // Inner torus knot tensor structure
      const innerGeo = new THREE.TorusKnotGeometry(3.5, 0.8, 100, 16);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      scene.add(innerMesh);

      // Orbiting data nodes (particles)
      const particleCount = 400;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 25;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x00ff9d,
        transparent: true,
        opacity: 0.6,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      let clock = new THREE.Clock();

      const animate = () => {
        const elapsed = clock.getElapsedTime();
        const scrollFactor = window.scrollY * 0.001;

        outerMesh.rotation.x = elapsed * 0.15 + scrollFactor;
        outerMesh.rotation.y = elapsed * 0.2 + scrollFactor * 0.5;

        innerMesh.rotation.x = -elapsed * 0.25 - scrollFactor * 1.5;
        innerMesh.rotation.z = elapsed * 0.2;

        particles.rotation.y = elapsed * 0.05;

        // Adjust camera with scroll depth
        camera.position.z = 15 - scrollFactor * 6;

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
    <div ref={containerRef} className="relative min-h-screen bg-[#07080c] text-[#d1fae5] font-mono selection:bg-[#00ff9d] selection:text-black overflow-x-hidden cyber-scanline">
      {/* 3D Wireframe Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 cyber-grid opacity-30" />

      {/* Top Telemetry Status Bar */}
      <div className="sticky top-0 z-50 bg-[#07080c]/90 backdrop-blur-md border-b border-[#00ff9d]/20 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-ping" />
            <span className="text-[#00ff9d] font-bold tracking-wider cyber-glow-emerald">NODE::ACTIVE</span>
          </div>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/60">SYS_TIME: {new Date().toISOString().split("T")[1].slice(0, 8)} UTC</span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="hidden md:inline text-[#00e5ff]">SCALE: 170,000,000+ PROFILES</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-white/50">STATION: KORN_FERRY // AGENT_ORCHESTRATOR</span>
          <a
            href={PORTFOLIO_DATA.personal.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-[#00ff9d]/40 bg-[#00ff9d]/10 text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-all"
          >
            <Download size={11} />
            <span>EXPORT_DOSSIER.PDF</span>
          </a>
        </div>
      </div>

      {/* Main Terminal HUD Viewport */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-28">
        {/* Terminal Header Viewport */}
        <section className="relative p-6 sm:p-10 rounded-xl border border-[#00ff9d]/30 bg-[#0c1017]/80 backdrop-blur-xl mb-16 shadow-[0_0_50px_rgba(0,255,157,0.06)]">
          {/* Viewport Crosshairs */}
          <div className="absolute top-2 left-2 text-[#00ff9d]/40 text-[10px]">&uarr; LAT_48.85 // LON_2.35</div>
          <div className="absolute top-2 right-2 text-[#00ff9d]/40 text-[10px]">AUTH_LVL::5 [MLE]</div>
          <div className="absolute bottom-2 left-2 text-[#00ff9d]/40 text-[10px]">STATUS: OPTIMAL</div>
          <div className="absolute bottom-2 right-2 text-[#00ff9d]/40 text-[10px]">&darr; SEC_V2.6</div>

          <div className="max-w-4xl pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-xs mb-6">
              <Terminal size={13} />
              <span>CLASSIFIED OPERATIONAL DOSSIER // UBAID_GHANTE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-none">
              UBAID GHANTE
              <br />
              <span className="text-[#00ff9d] cyber-glow-emerald font-extrabold">MACHINE LEARNING</span>
              <br />
              <span className="text-[#00e5ff] cyber-glow-cyan">SYSTEMS ENGINEER</span>
            </h1>

            <p className="text-sm sm:text-base text-[#a7f3d0] max-w-2xl leading-relaxed mb-8">
              &gt; Engineering production multi-agent workflows, autonomous LangGraph graphs, custom MCP servers, and enterprise Kubernetes MLOps pipelines supporting over 170M+ live user profiles.
            </p>

            {/* Terminal Live Stream Diagnostic Box */}
            <div className="p-4 rounded-lg bg-black/60 border border-white/10 font-mono text-xs space-y-1.5">
              <div className="text-white/40 text-[10px] pb-1 border-b border-white/10 flex justify-between">
                <span>TERMINAL_OUTPUT // STREAM_00</span>
                <span>BAUD: 115200</span>
              </div>
              {terminalLogs.map((log, i) => (
                <div key={i} className="text-[#00ff9d]/80 flex items-start gap-2">
                  <span className="text-white/30">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diagnostic Metrics Matrix */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {PORTFOLIO_DATA.personal.stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-lg border border-[#00ff9d]/20 bg-[#0c1017]/70 backdrop-blur-md hover:border-[#00ff9d] transition-all"
            >
              <div className="text-[10px] text-white/40 mb-1">TELEMETRY_STAT_{i + 1}</div>
              <div className="text-3xl font-extrabold text-[#00ff9d] cyber-glow-emerald">{stat.value}</div>
              <div className="text-xs font-bold text-white mt-1 uppercase">{stat.label}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{stat.detail}</div>
            </div>
          ))}
        </section>

        {/* Operational Roles (Experience) Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-[#00ff9d]/30">
            <Radio size={18} className="text-[#00ff9d] animate-pulse" />
            <h2 className="text-xl font-bold tracking-wider text-white">OPERATIONAL_POSTINGS // CAREER_TRACK</h2>
          </div>

          <div className="space-y-6">
            {PORTFOLIO_DATA.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-xl border border-white/10 bg-[#0c1017]/60 hover:border-[#00ff9d]/40 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#00ff9d] font-bold">[{idx + 1}]</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00ff9d] transition-colors">
                      {exp.company}
                    </h3>
                  </div>
                  <span className="text-xs text-[#00e5ff] font-semibold">{exp.period}</span>
                </div>

                <div className="text-xs text-[#00ff9d] mb-4">
                  ROLE: {exp.role} // LOC: {exp.location}
                </div>

                <p className="text-xs text-white/70 leading-relaxed mb-4">{exp.summary}</p>

                <div className="space-y-2 mb-6">
                  {exp.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-[#d1fae5]/80 leading-relaxed">
                      <span className="text-[#00ff9d]">&bull;</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-[#a7f3d0] border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deployed Systems (Projects) Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-[#00e5ff]/30">
            <Cpu size={18} className="text-[#00e5ff]" />
            <h2 className="text-xl font-bold tracking-wider text-white">DEPLOYED_NEURAL_SYSTEMS // REPOSITORIES</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-xl border border-white/10 bg-[#0c1017]/80 hover:border-[#00e5ff] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 text-[10px] rounded bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                      SYS_ID::{proj.id.toUpperCase()}
                    </span>
                    {proj.stats && (
                      <span className="text-[11px] text-[#00ff9d] font-bold">
                        {proj.stats.label}: {proj.stats.value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{proj.title}</h3>
                  <p className="text-xs text-[#00e5ff]/80 mb-3">{proj.subtitle}</p>
                  <p className="text-xs text-white/70 leading-relaxed mb-6">{proj.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] rounded bg-black/50 text-white/60 border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-[#00ff9d] hover:underline"
                    >
                      <span>INSPECT_SOURCE_CODE</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Capabilities Matrix */}
        <section className="mb-20 p-8 rounded-xl border border-white/10 bg-[#0c1017]/60">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-white/10">
            <Database size={18} className="text-[#00ff9d]" />
            <h2 className="text-xl font-bold tracking-wider text-white">SKILLS_MATRIX // CAPABILITIES</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PORTFOLIO_DATA.skills).map(([category, skills], i) => (
              <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/5">
                <div className="text-xs text-[#00ff9d] font-bold mb-3 uppercase">&gt; {category}</div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 text-[11px] rounded bg-white/5 text-white/70 border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Command Footer */}
        <footer className="p-8 rounded-xl border border-[#00ff9d]/30 bg-black/90 text-center">
          <div className="text-xs text-[#00ff9d] cyber-glow-emerald mb-2 font-bold">&gt;&gt; ESTABLISH_SECURE_CHANNEL &lt;&lt;</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">TRANSMIT TO: {PORTFOLIO_DATA.personal.email}</h3>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="px-6 py-2.5 rounded bg-[#00ff9d] text-black font-bold text-xs hover:bg-[#00e5ff] transition-all"
            >
              SEND_DISPATCH
            </a>
            <a
              href={PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded border border-white/20 text-white text-xs hover:border-[#00ff9d] hover:text-[#00ff9d] transition-colors"
            >
              LINKEDIN_PROFILE
            </a>
            <a
              href={PORTFOLIO_DATA.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded border border-white/20 text-white text-xs hover:border-[#00ff9d] hover:text-[#00ff9d] transition-colors"
            >
              GITHUB_REPOSITORIES
            </a>
          </div>

          <div className="mt-8 text-[10px] text-white/30">
            SYSTEM_ID: UG_TERMINAL_2026 // ALL_RIGHTS_RESERVED
          </div>
        </footer>
      </main>
    </div>
  );
}
