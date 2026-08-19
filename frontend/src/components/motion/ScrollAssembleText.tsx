'use client';

import { useMemo, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ScrollAssembleTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  /** Words rendered in the gold italic accent style. */
  highlightWords?: string[];
  /** How far the glyphs start from home, in px. */
  spread?: number;
  /** Fraction of the pass spent assembling. The rest is held settled. */
  window?: number;
  /** Disperse again on the way out rather than staying assembled. */
  disperse?: boolean;
}

/**
 * A headline whose glyphs fly in from scattered positions as the line is
 * scrolled into place, and — optionally — scatter again as it leaves.
 *
 * Distinct from the site's other two type treatments on purpose. SplitText plays
 * a masked entrance once and is done; MagneticText answers the pointer and never
 * moves otherwise. This one is *scrubbed*: the assembly is a position on the
 * scroll, so it runs backwards if the visitor scrolls back up, and it holds
 * mid-assembly if they stop mid-way. That reversibility is the whole effect, and
 * it is why this cannot be a `whileInView` variant.
 *
 * The scatter offsets come from a hash of the glyph's index rather than from
 * Math.random. Random offsets would differ between the server render and the
 * client hydration, and React would either warn or silently keep the server's
 * numbers — meaning the effect would look different on a reload than on a
 * client-side navigation to the same page.
 */
export default function ScrollAssembleText({
  text,
  as = 'h2',
  className = '',
  highlightWords = [],
  spread = 90,
  window: assembleWindow = 0.42,
  disperse = false,
}: ScrollAssembleTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const words = useMemo(() => text.split(' '), [text]);
  const highlight = useMemo(
    () => new Set(highlightWords.map((w) => w.toLowerCase().replace(/[^\w]/g, ''))),
    [highlightWords]
  );

  const Tag = motion[as] as typeof motion.div;

  // Running glyph index across the whole line, so the scatter pattern does not
  // restart at every word boundary.
  let slot = -1;

  return (
    <div ref={ref} className="relative">
      <Tag className={className}>
        {words.map((word, wi) => {
          const clean = word.toLowerCase().replace(/[^\w]/g, '');
          const isHighlight = highlight.has(clean);

          return (
            <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, ci) => {
                slot += 1;
                return (
                  <Glyph
                    key={`${char}-${ci}`}
                    char={char}
                    slot={slot}
                    progress={scrollYProgress}
                    spread={spread}
                    assembleWindow={assembleWindow}
                    disperse={disperse}
                    reduced={Boolean(reduced)}
                    highlight={isHighlight}
                  />
                );
              })}
              {/* A real space, so the line still breaks and copies correctly */}
              {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Deterministic pseudo-random in 0…1 from an integer seed.
 *
 * A hash rather than a PRNG with state: each glyph asks for its own numbers
 * independently, in whatever order React renders them, and a stateful generator
 * would hand out different values depending on that order.
 */
const hash = (n: number, salt: number) => {
  let h = (n + 1) * 374761393 + salt * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

function Glyph({
  char,
  slot,
  progress,
  spread,
  assembleWindow,
  disperse,
  reduced,
  highlight,
}: {
  char: string;
  slot: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  spread: number;
  assembleWindow: number;
  disperse: boolean;
  reduced: boolean;
  highlight: boolean;
}) {
  // Each glyph's home-to-scatter vector, fixed for the life of the component.
  const seed = useMemo(
    () => ({
      x: (hash(slot, 1) - 0.5) * 2,
      y: (hash(slot, 2) - 0.5) * 2,
      rotate: (hash(slot, 3) - 0.5) * 2,
      z: hash(slot, 4),
      // Staggered arrival, so the line does not snap into place all at once.
      lag: hash(slot, 5) * 0.28,
    }),
    [slot]
  );

  const start = Math.min(seed.lag, 0.3);
  const settled = Math.min(start + assembleWindow, 0.62);
  const leave = 0.78;

  const home = 0;
  const away = spread;

  /**
   * Two shapes of ramp, not one ramp with padding.
   *
   * The dispersing case genuinely has four keyframes: scattered, home, held, gone.
   * The non-dispersing case has two — scattered, then home — and must *hold* home for
   * the rest of the pass. Expressing that as a four-stop ramp padded to `[…, 1, 1]`
   * is what it must not be: the duplicated input breaks the interpolator's
   * requirement for strictly increasing stops, and the padded outputs still carry the
   * dispersed values, so a settled headline fades back to opacity 0 at the end of its
   * scroll range. A two-stop transform clamps outside its input range, which is
   * exactly the "arrive and stay" behaviour wanted here.
   */
  const stops = disperse ? [start, settled, leave, 1] : [start, settled];

  const ramp = (from: number, to: number, out: number) =>
    disperse ? [from, to, to, out] : [from, to];

  const x = useTransform(progress, stops, ramp(seed.x * away, home, seed.x * away * 0.7));
  const y = useTransform(progress, stops, ramp(seed.y * away, home, seed.y * away * 0.7));
  const rotate = useTransform(progress, stops, ramp(seed.rotate * 42, 0, seed.rotate * 30));
  const scale = useTransform(progress, stops, ramp(0.55 + seed.z * 0.3, 1, 0.7));
  const opacity = useTransform(progress, stops, ramp(0, 1, 0));
  const blur = useTransform(progress, stops, ramp(10, 0, 7));
  const filter = useTransform(blur, (b) => `blur(${b.toFixed(2)}px)`);

  const classes = highlight
    ? 'inline-block italic text-accent'
    : 'inline-block';

  if (reduced) {
    return <span className={classes}>{char}</span>;
  }

  return (
    <motion.span
      className={classes}
      style={{ x, y, rotate, scale, opacity, filter, willChange: 'transform, opacity' }}
    >
      {char}
    </motion.span>
  );
}
