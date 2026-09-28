import React, { useRef, useState, useEffect, useCallback } from "react";
import { CertificationItem } from "../data/portfolioData";

interface HangingFrameProps {
  cert: CertificationItem;
  restAngle: number;
  onSelect: (cert: CertificationItem) => void;
}

export const HangingFrame: React.FC<HangingFrameProps> = ({
  cert,
  restAngle,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  // SVG Cord dynamic path refs
  const cordShadowRef = useRef<SVGPathElement>(null);
  const cordBaseRef = useRef<SVGPathElement>(null);
  const cordTwistRef = useRef<SVGPathElement>(null);
  const cordHighlightRef = useRef<SVGPathElement>(null);

  // Physics simulation state
  const physics = useRef({
    angle: restAngle,
    targetAngle: restAngle,
    velocity: 0,
    isHovered: false,
    isDragging: false,
    dragStartX: 0,
    dragStartAngle: 0,
    hasDragged: false,
    animId: 0,
  });

  const [displayAngle, setDisplayAngle] = useState(restAngle);

  // Update DOM transform & SVG cord curvature directly for 60fps performance
  const applyTransform = useCallback((ang: number, vel: number = 0) => {
    setDisplayAngle(ang);
    if (assemblyRef.current) {
      // 3D rotation: Z swing + slight Y perspective tilt + slight X lift
      assemblyRef.current.style.transform = `rotateZ(${ang}deg) rotateY(${ang * 0.25}deg) rotateX(${-Math.abs(ang) * 0.1}deg)`;
      
      // Dynamic wall drop shadow shifting opposite to the swing
      const shadowX = -ang * 1.8;
      const shadowBlur = 24 + Math.abs(ang) * 0.8;
      const shadowOpacity = 0.22 + Math.abs(ang) * 0.005;
      assemblyRef.current.style.filter = `drop-shadow(${shadowX}px 18px ${shadowBlur}px rgba(25, 18, 14, ${shadowOpacity}))`;
    }

    if (sheenRef.current) {
      // Shift glare highlight according to angle
      const glarePos = 50 + ang * 3.5;
      sheenRef.current.style.transform = `translateX(${glarePos}%) skewX(-25deg)`;
    }

    // Dynamic Catenary Cord Curvature:
    // Subtle, realistic rope flex with inertia and directional gravity shift
    const leftSagX = -ang * 0.25 + vel * 0.6;
    const leftSagY = Math.abs(leftSagX) * 0.12;
    const rightSagX = -ang * 0.25 - vel * 0.6;
    const rightSagY = Math.abs(rightSagX) * 0.12;

    const leftCtrlX = (89 + leftSagX).toFixed(1);
    const leftCtrlY = (36 + leftSagY).toFixed(1);
    const rightCtrlX = (191 + rightSagX).toFixed(1);
    const rightCtrlY = (36 + rightSagY).toFixed(1);

    const cordD = `M 140 14 Q ${leftCtrlX} ${leftCtrlY} 38 58 M 140 14 Q ${rightCtrlX} ${rightCtrlY} 242 58`;
    if (cordBaseRef.current) cordBaseRef.current.setAttribute("d", cordD);
    if (cordTwistRef.current) cordTwistRef.current.setAttribute("d", cordD);
    if (cordHighlightRef.current) cordHighlightRef.current.setAttribute("d", cordD);

    if (cordShadowRef.current) {
      const shadowD = `M 140 16 Q ${(89 + leftSagX + 2).toFixed(1)} ${(36 + leftSagY + 3).toFixed(1)} 40 60 M 140 16 Q ${(191 + rightSagX + 2).toFixed(1)} ${(36 + rightSagY + 3).toFixed(1)} 244 60`;
      cordShadowRef.current.setAttribute("d", shadowD);
    }
  }, []);

  // Physics animation loop using spring-damper dynamics
  const startPhysicsLoop = useCallback(() => {
    if (physics.current.animId) return;

    const springK = 0.055; // Weighted restoring torque
    const damping = 0.915; // Realistic friction / air resistance
    const rest = restAngle;

    const tick = () => {
      const p = physics.current;

      if (!p.isDragging) {
        // Target is either gentle cursor tilt or resting angle
        const target = p.isHovered ? p.targetAngle : rest;
        const displacement = p.angle - target;
        const springForce = -springK * displacement;

        p.velocity += springForce;
        p.velocity *= damping;
        p.angle += p.velocity;

        // Clamp maximum angle to prevent unnatural wild swings (rest ± 4.2 degrees)
        p.angle = Math.max(rest - 4.2, Math.min(rest + 4.2, p.angle));

        applyTransform(p.angle, p.velocity);

        // Sleep when energy drops below perceptual threshold
        const isSettled =
          !p.isHovered &&
          Math.abs(p.velocity) < 0.0006 &&
          Math.abs(p.angle - rest) < 0.006;

        if (isSettled) {
          p.angle = rest;
          p.velocity = 0;
          applyTransform(rest, 0);
          p.animId = 0;
          return;
        }
      }

      p.animId = requestAnimationFrame(tick);
    };

    physics.current.animId = requestAnimationFrame(tick);
  }, [restAngle, applyTransform]);

  useEffect(() => {
    applyTransform(restAngle, 0);
    const currentPhysics = physics.current;
    return () => {
      if (currentPhysics.animId) {
        cancelAnimationFrame(currentPhysics.animId);
      }
    };
  }, [restAngle, applyTransform]);

  // Pointer interactions (Directional Nudge & Interactive Drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    const p = physics.current;
    p.isDragging = true;
    p.hasDragged = false;
    p.dragStartX = e.clientX;
    p.dragStartAngle = p.angle;
    p.velocity = 0;

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
    startPhysicsLoop();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = physics.current;

    if (p.isDragging) {
      const deltaX = e.clientX - p.dragStartX;
      if (Math.abs(deltaX) > 4) {
        p.hasDragged = true;
      }
      // Controlled drag rotation clamped to realistic ±6.5 degrees around rest
      const targetDragAngle = p.dragStartAngle + deltaX * 0.045;
      const newAng = Math.max(restAngle - 6.5, Math.min(restAngle + 6.5, targetDragAngle));
      p.velocity = (newAng - p.angle) * 0.2;
      p.angle = newAng;
      applyTransform(newAng, p.velocity);
      return;
    }

    if (p.isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const normalizedOffset = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));

      // Subtle, weighted directional presence tilt (±0.65 degrees max)
      p.targetAngle = restAngle + normalizedOffset * 0.65;

      // Impart directional impulse following cursor travel direction
      if (Math.abs(e.movementX) > 1.2) {
        const directionalImpulse = Math.sign(e.movementX) * Math.min(0.08, Math.abs(e.movementX) * 0.003);
        p.velocity = Math.max(-0.5, Math.min(0.5, p.velocity + directionalImpulse));
      }

      startPhysicsLoop();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const p = physics.current;
    p.isDragging = false;

    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }

    // If it was a quick click (<4px movement), open the inspection modal!
    if (!p.hasDragged) {
      onSelect(cert);
    } else {
      // Release velocity clamped so it doesn't whip
      p.velocity = Math.max(-0.35, Math.min(0.35, p.velocity));
      startPhysicsLoop();
    }
  };

  // Directional entrance: detects whether cursor enters from left or right
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const p = physics.current;
    p.isHovered = true;

    const rect = containerRef.current?.getBoundingClientRect();
    let direction = 1;
    let speed = 0.24;

    // 1. Direct velocity vector if available
    if (Math.abs(e.movementX) > 0.5) {
      direction = Math.sign(e.movementX);
      speed = Math.min(0.36, 0.18 + Math.abs(e.movementX) * 0.012);
    } else if (rect) {
      // 2. Spatial entry side:
      // Entering from left boundary (< center) pushes right (+1)
      // Entering from right boundary (> center) pushes left (-1)
      const centerX = rect.left + rect.width / 2;
      direction = e.clientX < centerX ? 1 : -1;
      speed = 0.24;
    }

    p.velocity = direction * speed;
    startPhysicsLoop();
  };

  const handleMouseLeave = () => {
    const p = physics.current;
    p.isHovered = false;
    p.targetAngle = restAngle;
    startPhysicsLoop();
  };

  const baseUrl = import.meta.env.BASE_URL;
  const thumbUrl = cert.image ? `${baseUrl}${cert.image}` : "";

  return (
    <div
      className="cert-frame-wrapper"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: physics.current.isDragging ? "grabbing" : "grab" }}
    >
      {/* Fixed Brass Mounting Nail on Wall (Pivot Origin) */}
      <div className="wall-mounting-nail" aria-hidden="true">
        <div className="nail-pin-shadow" />
        <div className="nail-pin-head" />
      </div>

      {/* The Suspended Assembly (Swings freely from the nail apex) */}
      <div
        className="hanging-assembly"
        ref={assemblyRef}
        style={{
          transformOrigin: "50% 14px",
          transform: `rotateZ(${displayAngle}deg)`,
        }}
      >
        {/* SVG Suspension Cords & D-Rings (Tied precisely to frame top) */}
        <div className="suspension-cords-container">
          <svg
            className="suspension-cords-svg"
            viewBox="0 0 280 62"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Wall shadow of hanging cords */}
            <path
              ref={cordShadowRef}
              d="M 140 16 Q 91 39 40 60 M 140 16 Q 193 39 244 60"
              stroke="rgba(0, 0, 0, 0.18)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Braided Twisted Hanging Cord - Core Base */}
            <path
              ref={cordBaseRef}
              d="M 140 14 Q 89 36 38 58 M 140 14 Q 191 36 242 58"
              stroke="#54371f"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Braided Twisted Hanging Cord - Middle Cord Weave */}
            <path
              ref={cordTwistRef}
              d="M 140 14 Q 89 36 38 58 M 140 14 Q 191 36 242 58"
              stroke="#9c7247"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />

            {/* Braided Twisted Hanging Cord - Fine Gold Silk Fleck */}
            <path
              ref={cordHighlightRef}
              d="M 140 14 Q 89 36 38 58 M 140 14 Q 191 36 242 58"
              stroke="#f5dfa6"
              strokeWidth="0.9"
              strokeDasharray="2 4"
              strokeLinecap="round"
            />

            {/* Brass Loop knot / collar around the mounting nail */}
            <ellipse cx="140" cy="14" rx="7" ry="5" stroke="#3d2612" strokeWidth="2.5" fill="none" />
            <ellipse cx="140" cy="14" rx="7" ry="5" stroke="#caa13c" strokeWidth="1" fill="none" />
            <circle cx="140" cy="14" r="2.5" fill="#1e1307" />

            {/* Left Brass D-Ring Bracket (Riveted to Frame Top Molding) */}
            <rect x="31" y="51" width="14" height="9" rx="2.5" fill="#caa13c" stroke="#52390a" strokeWidth="1.2" />
            <ellipse cx="38" cy="55.5" rx="3.5" ry="2" fill="#201504" />
            <circle cx="38" cy="58" r="1.2" fill="#52390a" />

            {/* Right Brass D-Ring Bracket (Riveted to Frame Top Molding) */}
            <rect x="235" y="51" width="14" height="9" rx="2.5" fill="#caa13c" stroke="#52390a" strokeWidth="1.2" />
            <ellipse cx="242" cy="55.5" rx="3.5" ry="2" fill="#201504" />
            <circle cx="242" cy="58" r="1.2" fill="#52390a" />
          </svg>
        </div>

        {/* The Solid Walnut Wooden Frame */}
        <div
          className="cert-picture-frame"
          role="button"
          tabIndex={0}
          aria-label={`View certificate for ${cert.name}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect(cert);
            }
          }}
        >
          {/* Beveled Wood Lip */}
          <div className="frame-bevel-lip">
            {/* Archival Passe-Partout Matting */}
            <div className="frame-matting">
              {/* Inner Certificate Artwork Slot */}
              <div className="frame-artwork-slot">
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={cert.name}
                    className="cert-thumb-img"
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="cert-thumb-fallback">
                    <span className="fallback-issuer">{cert.issuer}</span>
                    <span className="fallback-name">{cert.name}</span>
                  </div>
                )}

                {/* Translucent Glass Glare Reflection */}
                <div className="frame-glass-sheen" ref={sheenRef} />

                {/* Subtle Hover Inspect Tag */}
                <div className="frame-inspect-overlay">
                  <span className="inspect-pill">View Certificate ↗</span>
                </div>
              </div>
            </div>

            {/* Museum Engraved Brass Plaque */}
            <div className="frame-museum-plaque">
              <div className="plaque-top">
                <span className="plaque-issuer">{cert.issuer}</span>
                <span className="plaque-date">{cert.date}</span>
              </div>
              <h4 className="plaque-title" title={cert.name}>
                {cert.name}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
