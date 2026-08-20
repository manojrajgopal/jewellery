'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, IndianRupee, SlidersHorizontal } from 'lucide-react';

import { ease, springs } from '@/lib/motion';
import { collections } from '@/data/collections';
import { products } from '@/data/products';

const toRupees = (price: string) => Number(price.replace(/[^0-9]/g, '')) || 0;

/** Short-form rupees: lakh and crore, because that is how the number is spoken. */
const short = (n: number) => {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(n % 1_00_00_000 === 0 ? 0 : 1)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)} L`;
  if (n >= 1_000) return `₹${Math.round(n / 1_000)}k`;
  return `₹${n}`;
};

/**
 * The bands the trade actually thinks in, and what each one buys. The labels matter
 * more than the numbers: a customer with three lakh to spend does not want a list
 * of everything under three lakh, they want to know what three lakh is *for*.
 */
const BANDS = [
  { id: 'b1', max: 75_000, label: 'A first good piece', note: 'Studs, a fine chain, a bezel-set solitaire pendant.' },
  { id: 'b2', max: 2_50_000, label: 'A piece for an occasion', note: 'A cocktail ring, a tennis bracelet, a signed everyday set.' },
  { id: 'b3', max: 6_00_000, label: 'The engagement band', note: 'A certified centre stone above one carat, set properly.' },
  { id: 'b4', max: Number.POSITIVE_INFINITY, label: 'Heirloom scale', note: 'Bridal suites, kundan collars, anything the archive will keep a drawing of.' },
] as const;

/**
 * Where the money goes, and what it buys.
 *
 * The catalogue sorts by collection and the filters sort by category, so a visitor
 * with a number in mind has to open every piece to find out whether it is anywhere
 * near it. This inverts the question: set the ceiling, and the ladder shows which
 * bands are still open, how many pieces sit in each, and — the part no filter gives
 * you — what that amount of money is *for*.
 *
 * The bars are drawn from the live catalogue, so a piece added to the shop moves the
 * ladder without anyone updating a second table. Where a band has nothing in it the
 * band still renders, greyed: an empty rung is information (we do not make anything
 * at that price) rather than an error.
 */
export default function PriceLadder({ className = '' }: { className?: string }) {
  const [ceiling, setCeiling] = useState(6_00_000);
  const [openBand, setOpenBand] = useState<string | null>('b2');

  const rungs = useMemo(() => {
    let floor = 0;
    return BANDS.map((band) => {
      const inBand = products.filter((p) => {
        const v = toRupees(p.price);
        return v > floor && v <= band.max;
      });
      const rung = {
        ...band,
        floor,
        pieces: inBand.sort((a, b) => toRupees(a.price) - toRupees(b.price)),
        affordable: floor < ceiling,
      };
      floor = band.max;
      return rung;
    });
  }, [ceiling]);

  const widest = Math.max(1, ...rungs.map((r) => r.pieces.length));

  const reachable = products.filter((p) => toRupees(p.price) <= ceiling).length;

  return (
    <div className={className}>
      {/* ---- The dial ---- */}
      <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            What you have in mind
          </span>
          <motion.span
            key={ceiling}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-3xl text-primary nums-tabular"
          >
            {short(ceiling)}
          </motion.span>
        </div>

        <input
          type="range"
          min={25_000}
          max={20_00_000}
          step={25_000}
          value={ceiling}
          onChange={(e) => setCeiling(Number(e.target.value))}
          aria-label="Budget ceiling"
          className="mt-4 w-full accent-[rgb(var(--accent))]"
        />

        <p className="mt-3 font-sans text-xs font-light leading-relaxed text-muted">
          <span className="text-accent nums-tabular">{reachable}</span> of {products.length} pieces
          in the catalogue sit at or under this. Everything above it stays on the ladder, greyed —
          a price you are not spending is still worth knowing.
        </p>
      </div>

      {/* ---- The ladder ---- */}
      <div className="mt-8 space-y-4">
        {rungs.map((rung, i) => {
          const open = openBand === rung.id;
          return (
            <motion.div
              key={rung.id}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: ease.luxury }}
              className={`overflow-hidden rounded-2xl border transition-colors duration-500 ${
                rung.affordable
                  ? 'border-hairline bg-surface-raised/50'
                  : 'border-dashed border-line bg-surface-raised/20'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenBand(open ? null : rung.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <span
                  className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border ${
                    rung.affordable
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-hairline text-faint'
                  }`}
                >
                  <IndianRupee className="h-4 w-4" aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span
                      className={`font-display text-xl ${
                        rung.affordable ? 'text-primary' : 'text-faint'
                      }`}
                    >
                      {rung.label}
                    </span>
                    <span className="font-sans text-[11px] uppercase tracking-luxe text-faint nums-tabular">
                      {short(rung.floor)} –{' '}
                      {rung.max === Number.POSITIVE_INFINITY ? 'up' : short(rung.max)}
                    </span>
                  </span>
                  <span className="mt-1 block font-sans text-xs font-light leading-relaxed text-muted">
                    {rung.note}
                  </span>

                  {/* The bar. Width is the band's share of the fullest band, so the
                      ladder reads as a distribution rather than as four equal rows. */}
                  <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-line/40">
                    <motion.span
                      className={`block h-full rounded-full ${
                        rung.affordable
                          ? 'bg-gradient-to-r from-gold-700 via-gold-300 to-gold-500'
                          : 'bg-line-strong'
                      }`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(rung.pieces.length / widest) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: ease.luxury }}
                    />
                  </span>
                </span>

                <span className="flex-shrink-0 text-right">
                  <span className="block font-display text-2xl text-accent nums-tabular">
                    {rung.pieces.length}
                  </span>
                  <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                    pieces
                  </span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open && rung.pieces.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: ease.luxury }}
                    className="overflow-hidden"
                  >
                    <ul className="grid gap-2 border-t border-hairline p-5 sm:grid-cols-2">
                      {rung.pieces.map((p) => {
                        const home = collections.find((c) => c.id === p.collection);
                        return (
                          <li key={p.id}>
                            <Link
                              href={`/collections/${p.collection}`}
                              className="group flex items-center justify-between gap-3 rounded-xl border border-hairline bg-canvas/50 px-4 py-3 transition-colors duration-300 hover:border-accent/40"
                            >
                              <span className="min-w-0">
                                <span className="block truncate font-sans text-xs text-secondary">
                                  {p.name}
                                </span>
                                <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                                  {home?.name ?? p.collection}
                                </span>
                              </span>
                              <span className="flex flex-shrink-0 items-center gap-2 font-sans text-xs text-accent nums-tabular">
                                {p.price}
                                <ArrowUpRight
                                  className="h-3.5 w-3.5 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                                  aria-hidden="true"
                                />
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {open && rung.pieces.length === 0 && (
                <p className="border-t border-hairline p-5 font-sans text-xs font-light leading-relaxed text-faint">
                  Nothing in the catalogue lands in this band at the moment. It is not a gap we
                  mind — the bands either side are where the work naturally falls, and filling this
                  one would mean making something to hit a price rather than to be worn.
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, ...springs.plate }}
        className="mt-7 border-t border-hairline pt-5 font-sans text-[11px] font-light leading-relaxed text-faint"
      >
        Prices are as listed today and move with the metal rate; anything with a certified stone is
        quoted against that stone rather than against the band. A commission is priced from the
        drawing, which is why bespoke does not appear on this ladder.
      </motion.p>
    </div>
  );
}
