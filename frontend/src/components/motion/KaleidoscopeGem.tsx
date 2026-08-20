'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface KaleidoscopeGemProps {
  /** The photograph fed into the mirrors. */
  src: string;
  /** Number of mirrored wedges. Even numbers read as a stone; odd read as a flower. */
  segments?: number;
  /** Degrees per second of drift when the pointer is elsewhere. */
  spin?: number;
  className?: string;
  /** Described for a screen reader; the canvas itself is decorative. */
  caption?: string;
}

/**
 * A photograph seen through a jeweller's kaleidoscope.
 *
 * The construction is the real thing rather than a filter: one wedge of the
 * source is drawn, then the canvas is rotated by the wedge angle and the wedge is
 * drawn again — alternately mirrored, so adjacent wedges meet along a seam
 * instead of repeating. A repeated (unmirrored) wedge is what makes cheap
 * kaleidoscope effects look like a pinwheel; mirroring is the whole trick.
 *
 * The pointer's distance from the centre sets the zoom into the source and its
 * angle adds to the rotation, so moving across the piece feels like turning a
 * barrel rather than scrubbing a slider.
 *
 * Under a reduced-motion preference the wedges are still assembled — the pattern
 * is the content — but nothing rotates: it renders one still frame and stops.
 */
export default function KaleidoscopeGem({
  src,
  segments = 12,
  spin = 6,
  className = '',
  caption,
}: KaleidoscopeGemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  const pointer = useRef({ angle: 0, zoom: 1, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const img = new Image();
    img.decoding = 'async';
    let ready = false;
    let raf = 0;
    let size = 0;
    let rotation = 0;
    let last = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = parent.getBoundingClientRect();
      // Square: a kaleidoscope in a rectangle wastes the corners and clips the
      // outer ring of wedges unevenly.
      size = Math.min(r.width, r.height) || r.width;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) / (r.width / 2 || 1);
      pointer.current = {
        angle: Math.atan2(dy, dx),
        // Clamped: past 1.6 the source is magnified so far that the wedges are
        // a single flat colour.
        zoom: Math.max(0.8, Math.min(1.6, 0.9 + dist * 0.6)),
        active: dist < 2.2,
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!reduced) {
        const p = pointer.current;
        rotation += ((spin + (p.active ? p.angle * 6 : 0)) * dt * Math.PI) / 180;
      }

      const s = size * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, s, s);

      if (!ready) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const half = s / 2;
      const wedge = (Math.PI * 2) / segments;
      const zoom = pointer.current.zoom;

      // Source rectangle: a square crop of the image, scaled by the pointer's
      // distance from centre.
      const srcSize = Math.min(img.width, img.height) / zoom;
      const sx = (img.width - srcSize) / 2;
      const sy = (img.height - srcSize) / 2;

      ctx.save();
      ctx.translate(half, half);
      ctx.rotate(rotation);

      for (let i = 0; i < segments; i++) {
        ctx.save();
        ctx.rotate(i * wedge);
        // Every other wedge is mirrored across its own leading edge, so the two
        // meet as a reflection rather than as a repeat.
        if (i % 2 === 1) ctx.scale(1, -1);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, half * 1.45, -wedge / 2, wedge / 2);
        ctx.closePath();
        ctx.clip();

        // Drawn oversized and offset so the interesting part of the frame lands
        // near the apex, where all the wedges converge.
        ctx.drawImage(img, sx, sy, srcSize, srcSize, -half * 0.2, -half * 1.1, half * 2.2, half * 2.2);
        ctx.restore();
      }

      ctx.restore();

      // The centre stone: a small radial highlight over the convergence point,
      // which is otherwise a visible pinch of noise where twelve wedges meet.
      const bead = ctx.createRadialGradient(half, half, 0, half, half, half * 0.16);
      bead.addColorStop(0, 'rgba(255,255,255,0.75)');
      bead.addColorStop(0.5, 'rgba(255,246,222,0.28)');
      bead.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = bead;
      ctx.beginPath();
      ctx.arc(half, half, half * 0.16, 0, Math.PI * 2);
      ctx.fill();

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    img.onload = () => {
      ready = true;
      raf = requestAnimationFrame(draw);
    };
    img.onerror = () => setFailed(true);
    img.src = src;

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      img.onload = null;
      img.onerror = null;
    };
  }, [src, segments, spin, reduced]);

  return (
    <figure className={`relative grid aspect-square place-items-center overflow-hidden ${className}`}>
      {/* A rim, so the assembled pattern reads as being seen through something. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-full shadow-[inset_0_0_0_1px_rgb(var(--gold-300)/0.4),inset_0_0_60px_-12px_rgb(var(--gold-500)/0.5)]"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="rounded-full mask-iris"
      />
      {/* Fallback: if the source cannot be decoded there is nothing to mirror,
          so say so rather than leaving an empty circle. */}
      {failed && (
        <span className="absolute inset-0 grid place-items-center font-accent text-[10px] uppercase tracking-luxer text-faint">
          Pattern unavailable
        </span>
      )}
      {caption && (
        <figcaption className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-accent text-[10px] uppercase tracking-luxer text-on-media-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
