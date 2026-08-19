'use client';

import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@/components/providers/ThemeProvider';

interface CausticsCanvasProps {
  className?: string;
  /** Number of overlapping light lobes. More is softer and more expensive. */
  lobes?: number;
  /** 0–1 overall strength. */
  intensity?: number;
  /** Seconds for one full drift cycle. */
  speed?: number;
}

/**
 * The pooled, rippling light you get when a spot lamp passes through faceted
 * glass — the pattern on the velvet underneath a vitrine.
 *
 * Drawn as a handful of large radial lobes whose centres travel on
 * incommensurate sine paths, composited with `lighter`. Because the periods
 * never divide into each other the pattern never visibly repeats, which is the
 * whole trick: a tiling texture reads as a texture, but drifting lobes read as
 * light.
 *
 * Runs at half resolution and blurs on the way up, so it costs a fraction of
 * what the apparent smoothness suggests.
 */
export default function CausticsCanvas({
  className = '',
  lobes = 7,
  intensity = 0.55,
  speed = 26,
}: CausticsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Half-res buffer: the result is blurred anyway, so full resolution buys
    // nothing but fill cost.
    const scale = 0.5;
    let raf = 0;
    let width = 0;
    let height = 0;
    let start = 0;

    // Light on cream has to be warmer and weaker or it just washes the page out.
    const tint =
      theme === 'light'
        ? ['184, 132, 42', '212, 160, 58', '150, 104, 31']
        : ['253, 242, 211', '239, 206, 120', '247, 226, 168'];
    const gain = theme === 'light' ? intensity * 0.5 : intensity;

    // Each lobe gets its own drift periods and phase, chosen so no two share a
    // common multiple within the visible timescale.
    const seeds = Array.from({ length: lobes }, (_, i) => ({
      ax: 0.18 + i * 0.037,
      ay: 0.13 + i * 0.029,
      px: (i * 2.399) % (Math.PI * 2),
      py: (i * 1.618) % (Math.PI * 2),
      radius: 0.22 + ((i * 7) % 5) * 0.06,
      tint: tint[i % tint.length],
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.offsetWidth ?? window.innerWidth;
      height = parent?.offsetHeight ?? window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const frame = (now: number) => {
      if (!start) start = now;
      const t = ((now - start) / 1000) * ((Math.PI * 2) / speed);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      const w = canvas.width;
      const h = canvas.height;
      const base = Math.min(w, h);

      for (const s of seeds) {
        // Lissajous drift — the lobe wanders the frame without ever settling.
        const x = w * (0.5 + 0.42 * Math.sin(t * s.ax * 6 + s.px));
        const y = h * (0.5 + 0.38 * Math.sin(t * s.ay * 6 + s.py));
        // Breathing radius keeps the overlaps from freezing into a fixed shape.
        const r = base * s.radius * (0.82 + 0.24 * Math.sin(t * 3.1 + s.px));
        const a = gain * (0.3 + 0.2 * Math.sin(t * 2.3 + s.py));

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${s.tint}, ${Math.max(0, a)})`);
        g.addColorStop(0.45, `rgba(${s.tint}, ${Math.max(0, a * 0.32)})`);
        g.addColorStop(1, `rgba(${s.tint}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, lobes, intensity, speed, theme]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full blur-2xl mix-blend-screen ${className}`}
    />
  );
}
