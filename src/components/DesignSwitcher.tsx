import React, { useEffect, useState } from "react";
import { PromptSpecModal } from "./PromptSpecModal";

export type DesignOption = "espresso" | "roastery";

interface DesignSwitcherProps {
  currentDesign: DesignOption;
  onSelectDesign: (design: DesignOption) => void;
}

export const DesignSwitcher: React.FC<DesignSwitcherProps> = ({
  currentDesign,
  onSelectDesign,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "1") {
        onSelectDesign("espresso");
      } else if (e.key === "2") {
        onSelectDesign("roastery");
      } else if (e.key.toLowerCase() === "p") {
        setIsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectDesign]);

  const designs: { id: DesignOption; label: string; num: string; badge: string }[] = [
    {
      id: "espresso",
      num: "01",
      label: "White Stone Pour",
      badge: "4-Frame Cascade",
    },
    {
      id: "roastery",
      num: "02",
      label: "Specialty Roastery",
      badge: "Lofty Lab Frames",
    },
  ];

  return (
    <>
      <aside className="design-switcher-dock" aria-label="Design concept switcher">
        <div className="design-switcher-inner">
          <div className="design-switcher-label">
            <span className="switcher-coffee-icon">☕</span>
            <span className="switcher-title">Design Concept</span>
          </div>

          <div className="design-switcher-buttons" role="tablist">
            {designs.map((d) => {
              const isActive = currentDesign === d.id;
              return (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`design-switch-btn ${isActive ? "active" : ""}`}
                  onClick={() => onSelectDesign(d.id)}
                >
                  <span className="design-num">{d.num}</span>
                  <span className="design-name">{d.label}</span>
                  <span className="design-subbadge">{d.badge}</span>
                </button>
              );
            })}
          </div>

          <div className="design-switcher-actions">
            <button
              className="prompt-spec-trigger-btn"
              onClick={() => setIsModalOpen(true)}
              title="Open 4-frame video prompt specification and pan-down camera rules (Shortcut: P)"
            >
              <span className="video-icon">🎬</span>
              <span>4-Frame Video Spec</span>
            </button>
          </div>
        </div>
      </aside>

      <PromptSpecModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
