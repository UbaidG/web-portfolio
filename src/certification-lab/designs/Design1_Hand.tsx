import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DesignProps } from "../types";
import { ALL_CERTS, assetUrl, easeInOutCubic, easeOutCubic, hash01, lerp, range } from "../data";
import { useScrollProgressRef } from "../hooks/useStickyScrollProgress";
import { useFrame } from "../physics/useFrame";
import { usePointer } from "../physics/usePointer";
import { Spring } from "../physics/spring";
import { ChromaCardRenderer, prepareCertTexture } from "./hand/ChromaCardRenderer";
import {
  lerpQuad,
  quadCenter,
  quadToCssMatrix,
  rectQuad,
  rotateQuad,
  transformQuad,
  type Quad,
  type Vec2,
} from "./hand/homography";
import "./hand.css";

interface HandManifest {
  width: number;
  height: number;
  background: [number, number, number];
  frames: { src: string; corners: Quad; occluder?: string }[];
}

const CARD_W = 320;
const ENTER_END = 0.06;
const DEAL_START = 0.07;
const DEAL_END = 0.88;
const GRID_START = 0.9;
const GRID_END = 0.97;
/** Phases inside one card's deal window. */
const PUSH_END = 0.4;
const HOLD_END = 0.48;
const REWIND_END = 0.8;

const FIRST_SLOW = 4;
const SLOW_WEIGHT = 2.6;

function dealWindows(count: number) {
  const weights = Array.from({ length: count }, (_, i) => (i < FIRST_SLOW ? SLOW_WEIGHT : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  return weights.map((w) => {
    const start = DEAL_START + (acc / total) * (DEAL_END - DEAL_START);
    acc += w;
    return [start, DEAL_START + (acc / total) * (DEAL_END - DEAL_START)] as const;
  });
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

interface CardPhysics {
  ox: Spring;
  oy: Spring;
  rot: Spring;
}

const HandDesign: React.FC<DesignProps> = ({ onInspect, manualScrub }) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const occluderRef = useRef<HTMLImageElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progress = useScrollProgressRef(runwayRef, manualScrub);
  const pointer = usePointer(stageRef);

  const [manifest, setManifest] = useState<HandManifest | null>(null);
  const [presenting, setPresenting] = useState(-1);
  const [dealtCount, setDealtCount] = useState(0);

  const windows = useMemo(() => dealWindows(ALL_CERTS.length), []);
  const renderer = useRef<ChromaCardRenderer | null>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const certTextures = useRef<(HTMLCanvasElement | null)[]>([]);
  const rig = useRef({ rot: new Spring(0, { stiffness: 60, damping: 9 }), tx: new Spring(0, { stiffness: 50, damping: 10 }), ty: new Spring(0, { stiffness: 50, damping: 10 }) });
  const physics = useRef<CardPhysics[]>(
    ALL_CERTS.map(() => ({
      ox: new Spring(0, { stiffness: 120, damping: 11 }),
      oy: new Spring(0, { stiffness: 120, damping: 11 }),
      rot: new Spring(0, { stiffness: 90, damping: 9 }),
    }))
  );
  const drag = useRef<{
    index: number;
    startX: number;
    startY: number;
    downX: number;
    downY: number;
    moved: boolean;
  } | null>(null);
  const lastPresenting = useRef(-1);
  const lastDealt = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(assetUrl("lab/hand/frames.json"));
      const m: HandManifest = await res.json();
      const imgs = await Promise.all(m.frames.map((f) => loadImage(assetUrl(`lab/hand/${f.src}`))));
      if (cancelled) return;
      frames.current = imgs;
      setManifest(m);
    })();
    ALL_CERTS.forEach((cert, i) => {
      if (!cert.image) return;
      loadImage(assetUrl(cert.image)).then((img) => {
        certTextures.current[i] = prepareCertTexture(img);
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!manifest || !canvasRef.current) return;
    const r = new ChromaCardRenderer(canvasRef.current, manifest.width, manifest.height);
    const probe = document.createElement("canvas");
    probe.width = manifest.width;
    probe.height = manifest.height;
    const ctx = probe.getContext("2d")!;
    ctx.drawImage(frames.current[0], 0, 0);
    const [cx, cy] = quadCenter(manifest.frames[0].corners);
    const px = ctx.getImageData(Math.round(cx), Math.round(cy) - 30, 1, 1).data;
    r.greenRef = px[1] / 255;
    renderer.current = r;
    return () => {
      r.dispose();
      renderer.current = null;
    };
  }, [manifest]);

  useFrame((dt, time) => {
    const m = manifest;
    const stage = stageRef.current;
    const r = renderer.current;
    if (!m || !stage || !r) return;

    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = reduce ? 1 : progress.current;
    const ptr = pointer.current;
    const N = m.frames.length;
    const videoMode = N > 1;

    // Image space -> stage space. The card should be ~30% of the stage height.
    const base = m.frames[0].corners;
    const cardHImg = Math.hypot(base[3][0] - base[0][0], base[3][1] - base[0][1]);
    const cardWImg = Math.hypot(base[1][0] - base[0][0], base[1][1] - base[0][1]);
    const cardAspect = cardWImg / cardHImg;
    const s = (0.3 * H) / cardHImg;
    const ox = W / 2 - quadCenter(base)[0] * s;
    const oy = H - m.height * s;

    const enter = easeOutCubic(range(p, 0, ENTER_END));
    const exit = easeInOutCubic(range(p, GRID_START, GRID_END));
    const { rot, tx, ty } = rig.current;
    rot.target = ptr.inside ? ptr.nx * 0.045 + Math.max(-0.04, Math.min(0.04, ptr.vx * 0.00002)) : 0;
    tx.target = ptr.inside ? ptr.nx * 16 : 0;
    ty.target = ptr.inside ? ptr.ny * 10 : 0;
    rot.step(dt);
    tx.step(dt);
    ty.step(dt);
    const breathe = Math.sin(time * 1.1) * 0.006;
    const angle = rot.value + breathe;
    const pivot: Vec2 = [W / 2, H + 40];
    const transY = ty.value + Math.sin(time * 1.3) * 3 + (1 - enter) * H * 0.9 + exit * H * 1.15;
    const cos = Math.cos(angle) * s;
    const sin = Math.sin(angle) * s;
    const e0 = ox - pivot[0];
    const f0 = oy - pivot[1];
    const e = (Math.cos(angle) * e0 - Math.sin(angle) * f0) + pivot[0] + tx.value;
    const f = (Math.sin(angle) * e0 + Math.cos(angle) * f0) + pivot[1] + transY;
    const rigMatrix = `matrix(${cos},${sin},${-sin},${cos},${e},${f})`;
    const toStage = (q: Quad) => transformQuad(q, ([x, y]) => [cos * x - sin * y + e, sin * x + cos * y + f]);

    canvasRef.current!.style.transform = rigMatrix;
    if (occluderRef.current) occluderRef.current.style.transform = rigMatrix;

    // Spread layout: alternate left/right piles, then a centred grid at the end.
    const zoneW = W * 0.25;
    const spreadW = Math.min(zoneW / 2 - 10, 200);
    const spreadH = spreadW / cardAspect;
    const cols = Math.ceil(ALL_CERTS.length / 3);
    const gridW = Math.min((W * 0.9 - (cols - 1) * 14) / cols, 200);
    const gridH = gridW / cardAspect;
    const gridRows = Math.ceil(ALL_CERTS.length / cols);
    const gridTop = H * 0.56 - (gridRows * (gridH + 14)) / 2;

    let shaderCert = ALL_CERTS.length;
    let shaderFrame = 0;
    let presentingNow = -1;
    let dealt = 0;

    ALL_CERTS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const [ws, we] = windows[i];
      const t = range(p, ws, we);
      const visibleFrom = videoMode ? PUSH_END : 0;
      const visible = t > visibleFrom || p >= GRID_START;
      if (!visible && shaderCert === ALL_CERTS.length) shaderCert = i;

      if (t > 0 && t < 1) {
        if (videoMode) {
          if (t < PUSH_END) shaderFrame = Math.round(easeInOutCubic(t / PUSH_END) * (N - 1));
          else if (t < HOLD_END) shaderFrame = N - 1;
          else if (t < REWIND_END) shaderFrame = Math.round((1 - easeInOutCubic(range(t, HOLD_END, REWIND_END))) * (N - 1));
        }
        if (t < HOLD_END + 0.1) presentingNow = i;
      }
      if (t >= 1) dealt++;

      if (!visible) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        return;
      }

      // In-hand quad (image space) after the thumb push.
      const lastCorners = m.frames[N - 1].corners;
      let handQuad: Quad;
      if (videoMode) {
        handQuad = lastCorners;
      } else {
        const push = easeInOutCubic(range(t, 0, PUSH_END));
        const bottomMid: Vec2 = [(base[2][0] + base[3][0]) / 2, (base[2][1] + base[3][1]) / 2];
        const up: Vec2 = [(base[0][0] - base[3][0]) / cardHImg, (base[0][1] - base[3][1]) / cardHImg];
        const lift = push * cardHImg * 0.42;
        handQuad = rotateQuad(base, bottomMid, -0.09 * push, up[0] * lift, up[1] * lift);
      }
      const handStage = toStage(handQuad);

      const side = i % 2 === 0 ? -1 : 1;
      const k = Math.floor(i / 2);
      const col = k % 2;
      const row = Math.floor(k / 2);
      const zoneX = side < 0 ? W * 0.035 : W * 0.965 - zoneW;
      const sx = zoneX + spreadW / 2 + col * (zoneW - spreadW) + (hash01(i) - 0.5) * 18;
      const sy = H * 0.24 + spreadH / 2 + row * ((H * 0.7 - spreadH) / 6) + (hash01(i + 40) - 0.5) * 14;
      const sRot = (hash01(i + 90) - 0.5) * 0.14;

      const gc = i % cols;
      const gr = Math.floor(i / cols);
      const gx = W / 2 + (gc - (cols - 1) / 2) * (gridW + 14);
      const gy = gridTop + gridH / 2 + gr * (gridH + 14);

      const g = exit;
      const ph = physics.current[i];
      const slot = rectQuad(
        lerp(sx, gx, g) + ph.ox.value,
        lerp(sy, gy, g) + ph.oy.value,
        lerp(spreadW, gridW, g),
        lerp(spreadH, gridH, g),
        lerp(sRot, 0, g) + ph.rot.value
      );

      const fly = easeOutCubic(range(t, HOLD_END, 1));
      let quad: Quad;
      if (p >= GRID_START || fly >= 1) {
        quad = slot;
      } else {
        quad = lerpQuad(handStage, slot, fly);
        const arc = Math.sin(Math.PI * fly);
        quad = rotateQuad(quad, quadCenter(quad), arc * side * 0.5, 0, -arc * H * 0.12);
      }

      // Pointer physics on landed cards: repel from the cursor, drag and throw.
      if (fly >= 1 || p >= GRID_START) {
        const d = drag.current;
        if (d && d.index === i) {
          ph.ox.target = ptr.x - d.startX;
          ph.oy.target = ptr.y - d.startY;
          ph.rot.target = Math.max(-0.5, Math.min(0.5, ptr.vx * 0.0004));
        } else if (ptr.inside) {
          const [cx, cy] = quadCenter(slot);
          const dx = cx - ph.ox.value - ptr.x;
          const dy = cy - ph.oy.value - ptr.y;
          const dist = Math.hypot(dx, dy);
          const R = 150;
          const fall = dist < R ? Math.pow(1 - dist / R, 2) : 0;
          ph.ox.target = dist > 0 ? (dx / dist) * fall * 70 : 0;
          ph.oy.target = dist > 0 ? (dy / dist) * fall * 70 : 0;
          ph.rot.target = dist > 0 ? (dx / dist) * fall * 0.25 : 0;
        } else {
          ph.ox.target = 0;
          ph.oy.target = 0;
          ph.rot.target = 0;
        }
      }
      ph.ox.step(dt);
      ph.oy.step(dt);
      ph.rot.step(dt);

      const inHand = t < HOLD_END + 0.06 && p < GRID_START;
      el.style.opacity = "1";
      el.style.pointerEvents = fly >= 1 || p >= GRID_START ? "auto" : "none";
      el.style.zIndex = drag.current?.index === i ? "300" : inHand ? "2" : String(10 + i);
      el.style.transform = quadToCssMatrix(quad, CARD_W, CARD_W / cardAspect);
      el.style.width = `${CARD_W}px`;
      el.style.height = `${CARD_W / cardAspect}px`;
      el.style.padding = `${(CARD_W / cardAspect) * 0.07}px`;
    });

    const tex = shaderCert < ALL_CERTS.length ? certTextures.current[shaderCert] ?? null : null;
    r.setCert(tex);
    r.setFrame(frames.current[shaderFrame]);
    r.setQuad(m.frames[shaderFrame].corners);
    r.draw();

    if (occluderRef.current) {
      const showOcc = videoMode ? presentingNow >= 0 && shaderFrame === N - 1 : true;
      occluderRef.current.style.opacity = showOcc ? "1" : "0";
    }
    if (presentingNow !== lastPresenting.current) {
      lastPresenting.current = presentingNow;
      setPresenting(presentingNow);
    }
    if (dealt !== lastDealt.current) {
      lastDealt.current = dealt;
      setDealtCount(dealt);
    }
  });

  useEffect(() => {
    const onUp = () => {
      const d = drag.current;
      if (!d) return;
      const ph = physics.current[d.index];
      ph.ox.target = 0;
      ph.oy.target = 0;
      ph.rot.target = 0;
      ph.ox.velocity += pointer.current.vx * 0.9;
      ph.oy.velocity += pointer.current.vy * 0.9;
      ph.rot.velocity += pointer.current.vx * 0.004;
      if (!d.moved) onInspect(ALL_CERTS[d.index]);
      drag.current = null;
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [onInspect, pointer]);

  const bg = manifest ? `rgb(${manifest.background.join(",")})` : "#19120e";
  const occluderSrc = manifest?.frames.find((f) => f.occluder)
    ? assetUrl(`lab/hand/${(manifest.frames.length > 1 ? manifest.frames[manifest.frames.length - 1] : manifest.frames[0]).occluder}`)
    : undefined;
  const current = presenting >= 0 ? ALL_CERTS[presenting] : null;

  return (
    <div className="lab-runway" ref={runwayRef} style={{ height: "800vh" }}>
      <section className="lab-stage hand-stage" ref={stageRef} style={{ background: bg }}>
        <div className="lab-stage-caption">
          <span className="eyebrow">Credentials</span>
          <h2>Dealt, one by one.</h2>
          <p>Every certificate I've earned, straight off the deck.</p>
        </div>

        {manifest && (
          <>
            <canvas
              ref={canvasRef}
              className="hand-canvas"
              style={{ width: manifest.width, height: manifest.height }}
            />
            {occluderSrc && (
              <img
                ref={occluderRef}
                className="hand-occluder"
                src={occluderSrc}
                alt=""
                style={{ width: manifest.width, height: manifest.height }}
              />
            )}
          </>
        )}

        {ALL_CERTS.map((cert, i) => (
          <button
            key={cert.id ?? cert.name}
            ref={(el) => (cardRefs.current[i] = el)}
            className="hand-card cert-face"
            aria-label={`Inspect ${cert.name}`}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
              const ph = physics.current[i];
              drag.current = {
                index: i,
                startX: pointer.current.x - ph.ox.value,
                startY: pointer.current.y - ph.oy.value,
                downX: pointer.current.x,
                downY: pointer.current.y,
                moved: false,
              };
            }}
            onPointerMove={() => {
              const d = drag.current;
              if (d && d.index === i && Math.hypot(pointer.current.x - d.downX, pointer.current.y - d.downY) > 6) {
                d.moved = true;
              }
            }}
          >
            {cert.image && <img src={assetUrl(cert.image)} alt="" draggable={false} />}
          </button>
        ))}

        <div className={`hand-presenting ${current ? "is-on" : ""}`} aria-live="polite">
          {current && (
            <>
              <span className="hand-presenting-issuer">
                {current.issuer} · {current.date}
              </span>
              <strong>{current.name}</strong>
            </>
          )}
        </div>

        <div className="hand-counter">
          <span>{String(dealtCount).padStart(2, "0")}</span> / {ALL_CERTS.length} dealt
        </div>
      </section>
    </div>
  );
};

export default HandDesign;
