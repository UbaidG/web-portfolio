import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../hooks/useMotionPreference";
import { createCoffeeStillLife } from "../utils/coffeeAssets";

interface CoffeeMug3DCanvasProps {
  progress?: number;
  className?: string;
}

function disposeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Points)) {
      return;
    }

    object.geometry.dispose();
    const material = object.material;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((entry) => {
      Object.values(entry).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      entry.dispose();
    });
  });
}

export const CoffeeMug3DCanvas: React.FC<CoffeeMug3DCanvasProps> = ({
  progress = 0,
  className = "coffee-scene",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const reducedMotion = usePrefersReducedMotion();
  const [fallback, setFallback] = useState(false);

  progressRef.current = progress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFallback(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.9, 9);
    camera.lookAt(0, 0.55, 0);

    const rendererPixelRatio = Math.min(window.devicePixelRatio, 1.65);
    renderer.setPixelRatio(rendererPixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const ambient = new THREE.HemisphereLight(
      0xfff4e7,
      0x22130e,
      1.8,
    );
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffe7cb, 3.8);
    key.position.set(4, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -4;
    scene.add(key);

    const rim = new THREE.PointLight(0xffa45f, 5, 12, 2);
    rim.position.set(-3, 1.4, -2.5);
    scene.add(rim);

    const root = new THREE.Group();
    root.position.set(-0.28, -0.08, 0);
    root.scale.setScalar(0.78);
    scene.add(root);

    const stillLife = createCoffeeStillLife();
    root.add(stillLife.group);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onPointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(container);

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    window.addEventListener("resize", resize);

    const timer = new THREE.Timer();
    timer.connect(document);
    let animationFrame = 0;
    const animate = () => {
      animationFrame = window.requestAnimationFrame((timestamp) => {
        timer.update(timestamp);
        animate();
      });
      if (!visible) return;

      const delta = Math.min(timer.getDelta(), 0.05);
      const time = timer.getElapsed();
      const sceneProgress = progressRef.current;

      pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 4.5, delta);
      pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 4.5, delta);

      const rotationTarget = sceneProgress * Math.PI * 0.9 + pointer.x * 0.16;
      root.rotation.y = THREE.MathUtils.damp(root.rotation.y, rotationTarget, 3.6, delta);
      root.rotation.x = THREE.MathUtils.damp(
        root.rotation.x,
        0.03 - pointer.y * 0.08 + sceneProgress * 0.1,
        3.6,
        delta,
      );
      root.position.y = -0.22 + (reducedMotion ? 0 : Math.sin(time * 0.65) * 0.035);

      stillLife.update(time, delta, reducedMotion);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      timer.dispose();
      disposeScene(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {fallback && (
        <div className="coffee-scene__fallback" aria-hidden="true">
          <span className="coffee-scene__fallback-cup" />
          <span className="coffee-scene__fallback-handle" />
          <span className="coffee-scene__fallback-saucer" />
        </div>
      )}
    </div>
  );
};
