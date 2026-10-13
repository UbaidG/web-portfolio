import React, { useLayoutEffect, useRef } from "react";
import Matter from "matter-js";
import type { DesignProps } from "../types";
import { ALL_CERTS, CERT_GROUPS, assetUrl, easeInOutCubic, groupKeyOf, hash01, lerp, range } from "../data";
import { useScrollProgressRef } from "../hooks/useStickyScrollProgress";
import { useFrame } from "../physics/useFrame";
import { usePointer } from "../physics/usePointer";
import "./chaos.css";

const { Engine, Bodies, Body, Composite, Constraint } = Matter;

const N = ALL_CERTS.length;
const DROP_START = 0.06;
const DROP_END = 0.42;
const ORDER_START = 0.56;
const ORDER_END = 0.8;
const DROP_DURATION = 0.42;
const LAYERS = 3;
const CURSOR_CAT = 0x0010;
const WALL_CAT = 0x0020;
const CARD_ASPECT = 695 / 900;

interface Card {
  body: Matter.Body | null;
  layer: number;
  dropAt: number;
  /** Time the card started falling, or -1 when it is off the desk. */
  fallStart: number;
  fx: number;
  fy: number;
  fa: number;
}

const ORDERED = CERT_GROUPS.flatMap((g) => g.certs);

const ChaosDesign: React.FC<DesignProps> = ({ onInspect, manualScrub }) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgressRef(runwayRef, manualScrub);
  const pointer = usePointer(stageRef);
  const inspectRef = useRef(onInspect);
  inspectRef.current = onInspect;

  const engine = useRef<Matter.Engine | null>(null);
  const cursor = useRef<Matter.Body | null>(null);
  const walls = useRef<Matter.Body[]>([]);
  const cards = useRef<Card[]>(
    ALL_CERTS.map((_, i) => ({
      body: null,
      layer: i % LAYERS,
      dropAt: DROP_START + ((DROP_END - DROP_START) * i) / N,
      fallStart: -1,
      fx: 0,
      fy: 0,
      fa: 0,
    })),
  );
  const drag = useRef<{ i: number; c: Matter.Constraint; x: number; y: number; t: number; moved: boolean } | null>(null);
  const hover = useRef(-1);
  const size = useRef({ W: 1, H: 1, CW: 140, CH: 108 });
  const targets = useRef<{ x: number; y: number }[]>([]);
  const lastOrder = useRef(0);
  const clock = useRef(0);

  const layout = () => {
    const stage = stageRef.current;
    const eng = engine.current;
    if (!stage || !eng) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const colGap = W * 0.025;
    const usable = Math.min(W * 0.9, 1500);
    const CW = Math.min(170, (usable - colGap * 3) / 8 - 12, (H - 240) / 4 / CARD_ASPECT - 14);
    const CH = CW * CARD_ASPECT;
    size.current = { W, H, CW, CH };

    const colW = CW * 2 + 12;
    const totalW = colW * 4 + colGap * 3;
    const x0 = (W - totalW) / 2;
    const y0 = Math.max(170, (H - (CH + 12) * 4) / 2 + 30);
    const tg: { x: number; y: number }[] = [];
    let gi = 0;
    CERT_GROUPS.forEach((g, col) => {
      const cx = x0 + col * (colW + colGap);
      const label = labelRefs.current[col];
      if (label) {
        label.style.left = `${cx}px`;
        label.style.top = `${y0 - 44}px`;
        label.style.width = `${colW}px`;
      }
      g.certs.forEach((_, k) => {
        tg[gi++] = { x: cx + (k % 2) * (CW + 12) + CW / 2, y: y0 + Math.floor(k / 2) * (CH + 12) + CH / 2 };
      });
    });
    targets.current = ALL_CERTS.map((c) => tg[ORDERED.indexOf(c)]);

    for (const el of cardRefs.current) {
      if (!el) continue;
      el.style.width = `${CW}px`;
      el.style.height = `${CH}px`;
    }

    Composite.remove(eng.world, walls.current);
    const t = 200;
    walls.current = [
      Bodies.rectangle(W / 2, -t / 2, W + t * 2, t, { isStatic: true }),
      Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, { isStatic: true }),
      Bodies.rectangle(-t / 2, H / 2, t, H + t * 2, { isStatic: true }),
      Bodies.rectangle(W + t / 2, H / 2, t, H + t * 2, { isStatic: true }),
    ];
    for (const w of walls.current) w.collisionFilter = { category: WALL_CAT, mask: 0xffff, group: 0 };
    Composite.add(eng.world, walls.current);

    for (const c of cards.current) {
      if (!c.body) continue;
      const { x, y } = c.body.position;
      Body.setPosition(c.body, { x: Math.min(W - 40, Math.max(40, x)), y: Math.min(H - 40, Math.max(40, y)) });
    }
  };

  useLayoutEffect(() => {
    const eng = Engine.create({ gravity: { x: 0, y: 0, scale: 0 }, positionIterations: 8, velocityIterations: 6 });
    engine.current = eng;
    const cur = Bodies.circle(-500, -500, 30, { frictionAir: 0, density: 0.05 });
    cur.collisionFilter = { category: CURSOR_CAT, mask: 0b111, group: 0 };
    Composite.add(eng.world, cur);
    cursor.current = cur;
    layout();
    window.addEventListener("resize", layout);

    const onUp = () => {
      const d = drag.current;
      if (!d) return;
      Composite.remove(eng.world, d.c);
      drag.current = null;
      if (!d.moved && performance.now() - d.t < 350) inspectRef.current(ALL_CERTS[d.i]);
    };
    window.addEventListener("pointerup", onUp);
    const cardList = cards.current;
    return () => {
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointerup", onUp);
      Composite.clear(eng.world, false);
      Engine.clear(eng);
      engine.current = null;
      for (const c of cardList) c.body = null;
    };
  }, []);

  const spawn = (i: number) => {
    const eng = engine.current;
    if (!eng) return;
    const c = cards.current[i];
    const { CW, CH } = size.current;
    const body = Bodies.rectangle(c.fx, c.fy, CW, CH, {
      angle: c.fa,
      frictionAir: 0.09,
      friction: 0.4,
      restitution: 0.25,
      density: 0.0012,
      chamfer: { radius: 6 },
    });
    body.collisionFilter = { category: 1 << c.layer, mask: (1 << c.layer) | CURSOR_CAT | WALL_CAT, group: 0 };
    Body.setVelocity(body, { x: (hash01(i * 7) - 0.5) * 6, y: (hash01(i * 11) - 0.5) * 6 });
    Body.setAngularVelocity(body, (hash01(i * 13) - 0.5) * 0.15);
    Composite.add(eng.world, body);
    c.body = body;

    // Landing thud nudges the cards already on the desk.
    for (const o of cards.current) {
      if (!o.body || o === c) continue;
      const dx = o.body.position.x - c.fx;
      const dy = o.body.position.y - c.fy;
      const d = Math.hypot(dx, dy);
      if (d < CW * 1.6 && d > 0) {
        const f = (1 - d / (CW * 1.6)) * 4;
        Body.setVelocity(o.body, { x: o.body.velocity.x + (dx / d) * f, y: o.body.velocity.y + (dy / d) * f });
        Body.setAngularVelocity(o.body, o.body.angularVelocity + (hash01(d) - 0.5) * 0.05);
      }
    }
  };

  useFrame((dt, time) => {
    const eng = engine.current;
    if (!eng) return;
    clock.current = time;
    const p = progress.current;
    const ptr = pointer.current;
    const { W, H, CW, CH } = size.current;
    const order = range(p, ORDER_START, ORDER_END);

    // Drops follow scroll in both directions.
    cards.current.forEach((c, i) => {
      if (p >= c.dropAt && c.fallStart < 0) {
        c.fallStart = time;
        const ang = hash01(i * 3.1) * Math.PI * 2;
        const rad = Math.sqrt(hash01(i * 5.7)) * Math.min(W, H) * 0.28;
        c.fx = W * 0.5 + Math.cos(ang) * rad * 1.4;
        c.fy = H * 0.56 + Math.sin(ang) * rad;
        c.fa = (hash01(i * 9.3) - 0.5) * 1.6;
      } else if (p < c.dropAt && c.fallStart >= 0) {
        c.fallStart = -1;
        if (c.body) Composite.remove(eng.world, c.body);
        c.body = null;
        if (drag.current?.i === i) {
          Composite.remove(eng.world, drag.current.c);
          drag.current = null;
        }
      }
      if (c.fallStart >= 0 && !c.body && time - c.fallStart >= DROP_DURATION) spawn(i);
    });

    // Leaving the grid scatters the pile a little so it feels alive again.
    if (lastOrder.current > 0.5 && order <= 0.001) {
      for (const c of cards.current) {
        if (!c.body) continue;
        Body.setVelocity(c.body, { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 });
        Body.setAngularVelocity(c.body, (Math.random() - 0.5) * 0.2);
      }
    }
    lastOrder.current = order;

    // Cursor is a heavy puck that shoves cards while the desk is in chaos.
    const cur = cursor.current;
    if (cur) {
      const active = ptr.inside && order < 0.3 && !drag.current;
      const nx = active ? ptr.x : -500;
      const ny = active ? ptr.y : -500;
      const step = Math.max(dt, 1 / 240) * 60;
      Body.setVelocity(cur, { x: (nx - cur.position.x) / step, y: (ny - cur.position.y) / step });
      Body.setPosition(cur, { x: nx, y: ny });
    }

    const d = drag.current;
    if (d) {
      d.c.pointA = { x: ptr.x, y: ptr.y };
      if (Math.hypot(ptr.x - d.x, ptr.y - d.y) > 5) d.moved = true;
    }

    const sub = Math.min(3, Math.max(1, Math.round(dt * 60)));
    for (let k = 0; k < sub; k++) Engine.update(eng, 1000 / 60);

    // Render: blend physics pose with grid target by the (staggered) order factor.
    cards.current.forEach((c, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      if (c.fallStart < 0) {
        el.style.visibility = "hidden";
        return;
      }
      el.style.visibility = "visible";
      let x: number;
      let y: number;
      let a: number;
      let lift = 0;
      if (c.body) {
        x = c.body.position.x;
        y = c.body.position.y;
        a = c.body.angle;
      } else {
        const f = Math.min(1, (time - c.fallStart) / DROP_DURATION);
        x = c.fx;
        y = c.fy - (1 - f) * 40;
        a = c.fa - (1 - f) * 0.6;
        lift = 1 - f * f;
      }
      const tg = targets.current[i];
      const rank = ORDERED.indexOf(ALL_CERTS[i]);
      const s = easeInOutCubic(range(order, (rank / N) * 0.45, (rank / N) * 0.45 + 0.55));
      if (s > 0 && tg) {
        const turns = Math.round(a / (Math.PI * 2)) * Math.PI * 2;
        x = lerp(x, tg.x, s);
        y = lerp(y, tg.y, s);
        a = lerp(a, turns, s);
        lift = Math.max(lift, Math.sin(s * Math.PI) * 0.35);
      }
      const dragging = drag.current?.i === i;
      const hov = hover.current === i;
      if (dragging) lift = Math.max(lift, 0.25);
      if (hov && !dragging) lift = Math.max(lift, order > 0.95 ? 0.12 : 0.06);
      const scale = 1 + lift * 0.9;
      el.style.transform = `translate3d(${x - CW / 2}px, ${y - CH / 2}px, 0) rotate(${a}rad) scale(${scale})`;
      el.style.zIndex = String(dragging ? 1000 : lift > 0.2 ? 900 : c.layer * 100 + i);
      el.style.setProperty("--lift", lift.toFixed(3));
      el.style.opacity = c.body ? "1" : String(Math.min(1, (time - c.fallStart) / 0.12));
    });

    labelRefs.current.forEach((el) => {
      if (el) el.style.opacity = String(range(order, 0.6, 1));
    });
    const hint = order > 0.5 ? "Sorted by category. Click any card to open it." : "Shove the pile with your cursor. Grab a card and throw it.";
    if (hintRef.current && hintRef.current.textContent !== hint) hintRef.current.textContent = hint;
  });

  const startDrag = (i: number, e: React.PointerEvent) => {
    const eng = engine.current;
    const c = cards.current[i];
    if (!eng || !c.body || progress.current >= ORDER_START + 0.04) {
      onInspect(ALL_CERTS[i]);
      return;
    }
    const stage = stageRef.current!.getBoundingClientRect();
    const x = e.clientX - stage.left;
    const y = e.clientY - stage.top;
    const b = c.body;
    const constraint = Constraint.create({
      pointA: { x, y },
      bodyB: b,
      pointB: { x: x - b.position.x, y: y - b.position.y },
      stiffness: 0.12,
      damping: 0.08,
      length: 0,
    });
    Composite.add(eng.world, constraint);
    drag.current = { i, c: constraint, x, y, t: performance.now(), moved: false };
  };

  return (
    <div className="lab-runway" ref={runwayRef} style={{ height: "620vh" }}>
      <section className="lab-stage ch-stage" ref={stageRef}>
        <img className="ch-desk" src={assetUrl("lab/desk/desk.webp")} alt="" />

        {CERT_GROUPS.map((g, k) => (
          <div key={g.key} className="ch-label" ref={(el) => (labelRefs.current[k] = el)}>
            <span>{String(k + 1).padStart(2, "0")}</span>
            {g.label}
            <em>{g.certs.length}</em>
          </div>
        ))}

        {ALL_CERTS.map((cert, i) => (
          <button
            key={cert.id ?? cert.name}
            ref={(el) => (cardRefs.current[i] = el)}
            className={`ch-card ch-card--${groupKeyOf(cert)}`}
            onPointerDown={(e) => {
              e.preventDefault();
              startDrag(i, e);
            }}
            onPointerEnter={() => (hover.current = i)}
            onPointerLeave={() => {
              if (hover.current === i) hover.current = -1;
            }}
            aria-label={cert.name}
          >
            <span className="ch-face">{cert.image && <img src={assetUrl(cert.image)} alt="" draggable={false} />}</span>
            <span className="ch-name">{cert.name}</span>
          </button>
        ))}

        <div className="ch-lamp" />

        <div className="lab-stage-caption">
          <span className="eyebrow">Credentials · Desk</span>
          <h2>Chaos, then order.</h2>
          <p ref={hintRef}>Shove the pile with your cursor. Grab a card and throw it.</p>
        </div>
      </section>
    </div>
  );
};

export default ChaosDesign;
