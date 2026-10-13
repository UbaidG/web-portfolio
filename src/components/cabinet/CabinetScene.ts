import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { Spring } from "../../lib/motion/spring";
import { DRAWER_LOGOS } from "./logos";

export const DRAWER_OPEN = 0.4;
/** Local point just above the drawer box's open top, where certificates rise from. */
const MOUTH_LOCAL = new THREE.Vector3(0, 0.12, 0.14);

function labelTexture(numeral: string, text: string, anisotropy: number) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 320;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#f6efe6";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "rgba(30,22,19,0.22)";
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, c.width - 36, c.height - 36);

  const divider = 230;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "#c95c22";
  ctx.font = `700 ${numeral.length > 2 ? 104 : 136}px 'JetBrains Mono', monospace`;
  ctx.fillText(numeral, divider / 2 + 8, c.height / 2 + 6);
  ctx.fillStyle = "rgba(30,22,19,0.25)";
  ctx.fillRect(divider, 60, 4, c.height - 120);

  ctx.fillStyle = "#1e1613";
  const words = text.split(" ");
  const textX = (divider + c.width - 30) / 2;
  const maxW = c.width - divider - 80;
  let size = 150;
  const fit = (lines: string[], min: number) => {
    for (size = 150; size >= min; size -= 4) {
      ctx.font = `800 ${size}px 'Plus Jakarta Sans', sans-serif`;
      if (lines.every((l) => ctx.measureText(l).width <= maxW)) return true;
    }
    return false;
  };
  if (fit([text], 104) || words.length < 2) {
    ctx.fillText(text, textX, c.height / 2 + 6);
  } else {
    const lines = [words.slice(0, -1).join(" "), words[words.length - 1]];
    fit(lines, 60);
    size = Math.min(size, 112);
    ctx.font = `800 ${size}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText(lines[0], textX, c.height / 2 - size * 0.48);
    ctx.fillText(lines[1], textX, c.height / 2 + size * 0.56);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.anisotropy = anisotropy;
  return tex;
}

const LOGO_BOX = { w: 0.09, h: 0.058, margin: 0.03 };
const svgLoader = new SVGLoader();

/** A raised stamp of the logo, in drawer-local space, sitting in the front's bottom-right corner. */
function logoStamp(pathData: string, front: THREE.Mesh, material: THREE.Material) {
  const shapes = svgLoader
    .parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${pathData}"/></svg>`)
    .paths.flatMap((p) => p.toShapes());
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 0.32,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.07,
    bevelSegments: 3,
  });
  geo.computeBoundingBox();
  const b = geo.boundingBox!;
  const s = Math.min(LOGO_BOX.w / (b.max.x - b.min.x), LOGO_BOX.h / (b.max.y - b.min.y));
  geo.translate(-(b.min.x + b.max.x) / 2, -(b.min.y + b.max.y) / 2, -b.max.z);
  // SVG is y-down; flipping z too keeps the winding (and normals) outward.
  geo.scale(s, -s, -s);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  const lb = geo.boundingBox!;

  front.geometry.computeBoundingBox();
  const fb = front.geometry.boundingBox!.clone().translate(front.position);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(
    fb.max.x - LOGO_BOX.margin - lb.max.x,
    fb.min.y + LOGO_BOX.margin - lb.min.y,
    fb.max.z - 0.0004
  );
  return mesh;
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.75)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export interface CabinetFrameInput {
  dt: number;
  /** 0..1 open amount per drawer from scroll. */
  open: number[];
  pointerNx: number;
  pointerNy: number;
  pointerInside: boolean;
  pointerX: number;
  pointerY: number;
}

export class CabinetScene {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  root = new THREE.Group();
  drawers: THREE.Object3D[] = [];
  hovered = -1;
  ready = false;
  private disposed = false;
  private yaw = new Spring(0, { stiffness: 40, damping: 8 });
  private pitch = new Spring(0, { stiffness: 40, damping: 8 });
  private peek = [0, 1, 2, 3].map(() => new Spring(0, { stiffness: 220, damping: 9 }));
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private width = 1;
  private height = 1;
  private tmp = new THREE.Vector3();

  constructor(canvas: HTMLCanvasElement, labels: { numeral: string; text: string }[], modelUrl: string) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.35;

    const key = new THREE.DirectionalLight(0xfff1e0, 2.2);
    key.position.set(-2, 3, 3);
    this.scene.add(key);
    const rim = new THREE.PointLight(0xe27338, 3.2, 6, 1.6);
    rim.position.set(1.4, 1.6, -0.8);
    this.scene.add(rim);
    const fill = new THREE.PointLight(0xd4af37, 1.2, 5);
    fill.position.set(1.5, 0.6, 2.2);
    this.scene.add(fill);

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.001;
    this.root.add(shadow);
    this.scene.add(this.root);

    this.camera.position.set(1.7, 1.15, 4.4);
    this.camera.lookAt(0, 0.6, 0.1);

    const anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    Promise.all([
      new GLTFLoader().loadAsync(modelUrl),
      document.fonts.ready.then(() =>
        Promise.all([
          document.fonts.load("800 64px 'Plus Jakarta Sans'"),
          document.fonts.load("700 64px 'JetBrains Mono'"),
        ]).catch(() => undefined)
      ),
    ]).then(([gltf]) => {
      if (this.disposed) return;
      this.root.add(gltf.scene);
      let stampMaterial: THREE.MeshStandardMaterial | null = null;
      for (let i = 0; i < 4; i++) {
        const d = gltf.scene.getObjectByName(`Drawer_${i}`);
        if (!d) continue;
        const front = d.getObjectByName(`Drawer_${i}_Front`) as THREE.Mesh | undefined;
        const handle = d.getObjectByName(`Drawer_${i}_Handle`) as THREE.Mesh | undefined;
        if (front && DRAWER_LOGOS[i]) {
          if (!stampMaterial) {
            stampMaterial = ((handle ?? front).material as THREE.MeshStandardMaterial).clone();
            stampMaterial.roughness = Math.min(1, stampMaterial.roughness + 0.12);
          }
          d.add(logoStamp(DRAWER_LOGOS[i], front, stampMaterial));
        }
        d.userData.baseZ = d.position.z;
        d.traverse((o) => (o.userData.drawer = i));
        this.drawers.push(d);
        const label = d.getObjectByName(`Label_${i}`) as THREE.Mesh | undefined;
        if (label && labels[i]) {
          label.material = new THREE.MeshStandardMaterial({
            map: labelTexture(labels[i].numeral, labels[i].text, anisotropy),
            roughness: 0.85,
          });
        }
      }
      this.ready = true;
    });
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Shift the cabinet into the left third so the certificates have the rest of the stage.
    const shift = w > 820 ? w * 0.17 : 0;
    this.camera.setViewOffset(w, h, shift, 0, w, h);
    this.camera.updateProjectionMatrix();
  }

  /** Screen-space (px) position of a drawer's mouth. */
  mouthScreen(i: number): [number, number] {
    const d = this.drawers[i];
    if (!d) return [this.width * 0.3, this.height * 0.5];
    this.tmp.copy(MOUTH_LOCAL);
    d.localToWorld(this.tmp);
    this.tmp.project(this.camera);
    return [(this.tmp.x * 0.5 + 0.5) * this.width, (-this.tmp.y * 0.5 + 0.5) * this.height];
  }

  pick(x: number, y: number): number {
    if (!this.ready) return -1;
    this.ndc.set((x / this.width) * 2 - 1, -(y / this.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = this.raycaster.intersectObjects(this.drawers, true)[0];
    return hit ? (hit.object.userData.drawer as number) : -1;
  }

  frame(input: CabinetFrameInput) {
    const { dt } = input;
    this.yaw.target = input.pointerInside ? input.pointerNx * 0.16 : 0;
    this.pitch.target = input.pointerInside ? input.pointerNy * 0.05 : 0;
    this.root.rotation.y = -0.12 + this.yaw.step(dt);
    this.root.rotation.x = this.pitch.step(dt);

    this.hovered = input.pointerInside ? this.pick(input.pointerX, input.pointerY) : -1;
    this.drawers.forEach((d, i) => {
      const spring = this.peek[i];
      spring.target = this.hovered === i && input.open[i] < 0.05 ? 0.06 : 0;
      spring.step(dt);
      d.position.z = d.userData.baseZ + input.open[i] * DRAWER_OPEN + spring.value;
    });
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.renderer.dispose();
  }
}
