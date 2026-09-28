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
  id?: string;
  name: string;
  issuer: string;
  date: string;
  category?: "AI & ML" | "Project Management" | "Cloud & Architecture" | "Foundations";
  image?: string;
  pdfUrl?: string;
  credentialUrl?: string;
  featured?: boolean;
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
    linkedinUrl: "https://www.linkedin.com/in/ubaid-ghante-72a350193/",
    githubUrl: "https://github.com/Ubaid-Ghante",
    resumeUrl,
    shortBio:
      "Production agentic workflows, real-time voice systems, and scalable ML infrastructure. Currently building ML for Korn Ferry's Talent Suite.",
  },

  proofMetrics: [
    {
      value: "170M+",
      label: "user profiles",
      context: "Talent Suite ML at Korn Ferry",
    },
    {
      value: "40%",
      label: "less process time",
      context: "LLM automation with RAG and NER",
    },
    {
      value: "20K+",
      label: "patients",
      context: "Early lymphedema diagnosis model",
    },
    {
      value: "3+",
      label: "years in ML",
      context: "Talent, banking, and healthcare AI",
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
        "Building a job-classifier agent that combines in-house ML models, generative AI responses, and a chat interface for talent acquisition teams.",
        "Built salary-estimation models that work from sparse historical data, a key component of the Talent Suite product.",
        "Connected LangGraph flows and OpenAI skills to Tableau through an MCP server and TabPy, adding complex analysis directly into dashboards.",
        "Architected MLOps pipelines with FastAPI, Docker, Kubernetes, and GitHub Actions, monitored with Datadog and Arize AX.",
      ],
      metrics: "170M+ profiles",
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
        "Built production agentic workflows and MCP servers for banking and compliance use cases.",
      highlights: [
        "Developed agentic workflows with CrewAI, LangChain, LangGraph, and n8n across Amazon Bedrock, HuggingFace, OpenAI, and Ollama.",
        "Designed and developed MCP servers that answer complex banking and compliance queries.",
        "Built and deployed scalable Flask and FastAPI pipelines with Docker for every project.",
        "Delivered as an individual contributor while leading an engineering team.",
      ],
      metrics: "Team Lead",
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
        "Built speech AI, RAG, NER, and healthcare time-series systems.",
      highlights: [
        "Implemented speech-to-text with RASA intent mapping using Azure Speech AI and fine-tuned Azure OpenAI models, improving voice-command accuracy.",
        "Used GPT and Llama2 to automate tasks and build RAG and NER applications, reducing process time by 40%.",
        "Created a time-series model that predicts patient health progression, enabling early lymphedema diagnosis for 20,890+ patients.",
      ],
      metrics: "40% less process time",
    },
    {
      id: "kratin-junior",
      company: "Kratin LLC",
      role: "Junior Data Scientist",
      period: "Jan 2023 — Jul 2023",
      tech: ["Neo4j", "Graph Databases", "Cypher", "Constraint Programming", "Python"],
      summary:
        "Worked on graph data modeling and workforce scheduling algorithms.",
      highlights: [
        "Built and managed Neo4j graph databases with Cypher to analyze complex data relationships, speeding up insight retrieval.",
        "Designed a constraint-programming scheduler that optimizes workforce time.",
      ],
      metrics: "Workforce scheduler",
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
      tagline: "A patient-personalization assistant for clinical notes.",
      tech: ["NER", "GraphRAG", "Neo4j", "Python", "spaCy"],
      description:
        "Uses NER and GraphRAG to summarize clinician notes and group patients by their care preferences.",
      github: "https://github.com/Ubaid-Ghante",
      linkLabel: "GitHub profile",
      category: "Health AI",
    },
    {
      id: "patient-progression",
      title: "Patient Health Progression",
      subtitle: "Lymphedema early-warning model",
      tagline: "An early-warning model for lymphedema.",
      tech: ["PyTorch", "LSTM", "Python", "Time-Series ML", "Scikit-Learn"],
      description:
        "LSTM time-series model that predicts LDex trigger points for hospice patients with lymphedema, so clinicians can intervene earlier.",
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
    // --- Google Project Management Specialization ---
    {
      id: "google-pm-spec",
      name: "Google Project Management Professional Certificate",
      issuer: "Google",
      date: "Apr 2026",
      category: "Project Management",
      image: "certificates/thumbs/google-pm-spec.webp",
      pdfUrl: "certificates/pdf/Courses/Google Project Management.pdf",
      credentialUrl: "https://coursera.org/verify/professional-cert/BNHJAI1YK0HF",
      featured: true,
    },
    {
      id: "foundations-pm",
      name: "Foundations of Project Management",
      issuer: "Google",
      date: "Jan 2026",
      category: "Project Management",
      image: "certificates/thumbs/foundations-pm.webp",
      pdfUrl: "certificates/pdf/Courses/Foundations of Project Management.pdf",
    },
    {
      id: "project-initiation",
      name: "Project Initiation: Starting a Successful Project",
      issuer: "Google",
      date: "Jan 2026",
      category: "Project Management",
      image: "certificates/thumbs/project-initiation.webp",
      pdfUrl: "certificates/pdf/Courses/Project Initiation Starting a Successful Project.pdf",
    },
    {
      id: "project-planning",
      name: "Project Planning: Putting It All Together",
      issuer: "Google",
      date: "Feb 2026",
      category: "Project Management",
      image: "certificates/thumbs/project-planning.webp",
      pdfUrl: "certificates/pdf/Courses/Project Planning Putting It All Together.pdf",
    },
    {
      id: "project-execution",
      name: "Project Execution: Running the Project",
      issuer: "Google",
      date: "Mar 2026",
      category: "Project Management",
      image: "certificates/thumbs/project-execution.webp",
      pdfUrl: "certificates/pdf/Courses/Project Execution.pdf",
    },
    {
      id: "agile-pm",
      name: "Agile Project Management",
      issuer: "Google",
      date: "Apr 2026",
      category: "Project Management",
      image: "certificates/thumbs/agile-pm.webp",
      pdfUrl: "certificates/pdf/Courses/Agile Project Management.pdf",
    },
    {
      id: "capstone-pm",
      name: "Capstone: Applying Project Management in the Real World",
      issuer: "Google",
      date: "Apr 2026",
      category: "Project Management",
      image: "certificates/thumbs/capstone-pm.webp",
      pdfUrl: "certificates/pdf/Courses/Capstone Applying Project Management in the Real World.pdf",
    },

    // --- AI & Machine Learning (IBM) ---
    {
      id: "ml-python-ibm",
      name: "Machine Learning with Python",
      issuer: "IBM",
      date: "Jan 2026",
      category: "AI & ML",
      image: "certificates/thumbs/ml-python-ibm.webp",
      pdfUrl: "certificates/pdf/Courses/Machine Learning with Python.pdf",
      featured: true,
    },
    {
      id: "deep-learning-keras-ibm",
      name: "Intro to Deep Learning & Neural Networks with Keras",
      issuer: "IBM",
      date: "Jan 2026",
      category: "AI & ML",
      image: "certificates/thumbs/deep-learning-keras-ibm.webp",
      pdfUrl: "certificates/pdf/Courses/Introduction to Deep Learning & Neural Networks with Keras.pdf",
      featured: true,
    },
    {
      id: "deep-learning-tensorflow-ibm",
      name: "Deep Learning with Keras and TensorFlow",
      issuer: "IBM",
      date: "Jan 2026",
      category: "AI & ML",
      image: "certificates/thumbs/deep-learning-tensorflow-ibm.webp",
      pdfUrl: "certificates/pdf/Courses/Deep Learning with Keras and Tensorflow.pdf",
      featured: true,
    },

    // --- AWS Machine Learning & Cloud Architecture ---
    {
      id: "aws-intro-ml",
      name: "Introduction to Machine Learning",
      issuer: "AWS",
      date: "Nov 2023",
      category: "Cloud & Architecture",
      image: "certificates/thumbs/aws-intro-ml.webp",
      pdfUrl: "certificates/pdf/AWS/Introduction to Machine Learning AWS Course Completion Certificate.pdf",
      featured: true,
    },
    {
      id: "aws-sagemaker",
      name: "Introduction to Amazon SageMaker",
      issuer: "AWS",
      date: "Nov 2023",
      category: "Cloud & Architecture",
      image: "certificates/thumbs/aws-sagemaker.webp",
      pdfUrl: "certificates/pdf/AWS/Introduction to Amazon SageMaker AWS Course Completion Certificate.pdf",
      featured: true,
    },
    {
      id: "aws-ml-ready-org",
      name: "Building an ML Ready Organization",
      issuer: "AWS",
      date: "Nov 2023",
      category: "Cloud & Architecture",
      image: "certificates/thumbs/aws-ml-ready-org.webp",
      pdfUrl: "certificates/pdf/AWS/Building a Machine Learning Ready Organization AWS Course Completion Certificate.pdf",
    },
    {
      id: "aws-planning-ml",
      name: "Planning a Machine Learning Project",
      issuer: "AWS",
      date: "Nov 2023",
      category: "Cloud & Architecture",
      image: "certificates/thumbs/aws-planning-ml.webp",
      pdfUrl: "certificates/pdf/AWS/Planning a Machine Learning Project AWS Course Completion Certificate.pdf",
    },
    {
      id: "aws-ml-essentials",
      name: "ML Essentials for Business & Technical Decision Makers",
      issuer: "AWS",
      date: "Nov 2023",
      category: "Cloud & Architecture",
      image: "certificates/thumbs/aws-ml-essentials.webp",
      pdfUrl: "certificates/pdf/AWS/Machine Learning Essentials for Business and Technical Decision Makers AWS Course Completion Certificate.pdf",
    },
    {
      id: "aws-ml-terminology",
      name: "Machine Learning Terminology and Process",
      issuer: "AWS",
      date: "Nov 2023",
      category: "Cloud & Architecture",
      image: "certificates/thumbs/aws-ml-terminology.webp",
      pdfUrl: "certificates/pdf/AWS/Machine Learning Terminology and Process AWS Course Completion Certificate.pdf",
    },

    // --- Core Tech, Languages & Experience ---
    {
      id: "python-basics-michigan",
      name: "Programming for Everybody (Getting Started with Python)",
      issuer: "Univ. of Michigan",
      date: "Aug 2020",
      category: "Foundations",
      image: "certificates/thumbs/python-basics-michigan.webp",
      pdfUrl: "certificates/pdf/Python basics certificate.pdf",
    },
    {
      id: "html5-michigan",
      name: "Introduction to HTML5",
      issuer: "Univ. of Michigan",
      date: "Mar 2021",
      category: "Foundations",
      image: "certificates/thumbs/html5-michigan.webp",
      pdfUrl: "certificates/pdf/HTML Certificate.pdf",
    },
    {
      id: "linkedin-learning",
      name: "AI & Machine Learning Career Development",
      issuer: "LinkedIn Learning",
      date: "Jun 2022",
      category: "Foundations",
      image: "certificates/thumbs/linkedin-learning.webp",
      pdfUrl: "certificates/pdf/LinkedIn Learning Certificate.pdf",
    },
    {
      id: "exposys-internship",
      name: "Data Science & ML Engineering Internship",
      issuer: "Exposys Data Labs",
      date: "May 2022",
      category: "Foundations",
      image: "certificates/thumbs/exposys-internship.webp",
      pdfUrl: "certificates/pdf/UBAID AKHTAR GHANTE Exposys Internship.pdf",
    },
  ] as CertificationItem[],
};

export const portfolioData = PORTFOLIO_DATA;
