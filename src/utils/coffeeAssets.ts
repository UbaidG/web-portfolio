import * as THREE from 'three';

/**
 * Procedural 3D Coffee Assets: Realistic Coffee Beans, Ceramic Mugs, Steam Particles & Cups
 */

// 1. Realistic 3D Coffee Bean Geometry with Organic Crease
export function createRealisticCoffeeBeanGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.55, 36, 28);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Elongate into typical coffee bean oval ratio (length ~ 1.5x width)
    v.y *= 1.48;
    // Flatten thickness (Z-axis)
    v.z *= 0.65;

    // Organic slight curve along Y axis (bean is slightly banana/kidney curved)
    v.x += Math.sin(v.y * 1.8) * 0.06;

    // Signature longitudinal crease along the front face (Z > 0)
    if (v.z > -0.05) {
      // S-curved center fissure
      const fissureCenter = Math.sin(v.y * 2.2) * 0.05;
      const distFromFissure = Math.abs(v.x - fissureCenter);

      if (distFromFissure < 0.22) {
        // Deep indentation into the bean body
        const depth = (0.22 - distFromFissure) * 1.6;
        const longitudinalFade = Math.cos((v.y / 0.8) * (Math.PI / 2));
        v.z -= Math.max(0, depth * Math.max(0, longitudinalFade));
      } else if (distFromFissure < 0.32) {
        // Slight raised lip flanking the fissure
        const lip = (0.32 - distFromFissure) * 0.12;
        v.z += lip;
      }
    }

    // Slightly taper tips
    const tipFactor = 1.0 - Math.pow(Math.abs(v.y) / 0.82, 2.5) * 0.3;
    v.x *= tipFactor;
    v.z *= tipFactor;

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

// 2. Realistic Roasted Coffee Bean Procedural Texture
export function createCoffeeBeanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep dark roasted espresso base
  ctx.fillStyle = '#26140d';
  ctx.fillRect(0, 0, 512, 512);

  // Roasted micro-grain and oil sheen variations
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 1.8 + 0.4;
    const tone = Math.random();

    if (tone < 0.35) {
      ctx.fillStyle = 'rgba(15, 7, 4, 0.4)'; // Dark char pore
    } else if (tone < 0.7) {
      ctx.fillStyle = 'rgba(64, 34, 20, 0.35)'; // Mid roasted brown
    } else {
      ctx.fillStyle = 'rgba(110, 68, 42, 0.2)'; // Warm caramel highlight
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark center crease streak across the texture
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.44, 'rgba(10, 4, 2, 0.6)');
  grad.addColorStop(0.5, 'rgba(5, 2, 1, 0.95)');
  grad.addColorStop(0.56, 'rgba(10, 4, 2, 0.6)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Realistic 3D Ceramic Coffee Mug with Coffee Liquid and Handle
export function createCoffeeMugGroup(): { group: THREE.Group; updateSteam: (time: number) => void } {
  const group = new THREE.Group();

  // Ceramic Mug Glaze Material
  const mugMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x221a15, // Dark matte espresso ceramic
    roughness: 0.22,
    metalness: 0.05,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
  });

  // Mug Body (Outer Cylinder)
  const outerGeom = new THREE.CylinderGeometry(1.4, 1.2, 2.5, 48);
  const outerMesh = new THREE.Mesh(outerGeom, mugMaterial);
  group.add(outerMesh);

  // Mug Interior Hollow (Inner Cylinder)
  const innerGeom = new THREE.CylinderGeometry(1.28, 1.1, 2.38, 48);
  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0x18120e,
    roughness: 0.3,
    metalness: 0.05,
  });
  const innerMesh = new THREE.Mesh(innerGeom, innerMat);
  innerMesh.position.y = 0.1;
  group.add(innerMesh);

  // Curved Handle (Torus)
  const handleGeom = new THREE.TorusGeometry(0.72, 0.18, 20, 36, Math.PI * 0.95);
  const handleMesh = new THREE.Mesh(handleGeom, mugMaterial);
  handleMesh.position.set(1.42, 0.05, 0);
  handleMesh.rotation.z = -Math.PI / 2;
  group.add(handleMesh);

  // Coffee Liquid Surface with Crema Ring
  const liquidGeom = new THREE.CircleGeometry(1.24, 48);
  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0x1f1109, // Dark rich coffee
    roughness: 0.15,
    metalness: 0.2,
  });
  const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
  liquidMesh.rotation.x = -Math.PI / 2;
  liquidMesh.position.y = 0.95;
  group.add(liquidMesh);

  // Golden Crema Swirl on top of coffee
  const cremaGeom = new THREE.RingGeometry(0.65, 1.23, 36);
  const cremaMat = new THREE.MeshBasicMaterial({
    color: 0xb57c48,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
  });
  const cremaMesh = new THREE.Mesh(cremaGeom, cremaMat);
  cremaMesh.rotation.x = -Math.PI / 2;
  cremaMesh.position.y = 0.955;
  group.add(cremaMesh);

  // Rising Steam Particle System
  const steamCount = 65;
  const steamGeom = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  const steamOffsets = new Float32Array(steamCount);
  const steamSpeeds = new Float32Array(steamCount);

  for (let i = 0; i < steamCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.7;
    steamPositions[i * 3 + 0] = Math.cos(angle) * r;
    steamPositions[i * 3 + 1] = 1.0 + Math.random() * 2.5; // Y height above cup
    steamPositions[i * 3 + 2] = Math.sin(angle) * r;
    steamOffsets[i] = Math.random() * Math.PI * 2;
    steamSpeeds[i] = 0.012 + Math.random() * 0.012;
  }

  steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

  const steamMat = new THREE.PointsMaterial({
    color: 0xf5ede4,
    size: 0.28,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const steamParticles = new THREE.Points(steamGeom, steamMat);
  group.add(steamParticles);

  const updateSteam = (time: number) => {
    const pos = steamGeom.attributes.position;
    for (let i = 0; i < steamCount; i++) {
      let y = pos.getY(i);
      y += steamSpeeds[i];

      // Organic wavy sway as steam ascends
      const offset = steamOffsets[i];
      const x = Math.sin(time * 1.5 + offset + y * 2.0) * (0.15 + (y - 1.0) * 0.2);
      const z = Math.cos(time * 1.2 + offset + y * 1.8) * (0.15 + (y - 1.0) * 0.2);

      // Reset when particle floats too high
      if (y > 3.6) {
        y = 1.0;
      }

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  };

  return { group, updateSteam };
}

// 4. Realistic 3D Specialty Takeaway Coffee Cup with Lid & Sleeve
export function createTakeawayCupGroup(): { group: THREE.Group; updateSteam: (time: number) => void } {
  const group = new THREE.Group();

  // Cup Body
  const cupGeom = new THREE.CylinderGeometry(1.3, 0.95, 2.8, 48);
  const cupMat = new THREE.MeshStandardMaterial({
    color: 0x1c1714, // Dark kraft matte paper
    roughness: 0.7,
  });
  const cupMesh = new THREE.Mesh(cupGeom, cupMat);
  group.add(cupMesh);

  // Ribbed Cardboard Heat Sleeve in the middle
  const sleeveGeom = new THREE.CylinderGeometry(1.24, 1.06, 1.2, 48);
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x966848, // Warm ribbed cardboard kraft
    roughness: 0.85,
  });
  const sleeveMesh = new THREE.Mesh(sleeveGeom, sleeveMat);
  sleeveMesh.position.y = 0.05;
  group.add(sleeveMesh);

  // Drinking Lid with sipping aperture
  const lidGeom = new THREE.CylinderGeometry(1.36, 1.34, 0.35, 48);
  const lidMat = new THREE.MeshStandardMaterial({
    color: 0x0f0b09, // Matte black lid
    roughness: 0.3,
  });
  const lidMesh = new THREE.Mesh(lidGeom, lidMat);
  lidMesh.position.y = 1.55;
  group.add(lidMesh);

  // Subtle steam from sipping hole
  const steamCount = 35;
  const steamGeom = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  const steamSpeeds = new Float32Array(steamCount);

  for (let i = 0; i < steamCount; i++) {
    steamPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.25;
    steamPositions[i * 3 + 1] = 1.7 + Math.random() * 2.0;
    steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    steamSpeeds[i] = 0.015 + Math.random() * 0.015;
  }

  steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
  const steamMat = new THREE.PointsMaterial({
    color: 0xf5ede4,
    size: 0.22,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const steam = new THREE.Points(steamGeom, steamMat);
  group.add(steam);

  const updateSteam = (time: number) => {
    const pos = steamGeom.attributes.position;
    for (let i = 0; i < steamCount; i++) {
      let y = pos.getY(i) + steamSpeeds[i];
      const x = Math.sin(time * 2 + y) * 0.15;
      const z = Math.cos(time * 1.5 + y) * 0.15;
      if (y > 3.8) y = 1.7;
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  };

  return { group, updateSteam };
}
