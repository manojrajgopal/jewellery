'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSceneFrame } from '@/hooks/useSceneFrame';
import { canvasDpr, getPerfBudget, scaleCount } from '@/lib/perf';
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
  /** Index into the baked sprite set. */
  hue: number;
}

const PALETTE = {
  dark: ['#FDF2D3', '#EFCE78', '#F7E2A8', '#FFFBF0'],
  light: ['#B8842A', '#96681F', '#D4A03A', '#714D18'],
} as const;

/** Sprite tile geometry: a solid core of CORE radius inside a TILE/2 halo. */
const TILE = 32;
const CORE = 4;

/**
 * A slow field of suspended gold motes moving on a curl-noise-ish flow, which
 * the pointer pushes out of the way.
 *
 * The flow is two summed sines sampled at the particle's own position rather
 * than a per-particle velocity. That is what stops the field looking like
 * confetti: neighbouring motes read the same field value, so they move together
 * in currents, and the whole thing behaves like air rather than like a hundred
 * independent objects.
 *
 * Three things here were paying for the site's frame budget several times over,
 * because this scene appears seven times on the home page:
 *
 *   `ctx.shadowBlur`, set per mote. Seventy motes meant seventy separate blur
 *   passes per frame per instance — roughly five hundred a frame across the
 *   page. The glow is now baked into four small tiles, one per palette colour,
 *   and every mote is one `drawImage`.
 *
 *   `getBoundingClientRect()` on every pointermove, to convert the pointer into
 *   canvas space. That is a forced layout, and a pointer moving across the page
 *   fires hundreds of events a second — seven instances each forcing a layout on
 *   each one is a stall you can feel in the cursor itself. The rect is a property
 *   of the layout, so it is read when the layout changes and not otherwise.
 *
 *   And it painted from mount regardless of whether its section was anywhere
 *   near the viewport.
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

  const budget = useMemo(() => (enabled ? getPerfBudget() : null), [enabled]);
  const palette = useMemo(() => PALETTE[theme] ?? PALETTE.dark, [theme]);

  /* --- state the loop owns --------------------------------------------- */

  const sprites = useRef<HTMLCanvasElement[]>([]);
  const motes = useRef<Mote[]>([]);
  const view = useRef({ width: 0, height: 0, dpr: 1 });
  // Canvas-space pointer, and the cached rect used to get there.
  const pointer = useRef({ x: -9999, y: -9999 });
  const rect = useRef<{ left: number; top: number } | null>(null);
  const clock = useRef(0);

  /** Sampled flow field. Same input, same output — hence coherent currents. */
  const flow = useCallback(
    (x: number, y: number, t: number) => {
      const a = Math.sin(x * 0.0042 + t * 0.28) + Math.sin(y * 0.0031 - t * 0.19);
      const b = Math.cos(y * 0.0038 + t * 0.23) + Math.cos(x * 0.0026 - t * 0.17);
      return { fx: a * 0.11, fy: b * 0.11 - (rise ? 0.055 : 0) };
    },
    [rise]
  );

  const frame = useCallback(
    (step: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const { width, height, dpr } = view.current;
      clock.current += 0.016 * step;
      const t = clock.current;
      const pool = motes.current;
      const px = pointer.current.x;
      const py = pointer.current.y;

      ctx.clearRect(0, 0, width, height);

      for (const m of pool) {
        const { fx, fy } = flow(m.x, m.y, t);
        m.vx += fx * 0.05 * step;
        m.vy += fy * 0.05 * step;

        // Pointer pressure falls off with the square of distance so the push
        // feels like displaced air rather than a hard collision.
        const dx = m.x - px;
        const dy = m.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < repel * repel && d2 > 1) {
          const d = Math.sqrt(d2);
          const push = (1 - d / repel) ** 2 * 1.4 * step;
          m.vx += (dx / d) * push;
          m.vy += (dy / d) * push;
        }

        // Viscous drag, or the field accumulates energy indefinitely.
        const drag = Math.pow(0.94, step);
        m.vx *= drag;
        m.vy *= drag;
        m.x += m.vx * step;
        m.y += m.vy * step;

        // Wrap rather than bounce: a bounded field visibly has walls.
        if (m.x < -20) m.x = width + 20;
        if (m.x > width + 20) m.x = -20;
        if (m.y < -20) m.y = height + 20;
        if (m.y > height + 20) m.y = -20;

        const twinkle = 0.62 + 0.38 * Math.sin(t * 1.7 + m.phase);
        const tile = sprites.current[m.hue];
        if (!tile) continue;
        // The tile's core is CORE units of a TILE-wide image, so drawing it at
        // this size puts a core of exactly m.size on screen with its halo in
        // the same proportion shadowBlur gave it.
        const dest = m.size * (TILE / CORE);
        ctx.globalAlpha = m.alpha * twinkle;
        ctx.drawImage(tile, m.x - dest / 2, m.y - dest / 2, dest, dest);
      }

      if (link) {
        // O(n²) is fine at these counts and gives a far better result than a
        // spatial hash's bucket seams.
        for (let i = 0; i < pool.length; i++) {
          for (let j = i + 1; j < pool.length; j++) {
            const dx = pool[i].x - pool[j].x;
            const dy = pool[i].y - pool[j].y;
            const d = Math.hypot(dx, dy);
            if (d > linkDistance) continue;
            ctx.globalAlpha = (1 - d / linkDistance) * 0.14;
            ctx.strokeStyle = palette[pool[i].hue];
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pool[i].x, pool[i].y);
            ctx.lineTo(pool[j].x, pool[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      void dpr;
    },
    [flow, repel, link, linkDistance, palette]
  );

  useSceneFrame(canvasRef, frame, {
    ready: enabled,
    fps: budget?.fps,
    order: 120,
  });

  /* --- setup ------------------------------------------------------------ */

  useEffect(() => {
    if (!enabled || !budget) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const small = window.innerWidth < 768;
    const n = scaleCount(Math.round(count * (small ? 0.45 : 1)), 10);
    const dpr = canvasDpr();

    // One tile per colour: a solid core with the glow shadowBlur used to draw
    // painted into the same falloff.
    sprites.current = palette.map((hue) => {
      const tile = document.createElement('canvas');
      const px = Math.round(TILE * dpr);
      tile.width = px;
      tile.height = px;
      const c = tile.getContext('2d');
      if (!c) return tile;
      c.scale(dpr, dpr);
      const mid = TILE / 2;

      const glow = c.createRadialGradient(mid, mid, 0, mid, mid, mid);
      glow.addColorStop(0, hue);
      // shadowBlur is a gaussian roughly 3.4× the core radius; these stops are
      // that falloff, fitted.
      glow.addColorStop(CORE / TILE, hue);
      glow.addColorStop(0.42, `${hue}59`);
      glow.addColorStop(1, `${hue}00`);
      c.fillStyle = glow;
      c.beginPath();
      c.arc(mid, mid, mid, 0, Math.PI * 2);
      c.fill();
      return tile;
    });

    const seed = (width: number, height: number) => {
      motes.current = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 0.7 + Math.random() * 1.9,
        alpha: 0.18 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        hue: i % palette.length,
      }));
    };

    const measure = () => {
      const parent = canvas.parentElement;
      const width = parent?.offsetWidth ?? window.innerWidth;
      const height = parent?.offsetHeight ?? window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      view.current = { width, height, dpr };
      // The pointer conversion reads this instead of forcing a layout per event.
      const box = canvas.getBoundingClientRect();
      rect.current = { left: box.left, top: box.top };
      if (!motes.current.length) seed(width, height);
    };

    // Scrolling moves the canvas without resizing it, so the cached origin has
    // to follow — but reading it during the scroll would reintroduce the layout
    // it exists to avoid. Reading it on the next frame after a scroll settles
    // is both cheap and accurate enough for a pointer-repel radius.
    let settle = 0;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const box = canvas.getBoundingClientRect();
        rect.current = { left: box.left, top: box.top };
      }, 120);
    };

    const onMove = (e: PointerEvent) => {
      const r = rect.current;
      if (!r) return;
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      pointer.current = { x: -9999, y: -9999 };
    };

    measure();

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure());
    if (observer && canvas.parentElement) observer.observe(canvas.parentElement);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    return () => {
      window.clearTimeout(settle);
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      motes.current = [];
    };
  }, [enabled, budget, count, palette]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
