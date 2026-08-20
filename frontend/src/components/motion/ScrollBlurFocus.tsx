'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ScrollBlurFocusProps {
  /** One entry per line. Long lines wrap and still behave as one line. */
  lines: string[];
  className?: string;
  /** How sharp the focus window is. Lower is a longer lens. */
  depth?: number;
  /** Tag to render each line as. */
  as?: 'p' | 'span' | 'div';
  /** Bring the emphasised line forward in the accent colour. */
  tint?: boolean;
}

/**
 * A passage where exactly one line is in focus, and the focus travels with the
 * scroll.
 *
 * This is the text equivalent of `RackFocusPlates`, and it is a deliberately
 * different instrument from `ScrollTextMask`. That one brightens words as the
 * passage crosses the viewport — every word ends up lit and the reveal is
 * cumulative. This one is *exclusive*: bringing line four into focus takes line
 * three out of it again, so the reader can only be in one place at a time.
 *
 * The mechanism is one shared scroll progress and a per-line distance from it.
 * Line i owns the progress window centred on (i + 0.5) / n, and the blur, the
 * opacity and the small Z-translate are all functions of |progress − centre|.
 * Deriving them from one distance is what keeps them consistent: a line cannot
 * be sharp and dim, or blurred and forward, which is what happens when three
 * separate transforms are given three separate input ranges.
 *
 * `depth` is the aperture. At 1 the focus window is one line wide; at 0.5 it is
 * two lines wide and the passage reads as a slower, longer lens.
 */
export default function ScrollBlurFocus({
  lines,
  className = '',
  depth = 1,
  as = 'p',
  tint = true,
}: ScrollBlurFocusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // The window is generous on both sides so the first line is already coming
  // into focus as the block appears, and the last has not yet left when it goes.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 88%', 'end 12%'],
  });

  return (
    <div ref={ref} className={`space-y-5 ${className}`}>
      {lines.map((line, i) => (
        <FocusLine
          key={i}
          line={line}
          index={i}
          total={lines.length}
          progress={scrollYProgress}
          depth={depth}
          as={as}
          tint={tint}
          reduced={!!reduced}
        />
      ))}
    </div>
  );
}

/**
 * One line. Split into its own component because each needs its own set of
 * transforms, and a hook cannot be called inside a `map` in the parent without
 * the count changing whenever `lines` does.
 */
function FocusLine({
  line,
  index,
  total,
  progress,
  depth,
  as,
  tint,
  reduced,
}: {
  line: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  depth: number;
  as: 'p' | 'span' | 'div';
  tint: boolean;
  reduced: boolean;
}) {
  // Where in the scroll this line is the subject, and how wide its window is.
  const centre = (index + 0.5) / total;
  const half = Math.max(0.08, 0.5 / total / Math.max(0.35, depth));

  const near = centre - half;
  const far = centre + half;

  const blur = useTransform(progress, [near - half, centre, far + half], [7, 0, 7]);
  const filter = useTransform(blur, (v) => `blur(${Math.max(0, v).toFixed(2)}px)`);
  const opacity = useTransform(progress, [near - half, centre, far + half], [0.26, 1, 0.26]);
  const z = useTransform(progress, [near - half, centre, far + half], [-40, 0, -40]);

  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return (
      <Plain className="font-display text-2xl leading-snug text-secondary md:text-3xl">
        {line}
      </Plain>
    );
  }

  return (
    <Tag
      style={{ filter, opacity, z }}
      // The tint is carried by the shared opacity rather than by an animated
      // colour. Interpolating between two `rgb(var(--token))` values is not
      // something a mixer can do — the values are not colours until the browser
      // resolves them — and a line held at accent with a quarter of its opacity
      // reads as muted anyway, in both themes, for free.
      className={`font-display text-2xl leading-snug will-transform md:text-3xl ${
        tint ? 'text-accent' : 'text-secondary'
      }`}
    >
      {line}
    </Tag>
  );
}
