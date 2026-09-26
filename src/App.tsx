import { useState, useEffect } from "react";
import { CoffeeDesign1EspressoLab } from "./designs/CoffeeDesign1EspressoLab";
import { CoffeeDesign2RoasteryLofty } from "./designs/CoffeeDesign2RoasteryLofty";
import { DesignSwitcher, DesignOption } from "./components/DesignSwitcher";

export function App() {
  const [activeDesign, setActiveDesign] = useState<DesignOption>(() => {
    // Check URL search params
    const params = new URLSearchParams(window.location.search);
    const d = params.get("design");
    if (d === "2" || d === "roastery") return "roastery";
    if (d === "1" || d === "espresso") return "espresso";

    // Then check localStorage
    const saved = localStorage.getItem("selected_portfolio_design") as DesignOption;
    if (saved === "roastery" || saved === "espresso") {
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
    };
    url.searchParams.set("design", numMap[design]);
    window.history.replaceState({}, "", url.toString());

    // Scroll back to top on design switch
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    const titles: Record<DesignOption, string> = {
      espresso: "Ubaid Ghante | The Espresso Extraction (Design 01)",
      roastery: "Ubaid Ghante | The Specialty Roastery (Design 02)",
    };
    document.title = titles[activeDesign] || "Ubaid Ghante | Portfolio";
  }, [activeDesign]);

  return (
    <div className={`portfolio-app-root design-mode--${activeDesign}`}>
      {activeDesign === "espresso" && <CoffeeDesign1EspressoLab />}
      {activeDesign === "roastery" && <CoffeeDesign2RoasteryLofty />}

      {/* Floating Design Switcher Dock & Director's Prompt Spec Modal */}
      <DesignSwitcher
        currentDesign={activeDesign}
        onSelectDesign={handleSelectDesign}
      />
    </div>
  );
}

export default App;
