'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Ruler } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * The four things worn on a wrist, and the allowance each one needs over the
 * wrist's own measurement.
 *
 * `ease` is in millimetres and it is the whole content of this component. It is
 * not a comfort preference — it is a structural requirement that differs by an
 * order of magnitude between styles, and getting it wrong is why so many
 * bracelets sit in drawers. A tennis bracelet with a bangle's allowance spins
 * upside down; a bangle with a tennis bracelet's allowance will not pass the
 * hand at all.
 */
interface Style {
  id: string;
  name: string;
  kind: 'flexible' | 'rigid';
  /** Millimetres added to the wrist circumference. */
  ease: number;
  /** Range of acceptable ease, for the fit band. */
  range: [number, number];
  why: string;
  /** The failure mode when it is wrong. */
  wrong: string;
}

const STYLES: Style[] = [
  {
    id: 'tennis',
    name: 'Tennis bracelet',
    kind: 'flexible',
    ease: 10,
    range: [8, 13],
    why:
      'Set stones all the way round, so it has to turn freely — a tennis bracelet that cannot rotate wears its own clasp against the wrist bone.',
    wrong:
      'Too loose and it hangs stones-down, which is the single most common complaint about tennis bracelets and is a sizing fault rather than a design one.',
  },
  {
    id: 'chain',
    name: 'Chain bracelet',
    kind: 'flexible',
    ease: 16,
    range: [12, 22],
    why:
      'Meant to drape. The extra length is what lets it fall to one side of the wrist and sit against the flat of the arm rather than on the bone.',
    wrong:
      'Too tight and it reads as a watch strap. This is the one style where erring generous is genuinely better.',
  },
  {
    id: 'bangle',
    name: 'Rigid bangle',
    kind: 'rigid',
    ease: 0,
    range: [-2, 4],
    why:
      'Sized to pass the hand, not the wrist — so the measurement that matters is across the knuckles with the thumb tucked in, and it is usually 15 to 25mm larger than the wrist.',
    wrong:
      'A bangle sized to the wrist cannot be got on. A bangle sized generously to the hand spins and knocks. Neither can be adjusted afterwards without cutting it.',
  },
  {
    id: 'cuff',
    name: 'Open cuff',
    kind: 'rigid',
    ease: -14,
    range: [-20, -8],
    why:
      'The gap does the work. A cuff is deliberately smaller than the wrist and springs on through the opening, which is why it stays where it is put.',
    wrong:
      'Too large and it slides down to the hand. Too small and it will be sprung open repeatedly, which work-hardens the metal until it cracks at the shoulders.',
  },
  {
    id: 'watch',
    name: 'Watch bracelet',
    kind: 'flexible',
    ease: 12,
    range: [10, 15],
    why:
      'Has to hold a case flat against the top of the wrist without pinching. Tighter than a chain and looser than a tennis bracelet.',
    wrong:
      'A watch is the one thing on the wrist that should not move. Anything above 15mm of ease and the case rolls to the side of the arm.',
  },
];

/** How to measure, since a wrong measurement makes everything below wrong. */
const METHOD = [
  'Wrap a strip of paper round the wrist bone, snug but not compressing.',
  'Mark where it overlaps and measure the strip flat, in millimetres.',
  'For a bangle only: measure again across the knuckles with the thumb folded into the palm. Use the larger figure.',
  'Do it at the end of the day. A wrist is measurably larger in the evening and in the heat.',
];

/**
 * Wrist sizing, which is four different problems wearing one name.
 *
 * The site already sizes rings by diameter and necklaces by where they fall.
 * The wrist is the gap, and it is the one that most needs explaining, because
 * unlike a ring size there is no single number: the same 165mm wrist wants a
 * 175mm tennis bracelet, a 181mm chain, a bangle sized to the *hand* rather than
 * the wrist entirely, and a cuff that is deliberately 14mm smaller than the
 * wrist it goes on.
 *
 * So the output is not one figure but five, side by side, each with the reason
 * for the allowance and the specific failure that follows from getting it wrong.
 * The drawing is drawn to the computed circumference rather than to a fixed
 * illustration, so the ring on screen genuinely grows and shrinks with the
 * number in the field.
 */
export default function WristFitCalculator({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [wrist, setWrist] = useState(165);
  const [hand, setHand] = useState(185);
  const [styleId, setStyleId] = useState(STYLES[0].id);

  const style = STYLES.find((s) => s.id === styleId) ?? STYLES[0];

  const results = useMemo(
    () =>
      STYLES.map((s) => {
        // A bangle is the exception: it is sized off the hand, not the wrist.
        const base = s.id === 'bangle' ? hand : wrist;
        const length = base + s.ease;
        return {
          style: s,
          base,
          length,
          // Inner diameter, which is how a rigid piece is actually ordered.
          diameter: length / Math.PI,
          band: [base + s.range[0], base + s.range[1]] as [number, number],
        };
      }),
    [wrist, hand]
  );

  const chosen = results.find((r) => r.style.id === styleId) ?? results[0];

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* The two measurements. */}
        <div className="space-y-7">
          <Measure
            id="wrist-mm"
            label="Around the wrist bone"
            hint="Snug, not compressing. Measured in the evening."
            value={wrist}
            min={125}
            max={220}
            onChange={setWrist}
          />

          <Measure
            id="hand-mm"
            label="Across the knuckles, thumb tucked in"
            hint="Only used for rigid bangles — this is the measurement one has to pass."
            value={hand}
            min={140}
            max={250}
            onChange={setHand}
            dim={style.kind !== 'rigid'}
          />

          {hand <= wrist && (
            <p className="rounded-xl border border-burgundy-300/40 bg-burgundy-900/10 p-4 font-sans text-xs font-light leading-relaxed text-secondary">
              The hand measurement is smaller than the wrist, which is not anatomically
              possible with the thumb tucked in — the knuckles are always the wider point.
              Worth measuring again before ordering anything rigid.
            </p>
          )}
        </div>

        {/* The drawing, to the computed circumference. */}
        <FitRing
          wrist={wrist}
          hand={hand}
          diameter={chosen.diameter}
          kind={chosen.style.kind}
          reduced={!!reduced}
        />
      </div>

      {/* The five answers. */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map(({ style: s, length, diameter, band, base }, i) => {
          const on = s.id === styleId;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => setStyleId(s.id)}
              aria-pressed={on}
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.05, ease: easeCine.glass }}
              className={`rounded-2xl border p-5 text-left transition-colors duration-500 ${
                on
                  ? 'border-accent/55 bg-surface-raised/75'
                  : 'border-hairline bg-surface-raised/25 hover:border-accent/35'
              }`}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className={`font-display text-lg leading-tight ${on ? 'text-accent' : 'text-primary'}`}>
                  {s.name}
                </span>
                <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  {s.kind}
                </span>
              </span>

              <span className="mt-3 block nums-tabular font-display text-3xl text-accent">
                {Math.round(length)}
                <span className="ml-1 font-accent text-xs uppercase tracking-luxe text-faint">mm</span>
              </span>

              <span className="mt-1 block nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
                {s.kind === 'rigid'
                  ? `${diameter.toFixed(1)}mm inner diameter`
                  : `${Math.round(band[0])}–${Math.round(band[1])}mm still fits`}
                {' · '}
                {s.id === 'bangle' ? 'from the hand' : 'from the wrist'} {Math.round(base)}mm
              </span>

              <span className="mt-3 block font-sans text-xs font-light leading-relaxed text-secondary">
                {s.why}
              </span>

              {on && (
                <motion.span
                  initial={reduced ? undefined : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.4, ease: easeCine.curtain }}
                  className="mt-3 block overflow-hidden border-t border-hairline pt-3 font-sans text-xs font-light leading-relaxed text-burgundy-300"
                >
                  {s.wrong}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* How to measure. Last, because it is only read once somebody has seen
          that the numbers differ and wants to get theirs right. */}
      <div className="rounded-2xl border border-hairline bg-surface-raised/30 p-6">
        <p className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-accent">
          <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
          Measuring it properly
        </p>
        <ol className="mt-4 space-y-2">
          {METHOD.map((step, i) => (
            <li key={step} className="flex gap-3 font-sans text-sm font-light leading-relaxed text-secondary">
              <span className="nums-tabular font-accent text-[10px] text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Measure({
  id,
  label,
  hint,
  value,
  min,
  max,
  onChange,
  dim = false,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  dim?: boolean;
}) {
  return (
    <div className={dim ? 'opacity-45 transition-opacity duration-500' : 'transition-opacity duration-500'}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-accent text-[10px] uppercase tracking-luxe text-accent">
          {label}
        </label>
        <span className="nums-tabular font-display text-2xl text-primary">
          {value}
          <span className="ml-1 font-accent text-[10px] uppercase tracking-luxe text-faint">mm</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-overlay mt-3 w-full"
      />
      <p className="mt-1.5 font-sans text-[11px] font-light text-faint">{hint}</p>
    </div>
  );
}

/**
 * The piece, drawn at the computed inner diameter against the wrist and hand it
 * has to pass. Everything on this drawing is to one scale — the whole point is
 * that a bangle's circle is visibly larger than the wrist inside it.
 */
function FitRing({
  wrist,
  hand,
  diameter,
  kind,
  reduced,
}: {
  wrist: number;
  hand: number;
  diameter: number;
  kind: 'flexible' | 'rigid';
  reduced: boolean;
}) {
  // 220 user units for a 90mm span, so a 60mm bangle reads about two-thirds of
  // the frame and the extremes of the sliders both still fit.
  const scale = 220 / 90;
  const r = (diameter / 2) * scale;
  const wristR = (wrist / Math.PI / 2) * scale;
  const handR = (hand / Math.PI / 2) * scale;

  return (
    <div className="rounded-2xl border border-hairline bg-surface-sunken p-6">
      <svg viewBox="-130 -130 260 260" className="w-full" role="img" aria-label="The piece drawn against the wrist and hand it has to pass">
        {/* The hand, as the circle a rigid piece has to clear. */}
        <circle
          cx={0}
          cy={0}
          r={handR}
          fill="none"
          stroke="rgb(var(--hairline))"
          strokeOpacity={0.3}
          strokeWidth={1}
          strokeDasharray="4 5"
        />
        <text x={0} y={-handR - 8} textAnchor="middle" className="font-accent" fontSize={9} letterSpacing={2} fill="rgb(var(--text-faint))">
          HAND
        </text>

        {/* The wrist. */}
        <circle cx={0} cy={0} r={wristR} fill="rgb(var(--hairline))" fillOpacity={0.07} stroke="rgb(var(--hairline))" strokeOpacity={0.4} strokeWidth={1} />
        <text x={0} y={4} textAnchor="middle" className="font-accent" fontSize={9} letterSpacing={2} fill="rgb(var(--text-faint))">
          WRIST
        </text>

        {/* The piece. A rigid style is a closed circle; a flexible one is drawn
            slack, hanging to one side, because that is where it will sit. */}
        {kind === 'rigid' ? (
          <motion.circle
            cx={0}
            cy={0}
            initial={false}
            animate={{ r }}
            transition={{ duration: reduced ? 0 : 0.6, ease: easeCine.glass }}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth={3}
          />
        ) : (
          <motion.ellipse
            cx={0}
            initial={false}
            animate={{ cy: Math.max(0, r - wristR) * 0.7, rx: r, ry: r * 0.86 }}
            transition={{ duration: reduced ? 0 : 0.6, ease: easeCine.glass }}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth={3}
          />
        )}
      </svg>

      <p className="mt-3 nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
        Drawn to scale · piece {diameter.toFixed(1)}mm inner diameter
      </p>
      <p className="mt-1 font-sans text-[11px] font-light leading-relaxed text-faint">
        {kind === 'rigid'
          ? 'A rigid piece is drawn as the circle it is. If it does not enclose the dashed hand line, it will not go on.'
          : 'A flexible piece is drawn slack and low, because that is where it actually hangs — a bracelet does not sit concentric with the wrist.'}
      </p>
    </div>
  );
}
