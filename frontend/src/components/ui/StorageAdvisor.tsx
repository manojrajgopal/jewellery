'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Package } from 'lucide-react';

import { ease, gridCell, gridDelay, springs } from '@/lib/motion';

/**
 * The materials a drawer actually contains, with the two numbers that decide how
 * they may be stored together.
 *
 * `mohs` is hardness on the Mohs scale — the whole reason a diamond must not share
 * a pouch with a pearl, since anything harder scratches anything softer and the
 * damage is one-directional. `needs` is the environment the material wants, and it
 * is where the real surprises are: pearls and opals need *humidity*, and a sealed
 * airtight box is the most common way people destroy both.
 */
const MATERIALS = [
  {
    id: 'diamond',
    label: 'Diamond',
    mohs: 10,
    needs: 'dry',
    note: 'Harder than everything else in the drawer, which makes it the aggressor rather than the victim. It scratches every other stone here, including another diamond.',
  },
  {
    id: 'sapphire',
    label: 'Sapphire / Ruby',
    mohs: 9,
    needs: 'dry',
    note: 'Corundum. Effectively indestructible in wear and still no match for a diamond in a shared pouch.',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    mohs: 7.5,
    needs: 'dry',
    note: 'Hard but brittle: almost every emerald has internal fissures, and it is a knock rather than a scratch that opens one. Never oiled at home, and never in an ultrasonic bath.',
  },
  {
    id: 'gold',
    label: 'Gold chain',
    mohs: 3,
    needs: 'dry',
    note: '22K is soft enough to mark with a fingernail. Chains want their own compartment for a second reason as well — they knot against anything with a prong.',
  },
  {
    id: 'pearl',
    label: 'Pearl',
    mohs: 2.5,
    needs: 'humid',
    note: 'Nacre is a layered organic material, and it dries out. Sealed in plastic it crazes within a year or two and does not come back. A soft cotton pouch, never airtight.',
  },
  {
    id: 'opal',
    label: 'Opal',
    mohs: 5.5,
    needs: 'humid',
    note: 'Holds up to 10% water by weight. Kept too dry it crazes into a web of fine cracks; kept beside a heat source it can do it in a fortnight.',
  },
  {
    id: 'silver',
    label: 'Silver',
    mohs: 2.5,
    needs: 'sealed',
    note: 'The one material here that genuinely wants airtight storage. It tarnishes on contact with sulphur in ordinary air, and a sealed bag with a tarnish strip stops it.',
  },
  {
    id: 'turquoise',
    label: 'Turquoise / Coral',
    mohs: 5,
    needs: 'dry',
    note: 'Porous, and it drinks whatever it is near — perfume, hand cream, hairspray. Stains are permanent because they are inside the stone rather than on it.',
  },
] as const;

type MaterialId = (typeof MATERIALS)[number]['id'];

/** Compartments in the drawing, and what each is lined with. */
const COMPARTMENTS = [
  {
    id: 'dry',
    label: 'Lined tray, dry',
    lining: 'velvet-bed',
    blurb: 'Individual velvet slots. One piece per slot, and nothing shares a slot with a diamond.',
  },
  {
    id: 'humid',
    label: 'Cotton pouch, breathing',
    lining: 'paper-stock',
    blurb: 'Soft cotton, not plastic. Kept away from the radiator and out of a sunlit windowsill.',
  },
  {
    id: 'sealed',
    label: 'Sealed bag, tarnish strip',
    lining: 'plate-marble',
    blurb: 'Airtight, with an anti-tarnish strip replaced yearly. The only compartment that should be airtight.',
  },
] as const;

/**
 * How the drawer should be laid out, given what is in it.
 *
 * The care page explains cleaning at length and says nothing about storage, which
 * is where most damage actually happens — slowly, in a drawer, over years, and to
 * pieces that were cleaned perfectly.
 *
 * The advice falls out of two facts rather than being written per combination:
 * hardness decides who may share a compartment (anything harder scratches anything
 * softer, and the difference only has to be two points on the Mohs scale to matter),
 * and the environment decides which compartment it is. So selecting pearls and
 * diamonds together produces a warning automatically, and adding a material later
 * needs no new copy.
 */
export default function StorageAdvisor({ className = '' }: { className?: string }) {
  const [chosen, setChosen] = useState<MaterialId[]>(['diamond', 'gold', 'pearl']);

  const toggle = (id: MaterialId) =>
    setChosen((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  const picked = useMemo(
    () => MATERIALS.filter((m) => chosen.includes(m.id)),
    [chosen]
  );

  /** Grouped by the environment each material wants. */
  const grouped = useMemo(
    () =>
      COMPARTMENTS.map((c) => ({
        ...c,
        items: picked.filter((m) => m.needs === c.id),
      })),
    [picked]
  );

  /**
   * Pairs that must not share a compartment: same environment, and far enough apart
   * in hardness that the softer one will be marked. Reported softest-first, because
   * the softer piece is the one that gets damaged and therefore the one the reader
   * cares about.
   */
  const conflicts = useMemo(() => {
    const out: { hard: string; soft: string; gap: number }[] = [];
    for (let i = 0; i < picked.length; i++) {
      for (let j = i + 1; j < picked.length; j++) {
        const a = picked[i];
        const b = picked[j];
        if (a.needs !== b.needs) continue;
        const gap = Math.abs(a.mohs - b.mohs);
        if (gap < 2) continue;
        const hard = a.mohs > b.mohs ? a : b;
        const soft = a.mohs > b.mohs ? b : a;
        out.push({ hard: hard.label, soft: soft.label, gap });
      }
    }
    return out.sort((x, y) => y.gap - x.gap);
  }, [picked]);

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] ${className}`}>
      {/* ---- What is in the drawer ---- */}
      <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
        <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
          What is in your drawer
        </span>
        <p className="mt-2 font-sans text-xs font-light leading-relaxed text-muted">
          Tap everything you own. The layout on the right rearranges itself, and anything that
          cannot share a compartment is called out underneath it.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {MATERIALS.map((m, i) => {
            const on = chosen.includes(m.id);
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => toggle(m.id)}
                variants={gridCell}
                custom={gridDelay(i, 2, MATERIALS.length, 'top-left', 0.04)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={on}
                className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors duration-300 ${
                  on
                    ? 'border-accent/60 bg-accent/10'
                    : 'border-hairline hover:border-accent/40'
                }`}
              >
                <span className="min-w-0">
                  <span
                    className={`block truncate font-sans text-xs ${
                      on ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="font-accent text-[9px] uppercase tracking-luxe text-faint nums-tabular">
                    Mohs {m.mohs}
                  </span>
                </span>
                {on && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springs.pop}
                    className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-accent text-onaccent"
                  >
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ---- The drawer ---- */}
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {grouped.map((c) => (
            <motion.div
              key={c.id}
              layout
              transition={springs.plate}
              className={`relative min-h-[13rem] overflow-hidden rounded-2xl border p-4 ${
                c.items.length ? 'border-accent/30' : 'border-dashed border-line'
              }`}
            >
              <span aria-hidden="true" className={`absolute inset-0 opacity-40 ${c.lining}`} />
              <div className="relative">
                <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-accent">
                  <Package className="h-3.5 w-3.5" aria-hidden="true" />
                  {c.label}
                </span>
                <p className="mt-2 font-sans text-[11px] font-light leading-relaxed text-secondary">
                  {c.blurb}
                </p>

                <ul className="mt-4 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {c.items.map((m) => (
                      <motion.li
                        key={m.id}
                        layout
                        initial={{ opacity: 0, x: -12, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 12, filter: 'blur(4px)' }}
                        transition={springs.plate}
                        className="rounded-lg border border-hairline bg-canvas/70 px-3 py-2"
                      >
                        <span className="block font-sans text-xs text-primary">{m.label}</span>
                        <span className="mt-0.5 block font-sans text-[10px] font-light leading-relaxed text-muted">
                          {m.note}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {c.items.length === 0 && (
                  <p className="mt-4 font-sans text-[11px] font-light italic text-faint">
                    Nothing of yours needs this one.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---- Conflicts ---- */}
        <AnimatePresence mode="popLayout">
          {conflicts.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: ease.luxury }}
              className="rounded-2xl border border-burgundy-500/40 bg-burgundy-900/10 p-5"
            >
              <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-burgundy-300">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Keep these apart
              </span>
              <ul className="mt-3 space-y-2">
                {conflicts.slice(0, 5).map((c) => (
                  <li
                    key={`${c.hard}-${c.soft}`}
                    className="font-sans text-xs font-light leading-relaxed text-secondary"
                  >
                    <span className="text-primary">{c.hard}</span> will mark{' '}
                    <span className="text-primary">{c.soft}</span> —{' '}
                    <span className="nums-tabular">{c.gap.toFixed(1)}</span> points apart on the
                    Mohs scale, and the damage only goes one way.
                  </li>
                ))}
              </ul>
              {conflicts.length > 5 && (
                <p className="mt-3 font-sans text-[11px] font-light text-faint">
                  And {conflicts.length - 5} more pairs. At this point the honest answer is one slot
                  per piece.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {conflicts.length === 0 && picked.length > 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-jade-500/35 bg-jade-900/10 p-5 font-sans text-xs font-light leading-relaxed text-secondary"
          >
            Nothing here will mark anything else. It is still worth one slot per piece — the second
            reason for compartments is chains knotting around prongs, and that has nothing to do
            with hardness.
          </motion.p>
        )}
      </div>
    </div>
  );
}
