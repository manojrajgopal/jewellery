'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, CircleAlert, Fingerprint, Landmark, Percent, ShieldCheck } from 'lucide-react';

import { ease, shudder, spiralIn, springs } from '@/lib/motion';

/**
 * The four marks struck on hallmarked Indian gold, in the order they are read.
 * `at` positions each one inside the enlarged stamp, as a percentage — the stamp
 * is drawn rather than photographed so it stays sharp at any zoom and retints
 * with the theme.
 */
const MARKS = [
  {
    id: 'bis',
    icon: ShieldCheck,
    label: 'The BIS mark',
    at: { x: 18, y: 34 },
    short: 'Bureau of Indian Standards',
    detail:
      'The triangle is the only mark that says the piece was tested by somebody other than the person selling it. Everything else on the stamp is information; this one is the guarantee, and a piece without it has been graded by its own maker.',
  },
  {
    id: 'purity',
    icon: Percent,
    label: 'Purity and fineness',
    at: { x: 42, y: 30 },
    short: '22K916 · 18K750 · 14K585',
    detail:
      'Two numbers for the same fact. The karat is the fraction in twenty-fourths; the fineness is the same fraction in parts per thousand. 22K916 means 916 parts gold in 1,000 — which is why a 22K piece is 91.6% gold and not 100%, and why nobody sells 24K rings: pure gold bends under a fingernail.',
  },
  {
    id: 'huid',
    icon: Fingerprint,
    label: 'The HUID',
    at: { x: 66, y: 36 },
    short: 'Six alphanumeric characters',
    detail:
      'A Hallmark Unique Identification code, laser-struck and unique to that one piece. It is not a batch number and not a design code: two identical bangles carry different HUIDs, which is what makes it possible to check a specific object rather than a model.',
  },
  {
    id: 'centre',
    icon: Landmark,
    label: 'The assay centre',
    at: { x: 86, y: 32 },
    short: 'Where it was tested',
    detail:
      'The mark of the assaying and hallmarking centre that did the testing. Under the current scheme the jeweller\'s own identification mark is optional and this one is not — the record of who tested it outlives the shop that sold it.',
  },
] as const;

/** Fineness table, used by both the marks panel and the code reader. */
const FINENESS: Record<string, { karat: string; pct: string; use: string }> = {
  '916': { karat: '22K', pct: '91.6%', use: 'Traditional Indian gold. Chains, bangles, temple work.' },
  '750': { karat: '18K', pct: '75.0%', use: 'Diamond and gem setting. Holds a prong without creeping.' },
  '585': { karat: '14K', pct: '58.5%', use: 'Daily wear and men\'s pieces. The hardest of the three.' },
  '995': { karat: '24K', pct: '99.5%', use: 'Bullion and coin. Too soft to set or to wear.' },
};

/**
 * The hallmark, magnified and annotated.
 *
 * Every jeweller's site explains hallmarking as a paragraph of policy. Nobody
 * reads it, because the thing a customer is actually holding is a stamp about a
 * millimetre across that they cannot make out. So this is the stamp at forty
 * times its real size, with the four marks separated and each one answering the
 * only question a customer has about it: what does this prove?
 *
 * The second half is a reader for the six-character HUID. It deliberately does
 * *not* claim to verify anything — there is no public API that would let a
 * website do that honestly — and says so. What it can do is check the format, and
 * tell you exactly where the real check is made. A tool that pretended to verify
 * would be worse than no tool.
 */
export default function HallmarkDecoder({ className = '' }: { className?: string }) {
  const [active, setActive] = useState<(typeof MARKS)[number]['id']>('bis');
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);

  const mark = MARKS.find((m) => m.id === active) ?? MARKS[0];

  const verdict = useMemo(() => {
    const raw = code.trim().toUpperCase();
    if (!raw) return null;
    if (!/^[0-9A-Z]{6}$/.test(raw)) {
      return {
        ok: false as const,
        title: 'Not a HUID',
        body:
          raw.length === 6
            ? 'Six characters, but a HUID uses only digits and unaccented capitals.'
            : `A HUID is exactly six characters. This one has ${raw.length}.`,
      };
    }
    return {
      ok: true as const,
      title: 'Well-formed',
      body:
        'The format is right, which is all any website can tell you. The code itself is checked against the BIS register in the BIS CARE app — scan it there, and it should return the piece, its purity and the centre that tested it. If it returns nothing, or returns a different article, stop and bring the piece to us.',
    };
  }, [code]);

  return (
    <div className={`grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] ${className}`}>
      {/* ---- The magnified stamp ---- */}
      <div>
        <div className="relative overflow-hidden rounded-3xl border border-hairline plate-marble p-6 md:p-10">
          {/* Struck metal ground. The marks sit in a shallow trough, which is why
              the plate is darker behind them than around them. */}
          <div className="engraved relative h-40 rounded-2xl border border-hairline bg-surface-sunken/60 md:h-52">
            {MARKS.map((m, i) => {
              const on = m.id === active;
              const Icon = m.icon;
              return (
                <motion.button
                  key={m.id}
                  type="button"
                  onClick={() => setActive(m.id)}
                  variants={spiralIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  aria-pressed={on}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
                  style={{ left: `${m.at.x}%`, top: `${m.at.y + 14}%` }}
                >
                  <motion.span
                    animate={on ? { scale: 1.14 } : { scale: 1 }}
                    transition={springs.chip}
                    className={`grid h-14 w-14 place-items-center rounded-full border transition-colors duration-500 md:h-16 md:w-16 ${
                      on
                        ? 'border-accent/70 bg-accent/12 text-accent shadow-gold-bloom'
                        : 'border-hairline bg-canvas/50 text-muted hover:text-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                  </motion.span>
                  <span className="mt-2 block whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.button>
              );
            })}

            {/* The trough's own highlight, travelling. Struck metal is never
                evenly lit, and a flat plate is the tell that this is a diagram. */}
            <span aria-hidden="true" className="beam-sweep absolute inset-0 rounded-2xl" />
          </div>

          <p className="mt-6 text-center font-accent text-[10px] uppercase tracking-luxer text-faint">
            Shown at roughly forty times actual size
          </p>
        </div>

        {/* ---- The detail for the selected mark ---- */}
        <div className="mt-6 min-h-[11rem] rounded-3xl border border-hairline bg-surface-raised/50 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={mark.id}
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: ease.luxury }}
            >
              <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                {mark.short}
              </span>
              <h3 className="mt-2 font-display text-2xl text-primary md:text-3xl">{mark.label}</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-secondary md:text-base">
                {mark.detail}
              </p>

              {/* The purity mark gets the table, because the numbers are the
                  answer there and a paragraph about them is not. */}
              {mark.id === 'purity' && (
                <dl className="mt-5 grid gap-2 sm:grid-cols-2">
                  {Object.entries(FINENESS).map(([fine, v], i) => (
                    <motion.div
                      key={fine}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.4 }}
                      className="rounded-xl border border-hairline bg-canvas/60 px-4 py-3"
                    >
                      <dt className="flex items-baseline justify-between">
                        <span className="font-accent text-sm text-accent">{v.karat}</span>
                        <span className="font-sans text-xs text-faint nums-tabular">
                          {fine} · {v.pct}
                        </span>
                      </dt>
                      <dd className="mt-1 font-sans text-xs font-light leading-relaxed text-muted">
                        {v.use}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ---- The code reader ---- */}
      <aside className="self-start rounded-3xl border border-hairline bg-canvas-alt/70 p-6 md:p-7">
        <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
          Read a HUID
        </span>
        <h3 className="mt-2 font-display text-2xl text-primary">Check the format</h3>
        <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
          Type the six characters laser-struck beside the BIS triangle. We check the shape of
          the code; the register itself is checked in the BIS CARE app.
        </p>

        <motion.div variants={shudder} animate={checked && verdict && !verdict.ok ? 'visible' : undefined}>
          <label htmlFor="huid" className="sr-only">
            Hallmark unique identification
          </label>
          <input
            id="huid"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.slice(0, 8));
              setChecked(false);
            }}
            placeholder="A1B2C3"
            maxLength={8}
            autoComplete="off"
            spellCheck={false}
            className="input-gold mt-5 text-center font-accent text-2xl uppercase tracking-luxer nums-slashed"
          />
        </motion.div>

        <button
          type="button"
          onClick={() => setChecked(true)}
          className="mt-5 w-full rounded-full border border-accent/50 bg-accent/10 px-5 py-2.5 font-accent text-[11px] uppercase tracking-luxer text-accent transition-colors duration-300 hover:bg-accent hover:text-onaccent"
        >
          Read the code
        </button>

        <AnimatePresence>
          {checked && verdict && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: ease.luxury }}
              className="overflow-hidden"
            >
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  verdict.ok
                    ? 'border-jade-500/40 bg-jade-900/10'
                    : 'border-burgundy-500/40 bg-burgundy-900/10'
                }`}
              >
                <span className="flex items-center gap-2 font-accent text-[11px] uppercase tracking-luxe">
                  {verdict.ok ? (
                    <BadgeCheck className="h-4 w-4 text-jade-300" aria-hidden="true" />
                  ) : (
                    <CircleAlert className="h-4 w-4 text-burgundy-300" aria-hidden="true" />
                  )}
                  <span className={verdict.ok ? 'text-jade-300' : 'text-burgundy-300'}>
                    {verdict.title}
                  </span>
                </span>
                <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                  {verdict.body}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 border-t border-hairline pt-4 font-sans text-[11px] font-light leading-relaxed text-faint">
          Nothing typed here leaves your browser. We do not hold a copy of the register and would
          not be the right place to check one against.
        </p>
      </aside>
    </div>
  );
}
