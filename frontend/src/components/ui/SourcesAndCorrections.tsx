'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Where the journal's figures came from, and where it has been wrong.
 *
 * A jeweller's journal that publishes numbers — carat premiums, hardness
 * scales, mine output, wage figures — is doing journalism whether it admits it
 * or not, and a house that has spent this whole site insisting on the
 * difference between a claim and evidence cannot then print figures with no
 * provenance.
 *
 * Two halves, and the second is the one that costs something.
 *
 * The sources half is straightforward: what was used, whether it is
 * independent, and whether we paid for it. That last column matters — a figure
 * from a trade body funded by the people it reports on is not the same kind of
 * fact as one from a laboratory with no position, and pretending otherwise is
 * how a marketing page ends up looking like a reference work.
 *
 * The corrections half is a public log of things this journal has got wrong,
 * with the original wording preserved rather than quietly replaced. Almost
 * nobody does this and it is the cheapest credibility available: a publication
 * with no corrections page has either never been wrong or never admitted it,
 * and only one of those is believable.
 */

interface Source {
  id: string;
  name: string;
  what: string;
  independence: 'independent' | 'trade' | 'ours';
  paid: boolean;
}

const SOURCES: Source[] = [
  {
    id: 'gia',
    name: 'Gemmological laboratory reports',
    what: 'Every clarity, colour and cut figure quoted anywhere on this site, plus the fluorescence discounts.',
    independence: 'independent',
    paid: true,
  },
  {
    id: 'mohs',
    name: 'Published mineralogical constants',
    what: 'Hardness, refractive index and specific gravity in the stone library. These are physical constants and are not in dispute.',
    independence: 'independent',
    paid: false,
  },
  {
    id: 'bis',
    name: 'Bureau of Indian Standards',
    what: 'Hallmarking marks, fineness definitions and the assay office codes.',
    independence: 'independent',
    paid: false,
  },
  {
    id: 'council',
    name: 'Trade council output figures',
    what: 'Production and export volumes where they appear in journal pieces.',
    independence: 'trade',
    paid: false,
  },
  {
    id: 'bench',
    name: 'This workshop’s own records',
    what: 'Every bench-hour figure, every yield estimate, the repair frequencies, the service intervals, and the wear rates.',
    independence: 'ours',
    paid: false,
  },
  {
    id: 'fixing',
    name: 'Daily metal fixing',
    what: 'The rate ticker and every rupee figure derived from it.',
    independence: 'independent',
    paid: true,
  },
];

const INDEPENDENCE: Record<Source['independence'], { label: string; tone: string; note: string }> = {
  independent: {
    label: 'Independent',
    tone: 'var(--series-1)',
    note: 'No commercial relationship with the outcome.',
  },
  trade: {
    label: 'Trade body',
    tone: 'var(--series-2)',
    note: 'Funded by the industry it reports on. Useful, and not neutral.',
  },
  ours: {
    label: 'Ours',
    tone: 'var(--series-3)',
    note: 'Our own records. We have an interest, and you should read it that way.',
  },
};

interface Correction {
  id: string;
  date: string;
  piece: string;
  was: string;
  now: string;
  how: string;
}

const CORRECTIONS: Correction[] = [
  {
    id: 'c-4',
    date: '2026-06-02',
    piece: 'What a carat actually is',
    was: 'We wrote that a two-carat stone is “about a third wider” than a one-carat stone.',
    now: 'It is about 26% wider. Width goes as the cube root of weight, and a third was a rounding that became a claim.',
    how: 'A reader with a vernier caliper and two stones. They were right and they were polite about it.',
  },
  {
    id: 'c-3',
    date: '2026-03-19',
    piece: 'The rhodium question',
    was: 'We said white gold plating “lasts around five years”.',
    now: 'Two to four on a ring worn daily, and longer on earrings, which are barely touched. The five-year figure came from a supplier’s sheet and our own repair book disagrees with it.',
    how: 'Our own records, when somebody finally counted them.',
  },
  {
    id: 'c-2',
    date: '2025-11-08',
    piece: 'Sourcing, and what we can prove',
    was: 'An early version of the provenance page described one supply route as “fully traceable”.',
    now: 'Traceable to the exporter, not to the pit. That is a meaningful claim and it is a smaller one, and the page now says which.',
    how: 'Internal review before an audit, which is the least impressive way to catch something.',
  },
  {
    id: 'c-1',
    date: '2025-07-24',
    piece: 'Meenakari, the colours and the order',
    was: 'We listed the firing order as coolest colour first.',
    now: 'Hardest and highest-firing first, coolest last, because each firing re-melts everything below it.',
    how: 'A Jaipur workshop we commission from, who were kind enough to telephone rather than post about it.',
  },
];

export default function SourcesAndCorrections({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState<'sources' | 'corrections'>('sources');
  const [open, setOpen] = useState<string | null>(CORRECTIONS[0].id);

  return (
    <div className={className}>
      <div className="mb-8 flex gap-2 border-b border-line-subtle pb-4">
        {(
          [
            { id: 'sources' as const, label: 'Where the figures come from' },
            { id: 'corrections' as const, label: `Corrections (${CORRECTIONS.length})` },
          ]
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`relative rounded-full px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
              tab === t.id ? 'text-onaccent' : 'text-muted hover:text-accent'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="sources-tab"
                className="absolute inset-0 -z-10 rounded-full bg-accent shadow-gold"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'sources' ? (
          <motion.div
            key="sources"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Legend. Three independence states, each named in full on every
                row as well as coloured. */}
            <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
              {(Object.keys(INDEPENDENCE) as Source['independence'][]).map((k) => (
                <span
                  key={k}
                  className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted"
                >
                  <span
                    className="series-swatch"
                    style={{ background: `rgb(${INDEPENDENCE[k].tone})` }}
                    aria-hidden="true"
                  />
                  {INDEPENDENCE[k].label} — {INDEPENDENCE[k].note}
                </span>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline">
                    {['Source', 'What it carries', 'Standing', 'Paid for'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-3 py-3 font-accent text-[10px] uppercase tracking-luxe text-muted"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SOURCES.map((s, i) => {
                    const ind = INDEPENDENCE[s.independence];
                    return (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                        className="border-b border-line-subtle last:border-0"
                      >
                        <th
                          scope="row"
                          className="px-3 py-4 font-display text-lg font-normal text-primary"
                        >
                          {s.name}
                        </th>
                        <td className="px-3 py-4 font-sans text-sm font-light leading-relaxed text-muted">
                          {s.what}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-secondary">
                            <span
                              className="series-swatch"
                              style={{ background: `rgb(${ind.tone})` }}
                              aria-hidden="true"
                            />
                            {ind.label}
                          </span>
                        </td>
                        <td className="px-3 py-4 font-accent text-[10px] uppercase tracking-luxe text-faint">
                          {s.paid ? 'Yes' : 'No'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-6 max-w-3xl font-sans text-sm font-light leading-relaxed text-muted">
              A third of the figures on this site are our own, and that is the
              row to read sceptically. We publish our bench hours, our yields and
              our repair frequencies because they are the only numbers we can
              actually vouch for — and because a house that will not show its own
              working has no business quoting anybody else’s.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="corrections"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-1">
              {CORRECTIONS.map((c) => {
                const isOpen = open === c.id;
                const d = new Date(`${c.date}T00:00:00`);
                return (
                  <div key={c.id} className="border-b border-line-subtle">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : c.id)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-baseline justify-between gap-5 py-4 text-left"
                    >
                      <span className="min-w-0">
                        <span className="nums-instrument font-accent text-[9px] uppercase tracking-luxe text-faint">
                          {d.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="mt-1 block font-display text-xl text-primary transition-colors group-hover:text-accent">
                          {c.piece}
                        </span>
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-none font-accent text-lg leading-none text-accent"
                        aria-hidden="true"
                      >
                        +
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-5 pb-6 md:grid-cols-3">
                            <div>
                              <p className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                                What we published
                              </p>
                              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted line-through decoration-burgundy-300/60">
                                {c.was}
                              </p>
                            </div>
                            <div>
                              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                                What is true
                              </p>
                              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                                {c.now}
                              </p>
                            </div>
                            <div>
                              <p className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                                Who caught it
                              </p>
                              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                                {c.how}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 max-w-3xl font-sans text-sm font-light leading-relaxed text-muted">
              The original wording stays. Quietly editing a published figure and
              saying nothing is the most common thing a website does and the
              least defensible — if a number was wrong for eight months, the
              people who read it during those eight months are owed the note.
              Found something else? The address is at the foot of every page and
              two of the four above arrived that way.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
