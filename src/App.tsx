import { useState, useEffect } from 'react';
import { CoffeeDesign1EspressoLab } from './designs/CoffeeDesign1EspressoLab';
import { CoffeeDesign2CaffeineOverclocked } from './designs/CoffeeDesign2CaffeineOverclocked';
import { CoffeeDesign3ArtisanalCrema } from './designs/CoffeeDesign3ArtisanalCrema';
import { DesignSwitcher } from './components/DesignSwitcher';

export function App() {
  const [designIndex, setDesignIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      if (v && ['1', '2', '3'].includes(v)) {
        return parseInt(v, 10);
      }
      const saved = localStorage.getItem('portfolio_active_design');
      if (saved && ['1', '2', '3'].includes(saved)) {
        return parseInt(saved, 10);
      }
    }
    return 1; // Default to Design 1: The Espresso Lab
  });

  const handleSelectDesign = (index: number) => {
    setDesignIndex(index);
    localStorage.setItem('portfolio_active_design', index.toString());
    const url = new URL(window.location.href);
    url.searchParams.set('v', index.toString());
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (['1', '2', '3'].includes(e.key)) {
        handleSelectDesign(parseInt(e.key, 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {designIndex === 1 && <CoffeeDesign1EspressoLab />}
      {designIndex === 2 && <CoffeeDesign2CaffeineOverclocked />}
      {designIndex === 3 && <CoffeeDesign3ArtisanalCrema />}

      {/* Floating Coffee Theme Switcher Dock */}
      <DesignSwitcher activeDesign={designIndex} onSelectDesign={handleSelectDesign} />
    </div>
  );
}

export default App;
