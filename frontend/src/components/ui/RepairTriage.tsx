'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Coins, Stethoscope, TriangleAlert } from 'lucide-react';

import CTAButton from '@/components/ui/CTAButton';
import { ease, gridCell, gridDelay, springs } from '@/lib/motion';

/**
 * Symptoms as a customer describes them, not as a workshop names them. "It catches
 * on things" is what somebody says; "a lifted claw" is what it is, and the whole
 * value of this is translating between the two.
 *
 * `urgency` drives the ordering of the verdict, and 'now' means exactly that: stop
 * wearing it. There are only three of those, and inflating the list would make all
 * three ignorable.
 */
const SYMPTOMS = [
  {
    id: 'catches',
    said: 'It catches on clothing',
    means: 'A claw has lifted',
    urgency: 'now',
    fix: 'Re-tipping or re-cutting the claw, then a burnish. Fifteen minutes at the bench if the claw is intact, an hour if it has to be rebuilt from new metal.',
    band: 'Free for anything we made · ₹1,500–4,000 otherwise',
    lead: 'Same day, while you wait',
    why: 'A claw that catches is a claw that has moved, and a stone sits on four of them. Every wear from here is a chance to lose it — this is the one symptom on this list worth taking a ring off for.',
  },
  {
    id: 'rattle',
    said: 'The stone moves if I tap it',
    means: 'The setting has opened',
    urgency: 'now',
    fix: 'The stone comes out, the seat is re-cut, and it is re-set. Nobody tightens a loose stone by squeezing the claws — that is how a girdle chips.',
    band: '₹2,500–7,000 depending on the setting',
    lead: 'Three to five days',
    why: 'You can hear this one before you can see it. Hold the piece to your ear and tap the shank: a set stone is silent, a loose stone ticks.',
  },
  {
    id: 'clasp',
    said: 'The clasp has started springing open',
    means: 'A tired spring or a worn tongue',
    urgency: 'now',
    fix: 'A box clasp gets a new tongue; a lobster gets a new spring. Both are workshop parts rather than repairs, and both are quick.',
    band: '₹900–3,500',
    lead: 'Two to four days',
    why: 'A clasp fails progressively for about a month before it lets go. It is the single most common way a chain is lost, and almost always after the owner noticed it catching.',
  },
  {
    id: 'dull',
    said: 'It has gone dull',
    means: 'Surface film, or lost rhodium',
    urgency: 'soon',
    fix: 'Ultrasonic where the stone allows it, hand-clean where it does not, then a professional polish. White gold also needs re-rhodium plating every eighteen months or so.',
    band: 'Cleaning free · Rhodium ₹2,500–4,500',
    lead: 'Same day for cleaning · Three days for plating',
    why: 'Nine times in ten this is hand cream and soap film rather than wear, and it comes off entirely. If it does not, the rhodium has gone and no amount of cleaning will bring it back.',
  },
  {
    id: 'green',
    said: 'It marks my skin',
    means: 'Alloy reacting, or a worn plating',
    urgency: 'soon',
    fix: 'Identify the alloy, strip and re-plate if plated, or move you to a higher karat if the reaction is genuine. Not a fault in the piece in most cases.',
    band: '₹1,800–5,000',
    lead: 'Four to seven days',
    why: 'Copper in the alloy reacts with acidity in skin, which varies by person, season and medication. It is not a sign of a fake, and it is not permanent.',
  },
  {
    id: 'size',
    said: 'It no longer fits',
    means: 'Resize, up or down',
    urgency: 'soon',
    fix: 'A cut, a solder and a full refinish. Down is straightforward; up beyond one and a half sizes means adding metal, and on a pavé shank it means resetting stones.',
    band: '₹2,000–6,500 · more on a set shank',
    lead: 'Seven to ten days',
    why: 'Fingers change by up to half a size across a day and a full size across a summer. Measure at the end of a warm afternoon, never first thing in the morning.',
  },
  {
    id: 'bent',
    said: 'It is out of round',
    means: 'A bent shank',
    urgency: 'soon',
    fix: 'Trued on a mandrel and re-annealed. If it has been bent more than twice the metal is work-hardened and the section should be replaced rather than straightened again.',
    band: '₹1,200–3,800',
    lead: 'Three to five days',
    why: 'A ring goes oval before it cracks, and the crack always appears at the point that has been straightened most. Bring it in the first time, not the third.',
  },
  {
    id: 'chip',
    said: 'There is a chip on the stone',
    means: 'Girdle or facet damage',
    urgency: 'assess',
    fix: 'Assessed under a scope first. Small girdle chips can sometimes be hidden inside a claw by rotating the stone; anything on the table means a recut, and a recut means weight loss.',
    band: 'Assessment free · Recut quoted per stone',
    lead: 'Assessment same day · Recut four to eight weeks',
    why: 'This is the one on the list where the honest first answer is "let us look at it and tell you". Anyone quoting a chip repair without seeing the stone is guessing.',
  },
  {
    id: 'heirloom',
    said: 'It has been in a drawer for forty years',
    means: 'Full restoration',
    urgency: 'assess',
    fix: 'Documented, photographed, then taken apart only as far as it has to be. Original technique wherever the original technique can be identified — which is why it waits for the one bench that can do it.',
    band: 'Quoted after assessment',
    lead: 'Up to eighteen months',
    why: 'The wait is the reason the result is worth having. A restoration done quickly is a piece made new, and a piece made new is not the piece that was in the drawer.',
  },
] as const;

type SymptomId = (typeof SYMPTOMS)[number]['id'];

const URGENCY = {
  now: {
    label: 'Stop wearing it',
    cls: 'border-burgundy-500/45 bg-burgundy-900/12 text-burgundy-300',
  },
  soon: {
    label: 'Bring it in when convenient',
    cls: 'border-accent/45 bg-accent/10 text-accent',
  },
  assess: {
    label: 'Let us look at it first',
    cls: 'border-jade-500/40 bg-jade-900/12 text-jade-300',
  },
} as const;

/**
 * Triage, in the customer's own words.
 *
 * The services page publishes what the workshop does and what it costs. It cannot
 * answer the question people actually arrive with, which is "is this serious". So
 * this lists nine symptoms as they are described at the counter, and answers each
 * with four things: what it really is, what happens to it, roughly what it costs,
 * and how long it takes.
 *
 * Three of the nine say stop wearing it. That count is deliberate — a triage list
 * where everything is urgent teaches the reader to ignore urgency, and the whole
 * usefulness of this is that a lifted claw and a dull finish are not the same kind
 * of problem.
 *
 * Bands rather than prices, because a quote without seeing the piece would be
 * invented. Where the honest answer is "we have to look at it", that is what it
 * says.
 */
export default function RepairTriage({ className = '' }: { className?: string }) {
  const [selected, setSelected] = useState<SymptomId>('catches');

  const symptom = useMemo(
    () => SYMPTOMS.find((s) => s.id === selected) ?? SYMPTOMS[0],
    [selected]
  );
  const urgency = URGENCY[symptom.urgency];

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] ${className}`}>
      {/* ---- The complaint ---- */}
      <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
        <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
          <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
          What is wrong with it
        </span>
        <p className="mt-2 font-sans text-xs font-light leading-relaxed text-muted">
          In your words, not ours. Pick the closest one.
        </p>

        <ul className="mt-5 space-y-2">
          {SYMPTOMS.map((s, i) => {
            const on = s.id === selected;
            return (
              <li key={s.id}>
                <motion.button
                  type="button"
                  onClick={() => setSelected(s.id)}
                  variants={gridCell}
                  custom={gridDelay(i, 1, SYMPTOMS.length, 'top-left', 0.035)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ x: 4, transition: springs.chip }}
                  aria-pressed={on}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-300 ${
                    on
                      ? 'border-accent/60 bg-accent/10'
                      : 'border-hairline hover:border-accent/40'
                  }`}
                >
                  <span className={`font-sans text-xs ${on ? 'text-primary' : 'text-muted'}`}>
                    &ldquo;{s.said}&rdquo;
                  </span>
                  {s.urgency === 'now' && (
                    <TriangleAlert
                      className="h-3.5 w-3.5 flex-shrink-0 text-burgundy-300"
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---- The verdict ---- */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface-raised/50 p-6 md:p-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={symptom.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(7px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(5px)' }}
            transition={{ duration: 0.45, ease: ease.luxury }}
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-accent text-[10px] uppercase tracking-luxe ${urgency.cls}`}
            >
              {urgency.label}
            </span>

            <h3 className="mt-5 font-display text-3xl leading-tight text-primary md:text-4xl">
              {symptom.means}
            </h3>

            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary md:text-base">
              {symptom.fix}
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-canvas/60 p-4">
                <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
                  <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                  Cost
                </span>
                <p className="mt-1.5 font-sans text-sm text-accent">{symptom.band}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-canvas/60 p-4">
                <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Time
                </span>
                <p className="mt-1.5 font-sans text-sm text-accent">{symptom.lead}</p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border-l-2 border-accent/60 bg-canvas/40 py-4 pl-5 pr-4">
              <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                Why it matters
              </span>
              <p className="mt-2 font-sans text-sm font-light italic leading-relaxed text-secondary">
                {symptom.why}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CTAButton variant="secondary" size="sm" href="/contact" showArrow>
                Bring it in
              </CTAButton>
              <span className="inline-flex items-center gap-2 font-sans text-[11px] font-light text-faint">
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                No appointment needed for an assessment
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
