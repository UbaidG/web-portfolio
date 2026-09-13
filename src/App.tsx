import { useState, useEffect } from 'react';
import { Design1SpaceOdyssey } from './designs/Design1SpaceOdyssey';
import { Design2CasinoRoyale } from './designs/Design2CasinoRoyale';
import { Design3CyberTarot } from './designs/Design3CyberTarot';
import { Design4OryzoCoaster } from './designs/Design4OryzoCoaster';
import { Design5LusionCinema } from './designs/Design5LusionCinema';
import { Design6NeonArcadePinball } from './designs/Design6NeonArcadePinball';
import { DesignSwitcher } from './components/DesignSwitcher';

export function App() {
  const [designIndex, setDesignIndex] = useState<number>(() => {
    // Check URL search param first, e.g., ?v=4
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      if (v && ['1', '2', '3', '4', '5', '6'].includes(v)) {
        return parseInt(v, 10);
      }
      const saved = localStorage.getItem('portfolio_active_design');
      if (saved && ['1', '2', '3', '4', '5', '6'].includes(saved)) {
        return parseInt(saved, 10);
      }
    }
    return 4; // Default to 4 (Oryzo Coaster & Coffee Bean Swarm) as requested!
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
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        handleSelectDesign(parseInt(e.key, 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {designIndex === 1 && <Design1SpaceOdyssey />}
      {designIndex === 2 && <Design2CasinoRoyale />}
      {designIndex === 3 && <Design3CyberTarot />}
      {designIndex === 4 && <Design4OryzoCoaster />}
      {designIndex === 5 && <Design5LusionCinema />}
      {designIndex === 6 && <Design6NeonArcadePinball />}

      {/* Floating Design Switcher Dock */}
      <DesignSwitcher activeDesign={designIndex} onSelectDesign={handleSelectDesign} />
    </div>
  );
}

export default App;
