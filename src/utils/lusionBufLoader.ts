import * as THREE from "three";

interface PackedComponent {
  from: number;
  delta: number;
}

interface AttributeMeta {
  id: string;
  needsPack: boolean;
  componentSize: number;
  storageType: "Uint16Array" | "Int16Array" | "Uint8Array" | "Int8Array" | "Float32Array";
  packedComponents?: PackedComponent[];
}

interface BufHeader {
  vertexCount: number;
  indexCount: number;
  attributes: AttributeMeta[];
  meshType?: string;
  boundingSphere?: {
    center: [number, number, number];
    radius: number;
  };
  boundingBox?: {
    min: [number, number, number];
    max: [number, number, number];
  };
}

const TYPED_ARRAY_CONSTRUCTORS = {
  Uint16Array,
  Int16Array,
  Uint8Array,
  Int8Array,
  Float32Array,
};

export function parseLusionBuf(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  const dv = new DataView(arrayBuffer);
  const headerLength = dv.getUint32(0, true);
  const headerBytes = new Uint8Array(arrayBuffer, 4, headerLength);
  const headerStr = new TextDecoder("utf-8").decode(headerBytes);
  const header: BufHeader = JSON.parse(headerStr);

  let byteOffset = 4 + headerLength;
  const geometry = new THREE.BufferGeometry();

  for (const attr of header.attributes) {
    const isIndices = attr.id === "indices";
    const elementCount = isIndices ? header.indexCount : header.vertexCount;
    const totalCount = elementCount * attr.componentSize;
    const Constructor = TYPED_ARRAY_CONSTRUCTORS[attr.storageType];
    const bytesPerElement = Constructor.BYTES_PER_ELEMENT;

    // Read typed array directly from buffer
    const rawArray = new Constructor(arrayBuffer, byteOffset, totalCount);
    byteOffset += totalCount * bytesPerElement;

    if (attr.needsPack && attr.packedComponents) {
      const packed = attr.packedComponents;
      const isSigned = attr.storageType.startsWith("Int");
      const bits = bytesPerElement * 8;
      const maxVal = 1 << bits;
      const half = isSigned ? maxVal * 0.5 : 0;
      const norm = 1 / (maxVal - 1);

      const unpacked = new Float32Array(totalCount);
      let targetIndex = 0;

      for (let i = 0; i < elementCount; i++) {
        for (let c = 0; c < attr.componentSize; c++) {
          const comp = packed[c];
          unpacked[targetIndex] =
            (rawArray[targetIndex] + half) * norm * comp.delta + comp.from;
          targetIndex++;
        }
      }

      geometry.setAttribute(
        attr.id,
        new THREE.BufferAttribute(unpacked, attr.componentSize),
      );
    } else if (isIndices) {
      geometry.setIndex(new THREE.BufferAttribute(rawArray as Uint16Array, 1));
    } else {
      geometry.setAttribute(
        attr.id,
        new THREE.BufferAttribute(rawArray as Float32Array, attr.componentSize),
      );
    }
  }

  if (header.boundingSphere) {
    geometry.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(...header.boundingSphere.center),
      header.boundingSphere.radius,
    );
  } else {
    geometry.computeBoundingSphere();
  }

  if (header.boundingBox) {
    geometry.boundingBox = new THREE.Box3(
      new THREE.Vector3(...header.boundingBox.min),
      new THREE.Vector3(...header.boundingBox.max),
    );
  } else {
    geometry.computeBoundingBox();
  }

  return geometry;
}

export async function loadLusionBuf(url: string): Promise<THREE.BufferGeometry> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load .buf model from ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return parseLusionBuf(arrayBuffer);
}
