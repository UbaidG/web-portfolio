import { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { CoffeeMug3DCanvas } from '../components/CoffeeMug3DCanvas';
import { RealisticCoffeeBeanStream } from '../components/RealisticCoffeeBeanStream';
import { HorizontalScrollRunway } from '../components/HorizontalScrollRunway';
import { Terminal, Zap, Award, CheckCircle2 } from 'lucide-react';

export const CoffeeDesign2CaffeineOverclocked: React.FC = () => {
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

  const certifications = [
    { name: 'Machine Learning with Python', issuer: 'IBM', date: 'Jan 2026' },
    { name: 'Introduction to Deep Learning & Neural Networks', issuer: 'IBM', date: 'Jan 2026' },
    { name: 'Deep Learning with Keras and TensorFlow', issuer: 'IBM', date: 'Jan 2026' },
    { name: 'Foundations of Project Management', issuer: 'Google', date: 'Jan 2026' },
    { name: 'Project Initiation: Starting a Successful Project', issuer: 'Google', date: 'Jan 2026' },
  ];

  return (
    <div className="relative min-h-screen bg-[#070504] text-amber-50 font-mono selection:bg-cyan-400 selection:text-black overflow-x-hidden">
      {/* Dark Cyber Cafe Terminal Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,#1c120a_0%,#070504_85%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b08_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* Terminal Top Telemetry Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#070504]/90 backdrop-blur-md border-b border-amber-500/20 px-6 md:px-12 py-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Terminal size={15} className="text-amber-400" />
          <span className="font-bold text-white uppercase tracking-widest">
            DEV_FUEL://UBAID_GHANTE
          </span>
          <span className="hidden sm:inline text-amber-400/70">
            [ CAFFEINE: 100% // STATUS: OVERCLOCKED ]
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-cyan-400">
            PIPELINE_LOAD: <span className="text-white">170M_RECORDS</span>
          </span>
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-black transition-all"
          >
            SYS_RESUME (PDF)
          </a>
        </div>
      </header>

      {/* STAGE 1: Hero Viewport with 3D Takeaway Cup & Realistic Coffee Beans */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center text-center px-6 pt-28">
        {/* Realistic Coffee Bean Stream */}
        <RealisticCoffeeBeanStream count={140} speedMultiplier={0.8} className="absolute inset-0 pointer-events-auto z-10" />

        {/* 3D Specialty Takeaway Cup with Ribbed Sleeve and Rising Steam */}
        <div className="relative z-20 w-[300px] h-[300px] md:w-[420px] md:h-[420px] mx-auto pointer-events-none mb-2">
          <CoffeeMug3DCanvas type="takeaway_cup" scrollProgress={scrollProgress} sizeMultiplier={1.05} />
        </div>

        {/* Terminal Text Overlays */}
        <div className="relative z-30 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-amber-500/30 text-amber-400 text-xs mb-4">
            <Zap size={13} className="text-cyan-400 animate-pulse" /> WHILE (COFFEE &gt; 0) {'{'} DEPLOY_AGENTS(); {'}'}
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
            UBAID <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400">GHANTE</span>
          </h1>
          <p className="text-base md:text-xl text-amber-200/80 font-sans font-light mt-4 max-w-2xl mx-auto">
            Machine Learning Engineer & Multi-Agent Systems Architect turning caffeine and compute into production autonomous intelligence.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="text-amber-400">CURSOR: SCATTER BEANS</span>
            <span>✦</span>
            <span className="text-cyan-400">SCROLL DOWN: CONVEYOR RUNWAY</span>
          </div>
        </div>
      </section>

      {/* Realtime Telemetry Stats */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-black/60 border border-amber-500/30">
            <div className="text-xs text-amber-400/80 mb-1">PROFILES_IN_PROD</div>
            <div className="text-3xl md:text-4xl font-black text-white">170,000,000+</div>
            <div className="text-[10px] text-slate-400 mt-1">Korn Ferry Enterprise</div>
          </div>
          <div className="p-5 rounded-xl bg-black/60 border border-amber-500/30">
            <div className="text-xs text-amber-400/80 mb-1">ACADEMIC_CGPA</div>
            <div className="text-3xl md:text-4xl font-black text-cyan-400">9.3 / 10.0</div>
            <div className="text-[10px] text-slate-400 mt-1">GH Raisoni College CSE</div>
          </div>
          <div className="p-5 rounded-xl bg-black/60 border border-amber-500/30">
            <div className="text-xs text-amber-400/80 mb-1">CLINICAL_PATIENTS</div>
            <div className="text-3xl md:text-4xl font-black text-white">20,890+</div>
            <div className="text-[10px] text-slate-400 mt-1">Kratin Healthcare Speech AI</div>
          </div>
          <div className="p-5 rounded-xl bg-black/60 border border-amber-500/30">
            <div className="text-xs text-amber-400/80 mb-1">CERTIFICATIONS</div>
            <div className="text-3xl md:text-4xl font-black text-amber-400">5X CERTIFIED</div>
            <div className="text-[10px] text-slate-400 mt-1">IBM & Google (Jan 2026)</div>
          </div>
        </div>
      </section>

      {/* STAGE 2: Horizontal Career Runway (Driven by Vertical Scroll Down) */}
      <section className="relative z-30">
        <HorizontalScrollRunway theme="cyber_caffeine" />
      </section>

      {/* STAGE 3: Certification Manifest & Cupping Table */}
      <section className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-amber-500/20">
        <div className="mb-14">
          <div className="text-xs text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Award size={15} /> VERIFIED FLAVOR NOTES // JAN 2026 CERTIFICATIONS
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white">
            HONORS & INDUSTRY CERTIFICATIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="p-6 rounded-2xl bg-black/70 border border-amber-500/30 hover:border-cyan-400 transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                  {cert.issuer} Verified Credential
                </div>
                <h4 className="text-base md:text-lg font-bold text-white">
                  {cert.name}
                </h4>
              </div>
              <div className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                {cert.date}
              </div>
            </div>
          ))}
        </div>

        {/* Final Terminal Call to Action */}
        <div className="mt-28 p-10 rounded-2xl bg-black/80 border border-amber-500/40 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs mb-4">
            <CheckCircle2 size={14} className="text-emerald-400" /> SYSTEM HEALTHY // LATENCY: OPTIMAL
          </div>
          <h3 className="text-3xl md:text-5xl font-black uppercase text-white">
            INJECT CAFFEINE INTO YOUR AI ROADMAP
          </h3>
          <p className="text-slate-400 max-w-md mx-auto mt-4 text-xs font-sans">
            Ready to architect production multi-agent systems and low-latency voice pipelines.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:ubaidghante67@gmail.com"
              className="px-6 py-3 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            >
              INITIATE_HANDSHAKE (EMAIL)
            </a>
            <a
              href="https://linkedin.com/in/ubaid-ghante-72a350193/"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-white/5 border border-white/20 text-white font-bold text-xs hover:bg-white/10 transition-all"
            >
              CONNECT_LINKEDIN
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
