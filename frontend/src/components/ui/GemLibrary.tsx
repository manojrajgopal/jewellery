'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Droplet, Gem as GemIcon, Scale, ShieldAlert } from 'lucide-react';
import RarityMeter from '@/components/ui/RarityMeter';
import { gems, MONTHS, type Gem, type GemFamily } from '@/data/gems';

type SortKey = 'hardness' | 'refraction' | 'rarity' | 'name';

const FAMILIES: { value: GemFamily | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'corundum', label: 'Corundum' },
  { value: 'beryl', label: 'Beryl' },
  { value: 'quartz', label: 'Quartz' },
  { value: 'organic', label: 'Organic' },
  { value: 'other', label: 'Other' },
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'hardness', label: 'Hardness' },
  { value: 'refraction', label: 'Fire' },
  { value: 'rarity', label: 'Scarcity' },
  { value: 'name', label: 'A–Z' },
];

/**
 * The stone library: every gem the house sets, with the figures that decide how
 * it can be worn.
 *
 * The bars are drawn against fixed maxima rather than against the range present in
 * the current filter. That is the important decision. Normalising to the visible
 * set makes the softest stone in any filter look like a full bar, so filtering to
 * pearl and opal would show two stones at "maximum hardness" — which is the exact
 * opposite of the truth. Fixed maxima mean a bar means the same thing in every
 * view, and pearl stays visibly near the bottom of the scale where it belongs.
 *
 * Hardness is the headline figure because it is the one that answers the question
 * customers are actually asking, which is whether they can wear the thing.
 */
export default function GemLibrary({ className = '' }: { className?: string }) {
  const [family, setFamily] = useState<GemFamily | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('hardness');
  const [descending, setDescending] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const visible = useMemo(() => {
    const list = family === 'all' ? gems : gems.filter((g) => g.family === family);
    const sorted = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      return a[sort] - b[sort];
    });
    // A–Z always reads forward; the numeric sorts respect the direction toggle.
    return sort === 'name' ? sorted : descending ? sorted.reverse() : sorted;
  }, [family, sort, descending]);

  return (
    <div className={className}>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 border-b border-hairline pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2.5 font-accent text-[10px] uppercase tracking-luxe text-muted">
            Mineral family
          </p>
          <div className="flex flex-wrap gap-2">
            {FAMILIES.map((f) => (
              <button
                key={f.value}
                onClick={() => setFamily(f.value)}
                aria-pressed={family === f.value}
                className={`relative rounded-full px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  family === f.value ? 'text-onaccent' : 'text-muted hover:text-accent'
                }`}
              >
                {family === f.value && (
                  <motion.span
                    layoutId="gem-family-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent shadow-gold"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 font-accent text-[10px] uppercase tracking-luxe text-muted">
            Order by
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {SORTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSort(s.value)}
                aria-pressed={sort === s.value}
                className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                  sort === s.value
                    ? 'border-gold-500/60 bg-gold-500/10 text-accent'
                    : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
                }`}
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={() => setDescending((v) => !v)}
              disabled={sort === 'name'}
              aria-label={descending ? 'Sort ascending' : 'Sort descending'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-gold-500/40 hover:text-accent disabled:opacity-30"
            >
              <motion.span animate={{ rotate: descending ? 0 : 180 }}>
                <ArrowUpDown size={13} strokeWidth={1.8} />
              </motion.span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((gem, i) => (
            <GemCard
              key={gem.id}
              gem={gem}
              index={i}
              open={open === gem.id}
              onToggle={() => setOpen((cur) => (cur === gem.id ? null : gem.id))}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-8 font-sans text-[11px] font-light italic leading-relaxed text-faint">
        Hardness is Mohs. Fire is the principal refractive index — the higher the
        figure, the more the stone bends light, and the more it sparkles for a given
        cut. Bars are drawn against a fixed scale, so a bar means the same thing in
        every filter.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Fixed maxima. Diamond tops both scales, so these are the real ceilings rather
 * than arbitrary round numbers — a bar at 100% genuinely means "nothing is harder".
 */
const MAX = { hardness: 10, refraction: 2.42, density: 4.2 } as const;

function GemCard({
  gem,
  index,
  open,
  onToggle,
}: {
  gem: Gem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  // Below 7 a stone needs thinking about for a ring worn daily; below 6 it needs
  // a protective setting. Worth surfacing, because it is the practical upshot of
  // the whole card.
  const wear =
    gem.hardness >= 8
      ? { label: 'Daily wear', tone: 'text-jade-300' }
      : gem.hardness >= 7
        ? { label: 'Daily with care', tone: 'text-accent' }
        : { label: 'Protected setting', tone: 'text-burgundy-300' };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-raised/70 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-gold-500/35"
    >
      {/* Facet fan wash */}
      <span
        aria-hidden="true"
        className="facet-fan pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-conic-spin-slow rounded-full opacity-25"
      />

      <header className="relative flex items-start gap-4">
        {/* The stone itself, drawn in its characteristic cut */}
        <span
          aria-hidden="true"
          className={`h-14 w-14 flex-shrink-0 bg-gradient-to-br ${gem.swatch} ${gem.cut} shadow-[0_6px_18px_-6px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6`}
        />

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-light leading-tight text-primary">
            {gem.name}
          </h3>
          {gem.alias && (
            <p className="mt-0.5 font-sans text-[11px] font-light italic text-faint">
              {gem.alias}
            </p>
          )}
          <p className="mt-1.5 font-accent text-[9px] uppercase tracking-luxe text-accent">
            {gem.months.map((m) => MONTHS[m - 1]).join(' · ')}
          </p>
        </div>
      </header>

      {/* Bars */}
      <div className="relative mt-5 flex flex-col gap-3">
        <Bar
          icon={GemIcon}
          label="Hardness"
          value={gem.hardness}
          max={MAX.hardness}
          display={`${gem.hardness} Mohs`}
        />
        <Bar
          icon={Droplet}
          label="Fire"
          value={gem.refraction}
          max={MAX.refraction}
          display={`RI ${gem.refraction.toFixed(2)}`}
        />
        <Bar
          icon={Scale}
          label="Density"
          value={gem.density}
          max={MAX.density}
          display={`SG ${gem.density.toFixed(2)}`}
        />
      </div>

      <div className="relative mt-5">
        <RarityMeter value={gem.rarity} />
      </div>

      {/* Wear verdict — the practical answer */}
      <p
        className={`relative mt-4 flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe ${wear.tone}`}
      >
        <span aria-hidden="true" className="block h-1 w-1 rotate-45 bg-current" />
        {wear.label}
      </p>

      <p className="relative mt-4 font-display text-sm italic leading-snug text-secondary">
        {gem.meaning}
      </p>

      {/* Expandable detail */}
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="relative mt-5 flex items-center justify-between gap-3 border-t border-hairline pt-4 text-left font-accent text-[9px] uppercase tracking-luxe text-muted transition-colors hover:text-accent"
      >
        {open ? 'Less' : 'Origin, note and care'}
        <motion.span animate={{ rotate: open ? 45 : 0 }} aria-hidden="true">
          <span className="block h-1.5 w-1.5 rotate-45 bg-accent" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4">
              <div>
                <p className="mb-1.5 font-accent text-[8px] uppercase tracking-luxe text-faint">
                  Origin
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {gem.origin.map((o) => (
                    <span
                      key={o}
                      className="rounded-full border border-hairline px-2.5 py-1 font-sans text-[10px] font-light text-muted"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              <p className="font-sans text-xs font-light leading-relaxed text-muted">
                {gem.note}
              </p>

              <div className="flex gap-2.5 rounded-lg border border-burgundy-500/25 bg-burgundy-900/10 p-3">
                <ShieldAlert
                  size={13}
                  strokeWidth={1.8}
                  className="mt-0.5 flex-shrink-0 text-burgundy-300"
                />
                <p className="font-sans text-[11px] font-light leading-relaxed text-secondary">
                  {gem.care}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function Bar({
  icon: Icon,
  label,
  value,
  max,
  display,
}: {
  icon: typeof GemIcon;
  label: string;
  value: number;
  max: number;
  display: string;
}) {
  const pct = Math.max(0, Math.min(1, value / max));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 font-accent text-[9px] uppercase tracking-luxe text-faint">
          <Icon size={10} strokeWidth={1.9} className="text-accent/60" />
          {label}
        </span>
        <span className="nums-tabular font-sans text-[10px] font-light text-muted">
          {display}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-line">
        <motion.span
          className="block h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-400 to-gold-200"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: pct }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0, width: '100%' }}
        />
      </div>
    </div>
  );
}
