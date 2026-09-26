import { useState, useEffect } from "react";
import { CoffeeDesign1EspressoLab } from "./designs/CoffeeDesign1EspressoLab";
import { CoffeeDesign2RoasteryLofty } from "./designs/CoffeeDesign2RoasteryLofty";
import { CoffeeDesign3KyotoPrecision } from "./designs/CoffeeDesign3KyotoPrecision";
import { DesignSwitcher, DesignOption } from "./components/DesignSwitcher";

export function App() {
  const [activeDesign, setActiveDesign] = useState<DesignOption>(() => {
    // Check URL search params first
    const params = new URLSearchParams(window.location.search);
    const d = params.get("design");
    if (d === "2" || d === "roastery") return "roastery";
    if (d === "3" || d === "kyoto") return "kyoto";
    if (d === "1" || d === "espresso") return "espresso";

    // Then check localStorage
    const saved = localStorage.getItem("selected_portfolio_design") as DesignOption;
    if (saved === "roastery" || saved === "kyoto" || saved === "espresso") {
      return saved;
    }
    return "espresso";
  });

  const handleSelectDesign = (design: DesignOption) => {
    setActiveDesign(design);
    localStorage.setItem("selected_portfolio_design", design);

    // Update URL query param smoothly
    const url = new URL(window.location.href);
    const numMap: Record<DesignOption, string> = {
      espresso: "1",
      roastery: "2",
      kyoto: "3",
    };
    url.searchParams.set("design", numMap[design]);
    window.history.replaceState({}, "", url.toString());

    // Scroll back to top on design switch
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    // Update document title dynamically based on active concept
    const titles: Record<DesignOption, string> = {
      espresso: "Ubaid Ghante | The Espresso Extraction (Design 01)",
      roastery: "Ubaid Ghante | The Specialty Roastery (Design 02)",
      kyoto: "Ubaid Ghante | Kyoto Cold Drip Precision (Design 03)",
    };
    document.title = titles[activeDesign];
  }, [activeDesign]);

  return (
    <div className={`portfolio-app-root design-mode--${activeDesign}`}>
      {activeDesign === "espresso" && <CoffeeDesign1EspressoLab />}
      {activeDesign === "roastery" && <CoffeeDesign2RoasteryLofty />}
      {activeDesign === "kyoto" && <CoffeeDesign3KyotoPrecision />}

      {/* Floating Design Switcher Dock & Director's Prompt Spec Modal */}
      <DesignSwitcher
        currentDesign={activeDesign}
        onSelectDesign={handleSelectDesign}
      />
    </div>
  );
}

export default App;
