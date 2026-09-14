import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../hooks/useMotionPreference";

interface CoffeeBeanStreamCanvasProps {
  className?: string;
}

interface BeanState {
  seed: number;
  speed: number;
  lane: number;
  size: number;
  depth: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
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

function createBeanGeometry(): THREE.SphereGeometry {
  const geometry = new THREE.SphereGeometry(1, 16, 10);
  const position = geometry.getAttribute("position");

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const seam = Math.exp(-((x / 0.16) ** 2)) * 0.13 * (1 - Math.abs(y) * 0.35);
    position.setZ(index, z - seam);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function getFlowPoint(
  progress: number,
  worldWidth: number,
  target: THREE.Vector2,
): THREE.Vector2 {
  const x = THREE.MathUtils.lerp(-worldWidth * 0.7, worldWidth * 0.7, progress);
  const wave =
    1.35 -
    progress * 2.7 +
    Math.sin(progress * Math.PI * 2.2 - 0.65) * 0.42 +
    Math.sin(progress * Math.PI * 5.4 + 0.4) * 0.16;

  return target.set(x, wave);
}

export const CoffeeBeanStreamCanvas: React.FC<CoffeeBeanStreamCanvasProps> = ({
  className = "bean-stream-canvas",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [fallback, setFallback] = useState(false);

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
    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 100);
    camera.position.z = 20;

    const rendererPixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(rendererPixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const ambient = new THREE.HemisphereLight(0x8b4d2a, 0x070403, 2.1);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffc38a, 4.8);
    key.position.set(-3, 5, 8);
    scene.add(key);

    const warmFill = new THREE.PointLight(0xc85c26, 8, 18, 2);
    warmFill.position.set(2, -1, 5);
    scene.add(warmFill);

    const beanGeometry = createBeanGeometry();
    const beanMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3d1709,
      roughness: 0.42,
      metalness: 0.02,
      clearcoat: 0.3,
      clearcoatRoughness: 0.24,
      vertexColors: true,
    });
    const beanCount = 260;
    const beans = new THREE.InstancedMesh(beanGeometry, beanMaterial, beanCount);
    beans.frustumCulled = false;
    scene.add(beans);

    const states: BeanState[] = Array.from({ length: beanCount }, () => ({
      seed: Math.random(),
      speed: 0.012 + Math.random() * 0.019,
      lane: (Math.random() - 0.5) * 2.8,
      size: 0.1 + Math.random() * 0.13,
      depth: (Math.random() - 0.5) * 1.6,
      rotation: Math.random() * Math.PI,
      offsetX: 0,
      offsetY: 0,
      velocityX: 0,
      velocityY: 0,
    }));

    const instanceColor = new THREE.Color();
    states.forEach((_, index) => {
      instanceColor.setHSL(
        0.045 + Math.random() * 0.025,
        0.56 + Math.random() * 0.18,
        0.075 + Math.random() * 0.12,
      );
      beans.setColorAt(index, instanceColor);
    });
    if (beans.instanceColor) beans.instanceColor.needsUpdate = true;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };
    const dummy = new THREE.Object3D();
    const flowPoint = new THREE.Vector2();
    const nextFlowPoint = new THREE.Vector2();
    const tangent = new THREE.Vector2();
    const normal = new THREE.Vector2();
    let worldWidth = 16;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const rect = container.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.targetX = normalizedX * (worldWidth / 2);
      pointer.targetY = normalizedY * 5;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
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
      const aspect = width / height;
      worldWidth = 10 * aspect;
      camera.left = -worldWidth / 2;
      camera.right = worldWidth / 2;
      camera.top = 5;
      camera.bottom = -5;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const updateBeans = (time: number, delta: number) => {
      pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 4.5, delta);
      pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 4.5, delta);

      states.forEach((state, index) => {
        const progress = (state.seed + time * state.speed) % 1;
        getFlowPoint(progress, worldWidth, flowPoint);
        getFlowPoint(Math.min(1, progress + 0.006), worldWidth, nextFlowPoint);
        tangent.copy(nextFlowPoint).sub(flowPoint).normalize();
        normal.set(-tangent.y, tangent.x);
        const lane = state.lane * (0.42 + Math.sin(progress * Math.PI) * 0.22);
        const baseX = flowPoint.x + normal.x * lane;
        const baseY = flowPoint.y + normal.y * lane;

        let targetOffsetX = 0;
        let targetOffsetY = 0;
        if (pointer.active) {
          const distanceX = baseX + state.offsetX - pointer.x;
          const distanceY = baseY + state.offsetY - pointer.y;
          const distance = Math.hypot(distanceX, distanceY);
          const radius = 2.2;

          if (distance < radius) {
            const falloff = (1 - distance / radius) ** 2;
            const directionX = distance > 0.001 ? distanceX / distance : 0;
            const directionY = distance > 0.001 ? distanceY / distance : 1;
            targetOffsetX = directionX * falloff * 1.1;
            targetOffsetY = directionY * falloff * 1.1;
          }
        }

        if (!reducedMotion) {
          state.velocityX +=
            ((targetOffsetX - state.offsetX) * 28 - state.velocityX * 8) * delta;
          state.velocityY +=
            ((targetOffsetY - state.offsetY) * 28 - state.velocityY * 8) * delta;
          state.offsetX += state.velocityX * delta;
          state.offsetY += state.velocityY * delta;
        }

        const drift = reducedMotion ? 0 : Math.sin(time * 1.6 + state.seed * 9) * 0.04;
        dummy.position.set(
          baseX + state.offsetX,
          baseY + state.offsetY + drift,
          state.depth + Math.sin(time * 0.6 + state.seed * 8) * 0.12,
        );
        dummy.rotation.set(
          Math.sin(time * 0.5 + state.seed * 4) * 0.25,
          Math.cos(time * 0.7 + state.seed * 5) * 0.3,
          Math.atan2(tangent.y, tangent.x) + state.rotation,
        );
        dummy.scale.set(state.size * 1.55, state.size * 0.9, state.size * 0.5);
        dummy.updateMatrix();
        beans.setMatrixAt(index, dummy.matrix);
      });

      beans.instanceMatrix.needsUpdate = true;
    };

    resize();
    updateBeans(0, 0);
    renderer.render(scene, camera);
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", resize);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        disposeScene(scene);
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }

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
      updateBeans(timer.getElapsed(), delta);
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
    <div ref={containerRef} className={className} aria-hidden="true">
      {fallback && <div className="bean-stream-canvas__fallback" />}
    </div>
  );
};
