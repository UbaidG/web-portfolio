import { portfolioData, type CertificationItem } from "../data/portfolioData";

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

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Maps progress `p` into 0..1 across the window [start, end]. */
export const range = (p: number, start: number, end: number) => clamp01((p - start) / (end - start));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Deterministic pseudo-random in [0, 1) so layouts are stable across renders. */
export const hash01 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
