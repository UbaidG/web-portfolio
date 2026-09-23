import * as THREE from "three";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image: ${src} - ${err}`));
    img.src = src;
  });
}

/**
 * Loads the diffuse and height textures and packs them into a single RGBA texture:
 * - RGB = Diffuse / albedo color
 * - A   = Height / displacement value
 */
export async function loadCompositeCoffeeBeanTexture(
  diffPath: string,
  heightPath: string,
): Promise<THREE.CanvasTexture> {
  const [diffImg, heightImg] = await Promise.all([
    loadImage(diffPath),
    loadImage(heightPath),
  ]);

  const width = diffImg.naturalWidth || 128;
  const height = diffImg.naturalHeight || 128;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Unable to create 2D canvas context for texture packing");
  }

  // Draw diffuse
  ctx.drawImage(diffImg, 0, 0, width, height);
  const diffImageData = ctx.getImageData(0, 0, width, height);

  // Draw height to temporary canvas
  const heightCanvas = document.createElement("canvas");
  heightCanvas.width = width;
  heightCanvas.height = height;
  const heightCtx = heightCanvas.getContext("2d", { willReadFrequently: true });
  if (!heightCtx) {
    throw new Error("Unable to create 2D canvas context for height map");
  }
  heightCtx.drawImage(heightImg, 0, 0, width, height);
  const heightImageData = heightCtx.getImageData(0, 0, width, height);

  // Pack height map (red channel or luminance) into alpha channel of diffuse
  const totalPixels = width * height;
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    diffImageData.data[idx + 3] = heightImageData.data[idx];
  }

  ctx.putImageData(diffImageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
}
