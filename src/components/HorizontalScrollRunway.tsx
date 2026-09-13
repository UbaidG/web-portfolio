import React, { useRef, useState, useEffect } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface HorizontalScrollRunwayProps {
  theme?: 'dark_roast' | 'cyber_caffeine' | 'artisanal_crema';
}

export const HorizontalScrollRunway: React.FC<HorizontalScrollRunwayProps> = ({
  theme = 'dark_roast',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalDist = container.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      // Progress from 0 when container hits top of viewport, to 1 when bottom leaves
      const current = -rect.top;
      const p = Math.max(0, Math.min(1, current / totalDist));
      setScrollProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cards = [
    {
      company: 'Korn Ferry',
      role: 'Machine Learning Engineer',
      period: 'Nov 2025 – Present',
      location: 'Enterprise AI Lab',
      bigStat: '170M+',
      statLabel: 'Candidate Profiles in Production',
      badge: 'FLAGSHIP AGENTIC PIPELINE',
      summary:
        'Architected and scaled the ResearchFox multi-agent orchestration platform. Integrated LLM-based Job Classifier, Salary Prediction Engine, and Tableau Model Context Protocol (MCP) server.',
      highlights: [
        'Built enterprise multi-agent workflows with LangGraph & CrewAI serving 170M+ records.',
        'Production instrumentation with Datadog APM, Arize AX agent evaluation, and Docker.',
        'Low-latency FastAPI microservices with rigorous PII/PHI safety guardrails.',
      ],
      tech: ['LangGraph', 'CrewAI', 'FastAPI', 'Datadog', 'Arize AX', 'Docker'],
      link: 'https://linkedin.com/in/ubaid-ghante-72a350193/',
    },
    {
      company: 'ACE Software Solutions',
      role: 'AI / Machine Learning Engineer',
      period: 'Nov 2024 – Nov 2025',
      location: 'Financial Systems',
      bigStat: '100%',
      statLabel: 'Autonomous Execution Rate',
      badge: 'BANKING MCP CORES',
      summary:
        'Engineered autonomous financial agent swarms powered by Amazon Bedrock. Implemented core banking Model Context Protocol (MCP) tools and high-dimensional semantic search.',
      highlights: [
        'Multi-agent financial pipelines using CrewAI & LangGraph for banking operations.',
        'PostgreSQL pgvector database for zero-latency retrieval augmented generation (RAG).',
        'Built automated financial simulation engine testing edge-case transaction reconciliation.',
      ],
      tech: ['Amazon Bedrock', 'CrewAI', 'LangGraph', 'MCP Servers', 'pgvector', 'Python'],
      link: 'https://github.com/UbaidG',
    },
    {
      company: 'Kratin LLC',
      role: 'Data Scientist & ML Intern',
      period: 'Jan 2023 – Nov 2024',
      location: 'Healthcare AI',
      bigStat: '20,890',
      statLabel: 'Clinical Patients Monitored',
      badge: 'HEALTHCARE VOICE AI',
      summary:
        'Spearheaded Speech-to-Text clinical agent monitoring lymphedema progression. Architected Neo4j medical knowledge graphs and automated appointment scheduling bots.',
      highlights: [
        'Whisper Speech-to-Text & RASA conversational voice pipeline with clinical precision.',
        'Neo4j graph database modeling medical relationships for clinician decision support.',
        'Reduced patient reporting latency by 40% with scalable FastAPI backends.',
      ],
      tech: ['Speech-to-Text', 'RASA Voice', 'RAG Engine', 'Neo4j', 'FastAPI', 'PyTorch'],
      link: 'https://github.com/UbaidG',
    },
    {
      company: 'GH Raisoni College of Engineering',
      role: 'B.Tech in Computer Science & Engineering',
      period: 'Graduated with Distinction',
      location: 'Nagpur, India',
      bigStat: '9.3',
      statLabel: 'Cumulative Grade Point Average',
      badge: 'SUMMA CUM LAUDE & 5X CERTIFIED',
      summary:
        'Top 1% graduating CSE cohort. 5x certified in Deep Learning and AI Engineering across IBM and Google (January 2026).',
      highlights: [
        'IBM Deep Learning with Keras & TensorFlow (Jan 2026)',
        'IBM Machine Learning with Python & Neural Networks (Jan 2026)',
        'Google Project Management & Execution Specialization (Jan 2026)',
      ],
      tech: ['Deep Learning', 'PyTorch', 'TensorFlow', 'LLMs', 'Neural Networks'],
      link: portfolioData.personal.resumeUrl,
    },
  ];

  // Colors based on selected theme
  const isDarkRoast = theme === 'dark_roast';
  const isCyber = theme === 'cyber_caffeine';

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] w-full bg-transparent"
      id="experience-runway"
    >
      {/* Sticky Fullscreen Viewport that translates horizontally */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Runway Header Bar */}
        <div className="max-w-7xl mx-auto w-full px-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
              CAREER RUNWAY // HORIZONTAL FLIGHT [ {((scrollProgress) * 100).toFixed(0)}% ]
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            SCROLL DOWN TO SLIDE LEFT &rarr;
          </div>
        </div>

        {/* Horizontal Sliding Track (Driven by scrollProgress!) */}
        <div
          className="flex items-stretch gap-8 px-8 md:px-20 transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translateX(-${scrollProgress * 65}%)`,
          }}
        >
          {cards.map((c) => (
            <div
              key={c.company}
              className={`flex-shrink-0 w-[85vw] max-w-[620px] rounded-3xl p-8 md:p-10 border transition-all duration-300 shadow-2xl ${
                isDarkRoast
                  ? 'bg-[#18110b]/90 border-[#3d2719] hover:border-amber-600/70 text-[#f7efe6]'
                  : isCyber
                  ? 'bg-[#0b0805]/95 border-amber-500/30 hover:border-cyan-400 text-amber-100'
                  : 'bg-[#1e150f]/90 border-[#4a3020] hover:border-amber-500 text-white'
              }`}
            >
              {/* Top Card Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold uppercase">
                  <Sparkles size={13} /> {c.badge}
                </span>
                <span className="font-mono text-xs text-slate-400">{c.period}</span>
              </div>

              {/* Company & Role */}
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
                {c.company}
              </h3>
              <div className="text-sm font-mono text-amber-400 font-medium mb-6">
                {c.role} // <span className="text-slate-400">{c.location}</span>
              </div>

              {/* Big Stat Callout */}
              <div className="p-5 rounded-2xl bg-black/40 border border-amber-500/25 flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-mono font-black text-amber-400 tracking-tight">
                  {c.bigStat}
                </span>
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  {c.statLabel}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
                {c.summary}
              </p>

              {/* Bullet Highlights */}
              <ul className="space-y-2 mb-8 text-xs text-slate-300 font-light">
                {c.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Badges & Link */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2 max-w-[70%]">
                  {c.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  AUDIT <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
