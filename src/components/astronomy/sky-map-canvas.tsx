"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeSkyBodies,
  type BodySkyPoint,
  type ObserverPoint,
} from "@/lib/astronomy/sky-map";

/**
 * Interactive 2D night-sky map.
 *
 * Draws a horizontal (azimuthal) sky dome onto an HTML5 canvas: the outer rings
 * are the horizon and the local meridian/zenith grid, and each visible body
 * (Sun, Moon, planets, bright stars) is projected by its true altitude/azimuth
 * from astronomy-engine. Hovering or tapping a body reveals a tooltip with its
 * name and position.
 */

interface SkyMapCanvasProps {
  observer: ObserverPoint;
  date?: Date;
  className?: string;
}

interface Projected {
  point: BodySkyPoint;
  x: number;
  y: number;
  radius: number;
}

const GRID_COLOR = "rgba(255,255,255,0.10)";
const HORIZON_COLOR = "rgba(255,255,255,0.22)";
const CARDINAL_COLOR = "rgba(255,255,255,0.55)";

/** Project alt/az (deg) to canvas (x, y) via a polar ("sky dome") mapping. */
function project(azimuth: number, altitude: number, size: number): { x: number; y: number; r: number } {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.42;
  const r = maxR * (1 - altitude / 90);
  const az = ((azimuth * Math.PI) / 180 - Math.PI / 2); // rotate so 0° (N) points up
  const x = cx + r * Math.cos(az);
  const y = cy + r * Math.sin(az);
  return { x, y, r };
}

function drawGrid(ctx: CanvasRenderingContext2D, size: number): void {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.42;

  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;

  // Zenith distance rings (horizon, 30°, 60°).
  for (const frac of [1, 2 / 3, 1 / 3]) {
    const r = maxR * frac;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Horizon ring drawn more strongly.
  ctx.strokeStyle = HORIZON_COLOR;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR, 0, 2 * Math.PI);
  ctx.stroke();

  // Radial meridian lines from zenith to horizon.
  ctx.strokeStyle = GRID_COLOR;
  for (let i = 0; i < 8; i++) {
    const az = (i / 8) * 2 * Math.PI - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + maxR * Math.cos(az), cy + maxR * Math.sin(az));
    ctx.stroke();
  }

  // Cardinal labels.
  const cardinals: { label: string; az: number }[] = [
    { label: "N", az: 0 },
    { label: "E", az: 90 },
    { label: "S", az: 180 },
    { label: "W", az: 270 },
  ];
  ctx.fillStyle = CARDINAL_COLOR;
  ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const c of cardinals) {
    const { x, y } = project(c.az, 0, size);
    ctx.fillText(c.label, x, y + 16);
  }
}

export function SkyMapCanvas({ observer, date, className }: SkyMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(480);
  const [hovered, setHovered] = useState<Projected | null>(null);
  const at = useMemo(() => date ?? new Date(), [date]);

  const bodies = useMemo(() => computeSkyBodies(observer, at), [observer, at]);

  const projected = useMemo<Projected[]>(
    () =>
      bodies
        .filter((b) => b.altitude >= -2)
        .map((point) => {
          const { x, y, r } = project(point.azimuth, point.altitude, size);
          const radius = point.kind === "star" ? 2.5 + Math.max(0, 3.5 + point.magnitude) * 0.5 : 6;
          return { point, x, y, radius };
        }),
    [bodies, size],
  );

  // Keep the canvas square and responsive to its container.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setSize(Math.min(w, 640));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Draw the map on each render (or when hovered changes).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    // Background.
    const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.5);
    grad.addColorStop(0, "rgba(30,34,66,0.96)");
    grad.addColorStop(1, "rgba(10,12,30,0.98)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    drawGrid(ctx, size);
    const cx = size / 2;
    const cy = size / 2;

    // Sparse decorative starfield.
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 90; i++) {
      const r = Math.sqrt(Math.random()) * size * 0.42;
      const theta = Math.random() * 2 * Math.PI;
      const px = cx + r * Math.cos(theta);
      const py = cy + r * Math.sin(theta);
      ctx.globalAlpha = 0.15 + Math.random() * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, 0.7, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw bodies.
    for (const p of projected) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      if (p.point.kind === "star") {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      } else {
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        const bodyColour = p.point.id === "sun" ? "255,200,80" : p.point.id === "moon" ? "230,230,255" : "140,200,255";
        glow.addColorStop(0, `rgba(${bodyColour},0.9)`);
        glow.addColorStop(1, `rgba(${bodyColour},0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - p.radius * 3, p.y - p.radius * 3, p.radius * 6, p.radius * 6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(${bodyColour})`;
        ctx.fill();
      }
    }

    // Highlight ring for hovered body.
    if (hovered) {
      ctx.strokeStyle = "rgba(212,175,55,0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hovered.x, hovered.y, hovered.radius + 4, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [size, projected, hovered]);

  function nearest(x: number, y: number): Projected | null {
    let best: Projected | null = null;
    for (const p of projected) {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d <= p.radius + 8 && (!best || d < Math.hypot(best.x - x, best.y - y))) {
        best = p;
      }
    }
    return best;
  }

  function handlePointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHovered(nearest(x, y));
  }

  return (
    <div ref={wrapRef} className={`relative w-full ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, cursor: hovered ? "pointer" : "default", touchAction: "pan-y" }}
        aria-label="Interactive night sky map"
        role="application"
        onPointerMove={handlePointer}
        onPointerLeave={() => setHovered(null)}
        onPointerDown={handlePointer}
      />
      {hovered && (
        <div
          className="pointer-events-none absolute rounded-xl border border-gold/30 bg-ink/95 px-3 py-2 text-xs shadow-xl"
          style={{ left: Math.min(hovered.x + 12, size - 150), top: Math.max(8, hovered.y - 44) }}
        >
          <div className="font-semibold text-gold">
            {hovered.point.kind === "star" ? "✦" : hovered.point.glyph}{" "}
            {hovered.point.label}
          </div>
          <div className="text-muted">
            Az {hovered.point.azimuth.toFixed(0)}° · Alt {hovered.point.altitude.toFixed(0)}°
            {hovered.point.kind === "star" && ` · mag ${hovered.point.magnitude.toFixed(1)}`}
          </div>
        </div>
      )}
    </div>
  );
}
