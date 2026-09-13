import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCoffeeBeanGeometry } from '../utils/textureGenerators';

interface InteractiveSwarmCanvasProps {
  mode?: 'beans' | 'chips' | 'asteroids' | 'cards';
  count?: number;
  className?: string;
}

export const InteractiveSwarmCanvas: React.FC<InteractiveSwarmCanvasProps> = ({
  mode = 'beans',
  count = 140,
  className = 'absolute inset-0 pointer-events-auto z-10'
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe8d6, 3.5);
    keyLight.position.set(10, 15, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff8c00, 2.5);
    rimLight.position.set(-12, -8, -6);
    scene.add(rimLight);

    // Pick Geometry & Material based on mode
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    if (mode === 'beans') {
      geometry = createCoffeeBeanGeometry();
      material = new THREE.MeshStandardMaterial({
        color: 0x3d2314, // Roasted dark coffee bean brown
        roughness: 0.35,
        metalness: 0.15,
      });
    } else if (mode === 'chips') {
      geometry = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 24);
      material = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Gold poker chip
        roughness: 0.25,
        metalness: 0.85,
      });
    } else if (mode === 'asteroids') {
      geometry = new THREE.DodecahedronGeometry(0.5, 1);
      material = new THREE.MeshStandardMaterial({
        color: 0x475569, // Space rock slate
        roughness: 0.8,
        metalness: 0.2,
      });
    } else {
      // Cards / shards
      geometry = new THREE.BoxGeometry(0.7, 1.1, 0.05);
      material = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.15,
        metalness: 0.7,
      });
    }

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // Particle Physics State
    interface Particle {
      t: number; // progress along river curve (0 to 1)
      speed: number;
      streamY: number; // vertical baseline
      streamZ: number;
      curX: number;
      curY: number;
      curZ: number;
      vx: number;
      vy: number;
      vz: number;
      rx: number;
      ry: number;
      rz: number;
      vrx: number;
      vry: number;
      vrz: number;
      scale: number;
    }

    const particles: Particle[] = [];
    const spreadX = 28;

    for (let i = 0; i < count; i++) {
      const t = Math.random();
      // Flow along an organic diagonal ribbon curve from top-left to bottom-right
      const baseX = (t - 0.5) * spreadX;
      const baseY = Math.sin(t * Math.PI * 2.5) * 3.5 - (t - 0.5) * 6 + (Math.random() - 0.5) * 2.5;
      const baseZ = (Math.random() - 0.5) * 3.5;

      particles.push({
        t,
        speed: 0.0008 + Math.random() * 0.0008,
        streamY: baseY,
        streamZ: baseZ,
        curX: baseX,
        curY: baseY,
        curZ: baseZ,
        vx: 0,
        vy: 0,
        vz: 0,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        vrx: (Math.random() - 0.5) * 0.03,
        vry: (Math.random() - 0.5) * 0.03,
        vrz: (Math.random() - 0.5) * 0.03,
        scale: 0.7 + Math.random() * 0.6,
      });
    }

    // Mouse Tracking in 3D
    const mouse3D = new THREE.Vector3(999, 999, 0);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(999, 999);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNorm, camera);
      raycaster.ray.intersectPlane(planeZ, mouse3D);
    };

    window.addEventListener('mousemove', onPointerMove);

    // Animation Loop with Fluid Cursor Repulsion & Organic Trajectory
    let animId: number;
    const dummy = new THREE.Object3D();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // 1. Advance along the stream
        p.t += p.speed;
        if (p.t > 1.0) p.t -= 1.0;

        const targetX = (p.t - 0.5) * spreadX;
        const targetY = Math.sin(p.t * Math.PI * 2.5) * 3.5 - (p.t - 0.5) * 6 + p.streamY * 0.4;
        const targetZ = p.streamZ;

        // 2. Cursor repulsion physics (The Oryzo screen recording effect!)
        const dx = p.curX - mouse3D.x;
        const dy = p.curY - mouse3D.y;
        const distSq = dx * dx + dy * dy;
        const repulseRadius = 4.2;

        if (distSq < repulseRadius * repulseRadius) {
          const dist = Math.sqrt(distSq) || 0.001;
          const force = ((repulseRadius - dist) / repulseRadius) * 0.22;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.vz += (Math.random() - 0.5) * force * 1.5;

          // Impart rotational tumble when hit by cursor
          p.vrx += (Math.random() - 0.5) * force * 1.2;
          p.vry += (Math.random() - 0.5) * force * 1.2;
        }

        // 3. Spring physics pulling back to river path
        p.vx += (targetX - p.curX) * 0.035;
        p.vy += (targetY - p.curY) * 0.035;
        p.vz += (targetZ - p.curZ) * 0.035;

        // Damping
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.vz *= 0.88;

        p.curX += p.vx;
        p.curY += p.vy;
        p.curZ += p.vz;

        // Rotation
        p.rx += p.vrx;
        p.ry += p.vry;
        p.rz += p.vrz;
        p.vrx *= 0.96;
        p.vry *= 0.96;
        p.vrz *= 0.96;

        // Update Three.js instance matrix
        dummy.position.set(p.curX, p.curY, p.curZ);
        dummy.rotation.set(p.rx, p.ry, p.rz);
        dummy.scale.setScalar(p.scale);
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
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [mode, count]);

  return <div ref={containerRef} className={className} />;
};
