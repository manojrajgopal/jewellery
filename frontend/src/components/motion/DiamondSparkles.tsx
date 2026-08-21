'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSceneFrame } from '@/hooks/useSceneFrame';
import { canvasDpr, getPerfBudget, scaleCount } from '@/lib/perf';
import { useTheme } from '@/components/providers/ThemeProvider';

interface DiamondSparklesProps {
  density?: number;
  className?: string;
  color?: string;
  /** Sparkles drift away from the pointer and brighten near it. */
  interactive?: boolean;
  /** Draw four-point stars instead of round motes. */
  shape?: 'star' | 'dot' | 'mixed';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  vx: number;
  vy: number;
  phase: number;
  twinkle: number;
  star: boolean;
  /** Index into the baked sprite set. */
  hue: number;
}

/**
 * Facets are drawn on canvas, so they cannot inherit the theme through CSS.
 * The near-white set catches the light beautifully on obsidian and is simply
 * invisible on cream, so the light theme gets the darker half of the gold ramp
 * and a warm glow instead of a white one.
 */
const PALETTE = {
  dark: ['#FDF2D3', '#EFCE78', '#FFFBF0', '#D6BA8F', '#ECF4FF'],
  light: ['#B8842A', '#96681F', '#D4A03A', '#714D18', '#A68960'],
} as const;

const GLOW = { dark: '#FFFFFF', light: 'rgba(150, 104, 31, 0.55)' } as const;

/** Tile geometry. A particle of `size` draws its tile at size * TILE / UNIT. */
const TILE = 48;
const UNIT = 3.2;

/**
 * Canvas field of drifting, twinkling facets. Four-point stars catch the light
 * the way a brilliant cut does; the pointer pushes them gently aside.
 *
 * Every facet used to be rebuilt from scratch each frame: four quadratic curves,
 * a save/restore pair, and a `shadowBlur` — which is a full gaussian pass per
 * particle. At forty-six particles across four instances on the home page that
 * is two hundred blur passes and two hundred path rasterisations every frame,
 * for a set of shapes that never change. They are now stamped from ten baked
 * tiles (a star and a dot per palette colour), which is the same picture for a
 * fraction of the work, and the field only paints while it is on screen.
 */
export default function DiamondSparkles({
  density = 40,
  className = '',
  color,
  interactive = true,
  shape = 'mixed',
}: DiamondSparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [disabled, setDisabled] = useState(false);
  const [ready, setReady] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisabled(true);
      return;
    }
    setReady(true);
  }, []);

  const budget = useMemo(() => (ready ? getPerfBudget() : null), [ready]);

  const palette = useMemo(() => {
    const base = PALETTE[theme] ?? PALETTE.dark;
    // A caller-supplied colour collapses the ramp to one entry, which is what
    // the original did by resolving `color ?? palette[random]` per particle.
    return color ? [color] : Array.from(base);
  }, [theme, color]);

  /* --- loop state ------------------------------------------------------- */

  const stars = useRef<HTMLCanvasElement[]>([]);
  const dots = useRef<HTMLCanvasElement[]>([]);
  const particles = useRef<Particle[]>([]);
  const view = useRef({ width: 0, height: 0, dpr: 1 });
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const rect = useRef<{ left: number; top: number } | null>(null);

  const draw = useCallback(
    (step: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const { width, height, dpr } = view.current;
      const pool = particles.current;
      const p0 = pointer.current;

      ctx.clearRect(0, 0, width, height);

      for (const p of pool) {
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.phase += p.twinkle * step;

        if (interactive && p0.active) {
          const dx = p.x - p0.x;
          const dy = p.y - p0.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 0.01) {
            const push = ((140 - dist) / 140) * step;
            p.x += (dx / dist) * push * 1.6;
            p.y += (dy / dist) * push * 1.6;
          }
        }

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        let alpha = p.baseOpacity + Math.sin(p.phase) * 0.35;

        if (interactive && p0.active) {
          const near = Math.hypot(p.x - p0.x, p.y - p0.y);
          if (near < 180) alpha += (1 - near / 180) * 0.5;
        }

        alpha = Math.max(0, Math.min(1, alpha));
        if (alpha <= 0.004) continue;

        const set = p.star ? stars.current : dots.current;
        const tile = set[p.hue];
        if (!tile) continue;

        const dest = p.size * (TILE / UNIT);
        ctx.globalAlpha = alpha;

        if (p.star) {
          // Stars carry the same slow roll they always did.
          const angle = p.phase * 0.35;
          ctx.translate(p.x, p.y);
          ctx.rotate(angle);
          ctx.drawImage(tile, -dest / 2, -dest / 2, dest, dest);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        } else {
          ctx.drawImage(tile, p.x - dest / 2, p.y - dest / 2, dest, dest);
        }
      }

      ctx.globalAlpha = 1;
    },
    [interactive]
  );

  useSceneFrame(canvasRef, draw, { ready, fps: budget?.fps, order: 120 });

  /* --- setup ------------------------------------------------------------ */

  useEffect(() => {
    if (!ready || !budget) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale the field down on small screens rather than dropping it entirely,
    // and again by device tier.
    const isSmall = window.innerWidth < 768;
    const count = scaleCount(Math.round(density * (isSmall ? 0.45 : 1)), 8);
    const dpr = canvasDpr();
    const glow = GLOW[theme] ?? GLOW.dark;

    /** A tile large enough to hold the shape plus the halo around it. */
    const tileFor = (paint: (c: CanvasRenderingContext2D, mid: number) => void) => {
      const tile = document.createElement('canvas');
      const px = Math.round(TILE * dpr);
      tile.width = px;
      tile.height = px;
      const c = tile.getContext('2d');
      if (c) {
        c.scale(dpr, dpr);
        paint(c, TILE / 2);
      }
      return tile;
    };

    stars.current = palette.map((hue) =>
      tileFor((c, mid) => {
        const r = UNIT * 3.2;
        // The halo first, as a gradient — this is what shadowBlur was for.
        const g = c.createRadialGradient(mid, mid, 0, mid, mid, mid);
        g.addColorStop(0, `${hue}A6`);
        g.addColorStop(0.5, `${hue}33`);
        g.addColorStop(1, `${hue}00`);
        c.fillStyle = g;
        c.fillRect(0, 0, TILE, TILE);

        c.translate(mid, mid);
        c.beginPath();
        c.moveTo(0, -r);
        c.quadraticCurveTo(0, 0, r, 0);
        c.quadraticCurveTo(0, 0, 0, r);
        c.quadraticCurveTo(0, 0, -r, 0);
        c.quadraticCurveTo(0, 0, 0, -r);
        c.closePath();
        c.fillStyle = hue;
        c.fill();
      })
    );

    dots.current = palette.map((hue) =>
      tileFor((c, mid) => {
        const g = c.createRadialGradient(mid, mid, 0, mid, mid, mid);
        g.addColorStop(0, glow);
        g.addColorStop(UNIT / TILE, hue);
        g.addColorStop(0.34, `${hue}40`);
        g.addColorStop(1, `${hue}00`);
        c.fillStyle = g;
        c.beginPath();
        c.arc(mid, mid, mid, 0, Math.PI * 2);
        c.fill();
      })
    );

    const seed = (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      baseOpacity: Math.random() * 0.55 + 0.2,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.012 + Math.random() * 0.028,
      star: shape === 'star' ? true : shape === 'dot' ? false : Math.random() > 0.55,
      hue: Math.floor(Math.random() * palette.length),
    });

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const box = parent.getBoundingClientRect();
      const width = box.width;
      const height = box.height;
      if (!width || !height) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      view.current = { width, height, dpr };
      rect.current = { left: box.left, top: box.top };
      particles.current = Array.from({ length: count }, () => seed(width, height));
    };

    // Cached rather than measured per pointer event: `getBoundingClientRect`
    // forces a layout, and a pointer crossing the page fires this hundreds of
    // times a second across four instances.
    let settle = 0;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const box = parent.getBoundingClientRect();
        rect.current = { left: box.left, top: box.top };
      }, 120);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = rect.current;
      if (!r) return;
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const onPointerLeave = () => {
      pointer.current.active = false;
    };

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    if (observer && canvas.parentElement) observer.observe(canvas.parentElement);

    resize();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (interactive) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      window.clearTimeout(settle);
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      particles.current = [];
    };
  }, [ready, budget, density, palette, interactive, shape, theme]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
