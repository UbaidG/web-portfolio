import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useVelocity, useSpring } from "framer-motion";
import * as THREE from "three";
import {
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Award,
  ChevronRight,
  Activity,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export function Design1Atelier() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll velocity for kinetic skewing effect (Lusion-inspired dynamic momentum)
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewY = useTransform(smoothVelocity, [-2000, 2000], [-4, 4]);

  // Three.js interactive fluid ribbon canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    let handleMouseMove: (e: MouseEvent) => void;
    let handleResize: () => void;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 18;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create undulating fluid ribbon geometry
      const segments = 120;
      const geometry = new THREE.PlaneGeometry(35, 20, segments, segments);

      // Custom shader material with fluid refraction & chromatic dispersion
      const material = new THREE.MeshPhongMaterial({
        color: 0x111118,
        emissive: 0x050508,
        specular: 0xff5500,
        shininess: 90,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xff5500, 4, 50);
      pointLight1.position.set(10, 10, 15);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xa78bfa, 3, 50);
      pointLight2.position.set(-10, -10, 10);
      scene.add(pointLight2);

      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener("mousemove", handleMouseMove);

      const pos = geometry.attributes.position;
      const originalPositions = new Float32Array(pos.array);

      let clock = new THREE.Clock();

      const animate = () => {
        const time = clock.getElapsedTime();
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Deform vertices with fluid wave equation & scroll integration
        const currentScroll = window.scrollY * 0.002;
        for (let i = 0; i < pos.count; i++) {
          const u = originalPositions[i * 3];
          const v = originalPositions[i * 3 + 1];
          const wave =
            Math.sin(u * 0.3 + time * 0.8 + currentScroll) * 1.5 +
            Math.cos(v * 0.4 + time * 0.6 + currentScroll) * 1.2 +
            Math.sin((u + v) * 0.2 + time) * 0.8;
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;

        mesh.rotation.x = 0.2 + targetY * 0.2;
        mesh.rotation.y = targetX * 0.3;
        mesh.position.y = -currentScroll * 2;

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
      if (handleMouseMove) window.removeEventListener("mousemove", handleMouseMove);
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (renderer) renderer.dispose();
    };
  }, []);

  const [activeProject, setActiveProject] = useState(PORTFOLIO_DATA.projects[0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#060608] text-[#f2efe9] font-sans selection:bg-[#ff5500] selection:text-white overflow-x-hidden">
      {/* Three.js Fluid Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />

      {/* Ambient noise & vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#060608_95%)]" />

      {/* Header Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ff5500] text-black font-syne font-extrabold flex items-center justify-center text-lg shadow-[0_0_20px_rgba(255,85,0,0.5)]">
            UG
          </div>
          <div>
            <span className="block font-syne font-bold text-sm tracking-tight">UBAID GHANTE</span>
            <span className="block text-[11px] font-mono text-white/50 tracking-wider">ML ENGINEER // MLOps</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-white/60">
          <a href="#atelier-about" className="hover:text-[#ff5500] transition-colors">01. Architecture</a>
          <a href="#atelier-experience" className="hover:text-[#ff5500] transition-colors">02. Engineering</a>
          <a href="#atelier-projects" className="hover:text-[#ff5500] transition-colors">03. Artifacts</a>
          <a href="#atelier-skills" className="hover:text-[#ff5500] transition-colors">04. Matrix</a>
        </nav>

        <a
          href={PORTFOLIO_DATA.personal.resumePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:border-[#ff5500] bg-white/5 hover:bg-[#ff5500] hover:text-black transition-all duration-300 text-xs font-mono"
        >
          <span>LATEST RESUME (AUG 2026)</span>
          <Download size={13} className="group-hover:translate-y-0.5 transition-transform" />
        </a>
      </header>

      {/* Hero Section with Massive Editorial Typography */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#ff5500]/30 bg-[#ff5500]/10 text-[#ff5500] text-xs font-mono mb-8">
          <Activity size={12} className="animate-pulse" />
          <span>PRODUCTION AI SYSTEMS · 170M+ PROFILES</span>
        </div>

        <motion.div style={{ skewY }}>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-syne font-extrabold tracking-tighter leading-[0.9] uppercase">
            SYNTHETIC <br />
            <span className="font-serif italic font-normal text-stroke hover:text-white transition-all duration-500">
              INTELLIGENCE
            </span>{" "}
            <span className="text-[#ff5500]">AT SCALE.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl font-light leading-relaxed">
            I build production agentic workflows, autonomous multi-agent pipelines, and low-latency speech architectures for global enterprises.
          </p>
        </motion.div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10">
          {PORTFOLIO_DATA.personal.stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <span className="block text-3xl sm:text-4xl font-syne font-extrabold text-[#ff5500]">
                {stat.value}
              </span>
              <span className="block text-xs font-bold uppercase tracking-wider text-white/90 mt-1">
                {stat.label}
              </span>
              <span className="block text-[11px] font-mono text-white/40 mt-0.5">{stat.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Kinetic Infinite Marquee */}
      <div className="relative z-10 py-4 bg-[#ff5500] text-black font-syne font-extrabold text-sm tracking-wider uppercase overflow-hidden whitespace-nowrap">
        <div className="animate-marquee flex items-center gap-8">
          <span>// LANGGRAPH MULTI-AGENT</span>
          <span>// TABLEAU MCP SERVERS</span>
          <span>// REAL-TIME VOICE PIPELINES</span>
          <span>// KUBERNETES & MLOPS</span>
          <span>// GRAPH RAG REASONING</span>
          <span>// COMPUTER VISION PANNs & SWIN</span>
          <span>// 170M+ PROFILES IN PRODUCTION</span>
          <span>// FASTAPI & DOCKER CLUSTERS</span>
          <span>// LANGGRAPH MULTI-AGENT</span>
          <span>// TABLEAU MCP SERVERS</span>
          <span>// REAL-TIME VOICE PIPELINES</span>
          <span>// KUBERNETES & MLOPS</span>
        </div>
      </div>

      {/* Experience Section with High-Impact Editorial Layout */}
      <section id="atelier-experience" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#ff5500] tracking-widest uppercase">// 02. RECORD</span>
            <h2 className="text-4xl sm:text-5xl font-syne font-extrabold tracking-tight mt-1">
              ENGINEERING RESUME
            </h2>
          </div>
          <p className="text-xs font-mono text-white/40 max-w-xs mt-4 md:mt-0">
            From early-stage research to orchestrating high-concurrency inference serving 170M+ user profiles.
          </p>
        </div>

        <div className="space-y-12">
          {PORTFOLIO_DATA.experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#ff5500]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#ff5500] font-bold">0{idx + 1}.</span>
                  <h3 className="text-2xl sm:text-3xl font-syne font-bold text-white group-hover:text-[#ff5500] transition-colors">
                    {exp.company}
                  </h3>
                </div>
                <div className="text-xs font-mono text-white/50">{exp.period} · {exp.location}</div>
              </div>

              <div className="text-sm font-mono text-[#ff5500] mb-4">{exp.role}</div>
              <p className="text-sm text-white/70 leading-relaxed mb-6 font-light">{exp.summary}</p>

              <div className="space-y-2 mb-6">
                {exp.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-3 text-xs text-white/60 leading-relaxed font-mono">
                    <span className="text-[#ff5500] mt-0.5">&rsaquo;</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/5 text-white/70 border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Showcase with Interactive Split-Screen Drawer */}
      <section id="atelier-projects" className="relative z-10 max-w-7xl mx-auto px-6 py-28 bg-white/[0.01]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#ff5500] tracking-widest uppercase">// 03. ARTIFACTS</span>
            <h2 className="text-4xl sm:text-5xl font-syne font-extrabold tracking-tight mt-1">
              KEY PRODUCTION SYSTEMS
            </h2>
          </div>
          <span className="text-xs font-mono text-white/40">SELECT AN ARTIFACT TO INSPECT</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Project selection list */}
          <div className="lg:col-span-6 space-y-3">
            {PORTFOLIO_DATA.projects.map((proj, i) => {
              const isSelected = activeProject.id === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setActiveProject(proj)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? "bg-white/10 border-[#ff5500] text-white shadow-[0_0_30px_rgba(255,85,0,0.15)]"
                      : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#ff5500]">0{i + 1}.</span>
                      <span className="text-base font-syne font-bold">{proj.title}</span>
                    </div>
                    <p className="text-xs font-mono text-white/40 mt-1 line-clamp-1">{proj.tagline}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-300 ${
                      isSelected ? "text-[#ff5500] translate-x-1" : "text-white/20 group-hover:text-white"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active project inspection inspector drawer */}
          <div className="lg:col-span-6 sticky top-28 p-8 rounded-2xl bg-gradient-to-br from-[#121218] to-[#0a0a0f] border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/30">
                {activeProject.category}
              </span>
              {activeProject.stats && (
                <span className="text-xs font-mono text-white/70">
                  {activeProject.stats.label}: <strong className="text-[#ff5500]">{activeProject.stats.value}</strong>
                </span>
              )}
            </div>

            <h3 className="text-3xl font-syne font-extrabold text-white mb-2">{activeProject.title}</h3>
            <p className="text-xs font-mono text-white/50 mb-6">{activeProject.subtitle}</p>

            <p className="text-sm text-white/80 leading-relaxed font-light mb-8">
              {activeProject.description}
            </p>

            <div className="mb-8">
              <span className="block text-[11px] font-mono text-white/40 uppercase mb-2">Architectural Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs font-mono rounded-md bg-white/5 text-white/80 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {activeProject.github && (
              <a
                href={activeProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5500] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,85,0,0.3)]"
              >
                <span>{activeProject.linkLabel || "View Repository"}</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Skills Matrix & Certifications */}
      <section id="atelier-skills" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#ff5500] tracking-widest uppercase">// 04. PROFICIENCY</span>
            <h2 className="text-4xl sm:text-5xl font-syne font-extrabold tracking-tight mt-1">
              CAPABILITIES & SKILLS
            </h2>
          </div>
          <span className="text-xs font-mono text-white/40">5 CERTIFICATIONS IN AI & ML (2026)</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {Object.entries(PORTFOLIO_DATA.skills).map(([category, items], idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all">
              <h4 className="text-sm font-syne font-bold text-white uppercase tracking-wider mb-4 text-[#ff5500]">
                {category}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Bar */}
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Award size={18} className="text-[#ff5500]" />
            <h3 className="text-lg font-syne font-bold uppercase tracking-wider">Verified Professional Credentials</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTFOLIO_DATA.certifications.map((c, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/5">
                <span className="block text-xs font-syne font-bold text-white">{c.name}</span>
                <span className="block text-[11px] font-mono text-[#ff5500] mt-1">{c.issuer} · {c.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Contact Banner */}
      <footer className="relative z-10 border-t border-white/10 py-20 bg-black/80">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs font-mono text-[#ff5500] tracking-widest uppercase">// 05. DISPATCH</span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-syne font-extrabold uppercase mt-2 tracking-tighter">
            INITIATE <span className="font-serif italic font-normal text-stroke">COLLABORATION</span>
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff5500] text-black font-syne font-extrabold text-sm uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_30px_rgba(255,85,0,0.4)]"
            >
              <Mail size={16} />
              <span>{PORTFOLIO_DATA.personal.email}</span>
            </a>
            <a
              href={PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white font-mono text-xs hover:border-[#ff5500] hover:text-[#ff5500] transition-colors"
            >
              <Linkedin size={15} />
              <span>LinkedIn</span>
            </a>
            <a
              href={PORTFOLIO_DATA.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white font-mono text-xs hover:border-[#ff5500] hover:text-[#ff5500] transition-colors"
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
          </div>

          <div className="mt-16 text-xs font-mono text-white/30">
            &copy; {new Date().getFullYear()} UBAID GHANTE · ARCHITECTED IN ANTIGRAVITY
          </div>
        </div>
      </footer>
    </div>
  );
}
