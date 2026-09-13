import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createRealisticCoffeeBeanGeometry, createCoffeeBeanTexture } from '../utils/coffeeAssets';

interface RealisticCoffeeBeanStreamProps {
  count?: number;
  className?: string;
  speedMultiplier?: number;
}

export const RealisticCoffeeBeanStream: React.FC<RealisticCoffeeBeanStreamProps> = ({
  count = 140,
  className = 'absolute inset-0 pointer-events-auto z-10',
  speedMultiplier = 0.85,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 20);

    // Warm Studio Lighting for Roasted Beans
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    keyLight.position.set(12, 16, 14);
    scene.add(keyLight);

    const warmRim = new THREE.DirectionalLight(0xd97706, 2.6);
    warmRim.position.set(-14, -10, -6);
    scene.add(warmRim);

    // Realistic Coffee Bean Mesh & Material
    const geometry = createRealisticCoffeeBeanGeometry();
    const texture = createCoffeeBeanTexture();

    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      color: 0x381f14, // Dark roasted espresso
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // Stream Boundaries (Far Off-Screen so resets are 100% invisible!)
    const minX = -36;
    const maxX = 36;
    const totalSpan = maxX - minX;

    interface Bean {
      x: number;
      y: number;
      z: number;
      baseYOffset: number;
      baseZOffset: number;
      vx: number;
      vy: number;
      vz: number;
      speed: number;
      rx: number;
      ry: number;
      rz: number;
      vrx: number;
      vry: number;
      vrz: number;
      scale: number;
    }

    const beans: Bean[] = [];

    for (let i = 0; i < count; i++) {
      // Evenly distribute across the wide off-screen span
      const initialX = minX + (i / count) * totalSpan + (Math.random() - 0.5) * 4;
      const yOffset = (Math.random() - 0.5) * 2.8;
      const zOffset = (Math.random() - 0.5) * 3.2;

      // Base sine wave trajectory
      const initialY = Math.sin(initialX * 0.12) * 3.4 - (initialX / 36) * 2.5 + yOffset;

      beans.push({
        x: initialX,
        y: initialY,
        z: zOffset,
        baseYOffset: yOffset,
        baseZOffset: zOffset,
        vx: 0,
        vy: 0,
        vz: 0,
        // Gentle, calm drift speed
        speed: (0.022 + Math.random() * 0.015) * speedMultiplier,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        vrx: (Math.random() - 0.5) * 0.012,
        vry: (Math.random() - 0.5) * 0.012,
        vrz: (Math.random() - 0.5) * 0.012,
        scale: 0.75 + Math.random() * 0.45,
      });
    }

    // 3D Cursor Raycaster
    const mouse3D = new THREE.Vector3(999, 999, 0);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(999, 999);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNorm, camera);
      raycaster.ray.intersectPlane(planeZ, mouse3D);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId: number;
    const dummy = new THREE.Object3D();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      for (let i = 0; i < count; i++) {
        const b = beans[i];

        // 1. Advance slowly along X axis
        b.x += b.speed;

        // When bean flows past the far-right boundary, seamlessly wrap to the far-left
        // Both maxX and minX are far off-screen, so the user never sees any pop!
        if (b.x > maxX) {
          b.x = minX;
          b.baseYOffset = (Math.random() - 0.5) * 2.8;
          b.baseZOffset = (Math.random() - 0.5) * 3.2;
        }

        // Natural sine ribbon curve
        const targetY = Math.sin(b.x * 0.12) * 3.4 - (b.x / 36) * 2.5 + b.baseYOffset;
        const targetZ = b.baseZOffset;

        // 2. Realistic Cursor Disturbance (Oryzo screen recording effect!)
        const dx = b.x - mouse3D.x;
        const dy = b.y - mouse3D.y;
        const distSq = dx * dx + dy * dy;
        const repulseRadius = 4.2;

        if (distSq < repulseRadius * repulseRadius) {
          const dist = Math.sqrt(distSq) || 0.001;
          const force = ((repulseRadius - dist) / repulseRadius) * 0.18;

          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
          b.vz += (Math.random() - 0.5) * force * 1.5;

          // Impart tumbling spin when disturbed
          b.vrx += (Math.random() - 0.5) * force * 1.5;
          b.vry += (Math.random() - 0.5) * force * 1.5;
        }

        // 3. Spring physics restoring back to organic stream
        b.vx += (0 - (b.x - (b.x + b.vx))) * 0.01;
        b.vy += (targetY - b.y) * 0.03;
        b.vz += (targetZ - b.z) * 0.03;

        // Damping
        b.vx *= 0.9;
        b.vy *= 0.9;
        b.vz *= 0.9;

        b.y += b.vy;
        b.z += b.vz;

        // Rotational inertia
        b.rx += b.vrx;
        b.ry += b.vry;
        b.rz += b.vrz;
        b.vrx *= 0.98;
        b.vry *= 0.98;
        b.vrz *= 0.98;

        // Update Three.js instance matrix
        dummy.position.set(b.x, b.y, b.z);
        dummy.rotation.set(b.rx, b.ry, b.rz);
        dummy.scale.setScalar(b.scale);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
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
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [count, speedMultiplier]);

  return <div ref={containerRef} className={className} />;
};
