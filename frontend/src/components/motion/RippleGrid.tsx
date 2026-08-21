'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

import { onFrame } from '@/lib/frameLoop';
import { canvasDpr, getPerfBudget } from '@/lib/perf';

interface RippleGridProps {
  className?: string;
  /** Spacing between dots in CSS px. Smaller reads denser but costs more. */
  spacing?: number;
  /** Radius of the pointer's influence, in px. */
  reach?: number;
  /** How far a dot can be pushed from its home position. */
  push?: number;
  /** Base dot radius in px. */
  dot?: number;
  /** Emit an expanding shockwave on click. */
  shockwave?: boolean;
}

interface Wave {
  x: number;
  y: number;
  /** Seconds since the wave was struck. */
  age: number;
}

/**
 * A field of gold dots that parts around the pointer and rings when struck.
 *
 * Two forces act on every dot: a steady repulsion from the pointer that falls
 * off with distance, and a set of travelling wavefronts from clicks. Both are
 * resolved against the dot's home position rather than accumulated, so the
 * field always settles back flat — an accumulating field drifts and eventually
 * shears apart.
 *
 * Drawn on a canvas rather than as elements. At the default spacing a
 * viewport-width field is ~1,200 dots, and 1,200 absolutely-positioned divs
 * being transformed every frame is a layout thrash the compositor cannot save.
 *
 * Decorative, so it is aria-hidden, pointer-events-none, and does not render at
 * all under a reduced-motion preference.
 *
 * It is also, at ~1,200 dots each rasterising its own arc, the most fill-heavy
 * scene on the site, and it appears four times on the home page. Two things keep
 * that affordable. It paints only while it is on screen — previously all four
 * ran from page load, so three of them were drawing forty-eight hundred arcs a
 * frame that nobody could see. And the grid loosens on weaker devices, so the
 * dot count is bounded rather than being whatever the section's area happens to
 * imply.
 */
export default function RippleGrid({
  className = '',
  spacing = 34,
  reach = 170,
  push = 13,
  dot = 1.25,
  shockwave = true,
}: RippleGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  // Kept in refs, not state: these change on every pointer event and every
  // frame, and re-rendering React for either would be the whole cost.
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const waves = useRef<Wave[]>([]);

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
    // Capped at 2 on a capable device, and at 1 on a weak one: a 3x field on a
    // high-density phone is four times the fill rate for a difference nobody
    // can see on a 1px dot.
    const dpr = canvasDpr();
    const budget = getPerfBudget();

    // The grid opens up rather than thinning out. Spacing is the only knob that
    // reduces dot count without leaving holes in the field, and a 20% wider
    // lattice reads as the same lattice — a field with gaps does not.
    const gap = budget.tier === 'low' ? spacing * 1.7 : budget.tier === 'mid' ? spacing * 1.25 : spacing;
    // Absolute ceiling, so a very tall section cannot ask for ten thousand dots
    // on a device that can afford twelve hundred.
    const MAX_DOTS = budget.tier === 'low' ? 900 : budget.tier === 'mid' ? 2200 : 5000;

    // Read once per resize. The accent colour is a CSS variable and reading it
    // per frame is a forced style recalculation 60 times a second.
    let rgb = '212, 175, 55';
    const readTokens = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue('--gold-400')
        .trim();
      if (v) rgb = v.replace(/\s+/g, ', ');
    };

    // The canvas origin is cached rather than measured per event: a pointer
    // crossing the page fires this hundreds of times a second, and
    // getBoundingClientRect forces a layout every time it is called.
    let origin = { left: 0, top: 0 };
    const measureOrigin = () => {
      const box = canvas.getBoundingClientRect();
      origin = { left: box.left, top: box.top };
    };

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readTokens();
      measureOrigin();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Scrolling moves the canvas without resizing it. Re-reading after the
    // scroll settles keeps the pointer maths right without paying for a layout
    // during the scroll itself.
    let settle = 0;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(measureOrigin, 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Tracked on the window, not the canvas: the canvas is pointer-events-none
    // so it never sees an event of its own, and the field should react to the
    // pointer moving over the content on top of it.
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: e.clientX - origin.left,
        y: e.clientY - origin.top,
        active: true,
      };
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    const onDown = (e: PointerEvent) => {
      if (!shockwave) return;
      const x = e.clientX - origin.left;
      const y = e.clientY - origin.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      // Three concurrent waves is the visual limit; past that the fronts
      // interfere into noise.
      waves.current = [...waves.current.slice(-2), { x, y, age: 0 }];
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    const WAVE_SPEED = 620; // px per second
    const WAVE_LIFE = 1.5; // seconds
    const WAVE_WIDTH = 60; // px — thickness of the ring

    const frame = (_step: number, now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, w, h);

      // Age the waves, dropping the spent ones.
      if (waves.current.length) {
        waves.current = waves.current
          .map((wv) => ({ ...wv, age: wv.age + dt }))
          .filter((wv) => wv.age < WAVE_LIFE);
      }

      const p = pointer.current;
      let cols = Math.ceil(w / gap) + 1;
      let rows = Math.ceil(h / gap) + 1;

      // Widen the lattice further if the section is large enough that the
      // authored spacing would blow the ceiling.
      if (cols * rows > MAX_DOTS) {
        const relax = Math.sqrt((cols * rows) / MAX_DOTS);
        cols = Math.max(2, Math.ceil(cols / relax));
        rows = Math.max(2, Math.ceil(rows / relax));
      }
      const stepX = w / Math.max(1, cols - 1);
      const stepY = h / Math.max(1, rows - 1);

      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          const hx = cx * stepX;
          const hy = cy * stepY;

          let ox = 0;
          let oy = 0;
          let boost = 0;

          // Pointer repulsion.
          if (p.active) {
            const dx = hx - p.x;
            const dy = hy - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < reach * reach) {
              const d = Math.sqrt(d2) || 1;
              // Squared falloff, so the effect has a soft edge rather than a
              // visible circular boundary.
              const f = (1 - d / reach) ** 2;
              ox += (dx / d) * push * f;
              oy += (dy / d) * push * f;
              boost += f * 0.9;
            }
          }

          // Travelling fronts.
          for (let i = 0; i < waves.current.length; i++) {
            const wv = waves.current[i];
            const dx = hx - wv.x;
            const dy = hy - wv.y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const front = wv.age * WAVE_SPEED;
            const offFront = Math.abs(d - front);
            if (offFront < WAVE_WIDTH) {
              const ring = Math.cos((offFront / WAVE_WIDTH) * (Math.PI / 2));
              const decay = 1 - wv.age / WAVE_LIFE;
              const amp = ring * decay;
              ox += (dx / d) * push * 1.5 * amp;
              oy += (dy / d) * push * 1.5 * amp;
              boost += amp;
            }
          }

          const alpha = Math.min(0.1 + boost * 0.55, 0.85);
          const radius = dot * (1 + Math.min(boost, 1.4) * 0.7);

          ctx.beginPath();
          ctx.arc(hx + ox, hy + oy, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.fill();
        }
      }
    };

    // Paints only while in reach of the viewport, on the site's single shared
    // frame loop rather than one of its own.
    let stopLoop: (() => void) | null = null;
    const resume = () => {
      if (stopLoop) return;
      last = performance.now();
      stopLoop = onFrame(frame, { fps: budget.fps, order: 120 });
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

    // Repaint the palette when the theme flips, since the dot colour is a token.
    const themeObserver = new MutationObserver(readTokens);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      suspend();
      io?.disconnect();
      window.clearTimeout(settle);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, spacing, reach, push, dot, shockwave]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
