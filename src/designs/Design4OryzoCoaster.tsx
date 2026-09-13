import { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { TumblingCenterpieceCanvas } from '../components/TumblingCenterpieceCanvas';
import { InteractiveSwarmCanvas } from '../components/InteractiveSwarmCanvas';
import { Coffee, ExternalLink } from 'lucide-react';

export const Design4OryzoCoaster: React.FC = () => {
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

  const reviews = [
    {
      stars: '★★★★★ [ 5/5 ]',
      quote: 'Hollywood is not ready for an MLE this cinematic.',
      quoteHighlight: 'We are so cooked.',
      author: 'JAMIE R.',
      title: 'AI INFLUENCER, EX-WEB3 ARCHITECT',
      mediaImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      mediaTag: '170M+ PROFILES ORCHESTRATED',
      detail: 'Korn Ferry Machine Learning Engineer (Nov 2025 – Present). ResearchFox multi-agent system, LLM Job Classifier, Salary Prediction Engine, Datadog and Arize AX instrumentation.',
      link: 'https://linkedin.com/in/ubaid-ghante-72a350193/',
    },
    {
      stars: '★★★★★ [ 5/5 ]',
      quote: 'My agent pipeline? If you want it, I\'ll let you have it. Look for it! I gathered 170M records together in one place!',
      quoteHighlight: 'best architecture',
      author: 'GOL D. ROGER',
      title: 'OLD-SCHOOL PRINCIPAL PIRATE',
      mediaImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
      mediaTag: 'BANKING MCP & BEDROCK SWARMS',
      detail: 'ACE Software Solutions (Nov 2024 – Nov 2025). Deployed CrewAI & LangGraph financial agent swarms over Amazon Bedrock with Model Context Protocol (MCP) banking servers.',
      link: 'https://github.com/UbaidG',
    },
    {
      stars: '★★★★★ [ 5/5 ]',
      quote: 'I deployed the wearable clinical agent mode. I achieved... zero latency and 20,890 lives improved.',
      quoteHighlight: 'attention',
      author: 'JULES M.',
      title: 'HEALTHCARE MINIMALIST',
      mediaImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      mediaTag: '20,890 PATIENTS MONITORED',
      detail: 'Kratin LLC Data Scientist & ML Intern (Jan 2023 – Nov 2024). Speech-to-Text RASA voice pipeline for lymphedema tracking, Neo4j graph databases, and patient schedulers.',
      link: 'https://github.com/UbaidG',
    },
    {
      stars: '★★★★★ [ 5/5 ]',
      quote: 'This is the best engineer that I\'ve ever hired. I can\'t go to the space without him.',
      quoteHighlight: 'best engineer',
      author: 'EDAN K.',
      title: 'NASA ASTRONAUT WANNABE',
      mediaImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      mediaTag: '9.3 CGPA & 5X CERTIFIED 2026',
      detail: 'GH Raisoni College of Engineering CSE (9.3 CGPA). 5x IBM & Google Certified (Jan 2026): Deep Learning, AI Engineering, Gen AI & Machine Learning Specialization.',
      link: portfolioData.personal.resumeUrl,
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#140e0a] text-[#f7efe6] font-sans selection:bg-[#ea580c] selection:text-white overflow-x-hidden">
      {/* 1. Warm Roasted Espresso Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#221710_0%,#100b08_100%)]" />
      </div>

      {/* 2. Interactive Swarm: Roasted 3D Coffee Beans stream that dynamically deflects on cursor move! */}
      <InteractiveSwarmCanvas mode="beans" count={160} className="fixed inset-0 pointer-events-auto z-10" />

      {/* 3. Sticky 3D Centerpiece: The Exact Oryzo Beveled Cork Coaster */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px]">
          <TumblingCenterpieceCanvas type="coaster" scrollProgress={scrollProgress} sizeMultiplier={1.05} />
        </div>
      </div>

      {/* 4. Top Telemetry Banner matching Oryzo.ai */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#140e0a]/90 backdrop-blur-md border-b border-[#3b271d] px-6 py-3.5 flex items-center justify-between text-xs font-mono tracking-wider text-[#a88d7b]">
        <div className="flex items-center gap-6">
          <span className="font-bold text-white uppercase tracking-widest">RATING & REVIEWS</span>
          <span className="hidden sm:inline">CUSTOM REVIEWS [ 364 ]</span>
          <span className="text-amber-500 font-bold">★★★★★ [ 4.9/5 ]</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline uppercase">UBAID IN USE</span>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded bg-[#3b271d] text-[#f7efe6] hover:bg-[#523729] transition-colors"
          >
            ORDER RESUME (PDF)
          </a>
        </div>
      </header>

      {/* 5. Main Content: Matching the Exact Two-Column Coaster Layout from User Screenshots */}
      <main className="relative z-30 pt-32 pb-48 max-w-7xl mx-auto px-6 md:px-12">
        {/* Big Hero Pitch */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#271912] border border-[#4a3224] text-[#ea580c] text-xs font-mono mb-6">
            <Coffee size={14} /> IF WE CAN CODE LIKE THIS, IMAGINE WHAT WE CAN DO FOR YOUR AGENT FLEET
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase max-w-5xl leading-none">
            Ubaid <span className="text-[#ea580c]">Ghante</span>
          </h1>
          <p className="text-lg md:text-2xl text-[#d4b9a5] font-light mt-6 max-w-2xl">
            Machine Learning Engineer & Multi-Agent Systems Architect
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-[#a88d7b]">
            <span>SCROLL TO TUMBLE COASTER</span>
            <span className="text-[#ea580c]">✦</span>
            <span>SWEEP CURSOR TO PART THE COFFEE BEANS</span>
          </div>
        </section>

        {/* The Exact Coaster Reviews Rows from User Screenshot */}
        <div className="space-y-40 mt-20">
          {reviews.map((rev) => (
            <div
              key={rev.author}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-dashed border-[#3b271d] pt-12"
            >
              {/* Left Column: Bold Review Quote & Meta */}
              <div className="md:col-span-4 space-y-4">
                <div className="text-xs font-mono text-amber-500 tracking-wider">
                  {rev.stars}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  "{rev.quote}"
                </h3>
                <div className="pt-2 text-xs font-mono text-[#8c6f5d]">
                  <div className="font-bold text-[#d4b9a5]">{rev.author}</div>
                  <div>{rev.title}</div>
                </div>
                <p className="text-sm text-[#b89c8a] leading-relaxed pt-2">
                  {rev.detail}
                </p>
              </div>

              {/* Middle Spacer (Where the 3D Tumbling Coaster floats!) */}
              <div className="hidden md:block md:col-span-4 h-64 pointer-events-none" />

              {/* Right Column: Visual Media Card */}
              <div className="md:col-span-4 flex justify-end">
                <div className="w-full max-w-md rounded-2xl overflow-hidden bg-[#221710] border border-[#3b271d] shadow-2xl group hover:border-[#ea580c] transition-all">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={rev.mediaImage}
                      alt={rev.mediaTag}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-[11px] font-mono text-amber-400 font-bold">
                      {rev.mediaTag}
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#a88d7b]">PRODUCTION SPEC</span>
                    <a
                      href={rev.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ea580c] hover:text-white transition-colors"
                    >
                      EXPLORE <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer exactly styled after Oryzo / Lusion with Love */}
        <section className="mt-56 border-t border-[#3b271d] pt-20">
          <div className="text-right">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight">
              IF WE CAN BUILD THIS CINEMATIC,<br />
              IMAGINE WHAT WE CAN DO FOR YOUR AGENTS.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-mono text-[#a88d7b]">
            <div>
              <div className="text-[#ea580c] font-bold">BUILT BY UBAID WITH LOVE ❤</div>
              <div className="mt-2 text-white">SHARE WITH ENGINEERING LEADERS</div>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="mt-4 px-3 py-1.5 rounded border border-[#3b271d] text-white hover:bg-[#3b271d] transition-colors"
              >
                COPY URL
              </button>
            </div>

            <div>
              <div className="text-white font-bold">CONNECT ON LINKEDIN:</div>
              <a
                href="https://linkedin.com/in/ubaid-ghante-72a350193/"
                target="_blank"
                rel="noreferrer"
                className="block mt-2 text-[#ea580c] hover:underline"
              >
                in/ubaid-ghante-72a350193
              </a>
            </div>

            <div>
              <div className="text-white font-bold">CONTACT DIRECTLY:</div>
              <a href="mailto:ubaidghante67@gmail.com" className="block mt-2 hover:text-white">
                ubaidghante67@gmail.com
              </a>
              <div className="text-[#8c6f5d] mt-1">+91 9172421379</div>
            </div>

            <div>
              <div className="text-white font-bold">AVAILABILITY:</div>
              <div className="mt-2 text-emerald-400">READY FOR TIER-1 AI LABS</div>
              <div className="text-[#8c6f5d] mt-1">170M+ PROFILES ORCHESTRATED</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
