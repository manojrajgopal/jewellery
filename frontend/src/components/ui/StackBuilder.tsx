'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import { GripVertical, Heart, Plus, RotateCcw, Trash2 } from 'lucide-react';

import { useToast } from '@/components/providers/ToastProvider';
import { useWishlist } from '@/hooks/useWishlist';
import { ease, springs } from '@/lib/motion';
import { products } from '@/data/products';

/** Rupees as a number, from the catalogue's formatted strings. */
const toRupees = (price: string) => Number(price.replace(/[^0-9]/g, '')) || 0;

const fmt = (n: number) =>
  `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * The metals a band can be, and how they read against each other. `tone` is the
 * gradient the band is drawn with; `warmth` is used to warn about a stack that
 * mixes cool and warm metals — which is a real decision, not a rule, so it is
 * phrased as an observation rather than a prohibition.
 */
const METALS = {
  gold: { label: '22K Gold', tone: 'from-gold-200 via-gold-400 to-gold-700', warmth: 1 },
  'rose-gold': { label: '18K Rose', tone: 'from-rose-100 via-rose-300 to-rose-700', warmth: 0.8 },
  platinum: { label: 'Platinum', tone: 'from-cream-50 via-platinum to-ink-400', warmth: 0 },
  diamond: { label: 'Pavé set', tone: 'from-white via-champagne-100 to-champagne-500', warmth: 0.4 },
} as const;

/** Bands and bangles only — the pieces a stack is actually built from. */
const STACKABLE = products.filter((p) => p.category === 'rings' || p.category === 'bracelets');

const MAX = 6;

interface StackedBand {
  /** Unique per placement, because the same piece can appear twice in a stack. */
  key: string;
  productId: string;
}

/**
 * Build a stack, band by band, and see it on the hand.
 *
 * A stack is the one purchase in the shop that cannot be judged one piece at a
 * time — the whole question is what four bands look like *together*, in what
 * order, at what total. The catalogue answers none of that, so this does: add
 * bands, drag them into the order they will sit in, and the drawing and the total
 * update as you go.
 *
 * Order is draggable rather than fixed because it changes the object. A pavé band
 * between two plain ones reads as a set; the same three with the pavé on the
 * outside read as one good ring and two spacers. Letting someone discover that by
 * dragging is worth more than any amount of styling advice.
 *
 * Everything is local. The stack can be saved to the wishlist piece by piece,
 * which is the only place it leaves this component — there is no cart, and
 * pretending otherwise would be dishonest about how the house actually sells.
 */
export default function StackBuilder({ className = '' }: { className?: string }) {
  const [stack, setStack] = useState<StackedBand[]>([]);
  const [wristMode, setWristMode] = useState(false);
  const { toast } = useToast();
  const { ids: saved, toggle } = useWishlist();

  const bands = useMemo(
    () =>
      stack
        .map((s) => {
          const product = STACKABLE.find((p) => p.id === s.productId);
          return product ? { ...s, product } : null;
        })
        .filter((b): b is StackedBand & { product: (typeof STACKABLE)[number] } => b !== null),
    [stack]
  );

  const total = bands.reduce((sum, b) => sum + toRupees(b.product.price), 0);

  /** Warm and cool metals in the same stack. Reported, not forbidden. */
  const mixed = useMemo(() => {
    if (bands.length < 2) return false;
    const warmths = bands.map((b) => METALS[b.product.metal]?.warmth ?? 0.5);
    return Math.max(...warmths) - Math.min(...warmths) > 0.6;
  }, [bands]);

  const add = (productId: string) => {
    if (stack.length >= MAX) {
      toast({
        kind: 'info',
        title: 'That is a full hand',
        message: `Six bands is the most this drawing will hold. Remove one to try another.`,
      });
      return;
    }
    setStack((prev) => [
      ...prev,
      { key: `${productId}-${prev.length}-${Math.random().toString(36).slice(2, 7)}`, productId },
    ]);
  };

  const remove = (key: string) => setStack((prev) => prev.filter((s) => s.key !== key));

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] ${className}`}>
      {/* ---- The drawing ---- */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline plate-marble p-6 md:p-10">
        <div className="flex items-center justify-between">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            {wristMode ? 'On the wrist' : 'On the hand'}
          </span>
          <button
            type="button"
            onClick={() => setWristMode((v) => !v)}
            className="rounded-full border border-hairline px-3 py-1 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent"
          >
            {wristMode ? 'Show the finger' : 'Show the wrist'}
          </button>
        </div>

        {/* A drawn finger or wrist. Deliberately schematic: a photographic hand
            fixes a skin tone and a size, and both are wrong for most visitors. */}
        <div className="relative mx-auto mt-8 flex h-[22rem] w-full max-w-sm items-end justify-center">
          <motion.div
            layout
            transition={springs.plate}
            className={`relative ${
              wristMode ? 'h-24 w-full rounded-[3rem]' : 'h-72 w-28 rounded-[3.5rem]'
            } border border-hairline bg-gradient-to-b from-surface-raised to-surface-sunken shadow-[inset_0_2px_18px_-6px_rgb(var(--shadow-color)/0.5)]`}
          >
            {/* The bands. Positioned along the axis of the limb, evenly spread so
                a two-band stack sits where a six-band stack starts. */}
            <AnimatePresence initial={false}>
              {bands.map((b, i) => {
                const metal = METALS[b.product.metal] ?? METALS.gold;
                const step = wristMode ? 100 / (MAX + 1) : 62 / (MAX + 1);
                return (
                  <motion.span
                    key={b.key}
                    layout
                    initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.7, filter: 'blur(6px)' }}
                    transition={springs.plate}
                    title={b.product.name}
                    className={`absolute bg-gradient-to-r ${metal.tone} ${
                      b.product.metal === 'diamond' ? 'pave-field' : ''
                    } ${
                      wristMode
                        ? 'left-0 h-full w-5 rounded-full'
                        : 'left-0 h-4 w-full rounded-full'
                    } milgrain-edge`}
                    style={
                      wristMode
                        ? { left: `${8 + i * step}%` }
                        : { top: `${18 + i * step}%` }
                    }
                  />
                );
              })}
            </AnimatePresence>

            {bands.length === 0 && (
              <span className="absolute inset-0 grid place-items-center px-6 text-center font-sans text-xs font-light leading-relaxed text-faint">
                Add a band from the right to begin.
              </span>
            )}
          </motion.div>
        </div>

        {/* The running total and the one observation worth making. */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-hairline pt-6">
          <div>
            <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
              {bands.length} {bands.length === 1 ? 'band' : 'bands'}
            </span>
            <motion.p
              key={total}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: ease.luxury }}
              className="font-display text-3xl text-primary nums-tabular"
            >
              {fmt(total)}
            </motion.p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStack([])}
              disabled={!bands.length}
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Clear
            </button>
            <button
              type="button"
              disabled={!bands.length}
              onClick={() => {
                // Saved as individual pieces, because that is what the wishlist
                // holds. Duplicates in the stack collapse to one saved piece.
                const unique = Array.from(new Set(bands.map((b) => b.product.id)));
                const added = unique.filter((id) => !saved.includes(id));
                added.forEach((id) => toggle(id));
                toast({
                  kind: 'luxe',
                  title: added.length ? 'Saved to your pieces' : 'Already saved',
                  message: added.length
                    ? `${added.length} ${added.length === 1 ? 'piece' : 'pieces'} from this stack are now in your wishlist.`
                    : 'Every piece in this stack was already on your list.',
                });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors duration-300 hover:bg-accent hover:text-onaccent disabled:opacity-40"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Save the stack
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mixed && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden font-sans text-xs font-light leading-relaxed text-muted"
            >
              <span className="mt-4 block rounded-xl border border-hairline bg-canvas/50 px-4 py-3">
                You are mixing warm and cool metals. It works, and it is deliberate on plenty of
                good hands — but keep one metal in the majority or the stack reads as unfinished
                rather than as mixed.
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ---- The order, and the catalogue ---- */}
      <div className="space-y-6">
        {bands.length > 0 && (
          <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-5">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Order on the hand — drag to change
            </span>
            <Reorder.Group
              axis="y"
              values={stack}
              onReorder={setStack}
              className="mt-4 space-y-2"
            >
              {bands.map((b) => (
                <Reorder.Item
                  key={b.key}
                  value={stack.find((s) => s.key === b.key)!}
                  whileDrag={{ scale: 1.03, boxShadow: '0 18px 40px -22px rgb(0 0 0 / 0.6)' }}
                  className="flex cursor-grab items-center gap-3 rounded-xl border border-hairline bg-surface-raised/70 px-3 py-2.5 active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 flex-shrink-0 text-faint" aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className={`h-3 w-8 flex-shrink-0 rounded-full bg-gradient-to-r ${
                      (METALS[b.product.metal] ?? METALS.gold).tone
                    }`}
                  />
                  <span className="min-w-0 flex-1 truncate font-sans text-xs text-secondary">
                    {b.product.name}
                  </span>
                  <span className="font-sans text-[11px] text-faint nums-tabular">
                    {b.product.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(b.key)}
                    aria-label={`Remove ${b.product.name} from the stack`}
                    className="text-faint transition-colors duration-300 hover:text-burgundy-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}

        <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-5">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            Bands and bangles
          </span>
          <ul className="mt-4 space-y-2">
            {STACKABLE.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => add(p.id)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-hairline bg-surface-raised/40 px-3 py-2.5 text-left transition-colors duration-300 hover:border-accent/40"
                >
                  <span
                    aria-hidden="true"
                    className={`h-3 w-8 flex-shrink-0 rounded-full bg-gradient-to-r ${
                      (METALS[p.metal] ?? METALS.gold).tone
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-sans text-xs text-secondary">
                      {p.name}
                    </span>
                    <span className="block font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {(METALS[p.metal] ?? METALS.gold).label}
                    </span>
                  </span>
                  <Plus
                    className="h-4 w-4 flex-shrink-0 text-faint transition-colors duration-300 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
