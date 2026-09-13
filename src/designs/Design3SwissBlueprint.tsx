import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Compass,
  Download,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export function Design3SwissBlueprint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "skills">("projects");

  // Three.js Isometric CAD Pipeline Architecture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    let handleResize: () => void;

    try {
      const scene = new THREE.Scene();
      // Orthographic camera for true architectural isometric CAD projection
      const aspect = window.innerWidth / window.innerHeight;
      const d = 12;
      const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
      camera.position.set(20, 20, 20);
      camera.lookAt(scene.position);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Construct architectural MLOps cluster nodes
      const group = new THREE.Group();
      scene.add(group);

      // Grid plane
      const gridHelper = new THREE.GridHelper(30, 30, 0x38bdf8, 0x1e293b);
      gridHelper.position.y = -4;
      scene.add(gridHelper);

      // Box nodes representing microservices and agent clusters
      const boxGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      const meshMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.8 });

      const nodes: THREE.Group[] = [];
      const positions = [
        [-6, 0, -6],
        [0, 2, -6],
        [6, 0, -6],
        [-6, 1, 0],
        [0, 3, 0], // Central LLM inference router
        [6, 1, 0],
        [-6, 0, 6],
        [0, 2, 6],
        [6, 0, 6],
      ];

      positions.forEach(([x, y, z]) => {
        const nodeGroup = new THREE.Group();
        const mesh = new THREE.Mesh(boxGeo, meshMat);
        const wire = new THREE.LineSegments(edgesGeo, lineMat);
        nodeGroup.add(mesh);
        nodeGroup.add(wire);
        nodeGroup.position.set(x, y, z);
        group.add(nodeGroup);
        nodes.push(nodeGroup);
      });

      // Connecting pipeline dimension vectors
      const linePoints: THREE.Vector3[] = [];
      positions.forEach(([x, y, z]) => {
        linePoints.push(new THREE.Vector3(x, y, z));
        linePoints.push(new THREE.Vector3(0, 3, 0));
      });
      const connectorGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const connectorMat = new THREE.LineDashedMaterial({
        color: 0xff6b35,
        dashSize: 0.5,
        gapSize: 0.3,
      });
      const connectors = new THREE.LineSegments(connectorGeo, connectorMat);
      connectors.computeLineDistances();
      group.add(connectors);

      let clock = new THREE.Clock();

      const animate = () => {
        const time = clock.getElapsedTime();
        const scrollY = window.scrollY * 0.001;

        // Rotate architectural isometric assembly with scroll
        group.rotation.y = time * 0.08 + scrollY;

        nodes.forEach((node, idx) => {
          node.position.y = positions[idx][1] + Math.sin(time * 1.5 + idx) * 0.3;
        });

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();

      handleResize = () => {
        const newAspect = window.innerWidth / window.innerHeight;
        camera.left = -d * newAspect;
        camera.right = d * newAspect;
        camera.top = d;
        camera.bottom = -d;
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
    <div ref={containerRef} className="relative min-h-screen bg-[#0b111e] text-[#f8fafc] font-blueprint selection:bg-[#ff6b35] selection:text-white overflow-x-hidden blueprint-grid">
      {/* 3D Isometric CAD Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-55" />

      {/* Blueprint Header Rulers & Specs */}
      <header className="relative z-20 border-b border-white/20 bg-[#0b111e]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 border border-[#38bdf8] flex items-center justify-center text-[#38bdf8] font-bold text-sm bg-[#38bdf8]/10">
              UG
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-white flex items-center gap-2">
                <span>SPEC: UBAID_GHANTE_ML_SYSTEMS</span>
                <span className="px-1.5 py-0.2 bg-[#ff6b35] text-black text-[10px] font-bold">REV 2026.08</span>
              </div>
              <div className="text-[10px] text-white/50 tracking-wider">
                SCALE: 1:170M // KORN FERRY &middot; AGENTIC WORKFLOWS &middot; MLOPS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline text-white/40">TOLERANCE: &plusmn;0.001ms</span>
            <a
              href={PORTFOLIO_DATA.personal.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black transition-all font-bold text-xs"
            >
              <Download size={13} />
              <span>DWG RESUME [PDF]</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Architectural Specification */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-28">
        <div className="border border-white/20 p-8 md:p-12 bg-[#0b111e]/85 backdrop-blur-xl mb-16 relative">
          {/* CAD corner marks */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#38bdf8]" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#38bdf8]" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#38bdf8]" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#38bdf8]" />

          <div className="flex items-center gap-3 text-xs text-[#38bdf8] mb-4">
            <Compass size={16} />
            <span>ARCHITECTURAL SCHEMATIC // MACHINE LEARNING ENGINEERING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase font-grotesk">
            UBAID GHANTE
            <br />
            <span className="text-[#38bdf8]">SYSTEMS BLUEPRINT</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-3xl leading-relaxed mb-8">
            Detailed engineering specifications for multi-agent workflows, autonomous LangGraph graphs, custom banking Model Context Protocol (MCP) servers, and scalable Kubernetes MLOps serving 170M+ profiles.
          </p>

          {/* Metric Dimension Callouts */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            {PORTFOLIO_DATA.personal.stats.map((s, i) => (
              <div key={i} className="p-3 border border-white/10 bg-white/[0.02]">
                <span className="block text-[10px] text-[#ff6b35] font-bold">DIM_0{i + 1}</span>
                <span className="block text-2xl sm:text-3xl font-bold text-white font-grotesk">{s.value}</span>
                <span className="block text-xs text-white/80 font-semibold">{s.label}</span>
                <span className="block text-[10px] text-white/40">{s.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbed CAD Spec Selector */}
        <div className="flex border-b border-white/20 mb-10 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-3 border-b-2 transition-all ${
              activeTab === "projects"
                ? "border-[#ff6b35] text-[#ff6b35] bg-white/[0.03]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            01. Structural Projects
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-6 py-3 border-b-2 transition-all ${
              activeTab === "experience"
                ? "border-[#ff6b35] text-[#ff6b35] bg-white/[0.03]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            02. Engineering Positions
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-6 py-3 border-b-2 transition-all ${
              activeTab === "skills"
                ? "border-[#ff6b35] text-[#ff6b35] bg-white/[0.03]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            03. Component Schematics
          </button>
        </div>

        {/* Tab 1: Structural Projects */}
        {activeTab === "projects" && (
          <div className="grid md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="border border-white/15 p-6 bg-[#0b111e]/90 backdrop-blur-md hover:border-[#38bdf8] transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-white/10">
                    <span className="text-[#38bdf8] font-bold">DWG #{idx + 101} // {proj.category}</span>
                    {proj.stats && (
                      <span className="text-[#ff6b35] font-bold">
                        {proj.stats.label}: {proj.stats.value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 font-grotesk">{proj.title}</h3>
                  <div className="text-xs text-white/50 mb-3">{proj.subtitle}</div>
                  <p className="text-xs text-white/70 leading-relaxed mb-6">{proj.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6 pt-3 border-t border-white/10">
                    {proj.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] bg-white/5 text-[#38bdf8] border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6b35] hover:underline"
                    >
                      <span>VIEW SOURCE DRAWINGS &rarr;</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Engineering Positions */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            {PORTFOLIO_DATA.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="border border-white/15 p-8 bg-[#0b111e]/90 backdrop-blur-md relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="text-lg font-bold text-white font-grotesk">
                    {exp.company} &mdash; <span className="text-[#38bdf8]">{exp.role}</span>
                  </div>
                  <span className="text-xs text-[#ff6b35] font-bold">{exp.period}</span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed mb-6">{exp.summary}</p>

                <div className="space-y-2 mb-6">
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                      <span className="text-[#ff6b35]">&rsaquo;</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                  {exp.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] bg-white/5 text-white/60 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Component Schematics (Skills) */}
        {activeTab === "skills" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PORTFOLIO_DATA.skills).map(([cat, items], idx) => (
              <div key={idx} className="border border-white/15 p-6 bg-[#0b111e]/90">
                <h4 className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                  SECTION {idx + 1} &middot; {cat}
                </h4>
                <div className="space-y-1.5">
                  {items.map((skill) => (
                    <div key={skill} className="flex items-center justify-between text-xs py-1 border-b border-white/5 text-white/70">
                      <span>{skill}</span>
                      <span className="text-[10px] text-[#ff6b35]">PASS</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Technical Drawing Stamp */}
        <div className="mt-20 border-2 border-white/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs bg-[#0b111e]/95">
          <div>
            <span className="font-bold text-white block">ENGINEERING APPROVAL // UBAID GHANTE</span>
            <span className="text-white/40 text-[10px]">CONTACT: {PORTFOLIO_DATA.personal.email} &middot; {PORTFOLIO_DATA.personal.phone}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="px-4 py-2 border border-[#ff6b35] text-[#ff6b35] font-bold hover:bg-[#ff6b35] hover:text-black transition-all"
            >
              TRANSMIT INQUIRY
            </a>
            <a
              href={PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={PORTFOLIO_DATA.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
