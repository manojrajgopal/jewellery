'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Ruler } from 'lucide-react';

interface Length {
  id: string;
  name: string;
  /** Inches. The trade names are defined by these figures, not the reverse. */
  inches: number;
  cm: number;
  /** Where the chain sits on the silhouette, as a fraction of its height. */
  drop: number;
  /** Radius of the loop at that drop, in silhouette units. */
  spread: number;
  sits: string;
  best: string;
}

/**
 * The six trade lengths. The names are not decorative — a "princess" is 18 inches
 * by definition, and a customer who has been told they want a princess needs to
 * see where 18 inches actually lands before they order one.
 */
const LENGTHS: Length[] = [
  {
    id: 'collar',
    name: 'Collar',
    inches: 13,
    cm: 33,
    drop: 0.29,
    spread: 30,
    sits: 'Tight around the base of the neck',
    best: 'Chokers and kundan collars. Wants an open neckline.',
  },
  {
    id: 'choker',
    name: 'Choker',
    inches: 16,
    cm: 41,
    drop: 0.35,
    spread: 34,
    sits: 'At the base of the throat',
    best: 'The most flattering length on most necks, and the hardest to size.',
  },
  {
    id: 'princess',
    name: 'Princess',
    inches: 18,
    cm: 46,
    drop: 0.43,
    spread: 40,
    sits: 'Just below the collarbone',
    best: 'The default for a pendant. Works with almost any neckline.',
  },
  {
    id: 'matinee',
    name: 'Matinee',
    inches: 22,
    cm: 56,
    drop: 0.54,
    spread: 46,
    sits: 'Between the collarbone and the bust',
    best: 'Daywear, and the length that suits a high neckline.',
  },
  {
    id: 'opera',
    name: 'Opera',
    inches: 30,
    cm: 76,
    drop: 0.68,
    spread: 52,
    sits: 'At or below the bust',
    best: 'Long pearls. Can be doubled into a two-strand choker.',
  },
  {
    id: 'rope',
    name: 'Rope',
    inches: 40,
    cm: 102,
    drop: 0.82,
    spread: 56,
    sits: 'Below the bust, at the waist when doubled',
    best: 'Knotted, doubled or trebled. The most versatile piece you can own.',
  },
];

/**
 * Where each chain length actually sits, drawn on a silhouette.
 *
 * The problem this solves is that necklace lengths are sold by a trade name and
 * bought by where the visitor imagines the chain will fall — and those two things
 * routinely disagree by three inches. A drawing settles it in a second.
 *
 * All six loops are rendered at once and the selected one is brought forward,
 * rather than swapping a single loop in and out. Seeing 18 inches *relative to* 22
 * and 30 is the whole point; showing one length in isolation just moves the
 * guesswork rather than removing it.
 *
 * The silhouette is a neutral bust drawn as a path, not a photograph or an
 * illustrated figure. A specific body in the drawing invites the visitor to
 * measure themselves against it, which is not what the guide is for.
 */
export default function NecklaceLengthGuide({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [active, setActive] = useState('princess');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const current = LENGTHS.find((l) => l.id === active) ?? LENGTHS[2];

  // Silhouette box. 200 × 260 keeps the bust in proportion without cropping the rope.
  const W = 200;
  const H = 260;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-6 backdrop-blur-xl md:p-8 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />

      <header className="relative mb-7 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-accent">
            <Ruler size={16} strokeWidth={1.7} />
          </span>
          <div>
            <h3 className="font-display text-xl font-light text-primary md:text-2xl">
              Chain Lengths
            </h3>
            <p className="mt-0.5 font-sans text-[11px] font-light text-muted">
              Where each trade length actually falls.
            </p>
          </div>
        </div>

        {/* Unit toggle. Both are in circulation; neither is the obvious default. */}
        <div className="flex overflow-hidden rounded-full border border-hairline">
          {(['in', 'cm'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              aria-pressed={unit === u}
              className={`px-3.5 py-1.5 font-accent text-[9px] uppercase tracking-luxe transition-colors duration-300 ${
                unit === u ? 'bg-accent text-onaccent' : 'text-muted hover:text-accent'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </header>

      <div className="relative grid gap-8 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-10">
        {/* ---- Silhouette ---- */}
        <div className="relative mx-auto w-full max-w-[15rem]">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
            <defs>
              <linearGradient id={`bust-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--surface-raised))" />
                <stop offset="100%" stopColor="rgb(var(--surface-sunken))" />
              </linearGradient>
              <linearGradient id={`chain-${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(var(--gold-700))" />
                <stop offset="50%" stopColor="rgb(var(--gold-200))" />
                <stop offset="100%" stopColor="rgb(var(--gold-700))" />
              </linearGradient>
            </defs>

            {/* Neck and shoulders */}
            <path
              d={`M 100 6
                  C 116 6 124 18 124 34
                  C 124 48 118 56 116 62
                  C 140 68 168 84 178 116
                  C 186 142 190 200 192 ${H}
                  L 8 ${H}
                  C 10 200 14 142 22 116
                  C 32 84 60 68 84 62
                  C 82 56 76 48 76 34
                  C 76 18 84 6 100 6 Z`}
              fill={`url(#bust-${uid})`}
              stroke="rgb(var(--hairline) / 0.16)"
              strokeWidth="1"
            />

            {/* Collarbone, so the drops have something to be read against */}
            <path
              d="M 44 92 C 68 84 132 84 156 92"
              fill="none"
              stroke="rgb(var(--hairline) / 0.14)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />

            {/* Every length, drawn together */}
            {LENGTHS.map((len) => {
              const on = len.id === active;
              const y = len.drop * H;
              return (
                <g key={len.id}>
                  {/* The chain, as an arc hanging from the neck */}
                  <motion.path
                    d={`M 78 60 C ${100 - len.spread} ${y - 14}, ${100 + len.spread} ${y - 14}, 122 60`}
                    fill="none"
                    stroke={on ? `url(#chain-${uid})` : 'rgb(var(--hairline))'}
                    strokeOpacity={on ? 1 : 0.22}
                    strokeWidth={on ? 2.6 : 1.2}
                    strokeLinecap="round"
                    animate={{ pathLength: 1 }}
                    initial={{ pathLength: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {/* Pendant at the lowest point */}
                  {on && (
                    <motion.g
                      initial={{ opacity: 0, y: -8, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    >
                      <circle
                        cx="100"
                        cy={y - 12}
                        r="5"
                        fill="rgb(var(--gold-300))"
                        className="svg-center animate-facet-glint"
                      />
                      <circle
                        cx="100"
                        cy={y - 12}
                        r="9"
                        fill="none"
                        stroke="rgb(var(--gold-400))"
                        strokeOpacity="0.35"
                        className="svg-center animate-pulse-ring"
                      />
                    </motion.g>
                  )}
                </g>
              );
            })}

            {/* Measurement rule down the right edge */}
            <line
              x1="196"
              x2="196"
              y1="58"
              y2={current.drop * H - 10}
              stroke="rgb(var(--accent))"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            <motion.text
              key={current.id}
              x="192"
              y={(58 + current.drop * H) / 2}
              textAnchor="end"
              fill="rgb(var(--accent))"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 192 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.08em',
              }}
            >
              {unit === 'in' ? `${current.inches}"` : `${current.cm}cm`}
            </motion.text>
          </svg>
        </div>

        {/* ---- Lengths ---- */}
        <div className="flex flex-col">
          <ul className="flex flex-col gap-1.5">
            {LENGTHS.map((len) => {
              const on = len.id === active;
              return (
                <li key={len.id}>
                  <button
                    onClick={() => setActive(len.id)}
                    aria-pressed={on}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-400 ${
                      on
                        ? 'border-gold-500/50 bg-gold-500/[0.07]'
                        : 'border-hairline hover:border-gold-500/35'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span
                        className={`font-accent text-[11px] uppercase tracking-luxe transition-colors ${
                          on ? 'text-accent' : 'text-secondary'
                        }`}
                      >
                        {len.name}
                      </span>
                      <span className="nums-tabular flex-shrink-0 font-sans text-xs font-light text-muted">
                        {unit === 'in' ? `${len.inches}"` : `${len.cm} cm`}
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2 font-sans text-xs font-light leading-relaxed text-muted">
                            {len.sits}.
                          </p>
                          <p className="mt-1.5 font-sans text-[11px] font-light italic leading-relaxed text-faint">
                            {len.best}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 font-sans text-[10px] font-light italic leading-relaxed text-faint">
            Measure with a soft tape where you want the piece to fall, then add nothing —
            these figures are the full circumference of the chain, clasp included. Our
            bench adjusts any length free of charge within the first year.
          </p>
        </div>
      </div>
    </div>
  );
}
