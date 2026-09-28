import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/useMotionPreference";

const ANCHORS = {
  about: "#about",
  approach: "#approach",
  footer: "#contact",
} as const;

type Anchor = keyof typeof ANCHORS;

/**
 * x: fraction of the viewport width (values outside 0..1 sit off-screen).
 * y: fraction of the anchor section's height.
 * dx/dy: pixel offsets at DESIGN_WIDTH, scaled down on narrower screens.
 */
interface PathPoint {
  at: Anchor;
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  desktopOnly?: boolean;
}

interface LinePiece {
  id: string;
  colors: [tail: string, head: string];
  points: PathPoint[];
}

const DESIGN_WIDTH = 1440;
const COMPACT_BREAKPOINT = 768;
// Where the drawing head sits, as a fraction of viewport height from the top.
const HEAD_VIEWPORT_RATIO = 0.6;
// Minimum relative pacing weight per pixel of line, so loops and upward
// strokes draw at a readable pace instead of appearing all at once. Pacing is
// rescaled per piece so the head never drifts off-screen.
const MIN_PACING_PER_LINE_PX = 0.45;
const SAMPLES_PER_SEGMENT = 40;
// Fraction of a piece's length that stays the solid tail color before the
// gradient toward the head color begins.
const GRADIENT_START = 0.5;

function loop(
  at: Anchor,
  x: number,
  y: number,
  radius: number,
  startDeg: number,
  clockwise = true
): PathPoint[] {
  const dir = clockwise ? 1 : -1;
  return [0, 45, 90, 135, 180, 225, 270, 315, 360].map((step) => {
    const rad = ((startDeg + dir * step) * Math.PI) / 180;
    return {
      at,
      x,
      y,
      dx: Math.cos(rad) * radius,
      dy: Math.sin(rad) * radius,
      desktopOnly: true,
    };
  });
}

const PIECES: LinePiece[] = [
  {
    id: "about",
    colors: ["#c4521c", "#f59c5f"],
    points: [
      { at: "about", x: 1.05, y: 0.05 },
      { at: "about", x: 0.9, y: 0.12 },
      { at: "about", x: 0.84, y: 0.3 },
      ...loop("about", 0.88, 0.45, 100, 180, false),
      { at: "about", x: 0.7, y: 0.82 },
      { at: "about", x: 0.35, y: 0.9 },
      { at: "about", x: 0.1, y: 0.86 },
      { at: "about", x: -0.06, y: 0.94 },
    ],
  },
  {
    id: "approach",
    colors: ["#1d3d2e", "#5f9c7a"],
    points: [
      { at: "approach", x: 1.05, y: 0.02 },
      { at: "approach", x: 0.9, y: 0.06 },
      ...loop("approach", 0.86, 0.13, 70, -90, false),
      { at: "approach", x: 0.93, y: 0.3 },
      { at: "approach", x: 0.95, y: 0.5 },
      { at: "approach", x: 0.9, y: 0.84 },
      { at: "approach", x: 0.65, y: 0.92 },
      { at: "approach", x: 0.4, y: 0.87 },
      ...loop("approach", 0.22, 0.89, 60, 90),
      { at: "approach", x: 0.06, y: 0.93 },
      { at: "approach", x: -0.06, y: 0.96 },
    ],
  },
];

interface Vec {
  x: number;
  y: number;
}

interface SegmentGeometry {
  d: string;
  start: number;
  length: number;
  from: Vec;
  to: Vec;
  fromColor: string;
  toColor: string;
}

interface PieceGeometry {
  id: string;
  startY: number;
  segments: SegmentGeometry[];
  lengths: Float32Array;
  scrollCost: Float32Array;
}

interface Geometry {
  /** Document y of the line layer's top edge. */
  pageTop: number;
  height: number;
  strokeWidth: number;
  pieces: PieceGeometry[];
}

const fmt = (n: number) => n.toFixed(1);

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const va = (pa >> shift) & 255;
    const vb = (pb >> shift) & 255;
    return Math.round(va + (vb - va) * t);
  };
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

function cubicAt(p1: Vec, c1: Vec, c2: Vec, p2: Vec, t: number): Vec {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p1.x + b * c1.x + c * c2.x + d * p2.x,
    y: a * p1.y + b * c1.y + c * c2.y + d * p2.y,
  };
}

/** Centripetal Catmull-Rom control points for the segment p1 -> p2. */
function controlPoints(p0: Vec, p1: Vec, p2: Vec, p3: Vec): [Vec, Vec] {
  const d1 = Math.max(Math.hypot(p1.x - p0.x, p1.y - p0.y), 1e-3);
  const d2 = Math.max(Math.hypot(p2.x - p1.x, p2.y - p1.y), 1e-3);
  const d3 = Math.max(Math.hypot(p3.x - p2.x, p3.y - p2.y), 1e-3);
  const a1 = Math.sqrt(d1);
  const a2 = Math.sqrt(d2);
  const a3 = Math.sqrt(d3);

  const k1 = 3 * a1 * (a1 + a2);
  const k2 = 3 * a3 * (a3 + a2);
  const c1 = {
    x: (d1 * p2.x - d2 * p0.x + (2 * d1 + 3 * a1 * a2 + d2) * p1.x) / k1,
    y: (d1 * p2.y - d2 * p0.y + (2 * d1 + 3 * a1 * a2 + d2) * p1.y) / k1,
  };
  const c2 = {
    x: (d3 * p1.x - d2 * p3.x + (2 * d3 + 3 * a3 * a2 + d2) * p2.x) / k2,
    y: (d3 * p1.y - d2 * p3.y + (2 * d3 + 3 * a3 * a2 + d2) * p2.y) / k2,
  };
  return [c1, c2];
}

function buildPiece(piece: LinePiece, pts: Vec[]): PieceGeometry {
  const mirror = (a: Vec, b: Vec): Vec => ({ x: 2 * a.x - b.x, y: 2 * a.y - b.y });
  const lengths = [0];
  const scrollCost = [0];
  const raw: Omit<SegmentGeometry, "fromColor" | "toColor">[] = [];
  let total = 0;
  let cost = 0;
  let maxY = pts[0].y;

  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p0 = i > 0 ? pts[i - 1] : mirror(p1, p2);
    const p3 = i + 2 < pts.length ? pts[i + 2] : mirror(p2, p1);
    const [c1, c2] = controlPoints(p0, p1, p2, p3);

    const start = total;
    let prev = p1;
    for (let s = 1; s <= SAMPLES_PER_SEGMENT; s++) {
      const q = cubicAt(p1, c1, c2, p2, s / SAMPLES_PER_SEGMENT);
      const ds = Math.hypot(q.x - prev.x, q.y - prev.y);
      total += ds;
      cost += Math.max(q.y - prev.y, ds * MIN_PACING_PER_LINE_PX);
      maxY = Math.max(maxY, q.y);
      lengths.push(total);
      scrollCost.push(cost);
      prev = q;
    }

    raw.push({
      d: `M${fmt(p1.x)} ${fmt(p1.y)}C${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(p2.x)} ${fmt(p2.y)}`,
      start,
      length: Math.max(total - start, 1e-3),
      from: p1,
      to: p2,
    });
  }

  // The piece finishes drawing when the head target reaches its lowest point.
  const pace = cost > 0 ? (maxY - pts[0].y) / cost : 1;
  const [tail, head] = piece.colors;
  const colorAt = (length: number) =>
    mixHex(tail, head, Math.max(0, (length / total - GRADIENT_START) / (1 - GRADIENT_START)));
  return {
    id: piece.id,
    startY: pts[0].y,
    segments: raw.map((seg) => ({
      ...seg,
      fromColor: colorAt(seg.start),
      toColor: colorAt(seg.start + seg.length),
    })),
    lengths: Float32Array.from(lengths),
    scrollCost: Float32Array.from(scrollCost, (c) => c * pace),
  };
}

function measure(root: HTMLElement): Geometry | null {
  const rootTop = root.getBoundingClientRect().top;
  const width = root.clientWidth;
  const compact = width < COMPACT_BREAKPOINT;
  const unit = Math.min(1, width / DESIGN_WIDTH);

  const rects = new Map<Anchor, { top: number; height: number }>();
  for (const key of Object.keys(ANCHORS) as Anchor[]) {
    const el = root.querySelector(ANCHORS[key]);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    rects.set(key, { top: r.top - rootTop, height: r.height });
  }

  const footer = rects.get("footer");
  if (!footer) return null;

  const pieces: PieceGeometry[] = [];
  for (const piece of PIECES) {
    const pts: Vec[] = [];
    for (const p of piece.points) {
      if (compact && p.desktopOnly) continue;
      const rect = rects.get(p.at);
      if (!rect) continue;
      pts.push({
        x: p.x * width + (p.dx ?? 0) * unit,
        y: rect.top + p.y * rect.height + (p.dy ?? 0) * unit,
      });
    }
    if (pts.length > 1) pieces.push(buildPiece(piece, pts));
  }

  return {
    pageTop: rootTop + window.scrollY,
    height: footer.top,
    strokeWidth: Math.min(20, Math.max(8, width * 0.0135)),
    pieces,
  };
}

function drawnLength(piece: PieceGeometry, progress: number): number {
  const { lengths, scrollCost } = piece;
  const last = scrollCost.length - 1;
  if (progress <= 0) return 0;
  if (progress >= scrollCost[last]) return lengths[last];

  let lo = 0;
  let hi = last;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (scrollCost[mid] <= progress) lo = mid;
    else hi = mid;
  }
  const t = (progress - scrollCost[lo]) / (scrollCost[hi] - scrollCost[lo]);
  return lengths[lo] + (lengths[hi] - lengths[lo]) * t;
}

export function ScrollCompanionLine() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[][]>([]);
  const shownRef = useRef<number[][]>([]);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const gradientPrefix = useId().replace(/:/g, "");

  useEffect(() => {
    const root = wrapperRef.current?.parentElement;
    if (!root) return;

    let frame = 0;
    const rebuild = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setGeometry(measure(root)));
    };

    const observer = new ResizeObserver(rebuild);
    observer.observe(root);
    rebuild();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!geometry) return;

    shownRef.current = geometry.pieces.map((p) => p.segments.map(() => -1));

    const update = () => {
      const head =
        window.scrollY - geometry.pageTop + HEAD_VIEWPORT_RATIO * window.innerHeight;

      geometry.pieces.forEach((piece, pi) => {
        const drawn = reducedMotion
          ? Infinity
          : drawnLength(piece, head - piece.startY);

        piece.segments.forEach((seg, si) => {
          const shown = Math.min(1, Math.max(0, (drawn - seg.start) / seg.length));
          if (shownRef.current[pi][si] === shown) return;
          shownRef.current[pi][si] = shown;

          const el = pathRefs.current[pi]?.[si];
          if (!el) return;
          el.style.visibility = shown > 0 ? "visible" : "hidden";
          el.style.strokeDashoffset = String(1 - shown);
        });
      });
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geometry, reducedMotion]);

  return (
    <div
      className="scroll-companion"
      ref={wrapperRef}
      style={{ height: geometry?.height ?? 0 }}
      aria-hidden="true"
    >
      {geometry && (
        <svg className="scroll-companion__svg">
          <defs>
            {geometry.pieces.map((piece) =>
              piece.segments.map((seg, si) => (
                <linearGradient
                  key={`${piece.id}-${si}`}
                  id={`${gradientPrefix}-${piece.id}-${si}`}
                  gradientUnits="userSpaceOnUse"
                  x1={seg.from.x}
                  y1={seg.from.y}
                  x2={seg.to.x}
                  y2={seg.to.y}
                >
                  <stop offset="0" stopColor={seg.fromColor} />
                  <stop offset="1" stopColor={seg.toColor} />
                </linearGradient>
              ))
            )}
          </defs>
          {geometry.pieces.map((piece, pi) => (
            <g key={piece.id}>
              {piece.segments.map((seg, si) => (
                <path
                  key={si}
                  ref={(el) => {
                    (pathRefs.current[pi] ??= [])[si] = el;
                  }}
                  d={seg.d}
                  pathLength={1}
                  fill="none"
                  stroke={`url(#${gradientPrefix}-${piece.id}-${si})`}
                  strokeWidth={geometry.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray="1 2"
                  style={{ visibility: "hidden", strokeDashoffset: 1 }}
                />
              ))}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
