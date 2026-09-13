import * as THREE from "three";

interface CoffeePalette {
  cup: number;
  cupHighlight: number;
  saucer: number;
  coffee: number;
  crema: number;
  steam: number;
  shadow: string;
}

const palette: CoffeePalette = {
  cup: 0xd8c5b0,
  cupHighlight: 0xf3e7d7,
  saucer: 0xb69a7b,
  coffee: 0x25120d,
  crema: 0xb86b3e,
  steam: 0xfff5e9,
  shadow: "rgba(38, 20, 12, 0.28)",
};

function createSoftShadowTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createRadialGradient(128, 64, 4, 128, 64, 128);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSteamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,0.55)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.2)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLathedCupGeometry(): THREE.LatheGeometry {
  const profile = [
    new THREE.Vector2(0.7, -1.02),
    new THREE.Vector2(0.87, -0.98),
    new THREE.Vector2(1.01, -0.68),
    new THREE.Vector2(1.09, 0.77),
    new THREE.Vector2(1.06, 0.98),
    new THREE.Vector2(0.94, 1.04),
    new THREE.Vector2(0.84, 0.88),
    new THREE.Vector2(0.79, -0.62),
    new THREE.Vector2(0.64, -0.88),
  ];
  return new THREE.LatheGeometry(profile, 64);
}

function createSteam(
  color: number,
): { points: THREE.Points; update: (time: number, delta: number) => void } {
  const count = 36;
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.5;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = 1.02 + Math.random() * 2.25;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.55;
    phases[index] = Math.random() * Math.PI * 2;
    speeds[index] = 0.18 + Math.random() * 0.12;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size: 0.23,
    map: createSteamTexture(),
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.NormalBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);

  return {
    points,
    update: (time, delta) => {
      const position = geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let index = 0; index < count; index += 1) {
        let y = position.getY(index) + speeds[index] * delta;
        if (y > 3.55) y = 1.02 + Math.random() * 0.22;

        const phase = phases[index];
        const height = y - 1;
        const sway = 0.08 + height * 0.12;
        position.setXYZ(
          index,
          Math.sin(time * 0.75 + phase + y * 1.7) * sway,
          y,
          Math.cos(time * 0.6 + phase + y * 1.3) * sway * 0.5,
        );
      }
      position.needsUpdate = true;
    },
  };
}

export function createCoffeeStillLife(): {
  group: THREE.Group;
  update: (time: number, delta: number, reducedMotion: boolean) => void;
} {
  const group = new THREE.Group();

  const ceramicMaterial = new THREE.MeshPhysicalMaterial({
    color: palette.cup,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0.72,
    clearcoatRoughness: 0.18,
  });
  const rimMaterial = new THREE.MeshPhysicalMaterial({
    color: palette.cupHighlight,
    roughness: 0.18,
    clearcoat: 0.8,
    clearcoatRoughness: 0.14,
  });
  const saucerMaterial = new THREE.MeshStandardMaterial({
    color: palette.saucer,
    roughness: 0.48,
  });
  const coffeeMaterial = new THREE.MeshPhysicalMaterial({
    color: palette.coffee,
    roughness: 0.12,
    metalness: 0.12,
    clearcoat: 0.65,
    clearcoatRoughness: 0.08,
  });
  const cremaMaterial = new THREE.MeshBasicMaterial({
    color: palette.crema,
    transparent: true,
    opacity: 0.74,
    side: THREE.DoubleSide,
  });

  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(1.62, 1.75, 0.12, 64),
    saucerMaterial,
  );
  saucer.position.y = -1.1;
  saucer.castShadow = true;
  saucer.receiveShadow = true;
  group.add(saucer);

  const saucerRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.055, 12, 64),
    rimMaterial,
  );
  saucerRim.rotation.x = Math.PI / 2;
  saucerRim.position.y = -1.02;
  group.add(saucerRim);

  const cup = new THREE.Mesh(createLathedCupGeometry(), ceramicMaterial);
  cup.castShadow = true;
  cup.receiveShadow = true;
  group.add(cup);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.005, 0.085, 18, 64),
    rimMaterial,
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.99;
  group.add(rim);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.13, 18, 64, Math.PI * 1.36),
    ceramicMaterial,
  );
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(1.03, -0.02, 0);
  handle.castShadow = true;
  group.add(handle);

  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.89, 64),
    coffeeMaterial,
  );
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.97;
  group.add(coffee);

  const cremaOuter = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.06, 14, 64),
    cremaMaterial,
  );
  cremaOuter.rotation.x = Math.PI / 2;
  cremaOuter.position.y = 0.982;
  group.add(cremaOuter);

  const cremaInner = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.035, 12, 48),
    cremaMaterial,
  );
  cremaInner.rotation.x = Math.PI / 2;
  cremaInner.position.y = 0.985;
  group.add(cremaInner);

  const shadowTexture = createSoftShadowTexture(palette.shadow);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 2.25),
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -1.17, 0.1);
  group.add(shadow);

  const steam = createSteam(palette.steam);
  group.add(steam.points);

  const update = (time: number, delta: number, reducedMotion: boolean) => {
    if (!reducedMotion) {
      steam.update(time, delta);
      saucerRim.rotation.z = Math.sin(time * 0.16) * 0.012;
      cremaOuter.rotation.z = time * 0.04;
      cremaInner.rotation.z = -time * 0.065;
    }
  };

  return { group, update };
}
