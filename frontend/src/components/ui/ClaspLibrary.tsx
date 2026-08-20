'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

/**
 * The six fastenings this house fits, with the four numbers that actually differ
 * between them.
 *
 * Every score is a trade-off rather than a rating, on the same principle the
 * setting explorer follows: a box clasp scores highest on security and lowest on
 * one-handedness, and that is not a defect, it is what a box clasp is. Showing
 * these as stars would hide the fact that no fastening can win on all four.
 *
 * `oneHanded` is the score nobody publishes and everybody needs: whether the
 * wearer can do it up alone, behind their own neck, without help. It is the most
 * common reason a necklace is not worn, ahead of every aesthetic consideration.
 */
interface Clasp {
  id: string;
  name: string;
  alias?: string;
  /** 1–5. Resistance to opening under load or by accident. */
  security: number;
  /** 1–5. Whether it can be fastened alone, behind the neck. */
  oneHanded: number;
  /** 1–5. How invisible it is when worn. */
  discretion: number;
  /** 1–5. How easily a bench can repair or replace it. */
  serviceable: number;
  /** What it is, in one line. */
  what: string;
  /** Who should ask for it. */
  suits: string;
  /** The honest cost. */
  cost: string;
  /** Weight of chain it will carry, honestly. */
  carries: string;
}

const CLASPS: Clasp[] = [
  {
    id: 'spring-ring',
    name: 'Spring ring',
    security: 2,
    oneHanded: 2,
    discretion: 4,
    serviceable: 5,
    what: 'A hollow ring with a sprung gate, pushed open by a tiny lever. The default on almost every chain sold anywhere.',
    suits: 'Light chains that are taken off daily and are not carrying a heavy pendant.',
    cost: 'The spring is the thinnest piece of metal in the whole necklace and it is the part that fails. Assume five years.',
    carries: 'Up to about 8 grams of pendant. Beyond that the gate can be sprung open by the load itself.',
  },
  {
    id: 'lobster',
    name: 'Lobster claw',
    alias: 'trigger clasp',
    security: 4,
    oneHanded: 3,
    discretion: 3,
    serviceable: 5,
    what: 'A sprung claw with a broad thumb lever. The gate closes across the throat of the claw rather than along it.',
    suits: 'Anything with weight — a heavy pendant, a charm bracelet, a long chain worn doubled.',
    cost: 'Visibly bigger than a spring ring, and on a fine chain it looks like it belongs to a different necklace.',
    carries: '25 grams comfortably. The failure mode is the jump ring beside it, not the clasp.',
  },
  {
    id: 'box',
    name: 'Box clasp with safety',
    alias: 'tongue-and-box',
    security: 5,
    oneHanded: 1,
    discretion: 5,
    serviceable: 2,
    what: 'A folded tongue that snaps into a box, plus one or two hinged safety catches over the join. The traditional Indian and European fine-jewellery fastening.',
    suits: 'Bridal sets, kundan chokers, anything where the clasp has to disappear into the design.',
    cost: 'Almost impossible to fasten alone, and when it wears it needs a goldsmith rather than a repair kit — the tongue has to be re-tensioned.',
    carries: 'Anything. This is the fastening used on pieces that weigh a hundred grams.',
  },
  {
    id: 'magnetic',
    name: 'Magnetic barrel',
    security: 2,
    oneHanded: 5,
    discretion: 3,
    serviceable: 3,
    what: 'Two rare-earth magnets in matched barrels, usually with a hidden second catch on anything valuable.',
    suits: 'Arthritic hands, and anybody who has given up on a necklace because of the clasp. This is the accessibility answer and it should be offered by default.',
    cost: 'Shear force pulls it apart — it holds a straight pull far better than a sideways one. Never fit one without a secondary catch on a piece that matters.',
    carries: '15 grams, and only with the safety catch fitted.',
  },
  {
    id: 'toggle',
    name: 'Toggle and ring',
    alias: 'T-bar',
    security: 3,
    oneHanded: 4,
    discretion: 1,
    serviceable: 5,
    what: 'A bar dropped through a ring and turned across it. Held by geometry and the weight of the chain, with no spring anywhere.',
    suits: 'Heavy chains worn as the piece itself, where the clasp is meant to be seen at the front.',
    cost: 'It will come undone if the chain ever goes slack — which is what happens when you lie down.',
    carries: 'Any weight. There is nothing in it to fatigue.',
  },
  {
    id: 'screw',
    name: 'Screw barrel',
    security: 5,
    oneHanded: 1,
    discretion: 4,
    serviceable: 4,
    what: 'A threaded post into a threaded barrel. Nothing sprung, nothing hinged.',
    suits: 'Pieces that go on and stay on — a mangalsutra, a christening chain, anything not removed nightly.',
    cost: 'Fine threads in gold wear and cross-thread. Ten years of daily use will strip it, and it needs two hands and patience every time.',
    carries: 'Anything, until the thread wears.',
  },
];

const AXES = [
  { key: 'security', label: 'Holds', hint: 'Resistance to opening under load' },
  { key: 'oneHanded', label: 'Alone', hint: 'Can be fastened without help' },
  { key: 'discretion', label: 'Hides', hint: 'How invisible it is when worn' },
  { key: 'serviceable', label: 'Mends', hint: 'How easily a bench can fix it' },
] as const;

/**
 * The fastening, which is the part of a necklace nobody asks about and the part
 * that decides whether it gets worn.
 *
 * Two things make this more than a table. The drawing of each clasp actually
 * opens — the gate swings, the tongue withdraws, the magnets separate — so the
 * mechanism is visible rather than described, and a visitor can see for
 * themselves why a toggle needs tension and a box clasp does not. And the four
 * scores are drawn as opposed bars rather than as stars, so improving one
 * visibly costs another.
 *
 * The accessibility point is deliberately made in the copy rather than left
 * implicit. A magnetic clasp is the answer for arthritic hands and it is almost
 * never offered unless a customer knows to ask, which is a failure of the trade
 * rather than of the customer.
 */
export default function ClaspLibrary({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(CLASPS[1].id);
  const [open, setOpen] = useState(true);

  const clasp = CLASPS.find((c) => c.id === active) ?? CLASPS[0];

  return (
    <div className={`grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] ${className}`}>
      {/* The mechanism. */}
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-sunken p-6">
          <ClaspDrawing id={clasp.id} open={open} reduced={!!reduced} />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-4 w-full rounded-full border border-accent/50 py-2 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors duration-300 hover:bg-accent/10"
          >
            {open ? 'Close it' : 'Open it'}
          </button>
        </div>

        <p className="font-sans text-xs font-light leading-relaxed text-faint">
          {clasp.carries}
        </p>
      </div>

      {/* The choice, and the reading of it. */}
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {CLASPS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              aria-pressed={c.id === active}
              className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                c.id === active
                  ? 'border-accent/60 bg-accent/12 text-accent'
                  : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <motion.div
          key={clasp.id}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeCine.glass }}
          className="space-y-6 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:p-8"
        >
          <div>
            <h4 className="font-display text-2xl text-primary">
              {clasp.name}
              {clasp.alias && (
                <span className="ml-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
                  also “{clasp.alias}”
                </span>
              )}
            </h4>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
              {clasp.what}
            </p>
          </div>

          {/* The four axes. Bars against a fixed five-point scale, so a short bar
              is genuinely short rather than short relative to this row. */}
          <div className="grid gap-4 sm:grid-cols-2">
            {AXES.map((axis) => {
              const value = clasp[axis.key];
              return (
                <div key={axis.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                      {axis.label}
                    </span>
                    <span className="nums-tabular font-accent text-[10px] text-faint">
                      {value}/5
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <motion.span
                        key={seg}
                        initial={false}
                        animate={{
                          opacity: seg <= value ? 1 : 0.16,
                          scaleY: seg <= value ? 1 : 0.4,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: reduced ? 0 : seg * 0.04,
                          ease: easeCine.glass,
                        }}
                        className="h-1.5 flex-1 origin-bottom rounded-full bg-accent"
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 font-sans text-[11px] font-light text-faint">{axis.hint}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-5 border-t border-hairline pt-5 sm:grid-cols-2">
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-jade-300">
                Ask for it if
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                {clasp.suits}
              </p>
            </div>
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-burgundy-300">
                What it costs you
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                {clasp.cost}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * The drawings. Each clasp is two rigid halves and one moving part, and the
 * moving part is what is animated — so the geometry is honest about what
 * actually moves rather than sliding the whole assembly apart.
 */
function ClaspDrawing({ id, open, reduced }: { id: string; open: boolean; reduced: boolean }) {
  const t = { duration: reduced ? 0 : 0.7, ease: easeCine.catch };
  const gold = 'rgb(var(--gold-400))';
  const dim = 'rgb(var(--gold-700))';

  return (
    <svg viewBox="0 0 240 120" className="w-full" role="img" aria-label={`${id} clasp, ${open ? 'open' : 'closed'}`}>
      {/* The chain either side. Always present, so the clasp is read in context
          rather than as an isolated object. */}
      {[0, 1].map((side) => (
        <g key={side}>
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx={side === 0 ? 14 + i * 16 : 226 - i * 16}
              cy={60}
              rx={i % 2 ? 8 : 5}
              ry={i % 2 ? 5 : 8}
              fill="none"
              stroke={dim}
              strokeWidth={2}
            />
          ))}
        </g>
      ))}

      {id === 'spring-ring' && (
        <>
          <circle cx={104} cy={60} r={22} fill="none" stroke={gold} strokeWidth={3} />
          {/* The gate: a short arc that swings inward on a pivot at its base. */}
          <motion.path
            d="M 104 38 A 22 22 0 0 1 122 52"
            fill="none"
            stroke="rgb(var(--gold-100))"
            strokeWidth={3.4}
            strokeLinecap="round"
            style={{ transformOrigin: '104px 38px' }}
            animate={{ rotate: open ? -46 : 0 }}
            transition={t}
          />
          <motion.circle
            cx={148}
            cy={60}
            r={13}
            fill="none"
            stroke={gold}
            strokeWidth={2.6}
            animate={{ x: open ? 20 : 0 }}
            transition={t}
          />
        </>
      )}

      {id === 'lobster' && (
        <>
          <path
            d="M 92 60 C 92 34, 132 34, 132 60 C 132 84, 92 84, 92 60 Z"
            fill="none"
            stroke={gold}
            strokeWidth={3}
          />
          {/* The claw's gate crosses the throat, so it withdraws sideways. */}
          <motion.line
            x1={132}
            y1={44}
            x2={132}
            y2={76}
            stroke="rgb(var(--gold-100))"
            strokeWidth={4}
            strokeLinecap="round"
            animate={{ x: open ? -16 : 0 }}
            transition={t}
          />
          <motion.circle
            cx={160}
            cy={60}
            r={13}
            fill="none"
            stroke={gold}
            strokeWidth={2.6}
            animate={{ x: open ? 22 : 0 }}
            transition={t}
          />
        </>
      )}

      {id === 'box' && (
        <>
          <rect x={110} y={42} width={44} height={36} rx={4} fill="none" stroke={gold} strokeWidth={3} />
          {/* The tongue withdraws along its own axis — it does not hinge. */}
          <motion.path
            d="M 108 60 L 84 60 M 84 50 L 84 70"
            fill="none"
            stroke="rgb(var(--gold-100))"
            strokeWidth={3.4}
            strokeLinecap="round"
            animate={{ x: open ? -26 : 0 }}
            transition={t}
          />
          {/* The safety catch, hinged over the join. */}
          <motion.path
            d="M 116 42 L 148 42"
            stroke={gold}
            strokeWidth={3}
            strokeLinecap="round"
            style={{ transformOrigin: '116px 42px' }}
            animate={{ rotate: open ? -68 : 0 }}
            transition={{ ...t, delay: reduced ? 0 : open ? 0 : 0.2 }}
          />
        </>
      )}

      {id === 'magnetic' && (
        <>
          <motion.rect
            x={86}
            y={46}
            width={34}
            height={28}
            rx={14}
            fill="none"
            stroke={gold}
            strokeWidth={3}
            animate={{ x: open ? -20 : 0 }}
            transition={t}
          />
          <motion.rect
            x={122}
            y={46}
            width={34}
            height={28}
            rx={14}
            fill="none"
            stroke={gold}
            strokeWidth={3}
            animate={{ x: open ? 20 : 0 }}
            transition={t}
          />
          {/* Field lines between the barrels, which only exist while closed. */}
          <motion.g animate={{ opacity: open ? 0 : 0.8 }} transition={t}>
            {[52, 60, 68].map((y) => (
              <line key={y} x1={116} y1={y} x2={126} y2={y} stroke="rgb(var(--gold-100))" strokeWidth={1.4} />
            ))}
          </motion.g>
        </>
      )}

      {id === 'toggle' && (
        <>
          <circle cx={104} cy={60} r={21} fill="none" stroke={gold} strokeWidth={3} />
          {/* The bar turns across the ring rather than sliding out of it. */}
          <motion.rect
            x={92}
            y={57}
            width={54}
            height={6}
            rx={3}
            fill="none"
            stroke="rgb(var(--gold-100))"
            strokeWidth={2.6}
            style={{ transformOrigin: '119px 60px' }}
            animate={{ rotate: open ? 0 : 84, x: open ? 26 : 0 }}
            transition={t}
          />
        </>
      )}

      {id === 'screw' && (
        <>
          <rect x={116} y={46} width={40} height={28} rx={5} fill="none" stroke={gold} strokeWidth={3} />
          {/* The post rotates as it withdraws, which is the only honest way to
              draw a thread coming undone. */}
          <motion.g
            style={{ transformOrigin: '100px 60px' }}
            animate={{ x: open ? -26 : 0, rotate: open ? -720 : 0 }}
            transition={{ duration: reduced ? 0 : 1.1, ease: easeCine.heavy }}
          >
            <line x1={84} y1={60} x2={118} y2={60} stroke="rgb(var(--gold-100))" strokeWidth={3.4} strokeLinecap="round" />
            {[96, 104, 112].map((x) => (
              <line key={x} x1={x} y1={54} x2={x} y2={66} stroke={dim} strokeWidth={1.6} />
            ))}
          </motion.g>
        </>
      )}
    </svg>
  );
}
