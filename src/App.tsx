import { useState, useEffect } from "react";
import { DesignSwitcher } from "./components/DesignSwitcher";
import { Design1Atelier } from "./designs/Design1Atelier";
import { Design2CyberTerminal } from "./designs/Design2CyberTerminal";
import { Design3SwissBlueprint } from "./designs/Design3SwissBlueprint";
import { Design4EtherealAurora } from "./designs/Design4EtherealAurora";
import { Design5AnalogArchive } from "./designs/Design5AnalogArchive";
import { Design6SpatialGallery } from "./designs/Design6SpatialGallery";

export default function App() {
  const [currentDesign, setCurrentDesign] = useState<number>(() => {
    // Read from query param (?v=1..6) or localStorage
    const params = new URLSearchParams(window.location.search);
    const paramVal = parseInt(params.get("v") || "", 10);
    if (paramVal >= 1 && paramVal <= 6) {
      return paramVal;
    }
    const saved = localStorage.getItem("portfolio_design_mode");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= 1 && parsed <= 6) return parsed;
    }
    return 1; // Default to Design 1: Kinetic Atelier
  });

  const handleSelectDesign = (id: number) => {
    setCurrentDesign(id);
    localStorage.setItem("portfolio_design_mode", id.toString());
    const url = new URL(window.location.href);
    url.searchParams.set("v", id.toString());
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sync back/forward browser navigation
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const val = parseInt(params.get("v") || "1", 10);
      if (val >= 1 && val <= 6) {
        setCurrentDesign(val);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Design Switcher Control Dock */}
      <DesignSwitcher currentDesign={currentDesign} onSelectDesign={handleSelectDesign} />

      {/* Render Selected Design */}
      <div key={currentDesign} className="transition-opacity duration-300">
        {currentDesign === 1 && <Design1Atelier />}
        {currentDesign === 2 && <Design2CyberTerminal />}
        {currentDesign === 3 && <Design3SwissBlueprint />}
        {currentDesign === 4 && <Design4EtherealAurora />}
        {currentDesign === 5 && <Design5AnalogArchive />}
        {currentDesign === 6 && <Design6SpatialGallery />}
      </div>
    </div>
  );
}
