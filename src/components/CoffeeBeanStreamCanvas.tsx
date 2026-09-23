import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { loadLusionBuf } from "../utils/lusionBufLoader";
import { loadCompositeCoffeeBeanTexture } from "../utils/coffeeBeanTextureLoader";
import { usePrefersReducedMotion } from "../hooks/useMotionPreference";

interface CoffeeBeanStreamCanvasProps {
  className?: string;
}

const VERT_SHADER = /* glsl */ `
  attribute vec2 instanceUv;
  attribute float Cd;
  uniform sampler2D u_positionTexture;
  uniform sampler2D u_rotationTexture;
  uniform float u_scale;

  varying vec2 v_uv;
  varying vec3 v_worldPosition;
  varying vec3 v_viewNormal;
  varying vec3 v_viewPosition;
  varying float v_ao;
  varying float v_brightness;

  vec3 qrotate(vec4 q, vec3 v) {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
  }

  void main() {
    vec4 posData = texture2D(u_positionTexture, instanceUv);
    vec4 rotData = texture2D(u_rotationTexture, instanceUv);
    vec3 instancePosition = posData.xyz;
    vec4 instanceQuat = rotData;

    vec3 localPos = position * u_scale;
    localPos = qrotate(instanceQuat, localPos);
    vec3 rotatedNormal = qrotate(instanceQuat, normal);

    vec3 worldPos = (modelMatrix * vec4(localPos + instancePosition, 1.0)).xyz;
    vec4 mvPosition = viewMatrix * vec4(worldPos, 1.0);

    v_viewNormal = normalMatrix * rotatedNormal;
    v_viewPosition = -mvPosition.xyz;
    v_worldPosition = worldPos;
    v_uv = uv;
    v_ao = Cd;
    v_brightness = posData.w;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAG_SHADER = /* glsl */ `
  uniform vec3 u_lightPosition;
  uniform sampler2D u_coffeeBeansTexture;
  uniform vec3 u_lightColor;
  uniform vec3 u_ambientColor;

  varying vec2 v_uv;
  varying vec3 v_worldPosition;
  varying vec3 v_viewPosition;
  varying vec3 v_viewNormal;
  varying float v_ao;
  varying float v_brightness;

  vec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection) {
    vec3 vSigmaX = dFdx(surf_pos);
    vec3 vSigmaY = dFdy(surf_pos);
    vec3 vN = surf_norm;
    vec3 R1 = cross(vSigmaY, vN);
    vec3 R2 = cross(vN, vSigmaX);
    float fDet = dot(vSigmaX, R1) * faceDirection;
    vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
    return normalize(abs(fDet) * surf_norm - vGrad);
  }

  void main() {
    vec4 map = texture2D(u_coffeeBeansTexture, v_uv);
    vec3 albedo = pow(map.rgb, vec3(2.2 + 0.8 * (v_brightness - 0.5)));
    vec3 VN = normalize(v_viewNormal);

    float bumpScale = 1.35;
    vec2 dSTdx = dFdx(v_uv);
    vec2 dSTdy = dFdy(v_uv);
    vec2 dHdxy = (vec2(
      texture2D(u_coffeeBeansTexture, v_uv + dSTdx).w,
      texture2D(u_coffeeBeansTexture, v_uv + dSTdy).w
    ) - map.w) * bumpScale;

    VN = perturbNormalArb(-v_viewPosition, VN, dHdxy, 1.0);
    vec3 N = normalize((vec4(VN, 0.0) * viewMatrix).xyz);
    vec3 V = normalize(cameraPosition - v_worldPosition);

    vec3 L = u_lightPosition - v_worldPosition;
    float lightDistance = length(L);
    L /= max(lightDistance, 0.0001);

    vec3 H = normalize(L + V);
    float NdL = dot(N, L);
    float NdH = clamp(dot(N, H), 0.0, 1.0);

    float specular = pow(NdH, 70.0 - 35.0 * v_brightness);
    float attenuation = 1.0 / (25.0 * lightDistance * lightDistance + 0.01);
    float diff = max(0.0, NdL);
    float backLight = max(0.0, -NdL);

    float ao = v_ao * v_ao;

    vec3 color = vec3(0.0);
    // Warm ambient fill revealing roasted bean texture
    color += albedo * u_ambientColor * (ao * 0.65 + 0.35);
    // Diffuse key light
    color += albedo * u_lightColor * diff * attenuation * ao * 1.35;
    // Warm translucent back light bounce
    color += albedo * u_lightColor * backLight * attenuation * 0.04;
    // Crisp specular highlight on bean surface
    color += (albedo * 0.6 + 0.4) * specular * attenuation * 2.2;

    gl_FragColor.rgb = pow(color, vec3(1.0 / 2.2));
    gl_FragColor.a = 1.0;
  }
`;

export const CoffeeBeanStreamCanvas: React.FC<CoffeeBeanStreamCanvasProps> = ({
  className = "bean-stream-canvas",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrame = 0;

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
    const camera = new THREE.PerspectiveCamera(46, 1, 0.05, 50);
    // Position camera closer to make beans prominent & detailed like Oryzo reference
    camera.position.set(0, 0.16, 0.40);
    camera.lookAt(0, 0, -0.28);

    const rendererPixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(rendererPixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const isMobile = window.innerWidth < 768;
    const TEXTURE_WIDTH = isMobile ? 24 : 32;
    const TEXTURE_HEIGHT = TEXTURE_WIDTH;
    const PARTICLE_COUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT;

    // Scale up beans for high-fidelity visibility
    const PARTICLE_RADIUS = 0.024;
    const VELOCITY_DAMPING_RATE = 1.0;
    const MOUSE_PLANE_Z = -0.28;
    const MOUSE_RADIUS = 0.22;
    const MOUSE_PUSH_FORCE = 0.45;

    // Dynamic full-screen path bounds (extend off-screen left and right)
    const PATH_START = new THREE.Vector3(-1.2, 0.28, MOUSE_PLANE_Z);
    const PATH_END = new THREE.Vector3(1.2, -0.28, MOUSE_PLANE_Z);

    const PATH_CURVE_FREQUENCY = 6.0;
    const PATH_CURVE_AMPLITUDE = 0.08;
    const PATH_CURVE_PHASE_SPEED = 0.25;
    const PATH_DRIFT_SPEED = 0.12;
    const PATH_DRIFT_RATE = 2.0;
    const PATH_ATTRACTION_RATE = 0.55;
    const PATH_SPIRAL_FREQUENCY = 6.0;
    const PATH_RADIUS = 0.13;
    const CONTACT_DIST = PARTICLE_RADIUS * 2 * 0.7;
    const CONTACT_DIST_SQ = CONTACT_DIST * CONTACT_DIST;

    const _v0 = new THREE.Vector3();
    const _v1 = new THREE.Vector3();
    const _pos = new THREE.Vector3();
    const _vel = new THREE.Vector3();
    const _mousePushForce = new THREE.Vector3();
    const _quat = new THREE.Quaternion();
    const _targetQuat = new THREE.Quaternion();
    const _randQuat = new THREE.Quaternion();
    const _mat = new THREE.Matrix4();
    const _segment = new THREE.Vector3();
    const _tangent = new THREE.Vector3();
    const _perpU = new THREE.Vector3();
    const _perpV = new THREE.Vector3();
    const _worldUp = new THREE.Vector3(0, 0, 1);
    const _worldUpAlt = new THREE.Vector3(0, 1, 0);

    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const pathRadius = new Float32Array(PARTICLE_COUNT);
    const pathPhase = new Float32Array(PARTICLE_COUNT);
    const pathSpiralFreqFactor = new Float32Array(PARTICLE_COUNT);
    const rotOffset = new Float32Array(PARTICLE_COUNT * 4);
    const quat = new Float32Array(PARTICLE_COUNT * 4);

    let pathTime = 0;
    const mouse = new THREE.Vector3(0, 0, MOUSE_PLANE_Z);
    const mousePrev = new THREE.Vector3(0, 0, MOUSE_PLANE_Z);
    const lightPosition = new THREE.Vector3(0, 0.4, 0.2);
    let mouseActive = false;

    function updatePathBounds() {
      const vFovRad = THREE.MathUtils.degToRad(camera.fov);
      const dist = Math.abs(camera.position.z - MOUSE_PLANE_Z);
      const halfHeight = Math.tan(vFovRad / 2) * dist;
      const halfWidth = halfHeight * camera.aspect;

      // Span well beyond left edge (-1.4x) and right edge (+1.4x)
      PATH_START.set(-halfWidth * 1.45, halfHeight * 0.5, MOUSE_PLANE_Z);
      PATH_END.set(halfWidth * 1.45, -halfHeight * 0.5, MOUSE_PLANE_Z);
    }

    function updatePathBasis(): number {
      _segment.subVectors(PATH_END, PATH_START);
      const len = _segment.length() || 1e-6;
      _tangent.copy(_segment).divideScalar(len);
      _perpU.crossVectors(_tangent, _worldUp);
      if (_perpU.lengthSq() < 1e-6) {
        _perpU.crossVectors(_tangent, _worldUpAlt);
      }
      _perpU.normalize();
      _perpV.crossVectors(_tangent, _perpU).normalize();
      return len;
    }

    function evalPathTarget(
      frac: number,
      len: number,
      radius: number,
      phase: number,
      spiralFactor: number,
    ) {
      const a =
        PATH_CURVE_FREQUENCY * frac * len + pathTime * PATH_CURVE_PHASE_SPEED;
      const l = PATH_CURVE_AMPLITUDE;
      _v0.copy(PATH_START).addScaledVector(_segment, frac);
      _v0.addScaledVector(_perpU, l * Math.sin(a));
      _v0.addScaledVector(_perpV, l * Math.cos(a));

      const u = PATH_SPIRAL_FREQUENCY * spiralFactor * frac * len + phase;
      _v0.addScaledVector(_perpU, radius * Math.cos(u));
      _v0.addScaledVector(_perpV, radius * Math.sin(u));
    }

    const initialPosData = new Float32Array(PARTICLE_COUNT * 4);
    const initialRotData = new Float32Array(PARTICLE_COUNT * 4);

    updatePathBounds();
    const segLength = updatePathBasis();
    for (let c = 0; c < PARTICLE_COUNT; c++) {
      pathRadius[c] = 2 * Math.random() * PATH_RADIUS;
      pathPhase[c] = 2 * Math.PI * Math.random();
      pathSpiralFreqFactor[c] = 2 * Math.random();
      const frac = Math.random();
      evalPathTarget(
        frac,
        segLength,
        pathRadius[c],
        pathPhase[c],
        pathSpiralFreqFactor[c],
      );

      pos[c * 3] = _v0.x;
      pos[c * 3 + 1] = _v0.y;
      pos[c * 3 + 2] = _v0.z;

      vel[c * 3] = _tangent.x * PATH_DRIFT_SPEED;
      vel[c * 3 + 1] = _tangent.y * PATH_DRIFT_SPEED;
      vel[c * 3 + 2] = _tangent.z * PATH_DRIFT_SPEED;

      _vel.fromArray(vel, c * 3);
      const spd = _vel.length();
      if (spd > 0.001) {
        _v0.copy(_vel).divideScalar(spd);
        _v1.set(0, 0, 1);
        if (Math.abs(_v0.z) > 0.99) _v1.set(1, 0, 0);
        _v1.crossVectors(_v0, _v1).normalize();
        _mat.makeBasis(_v1, _v0, _v1.clone().cross(_v0).normalize());
        _quat.setFromRotationMatrix(_mat);
      } else {
        _quat.identity();
      }
      _quat.toArray(quat, c * 4);

      _v0
        .set(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        )
        .normalize();
      _quat.setFromAxisAngle(_v0, (Math.random() - 0.5) * 2 * Math.PI);
      _quat.toArray(rotOffset, c * 4);

      initialPosData[c * 4] = pos[c * 3];
      initialPosData[c * 4 + 1] = pos[c * 3 + 1];
      initialPosData[c * 4 + 2] = pos[c * 3 + 2];
      initialPosData[c * 4 + 3] = Math.random();

      initialRotData[c * 4] = quat[c * 4];
      initialRotData[c * 4 + 1] = quat[c * 4 + 1];
      initialRotData[c * 4 + 2] = quat[c * 4 + 2];
      initialRotData[c * 4 + 3] = quat[c * 4 + 3];
    }

    const positionTexture = new THREE.DataTexture(
      initialPosData,
      TEXTURE_WIDTH,
      TEXTURE_HEIGHT,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    positionTexture.needsUpdate = true;

    const rotationTexture = new THREE.DataTexture(
      initialRotData,
      TEXTURE_WIDTH,
      TEXTURE_HEIGHT,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    rotationTexture.needsUpdate = true;

    const instanceUvs = new Float32Array(PARTICLE_COUNT * 2);
    for (let c = 0; c < PARTICLE_COUNT; c++) {
      instanceUvs[c * 2] = (c % TEXTURE_WIDTH + 0.5) / TEXTURE_WIDTH;
      instanceUvs[c * 2 + 1] =
        (Math.floor(c / TEXTURE_WIDTH) + 0.5) / TEXTURE_HEIGHT;
    }

    let mesh: THREE.Mesh | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let coffeeBeansTexture: THREE.CanvasTexture | null = null;

    const baseUrl = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;

    Promise.all([
      loadLusionBuf(`${baseUrl}models/COFFEE_BEAN.buf`),
      loadCompositeCoffeeBeanTexture(
        `${baseUrl}textures/coffeeBean/DIFF.webp`,
        `${baseUrl}textures/coffeeBean/HEIGHT.webp`,
      ),
    ])
      .then(([baseGeometry, texture]) => {
        if (isDisposed) {
          baseGeometry.dispose();
          texture.dispose();
          return;
        }

        coffeeBeansTexture = texture;
        const instancedGeo = new THREE.InstancedBufferGeometry();
        for (const attrName in baseGeometry.attributes) {
          instancedGeo.setAttribute(
            attrName,
            baseGeometry.attributes[attrName],
          );
        }
        instancedGeo.setIndex(baseGeometry.getIndex());
        instancedGeo.setAttribute(
          "instanceUv",
          new THREE.InstancedBufferAttribute(instanceUvs, 2),
        );

        material = new THREE.ShaderMaterial({
          vertexShader: VERT_SHADER,
          fragmentShader: FRAG_SHADER,
          uniforms: {
            u_positionTexture: { value: positionTexture },
            u_rotationTexture: { value: rotationTexture },
            u_coffeeBeansTexture: { value: coffeeBeansTexture },
            u_lightPosition: { value: lightPosition },
            u_lightColor: { value: new THREE.Color("#fff2e0") },
            u_ambientColor: { value: new THREE.Color("#6e3c22") },
            u_scale: { value: PARTICLE_RADIUS },
          },
        });

        mesh = new THREE.Mesh(instancedGeo, material);
        mesh.frustumCulled = false;
        scene.add(mesh);
        renderer.render(scene, camera);
      })
      .catch((err) => {
        console.error("Failed to load coffee bean assets:", err);
        setFallback(true);
      });

    const pointer = {
      x: 0,
      y: 0,
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseActive = true;
    };

    const handlePointerLeave = () => {
      mouseActive = false;
    };

    const parentFooter = container.closest("footer") || container;
    parentFooter.addEventListener("pointermove", handlePointerMove as EventListener);
    parentFooter.addEventListener("pointerleave", handlePointerLeave);

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      updatePathBounds();
    };

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(container);

    resize();
    window.addEventListener("resize", resize);

    function updateSimulation(dt: number) {
      if (!mesh) return;

      if (mouseActive) {
        _v0.set(pointer.x, pointer.y, 0.5).unproject(camera);
        _v0.sub(camera.position).normalize();
        const t = (MOUSE_PLANE_Z - camera.position.z) / _v0.z;
        mouse.copy(camera.position).addScaledVector(_v0, t);

        _mousePushForce
          .copy(mouse)
          .sub(mousePrev)
          .multiplyScalar(Math.exp(-dt * 10));
        mousePrev.copy(mouse);

        lightPosition.copy(mouse);
        lightPosition.z += 0.15;
      } else {
        _mousePushForce.set(0, 0, 0);
        lightPosition.set(0, 0.4, 0.2);
      }

      pathTime += dt;
      const len = updatePathBasis();
      const r = _segment.lengthSq() || 1e-12;

      for (let l = 0; l < PARTICLE_COUNT; l++) {
        const u = l * 3;
        _pos.fromArray(pos, u);
        _vel.fromArray(vel, u);

        const frac = _segment.dot(_v1.copy(_pos).sub(PATH_START)) / r;
        evalPathTarget(
          frac,
          len,
          pathRadius[l],
          pathPhase[l],
          pathSpiralFreqFactor[l],
        );
        _v1.subVectors(_pos, _v0);

        const attr = 1 - Math.exp(-dt * PATH_ATTRACTION_RATE);
        _vel.x -= _v1.x * attr;
        _vel.y -= _v1.y * attr;
        _vel.z -= _v1.z * attr;

        const velDotTangent =
          _vel.x * _tangent.x + _vel.y * _tangent.y + _vel.z * _tangent.z;
        const drift = 1 - Math.exp(-dt * PATH_DRIFT_RATE);
        _vel.addScaledVector(
          _tangent,
          (PATH_DRIFT_SPEED - velDotTangent) * drift,
        );
        _vel.multiplyScalar(Math.exp(-dt * VELOCITY_DAMPING_RATE));

        _pos.addScaledVector(_vel, dt);

        // Seamless off-screen looping
        const b = _segment.dot(_v1.copy(_pos).sub(PATH_START)) / r;
        if (b > 1) {
          evalPathTarget(
            0,
            len,
            pathRadius[l],
            pathPhase[l],
            pathSpiralFreqFactor[l],
          );
          _pos.copy(_v0);
        } else if (b < 0) {
          evalPathTarget(
            1,
            len,
            pathRadius[l],
            pathPhase[l],
            pathSpiralFreqFactor[l],
          );
          _pos.copy(_v0);
        }

        if (mouseActive) {
          _v0.subVectors(_pos, mouse);
          const dist = _v0.length();
          if (dist < MOUSE_RADIUS + PARTICLE_RADIUS && dist > 0.001) {
            _v0.divideScalar(dist);
            const penetration = MOUSE_RADIUS + PARTICLE_RADIUS - dist;
            _vel.addScaledVector(_v0, MOUSE_PUSH_FORCE * penetration);
            _vel.add(_mousePushForce);
          }
        }

        _pos.toArray(pos, u);
        _vel.toArray(vel, u);
      }

      // Pairwise distance relaxation to avoid clipping
      for (let l = 0; l < PARTICLE_COUNT; l++) {
        const u = l * 3;
        _pos.fromArray(pos, u);
        for (let c = l + 1; c < PARTICLE_COUNT; c++) {
          const w = c * 3;
          _v1.fromArray(pos, w);
          _v0.subVectors(_v1, _pos);
          const distSq = _v0.lengthSq();
          if (distSq >= CONTACT_DIST_SQ || distSq < 1e-12) continue;
          const p = Math.sqrt(distSq);
          const overlap = (CONTACT_DIST - p) * 0.5;
          _v0.divideScalar(p);
          _pos.addScaledVector(_v0, -overlap);
          _v1.addScaledVector(_v0, overlap);
          _pos.toArray(pos, u);
          _v1.toArray(pos, w);
        }
      }

      // Update position and rotation textures
      for (let l = 0; l < PARTICLE_COUNT; l++) {
        const u = l * 3;
        const c = l * 4;
        _pos.fromArray(pos, u);
        _vel.fromArray(vel, u);
        const speed = _vel.length();

        if (speed > 0.001) {
          _v0.copy(_vel).divideScalar(speed);
          _v1.set(0, 0, 1);
          if (Math.abs(_v0.z) > 0.99) _v1.set(1, 0, 0);
          _v1.crossVectors(_v0, _v1).normalize();
          _mat.makeBasis(_v1, _v0, _v1.clone().cross(_v0).normalize());
          _targetQuat.setFromRotationMatrix(_mat);
        } else {
          _targetQuat.fromArray(quat, c);
        }

        _quat.fromArray(quat, c).slerp(_targetQuat, 0.8).toArray(quat, c);
        _quat.fromArray(quat, c).multiply(_randQuat.fromArray(rotOffset, c));

        initialPosData[c] = _pos.x;
        initialPosData[c + 1] = _pos.y;
        initialPosData[c + 2] = _pos.z;

        initialRotData[c] = _quat.x;
        initialRotData[c + 1] = _quat.y;
        initialRotData[c + 2] = _quat.z;
        initialRotData[c + 3] = _quat.w;
      }

      positionTexture.needsUpdate = true;
      rotationTexture.needsUpdate = true;
    }

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrame = requestAnimationFrame(animate);
      if (!visible || !mesh) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      if (!reducedMotion) {
        updateSimulation(dt);
      }

      renderer.render(scene, camera);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      parentFooter.removeEventListener("pointermove", handlePointerMove as EventListener);
      parentFooter.removeEventListener("pointerleave", handlePointerLeave);

      positionTexture.dispose();
      rotationTexture.dispose();
      if (coffeeBeansTexture) coffeeBeansTexture.dispose();
      if (material) material.dispose();
      if (mesh) {
        mesh.geometry.dispose();
        scene.remove(mesh);
      }
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
