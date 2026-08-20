'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

/**
 * How each metal actually ages, at four points in a life.
 *
 * The entries are not a scale of quality. Every one of these metals is doing
 * exactly what its own metallurgy requires, and the reason to know which is
 * which is that two of them want to be polished and two of them do not — and
 * polishing the wrong one removes metal that will never come back.
 *
 * `loss` is the honest number nobody prints: the percentage of the original metal
 * gone after twenty years of a full polish every second year. It is why we
 * refuse a full polish on a thin platinum band and why we will do one on 22K
 * without comment.
 */
interface Metal {
  id: string;
  name: string;
  /** Alloy detail, since it is the alloy that ages and not the gold. */
  alloy: string;
  /** 0–1 per stage: how far this metal has moved from new. */
  ageAt: [number, number, number, number];
  stages: [string, string, string, string];
  /** What the change actually is, chemically. */
  mechanism: string;
  /** What to do about it. */
  advice: string;
  /** Metal lost to twenty years of biennial polishing, as a percentage. */
  loss: number;
  /** Whether polishing is the right answer at all. */
  polish: 'yes' | 'sparingly' | 'never';
  swatch: string;
}

const METALS: Metal[] = [
  {
    id: 'gold-22',
    name: '22K yellow gold',
    alloy: '91.6% gold, the balance silver and copper',
    ageAt: [0, 0.12, 0.28, 0.45],
    stages: [
      'Bright, slightly soft to the touch, tool marks still visible under a loupe.',
      'The high polish has gone matte where it rubs. Nobody notices this happening.',
      'A soft, even satin over the whole surface, with brightness only in the recesses.',
      'A warm, slightly darker surface the trade calls a bloom. Most people prefer it to new.',
    ],
    mechanism:
      'Almost nothing chemical. 22K is too pure to tarnish meaningfully — what changes is purely mechanical, thousands of microscopic scratches averaging into a satin.',
    advice:
      'Polish it whenever you like. There is enough metal in a 22K piece to survive it and the finish comes back completely.',
    loss: 1.4,
    polish: 'yes',
    swatch: 'rgb(var(--gold-400))',
  },
  {
    id: 'gold-18-rose',
    name: '18K rose gold',
    alloy: '75% gold, around 21% copper, 4% silver',
    ageAt: [0, 0.22, 0.5, 0.78],
    stages: [
      'The pinkest it will ever be — copper at the surface, freshly cut.',
      'Very slightly deeper. A piece worn daily is now a shade warmer than one in the box.',
      'Noticeably deeper and browner in the recesses, where the copper has oxidised undisturbed.',
      'A distinctly darker rose. Two rings bought together, one worn and one not, no longer match.',
    ],
    mechanism:
      'The copper in the alloy oxidises. It is a real chemical change and it is the whole reason rose gold exists — the same copper that makes it pink is the thing that ages it.',
    advice:
      'Leave the recesses alone and polish only the high surfaces. Stripping the darkened copper from the detail flattens the piece and it takes years to come back.',
    loss: 2.1,
    polish: 'sparingly',
    swatch: 'rgb(var(--rose-300))',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    alloy: '95% platinum, 5% ruthenium or cobalt',
    ageAt: [0, 0.35, 0.7, 1],
    stages: [
      'Mirror bright, and slightly grey rather than white. This is what platinum is.',
      'A network of fine scratches. It looks worse at this stage than it ever will again.',
      'The scratches have merged into a soft grey sheen the trade calls the patina.',
      'A deep, even, satin grey that collectors specifically ask for and cannot be faked.',
    ],
    mechanism:
      'Platinum does not lose metal when scratched — it displaces it. The metal moves sideways rather than coming off, which is why the surface dulls but the band does not thin.',
    advice:
      'This is the one metal where doing nothing is the expert answer. A platinum patina is desirable, takes fifteen years to acquire, and takes a polisher forty seconds to destroy.',
    loss: 0.4,
    polish: 'never',
    swatch: 'rgb(var(--platinum))',
  },
  {
    id: 'gold-white',
    name: '18K white gold',
    alloy: '75% gold, palladium or nickel, rhodium plated',
    ageAt: [0, 0.45, 0.85, 1],
    stages: [
      'Bright white — which is the rhodium plating, not the gold underneath.',
      'The plating is thinning at the back of the shank, where the finger rubs. Not yet visible.',
      'A warm patch showing through on the underside. The gold beneath is faintly yellow.',
      'Plating gone from every contact surface. The piece is now two colours and looks worn rather than aged.',
    ],
    mechanism:
      'Not ageing at all, strictly. The rhodium plate is a coating a couple of microns thick and it wears through. The metal underneath has not changed.',
    advice:
      'Re-plate every three to five years — it is a modest bench charge and it restores the piece completely. This is maintenance, not restoration, and nothing is lost.',
    loss: 0.9,
    polish: 'sparingly',
    swatch: 'rgb(var(--diamond))',
  },
  {
    id: 'silver',
    name: 'Sterling silver',
    alloy: '92.5% silver, 7.5% copper',
    ageAt: [0, 0.6, 0.9, 1],
    stages: [
      'The whitest, brightest metal in this list. Brighter than platinum.',
      'A faint straw tint. This is tarnish beginning and it is entirely reversible.',
      'Grey-brown over the flat surfaces, near-black in the recesses.',
      'Fully oxidised where it is not touched, bright where it is handled. The contrast is the look.',
    ],
    mechanism:
      'Silver sulphide. Sulphur compounds in air — and in wool, rubber bands and egg — react with the surface. It is a film, not a loss of metal.',
    advice:
      'A cloth removes it in seconds and removes almost no silver. Dips work faster and take the detail with them; we do not keep them on the bench.',
    loss: 1.1,
    polish: 'yes',
    swatch: 'rgb(var(--ink-200))',
  },
];

const YEARS = ['New', 'Year 2', 'Year 8', 'Year 20'] as const;

const POLISH_TONE = {
  yes: { label: 'Polish freely', tone: 'text-jade-300' },
  sparingly: { label: 'Polish sparingly', tone: 'text-gold-300' },
  never: { label: 'Do not polish', tone: 'text-burgundy-300' },
} as const;

/**
 * Twenty years, on a slider.
 *
 * Care pages tell people how to keep jewellery looking new. This says the
 * quieter and more useful thing: three of these five metals are not trying to
 * stay new, and one of them is actively improved by being left alone. A customer
 * who does not know which is which will hand a fifteen-year-old platinum patina
 * to a polisher and be delighted for about a week.
 *
 * The plates are driven by the `--age` custom property on the shared
 * `patina-plate` class, so the tarnish wash, the scratch density and the loss of
 * specular all move off one number — which is what happens on a real surface.
 * Splitting them into three independent animations was the first attempt and it
 * looked like three effects rather than one process.
 *
 * The years are not evenly spaced: new, two, eight, twenty. Ageing is fastest at
 * the start and a linear axis makes the first two years look like nothing
 * happens, when in fact that is when almost all of the visible change occurs.
 */
export default function PatinaTimeline({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(2);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* The dial. A real range input, so it is keyboard-steppable and reads
          correctly to assistive technology. */}
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label
            htmlFor="patina-stage"
            className="font-accent text-[10px] uppercase tracking-luxe text-accent"
          >
            How long it has been worn
          </label>
          <span className="nums-tabular font-display text-2xl text-accent">{YEARS[stage]}</span>
        </div>

        <input
          id="patina-stage"
          type="range"
          min={0}
          max={3}
          step={1}
          value={stage}
          onChange={(e) => setStage(Number(e.target.value))}
          aria-valuetext={YEARS[stage]}
          className="range-overlay mt-4 w-full"
        />

        {/* The axis, labelled where the stops actually are — not evenly, because
            they are not evenly spaced in time. */}
        <div className="mt-2 flex justify-between">
          {YEARS.map((y, i) => (
            <button
              key={y}
              type="button"
              onClick={() => setStage(i)}
              className={`font-accent text-[9px] uppercase tracking-luxe transition-colors duration-300 ${
                i === stage ? 'text-accent' : 'text-faint hover:text-accent'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* The five metals, at the selected age. */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {METALS.map((metal, i) => {
          const age = metal.ageAt[stage];
          const polish = POLISH_TONE[metal.polish];

          return (
            <motion.article
              key={metal.id}
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.05, ease: easeCine.glass }}
              className="overflow-hidden rounded-2xl border border-hairline bg-surface-raised/35"
            >
              {/* The surface. `--age` is the only thing that changes. */}
              <motion.div
                className="patina-plate bevel-edge relative h-28"
                initial={false}
                animate={{ opacity: 1 }}
                style={
                  {
                    '--age': age,
                    backgroundColor: metal.swatch,
                    transition: reduced ? 'none' : 'filter 900ms cubic-bezier(0.22,1,0.36,1)',
                  } as React.CSSProperties
                }
              >
                {/* A bright band that narrows as the surface dulls — the specular
                    highlight is the first thing a patina takes. */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-[18%] block bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.5),transparent)]"
                  initial={false}
                  animate={{ width: `${Math.max(4, 34 - age * 30)}%`, opacity: 1 - age * 0.72 }}
                  transition={{ duration: reduced ? 0 : 0.9, ease: easeCine.glass }}
                />
              </motion.div>

              <div className="space-y-3 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-lg leading-tight text-primary">{metal.name}</h4>
                  <span className={`font-accent text-[9px] uppercase tracking-luxe ${polish.tone}`}>
                    {polish.label}
                  </span>
                </div>

                <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  {metal.alloy}
                </p>

                <motion.p
                  key={stage}
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="font-sans text-sm font-light leading-relaxed text-secondary"
                >
                  {metal.stages[stage]}
                </motion.p>

                {/* Metal lost to twenty years of polishing. Drawn against a
                    fixed 3% ceiling so the bars are comparable between cards. */}
                <div className="border-t border-hairline pt-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                      Lost to twenty years of polishing
                    </span>
                    <span className="nums-tabular font-accent text-[9px] text-accent">
                      {metal.loss.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[rgb(var(--hairline)/0.14)]">
                    <motion.span
                      initial={reduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: Math.min(1, metal.loss / 3) }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: easeCine.glass }}
                      style={{ transformOrigin: '0% 50%' }}
                      className="block h-full w-full rounded-full bg-accent"
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* The mechanisms, held back until the plates have been looked at. */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {METALS.map((metal) => (
          <div
            key={`${metal.id}-why`}
            className="rounded-xl border border-hairline bg-surface-raised/20 p-4"
          >
            <p className="font-accent text-[9px] uppercase tracking-luxe text-accent">
              {metal.name} — why
            </p>
            <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
              {metal.mechanism}
            </p>
            <p className="mt-3 border-t border-hairline pt-3 font-sans text-xs font-light leading-relaxed text-primary">
              {metal.advice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
