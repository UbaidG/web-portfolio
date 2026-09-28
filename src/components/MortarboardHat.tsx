import { useEffect, useRef, useState, type CSSProperties, type FC } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { usePrefersReducedMotion } from "../hooks/useMotionPreference";

type RopeParticle = {
  position: THREE.Vector3;
  previous: THREE.Vector3;
  inverseMass: number;
};

const DESKTOP_QUERY = "(min-width: 900px)";

// Position of the card's top-left corner inside the hat layers, in CSS px.
const CORNER_X = 190;
const CORNER_Y = 170;
const CARD_RADIUS = 18;
const LAYER_WIDTH = 330;

// Model-space measurements of mortarboard-hat.glb (Y up).
const OPENING_Y = 1.94;
const CROWN_TOP_Y = 3.46;
const BOARD_Y = 3.58;
const BOARD_TOP_Y = 3.7;
const BOARD_CORNER = 2.3;
const CORD_RADIUS = 0.055;
const HIDDEN_PARTS = ["feltcrown", "crowninterior", "goldlowerbinding", "goldcrownband", "cordrig", "tasselrig"];

const HAT = {
  scale: 38,
  // The opening faces down-right, close to the card's diagonal so the card
  // leaves through the opening rather than the side walls, and only slightly
  // toward the viewer so the top tips forward.
  openingDirection: [0.67, -0.74, 0.2] as [number, number, number],
  twist: 0.4,
  // Model height on the crown axis where the card corner touches the inside.
  contactY: 3.36,
  // Low weight on height means the cord leaves from the board's leftmost corner.
  anchorHeightBias: 0.2,
};

// The card is a slab centred on z = 0; the cloth solver works in CSS px.
const CARD_THICKNESS = 2;
const CLOTH_MARGIN = 1.2;
const CROWN_COLUMNS = 96;
const CROWN_ROWS = 22;
// The crown is sewn as an oval that is shallower toward the viewer, so it
// hugs the card faces while keeping its full width on screen.
const CROWN_DEPTH = 0.62;
const CLOTH_STEPS = 120;
const CLOTH_ITERATIONS = 5;
const CLOTH_GRAVITY = 0.05;
// Pull toward the sewn shape each step; this is what makes the felt thick
// enough to bridge the card edges instead of tracing them.
const CLOTH_SHAPE_MEMORY = 0.015;
const CLOTH_BEND = 0.6;
const HEM_RADIUS = 0.035;

const SEGMENTS = 32;
// Settles the rope over the board edge before the first frame is shown.
const SETTLE_STEPS = 360;
const BOARD_HALF = 2.36;
const BOARD_HALF_THICKNESS = 0.12;
const CONTACT_FRICTION = 0.6;
const TASSEL_LENGTH = 34;
const TASSEL_REST = 0.6;
const STEP = 1 / 120;
const GRAVITY = 2400;
const DAMPING = 0.994;
const WIND_RADIUS = 40;
const WIND_STRENGTH = 0.2;
// Keeps a fast flick to roughly a 25 degree swing.
const MAX_WIND_SPEED = 200;
// Scrolling moves the card under the rope; the rope feels that as inertia.
// A pure vertical jolt only tightens or slackens the cord, so part of it is
// turned sideways to make the swing visible.
const SCROLL_SWAY = 0.08;
const SCROLL_LIFT = 0.12;
const SCROLL_SMOOTHING = 0.08;
// Keeps a fast scroll to roughly a 12 degree swing.
const MAX_SCROLL_SPEED = 110;

const UP = new THREE.Vector3(0, 1, 0);
const DOWN = new THREE.Vector3(0, -1, 0);
const LIGHT_DIRECTION = new THREE.Vector3(-0.4, 0.8, 1).normalize();

const crownRadius = (h: number, theta: number) =>
  (1.3 - 0.12 * h ** 1.4 + 0.05 * Math.sin(Math.PI * h)) *
  (1 + 0.035 * Math.sin(theta * 5 + 0.6) * (1 - h));

const crownIndex = (column: number, row: number) =>
  (((column % CROWN_COLUMNS) + CROWN_COLUMNS) % CROWN_COLUMNS) * (CROWN_ROWS + 1) + row;

const createCrownGeometry = () => {
  const geometry = new THREE.BufferGeometry();
  const count = (CROWN_COLUMNS + 1) * (CROWN_ROWS + 1);
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const indices: number[] = [];
  for (let column = 0; column < CROWN_COLUMNS; column += 1) {
    for (let row = 0; row < CROWN_ROWS; row += 1) {
      const a = column * (CROWN_ROWS + 1) + row;
      const b = a + CROWN_ROWS + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  geometry.setIndex(indices);
  return geometry;
};

const pushOutOfCard = (positions: Float32Array, index: number, side: number) => {
  const offset = index * 3;
  const x = positions[offset];
  const y = positions[offset + 1];
  const z = positions[offset + 2];
  const top = -CORNER_Y;
  const half = CARD_THICKNESS / 2 + CLOTH_MARGIN;
  if (z > half || z < -half || x < CORNER_X - CLOTH_MARGIN || y > top + CLOTH_MARGIN) return;

  const faceDepth = side > 0 ? half - z : z + half;
  let edgeDepth: number;
  let edgeX: number;
  let edgeY: number;
  const arcX = CORNER_X + CARD_RADIUS;
  const arcY = top - CARD_RADIUS;
  if (x < arcX && y > arcY) {
    const distance = Math.hypot(x - arcX, y - arcY);
    const limit = CARD_RADIUS + CLOTH_MARGIN;
    if (distance >= limit) return;
    edgeDepth = limit - distance;
    edgeX = (x - arcX) / Math.max(distance, 0.0001);
    edgeY = (y - arcY) / Math.max(distance, 0.0001);
  } else if (x - (CORNER_X - CLOTH_MARGIN) < top + CLOTH_MARGIN - y) {
    edgeDepth = x - (CORNER_X - CLOTH_MARGIN);
    edgeX = -1;
    edgeY = 0;
  } else {
    edgeDepth = top + CLOTH_MARGIN - y;
    edgeX = 0;
    edgeY = 1;
  }

  if (faceDepth < edgeDepth) {
    positions[offset + 2] += side * faceDepth;
  } else {
    positions[offset] += edgeX * edgeDepth;
    positions[offset + 1] += edgeY * edgeDepth;
  }
};

// Hangs the felt crown from the board under gravity and lets it settle
// against a physical card slab. Returns crown vertices in model space.
const drapeCrown = (toWorld: THREE.Matrix4) => {
  const stride = CROWN_ROWS + 1;
  const count = CROWN_COLUMNS * stride;
  const positions = new Float32Array(count * 3);
  const rest = new Float32Array(count * 3);
  const inverseMass = new Float32Array(count);
  const side = new Int8Array(count);
  const point = new THREE.Vector3();
  const radial = new THREE.Vector3();
  const toLocal = toWorld.clone().invert();
  const depthAxis = new THREE.Vector3(0, 0, 1).transformDirection(toLocal).setY(0).normalize();
  const widthAxis = new THREE.Vector3().crossVectors(UP, depthAxis);
  const sewn = new THREE.Vector3();

  for (let column = 0; column < CROWN_COLUMNS; column += 1) {
    const theta = (column / CROWN_COLUMNS) * Math.PI * 2;
    radial.set(Math.sin(theta), 0, Math.cos(theta));
    sewn
      .copy(depthAxis)
      .multiplyScalar(radial.dot(depthAxis) * CROWN_DEPTH)
      .addScaledVector(widthAxis, radial.dot(widthAxis));
    radial.transformDirection(toWorld);
    for (let row = 0; row <= CROWN_ROWS; row += 1) {
      const h = row / CROWN_ROWS;
      const radius = crownRadius(h, theta);
      const index = column * stride + row;
      point
        .set(radius * sewn.x, OPENING_Y + h * (CROWN_TOP_Y - OPENING_Y), radius * sewn.z)
        .applyMatrix4(toWorld)
        .toArray(positions, index * 3);
      side[index] = radial.z >= 0 ? 1 : -1;
      inverseMass[index] = row >= CROWN_ROWS - 1 ? 0 : 1;
    }
  }
  rest.set(positions);
  const previous = positions.slice();

  const constraintA: number[] = [];
  const constraintB: number[] = [];
  const stiffness: number[] = [];
  const addConstraint = (column: number, row: number, otherColumn: number, otherRow: number, k: number) => {
    if (otherRow > CROWN_ROWS) return;
    constraintA.push(crownIndex(column, row));
    constraintB.push(crownIndex(otherColumn, otherRow));
    stiffness.push(k);
  };
  for (let column = 0; column < CROWN_COLUMNS; column += 1) {
    for (let row = 0; row <= CROWN_ROWS; row += 1) {
      addConstraint(column, row, column + 1, row, 1);
      addConstraint(column, row, column, row + 1, 1);
      addConstraint(column, row, column + 1, row + 1, 0.8);
      addConstraint(column + 1, row, column, row + 1, 0.8);
      addConstraint(column, row, column + 2, row, CLOTH_BEND);
      addConstraint(column, row, column, row + 2, CLOTH_BEND);
    }
  }
  const pairsA = Int32Array.from(constraintA);
  const pairsB = Int32Array.from(constraintB);
  const weights = Float32Array.from(stiffness);
  const restLength = Float32Array.from(constraintA, (a, index) => {
    const b = constraintB[index];
    const dx = rest[a * 3] - rest[b * 3];
    const dy = rest[a * 3 + 1] - rest[b * 3 + 1];
    const dz = rest[a * 3 + 2] - rest[b * 3 + 2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  });

  for (let step = 0; step < CLOTH_STEPS; step += 1) {
    for (let index = 0; index < count; index += 1) {
      if (inverseMass[index] === 0) continue;
      for (let axis = 0; axis < 3; axis += 1) {
        const offset = index * 3 + axis;
        const current = positions[offset];
        positions[offset] += (current - previous[offset]) * 0.9;
        positions[offset] += (rest[offset] - current) * CLOTH_SHAPE_MEMORY;
        previous[offset] = current;
      }
      positions[index * 3 + 1] -= CLOTH_GRAVITY;
    }

    for (let iteration = 0; iteration < CLOTH_ITERATIONS; iteration += 1) {
      for (let constraint = 0; constraint < pairsA.length; constraint += 1) {
        const a = pairsA[constraint];
        const b = pairsB[constraint];
        const totalMass = inverseMass[a] + inverseMass[b];
        if (totalMass === 0) continue;
        const dx = positions[b * 3] - positions[a * 3];
        const dy = positions[b * 3 + 1] - positions[a * 3 + 1];
        const dz = positions[b * 3 + 2] - positions[a * 3 + 2];
        const distance = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), 0.0001);
        const correction = ((distance - restLength[constraint]) / distance / totalMass) * weights[constraint];
        positions[a * 3] += dx * correction * inverseMass[a];
        positions[a * 3 + 1] += dy * correction * inverseMass[a];
        positions[a * 3 + 2] += dz * correction * inverseMass[a];
        positions[b * 3] -= dx * correction * inverseMass[b];
        positions[b * 3 + 1] -= dy * correction * inverseMass[b];
        positions[b * 3 + 2] -= dz * correction * inverseMass[b];
      }
      for (let index = 0; index < count; index += 1) {
        if (inverseMass[index] !== 0) pushOutOfCard(positions, index, side[index]);
      }
    }
  }

  const local = new Float32Array((CROWN_COLUMNS + 1) * stride * 3);
  for (let column = 0; column <= CROWN_COLUMNS; column += 1) {
    for (let row = 0; row <= CROWN_ROWS; row += 1) {
      point
        .fromArray(positions, crownIndex(column, row) * 3)
        .applyMatrix4(toLocal)
        .toArray(local, (column * stride + row) * 3);
    }
  }
  return local;
};

const layerStyle: CSSProperties = {
  left: -CORNER_X,
  top: -CORNER_Y,
  width: LAYER_WIDTH,
  height: `calc(${CORNER_Y}px + 78%)`,
};

const normalizedName = (object: THREE.Object3D) =>
  object.name.replace(/[\s_.\d]/g, "").toLowerCase();

const hasAncestorNamed = (object: THREE.Object3D, names: string[]) => {
  let current: THREE.Object3D | null = object;
  while (current) {
    if (names.includes(normalizedName(current))) return true;
    current = current.parent;
  }
  return false;
};

export const MortarboardHat: FC = () => {
  const backRef = useRef<HTMLDivElement>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const update = () => setEnabled(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const backLayer = backRef.current;
    const frontCanvas = frontCanvasRef.current;
    const card = backLayer?.parentElement;
    const frontContext = frontCanvas?.getContext("2d");
    if (!enabled || !backLayer || !frontCanvas || !card || !frontContext) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.autoClear = false;
    backLayer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.6;

    const camera = new THREE.OrthographicCamera(0, 1, 0, -1, 1, 2000);
    camera.position.z = 1000;

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.radius = 10;
    keyLight.shadow.bias = -0.0005;
    Object.assign(keyLight.shadow.camera, { left: -450, right: 450, top: 450, bottom: -450, near: 1, far: 2000 });
    scene.add(keyLight, keyLight.target);
    const fillLight = new THREE.DirectionalLight(0xffe2c4, 0.6);
    fillLight.position.set(1, -0.3, 0.6);
    scene.add(fillLight);

    // Everything in front of the card plane is drawn over the card, everything
    // behind it underneath, so the card physically slides into the crown.
    const frontClip = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const backClip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

    const clothMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x161b2c,
      roughness: 0.85,
      sheen: 1,
      sheenColor: new THREE.Color(0x4f5e8c),
      sheenRoughness: 0.55,
    });
    const liningMaterial = new THREE.MeshStandardMaterial({
      color: 0x07080d,
      roughness: 1,
      side: THREE.BackSide,
    });
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0a21e,
      metalness: 0.85,
      roughness: 0.3,
    });
    const cordRadius = CORD_RADIUS * HAT.scale;
    const linkGeometry = new THREE.CylinderGeometry(cordRadius, cordRadius, 1, 10, 1, true);
    const jointGeometry = new THREE.SphereGeometry(cordRadius, 12, 8);
    const tasselHeadGeometry = new THREE.SphereGeometry(6.5, 20, 14);
    const tasselCollarGeometry = new THREE.CylinderGeometry(4.5, 5.5, 5, 16);
    const tasselStrandGeometry = new THREE.CylinderGeometry(0.7, 0.9, 1, 5);

    const cardShape = new THREE.Shape();
    cardShape.moveTo(CORNER_X, -2000);
    cardShape.lineTo(CORNER_X, -CORNER_Y - CARD_RADIUS);
    cardShape.absarc(CORNER_X + CARD_RADIUS, -CORNER_Y - CARD_RADIUS, CARD_RADIUS, Math.PI, Math.PI / 2, true);
    cardShape.lineTo(CORNER_X + 2000, -CORNER_Y);
    cardShape.lineTo(CORNER_X + 2000, -2000);
    const cardShadow = new THREE.Mesh(
      new THREE.ShapeGeometry(cardShape),
      new THREE.ShadowMaterial({ opacity: 0.12 })
    );
    cardShadow.receiveShadow = true;
    cardShadow.position.z = CARD_THICKNESS / 2 + 0.05;
    scene.add(cardShadow);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const createCordMesh = (geometry: THREE.BufferGeometry) => {
      const mesh = new THREE.Mesh(geometry, goldMaterial);
      mesh.castShadow = true;
      scene.add(mesh);
      return mesh;
    };
    const links = Array.from({ length: SEGMENTS }, () => createCordMesh(linkGeometry));
    const joints = Array.from({ length: SEGMENTS + 1 }, () => createCordMesh(jointGeometry));

    const tassel = new THREE.Group();
    const tasselHead = new THREE.Mesh(tasselHeadGeometry, goldMaterial);
    tasselHead.position.y = -5;
    const tasselCollar = new THREE.Mesh(tasselCollarGeometry, goldMaterial);
    tasselCollar.position.y = -12;
    tassel.add(tasselHead, tasselCollar);
    for (let index = 0; index < 13; index += 1) {
      const ratio = index / 12 - 0.5;
      const length = 20 + Math.cos(ratio * Math.PI) * 3;
      const strand = new THREE.Mesh(tasselStrandGeometry, goldMaterial);
      strand.scale.y = length;
      strand.position.set(ratio * 8, -14 - length / 2, Math.sin(index * 2.1) * 1.5);
      strand.rotation.z = ratio * 0.25;
      tassel.add(strand);
    }
    tassel.traverse((child) => {
      child.castShadow = true;
    });
    tassel.visible = false;
    scene.add(tassel);

    const crownGeometry = createCrownGeometry();
    const crown = new THREE.Mesh(crownGeometry, clothMaterial);
    crown.castShadow = true;
    const lining = new THREE.Mesh(crownGeometry, liningMaterial);
    const hem = new THREE.Mesh(new THREE.BufferGeometry(), clothMaterial);
    hem.castShadow = true;

    let model: THREE.Object3D | null = null;
    let staticCord: THREE.Mesh | null = null;
    let anchorLocal: THREE.Vector3 | null = null;
    let dropLocal: THREE.Vector3 | null = null;
    const anchorWorld = new THREE.Vector3();
    const boardInverse = new THREE.Matrix4();
    const boardPoint = new THREE.Vector3();
    let particles: RopeParticle[] = [];
    let segmentLength = 10;
    let width = 1;
    let height = 1;
    let accumulator = 0;
    let elapsed = 0;
    let lastFrame = performance.now();
    let frameId = 0;
    let visible = true;
    let disposed = false;

    const pointer = { x: 0, y: 0, time: 0, has: false };
    const scroll = { top: null as number | null, speed: 0 };
    const temp = new THREE.Vector3();
    const velocity = new THREE.Vector3();

    // Keeps a rope particle outside the board, which is a box in model space.
    const collideWithBoard = (position: THREE.Vector3) => {
      if (!model) return false;
      boardPoint.copy(position).applyMatrix4(boardInverse);
      const y = boardPoint.y - BOARD_Y;
      const depthX = BOARD_HALF + CORD_RADIUS - Math.abs(boardPoint.x);
      const depthY = BOARD_HALF_THICKNESS + CORD_RADIUS - Math.abs(y);
      const depthZ = BOARD_HALF + CORD_RADIUS - Math.abs(boardPoint.z);
      if (depthX <= 0 || depthY <= 0 || depthZ <= 0) return false;

      if (depthY <= depthX && depthY <= depthZ) boardPoint.y += Math.sign(y || 1) * depthY;
      else if (depthX <= depthZ) boardPoint.x += Math.sign(boardPoint.x || 1) * depthX;
      else boardPoint.z += Math.sign(boardPoint.z || 1) * depthZ;
      position.copy(boardPoint).applyMatrix4(model.matrixWorld);
      return true;
    };

    const buildChain = () => {
      if (!model || !anchorLocal || !dropLocal) return;
      anchorWorld.copy(anchorLocal);
      model.localToWorld(anchorWorld);
      const dropWorld = model.localToWorld(dropLocal.clone());

      // The rope starts on top of the board, runs out past the corner and
      // falls straight down; settling lets it wrap the edge on its own.
      const tasselTop = -(CORNER_Y + card.clientHeight * TASSEL_REST - TASSEL_LENGTH);
      const run = anchorWorld.distanceTo(dropWorld);
      const fall = Math.max(40, dropWorld.y - tasselTop);
      segmentLength = (run + fall) / SEGMENTS;
      particles = Array.from({ length: SEGMENTS + 1 }, (_, index) => {
        const distance = segmentLength * index;
        const position =
          distance <= run
            ? anchorWorld.clone().lerp(dropWorld, distance / run)
            : dropWorld.clone().setY(dropWorld.y - (distance - run));
        return {
          position,
          previous: position.clone(),
          inverseMass: index === 0 ? 0 : index === SEGMENTS ? 0.4 : 1,
        };
      });

      for (let settle = 0; settle < SETTLE_STEPS; settle += 1) step(false);
      particles.forEach((particle) => particle.previous.copy(particle.position));
      tassel.visible = true;
    };

    const buildCrown = (hatModel: THREE.Object3D) => {
      const positions = crownGeometry.attributes.position as THREE.BufferAttribute;
      positions.array.set(drapeCrown(hatModel.matrixWorld));
      positions.needsUpdate = true;
      crownGeometry.computeVertexNormals();
      crownGeometry.computeBoundingSphere();

      const hemPoints = Array.from({ length: CROWN_COLUMNS }, (_, column) =>
        new THREE.Vector3().fromBufferAttribute(positions, column * (CROWN_ROWS + 1))
      );
      hem.geometry.dispose();
      hem.geometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(hemPoints, true),
        CROWN_COLUMNS,
        HEM_RADIUS,
        6,
        true
      );
      if (!crown.parent) hatModel.add(crown, lining, hem);
    };

    const placeHat = () => {
      if (!model) return;

      const direction = new THREE.Vector3(...HAT.openingDirection).normalize();
      pivot.quaternion
        .setFromAxisAngle(direction, HAT.twist)
        .multiply(new THREE.Quaternion().setFromUnitVectors(DOWN, direction));
      pivot.scale.setScalar(HAT.scale);
      pivot.position
        .set(CORNER_X, -CORNER_Y, 0)
        .addScaledVector(direction, (HAT.contactY - OPENING_Y) * HAT.scale);
      pivot.updateMatrixWorld(true);

      buildCrown(model);

      let corner = new THREE.Vector3();
      let best = Infinity;
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const local = new THREE.Vector3(sx * BOARD_CORNER, BOARD_Y, sz * BOARD_CORNER);
          temp.copy(local);
          model.localToWorld(temp);
          const score = temp.x + temp.y * HAT.anchorHeightBias;
          if (score < best) {
            best = score;
            corner = local;
          }
        }
      }

      const lift = BOARD_TOP_Y + CORD_RADIUS + 0.01;
      const along = (t: number, y: number) =>
        new THREE.Vector3(corner.x * t, y, corner.z * t);
      // Only the stretch lying on the hidden top face is fixed; friction holds
      // that part of a real cord. It ends on the first rope joint, whose sphere
      // caps the open tube end.
      const path = new THREE.CatmullRomCurve3(
        [along(0, 3.82), along(0.3, lift), along(0.65, lift), along(0.93, lift)],
        false,
        "centripetal"
      );
      anchorLocal = along(0.93, lift);
      dropLocal = along(1.1, lift);

      if (staticCord) {
        staticCord.geometry.dispose();
        staticCord.removeFromParent();
      }
      staticCord = new THREE.Mesh(
        new THREE.TubeGeometry(path, 48, CORD_RADIUS, 8, false),
        goldMaterial
      );
      staticCord.castShadow = true;
      model.add(staticCord);
      model.updateMatrixWorld(true);
      boardInverse.copy(model.matrixWorld).invert();

      buildChain();
    };

    const resize = () => {
      width = backLayer.clientWidth || LAYER_WIDTH;
      height = backLayer.clientHeight || 400;
      renderer.setSize(width, height, false);
      frontCanvas.width = renderer.domElement.width;
      frontCanvas.height = renderer.domElement.height;
      camera.right = width;
      camera.bottom = -height;
      camera.updateProjectionMatrix();

      keyLight.target.position.set(width / 2, -height / 2, 0);
      keyLight.position.copy(keyLight.target.position).addScaledVector(LIGHT_DIRECTION, 900);
      scroll.top = null;
      scroll.speed = 0;
      buildChain();
    };

    const contacts: boolean[] = [];

    function step(sway = true) {
      const count = particles.length;
      for (let index = 1; index < count; index += 1) {
        const particle = particles[index];
        velocity.subVectors(particle.position, particle.previous).multiplyScalar(DAMPING);
        particle.previous.copy(particle.position);
        particle.position.add(velocity);
        particle.position.y -= GRAVITY * STEP * STEP;
        if (sway && !prefersReducedMotion) {
          particle.position.x +=
            Math.sin(elapsed * 1.1 + index * 0.3) * 18 * (index / count) * STEP * STEP;
        }
        contacts[index] = false;
      }

      for (let iteration = 0; iteration < 12; iteration += 1) {
        particles[0].position.copy(anchorWorld);
        for (let index = 0; index < count - 1; index += 1) {
          const first = particles[index];
          const second = particles[index + 1];
          temp.subVectors(second.position, first.position);
          const distance = Math.max(temp.length(), 0.0001);
          const totalMass = first.inverseMass + second.inverseMass;
          const correction = (distance - segmentLength) / distance / totalMass;
          first.position.addScaledVector(temp, correction * first.inverseMass);
          second.position.addScaledVector(temp, -correction * second.inverseMass);
        }
        for (let index = 1; index < count; index += 1) {
          if (collideWithBoard(particles[index].position)) contacts[index] = true;
        }
      }

      for (let index = 1; index < count; index += 1) {
        if (contacts[index]) particles[index].previous.lerp(particles[index].position, CONTACT_FRICTION);
      }
    }

    const updateCordMeshes = () => {
      particles.forEach((particle, index) => {
        joints[index].position.copy(particle.position);
        if (index === 0) return;
        const start = particles[index - 1].position;
        const link = links[index - 1];
        temp.subVectors(particle.position, start);
        link.position.copy(start).addScaledVector(temp, 0.5);
        link.scale.set(1, temp.length(), 1);
        link.quaternion.setFromUnitVectors(UP, temp.normalize());
      });

      const last = particles[particles.length - 1];
      const previous = particles[particles.length - 2];
      tassel.position.copy(last.position);
      temp.subVectors(last.position, previous.position).normalize();
      tassel.quaternion.setFromUnitVectors(DOWN, temp);
    };

    const render = () => {
      renderer.clear();
      renderer.clippingPlanes = [frontClip];
      renderer.render(scene, camera);
      frontContext.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
      frontContext.drawImage(renderer.domElement, 0, 0);

      renderer.clear();
      renderer.clippingPlanes = [backClip];
      renderer.render(scene, camera);
    };

    // The card's screen velocity is smoothed so wheel steps read as one push.
    // Only changes in that velocity move the rope, so it lags when a scroll
    // starts and swings back when it stops.
    const applyScrollInertia = (delta: number) => {
      const top = card.getBoundingClientRect().top;
      if (scroll.top === null || delta === 0) {
        scroll.top = top;
        return;
      }
      const raw = (top - scroll.top) / delta;
      scroll.top = top;
      const speed = scroll.speed + (raw - scroll.speed) * (1 - Math.exp(-delta / SCROLL_SMOOTHING));
      const change = speed - scroll.speed;
      scroll.speed = speed;
      if (prefersReducedMotion || particles.length < 2 || change === 0) return;

      const last = particles.length - 1;
      particles.forEach((particle, index) => {
        if (index === 0) return;
        const weight = index / last;
        velocity.subVectors(particle.position, particle.previous).divideScalar(STEP);
        const limit = Math.max(velocity.length(), MAX_SCROLL_SPEED);
        velocity.x -= change * SCROLL_SWAY * weight;
        velocity.y += change * SCROLL_LIFT * weight;
        if (velocity.length() > limit) velocity.setLength(limit);
        particle.previous.copy(particle.position).addScaledVector(velocity, -STEP);
      });
    };

    const tick = (now: number) => {
      const delta = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      applyScrollInertia(delta);
      if (particles.length > 1) {
        accumulator += delta;
        while (accumulator >= STEP) {
          elapsed += STEP;
          step();
          accumulator -= STEP;
        }
        updateCordMeshes();
      }
      render();
      frameId = visible ? window.requestAnimationFrame(tick) : 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (prefersReducedMotion || particles.length < 2) return;
      const bounds = backLayer.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = -(event.clientY - bounds.top);
      const now = performance.now();

      if (pointer.has && now - pointer.time < 100) {
        const dt = Math.max((now - pointer.time) / 1000, 0.008);
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const sweepLengthSq = dx * dx + dy * dy;

        particles.forEach((particle, index) => {
          if (index === 0) return;
          const t =
            sweepLengthSq > 0
              ? THREE.MathUtils.clamp(
                  ((particle.position.x - pointer.x) * dx +
                    (particle.position.y - pointer.y) * dy) /
                    sweepLengthSq,
                  0,
                  1
                )
              : 0;
          const distance = Math.hypot(
            particle.position.x - (pointer.x + dx * t),
            particle.position.y - (pointer.y + dy * t)
          );
          const influence = THREE.MathUtils.smoothstep(1 - distance / WIND_RADIUS, 0, 1);
          if (influence === 0) return;

          velocity.set(dx / dt, dy / dt, 0).multiplyScalar(WIND_STRENGTH * influence);
          particle.previous.addScaledVector(velocity, -STEP);

          velocity.subVectors(particle.position, particle.previous).divideScalar(STEP);
          if (velocity.length() > MAX_WIND_SPEED) {
            velocity.setLength(MAX_WIND_SPEED);
            particle.previous.copy(particle.position).addScaledVector(velocity, -STEP);
          }
        });
      }

      pointer.x = x;
      pointer.y = y;
      pointer.time = now;
      pointer.has = true;
    };

    const loader = new GLTFLoader();
    loader.load(
      `${import.meta.env.BASE_URL}assets/mortarboard-hat.glb`,
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        model.position.y = -OPENING_Y;
        model.traverse((child) => {
          if (hasAncestorNamed(child, HIDDEN_PARTS)) {
            child.visible = false;
            return;
          }
          if (!(child instanceof THREE.Mesh)) return;
          child.castShadow = true;
          if (hasAncestorNamed(child, ["squaremortarboardboard"])) {
            child.material = clothMaterial;
          }
        });
        pivot.add(model);
        placeHat();
      },
      undefined,
      (error) => console.error("Unable to load mortarboard asset.", error)
    );

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(backLayer);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frameId) {
        lastFrame = performance.now();
        scroll.top = null;
        scroll.speed = 0;
        frameId = window.requestAnimationFrame(tick);
      }
    });
    intersectionObserver.observe(card);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frameId = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);

      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      });
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [enabled, prefersReducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div ref={backRef} className="edu-hat edu-hat--back" style={layerStyle} aria-hidden="true" />
      <div className="edu-hat edu-hat--front" style={layerStyle} aria-hidden="true">
        <canvas ref={frontCanvasRef} />
      </div>
    </>
  );
};
