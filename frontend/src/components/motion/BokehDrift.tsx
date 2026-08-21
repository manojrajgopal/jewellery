'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

import { onFrame } from '@/lib/frameLoop';
import { canvasDpr, getPerfBudget } from '@/lib/perf';

interface BokehDriftProps {
  className?: string;
  /** How many orbs. Cost is linear; 26 is comfortable on a phone. */
  count?: number;
  /** Peak opacity multiplier, 0–1. */
  intensity?: number;
  /** Drift speed multiplier. */
  speed?: number;
  /** Draw the polygonal aperture edge rather than perfect circles. */
  blades?: number;
}

interface Orb {
  x: number;
  y: number;
  /** Depth 0–1: 0 is far, 1 is right against the lens. */
  z: number;
  r: number;
  vx: number;
  vy: number;
  /** Phase offset so the orbs do not pulse together. */
  phase: number;
  tint: number;
}

/**
 * Out-of-focus highlights drifting through the frame.
 *
 * Bokeh is not a blurred circle — it is the *shape of the aperture*, projected.
 * A lens with seven blades throws heptagons, and it renders them with a bright
 * rim and a slightly hollow centre because the light comes from the edge of the
 * cone. Both of those are drawn here, and together they are the difference
 * between this and the round soft dots that every particle field ships with.
 *
 * Depth does three jobs at once: nearer orbs are larger, softer, and drift
 * faster, which is parallax without a scroll listener. They wrap rather than
 * respawning, so the field never visibly reseeds.
 *
 * Additive compositing, so overlapping highlights brighten. `--bloom` scales
 * the whole field back on the cream theme, where additive light reads as fog.
 */
export default function BokehDrift({
  className = '',
  count = 26,
  intensity = 0.55,
  speed = 1,
  blades = 7,
}: BokehDriftProps) {
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

    let last = performance.now();
    let w = 0;
    let h = 0;
    const dpr = Math.min(canvasDpr(), 1.75);

    let bloom = 1;
    let gold = '227, 181, 81';
    let champagne = '236, 216, 183';

    const readTokens = () => {
      const cs = getComputedStyle(document.documentElement);
      const b = parseFloat(cs.getPropertyValue('--bloom'));
      bloom = Number.isFinite(b) ? b : 1;
      const g = cs.getPropertyValue('--gold-400').trim();
      if (g) gold = g.replace(/\s+/g, ', ');
      const c = cs.getPropertyValue('--champagne-300').trim();
      if (c) champagne = c.replace(/\s+/g, ', ');
    };

    const orbs: Orb[] = [];
    const seed = () => {
      orbs.length = 0;
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          // Radius is driven by depth, not randomised independently — that is
          // what makes the field read as one space rather than as noise.
          r: 6 + z * z * 54,
          vx: (Math.random() - 0.5) * (6 + z * 22),
          vy: -(3 + z * 14) - Math.random() * 6,
          phase: Math.random() * Math.PI * 2,
          tint: Math.random(),
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
      if (!orbs.length) seed();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    /** Draw one aperture-shaped highlight. */
    const drawOrb = (o: Orb, t: number) => {
      // The orb breathes very slightly — real bokeh shimmers as the air moves.
      const pulse = 0.86 + Math.sin(t * 0.7 + o.phase) * 0.14;
      const r = o.r * pulse;
      const rgb = o.tint > 0.62 ? champagne : gold;
      // Nearer orbs are dimmer: they are further out of focus, so the same
      // light is spread over more area.
      const alpha = intensity * bloom * (0.5 - o.z * 0.28) * pulse;
      if (alpha <= 0.002 || r < 0.6) return;

      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(o.phase * 0.3);

      // Aperture polygon as the clip, so both the fill and the rim get the
      // blade shape without drawing the path twice.
      if (blades >= 3) {
        ctx.beginPath();
        for (let i = 0; i <= blades; i++) {
          const a = (i / blades) * Math.PI * 2;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.clip();
      }

      // Hollow centre, bright rim — the signature of a fast lens wide open.
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(${rgb}, ${alpha * 0.5})`);
      g.addColorStop(0.62, `rgba(${rgb}, ${alpha * 0.6})`);
      g.addColorStop(0.9, `rgba(${rgb}, ${alpha})`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-r, -r, r * 2, r * 2);

      ctx.restore();
    };

    const frame = (_step: number, now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        o.x += o.vx * dt * speed;
        o.y += o.vy * dt * speed;

        // Wrap with a margin of one radius, so an orb is fully off-frame before
        // it reappears on the other side.
        const m = o.r * 1.6;
        if (o.x < -m) o.x = w + m;
        if (o.x > w + m) o.x = -m;
        if (o.y < -m) o.y = h + m;
        if (o.y > h + m) o.y = -m;

        drawOrb(o, t);
      }

      ctx.globalCompositeOperation = 'source-over';
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
    };
  }, [reduced, count, intensity, speed, blades]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
