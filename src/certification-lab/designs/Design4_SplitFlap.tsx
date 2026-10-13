import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DesignProps } from "../types";
import type { CertificationItem } from "../../data/portfolioData";
import { CERT_GROUPS, assetUrl, range } from "../data";
import { useScrollProgressRef } from "../hooks/useStickyScrollProgress";
import { useFrame } from "../physics/useFrame";
import { usePointer } from "../physics/usePointer";
import { Spring } from "../physics/spring";
import { FlapCell } from "./splitflap/FlapCell";
import "./splitflap.css";

const COLS = [
  { key: "code", label: "Flight", n: 4 },
  { key: "name", label: "Credential", n: 22 },
  { key: "issuer", label: "Issuer", n: 9 },
  { key: "date", label: "Issued", n: 6 },
  { key: "status", label: "Status", n: 8 },
] as const;
const ROWS = Math.max(...CERT_GROUPS.map((g) => g.certs.length));
const BANNER_N = 30;
const BOARD_START = 0.05;
const GROUP_PREFIX: Record<string, string> = { ai: "AI", cloud: "CL", pm: "PM", foundations: "FD" };
const ISSUER_SHORT: Record<string, string> = {
  "Univ. of Michigan": "UMICHIGAN",
  "University of Michigan": "UMICHIGAN",
  "LinkedIn Learning": "LINKEDIN",
  "Exposys Data Labs": "EXPOSYS",
};
const ABBREV: [RegExp, string][] = [
  [/\bINTRODUCTION\b/g, "INTRO"],
  [/\bMACHINE LEARNING\b/g, "ML"],
  [/\bMANAGEMENT\b/g, "MGMT"],
  [/\bPROFESSIONAL\b/g, "PRO"],
  [/\bCERTIFICATE\b/g, "CERT"],
  [/\bORGANIZATION\b/g, "ORG"],
  [/\bTERMINOLOGY\b/g, "TERMS"],
  [/\bDECISION MAKERS\b/g, "LEADERS"],
  [/\bENGINEER\b/g, "ENG"],
];

const fit = (s: string, n: number) => {
  let t = s.toUpperCase().replace(/[^A-Z0-9&/\-.:' ]/g, " ").replace(/\s+/g, " ").trim();
  for (const [re, r] of ABBREV) if (t.length > n) t = t.replace(re, r);
  if (t.length <= n) return t.padEnd(n, " ");
  const words = t.split(" ");
  let out = "";
  for (const w of words) {
    if ((out ? out.length + 1 : 0) + w.length > n) break;
    out = out ? `${out} ${w}` : w;
  }
  return (out || t.slice(0, n)).padEnd(n, " ");
};

const shortDate = (d: string) => {
  const m = d.toUpperCase().match(/([A-Z]{3})[A-Z]*\s+\d{2}(\d{2})/);
  return m ? `${m[1]} ${m[2]}` : d.toUpperCase();
};

const rowText = (cert: CertificationItem | undefined, groupKey: string, i: number) => {
  if (!cert) return COLS.map((c) => " ".repeat(c.n));
  return [
    `${GROUP_PREFIX[groupKey]}${String(i + 1).padStart(2, "0")}`,
    fit(cert.name, 22),
    fit(ISSUER_SHORT[cert.issuer] ?? cert.issuer.split(" ")[0], 9),
    fit(shortDate(cert.date), 6),
    fit("VERIFIED", 8),
  ];
};

const bannerText = (g: number) =>
  fit(g < 0 ? "CREDENTIALS  DEPARTURES" : `GATE ${g + 1}  ${CERT_GROUPS[g].label}`, BANNER_N);

const Flap: React.FC<{ r: number; c: number }> = ({ r, c }) => (
  <span className="sf-cell" data-r={r} data-c={c}>
    <span className="sf-h sf-h-top">
      <span className="sf-ch"> </span>
    </span>
    <span className="sf-h sf-h-bot">
      <span className="sf-ch"> </span>
    </span>
    <span className="sf-f sf-f-top">
      <span className="sf-ch"> </span>
    </span>
    <span className="sf-f sf-f-bot">
      <span className="sf-ch"> </span>
    </span>
  </span>
);

interface CellRec {
  cell: FlapCell;
  r: number;
  cx: number;
  cy: number;
}

const SplitFlapDesign: React.FC<DesignProps> = ({ onInspect, manualScrub }) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const progress = useScrollProgressRef(runwayRef, manualScrub);
  const pointer = usePointer(stageRef);

  const [group, setGroup] = useState(-1);
  const groupRef = useRef(-1);
  const [hoverRow, setHoverRow] = useState(-1);
  const hoverRowRef = useRef(-1);
  hoverRowRef.current = hoverRow;

  const cells = useRef<CellRec[]>([]);
  const rows = useRef<FlapCell[][]>([]);
  const banner = useRef<FlapCell[]>([]);
  const clock = useRef<FlapCell[]>([]);
  const rowRects = useRef<{ top: number; bottom: number; left: number; right: number }[]>([]);
  const measuredAt = useRef(0);
  const [cw, setCw] = useState(22);

  const tilt = useRef({ rx: new Spring(0, { stiffness: 60, damping: 14 }), ry: new Spring(0, { stiffness: 60, damping: 14 }) });
  const pass = useRef({
    x: new Spring(0, { stiffness: 140, damping: 18 }),
    y: new Spring(0, { stiffness: 200, damping: 20 }),
    show: new Spring(0, { stiffness: 260, damping: 15 }),
    rot: new Spring(0, { stiffness: 120, damping: 10 }),
  });

  const unitsPerRow = COLS.reduce((a, c) => a + c.n, 0) + COLS.length * 0.75;

  useLayoutEffect(() => {
    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const byW = (W - 140) / unitsPerRow - 2;
      const byH = (H - 330) / ((ROWS + 1.6) * 1.45 + ROWS * 0.3);
      setCw(Math.max(10, Math.min(26, byW, byH)));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [unitsPerRow]);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const recs: CellRec[] = [];
    const rowCells: FlapCell[][] = Array.from({ length: ROWS }, () => []);
    const bannerCells: FlapCell[] = [];
    const clockCells: FlapCell[] = [];
    board.querySelectorAll<HTMLElement>(".sf-cell").forEach((el) => {
      const r = Number(el.dataset.r);
      const cell = new FlapCell(el);
      if (r >= 0) rowCells[r].push(cell);
      else if (r === -1) bannerCells.push(cell);
      else clockCells.push(cell);
      recs.push({ cell, r, cx: 0, cy: 0 });
    });
    cells.current = recs;
    rows.current = rowCells;
    banner.current = bannerCells;
    clock.current = clockCells;
    measuredAt.current = 0;

    const text = bannerText(-1);
    bannerCells.forEach((c, i) => c.setTarget(text[i], 0.3 + i * 0.03));

    const tick = () => {
      const d = new Date();
      const t = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      clockCells.forEach((c, i) => c.setTarget(t[i], i * 0.08));
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const g = group;
    const text = bannerText(g);
    banner.current.forEach((c, i) => c.setTarget(text[i], i * 0.02));
    const certs = g >= 0 ? CERT_GROUPS[g].certs : [];
    rows.current.forEach((cellsInRow, r) => {
      const strings = rowText(certs[r], g >= 0 ? CERT_GROUPS[g].key : "", r).join("");
      cellsInRow.forEach((c, i) => c.setTarget(strings[i], 0.15 + r * 0.08 + i * 0.012 + Math.random() * 0.05));
    });
    setHoverRow(-1);
  }, [group]);

  const measure = () => {
    const stage = stageRef.current;
    const board = boardRef.current;
    if (!stage || !board) return;
    const s = stage.getBoundingClientRect();
    for (const rec of cells.current) {
      const r = rec.cell.el.getBoundingClientRect();
      rec.cx = r.left + r.width / 2 - s.left;
      rec.cy = r.top + r.height / 2 - s.top;
    }
    rowRects.current = Array.from(board.querySelectorAll<HTMLElement>(".sf-row")).map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top - s.top, bottom: r.bottom - s.top, left: r.left - s.left, right: r.right - s.left };
    });
  };

  useFrame((dt, time) => {
    const p = progress.current;
    const ptr = pointer.current;
    const W = stageRef.current?.clientWidth ?? window.innerWidth;
    const H = stageRef.current?.clientHeight ?? window.innerHeight;

    const span = (1 - BOARD_START) / CERT_GROUPS.length;
    const g = p < BOARD_START ? -1 : Math.min(CERT_GROUPS.length - 1, Math.floor((p - BOARD_START) / span));
    if (g !== groupRef.current) {
      groupRef.current = g;
      setGroup(g);
    }
    if (barRef.current) {
      const within = g < 0 ? range(p, 0, BOARD_START) : range(p, BOARD_START + g * span, BOARD_START + (g + 1) * span);
      barRef.current.style.transform = `scaleX(${within})`;
    }

    if (time - measuredAt.current > 0.6) {
      measure();
      measuredAt.current = time;
    }

    for (const rec of cells.current) rec.cell.update(dt);

    if (ptr.inside) {
      const speed = Math.hypot(ptr.vx, ptr.vy);
      if (speed > 350) {
        const reach = cw * 1.8;
        const steps = 2 + Math.min(6, Math.floor(speed / 700));
        for (const rec of cells.current) {
          if (Math.abs(rec.cx - ptr.x) < reach && Math.abs(rec.cy - ptr.y) < reach) rec.cell.riffle(steps);
        }
      }
    }

    const intro = 1 - range(p, 0, BOARD_START);
    const t = tilt.current;
    t.rx.target = ptr.inside ? -ptr.ny * 3 : 0;
    t.ry.target = ptr.inside ? ptr.nx * 4 : 0;
    t.rx.step(dt);
    t.ry.step(dt);
    if (boardRef.current) {
      boardRef.current.style.transform = `rotateX(${t.rx.value + intro * 14}deg) rotateY(${t.ry.value}deg) translateY(${intro * 40}px)`;
    }

    const ps = pass.current;
    const hr = hoverRowRef.current;
    const rect = rowRects.current[hr];
    const show = hr >= 0 && !!rect && ptr.inside;
    const passW = 560;
    const passH = 210;
    if (show && rect) {
      const below = rect.bottom + passH + 24 < H;
      const tx = Math.max(16, Math.min(W - passW - 16, ptr.x - passW * 0.35));
      const ty = below ? rect.bottom + 12 : rect.top - passH - 12;
      if (ps.show.value < 0.05) {
        ps.x.snap(tx);
        ps.y.snap(ty);
      }
      ps.x.target = tx;
      ps.y.target = ty;
    }
    ps.show.target = show ? 1 : 0;
    ps.rot.target = Math.max(-6, Math.min(6, ptr.vx * 0.006));
    ps.x.step(dt);
    ps.y.step(dt);
    ps.show.step(dt);
    ps.rot.step(dt);
    if (passRef.current) {
      const sv = ps.show.value;
      passRef.current.style.opacity = String(Math.max(0, Math.min(1, sv * 1.4)));
      passRef.current.style.transform = `translate3d(${ps.x.value}px, ${ps.y.value}px, 0) rotate(${ps.rot.value}deg) scale(${0.6 + 0.4 * sv})`;
    }
  });

  const certsInGroup = group >= 0 ? CERT_GROUPS[group].certs : [];
  const passCert = hoverRow >= 0 ? certsInGroup[hoverRow] : undefined;

  const rowEls = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => {
        let c = 0;
        return (
          <div className="sf-row" key={r} data-row={r}>
            {COLS.map((col) => (
              <span key={col.key} className={`sf-col sf-col--${col.key}`}>
                {Array.from({ length: col.n }, () => (
                  <Flap key={c} r={r} c={c++} />
                ))}
              </span>
            ))}
          </div>
        );
      }),
    [],
  );

  const bannerEls = useMemo(
    () => (
      <div className="sf-banner">
        <span className="sf-col sf-col--banner">
          {Array.from({ length: BANNER_N }, (_, i) => (
            <Flap key={i} r={-1} c={i} />
          ))}
        </span>
        <span className="sf-col sf-col--clock">
          {Array.from({ length: 5 }, (_, i) => (
            <Flap key={i} r={-2} c={i} />
          ))}
        </span>
      </div>
    ),
    [],
  );

  return (
    <div className="lab-runway" ref={runwayRef} style={{ height: "560vh" }}>
      <section className="lab-stage sf-stage" ref={stageRef}>
        <div className="lab-stage-caption">
          <span className="eyebrow">Credentials · Departures</span>
          <h2>Now boarding.</h2>
          <p>Scroll to change gates. Sweep fast to riffle the flaps; hover a row for its pass.</p>
        </div>

        <div className="sf-board-wrap">
          <div
            className="sf-board"
            ref={boardRef}
            style={{ "--cw": `${cw}px` } as React.CSSProperties}
            onPointerMove={(e) => {
              const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
              const r = row ? Number(row.dataset.row) : -1;
              const valid = r >= 0 && r < certsInGroup.length ? r : -1;
              if (valid !== hoverRowRef.current) setHoverRow(valid);
            }}
            onPointerLeave={() => setHoverRow(-1)}
            onClick={() => {
              if (passCert) onInspect(passCert);
            }}
          >
            {bannerEls}
            <div className="sf-labels">
              {COLS.map((col) => (
                <span key={col.key} className="sf-col" style={{ width: `calc(${col.n} * (var(--cw) + 2px))` }}>
                  {col.label}
                </span>
              ))}
            </div>
            {rowEls.map((row, r) => React.cloneElement(row, { className: `sf-row${r === hoverRow ? " is-hover" : ""}` }))}
            <div className="sf-foot">
              <div className="sf-gates">
                {CERT_GROUPS.map((g, i) => (
                  <span key={g.key} className={i === group ? "is-active" : ""}>
                    {i + 1} · {g.short}
                  </span>
                ))}
              </div>
              <span className="sf-next">
                <em>Next gate</em>
                <span className="sf-bar">
                  <span ref={barRef} />
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="sf-pass" ref={passRef} aria-hidden>
          {passCert && (
            <>
              <span className="sf-pass-img cert-face">{passCert.image && <img src={assetUrl(passCert.image)} alt="" />}</span>
              <span className="sf-pass-main">
                <em>Boarding pass · Credential</em>
                <strong>{passCert.name}</strong>
                <span className="sf-pass-grid">
                  <span>
                    <i>From</i>
                    {passCert.issuer}
                  </span>
                  <span>
                    <i>Issued</i>
                    {passCert.date}
                  </span>
                  <span>
                    <i>Gate</i>
                    {group + 1}
                  </span>
                </span>
                <small>Click the row to open</small>
              </span>
              <span className="sf-pass-stub">
                <i>Seat</i>
                <b>
                  {GROUP_PREFIX[CERT_GROUPS[group].key]}
                  {String(hoverRow + 1).padStart(2, "0")}
                </b>
                <span className="sf-pass-code" />
              </span>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SplitFlapDesign;
