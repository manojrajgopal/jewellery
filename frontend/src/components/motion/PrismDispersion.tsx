'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

import { onFrame } from '@/lib/frameLoop';
import { canvasDpr, getPerfBudget } from '@/lib/perf';

interface PrismDispersionProps {
  className?: string;
  /** Where the prism sits, as a fraction of the box. */
  at?: { x: number; y: number };
  /** Size of the prism in px along its base. */
  size?: number;
  /** How many spectral rays leave the prism. More reads smoother, costs fill rate. */
  rays?: number;
  /** Follow the pointer's height to change the angle of incidence. */
  interactive?: boolean;
}

/**
 * A beam of white light struck through a prism, fanning out as a spectrum.
 *
 * The physics is only as real as it needs to look. One incident ray arrives from
 * the left edge, and every outgoing ray leaves at a slightly different angle —
 * red deviated least, violet most — which is the one fact about dispersion a
 * viewer actually recognises. Ordering the rays that way is what stops it
 * reading as a generic rainbow gradient.
 *
 * Drawn with additive compositing ('lighter') so overlapping rays brighten into
 * white near the prism and separate into colour as they travel, exactly as a
 * real fan does. That single blend mode does more work than any amount of
 * per-ray opacity tuning.
 *
 * Decorative: aria-hidden, pointer-events-none, and not rendered at all under a
 * reduced-motion preference — a moving beam is precisely what that setting is
 * asking us not to do.
 */
export default function PrismDispersion({
  className = '',
  at = { x: 0.38, y: 0.46 },
  size = 190,
  rays = 34,
  interactive = true,
}: PrismDispersionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  // Pointer height, normalised. Kept in a ref because it changes on every
  // pointer event and none of those should re-render React.
  const incidence = useRef(0.5);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let w = 0;
    let h = 0;
    let t = 0;
    const dpr = canvasDpr();

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Cached: measuring the canvas on every pointer event forces a layout, and
    // the beam only needs to know where the canvas is, which changes on resize
    // and on scroll rather than on every mouse move.
    let box = { top: 0, height: 1 };
    const measure = () => {
      const r = canvas.getBoundingClientRect();
      box = { top: r.top, height: r.height || 1 };
    };
    measure();

    let settle = 0;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(measure, 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMove = (e: PointerEvent) => {
      if (!interactive) return;
      // Clamped rather than ignored when the pointer is outside: the beam should
      // lean toward wherever the pointer went, not snap back to centre.
      incidence.current = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    /** Hue in degrees per ray, red through violet. */
    const hueOf = (i: number) => 8 + (i / Math.max(1, rays - 1)) * 272;

    const frame = (step: number) => {
      t += 0.008 * step;
      ctx.clearRect(0, 0, w, h);

      const px = w * at.x;
      const py = h * at.y;
      const half = size / 2;

      // The incident ray. A slow sine keeps it alive even when nothing is
      // pointing at it, so the piece is never a still image.
      const lean = (incidence.current - 0.5) * 0.55 + Math.sin(t * 0.9) * 0.06;
      const entryY = py - lean * h * 0.28;

      ctx.globalCompositeOperation = 'lighter';

      // Incoming white beam, drawn as three overlaid strokes so its core is
      // hotter than its edges without needing a gradient per frame.
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(-20, entryY);
        ctx.lineTo(px - half * 0.2, py);
        ctx.lineWidth = 9 - k * 3.4;
        ctx.strokeStyle = `rgba(255, 250, 235, ${0.05 + k * 0.05})`;
        ctx.stroke();
      }

      // The fan. Deviation grows with hue, and the whole fan tilts with the
      // angle of incidence — that coupling is what makes it feel like optics
      // rather than like an animated gradient.
      for (let i = 0; i < rays; i++) {
        const f = i / Math.max(1, rays - 1);
        const deviation = (0.08 + f * 0.42) * (1 + lean * 0.5);
        const endX = w + 60;
        const endY = py + (endX - px) * (deviation - 0.22) + Math.sin(t * 1.4 + f * 3) * 6;

        const grad = ctx.createLinearGradient(px, py, endX, endY);
        const hue = hueOf(i);
        grad.addColorStop(0, `hsla(${hue}, 100%, 78%, 0.42)`);
        grad.addColorStop(0.35, `hsla(${hue}, 96%, 62%, 0.2)`);
        grad.addColorStop(1, `hsla(${hue}, 92%, 56%, 0)`);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // The prism itself, last and in source-over, so the fan appears to leave
      // from behind the glass rather than from in front of it.
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.moveTo(px, py - half);
      ctx.lineTo(px + half * 0.92, py + half * 0.72);
      ctx.lineTo(px - half * 0.92, py + half * 0.72);
      ctx.closePath();

      const glass = ctx.createLinearGradient(px - half, py - half, px + half, py + half);
      glass.addColorStop(0, 'rgba(255,255,255,0.16)');
      glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
      glass.addColorStop(1, 'rgba(255,255,255,0.2)');
      ctx.fillStyle = glass;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.42)';
      ctx.stroke();

    };

    // Paints only while in reach of the viewport, on the shared frame loop.
    let stopLoop: (() => void) | null = null;
    const resume = () => {
      if (!stopLoop) stopLoop = onFrame(frame, { fps: getPerfBudget().fps, order: 120 });
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

    return () => {
      suspend();
      io?.disconnect();
      window.clearTimeout(settle);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced, at.x, at.y, size, rays, interactive]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
