import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Spring } from "../../physics/spring";

export const DRAWER_OPEN = 0.4;
/** Local point just above the drawer box's open top, where certificates rise from. */
const MOUTH_LOCAL = new THREE.Vector3(0, 0.12, 0.14);

function labelTexture(numeral: string, text: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 184;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fbf8f5";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "rgba(30,22,19,0.15)";
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, c.width - 28, c.height - 28);
  ctx.fillStyle = "#e27338";
  ctx.font = "600 56px 'JetBrains Mono', monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(numeral, 40, c.height / 2);
  ctx.fillStyle = "#1e1613";
  ctx.font = "800 64px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(text, numeral.length > 2 ? 170 : 140, c.height / 2 + 4, c.width - 190);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
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

    new GLTFLoader().load(modelUrl, (gltf) => {
      this.root.add(gltf.scene);
      for (let i = 0; i < 4; i++) {
        const d = gltf.scene.getObjectByName(`Drawer_${i}`);
        if (d) {
          d.userData.baseZ = d.position.z;
          d.traverse((o) => (o.userData.drawer = i));
          this.drawers.push(d);
        }
        const label = gltf.scene.getObjectByName(`Label_${i}`) as THREE.Mesh | undefined;
        if (label && labels[i]) {
          label.material = new THREE.MeshStandardMaterial({
            map: labelTexture(labels[i].numeral, labels[i].text),
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
    this.renderer.dispose();
  }
}
