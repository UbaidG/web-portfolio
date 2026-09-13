import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { TumblingCenterpieceCanvas } from '../components/TumblingCenterpieceCanvas';
import { InteractiveSwarmCanvas } from '../components/InteractiveSwarmCanvas';
import { Coins, Flame, Award, ExternalLink, Dices, Layers } from 'lucide-react';

export const Design2CasinoRoyale: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hands = [
    {
      cardName: 'THE ROYAL FLUSH',
      suit: '♠',
      role: 'Korn Ferry — Machine Learning Engineer',
      period: 'Nov 2025 – Present',
      jackpot: '170M+ PROFILES',
      description: 'High-stakes production multi-agent orchestration. Architected ResearchFox, LLM Job Classifier, and Tableau MCP server with Datadog & Arize AX observability.',
      stack: ['LangGraph', 'CrewAI', 'FastAPI', 'Datadog', 'Arize AX'],
      link: 'https://linkedin.com/in/ubaid-ghante-72a350193/',
    },
    {
      cardName: 'THE ACE OF SPADES',
      suit: '♣',
      role: 'ACE Software — AI / ML Engineer',
      period: 'Nov 2024 – Nov 2025',
      jackpot: 'ZERO-LATENCY MCP',
      description: 'Autonomous financial agent swarms powered by Amazon Bedrock. Implemented core banking Model Context Protocol (MCP) servers and vector RAG pipelines.',
      stack: ['Amazon Bedrock', 'CrewAI', 'LangGraph', 'PostgreSQL Vector'],
      link: 'https://github.com/UbaidG',
    },
    {
      cardName: 'THE KING OF DIAMONDS',
      suit: '♦',
      role: 'Kratin LLC — Data Scientist & ML Intern',
      period: 'Jan 2023 – Nov 2024',
      jackpot: '20,890 PATIENTS',
      description: 'Speech-to-Text clinical agent monitoring lymphedema progression. Engineered Neo4j knowledge graphs and automated healthcare scheduling bots.',
      stack: ['RASA', 'RAG', 'Speech-to-Text', 'Neo4j', 'FastAPI'],
      link: 'https://github.com/UbaidG',
    },
    {
      cardName: 'THE GOLDEN JACKPOT',
      suit: '♥',
      role: 'GH Raisoni College of Engineering',
      period: 'Summa Cum Laude Honors',
      jackpot: '9.3 CGPA / TOP 1%',
      description: 'Bachelor of Technology in Computer Science. 5x IBM & Google Certified (Jan 2026): Deep Learning, AI Engineering, and Machine Learning Specialization.',
      stack: ['Deep Learning', 'PyTorch', 'Agentic AI', 'TensorFlow'],
      link: portfolioData.personal.resumeUrl,
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#06140e] text-amber-50 font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* 1. Casino Baize Velvet Green Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#0e3820_0%,#041009_80%)]" />
        {/* Subtle gold grid filigree */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab3080a_1px,transparent_1px),linear-gradient(to_bottom,#eab3080a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      {/* 2. Interactive Swarm: 3D Golden Poker Chips & Dice cascading down that scatter on cursor move */}
      <InteractiveSwarmCanvas mode="chips" count={110} className="fixed inset-0 pointer-events-auto z-10" />

      {/* 3. Sticky 3D Centerpiece: Heavy Tumbling Gold Casino Chip */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px]">
          <TumblingCenterpieceCanvas type="casino_chip" scrollProgress={scrollProgress} sizeMultiplier={1.1} />
        </div>
      </div>

      {/* 4. Casino HUD Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#06140e]/90 backdrop-blur-md border-b border-amber-600/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-xs">
            UG
          </div>
          <div>
            <div className="font-serif font-bold text-xs uppercase tracking-widest text-amber-200">
              MONTE CARLO ROYALE
            </div>
            <div className="text-[10px] font-mono text-amber-400/80">HIGH ROLLER AI ARCHITECTURE</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Coins size={14} /> CHIP POT: $170M+
          </div>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
          >
            Cashier (Resume)
          </a>
        </div>
      </header>

      {/* 5. Main Viewport Scenes */}
      <main className="relative z-30 pt-32 pb-48 max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono mb-6 backdrop-blur-sm">
            <Dices size={14} className="text-amber-400 animate-spin" /> TABLE OPEN // NO LIMIT MACHINE LEARNING
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Ubaid <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">Ghante</span>
          </h1>
          <p className="text-lg md:text-2xl text-amber-200/90 font-light mt-4 max-w-2xl">
            When the stakes are high, you call in production-grade AI agents.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-amber-400/80">
            <span>SCROLL TO TUMBLE CASINO CHIP</span>
            <span className="text-amber-300">♦</span>
            <span>SWEEP CURSOR TO SCATTER CHIPS</span>
          </div>
        </section>

        {/* Flanking Casino Playing Cards */}
        <div className="space-y-48 mt-24">
          {hands.map((hand, idx) => {
            const isLeft = idx % 2 === 0;
            const isFlipped = activeCard === idx;
            return (
              <div
                key={hand.cardName}
                className={`flex flex-col ${isLeft ? 'md:items-start' : 'md:items-end'} w-full`}
              >
                <div
                  onClick={() => setActiveCard(isFlipped ? null : idx)}
                  className="cursor-pointer w-full md:w-[480px] p-8 rounded-2xl bg-[#081e14]/90 backdrop-blur-xl border border-amber-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all group"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
                    <span className="font-serif font-bold text-amber-400 text-sm tracking-widest flex items-center gap-2">
                      <span className="text-xl">{hand.suit}</span> {hand.cardName}
                    </span>
                    <span className="font-mono text-xs text-amber-300/70">{hand.period}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                    {hand.role}
                  </h3>

                  {/* Jackpot Ribbon */}
                  <div className="my-5 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-amber-300/80">Winning Hand</div>
                      <div className="text-3xl font-mono font-black text-amber-300 tracking-tight">{hand.jackpot}</div>
                    </div>
                    <Flame className="text-amber-400 animate-pulse" size={28} />
                  </div>

                  <p className="text-sm text-amber-100/90 leading-relaxed font-light mb-6">
                    {hand.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {hand.stack.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded bg-black/40 border border-amber-500/30 text-amber-200 text-xs font-mono">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-500/20 text-xs font-mono">
                    <span className="text-amber-400/80 flex items-center gap-1.5">
                      <Layers size={14} /> CLICK CARD TO INSPECT
                    </span>
                    <a
                      href={hand.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-amber-300 hover:text-white transition-colors"
                    >
                      Audit Proof <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Table Summary */}
        <section className="mt-56 text-center py-20 border-t border-amber-600/30">
          <div className="inline-block p-4 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 mb-6">
            <Award size={36} />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tight text-white">
            All In On Innovation
          </h2>
          <p className="text-amber-200/80 max-w-md mx-auto mt-4 text-sm font-light">
            Ready to deploy enterprise LLM pipelines that never gamble with reliability.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-[0_0_25px_rgba(245,158,11,0.5)]"
            >
              Place Your Bet (Hire)
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-200 font-bold text-sm hover:bg-black/80 transition-all"
            >
              LinkedIn Profile
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
