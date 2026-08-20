'use client';

import { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type Motif = 'seam' | 'monogram' | 'chevron' | 'vine' | 'grid';

interface StitchPathRevealProps {
  motif?: Motif;
  className?: string;
  /** Seconds for the needle to work the whole motif. */
  duration?: number;
  /** Stitch pitch, in user units. Smaller is a finer hand. */
  pitch?: number;
  /** Colour token for the thread. Any CSS colour. */
  thread?: string;
  children?: React.ReactNode;
}

/**
 * Motifs on a 240 × 240 box. Kept as single paths wherever possible, because a
 * stitch line that jumps between subpaths has to hide the jump and there is
 * nowhere on a flat plane to hide it.
 */
const MOTIFS: Record<Motif, { d: string; label: string }> = {
  seam: { d: 'M 20 120 C 70 60, 170 180, 220 120', label: 'A closing seam' },
  monogram: {
    d: 'M 60 190 L 96 60 L 120 150 L 144 60 L 180 190',
    label: 'A monogram, worked by hand',
  },
  chevron: {
    d: 'M 20 170 L 68 84 L 116 170 L 164 84 L 212 170',
    label: 'Chevron, for a lining edge',
  },
  vine: {
    d: 'M 24 210 C 60 150, 40 110, 84 92 S 150 120, 140 66 S 196 40, 214 78',
    label: 'A vine, for a case interior',
  },
  grid: {
    d: 'M 40 60 L 200 60 M 40 120 L 200 120 M 40 180 L 200 180 M 70 40 L 70 200 M 120 40 L 120 200 L 170 200 M 170 40 L 170 200',
    label: 'Quilting, for the tray bed',
  },
};

/**
 * A motif being stitched, one pass of the needle at a time.
 *
 * The trick that makes this read as thread rather than as a drawn line is that
 * there are *two* strokes on the same path, and they are offset from each other.
 * A real running stitch shows on the face for the length of one stitch and
 * disappears under the cloth for the next, so the visible marks and the gaps
 * between them are the same size — which is exactly a dash array. The second
 * stroke uses the complementary offset and a darker thread, which is the part
 * of the stitch you can see pulling through from the underside.
 *
 * Both are revealed by a third element: a full-length mask stroke whose
 * `strokeDashoffset` runs to zero. So the dashes are the stitch pattern and the
 * mask is the needle's progress, and separating those two jobs is what allows a
 * fine pitch and a slow hand at the same time. Doing it with one stroke forces
 * the pitch and the speed to be the same number.
 */
export default function StitchPathReveal({
  motif = 'seam',
  className = '',
  duration = 2.6,
  pitch = 7,
  thread = 'rgb(var(--gold-300))',
  children,
}: StitchPathRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-16% 0px -16% 0px' });
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const entry = MOTIFS[motif];
  const maskId = `stitch-mask-${uid}`;

  const run = reduced || inView;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg viewBox="0 0 240 240" className="w-full" role="img" aria-label={entry.label}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            {/* The needle's progress. A single wide stroke in white, revealing
                whatever it has already passed over. */}
            <motion.path
              d={entry.d}
              fill="none"
              stroke="#fff"
              strokeWidth={14}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              initial={{ strokeDashoffset: 1 }}
              animate={run ? { strokeDashoffset: 0 } : undefined}
              transition={{ duration: reduced ? 0 : duration, ease: 'easeInOut' }}
            />
          </mask>
        </defs>

        {/* The cloth's own crease, under everything — where the needle will go. */}
        <path
          d={entry.d}
          fill="none"
          stroke="rgb(var(--hairline))"
          strokeOpacity={0.2}
          strokeWidth={1}
          strokeDasharray="1 5"
        />

        <g mask={`url(#${maskId})`}>
          {/* Face stitches. */}
          <path
            d={entry.d}
            fill="none"
            stroke={thread}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeDasharray={`${pitch} ${pitch}`}
          />
          {/* The pull-through, on the complementary offset and darker: the same
              thread seen from under the cloth. */}
          <path
            d={entry.d}
            fill="none"
            stroke="rgb(var(--gold-700))"
            strokeOpacity={0.55}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray={`${pitch} ${pitch}`}
            strokeDashoffset={pitch}
          />
        </g>

        {/* The needle itself: a short bright dash riding the head of the mask.
            Only worth drawing while the pass is running. */}
        {!reduced && (
          <motion.path
            d={entry.d}
            fill="none"
            stroke="rgb(var(--gold-100))"
            strokeWidth={3.4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.015 0.985"
            initial={{ strokeDashoffset: 0.015, opacity: 0 }}
            animate={run ? { strokeDashoffset: -0.985, opacity: [0, 1, 1, 0] } : undefined}
            transition={{
              duration,
              ease: 'easeInOut',
              opacity: { duration, times: [0, 0.05, 0.95, 1], ease: 'linear' },
            }}
          />
        )}
      </svg>

      {children ?? (
        <p className="mt-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
          {entry.label}
        </p>
      )}
    </div>
  );
}
