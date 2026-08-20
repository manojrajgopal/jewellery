'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { beadThread, knotCinch } from '@/lib/motion';

interface PearlKnotSequenceProps {
  className?: string;
  /** Pearls on the strand. */
  pearls?: number;
  /** Show the explanation under the strand. */
  legend?: boolean;
}

/**
 * A strand being knotted, one pearl at a time.
 *
 * Everybody has seen the knots between pearls. Almost nobody has been told what
 * they are for, and the answer is two things, neither of them decorative:
 *
 *   1. A knot between every pearl means a broken strand loses *one* pearl. An
 *      unknotted strand that breaks in a restaurant is a strand you spend the
 *      evening on your knees under a table for, and you will not find them all.
 *   2. Nacre is soft — around 2.5 on Mohs, which is softer than a fingernail is
 *      hard. Pearls sitting directly against each other grind their own drill
 *      holes oval over about a decade, and the day one of them wears through is
 *      the day the strand fails.
 *
 * The third thing, which is the reason restringing is a service rather than a
 * repair: silk absorbs everything the wearer's skin gives it, stretches, and
 * goes grey. A worn strand is diagnosed by *length* — if the spacing between
 * pearls has opened up so the silk is visible between them, it has stretched
 * and it is due. Roughly every two years for a strand worn weekly.
 *
 * The animation is the sequence itself, and it is honest about the order: the
 * pearl goes on, *then* the knot is tied behind it and cinched down tight to
 * the hole. A knot tied first would sit in the wrong place, and a strand where
 * they arrived together would be a strand nobody had actually strung.
 */
export default function PearlKnotSequence({
  className = '',
  pearls = 16,
  legend = true,
}: PearlKnotSequenceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-16% 0px -16% 0px' });
  const [hover, setHover] = useState<number | null>(null);

  // Graduated rather than uniform: a real strand runs largest at the centre
  // front and tapers to the clasp, because that is what sits well on a collar
  // bone. A uniform strand is a modern, cheaper thing and it looks it.
  const size = (i: number) => {
    const centre = (pearls - 1) / 2;
    const away = Math.abs(i - centre) / centre;
    return 22 - away * 7;
  };

  return (
    <div ref={ref} className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-[linear-gradient(160deg,rgb(var(--surface-sunken)),rgb(var(--canvas)))] px-6 py-14">
        {/* The strand. Laid on a gentle arc rather than a straight line —
            pearls on a bench sit in a curve, because silk does. */}
        <motion.div
          animate={reduced ? {} : { rotate: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mx-auto flex max-w-2xl items-end justify-center gap-[3px]"
          style={{ transformOrigin: '50% -220px' }}
        >
          {Array.from({ length: pearls }, (_, i) => {
            const d = size(i);
            return (
              <div key={i} className="relative flex items-end">
                {/* The knot, behind the pearl that has just gone on. */}
                {i > 0 && (
                  <motion.span
                    aria-hidden="true"
                    initial="hidden"
                    animate={reduced || inView ? 'visible' : 'hidden'}
                    variants={reduced ? undefined : knotCinch(i)}
                    className="mb-[6px] mr-[2px] block h-[5px] w-[5px] rotate-45 rounded-[1px] bg-cream-200/80"
                  />
                )}

                <motion.button
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`Pearl ${i + 1} of ${pearls}, ${(d / 3).toFixed(1)}mm`}
                  initial="hidden"
                  animate={reduced || inView ? 'visible' : 'hidden'}
                  variants={reduced ? undefined : beadThread(i)}
                  whileHover={{ y: -4 }}
                  className="relative rounded-full"
                  style={{
                    width: d,
                    height: d,
                    // Nacre is not a shiny sphere. Its highlight is diffuse and
                    // sits *inside* the surface, which is why the bright stop
                    // here is soft-edged and off-centre rather than a hard dot.
                    background:
                      'radial-gradient(circle at 34% 30%, rgb(var(--cream-50)) 0%, rgb(var(--cream-100)) 26%, rgb(var(--ink-100)) 62%, rgb(var(--ink-300)) 100%)',
                    boxShadow:
                      hover === i
                        ? '0 0 0 1px rgb(var(--accent)/0.7), 0 6px 14px -6px rgb(var(--shadow-color)/0.6)'
                        : '0 4px 10px -6px rgb(var(--shadow-color)/0.7)',
                  }}
                >
                  {/* Orient — the faint band of colour that runs across good
                      nacre and is the single figure a grader argues about. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-[18%] rounded-full opacity-40"
                    style={{
                      background:
                        'linear-gradient(120deg, transparent 32%, rgb(var(--rose-300)/0.7) 48%, rgb(var(--jade-300)/0.6) 60%, transparent 74%)',
                    }}
                  />
                </motion.button>
              </div>
            );
          })}
        </motion.div>

        <p className="mt-10 text-center font-accent text-[9px] uppercase tracking-luxe text-faint">
          Graduated · knotted between every pearl · {pearls} on the strand
        </p>
      </div>

      {legend && (
        <div className="mt-6 grid gap-6 border-t border-line-subtle pt-6 md:grid-cols-3">
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Why a knot
            </p>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
              A broken knotted strand loses one pearl. An unknotted one loses
              them under the furniture, and you will not find them all.
            </p>
          </div>
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Why it matters more than it sounds
            </p>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
              Nacre is 2.5 on Mohs — softer than the fingernail you test it
              with. Pearls resting against each other wear their own drill holes
              oval in about ten years.
            </p>
          </div>
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              When it is due
            </p>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
              When you can see silk between the pearls. That is stretch, and it
              is roughly every two years on a strand worn weekly. We restring on
              the premises and it takes a day.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
