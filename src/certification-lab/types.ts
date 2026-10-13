import type { CertificationItem } from "../data/portfolioData";

export type DesignId = "hand" | "cabinet" | "receipt" | "split-flap" | "darkroom" | "chaos";

export interface DesignProps {
  onInspect: (cert: CertificationItem) => void;
  manualScrub: number | null;
}

export interface DesignMeta {
  id: DesignId;
  name: string;
  tagline: string;
  notes: string[];
}
