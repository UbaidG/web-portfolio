import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createCorkTexture, createCasinoChipTexture, createTarotCardTexture } from '../utils/textureGenerators';

interface TumblingCenterpieceCanvasProps {
  type: 'coaster' | 'casino_chip' | 'astronaut_helmet' | 'tarot_card' | 'ion_drive';
  scrollProgress: number; // 0 to 1
  className?: string;
  sizeMultiplier?: number;
}

export const TumblingCenterpieceCanvas: React.FC<TumblingCenterpieceCanvasProps> = ({
  type,
  scrollProgress,
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

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 2.5);
    rimLight.position.set(-8, -4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 2.0, 15);
    fillLight.position.set(0, -6, 4);
    scene.add(fillLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Build the specific 3D centerpiece
    let cleanupModel: () => void = () => {};

    if (type === 'coaster') {
      // The exact Oryzo cork coaster from the user's screenshot!
      // Create a beveled shallow bowl / coaster
      const coasterGroup = new THREE.Group();
      const corkTex = createCorkTexture();

      const corkMat = new THREE.MeshStandardMaterial({
        map: corkTex,
        roughness: 0.95,
        metalness: 0.05,
      });

      // Outer rim
      const outerCylinder = new THREE.CylinderGeometry(2.2, 2.0, 0.45, 48);
      const outerMesh = new THREE.Mesh(outerCylinder, corkMat);
      coasterGroup.add(outerMesh);

      // Recessed inner base
      const innerCylinder = new THREE.CylinderGeometry(1.85, 1.85, 0.25, 48);
      const innerMat = new THREE.MeshStandardMaterial({
        map: corkTex,
        roughness: 0.88,
        color: 0x9a6b43,
      });
      const innerMesh = new THREE.Mesh(innerCylinder, innerMat);
      innerMesh.position.y = 0.12;
      coasterGroup.add(innerMesh);

      coasterGroup.scale.setScalar(sizeMultiplier * 1.1);
      rootGroup.add(coasterGroup);

      cleanupModel = () => {
        outerCylinder.dispose();
        innerCylinder.dispose();
        corkMat.dispose();
        innerMat.dispose();
        corkTex.dispose();
      };
    } else if (type === 'casino_chip') {
      // High-roller casino chip / gold bullion coin
      const chipGroup = new THREE.Group();
      const chipTex = createCasinoChipTexture('UBAID GHANTE', '170M+', '#059669');

      // Top face
      const faceGeom = new THREE.CylinderGeometry(2.1, 2.1, 0.35, 48);
      const faceMat = new THREE.MeshStandardMaterial({
        map: chipTex,
        roughness: 0.22,
        metalness: 0.75,
      });
      const chipMesh = new THREE.Mesh(faceGeom, faceMat);
      chipGroup.add(chipMesh);

      // Gold outer knurled ridge
      const rimGeom = new THREE.TorusGeometry(2.12, 0.12, 16, 64);
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.15,
        metalness: 0.95,
      });
      const rimMesh = new THREE.Mesh(rimGeom, goldMat);
      rimMesh.rotation.x = Math.PI / 2;
      chipGroup.add(rimMesh);

      chipGroup.scale.setScalar(sizeMultiplier * 1.15);
      rootGroup.add(chipGroup);

      cleanupModel = () => {
        faceGeom.dispose();
        rimGeom.dispose();
        faceMat.dispose();
        goldMat.dispose();
        chipTex.dispose();
      };
    } else if (type === 'tarot_card') {
      // 3D Thick Arcana Card with gold edges
      const cardGroup = new THREE.Group();
      const cardFrontTex = createTarotCardTexture('The Magician', 'I', '170M+ Scale Architect', '✦');
      const cardBackTex = createTarotCardTexture('Ubaid Arcana', '∞', 'Mastery in AI Systems', '⚜');

      const cardGeom = new THREE.BoxGeometry(2.4, 3.8, 0.08);
      const goldEdgeMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.2 });
      const frontMat = new THREE.MeshStandardMaterial({ map: cardFrontTex, roughness: 0.3, metalness: 0.4 });
      const backMat = new THREE.MeshStandardMaterial({ map: cardBackTex, roughness: 0.3, metalness: 0.4 });

      // Materials for 6 faces: right, left, top, bottom, front, back
      const mats = [goldEdgeMat, goldEdgeMat, goldEdgeMat, goldEdgeMat, frontMat, backMat];
      const cardMesh = new THREE.Mesh(cardGeom, mats);
      cardGroup.add(cardMesh);

      cardGroup.scale.setScalar(sizeMultiplier * 1.0);
      rootGroup.add(cardGroup);

      cleanupModel = () => {
        cardGeom.dispose();
        goldEdgeMat.dispose();
        frontMat.dispose();
        backMat.dispose();
        cardFrontTex.dispose();
        cardBackTex.dispose();
      };
    } else if (type === 'astronaut_helmet') {
      // Load real GLTF DamagedHelmet
      const loader = new GLTFLoader();
      const baseUrl = import.meta.env.BASE_URL || '/';
      loader.load(
        `${baseUrl}models/DamagedHelmet.glb`,
        (gltf) => {
          const model = gltf.scene;
          model.scale.setScalar(sizeMultiplier * 1.85);
          model.position.set(0, -0.2, 0);
          rootGroup.add(model);
        },
        undefined,
        () => {
          // Fallback: procedural metallic sphere
          const fallbackGeom = new THREE.SphereGeometry(1.6, 32, 32);
          const fallbackMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            roughness: 0.2,
            metalness: 0.8,
          });
          const fallbackMesh = new THREE.Mesh(fallbackGeom, fallbackMat);
          rootGroup.add(fallbackMesh);
        }
      );
    } else if (type === 'ion_drive') {
      // Load real GLTF PrimaryIonDrive
      const loader = new GLTFLoader();
      const baseUrl = import.meta.env.BASE_URL || '/';
      loader.load(
        `${baseUrl}models/PrimaryIonDrive.glb`,
        (gltf) => {
          const model = gltf.scene;
          model.scale.setScalar(sizeMultiplier * 1.4);
          rootGroup.add(model);
        },
        undefined,
        () => {
          // Fallback
          const fallbackGeom = new THREE.TorusKnotGeometry(1.3, 0.4, 64, 16);
          const fallbackMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.2,
            metalness: 0.9,
          });
          const fallbackMesh = new THREE.Mesh(fallbackGeom, fallbackMat);
          rootGroup.add(fallbackMesh);
        }
      );
    }

    // Pointer move for subtle tilt wobble
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.targetX = nx * 0.7;
      mouseRef.current.targetY = ny * 0.7;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop synced to scrollProgress
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const p = scrollRef.current; // 0 to 1

      // Physical tumbling motion driven by scroll!
      // In Oryzo screenshot: coaster rotates diagonally and tumbles smoothly as you scroll
      rootGroup.rotation.x = 0.55 + p * Math.PI * 3.6 + mouseRef.current.y * 0.4 + Math.sin(elapsed * 0.8) * 0.08;
      rootGroup.rotation.y = 0.35 + p * Math.PI * 4.2 + mouseRef.current.x * 0.5 + Math.cos(elapsed * 0.7) * 0.08;
      rootGroup.rotation.z = Math.sin(p * Math.PI * 3) * 0.6 + mouseRef.current.x * 0.2;

      // Slight breathing vertical bob
      rootGroup.position.y = Math.sin(elapsed * 1.5) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 600;
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
      cleanupModel();
    };
  }, [type, sizeMultiplier]);

  return <div ref={containerRef} className={className} />;
};
