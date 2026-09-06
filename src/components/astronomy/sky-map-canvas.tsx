"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  computeSkyBodies,
  type BodySkyPoint,
  type ObserverPoint,
} from "@/lib/astronomy/sky-map";

interface SkyMapCanvasProps {
  observer: ObserverPoint;
  date?: Date;
  className?: string;
}

interface TooltipBody {
  point: BodySkyPoint;
  screenX: number;
  screenY: number;
}

const CARDINALS: { label: string; azDeg: number }[] = [
  { label: "N", azDeg: 0 },
  { label: "E", azDeg: 90 },
  { label: "S", azDeg: 180 },
  { label: "W", azDeg: 270 },
];

const PLANET_ORDER = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
];

/** Map azimuth (deg, clockwise from north) + altitude (deg) onto unit sphere. */
function altAzToVec3(azimuthDeg: number, altitudeDeg: number): THREE.Vector3 {
  const az = (azimuthDeg * Math.PI) / 180;
  const alt = (altitudeDeg * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(alt) * Math.sin(az),
    Math.sin(alt),
    -Math.cos(alt) * Math.cos(az),
  );
}

interface SpriteSpec {
  sprite: THREE.Sprite;
  mat: THREE.SpriteMaterial;
  baseScale: number;
}

function bodyAppearance(point: BodySkyPoint): {
  mat: THREE.SpriteMaterial;
  baseScale: number;
} {
  if (point.id === "sun") {
    return { mat: makeGlowSprite(255, 200, 80, 96, 0.98), baseScale: 0.3 };
  }
  if (point.id === "moon") {
    return { mat: makeGlowSprite(230, 230, 255, 80, 0.95), baseScale: 0.24 };
  }
  if (point.kind === "planet") {
    return { mat: makeGlowSprite(120, 195, 255, 64, 0.92), baseScale: 0.15 };
  }
  // Bright star: size driven by magnitude (brighter = bigger).
  const b = 0.85 + Math.max(0.08, 2 - point.magnitude) * 0.22;
  return { mat: makeGlowSprite(255, 255, 255, 48, 0.85, false), baseScale: b * 0.09 };
}

function makeGlowSprite(
  r: number,
  g: number,
  b: number,
  size = 64,
  coreAlpha = 0.95,
  halo = true,
): THREE.SpriteMaterial {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const radius = size * 0.42;

  if (halo) {
    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, `rgba(${r},${g},${b},${coreAlpha})`);
    grad.addColorStop(0.4, `rgba(${r},${g},${b},${coreAlpha * 0.45})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  const core = ctx.createRadialGradient(c, c, 0, c, c, radius);
  core.addColorStop(0, "rgba(255,255,255,0.95)");
  core.addColorStop(0.55, `rgba(${r},${g},${b},${coreAlpha})`);
  core.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, 2 * Math.PI);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function makeTextSprite(text: string, color = "#ffffff", fontSize = 42): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `700 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(6,8,22,0.65)";
  ctx.fillText(text, canvas.width / 2 + 2, canvas.height / 2 + 2);
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.28, 0.14, 1);
  return sprite;
}

export function SkyMapCanvas({ observer, date, className }: SkyMapCanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gl, setGl] = useState<boolean | null>(null);
  const [tooltip, setTooltip] = useState<TooltipBody | null>(null);
  const [viewW, setViewW] = useState(0);

  const at = useMemo(() => date ?? new Date(), [date]);
  const bodies = useMemo(() => computeSkyBodies(observer, at), [observer, at]);
  const bodiesRef = useRef(bodies);
  useEffect(() => {
    bodiesRef.current = bodies;
  }, [bodies]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current ?? undefined,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setGl(false));
      return;
    }
    if (!renderer) return;
    queueMicrotask(() => setGl(true));

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x06081a, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 50);
    camera.position.set(1.7, 1.25, 2.2);

    const resize = () => {
      const width = wrap.clientWidth || 1;
      const height = wrap.clientHeight || width || 1;
      renderer!.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      setViewW(wrap.clientWidth || 0);
    });
    ro.observe(wrap);

    // ---------- Sky dome (deep vertical gradient) ----------
    const domeGeo = new THREE.SphereGeometry(9, 48, 32);
    const domeMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      transparent: true,
      uniforms: {
        horizonColor: { value: new THREE.Color(0x12142e) },
        zenithColor: { value: new THREE.Color(0x02030c) },
      },
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        uniform vec3 horizonColor;
        uniform vec3 zenithColor;
        void main() {
          float t = clamp(normalize(vPos).y, 0.0, 1.0);
          t = pow(t, 0.8);
          vec3 col = mix(horizonColor, zenithColor, t);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = -1;
    scene.add(dome);

    // ---------- Decorative ambient starfield (scenery, not data) ----------
    const starCount = 2600;
    const starPos = new Float32Array(starCount * 3);
    const starSz = new Float32Array(starCount);
    let seed = 12345;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < starCount; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 8.4;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      starSz[i] = 0.6 + rand() * rand() * 3.2;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSz, 1));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ---------- Horizon: glowing ring + translucent ground disc ----------
    const horizonGeo = new THREE.RingGeometry(0.985, 1.015, 128);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0xc3d4ff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.rotation.x = -Math.PI / 2;
    scene.add(horizon);

    const groundGeo = new THREE.CircleGeometry(1, 128);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x0a0e22,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.002;
    scene.add(ground);

    // ---------- Faint altitude rings at 30° and 60° ----------
    for (const altDeg of [30, 60]) {
      const alt = (altDeg * Math.PI) / 180;
      const radius = Math.cos(alt);
      const y = Math.sin(alt);
      const ringGeo = new THREE.RingGeometry(radius - 0.004, radius + 0.004, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8f9bd6,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = y;
      scene.add(ring);
    }

    // ---------- Cardinal compass labels + zenith marker ----------
    for (const c of CARDINALS) {
      const pos = altAzToVec3(c.azDeg, 0).multiplyScalar(1.16);
      const s = makeTextSprite(c.label, "#e8edff");
      s.position.copy(pos);
      scene.add(s);
    }
    const zenithSprite = makeTextSprite("Zenith", "#ffd989", 34);
    zenithSprite.position.set(0, 1.24, 0);
    zenithSprite.scale.set(0.34, 0.15, 1);
    scene.add(zenithSprite);

    const zenithSparkle = new THREE.Sprite(
      makeGlowSprite(255, 217, 137, 40, 0.8, true),
    );
    zenithSparkle.scale.setScalar(0.06);
    zenithSparkle.position.set(0, 1.04, 0);
    scene.add(zenithSparkle);

    // ---------- Real data bodies ----------
    const bodySprites: Record<string, SpriteSpec> = {};
    const spawnBody = (point: BodySkyPoint): SpriteSpec => {
      const { mat, baseScale } = bodyAppearance(point);
      const sprite = new THREE.Sprite(mat);
      sprite.scale.setScalar(baseScale);
      scene.add(sprite);
      const spec = { sprite, mat, baseScale };
      bodySprites[point.id] = spec;
      return spec;
    };
    for (const point of bodiesRef.current) {
      if (!bodySprites[point.id]) spawnBody(point);
    }

    const placeBodies = () => {
      const list = bodiesRef.current;
      const seen = new Set<string>();
      for (const point of list) {
        const spec = bodySprites[point.id];
        if (!spec) continue;
        seen.add(point.id);
        const pos = altAzToVec3(point.azimuth, point.altitude);
        if (point.altitude >= -2) {
          const dim = Math.min(1, 0.35 + ((point.altitude + 2) / 2) * 0.65);
          spec.mat.opacity = dim;
          spec.sprite.position.copy(pos);
          spec.sprite.visible = true;
        } else {
          spec.sprite.visible = false;
        }
      }
      for (const id of Object.keys(bodySprites)) {
        if (!seen.has(id)) bodySprites[id].sprite.visible = false;
      }
    };
    placeBodies();

    const reconcile = () => {
      const list = bodiesRef.current;
      const ids = new Set(list.map((b) => b.id));
      for (const point of list) {
        if (!bodySprites[point.id]) spawnBody(point);
      }
      for (const id of Object.keys(bodySprites)) {
        if (!ids.has(id)) {
          scene.remove(bodySprites[id].sprite);
          bodySprites[id].mat.dispose();
          delete bodySprites[id];
        }
      }
      placeBodies();
    };

    // ---------- Name-label overlay (Canvas 2D projected each frame) ----------
    const labelCanvas = document.createElement("canvas");
    labelCanvas.style.position = "absolute";
    labelCanvas.style.inset = "0";
    labelCanvas.style.width = "100%";
    labelCanvas.style.height = "100%";
    labelCanvas.style.pointerEvents = "none";
    wrap.appendChild(labelCanvas);
    const labelCtx = labelCanvas.getContext("2d")!;

    const drawLabels = () => {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      labelCanvas.width = Math.floor(w * dpr);
      labelCanvas.height = Math.floor(h * dpr);
      labelCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      labelCtx.clearRect(0, 0, w, h);
      labelCtx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
      labelCtx.textAlign = "center";
      labelCtx.textBaseline = "bottom";

      const visible = bodiesRef.current
        .filter((b) => b.altitude >= -2)
        .sort((a, b) => {
          const ra = PLANET_ORDER.indexOf(a.id);
          const rb = PLANET_ORDER.indexOf(b.id);
          return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb);
        });

      const projPoint = new THREE.Vector3();
      for (const point of visible) {
        projPoint.copy(altAzToVec3(point.azimuth, point.altitude)).project(camera);
        if (projPoint.z > 1 || projPoint.z < -1) continue;
        const x = (projPoint.x * 0.5 + 0.5) * w;
        const y = (-projPoint.y * 0.5 + 0.5) * h;
        const isPlanetoid =
          point.kind === "planet" || point.id === "sun" || point.id === "moon";
        labelCtx.fillStyle = "rgba(6,8,22,0.6)";
        labelCtx.fillText(point.label, x + 1, y + 1 - 4);
        labelCtx.fillStyle = isPlanetoid
          ? "rgba(255,214,120,0.95)"
          : "rgba(235,240,255,0.9)";
        labelCtx.fillText(point.label, x, y - 4);
      }
    };

    // ---------- Controls ----------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.9;
    controls.minDistance = 0.9;
    controls.maxDistance = 4.2;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    let idleTimer = 0;
    const armIdleResume = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 4000);
    };
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      window.clearTimeout(idleTimer);
    });
    controls.addEventListener("end", armIdleResume);

    // ---------- Pointer picking (hover / tap) ----------
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();

    const pickAt = (clientX: number, clientY: number): TooltipBody | null => {
      const rect = renderer!.domElement.getBoundingClientRect();
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      const candidates = Object.values(bodySprites)
        .filter((s) => s.sprite.visible)
        .sort(
          (a, b) =>
            a.sprite.position.distanceTo(camera.position) -
            b.sprite.position.distanceTo(camera.position),
        );
      for (const spec of candidates) {
        if (raycaster.intersectObject(spec.sprite, true).length > 0) {
          const wv = spec.sprite.position.clone().project(camera);
          const w = rect.width;
          const h = rect.height;
          const sx = (wv.x * 0.5 + 0.5) * w;
          const sy = (-wv.y * 0.5 + 0.5) * h;
          const vec = spec.sprite.position.clone();
          const found = bodiesRef.current.find(
            (b) =>
              b.altitude >= -2 &&
              vec.distanceTo(altAzToVec3(b.azimuth, b.altitude)) < 0.02,
          );
          if (found) return { point: found, screenX: sx, screenY: sy };
        }
      }
      return null;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons !== 0) return;
      const hit = pickAt(e.clientX, e.clientY);
      setTooltip(hit);
    };
    const onPointerLeave = () => setTooltip(null);
    const onPointerDown = (e: PointerEvent) => {
      const hit = pickAt(e.clientX, e.clientY);
      if (hit) setTooltip(hit);
    };
    const dom = renderer.domElement;
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerleave", onPointerLeave);
    dom.addEventListener("pointerdown", onPointerDown);

    // ---------- Frame loop ----------
    let raf = 0;
    let stopped = false;
    const loop = () => {
      if (stopped) return;
      raf = requestAnimationFrame(loop);
      reconcile();
      placeBodies();
      controls.update();
      renderer!.render(scene, camera);
      drawLabels();
    };
    loop();

    // ---------- Cleanup ----------
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      renderer!.dispose();
      controls.dispose();
      ro.disconnect();
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerleave", onPointerLeave);
      dom.removeEventListener("pointerdown", onPointerDown);
      labelCanvas.remove();
      starGeo.dispose();
      starMat.dispose();
      domeGeo.dispose();
      domeMat.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      for (const key of Object.keys(bodySprites)) {
        bodySprites[key].mat.dispose();
      }
      setTooltip(null);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative w-full ${className ?? ""}`}>
      {gl === false && (
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted">
          WebGL is not available in this browser, so the 3D sky map cannot be
          shown. Try a recent desktop browser.
        </div>
      )}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#06081a] ${
          gl === false ? "hidden" : ""
        }`}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full touch-none"
          aria-label="Interactive night sky map"
          role="application"
        />
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 rounded-xl border border-gold/40 bg-ink/95 px-3 py-2 text-xs shadow-xl"
            style={{
              left: `${Math.max(
                70,
                Math.min(tooltip.screenX, Math.max(viewW, 320) - 70),
              )}px`,
              top: `${Math.max(8, tooltip.screenY - 52)}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="font-semibold text-gold">
              {tooltip.point.kind === "star" ? "✦" : tooltip.point.glyph}{" "}
              {tooltip.point.label}
            </div>
            <div className="text-muted">
              Az {tooltip.point.azimuth.toFixed(0)}° · Alt{" "}
              {tooltip.point.altitude.toFixed(0)}°
              {tooltip.point.kind === "star" &&
                ` · mag ${tooltip.point.magnitude.toFixed(1)}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
