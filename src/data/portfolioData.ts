export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  tech: string[];
  summary: string;
  highlights: string[];
  metrics?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  tagline: string;
  tech: string[];
  description: string;
  github?: string;
  linkLabel?: string;
  category: "Agentic AI" | "Computer Vision" | "MLOps & Data" | "Health AI";
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  score: string;
}

export interface CertificationItem {
  name: string;
  issuer: "IBM" | "Google";
  date: string;
}

export interface ProofMetric {
  value: string;
  label: string;
  context: string;
}

const resumeUrl = `${import.meta.env.BASE_URL}Aug2026LatexResumeMinimal.pdf`;

export const PORTFOLIO_DATA = {
  personal: {
    name: "Ubaid Ghante",
    role: "Machine Learning Engineer",
    secondaryRole: "Agentic AI · MLOps · Real-time Voice Systems",
    email: "ughante@gmail.com",
    phone: "+919284876115",
    linkedinUrl: "https://linkedin.com/in/ubaid-ghante",
    githubUrl: "https://github.com/Ubaid-Ghante",
    resumeUrl,
    shortBio:
      "Machine Learning Engineer building production agentic workflows, real-time voice systems, and scalable ML infrastructure.",
  },

  proofMetrics: [
    {
      value: "170M+",
      label: "user profiles",
      context: "Korn Ferry / ResearchFox",
    },
    {
      value: "40%",
      label: "process-time reduction",
      context: "RAG and LLM applications",
    },
    {
      value: "20,890+",
      label: "patients",
      context: "Lymphedema health-progression model",
    },
    {
      value: "9.3",
      label: "CGPA",
      context: "Computer Science and Engineering",
    },
    {
      value: "2",
      label: "engineers led",
      context: "ACE Software Solutions",
    },
  ] as ProofMetric[],

  experiences: [
    {
      id: "korn-ferry",
      company: "Korn Ferry (ResearchFox)",
      role: "Machine Learning Engineer",
      period: "Nov 2025 — Present",
      location: "Remote",
      tech: [
        "LangGraph",
        "FastAPI",
        "Docker",
        "Kubernetes",
        "Datadog",
        "Arize AX",
        "Tableau MCP",
        "TabPy",
      ],
      summary:
        "Building ML and agent workflows for Korn Ferry's Talent Suite, working with more than 170M user profiles.",
      highlights: [
        "Building a Job Classifier Agent Workflow combining inbuilt ML models, generative AI responses, and a chat interface for talent acquisition teams.",
        "Built salary-estimation models from historic data with sparse data points for the Talent Suite product.",
        "Worked on Tableau MCP and TabPy Server with integrated LangGraph flows and OpenAI skills for dashboard analysis.",
        "Architected MLOps pipelines with FastAPI, Docker, Kubernetes, and GitHub Actions, with Datadog and Arize AX observability.",
      ],
      metrics: "170M+ user profiles",
    },
    {
      id: "ace",
      company: "ACE Software Solutions (India) Pvt Ltd",
      role: "Machine Learning Engineer",
      period: "Nov 2024 — Nov 2025",
      location: "Remote",
      tech: [
        "CrewAI",
        "LangChain",
        "LangGraph",
        "n8n",
        "Amazon Bedrock",
        "HuggingFace",
        "OpenAI",
        "Ollama",
        "MCP",
      ],
      summary:
        "Developed production-grade agentic workflows and banking/compliance systems while leading a team of two.",
      highlights: [
        "Developed agentic workflows with CrewAI, LangChain, LangGraph, and n8n across Amazon Bedrock, HuggingFace, OpenAI, and Ollama.",
        "Designed and developed MCP servers for complex queries in banking and compliance.",
        "Built and deployed scalable Flask and FastAPI pipelines with Docker.",
        "Worked as a single contributor and led a team of two engineers.",
      ],
      metrics: "Team of 2 led",
    },
    {
      id: "kratin-data-scientist",
      company: "Kratin LLC",
      role: "Data Scientist",
      period: "Aug 2023 — Nov 2024",
      location: "Remote",
      tech: [
        "Azure Speech AI",
        "Azure OpenAI",
        "RASA",
        "GPT",
        "Llama2",
        "RAG",
        "NER",
        "Time-Series ML",
      ],
      summary:
        "Built speech AI, enterprise RAG, NER, and healthcare time-series systems.",
      highlights: [
        "Implemented Speech-to-Text with RASA intent mapping using Azure Speech AI and fine-tuned Azure OpenAI models.",
        "Used GPT and Llama2 to automate tasks and develop RAG and NER applications, reducing process time by 40%.",
        "Created a time-series ML model to predict patient health progression for early lymphedema diagnosis across 20,890+ patients.",
      ],
      metrics: "40% process-time reduction · 20,890+ patients",
    },
    {
      id: "kratin-junior",
      company: "Kratin LLC",
      role: "Junior Data Scientist",
      period: "Jan 2023 — Jul 2023",
      tech: ["Neo4j", "Graph Databases", "Cypher", "Constraint Programming", "Python"],
      summary:
        "Worked on graph data modeling and workforce optimization algorithms.",
      highlights: [
        "Constructed and managed Neo4j graph databases with Cypher to analyze complex data relationships.",
        "Designed a constraint-programming scheduler algorithm for workforce time optimization.",
      ],
      metrics: "Graph databases · Workforce optimization",
    },
  ] as ExperienceItem[],

  projects: [
    {
      id: "voice-agent",
      title: "Voice Agent Pipeline",
      subtitle: "Customizable real-time voice interaction system",
      tagline:
        "A modular pipeline connecting speech recognition, language models, and speech synthesis.",
      tech: ["Python", "LiveKit", "Deepgram", "OpenAI", "Cartesia", "HuggingFace"],
      description:
        "Architected a customizable voice agent pipeline integrating Deepgram for speech-to-text, OpenAI for language understanding, and Cartesia for text-to-speech. Added open-source models for end-of-utterance detection and voice activity detection, with preprocessing and postprocessing hooks.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub profile",
      category: "Agentic AI",
    },
    {
      id: "stitchit",
      title: "Stitchit",
      subtitle: "iOS content-protection and recommendation system",
      tagline:
        "A full-stack iOS application using audio and video embeddings to detect content theft.",
      tech: ["Python", "Flask", "Swift", "AWS", "Neo4j", "Docker", "PANNs", "Swin Transformer"],
      description:
        "Developed a full-stack iOS app to prevent content theft using PANNs and Swin Transformer models to calculate video similarity. Implemented user-specific AI bubbles with Neo4j for personalization and content recommendation.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub profile",
      category: "Computer Vision",
    },
    {
      id: "genai-dashboard",
      title: "Gen AI Dashboard",
      subtitle: "Text-to-SQL and automated visualization",
      tagline:
        "An enterprise chatbot that turns natural-language questions into useful, privacy-aware analytics.",
      tech: ["Python", "Flask", "OpenAI", "RASA", "HuggingFace NER", "SQL"],
      description:
        "Engineered a chatbot that translates user queries into optimized SQL, automatically selects best-fit visualizations, and masks PHI/PII using a HuggingFace NER model.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub profile",
      category: "MLOps & Data",
    },
    {
      id: "rag-chatbot",
      title: "RAG Chatbot",
      subtitle: "Specialized clinical knowledge retrieval",
      tagline:
        "A clinician-facing assistant built around intent mapping, caching, and vector search.",
      tech: ["Python", "Flask", "Azure OpenAI", "RASA", "CosmosDB"],
      description:
        "Built a high-accuracy RAG chatbot with RASA intent mapping, caching, and vector search to answer clinician questions from a specialized knowledge base.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub profile",
      category: "Health AI",
    },
    {
      id: "clinician-note",
      title: "Clinician Note Analyzer",
      subtitle: "Patient personalizer AI",
      tagline: "NER and GraphRAG for summarization and preference grouping.",
      tech: ["NER", "GraphRAG", "Neo4j", "Python", "spaCy"],
      description:
        "Patient personalizer AI using NER and GraphRAG for summarization and preference grouping.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub profile",
      category: "Health AI",
    },
    {
      id: "patient-progression",
      title: "Patient Health Progression",
      subtitle: "Lymphedema early-warning model",
      tagline: "Time-series prediction for LDex trigger points.",
      tech: ["PyTorch", "LSTM", "Python", "Time-Series ML", "Scikit-Learn"],
      description:
        "LSTM and time-series model predicting LDex trigger points for patients with lymphedema.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub profile",
      category: "Health AI",
    },
  ] as ProjectItem[],

  otherProjects: [
    {
      name: "SmartTextArea",
      desc: "AI-enhanced text component with microphone input, summarizer, and live dictation using Azure AI services.",
      tech: "Azure AI · React · Web Audio",
    },
    {
      name: "Workforce Optimization",
      desc: "Constraint-programming algorithm for workforce shift scheduling.",
      tech: "Constraint Programming · Python",
    },
    {
      name: "Tableau MCP Server",
      desc: "Model Context Protocol server connecting LLM reasoning to Tableau dashboards via TabPy.",
      tech: "MCP · TabPy · Python",
    },
  ],

  education: [
    {
      school: "Shri Guru Gobind Singhji Institute of Engineering and Technology",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      period: "2019 — 2023",
      score: "CGPA: 9.3",
    },
    {
      school: "Sant Tukaram National Model School",
      degree: "Senior Secondary Education · CBSE Board",
      period: "2017 — 2019",
      score: "84.6%",
    },
  ] as EducationItem[],

  skills: {
    Programming: ["Python", "SQL", "NoSQL", "Cypher", "JavaScript", "Java", "C", "C++", "HTML/CSS"],
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
      "HuggingFace",
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
      "Arize AX",
    ],
    Frameworks: ["Flask", "FastAPI", "Streamlit", "Angular", "n8n", "MCP", "A2A"],
    Practices: ["Project Management", "Stakeholder Management", "Project Scoping", "Agile Methodology", "PHI/PII Masking", "Real-time Voice Systems"],
  },

  certifications: [
    { name: "Machine Learning with Python", issuer: "IBM", date: "Jan 2026" },
    { name: "Introduction to Deep Learning & Neural Networks with Keras", issuer: "IBM", date: "Jan 2026" },
    { name: "Foundations of Project Management", issuer: "Google", date: "Jan 2026" },
    { name: "Deep Learning with Keras and TensorFlow", issuer: "IBM", date: "Jan 2026" },
    { name: "Project Initiation: Starting a Successful Project", issuer: "Google", date: "Jan 2026" },
  ] as CertificationItem[],
};

export const portfolioData = PORTFOLIO_DATA;
