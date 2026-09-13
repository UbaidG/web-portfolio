import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCoffeeMugGroup, createTakeawayCupGroup } from '../utils/coffeeAssets';

interface CoffeeMug3DCanvasProps {
  type?: 'ceramic_mug' | 'takeaway_cup';
  scrollProgress?: number;
  className?: string;
  sizeMultiplier?: number;
}

export const CoffeeMug3DCanvas: React.FC<CoffeeMug3DCanvasProps> = ({
  type = 'ceramic_mug',
  scrollProgress = 0,
  className = 'w-full h-full',
  sizeMultiplier = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.2);

    // Warm Ambient and Studio Rim Lights
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.5);
    keyLight.position.set(8, 10, 8);
    scene.add(keyLight);

    const warmRim = new THREE.DirectionalLight(0xd97706, 2.5);
    warmRim.position.set(-8, -4, -4);
    scene.add(warmRim);

    const fillLight = new THREE.PointLight(0xfef3c7, 1.8, 12);
    fillLight.position.set(0, 4, 3);
    scene.add(fillLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Create Cup Object
    const { group: mugGroup, updateSteam } = type === 'ceramic_mug' ? createCoffeeMugGroup() : createTakeawayCupGroup();
    mugGroup.scale.setScalar(sizeMultiplier * 1.15);
    mugGroup.position.set(0, -0.4, 0);
    rootGroup.add(mugGroup);

    // Pointer move listener
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.targetX = nx * 0.6;
      mouseRef.current.targetY = ny * 0.6;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update Steam particles
      updateSteam(elapsed);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const p = scrollRef.current;

      // Realistic 3D Mug rotation on scroll + mouse tilt
      // Mug rotates gently to reveal interior coffee liquid and handle
      rootGroup.rotation.x = 0.38 + p * Math.PI * 1.6 + mouseRef.current.y * 0.35 + Math.sin(elapsed * 0.8) * 0.04;
      rootGroup.rotation.y = 0.45 + p * Math.PI * 2.8 + mouseRef.current.x * 0.45 + Math.cos(elapsed * 0.7) * 0.04;
      rootGroup.rotation.z = Math.sin(p * Math.PI * 2) * 0.25 + mouseRef.current.x * 0.15;

      // Gentle floating bob
      rootGroup.position.y = Math.sin(elapsed * 1.6) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type, sizeMultiplier]);

  return <div ref={containerRef} className={className} />;
};
