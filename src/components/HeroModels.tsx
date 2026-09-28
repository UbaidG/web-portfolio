import { useEffect, useRef, type CSSProperties, type FC } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { usePrefersReducedMotion } from "../hooks/useMotionPreference";

type ModelId = "bolt" | "diploma" | "mic" | "cup" | "target" | "sparkle";

type HeroModel = {
  id: ModelId;
  node: string;
  label: string;
  // Desktop placement of the model's centre, as a percentage of the hero.
  x: number;
  y: number;
  // Stage size in CSS px at a 1440px wide viewport.
  size: number;
  rot: number;
  depth: number;
  yaw: number;
  // Rest tilt toward the viewer, in radians.
  pitch?: number;
};

const HERO_MODELS: HeroModel[] = [
  { id: "bolt", node: "Bolt", label: "170M+ User Profiles", x: 13.5, y: 21, size: 172, rot: -6, depth: 0.8, yaw: 0.35 },
  { id: "diploma", node: "Diploma", label: "Bachelor's Degree", x: 86.5, y: 22, size: 178, rot: 5, depth: 0.6, yaw: -0.3 },
  { id: "mic", node: "Mic", label: "Real-Time Voice AI", x: 8.5, y: 49, size: 172, rot: 4, depth: 0.5, yaw: 0.3 },
  { id: "cup", node: "Cup", label: "3+ Years Shipping ML", x: 90.5, y: 52, size: 178, rot: -5, depth: 0.9, yaw: -0.35, pitch: 0.42 },
  { id: "target", node: "Target", label: "40% Less Process Time", x: 18.5, y: 73, size: 152, rot: -3, depth: 1, yaw: 0.4 },
  { id: "sparkle", node: "Sparkle", label: "Agentic AI & MCP", x: 80.5, y: 74, size: 142, rot: 3, depth: 0.7, yaw: -0.2 },
];

// One-shot actions play for this long; the others follow hover.
const ACTION_SECONDS: Partial<Record<ModelId, number>> = {
  bolt: 0.95,
  mic: 1.5,
  target: 1.1,
  sparkle: 1.2,
};

const MODEL_FILL = 0.86;
const CAMERA_FOV = 20;
const TOUCH_HOLD_SECONDS = 2.6;
const SCROLL_PARALLAX_QUERY = "(min-width: 1100px)";
const SCROLL_RATE_MIN = 0.3;
const SCROLL_RATE_MAX = 0.8;
const SIZE_MIN = Math.min(...HERO_MODELS.map((model) => model.size));
const SIZE_MAX = Math.max(...HERO_MODELS.map((model) => model.size));
const scrollRate = (size: number) =>
  SCROLL_RATE_MIN + ((size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN || 1)) * (SCROLL_RATE_MAX - SCROLL_RATE_MIN);

// Diploma paper, in model units (the rolled scroll is 1 unit tall).
const SHEET_WIDTH = 1.5;
const SHEET_HEIGHT = 1;
const ROLL_INNER_RADIUS = 0.04;
const ROLL_GROWTH = 0.0051;
const RIBBON_RADIUS = 0.13;
const ROLLED_TILT = -0.42;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeOutBack = (t: number) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
const bump = (value: number, centre: number, width: number) =>
  Math.max(0, 1 - Math.abs(value - centre) / width);

type Runtime = {
  config: HeroModel;
  index: number;
  item: HTMLElement;
  stage: HTMLElement;
  anchor: THREE.Group;
  motion: THREE.Group;
  phase: number;
  cx: number;
  cy: number;
  scroll: number;
  hovered: boolean;
  holdFrom: number;
  holdUntil: number;
  hold: number;
  actionStart: number;
  animate: (runtime: Runtime, time: number, dt: number) => void;
};

const noAnimation = () => undefined;

// Arc length from the free end of the paper to the spiral angle, inverted.
const spiralAngle = (fromFreeEnd: number) =>
  (-ROLL_INNER_RADIUS +
    Math.sqrt(ROLL_INNER_RADIUS * ROLL_INNER_RADIUS + 2 * ROLL_GROWTH * fromFreeEnd)) /
  ROLL_GROWTH;

const drawCertificate = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 800;
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  context.fillStyle = "#fbf4e6";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#e27338";
  context.lineWidth = 12;
  context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
  context.strokeStyle = "#2b5641";
  context.lineWidth = 3;
  context.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  context.textAlign = "center";
  context.fillStyle = "#5c4f48";
  context.font = "600 38px Georgia, serif";
  context.fillText("C E R T I F I C A T E   O F   D E G R E E", 600, 160);
  context.fillStyle = "#1e1613";
  context.font = "italic 700 84px Georgia, serif";
  context.fillText("Bachelor of Technology", 600, 285);
  context.font = "500 44px Georgia, serif";
  context.fillText("Computer Science & Engineering", 600, 365);
  context.fillStyle = "#e27338";
  context.font = "700 68px Georgia, serif";
  context.fillText("CGPA 9.3", 600, 480);

  return canvas;
};

const createDiploma = (source: THREE.Object3D) => {
  const ribbon = source.getObjectByName("DiplomaRibbon") ?? new THREE.Group();
  const seal = source.getObjectByName("DiplomaSeal") ?? new THREE.Group();
  seal.position.set(0.3, -0.24, 0.012);

  const geometry = new THREE.PlaneGeometry(SHEET_WIDTH, SHEET_HEIGHT, 160, 1);
  geometry.translate(SHEET_WIDTH / 2, 0, 0);
  const positions = geometry.attributes.position as THREE.BufferAttribute;
  const rest = Float32Array.from(positions.array as Float32Array);

  const texture = new THREE.CanvasTexture(drawCertificate());
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const front = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85 })
  );
  const back = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: 0xf3e8d4, roughness: 0.85, side: THREE.BackSide })
  );

  const sheet = new THREE.Group();
  sheet.add(front, back, ribbon, seal);
  const tilt = new THREE.Group();
  tilt.add(sheet);

  let lastUnrolled = -1;
  const setUnrolled = (unrolled: number) => {
    const contactAngle = spiralAngle(SHEET_WIDTH - unrolled);
    const contactRadius = ROLL_INNER_RADIUS + ROLL_GROWTH * contactAngle;
    if (Math.abs(unrolled - lastUnrolled) > 1e-4) {
      lastUnrolled = unrolled;
      for (let index = 0; index < positions.count; index += 1) {
        const along = rest[index * 3];
        const y = rest[index * 3 + 1];
        if (along <= unrolled) {
          positions.setXYZ(index, along, y, 0);
          continue;
        }
        const angle = spiralAngle(SHEET_WIDTH - along);
        const radius = ROLL_INNER_RADIUS + ROLL_GROWTH * angle;
        const turn = contactAngle - angle;
        positions.setXYZ(
          index,
          unrolled + radius * Math.sin(turn),
          y,
          contactRadius - radius * Math.cos(turn)
        );
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
    }
    sheet.position.set(-unrolled / 2, 0, -contactRadius);
    ribbon.position.set(unrolled, 0, contactRadius - RIBBON_RADIUS);
  };
  setUnrolled(0);

  const animate = (runtime: Runtime) => {
    const open = runtime.hold;
    const ribbonOff = smoothstep(0, 0.16, open);
    ribbon.visible = ribbonOff < 1;
    ribbon.scale.setScalar(1 - ribbonOff);
    ribbon.position.y = ribbonOff * 0.12;
    const unrolled = SHEET_WIDTH * smoothstep(0.12, 1, open);
    setUnrolled(unrolled);
    seal.visible = unrolled > 0.35;
    seal.scale.setScalar(easeOutBack(smoothstep(0.35, 0.6, unrolled)));
    tilt.rotation.z = ROLLED_TILT * (1 - smoothstep(0.05, 0.5, open));
    const grow = smoothstep(0.15, 1, open);
    tilt.scale.setScalar(1 + 0.35 * grow);
    // Lifts the open sheet clear of its label.
    tilt.position.y = 0.2 * grow;
    runtime.motion.rotation.y *= 1 - 0.8 * open;
    runtime.motion.rotation.x *= 1 - 0.6 * open;
  };

  return { object: tilt, animate };
};

const createBolt = (content: THREE.Object3D) => {
  const materials: THREE.MeshStandardMaterial[] = [];
  content.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const material = (child.material as THREE.MeshStandardMaterial).clone();
    material.emissive = new THREE.Color(0xffd35a);
    material.emissiveIntensity = 0;
    child.material = material;
    materials.push(material);
  });

  return (runtime: Runtime, time: number) => {
    const progress = (time - runtime.actionStart) / (ACTION_SECONDS.bolt ?? 1);
    let glow = 0;
    if (progress >= 0 && progress < 1) {
      let lift = 0;
      let stretch = 0;
      let jitter = 0;
      if (progress < 0.16) {
        const k = easeOutCubic(progress / 0.16);
        lift = 0.1 * k;
        stretch = 0.06 * k;
      } else if (progress < 0.28) {
        const k = ((progress - 0.16) / 0.12) ** 2;
        lift = 0.1 - 0.28 * k;
        stretch = 0.06 - 0.2 * k;
      } else {
        const k = (progress - 0.28) / 0.72;
        const spring = Math.exp(-5 * k) * Math.cos(k * 14);
        lift = -0.18 * spring;
        stretch = -0.14 * spring;
        jitter = Math.sin(time * 90) * 0.025 * Math.exp(-7 * k);
      }
      glow = bump(progress, 0.3, 0.07) + 0.7 * bump(progress, 0.45, 0.05);
      runtime.motion.position.x += jitter;
      runtime.motion.position.y += lift;
      runtime.motion.scale.set(1 - stretch * 0.6, 1 + stretch, 1 - stretch * 0.6);
    }
    materials.forEach((material) => {
      material.emissiveIntensity = glow * 2.4;
    });
  };
};

const createMic = (anchor: THREE.Group, headCentre: THREE.Vector3) => {
  const arc = Math.PI * 0.55;
  const geometry = new THREE.TorusGeometry(1, 0.045, 8, 36, arc);
  const waves = Array.from({ length: 3 }, () =>
    [1, -1].map((side) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0xe27338,
        roughness: 0.6,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = side > 0 ? -arc / 2 : Math.PI - arc / 2;
      mesh.visible = false;
      anchor.add(mesh);
      return mesh;
    })
  );

  return (runtime: Runtime, time: number) => {
    const progress = (time - runtime.actionStart) / (ACTION_SECONDS.mic ?? 1);
    const active = progress >= 0 && progress < 1;
    waves.forEach((pair, wave) => {
      const local = (progress - wave * 0.16) / 0.6;
      const visible = active && local > 0 && local < 1;
      pair.forEach((mesh) => {
        mesh.visible = visible;
        if (!visible) return;
        mesh.position.set(headCentre.x, headCentre.y + runtime.motion.position.y, headCentre.z + 0.1);
        mesh.scale.setScalar(0.26 + 0.5 * easeOutCubic(local));
        (mesh.material as THREE.MeshStandardMaterial).opacity =
          0.9 * (1 - local) ** 1.5 * Math.min(1, local * 6);
      });
    });
    if (active) {
      const envelope = Math.sin(Math.PI * progress);
      runtime.motion.scale.set(1, 1 + 0.035 * Math.sin(time * 38) * envelope, 1);
    }
  };
};

type Puff = { mesh: THREE.Mesh; born: number; emitter: number; strength: number };

const createCup = (anchor: THREE.Group, coffeeTop: THREE.Vector3) => {
  const geometry = new THREE.SphereGeometry(1, 16, 12);
  const life = 2.1;
  const puffs: Puff[] = Array.from({ length: 32 }, () => {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    mesh.visible = false;
    anchor.add(mesh);
    return { mesh, born: -Infinity, emitter: 0, strength: 0 };
  });
  let owed = 0;
  let nextEmitter = 0;

  return (runtime: Runtime, time: number, dt: number) => {
    owed += dt * (1.4 + 10 * runtime.hold);
    while (owed >= 1) {
      owed -= 1;
      const puff = puffs.find((candidate) => time - candidate.born > life);
      if (!puff) break;
      puff.born = time;
      puff.emitter = nextEmitter;
      puff.strength = 0.16 + 0.34 * runtime.hold;
      nextEmitter = (nextEmitter + 1) % 3;
    }
    puffs.forEach((puff) => {
      const age = (time - puff.born) / life;
      puff.mesh.visible = age >= 0 && age < 1;
      if (!puff.mesh.visible) return;
      const lane = (puff.emitter - 1) * 0.1;
      puff.mesh.position.set(
        coffeeTop.x + lane + Math.sin(age * 6 + puff.emitter * 2.1) * 0.09 * age,
        coffeeTop.y + runtime.motion.position.y + 0.03 + age * 0.95,
        coffeeTop.z
      );
      const size = 0.018 + 0.036 * Math.sin(Math.PI * age ** 0.6);
      puff.mesh.scale.set(size, size * 2.2, size);
      (puff.mesh.material as THREE.MeshStandardMaterial).opacity =
        puff.strength * Math.sin(Math.PI * age) ** 1.5;
    });
  };
};

const createTarget = () => (runtime: Runtime, time: number) => {
  const progress = (time - runtime.actionStart) / (ACTION_SECONDS.target ?? 1);
  if (progress >= 0 && progress < 1) {
    runtime.motion.rotation.y += Math.PI * 2 * easeOutBack(progress);
  }
};

const createSparkle = (anchor: THREE.Group, content: THREE.Object3D) => {
  const body = content.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
  const twinkleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd98a, roughness: 0.5 });
  const twinkles = Array.from({ length: 7 }, (_, index) => {
    const mesh = new THREE.Mesh(body?.geometry ?? new THREE.OctahedronGeometry(0.5), twinkleMaterial);
    mesh.visible = false;
    anchor.add(mesh);
    return { mesh, angle: (index / 7) * Math.PI * 2 + 0.4, reach: 0.5 + (index % 3) * 0.12 };
  });
  body?.geometry.computeBoundingBox();
  const normalize = body?.geometry.boundingBox
    ? 1 / body.geometry.boundingBox.getSize(new THREE.Vector3()).x
    : 1;

  return (runtime: Runtime, time: number) => {
    const progress = (time - runtime.actionStart) / (ACTION_SECONDS.sparkle ?? 1);
    const active = progress >= 0 && progress < 1;
    if (active) {
      runtime.motion.rotation.z += Math.PI * easeOutBack(progress);
      runtime.motion.scale.multiplyScalar(1 + 0.3 * Math.sin(Math.PI * Math.min(progress / 0.5, 1)));
    }
    twinkles.forEach((twinkle) => {
      twinkle.mesh.visible = active;
      if (!active) return;
      const distance = 0.3 + twinkle.reach * easeOutCubic(progress);
      twinkle.mesh.position.set(
        Math.cos(twinkle.angle) * distance,
        Math.sin(twinkle.angle) * distance + runtime.motion.position.y,
        0.15
      );
      twinkle.mesh.scale.setScalar(0.17 * normalize * Math.sin(Math.PI * progress));
      twinkle.mesh.rotation.set(0.3, 0.2, progress * 4 + twinkle.angle);
    });
  };
};

// Centres a GLB node on the origin and scales its largest side to 1.
const normalizeNode = (node: THREE.Object3D) => {
  node.removeFromParent();
  node.position.set(0, 0, 0);
  node.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(node);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  node.position.sub(centre);
  const wrapper = new THREE.Group();
  wrapper.add(node);
  wrapper.scale.setScalar(1 / Math.max(size.x, size.y, size.z));
  return wrapper;
};

const centreOf = (object: THREE.Object3D | undefined, top = false) => {
  if (!object) return new THREE.Vector3();
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(object);
  const centre = box.getCenter(new THREE.Vector3());
  if (top) centre.y = box.max.y;
  return centre;
};

export const HeroModels: FC = () => {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const host = canvasHostRef.current;
    const list = listRef.current;
    const hero = list?.parentElement;
    if (!host || !list || !hero || prefersReducedMotion) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.55;
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0xd9c6b4, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(-0.6, 1, 0.9);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffe2c4, 0.7);
    rimLight.position.set(1, 0.2, -0.4);
    scene.add(rimLight);

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 1, 10000);
    const scrollQuery = window.matchMedia(SCROLL_PARALLAX_QUERY);
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const pointerTarget = new THREE.Vector2();
    const pointer = new THREE.Vector2();
    const runtimes: Runtime[] = [];
    const cleanups: (() => void)[] = [];
    let frameId = 0;
    let visible = true;
    let disposed = false;
    let lastTime = performance.now() / 1000;

    const measure = () => {
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const distance = height / 2 / Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));
      camera.position.set(width / 2, -height / 2, distance);
      camera.near = distance * 0.2;
      camera.far = distance * 3;
      camera.updateProjectionMatrix();

      const heroBounds = hero.getBoundingClientRect();
      runtimes.forEach((runtime) => {
        const bounds = runtime.stage.getBoundingClientRect();
        runtime.cx = bounds.left - heroBounds.left + bounds.width / 2;
        runtime.cy = bounds.top - heroBounds.top + bounds.height / 2 - runtime.scroll;
        runtime.anchor.scale.setScalar(bounds.width * MODEL_FILL);
      });
    };

    const trigger = (runtime: Runtime, delay = 0) => {
      const now = performance.now() / 1000 + delay;
      const duration = ACTION_SECONDS[runtime.config.id];
      if (duration === undefined) {
        runtime.holdFrom = now;
        runtime.holdUntil = now + TOUCH_HOLD_SECONDS;
      } else if (now - runtime.actionStart > duration * 0.7) {
        runtime.actionStart = now;
      }
    };

    const tick = (timestamp: number) => {
      const time = timestamp / 1000;
      const dt = Math.min(time - lastTime, 0.05);
      lastTime = time;
      pointer.x = THREE.MathUtils.damp(pointer.x, pointerTarget.x, 4, dt);
      pointer.y = THREE.MathUtils.damp(pointer.y, pointerTarget.y, 4, dt);

      const scrolled = scrollQuery.matches ? Math.max(0, -hero.getBoundingClientRect().top) : 0;

      runtimes.forEach((runtime) => {
        const { config, motion, anchor, phase } = runtime;
        const scroll = -scrolled * scrollRate(config.size);
        if (Math.abs(scroll - runtime.scroll) > 0.1 || (scroll === 0 && runtime.scroll !== 0)) {
          runtime.scroll = scroll;
          runtime.item.style.translate = scroll ? `0 ${scroll.toFixed(1)}px` : "";
        }
        const holding = runtime.hovered || (time >= runtime.holdFrom && time < runtime.holdUntil);
        runtime.hold = THREE.MathUtils.damp(runtime.hold, holding ? 1 : 0, 3.2, dt);
        anchor.position.set(
          runtime.cx + pointer.x * 16 * config.depth,
          -(runtime.cy + runtime.scroll + pointer.y * 10 * config.depth),
          0
        );
        motion.position.set(0, Math.sin(time * 1.2 + phase) * 0.035, 0);
        motion.rotation.set(
          (config.pitch ?? 0) + pointer.y * 0.25 * config.depth,
          config.yaw + Math.sin(time * 0.55 + phase) * 0.28 + pointer.x * 0.45 * config.depth,
          0
        );
        motion.scale.setScalar(1);
        runtime.animate(runtime, time, dt);
      });

      renderer.render(scene, camera);
      frameId = visible ? window.requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (frameId || disposed) return;
      lastTime = performance.now() / 1000;
      frameId = window.requestAnimationFrame(tick);
    };

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      `${import.meta.env.BASE_URL}assets/hero-models.glb`,
      (gltf) => {
        if (disposed) return;
        const items = Array.from(list.querySelectorAll<HTMLElement>("[data-model]"));

        HERO_MODELS.forEach((config, index) => {
          const item = items.find((element) => element.dataset.model === config.id);
          const stage = item?.querySelector<HTMLElement>(".hero-model-stage");
          const node = gltf.scene.getObjectByName(config.node);
          if (!item || !stage || !node) return;

          const anchor = new THREE.Group();
          const motion = new THREE.Group();
          anchor.add(motion);
          scene.add(anchor);

          let animate: Runtime["animate"] = noAnimation;
          if (config.id === "diploma") {
            node.removeFromParent();
            const diploma = createDiploma(node);
            motion.add(diploma.object);
            animate = diploma.animate;
          } else {
            const content = normalizeNode(node);
            motion.add(content);
            if (config.id === "bolt") animate = createBolt(content);
            if (config.id === "target") animate = createTarget();
            if (config.id === "sparkle") animate = createSparkle(anchor, content);
            if (config.id === "mic") {
              animate = createMic(anchor, centreOf(content.getObjectByName("MicHead")));
            }
            if (config.id === "cup") {
              animate = createCup(anchor, centreOf(content.getObjectByName("CupCoffee"), true));
            }
          }

          const runtime: Runtime = {
            config,
            index,
            item,
            stage,
            anchor,
            motion,
            phase: index * 1.7,
            cx: 0,
            cy: 0,
            scroll: 0,
            hovered: false,
            holdFrom: -Infinity,
            holdUntil: -Infinity,
            hold: 0,
            actionStart: -Infinity,
            animate,
          };
          runtimes.push(runtime);

          if (canHover) {
            const enter = () => {
              runtime.hovered = true;
              trigger(runtime);
            };
            const leave = () => {
              runtime.hovered = false;
            };
            item.addEventListener("pointerenter", enter);
            item.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              item.removeEventListener("pointerenter", enter);
              item.removeEventListener("pointerleave", leave);
            });
          } else {
            const tap = () => trigger(runtime);
            item.addEventListener("click", tap);
            cleanups.push(() => item.removeEventListener("click", tap));
          }
        });

        if (!canHover) {
          const seen = new Set<Element>();
          const revealObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting || seen.has(entry.target)) return;
                seen.add(entry.target);
                const runtime = runtimes.find((candidate) => candidate.item === entry.target);
                if (runtime) trigger(runtime, 0.2 + (runtime.index % 2) * 0.25);
              });
            },
            { threshold: 0.7 }
          );
          runtimes.forEach((runtime) => revealObserver.observe(runtime.item));
          cleanups.push(() => revealObserver.disconnect());
        }

        measure();
        renderer.render(scene, camera);
        list.classList.add("is-live");
        start();
      },
      undefined,
      (error) => console.error("Unable to load hero models.", error)
    );

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      pointerTarget.set(
        THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1)
      );
    };
    if (canHover) window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const resizeObserver = new ResizeObserver(measure);
    const handleScrollQueryChange = () => measure();
    scrollQuery.addEventListener("change", handleScrollQueryChange);
    resizeObserver.observe(hero);
    measure();
    document.fonts?.ready.then(() => {
      if (!disposed) measure();
    });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && runtimes.length) start();
    });
    visibilityObserver.observe(hero);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      scrollQuery.removeEventListener("change", handleScrollQueryChange);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      list.classList.remove("is-live");
      runtimes.forEach((runtime) => runtime.item.style.removeProperty("translate"));

      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          (material as THREE.MeshStandardMaterial).map?.dispose();
          material.dispose();
        });
      });
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <div ref={canvasHostRef} className="hero-models-canvas" aria-hidden="true" />
      <ul ref={listRef} className="hero-models">
        {HERO_MODELS.map((model) => (
          <li
            key={model.id}
            className={`hero-model hero-model--${model.id}`}
            data-model={model.id}
            style={
              {
                "--x": `${model.x}%`,
                "--y": `${model.y}%`,
                "--s": model.size,
                "--rot": `${model.rot}deg`,
              } as CSSProperties
            }
          >
            <div className="hero-model-stage" aria-hidden="true">
              <img
                src={`${import.meta.env.BASE_URL}assets/hero-models/${model.node.toLowerCase()}.webp`}
                alt=""
                width={320}
                height={320}
                decoding="async"
              />
            </div>
            <span className="hero-model-label">{model.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
};
