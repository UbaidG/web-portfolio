import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "../../lib/motion/useFrame";
import { Spring } from "../../lib/motion/spring";
import type { PointerState } from "../../lib/motion/usePointer";
import "./receipt.css";

const PRINTER = { width: 1400, height: 900, slotLeft: 288.2, slotRight: 1111.8, slotY: 305.5 };
const SLICE_H = 110;
const LINE_STEP = 22;

export interface ReceiptTiming {
  feedStart: number;
  feedEnd: number;
  tearStart: number;
  tearEnd: number;
  settleEnd: number;
}

const DEFAULT_TIMING: ReceiptTiming = { feedStart: 0.04, feedEnd: 0.68, tearStart: 0.71, tearEnd: 0.76, settleEnd: 0.84 };

export interface ReceiptFrame {
  /** Paper fed out so far, in px of receipt content. */
  printed: number;
  total: number;
  /** 0 while attached to the printer, 1 once torn off and laid flat. */
  settle: number;
  /** Off-screen copy of the paper, for measuring item offsets. */
  measure: HTMLElement;
}

interface ReceiptPrinterProps {
  stageRef: React.RefObject<HTMLElement>;
  progress: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<PointerState>;
  /** Paper content; elements with `data-idx` become hoverable/clickable items. */
  renderPaper: (hovered: number) => React.ReactNode;
  plate: string;
  paperWidth?: number;
  timing?: Partial<ReceiptTiming>;
  printerX?: (stageWidth: number) => number;
  settledX?: (stageWidth: number) => number;
  onHoverChange?: (idx: number) => void;
  onItemClick?: (idx: number) => void;
  onFrame?: (frame: ReceiptFrame) => void;
}

const range = (v: number, a: number, b: number) => Math.max(0, Math.min(1, (v - a) / (b - a)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({
  stageRef,
  progress,
  pointer,
  renderPaper,
  plate,
  paperWidth = 300,
  timing: timingOverride,
  printerX = (W) => W / 2,
  settledX = (W) => (W > 900 ? W * 0.4 : W / 2),
  onHoverChange,
  onItemClick,
  onFrame,
}) => {
  const timing = { ...DEFAULT_TIMING, ...timingOverride };
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  const [total, setTotal] = useState(1400);
  const [hovered, setHovered] = useState(-1);
  const hoveredRef = useRef(-1);
  hoveredRef.current = hovered;

  const sliceCount = Math.ceil(total / SLICE_H) + 1;
  const joints = useRef<Spring[]>([]);
  if (joints.current.length < sliceCount) {
    joints.current = Array.from(
      { length: sliceCount },
      (_, k) => joints.current[k] ?? new Spring(0, { stiffness: Math.max(40, 260 - k * 16), damping: 5 + k * 0.15 })
    );
  }

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => setTotal(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setHover = (idx: number) => {
    if (idx === hoveredRef.current) return;
    setHovered(idx);
    onHoverChange?.(idx);
  };

  useFrame((dt, time) => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const p = progress.current;
    const ptr = pointer.current;

    const s = (paperWidth + 18) / (PRINTER.slotRight - PRINTER.slotLeft);
    const printerW = PRINTER.width * s;
    const printerH = PRINTER.height * s;
    const px = printerX(W) - printerW / 2;
    const settle = easeInOutCubic(range(p, timing.tearEnd, timing.settleEnd));
    const py = H * 1.02 - printerH + settle * printerH * 1.1;
    const slotX = px + ((PRINTER.slotLeft + PRINTER.slotRight) / 2) * s;
    const slotY = py + PRINTER.slotY * s;

    // Stepper-motor feed: each line jumps quickly, then rests.
    const raw = 18 + range(p, timing.feedStart, timing.feedEnd) * (total - 18);
    const steps = raw / LINE_STEP;
    const L = Math.min(total, (Math.floor(steps) + easeOutCubic(Math.min(1, (steps % 1) * 2.2))) * LINE_STEP);
    const feeding = p > timing.feedStart && p < timing.feedEnd && steps % 1 < 0.45;
    const buzz = feeding ? Math.sin(time * 90) * 0.6 : 0;
    const printerT = `translate3d(${px}px, ${py + buzz}px, 0) scale(${s})`;
    if (backRef.current) backRef.current.style.transform = printerT;
    if (frontRef.current) frontRef.current.style.transform = printerT;

    // Root (slice 0): anchored at the slot, then torn off and laid flat.
    const tear = range(p, timing.tearStart, timing.tearEnd);
    const fitScale = Math.min(1, (H * 0.9) / 600);
    const finalX = settledX(W);
    const tall = total * fitScale > H * 0.84;
    const pan = easeInOutCubic(range(p, timing.settleEnd, 1));
    const finalBottomY = tall ? lerp(H * 0.1 + total * fitScale, H * 0.94, pan) : H / 2 + (total * fitScale) / 2;
    const snap = Math.sin(Math.PI * Math.min(1, tear * 1.4));
    const ax = lerp(slotX, finalX, settle);
    const ay = lerp(slotY - easeOutCubic(tear) * 40, finalBottomY, settle);
    const aRot = snap * 0.06 * (1 - settle) + settle * -0.015;
    const aScale = lerp(1, fitScale, settle);
    root.style.width = `${paperWidth}px`;
    root.style.transform = `translate3d(${ax - paperWidth / 2}px, ${ay - SLICE_H}px, 0) rotate(${aRot}rad) scale(${aScale})`;

    // Joint angles: idle breeze + cursor brushing, straightening out once settled.
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
        if (Math.abs(dy) < segLen * 0.7 && Math.abs(dx) < paperWidth * aScale * 0.8) {
          const fall = 1 - Math.abs(dx) / (paperWidth * aScale * 0.8);
          j.velocity += -ptr.vx * 0.00012 * fall * pressure * Math.min(1, dt * 60);
        }
      }
      j.step(dt);
      acc += j.value;
      jx += Math.sin(acc) * segLen;
      jy -= Math.cos(acc) * segLen;
      el.style.transform = `rotate(${j.value}rad)`;
    }

    if (onFrame && measureRef.current) onFrame({ printed: L, total, settle, measure: measureRef.current });
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
              {renderPaper(hovered)}
            </div>
          </div>
          {node}
        </div>
      );
    }
    return node;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliceCount, hovered]);

  const base = import.meta.env.BASE_URL;
  return (
    <>
      <img ref={backRef} className="rc-printer" src={`${base}receipt/printer-back.webp`} alt="" />
      <div
        ref={rootRef}
        className="rc-root"
        style={{ "--rc-paper-w": `${paperWidth}px` } as React.CSSProperties}
        onPointerMove={(e) => {
          const item = (e.target as HTMLElement).closest("[data-idx]") as HTMLElement | null;
          setHover(item ? Number(item.dataset.idx) : -1);
        }}
        onPointerLeave={() => setHover(-1)}
        onClick={() => {
          if (hoveredRef.current >= 0) onItemClick?.(hoveredRef.current);
        }}
      >
        {slices}
      </div>
      <div ref={frontRef} className="rc-printer rc-printer--front">
        <img src={`${base}receipt/printer-front.webp`} alt="" />
        <span className="rc-plate">{plate}</span>
      </div>
      <div
        className="rc-measure"
        ref={measureRef}
        style={{ "--rc-paper-w": `${paperWidth}px` } as React.CSSProperties}
        aria-hidden
      >
        {renderPaper(-1)}
      </div>
    </>
  );
};
