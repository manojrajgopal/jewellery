'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { useOwnedPieces, type OwnedPiece } from '@/hooks/useOwnedPieces';
import { easeCine, springsSilk } from '@/lib/motion';

/**
 * What the collection is made of, and what is missing from it.
 *
 * The vault already lists the pieces and tells you which are due a service. That
 * is an inventory. This is the *shape* of it — and the shape is the thing an
 * owner cannot see, because they acquired the pieces one at a time over decades
 * and each decision was made against an occasion rather than against the
 * collection.
 *
 * The result is nearly always the same and nearly always a surprise: four rings
 * and nothing for the neck, or six occasion pieces and nothing that survives a
 * working day. Naming the gap is more useful than praising the holdings, and it
 * is the one thing a jeweller can say that a customer cannot work out for
 * themselves from a list.
 *
 * Two honest constraints on this:
 *
 *  - The gaps are *observations*, not prescriptions. A person with no earrings
 *    may not have pierced ears, and a tool that tells them to buy earrings is
 *    worse than one that says nothing. So the phrasing is always what is absent
 *    rather than what to acquire, and there is no price anywhere in it.
 *  - It reads only what the owner has entered themselves. Nothing here is
 *    inferred from what they have browsed or saved, because a wishlist and a
 *    collection are different objects and merging them makes the whole readout
 *    a sales instrument.
 */
const KINDS: { id: OwnedPiece['kind']; label: string; absent: string }[] = [
  {
    id: 'ring',
    label: 'Rings',
    absent:
      'No rings recorded. The most common first piece, and the one most likely to have been inherited rather than bought — worth adding even if it is not ours.',
  },
  {
    id: 'necklace',
    label: 'For the neck',
    absent:
      'Nothing for the neck. The commonest gap of all, because a necklace is rarely bought for oneself and almost always given.',
  },
  {
    id: 'earrings',
    label: 'Earrings',
    absent:
      'No earrings recorded — which is either a gap or simply a fact about you, and we are not going to guess which.',
  },
  {
    id: 'bracelet',
    label: 'For the wrist',
    absent:
      'Nothing for the wrist. The piece people most often say they would wear daily and least often own, usually because a bracelet has to survive a desk and most do not.',
  },
  {
    id: 'other',
    label: 'Other',
    absent: 'No brooches, pins or objects. A category that has quietly come back.',
  },
];

const WEARS: { id: OwnedPiece['wear']; label: string; note: string }[] = [
  { id: 'daily', label: 'Every day', note: 'The pieces that define how you look. Also the ones that wear out.' },
  { id: 'weekly', label: 'Weekly', note: 'The working middle of a collection, and usually the smallest part of it.' },
  { id: 'occasional', label: 'Occasions', note: 'Where most collections are heaviest and where the least wear happens.' },
  { id: 'vault', label: 'In the safe', note: 'Kept rather than worn. Nothing wrong with it, as long as it is a decision.' },
];

export default function PortfolioBalance() {
  const { items, hydrated } = useOwnedPieces();
  const reduced = useReducedMotion();

  const byKind = useMemo(() => {
    const counts = new Map<OwnedPiece['kind'], number>();
    items.forEach((p) => counts.set(p.kind, (counts.get(p.kind) ?? 0) + 1));
    return counts;
  }, [items]);

  const byWear = useMemo(() => {
    const counts = new Map<OwnedPiece['wear'], number>();
    items.forEach((p) => counts.set(p.wear, (counts.get(p.wear) ?? 0) + 1));
    return counts;
  }, [items]);

  const set = items.filter((p) => p.stones).length;

  /* The oldest and newest acquisitions, which together say how long this
     collection has been forming — a figure nobody has ever seen about their own
     jewellery and the one that most often changes how they think about it. */
  const span = useMemo(() => {
    if (items.length < 2) return null;
    const dates = items
      .map((p) => p.acquired)
      .filter(Boolean)
      .sort();
    if (dates.length < 2) return null;
    const first = new Date(dates[0]);
    const last = new Date(dates[dates.length - 1]);
    const years = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return { years: Math.max(0, years), from: dates[0].slice(0, 4), to: dates[dates.length - 1].slice(0, 4) };
  }, [items]);

  const gaps = KINDS.filter((k) => !byKind.get(k.id));
  const max = Math.max(1, ...KINDS.map((k) => byKind.get(k.id) ?? 0));

  /* Which way the beam hangs. Signed, −1 to 1: negative when most of the
     collection is in circulation, positive when most of it is waiting. Computed
     from counts rather than from the verdict below, so the drawing and the
     sentence can never disagree. */
  const wornCount = (byWear.get('daily') ?? 0) + (byWear.get('weekly') ?? 0);
  const keptCount = (byWear.get('occasional') ?? 0) + (byWear.get('vault') ?? 0);
  const tilt = items.length
    ? Math.max(-1, Math.min(1, (keptCount - wornCount) / items.length))
    : 0;

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-hairline bg-surface-raised/30 p-8">
        <p className="font-accent text-[10px] uppercase tracking-luxe text-faint">Reading your vault…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-hairline bg-surface-raised/30 p-8 text-center">
        <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">Nothing recorded yet</p>
        <p className="mt-3 font-display text-xl leading-snug text-primary">
          Add a few pieces above and this reads the shape of them back to you.
        </p>
        <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
          It stays on your own device — we never see it. Include the pieces we did not make; a
          collection is not a purchase history, and the inherited things are usually the ones that
          decide what is missing.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* The headline figures. Three, because a fourth would be filler. */}
      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">Pieces</dt>
          <dd className="nums-instrument mt-1 font-display text-4xl text-primary">{items.length}</dd>
        </div>
        <div>
          <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">Set with stones</dt>
          <dd className="nums-instrument mt-1 font-display text-4xl text-accent">{set}</dd>
        </div>
        <div>
          <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">Categories held</dt>
          <dd className="nums-instrument mt-1 font-display text-4xl text-primary">
            {KINDS.length - gaps.length}
            <span className="font-accent text-base text-faint">/{KINDS.length}</span>
          </dd>
        </div>
        <div>
          <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">Formed over</dt>
          <dd className="nums-instrument mt-1 font-display text-4xl text-primary">
            {span ? `${span.years.toFixed(0)}y` : '—'}
          </dd>
        </div>
      </dl>

      {span && span.years >= 1 && (
        <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
          From <span className="nums-instrument text-primary">{span.from}</span> to{' '}
          <span className="nums-instrument text-primary">{span.to}</span>. Almost nobody thinks of
          their jewellery as something assembled over decades until they see the two dates next to
          each other.
        </p>
      )}

      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        {/* ---- By category ---- */}
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            What it is made of
          </p>

          <ul className="mt-5 space-y-4">
            {KINDS.map((k) => {
              const n = byKind.get(k.id) ?? 0;
              return (
                <li key={k.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className={`font-display text-base ${n ? 'text-primary' : 'text-faint'}`}
                    >
                      {k.label}
                    </span>
                    <span className="nums-instrument shrink-0 font-accent text-[10px] uppercase tracking-luxe text-faint">
                      {n || '—'}
                    </span>
                  </div>
                  {/* Bars scaled to the largest holding rather than to the total,
                      so a collection of two rings still draws a readable chart. */}
                  <span className="mt-2 block h-1 rounded-full bg-line/40">
                    <motion.span
                      className={`block h-full rounded-full ${n ? 'bg-accent' : 'bg-transparent'}`}
                      initial={false}
                      animate={{ width: `${(n / max) * 100}%` }}
                      transition={reduced ? { duration: 0 } : springsSilk.readout}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---- By how hard it is worn ---- */}
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            How hard it is worn
          </p>

          {/* A single stacked bar rather than four separate ones: the question
              here is about proportion, and four bars make the reader do the
              division themselves. */}
          <div className="mt-5 flex h-3 overflow-hidden rounded-full border border-hairline">
            {WEARS.map((w) => {
              const n = byWear.get(w.id) ?? 0;
              if (!n) return null;
              return (
                <motion.span
                  key={w.id}
                  initial={false}
                  animate={{ width: `${(n / items.length) * 100}%` }}
                  transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeCine.glass }}
                  className={
                    w.id === 'daily'
                      ? 'bg-accent'
                      : w.id === 'weekly'
                        ? 'bg-accent/65'
                        : w.id === 'occasional'
                          ? 'bg-accent/40'
                          : 'bg-accent/20'
                  }
                  title={`${w.label}: ${n}`}
                />
              );
            })}
          </div>

          <ul className="mt-5 space-y-4">
            {WEARS.map((w) => {
              const n = byWear.get(w.id) ?? 0;
              return (
                <li key={w.id} className="flex items-start gap-3">
                  <span className="nums-instrument w-6 shrink-0 pt-0.5 font-accent text-[11px] text-accent">
                    {n || '—'}
                  </span>
                  <span>
                    <span className={`block font-display text-base ${n ? 'text-primary' : 'text-faint'}`}>
                      {w.label}
                    </span>
                    <span className="mt-0.5 block font-sans text-sm font-light leading-relaxed text-muted">
                      {w.note}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ---- The gaps ---- */}
      {gaps.length > 0 && (
        <div className="mt-14 border-t border-hairline pt-10">
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            What is not here
          </p>
          <p className="mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
            Observations rather than suggestions, and there is no price anywhere in them. A gap is
            often just a fact about a person — and a tool that reads &ldquo;no earrings&rdquo; as
            &ldquo;buy earrings&rdquo; is a worse tool than one that says nothing.
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {gaps.map((g) => (
              <li
                key={g.id}
                className="rounded-xl border border-hairline bg-surface-raised/30 p-5"
              >
                <p className="font-display text-lg text-primary">{g.label}</p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                  {g.absent}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The one genuinely actionable reading: heavy on occasions, light on
          daily. This is the imbalance that makes a collection go unworn, and it
          is worth naming because the answer is usually not a purchase. */}
      {(byWear.get('occasional') ?? 0) + (byWear.get('vault') ?? 0) >
        (byWear.get('daily') ?? 0) * 2 &&
        items.length >= 3 && (
          <div className="mt-10 rounded-2xl border border-accent/30 bg-accent/5 p-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              One thing worth saying
            </p>
            <p className="mt-3 font-display text-xl leading-snug text-primary">
              Most of this is waiting for an occasion.
            </p>
            {/* The imbalance, as an actual balance. Both pans move in opposition
                and the beam they hang from settles first, which is the order a
                real scale does it in — animating the pans alone reads as two
                boxes sliding. */}
            <div className="mt-6" aria-hidden="true">
              <div className="relative mx-auto h-24 w-full max-w-sm">
                <motion.div
                  className="absolute left-1/2 top-6 w-full -translate-x-1/2"
                  animate={{ rotate: tilt * 5 }}
                  transition={reduced ? { duration: 0 } : springsSilk.stage}
                  style={{ transformOrigin: '50% 50%' }}
                >
                  <span className="balance-beam block h-[3px] w-full rounded-full" />
                </motion.div>

                {/* The pivot column, under the beam's centre. */}
                <span className="absolute left-1/2 top-6 h-16 w-px -translate-x-1/2 bg-line/60" />

                {([-1, 1] as const).map((side) => {
                  const worn = side === -1;
                  const n = worn
                    ? (byWear.get('daily') ?? 0) + (byWear.get('weekly') ?? 0)
                    : (byWear.get('occasional') ?? 0) + (byWear.get('vault') ?? 0);
                  return (
                    <motion.div
                      key={side}
                      className="absolute top-7 w-24 text-center"
                      style={{ [side === -1 ? 'left' : 'right']: 0 }}
                      animate={{ y: side * tilt * 16 }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 90, damping: 14, mass: 1.1, delay: 0.12 }
                      }
                    >
                      <span className="mx-auto block h-4 w-px bg-line/50" />
                      <span className="block rounded-b-full border border-t-0 border-hairline bg-surface-raised/60 px-2 pb-2 pt-1">
                        <span className="nums-instrument block font-display text-xl text-primary">
                          {n}
                        </span>
                        <span className="block font-accent text-[8px] uppercase tracking-luxe text-faint">
                          {worn ? 'worn' : 'kept'}
                        </span>
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
              Which is the usual shape, and the usual regret. The answer is rarely another piece —
              it is much more often a clasp that can be worked one-handed, a shorter chain that goes
              under a collar, or a resize on something that has stopped fitting. All three are bench
              jobs on what you already own, and all three are the reason a piece goes back into
              circulation.
            </p>
            <Link
              href="/care"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-2 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors duration-300 hover:bg-accent hover:text-onaccent"
            >
              The care bench
            </Link>
          </div>
        )}
    </div>
  );
}
