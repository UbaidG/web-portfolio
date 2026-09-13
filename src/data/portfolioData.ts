export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
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
  live?: string;
  linkLabel?: string;
  category: "Agentic AI" | "Computer Vision" | "MLOps & Data" | "Health AI";
  stats?: { label: string; value: string };
  gradient: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  score: string;
  badge?: string;
}

export interface CertificationItem {
  name: string;
  issuer: "IBM" | "Google";
  date: string;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Ubaid Ghante",
    role: "Machine Learning Engineer",
    secondaryRole: "Autonomous Agents · MLOps · Speech & Vision Systems",
    email: "ughante@gmail.com",
    phone: "+919284876115",
    location: "Remote / India",
    linkedin: "https://linkedin.com/in/ubaid-ghante",
    github: "https://github.com/Ubaid-Ghante",
    resumePdf: `${import.meta.env.BASE_URL}Aug2026LatexResumeMinimal.pdf`,
    resumeUrl: `${import.meta.env.BASE_URL}Aug2026LatexResumeMinimal.pdf`,
    shortBio:
      "Machine Learning Engineer with 3+ years architecting production-grade agentic workflows, autonomous systems, and large-scale MLOps pipelines serving 170M+ users. Specializing in multi-agent orchestration (LangGraph, CrewAI, MCP), real-time multimodal voice systems, and enterprise LLM infrastructure.",
    stats: [
      { value: "170M+", label: "User Profiles in Production", detail: "Talent Suite & Agent Workflows" },
      { value: "3+ Years", label: "Production AI Experience", detail: "End-to-end ML & Agentic Systems" },
      { value: "40%", label: "Process Latency Reduction", detail: "RAG & LLM Enterprise Pipelines" },
      { value: "9.3", label: "B.Tech CGPA", detail: "Computer Science & Engineering" },
    ],
  },

  experiences: [
    {
      company: "Korn Ferry (ResearchFox)",
      role: "Machine Learning Engineer",
      period: "Nov 2025 — Present",
      location: "Remote",
      type: "Full-Time",
      tech: ["LangGraph", "FastAPI", "Docker", "Kubernetes", "Datadog", "Arize AX", "Tableau MCP", "TabPy"],
      summary:
        "Architecting production agentic workflows and ML predictive engines serving over 170M+ user profiles across Korn Ferry's Talent Suite.",
      highlights: [
        "Built Job Classifier Agent Workflow with inbuilt ML models + GenAI Response + Chat Interface for global talent acquisition teams.",
        "Engineered Machine Learning models to Predict Salary Estimates based on historic data with very sparse data points, unlocking key capabilities in Talent Suite Product.",
        "Developed Tableau MCP and TabPy Server with integrated LangGraph flows and OpenAI SKILLs to enhance Dashboards by embedding real-time multi-step analytical reasoning.",
        "Architected scalable MLOps pipelines using FastAPI, Docker, Kubernetes, and GitHub Actions, ensuring robust AI Observability via Datadog and Arize AX.",
        "Managing POCs and scalable production microservices with 170M+ user profiles.",
      ],
      metrics: "170M+ Profiles · Enterprise Talent Suite",
    },
    {
      company: "ACE Software Solutions (India) Pvt Ltd",
      role: "Machine Learning Engineer",
      period: "Nov 2024 — Nov 2025",
      location: "Remote",
      type: "Full-Time",
      tech: ["CrewAI", "LangChain", "LangGraph", "n8n", "Amazon Bedrock", "HuggingFace", "OpenAI", "Ollama", "MCP"],
      summary:
        "Developed production-grade agentic workflows and banking compliance systems while leading engineering sub-teams.",
      highlights: [
        "Developed production-grade agentic workflows using CrewAI, LangChain, LangGraph, and n8n integrated with Amazon Bedrock, HuggingFace, OpenAI, and Ollama.",
        "Designed and deployed custom Model Context Protocol (MCP) Servers to handle complex multi-step reasoning queries in banking, fraud detection, and regulatory compliance.",
        "Built and deployed scalable pipelines using Flask / FastAPI + Docker for every project with zero downtime CI/CD.",
        "Operated both as high-velocity single contributor and technical lead mentoring junior engineers.",
      ],
      metrics: "Led Team of 2 · Custom MCP Architecture",
    },
    {
      company: "Kratin LLC",
      role: "Data Scientist",
      period: "Aug 2023 — Nov 2024",
      location: "Remote",
      type: "Full-Time",
      tech: ["Azure Speech AI", "Azure OpenAI", "RASA", "GPT", "Llama2", "RAG", "NER", "Time-Series ML"],
      summary:
        "Implemented high-accuracy speech AI systems, enterprise RAG applications, and predictive healthcare models.",
      highlights: [
        "Implemented real-time Speech-to-Text with intent mapping (RASA) using Azure Speech AI and fine-tuned Azure OpenAI models, enhancing voice command accuracy.",
        "Leveraged LLMs (GPT, Llama2) to automate clinical workflows and developed enterprise RAG and NER applications, cutting process turnaround time by 40%.",
        "Engineered a clinical time-series ML model to predict patient health progression, enabling early lymphedema diagnosis for 20,890+ patients using SOTA prediction techniques.",
      ],
      metrics: "20,890+ Patients Diagnosed · 40% Speedup",
    },
    {
      company: "Kratin LLC",
      role: "Junior Data Scientist",
      period: "Jan 2023 — Jul 2023",
      location: "Remote / On-site",
      type: "Internship & Associate",
      tech: ["Neo4j", "Graph Databases", "Cypher", "Constraint Programming", "Python"],
      summary:
        "Graph data modeling, relationship analytics, and algorithmic workforce optimization at scale.",
      highlights: [
        "Constructed and managed graph databases (Neo4j) using Cypher to uncover and analyze multi-hop data relationships, significantly boosting insight retrieval speed.",
        "Designed and implemented a constraint programming scheduler algorithm for workforce time optimization, streamlining operational shift efficiency.",
      ],
      metrics: "Graph Database Engine · Shift Scheduler",
    },
  ] as ExperienceItem[],

  projects: [
    {
      id: "voice-agent",
      title: "Voice Agent Pipeline",
      subtitle: "Ultra-Low Latency Multimodal Conversational Agent",
      tagline: "Real-time speech pipeline combining LiveKit, Deepgram STT, OpenAI LLM, and Cartesia TTS.",
      tech: ["Python", "LiveKit", "Deepgram", "OpenAI", "Cartesia", "HuggingFace", "WebRTC"],
      description:
        "Architected an end-to-end, ultra-low latency voice agent pipeline integrating Deepgram (STT), OpenAI (LLM), and Cartesia (TTS). Incorporated open-source audio models for End-Of-Utterance (EOU) detection and Voice Activity Detection (VAD). Built with full customizable preprocessing/postprocessing audio hooks.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub Repository",
      category: "Agentic AI",
      stats: { label: "Latency", value: "< 320ms" },
      gradient: "from-amber-500/20 via-orange-500/10 to-rose-500/20",
    },
    {
      id: "stitchit",
      title: "Stitchit (iOS App)",
      subtitle: "Computer Vision Anti-Content Theft & Recommendation System",
      tagline: "Full-stack iOS application powered by PANNs and Swin Transformer for deep video similarity.",
      tech: ["Python", "Flask", "Swift", "AWS", "Neo4j", "Docker", "Swin Transformer", "PANNs"],
      description:
        "Engineered a full-stack iOS platform to detect and prevent digital content theft using state-of-the-art computer vision models (PANNs audio embeddings + Swin Transformer video spatio-temporal features) to compute pairwise cosine video similarity. Implemented user-specific AI bubbles via Neo4j graph database for contextual personalization.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "TestFlight Preview",
      category: "Computer Vision",
      stats: { label: "Architecture", value: "Swin + Neo4j" },
      gradient: "from-purple-500/20 via-indigo-500/10 to-cyan-500/20",
    },
    {
      id: "genai-dashboard",
      title: "Gen AI Dashboard",
      subtitle: "Text-to-SQL + Auto-Visualization Engine with PHI/PII Masking",
      tagline: "Secure enterprise analytics chatbot translating natural language to optimized SQL.",
      tech: ["Python", "Flask", "OpenAI", "RASA", "HuggingFace NER", "SQL", "Plotly"],
      description:
        "Engineered an enterprise conversational analytics system that translates complex natural language queries into optimized SQL, automatically determines and renders best-fit visual charts, and intercepts PHI/PII data via an onboard HuggingFace NER transformer to guarantee zero privacy leakages.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub Repository",
      category: "MLOps & Data",
      stats: { label: "Security", value: "Real-time PHI Masking" },
      gradient: "from-teal-500/20 via-emerald-500/10 to-cyan-500/20",
    },
    {
      id: "rag-chatbot",
      title: "Clinical RAG Chatbot",
      subtitle: "Specialized Medical Knowledge Retrieval Engine",
      tagline: "High-precision vector retrieval and semantic caching for clinician decision support.",
      tech: ["Python", "Flask", "Azure OpenAI", "RASA", "CosmosDB", "Vector Search"],
      description:
        "Constructed a verified high-accuracy Retrieval-Augmented Generation chatbot utilizing intent mapping (RASA), intelligent semantic cache tiers, and dense vector search across medical literature to answer clinician queries with precise source attribution.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub Repository",
      category: "Agentic AI",
      stats: { label: "Accuracy", value: "Semantic Verification" },
      gradient: "from-blue-500/20 via-sky-500/10 to-indigo-500/20",
    },
    {
      id: "clinician-note",
      title: "Clinician Note Analyzer",
      subtitle: "GraphRAG Patient Personalizer",
      tagline: "Automated medical chart summarization using transformer NER and knowledge graph linking.",
      tech: ["NER", "GraphRAG", "Neo4j", "Python", "spaCy"],
      description:
        "Developed an assistive AI that digests dense unstructured clinician notes, identifies medical entities, symptoms, and dosages via fine-tuned NER, and constructs dynamic GraphRAG linkages for fast preference grouping and longitudinal patient tracking.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub Repository",
      category: "Health AI",
      stats: { label: "Engine", value: "GraphRAG" },
      gradient: "from-rose-500/20 via-pink-500/10 to-violet-500/20",
    },
    {
      id: "patient-progression",
      title: "Patient Health Progression (LSTM)",
      subtitle: "Lymphedema Early Warning Neural Network",
      tagline: "Time-series deep learning model predicting LDex trigger points in 20,890+ hospice patients.",
      tech: ["PyTorch", "LSTM", "Python", "Time-Series ML", "Scikit-Learn"],
      description:
        "Pioneered an LSTM recurrent neural network model to forecast critical LDex trigger thresholds in patients at risk of chronic lymphedema, resulting in early interventions across an active cohort of 20,890+ individuals.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub Repository",
      category: "Health AI",
      stats: { label: "Cohort", value: "20,890+ Patients" },
      gradient: "from-emerald-500/20 via-amber-500/10 to-teal-500/20",
    },
  ] as ProjectItem[],

  otherProjects: [
    {
      name: "SmartTextArea",
      desc: "AI-enhanced text component with integrated mic, summarizer, and live dictation powered by Azure AI services.",
      tech: "Azure AI · React · Web Audio",
    },
    {
      name: "Workforce Optimization",
      desc: "Constraint programming algorithm for optimal workforce shift scheduling at scale.",
      tech: "Constraint Programming · Python",
    },
    {
      name: "Tableau MCP Server",
      desc: "Model Context Protocol server connecting Claude/GPT reasoning directly to Tableau Dashboards via TabPy.",
      tech: "MCP Protocol · TabPy · Python",
    },
  ],

  education: [
    {
      school: "Shri Guru Gobind Singhji Institute of Engineering and Technology (SGGSIE&T)",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      period: "2019 — 2023",
      score: "CGPA: 9.3 / 10.0",
      badge: "Graduated with High Honors",
    },
    {
      school: "Sant Tukaram National Model School",
      degree: "Senior Secondary Education (CBSE Board)",
      period: "2017 — 2019",
      score: "84.6%",
    },
  ] as EducationItem[],

  skills: {
    "Programming Languages": [
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
    "ML & Generative AI": [
      "LLMs (OpenAI, Llama2, Claude)",
      "RAG & GraphRAG",
      "Agentic Workflows",
      "LangChain",
      "CrewAI",
      "LangGraph",
      "MCP (Model Context Protocol)",
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "HuggingFace",
      "spaCy",
      "RASA",
      "Pandas",
    ],
    "Cloud, MLOps & Observability": [
      "AWS (Bedrock, AgentCore, ECR, CloudWatch)",
      "Azure (AI Services, Data Factory)",
      "Docker",
      "Kubernetes",
      "Datadog",
      "Arize AX",
      "Neo4j",
      "Git & GitHub Actions",
      "Weights & Biases",
      "Apache Spark",
      "GCP",
    ],
    "Frameworks & Protocols": [
      "FastAPI",
      "Flask",
      "Streamlit",
      "n8n",
      "Angular",
      "React",
      "A2A Protocols",
      "LiveKit WebRTC",
    ],
    "Engineering Practices": [
      "Project Scoping",
      "Stakeholder Alignment",
      "Agile / Scrum",
      "AI Safety & PHI/PII Masking",
      "Low-Latency Streaming",
    ],
  },

  certifications: [
    { name: "Machine Learning with Python", issuer: "IBM", date: "Jan 2026" },
    { name: "Introduction to Deep Learning & Neural Networks with Keras", issuer: "IBM", date: "Jan 2026" },
    { name: "Deep Learning with Keras and TensorFlow", issuer: "IBM", date: "Jan 2026" },
    { name: "Foundations of Project Management", issuer: "Google", date: "Jan 2026" },
    { name: "Project Initiation: Starting a Successful Project", issuer: "Google", date: "Jan 2026" },
  ] as CertificationItem[],
};

export const portfolioData = PORTFOLIO_DATA;

