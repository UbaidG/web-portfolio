import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Download,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export function Design6SpatialGallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedExhibition, setSelectedExhibition] = useState(PORTFOLIO_DATA.projects[0]);

  // Three.js 3D Spatial Gallery Corridor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    let handleResize: () => void;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.04);

      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1.5, 12);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Gallery floor grid with specular reflections
      const floorGeo = new THREE.PlaneGeometry(80, 200);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.1,
        metalness: 0.8,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -3;
      scene.add(floor);

      // Floating glass plinths representing project sculptures
      const plinths: THREE.Group[] = [];
      const plinthGeos = [
        new THREE.IcosahedronGeometry(1.5, 1),
        new THREE.TorusGeometry(1.2, 0.4, 16, 64),
        new THREE.OctahedronGeometry(1.4),
        new THREE.DodecahedronGeometry(1.4),
        new THREE.TorusKnotGeometry(1.0, 0.3, 64, 16),
        new THREE.SphereGeometry(1.3, 32, 32),
      ];

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2d4b7,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 1.2,
        ior: 1.5,
        wireframe: true,
      });

      for (let i = 0; i < 6; i++) {
        const plinthGroup = new THREE.Group();

        // Pedestal base
        const baseGeo = new THREE.CylinderGeometry(1.8, 1.8, 2.5, 32);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = -1.75;
        plinthGroup.add(base);

        // Sculptural object atop pedestal
        const sculpture = new THREE.Mesh(plinthGeos[i % plinthGeos.length], glassMat);
        sculpture.position.y = 1.2;
        plinthGroup.add(sculpture);

        // Position alternating left and right along gallery corridor
        const side = i % 2 === 0 ? -4.5 : 4.5;
        const zPos = -i * 12;
        plinthGroup.position.set(side, 0, zPos);

        scene.add(plinthGroup);
        plinths.push(plinthGroup);
      }

      // Volumetric gallery spotlighting
      const mainLight = new THREE.SpotLight(0xfff8ed, 5, 60, Math.PI / 4, 0.4);
      mainLight.position.set(0, 15, 5);
      scene.add(mainLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
      scene.add(ambientLight);

      let clock = new THREE.Clock();

      const animate = () => {
        const time = clock.getElapsedTime();
        const scrollZ = window.scrollY * 0.02;

        // Dolly camera forward along corridor
        camera.position.z = 12 - scrollZ;
        camera.position.y = 1.5 + Math.sin(time * 0.5) * 0.1;

        // Rotate sculptures
        plinths.forEach((p, idx) => {
          const sculpture = p.children[1];
          if (sculpture) {
            sculpture.rotation.y = time * 0.5 + idx;
            sculpture.rotation.x = time * 0.3;
          }
        });

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
    <div ref={containerRef} className="relative min-h-screen bg-black text-[#faf8f5] font-luxury selection:bg-[#e2d4b7] selection:text-black overflow-x-hidden">
      {/* 3D Spatial Gallery Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />

      {/* Dramatic Gallery Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

      {/* Minimalist Exhibition Top Bar */}
      <header className="relative z-20 max-w-7xl mx-auto px-8 py-8 flex items-center justify-between border-b border-white/10">
        <div>
          <span className="font-syne font-bold text-xs uppercase tracking-[0.25em] text-[#e2d4b7] block">
            RETROSPECTIVE // 2023 &mdash; 2026
          </span>
          <h1 className="text-xl font-serif italic text-white tracking-wide mt-0.5">Ubaid Ghante</h1>
        </div>

        <div className="flex items-center gap-6 text-xs font-sans">
          <span className="hidden sm:inline text-white/40 tracking-wider">ROOM N&deg; 06: SPATIAL EXHIBITION</span>
          <a
            href={PORTFOLIO_DATA.personal.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#e2d4b7]/50 text-[#e2d4b7] hover:bg-[#e2d4b7] hover:text-black transition-all text-xs tracking-wider"
          >
            <Download size={12} />
            <span>CATALOGUE [PDF]</span>
          </a>
        </div>
      </header>

      {/* Hero Curator Statement */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-28 pb-32">
        <div className="max-w-3xl mb-28">
          <span className="text-xs font-syne uppercase tracking-[0.3em] text-[#e2d4b7] block mb-4">
            CURATORIAL STATEMENT
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-serif italic text-white leading-[1.05] tracking-tight mb-8">
            The Geometry of <br />
            <span className="text-[#e2d4b7]">Synthetic Agency.</span>
          </h2>

          <p className="text-lg sm:text-xl font-sans text-white/70 font-light leading-relaxed mb-10">
            A retrospective exhibition of machine learning architectures, autonomous agent workflows, and real-time speech systems serving 170M+ individuals worldwide.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 text-center sm:text-left">
            {PORTFOLIO_DATA.personal.stats.map((s, i) => (
              <div key={i}>
                <span className="block text-3xl sm:text-4xl font-serif italic text-[#e2d4b7]">{s.value}</span>
                <span className="block text-xs font-syne uppercase tracking-wider text-white/80 mt-1 font-bold">{s.label}</span>
                <span className="block text-[11px] font-sans text-white/40">{s.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exhibition Corridor (Projects) */}
        <section className="mb-32">
          <div className="flex items-end justify-between pb-4 border-b border-white/15 mb-12">
            <div>
              <span className="text-xs font-syne uppercase tracking-[0.25em] text-[#e2d4b7]">GALLERY WING I</span>
              <h3 className="text-3xl sm:text-4xl font-serif italic text-white mt-1">Installed Systems</h3>
            </div>
            <span className="text-xs font-sans text-white/40 tracking-wider">DOLLY SCROLL TO TRAVEL</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left exhibition list */}
            <div className="lg:col-span-6 space-y-4">
              {PORTFOLIO_DATA.projects.map((proj, i) => {
                const isSelected = selectedExhibition.id === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedExhibition(proj)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                      isSelected
                        ? "bg-white/[0.08] border-[#e2d4b7] shadow-[0_0_40px_rgba(226,212,183,0.1)]"
                        : "bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70"
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-syne uppercase tracking-[0.2em] text-[#e2d4b7] mb-1">
                        INSTALLATION N&deg; 0{i + 1} &middot; {proj.category}
                      </div>
                      <h4 className="text-xl font-serif italic text-white">{proj.title}</h4>
                      <p className="text-xs font-sans text-white/50 mt-1">{proj.tagline}</p>
                    </div>
                    <ChevronRight
                      size={18}
                      className={isSelected ? "text-[#e2d4b7] translate-x-1" : "text-white/20"}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right museum plinth inspection card */}
            <div className="lg:col-span-6 sticky top-28 p-8 rounded-3xl bg-[#0a0a0a]/90 border border-white/15 backdrop-blur-2xl plinth-shadow">
              <span className="text-[10px] font-syne uppercase tracking-[0.25em] text-[#e2d4b7] block mb-2">
                EXHIBIT CATALOGUE ENTRY
              </span>
              <h4 className="text-3xl font-serif italic text-white mb-2">{selectedExhibition.title}</h4>
              <p className="text-xs font-sans text-white/50 mb-6">{selectedExhibition.subtitle}</p>

              <p className="text-sm font-sans text-white/75 leading-relaxed font-light mb-8">
                {selectedExhibition.description}
              </p>

              <div className="mb-8 pt-4 border-t border-white/10">
                <span className="block text-[11px] font-syne uppercase tracking-wider text-white/40 mb-2">
                  CONSTRUCTION MEDIUMS
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedExhibition.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs font-sans rounded-full bg-white/5 text-white/80 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {selectedExhibition.github && (
                <a
                  href={selectedExhibition.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e2d4b7] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-white transition-all"
                >
                  <span>Request Full Dossier</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Wing II: Career Chronology */}
        <section className="mb-32">
          <div className="pb-4 border-b border-white/15 mb-12">
            <span className="text-xs font-syne uppercase tracking-[0.25em] text-[#e2d4b7]">GALLERY WING II</span>
            <h3 className="text-3xl sm:text-4xl font-serif italic text-white mt-1">Provenance & Career Record</h3>
          </div>

          <div className="space-y-12">
            {PORTFOLIO_DATA.experiences.map((exp, idx) => (
              <div key={idx} className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                  <h4 className="text-2xl sm:text-3xl font-serif italic text-white">
                    {exp.company} &mdash; <span className="text-[#e2d4b7] font-normal">{exp.role}</span>
                  </h4>
                  <span className="text-xs font-sans text-white/40">{exp.period}</span>
                </div>

                <p className="text-sm font-sans text-white/70 leading-relaxed font-light mb-6">{exp.summary}</p>

                <div className="space-y-2 mb-6">
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs font-sans text-white/60">
                      <span className="text-[#e2d4b7]">&bull;</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {exp.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-[11px] font-sans rounded-md bg-white/5 text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Contact Pavilion */}
        <footer className="pt-20 border-t border-white/15 text-center">
          <span className="text-xs font-syne uppercase tracking-[0.25em] text-[#e2d4b7] block mb-2">
            INQUIRIES & ACQUISITIONS
          </span>
          <h3 className="text-4xl sm:text-5xl font-serif italic text-white mb-6">Connect with the Engineer</h3>
          <p className="text-sm font-sans text-white/60 max-w-md mx-auto mb-8 font-light">
            Available for principal machine learning engineering appointments, research partnerships, and agent system advisory.
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="px-8 py-3.5 rounded-full bg-[#e2d4b7] text-black font-syne font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(226,212,183,0.3)]"
            >
              {PORTFOLIO_DATA.personal.email}
            </a>
          </div>

          <div className="text-xs font-sans text-white/30 font-light">
            &copy; {new Date().getFullYear()} Ubaid Ghante &middot; Spatial Museum Exhibition Edition
          </div>
        </footer>
      </main>
    </div>
  );
}
