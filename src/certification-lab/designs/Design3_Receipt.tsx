import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DesignProps } from "../types";
import type { CertificationItem } from "../../data/portfolioData";
import { ALL_CERTS, CERT_GROUPS, assetUrl, easeInOutCubic, easeOutCubic, lerp, range } from "../data";
import { useScrollProgressRef } from "../hooks/useStickyScrollProgress";
import { useFrame } from "../physics/useFrame";
import { usePointer } from "../physics/usePointer";
import { Spring } from "../physics/spring";
import "./receipt.css";

const PRINTER = { width: 1400, height: 900, slotLeft: 288.2, slotRight: 1111.8, slotY: 305.5 };
const SLICE_H = 110;
const PAPER_W = 300;
const FEED_START = 0.04;
const FEED_END = 0.68;
const TEAR_START = 0.71;
const TEAR_END = 0.76;
const SETTLE_END = 0.84;
const LINE_STEP = 22;

const issuers = Array.from(new Set(ALL_CERTS.map((c) => c.issuer)));

const ReceiptContent = React.memo(function ReceiptContent({ hovered }: { hovered: number }) {
  let n = 0;
  return (
    <div className="rc-paper">
      <div className="rc-center rc-brand">UBAID GHANTE</div>
      <div className="rc-center rc-dim">CREDENTIALS DESK · EST. 2023</div>
      <div className="rc-center rc-dim">portfolio.scylla23.xyz</div>
      <div className="rc-rule">{"=".repeat(40)}</div>
      <div className="rc-row rc-dim">
        <span>ORDER #UG-{ALL_CERTS.length}</span>
        <span>2023 — 2026</span>
      </div>
      <div className="rc-row rc-dim">
        <span>QTY ITEM</span>
        <span>STATUS</span>
      </div>
      <div className="rc-rule">{"-".repeat(40)}</div>
      {CERT_GROUPS.filter((g) => g.certs.length).map((g) => (
        <div key={g.key} className="rc-group">
          <div className="rc-group-head">
            <span>{g.label.toUpperCase()}</span>
            <span>{String(g.certs.length).padStart(2, "0")}</span>
          </div>
          {g.certs.map((cert) => {
            const idx = ALL_CERTS.indexOf(cert);
            n++;
            return (
              <div key={cert.id ?? cert.name} className={`rc-item ${hovered === idx ? "is-hover" : ""}`} data-idx={idx}>
                <div className="rc-row">
                  <span className="rc-name">
                    {String(n).padStart(2, "0")} {cert.name}
                  </span>
                  <span className="rc-ok">✓</span>
                </div>
                <div className="rc-row rc-dim rc-sub">
                  <span>{cert.issuer}</span>
                  <span>{cert.date.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div className="rc-rule">{"-".repeat(40)}</div>
      <div className="rc-row">
        <span>ISSUERS</span>
        <span>{issuers.length}</span>
      </div>
      <div className="rc-row rc-dim rc-wrap">{issuers.join(" · ").toUpperCase()}</div>
      <div className="rc-row rc-total">
        <span>TOTAL</span>
        <span>{ALL_CERTS.length} CREDENTIALS</span>
      </div>
      <div className="rc-rule">{"=".repeat(40)}</div>
      <div className="rc-barcode" aria-hidden />
      <div className="rc-center rc-dim">ALL ITEMS VERIFIED · NO EXPIRY</div>
      <div className="rc-center rc-brand rc-thanks">THANK YOU FOR READING</div>
      <div className="rc-tear" aria-hidden />
    </div>
  );
});

const ReceiptDesign: React.FC<DesignProps> = ({ onInspect, manualScrub }) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgressRef(runwayRef, manualScrub);
  const pointer = usePointer(stageRef);

  const [total, setTotal] = useState(1400);
  const [hovered, setHovered] = useState(-1);
  const hoveredRef = useRef(-1);
  hoveredRef.current = hovered;

  const sliceCount = Math.ceil(total / SLICE_H) + 1;
  const joints = useRef<Spring[]>([]);
  if (joints.current.length < sliceCount) {
    joints.current = Array.from({ length: sliceCount }, (_, k) => joints.current[k] ?? new Spring(0, { stiffness: Math.max(40, 260 - k * 16), damping: 5 + k * 0.15 }));
  }
  const card = useRef({ x: new Spring(0, { stiffness: 140, damping: 16 }), y: new Spring(0, { stiffness: 140, damping: 16 }), rot: new Spring(0, { stiffness: 90, damping: 8 }), show: new Spring(0, { stiffness: 220, damping: 20 }) });

  useLayoutEffect(() => {
    if (measureRef.current) setTotal(measureRef.current.offsetHeight);
  }, []);

  useFrame((dt, time) => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const p = progress.current;
    const ptr = pointer.current;

    const s = (PAPER_W + 18) / (PRINTER.slotRight - PRINTER.slotLeft);
    const printerW = PRINTER.width * s;
    const printerH = PRINTER.height * s;
    const px = W / 2 - printerW / 2;
    const settle = easeInOutCubic(range(p, TEAR_END, SETTLE_END));
    const py = H * 1.02 - printerH + settle * printerH * 1.1;
    const slotX = px + ((PRINTER.slotLeft + PRINTER.slotRight) / 2) * s;
    const slotY = py + PRINTER.slotY * s;
    const paperW = PAPER_W;

    // Stepper-motor feed: each line jumps quickly, then rests.
    const raw = 18 + range(p, FEED_START, FEED_END) * (total - 18);
    const steps = raw / LINE_STEP;
    const L = Math.min(total, (Math.floor(steps) + easeOutCubic(Math.min(1, (steps % 1) * 2.2))) * LINE_STEP);
    const feeding = p > FEED_START && p < FEED_END && (steps % 1) < 0.45;
    const buzz = feeding ? Math.sin(time * 90) * 0.6 : 0;
    const printerT = `translate3d(${px}px, ${py + buzz}px, 0) scale(${s})`;
    if (backRef.current) backRef.current.style.transform = printerT;
    if (frontRef.current) frontRef.current.style.transform = printerT;

    // Root (slice 0) transform: anchored at the slot, then torn off and settled flat in the centre.
    const tear = range(p, TEAR_START, TEAR_END);
    const fitScale = Math.min(1, (H * 0.9) / 600);
    const finalX = W > 900 ? W * 0.4 : W / 2;
    const pan = easeInOutCubic(range(p, SETTLE_END, 1));
    const finalBottomY = lerp(H * 0.1 + total * fitScale, H * 0.94, pan);
    const snap = Math.sin(Math.PI * Math.min(1, tear * 1.4)) * 1;
    const ax = lerp(slotX, finalX, settle);
    const ay = lerp(slotY - easeOutCubic(tear) * 40, finalBottomY, settle);
    const aRot = snap * 0.06 * (1 - settle) + settle * -0.015;
    const aScale = lerp(1, fitScale, settle);
    root.style.width = `${paperW}px`;
    if (captionRef.current) captionRef.current.style.opacity = String(1 - settle);
    root.style.transform = `translate3d(${ax - paperW / 2}px, ${ay - SLICE_H}px, 0) rotate(${aRot}rad) scale(${aScale})`;
    root.style.transformOrigin = `50% 100%`;

    // Joint angles: idle breeze + cursor brushing, straighten out once settled.
    let jx = ax;
    let jy = ay;
    let acc = aRot;
    const pressure = 1 - settle * 0.7;
    for (let k = 0; k < sliceCount; k++) {
      const j = joints.current[k];
      const el = sliceRefs.current[k];
      const content = contentRefs.current[k];
      if (!el || !content) continue;
      const visible = k * SLICE_H < L;
      el.style.visibility = visible ? "visible" : "hidden";
      content.style.transform = `translate3d(0, ${-(L - (k + 1) * SLICE_H) + 1}px, 0)`;
      if (!visible) continue;

      const heightFactor = Math.min(1, L / 500);
      j.target = Math.sin(time * 0.8 + k * 0.5) * 0.004 * heightFactor * pressure;
      const segLen = SLICE_H * aScale;
      const mx = jx + Math.sin(acc) * segLen * 0.5;
      const my = jy - Math.cos(acc) * segLen * 0.5;
      if (ptr.inside) {
        const dx = ptr.x - mx;
        const dy = ptr.y - my;
        if (Math.abs(dy) < segLen * 0.7 && Math.abs(dx) < paperW * aScale * 0.8) {
          const fall = 1 - Math.abs(dx) / (paperW * aScale * 0.8);
          j.velocity += -ptr.vx * 0.00012 * fall * pressure * Math.min(1, dt * 60);
        }
      }
      j.step(dt);
      acc += j.value;
      jx += Math.sin(acc) * segLen;
      jy -= Math.cos(acc) * segLen;
      el.style.transform = `rotate(${j.value}rad)`;
    }

    // Floating certificate that trails the cursor while a line is hovered.
    const c = card.current;
    const show = hoveredRef.current >= 0 && ptr.inside;
    c.show.target = show ? 1 : 0;
    if (show && c.show.value < 0.05) {
      c.x.snap(ptr.x + 36);
      c.y.snap(ptr.y - 120);
    }
    c.x.target = ptr.x + 36;
    c.y.target = ptr.y - 120;
    c.rot.target = Math.max(-0.25, Math.min(0.25, ptr.vx * 0.0003));
    c.x.step(dt);
    c.y.step(dt);
    c.rot.step(dt);
    c.show.step(dt);
    if (cardRef.current) {
      const cw = 300;
      const x = Math.min(W - cw - 16, c.x.value);
      cardRef.current.style.opacity = String(Math.max(0, Math.min(1, c.show.value)));
      cardRef.current.style.transform = `translate3d(${x}px, ${c.y.value}px, 0) rotate(${c.rot.value}rad) scale(${0.85 + 0.15 * c.show.value})`;
    }
  });

  const slices = useMemo(() => {
    let node: React.ReactNode = null;
    for (let k = sliceCount - 1; k >= 0; k--) {
      node = (
        <div
          className="rc-slice"
          ref={(el) => (sliceRefs.current[k] = el)}
          style={{ height: SLICE_H, ...(k > 0 ? { position: "absolute", left: 0, bottom: "100%", width: "100%" } : {}) }}
        >
          <div className="rc-slice-clip">
            <div className="rc-slice-content" ref={(el) => (contentRefs.current[k] = el)}>
              <ReceiptContent hovered={hovered} />
            </div>
          </div>
          {node}
        </div>
      );
    }
    return node;
  }, [sliceCount, hovered]);

  const hoveredCert: CertificationItem | null = hovered >= 0 ? ALL_CERTS[hovered] : null;

  return (
    <div className="lab-runway" ref={runwayRef} style={{ height: "650vh" }}>
      <section className="lab-stage rc-stage" ref={stageRef}>
        <div className="lab-stage-caption" ref={captionRef}>
          <span className="eyebrow">Credentials · Itemised</span>
          <h2>Printed, line by line.</h2>
          <p>Every certificate, itemised on one receipt. Hover a line to see it.</p>
        </div>

        <img ref={backRef} className="rc-printer" src={assetUrl("lab/receipt/printer-back.webp")} alt="" />
        <div
          ref={rootRef}
          className="rc-root"
          onPointerMove={(e) => {
            const item = (e.target as HTMLElement).closest("[data-idx]") as HTMLElement | null;
            const idx = item ? Number(item.dataset.idx) : -1;
            if (idx !== hoveredRef.current) setHovered(idx);
          }}
          onPointerLeave={() => setHovered(-1)}
          onClick={() => {
            if (hoveredRef.current >= 0) onInspect(ALL_CERTS[hoveredRef.current]);
          }}
        >
          {slices}
        </div>
        <img ref={frontRef} className="rc-printer rc-printer--front" src={assetUrl("lab/receipt/printer-front.webp")} alt="" />

        <button ref={cardRef} className="rc-float-card" tabIndex={-1} aria-hidden>
          {hoveredCert && (
            <>
              <span className="cert-face">{hoveredCert.image && <img src={assetUrl(hoveredCert.image)} alt="" />}</span>
              <strong>{hoveredCert.name}</strong>
              <em>
                {hoveredCert.issuer} · {hoveredCert.date} · click to open
              </em>
            </>
          )}
        </button>

        <div className="rc-measure" ref={measureRef} aria-hidden>
          <ReceiptContent hovered={-1} />
        </div>
      </section>
    </div>
  );
};

export default ReceiptDesign;
