'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Eight chain weaves, and the one question about each that decides everything.
 *
 * The site already covers the fastening — `ClaspLibrary`, on the home page,
 * about how a necklace is closed. This is the other half and it is a different
 * subject entirely: what the chain itself is made of, structurally, and
 * therefore whether it survives.
 *
 * The single most useful fact in the whole panel is that most chain failures
 * are not failures of the metal. They are kinks. A chain that has kinked has
 * a link forced sideways out of its plane, and once one link is out of plane
 * the next one loads it edge-on and it opens. Which is why a herringbone that
 * has been folded once is finished — genuinely finished, not repairable — while
 * a cable chain of the same weight will take being sat on.
 *
 * So `kink` is the field that matters and it is the field nobody is given. The
 * rest — drape, repairability, whether it can carry a pendant at all — follows
 * from the same structural fact in each case.
 *
 * The maximum pendant weights are ours, taken off the bench rather than off a
 * supplier's sheet, and they are conservative on purpose. A chain rated to
 * carry twelve grams will carry twenty until the day it does not.
 */

interface Weave {
  id: string;
  name: string;
  /** How the links are drawn on a 200 × 60 strip. */
  render: (key: number, x: number) => React.ReactNode;
  /** Grams a 45cm chain of this weave will carry as a pendant, safely. */
  carries: number;
  /** 1 kinks if you look at it, 5 survives being sat on. */
  kink: number;
  /** 1 cannot be repaired, 5 any bench can fix it in ten minutes. */
  repair: number;
  drape: string;
  truth: string;
}

const link = (key: number, x: number, rx: number, ry: number, rotate = 0) => (
  <ellipse
    key={key}
    cx={x}
    cy={30}
    rx={rx}
    ry={ry}
    fill="none"
    stroke="rgb(var(--gold-400))"
    strokeWidth={2.4}
    transform={rotate ? `rotate(${rotate} ${x} 30)` : undefined}
  />
);

const WEAVES: Weave[] = [
  {
    id: 'cable',
    name: 'Cable',
    render: (k, x) => link(k, x, k % 2 ? 6 : 9, k % 2 ? 9 : 6),
    carries: 14,
    kink: 5,
    repair: 5,
    drape: 'Straight and slightly stiff. It hangs in a V rather than a curve, which suits a pendant and does not suit being worn alone.',
    truth:
      'The chain everything else is measured against, and the correct answer for a pendant nine times out of ten. Every link is an independent ring and each is soldered closed, so a failure is one link and a bench can put in a new one in ten minutes without touching the rest.',
  },
  {
    id: 'curb',
    name: 'Curb',
    render: (k, x) => link(k, x, 9, 6, 26),
    carries: 22,
    kink: 5,
    repair: 5,
    drape: 'Flat and heavy. It lies against the skin instead of standing off it, because every link is twisted into the same plane before it is soldered.',
    truth:
      'The strongest per gram on this list, and the reason is the twist: each link is flattened into the plane of the chain so a pull loads it along its length rather than across it. It is also the chain most often sold hollow, which halves the weight and quarters the strength.',
  },
  {
    id: 'rope',
    name: 'Rope',
    render: (k, x) => link(k, x, 7, 7, k * 24),
    carries: 18,
    kink: 4,
    repair: 3,
    drape: 'A true round section that turns as it hangs, so it catches light continuously rather than in flashes. The most alive of the eight to look at.',
    truth:
      'Four strands of small links wound as a helix. Brilliant, and expensive per gram because there are four times as many links as the section suggests. A break is repairable but the repair is visible — you cannot re-lay a helix invisibly.',
  },
  {
    id: 'box',
    name: 'Box',
    render: (k, x) => (
      <rect
        key={k}
        x={x - 7}
        y={23}
        width={14}
        height={14}
        rx={2}
        fill="none"
        stroke="rgb(var(--gold-400))"
        strokeWidth={2.4}
      />
    ),
    carries: 16,
    kink: 3,
    repair: 3,
    drape: 'Square section, so it hangs dead straight and does not twist. The chain of choice for anything that must not spin — a name plate, an asymmetric pendant.',
    truth:
      'Square links seated into each other. Very clean, and it has one weakness worth knowing: a box chain does not tolerate being bent tightly. A hard kink permanently flattens a link and that link is now a hinge, which is where it will break.',
  },
  {
    id: 'snake',
    name: 'Snake',
    render: (k, x) => (
      <rect
        key={k}
        x={x - 5}
        y={21}
        width={10}
        height={18}
        rx={4}
        fill="none"
        stroke="rgb(var(--gold-400))"
        strokeWidth={2.2}
      />
    ),
    carries: 8,
    kink: 1,
    repair: 1,
    drape: 'Smooth, liquid and utterly seamless. There is nothing else that hangs like it, which is why people keep buying it.',
    truth:
      'The one to be careful with. Tightly packed plates with almost no articulation, so a single sharp fold puts a permanent bright crease in it — and that crease cannot be removed, cannot be repaired invisibly and is usually the end of the chain. We will sell you one. We will also tell you not to take it off over your head.',
  },
  {
    id: 'figaro',
    name: 'Figaro',
    render: (k, x) => link(k, x, k % 4 === 0 ? 13 : 6, 6, 20),
    carries: 20,
    kink: 5,
    repair: 5,
    drape: 'Flat like a curb, with a rhythm to it. The long link every third or fourth is the whole design and it is why it reads as a chain rather than as a rope.',
    truth:
      'A curb chain with the pattern broken deliberately. Structurally it is a curb and it is nearly as strong; visually it is doing something a uniform chain cannot, which is giving the eye a repeat to follow. Excellent value, because the long links use less metal for the same length.',
  },
  {
    id: 'herringbone',
    name: 'Herringbone',
    render: (k, x) => (
      <path
        key={k}
        d={`M ${x - 6} 38 L ${x} 22 L ${x + 6} 38`}
        fill="none"
        stroke="rgb(var(--gold-400))"
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
    ),
    carries: 0,
    kink: 1,
    repair: 1,
    drape: 'A flat ribbon of gold, mirror-bright, that pours rather than hangs. Nothing else on this list looks remotely like it.',
    truth:
      'The most beautiful and the most fragile, and we would rather say so than sell you one quietly. Flat angled plates with no independent movement: fold it once and it kinks, and a kinked herringbone is scrap. It carries no pendant at all — the load concentrates at one point and pulls the weave apart. Wear it as the whole piece, store it flat, never in a box with anything else.',
  },
  {
    id: 'byzantine',
    name: 'Byzantine',
    render: (k, x) => (
      <g key={k}>
        {link(k * 2, x - 3, 6, 8)}
        {link(k * 2 + 1, x + 3, 8, 6, 45)}
      </g>
    ),
    carries: 24,
    kink: 5,
    repair: 2,
    drape: 'Dense, sculptural and heavy. It has real presence and it is the only chain here that reads as an object rather than as a support.',
    truth:
      'Four links locked into a repeating cell, which is why it is the strongest and the most flexible at once — the cells articulate against each other in every direction. The catch is repair: rebuilding a cell means opening the cells either side of it, and a bench charges for the hour that takes.',
  },
];

export default function ChainWeaveLibrary({ className = '' }: { className?: string }) {
  const [active, setActive] = useState(WEAVES[0].id);
  const weave = WEAVES.find((w) => w.id === active) ?? WEAVES[0];

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        {/* The rail of weaves, drawn rather than named. */}
        <div className="space-y-1.5">
          {WEAVES.map((w) => {
            const isActive = active === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setActive(w.id)}
                aria-pressed={isActive}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-accent bg-accent/[0.06]'
                    : 'border-transparent hover:border-hairline'
                }`}
              >
                <svg viewBox="0 0 120 60" className="h-8 w-24 flex-none" aria-hidden="true">
                  {Array.from({ length: 9 }, (_, i) => w.render(i, 8 + i * 13))}
                </svg>
                <span
                  className={`font-accent text-[10px] uppercase tracking-luxe transition-colors ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {w.name}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={weave.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* The weave, large, and swaying — a chain is a hanging thing. */}
          <div className="chart-surface overflow-hidden rounded-2xl px-4 py-8">
            <motion.svg
              viewBox="0 0 200 60"
              className="mx-auto h-16 w-full max-w-lg"
              aria-label={`${weave.name} chain`}
              role="img"
              animate={{ rotate: [-0.7, 0.7, -0.7] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '50% -180px' }}
            >
              {Array.from({ length: 15 }, (_, i) => weave.render(i, 8 + i * 13.5))}
            </motion.svg>
          </div>

          {/* Three measures, three separate bars. Deliberately not a single
              "quality" score — a herringbone is the best of these on one axis
              and the worst on the other two, and averaging that away would be
              the least useful thing this panel could do. */}
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              {
                label: 'Survives a kink',
                value: weave.kink,
                tone: 'var(--series-1)',
                suffix: '/5',
              },
              {
                label: 'Can be repaired',
                value: weave.repair,
                tone: 'var(--series-3)',
                suffix: '/5',
              },
              {
                label: 'Carries a pendant',
                value: weave.carries ? Math.min(5, Math.round(weave.carries / 5)) : 0,
                tone: 'var(--series-2)',
                suffix: weave.carries ? ` · ${weave.carries}g` : ' · none',
              },
            ].map((measure) => (
              <div key={measure.label}>
                <div className="flex items-baseline justify-between">
                  <span className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted">
                    <span
                      className="series-swatch"
                      style={{ background: `rgb(${measure.tone})` }}
                      aria-hidden="true"
                    />
                    {measure.label}
                  </span>
                  <span className="nums-instrument font-accent text-[9px] text-primary">
                    {measure.value}
                    {measure.suffix}
                  </span>
                </div>
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background:
                          n <= measure.value
                            ? `rgb(${measure.tone})`
                            : 'rgb(var(--surface-sunken))',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-6 border-t border-line-subtle pt-6 md:grid-cols-2">
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                How it hangs
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                {weave.drape}
              </p>
            </div>
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                What nobody says at the counter
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                {weave.truth}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
