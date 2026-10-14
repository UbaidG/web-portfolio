import React, { useEffect, useMemo, useRef, useState } from "react";
import type { CertificationItem } from "../../data/portfolioData";
import { CERT_GROUPS } from "../../data/certGroups";
import { easeInOutCubic, easeOutBack, easeOutCubic, hash01, lerp, range } from "../../lib/motion/easing";
import { useScrollProgressRef } from "../../lib/motion/useStickyScrollProgress";
import { useFrame } from "../../lib/motion/useFrame";
import { usePointer } from "../../lib/motion/usePointer";
import { Spring } from "../../lib/motion/spring";
import { asset } from "../../lib/asset";
import { getLenis } from "../../hooks/useLenis";
import { CabinetScene } from "./CabinetScene";
import "./cabinet.css";

const NUMERALS = ["I", "II", "III", "IV"];
/** The cabinet model has one drawer per numeral; extra groups would have nowhere to go. */
if (import.meta.env.DEV && CERT_GROUPS.length > NUMERALS.length) {
  console.warn(`FilingCabinet supports ${NUMERALS.length} cert groups, got ${CERT_GROUPS.length}.`);
}
const START = 0.03;
const END = 0.97;
/** Phases inside one drawer's window. */
const OPEN_END = 0.14;
const OUT_START = 0.12;
const OUT_END = 0.42;
const IN_START = 0.7;
const IN_END = 0.9;
const REVEAL_LOCAL = (OUT_END + IN_START) / 2;
const REVEAL_DURATION = 640;
const CARD_W = 220;
const CERT_ASPECT = 900 / 695;

interface Flat {
  group: number;
  index: number;
  groupSize: number;
}

interface FilingCabinetProps {
  onInspect: (cert: CertificationItem) => void;
  /** Overrides page scroll with a fixed 0..1 progress (lab scrub slider). */
  manualScrub?: number | null;
  runwayHeight?: string;
  className?: string;
  showIndex?: boolean;
  /** Rendered inside the sticky stage, e.g. a caption. */
  children?: React.ReactNode;
}

export const FilingCabinet: React.FC<FilingCabinetProps> = ({
  onInspect,
  manualScrub = null,
  runwayHeight = "600vh",
  className = "",
  showIndex = true,
  children,
}) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sceneRef = useRef<CabinetScene | null>(null);
  const progress = useScrollProgressRef(runwayRef, manualScrub);
  const pointer = usePointer(stageRef);
  const [activeDrawer, setActiveDrawer] = useState(0);
  const lastDrawer = useRef(0);

  const flat = useMemo(() => {
    const items: { cert: CertificationItem; meta: Flat }[] = [];
    CERT_GROUPS.forEach((g, gi) =>
      g.certs.forEach((cert, ci) => items.push({ cert, meta: { group: gi, index: ci, groupSize: g.certs.length } }))
    );
    return items;
  }, []);

  const sway = useRef(
    flat.map(() => ({
      rot: new Spring(0, { stiffness: 60, damping: 4 }),
      lift: new Spring(0, { stiffness: 200, damping: 16 }),
    }))
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const s = new CabinetScene(
      canvasRef.current,
      CERT_GROUPS.map((g, i) => ({ numeral: NUMERALS[i], text: g.short })),
      asset("models/filing-cabinet.glb")
    );
    sceneRef.current = s;
    const onResize = () => {
      const el = stageRef.current;
      if (el) s.resize(el.clientWidth, el.clientHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      s.dispose();
      sceneRef.current = null;
    };
  }, []);

  const jumpToDrawer = (i: number) => {
    const runway = runwayRef.current;
    if (!runway || manualScrub !== null) return;
    const drawer = Math.max(0, Math.min(CERT_GROUPS.length - 1, i));
    const count = CERT_GROUPS.length;
    const start = START + (drawer / count) * (END - START);
    const target = START + ((drawer + REVEAL_LOCAL) / count) * (END - START);
    const top = runway.getBoundingClientRect().top + window.scrollY;
    const scrollRange = runway.offsetHeight - window.innerHeight;
    if (scrollRange <= 0) return;

    // Land the page at the selected drawer's settled position, but drive the
    // visual progress through only that drawer's reveal window. The scroll must
    // be instant: the reveal stops tracking scroll, and a smooth scroll still in
    // flight when it ends would drag the cabinet back through other drawers.
    progress.cancelTransition();
    const y = top + target * scrollRange;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: "instant" });
    if (drawer !== lastDrawer.current) progress.snapTo(start);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    progress.transitionTo(target, reducedMotion ? 0 : REVEAL_DURATION);
  };

  useFrame((dt, time) => {
    const s = sceneRef.current;
    const stage = stageRef.current;
    if (!s || !stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const p = progress.current;
    const ptr = pointer.current;

    const groupCount = CERT_GROUPS.length;
    const local = range(p, START, END) * groupCount;
    const d = Math.min(groupCount - 1, Math.floor(local));
    const t = local - d;
    const openAmt = t < OPEN_END ? easeOutBack(t / OPEN_END) : t < IN_END ? 1 : 1 - easeInOutCubic(range(t, IN_END, 1));
    const open = Array.from({ length: groupCount }, (_, i) => (i === d ? Math.max(0, openAmt) : 0));

    s.frame({
      dt,
      open,
      pointerNx: ptr.nx,
      pointerNy: ptr.ny,
      pointerInside: ptr.inside,
      pointerX: ptr.x,
      pointerY: ptr.y,
    });
    stage.style.cursor = s.hovered >= 0 ? "pointer" : "";

    if (d !== lastDrawer.current) {
      lastDrawer.current = d;
      setActiveDrawer(d);
    }

    const [mx, my] = s.mouthScreen(d);
    const regionX = W > 820 ? W * 0.47 : W * 0.06;
    const regionW = W > 820 ? W * 0.49 : W * 0.88;
    const regionY = H * 0.2;
    const regionH = H * 0.72;

    flat.forEach(({ meta }, k) => {
      const el = cardRefs.current[k];
      if (!el) return;
      if (meta.group !== d) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        return;
      }
      const n = meta.groupSize;
      const cols = n > 6 ? 4 : n > 3 ? 3 : n;
      const rows = Math.ceil(n / cols);
      const cw = Math.min(regionW / cols - 18, (regionH / rows - 18) * CERT_ASPECT, CARD_W * 1.15);
      const ch = cw / CERT_ASPECT + 34;
      const c = meta.index % cols;
      const r = Math.floor(meta.index / cols);
      const rowCount = r === rows - 1 ? n - r * cols : cols;
      const sx = regionX + regionW / 2 + (c - (rowCount - 1) / 2) * (cw + 18);
      const sy = regionY + regionH / 2 + (r - (rows - 1) / 2) * (ch + 18);
      const sRot = (hash01(k + 3) - 0.5) * 0.08;

      const stagger = (meta.index / Math.max(1, n)) * 0.5;
      const outT = easeOutCubic(range(t, OUT_START + stagger * (OUT_END - OUT_START), OUT_END));
      const inT = easeInOutCubic(range(t, IN_START + (1 - stagger - 0.5) * (IN_END - IN_START) * 0.8, IN_END));
      const f = Math.max(0, outT - inT);

      const rise = range(f, 0, 0.18);
      const travel = range(f, 0.12, 1);
      const cx = lerp(mx, sx, travel);
      const arc = Math.sin(Math.PI * travel) * -H * 0.18;
      const cy = lerp(my - rise * 70, sy, travel) + arc;
      const scale = lerp(0.18, 1, easeOutCubic(range(f, 0, 0.6)));
      const tilt = lerp(-0.5 + (hash01(k) - 0.5) * 0.4, 0, travel);

      const sw = sway.current[k];
      if (f > 0.98 && ptr.inside) {
        const dx = sx - ptr.x;
        const dy = sy - ptr.y;
        const dist = Math.hypot(dx, dy);
        const R = 220;
        if (dist < R) sw.rot.velocity += ptr.vx * 0.00002 * (1 - dist / R) * 60 * dt;
        const over = Math.abs(dx) < cw / 2 && Math.abs(dy) < ch / 2;
        sw.lift.target = over ? 1 : 0;
      } else {
        sw.lift.target = 0;
      }
      sw.rot.target = 0;
      sw.rot.step(dt);
      sw.lift.step(dt);

      const idle = f > 0.98 ? Math.sin(time * 0.9 + k) * 0.006 : 0;
      const rot = lerp(tilt, sRot, travel) + sw.rot.value + idle;
      el.style.width = `${cw}px`;
      el.style.height = `${ch}px`;
      el.style.opacity = f <= 0.001 ? "0" : String(Math.min(1, f * 6));
      el.style.pointerEvents = f > 0.95 ? "auto" : "none";
      el.style.zIndex = String(sw.lift.value > 0.05 ? 50 : 10 + meta.index);
      el.style.transformOrigin = "50% 0%";
      el.style.transform = `translate3d(${cx - cw / 2}px, ${cy - ch / 2 - sw.lift.value * 10}px, 0) rotate(${rot}rad) scale(${scale * (1 + sw.lift.value * 0.05)})`;
    });
  });

  const group = CERT_GROUPS[activeDrawer];

  return (
    <div className="cab-runway" ref={runwayRef} style={{ height: runwayHeight }}>
      <section
        className={`cab-stage ${className}`}
        ref={stageRef}
        onClick={() => {
          const s = sceneRef.current;
          if (s && s.hovered >= 0) jumpToDrawer(s.hovered);
        }}
      >
        {children}

        <canvas ref={canvasRef} className="cab-canvas" />

        <div className="cab-drawer-title" key={activeDrawer}>
          <strong>{group.label}</strong>
          <em>{group.certs.length} certificates</em>
        </div>

        {showIndex && (
          <nav className="cab-index" aria-label="Drawers">
            {CERT_GROUPS.map((g, i) => (
              <button
                key={g.key}
                className={i === activeDrawer ? "is-active" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToDrawer(i);
                }}
              >
                <span>{NUMERALS[i]}</span>
                {g.short}
              </button>
            ))}
          </nav>
        )}

        {flat.map(({ cert }, k) => (
          <button
            key={cert.id ?? cert.name}
            ref={(el) => (cardRefs.current[k] = el)}
            className="cab-card"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(cert);
            }}
          >
            <span className="cab-card-img">
              {cert.image && <img src={asset(cert.image)} alt="" draggable={false} />}
            </span>
            <span className="cab-card-meta">
              <strong>{cert.name}</strong>
              <em>
                {cert.issuer} · {cert.date}
              </em>
            </span>
          </button>
        ))}
      </section>
    </div>
  );
};
