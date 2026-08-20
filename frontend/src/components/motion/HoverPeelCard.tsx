'use client';

import { ReactNode, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { springs } from '@/lib/motion';

interface HoverPeelCardProps {
  /** What is printed on the front of the card. */
  children: ReactNode;
  /** What is written on the sheet underneath — the payoff for lifting the corner. */
  underside: ReactNode;
  className?: string;
  /** Size of the lifted triangle in px at rest and when fully peeled. */
  corner?: { rest: number; open: number };
  /** Which corner lifts. Bottom-right is the one a right-handed reader reaches for. */
  from?: 'bottom-right' | 'top-right';
}

/**
 * A printed card whose corner lifts to show the sheet beneath it.
 *
 * Three layers, and the order of them is the whole illusion: the underside sits
 * at the back, the front face is clipped so its corner is *missing* while peeled,
 * and the lifted triangle — a mirrored copy of the front's corner — sits on top
 * casting a shadow back onto the sheet. Skip the third layer and it reads as a
 * hole punched in the card rather than as paper curling.
 *
 * The clip and the triangle are driven from one number, so they can never
 * disagree about how far the corner has lifted. That matters at the moment of
 * release, when a half-peeled card is animating back: two independently
 * transitioning values visibly separate for a few frames.
 *
 * Keyboard and touch get the same thing. It is focusable and toggles on click,
 * because a hover-only reveal hides real content from anyone who cannot hover —
 * which is why the underside is also always present in the accessibility tree.
 */
export default function HoverPeelCard({
  children,
  underside,
  className = '',
  corner = { rest: 26, open: 108 },
  from = 'bottom-right',
}: HoverPeelCardProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  const size = open ? corner.open : corner.rest;
  const bottom = from === 'bottom-right';

  // The front face is clipped to everything except the corner triangle. Written
  // as a polygon rather than a gradient mask so the cut edge stays hard — a soft
  // edge here looks like a smudge, not a fold.
  const frontClip = bottom
    ? `polygon(0 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%)`
    : `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, 0 100%)`;

  return (
    <div
      className={`group relative isolate-blend overflow-hidden rounded-2xl border border-hairline ${className}`}
      onPointerEnter={() => !reduced && setOpen(true)}
      onPointerLeave={() => !reduced && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      tabIndex={0}
      role="button"
      aria-expanded={open}
      aria-label="Lift the corner"
    >
      {/* Layer one: the sheet underneath. */}
      <div className="stock-ruled absolute inset-0 z-0 p-6 md:p-8">{underside}</div>

      {/* Layer two: the printed front, with its corner cut away. */}
      <motion.div
        animate={{ clipPath: reduced ? 'none' : frontClip }}
        transition={springs.plate}
        className="relative z-10 h-full w-full bg-surface-raised"
      >
        {children}
      </motion.div>

      {/* Layer three: the lifted corner. Mirrored, so the ink on it runs the wrong
          way — which is what the back of a printed sheet looks like. */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          animate={{
            width: size,
            height: size,
            rotate: open ? (bottom ? -4 : 4) : 0,
          }}
          transition={springs.plate}
          className={`peel-corner pointer-events-none absolute z-20 ${
            bottom ? 'bottom-0 right-0' : 'right-0 top-0'
          }`}
          style={{
            clipPath: bottom
              ? 'polygon(100% 0, 100% 100%, 0 100%)'
              : 'polygon(0 0, 100% 0, 100% 100%)',
            transformOrigin: bottom ? 'bottom right' : 'top right',
          }}
        />
      )}

      {/* The hint. Only shown while the corner is down, because once it is up the
          card has explained itself. */}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={`pointer-events-none absolute z-30 font-accent text-[9px] uppercase tracking-luxer text-faint ${
          bottom ? 'bottom-2 right-9' : 'right-9 top-2'
        }`}
      >
        Lift
      </motion.span>
    </div>
  );
}
