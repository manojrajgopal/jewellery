'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lightbulb, Zap } from 'lucide-react';

import { easeLens, springsHeavy } from '@/lib/motion';

/**
 * The five fluorescence grades a report uses, with the market's own discount
 * attached to each.
 *
 * The discounts are real and they are the interesting part: strong blue
 * fluorescence takes 10–15% off a colourless stone and *nothing* off a faintly
 * yellow one — in a J colour it can be worth a small premium, because the blue
 * cancels the yellow in daylight. So the same property is a defect at one end of
 * the colour scale and a benefit at the other, and the market prices it as a
 * defect throughout. That gap is the buying opportunity, and it is never
 * explained at a counter.
 */
const GRADES = [
  { id: 'none', label: 'None', glow: 0, discountHigh: 0, discountLow: 0 },
  { id: 'faint', label: 'Faint', glow: 0.18, discountHigh: 0, discountLow: 0 },
  { id: 'medium', label: 'Medium', glow: 0.45, discountHigh: 4, discountLow: 0 },
  { id: 'strong', label: 'Strong', glow: 0.75, discountHigh: 11, discountLow: -2 },
  { id: 'very-strong', label: 'Very strong', glow: 1, discountHigh: 15, discountLow: -3 },
] as const;

/** Colour grades, grouped the way a report groups them. */
const COLOURS = [
  { id: 'D', label: 'D', band: 'Colourless', yellow: 0 },
  { id: 'F', label: 'F', band: 'Colourless', yellow: 0.06 },
  { id: 'H', label: 'H', band: 'Near colourless', yellow: 0.18 },
  { id: 'J', label: 'J', band: 'Near colourless', yellow: 0.34 },
  { id: 'L', label: 'L', band: 'Faint yellow', yellow: 0.5 },
  { id: 'N', label: 'N', band: 'Very light yellow', yellow: 0.66 },
] as const;

interface FluorescenceViewerProps {
  className?: string;
}

/**
 * A stone under two lights, and the price of the difference.
 *
 * Fluorescence is the one grade on a diamond report that describes something the
 * stone does rather than something it is, and it is the only one where the
 * market's pricing is provably wrong at one end of the scale. This shows both
 * halves: the stone under daylight and under long-wave ultraviolet, side by side,
 * with the discount the market applies underneath.
 *
 * The daylight panel is where the argument lives. Blue fluorescence is the
 * complement of yellow body colour, so it *cancels* it — set the colour grade to
 * J or below and turn fluorescence up, and the daylight stone gets visibly
 * cleaner while the price gets cheaper. That is drawn, not asserted: the yellow
 * cast on the daylight stone is computed as the body colour minus the blue the
 * stone is throwing.
 *
 * The UV panel is the party trick, and it is honest about being one — nobody
 * views jewellery under a blacklight, which is the reason the discount is
 * arguably unjustified in the first place.
 */
export default function FluorescenceViewer({ className = '' }: FluorescenceViewerProps) {
  const reduced = useReducedMotion();
  const [gradeIndex, setGradeIndex] = useState(3); // Strong — where it gets interesting.
  const [colourId, setColourId] = useState<(typeof COLOURS)[number]['id']>('J');
  const [uv, setUv] = useState(false);

  const grade = GRADES[gradeIndex];
  const colour = COLOURS.find((c) => c.id === colourId) ?? COLOURS[0];

  /**
   * Blue fluorescence subtracts from apparent yellow in daylight. The 0.55
   * coefficient is judgement rather than physics — it is tuned so that a strong
   * fluorescent J reads about as clean as a non-fluorescent H, which is what
   * gemmologists actually report seeing.
   */
  const apparentYellow = Math.max(0, colour.yellow - grade.glow * 0.55);
  const improved = colour.yellow - apparentYellow;

  /** The market's discount, interpolated between the two ends of the colour scale. */
  const discount = useMemo(() => {
    // Above H, fluorescence is penalised; below J it is neutral or a small plus.
    const t = Math.min(1, colour.yellow / 0.4);
    return grade.discountHigh * (1 - t) + grade.discountLow * t;
  }, [grade, colour.yellow]);

  const worthIt = discount < 3 && improved > 0.05;

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)]">
        {/* ================= The two lights ================= */}
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* ---- Daylight ---- */}
            <div className="relative overflow-hidden rounded-3xl border border-hairline bg-[rgb(var(--ink-100))] p-6">
              <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-[rgb(var(--ink-600))]">
                <Lightbulb aria-hidden="true" className="h-3.5 w-3.5" />
                North daylight
              </span>

              <div className="mt-6 grid place-items-center" style={{ height: '11rem' }}>
                <Stone
                  yellow={apparentYellow}
                  glow={0}
                  uv={false}
                  reduced={!!reduced}
                />
              </div>

              <p className="mt-4 font-accent text-[10px] uppercase tracking-luxe text-[rgb(var(--ink-600))]">
                {improved > 0.05 ? (
                  <span className="text-jade-700">
                    Reads about {Math.round(improved * 100)}% cleaner than its grade
                  </span>
                ) : (
                  <>Colour as graded</>
                )}
              </p>
            </div>

            {/* ---- Ultraviolet ---- */}
            <button
              type="button"
              onClick={() => setUv(!uv)}
              aria-pressed={uv}
              className="group relative overflow-hidden rounded-3xl border border-hairline bg-[rgb(var(--ink-950))] p-6 text-left transition-colors duration-500 hover:border-accent/40"
            >
              <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-[rgb(var(--ink-300))]">
                <Zap aria-hidden="true" className="h-3.5 w-3.5" />
                Long-wave UV · 365nm
              </span>

              <div className="relative mt-6 grid place-items-center" style={{ height: '11rem' }}>
                {/* The lamp's own spill, which is most of what you see in a
                    darkened room before the stone even reacts. */}
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: uv ? 0.5 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgb(120_90_220/0.5),transparent_75%)]"
                />
                <Stone
                  yellow={colour.yellow * 0.4}
                  glow={uv ? grade.glow : 0}
                  uv={uv}
                  reduced={!!reduced}
                />
              </div>

              <p className="mt-4 font-accent text-[10px] uppercase tracking-luxe text-accent">
                {uv ? 'Lamp on — tap to switch off' : 'Tap to switch the lamp on'}
              </p>
            </button>
          </div>

          {/* ---- The honest note ---- */}
          <p className="font-sans text-xs font-light leading-relaxed text-faint">
            Nobody views jewellery under a blacklight. The right-hand panel is a party trick, and it
            is roughly the only condition under which fluorescence is visible at all — which is the
            case against discounting a stone for it.
          </p>
        </div>

        {/* ================= Controls and the price ================= */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Fluorescence grade
            </span>
            <div className="mt-3 space-y-1.5">
              {GRADES.map((g, i) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGradeIndex(i)}
                  aria-pressed={i === gradeIndex}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-300 ${
                    i === gradeIndex
                      ? 'border-accent/60 bg-accent/10'
                      : 'border-transparent hover:border-hairline'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      background: `rgb(120 140 255 / ${0.1 + g.glow * 0.9})`,
                      boxShadow: g.glow > 0.3 ? `0 0 12px 2px rgb(120 140 255 / ${g.glow * 0.6})` : undefined,
                    }}
                  />
                  <span
                    className={`flex-1 text-left font-accent text-[11px] uppercase tracking-luxe ${
                      i === gradeIndex ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Colour grade
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {COLOURS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColourId(c.id)}
                  aria-pressed={c.id === colourId}
                  title={c.band}
                  className={`h-10 w-10 rounded-full border font-accent text-sm transition-all duration-300 ${
                    c.id === colourId
                      ? 'border-accent bg-accent text-onaccent'
                      : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="mt-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
              {colour.band}
            </p>
          </div>

          {/* ---- What the market charges for it ---- */}
          <motion.div
            layout={!reduced}
            className={`rounded-3xl border p-6 transition-colors duration-500 ${
              worthIt ? 'border-jade-500/40 bg-jade-500/[0.07]' : 'border-accent/30 bg-accent/[0.06]'
            }`}
          >
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              The market&rsquo;s discount
            </span>

            <motion.p
              key={`${grade.id}-${colour.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeLens.focusRing }}
              className="mt-3 font-display text-4xl text-primary nums-tabular"
            >
              {discount > 0 ? '−' : discount < 0 ? '+' : ''}
              {Math.abs(discount).toFixed(1)}%
            </motion.p>

            <motion.p
              key={`verdict-${grade.id}-${colour.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...springsHeavy.leaf, delay: 0.08 }}
              className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary"
            >
              {worthIt ? (
                <>
                  This is the bargain. The stone is discounted for a property that, at this colour
                  grade, makes it look <em className="text-accent not-italic">better</em> in the only
                  light anyone will ever see it in.
                </>
              ) : discount >= 10 ? (
                <>
                  A real discount for a real, if rare, problem: at a colourless grade very strong
                  fluorescence can produce a faint oily haze in direct sun. Ask to see the stone
                  outdoors before you accept or reject it.
                </>
              ) : discount > 0 ? (
                <>
                  A modest discount for something you will not see. Worth taking if the stone looks
                  right to you in daylight.
                </>
              ) : (
                <>No effect on price at this combination. It is simply a note on the report.</>
              )}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   The stone. One brilliant, drawn as facets, tinted by body colour and lit
   from within by fluorescence.
   ========================================================================= */
function Stone({
  yellow,
  glow,
  uv,
  reduced,
}: {
  yellow: number;
  glow: number;
  uv: boolean;
  reduced: boolean;
}) {
  const spring = reduced ? { duration: 0 } : springsHeavy.tray;

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full max-w-[11rem]" role="img" aria-label="Diamond, viewed face-up">
      <defs>
        <radialGradient id={`fluor-body-${uv ? 'uv' : 'day'}`} cx="50%" cy="38%" r="62%">
          <stop
            offset="0%"
            stopColor={uv ? 'rgb(210, 220, 255)' : 'rgb(var(--diamond))'}
            stopOpacity="0.95"
          />
          <stop
            offset="100%"
            // Body colour: interpolated toward a warm yellow by the tint amount.
            stopColor={`rgb(${255 - yellow * 6}, ${250 - yellow * 40}, ${240 - yellow * 130})`}
            stopOpacity="0.9"
          />
        </radialGradient>
      </defs>

      {/* The fluorescent bloom — light coming out of the stone, so it is drawn
          behind and blurred rather than on top of the facets. */}
      <motion.circle
        cx="60"
        cy="58"
        r="46"
        initial={false}
        animate={{ opacity: glow * 0.85, r: 40 + glow * 14 }}
        transition={spring}
        fill="rgb(110, 135, 255)"
        style={{ filter: 'blur(14px)' }}
      />

      {/* Crown outline — a round brilliant seen face-up. */}
      <polygon
        points="60,14 89,26 101,58 89,90 60,102 31,90 19,58 31,26"
        fill={`url(#fluor-body-${uv ? 'uv' : 'day'})`}
        stroke="rgb(var(--gold-200))"
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />

      {/* The table, and the star facets around it. */}
      <polygon
        points="60,34 79,44 79,72 60,82 41,72 41,44"
        fill="rgb(255 255 255 / 0.14)"
        stroke="rgb(var(--cream-50))"
        strokeWidth="0.5"
        strokeOpacity="0.35"
      />
      {[
        '60,14 79,44 41,44',
        '89,26 79,44 79,72',
        '101,58 79,72 79,44',
        '89,90 60,82 79,72',
        '60,102 41,72 60,82',
        '31,90 41,72 41,44',
        '19,58 41,44 41,72',
        '31,26 41,44 60,14',
      ].map((pts, i) => (
        <motion.polygon
          key={pts}
          points={pts}
          initial={false}
          animate={{
            // Facets pick up the fluorescent light unevenly, which is what makes
            // a fluorescing stone look lit from inside rather than painted blue.
            opacity: 0.1 + glow * 0.35 * (0.5 + ((i * 37) % 100) / 200),
          }}
          transition={spring}
          fill={uv ? 'rgb(150, 175, 255)' : 'rgb(var(--cream-50))'}
        />
      ))}

      {/* Specular glint — always present, because a polished stone always has one. */}
      <ellipse cx="49" cy="41" rx="7" ry="4" fill="rgb(255 255 255 / 0.5)" transform="rotate(-24 49 41)" />
    </svg>
  );
}
