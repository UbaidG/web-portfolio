import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SKILLS_DATA: Record<string, string[]> = {
  Languages: ["JavaScript", "TypeScript", "Java", "C#"],
  Frontend: ["React.js", "Next.js", "Redux", "Recoil", "Micro-frontends"],
  Backend: [
    "Node.js",
    "Express.js",
    "REST APIs",
    "WebSockets",
    "Webhooks",
    "Pub/Sub",
  ],
  Databases: ["MongoDB", "PostgreSQL", "Algolia"],
  "Cloud & DevOps": [
    "AWS",
    "GCP",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Terraform",
    "Nginx",
  ],
  "Tools & Services": [
    "Git",
    "Postman",
    "Swagger",
    "Apache JMeter",
    "Zapier",
    "Stripe API",
  ],
};

const PROJECTS = [
  {
    title: "FeatureGate",
    tech: ["React", "Node.js", "MongoDB", "Redis", "Docker", "TypeScript"],
    description:
      "Self-hosted feature flag management system — an open-source LaunchDarkly alternative. Supports boolean and multivariate flags, rule-based user segments, percentage rollouts via consistent hashing, and real-time propagation through SSE and Redis Pub/Sub.",
    link: "https://github.com/Scylla23/featuregate",
    linkLabel: "View Code",
    gradient: "from-rose-500/20 via-pink-500/10 to-red-500/20",
  },
  {
    title: "LiftLog",
    tech: ["React Native", "Expo", "Supabase", "TypeScript"],
    description:
      "Mobile workout tracking app to log exercises, sets with weight/reps, and track fitness progress. Features an exercise library, workout calendar, Google OAuth, and i18n support for English and Spanish.",
    link: "https://github.com/Scylla23/Liftlog",
    linkLabel: "View Code",
    gradient: "from-purple-500/20 via-violet-500/10 to-indigo-500/20",
  },
  {
    title: "ChessArena",
    tech: ["React.js", "Node.js", "MongoDB", "Redux", "Socket.io"],
    description:
      "Real-time multiplayer chess platform with persistent game state, resume-game functionality, and event-driven WebSocket communication for live gameplay, move validation, and spectator mode.",
    link: "https://github.com/Scylla23/ChessArena",
    linkLabel: "View Code",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
  },
  {
    title: "ShoppyEasy",
    tech: ["Next.js", "React", "Stripe", "Clerk", "Prisma"],
    description:
      "Full-stack ecommerce app with admin dashboard serving as a centralized CMS for categories, sizes, colors, and products. Integrated Clerk Authentication and Stripe payments.",
    link: "https://shoppyeasy.netlify.app/",
    linkLabel: "View Project",
    gradient: "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
  },
  {
    title: "SnappyChat",
    tech: ["React", "Node.js", "Socket.io", "JWT"],
    description:
      "Real-time chat application with instant messaging, live notifications via Socket.io, and secure authentication with JSON Web Tokens.",
    link: "https://snappychatt.netlify.app/login",
    linkLabel: "View Project",
    gradient: "from-blue-500/20 via-indigo-500/10 to-sky-500/20",
  },
  {
    title: "DrawTogetherHub",
    tech: ["React", "Node.js", "Socket.io", "Canvas API"],
    description:
      "Dynamic real-time whiteboard enabling seamless multi-user collaboration with instant updates and an intuitive Undo-Redo feature.",
    link: "https://drawtogetherhub.netlify.app/",
    linkLabel: "View Project",
    gradient: "from-amber-500/20 via-orange-500/10 to-rose-500/20",
  },
];

const EXPERIENCES = [
  {
    company: "Naya Studio",
    companyUrl: "https://naya.love/studio",
    role: "Software Engineer",
    tech: "React.js · Node.js · Express.js · MongoDB · GCP",
    period: "Oct 2023 — Present",
    location: "New York, USA (Remote)",
    highlights: [
      {
        label: "Universal search system",
        text: "Designed and built search indexing 250K+ files (images, PDFs, videos, 3D models, links), delivering 50ms keyword search via Algolia and 150–200ms semantic retrieval via MongoDB Atlas Vector Search.",
      },
      {
        label: "Stripe billing pipelines",
        text: "Architected automated webhooks, tiered subscription plans, and team-seat management, eliminating 20 hours/month of manual billing overhead.",
      },
      {
        label: "CAD integrations",
        text: "Integrated Onshape and Autodesk CAD rendering via OAuth 2.0, webhooks, and cloud translation APIs, enabling real-time 3D model sync and unlocking enterprise client adoption.",
      },
      {
        label: "Onshape App Store extension",
        text: "Developed and shipped an extension enabling direct project import/export between Onshape and Naya, reducing context-switching and increasing design-team adoption by 40%.",
      },
      {
        label: "Multi-select & AI workflows",
        text: "Built a multi-select interaction system for batch editing and AI-powered asset generation via LLM APIs, reducing multi-asset workflow time by 50%.",
      },
      {
        label: "Dashboard re-architecture",
        text: "Re-architected the project dashboard into a drag-and-drop, card-based workspace with nested folder uploads, reducing manual asset setup time by 70%.",
      },
    ],
  },
  {
    company: "Kratin LLC",
    role: "Intern Technologist",
    tech: "ASP.NET Core · C# · SQL Server · IIS",
    period: "Jan 2023 — Aug 2023",
    location: "Nagpur, India",
    highlights: [
      {
        label: "Task management system",
        text: "Built and scaled a system handling 250K+ tasks, 3K users, and 100GB of files, improving tracking and real-time collaboration.",
      },
      {
        label: "API optimization",
        text: "Optimized the top 10 high-traffic APIs by improving SQL queries and minimizing database calls, reducing average response time from 1.7s to 1.2s.",
      },
    ],
  },
];

const EDUCATION = [
  {
    school: "SGGSIE&T, Nanded",
    degree: "B.Tech in Computer Science and Engineering",
    period: "June 2023",
    score: "CGPA: 9.02",
  },
  {
    school: "Jawahar Navodaya Vidyalaya, Wardha",
    degree: "Class XII (PCM) & Class X",
    period: "Sep 2011 — May 2018",
    score: "XII: 94% · X: CGPA 10",
  },
];

const ACHIEVEMENTS = [
  "500+ problems on LeetCode with a 200+ day streak",
  "300+ problems on GeeksforGeeks with 1200+ coding score",
  "Qualified GATE 2023 & 2024",
];

const SOCIAL_LINKS = [
  { Icon: Mail, href: "mailto:pavankumarkushnure@gmail.com", label: "Email" },
  { Icon: Github, href: "https://github.com/Scylla23", label: "GitHub" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/pavankumar-kushnure-97274b1a3/",
    label: "LinkedIn",
  },
  {
    Icon: Twitter,
    href: "https://x.com/Pavankumarkush5",
    label: "Twitter",
  },
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-4 py-1.5 text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-accent-teal/80 border border-accent-teal/20 rounded-full mb-6">
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
          className="font-display font-bold text-xl tracking-tight gradient-text"
        >
          PK
        </a>

        {/* Desktop */}
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
            href="/Pavan Kushnure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-body font-medium bg-white text-surface rounded-full hover:bg-white/90 transition-all duration-300"
          >
            <Download size={14} />
            Resume
          </a>
        </div>

        {/* Mobile toggle */}
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
                href="/Pavan Kushnure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-body font-medium bg-white text-surface rounded-full w-fit mt-2"
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
// ABOUT
// ═══════════════════════════════════════════

function About() {
  return (
    <section id="about" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel>About</SectionLabel>
        </FadeIn>

        <div className="grid md:grid-cols-[auto_1fr] gap-12 lg:gap-16 items-start">
          {/* Avatar */}
          <FadeIn delay={0.1}>
            <div className="relative mx-auto md:mx-0">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden ring-1 ring-white/[0.06]">
                <img
                  src="/me.gif"
                  alt="Pavan Kushnure"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Gradient glow behind avatar */}
              <div className="absolute -inset-4 bg-gradient-to-br from-accent-teal/10 via-transparent to-accent-violet/10 rounded-3xl blur-2xl -z-10" />
            </div>
          </FadeIn>

          {/* Bio */}
          <div>
            <FadeIn delay={0.15}>
              <SectionHeading>
                Full-stack engineer who loves
                <br className="hidden lg:block" />
                <span className="font-serif italic gradient-text">
                  {" "}
                  building at scale
                </span>
              </SectionHeading>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="text-base font-body text-white/40 leading-[1.8] mb-8 max-w-2xl">
                Over 3 years of experience building design collaboration tools
                using{" "}
                <span className="text-white/70">
                  React, Node.js, MongoDB, and GCP
                </span>
                . Delivered sub-100ms search across over 250K assets, enterprise
                CAD integrations (Onshape, Autodesk, Trimble), and Stripe
                billing pipelines. Owned features end-to-end from design through
                deployment at a US-based startup operating across multiple time
                zones.
              </p>
            </FadeIn>

            {/* Education */}
            <FadeIn delay={0.35}>
              <div className="space-y-3">
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

            {/* Achievements */}
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-2 mt-6">
                {ACHIEVEMENTS.map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1.5 text-xs font-body text-white/40 bg-white/[0.03] border border-white/[0.06] rounded-full"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
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
          <SectionLabel>Tech Stack</SectionLabel>
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
                      className="skill-pill px-4 py-2 text-sm font-body text-white/55 bg-white/[0.03] border border-white/[0.06] rounded-full hover:text-white/80 hover:border-white/[0.12] transition-all duration-300 cursor-default"
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
// PROJECTS
// ═══════════════════════════════════════════

function Projects() {
  return (
    <section id="projects" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel>Projects</SectionLabel>
        </FadeIn>
        <FadeIn delay={0.1}>
          <SectionHeading>
            Things I&apos;ve{" "}
            <span className="font-serif italic gradient-text">built</span>
          </SectionHeading>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5 mt-14">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.1}>
              <div className="group card-glow rounded-2xl overflow-hidden h-full flex flex-col">
                {/* Gradient header */}
                <div
                  className={`h-36 sm:h-44 bg-gradient-to-br ${project.gradient} relative`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-xl sm:text-2xl font-display font-bold">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-[11px] font-body text-white/35 bg-white/[0.04] rounded-md"
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
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-body font-medium text-white/50 hover:text-accent-teal transition-colors duration-300 group/link"
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
// EXPERIENCE
// ═══════════════════════════════════════════

function Experience() {
  return (
    <section id="experience" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel>Experience</SectionLabel>
        </FadeIn>
        <FadeIn delay={0.1}>
          <SectionHeading>
            Where I&apos;ve{" "}
            <span className="font-serif italic gradient-text">worked</span>
          </SectionHeading>
        </FadeIn>

        <div className="mt-14 relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] md:left-[9px] top-3 bottom-3 w-px timeline-line opacity-20" />

          <div className="space-y-16">
            {EXPERIENCES.map((exp, i) => (
              <FadeIn key={exp.company} delay={i * 0.15}>
                <div className="relative pl-8 md:pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-[15px] h-[15px] md:w-[19px] md:h-[19px] rounded-full border-2 border-accent-teal/40 bg-surface flex items-center justify-center">
                    <div className="w-[5px] h-[5px] md:w-[7px] md:h-[7px] rounded-full bg-accent-teal/80" />
                  </div>

                  {/* Header */}
                  <div className="mb-5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-xl sm:text-2xl font-display font-bold">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent-teal transition-colors duration-300"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          exp.company
                        )}
                      </h3>
                      <span className="text-sm font-body text-white/25">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-body text-white/40 mt-1">
                      {exp.role}
                    </p>
                    <p className="text-xs font-body text-white/20 mt-0.5">
                      {exp.tech} · {exp.location}
                    </p>
                  </div>

                  {/* Highlights */}
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
// CONTACT
// ═══════════════════════════════════════════

function Contact() {
  return (
    <section id="contact" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <FadeIn>
          <SectionLabel>Contact</SectionLabel>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] mb-6">
            Let&apos;s{" "}
            <span className="font-serif italic gradient-text">connect</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base font-body text-white/35 max-w-md mx-auto mb-10 leading-relaxed">
            I&apos;m always open to discussing new opportunities, interesting
            projects, or just having a chat about tech.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <a
            href="mailto:pavankumarkushnure@gmail.com"
            className="group inline-flex items-center gap-2 px-8 py-4 font-body font-medium text-sm bg-white text-surface rounded-full hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-400 mb-12"
          >
            <Mail size={16} />
            pavankumarkushnure@gmail.com
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
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  href.startsWith("mailto") ? undefined : "noopener noreferrer"
                }
                aria-label={label}
                className="w-12 h-12 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
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
          &copy; {new Date().getFullYear()} Pavan Kushnure
        </p>
        <div className="flex items-center gap-5">
          {SOCIAL_LINKS.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                href.startsWith("mailto") ? undefined : "noopener noreferrer"
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
    <div className="bg-surface text-white min-h-screen font-body antialiased selection:bg-accent-teal/25">
      <Navbar />
      <main>
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
