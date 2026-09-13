import { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { TumblingCenterpieceCanvas } from '../components/TumblingCenterpieceCanvas';
import { InteractiveSwarmCanvas } from '../components/InteractiveSwarmCanvas';
import { Rocket, Satellite, Radio, ExternalLink, Terminal } from 'lucide-react';

export const Design1SpaceOdyssey: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const missions = [
    {
      code: 'MISSION 01 // ORBITAL SCALE',
      title: 'Korn Ferry — 170M+ Profile Telemetry',
      role: 'Machine Learning Engineer (Nov 2025 – Present)',
      stat: '170M+',
      statLabel: 'Candidate Profiles Orchestrated',
      summary: 'Architected ResearchFox multi-agent system. LLM Job Classifier, Salary Prediction Engine, and Tableau MCP server deployed on Datadog & Arize AX.',
      tags: ['LangGraph', 'CrewAI', 'FastAPI', 'Datadog', 'Arize AX', 'Docker'],
      link: 'https://linkedin.com/in/ubaid-ghante-72a350193/',
    },
    {
      code: 'MISSION 02 // AUTONOMOUS SWARMS',
      title: 'ACE Software — Banking Agent Constellation',
      role: 'AI / Machine Learning Engineer (Nov 2024 – Nov 2025)',
      stat: '100%',
      statLabel: 'Multi-Agent Autonomous Execution',
      summary: 'Deployed financial agent pipelines using CrewAI & LangGraph over Amazon Bedrock. Integrated banking MCP tools, PostgreSQL vector search, and synthetic financial simulators.',
      tags: ['Bedrock', 'CrewAI', 'LangGraph', 'MCP Tools', 'PostgreSQL'],
      link: 'https://github.com/UbaidG',
    },
    {
      code: 'MISSION 03 // DEEP PROBE',
      title: 'Kratin — 20,890+ Patient Clinical Telemetry',
      role: 'Data Scientist & ML Intern (Jan 2023 – Nov 2024)',
      stat: '20,890',
      statLabel: 'Patients Monitored For Lymphedema',
      summary: 'Engineered Speech-to-Text clinical reporting agent with RASA & RAG. Developed Neo4j knowledge graphs and automated appointment schedulers.',
      tags: ['Speech-to-Text', 'RAG', 'RASA', 'Neo4j', 'FastAPI'],
      link: 'https://github.com/UbaidG',
    },
    {
      code: 'MISSION 04 // FLIGHT CREW CREDENTIALS',
      title: 'B.Tech CSE & Elite Certifications',
      role: 'GH Raisoni College of Engineering (9.3 CGPA)',
      stat: '9.3',
      statLabel: 'Cumulative Grade Point Average',
      summary: '5x IBM & Google Certified (Jan 2026): Deep Learning, AI Engineering, Generative AI & Machine Learning Specialization.',
      tags: ['Deep Learning', 'PyTorch', 'TensorFlow', 'LLMs'],
      link: portfolioData.personal.resumeUrl,
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 1. Deep Space Starfield & Cosmic Nebula Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-black via-transparent to-transparent" />
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* 2. Interactive Swarm: Cosmic Asteroid Debris flowing across the screen */}
      <InteractiveSwarmCanvas mode="asteroids" count={120} className="fixed inset-0 pointer-events-auto z-10" />

      {/* 3. Sticky 3D Centerpiece: Tumbling Astronaut Helmet */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px]">
          <TumblingCenterpieceCanvas type="astronaut_helmet" scrollProgress={scrollProgress} sizeMultiplier={1.05} />
        </div>
      </div>

      {/* 4. Top Telemetry Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#030712]/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-300">
            DEEP SPACE ODYSSEY // MLE TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:inline font-mono text-xs text-slate-400">
            TRAJECTORY: <span className="text-cyan-400">{(scrollProgress * 100).toFixed(0)}% AU</span>
          </span>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase hover:bg-cyan-500/20 transition-colors"
          >
            <Terminal size={14} /> Flight Log (PDF)
          </a>
        </div>
      </header>

      {/* 5. Main Content: Movie-like Viewport Scenes */}
      <main className="relative z-30 pt-32 pb-48 max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Frame */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-sm">
            <Radio size={13} className="animate-pulse" /> LIVE TELEMETRY: NO ERROR DETECTED
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight uppercase max-w-4xl leading-none">
            Ubaid <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Ghante</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light mt-6 max-w-2xl">
            Machine Learning Engineer & Multi-Agent Systems Architect
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>SCROLL TO TUMBLE HELMET</span>
            <span className="text-cyan-400">✦</span>
            <span>HOVER TO SCATTER ASTEROIDS</span>
          </div>
        </section>

        {/* Alternating Mission Cards Flanking the Tumbling 3D Helmet */}
        <div className="space-y-48 mt-24">
          {missions.map((mission, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={mission.code}
                className={`flex flex-col ${isLeft ? 'md:items-start' : 'md:items-end'} w-full`}
              >
                <div className="w-full md:w-[460px] p-8 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-cyan-500/50 transition-all group">
                  <div className="flex items-center justify-between font-mono text-xs text-cyan-400 tracking-wider mb-3">
                    <span>{mission.code}</span>
                    <Satellite size={16} />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {mission.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-1 mb-4">{mission.role}</div>

                  {/* Stat Callout */}
                  <div className="my-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-baseline gap-3">
                    <span className="text-4xl font-black text-cyan-400 tracking-tight font-mono">{mission.stat}</span>
                    <span className="text-xs text-slate-300 font-medium">{mission.statLabel}</span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
                    {mission.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {mission.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded bg-slate-800/70 border border-slate-700 text-slate-300 text-xs font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={mission.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Transmit Signal <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orbit Landing Call to Action */}
        <section className="mt-56 text-center py-20 border-t border-slate-800/80">
          <div className="inline-block p-4 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 mb-6">
            <Rocket size={32} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">Ready For Launch</h2>
          <p className="text-slate-400 max-w-md mx-auto mt-4 text-sm font-light">
            Connecting intelligent agent swarms to production infrastructure.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400 transition-all shadow-[0_0_24px_rgba(6,182,212,0.4)]"
            >
              Establish Uplink
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-semibold text-sm hover:bg-slate-700 transition-all"
            >
              LinkedIn Profile
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
