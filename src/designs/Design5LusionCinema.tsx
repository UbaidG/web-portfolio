import { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { TumblingCenterpieceCanvas } from '../components/TumblingCenterpieceCanvas';
import { InteractiveSwarmCanvas } from '../components/InteractiveSwarmCanvas';
import { ArrowUpRight, Crosshair, Zap, ChevronDown } from 'lucide-react';

export const Design5LusionCinema: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scenes = [
    {
      frameNum: 'FRAME 01',
      bigMetric: '170M+ PROFILES',
      title: 'ORCHESTRATED IN REAL TIME',
      org: 'Korn Ferry — Machine Learning Engineer (Nov 2025 – Present)',
      description: 'ResearchFox multi-agent system, LLM Job Classifier, Salary Predictor, and Tableau MCP server with Arize AX & Datadog observability.',
      tag: 'SCALE: PETABYTE DATA',
      link: 'https://linkedin.com/in/ubaid-ghante-72a350193/',
    },
    {
      frameNum: 'FRAME 02',
      bigMetric: 'AUTONOMOUS SWARMS',
      title: 'BANKING MCP CORES DEPLOYED',
      org: 'ACE Software Solutions — AI / ML Engineer (Nov 2024 – Nov 2025)',
      description: 'CrewAI & LangGraph financial agent workflows over Amazon Bedrock. Zero-latency banking tool execution and pgvector semantic retrieval.',
      tag: 'LATENCY: < 100MS',
      link: 'https://github.com/UbaidG',
    },
    {
      frameNum: 'FRAME 03',
      bigMetric: '20,890 PATIENTS',
      title: 'SPEECH CLINICAL TELEMETRY',
      org: 'Kratin LLC — Data Scientist & ML Intern (Jan 2023 – Nov 2024)',
      description: 'Speech-to-Text clinical agent monitoring lymphedema progression with RASA & RAG. Automated healthcare knowledge graphs in Neo4j.',
      tag: 'IMPACT: HEALTHCARE AI',
      link: 'https://github.com/UbaidG',
    },
    {
      frameNum: 'FRAME 04',
      bigMetric: 'SUMMA CUM LAUDE 9.3',
      title: 'TOP 1% ACADEMIC DISTINCTION',
      org: 'GH Raisoni College of Engineering (B.Tech CSE)',
      description: '5x IBM & Google Certified (Jan 2026): Deep Learning, AI Engineering, Generative AI & Machine Learning Specialization.',
      tag: 'HONORS: 5X CERTIFIED',
      link: portfolioData.personal.resumeUrl,
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* 1. Lusion Cinema Laser Lines & Crosshair Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated Laser Grid Lines */}
        <div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 transition-all duration-75"
          style={{ top: `${(scrollProgress * 100).toFixed(1)}%` }}
        />
        <div
          className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-25"
          style={{ left: `${((mousePos.x / (window.innerWidth || 1)) * 100).toFixed(1)}%` }}
        />

        {/* Framing border corners */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/30" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/30" />
      </div>

      {/* 2. Interactive Swarm: Floating Laser Shards that scatter on mouse */}
      <InteractiveSwarmCanvas mode="cards" count={90} className="fixed inset-0 pointer-events-auto z-10" />

      {/* 3. Sticky 3D Centerpiece: Tumbling 3D Primary Ion Drive Engine */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="w-[340px] h-[340px] md:w-[520px] md:h-[520px] opacity-90">
          <TumblingCenterpieceCanvas type="ion_drive" scrollProgress={scrollProgress} sizeMultiplier={1.0} />
        </div>
      </div>

      {/* 4. Top Cinematic HUD */}
      <header className="fixed top-0 inset-x-0 z-40 bg-black/60 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
            LUSION CINEMA // SCENE PROGRESS: {(scrollProgress * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:inline font-mono text-xs text-slate-400">
            FPS: 60 // RES: 4K HDR
          </span>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1 rounded border border-white text-xs font-mono uppercase hover:bg-white hover:text-black transition-colors"
          >
            RESUME (PDF)
          </a>
        </div>
      </header>

      {/* 5. Fullscreen Movie Scenes as You Scroll */}
      <main className="relative z-30 max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Scene */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center">
          <div className="font-mono text-xs tracking-widest text-cyan-400 uppercase mb-4 flex items-center gap-2">
            <Zap size={14} /> SCROLL INTO FRAMES // A FILM BY UBAID GHANTE
          </div>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">
            UBAID GHANTE
          </h1>
          <div className="mt-6 text-xl md:text-3xl font-light text-slate-300 tracking-wide">
            MACHINE LEARNING ENGINEER & AGENT ARCHITECT
          </div>
          <div className="mt-16 flex items-center gap-2 font-mono text-xs text-slate-400 animate-bounce">
            <ChevronDown size={18} /> SCROLL TO STEP THROUGH FRAMES
          </div>
        </section>

        {/* Movie Frame Scenes */}
        <div className="space-y-[60vh] pb-56">
          {scenes.map((scene, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={scene.frameNum}
                className={`min-h-[70vh] flex flex-col justify-center ${isEven ? 'items-start' : 'items-end'}`}
              >
                <div className="w-full md:w-[540px] p-10 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.9)] hover:border-cyan-400 transition-all group">
                  {/* Laser Frame Header */}
                  <div className="flex items-center justify-between font-mono text-xs text-cyan-400 tracking-widest pb-4 border-b border-white/10 mb-6">
                    <span>{scene.frameNum}</span>
                    <span>{scene.tag}</span>
                  </div>

                  {/* Gigantic Metric */}
                  <div className="text-4xl md:text-5xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors uppercase leading-none">
                    {scene.bigMetric}
                  </div>
                  <div className="text-lg md:text-xl font-bold text-slate-300 uppercase tracking-wide mt-2">
                    {scene.title}
                  </div>

                  <div className="mt-4 text-xs font-mono text-slate-400">
                    {scene.org}
                  </div>

                  <p className="mt-4 text-sm text-slate-300 font-light leading-relaxed">
                    {scene.description}
                  </p>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Crosshair size={14} className="text-cyan-400" /> DIRECT CUT
                    </span>
                    <a
                      href={scene.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-bold uppercase hover:bg-cyan-400 transition-colors"
                    >
                      PLAY SCENE <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* End Credits Scene */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center border-t border-white/10">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">
            END CREDITS // EXECUTIVE PRODUCER
          </div>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tight">
            DIRECTED FOR IMPACT
          </h2>
          <p className="text-slate-400 max-w-md mt-6 text-sm font-light">
            Bringing cinematic polish and distributed scale to autonomous AI systems.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-sm hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              HIRE THE ARCHITECT
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full border border-white/40 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              LINKEDIN CREDITS
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
