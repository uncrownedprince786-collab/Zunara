"use client";

import { useEffect, useRef } from "react";

/**
 * Realistic ambient meteor shower.
 *
 * A lightweight, hardware-friendly <canvas> meteor system that mimics actual
 * atmospheric meteors: they spawn suddenly from the top-left quadrant and
 * descend diagonally at a steep 45-60°, burning out completely before they ever
 * reach the right or bottom edge of the viewport. Frame work is minimal (a few
 * sparse streaks, no shadowBlur), so the glass cards on top keep compositing at
 * smooth 60fps.
 *
 *  - Normal meteors: razor-thin, high-speed flash tails.
 *  - "Hero" bolides: thicker, glowing head (gold nucleus + indigo aura) that
 *    flares out just before fading and leaves a brief smoke/light streak.
 *
 * The layer is strictly decorative: pointer-events none, GPU-composited, and
 * disabled under prefers-reduced-motion.
 */

interface Meteor {
  x0: number;
  y0: number;
  vx: number; // px/s
  vy: number; // px/s
  len: number; // trail length in px
  thickness: number;
  hue: "normal" | "hero";
  life: number; // seconds since birth
  dur: number; // seconds to full burn-out
  // lingering smoke/light streak left behind after burn-out
  residue: Array<{ x: number; y: number; age: number; alpha: number }>;
}

interface ResiduePoint {
  x: number;
  y: number;
  age: number;
  alpha: number;
}

export function MeteorShower() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const meteors: Meteor[] = [];
    // Smoke/light streaks that linger ~1s after a hero meteor has burned out.
    const wearOff: ResiduePoint[] = [];
    function drawResidue(points: ResiduePoint[], now: number) {
      const next: ResiduePoint[] = [];
      for (const pt of points) {
        const age = now - pt.age;
        if (age > 1.1) continue;
        const a = Math.max(0, pt.alpha * (1 - age / 1.1));
        const r = 16 + age * 26;
        const gr = c.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
        gr.addColorStop(0, `rgba(255,232,140,${0.28 * a})`);
        gr.addColorStop(1, `rgba(255,215,0,0)`);
        c.fillStyle = gr;
        c.beginPath();
        c.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        c.fill();
        next.push(pt);
      }
      points.length = 0;
      for (const pt of next) points.push(pt);
    }
    let nextNormal = 0.8 + Math.random() * 1.5; // seconds until first normal
    let nextHero = 12 + Math.random() * 8; // 12-20s

    const NORMAL_INTERVAL = [2.6, 6] as const;
    const MAX_CONCURRENT = 3;

    function spawn(isHero: boolean) {
      // Top-left quadrant origins.
      const x0 = (0.04 + Math.random() * 0.34) * width;
      const y0 = (-0.08 + Math.random() * 0.3) * height;
      // Steep descent: 45-60 degrees from horizontal.
      const angle = ((45 + Math.random() * 15) * Math.PI) / 180;
      const speed =
        (0.5 + Math.random() * 0.5) *
        (isHero ? 0.9 : 1) *
        (width * 0.55);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Cap travel so the meteor always burns out before hitting an edge.
      let dist = isHero ? width * 0.5 : width * (0.34 + Math.random() * 0.22);
      const edgeAllow =
        Math.min(
          (width - x0) / Math.cos(angle),
          (height - y0) / Math.sin(angle),
        ) || dist;
      dist = Math.min(dist, edgeAllow * 0.62);

      const dur = isHero ? 0.8 + Math.random() * 0.4 : 0.4 + Math.random() * 0.4;
      const travel = speed; // ~distance covered in 1s
      const len = Math.max(90, Math.min(220, travel * (isHero ? 0.28 : 0.18)));

      meteors.push({
        x0,
        y0,
        vx,
        vy,
        len,
        thickness: isHero ? 3 : 0.9 + Math.random() * 0.6,
        hue: isHero ? "hero" : "normal",
        life: 0,
        dur,
        residue: [],
      });
      if (meteors.length > MAX_CONCURRENT) meteors.shift();
    }

    function drawMeteor(m: Meteor, now: number) {
      const x = m.x0 + m.vx * m.life;
      const y = m.y0 + m.vy * m.life;
      const ux = m.vx / (Math.hypot(m.vx, m.vy) || 1);
      const uy = m.vy / (Math.hypot(m.vx, m.vy) || 1);
      // Fade in sharply (flash entry) and fade out near burnout.
      const fadeIn = Math.min(1, m.life / 0.08);
      const tailRatio = m.dur > 0 ? m.life / m.dur : 1;
      const fadeOut = tailRatio > 0.72 ? 1 - (tailRatio - 0.72) / 0.28 : 1;
      const alpha = Math.max(0, fadeIn * fadeOut);

      // Head glow.
      if (m.hue === "hero") {
        const g = c.createRadialGradient(x, y, 0, x, y, 22);
        g.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
        g.addColorStop(0.35, `rgba(255,232,140,${0.5 * alpha})`);
        g.addColorStop(0.7, `rgba(108,92,231,${0.22 * alpha})`);
        g.addColorStop(1, `rgba(108,92,231,0)`);
        c.fillStyle = g;
        c.beginPath();
        c.arc(x, y, 22, 0, Math.PI * 2);
        c.fill();
      }

      // Trail.
      const grad = c.createLinearGradient(x, y, x - ux * m.len, y - uy * m.len);
      if (m.hue === "hero") {
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * alpha})`);
        grad.addColorStop(0.25, `rgba(255,215,0,${0.7 * alpha})`);
        grad.addColorStop(1, `rgba(255,215,0,0)`);
      } else {
        grad.addColorStop(0, `rgba(255,255,255,${0.85 * alpha})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
      }
      c.strokeStyle = grad;
      c.lineWidth = m.thickness;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x - ux * m.len, y - uy * m.len);
      c.stroke();

      // Hero residue: accumulate points so the smoke/light streak lingers.
      if (m.hue === "hero") {
        m.residue.push({ x, y, age: now, alpha: alpha * 0.35 });
      }
    }

    let raf = 0;
    let last = performance.now();
    let simTime = 0;

    function frame(t: number) {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      simTime = t / 1000;

      // Scheduling: frequent faint meteors, plus an occasional hero every 12-20s.
      nextNormal -= dt;
      nextHero -= dt;
      if (nextNormal <= 0) {
        spawn(false);
        nextNormal = NORMAL_INTERVAL[0] + Math.random() * (NORMAL_INTERVAL[1] - NORMAL_INTERVAL[0]);
      }
      if (nextHero <= 0) {
        spawn(true);
        nextHero = 12 + Math.random() * 8;
      }

      c.clearRect(0, 0, width, height);

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        drawMeteor(m, simTime);
        drawResidue(m.residue, simTime);
        // Burn out fully before edges — the hero leaves a lingering smoke streak.
        if (m.life >= m.dur) {
          const endX = m.x0 + m.vx * m.dur;
          const endY = m.y0 + m.vy * m.dur;
          if (m.hue === "hero") {
            // A quick atmospheric flare-out right at the burn-out point.
            wearOff.push({ x: endX, y: endY, age: simTime, alpha: 0.7 });
            for (const pt of m.residue) wearOff.push(pt);
          }
          meteors.splice(i, 1);
        }
      }

      // Smoke/light streaks for heroes that have already burned out.
      if (wearOff.length) drawResidue(wearOff, simTime);

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="meteor-field"
    />
  );
}
