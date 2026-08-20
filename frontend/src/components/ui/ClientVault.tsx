'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CalendarHeart, Clock3, GitCompare, Heart, ShieldCheck, Trash2 } from 'lucide-react';

import { useCompare, openCompare } from '@/hooks/useCompare';
import { useOccasions, daysUntil } from '@/hooks/useOccasions';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useWishlist } from '@/hooks/useWishlist';
import { ease, gridCell, gridDelay, springs } from '@/lib/motion';
import { products } from '@/data/products';

type TabId = 'saved' | 'compare' | 'seen' | 'dates';

const TABS: { id: TabId; label: string; icon: typeof Heart }[] = [
  { id: 'saved', label: 'Saved', icon: Heart },
  { id: 'compare', label: 'Comparing', icon: GitCompare },
  { id: 'seen', label: 'Seen', icon: Clock3 },
  { id: 'dates', label: 'Dates', icon: CalendarHeart },
];

const byId = (id: string) => products.find((p) => p.id === id);

const toRupees = (price: string) => Number(price.replace(/[^0-9]/g, '')) || 0;

/**
 * Everything the visitor has done on this site, in one place.
 *
 * Four features already write to localStorage independently — the wishlist, the
 * compare tray, the recently-viewed rail and the occasion reminders — and until now
 * each was only visible from wherever it happened to be mounted. Somebody who saved
 * six pieces across three sessions had no page that would show them the six.
 *
 * This is that page's engine. It reads the same four stores through the same four
 * hooks, so it cannot drift out of sync with the tray or the drawer: remove
 * something here and the tray updates in the same frame, because both are listening
 * to the same custom event.
 *
 * The header total is the honest one — the sum of what is saved — and it is stated
 * as a sum rather than as a basket, because none of this is a cart and the house
 * does not sell this way. What it is for is walking into the boutique already
 * knowing what you want to be shown.
 */
export default function ClientVault({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState<TabId>('saved');

  const wishlist = useWishlist();
  const compare = useCompare();
  const seen = useRecentlyViewed();
  const occasions = useOccasions();

  const savedPieces = useMemo(
    () => wishlist.ids.map(byId).filter(Boolean) as typeof products,
    [wishlist.ids]
  );
  const comparePieces = useMemo(
    () => compare.ids.map(byId).filter(Boolean) as typeof products,
    [compare.ids]
  );
  const seenPieces = useMemo(
    () => seen.ids.map(byId).filter(Boolean) as typeof products,
    [seen.ids]
  );

  const savedValue = savedPieces.reduce((sum, p) => sum + toRupees(p.price), 0);

  /** Everything has finished reading storage — used to avoid an empty-state flash. */
  const ready = wishlist.hydrated && compare.hydrated && seen.hydrated && occasions.hydrated;

  const counts: Record<TabId, number> = {
    saved: savedPieces.length,
    compare: comparePieces.length,
    seen: seenPieces.length,
    dates: occasions.items.length,
  };

  const empty = ready && Object.values(counts).every((c) => c === 0);

  return (
    <div className={className}>
      {/* ---- The ledger head ---- */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Pieces saved', value: counts.saved, note: 'Across every visit' },
          {
            label: 'Value held',
            value: savedValue,
            note: 'Sum of what is saved',
            money: true,
          },
          { label: 'Dates kept', value: counts.dates, note: 'Reminders in this browser' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={gridCell}
            custom={gridDelay(i, 3, 3, 'top-left')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl border border-hairline bg-surface-raised/50 p-5"
          >
            <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
              {stat.label}
            </span>
            <p className="mt-2 font-display text-3xl text-primary nums-tabular">
              {stat.money
                ? `₹${stat.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                : stat.value}
            </p>
            <span className="mt-1 block font-sans text-[11px] font-light text-muted">
              {stat.note}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ---- Tabs ---- */}
      <div
        role="tablist"
        aria-label="Your vault"
        className="mt-8 flex flex-wrap gap-2 border-b border-hairline pb-3"
      >
        {TABS.map((t) => {
          const on = t.id === tab;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setTab(t.id)}
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                on ? 'text-onaccent' : 'text-muted hover:text-accent'
              }`}
            >
              {/* The pill travels between tabs rather than appearing on each — one
                  shared layoutId is what makes it read as a single object. */}
              {on && (
                <motion.span
                  layoutId="vault-tab"
                  transition={springs.chip}
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                />
              )}
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {t.label}
              <span className={`nums-tabular ${on ? 'opacity-80' : 'text-faint'}`}>
                {counts[t.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- Panels ---- */}
      <div className="mt-8 min-h-[18rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.42, ease: ease.luxury }}
            role="tabpanel"
          >
            {/* Saved, comparing and seen share one grid: they are all lists of
                pieces, and giving each its own layout would be three ways of
                showing the same object. */}
            {tab !== 'dates' && (
              <PieceGrid
                pieces={tab === 'saved' ? savedPieces : tab === 'compare' ? comparePieces : seenPieces}
                emptyLine={
                  tab === 'saved'
                    ? 'Nothing saved yet. The heart on any piece puts it here.'
                    : tab === 'compare'
                      ? 'Nothing in the tray. Add up to three pieces to compare them side by side.'
                      : 'Nothing seen yet. Pieces you open appear here, most recent first.'
                }
                onRemove={
                  tab === 'saved'
                    ? (id) => wishlist.toggle(id)
                    : tab === 'compare'
                      ? (id) => compare.remove(id)
                      : undefined
                }
                footer={
                  tab === 'compare' && comparePieces.length > 1 ? (
                    <button
                      type="button"
                      onClick={openCompare}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxer text-accent transition-colors duration-300 hover:bg-accent hover:text-onaccent"
                    >
                      <GitCompare className="h-3.5 w-3.5" aria-hidden="true" />
                      Open the comparison
                    </button>
                  ) : null
                }
              />
            )}

            {tab === 'dates' && (
              <div>
                {occasions.items.length === 0 ? (
                  <EmptyLine line="No dates kept. Add one on the care page and we will count down to it here." />
                ) : (
                  <ul className="space-y-3">
                    {occasions.items
                      .map((o) => ({ ...o, days: daysUntil(o.date, o.annual) }))
                      .sort((a, b) => a.days - b.days)
                      .map((o, i) => (
                        <motion.li
                          key={o.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07, duration: 0.45, ease: ease.luxury }}
                          className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface-raised/50 px-5 py-4"
                        >
                          <span className="rail-node grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-canvas">
                            <span className="font-display text-lg text-accent nums-tabular">
                              {o.days}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-display text-lg text-primary">
                              {o.label}
                            </span>
                            <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                              {o.kind} · {o.annual ? 'every year' : 'once'} ·{' '}
                              {o.days === 0 ? 'today' : `in ${o.days} days`}
                            </span>
                          </span>
                          {/* Lead time is the useful part: a commission at 90 days
                              is comfortable, at 30 it is a conversation. */}
                          <span
                            className={`hidden font-sans text-[11px] uppercase tracking-luxe sm:block ${
                              o.days < 35 ? 'text-burgundy-300' : 'text-jade-300'
                            }`}
                          >
                            {o.days < 35 ? 'Too late to commission' : 'Bespoke still possible'}
                          </span>
                          <button
                            type="button"
                            onClick={() => occasions.remove(o.id)}
                            aria-label={`Forget ${o.label}`}
                            className="text-faint transition-colors duration-300 hover:text-burgundy-300"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </motion.li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- The standing promise about all of it ---- */}
      <p className="mt-10 flex items-start gap-3 border-t border-hairline pt-6 font-sans text-[11px] font-light leading-relaxed text-faint">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        {empty
          ? 'This page fills itself as you use the site. Nothing here is an account — everything is held in this browser, on this device, and clearing your browser data clears it.'
          : 'Held in this browser only. There is no account behind this page, nothing is sent to us, and it will not follow you to another device.'}
      </p>
    </div>
  );
}

/** A row of pieces with an optional remove action. Shared by three of the tabs. */
function PieceGrid({
  pieces,
  emptyLine,
  onRemove,
  footer,
}: {
  pieces: typeof products;
  emptyLine: string;
  onRemove?: (id: string) => void;
  footer?: React.ReactNode;
}) {
  if (pieces.length === 0) return <EmptyLine line={emptyLine} />;

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {pieces.map((p, i) => (
            <motion.article
              key={p.id}
              layout
              variants={gridCell}
              custom={gridDelay(i, 3, pieces.length, 'top-left')}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
              whileHover={{ y: -6, transition: springs.plate }}
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface-raised/50"
            >
              <Link href={`/collections/${p.collection}`} className="block">
                <span className="relative block aspect-plate overflow-hidden">
                  <Image
                    src={p.images?.[0] ?? p.image ?? '/images/products/ring.jpg'}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.06]"
                  />
                  <span className="pointer-events-none absolute inset-0 media-veil-soft" />
                </span>
                <span className="block p-4">
                  <span className="font-accent text-[9px] uppercase tracking-luxe text-accent">
                    {p.category}
                  </span>
                  <span className="mt-1 block font-display text-lg leading-snug text-primary">
                    {p.name}
                  </span>
                  <span className="mt-2 flex items-center justify-between font-sans text-xs text-muted nums-tabular">
                    {p.price}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>

              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  aria-label={`Remove ${p.name}`}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-on-media bg-ink-950/40 text-on-media-soft backdrop-blur-md transition-colors duration-300 hover:text-burgundy-300"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      {footer}
    </div>
  );
}

function EmptyLine({ line }: { line: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: ease.luxury }}
      className="grid place-items-center rounded-3xl border border-dashed border-line px-8 py-16 text-center"
    >
      <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-muted">{line}</p>
    </motion.div>
  );
}
