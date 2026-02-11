import React, { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Linkedin,
  Mail,
  Github,
  ChevronRight,
  Twitter,
  Download,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 bg-[#f8fafc] dark:bg-[#1e293b] rounded-xl overflow-hidden shadow-lg"
    >
      <motion.button
        className="w-full text-left flex items-center justify-between py-4 px-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl font-mono text-[#475569] dark:text-[#f1f5f9] font-semibold">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="text-[#475569] dark:text-[#f1f5f9]" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 bg-[#ffffff] dark:bg-[#1e293b] backdrop-blur-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface SkillBadgeProps {
  skill: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => (
  <motion.span
    whileHover={{ scale: 1.1 }}
    className="inline-block px-4 py-1.5 m-2 font-mono text-sm bg-[#475569] dark:bg-[#475569] text-[#f8fafc] dark:text-[#f1f5f9] rounded-full shadow-md"
  >
    {skill}
  </motion.span>
);

const App: React.FC = () => {
  return (
    <div className="h-screen overflow-y-auto no-scrollbar bg-[#f8fafc] dark:bg-[#0f172a] text-[#0f172a] dark:text-[#f1f5f9] font-mono">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto" id="content">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <motion.div
              className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <img
                src="/me.gif"
                alt="Pavan Kushnure"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 text-[#475569] dark:text-[#f1f5f9]">
              Pavan Kushnure
            </h1>
            <p className="text-2xl text-[#475569] dark:text-[#f1f5f9]">
              Full-Stack Engineer | 3+ Years Experience
            </p>
          </motion.div>

          <Section title="About Me">
            <p className="leading-relaxed text-[#475569] dark:text-[#94a3b8]">
              Full-stack engineer with over 3 years of experience building
              design collaboration tools using{" "}
              <strong className="dark:text-[#f1f5f9]">
                React, Node.js, MongoDB, and GCP
              </strong>
              . Delivered sub-100ms search across over 250K assets, enterprise
              CAD integrations (Onshape, Autodesk, Trimble), and Stripe billing
              pipelines. Owned features end-to-end from design through
              deployment at a US-based startup operating across multiple time
              zones.
            </p>
          </Section>

          <Section title="Experience">
            <div className="space-y-8">
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  <a
                    href="https://naya.love/studio"
                    className="hover:text-[#0f172a] dark:hover:text-[#94a3b8] transition-colors"
                  >
                    Naya Studio
                  </a>
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-1">
                  Software Engineer (React.js, Node.js, Express.js, MongoDB,
                  GCP) | Oct 2023 - Present
                </p>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-4 italic">
                  New York, USA (Remote)
                </p>
                <div className="text-[#475569] dark:text-[#94a3b8] space-y-2">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        Universal search system:
                      </strong>{" "}
                      Designed and built search indexing{" "}
                      <strong className="dark:text-[#f1f5f9]">
                        250K+ files
                      </strong>{" "}
                      (images, PDFs, videos, 3D models, links), delivering{" "}
                      <strong className="dark:text-[#f1f5f9]">
                        50ms keyword search
                      </strong>{" "}
                      via Algolia and 150–200ms semantic retrieval via MongoDB
                      Atlas Vector Search.
                    </li>
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        Stripe billing pipelines:
                      </strong>{" "}
                      Architected and implemented automated webhooks, tiered
                      subscription plans, and team-seat management, eliminating{" "}
                      <strong className="dark:text-[#f1f5f9]">
                        20 hours/month
                      </strong>{" "}
                      of manual billing overhead.
                    </li>
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        CAD integrations:
                      </strong>{" "}
                      Integrated Onshape and Autodesk CAD rendering via OAuth
                      2.0, webhooks, and cloud translation APIs, enabling
                      real-time 3D model sync and unlocking enterprise client
                      adoption.
                    </li>
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        Onshape App Store extension:
                      </strong>{" "}
                      Developed and shipped an extension enabling direct project
                      import/export between Onshape and Naya, reducing
                      context-switching and increasing design-team adoption by{" "}
                      <strong className="dark:text-[#f1f5f9]">40%</strong>.
                    </li>
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        Multi-select & AI workflows:
                      </strong>{" "}
                      Built a multi-select interaction system for batch editing
                      and AI-powered asset generation (image/text/3D model
                      generation via LLM APIs), reducing multi-asset workflow
                      time by{" "}
                      <strong className="dark:text-[#f1f5f9]">50%</strong>.
                    </li>
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        Dashboard re-architecture:
                      </strong>{" "}
                      Re-architected the project dashboard into a
                      drag-and-drop, card-based workspace with nested folder
                      uploads, reducing manual asset setup time by{" "}
                      <strong className="dark:text-[#f1f5f9]">70%</strong>.
                    </li>
                  </ul>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  Kratin LLC
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-1">
                  Intern Technologist (ASP.NET Core, C#, SQL Server, IIS) | Jan
                  2023 - Aug 2023
                </p>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-4 italic">
                  Nagpur, India
                </p>
                <div className="text-[#475569] dark:text-[#94a3b8] space-y-2">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        Task management system:
                      </strong>{" "}
                      Built and scaled a system handling{" "}
                      <strong className="dark:text-[#f1f5f9]">
                        250K+ tasks, 3K users, and 100GB of files
                      </strong>
                      , improving tracking and real-time collaboration.
                    </li>
                    <li>
                      <strong className="dark:text-[#f1f5f9]">
                        API optimization:
                      </strong>{" "}
                      Optimized the top 10 high-traffic APIs by improving SQL
                      queries and minimizing database calls, reducing average
                      response time from{" "}
                      <strong className="dark:text-[#f1f5f9]">
                        1.7s to 1.2s
                      </strong>
                      .
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </Section>

          <Section title="Projects">
            <div className="space-y-8">
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  ChessArena
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94a3b8] mb-2">
                  React.js, Node.js, Express.js, MongoDB, Redux, Socket.io
                </p>
                <div className="text-[#475569] dark:text-[#94a3b8] space-y-2">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Built a real-time multiplayer chess platform with
                      persistent game state and resume-game functionality.
                    </li>
                    <li>
                      Engineered event-driven WebSocket communication for live
                      gameplay, move validation, and spectator mode support.
                    </li>
                  </ul>
                </div>
                <a
                  onClick={() =>
                    window.open(
                      "https://github.com/Scylla23/ChessArena"
                    )
                  }
                  className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline mt-2 inline-block"
                >
                  View Code →
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  ShoppyEasy
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94a3b8] mb-2">
                  Next.js, React, Stripe, Clerk, Prisma
                </p>
                <p className="mb-4 text-[#475569] dark:text-[#94a3b8]">
                  Next.js ecommerce web app with admin dashboard serving as a
                  centralized CMS for categories, sizes, colors, and products.
                  Implemented Clerk Authentication and integrated Stripe for
                  secure user access and seamless payment processing.
                </p>
                <a
                  onClick={() => window.open("https://shoppyeasy.netlify.app/")}
                  className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                >
                  View Project →
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  SnappyChat
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94a3b8] mb-2">
                  React, Node.js, Socket.io, JWT
                </p>
                <p className="mb-4 text-[#475569] dark:text-[#94a3b8]">
                  Real-time chat application enabling users to communicate with
                  different users and receive real-time notifications. Achieved
                  secure user authentication and authorization with JSON Web
                  Tokens (JWT). Used Socket.io for real-time notifications.
                </p>
                <a
                  onClick={() =>
                    window.open("https://snappychatt.netlify.app/login")
                  }
                  className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                >
                  View Project →
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  DrawTogetherHub
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94a3b8] mb-2">
                  React, Node.js, Socket.io, Canvas API
                </p>
                <p className="mb-4 text-[#475569] dark:text-[#94a3b8]">
                  A dynamic real-time whiteboard application facilitating
                  seamless collaboration via Socket.io and Node.js events,
                  enabling multiple users to work simultaneously with instant
                  updates and an intuitive Undo-Redo feature.
                </p>
                <a
                  onClick={() =>
                    window.open("https://drawtogetherhub.netlify.app/")
                  }
                  className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                >
                  View Project →
                </a>
              </motion.div>
            </div>
          </Section>

          <Section title="Skills">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-[#475569] dark:text-[#f1f5f9] mb-2">
                  Languages
                </h4>
                <div className="flex flex-wrap -m-1">
                  <SkillBadge skill="JavaScript" />
                  <SkillBadge skill="TypeScript" />
                  <SkillBadge skill="Java" />
                  <SkillBadge skill="C#" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#475569] dark:text-[#f1f5f9] mb-2">
                  Frontend
                </h4>
                <div className="flex flex-wrap -m-1">
                  <SkillBadge skill="React.js" />
                  <SkillBadge skill="Next.js" />
                  <SkillBadge skill="Redux" />
                  <SkillBadge skill="Recoil" />
                  <SkillBadge skill="Micro-frontends" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#475569] dark:text-[#f1f5f9] mb-2">
                  Backend
                </h4>
                <div className="flex flex-wrap -m-1">
                  <SkillBadge skill="Node.js" />
                  <SkillBadge skill="Express.js" />
                  <SkillBadge skill="REST APIs" />
                  <SkillBadge skill="WebSockets" />
                  <SkillBadge skill="Webhooks" />
                  <SkillBadge skill="Pub/Sub" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#475569] dark:text-[#f1f5f9] mb-2">
                  Databases
                </h4>
                <div className="flex flex-wrap -m-1">
                  <SkillBadge skill="MongoDB" />
                  <SkillBadge skill="PostgreSQL" />
                  <SkillBadge skill="Algolia" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#475569] dark:text-[#f1f5f9] mb-2">
                  Cloud & DevOps
                </h4>
                <div className="flex flex-wrap -m-1">
                  <SkillBadge skill="AWS" />
                  <SkillBadge skill="GCP" />
                  <SkillBadge skill="Docker" />
                  <SkillBadge skill="Kubernetes" />
                  <SkillBadge skill="CI/CD" />
                  <SkillBadge skill="Terraform" />
                  <SkillBadge skill="Nginx" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#475569] dark:text-[#f1f5f9] mb-2">
                  Tools & Services
                </h4>
                <div className="flex flex-wrap -m-1">
                  <SkillBadge skill="Git" />
                  <SkillBadge skill="Postman" />
                  <SkillBadge skill="Swagger" />
                  <SkillBadge skill="Apache JMeter" />
                  <SkillBadge skill="Zapier" />
                  <SkillBadge skill="Stripe API" />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Education">
            <div className="space-y-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  Shri Guru Gobind Singhji Institute of Engineering and
                  Technology, Nanded
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-1">
                  Bachelor of Technology in Computer Science and Engineering |
                  June 2023
                </p>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
                  CGPA:{" "}
                  <strong className="dark:text-[#f1f5f9]">9.02</strong>
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <h3 className="font-semibold text-xl text-[#475569] dark:text-[#f1f5f9]">
                  Jawahar Navodaya Vidyalaya, Wardha
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-1">
                  Class XII (PCM) & Class X | Sep 2011 – May 2018
                </p>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
                  Class XII:{" "}
                  <strong className="dark:text-[#f1f5f9]">94%</strong> | Class
                  X: <strong className="dark:text-[#f1f5f9]">CGPA 10</strong>
                </p>
              </motion.div>
            </div>
          </Section>

          <Section title="Achievements">
            <div className="text-[#475569] dark:text-[#94a3b8] space-y-2">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Solved{" "}
                  <strong className="dark:text-[#f1f5f9]">
                    500+ problems
                  </strong>{" "}
                  on LeetCode with a streak of{" "}
                  <strong className="dark:text-[#f1f5f9]">200+ days</strong>.
                </li>
                <li>
                  Solved{" "}
                  <strong className="dark:text-[#f1f5f9]">
                    300+ problems
                  </strong>{" "}
                  on GeeksforGeeks with{" "}
                  <strong className="dark:text-[#f1f5f9]">
                    1200+ coding score
                  </strong>
                  .
                </li>
                <li>
                  Qualified{" "}
                  <strong className="dark:text-[#f1f5f9]">
                    Graduate Aptitude Test in Engineering (GATE) 2023 & 2024
                  </strong>
                  .
                </li>
              </ul>
            </div>
          </Section>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex justify-center space-x-8 mb-8">
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="mailto:pavankumarkushnure@gmail.com"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f1f5f9] transition-colors"
            >
              <Mail size={28} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              href="https://github.com/Scylla23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f1f5f9] transition-colors cursor-pointer"
            >
              <Github size={28} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="https://www.linkedin.com/in/pavankumar-kushnure-97274b1a3/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f1f5f9] transition-colors cursor-pointer"
            >
              <Linkedin size={28} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              href="https://x.com/Pavankumarkush5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f1f5f9] transition-colors cursor-pointer"
            >
              <Twitter size={28} />
            </motion.a>
          </div>
        </motion.div>

        <div className="flex justify-center align-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.open("/Pavan Kushnure.pdf");
            }}
            className="flex px-6 py-3 bg-[#f8fafc] dark:bg-[#1e293b] text-[#0f172a] dark:text-[#f1f5f9] rounded-full shadow-lg items-center justify-center border border-[#475569] dark:border-[#94a3b8] hover:bg-[#ffffff] dark:hover:bg-[#0f172a] transition-colors"
          >
            <Download size={20} className="mr-2" />
            Download Resume
          </motion.button>
        </div>
      </div>

      <footer className="pb-8 text-center text-[#475569] dark:text-[#94a3b8]">
        <p>© {new Date().getFullYear()} pkushnure.tech</p>
      </footer>
    </div>
  );
};

export default App;
