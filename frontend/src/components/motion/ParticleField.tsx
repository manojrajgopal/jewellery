'use client';

import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@/components/providers/ThemeProvider';

interface ParticleFieldProps {
  className?: string;
  /** Particle count at desktop width. Halved on small screens. */
  count?: number;
  /** Pointer push radius in pixels. */
  repel?: number;
  /** Draw hairlines between neighbours — a constellation rather than dust. */
  link?: boolean;
  /** Maximum link distance in pixels. */
  linkDistance?: number;
  /** Upward bias, as though the motes were rising through warm air. */
  rise?: boolean;
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  hue: string;
}

const PALETTE = {
  dark: ['#FDF2D3', '#EFCE78', '#F7E2A8', '#FFFBF0'],
  light: ['#B8842A', '#96681F', '#D4A03A', '#714D18'],
} as const;

/**
 * A slow field of suspended gold motes moving on a curl-noise-ish flow, which
 * the pointer pushes out of the way.
 *
 * The flow is two summed sines sampled at the particle's own position rather
 * than a per-particle velocity. That is what stops the field looking like
 * confetti: neighbouring motes read the same field value, so they move together
 * in currents, and the whole thing behaves like air rather than like a hundred
 * independent objects.
 */
export default function ParticleField({
  className = '',
  count = 70,
  repel = 130,
  link = false,
  linkDistance = 120,
  rise = true,
}: ParticleFieldProps) {
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

    const small = window.innerWidth < 768;
    const n = Math.round(count * (small ? 0.45 : 1));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palette = PALETTE[theme] ?? PALETTE.dark;

    let raf = 0;
    let width = 0;
    let height = 0;
    let t = 0;
    let motes: Mote[] = [];
    const pointer = { x: -9999, y: -9999 };

    const seed = () => {
      motes = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 0.7 + Math.random() * 1.9,
        alpha: 0.18 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        hue: palette[i % palette.length],
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.offsetWidth ?? window.innerWidth;
      height = parent?.offsetHeight ?? window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!motes.length) seed();
    };

    /** Sampled flow field. Same input, same output — hence coherent currents. */
    const flow = (x: number, y: number) => {
      const a = Math.sin(x * 0.0042 + t * 0.28) + Math.sin(y * 0.0031 - t * 0.19);
      const b = Math.cos(y * 0.0038 + t * 0.23) + Math.cos(x * 0.0026 - t * 0.17);
      return { fx: a * 0.11, fy: b * 0.11 - (rise ? 0.055 : 0) };
    };

    const frame = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      for (const m of motes) {
        const { fx, fy } = flow(m.x, m.y);
        m.vx += fx * 0.05;
        m.vy += fy * 0.05;

        // Pointer pressure falls off with the square of distance so the push
        // feels like displaced air rather than a hard collision.
        const dx = m.x - pointer.x;
        const dy = m.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < repel * repel && d2 > 1) {
          const d = Math.sqrt(d2);
          const push = (1 - d / repel) ** 2 * 1.4;
          m.vx += (dx / d) * push;
          m.vy += (dy / d) * push;
        }

        // Viscous drag, or the field accumulates energy indefinitely.
        m.vx *= 0.94;
        m.vy *= 0.94;
        m.x += m.vx;
        m.y += m.vy;

        // Wrap rather than bounce: a bounded field visibly has walls.
        if (m.x < -20) m.x = width + 20;
        if (m.x > width + 20) m.x = -20;
        if (m.y < -20) m.y = height + 20;
        if (m.y > height + 20) m.y = -20;

        const twinkle = 0.62 + 0.38 * Math.sin(t * 1.7 + m.phase);
        ctx.globalAlpha = m.alpha * twinkle;
        ctx.fillStyle = m.hue;
        ctx.shadowColor = m.hue;
        ctx.shadowBlur = m.size * 3.4;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      if (link) {
        // O(n²) is fine at these counts and gives a far better result than a
        // spatial hash's bucket seams.
        for (let i = 0; i < motes.length; i++) {
          for (let j = i + 1; j < motes.length; j++) {
            const dx = motes[i].x - motes[j].x;
            const dy = motes[i].y - motes[j].y;
            const d = Math.hypot(dx, dy);
            if (d > linkDistance) continue;
            ctx.globalAlpha = (1 - d / linkDistance) * 0.14;
            ctx.strokeStyle = motes[i].hue;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(motes[i].x, motes[i].y);
            ctx.lineTo(motes[j].x, motes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, count, repel, link, linkDistance, rise, theme]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
