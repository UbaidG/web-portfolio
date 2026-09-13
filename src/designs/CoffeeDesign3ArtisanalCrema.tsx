import { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { CoffeeMug3DCanvas } from '../components/CoffeeMug3DCanvas';
import { RealisticCoffeeBeanStream } from '../components/RealisticCoffeeBeanStream';
import { HorizontalScrollRunway } from '../components/HorizontalScrollRunway';
import { Coffee, Sparkles } from 'lucide-react';

export const CoffeeDesign3ArtisanalCrema: React.FC = () => {
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

  const corePillars = [
    {
      title: 'The Multi-Agent Roast',
      subtitle: 'Korn Ferry — 170M+ Candidate Intelligence',
      body: 'Architected ResearchFox multi-agent orchestration platform using LangGraph, CrewAI, and FastAPI. Integrated Tableau MCP server and Datadog APM.',
      metric: '170M+',
      metricLabel: 'PROFILES',
    },
    {
      title: 'Autonomous Financial Extraction',
      subtitle: 'ACE Software — Amazon Bedrock Banking Swarms',
      body: 'Implemented financial agent swarms with custom banking Model Context Protocol (MCP) servers and PostgreSQL pgvector semantic retrieval.',
      metric: '100%',
      metricLabel: 'AUTONOMOUS',
    },
    {
      title: 'Clinical Speech Synthesis',
      subtitle: 'Kratin LLC — 20,890+ Patient Telemetry',
      body: 'Constructed real-time Speech-to-Text clinical reporting agent with RASA & RAG. Automated patient progress monitoring and Neo4j healthcare knowledge graphs.',
      metric: '20,890',
      metricLabel: 'PATIENTS',
    },
    {
      title: 'Academic Distinction',
      subtitle: 'GH Raisoni College of Engineering',
      body: 'Graduated with 9.3 CGPA in Computer Science. 5x certified across IBM and Google in Deep Learning, AI Engineering, and Generative AI (Jan 2026).',
      metric: '9.3',
      metricLabel: 'CGPA',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#140e0b] text-[#fbf7f2] font-serif selection:bg-[#c8925b] selection:text-black overflow-x-hidden">
      {/* Warm Mocha Taupe Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2b1a13_0%,#140e0b_80%)]" />
      </div>

      {/* Top Editorial Magazine Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#140e0b]/85 backdrop-blur-md border-b border-[#3b271d]/60 px-6 md:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#c8925b]/20 border border-[#c8925b] flex items-center justify-center text-[#c8925b] text-xs">
            ☕
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest text-[#fbf7f2]">
              ARTISANAL CREMA // EDITION 2026
            </div>
            <div className="text-[10px] font-mono text-[#c8925b]/80 font-sans">
              MACHINE LEARNING ARCHITECTURE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-sans">
          <span className="hidden md:inline text-xs text-[#a88d7b] font-mono">
            SCALE: 170M+ PROFILES
          </span>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 rounded-full border border-[#c8925b] text-[#fbf7f2] text-xs font-mono uppercase hover:bg-[#c8925b] hover:text-black transition-all"
          >
            RESUME (PDF)
          </a>
        </div>
      </header>

      {/* STAGE 1: Hero Scene with 3D Glass/Ceramic Cup & Realistic Roasted Bean Stream */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center text-center px-6 pt-28">
        {/* Realistic Coffee Bean Stream */}
        <RealisticCoffeeBeanStream count={130} speedMultiplier={0.7} className="absolute inset-0 pointer-events-auto z-10" />

        {/* Central 3D Ceramic Coffee Cup with Rising Steam */}
        <div className="relative z-20 w-[300px] h-[300px] md:w-[420px] md:h-[420px] mx-auto pointer-events-none mb-2">
          <CoffeeMug3DCanvas type="ceramic_mug" scrollProgress={scrollProgress} sizeMultiplier={1.05} />
        </div>

        {/* Content Overlays */}
        <div className="relative z-30 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24160d]/80 border border-[#c8925b]/40 text-[#c8925b] text-xs font-mono mb-4 backdrop-blur-sm font-sans">
            <Sparkles size={14} /> ARTISANAL COGNITION // 170M+ CANDIDATES
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
            Ubaid <span className="text-[#c8925b] italic font-light">Ghante</span>
          </h1>
          <p className="text-lg md:text-2xl text-[#d4b9a5] font-light mt-4 max-w-2xl mx-auto font-sans">
            Crafting deep learning architectures, multi-agent swarms, and low-latency voice AI with microscopic precision.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-[#a88d7b] font-sans">
            <span>HOVER TO SCATTER COFFEE BEANS</span>
            <span className="text-[#c8925b]">✦</span>
            <span>SCROLL DOWN TO REVEAL RUNWAY</span>
          </div>
        </div>
      </section>

      {/* Editorial Overview Cards */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 py-16 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {corePillars.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-2xl bg-[#1c1410] border border-[#3b271d] flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl font-mono font-black text-[#c8925b] mb-1">
                  {p.metric}
                </div>
                <div className="text-[10px] font-mono text-[#a88d7b] uppercase tracking-wider mb-4">
                  {p.metricLabel}
                </div>
                <h4 className="text-base font-bold text-white font-serif mb-2">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAGE 2: Horizontal Career Runway (Driven by Vertical Scroll Down) */}
      <section className="relative z-30">
        <HorizontalScrollRunway theme="artisanal_crema" />
      </section>

      {/* STAGE 3: Editorial Colophon & Direct Connection */}
      <section className="relative z-30 max-w-5xl mx-auto px-6 md:px-12 py-32 border-t border-[#3b271d] font-sans">
        <div className="p-12 rounded-3xl bg-[#1c1410] border border-[#c8925b]/30 text-center">
          <div className="inline-block p-4 rounded-full bg-[#c8925b]/20 text-[#c8925b] mb-6">
            <Coffee size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase tracking-tight">
            Crafting The Next Era of AI
          </h2>
          <p className="text-slate-300 max-w-md mx-auto mt-4 text-sm font-light">
            Looking for a Senior / Staff Machine Learning Engineer who pairs raw technical mastery with world-class execution?
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-8 py-3.5 rounded-full bg-[#c8925b] text-black font-bold text-sm hover:bg-[#d49e68] transition-all shadow-[0_0_25px_rgba(200,146,91,0.35)]"
            >
              Invite For A Coffee (Contact)
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
