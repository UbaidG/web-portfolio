import { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { CoffeeMug3DCanvas } from '../components/CoffeeMug3DCanvas';
import { RealisticCoffeeBeanStream } from '../components/RealisticCoffeeBeanStream';
import { HorizontalScrollRunway } from '../components/HorizontalScrollRunway';
import { Coffee, Gauge, ExternalLink, Sparkles, Cpu } from 'lucide-react';

export const CoffeeDesign1EspressoLab: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredProjects = [
    {
      title: 'Voice Agent Pipeline',
      category: 'Agentic AI / Audio',
      stat: '< 300ms',
      statLabel: 'Duplex Voice Latency',
      desc: 'Real-time bidirectional voice agent pipeline using LiveKit, WebRTC, Whisper speech recognition, and streaming LLMs with interruption handling.',
      tech: ['LiveKit', 'WebRTC', 'Whisper', 'FastAPI', 'Python'],
      link: 'https://github.com/UbaidG',
    },
    {
      title: 'Stitchit iOS Application',
      category: 'Computer Vision',
      stat: '98.4%',
      statLabel: 'Body Landmark Accuracy',
      desc: 'Native iOS tailoring app utilizing CoreML & Vision framework for real-time 3D body measurements and automated garment sizing.',
      tech: ['Swift', 'CoreML', 'Vision Framework', 'ARKit'],
      link: 'https://github.com/UbaidG',
    },
    {
      title: 'Gen AI Observability Dashboard',
      category: 'MLOps & Systems',
      stat: '100%',
      statLabel: 'Tracing & Audit Coverage',
      desc: 'Enterprise monitoring suite for multi-agent LLM systems with Tableau Model Context Protocol (MCP) integration, Datadog APM, and Arize AX.',
      tech: ['Tableau MCP', 'Datadog', 'Arize AX', 'Docker'],
      link: 'https://github.com/UbaidG',
    },
    {
      title: 'Clinical RAG Knowledge Graph',
      category: 'Healthcare AI',
      stat: '20,890+',
      statLabel: 'Patients Monitored',
      desc: 'Conversational clinical assistant built on Neo4j graph databases and hybrid vector retrieval for automated doctor consultation note generation.',
      tech: ['Neo4j', 'RAG', 'RASA Voice', 'FastAPI'],
      link: 'https://github.com/UbaidG',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#100b07] text-[#f7efe6] font-sans selection:bg-[#d97706] selection:text-black overflow-x-hidden">
      {/* Warm Roastery Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#24160d_0%,#0c0805_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3d271912_1px,transparent_1px),linear-gradient(to_bottom,#3d271912_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Top Specialty Coffee Bar Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#100b07]/90 backdrop-blur-md border-b border-[#3b271d] px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <Coffee size={16} />
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest text-white">
              THE ESPRESSO LAB // UBAID GHANTE
            </div>
            <div className="text-[10px] font-mono text-amber-400/80">
              MACHINE LEARNING & AGENTIC SYSTEMS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-[#24160d] border border-[#4a2e1d] text-xs font-mono text-amber-300">
            <Gauge size={13} className="text-amber-400" />
            <span>EXTRACTION: 9 BARS // OPTIMAL</span>
          </div>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(217,119,6,0.35)]"
          >
            RESUME (PDF)
          </a>
        </div>
      </header>

      {/* STAGE 1: Hero Section with 3D Coffee Mug & Realistic Coffee Bean Stream */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center text-center px-6 pt-28">
        {/* Realistic Coffee Bean Stream (Slow, seamless, cursor-disturbed) */}
        <RealisticCoffeeBeanStream count={130} speedMultiplier={0.75} className="absolute inset-0 pointer-events-auto z-10" />

        {/* Central 3D Ceramic Coffee Mug with Rising Steam */}
        <div className="relative z-20 w-[300px] h-[300px] md:w-[420px] md:h-[420px] mx-auto pointer-events-none mb-2">
          <CoffeeMug3DCanvas type="ceramic_mug" scrollProgress={scrollProgress} sizeMultiplier={1.05} />
        </div>

        {/* Content Overlays */}
        <div className="relative z-30 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24160d]/80 border border-amber-500/40 text-amber-300 text-xs font-mono mb-4 backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-400" /> SINGLE-ORIGIN MACHINE LEARNING // FUELING 170M+ PROFILES
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
            Ubaid <span className="text-amber-500">Ghante</span>
          </h1>
          <p className="text-lg md:text-2xl text-[#d4b9a5] font-light mt-4 max-w-2xl mx-auto">
            Machine Learning Engineer specializing in production-grade multi-agent swarms, low-latency voice AI, and scalable enterprise MLOps.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-amber-400/80">
            <span>DRAG CURSOR TO DEFLECT BEANS</span>
            <span className="text-amber-500">✦</span>
            <span>SCROLL DOWN TO ENTER RUNWAY</span>
          </div>
        </div>
      </section>

      {/* Key Metric Gauges */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#18110b] border border-[#3b271d]">
            <div className="text-4xl font-black font-mono text-amber-400">170M+</div>
            <div className="text-xs text-white font-medium mt-1">PROFILES IN PRODUCTION</div>
            <div className="text-[11px] text-slate-400 mt-1">Korn Ferry Enterprise Suite</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#18110b] border border-[#3b271d]">
            <div className="text-4xl font-black font-mono text-amber-400">9.3</div>
            <div className="text-xs text-white font-medium mt-1">B.TECH CGPA HONORS</div>
            <div className="text-[11px] text-slate-400 mt-1">Top 1% CSE Cohort</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#18110b] border border-[#3b271d]">
            <div className="text-4xl font-black font-mono text-amber-400">20,890</div>
            <div className="text-xs text-white font-medium mt-1">PATIENTS MONITORED</div>
            <div className="text-[11px] text-slate-400 mt-1">Speech-to-Text Clinical AI</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#18110b] border border-[#3b271d]">
            <div className="text-4xl font-black font-mono text-amber-400">5X</div>
            <div className="text-xs text-white font-medium mt-1">IBM & GOOGLE CERTIFIED</div>
            <div className="text-[11px] text-slate-400 mt-1">Deep Learning & AI (Jan 2026)</div>
          </div>
        </div>
      </section>

      {/* STAGE 2: Horizontal Scroll Runway (Vertical Scroll Drives Horizontal Slide Left) */}
      <section className="relative z-30">
        <HorizontalScrollRunway theme="dark_roast" />
      </section>

      {/* STAGE 3: Extraction Benchmarks & Featured Engineering Projects */}
      <section className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-[#3b271d]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Cpu size={14} /> PRODUCTION ROAST // FEATURED SYSTEMS
            </div>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">
              ENGINEERING BENCHMARKS
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-light">
            End-to-end architectures engineered for low latency, zero downtime, and massive scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((p) => (
            <div
              key={p.title}
              className="p-8 rounded-3xl bg-[#16100c] border border-[#3b271d] hover:border-amber-500/70 transition-all shadow-xl group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  {p.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                  {p.stat} {p.statLabel}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-slate-300 font-light mt-3 leading-relaxed">
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-2 mt-6 mb-6">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded bg-[#24160d] border border-[#4a2e1d] text-xs font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase text-amber-400 hover:text-white transition-colors"
              >
                Inspect Source Code <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>

        {/* Final Roastery Brew & Contact CTA */}
        <div className="mt-32 p-12 rounded-3xl bg-[#1c130d] border border-amber-500/40 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-block p-4 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 mb-6">
            <Coffee size={32} />
          </div>
          <h3 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">
            Ready to Brew Intelligent Systems?
          </h3>
          <p className="text-slate-300 max-w-lg mx-auto mt-4 text-sm font-light">
            Available for Senior / Staff Machine Learning & Autonomous Agent Roles.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-8 py-3.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-[0_0_25px_rgba(217,119,6,0.4)]"
            >
              Order An Espresso (Contact)
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-xl bg-black/60 border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              LinkedIn Connection
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
