'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Gift, PenLine } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

interface Option {
  id: string;
  label: string;
  /** Tailwind gradient stops for the swatch and the rendered box. */
  swatch: string;
  note: string;
  /** Added to the presentation charge, in rupees. Zero is included. */
  price: number;
}

const CASES: Option[] = [
  { id: 'obsidian', label: 'Obsidian', swatch: 'from-ink-800 via-ink-950 to-ink-900', note: 'The house standard. Tooled leatherette.', price: 0 },
  { id: 'burgundy', label: 'Burgundy', swatch: 'from-burgundy-500 via-burgundy-900 to-burgundy-700', note: 'Deep oxblood, blind-stamped in gold.', price: 850 },
  { id: 'ivory', label: 'Ivory', swatch: 'from-cream-50 via-cream-200 to-champagne-100', note: 'For bridal. Shows a fingerprint; worth it.', price: 1200 },
  { id: 'jade', label: 'Jade', swatch: 'from-jade-500 via-jade-900 to-jade-700', note: 'Silk-wrapped board, not leather.', price: 1400 },
];

const LININGS: Option[] = [
  { id: 'velvet-black', label: 'Black velvet', swatch: 'from-ink-700 via-ink-900 to-ink-800', note: 'Highest contrast under showroom light.', price: 0 },
  { id: 'velvet-cream', label: 'Cream velvet', swatch: 'from-cream-100 via-champagne-100 to-cream-200', note: 'Warmer. Flatters yellow gold.', price: 400 },
  { id: 'silk', label: 'Habotai silk', swatch: 'from-champagne-100 via-champagne-300 to-gold-200', note: 'Lighter, and it does not hold dust.', price: 900 },
];

const RIBBONS: Option[] = [
  { id: 'none', label: 'None', swatch: 'from-ink-500 via-ink-600 to-ink-500', note: 'The case stands on its own.', price: 0 },
  { id: 'gold', label: 'Gold grosgrain', swatch: 'from-gold-300 via-gold-500 to-gold-700', note: 'Double-faced, hand-tied.', price: 350 },
  { id: 'rose', label: 'Rose satin', swatch: 'from-rose-100 via-rose-300 to-rose-500', note: 'Softer knot, sits flatter.', price: 350 },
  { id: 'jade', label: 'Jade silk', swatch: 'from-jade-300 via-jade-500 to-jade-900', note: 'Hand-dyed. Two-week lead time.', price: 700 },
];

const fmt = (n: number) => (n === 0 ? 'Included' : `₹${n.toLocaleString('en-IN')}`);

/**
 * The presentation case, configured and drawn.
 *
 * The preview is a real 3D composition — a lid, a well, a lining and a ribbon on
 * separate planes in a `preserve-3d` parent — rather than a flat swatch stack. That
 * matters because the thing a customer is choosing is how the case looks *opening*,
 * and the interaction between the lid colour and the lining is invisible until the
 * lid is off. So the box opens as you configure it.
 *
 * The lid lifts and tips rather than merely rotating. A lid that hinges backwards is
 * a hinged case; a presentation case has a separate lid that comes away, and getting
 * that wrong is the tell that makes a configurator look generic.
 */
export default function PackagingConfigurator({ className = '' }: { className?: string }) {
  const { toast } = useToast();

  const [caseId, setCaseId] = useState(CASES[0].id);
  const [liningId, setLiningId] = useState(LININGS[0].id);
  const [ribbonId, setRibbonId] = useState(RIBBONS[1].id);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  const chosen = useMemo(
    () => ({
      box: CASES.find((c) => c.id === caseId) ?? CASES[0],
      lining: LININGS.find((l) => l.id === liningId) ?? LININGS[0],
      ribbon: RIBBONS.find((r) => r.id === ribbonId) ?? RIBBONS[0],
    }),
    [caseId, liningId, ribbonId]
  );

  const total = chosen.box.price + chosen.lining.price + chosen.ribbon.price;
  const hasRibbon = chosen.ribbon.id !== 'none';

  const confirm = () => {
    setSaved(true);
    toast({
      kind: 'luxe',
      title: 'Presentation noted',
      message: `${chosen.box.label} case, ${chosen.lining.label.toLowerCase()} lining${
        hasRibbon ? `, ${chosen.ribbon.label.toLowerCase()}` : ''
      }.`,
    });
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-6 backdrop-blur-xl md:p-8 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />

      <header className="relative mb-7 flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-accent">
          <Gift size={16} strokeWidth={1.7} />
        </span>
        <div>
          <h3 className="font-display text-xl font-light text-primary md:text-2xl">
            The Presentation
          </h3>
          <p className="mt-0.5 font-sans text-[11px] font-light text-muted">
            How the piece arrives. Every combination is made to order.
          </p>
        </div>
      </header>

      <div className="relative grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        {/* ---- The case ---- */}
        <div>
          <div
            className="relative mx-auto aspect-square w-full max-w-[20rem]"
            style={{ perspective: 1400 }}
          >
            <motion.div
              className="absolute inset-[12%]"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateX: 52, rotateZ: open ? -18 : -14 }}
              transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            >
              {/* Well — the body of the case */}
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-br ${chosen.box.swatch} shadow-cinema`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Lining, inset so a rim of the case shows around it */}
                <motion.div
                  key={chosen.lining.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`velvet-bed absolute inset-[9%] rounded bg-gradient-to-br ${chosen.lining.swatch}`}
                >
                  {/* The slot a ring would sit in */}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-[8%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]"
                  />
                  {/* A stone in the slot, catching light */}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-[14%] w-[14%] -translate-x-1/2 -translate-y-[70%] rotate-45 bg-gradient-to-br from-cream-50 via-diamond to-ink-200 shadow-[0_4px_14px_rgba(0,0,0,0.6)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-[135%] animate-facet-glint rounded-full bg-white"
                  />
                </motion.div>

                {/* Case walls, drawn as four tilted faces so the box has depth */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[14%] origin-bottom rounded-b-lg bg-gradient-to-b ${chosen.box.swatch} brightness-75`}
                  style={{ transform: 'rotateX(-90deg) translateZ(0)' }}
                />
              </div>

              {/* Lid — lifts away and tips, rather than hinging */}
              <motion.div
                className={`absolute inset-0 rounded-lg bg-gradient-to-br ${chosen.box.swatch}`}
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  z: open ? 86 : 4,
                  x: open ? '18%' : 0,
                  y: open ? '-12%' : 0,
                  rotateZ: open ? 9 : 0,
                }}
                transition={{ type: 'spring', stiffness: 110, damping: 18 }}
              >
                {/* Blind-stamped mark */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="text-emboss-gold font-accent text-sm uppercase tracking-luxest">
                    Aurum
                  </span>
                </span>
                {/* Sheen across the lid */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
                >
                  <span className="absolute -inset-full animate-sheen-diagonal bg-gold-sheen opacity-45" />
                </span>

                {/* Ribbon, wrapped over the lid in both directions */}
                <AnimatePresence>
                  {hasRibbon && (
                    <motion.span
                      key={chosen.ribbon.id}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                    >
                      <span
                        className={`absolute inset-y-0 left-1/2 w-[13%] -translate-x-1/2 bg-gradient-to-b ${chosen.ribbon.swatch}`}
                      />
                      <span
                        className={`absolute inset-x-0 top-1/2 h-[13%] -translate-y-1/2 bg-gradient-to-r ${chosen.ribbon.swatch}`}
                      />
                      {/* Knot */}
                      <span
                        className={`absolute left-1/2 top-1/2 h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-gradient-to-br ${chosen.ribbon.swatch} shadow-[0_3px_10px_rgba(0,0,0,0.5)]`}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Card, tucked into the lid */}
            <AnimatePresence>
              {message.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 14, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: -3 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="paper-stock absolute bottom-0 left-0 w-[58%] rounded border border-hairline p-3 shadow-lift"
                >
                  <p className="font-display text-[11px] italic leading-snug text-primary">
                    {message.slice(0, 90)}
                  </p>
                  <span className="mt-1.5 block font-accent text-[7px] uppercase tracking-luxe text-faint">
                    Aurum · by hand
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="mx-auto mt-4 block font-sans text-[11px] font-light text-faint underline decoration-dotted underline-offset-4 transition-colors hover:text-accent"
          >
            {open ? 'Close the case' : 'Open the case'}
          </button>
        </div>

        {/* ---- Controls ---- */}
        <div className="flex flex-col gap-6">
          <Swatches label="Case" options={CASES} value={caseId} onChange={setCaseId} />
          <Swatches label="Lining" options={LININGS} value={liningId} onChange={setLiningId} />
          <Swatches label="Ribbon" options={RIBBONS} value={ribbonId} onChange={setRibbonId} />

          {/* Card message */}
          <div>
            <label
              htmlFor="gift-card"
              className="mb-2 flex items-center justify-between font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              <span className="flex items-center gap-1.5">
                <PenLine size={11} strokeWidth={1.9} className="text-accent/60" />
                Card, written by hand
              </span>
              <span className="nums-tabular text-faint">{message.length}/90</span>
            </label>
            <textarea
              id="gift-card"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 90))}
              placeholder="A line for the card. Our calligrapher writes it."
              className="input-gold w-full resize-none rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* Total */}
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <div>
              <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Presentation
              </span>
              <p className="nums-tabular mt-1 font-display text-2xl text-accent">
                {fmt(total)}
              </p>
            </div>
            <button
              onClick={confirm}
              className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 font-accent text-[10px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow hover:shadow-gold-lg"
            >
              {saved ? (
                <Check size={13} strokeWidth={2.4} />
              ) : (
                <Gift size={13} strokeWidth={1.9} />
              )}
              {saved ? 'Noted' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Swatches({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}) {
  const active = options.find((o) => o.id === value);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">{label}</p>
        {active && (
          <span className="nums-tabular font-sans text-[10px] font-light text-faint">
            {fmt(active.price)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.id === value;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              aria-pressed={on}
              title={o.note}
              className={`group relative flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 transition-all duration-300 ${
                on ? 'border-gold-500/55 bg-gold-500/10' : 'border-hairline hover:border-gold-500/35'
              }`}
            >
              <span
                aria-hidden="true"
                className={`block h-5 w-5 flex-shrink-0 rounded-full bg-gradient-to-br ${o.swatch} ring-1 ring-inset ring-white/20 transition-transform duration-500 group-hover:scale-110`}
              />
              <span
                className={`font-accent text-[9px] uppercase tracking-luxe transition-colors ${
                  on ? 'text-accent' : 'text-muted group-hover:text-accent'
                }`}
              >
                {o.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.p
            key={active.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 font-sans text-[11px] font-light text-faint"
          >
            {active.note}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
