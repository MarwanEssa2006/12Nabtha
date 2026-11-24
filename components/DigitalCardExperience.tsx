'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_CONFIG } from '@/lib/config';
import styles from './DigitalCardExperience.module.css';

const ORIGINAL_FRONT_SRC = '/assets/card/card-front.jpg';
const ORIGINAL_BACK_SRC = '/assets/card/card-back.png';

// Exact 7:4 (1.75:1) high-DPI canvas matching both 1024x585 and 1050x600 original cards
const TEX_W = 2100;
const TEX_H = 1200;
const MAP_W = 1050;
const MAP_H = 600;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface PrintedFaceMaps {
  albedo: HTMLCanvasElement;
  normalCanvas: HTMLCanvasElement;
  roughCanvas: HTMLCanvasElement;
}

/* =========================================================================
   PHOTOREALISTIC PRINTED-PAPER PBR MAP SYNTHESIS FROM ORIGINAL ARTWORK
   Preserves 100% of original artwork pixels while deriving:
   - Subtle physical cotton-paper micro-texture on Albedo
   - Artwork-aware Tangent-Space Normal Map (letterpress ink + paper grain)
   - Artwork-aware Roughness Map (ultra-matte paper vs subtle satin ink)
   ========================================================================= */
function buildPrintedFaceMaps(img: HTMLImageElement, seed: number): PrintedFaceMaps {
  const albedo = document.createElement('canvas');
  albedo.width = TEX_W;
  albedo.height = TEX_H;
  const actx = albedo.getContext('2d');
  if (!actx) throw new Error('2D canvas context unavailable');

  actx.imageSmoothingEnabled = true;
  actx.imageSmoothingQuality = 'high';
  actx.drawImage(img, 0, 0, TEX_W, TEX_H);

  // Apply ultra-subtle organic cotton-linen surface feel without altering artwork colors
  const rand = mulberry32(seed);
  actx.save();
  actx.globalCompositeOperation = 'multiply';
  actx.lineWidth = 1;
  for (let y = 0; y < TEX_H; y += 5) {
    const a = 0.008 + rand() * 0.011;
    actx.strokeStyle = `rgba(130, 118, 98, ${a})`;
    actx.beginPath();
    actx.moveTo(0, y);
    actx.lineTo(TEX_W, y);
    actx.stroke();
  }
  for (let x = 0; x < TEX_W; x += 6) {
    const a = 0.006 + rand() * 0.009;
    actx.strokeStyle = `rgba(122, 112, 94, ${a})`;
    actx.beginPath();
    actx.moveTo(x, 0);
    actx.lineTo(x, TEX_H);
    actx.stroke();
  }
  // Subtle inner edge ambient shading so the flat face blends naturally into the 3D bevel
  const edgeVignette = actx.createRadialGradient(
    TEX_W * 0.5,
    TEX_H * 0.5,
    TEX_W * 0.42,
    TEX_W * 0.5,
    TEX_H * 0.5,
    TEX_W * 0.64
  );
  edgeVignette.addColorStop(0, 'rgba(255, 255, 255, 1)');
  edgeVignette.addColorStop(1, 'rgba(241, 237, 229, 1)');
  actx.fillStyle = edgeVignette;
  actx.fillRect(0, 0, TEX_W, TEX_H);
  actx.restore();

  // Sample Artwork at MAP_W x MAP_H to build physically accurate Normal & Roughness Maps
  const sample = document.createElement('canvas');
  sample.width = MAP_W;
  sample.height = MAP_H;
  const sctx = sample.getContext('2d');
  if (!sctx) throw new Error('2D sample context unavailable');
  sctx.drawImage(img, 0, 0, MAP_W, MAP_H);
  const sData = sctx.getImageData(0, 0, MAP_W, MAP_H).data;

  const heightBuf = new Float32Array(MAP_W * MAP_H);
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = MAP_W;
  roughCanvas.height = MAP_H;
  const rctx = roughCanvas.getContext('2d');
  if (!rctx) throw new Error('2D roughness context unavailable');
  const rImg = rctx.createImageData(MAP_W, MAP_H);
  const rData = rImg.data;

  const randP = mulberry32(seed + 701);
  for (let y = 0; y < MAP_H; y++) {
    const weft = Math.sin(y * 1.45) * 0.012;
    const row = y * MAP_W;
    for (let x = 0; x < MAP_W; x++) {
      const i = (row + x) * 4;
      const lum = (0.299 * sData[i] + 0.587 * sData[i + 1] + 0.114 * sData[i + 2]) / 255.0;

      // Detect printed ink darkness vs. warm linen paper stock (#EEEBE4 ~ lum 0.92)
      const inkFactor = Math.max(0, Math.min(1, (0.86 - lum) / 0.65));

      // Multi-scale cold-press cotton paper micro-grain + weave
      const warp = Math.sin(x * 1.35) * 0.01;
      const fiberNoise = (randP() - 0.5) * 0.055;
      heightBuf[row + x] = 0.5 + weft + warp + fiberNoise - inkFactor * 0.16;

      // Roughness: matte unbleached cotton stock (~0.91) vs. subtle satin ink (~0.56)
      const roughVal = Math.round((0.91 - inkFactor * 0.34 + (randP() - 0.5) * 0.03) * 255);
      const rc = Math.max(110, Math.min(245, roughVal));
      rData[i] = rData[i + 1] = rData[i + 2] = rc;
      rData[i + 3] = 255;
    }
  }
  rctx.putImageData(rImg, 0, 0);

  // Compute Tangent-Space Normal Map via 3x3 Sobel Operator on heightBuf
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = MAP_W;
  normalCanvas.height = MAP_H;
  const nctx = normalCanvas.getContext('2d');
  if (!nctx) throw new Error('2D normal context unavailable');
  const nImg = nctx.createImageData(MAP_W, MAP_H);
  const nData = nImg.data;

  const strength = 2.4;
  for (let y = 0; y < MAP_H; y++) {
    const ym = y > 0 ? y - 1 : 0;
    const yp = y < MAP_H - 1 ? y + 1 : MAP_H - 1;
    const rM = ym * MAP_W;
    const r0 = y * MAP_W;
    const rP = yp * MAP_W;

    for (let x = 0; x < MAP_W; x++) {
      const xm = x > 0 ? x - 1 : 0;
      const xp = x < MAP_W - 1 ? x + 1 : MAP_W - 1;

      const tl = heightBuf[rM + xm];
      const tc = heightBuf[rM + x];
      const tr = heightBuf[rM + xp];
      const ml = heightBuf[r0 + xm];
      const mr = heightBuf[r0 + xp];
      const bl = heightBuf[rP + xm];
      const bc = heightBuf[rP + x];
      const br = heightBuf[rP + xp];

      const dx = (tr + 2 * mr + br - (tl + 2 * ml + bl)) * strength;
      const dy = (bl + 2 * bc + br - (tl + 2 * tc + tr)) * strength;
      const dz = 1.0;
      const inv = 1.0 / Math.sqrt(dx * dx + dy * dy + dz * dz);

      const idx = (r0 + x) * 4;
      nData[idx] = Math.round((-dx * inv * 0.5 + 0.5) * 255);
      nData[idx + 1] = Math.round((dy * inv * 0.5 + 0.5) * 255);
      nData[idx + 2] = Math.round((dz * inv * 0.5 + 0.5) * 255);
      nData[idx + 3] = 255;
    }
  }
  nctx.putImageData(nImg, 0, 0);

  return { albedo, normalCanvas, roughCanvas };
}

function buildStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0xd5cec2);

  const envDisposables: Array<{ dispose: () => void }> = [];
  const addEnvPanel = (
    w: number,
    h: number,
    colorHex: number,
    pos: [number, number, number],
    rotX?: number
  ) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide });
    envDisposables.push(geo, mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos[0], pos[1], pos[2]);
    if (rotX !== undefined) {
      mesh.rotation.x = rotX;
    } else {
      mesh.lookAt(0, 0, 0);
    }
    envScene.add(mesh);
  };

  // Overhead diffused studio softbox
  addEnvPanel(16, 9, 0xfffcf6, [0, 7.2, 2.2], Math.PI * 0.45);
  // Warm camera-left key softbox
  addEnvPanel(5.5, 11, 0xfff3df, [-8.2, 2.2, 5.0]);
  // Subtle cool-neutral fill bounce (camera-right)
  addEnvPanel(5.0, 9.5, 0xedf0eb, [8.6, 0.8, 3.8]);
  // Negative-fill flags for crisp studio edge contrast
  addEnvPanel(4.2, 10, 0x383631, [-7.5, -1.5, -2.5]);
  addEnvPanel(4.2, 10, 0x42403a, [7.5, -1.5, -2.8]);
  // Back-top rim strip to sculpt the rounded bevel as the card turns edge-on
  addEnvPanel(14, 2.8, 0xfffaf0, [0, 4.0, -7.8]);

  const rt = pmrem.fromScene(envScene, 0.04);
  for (const item of envDisposables) item.dispose();
  pmrem.dispose();
  return rt;
}

function createRoundedCardShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function createNormalizedPlaneShapeGeo(w: number, h: number, r: number): THREE.ShapeGeometry {
  const shape = createRoundedCardShape(w, h, r);
  const geo = new THREE.ShapeGeometry(shape, 40);
  const pos = geo.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uvs[i * 2] = (pos.getX(i) + w / 2) / w;
    uvs[i * 2 + 1] = (pos.getY(i) + h / 2) / h;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geo;
}

function shortestAngleTarget(current: number, desiredMod: number): number {
  const twoPi = Math.PI * 2;
  const curMod = ((current % twoPi) + twoPi) % twoPi;
  let diff = desiredMod - curMod;
  if (diff > Math.PI) diff -= twoPi;
  if (diff < -Math.PI) diff += twoPi;
  return current + diff;
}

interface CardControls {
  toggleRotate: () => void;
  viewFront: () => void;
  viewBack: () => void;
}

export function DigitalCardExperience() {
  const { lang, t } = useLanguage();

  const stageRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const shadowAmbRef = useRef<HTMLDivElement>(null);
  const fallbackCardRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<CardControls | null>(null);

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeFace, setActiveFace] = useState<'front' | 'back'>('front');
  const [isDraggingUI, setIsDraggingUI] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Sync page <title> and meta description on language change without recreating the 3D scene
  useEffect(() => {
    document.title = t('cardPage.metaTitle');
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = t('cardPage.metaDescription');
    }
  }, [lang, t]);

  useEffect(() => {
    const stage = stageRef.current;
    const shadowEl = shadowRef.current;
    const shadowAmbEl = shadowAmbRef.current;
    if (!stage || !shadowEl || !shadowAmbEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

    if (prefersReducedMotion) {
      setIsAutoRotating(false);
    }

    let disposed = false;
    let fallbackRafId: number | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let cleanupThreeListeners: (() => void) | null = null;

    const startCssFallback = () => {
      if (disposed) return;
      setUseFallback(true);
      let angle = 0;
      let autoRotate = !prefersReducedMotion;
      setIsAutoRotating(autoRotate);
      setActiveFace('front');

      controlsRef.current = {
        toggleRotate: () => {
          autoRotate = !autoRotate;
          setIsAutoRotating(autoRotate);
        },
        viewFront: () => {
          autoRotate = false;
          angle = 0;
          setIsAutoRotating(false);
          setActiveFace('front');
        },
        viewBack: () => {
          autoRotate = false;
          angle = 180;
          setIsAutoRotating(false);
          setActiveFace('back');
        },
      };

      let lastT = performance.now();
      const tick = (now: number) => {
        if (disposed) return;
        const dt = Math.min(0.05, (now - lastT) / 1000);
        lastT = now;
        if (autoRotate) {
          angle = (angle + dt * 24) % 360;
        }
        if (fallbackCardRef.current) {
          fallbackCardRef.current.style.transform = `rotateY(${angle.toFixed(2)}deg)`;
        }
        const normAngle = ((angle % 360) + 360) % 360;
        const nextFace = normAngle < 90 || normAngle > 270 ? 'front' : 'back';
        setActiveFace((prev) => (prev === nextFace ? prev : nextFace));
        fallbackRafId = requestAnimationFrame(tick);
      };
      fallbackRafId = requestAnimationFrame(tick);
    };

    const boot = async () => {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
      } catch {
        startCssFallback();
        return;
      }

      let frontImg: HTMLImageElement;
      let backImg: HTMLImageElement;
      try {
        [frontImg, backImg] = await Promise.all([
          loadImage(ORIGINAL_FRONT_SRC),
          loadImage(ORIGINAL_BACK_SRC),
        ]);
      } catch {
        renderer.dispose();
        renderer = null;
        startCssFallback();
        return;
      }

      if (disposed) {
        if (renderer) {
          renderer.dispose();
          renderer = null;
        }
        return;
      }

      const frontMaps = buildPrintedFaceMaps(frontImg, 1212);
      const backMaps = buildPrintedFaceMaps(backImg, 2424);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(stage.clientWidth || 360, stage.clientHeight || 360);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.02;
      renderer.physicallyCorrectLights = true;
      stage.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        31,
        (stage.clientWidth || 360) / (stage.clientHeight || 360),
        0.1,
        100
      );
      camera.position.set(0, 0.05, 6.6);

      const envRenderTarget = buildStudioEnvMap(renderer);
      scene.environment = envRenderTarget.texture;

      // Physically calibrated 4-point product photography lighting
      const hemiLight = new THREE.HemisphereLight(0xfffdf8, 0xc4bbb0, 0.78);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfff8ec, 1.82);
      keyLight.position.set(-4.6, 5.2, 6.6);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xeef2ec, 0.72);
      fillLight.position.set(5.8, 1.5, 4.4);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xfff0d4, 1.65);
      rimLight.position.set(1.8, 4.6, -5.8);
      scene.add(rimLight);

      // Exact 7:4 (1.75:1) proportions matching original front (1024x585) & back (1050x600)
      const CARD_W = 3.5;
      const CARD_H = 2.0;
      const CARD_R = 0.142;
      const CORE_DEPTH = 0.054;
      const BEVEL_T = 0.017;
      const BEVEL_S = 0.017;
      const TOTAL_HALF_Z = CORE_DEPTH * 0.5 + BEVEL_T;

      const cardGroup = new THREE.Group();
      scene.add(cardGroup);

      // 1. Solid Extruded Rounded-Corner Body with Smooth 12-Segment Micro-Chamfer
      const coreShape = createRoundedCardShape(
        CARD_W - BEVEL_S * 2,
        CARD_H - BEVEL_S * 2,
        CARD_R - BEVEL_S
      );
      const coreGeo = new THREE.ExtrudeGeometry(coreShape, {
        depth: CORE_DEPTH,
        bevelEnabled: true,
        bevelThickness: BEVEL_T,
        bevelSize: BEVEL_S,
        bevelSegments: 12,
        curveSegments: 40,
      });
      coreGeo.translate(0, 0, -CORE_DEPTH * 0.5);

      const edgeMat = new THREE.MeshPhysicalMaterial({
        color: 0xe6e1d6,
        roughness: 0.74,
        metalness: 0.02,
        clearcoat: 0.04,
        clearcoatRoughness: 0.78,
        envMapIntensity: 0.88,
      });
      const coreMesh = new THREE.Mesh(coreGeo, edgeMat);
      cardGroup.add(coreMesh);

      // Subtle warm sand-tan inner cotton-kraft core seam
      const seamShape = createRoundedCardShape(
        CARD_W - BEVEL_S * 0.9,
        CARD_H - BEVEL_S * 0.9,
        CARD_R - BEVEL_S * 0.52
      );
      const seamGeo = new THREE.ExtrudeGeometry(seamShape, {
        depth: 0.02,
        bevelEnabled: false,
        curveSegments: 40,
      });
      seamGeo.translate(0, 0, -0.01);
      const seamMat = new THREE.MeshPhysicalMaterial({
        color: 0xc2ab88,
        roughness: 0.62,
        metalness: 0.06,
        clearcoat: 0.06,
        clearcoatRoughness: 0.65,
        envMapIntensity: 0.92,
      });
      const seamMesh = new THREE.Mesh(seamGeo, seamMat);
      cardGroup.add(seamMesh);

      const createdTextures: THREE.Texture[] = [];
      const maxAniso = Math.min(16, renderer.capabilities.getMaxAnisotropy());
      const makeTex = (canvas: HTMLCanvasElement, isColor: boolean): THREE.CanvasTexture => {
        const tex = new THREE.CanvasTexture(canvas);
        if (isColor) tex.encoding = THREE.sRGBEncoding;
        tex.anisotropy = maxAniso;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        createdTextures.push(tex);
        return tex;
      };

      const faceGeo = createNormalizedPlaneShapeGeo(
        CARD_W - BEVEL_S * 1.88,
        CARD_H - BEVEL_S * 1.88,
        CARD_R - BEVEL_S * 0.94
      );

      // 2. Front Face Surface
      const frontMat = new THREE.MeshPhysicalMaterial({
        map: makeTex(frontMaps.albedo, true),
        normalMap: makeTex(frontMaps.normalCanvas, false),
        normalScale: new THREE.Vector2(0.42, 0.42),
        roughnessMap: makeTex(frontMaps.roughCanvas, false),
        roughness: 0.95,
        metalness: 0.01,
        clearcoat: 0.02,
        clearcoatRoughness: 0.88,
        envMapIntensity: 0.56,
      });
      const frontMesh = new THREE.Mesh(faceGeo, frontMat);
      frontMesh.position.z = TOTAL_HALF_Z + 0.0012;
      cardGroup.add(frontMesh);

      // 3. Back Face Surface
      const backMat = new THREE.MeshPhysicalMaterial({
        map: makeTex(backMaps.albedo, true),
        normalMap: makeTex(backMaps.normalCanvas, false),
        normalScale: new THREE.Vector2(0.38, 0.38),
        roughnessMap: makeTex(backMaps.roughCanvas, false),
        roughness: 0.95,
        metalness: 0.01,
        clearcoat: 0.02,
        clearcoatRoughness: 0.88,
        envMapIntensity: 0.56,
      });
      const backMesh = new THREE.Mesh(faceGeo, backMat);
      backMesh.rotation.y = Math.PI;
      backMesh.position.z = -(TOTAL_HALF_Z + 0.0012);
      cardGroup.add(backMesh);

      const updateCameraFit = () => {
        if (!renderer) return;
        const w = stage.clientWidth || 360;
        const h = stage.clientHeight || 360;
        camera.aspect = w / h;

        const vFovRad = THREE.MathUtils.degToRad(camera.fov);
        const fitHeightDist = (CARD_H * 1.62) / (2 * Math.tan(vFovRad / 2));
        const fitWidthDist = (CARD_W * 1.34) / (2 * Math.tan(vFovRad / 2) * camera.aspect);
        camera.position.z = Math.max(fitHeightDist, fitWidthDist, 5.7);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      updateCameraFit();

      let autoRotatingState = !prefersReducedMotion;
      let isDragging = false;
      let activePointerId: number | null = null;
      let lastPointerX = 0;
      let lastPointerY = 0;

      let rotY = prefersReducedMotion ? 0.2 : -0.22;
      let rotX = 0.06;
      let velY = 0;
      let velX = 0;

      let targetRotY: number | null = null;
      let targetRotX: number | null = null;

      let hoverTiltX = 0;
      let hoverTiltY = 0;
      let lastReportedFace: 'front' | 'back' = 'front';

      const setAutoRotating = (next: boolean) => {
        autoRotatingState = next;
        setIsAutoRotating(next);
      };

      const syncFaceIndicator = (angleY: number) => {
        const norm = ((angleY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const nextFace: 'front' | 'back' =
          norm < Math.PI * 0.5 || norm > Math.PI * 1.5 ? 'front' : 'back';
        if (nextFace !== lastReportedFace) {
          lastReportedFace = nextFace;
          setActiveFace(nextFace);
        }
      };

      controlsRef.current = {
        toggleRotate: () => {
          const next = !autoRotatingState;
          if (next) {
            targetRotY = null;
            targetRotX = null;
          }
          setAutoRotating(next);
        },
        viewFront: () => {
          setAutoRotating(false);
          velY = 0;
          velX = 0;
          targetRotY = shortestAngleTarget(rotY, 0);
          targetRotX = 0.025;
        },
        viewBack: () => {
          setAutoRotating(false);
          velY = 0;
          velX = 0;
          targetRotY = shortestAngleTarget(rotY, Math.PI);
          targetRotX = 0.02;
        },
      };

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== undefined && e.button !== 0) return;
        isDragging = true;
        activePointerId = e.pointerId;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        velY = 0;
        velX = 0;
        targetRotY = null;
        targetRotX = null;
        setIsDraggingUI(true);
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          // ignore pointer capture error
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        if (isDragging && e.pointerId === activePointerId) {
          const dx = e.clientX - lastPointerX;
          const dy = e.clientY - lastPointerY;
          lastPointerX = e.clientX;
          lastPointerY = e.clientY;

          const sens = 0.0076;
          rotY += dx * sens;
          rotX = THREE.MathUtils.clamp(rotX + dy * sens * 0.7, -0.56, 0.56);
          velY = dx * sens * 0.62;
          velX = dy * sens * 0.42;
        } else if (e.pointerType === 'mouse') {
          const rect = stage.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
            hoverTiltY = nx * 0.055;
            hoverTiltX = ny * 0.045;
          }
        }
      };

      const endDrag = (e: PointerEvent) => {
        if (!isDragging || e.pointerId !== activePointerId) return;
        isDragging = false;
        activePointerId = null;
        setIsDraggingUI(false);
      };

      const onPointerLeave = () => {
        hoverTiltX = 0;
        hoverTiltY = 0;
      };

      const onKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'A' ||
            target.tagName === 'BUTTON' ||
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA')
        ) {
          return;
        }
        if (e.code === 'Space') {
          e.preventDefault();
          const next = !autoRotatingState;
          targetRotY = null;
          setAutoRotating(next);
        } else if (e.code === 'ArrowRight') {
          setAutoRotating(false);
          targetRotY = rotY + Math.PI * 0.25;
        } else if (e.code === 'ArrowLeft') {
          setAutoRotating(false);
          targetRotY = rotY - Math.PI * 0.25;
        }
      };

      window.addEventListener('resize', updateCameraFit);
      stage.addEventListener('pointerdown', onPointerDown);
      stage.addEventListener('pointermove', onPointerMove);
      stage.addEventListener('pointerup', endDrag);
      stage.addEventListener('pointercancel', endDrag);
      stage.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('keydown', onKeyDown);

      let lastTime = performance.now();
      let elapsed = 0;
      let rafId = 0;

      const animate = (now: number) => {
        if (disposed || !renderer) return;
        rafId = requestAnimationFrame(animate);
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        elapsed += dt;

        if (!isDragging) {
          if (targetRotY !== null) {
            rotY += (targetRotY - rotY) * Math.min(1, dt * 6.2);
            rotX += ((targetRotX || 0) - rotX) * Math.min(1, dt * 6.2);
            if (Math.abs(targetRotY - rotY) < 0.002) {
              rotY = targetRotY;
              targetRotY = null;
              targetRotX = null;
            }
          } else if (autoRotatingState) {
            const edgeFactor = Math.pow(Math.sin(rotY), 2);
            const angularSpeed = 0.21 + edgeFactor * 0.66;
            rotY += angularSpeed * dt + velY;
            velY *= Math.pow(0.04, dt);

            const idealPitch = Math.sin(elapsed * 0.62) * 0.07 + 0.048;
            rotX += (idealPitch - rotX) * Math.min(1, dt * 2.2);
            velX *= Math.pow(0.04, dt);
          } else {
            rotY += velY;
            rotX = THREE.MathUtils.clamp(rotX + velX, -0.56, 0.56);
            velY *= Math.pow(0.025, dt);
            velX *= Math.pow(0.025, dt);
            if (Math.abs(velY) < 0.0001) velY = 0;
            if (Math.abs(velX) < 0.0001) velX = 0;
          }
        }

        const floatY = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.12) * 0.05;
        cardGroup.position.y = floatY;

        cardGroup.rotation.y = rotY + (isDragging ? 0 : hoverTiltY);
        cardGroup.rotation.x = rotX + (isDragging ? 0 : hoverTiltX);
        cardGroup.rotation.z = prefersReducedMotion ? 0 : Math.sin(rotY) * -0.03;

        keyLight.position.x = -4.6 + Math.sin(elapsed * 0.48) * 0.36;

        const faceProj = 0.28 + 0.72 * Math.abs(Math.cos(cardGroup.rotation.y));
        const floatScale = 1 - floatY * 0.65;
        const shadowShiftX = Math.sin(cardGroup.rotation.y) * 9;

        shadowEl.style.transform = `translateX(calc(-50% + ${shadowShiftX.toFixed(1)}px)) scaleX(${(faceProj * floatScale).toFixed(3)}) scaleY(${floatScale.toFixed(3)})`;
        shadowEl.style.opacity = (0.72 + 0.26 * faceProj).toFixed(3);

        shadowAmbEl.style.transform = `translateX(calc(-50% + ${(shadowShiftX * 0.6).toFixed(1)}px)) scaleX(${((0.46 + 0.54 * faceProj) * floatScale).toFixed(3)}) scaleY(${floatScale.toFixed(3)})`;
        shadowAmbEl.style.opacity = (0.68 + 0.24 * faceProj).toFixed(3);

        syncFaceIndicator(rotY);
        renderer.render(scene, camera);
      };

      rafId = requestAnimationFrame(animate);

      cleanupThreeListeners = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', updateCameraFit);
        stage.removeEventListener('pointerdown', onPointerDown);
        stage.removeEventListener('pointermove', onPointerMove);
        stage.removeEventListener('pointerup', endDrag);
        stage.removeEventListener('pointercancel', endDrag);
        stage.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('keydown', onKeyDown);

        coreGeo.dispose();
        seamGeo.dispose();
        faceGeo.dispose();
        edgeMat.dispose();
        seamMat.dispose();
        frontMat.dispose();
        backMat.dispose();
        for (const tex of createdTextures) tex.dispose();
        envRenderTarget.dispose();

        if (renderer) {
          if (renderer.domElement.parentNode === stage) {
            stage.removeChild(renderer.domElement);
          }
          renderer.dispose();
          renderer = null;
        }
      };
    };

    void boot();

    return () => {
      disposed = true;
      controlsRef.current = null;
      if (fallbackRafId !== null) {
        cancelAnimationFrame(fallbackRafId);
      }
      if (cleanupThreeListeners) {
        cleanupThreeListeners();
      } else if (renderer) {
        renderer.dispose();
        renderer = null;
      }
    };
  }, []);

  const instagramHref = NABTA_CONFIG.contact.instagram || 'https://www.instagram.com/12nabta/';

  return (
    <div className={styles.pageShell}>
      <a className="skip" href="#main">
        {t('nav.skip')}
      </a>

      <Navbar page="digital-card" />

      <main id="main" className={styles.studioSection}>
        <div className={styles.studioHeader} role="region" aria-label={t('cardPage.headerLabel')}>
          <div className={styles.brandEyebrow}>
            <span className={styles.brandDot} aria-hidden="true" />
            <span>{t('cardPage.eyebrow')}</span>
          </div>
          <div className={styles.interactionHint} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m15 8 4 4-4 4" />
              <path d="m9 8-4 4 4 4" />
            </svg>
            <span>{t('cardPage.hint')}</span>
          </div>
        </div>

        <div className={styles.stageShell}>
          <div
            ref={stageRef}
            id="card-stage"
            dir="ltr"
            className={`${styles.cardStage}${isDraggingUI ? ` ${styles.dragging}` : ''}`}
            role="region"
            aria-label={t('cardPage.stageLabel')}
          >
            <div ref={shadowAmbRef} className={styles.stageShadowAmbient} aria-hidden="true" />
            <div ref={shadowRef} className={styles.stageShadow} aria-hidden="true" />

            {useFallback && (
              <div className={`${styles.cssFallbackWrap} ${styles.active}`}>
                <div ref={fallbackCardRef} className={styles.cssCard3d}>
                  <div className={styles.cssCardFace}>
                    <img src={ORIGINAL_FRONT_SRC} alt={t('cardPage.frontAlt')} />
                  </div>
                  <div className={`${styles.cssCardFace} ${styles.cssCardBack}`}>
                    <img src={ORIGINAL_BACK_SRC} alt={t('cardPage.backAlt')} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.controlsDock}>
          <div className={styles.toolbar} role="group" aria-label={t('cardPage.controlsLabel')}>
            <button
              type="button"
              id="btn-toggle-rotate"
              className={styles.ctrlBtn}
              aria-pressed={!isAutoRotating}
              aria-label={t(isAutoRotating ? 'cardPage.pauseLabel' : 'cardPage.resumeLabel')}
              onClick={() => controlsRef.current?.toggleRotate()}
            >
              {isAutoRotating ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              )}
              <span>{t(isAutoRotating ? 'cardPage.pause' : 'cardPage.resume')}</span>
            </button>

            <span className={styles.toolbarDivider} aria-hidden="true" />

            <button
              type="button"
              id="btn-view-front"
              className={`${styles.ctrlBtn}${activeFace === 'front' ? ` ${styles.isActive}` : ''}`}
              aria-label={t('cardPage.frontLabel')}
              onClick={() => controlsRef.current?.viewFront()}
            >
              <span>{t('cardPage.front')}</span>
            </button>

            <button
              type="button"
              id="btn-view-back"
              className={`${styles.ctrlBtn}${activeFace === 'back' ? ` ${styles.isActive}` : ''}`}
              aria-label={t('cardPage.backLabel')}
              onClick={() => controlsRef.current?.viewBack()}
            >
              <span>{t('cardPage.backQr')}</span>
            </button>
          </div>

          <a
            className={styles.igCta}
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('cardPage.followIgLabel')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.85"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" ry="5.2" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            <span>{t('cardPage.followIg')}</span>
          </a>

          <p className={styles.subCaption}>
            <bdi dir="ltr">@12nabta</bdi> · مبادرة ١٢ نبتة
          </p>
        </div>
      </main>

      <Footer page="digital-card" />
    </div>
  );
}
