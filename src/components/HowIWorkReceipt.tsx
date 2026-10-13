import React, { useEffect, useRef, useState } from "react";
import { ReceiptPrinter, type ReceiptFrame } from "./receipt/ReceiptPrinter";
import { useScrollProgressRef } from "../lib/motion/useStickyScrollProgress";
import { usePointer } from "../lib/motion/usePointer";

interface Stage {
  idx: string;
  phase: string;
  title: string;
  desc: string;
  tools: string[];
  tone: "matcha" | "ochre" | "espresso";
}

const STAGES: Stage[] = [
  {
    idx: "01",
    phase: "DATA & DESIGN",
    title: "Get the Data Right",
    desc: "Modeling the data and the workflow before the prompts: graph databases, agent flows, and models that hold up on sparse, real-world data.",
    tools: ["Neo4j", "LangGraph", "Apache Spark"],
    tone: "matcha",
  },
  {
    idx: "02",
    phase: "REAL-TIME AI",
    title: "Build for Live Use",
    desc: "Voice pipelines, agent workflows, and MCP servers that respond fast enough for live conversations and real users.",
    tools: ["LiveKit", "Deepgram", "MCP"],
    tone: "ochre",
  },
  {
    idx: "03",
    phase: "MLOPS & QUALITY",
    title: "Ship and Monitor",
    desc: "Containerized deployments with CI/CD, observability from day one, and PHI/PII masked before data leaves the pipeline.",
    tools: ["Kubernetes", "Arize AX", "PHI/PII Masking"],
    tone: "espresso",
  },
];

const TIMING = { feedStart: 0.03, feedEnd: 0.66, tearStart: 0.7, tearEnd: 0.76, settleEnd: 0.86 };

function WorkflowReceipt({ hovered }: { hovered: number }) {
  return (
    <div className="rc-paper hiw-paper">
      <div className="rc-center rc-brand">UBAID GHANTE</div>
      <div className="rc-center rc-dim">ML SYSTEMS · BUILT TO SHIP</div>
      <div className="rc-rule">{"=".repeat(44)}</div>
      <div className="rc-row rc-dim">
        <span>ORDER</span>
        <span>PROTOTYPE → PRODUCTION</span>
      </div>
      <div className="rc-row rc-dim">
        <span>STAGE / ITEM</span>
        <span>STATUS</span>
      </div>
      <div className="rc-rule">{"-".repeat(44)}</div>
      {STAGES.map((s, i) => (
        <div key={s.idx} className={`rc-item hiw-item ${hovered === i ? "is-hover" : ""}`} data-idx={i}>
          <div className="rc-group-head">
            <span>
              {s.idx} {s.phase}
            </span>
            <span>✓</span>
          </div>
          <div className="rc-name hiw-item-title">{s.title.toUpperCase()}</div>
          <div className="rc-dim hiw-item-desc">{s.desc}</div>
          {s.tools.map((t) => (
            <div key={t} className="rc-row hiw-tool">
              <span>+ {t}</span>
              <span className="rc-ok">✓</span>
            </div>
          ))}
        </div>
      ))}
      <div className="rc-rule">{"-".repeat(44)}</div>
      <div className="rc-row">
        <span>STAGES</span>
        <span>{STAGES.length}</span>
      </div>
      <div className="rc-row">
        <span>TOOLS</span>
        <span>{STAGES.reduce((n, s) => n + s.tools.length, 0)}</span>
      </div>
      <div className="rc-row rc-total">
        <span>TOTAL</span>
        <span>1 PRODUCTION SYSTEM</span>
      </div>
      <div className="rc-row rc-dim">
        <span>STATUS</span>
        <span>SHIPPED + MONITORED</span>
      </div>
      <div className="rc-rule">{"=".repeat(44)}</div>
      <div className="rc-barcode" aria-hidden />
      <div className="rc-center rc-brand rc-thanks">THANK YOU</div>
      <div className="rc-center rc-dim">LET'S BUILD SOMETHING THAT SHIPS</div>
      <div className="rc-tear" aria-hidden />
    </div>
  );
}

const useStaticMode = () => {
  const query = "(max-width: 760px), (prefers-reduced-motion: reduce)";
  const [isStatic, setStatic] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setStatic(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isStatic;
};

const StageList: React.FC<{ hovered: number; printed: number }> = ({ hovered, printed }) => (
  <ol className="hiw-stages">
    {STAGES.map((s, i) => (
      <li
        key={s.idx}
        className={`hiw-stage hiw-stage--${s.tone} ${i < printed ? "is-printed" : ""} ${hovered === i ? "is-hover" : ""}`}
      >
        <span className="hiw-stage-idx">{s.idx}</span>
        <div>
          <span className="hiw-stage-phase">{s.phase}</span>
          <h3>{s.title}</h3>
          <div className="hiw-stage-tags">
            {s.tools.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </li>
    ))}
  </ol>
);

const AnimatedReceipt: React.FC = () => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgressRef(runwayRef, null);
  const pointer = usePointer(panelRef);
  const [hovered, setHovered] = useState(-1);
  const [printedCount, setPrintedCount] = useState(0);
  const printedRef = useRef(0);

  const onFrame = ({ printed, measure }: ReceiptFrame) => {
    let count = 0;
    measure.querySelectorAll<HTMLElement>("[data-idx]").forEach((el) => {
      if (printed > el.offsetTop + 40) count++;
    });
    if (count === printedRef.current) return;
    printedRef.current = count;
    setPrintedCount(count);
  };

  return (
    <div className="hiw-runway" ref={runwayRef}>
      <div className="hiw-sticky">
        <div className="hiw-panel" ref={panelRef}>
          <StageList hovered={hovered} printed={printedCount} />
          <ReceiptPrinter
            stageRef={panelRef}
            progress={progress}
            pointer={pointer}
            plate="WORKFLOW · UG-80"
            paperWidth={320}
            timing={TIMING}
            printerX={(W) => (W > 960 ? W * 0.68 : W / 2)}
            settledX={(W) => (W > 960 ? W * 0.68 : W / 2)}
            renderPaper={(h) => <WorkflowReceipt hovered={h} />}
            onHoverChange={setHovered}
            onFrame={onFrame}
          />
          <span className="hiw-hint">Scroll to print · brush the paper</span>
        </div>
      </div>
    </div>
  );
};

export const HowIWorkReceipt: React.FC = () => {
  const isStatic = useStaticMode();
  if (!isStatic) return <AnimatedReceipt />;
  return (
    <div className="hiw-static">
      <WorkflowReceipt hovered={-1} />
    </div>
  );
};
