import { portfolioData, type CertificationItem } from "./portfolioData";

export interface CertGroup {
  key: string;
  label: string;
  short: string;
  certs: CertificationItem[];
}

const GROUP_OF: Record<string, string> = {
  "AI & ML": "ai",
  "Agentic AI": "ai",
  "Health AI": "ai",
  "Computer Vision": "ai",
  "MLOps & Data": "ai",
  "Cloud & Architecture": "cloud",
  "Project Management": "pm",
  Foundations: "foundations",
};

const GROUP_DEFS: Omit<CertGroup, "certs">[] = [
  { key: "ai", label: "AI & Machine Learning", short: "AI / ML" },
  { key: "cloud", label: "Cloud & Architecture", short: "CLOUD" },
  { key: "pm", label: "Project Management", short: "PROJECT MGMT" },
  { key: "foundations", label: "Foundations", short: "FOUNDATIONS" },
];

export const ALL_CERTS: CertificationItem[] = portfolioData.certifications;

export const CERT_GROUPS: CertGroup[] = GROUP_DEFS.map((def) => ({
  ...def,
  certs: ALL_CERTS.filter((c) => GROUP_OF[c.category ?? ""] === def.key),
}));

export const groupKeyOf = (cert: CertificationItem) => GROUP_OF[cert.category ?? ""] ?? "foundations";
