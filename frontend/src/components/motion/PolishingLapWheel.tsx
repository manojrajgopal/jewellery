'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface Compound {
  id: string;
  name: string;
  /** Abrasive size in microns — the number that decides what it can remove. */
  micron: number;
  swatch: string;
  /** What this wheel is actually for. */
  job: string;
  /** What happens if you skip it. */
  skip: string;
}

/**
 * The four wheels, in the only order they can be run in.
 *
 * Every figure is the real abrasive grade. The reason the order cannot change
 * is arithmetic rather than tradition: a wheel can only remove scratches
 * *coarser* than its own particle, so running rouge before tripoli polishes the
 * tripoli scratches to a mirror finish and leaves them there permanently.
 */
const COMPOUNDS: Compound[] = [
  {
    id: 'emery',
    name: 'Emery',
    micron: 30,
    swatch: 'rgb(var(--ink-500))',
    job: 'Takes out file marks and the last of the casting skin. This is cutting, not polishing — metal is being removed and the piece is getting smaller.',
    skip: 'Every later wheel simply makes the file marks shinier.',
  },
  {
    id: 'tripoli',
    name: 'Tripoli',
    micron: 8,
    swatch: 'rgb(var(--jade-700))',
    job: 'Removes the emery scratches. The surface goes from grey to bright here, which is the moment that feels like progress and is only halfway.',
    skip: 'A bright piece with a haze in it that nobody can name and everybody can see.',
  },
  {
    id: 'white',
    name: 'White diamond',
    micron: 3,
    swatch: 'rgb(var(--ink-200))',
    job: 'The step most benches leave out under deadline. It is the difference between shiny and wet-looking.',
    skip: 'Nothing visibly wrong. It just never quite looks like the photograph.',
  },
  {
    id: 'rouge',
    name: 'Rouge',
    micron: 0.5,
    swatch: 'rgb(var(--burgundy-500))',
    job: 'Iron oxide, half a micron. It does not cut at all — it burnishes, moving metal rather than taking it. The final surface is a smeared one, which is why it is a mirror.',
    skip: 'A good finish that is not a mirror.',
  },
];

interface PolishingLapWheelProps {
  className?: string;
  /** Show the compound switcher and the notes. */
  controls?: boolean;
}

/**
 * A polishing lap, turning, with a piece held against it.
 *
 * The site's craft sections have covered casting, soldering, setting and
 * engraving, and all four of them are things a customer imagines happening.
 * Polishing is the one nobody pictures, and it is where a third of the bench
 * hours on any piece actually go — plus the one operation that can destroy a
 * finished piece in half a second, because a wheel turning at 3,000rpm will
 * snatch a chain out of your hands and wrap it round the spindle before you
 * have finished flinching.
 *
 * Three things are drawn honestly here rather than decoratively:
 *
 *   - The spray leaves on the tangent. Sparks and swarf come off a wheel in the
 *     direction the surface was travelling, not radially, and getting that
 *     wrong is what makes most animated sparks read as fireworks.
 *   - The wheel does not stop when it is let go of. A calico mop has real
 *     inertia and coasts for a long time — which is why guards exist.
 *   - The four compounds run in a fixed order and the panel refuses to imply
 *     otherwise, because that order is the whole craft of finishing.
 */
export default function PolishingLapWheel({
  className = '',
  controls = true,
}: PolishingLapWheelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: '-10% 0px -10% 0px' });
  const [index, setIndex] = useState(0);
  const compound = COMPOUNDS[index];

  // Finer compound, finer and shorter spray. A rouge wheel throws almost
  // nothing, which is one way a bench knows it has reached the last stage.
  const sparkCount = reduced ? 0 : Math.max(4, Math.round(24 / Math.sqrt(compound.micron)));
  const reach = 26 + compound.micron * 1.6;

  return (
    <div ref={ref} className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-canvas-alt px-6 py-10">
        <div className="relative mx-auto flex h-56 w-full max-w-lg items-center justify-center">
          {/* The mop. Its stripes are what make rotation legible; a plain disc
              turning is a disc standing still. */}
          <motion.div
            aria-hidden="true"
            animate={reduced || !inView ? { rotate: 0 } : { rotate: 360 }}
            transition={
              reduced || !inView
                ? { duration: 0 }
                : { duration: 0.9, ease: 'linear', repeat: Infinity }
            }
            className="relative h-44 w-44 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${compound.swatch}, rgb(var(--ink-200)) 8%, ${compound.swatch} 16%, rgb(var(--ink-300)) 24%, ${compound.swatch} 32%, rgb(var(--ink-200)) 40%, ${compound.swatch} 48%, rgb(var(--ink-300)) 56%, ${compound.swatch} 64%, rgb(var(--ink-200)) 72%, ${compound.swatch} 80%, rgb(var(--ink-300)) 88%, ${compound.swatch} 100%)`,
            }}
          >
            <span className="absolute inset-[38%] rounded-full border-2 border-ink-700 bg-ink-900" />
            <span className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_-8px_rgb(var(--shadow-color)/0.7)]" />
          </motion.div>

          {/* The piece, held to the wheel at about four o'clock — which is where
              a polisher actually holds work, below the centre line, so that if
              the wheel snatches it, it throws it down at the bench rather than
              up at the face. */}
          <motion.div
            animate={
              reduced || !inView ? {} : { x: [0, -2, 0, 2, 0], y: [0, 1, 0, -1, 0] }
            }
            transition={{ duration: 0.28, repeat: Infinity }}
            className="absolute right-[18%] top-[58%] z-10 h-12 w-12 rounded-full border-4 border-gold-400 shadow-gold"
          />

          {/* The spray, leaving on the tangent. */}
          {!reduced &&
            inView &&
            Array.from({ length: sparkCount }, (_, i) => {
              // Tangent at four o'clock on a clockwise wheel points up and
              // right; the spread is small because a mop throws a narrow fan.
              const theta = -0.5 + ((i % 5) - 2) * 0.1;
              return (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos(theta) * (reach + (i % 4) * 12),
                    y: -Math.sin(theta) * (reach + (i % 4) * 12),
                    scale: 0.2,
                  }}
                  transition={{
                    duration: 0.42 + (i % 3) * 0.1,
                    delay: (i % 9) * 0.06,
                    repeat: Infinity,
                    repeatDelay: 0.18,
                    ease: 'easeOut',
                  }}
                  className="absolute right-[20%] top-[56%] h-[3px] w-[3px] rounded-full"
                  style={{ background: compound.swatch, boxShadow: `0 0 6px ${compound.swatch}` }}
                />
              );
            })}

          {/* The guard, which is the only part of this machine that has ever
              saved anybody. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[16%] top-[8%] h-24 rounded-t-full border-2 border-b-0 border-ink-700/70"
          />
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
          <span className="nums-instrument text-accent">{compound.micron}µm</span>
          <span>abrasive · stage {index + 1} of {COMPOUNDS.length}</span>
        </div>
      </div>

      {controls && (
        <div className="mt-6">
          {/* Ordered, and it says so. A chip row that could be clicked in any
              order would imply the sequence does not matter, and it is the only
              thing about finishing that does. */}
          <div className="flex flex-wrap items-center gap-2">
            {COMPOUNDS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={index === i}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  index === i
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                <span
                  className="series-swatch"
                  style={{ background: c.swatch }}
                  aria-hidden="true"
                />
                {c.name}
              </button>
            ))}
          </div>

          <motion.div
            key={compound.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 grid gap-4 border-t border-line-subtle pt-5 md:grid-cols-2"
          >
            <p className="font-sans text-sm font-light leading-relaxed text-muted">
              {compound.job}
            </p>
            <p className="font-sans text-sm font-light leading-relaxed text-muted">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Skip it and:{' '}
              </span>
              {compound.skip}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
