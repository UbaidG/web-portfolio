import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { TumblingCenterpieceCanvas } from '../components/TumblingCenterpieceCanvas';
import { InteractiveSwarmCanvas } from '../components/InteractiveSwarmCanvas';
import { Gamepad2, Trophy, Zap, ExternalLink, Play, Disc } from 'lucide-react';

export const Design6NeonArcadePinball: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [score, setScore] = useState(170890250);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
      setScore(Math.floor(170890250 + progress * 50000000));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stages = [
    {
      level: 'STAGE 01 // HIGH SCORE',
      pts: '170M+ PTS',
      title: 'Korn Ferry — Agentic Multi-Swarms',
      role: 'Machine Learning Engineer (Nov 2025 – Present)',
      multiplier: 'x10 MULTIPLIER',
      mechanics: 'Deployed ResearchFox agent swarms, LLM Job Classifier, Salary Prediction Model, and Tableau MCP Server on Datadog & Arize AX.',
      combos: ['LangGraph', 'CrewAI', 'FastAPI', 'Datadog', 'Arize AX'],
      link: 'https://linkedin.com/in/ubaid-ghante-72a350193/',
    },
    {
      level: 'STAGE 02 // ZERO LATENCY',
      pts: '100% COMBO',
      title: 'ACE Software — Banking MCP Server',
      role: 'AI / Machine Learning Engineer (Nov 2024 – Nov 2025)',
      multiplier: 'x5 MULTIPLIER',
      mechanics: 'Engineered Amazon Bedrock financial pipelines, banking tool execution with Model Context Protocol, and PostgreSQL vector search.',
      combos: ['Bedrock', 'CrewAI', 'Banking MCP', 'pgvector'],
      link: 'https://github.com/UbaidG',
    },
    {
      level: 'STAGE 03 // CLINICAL BOSS',
      pts: '20,890 LIVES',
      title: 'Kratin — Voice AI & Health Graphs',
      role: 'Data Scientist & ML Intern (Jan 2023 – Nov 2024)',
      multiplier: 'x3 MULTIPLIER',
      mechanics: 'Constructed Speech-to-Text RASA voice pipeline for lymphedema progression and automated healthcare appointment graphs in Neo4j.',
      combos: ['Speech-to-Text', 'RASA', 'Neo4j', 'RAG'],
      link: 'https://github.com/UbaidG',
    },
    {
      level: 'STAGE 04 // HALL OF FAME',
      pts: '9.3 CGPA',
      title: 'GH Raisoni CSE & 5x Certified',
      role: 'Summa Cum Laude Graduate (2024)',
      multiplier: 'JACKPOT CLEAR',
      mechanics: '5x IBM & Google Certified (Jan 2026): Deep Learning, AI Engineering, Generative AI & Machine Learning Specialization.',
      combos: ['Deep Learning', 'PyTorch', 'TensorFlow', 'LLMs'],
      link: portfolioData.personal.resumeUrl,
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#090214] text-pink-50 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* 1. Cyberpunk Neon Arcade Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#2b0938_0%,#090214_85%)]" />
        {/* Neon floor perspective grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ec489915_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* 2. Interactive Swarm: Neon Arcade Tokens & Spheres flowing across the screen */}
      <InteractiveSwarmCanvas mode="chips" count={120} className="fixed inset-0 pointer-events-auto z-10" />

      {/* 3. Sticky 3D Centerpiece: Heavy 3D Pinball Token Tumbling Down */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px]">
          <TumblingCenterpieceCanvas type="casino_chip" scrollProgress={scrollProgress} sizeMultiplier={1.05} />
        </div>
      </div>

      {/* 4. Retro Arcade Top Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#090214]/90 backdrop-blur-md border-b border-pink-500/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gamepad2 className="text-pink-500 animate-bounce" size={22} />
          <div>
            <div className="font-black text-xs uppercase tracking-widest text-pink-400">
              NEON ARCADE COLLIDER // 1-PLAYER
            </div>
            <div className="text-[10px] font-mono text-cyan-400">CREDITS: 99 // READY TO ROLL</div>
          </div>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-pink-950/40 border border-pink-500/40 text-pink-300 font-mono text-xs">
            <Trophy size={14} className="text-yellow-400" />
            <span>SCORE: <span className="text-white font-bold">{score.toLocaleString()}</span></span>
          </div>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 text-black text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(236,72,153,0.5)]"
          >
            INSERT COIN (PDF)
          </a>
        </div>
      </header>

      {/* 5. Main Viewport Scenes */}
      <main className="relative z-30 pt-32 pb-48 max-w-7xl mx-auto px-6 md:px-12">
        {/* Arcade Attract Mode Hero */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-300 text-xs font-mono mb-6 backdrop-blur-sm">
            <Zap size={14} className="text-yellow-400 animate-pulse" /> HIGH ROLLER ARCADE // PRESS SCROLL TO PLAY
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_35px_rgba(236,72,153,0.6)]">
            Ubaid <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">Ghante</span>
          </h1>
          <p className="text-lg md:text-2xl text-pink-200/90 font-light mt-4 max-w-2xl">
            High-Score Machine Learning Engineer & Autonomous Agent Developer
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-cyan-400">
            <span>SCROLL TO TUMBLE PINBALL</span>
            <span className="text-pink-400">★</span>
            <span>SWEEP CURSOR TO BUMP TOKENS</span>
          </div>
        </section>

        {/* Flanking Arcade Stage Cards */}
        <div className="space-y-48 mt-24">
          {stages.map((stg, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={stg.level}
                className={`flex flex-col ${isLeft ? 'md:items-start' : 'md:items-end'} w-full`}
              >
                <div className="w-full md:w-[480px] p-8 rounded-2xl bg-[#130524]/90 backdrop-blur-xl border border-pink-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all group">
                  <div className="flex items-center justify-between mb-4 border-b border-pink-500/20 pb-3">
                    <span className="font-mono text-xs font-bold text-pink-400 tracking-wider">
                      {stg.level}
                    </span>
                    <span className="font-mono text-xs font-bold text-yellow-400">{stg.multiplier}</span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors uppercase">
                    {stg.title}
                  </h3>
                  <div className="text-xs font-mono text-pink-300/80 mt-1 mb-4">{stg.role}</div>

                  {/* High Score Callout */}
                  <div className="my-5 p-4 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-pink-400/80">Stage Cleared</div>
                      <div className="text-3xl font-mono font-black text-cyan-300 tracking-tight">{stg.pts}</div>
                    </div>
                    <Disc className="text-pink-400 animate-spin" size={28} />
                  </div>

                  <p className="text-sm text-pink-100/90 leading-relaxed font-light mb-6">
                    {stg.mechanics}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {stg.combos.map((c) => (
                      <span key={c} className="px-2.5 py-1 rounded bg-black/50 border border-pink-500/30 text-pink-200 text-xs font-mono">
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-pink-500/20 text-xs font-mono">
                    <span className="text-pink-400/80 flex items-center gap-1.5">
                      <Play size={13} className="text-cyan-400" /> STAGE COMPLETE
                    </span>
                    <a
                      href={stg.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-300 hover:text-white transition-colors"
                    >
                      Audit Replay <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Game Over / Insert Coin Call */}
        <section className="mt-56 text-center py-20 border-t border-pink-500/30">
          <div className="inline-block p-4 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-400 mb-6 animate-pulse">
            <Trophy size={36} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_25px_rgba(236,72,153,0.5)]">
            STAGE CLEAR // NEW CHALLENGER
          </h2>
          <p className="text-pink-300/80 max-w-md mx-auto mt-4 text-sm font-light">
            Ready to bring high-combo engineering firepower to your AI engineering team.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 font-mono">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-black font-black text-sm hover:opacity-95 transition-all shadow-[0_0_25px_rgba(236,72,153,0.6)]"
            >
              HIRE PLAYER 1
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-xl bg-black/60 border border-pink-500/40 text-pink-200 font-bold text-sm hover:bg-black/80 transition-all"
            >
              LINKEDIN HIGHSCORES
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
