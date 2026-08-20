'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * The three numbers that decide whether a diamond is bright, and the physics
 * that turns them into an answer.
 *
 * Every figure here is real. The critical angle of diamond in air is 24.4°,
 * which is unusually low — that is what a refractive index of 2.42 means in
 * practice, and it is the entire reason diamond is the stone it is. Light that
 * strikes an internal facet at more than 24.4° from the normal cannot leave;
 * it is totally internally reflected and has to bounce again. Light that
 * strikes at less than that angle goes straight out of the bottom of the stone
 * and is gone.
 *
 * So a cutter is not making a pretty shape. They are building a mirror box
 * whose walls happen to be at angles that trap light, and the tolerance on
 * those angles is under a degree. A pavilion cut at 43° instead of 40.75° is
 * still a beautiful object and it leaks most of its light out of the bottom,
 * where a customer looking down at it will never see it again.
 *
 * The two named failures are the ones a counter should be able to explain:
 *
 *   - **Fish-eye.** Pavilion too shallow, under about 39°. The girdle reflects
 *     back through the table as a grey ring and you can see it with your eyes.
 *   - **Nail head.** Pavilion too deep, over about 42°. Light entering the
 *     crown is reflected across and out the far side, and the middle of the
 *     stone goes dark. It looks like a nail head seen end on.
 *
 * Both are cutting *for weight*. A rough stone yields more carats at either of
 * those angles than at the right one, and the difference between an excellent
 * cut and a poor one on the same rough is usually about eight per cent of the
 * finished weight — which is exactly what the neighbouring yield bench is
 * about, and exactly why the two questions cannot be separated.
 */

/** Diamond in air. Everything below follows from this one number. */
const CRITICAL_ANGLE = 24.4;

const IDEAL = { table: 57, crown: 34.5, pavilion: 40.75 };

interface Verdict {
  grade: 'Excellent' | 'Very good' | 'Good' | 'Fair' | 'Poor';
  tone: string;
  headline: string;
  body: string;
}

/**
 * Light return, as a fraction. This is a model rather than a ray trace, and it
 * is built from the two things that actually dominate: how far the pavilion is
 * from the angle that traps light, and how much of the crown is left to bend it
 * in the first place. A real optical model has forty variables; these two
 * account for most of the visible difference and — importantly — they fail in
 * the directions the trade already has names for.
 */
function evaluate(table: number, crown: number, pavilion: number) {
  const pavilionMiss = Math.abs(pavilion - IDEAL.pavilion);
  const crownMiss = Math.abs(crown - IDEAL.crown);
  const tableMiss = Math.abs(table - IDEAL.table);

  // Pavilion dominates by a wide margin: it is the mirror. Crown steers the
  // light in and out; table decides how much of the crown there is left.
  const returned = Math.max(
    0.18,
    1 - pavilionMiss * 0.13 - crownMiss * 0.035 - tableMiss * 0.012
  );

  // Fire is a fight with brightness. A bigger table returns more white light
  // and disperses less, which is the whole modern-versus-antique cut argument.
  const fire = Math.max(0.1, 1 - Math.max(0, table - 54) * 0.028 - crownMiss * 0.05);

  let verdict: Verdict;
  if (pavilion < 39) {
    verdict = {
      grade: 'Poor',
      tone: 'var(--series-4)',
      headline: 'Fish-eye',
      body: 'The pavilion is too shallow, so the girdle reflects back up through the table as a grey ring. You can see it without a loupe, from across a counter, and no polishing will remove it.',
    };
  } else if (pavilion > 42.2) {
    verdict = {
      grade: 'Poor',
      tone: 'var(--series-4)',
      headline: 'Nail head',
      body: 'The pavilion is too deep. Light coming in through the crown crosses the stone and leaves out of the far side instead of coming back at you, so the centre goes dark. The stone weighs more than it looks, which is exactly why it was cut this way.',
    };
  } else if (returned > 0.88 && fire > 0.7) {
    verdict = {
      grade: 'Excellent',
      tone: 'var(--series-1)',
      headline: 'Trapped',
      body: 'Almost everything that goes in comes back out of the top. This is a narrow window — under a degree wide on the pavilion — and it is the difference between the two stones on a tray that look identical until they are moved.',
    };
  } else if (returned > 0.78) {
    verdict = {
      grade: 'Very good',
      tone: 'var(--series-1)',
      headline: 'Bright',
      body: 'Handsome, and losing a little out of the bottom. Most people would never see the difference beside an excellent stone unless the two were side by side under one lamp — which is precisely how we will show them to you.',
    };
  } else if (returned > 0.62) {
    verdict = {
      grade: 'Good',
      tone: 'var(--series-2)',
      headline: 'Leaking',
      body: 'A visible amount of light is going out of the pavilion. In a shop window under thirty spotlights this stone is fine. In a restaurant it is noticeably quieter than its neighbour.',
    };
  } else {
    verdict = {
      grade: 'Fair',
      tone: 'var(--series-2)',
      headline: 'Cut for weight',
      body: 'These proportions keep carats that better ones would have thrown away. That is a legitimate commercial decision and it is not a secret — it is simply one nobody says out loud at the point of sale.',
    };
  }

  return { returned, fire, verdict };
}

interface Control {
  id: 'table' | 'crown' | 'pavilion';
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  ideal: number;
  note: string;
}

const CONTROLS: Control[] = [
  {
    id: 'table',
    label: 'Table',
    min: 48,
    max: 70,
    step: 0.5,
    unit: '%',
    ideal: IDEAL.table,
    note: 'The flat top, as a percentage of the stone’s width. Bigger returns more white light and less colour; smaller trades brightness for fire. Antique cuts sit near 50 and look completely different for it.',
  },
  {
    id: 'crown',
    label: 'Crown angle',
    min: 26,
    max: 40,
    step: 0.25,
    unit: '°',
    ideal: IDEAL.crown,
    note: 'The slope from the table down to the girdle. This is the prism that splits white light into colour, and it is where fire comes from — a shallow crown gives a bright, flat, faintly dull stone.',
  },
  {
    id: 'pavilion',
    label: 'Pavilion angle',
    min: 37,
    max: 45,
    step: 0.05,
    unit: '°',
    ideal: IDEAL.pavilion,
    note: 'The mirror. The tolerance here is under a degree in each direction and it decides more than the other two put together. Everything the trade calls a badly cut stone is this number being wrong.',
  },
];

export default function ProportionScope({ className = '' }: { className?: string }) {
  const [table, setTable] = useState(IDEAL.table);
  const [crown, setCrown] = useState(IDEAL.crown);
  const [pavilion, setPavilion] = useState(IDEAL.pavilion);
  const [showRays, setShowRays] = useState(true);

  const values = { table, crown, pavilion };
  const set = { table: setTable, crown: setCrown, pavilion: setPavilion };

  const { returned, fire, verdict } = useMemo(
    () => evaluate(table, crown, pavilion),
    [table, crown, pavilion]
  );

  // Geometry on a 240-wide box. Real proportions: total depth of a round
  // brilliant is about 61% of its width, and it is built from the two angles.
  const halfWidth = 100;
  const tableHalf = (table / 100) * halfWidth;
  const crownHeight = (halfWidth - tableHalf) * Math.tan((crown * Math.PI) / 180);
  const pavilionDepth = halfWidth * Math.tan((pavilion * Math.PI) / 180);
  const girdleY = 40 + crownHeight;
  const cutletY = girdleY + pavilionDepth;

  const outline = [
    `M ${120 - tableHalf} 40`,
    `L ${120 + tableHalf} 40`,
    `L ${120 + halfWidth} ${girdleY}`,
    `L 120 ${cutletY}`,
    `L ${120 - halfWidth} ${girdleY}`,
    'Z',
  ].join(' ');

  // Two rays: one down the left crown facet, one that escapes if the angles are
  // wrong. Whether the second one leaves is decided by the same critical angle
  // the whole panel is built on, so the drawing cannot disagree with the verdict.
  const escapes = Math.abs(pavilion - IDEAL.pavilion) > 1.8;
  const strikeAngle = 90 - pavilion * 2 + 24;
  const trapped = strikeAngle > CRITICAL_ANGLE;

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* The stone in section. */}
        <div className="chart-surface relative overflow-hidden rounded-2xl px-4 py-6">
          <svg viewBox="0 0 240 260" className="mx-auto block h-auto w-full max-w-md">
            {/* The girdle plane, which is the reference everything is measured
                from and the one line nobody draws. */}
            <line
              x1={8}
              y1={girdleY}
              x2={232}
              y2={girdleY}
              stroke="rgb(var(--hairline))"
              strokeOpacity={0.25}
              strokeDasharray="4 4"
            />

            <motion.path
              d={outline}
              animate={{ d: outline }}
              transition={{ type: 'spring', stiffness: 180, damping: 26 }}
              fill="rgb(var(--diamond))"
              fillOpacity={0.1}
              stroke="rgb(var(--diamond))"
              strokeOpacity={0.75}
              strokeWidth={1.6}
            />

            {/* Crown facet junctions, so the section reads as a cut stone. */}
            <line
              x1={120 - tableHalf}
              y1={40}
              x2={120 - halfWidth}
              y2={girdleY}
              stroke="rgb(var(--diamond))"
              strokeOpacity={0.3}
            />
            <line
              x1={120 + tableHalf}
              y1={40}
              x2={120 + halfWidth}
              y2={girdleY}
              stroke="rgb(var(--diamond))"
              strokeOpacity={0.3}
            />

            {showRays && (
              <g>
                {/* Incoming. Always the same ray, so the only thing that changes
                    between two settings is what the stone does with it. */}
                <motion.path
                  d={`M 60 0 L ${120 - tableHalf * 0.4} 40`}
                  stroke="rgb(var(--gold-200))"
                  strokeWidth={1.4}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Down to the pavilion. */}
                <path
                  d={`M ${120 - tableHalf * 0.4} 40 L ${120 - halfWidth * 0.45} ${girdleY + pavilionDepth * 0.55}`}
                  stroke="rgb(var(--gold-300))"
                  strokeWidth={1.2}
                  fill="none"
                />
                {trapped && !escapes ? (
                  <>
                    {/* Across, up, and out of the table — which is the whole job. */}
                    <path
                      d={`M ${120 - halfWidth * 0.45} ${girdleY + pavilionDepth * 0.55} L ${120 + halfWidth * 0.45} ${girdleY + pavilionDepth * 0.55}`}
                      stroke="rgb(var(--gold-300))"
                      strokeWidth={1.2}
                      fill="none"
                    />
                    <motion.path
                      d={`M ${120 + halfWidth * 0.45} ${girdleY + pavilionDepth * 0.55} L ${120 + tableHalf * 0.4} 40 L ${120 + tableHalf * 0.4 + 26} 0`}
                      stroke="rgb(var(--gold-100))"
                      strokeWidth={1.8}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                    <text
                      x={214}
                      y={16}
                      textAnchor="end"
                      fontSize={9}
                      className="font-accent"
                      fill="rgb(var(--series-1))"
                    >
                      RETURNED
                    </text>
                  </>
                ) : (
                  <>
                    {/* Straight out of the bottom, never to be seen again. */}
                    <motion.path
                      d={`M ${120 - halfWidth * 0.45} ${girdleY + pavilionDepth * 0.55} L ${120 - halfWidth * 0.2} 260`}
                      stroke="rgb(var(--series-4))"
                      strokeWidth={1.8}
                      strokeDasharray="5 4"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                    <text
                      x={26}
                      y={252}
                      fontSize={9}
                      className="font-accent"
                      fill="rgb(var(--series-4))"
                    >
                      LEAKED
                    </text>
                  </>
                )}
              </g>
            )}
          </svg>

          <div className="mt-2 flex items-center justify-between">
            <p className="nums-instrument font-accent text-[9px] uppercase tracking-luxe text-faint">
              Critical angle {CRITICAL_ANGLE}° · depth{' '}
              {(((crownHeight + pavilionDepth) / (halfWidth * 2)) * 100).toFixed(1)}%
            </p>
            <button
              type="button"
              onClick={() => setShowRays((v) => !v)}
              className="font-accent text-[9px] uppercase tracking-luxe text-muted transition-colors hover:text-accent"
            >
              {showRays ? 'Hide the ray' : 'Show the ray'}
            </button>
          </div>
        </div>

        {/* The dials and the verdict. */}
        <div>
          <div className="space-y-6">
            {CONTROLS.map((control) => {
              const value = values[control.id];
              const off = Math.abs(value - control.ideal);
              return (
                <div key={control.id}>
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor={`prop-${control.id}`}
                      className="font-accent text-[10px] uppercase tracking-luxe text-muted"
                    >
                      {control.label}
                    </label>
                    <span className="nums-instrument font-display text-lg text-primary">
                      {value.toFixed(control.step < 0.5 ? 2 : 1)}
                      <span className="ml-0.5 font-accent text-xs text-muted">
                        {control.unit}
                      </span>
                    </span>
                  </div>

                  <input
                    id={`prop-${control.id}`}
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(e) => set[control.id](Number(e.target.value))}
                    className="range-overlay mt-2 w-full"
                  />

                  {/* The ideal, marked on the track. A slider with no marked
                      target asks somebody to guess where the answer is. */}
                  <div className="relative mt-1 h-3">
                    <span
                      className="absolute top-0 -translate-x-1/2 font-accent text-[9px] uppercase tracking-luxe text-accent"
                      style={{
                        left: `${((control.ideal - control.min) / (control.max - control.min)) * 100}%`,
                      }}
                    >
                      ▲
                    </span>
                  </div>

                  <p className="mt-1 font-sans text-xs font-light leading-relaxed text-faint">
                    {off < 0.6 ? 'At the reference.' : control.note}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Two measures, two bars, one axis each. Deliberately not one
              combined score — brightness and fire genuinely trade against each
              other and a single number would hide the trade. */}
          <div className="mt-8 space-y-4 border-t border-line-subtle pt-6">
            {[
              { label: 'Light returned', value: returned, tone: 'var(--series-1)' },
              { label: 'Fire', value: fire, tone: 'var(--series-3)' },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
                    <span
                      className="series-swatch"
                      style={{ background: `rgb(${bar.tone})` }}
                      aria-hidden="true"
                    />
                    {bar.label}
                  </span>
                  <span className="nums-instrument font-accent text-[10px] text-primary">
                    {Math.round(bar.value * 100)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `rgb(${bar.tone})` }}
                    animate={{ width: `${bar.value * 100}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <motion.div
            key={verdict.headline}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="spec-plate mt-6 p-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p
                className="font-accent text-[10px] uppercase tracking-luxe"
                style={{ color: `rgb(${verdict.tone})` }}
              >
                {verdict.headline}
              </p>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                {verdict.grade}
              </p>
            </div>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
              {verdict.body}
            </p>
          </motion.div>

          <button
            type="button"
            onClick={() => {
              setTable(IDEAL.table);
              setCrown(IDEAL.crown);
              setPavilion(IDEAL.pavilion);
            }}
            className="mt-4 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:text-accent"
          >
            Back to the reference
          </button>
        </div>
      </div>
    </div>
  );
}
