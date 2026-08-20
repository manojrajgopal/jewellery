'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { easeMachine } from '@/lib/motion';

interface GoldLeafGildProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** Leaves laid across the width. More is a finer hand and a longer laying. */
  flakes?: number;
  /** Include the burnisher pass once every leaf is down. */
  burnished?: boolean;
}

/**
 * Text being gilded, one leaf at a time.
 *
 * The site has several gold treatments and all of them are *finishes*: a metal
 * gradient, a travelling sheen, a foil sweep. Gilding is a process, and the
 * process looks nothing like the finish. Gold leaf is about a quarter of a
 * micron thick — thin enough to be translucent, thin enough that a draught
 * destroys it — and it comes in small squares a gilder lays down one at a time
 * with a tip brush. The surface is built out of overlapping patches with visible
 * joins, and it stays dull and creased until the agate burnisher goes over it.
 *
 * That gives three stages, in an order that cannot be rearranged: the laying,
 * the joins, and the burnish. The burnish is worth its own stage precisely
 * because it is the only one with no geometry in it — brightness and saturation
 * only, and it is the moment the surface stops looking like paper.
 *
 * ## How it is built, and the trap in the obvious approach
 *
 * `background-clip: text` clips an element's *own* background to its
 * letterforms. It does nothing to a child element, which makes the obvious
 * implementation — one clipped heading with animated flake divs inside it — draw
 * nothing at all: the flakes are children, so they are not clipped, and the
 * heading itself has no background left to show. The text simply disappears.
 *
 * So each leaf here is a **window** rather than a shape. Every flake is a narrow
 * `overflow-hidden` column holding its own complete, gilded copy of the heading,
 * offset so its letters land exactly where the base heading's letters are. The
 * copy carries the leaf gradient as its own background, so the clip works, and
 * the column reveals only its slice of it. Animating the window in is then
 * indistinguishable from laying a leaf across the type — and because the columns
 * overlap slightly with uneven widths, the joins fall where a gilder's would.
 *
 * The base heading underneath is the ungilded surface: dull, real, and always
 * present, which is what makes this safe under reduced motion and safe if a
 * paint is dropped. Nothing here can end with invisible type.
 */
export default function GoldLeafGild({
  text,
  className = '',
  as = 'h2',
  flakes = 7,
  burnished = true,
}: GoldLeafGildProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-16% 0px -16% 0px' });
  const reduced = useReducedMotion();
  const Tag = as;

  const run = inView || reduced;

  /* Leaf geometry. Deterministic from the index rather than random, so the
     server and the client agree — a random layout hydrates differently and React
     replaces the whole heading on mount, which shows as a flash.

     Widths are uneven and the columns overlap by design: a gilder's leaves are
     square, laid by hand and never flush, and an even division reads as a
     wipe. */
  const leaves = useMemo(() => {
    const pitch = 100 / flakes;
    return Array.from({ length: flakes }, (_, i) => {
      const jitter = ((i * 37) % 11) / 11; // 0–1, no pattern the eye can lock to
      const left = Math.max(0, i * pitch - pitch * 0.16 * jitter);
      const width = Math.min(100 - left, pitch * (1.18 + jitter * 0.22));
      return { i, left, width };
    });
  }, [flakes]);

  /* One shared set of type classes, used by the base heading and by every
     window's copy. They have to match exactly or the letters inside a window sit
     a fraction off the letters underneath, which reads as a printing error. */
  const type = 'font-display leading-[0.95] tracking-slab whitespace-pre';

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      {/* The unlaid surface. Always painted, never animated — this is the size
          the leaf goes onto, and it is why nothing here can end up invisible. */}
      <Tag
        className={`${type} bg-[linear-gradient(180deg,rgb(var(--gold-800)/0.55),rgb(var(--gold-900)/0.65))] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]`}
      >
        {text}
      </Tag>

      {/* The leaves. Each is a window onto its own gilded copy of the heading. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {leaves.map((leaf) => (
          <motion.span
            key={leaf.i}
            initial={reduced ? false : { opacity: 0, scaleY: 0.82 }}
            animate={run ? { opacity: 1, scaleY: 1 } : undefined}
            transition={{
              duration: 0.55,
              delay: leaf.i * 0.075,
              ease: easeMachine.ratchet,
            }}
            style={{
              left: `${leaf.left}%`,
              width: `${leaf.width}%`,
              transformOrigin: '50% 40%',
            }}
            className="absolute inset-y-0 block overflow-hidden"
          >
            {/* The copy, pulled back so its letters register with the base. */}
            <span
              className="absolute inset-y-0 block"
              style={{
                left: `${-(leaf.left / leaf.width) * 100}%`,
                width: `${(100 / leaf.width) * 100}%`,
              }}
            >
              <Tag
                className={`${type} leaf-skin bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]`}
              >
                {text}
              </Tag>
            </span>
          </motion.span>
        ))}
      </span>

      {/* The joins. Drawn once over the finished surface and never animated — a
          crease that moves is foil catching light rather than leaf. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Tag
          className={`${type} leaf-crease bg-clip-text text-transparent opacity-70 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]`}
        >
          {text}
        </Tag>
      </span>

      {/* The burnisher: one pass of the agate, clipped to the same letterforms.
          Brightness only, and the only element here allowed to travel. */}
      {burnished && !reduced && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Tag
            className={`${type} burnish-skin bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]`}
          >
            {text}
          </Tag>
        </span>
      )}
    </div>
  );
}
