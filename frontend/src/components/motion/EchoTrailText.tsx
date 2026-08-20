'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface EchoTrailTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** How many ghost copies trail the real line. Three is the sweet spot. */
  echoes?: number;
  /** Px of offset between consecutive echoes. */
  spread?: number;
  /** Direction the trail is thrown. */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Keep a permanent faint trail after the reveal, revived on hover. */
  persistent?: boolean;
}

/**
 * Type that arrives dragging copies of itself.
 *
 * Motion blur on text is expensive and ugly. What reads as motion blur to the
 * eye is *temporal aliasing* — the impression of the same shape at several points
 * along its path at once — and that can be faked exactly by stacking offset
 * copies at falling opacities. This does that: the real line is on top, and N
 * ghosts sit behind it, each further along the incoming path and each dimmer.
 *
 * The important detail is that the ghosts converge *faster* than the real line.
 * Their offsets collapse over 70% of the duration while the line takes the full
 * 100%, so the trail catches up and disappears into the type instead of arriving
 * with it. Matched durations produce a smeared final state that just looks
 * blurry.
 *
 * The ghosts are aria-hidden and the real text is a single ordinary text node,
 * so this costs nothing in the accessibility tree and copies cleanly.
 */
export default function EchoTrailText({
  text,
  as: Tag = 'span',
  className = '',
  echoes = 3,
  spread = 14,
  direction = 'left',
  persistent = false,
}: EchoTrailTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-8% 0px -12% 0px' });
  const [hovered, setHovered] = useState(false);

  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const sign = direction === 'left' || direction === 'up' ? -1 : 1;

  const ghosts = reduced ? 0 : echoes;

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onPointerEnter={persistent ? () => setHovered(true) : undefined}
      onPointerLeave={persistent ? () => setHovered(false) : undefined}
    >
      {Array.from({ length: ghosts }, (_, i) => {
        const step = i + 1;
        const from = sign * spread * step;
        // A persistent trail rests at a fraction of the full offset, so the line
        // always carries a hint of movement and hovering extends it.
        const rest = persistent ? sign * spread * step * (hovered ? 0.55 : 0.22) : 0;

        return (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={{ [axis]: from, opacity: 0 }}
            animate={inView ? { [axis]: rest, opacity: 0.5 / step } : undefined}
            transition={{
              // 0.7 of the parent's duration — the trail has to arrive first.
              duration: 0.7,
              delay: 0.02 * step,
              ease: [0.16, 0.84, 0.24, 1],
            }}
            className="pointer-events-none absolute inset-0 select-none text-accent/70 blur-[0.4px]"
          >
            {text}
          </motion.span>
        );
      })}

      <Tag className="relative m-0">
        <motion.span
          initial={reduced ? { opacity: 0 } : { [axis]: sign * spread * 0.6, opacity: 0 }}
          animate={inView ? { [axis]: 0, opacity: 1 } : undefined}
          transition={{ duration: 1, ease: [0.16, 0.84, 0.24, 1] }}
          className="block"
        >
          {text}
        </motion.span>
      </Tag>
    </div>
  );
}
