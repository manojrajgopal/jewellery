'use client';

import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@/components/providers/ThemeProvider';
import { useOnScreen } from '@/hooks/useOnScreen';

interface CanvasGemRainProps {
  className?: string;
  /** Stones on screen at desktop width. Reduced on small screens. */
  count?: number;
  /** How fast the field falls, in px/second at the fastest depth. */
  speed?: number;
  /** Pointer clearance radius in px. Zero disables the interaction. */
  part?: number;
  /** Draw the cut outlines only, rather than filling them. */
  outline?: boolean;
}

interface Stone {
  x: number;
  y: number;
  /** 0 = far, 1 = near. Drives size, speed, blur and alpha together. */
  depth: number;
  rot: number;
  spin: number;
  /** Index into CUTS. */
  cut: number;
  drift: number;
  phase: number;
  /** Current pointer displacement, eased back toward zero every frame. */
  px: number;
  py: number;
}

/**
 * Cut outlines as unit polygons on a -1..1 box. These are the same five
 * silhouettes the stone library uses, written as vertex lists rather than as
 * clip-paths because a canvas needs the points and a facet highlight needs to
 * know where the table is.
 *
 * Each entry carries `table`, the fraction of the height at which the crown
 * ends — that is where the specular quad is drawn, and getting it wrong is the
 * difference between a gemstone and a lozenge.
 */
const CUTS = [
  // Round brilliant, as an octagon.
  {
    points: [
      [0, -1], [0.71, -0.71], [1, 0], [0.71, 0.71],
      [0, 1], [-0.71, 0.71], [-1, 0], [-0.71, -0.71],
    ],
    table: -0.34,
  },
  // Emerald: a cut-corner rectangle.
  {
    points: [
      [-0.62, -1], [0.62, -1], [0.8, -0.8], [0.8, 0.8],
      [0.62, 1], [-0.62, 1], [-0.8, 0.8], [-0.8, -0.8],
    ],
    table: -0.5,
  },
  // Marquise.
  {
    points: [[0, -1], [0.46, -0.4], [0.5, 0], [0.46, 0.4], [0, 1], [-0.46, 0.4], [-0.5, 0], [-0.46, -0.4]],
    table: -0.42,
  },
  // Pear.
  {
    points: [[0, -1], [0.5, -0.3], [0.62, 0.28], [0, 1], [-0.62, 0.28], [-0.5, -0.3]],
    table: -0.36,
  },
  // Baguette.
  {
    points: [[-0.42, -1], [0.42, -1], [0.5, 1], [-0.5, 1]],
    table: -0.56,
  },
] as const;

/**
 * Palettes are per-theme because a canvas cannot inherit a CSS variable. The
 * near-white set catches the light on obsidian and disappears entirely on
 * cream, so the light theme takes the darker half of the gold ramp — the same
 * split the dust trail and the sparkle field already make.
 */
const PALETTE = {
  dark: {
    body: ['rgba(247,226,168,', 'rgba(239,206,120,', 'rgba(255,251,240,', 'rgba(212,160,58,'],
    edge: 'rgba(255,251,240,',
  },
  light: {
    body: ['rgba(184,132,42,', 'rgba(150,104,31,', 'rgba(212,160,58,', 'rgba(113,77,24,'],
    edge: 'rgba(90,62,20,',
  },
} as const;

/**
 * A slow fall of cut stones, at four depths.
 *
 * The reason this is not a particle field with a diamond sprite is that a stone
 * is only convincing while it is *turning*: what the eye reads as "gemstone"
 * rather than "shape" is the specular quad on the crown sliding off the table
 * as the outline rotates, and that requires the facet geometry every frame.
 *
 * Depth does four things at once — size, fall speed, blur and alpha — and they
 * are deliberately derived from the same number. Separating them is the usual
 * mistake and it flattens the field instantly: a small stone that falls as fast
 * as a large one reads as a small stone, not as a distant one.
 *
 * The pointer pushes stones aside rather than repelling them permanently. Each
 * stone keeps its own displacement, which decays toward zero every frame, so
 * the field closes up behind the cursor the way falling snow does.
 */
export default function CanvasGemRain({
  className = '',
  count = 34,
  speed = 46,
  part = 130,
  outline = false,
}: CanvasGemRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const { theme } = useTheme();
  // A falling field is decoration, and decoration that nobody can see should not
  // be costing a frame. The loop is torn down entirely once the section leaves.
  const onScreen = useOnScreen(canvasRef, '300px', enabled);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !onScreen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const small = window.innerWidth < 768;
    const n = Math.max(8, Math.round(count * (small ? 0.5 : 1)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palette = PALETTE[theme] ?? PALETTE.dark;

    let raf = 0;
    let width = 0;
    let height = 0;
    let last = 0;
    let stones: Stone[] = [];
    const pointer = { x: -9999, y: -9999 };

    const seed = (s: Stone, initial: boolean) => {
      s.x = Math.random() * width;
      s.y = initial ? Math.random() * height : -60;
      s.depth = Math.random();
      s.rot = Math.random() * Math.PI * 2;
      s.spin = (Math.random() - 0.5) * 0.6;
      s.cut = Math.floor(Math.random() * CUTS.length);
      s.drift = (Math.random() - 0.5) * 22;
      s.phase = Math.random() * Math.PI * 2;
      s.px = 0;
      s.py = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      stones = Array.from({ length: n }, () => {
        const s: Stone = {
          x: 0, y: 0, depth: 0, rot: 0, spin: 0, cut: 0, drift: 0, phase: 0, px: 0, py: 0,
        };
        seed(s, true);
        return s;
      });
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const s of stones) {
        // One number, four consequences.
        const size = 6 + s.depth * 20;
        const fall = speed * (0.35 + s.depth * 0.9);
        const alpha = 0.18 + s.depth * 0.42;

        s.y += fall * dt;
        s.x += Math.sin(now / 2600 + s.phase) * s.drift * dt;
        s.rot += s.spin * dt;

        if (part > 0) {
          const dx = s.x + s.px - pointer.x;
          const dy = s.y + s.py - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < part && dist > 0.01) {
            const push = (1 - dist / part) * 42 * dt * 6;
            s.px += (dx / dist) * push;
            s.py += (dy / dist) * push;
          }
        }

        // Displacement decays, so the field closes behind the pointer.
        s.px *= 0.92;
        s.py *= 0.92;

        if (s.y - size > height + 40) seed(s, false);

        const cut = CUTS[s.cut];
        const x = s.x + s.px;
        const y = s.y + s.py;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(s.rot);

        ctx.beginPath();
        cut.points.forEach(([px, py], i) => {
          const vx = px * size;
          const vy = py * size;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        });
        ctx.closePath();

        if (outline) {
          ctx.strokeStyle = `${palette.edge}${alpha * 0.8})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          const body = palette.body[s.cut % palette.body.length];
          const g = ctx.createLinearGradient(-size, -size, size, size);
          g.addColorStop(0, `${body}${alpha * 0.95})`);
          g.addColorStop(0.52, `${palette.edge}${alpha * 0.55})`);
          g.addColorStop(1, `${body}${alpha * 0.4})`);
          ctx.fillStyle = g;
          ctx.fill();

          ctx.strokeStyle = `${palette.edge}${alpha * 0.7})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();

          // The specular quad on the crown. Its width tracks the rotation, so
          // it narrows to nothing as the table turns edge-on — which is the
          // single detail that makes the shape read as a cut stone.
          const openness = Math.abs(Math.cos(s.rot * 1.6 + s.phase));
          if (openness > 0.06) {
            const halfW = size * 0.44 * openness;
            ctx.beginPath();
            ctx.moveTo(-halfW, cut.table * size);
            ctx.lineTo(halfW, cut.table * size);
            ctx.lineTo(halfW * 0.55, cut.table * size + size * 0.42);
            ctx.lineTo(-halfW * 0.55, cut.table * size + size * 0.42);
            ctx.closePath();
            ctx.fillStyle = `${palette.edge}${alpha * 0.5 * openness})`;
            ctx.fill();
          }
        }

        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    build();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      resize();
      build();
    });
    ro.observe(canvas);

    if (part > 0) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, onScreen, count, speed, part, outline, theme]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full contain-paint ${className}`}
    />
  );
}
