'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

import { onFrame } from '@/lib/frameLoop';
import { canvasDpr, getPerfBudget } from '@/lib/perf';

interface MetaballGoldProps {
  className?: string;
  /** Number of blobs. Cost is O(count) per row, so keep it low. */
  count?: number;
  /** Opacity multiplier, 0–1. */
  intensity?: number;
  /** Blobs are drawn every Nth pixel row. 3 is smooth, 5 is cheap. */
  step?: number;
  /** Blobs lean toward the pointer. */
  attract?: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Molten gold that merges and separates — a metaball field.
 *
 * A metaball field is a scalar function: every point in the plane sums the
 * influence of every blob, and the surface is wherever that sum crosses a
 * threshold. Two blobs approaching do not overlap, they *fuse*, with a neck
 * that thins and snaps. Nothing built from overlapping circles does that, which
 * is why this is worth the arithmetic.
 *
 * The arithmetic is the whole problem: evaluating the field per pixel is a
 * million samples a frame. This uses the standard cheat — march down every
 * `step`-th scanline, and on each line solve for the spans where the field is
 * above threshold, then fill those spans as rectangles. That turns a per-pixel
 * problem into a per-row one, and at step 3 the seams are invisible under the
 * blur the effect carries anyway.
 *
 * Blobs are given a slow buoyant drift rather than straight velocities, and the
 * walls are soft, so the field never looks like it is bouncing in a box.
 */
export default function MetaballGold({
  className = '',
  count = 7,
  intensity = 0.5,
  step = 3,
  attract = true,
}: MetaballGoldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const pointer = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let last = performance.now();
    let w = 0;
    let h = 0;
    // Deliberately below 1: the field is blurred in CSS, so rendering it at
    // three-quarter scale is free quality-wise and a ~45% saving in fill.
    const dpr = Math.min(canvasDpr(), 1.5) * 0.75;

    let gold = '212, 160, 58';
    let deep = '150, 104, 31';
    let bloom = 1;

    const readTokens = () => {
      const cs = getComputedStyle(document.documentElement);
      const g = cs.getPropertyValue('--gold-400').trim();
      if (g) gold = g.replace(/\s+/g, ', ');
      const d = cs.getPropertyValue('--gold-700').trim();
      if (d) deep = d.replace(/\s+/g, ', ');
      const b = parseFloat(cs.getPropertyValue('--bloom'));
      bloom = Number.isFinite(b) ? b : 1;
    };

    const balls: Ball[] = [];
    const seed = () => {
      balls.length = 0;
      for (let i = 0; i < count; i++) {
        balls.push({
          x: w * (0.15 + Math.random() * 0.7),
          y: h * (0.15 + Math.random() * 0.7),
          vx: (Math.random() - 0.5) * 26,
          vy: (Math.random() - 0.5) * 26,
          // A spread of sizes is what produces the interesting necks — a field
          // of equal blobs fuses into a featureless slab.
          r: Math.min(w, h) * (0.09 + Math.random() * 0.13),
        });
      }
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
      seed();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    if (attract) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    /** Field strength at (x, y). Inverse-square, clamped, the classic kernel. */
    const field = (x: number, y: number) => {
      let sum = 0;
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const dx = x - b.x;
        const dy = y - b.y;
        const d2 = dx * dx + dy * dy;
        // +1 guards the singularity at the centre without changing the shape.
        sum += (b.r * b.r) / (d2 + 1);
      }
      return sum;
    };

    const THRESHOLD = 1;

    const frame = (_step: number, now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      // ---- Integrate ----
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        // Buoyant wander: a slow sinusoidal acceleration, unique per blob, so
        // the motion never settles into a visible orbit.
        b.vx += Math.sin(t * 0.31 + i * 1.7) * 9 * dt;
        b.vy += Math.cos(t * 0.27 + i * 2.3) * 9 * dt;

        if (attract && pointer.current.active) {
          const dx = pointer.current.x - b.x;
          const dy = pointer.current.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < Math.max(w, h) * 0.5) {
            const pull = (1 - d / (Math.max(w, h) * 0.5)) * 60;
            b.vx += (dx / d) * pull * dt;
            b.vy += (dy / d) * pull * dt;
          }
        }

        // Soft walls: a restoring force inside the margin rather than a bounce,
        // so a blob decelerates into the edge and drifts back.
        const m = b.r * 0.6;
        if (b.x < m) b.vx += (m - b.x) * 2.4 * dt;
        if (b.x > w - m) b.vx -= (b.x - (w - m)) * 2.4 * dt;
        if (b.y < m) b.vy += (m - b.y) * 2.4 * dt;
        if (b.y > h - m) b.vy -= (b.y - (h - m)) * 2.4 * dt;

        // Drag, so the accumulated wander never runs away.
        b.vx *= 0.985;
        b.vy *= 0.985;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }

      // ---- March the scanlines ----
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, `rgba(${deep}, ${intensity * bloom})`);
      grad.addColorStop(0.5, `rgba(${gold}, ${intensity * bloom * 1.15})`);
      grad.addColorStop(1, `rgba(${deep}, ${intensity * bloom})`);
      ctx.fillStyle = grad;

      const rowStep = Math.max(2, step);
      const colStep = rowStep;

      for (let y = 0; y < h + rowStep; y += rowStep) {
        let spanStart = -1;
        for (let x = 0; x < w + colStep; x += colStep) {
          const inside = field(x, y) > THRESHOLD;
          if (inside && spanStart < 0) {
            spanStart = x;
          } else if (!inside && spanStart >= 0) {
            ctx.fillRect(spanStart, y, x - spanStart, rowStep);
            spanStart = -1;
          }
        }
        // Close a span that runs to the right edge.
        if (spanStart >= 0) ctx.fillRect(spanStart, y, w - spanStart, rowStep);
      }

    };

    // Paints only while in reach of the viewport, on the site's shared frame
    // loop rather than one of its own. Every one of these scenes previously ran
    // from mount to unload regardless of whether it could be seen.
    let stopLoop: (() => void) | null = null;
    const resume = () => {
      if (stopLoop) return;
      // Resync the clock, or the first frame back integrates the whole time
      // the scene spent suspended and jumps.
      last = performance.now();
      stopLoop = onFrame(frame, { fps: getPerfBudget().fps, order: 120 });
    };
    const suspend = () => {
      stopLoop?.();
      stopLoop = null;
    };

    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? resume() : suspend()),
            { rootMargin: '250px' }
          );
    if (io) io.observe(canvas);
    else resume();

    const themeObserver = new MutationObserver(readTokens);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-cinema'],
    });

    return () => {
      suspend();
      io?.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      if (attract) {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
      }
    };
  }, [reduced, count, intensity, step, attract]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // The blur is what hides the scanline quantisation and turns the spans
      // into a liquid surface. It is part of the effect, not a nicety.
      className={`pointer-events-none absolute inset-0 h-full w-full blur-2xl ${className}`}
    />
  );
}
