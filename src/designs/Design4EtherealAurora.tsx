import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Sparkles,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export function Design4EtherealAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Three.js Bioluminescent Caustic Shader Plane
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    let handleResize: () => void;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 10;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Custom GLSL Shader Material for procedural bioluminescent waves
      const vertexShader = `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;
        uniform float uScroll;

        void main() {
          vUv = uv;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          float elevation = sin(modelPosition.x * 0.4 + uTime * 0.6 + uScroll * 2.0) * 0.8
                          + cos(modelPosition.y * 0.3 + uTime * 0.5 + uScroll) * 0.8
                          + sin((modelPosition.x + modelPosition.y) * 0.2 + uTime * 0.8) * 0.5;

          modelPosition.z += elevation;
          vElevation = elevation;

          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
        }
      `;

      const fragmentShader = `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;

        void main() {
          // Shifting bioluminescent gradient: velvet purple to rose gold to ethereal mint
          vec3 colorA = vec3(0.08, 0.05, 0.15); // Deep velvet
          vec3 colorB = vec3(0.75, 0.52, 0.99); // Lilac aurora
          vec3 colorC = vec3(0.18, 0.83, 0.75); // Luminous mint
          vec3 colorD = vec3(0.98, 0.44, 0.52); // Soft rose peach

          float mixFactor = (vElevation + 1.5) * 0.35;
          vec3 finalColor = mix(colorA, colorB, mixFactor);
          finalColor = mix(finalColor, colorC, sin(uTime * 0.3 + vUv.x * 2.0) * 0.3 + 0.3);
          finalColor = mix(finalColor, colorD, cos(uTime * 0.2 + vUv.y * 2.0) * 0.2 + 0.2);

          gl_FragColor = vec4(finalColor, 0.45);
        }
      `;

      const uniforms = {
        uTime: { value: 0 },
        uScroll: { value: 0 },
      };

      const geometry = new THREE.PlaneGeometry(24, 16, 64, 64);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let clock = new THREE.Clock();

      const animate = () => {
        uniforms.uTime.value = clock.getElapsedTime();
        uniforms.uScroll.value = window.scrollY * 0.001;

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
    <div ref={containerRef} className="relative min-h-screen bg-[#06060c] text-[#f1f0f7] font-sans selection:bg-[#c084fc] selection:text-black overflow-x-hidden">
      {/* Three.js Bioluminescent Shader Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />

      {/* Floating ambient radial orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(192,132,252,0.15),rgba(255,255,255,0))]" />

      {/* Header Navigation */}
      <header className="relative z-20 max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c084fc] via-[#fb7185] to-[#2dd4bf] p-0.5 shadow-[0_0_20px_rgba(192,132,252,0.5)]">
            <div className="w-full h-full bg-[#06060c] rounded-full flex items-center justify-center font-serif text-sm italic font-bold text-white">
              ug
            </div>
          </div>
          <span className="font-serif italic text-lg tracking-wide text-white/90">Ubaid Ghante</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={PORTFOLIO_DATA.personal.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-full aurora-glass border border-white/20 text-xs text-white/90 hover:text-white hover:border-[#c084fc] transition-all"
          >
            <Download size={13} />
            <span>Aug 2026 Resume</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-28">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full aurora-glass border border-white/15 text-xs text-[#c084fc] mb-8">
            <Sparkles size={13} />
            <span>Organic Silicon &middot; Human-Centric AI</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif italic text-white tracking-tight leading-[1.05] mb-8">
            Poetic <span className="font-sans font-extrabold not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#fb7185] to-[#2dd4bf]">Intelligence.</span>
          </h1>

          <p className="text-base sm:text-xl text-white/70 font-light leading-relaxed mb-10">
            Crafting machine learning systems where rigorous architecture meets biological intuition &mdash; from multi-agent orchestration serving 170M+ users to healthcare models safeguarding 20,890+ lives.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#aurora-experience"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#c084fc] to-[#fb7185] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_30px_rgba(192,132,252,0.4)]"
            >
              Explore Engineering Path
            </a>
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="px-7 py-3.5 rounded-full aurora-glass border border-white/20 text-white/90 text-xs uppercase tracking-wider hover:text-white transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Highlight Stats Glass Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {PORTFOLIO_DATA.personal.stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl aurora-glass border border-white/10 text-center">
              <span className="block text-3xl sm:text-4xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#2dd4bf]">
                {stat.value}
              </span>
              <span className="block text-xs font-semibold text-white/90 mt-2">{stat.label}</span>
              <span className="block text-[11px] text-white/50 mt-1">{stat.detail}</span>
            </div>
          ))}
        </div>

        {/* Experience Cards */}
        <section id="aurora-experience" className="mb-24">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#c084fc] font-semibold">Career Milestones</span>
            <h2 className="text-3xl sm:text-4xl font-serif italic text-white mt-1">Where Mind Meets Code</h2>
          </div>

          <div className="space-y-8">
            {PORTFOLIO_DATA.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-10 rounded-3xl aurora-glass border border-white/10 hover:border-white/25 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                  <h3 className="text-2xl font-serif italic text-white">{exp.company}</h3>
                  <span className="text-xs text-[#c084fc] font-medium">{exp.period}</span>
                </div>

                <div className="text-sm font-semibold text-white/90 mb-4">{exp.role} &middot; {exp.location}</div>
                <p className="text-sm text-white/70 leading-relaxed font-light mb-6">{exp.summary}</p>

                <div className="space-y-2.5 mb-8">
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-white/65 leading-relaxed font-light">
                      <span className="text-[#c084fc] mt-0.5">&bull;</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/70 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Projects Showcase */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#2dd4bf] font-semibold">Creations</span>
            <h2 className="text-3xl sm:text-4xl font-serif italic text-white mt-1">Sculpted Systems</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-8 rounded-3xl aurora-glass border border-white/10 hover:border-[#c084fc]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] uppercase tracking-wider text-[#2dd4bf] font-semibold">
                      {proj.category}
                    </span>
                    {proj.stats && (
                      <span className="text-xs font-serif italic text-white/80">
                        {proj.stats.label}: {proj.stats.value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-serif italic text-white mb-2">{proj.title}</h3>
                  <p className="text-xs text-white/50 mb-4">{proj.subtitle}</p>
                  <p className="text-xs text-white/70 leading-relaxed font-light mb-6">{proj.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.tech.map((t) => (
                      <span key={t} className="px-2.5 py-1 text-[11px] rounded-full bg-white/5 text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#c084fc] hover:underline"
                    >
                      <span>Explore Source</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-16 border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl font-serif italic text-white mb-6">Let Us Converse</h2>
          <div className="flex justify-center gap-4 mb-8">
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#c084fc] to-[#2dd4bf] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              {PORTFOLIO_DATA.personal.email}
            </a>
          </div>

          <div className="text-xs text-white/40 font-light">
            &copy; {new Date().getFullYear()} Ubaid Ghante &middot; Crafted with Harmonic Resonance
          </div>
        </footer>
      </main>
    </div>
  );
}
