import * as THREE from 'three';

/**
 * Procedural Texture and Geometry Generators for Cinematic 3D Elements
 */

// 1. Procedural Cork Texture for the Oryzo Coaster
export function createCorkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base warm cork beige/brown
  ctx.fillStyle = '#b38257';
  ctx.fillRect(0, 0, 1024, 1024);

  // Layered speckles and pores
  const numDots = 40000;
  for (let i = 0; i < numDots; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 2.5 + 0.5;
    const darkness = Math.random();

    if (darkness < 0.4) {
      ctx.fillStyle = `rgba(78, 50, 31, ${Math.random() * 0.6 + 0.2})`; // Dark pore
    } else if (darkness < 0.7) {
      ctx.fillStyle = `rgba(138, 97, 62, ${Math.random() * 0.5 + 0.1})`; // Mid grain
    } else {
      ctx.fillStyle = `rgba(215, 175, 133, ${Math.random() * 0.4 + 0.1})`; // Light wood fiber
    }

    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.8, r * 0.8, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft vignette
  const grad = ctx.createRadialGradient(512, 512, 300, 512, 512, 700);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(50,30,15,0.35)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Procedural Casino Chip Face Texture
export function createCasinoChipTexture(title = 'UBAID GHANTE', denom = '170M+', color = '#059669'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian outer ring
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(512, 512, 500, 0, Math.PI * 2);
  ctx.fill();

  // Outer segmented rim stripes (Casino chip edge inserts)
  const segments = 12;
  for (let i = 0; i < segments; i++) {
    const angle = (i * Math.PI * 2) / segments;
    ctx.save();
    ctx.translate(512, 512);
    ctx.rotate(angle);
    ctx.fillStyle = i % 2 === 0 ? color : '#f8fafc';
    ctx.fillRect(-35, -490, 70, 60);
    ctx.restore();
  }

  // Golden inner ring
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(512, 512, 420, 0, Math.PI * 2);
  ctx.stroke();

  // Second decorative dashed ring
  ctx.setLineDash([16, 12]);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(512, 512, 385, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner colored baize circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(512, 512, 360, 0, Math.PI * 2);
  ctx.fill();

  // Subtle radial gradient for depth
  const innerGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 360);
  innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.arc(512, 512, 360, 0, Math.PI * 2);
  ctx.fill();

  // Centered denomination & typography
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '900 68px monospace';
  ctx.fillText(denom, 512, 480);

  ctx.fillStyle = '#fde68a';
  ctx.font = '700 32px sans-serif';
  ctx.fillText('HIGH ROLLER MLE', 512, 550);

  // Circular curved text top and bottom
  drawCurvedText(ctx, title, 512, 512, 280, -Math.PI / 2, 'bold 32px sans-serif', '#fbbf24');
  drawCurvedText(ctx, '★ MONTE CARLO ROYALE ★', 512, 512, 280, Math.PI / 2, 'bold 26px sans-serif', '#fbbf24');

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function drawCurvedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, radius: number, startAngle: number, font: string, fill: string) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const chars = text.split('');
  const totalAngle = Math.PI * 0.7;
  const step = totalAngle / (chars.length - 1 || 1);
  const baseAngle = startAngle - totalAngle / 2;

  chars.forEach((char, i) => {
    const angle = baseAngle + i * step;
    ctx.save();
    ctx.translate(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

// 3. Procedural Coffee Bean 3D Geometry
export function createCoffeeBeanGeometry(): THREE.BufferGeometry {
  // Start with a sphere and displace vertices to form an organic coffee bean shape
  const geom = new THREE.SphereGeometry(0.5, 24, 20);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Elongate along Y axis
    v.y *= 1.45;
    // Flatten along Z axis
    v.z *= 0.68;

    // Create the signature coffee bean center crevice along the front face (Z > 0)
    if (v.z > 0) {
      const distFromCenterLine = Math.abs(v.x);
      if (distFromCenterLine < 0.22) {
        const depth = (0.22 - distFromCenterLine) * 1.8;
        v.z -= depth * Math.cos((v.y / 0.72) * (Math.PI / 2));
      }
    }

    // Slightly pinch ends
    const taper = 1.0 - Math.pow(Math.abs(v.y) / 0.75, 2) * 0.25;
    v.x *= taper;
    v.z *= taper;

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

// 4. Procedural Holographic Tarot Card Texture
export function createTarotCardTexture(name: string, roman: string, subtitle: string, icon = '✦'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 900;
  const ctx = canvas.getContext('2d')!;

  // Obsidian card background
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, 600, 900);

  // Ornate gold border
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, 560, 860);

  // Inner decorative border
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, 532, 832);

  // Corner ornaments
  const corners = [[45, 45], [555, 45], [45, 855], [555, 855]];
  ctx.fillStyle = '#eab308';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header Roman Numeral
  ctx.fillStyle = '#fde047';
  ctx.font = '700 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText(roman, 300, 95);

  // Central Sacred Geometry Graphic
  ctx.save();
  ctx.translate(300, 430);
  // Outer glowing circle
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.stroke();

  // Star / Diamond geometry
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? 150 : 80;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Central large mystical icon
  ctx.fillStyle = '#fde047';
  ctx.font = '900 80px serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 0, 0);
  ctx.restore();

  // Card Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 42px serif';
  ctx.fillText(name.toUpperCase(), 300, 720);

  // Subtitle / Architecture spec
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 22px sans-serif';
  ctx.fillText(subtitle, 300, 770);

  // Bottom watermark
  ctx.fillStyle = '#71717a';
  ctx.font = '500 16px monospace';
  ctx.fillText('ARCANA OF HIGH SCALE • 170M+ AGENTS', 300, 830);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
