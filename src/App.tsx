import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Phone,
  Download,
  ArrowUpRight,
  Menu,
  X,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Cpu,
} from "lucide-react";

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SKILLS_DATA: Record<string, string[]> = {
  Programming: [
    "Python",
    "SQL",
    "NoSQL",
    "Cypher",
    "JavaScript",
    "Java",
    "C",
    "C++",
    "HTML/CSS",
  ],
  "ML & AI": [
    "LLMs (OpenAI, Llama2)",
    "RAG",
    "NER",
    "LangChain",
    "CrewAI",
    "LangGraph",
    "PyTorch",
    "TensorFlow",
    "scikit-learn",
    "Pandas",
    "spaCy",
    "RASA",
    "Huggingface",
  ],
  "Cloud & Tools": [
    "AWS (Bedrock, AgentCore, ECR, CloudWatch)",
    "Azure (AI Services, Data Factory)",
    "Docker",
    "Git",
    "GCP",
    "Neo4j",
    "Weights & Biases",
    "Apache Spark",
    "Kubernetes",
    "Datadog",
  ],
  Frameworks: [
    "Flask",
    "FastAPI",
    "Streamlit",
    "Angular",
    "n8n",
    "MCP",
    "A2A",
  ],
};

const PROJECTS = [
  {
    title: "Voice Agent Pipeline",
    tech: ["Python", "LiveKit", "Deepgram", "OpenAI", "Huggingface"],
    description:
      "Architected a customizable voice agent pipeline integrating Deepgram (STT), OpenAI (LLM), and Cartesia (TTS); incorporated open-source models for EOU detection and VAD. Enabled full preprocessing/postprocessing customization for real-time voice interaction systems.",
    link: "https://github.com/Ubaid-Ghante",
    linkLabel: "GitHub",
    gradient: "from-accent-ember/20 via-orange-500/10 to-red-500/20",
  },
  {
    title: "Stitchit (iOS App)",
    tech: ["Python", "Flask", "Swift", "AWS", "Neo4j", "Docker"],
    description:
      "Full-stack iOS app to prevent content theft using computer vision (PANNs, Swin Transformer) for video similarity. Implemented user-specific AI bubbles via graph database (Neo4j) for personalization and content recommendation.",
    link: "https://github.com/Ubaid-Ghante",
    linkLabel: "TestFlight",
    gradient: "from-accent-lavender/20 via-purple-500/10 to-indigo-500/20",
  },
  {
    title: "Gen AI Dashboard",
    tech: ["Python", "Flask", "OpenAI", "RASA", "NER", "SQL"],
    description:
      "Engineered a chatbot that translates user queries into optimized SQL, auto-selects best-fit visualizations, and masks PHI/PII using a Huggingface NER model for secure data interaction.",
    link: "https://github.com/Ubaid-Ghante",
    linkLabel: "GitHub",
    gradient: "from-accent-mint/20 via-teal-500/10 to-cyan-500/20",
  },
  {
    title: "RAG Chatbot",
    tech: ["Python", "Flask", "Azure OpenAI", "RASA", "CosmosDB"],
    description:
      "High-accuracy RAG chatbot with intent mapping (RASA), caching, and vector search to answer clinician questions based on a specialized knowledge base.",
    link: "https://github.com/Ubaid-Ghante",
    linkLabel: "GitHub",
    gradient: "from-blue-500/20 via-sky-500/10 to-accent-lavender/20",
  },
  {
    title: "Clinician Note Analyzer",
    tech: ["NER", "GraphRAG", "Python"],
    description:
      "Patient personalizer AI using NER and GraphRAG for summarization and preference grouping, enabling clinicians to quickly understand patient needs.",
    link: "https://github.com/Ubaid-Ghante",
    linkLabel: "GitHub",
    gradient: "from-rose-500/20 via-pink-500/10 to-accent-ember/20",
  },
  {
    title: "Patient Health Progression",
    tech: ["LSTM", "Python", "Time-Series ML"],
    description:
      "LSTM model to predict LDex trigger points in hospice patients with lymphedema, enabling early diagnosis for 20,890+ patients using SOTA prediction techniques.",
    link: "https://github.com/Ubaid-Ghante",
    linkLabel: "GitHub",
    gradient: "from-amber-500/20 via-yellow-500/10 to-accent-mint/20",
  },
];

const EXPERIENCES = [
  {
    company: "Korn Ferry (ResearchFox)",
    role: "Machine Learning Engineer",
    tech: "ML Models · GenAI · LangGraph · FastAPI · Docker · Kubernetes",
    period: "Nov 2025 — Present",
    location: "Remote",
    highlights: [
      {
        label: "Job Classifier Agent",
        text: "Building Job Classifier Agent Workflow with inbuilt ML models + GenAI Response + Chat Interface for talent acquisition teams.",
      },
      {
        label: "Salary Prediction",
        text: "Built ML models to Predict Salary Estimates based on historic data with very sparse data points, adding a key component in Talent Suite Product.",
      },
      {
        label: "Tableau MCP Integration",
        text: "Worked on Tableau MCP and TabPy Server with integrated LangGraph flows to enhance Dashboards by adding complex analysis at a glance.",
      },
      {
        label: "MLOps Pipelines",
        text: "Architected scalable MLOps pipelines using FastAPI, Docker, Kubernetes, and GitHub Actions, ensuring robust monitoring via Datadog.",
      },
      {
        label: "Scale",
        text: "Working on POCs as well as production products with 170M+ user profiles.",
      },
    ],
  },
  {
    company: "ACE Software Solutions",
    role: "Machine Learning Engineer",
    tech: "CrewAI · LangChain · LangGraph · n8n · Amazon Bedrock · Docker",
    period: "Nov 2024 — Nov 2025",
    location: "Remote",
    highlights: [
      {
        label: "Agentic Workflows",
        text: "Developed production-grade agentic workflows using CrewAI, LangChain, LangGraph and n8n. Worked with Amazon Bedrock, Huggingface, OpenAI and Ollama.",
      },
      {
        label: "MCP Servers",
        text: "Designed and developed MCP Servers to handle complex queries in banking and compliance.",
      },
      {
        label: "Scalable Pipelines",
        text: "Built and deployed scalable pipelines using Flask / FastAPI + Docker for every project.",
      },
    ],
  },
  {
    company: "Kratin LLC",
    role: "Data Scientist",
    tech: "Azure Speech AI · OpenAI · LLMs · RAG · Time-Series ML",
    period: "Aug 2023 — Nov 2024",
    location: "Remote",
    highlights: [
      {
        label: "Speech-to-Text",
        text: "Implemented Speech-to-Text with intent mapping (RASA) using Azure Speech AI and fine-tuned Azure OpenAI models, enhancing voice command accuracy.",
      },
      {
        label: "LLM Automation",
        text: "Leveraged LLMs (GPT, Llama2) to automate tasks and develop RAG and NER applications, reducing process time by 40%.",
      },
      {
        label: "Health Prediction",
        text: "Created a time-series ML model to predict patient health progression, enabling early lymphedema diagnosis for 20,890+ patients.",
      },
    ],
  },
  {
    company: "Kratin LLC",
    role: "Junior Data Scientist",
    tech: "Neo4j · Graph Databases · Algorithm Design",
    period: "Jan 2023 — Jul 2023",
    location: "On-site",
    highlights: [
      {
        label: "Graph Databases",
        text: "Constructed and managed graph databases (Neo4j) to uncover and analyze complex data relationships, improving data insight retrieval speed.",
      },
      {
        label: "Workforce Optimization",
        text: "Designed a scheduler algorithm for workforce time optimization, enhancing operational efficiency at scale.",
      },
    ],
  },
];

const EDUCATION = [
  {
    school: "SGGSIE&T, Nanded",
    degree: "B.Tech in Computer Science and Engineering",
    period: "2019 — 2023",
    score: "CGPA: 9.3",
  },
  {
    school: "Sant Tukaram National Model School",
    degree: "CBSE Board",
    period: "2017 — 2019",
    score: "84.6%",
  },
];

const CERTIFICATIONS = [
  { name: "Machine Learning with Python", issuer: "IBM", date: "Jan 2026" },
  {
    name: "Intro to Deep Learning & Neural Networks with Keras",
    issuer: "IBM",
    date: "Jan 2026",
  },
  {
    name: "Foundations of Project Management",
    issuer: "Google",
    date: "Jan 2026",
  },
  {
    name: "Deep Learning with Keras and TensorFlow",
    issuer: "IBM",
    date: "Jan 2026",
  },
  {
    name: "Project Initiation: Starting a Successful Project",
    issuer: "Google",
    date: "Jan 2026",
  },
];

const SOCIAL_LINKS = [
  { Icon: Mail, href: "mailto:ughante@gmail.com", label: "Email" },
  {
    Icon: Github,
    href: "https://github.com/Ubaid-Ghante",
    label: "GitHub",
  },
  {
    Icon: Linkedin,
    href: "https://linkedin.com/in/ubaid-ghante",
    label: "LinkedIn",
  },
  { Icon: Phone, href: "tel:+919284876115", label: "Phone" },
];

// ═══════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-accent-ember/80 border border-accent-ember/20 rounded-full mb-6">
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight leading-[1.15] mb-6">
      {children}
    </h2>
  );
}

// ═══════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="fixed top-4 left-4 right-4 sm:left-6 sm:right-6 z-50"
    >
      <div
        className={`max-w-6xl mx-auto px-6 h-14 flex items-center justify-between rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "bg-surface/80 backdrop-blur-2xl border-white/[0.08]"
            : "bg-surface/50 backdrop-blur-xl border-white/[0.06]"
        }`}
      >
        <a
          href="#"
          className="font-display font-extrabold text-xl tracking-tight gradient-text"
        >
          UG
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-body text-white/40 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/Feb2026LatexResumeMinimal.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-body font-medium bg-accent-ember text-white rounded-full hover:bg-accent-ember/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,120,73,0.2)]"
          >
            <Download size={14} />
            Resume
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white/60 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-surface/90 backdrop-blur-2xl border border-white/[0.08] border-t-0 rounded-b-2xl overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-body text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/Feb2026LatexResumeMinimal.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-body font-medium bg-accent-ember text-white rounded-full w-fit mt-2"
              >
                <Download size={14} />
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated mesh gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="mesh-orb-1 absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-ember/[0.07] blur-[120px]" />
        <div className="mesh-orb-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-lavender/[0.06] blur-[100px]" />
        <div className="mesh-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-mint/[0.04] blur-[140px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-accent-ember/70 border border-accent-ember/15 rounded-full mb-8">
            <Cpu size={12} />
            Machine Learning Engineer
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.05] mb-6"
        >
          Ubaid
          <br />
          <span className="font-serif italic gradient-text">Ghante</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease }}
          className="text-base sm:text-lg font-body text-white/35 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Building production AI systems, agentic workflows, and scalable
          MLOps pipelines — from NLP and computer vision to real-time voice
          agents.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#experience"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-body font-medium bg-accent-ember text-white rounded-full hover:shadow-[0_0_50px_rgba(255,120,73,0.25)] transition-all duration-400"
          >
            <Briefcase size={15} />
            View Experience
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-body font-medium border border-white/10 text-white/60 rounded-full hover:border-white/20 hover:text-white/80 transition-all duration-300"
          >
            Get in Touch
            <ArrowUpRight size={15} />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-accent-ember/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════

function About() {
  return (
    <section id="about" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel icon={Code2}>About</SectionLabel>
        </FadeIn>

        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start">
          <div>
            <FadeIn delay={0.1}>
              <SectionHeading>
                ML engineer crafting
                <br className="hidden lg:block" />
                <span className="font-serif italic gradient-text">
                  {" "}
                  intelligent systems
                </span>
              </SectionHeading>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-base font-body text-white/40 leading-[1.8] mb-8 max-w-2xl">
                3+ years building production ML systems — from{" "}
                <span className="text-white/65">
                  agentic workflows with CrewAI, LangChain, and LangGraph
                </span>{" "}
                to{" "}
                <span className="text-white/65">
                  scalable MLOps pipelines with FastAPI, Docker, and Kubernetes
                </span>
                . Currently at Korn Ferry working on talent acquisition AI
                serving{" "}
                <span className="text-accent-ember/80">170M+ user profiles</span>
                . Previously built RAG chatbots, NER systems, voice agents, and
                time-series health prediction models.
              </p>
            </FadeIn>

            {/* Education */}
            <FadeIn delay={0.3}>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={16} className="text-accent-lavender/60" />
                <span className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-white/25">
                  Education
                </span>
              </div>
              <div className="space-y-3 mb-8">
                {EDUCATION.map((edu) => (
                  <div
                    key={edu.school}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm font-body"
                  >
                    <span className="text-white/60 font-medium">
                      {edu.school}
                    </span>
                    <span className="hidden sm:inline text-white/15">—</span>
                    <span className="text-white/30">
                      {edu.degree} · {edu.score}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Certifications */}
            <FadeIn delay={0.35}>
              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-accent-mint/60" />
                <span className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-white/25">
                  Certifications
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((cert) => (
                  <span
                    key={cert.name}
                    className="px-3 py-1.5 text-xs font-body text-white/40 bg-white/[0.03] border border-white/[0.06] rounded-full"
                  >
                    {cert.name}{" "}
                    <span className="text-accent-ember/50">
                      · {cert.issuer}
                    </span>
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Stats sidebar */}
          <FadeIn delay={0.25}>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-48">
              {[
                { value: "3+", label: "Years Experience" },
                { value: "170M+", label: "User Profiles" },
                { value: "40%", label: "Process Time Reduced" },
                { value: "9.3", label: "CGPA" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="card-glow rounded-xl p-4 text-center lg:text-left"
                >
                  <div className="text-2xl font-display font-extrabold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-body text-white/30 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// EXPERIENCE
// ═══════════════════════════════════════════

function Experience() {
  return (
    <section id="experience" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel icon={Briefcase}>Experience</SectionLabel>
        </FadeIn>
        <FadeIn delay={0.1}>
          <SectionHeading>
            Where I&apos;ve{" "}
            <span className="font-serif italic gradient-text">worked</span>
          </SectionHeading>
        </FadeIn>

        <div className="mt-14 relative">
          <div className="absolute left-[7px] md:left-[9px] top-3 bottom-3 w-px timeline-line opacity-20" />

          <div className="space-y-16">
            {EXPERIENCES.map((exp, i) => (
              <FadeIn key={`${exp.company}-${exp.role}`} delay={i * 0.12}>
                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-0 top-2 w-[15px] h-[15px] md:w-[19px] md:h-[19px] rounded-full border-2 border-accent-ember/40 bg-surface flex items-center justify-center">
                    <div className="w-[5px] h-[5px] md:w-[7px] md:h-[7px] rounded-full bg-accent-ember/80" />
                  </div>

                  <div className="mb-5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-xl sm:text-2xl font-display font-bold">
                        {exp.company}
                      </h3>
                      <span className="text-sm font-body text-white/25">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-body text-accent-ember/60 mt-1 font-medium">
                      {exp.role}
                    </p>
                    <p className="text-xs font-body text-white/20 mt-0.5">
                      {exp.tech} · {exp.location}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {exp.highlights.map((h) => (
                      <div
                        key={h.label}
                        className="card-glow rounded-xl p-4 sm:p-5"
                      >
                        <span className="text-sm font-body font-medium text-white/70">
                          {h.label}
                        </span>
                        <span className="text-sm font-body text-white/30">
                          {" "}
                          — {h.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════

function Projects() {
  return (
    <section id="projects" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel icon={Code2}>Projects</SectionLabel>
        </FadeIn>
        <FadeIn delay={0.1}>
          <SectionHeading>
            Things I&apos;ve{" "}
            <span className="font-serif italic gradient-text">built</span>
          </SectionHeading>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5 mt-14">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.08}>
              <div className="group card-glow rounded-2xl overflow-hidden h-full flex flex-col">
                <div
                  className={`h-32 sm:h-40 bg-gradient-to-br ${project.gradient} relative`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-lg sm:text-xl font-display font-bold">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-[11px] font-body text-accent-ember/50 bg-accent-ember/[0.06] border border-accent-ember/10 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm font-body text-white/35 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-body font-medium text-white/50 hover:text-accent-ember transition-colors duration-300 group/link"
                  >
                    {project.linkLabel}
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════

function Skills() {
  return (
    <section id="skills" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel icon={Cpu}>Tech Stack</SectionLabel>
        </FadeIn>
        <FadeIn delay={0.1}>
          <SectionHeading>
            Tools &{" "}
            <span className="font-serif italic gradient-text">
              technologies
            </span>{" "}
            I work with
          </SectionHeading>
        </FadeIn>

        <div className="mt-14 space-y-10">
          {Object.entries(SKILLS_DATA).map(([category, skills], catIdx) => (
            <FadeIn key={category} delay={catIdx * 0.08}>
              <div>
                <h3 className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-white/25 mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-pill px-4 py-2 text-sm font-body text-white/55 bg-white/[0.03] border border-white/[0.06] rounded-full hover:text-white/80 hover:border-accent-ember/20 transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════

function Contact() {
  return (
    <section id="contact" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <FadeIn>
          <SectionLabel icon={Mail}>Contact</SectionLabel>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] mb-6">
            Let&apos;s{" "}
            <span className="font-serif italic gradient-text">connect</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base font-body text-white/35 max-w-md mx-auto mb-10 leading-relaxed">
            Open to discussing ML engineering roles, AI projects, and research
            collaborations. Let&apos;s build something intelligent together.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <a
            href="mailto:ughante@gmail.com"
            className="group inline-flex items-center gap-2 px-8 py-4 font-body font-medium text-sm bg-accent-ember text-white rounded-full hover:shadow-[0_0_50px_rgba(255,120,73,0.2)] transition-all duration-400 mb-12"
          >
            <Mail size={16} />
            ughante@gmail.com
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex justify-center gap-4">
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={
                  href.startsWith("mailto") || href.startsWith("tel")
                    ? undefined
                    : "_blank"
                }
                rel={
                  href.startsWith("mailto") || href.startsWith("tel")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={label}
                className="w-12 h-12 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-accent-ember hover:border-accent-ember/30 hover:bg-accent-ember/[0.05] transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-body text-white/20">
          &copy; {new Date().getFullYear()} Ubaid Ghante
        </p>
        <div className="flex items-center gap-5">
          {SOCIAL_LINKS.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={
                href.startsWith("mailto") || href.startsWith("tel")
                  ? undefined
                  : "_blank"
              }
              rel={
                href.startsWith("mailto") || href.startsWith("tel")
                  ? undefined
                  : "noopener noreferrer"
              }
              aria-label={label}
              className="text-white/15 hover:text-white/50 transition-colors duration-300"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// APP
// ═══════════════════════════════════════════

export default function App() {
  return (
    <div className="noise-overlay bg-surface text-white min-h-screen font-body antialiased selection:bg-accent-ember/25">
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider max-w-6xl mx-auto" />
        <About />
        <div className="section-divider max-w-6xl mx-auto" />
        <Experience />
        <div className="section-divider max-w-6xl mx-auto" />
        <Projects />
        <div className="section-divider max-w-6xl mx-auto" />
        <Skills />
        <div className="section-divider max-w-6xl mx-auto" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
