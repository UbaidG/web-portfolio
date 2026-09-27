import { useEffect } from "react";
import { CoffeeDesign2RoasteryLofty } from "./designs/CoffeeDesign2RoasteryLofty";

export function App() {
  useEffect(() => {
    document.title = "Ubaid Ghante | Machine Learning Engineer";
  }, []);

  return (
    <div className="portfolio-app-root design-mode--roastery">
      <CoffeeDesign2RoasteryLofty />
    </div>
  );
}

export default App;
