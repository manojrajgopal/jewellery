'use client';

import { useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll, useVelocity } from 'framer-motion';

interface ChromaSplitProps {
  /**
   * Kept deliberately narrow: the children are rendered three times, so this is
   * for headings, rules and short blocks of type. Do not wrap a photograph, a
   * form, or anything with an `id` in it.
   */
  children: React.ReactNode;
  className?: string;
  /** Maximum channel separation in px at full velocity. */
  amount?: number;
  /** Scroll velocity, in px/s, that produces the full separation. */
  saturateAt?: number;
  /** Also split on hover, at a fixed low amount. */
  onHover?: boolean;
}

/**
 * Chromatic aberration driven by how fast the page is moving.
 *
 * Cheap glass cannot bring all three wavelengths to one focal plane, so a fast
 * pan smears red one way and cyan the other. Two tinted copies of the children
 * sit behind the real one and are offset in opposite directions, with the offset
 * proportional to scroll velocity. Stop scrolling and it converges to zero — the
 * page is only ever aberrated while it is actually moving, which is the part a
 * static RGB-split filter gets wrong.
 *
 * The tint is done with `sepia` then `hue-rotate` rather than an SVG colour
 * matrix. A matrix is more correct, but it forces the subtree onto a separate
 * filter surface that is re-rasterised on every offset change, and at scroll
 * frequency that is the whole frame budget. The sepia route composites.
 *
 * The copies are aria-hidden, inert and unselectable; the real children stay on
 * top and fully interactive. Velocity is quantised to half-pixels of separation
 * before it reaches React, so a fast flick costs a handful of renders rather
 * than one per frame.
 */
export default function ChromaSplit({
  children,
  className = '',
  amount = 4,
  saturateAt = 2600,
  onHover = false,
}: ChromaSplitProps) {
  const reduced = useReducedMotion();

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  const [split, setSplit] = useState(0);
  const [hovered, setHovered] = useState(false);
  const lastRef = useRef(0);

  useMotionValueEvent(velocity, 'change', (v) => {
    // Sign is preserved: scrolling up smears the opposite way from scrolling
    // down, which is what a real pan does and is worth the extra branch.
    const signed = Math.max(-1, Math.min(1, v / saturateAt)) * amount;
    const q = Math.round(signed * 2) / 2;
    if (q !== lastRef.current) {
      lastRef.current = q;
      setSplit(q);
    }
  });

  const active = split + (hovered && onHover ? amount * 0.55 : 0);
  const on = !reduced && Math.abs(active) > 0.25;

  return (
    <div
      className={`relative ${className}`}
      onPointerEnter={onHover ? () => setHovered(true) : undefined}
      onPointerLeave={onHover ? () => setHovered(false) : undefined}
    >
      {on && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none mix-blend-screen"
            style={{
              transform: `translate3d(${-active}px, 0, 0)`,
              opacity: 0.4,
              filter: 'sepia(1) hue-rotate(-52deg) saturate(7)',
            }}
          >
            {children}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none mix-blend-screen"
            style={{
              transform: `translate3d(${active}px, 0, 0)`,
              opacity: 0.4,
              filter: 'sepia(1) hue-rotate(142deg) saturate(7)',
            }}
          >
            {children}
          </div>
        </>
      )}

      <div className="relative">{children}</div>
    </div>
  );
}
