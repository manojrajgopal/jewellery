'use client';

import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

interface TiltShiftDioramaProps {
  children: ReactNode;
  className?: string;
  /** Strongest blur at the frame edges, in px. */
  blur?: number;
  /** Where the sharp band sits at rest, as a percentage down the frame. */
  centre?: number;
  /** Lift saturation and contrast the way a miniature-faked photograph is graded. */
  grade?: boolean;
  /** Caption printed under the frame in the small caps. */
  caption?: string;
}

/**
 * A photograph made to look like a model of itself.
 *
 * The effect is borrowed from a shift lens, and the reason it works is a piece
 * of optics rather than a filter. A lens focuses on a *plane*, and a tilted
 * lens focuses on a plane that is not parallel to the sensor — so only a narrow
 * band of a scene is sharp and everything nearer and further falls away. A
 * human eye reads that as depth of field, and depth of field that shallow only
 * happens when you are very close to something very small. Hence: a real street
 * looks like a train set, and a real bench looks like a diorama in a museum
 * case.
 *
 * Which is exactly the reading this site wants for a workshop. A bench is a
 * cluttered, unglamorous, entirely real place, and photographed straight it
 * looks like a workplace. Photographed like this it looks like a scale model of
 * a workplace, which is how a visitor who has never seen one imagines it.
 *
 * The band is scroll-driven and it *travels*. A fixed band is a filter; a band
 * that moves down the frame as the section is scrolled is a lens being racked,
 * and it means the sharp part of the picture is always the part the reader has
 * arrived at.
 *
 * The grade matters as much as the blur. Miniature faking is always accompanied
 * by lifted saturation and contrast, because a model is painted rather than lit
 * and paint is more saturated than the world.
 */
export default function TiltShiftDiorama({
  children,
  className = '',
  blur = 6,
  centre = 50,
  grade = true,
  caption,
}: TiltShiftDioramaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  // The band travels through the frame across the pass. It starts high and ends
  // low, so a reader scrolling down is always looking at the sharp part.
  const band = useTransform(eased, [0, 1], [centre - 22, centre + 22]);
  const bandPct = useTransform(band, (v) => `${v}%`);

  // The blur is strongest when the section is central and eases off at both
  // ends, so the effect arrives and leaves rather than being switched on.
  const strength = useTransform(eased, [0, 0.5, 1], [blur * 0.35, blur, blur * 0.35]);
  const blurPx = useTransform(strength, (v) => `${v}px`);

  return (
    <figure ref={ref} className={className}>
      <div className="relative overflow-hidden rounded-2xl">
        {/* The sharp original, untouched. */}
        <div className={grade ? 'saturate-[1.24] contrast-[1.12]' : undefined}>{children}</div>

        {/* A second, blurred copy laid over it and masked to the two out-of-focus
            zones. Masking a blurred copy rather than blurring the original is
            the only way to get a *gradient* of focus — a filter applies to the
            whole element and cannot be feathered. */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              filter: blurPx,
              ['--tilt-centre' as string]: bandPct,
              WebkitMaskImage:
                'linear-gradient(180deg, #000 0%, transparent calc(var(--tilt-centre) - 17%), transparent calc(var(--tilt-centre) + 17%), #000 100%)',
              maskImage:
                'linear-gradient(180deg, #000 0%, transparent calc(var(--tilt-centre) - 17%), transparent calc(var(--tilt-centre) + 17%), #000 100%)',
            }}
          >
            <div className={grade ? 'saturate-[1.24] contrast-[1.12]' : undefined}>{children}</div>
          </motion.div>
        )}

        {/* The plane of focus, marked. Faint enough to be atmosphere and present
            enough that the effect is legible as a choice rather than as a
            rendering fault — which is what an unexplained blur looks like. */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            style={{ top: bandPct }}
            className="pointer-events-none absolute inset-x-0 h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgb(var(--gold-200)/0.32)_28%,rgb(var(--gold-200)/0.32)_72%,transparent)]"
          />
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 flex items-baseline gap-3 font-accent text-[9px] uppercase tracking-luxe text-faint">
          <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
