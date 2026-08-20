'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Why the ring fitted in the shop and does not fit at home.
 *
 * The site can already measure a finger — `RingSizer` gives the Indian scale
 * against inner diameter in millimetres, which is the static half of the
 * question. This is the half nobody covers, and it is the reason for most
 * resizing work that comes across a bench: a finger is not a fixed size. It
 * changes by a full size and a half across a normal day and a normal year, and
 * every one of the causes below is ordinary.
 *
 * The figures are in *sizes* on the Indian scale, where one size is about
 * 0.4mm of inner diameter. They are conservative clinical ranges rather than
 * anecdote — the temperature effect in particular is much larger than people
 * expect, and it is the single commonest reason a ring bought in an
 * air-conditioned shop in February is tight in June.
 *
 * The output is not a size. It is a *window*, because the honest answer to
 * "what size am I" is a range, and the useful skill is knowing where in that
 * range to sit a particular ring. A wide band needs to sit at the top of the
 * window and a fine one at the middle, which is stated at the foot and is the
 * part that changes what somebody orders.
 */

interface Factor {
  id: string;
  label: string;
  /** Change in sizes. Positive means the finger is larger. */
  delta: number;
  detail: string;
  group: 'day' | 'life';
}

const FACTORS: Factor[] = [
  {
    id: 'cold',
    label: 'Cold hands, or winter',
    delta: -0.75,
    detail:
      'The largest single effect on this list and the one nobody accounts for. Peripheral vessels constrict in the cold, and three quarters of a size is a ring that spins on the finger.',
    group: 'day',
  },
  {
    id: 'heat',
    label: 'Hot weather, or a hot room',
    delta: 0.7,
    detail:
      'The same mechanism in reverse. A ring fitted in January in an air-conditioned showroom is a genuinely different ring in a Mumbai June, and this is why we fit in the afternoon.',
    group: 'day',
  },
  {
    id: 'evening',
    label: 'Late in the day',
    delta: 0.35,
    detail:
      'Fingers swell through the day and are at their largest in the evening. It is why we measure at four in the afternoon rather than at eleven in the morning.',
    group: 'day',
  },
  {
    id: 'exercise',
    label: 'Just after exercise',
    delta: 0.6,
    detail:
      'Blood flow to the extremities rises sharply and stays raised for an hour or so. Do not be measured after walking up to the shop in the heat, which is what almost everybody does.',
    group: 'day',
  },
  {
    id: 'salt',
    label: 'Salt, or a long flight',
    delta: 0.5,
    detail:
      'Fluid retention. A restaurant meal and eight hours in a cabin will both do it, and both resolve within a day.',
    group: 'day',
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy, third trimester',
    delta: 1.5,
    detail:
      'Up to a size and a half, and it does not fully return for some months afterwards. Never resize during or immediately after — wait six months, and in the meantime we will fit a temporary sizing bar for nothing.',
    group: 'life',
  },
  {
    id: 'weight',
    label: 'Weight change of 10kg or more',
    delta: 1,
    detail:
      'Roughly a size per ten kilos, in either direction, and it is the change most likely to be permanent. This is the one where resizing is genuinely the right answer.',
    group: 'life',
  },
  {
    id: 'arthritis',
    label: 'Enlarged knuckle',
    delta: 0,
    detail:
      'A special case that a size cannot express, because the knuckle and the finger below it are now two different measurements. The answer is a hinged shank or a fold-down sizing bar, not a bigger ring — a ring sized to pass the knuckle will spin all day on the finger.',
    group: 'life',
  },
];

/** One Indian size, in millimetres of inner diameter. */
const MM_PER_SIZE = 0.4;

export default function FingerSizeDrift({ className = '' }: { className?: string }) {
  const [base, setBase] = useState(14);
  const [on, setOn] = useState<string[]>([]);
  const [width, setWidth] = useState(3);

  const toggle = (id: string) =>
    setOn((current) =>
      current.includes(id) ? current.filter((v) => v !== id) : [...current, id]
    );

  const drift = useMemo(
    () => FACTORS.filter((f) => on.includes(f.id)).reduce((sum, f) => sum + f.delta, 0),
    [on]
  );

  // A wide band needs to be larger than a fine one at the same finger, because
  // it sits across more of the taper and has less room to pass the knuckle.
  // Half a size per 4mm of width is the bench rule.
  const widthAllowance = Math.max(0, (width - 2) / 8);

  const now = base + drift + widthAllowance;
  // The window is the full spread the finger will actually occupy across a
  // year, not a confidence interval.
  const low = base - 0.75;
  const high = base + 1.05;

  const knuckle = on.includes('arthritis');

  return (
    <div className={className}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div>
          {/* The window, drawn as a rail with the current reading on it. */}
          <div className="chart-surface rounded-2xl p-6">
            <div className="flex items-baseline justify-between">
              <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                Where this finger is right now
              </p>
              <p className="nums-instrument font-display text-3xl text-primary">
                {now.toFixed(2)}
              </p>
            </div>

            <div className="relative mt-8 h-16">
              {/* The year's range. */}
              <div className="absolute inset-x-0 top-6 h-1.5 rounded-full bg-surface-sunken" />
              <div
                className="absolute top-6 h-1.5 rounded-full"
                style={{
                  background: 'rgb(var(--series-1))',
                  left: `${((low - (base - 2)) / 4) * 100}%`,
                  width: `${((high - low) / 4) * 100}%`,
                }}
              />

              {/* The reading. */}
              <motion.div
                className="absolute top-0"
                animate={{ left: `${((now - (base - 2)) / 4) * 100}%` }}
                transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              >
                <div className="-translate-x-1/2">
                  <div className="mark-ring mx-auto h-4 w-4 rounded-full bg-[rgb(var(--series-2))]" />
                  <div className="mx-auto mt-1 h-6 w-px bg-accent/50" />
                </div>
              </motion.div>

              {/* Scale. */}
              <div className="absolute inset-x-0 top-12 flex justify-between">
                {[-2, -1, 0, 1, 2].map((n) => (
                  <span key={n} className="nums-instrument font-accent text-[9px] text-faint">
                    {(base + n).toFixed(0)}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-subtle pt-4">
              <span className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted">
                <span
                  className="series-swatch"
                  style={{ background: 'rgb(var(--series-1))' }}
                  aria-hidden="true"
                />
                The range this finger occupies across a year
              </span>
              <span className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted">
                <span
                  className="series-swatch"
                  style={{ background: 'rgb(var(--series-2))' }}
                  aria-hidden="true"
                />
                Today, under the conditions selected
              </span>
            </div>
          </div>

          {/* The verdict, which is the part that changes an order. */}
          <motion.div
            key={`${knuckle}-${Math.round(drift * 10)}-${width}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 rounded-2xl border border-accent/25 bg-accent/[0.04] p-5"
          >
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              What to order
            </p>
            {knuckle ? (
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                Not a size — a mechanism. With an enlarged knuckle the finger and
                the joint are two different measurements, and any single size is
                either impossible to get on or loose all day. A hinged shank or a
                fold-down sizing bar solves it properly, and both are things we
                fit here. Come in and we will show you one on your own hand
                before you decide.
              </p>
            ) : (
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                Order{' '}
                <span className="nums-instrument text-primary">
                  {(base + widthAllowance + 0.2).toFixed(1)}
                </span>{' '}
                — the middle of the window plus the allowance this{' '}
                <span className="nums-instrument text-primary">{width}mm</span> band
                needs. That will be a shade loose on a cold January morning and
                comfortable for the other eleven months, which is the right way
                round: a ring you can turn is a ring you still own, and a ring
                you cannot get off in July is an emergency.
              </p>
            )}
          </motion.div>
        </div>

        {/* The conditions. */}
        <div>
          <label
            htmlFor="drift-base"
            className="font-accent text-[10px] uppercase tracking-luxe text-muted"
          >
            Your usual size
          </label>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="nums-instrument font-display text-3xl text-primary">{base}</span>
            <span className="nums-instrument font-accent text-xs text-muted">
              {(13.3 + base * MM_PER_SIZE).toFixed(1)}mm inner
            </span>
          </div>
          <input
            id="drift-base"
            type="range"
            min={6}
            max={26}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="range-overlay mt-2 w-full"
          />

          <label
            htmlFor="drift-width"
            className="mt-6 block font-accent text-[10px] uppercase tracking-luxe text-muted"
          >
            Band width
          </label>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="nums-instrument font-display text-3xl text-primary">{width}</span>
            <span className="font-accent text-xs text-muted">mm</span>
          </div>
          <input
            id="drift-width"
            type="range"
            min={1.5}
            max={10}
            step={0.5}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="range-overlay mt-2 w-full"
          />
          <p className="mt-1 font-sans text-xs font-light leading-relaxed text-faint">
            Half a size per four millimetres. A wide band sits across more of the
            finger’s taper and has less room to pass the knuckle, so it has to be
            ordered larger than a fine one on the same hand.
          </p>

          <div className="mt-7 border-t border-line-subtle pt-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              Today
            </p>
            <div className="mt-3 space-y-2">
              {FACTORS.filter((f) => f.group === 'day').map((f) => (
                <FactorRow key={f.id} factor={f} on={on.includes(f.id)} toggle={toggle} />
              ))}
            </div>

            <p className="mt-6 font-accent text-[10px] uppercase tracking-luxe text-muted">
              This year
            </p>
            <div className="mt-3 space-y-2">
              {FACTORS.filter((f) => f.group === 'life').map((f) => (
                <FactorRow key={f.id} factor={f} on={on.includes(f.id)} toggle={toggle} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactorRow({
  factor,
  on,
  toggle,
}: {
  factor: Factor;
  on: boolean;
  toggle: (id: string) => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => toggle(factor.id)}
        aria-pressed={on}
        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors duration-300 ${
          on ? 'border-accent bg-accent/[0.06]' : 'border-hairline hover:border-accent/40'
        }`}
      >
        <span
          className={`font-sans text-sm font-light ${on ? 'text-primary' : 'text-muted'}`}
        >
          {factor.label}
        </span>
        <span
          className={`nums-instrument flex-none font-accent text-[10px] uppercase tracking-luxe ${
            on ? 'text-accent' : 'text-faint'
          }`}
        >
          {factor.delta === 0
            ? '—'
            : `${factor.delta > 0 ? '+' : ''}${factor.delta.toFixed(2)}`}
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="px-3 pb-2 pt-2 font-sans text-xs font-light leading-relaxed text-faint">
          {factor.detail}
        </p>
      </motion.div>
    </div>
  );
}
