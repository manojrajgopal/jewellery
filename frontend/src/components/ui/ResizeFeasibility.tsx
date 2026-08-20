'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * Whether a ring can be resized, by how much, and what it costs it.
 *
 * The site already measures fingers and triages damage. This answers the
 * question that sits between those two and gets the wrong answer more often than
 * either: a ring is the wrong size, and every shop says "we can size that" —
 * because almost every shop can, and a meaningful number of them should not.
 *
 * The constraints are structural and they are knowable in advance:
 *
 *  - A shank with stones set into it cannot be cut where the stones are. That
 *    fixes the maximum travel at whatever plain metal exists at the bottom.
 *  - Going *up* stretches or adds metal and thins the shank; going *down*
 *    removes a wedge and thickens nothing. They are not symmetrical operations
 *    and quoting one figure for both is the usual sleight of hand.
 *  - Some materials cannot be soldered at all — titanium, tungsten, and any ring
 *    with a wood, ceramic or resin inlay. For those the answer is not a smaller
 *    number, it is *no*.
 *  - Anything with a full band of stones has a hard ceiling of about one size in
 *    either direction, and beyond that the honest answer is a remake using the
 *    original stones, which is frequently cheaper than three failed attempts.
 *
 * The output is deliberately two numbers and a caveat rather than a yes. A single
 * "resizable: yes" is what produces cracked shanks eighteen months later.
 */
interface Construction {
  id: string;
  name: string;
  /** Sizes up, in UK/US whole sizes. */
  up: number;
  /** Sizes down. */
  down: number;
  /** Null where the metal cannot be worked at all. */
  method: string | null;
  caution: string;
  /** What it does to the piece's structure, 0–1. */
  cost: number;
}

const CONSTRUCTIONS: Construction[] = [
  {
    id: 'plain',
    name: 'Plain band',
    up: 4,
    down: 4,
    method: 'Cut, insert or remove a section, solder, re-finish.',
    caution:
      'Effectively unlimited in either direction. Going up more than about four sizes is still a remake in practice, because the proportions of the original design stop working.',
    cost: 0.1,
  },
  {
    id: 'solitaire',
    name: 'Solitaire, plain shank',
    up: 3,
    down: 3,
    method: 'Cut at the base, away from the head, and re-solder.',
    caution:
      'The safest of all the set pieces — the heat never comes near the stone. We still remove the stone for a diamond over two carats, because the setting relaxes at soldering heat and a loose stone six months later is worse than the cost of resetting it.',
    cost: 0.15,
  },
  {
    id: 'half-set',
    name: 'Half-set shoulders',
    up: 2,
    down: 2,
    method: 'Cut in the plain metal at the base of the shank.',
    caution:
      'The travel is limited by how far the stones come round, not by the metal. Past two sizes the stone spacing at the shoulders visibly changes and the piece looks stretched, which cannot be corrected afterwards.',
    cost: 0.35,
  },
  {
    id: 'full-eternity',
    name: 'Full eternity',
    up: 0,
    down: 0,
    method: null,
    caution:
      'There is nowhere to cut. The only honest options are a remake to the correct size using your own stones, or living with it — and a full eternity ring one size too large will eventually be lost rather than merely annoying.',
    cost: 1,
  },
  {
    id: 'channel',
    name: 'Channel set',
    up: 1,
    down: 1,
    method: 'Cut at the base, then re-true the channel across the join.',
    caution:
      'The channel walls have to stay parallel to a tenth of a millimetre or the stones sit at different heights. One size is genuinely the limit and any bench that offers three is guessing.',
    cost: 0.55,
  },
  {
    id: 'tension',
    name: 'Tension set',
    up: 0,
    down: 0,
    method: null,
    caution:
      'The band is a spring, and the stone is held by its tension. Cutting it destroys the spring, which is the entire setting. These are made to a size and remade to change it.',
    cost: 1,
  },
  {
    id: 'inlay',
    name: 'Inlay — wood, ceramic, resin',
    up: 0,
    down: 0,
    method: null,
    caution:
      'The inlay cannot take soldering heat and cannot be re-cut to a new circumference. Some makers will re-inlay a resized band, which is a remake of the visible half of the ring.',
    cost: 1,
  },
  {
    id: 'titanium',
    name: 'Titanium or tungsten',
    up: 0,
    down: 0,
    method: null,
    caution:
      'Titanium can be stretched a fraction of a size on a mandrel and nothing more; tungsten carbide is a ceramic and will shatter rather than move. This is the limitation nobody is told at the point of sale.',
    cost: 1,
  },
  {
    id: 'engraved',
    name: 'Hand-engraved band',
    up: 1,
    down: 2,
    method: 'Cut and re-solder, then re-cut the engraving across the join.',
    caution:
      'Sizing down is easier than up: removing metal loses one repeat of the pattern, adding metal leaves a plain gap that has to be engraved to match a hand that may not be at this bench any more.',
    cost: 0.5,
  },
  {
    id: 'vintage',
    name: 'Vintage, pre-1940',
    up: 1,
    down: 1,
    method: 'Cut and solder, with the whole piece annealed first.',
    caution:
      'Old gold is work-hardened and often has previous repairs in it that only show under heat. We will always quote a resize on an antique piece as an inspection first — perhaps one in six turns out to need the repair before it can take the resize.',
    cost: 0.7,
  },
];

const SIZE_MM = 0.82; // Circumference change per whole size, in mm of diameter.

export default function ResizeFeasibility() {
  const [id, setId] = useState('half-set');
  const [wanted, setWanted] = useState(2);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const reduced = useReducedMotion();

  const c = CONSTRUCTIONS.find((x) => x.id === id)!;
  const allowed = direction === 'up' ? c.up : c.down;
  const possible = c.method !== null && wanted <= allowed;

  const verdict = useMemo(() => {
    if (c.method === null)
      return {
        label: 'Not resizable',
        tone: 'burgundy' as const,
        line: 'Remade to size, using your stones.',
      };
    if (wanted <= allowed)
      return {
        label: 'Within the bench limit',
        tone: 'jade' as const,
        line: `${wanted} size${wanted === 1 ? '' : 's'} ${direction} is routine on this construction.`,
      };
    if (wanted <= allowed + 1)
      return {
        label: 'Past the limit',
        tone: 'gold' as const,
        line: 'Possible, and the piece will show it. We would rather remake.',
      };
    return {
      label: 'Refused',
      tone: 'burgundy' as const,
      line: 'We will not do this one. A remake costs less than the repair afterwards.',
    };
  }, [c.method, wanted, allowed, direction]);

  const tones = {
    jade: 'border-jade-500/40 text-jade-500',
    gold: 'border-accent/40 text-accent',
    burgundy: 'border-burgundy-500/40 text-burgundy-500',
  } as const;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:gap-14">
        {/* ---- Construction ---- */}
        <div>
          <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
            How the ring is made
          </p>
          <ul className="space-y-2">
            {CONSTRUCTIONS.map((x) => {
              const on = x.id === id;
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => setId(x.id)}
                    aria-pressed={on}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors duration-300 ${
                      on ? 'border-accent/60 bg-accent/5' : 'border-hairline hover:border-accent/40'
                    }`}
                  >
                    <span className="font-display text-base text-primary">{x.name}</span>
                    <span className="nums-instrument shrink-0 font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {x.method === null ? 'fixed' : `±${Math.max(x.up, x.down)}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---- The travel, drawn ---- */}
        <div>
          <div className="flex gap-2" role="radiogroup" aria-label="Direction">
            {(['up', 'down'] as const).map((d) => {
              const on = direction === d;
              const Icon = d === 'up' ? ArrowUp : ArrowDown;
              return (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDirection(d)}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                    on
                      ? 'border-accent bg-accent text-onaccent'
                      : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  Size {d}
                </button>
              );
            })}
          </div>

          <label className="mt-6 block">
            <span className="flex items-baseline justify-between">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Sizes {direction}
              </span>
              <span className="nums-instrument font-display text-2xl text-primary">{wanted}</span>
            </span>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={wanted}
              onChange={(e) => setWanted(Number(e.target.value))}
              className="mt-3 w-full accent-[rgb(var(--accent))]"
            />
          </label>

          {/* The band, in section. The wedge being added or removed is drawn to
              scale against the shank — which is the fact that makes people
              understand why three sizes on a set shoulder is not a small ask. */}
          <div className="mt-8 rounded-2xl border border-hairline bg-surface-sunken/50 p-6">
            <svg viewBox="0 0 220 150" className="w-full" role="img" aria-label="Ring in section, showing the metal added or removed">
              {/* The band */}
              <circle
                cx={110}
                cy={72}
                r={52}
                fill="none"
                stroke="rgb(var(--gold-500))"
                strokeOpacity={0.75}
                strokeWidth={10}
              />
              {/* The head, so it is obvious where the bench cannot cut */}
              <path
                d="M 96 20 L 124 20 L 118 34 L 102 34 Z"
                fill="rgb(var(--gold-300))"
                fillOpacity={0.7}
              />
              {/* Stones round the shoulders, as far as this construction sets them */}
              {Array.from({ length: 9 }, (_, i) => {
                const spread = c.id === 'full-eternity' ? 1 : c.id === 'plain' ? 0 : c.id === 'solitaire' ? 0 : 0.42;
                if (spread === 0) return null;
                const a = -Math.PI / 2 + (i - 4) * 0.32 * spread * 2;
                return (
                  <circle
                    key={i}
                    cx={110 + Math.cos(a) * 52}
                    cy={72 + Math.sin(a) * 52}
                    r={3.4}
                    fill="rgb(var(--diamond))"
                    fillOpacity={0.9}
                  />
                );
              })}

              {/* The cut, at the base, and the wedge. Scaled from the real
                  per-size diameter change so the drawing is not a cartoon. */}
              {c.method !== null && (
                <motion.g
                  key={`${wanted}-${direction}`}
                  initial={reduced ? false : { opacity: 0, scaleY: 0.4 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.55, ease: easeCine.catch }}
                  style={{ transformOrigin: '110px 124px' }}
                >
                  <rect
                    x={110 - (wanted * SIZE_MM * 3.4) / 2}
                    y={116}
                    width={wanted * SIZE_MM * 3.4}
                    height={16}
                    rx={1}
                    fill={
                      direction === 'up'
                        ? 'rgb(var(--jade-500))'
                        : 'rgb(var(--burgundy-500))'
                    }
                    fillOpacity={0.75}
                  />
                  <text
                    x={110}
                    y={146}
                    textAnchor="middle"
                    className="font-accent"
                    fill="rgb(var(--text-faint))"
                    fontSize={9}
                    letterSpacing={2}
                  >
                    {direction === 'up' ? 'ADDED' : 'REMOVED'} {(wanted * SIZE_MM * 3.14).toFixed(1)} MM
                  </text>
                </motion.g>
              )}
            </svg>
          </div>

          {/* The verdict, and the structural cost of getting it. */}
          <div className={`mt-6 rounded-xl border p-5 ${tones[verdict.tone]}`}>
            <p className="font-accent text-[10px] uppercase tracking-luxe">{verdict.label}</p>
            <p className="mt-2 font-display text-xl text-primary">{verdict.line}</p>

            {c.method && (
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
                <span className="text-primary">Method. </span>
                {c.method}
              </p>
            )}

            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
              {c.caution}
            </p>

            {/* What it costs the piece, as distinct from what it costs you. */}
            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                  Structural cost to the piece
                </span>
                <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-primary">
                  {Math.round((possible ? c.cost : 1) * 100)}%
                </span>
              </div>
              <span className="mt-2 block h-1 rounded-full bg-line/50">
                <motion.span
                  className="block h-full rounded-full bg-accent"
                  initial={false}
                  animate={{ width: `${(possible ? c.cost : 1) * 100}%` }}
                  transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeCine.glass }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 border-t border-hairline pt-6 font-sans text-sm font-light leading-relaxed text-muted">
        We size any ring we made, once, at no charge, in the first year — and we will tell you before
        you buy if the design you have chosen is one that cannot be sized later. That conversation
        happens at the counter here rather than at the bench in five years, which is the only
        difference between a ring that fits and a ring in a drawer.
      </p>
    </div>
  );
}
