'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

interface MagneticFieldLinesProps {
  className?: string;
  /** Number of hairlines across the frame. */
  lines?: number;
  /** Points sampled per line. More is smoother and costs more. */
  resolution?: number;
  /** Radius of the pointer's influence, in px. */
  radius?: number;
  /** Maximum displacement at the centre of the influence, in px. */
  strength?: number;
  /** Run the lines vertically instead of horizontally. */
  vertical?: boolean;
}

/**
 * A field of hairlines that bows away from the pointer.
 *
 * Written as SVG polylines rather than as canvas, for one reason that matters:
 * these are *hairlines*, and a hairline is the one thing canvas cannot do well.
 * At any device pixel ratio a 1px canvas stroke either blurs across two rows or
 * snaps to one, and a field of thirty of them makes the inconsistency obvious.
 * SVG with `vector-effect: non-scaling-stroke` gives a true hairline at every
 * ratio, which is why the class exists in globals.
 *
 * The deflection is an inverse-square-ish falloff rather than a linear one. A
 * linear falloff produces a cone — every line inside the radius bends by an
 * amount proportional to its distance, so the boundary of the effect is a
 * visible straight edge. Squaring it puts almost all of the displacement in the
 * middle third, and the field appears to have no boundary at all.
 *
 * Points are recomputed in a `requestAnimationFrame` loop against a pointer
 * position held in a ref, so a fast mouse cannot queue more work than the
 * browser can paint.
 */
export default function MagneticFieldLines({
  className = '',
  lines = 18,
  resolution = 26,
  radius = 220,
  strength = 34,
  vertical = false,
}: MagneticFieldLinesProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<(SVGPolylineElement | null)[]>([]);
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const size = useRef({ w: 0, h: 0 });
  const [enabled, setEnabled] = useState(false);
  // The field only deflects around a pointer that is over it, so off screen
  // there is nothing for the loop to compute. Torn down rather than idled.
  const onScreen = useOnScreen(wrapRef, '200px', enabled);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
  }, []);

  /**
   * One line's points, as an SVG `points` string. Kept out of the render loop
   * body so the maths is legible: for each sample, find the distance to the
   * pointer, and push the sample *away* along that vector.
   */
  const pointsFor = useCallback(
    (index: number) => {
      const { w, h } = size.current;
      if (!w || !h) return '';
      const p = pointer.current;
      const out: string[] = [];

      for (let i = 0; i <= resolution; i++) {
        const t = i / resolution;
        // Base position: evenly spaced lines, evenly spaced samples along each.
        const bx = vertical ? ((index + 0.5) / lines) * w : t * w;
        const by = vertical ? t * h : ((index + 0.5) / lines) * h;

        let x = bx;
        let y = by;

        if (p.active) {
          const dx = bx - p.x;
          const dy = by - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius && dist > 0.001) {
            const falloff = 1 - dist / radius;
            const push = strength * falloff * falloff;
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
        }

        out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }

      return out.join(' ');
    },
    [lines, resolution, radius, strength, vertical]
  );

  useEffect(() => {
    if (!enabled || !onScreen) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    let dirty = true;

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      size.current = { w: rect.width, h: rect.height };
      dirty = true;
    };

    const frame = () => {
      if (dirty) {
        pathsRef.current.forEach((el, i) => {
          if (el) el.setAttribute('points', pointsFor(i));
        });
        // Only keep repainting while the pointer is over the field; once it has
        // left and the lines are straight there is nothing left to animate.
        dirty = pointer.current.active;
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left - radius &&
        e.clientX <= rect.right + radius &&
        e.clientY >= rect.top - radius &&
        e.clientY <= rect.bottom + radius;
      pointer.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: inside,
      };
      dirty = true;
    };

    measure();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', measure);
    };
  }, [enabled, onScreen, pointsFor, radius]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        {Array.from({ length: lines }).map((_, i) => (
          <polyline
            key={i}
            ref={(el) => {
              pathsRef.current[i] = el;
            }}
            fill="none"
            className="stroke-hair"
            stroke="rgb(var(--accent))"
            // Lines fade toward the edges of the field, so the frame does not
            // end in a hard row of strokes at the top and bottom.
            strokeOpacity={0.05 + 0.13 * Math.sin((Math.PI * (i + 0.5)) / lines)}
          />
        ))}
      </svg>
    </div>
  );
}
