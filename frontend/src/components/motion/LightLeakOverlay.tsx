'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface LightLeakOverlayProps {
  className?: string;
  /** Peak opacity of a leak, 0–1. */
  intensity?: number;
  /** Average seconds between leaks. Each interval is jittered around this. */
  interval?: number;
  /** Also flash on click, as if the shutter tripped. */
  onClick?: boolean;
}

interface Leak {
  /** Seconds since the leak started. */
  age: number;
  life: number;
  /** Which edge the light came in from. */
  edge: 0 | 1 | 2 | 3;
  /** Position along that edge, 0–1. */
  at: number;
  spread: number;
  hue: 'gold' | 'rose' | 'amber';
  peak: number;
}

/**
 * Analogue light leaks — the streaks that appear on film when the back of the
 * camera is not quite light-tight.
 *
 * Three things make a leak read as film rather than as a CSS flash. It enters
 * from an *edge*, never from the middle, because that is where a camera body
 * fails. It is warm — leaked daylight through a red bellows is orange, so the
 * palette here is gold through rose and nothing else. And it is arrhythmic: the
 * gaps between leaks are jittered by ±45%, because anything evenly spaced stops
 * being an accident and starts being a strobe.
 *
 * Drawn with additive compositing on a canvas so overlapping leaks brighten
 * each other the way real exposure does, instead of the later one occluding the
 * earlier. `--bloom` is honoured, so the effect drops back on the cream theme
 * where additive light reads as haze rather than as light.
 *
 * Decorative: aria-hidden, pointer-events-none, and absent entirely under a
 * reduced-motion preference.
 */
export default function LightLeakOverlay({
  className = '',
  intensity = 0.5,
  interval = 9,
  onClick = false,
}: LightLeakOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;
    // Leaks are enormous soft gradients with no fine detail, so half-resolution
    // is indistinguishable and costs a quarter of the fill.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7;

    const leaks: Leak[] = [];
    let nextIn = 1.2 + Math.random() * interval * 0.5;
    let bloom = 1;

    const palette: Record<Leak['hue'], string> = {
      gold: '255, 205, 110',
      rose: '255, 168, 150',
      amber: '255, 150, 70',
    };

    const readTokens = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--bloom').trim();
      const n = parseFloat(v);
      bloom = Number.isFinite(n) ? n : 1;
    };

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readTokens();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const spawn = (force = false) => {
      const hues: Leak['hue'][] = ['gold', 'gold', 'rose', 'amber'];
      leaks.push({
        age: 0,
        life: 1.1 + Math.random() * 1.4,
        edge: Math.floor(Math.random() * 4) as Leak['edge'],
        at: 0.12 + Math.random() * 0.76,
        spread: 0.35 + Math.random() * 0.5,
        hue: hues[Math.floor(Math.random() * hues.length)],
        // A forced leak (a click) is brighter — it is meant to be noticed.
        peak: (force ? 1 : 0.55 + Math.random() * 0.45) * intensity,
      });
      // Two overlapping is the visual limit; a third turns the frame to milk.
      if (leaks.length > 2) leaks.splice(0, leaks.length - 2);
    };

    const onDown = () => {
      if (onClick) spawn(true);
    };
    if (onClick) window.addEventListener('pointerdown', onDown, { passive: true });

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      nextIn -= dt;
      if (nextIn <= 0) {
        spawn();
        // ±45% jitter: this is the whole difference between "film" and "strobe".
        nextIn = interval * (0.55 + Math.random() * 0.9);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = leaks.length - 1; i >= 0; i--) {
        const l = leaks[i];
        l.age += dt;
        if (l.age >= l.life) {
          leaks.splice(i, 1);
          continue;
        }

        const t = l.age / l.life;
        // Fast attack, slow decay — the shape of an exposure, not a sine.
        const env = t < 0.16 ? t / 0.16 : 1 - (t - 0.16) / 0.84;
        const alpha = Math.max(0, env) ** 1.6 * l.peak * bloom;
        if (alpha <= 0.001) continue;

        // Origin sits just outside the frame on the chosen edge, so the light
        // always appears to come from beyond the picture.
        let x = 0;
        let y = 0;
        if (l.edge === 0) {
          x = w * l.at;
          y = -h * 0.12;
        } else if (l.edge === 1) {
          x = w * 1.12;
          y = h * l.at;
        } else if (l.edge === 2) {
          x = w * l.at;
          y = h * 1.12;
        } else {
          x = -w * 0.12;
          y = h * l.at;
        }

        const radius = Math.max(w, h) * l.spread * (0.85 + t * 0.35);
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const rgb = palette[l.hue];
        g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
        g.addColorStop(0.35, `rgba(${rgb}, ${alpha * 0.42})`);
        g.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        // The streak: leaked light runs along the edge as well as spilling in
        // from it, and the streak is the part people actually recognise.
        const along = ctx.createLinearGradient(
          l.edge % 2 === 0 ? 0 : x,
          l.edge % 2 === 0 ? y : 0,
          l.edge % 2 === 0 ? w : x,
          l.edge % 2 === 0 ? y : h,
        );
        along.addColorStop(0, `rgba(${rgb}, 0)`);
        along.addColorStop(Math.max(0.02, l.at - 0.1), `rgba(${rgb}, 0)`);
        along.addColorStop(l.at, `rgba(${rgb}, ${alpha * 0.5})`);
        along.addColorStop(Math.min(0.98, l.at + 0.1), `rgba(${rgb}, 0)`);
        along.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = along;
        if (l.edge % 2 === 0) {
          ctx.fillRect(0, y - h * 0.14, w, h * 0.28);
        } else {
          ctx.fillRect(x - w * 0.14, 0, w * 0.28, h);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    const themeObserver = new MutationObserver(readTokens);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-cinema'],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      if (onClick) window.removeEventListener('pointerdown', onDown);
    };
  }, [reduced, intensity, interval, onClick]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-screen ${className}`}
    />
  );
}
