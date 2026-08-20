'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * How a piece actually travels, and who is holding the risk at each moment.
 *
 * Everybody who has ever bought something expensive online has watched a
 * tracking page and learned nothing from it, because a tracking page answers
 * "where" and the question that matters is "whose problem is it if this goes
 * missing right now". For jewellery those two questions have very different
 * answers, and the handover points — the moments where custody changes hands —
 * are exactly where losses happen.
 *
 * So the stages here are not locations. They are custody states, and each one
 * says three things: who physically has it, who carries the loss, and what
 * evidence exists that the handover happened. That last column is the one that
 * settles disputes, and it is the reason this house photographs a piece in its
 * open case at the moment of sealing and again at the moment of opening.
 *
 * Two things are stated that most sellers leave vague:
 *
 *   - The carrier's own liability is a fixed, low figure — a few thousand
 *     rupees — regardless of what is in the box. The real cover is a separate
 *     specie policy that we buy per consignment, and it is in the price rather
 *     than an extra.
 *   - Signature-on-delivery is not the same as identity checked. We require
 *     photo ID matched to the order name for anything above two lakh, which
 *     annoys roughly one customer in twenty and has prevented every single
 *     misdelivery we have had a chance to prevent.
 */

interface Stage {
  id: string;
  name: string;
  holder: string;
  risk: 'house' | 'insurer' | 'carrier' | 'you';
  evidence: string;
  detail: string;
  /** Typical elapsed hours from dispatch. */
  hours: number;
}

const STAGES: Stage[] = [
  {
    id: 'bench',
    name: 'Final check',
    holder: 'The bench',
    risk: 'house',
    evidence: 'Bench sheet, signed by the setter and the checker — two people, never one.',
    detail:
      'The last thing that happens to a piece is that somebody who did not make it looks at it under a loupe. Claws, solder joins, hallmark, stone security, and the finish. About one piece in twelve goes back at this point, which is the whole reason the step exists.',
    hours: 0,
  },
  {
    id: 'seal',
    name: 'Sealed',
    holder: 'The house',
    risk: 'house',
    evidence: 'Photograph of the open case, timestamped, with the tamper seal number in frame.',
    detail:
      'The case is closed, a numbered tamper-evident seal goes over the opening, and the piece is photographed inside it before the lid comes down. If the seal number on your box does not match the number on the photograph in your email, do not open it — call us.',
    hours: 1,
  },
  {
    id: 'manifest',
    name: 'Manifested',
    holder: 'The house',
    risk: 'insurer',
    evidence: 'Specie policy certificate naming this consignment and its declared value.',
    detail:
      'The consignment is declared to our transit insurer at its full replacement value before it leaves the building. This is not the carrier’s liability, which is a fixed few thousand rupees whatever is in the box. It is a separate policy bought per consignment, and it is in the price rather than offered as an extra at checkout.',
    hours: 2,
  },
  {
    id: 'collected',
    name: 'Collected',
    holder: 'The carrier',
    risk: 'insurer',
    evidence: 'Driver’s signature against the seal number, plus the counter camera.',
    detail:
      'A named driver from a vetted valuables carrier, signing against the seal number rather than against a parcel count. The handover is on camera. This is the first custody change and it is one of the two points where things go wrong.',
    hours: 3,
  },
  {
    id: 'transit',
    name: 'In transit',
    holder: 'The carrier',
    risk: 'insurer',
    evidence: 'Live tracking, and a route that is not published to anyone including you.',
    detail:
      'You get a status, not a map. That is deliberate — a live position for a box of jewellery is a piece of information worth money to the wrong person, and we would rather answer an impatient phone call than publish it.',
    hours: 14,
  },
  {
    id: 'delivery',
    name: 'Delivered',
    holder: 'You',
    risk: 'you',
    evidence: 'Photo ID matched to the order name above ₹2,00,000. Signature alone below it.',
    detail:
      'The second point where things go wrong, and the one where a signature is not enough. Above two lakh we require photo identification matched to the name on the order — not a neighbour, not building security, not a signature scrawled by whoever answered the door.',
    hours: 26,
  },
  {
    id: 'opened',
    name: 'Opened',
    holder: 'You',
    risk: 'you',
    evidence: 'We ask for one photograph of the intact seal before you break it.',
    detail:
      'Risk has passed to you, and the thirty seconds that protect you are these: photograph the seal intact, then open it on camera if you can. Nobody has ever regretted doing this and two customers in fifteen years have regretted not doing it.',
    hours: 27,
  },
];

const RISK: Record<Stage['risk'], { label: string; tone: string }> = {
  house: { label: 'Ours', tone: 'var(--series-1)' },
  insurer: { label: 'Our insurer', tone: 'var(--series-3)' },
  carrier: { label: 'The carrier', tone: 'var(--series-2)' },
  you: { label: 'Yours', tone: 'var(--series-4)' },
};

export default function SecureTransitTracker({ className = '' }: { className?: string }) {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];
  const risk = RISK[stage.risk];

  return (
    <div className={className}>
      {/* The rail. Custody states rather than places, and the colour changes
          exactly where the responsibility does. */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-[13px] h-px bg-line-subtle" aria-hidden="true" />
        <motion.div
          className="absolute left-0 top-[13px] h-px bg-accent"
          animate={{ width: `${(active / (STAGES.length - 1)) * 100}%` }}
          transition={{ type: 'spring', stiffness: 160, damping: 26 }}
          aria-hidden="true"
        />

        <ol className="relative flex justify-between">
          {STAGES.map((s, i) => {
            const done = i <= active;
            return (
              <li key={s.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className="group flex flex-col items-center"
                >
                  <span
                    className={`mark-ring block h-[10px] w-[10px] rounded-full transition-all duration-300 ${
                      i === active ? 'scale-[1.6]' : ''
                    }`}
                    style={{
                      background: done
                        ? `rgb(${RISK[s.risk].tone})`
                        : 'rgb(var(--surface-sunken))',
                    }}
                  />
                  <span
                    className={`mt-3 max-w-[5.5rem] text-center font-accent text-[9px] uppercase leading-tight tracking-luxe transition-colors ${
                      i === active ? 'text-accent' : 'text-faint group-hover:text-accent'
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]"
      >
        <div>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h3 className="font-display text-3xl text-primary">{stage.name}</h3>
            <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-faint">
              about {stage.hours}h from the bench
            </span>
          </div>
          <p className="mt-4 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
            {stage.detail}
          </p>
        </div>

        <div className="space-y-3">
          <div className="spec-plate p-4">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              Physically holding it
            </p>
            <p className="mt-1 font-display text-xl text-primary">{stage.holder}</p>
          </div>

          <div className="spec-plate p-4">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              Carrying the loss
            </p>
            <p className="mt-1 flex items-center gap-2 font-display text-xl text-primary">
              <span
                className="series-swatch"
                style={{ background: `rgb(${risk.tone})` }}
                aria-hidden="true"
              />
              {risk.label}
            </p>
          </div>

          <div className="spec-plate p-4">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              What proves the handover
            </p>
            <p className="mt-1 font-sans text-sm font-light leading-relaxed text-secondary">
              {stage.evidence}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Legend, because four states are encoded and each is also named in
          full on the plate above — colour never carries it alone. */}
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-subtle pt-5">
        <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
          Who carries the loss
        </span>
        {(Object.keys(RISK) as Stage['risk'][]).map((key) => (
          <span
            key={key}
            className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted"
          >
            <span
              className="series-swatch"
              style={{ background: `rgb(${RISK[key].tone})` }}
              aria-hidden="true"
            />
            {RISK[key].label}
          </span>
        ))}
      </div>
    </div>
  );
}
