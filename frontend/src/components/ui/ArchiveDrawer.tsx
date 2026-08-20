'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeMachine } from '@/lib/motion';

/**
 * The house archive, as the cabinet it actually lives in.
 *
 * The site tells the history twice already — as a timeline and as a set of
 * claims with evidence attached. Both are arguments. This is the *holdings*: what
 * physically exists in the room upstairs, what condition it is in, and what is
 * missing from it.
 *
 * The missing entries are the reason this is worth building. Every heritage
 * archive has gaps and almost none of them are published, which lets a house
 * imply continuity it cannot document. Ours has a five-year hole in the middle of
 * the 1940s where the ledgers were used for something else, and a drawer of
 * drawings nobody can attribute. Printing that is more convincing than printing
 * the parts that survived.
 *
 * The drawers open on Z rather than on Y, which matters: a drawer that slides
 * down is a disclosure widget, and a drawer that comes *out of* a cabinet is a
 * drawer. The shadow thrown back onto the carcass is what carries it — a drawer
 * with no shadow reads as a card sliding on a flat plane, and that is the single
 * detail most accordion-as-furniture treatments miss.
 */
interface Drawer {
  id: string;
  label: string;
  years: string;
  /** How many items, or 'unknown' where the count itself was lost. */
  count: string;
  /** Condition, in a conservator's terms rather than a marketer's. */
  condition: 'sound' | 'fragile' | 'partial' | 'lost';
  contents: string;
  /** What is not there, stated plainly. */
  gap?: string;
}

const DRAWERS: Drawer[] = [
  {
    id: 'ledgers-1',
    label: 'Day ledgers',
    years: '1892–1931',
    count: '39 volumes',
    condition: 'sound',
    contents:
      'Every transaction, in three hands. The first volume opens on the 14th of March 1892 with a pair of gold bangles at eleven rupees and closes the same day on a repair to somebody else’s necklace, which tells you exactly what kind of shop this was.',
  },
  {
    id: 'ledgers-2',
    label: 'Day ledgers',
    years: '1932–1948',
    count: '11 of 17 volumes',
    condition: 'partial',
    contents:
      'The surviving volumes are in good order and the hand is the founder’s son throughout.',
    gap: 'Six volumes covering 1943 to 1947 were cut up for paper during the shortage and used as pattern backing. We know this because two of the drawings in the third drawer are on the reverse of a ledger page, and the entries on the back are legible.',
  },
  {
    id: 'drawings',
    label: 'Working drawings',
    years: '1904–present',
    count: 'about 4,100',
    condition: 'sound',
    contents:
      'Full-size pencil drawings, most on tracing paper, a few on the backs of other things. Filed by commission number where the number survived and by decade where it did not.',
    gap: 'Roughly six hundred are unattributed — no number, no name, no date. Several are clearly by a hand we cannot identify at all and are better than anything else in the drawer, which is a fact we have stopped trying to explain.',
  },
  {
    id: 'punches',
    label: 'Punches and hallmarks',
    years: '1892–present',
    count: '214 punches',
    condition: 'sound',
    contents:
      'Every maker’s mark the house has used, including the two we retired. Steel, hand-cut, and all but nine still capable of striking. They are kept in the original box, which is itself the oldest object in the building.',
  },
  {
    id: 'photographs',
    label: 'Photographs',
    years: '1911–1979',
    count: '1,340 prints, 88 glass plates',
    condition: 'fragile',
    contents:
      'Bench photographs, shop fronts, and a run of portraits of customers wearing what they had just bought — which was standard practice here until about 1960 and is the most useful record in the building for dating a piece.',
    gap: 'The glass plates are separating and cannot be handled. They have been scanned; the originals are now boxed flat and will not be opened again.',
  },
  {
    id: 'correspondence',
    label: 'Correspondence',
    years: '1898–1962',
    count: '2 crates, unsorted',
    condition: 'fragile',
    contents:
      'Letters to and from stone dealers, mostly Colombo and Bombay, plus a long and increasingly irritable exchange with a Jaipur cutter about a parcel of emeralds that never arrived.',
    gap: 'Unsorted, and it will stay unsorted for some years yet — cataloguing it properly is roughly eighteen months of somebody’s life and we would rather spend it on the bench.',
  },
  {
    id: 'moulds',
    label: 'Moulds and models',
    years: '1920s–1990s',
    count: 'about 900',
    condition: 'partial',
    contents:
      'Rubber and later silicone moulds, plus the brass masters they were taken from. The masters are the valuable half — a mould perishes and a master does not.',
    gap: 'Every rubber mould made before about 1970 has hardened and cracked. They are kept because the master survives in perhaps a third of cases and can be re-moulded; the rest are a record of designs that can no longer be reproduced.',
  },
  {
    id: 'accounts-1940s',
    label: 'Accounts',
    years: '1943–1947',
    count: 'nothing',
    condition: 'lost',
    contents: '',
    gap: 'This drawer is empty and we keep it in the cabinet anyway. Five years of the house’s working life are simply not recorded — the ledgers went for paper, the correspondence for the same, and the two people who could have reconstructed any of it died in 1961 and 1974.',
  },
];

const CONDITION = {
  sound: { label: 'Sound', tone: 'text-jade-500' },
  fragile: { label: 'Fragile — handling restricted', tone: 'text-accent' },
  partial: { label: 'Incomplete', tone: 'text-accent' },
  lost: { label: 'Lost', tone: 'text-burgundy-500' },
} as const;

export default function ArchiveDrawer() {
  const [open, setOpen] = useState<string | null>('accounts-1940s');
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto max-w-4xl">
      {/* The carcass. A real container rather than a list wrapper: the drawers
          have to come out of something or the depth means nothing. */}
      <div className="perspective-900 rounded-2xl border border-hairline bg-surface-sunken/70 p-3 shadow-inset md:p-4">
        <ul className="space-y-2" style={{ transformStyle: 'preserve-3d' }}>
          {DRAWERS.map((d) => {
            const isOpen = open === d.id;
            const cond = CONDITION[d.condition];

            return (
              <li key={d.id} style={{ transformStyle: 'preserve-3d' }}>
                <motion.div
                  animate={
                    reduced
                      ? {}
                      : {
                          z: isOpen ? 74 : 0,
                          y: isOpen ? 6 : 0,
                          boxShadow: isOpen
                            ? '0 26px 54px -22px rgb(0 0 0 / 0.55)'
                            : '0 0 0 0 rgb(0 0 0 / 0)',
                        }
                  }
                  transition={{ type: 'spring', stiffness: 190, damping: 26, mass: 0.9 }}
                  className={`rounded-lg border bg-surface-raised/60 ${
                    isOpen ? 'border-accent/40' : 'border-hairline'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : d.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    {/* The pull. Brass, and it is the thing the eye goes to —
                        which is why the label sits beside it rather than above. */}
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-9 shrink-0 rounded-full bg-metal-bar opacity-80"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-display text-lg text-primary">{d.label}</span>
                        <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-faint">
                          {d.years}
                        </span>
                      </span>
                      <span
                        className={`mt-1 block font-accent text-[10px] uppercase tracking-luxe ${cond.tone}`}
                      >
                        {d.count} · {cond.label}
                      </span>
                    </span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={
                      reduced ? { duration: 0 } : { duration: 0.5, ease: easeMachine.ratchet }
                    }
                    className="overflow-hidden"
                  >
                    <div className="border-t border-hairline px-5 pb-5 pt-4">
                      {d.contents && (
                        <p className="font-sans text-sm font-light leading-relaxed text-muted">
                          {d.contents}
                        </p>
                      )}

                      {/* The gap. Set apart, because it is the part of an archive
                          nobody publishes and therefore the part worth reading. */}
                      {d.gap && (
                        <div className="mt-4 border-l-2 border-burgundy-500/40 pl-4">
                          <p className="font-accent text-[10px] uppercase tracking-luxe text-burgundy-500">
                            What is not here
                          </p>
                          <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                            {d.gap}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-8 font-sans text-sm font-light leading-relaxed text-muted">
        The archive is not open to the public and it is open to any customer who asks, by
        appointment, for as long as they want. If you own something of ours we will look for it in
        here — a commission number on the inside of a shank is usually enough to find the drawing,
        and the drawing is usually more interesting than the piece.
      </p>
    </div>
  );
}
