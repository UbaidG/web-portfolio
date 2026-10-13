import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DesignProps } from "../types";
import { ALL_CERTS, assetUrl, clamp01, easeInOutCubic, easeOutCubic, lerp, range } from "../data";
import { useScrollProgressRef } from "../hooks/useStickyScrollProgress";
import { useFrame } from "../physics/useFrame";
import { usePointer } from "../physics/usePointer";
import { Spring } from "../physics/spring";
import { Rope } from "../physics/rope";
import { DevelopRenderer } from "./darkroom/DevelopRenderer";
import { prepareCertTexture } from "./hand/ChromaCardRenderer";
import { invert3, lerpQuad, quadToCssMatrix, rotateQuad, squareToQuad, type Mat3, type Quad, type Vec2 } from "./hand/homography";
import "./darkroom.css";

const N = ALL_CERTS.length;
const ROPES = 3;
const PER_ROPE = Math.ceil(N / ROPES);
const ROPE_POINTS = 30;
const SEQ_START = 0.04;
const SEQ_END = 0.92;
const LIGHTS_START = 0.93;
const LIGHTS_END = 0.98;
const PRINT_ASPECT = 695 / 900;
/** Liquid area inside tray.webp, as fractions of the image. */
const LIQUID = { left: 0.2, top: 0.183, width: 0.635, height: 0.614 };
const PRINT_UV: [number, number, number, number] = [0.15, 0.13, 0.85, 0.87];

const apply = (m: Mat3, u: number, v: number): Vec2 => {
  const w = m[6] * u + m[7] * v + m[8];
  return [(m[0] * u + m[1] * v + m[2]) / w, (m[3] * u + m[4] * v + m[5]) / w];
};

interface Hang {
  rope: number;
  point: number;
  theta: Spring;
}

const DarkroomDesign: React.FC<DesignProps> = ({ onInspect, manualScrub }) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const ropeCanvasRef = useRef<HTMLCanvasElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLImageElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const printRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const statusRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgressRef(runwayRef, manualScrub);
  const pointer = usePointer(stageRef);

  const renderer = useRef<DevelopRenderer | null>(null);
  const textures = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const ropes = useRef<Rope[]>([]);
  const hangs = useRef<Hang[]>(
    ALL_CERTS.map((_, i) => ({
      rope: Math.floor(i / PER_ROPE),
      point: Math.round((((i % PER_ROPE) + 0.5) / PER_ROPE) * (ROPE_POINTS - 1)),
      theta: new Spring(0, { stiffness: 38, damping: 3.2 }),
    })),
  );
  const hoverRef = useRef(-1);
  const lastIdx = useRef(-2);
  const lastDrop = useRef(-1);
  const lastRippleAt = useRef(0);
  const [current, setCurrent] = useState(-1);
  const size = useRef({ W: 1, H: 1, PW: 140, PH: 108 });

  const layout = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const x0 = W * 0.13;
    const x1 = W * 0.975;
    const span = x1 - x0;
    const PW = Math.min(150, (span / PER_ROPE) * 0.8, H * 0.15);
    size.current = { W, H, PW, PH: PW * PRINT_ASPECT };
    for (const el of printRefs.current) {
      if (!el) continue;
      el.style.width = `${PW}px`;
      el.style.height = `${PW * PRINT_ASPECT}px`;
    }
    ropes.current = Array.from({ length: ROPES }, (_, r) => {
      const ya = H * (0.19 + r * 0.19);
      const yb = ya + 8 - r * 4;
      const seg = (span / (ROPE_POINTS - 1)) * 1.0025;
      const coords = Array.from({ length: ROPE_POINTS }, (_, k) => ({
        x: x0 + (span * k) / (ROPE_POINTS - 1),
        y: lerp(ya, yb, k / (ROPE_POINTS - 1)),
        pinned: k === 0 || k === ROPE_POINTS - 1,
      }));
      const rope = new Rope(coords, { gravity: 320, friction: 0.978, iterations: 40 });
      rope.segment = seg;
      for (let k = 0; k < 240; k++) rope.step(1 / 60);
      return rope;
    });
    const canvas = ropeCanvasRef.current;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const tray = trayRef.current;
    if (tray) {
      const tw = Math.min(W * 0.38, H * 0.6, 600);
      tray.style.width = `${tw}px`;
      tray.style.height = `${tw / (1152 / 864)}px`;
      renderer.current?.resize(tw * LIQUID.width, (tw / (1152 / 864)) * LIQUID.height);
    }
  };

  useLayoutEffect(() => {
    const canvas = document.createElement("canvas");
    liquidRef.current?.prepend(canvas);
    try {
      renderer.current = new DevelopRenderer(canvas);
      renderer.current.setRect(...PRINT_UV);
    } catch {
      renderer.current = null;
    }
    layout();
    window.addEventListener("resize", layout);
    return () => {
      window.removeEventListener("resize", layout);
      renderer.current?.dispose();
      renderer.current = null;
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    const load = (i: number) => {
      if (i < 0 || i >= N || textures.current.has(i)) return;
      const src = ALL_CERTS[i].image;
      if (!src) return;
      const img = new Image();
      img.onload = () => textures.current.set(i, prepareCertTexture(img, 720));
      img.src = assetUrl(src);
    };
    load(current);
    load(current + 1);
  }, [current]);

  const readQuad = (): Quad | null => {
    const stage = stageRef.current;
    if (!stage) return null;
    const s = stage.getBoundingClientRect();
    const pts = markerRefs.current.map((m) => {
      if (!m) return [0, 0] as Vec2;
      const r = m.getBoundingClientRect();
      return [r.left + r.width / 2 - s.left, r.top + r.height / 2 - s.top] as Vec2;
    });
    return pts.length === 4 ? (pts as Quad) : null;
  };

  useFrame((dt, time) => {
    const p = progress.current;
    const ptr = pointer.current;
    const { W, H, PW, PH } = size.current;
    const h = Math.min(dt, 1 / 30);

    const span = (SEQ_END - SEQ_START) / N;
    const idx = p < SEQ_START ? -1 : Math.min(N - 1, Math.floor((p - SEQ_START) / span));
    const local = idx < 0 ? 0 : range(p, SEQ_START + idx * span, SEQ_START + (idx + 1) * span);
    if (idx !== lastIdx.current) {
      lastIdx.current = idx;
      setCurrent(idx);
    }
    const lights = easeInOutCubic(range(p, LIGHTS_START, LIGHTS_END));

    // Tray: gentle agitation while developing, then it slides away when the lights come on.
    const tray = trayRef.current;
    const rock = Math.sin(time * 1.7) * 0.7 * (local > 0.12 && local < 0.62 ? 1 : 0.3);
    if (tray) tray.style.transform = `translate(-50%, ${lights * 130}%) rotateX(54deg) rotateZ(${rock}deg)`;

    const quad = readQuad();
    const H2S = quad ? squareToQuad(quad) : null;
    const S2H = H2S ? invert3(H2S) : null;
    const r = renderer.current;

    // Liquid: drop splash once per print, plus ripples from the cursor.
    if (r) {
      if (idx >= 0 && local > 0.06 && lastDrop.current !== idx) {
        lastDrop.current = idx;
        r.ripple(0.5, 0.5, time, 1.2);
        r.ripple(0.3, 0.6, time + 0.08, 0.6);
      }
      if (S2H && ptr.inside) {
        const [u, v] = apply(S2H, ptr.x, ptr.y);
        const speed = Math.hypot(ptr.vx, ptr.vy);
        if (u > 0 && u < 1 && v > 0 && v < 1 && speed > 60 && time - lastRippleAt.current > 0.07) {
          lastRippleAt.current = time;
          r.ripple(u, v, time, Math.min(1.2, 0.25 + speed / 1400));
        }
      }
      const tex = idx >= 0 ? textures.current.get(idx) ?? null : null;
      r.setCert(tex);
      const show = idx >= 0 && local < 0.66 ? easeOutCubic(range(local, 0, 0.12)) : 0;
      const dev = easeInOutCubic(range(local, 0.12, 0.62));
      r.draw(time, dev, show);
    }

    // Ropes: pointer plucks, hung prints weigh them down.
    const rs = ropes.current;
    const speed = Math.hypot(ptr.vx, ptr.vy);
    for (let ri = 0; ri < rs.length; ri++) {
      const rope = rs[ri];
      if (ptr.inside && speed > 40) rope.disturb(ptr.x, ptr.y, ptr.vx, ptr.vy, 46, 0.0035);
      rope.step(dt);
    }
    hangs.current.forEach((hg, i) => {
      const hung = idx > i || (idx === i && local >= 0.98) || p >= SEQ_END;
      if (!hung) return;
      const pt = rs[hg.rope]?.points[hg.point];
      if (pt && !pt.pinned) pt.y += 900 * h * h;
    });

    // Prints.
    const hover = hoverRef.current;
    hangs.current.forEach((hg, i) => {
      const el = printRefs.current[i];
      const rope = rs[hg.rope];
      if (!el || !rope) return;
      const pt = rope.points[hg.point];
      const prev = rope.points[Math.max(0, hg.point - 1)];
      const next = rope.points[Math.min(ROPE_POINTS - 1, hg.point + 1)];
      const slope = Math.atan2(next.y - prev.y, next.x - prev.x);
      const vx = (pt.x - pt.px) / h;

      const th = hg.theta;
      th.target = slope * 0.4;
      th.velocity += -vx * 0.0009;
      if (hover === i && ptr.inside) th.velocity += ptr.vx * 0.00035;
      th.step(dt);

      const top = pt.y - PH * 0.08;
      const flat: Quad = [
        [pt.x - PW / 2, top],
        [pt.x + PW / 2, top],
        [pt.x + PW / 2, top + PH],
        [pt.x - PW / 2, top + PH],
      ];
      const hangQuad = rotateQuad(flat, [pt.x, pt.y], th.value);

      let q = hangQuad;
      let visible = true;
      let peg = 1;
      if (idx < i || (idx === i && local < 0.66)) {
        visible = false;
      } else if (idx === i && local < 1 && p < SEQ_END && H2S) {
        const f = easeInOutCubic(range(local, 0.66, 0.98));
        const trayQuad: Quad = [
          apply(H2S, PRINT_UV[0], PRINT_UV[1]),
          apply(H2S, PRINT_UV[2], PRINT_UV[1]),
          apply(H2S, PRINT_UV[2], PRINT_UV[3]),
          apply(H2S, PRINT_UV[0], PRINT_UV[3]),
        ];
        q = lerpQuad(trayQuad, hangQuad, f);
        const arc = Math.sin(f * Math.PI) * H * 0.08;
        q = q.map(([x, y]) => [x, y - arc]) as Quad;
        peg = clamp01((f - 0.8) / 0.2);
      }
      el.style.visibility = visible ? "visible" : "hidden";
      if (!visible) return;
      el.style.transform = `${quadToCssMatrix(q, PW, PH)}`;
      el.style.setProperty("--peg", String(peg));
      el.classList.toggle("is-hover", hover === i);
    });

    // Draw ropes.
    const canvas = ropeCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, W, H);
      for (const rope of rs) {
        const pts = rope.points;
        for (const pass of [0, 1]) {
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y + (pass ? 0 : 7));
          for (let k = 1; k < pts.length - 1; k++) {
            const mx = (pts[k].x + pts[k + 1].x) / 2;
            const my = (pts[k].y + pts[k + 1].y) / 2;
            ctx.quadraticCurveTo(pts[k].x, pts[k].y + (pass ? 0 : 7), mx, my + (pass ? 0 : 7));
          }
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y + (pass ? 0 : 7));
          ctx.strokeStyle = pass ? `rgba(236, 206, 160, ${0.6 + lights * 0.3})` : "rgba(0, 0, 0, 0.35)";
          ctx.lineWidth = pass ? 1.4 : 2;
          ctx.stroke();
        }
      }
    }

    if (wallRef.current) wallRef.current.style.filter = `brightness(${0.85 + lights * 0.75}) saturate(${1 - lights * 0.35})`;
    if (lightRef.current) lightRef.current.style.opacity = String(0.78 * (1 - lights));
    if (statusRef.current) statusRef.current.style.opacity = String(idx >= 0 && p < SEQ_END ? 1 : 0);
  });

  const cur = current >= 0 ? ALL_CERTS[current] : null;

  return (
    <div className="lab-runway" ref={runwayRef} style={{ height: "1000vh" }}>
      <section className="lab-stage dr-stage" ref={stageRef}>
        <img ref={wallRef} className="dr-wall" src={assetUrl("lab/darkroom/wall.webp")} alt="" />
        <canvas ref={ropeCanvasRef} className="dr-ropes" />

        <div className="dr-tray-wrap">
          <div className="dr-tray" ref={trayRef}>
            <img src={assetUrl("lab/darkroom/tray.webp")} alt="" />
            <div
              className="dr-liquid"
              ref={liquidRef}
              style={{
                left: `${LIQUID.left * 100}%`,
                top: `${LIQUID.top * 100}%`,
                width: `${LIQUID.width * 100}%`,
                height: `${LIQUID.height * 100}%`,
              }}
            >
              {[
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
              ].map(([x, y], k) => (
                <span key={k} ref={(el) => (markerRefs.current[k] = el)} className="dr-marker" style={{ left: `${x * 100}%`, top: `${y * 100}%` }} />
              ))}
            </div>
          </div>
        </div>

        {ALL_CERTS.map((cert, i) => (
          <button
            key={cert.id ?? cert.name}
            ref={(el) => (printRefs.current[i] = el)}
            className="dr-print"
            onPointerEnter={() => (hoverRef.current = i)}
            onPointerLeave={() => {
              if (hoverRef.current === i) hoverRef.current = -1;
            }}
            onClick={() => onInspect(cert)}
            aria-label={cert.name}
          >
            <span className="dr-photo">{cert.image && <img src={assetUrl(cert.image)} alt="" loading="lazy" />}</span>
            <img className="dr-peg" src={assetUrl("lab/darkroom/peg.webp")} alt="" />
          </button>
        ))}

        <div className="dr-safelight" ref={lightRef} />

        <div className="lab-stage-caption">
          <span className="eyebrow">Credentials · Darkroom</span>
          <h2>Developed, then hung to dry.</h2>
          <p>Stir the tray to ripple it. Pluck the lines and the prints swing.</p>
        </div>

        <div className="dr-status" ref={statusRef}>
          <span>
            Developing {String(current + 1).padStart(2, "0")} / {N}
          </span>
          <strong>{cur?.name}</strong>
          <em>{cur ? `${cur.issuer} · ${cur.date}` : ""}</em>
        </div>
      </section>
    </div>
  );
};

export default DarkroomDesign;
