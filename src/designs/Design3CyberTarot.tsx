import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { TumblingCenterpieceCanvas } from '../components/TumblingCenterpieceCanvas';
import { InteractiveSwarmCanvas } from '../components/InteractiveSwarmCanvas';
import { Sparkles, Eye, Compass, ExternalLink, Scroll, Moon } from 'lucide-react';

export const Design3CyberTarot: React.FC = () => {
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

  const arcanaCards = [
    {
      roman: 'I',
      arcana: 'THE MAGICIAN',
      role: 'Korn Ferry — Machine Learning Engineer',
      period: 'Nov 2025 – Present',
      sigil: '170M+ PROFILES',
      prophecy: 'As above, so below. Translating raw human enterprise data into real-time multi-agent intelligence. LLM Job Classifier, Salary Predictor, and Tableau MCP Server with Datadog / Arize AX telemetry.',
      elements: ['Multi-Agent Swarm', 'LangGraph', 'CrewAI', 'Datadog', 'Arize AX'],
      link: 'https://linkedin.com/in/ubaid-ghante-72a350193/',
    },
    {
      roman: 'II',
      arcana: 'THE HIEROPHANT',
      role: 'ACE Software Solutions — AI / ML Engineer',
      period: 'Nov 2024 – Nov 2025',
      sigil: 'BANKING MCP CORES',
      prophecy: 'Guardian of financial truth. Constructed autonomous agent workflows over Amazon Bedrock with custom Model Context Protocol (MCP) banking servers and pgvector semantic retrieval.',
      elements: ['Amazon Bedrock', 'LangGraph', 'Banking MCP', 'PostgreSQL Vector'],
      link: 'https://github.com/UbaidG',
    },
    {
      roman: 'III',
      arcana: 'THE ALCHEMIST',
      role: 'Kratin LLC — Data Scientist & ML Intern',
      period: 'Jan 2023 – Nov 2024',
      sigil: '20,890 PATIENTS',
      prophecy: 'Transmuting spoken human distress into structured clinical telemetry. Speech-to-Text RASA voice pipeline for lymphedema monitoring and Neo4j healthcare knowledge graphs.',
      elements: ['Speech-to-Text', 'RASA Voice', 'Neo4j Graph', 'RAG Engine'],
      link: 'https://github.com/UbaidG',
    },
    {
      roman: 'IV',
      arcana: 'THE STAR',
      role: 'B.Tech CSE & Elite Certifications',
      period: '9.3 CGPA / Top Tier',
      sigil: '5X CERTIFIED 2026',
      prophecy: 'Illuminating mathematical mastery. IBM Deep Learning, IBM AI Engineering, Google Gen AI & Machine Learning Specializations with a near-perfect academic track record.',
      elements: ['Deep Learning', 'PyTorch', 'Agentic Systems', 'TensorFlow'],
      link: portfolioData.personal.resumeUrl,
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#07060b] text-purple-100 font-serif selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      {/* 1. Mystical Cyber Arcana Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#271342_0%,#07060b_85%)]" />
        {/* Sacred geometry stars */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* 2. Interactive Swarm: Golden Card Suits & Shards floating across the screen that scatter on cursor */}
      <InteractiveSwarmCanvas mode="cards" count={120} className="fixed inset-0 pointer-events-auto z-10" />

      {/* 3. Sticky 3D Centerpiece: Tumbling 3D Holographic Tarot Card */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="w-[340px] h-[340px] md:w-[500px] md:h-[500px]">
          <TumblingCenterpieceCanvas type="tarot_card" scrollProgress={scrollProgress} sizeMultiplier={1.05} />
        </div>
      </div>

      {/* 4. Mystic Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#07060b]/80 backdrop-blur-md border-b border-purple-800/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-400/80 flex items-center justify-center text-yellow-300 font-bold text-xs">
            ✦
          </div>
          <div>
            <div className="font-serif font-bold text-xs uppercase tracking-widest text-yellow-200">
              CYBER ARCANA DECK
            </div>
            <div className="text-[10px] font-mono text-purple-400">TAROT OF DISTRIBUTED INTELLIGENCE</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-yellow-500/40 text-yellow-300 text-xs font-mono uppercase hover:bg-yellow-500/10 transition-colors"
          >
            <Scroll size={14} /> The Grimoire (Resume)
          </a>
        </div>
      </header>

      {/* 5. Main Content Deck */}
      <main className="relative z-30 pt-32 pb-48 max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Frame */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-yellow-500/30 text-yellow-300 text-xs font-mono mb-6 backdrop-blur-sm">
            <Moon size={14} className="text-yellow-400 animate-pulse" /> THE MAJOR ARCANA // INITIATING CARD DRAW
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            Ubaid <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-purple-400">Ghante</span>
          </h1>
          <p className="text-lg md:text-2xl text-purple-200/90 font-light mt-4 max-w-2xl font-sans">
            Architecting the unseen connections of autonomous artificial intelligence.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-yellow-400/80">
            <span>SCROLL TO TUMBLE TAROT CARD</span>
            <span className="text-yellow-300">✦</span>
            <span>BRUSH CURSOR TO DISTURB ARCANA PARTICLES</span>
          </div>
        </section>

        {/* Flanking Arcana Cards */}
        <div className="space-y-48 mt-24 font-sans">
          {arcanaCards.map((card, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={card.arcana}
                className={`flex flex-col ${isLeft ? 'md:items-start' : 'md:items-end'} w-full`}
              >
                <div className="w-full md:w-[480px] p-8 rounded-2xl bg-[#0f0c18]/90 backdrop-blur-xl border border-yellow-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.8)] hover:border-yellow-400/70 hover:shadow-[0_0_30px_rgba(234,179,8,0.25)] transition-all group">
                  <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 mb-4">
                    <span className="font-serif font-bold text-yellow-400 text-sm tracking-widest">
                      ARCANA {card.roman} // {card.arcana}
                    </span>
                    <span className="font-mono text-xs text-purple-400">{card.period}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {card.role}
                  </h3>

                  {/* Sigil Box */}
                  <div className="my-5 p-4 rounded-xl bg-purple-950/40 border border-yellow-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-yellow-400/80">Manifested Metric</div>
                      <div className="text-3xl font-mono font-black text-yellow-300 tracking-tight">{card.sigil}</div>
                    </div>
                    <Sparkles className="text-yellow-400 animate-spin" size={28} />
                  </div>

                  <p className="text-sm text-purple-200/90 leading-relaxed font-light mb-6">
                    {card.prophecy}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {card.elements.map((el) => (
                      <span key={el} className="px-2.5 py-1 rounded bg-black/40 border border-purple-800/40 text-purple-200 text-xs font-mono">
                        {el}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-purple-900/40 text-xs font-mono">
                    <span className="text-yellow-400/80 flex items-center gap-1.5">
                      <Eye size={14} /> REVEALED IN DESTINY
                    </span>
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-yellow-300 hover:text-white transition-colors"
                    >
                      Inspect Sigil <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Circle Call */}
        <section className="mt-56 text-center py-20 border-t border-purple-800/40">
          <div className="inline-block p-4 rounded-full bg-purple-950/60 border border-yellow-500/40 text-yellow-400 mb-6">
            <Compass size={36} />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tight text-white">
            Align The Stars
          </h2>
          <p className="text-purple-300/80 max-w-md mx-auto mt-4 text-sm font-light font-sans">
            Ready to channel autonomous agents and massive scale data architectures.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 font-sans">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-sm hover:from-yellow-300 hover:to-amber-400 transition-all shadow-[0_0_25px_rgba(234,179,8,0.4)]"
            >
              Consult The Architect
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-200 font-bold text-sm hover:bg-purple-900/40 transition-all"
            >
              LinkedIn Profile
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
