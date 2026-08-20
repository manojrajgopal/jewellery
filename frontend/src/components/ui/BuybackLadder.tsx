'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeftRight, Banknote, Info } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * The three ways a piece can come back, and what each returns.
 *
 * `metalShare` is the fraction of the *current* metal value returned, and
 * `makingShare` is the fraction of the original making charge returned. Keeping
 * them separate is the entire honesty of this component: almost every buy-back
 * scheme in the trade quotes one blended percentage, which conceals the fact that
 * the making charge — usually 8 to 14 per cent of what was paid — is returned at
 * nothing on a cash sale and at close to full value on an exchange.
 *
 * That single asymmetry is why exchange rates look generous and cash rates look
 * mean. They are the same policy seen from two ends.
 */
interface Route {
  id: string;
  name: string;
  icon: typeof Banknote;
  metalShare: number;
  makingShare: number;
  /** Fraction of the stones' original invoice value returned. */
  stoneShare: number;
  days: number;
  what: string;
  /** The condition attached, stated as a condition rather than as small print. */
  condition: string;
}

const ROUTES: Route[] = [
  {
    id: 'exchange',
    name: 'Exchange for something else',
    icon: ArrowLeftRight,
    metalShare: 1,
    makingShare: 0.85,
    stoneShare: 0.9,
    days: 1,
    what:
      'The piece is weighed, the stones are re-graded, and the whole figure is credited against anything in the house of greater value. Same day, across the counter.',
    condition:
      'The new piece must be worth at least the credit. We will not pay a difference out, because that is a cash sale wearing an exchange’s clothes and it is priced differently.',
  },
  {
    id: 'upgrade',
    name: 'Upgrade the same piece',
    icon: ArrowLeftRight,
    metalShare: 1,
    makingShare: 1,
    stoneShare: 1,
    days: 21,
    what:
      'The stone comes out and a larger one goes in, or the setting is remade around what you have. Nothing is bought back at all — the value simply stays in the piece.',
    condition:
      'Only available where the original piece was made here, because we are re-using our own bench work and we know what is inside it.',
  },
  {
    id: 'cash',
    name: 'Sell it back for money',
    icon: Banknote,
    metalShare: 0.94,
    makingShare: 0,
    stoneShare: 0.62,
    days: 3,
    what:
      'We buy it outright at the day’s metal rate less refining, plus a trade figure for the stones. Paid by bank transfer within three working days.',
    condition:
      'The making charge is not returned. It paid for hours that were spent, and there is no version of this where a workshop can hand those back — anybody quoting otherwise has built it into the original price.',
  },
];

/** Rupees per gram, indicative and matching the strip elsewhere on the site. */
const RATES: Record<string, { label: string; perGram: number }> = {
  'gold-22': { label: '22K gold', perGram: 7150 },
  'gold-18': { label: '18K gold', perGram: 5980 },
  platinum: { label: 'Platinum 950', perGram: 3450 },
};

/** Refining loss, which is real and is charged by the refiner rather than by us. */
const REFINING = 0.02;

const RUPEES = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/**
 * What a piece is worth when it comes back.
 *
 * Every house in this trade operates a buy-back and almost none publish the
 * arithmetic, which is how a customer discovers at the counter that the
 * "eighty-five per cent" they were told about is eighty-five per cent of
 * something they had assumed meant the price they paid.
 *
 * The panel is built round the one distinction that explains the whole thing:
 * metal, making and stones come back at three completely different rates, and
 * which route you take changes only two of the three. Metal is metal and comes
 * back at nearly the market rate on any route. Making charge comes back in full
 * on an upgrade, mostly on an exchange, and not at all for cash. Stones sit
 * between.
 *
 * The metal rate also *moves*, which is the second thing nobody says out loud: a
 * 22K piece bought eight years ago at ₹4,800 a gram is being bought back at
 * today's rate, and that alone can exceed the entire making charge. The slider
 * exists so somebody can see that for themselves rather than take our word for
 * it.
 */
export default function BuybackLadder({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [metal, setMetal] = useState('gold-22');
  const [grams, setGrams] = useState(18);
  const [stoneValue, setStoneValue] = useState(120000);
  const [makingPct, setMakingPct] = useState(11);
  const [thenRate, setThenRate] = useState(4800);

  const rate = RATES[metal] ?? RATES['gold-22'];

  const figures = useMemo(() => {
    const metalThen = grams * thenRate;
    const metalNow = grams * rate.perGram;
    const makingPaid = (metalThen + stoneValue) * (makingPct / 100);
    const paid = metalThen + stoneValue + makingPaid;

    const routes = ROUTES.map((route) => {
      const metalBack = metalNow * route.metalShare * (route.id === 'cash' ? 1 - REFINING : 1);
      const makingBack = makingPaid * route.makingShare;
      const stoneBack = stoneValue * route.stoneShare;
      const total = metalBack + makingBack + stoneBack;
      return { route, metalBack, makingBack, stoneBack, total, share: total / paid };
    });

    return { paid, metalThen, metalNow, makingPaid, routes };
  }, [grams, thenRate, stoneValue, makingPct, rate.perGram]);

  const best = Math.max(...figures.routes.map((r) => r.total));

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* What was bought. */}
        <div className="space-y-7">
          <fieldset>
            <legend className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              What the piece is
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(RATES).map(([id, m]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMetal(id)}
                  aria-pressed={metal === id}
                  className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                    metal === id
                      ? 'border-accent/60 bg-accent/12 text-accent'
                      : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          <Slider
            id="bb-grams"
            label="Metal weight"
            value={grams}
            suffix="g"
            min={2}
            max={120}
            step={1}
            onChange={setGrams}
            hint="On the tag, and stamped inside anything we made."
          />

          <Slider
            id="bb-then"
            label="Metal rate the day you bought it"
            value={thenRate}
            prefix="₹"
            suffix="/g"
            min={2400}
            max={9000}
            step={50}
            onChange={setThenRate}
            hint={`Today it is ₹${rate.perGram.toLocaleString('en-IN')} a gram. The gap between the two is yours, not ours.`}
          />

          <Slider
            id="bb-stones"
            label="Stones, at their original invoice value"
            value={stoneValue}
            prefix="₹"
            min={0}
            max={2000000}
            step={10000}
            onChange={setStoneValue}
            hint="Zero for a plain piece. Diamonds hold value far better than coloured stones on a cash sale."
          />

          <Slider
            id="bb-making"
            label="Making charge at the time"
            value={makingPct}
            suffix="%"
            min={4}
            max={22}
            step={0.5}
            onChange={setMakingPct}
            hint="On our invoices it is a separate line. If it was not on yours, assume the higher end of this range."
          />
        </div>

        {/* What was paid, itemised the way it should have been on the invoice. */}
        <div className="rounded-2xl border border-hairline bg-surface-raised/45 p-6">
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            What you paid, then
          </p>
          <div className="mt-4 space-y-0">
            <Row label={`Metal · ${grams}g at ₹${thenRate.toLocaleString('en-IN')}`} value={RUPEES(figures.metalThen)} />
            <Row label="Stones" value={RUPEES(stoneValue)} dim={stoneValue === 0} />
            <Row label={`Making at ${makingPct}%`} value={RUPEES(figures.makingPaid)} />
            <Row label="Total" value={RUPEES(figures.paid)} strong />
          </div>

          <p className="mt-6 border-t border-hairline pt-5 font-accent text-[10px] uppercase tracking-luxe text-accent">
            What the metal alone is worth now
          </p>
          <p className="nums-tabular mt-2 font-display text-3xl text-accent">
            {RUPEES(figures.metalNow)}
          </p>
          <p className="mt-1 nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
            {figures.metalNow >= figures.metalThen ? '+' : ''}
            {Math.round(((figures.metalNow - figures.metalThen) / Math.max(1, figures.metalThen)) * 100)}%
            on the metal since you bought it
          </p>

          {figures.metalNow - figures.metalThen > figures.makingPaid && (
            <p className="mt-4 flex gap-2 border-t border-hairline pt-4 font-sans text-[11px] font-light leading-relaxed text-jade-300">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              The metal has moved further than the making charge ever cost you. On these figures
              the piece has already paid for its own workmanship.
            </p>
          )}
        </div>
      </div>

      {/* The three routes. */}
      <div className="grid gap-5 lg:grid-cols-3">
        {figures.routes.map(({ route, metalBack, makingBack, stoneBack, total, share }, i) => {
          const Icon = route.icon;
          const isBest = total === best;
          return (
            <motion.article
              key={route.id}
              initial={reduced ? undefined : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.07, ease: easeCine.glass }}
              className={`flex flex-col rounded-2xl border p-6 ${
                isBest ? 'border-accent/55 bg-surface-raised/70' : 'border-hairline bg-surface-raised/25'
              }`}
            >
              <p className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isBest ? 'text-accent' : 'text-muted'}`} aria-hidden="true" />
                <span className="font-display text-xl leading-tight text-primary">{route.name}</span>
              </p>

              <p className="nums-tabular mt-4 font-display text-4xl leading-none text-accent">
                {RUPEES(total)}
              </p>
              <p className="nums-tabular mt-1.5 font-accent text-[10px] uppercase tracking-luxe text-faint">
                {Math.round(share * 100)}% of what you paid · {route.days} day
                {route.days === 1 ? '' : 's'}
              </p>

              {/* The three components, so the figure is never a single opaque
                  percentage. */}
              <div className="mt-5 space-y-2 border-t border-hairline pt-4">
                <Component label="Metal" value={metalBack} share={route.metalShare} reduced={!!reduced} />
                <Component label="Making" value={makingBack} share={route.makingShare} reduced={!!reduced} />
                <Component label="Stones" value={stoneBack} share={route.stoneShare} reduced={!!reduced} />
              </div>

              <p className="mt-5 font-sans text-xs font-light leading-relaxed text-secondary">
                {route.what}
              </p>
              <p className="mt-3 border-t border-hairline pt-3 font-sans text-[11px] font-light leading-relaxed text-burgundy-300">
                {route.condition}
              </p>
            </motion.article>
          );
        })}
      </div>

      <p className="font-sans text-xs font-light leading-relaxed text-faint">
        Indicative. Metal rates move daily, stones are re-graded rather than taken on the old
        report, and refining loss on a cash sale is charged to us by the refiner at {(REFINING * 100).toFixed(0)}%
        and passed on at cost. What none of these figures include is a discount, because a
        buy-back is not a discount — it is the resale value of an object, and publishing it is the
        only way a customer can tell whether the original price was fair.
      </p>
    </div>
  );
}

function Component({
  label,
  value,
  share,
  reduced,
}: {
  label: string;
  value: number;
  share: number;
  reduced: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
          {label} · {Math.round(share * 100)}% back
        </span>
        <span className="nums-tabular font-sans text-xs font-light text-primary">
          {RUPEES(value)}
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[rgb(var(--hairline)/0.14)]">
        <motion.span
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: share }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeCine.glass }}
          style={{ transformOrigin: '0% 50%' }}
          className={`block h-full w-full rounded-full ${
            share >= 0.9 ? 'bg-jade-300' : share >= 0.5 ? 'bg-gold-400' : 'bg-burgundy-300'
          }`}
        />
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  hint,
  prefix = '',
  suffix = '',
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-accent text-[10px] uppercase tracking-luxe text-accent">
          {label}
        </label>
        <span className="nums-tabular font-display text-2xl text-primary">
          {prefix}
          {value.toLocaleString('en-IN')}
          {suffix && (
            <span className="ml-0.5 font-accent text-[10px] uppercase tracking-luxe text-faint">
              {suffix}
            </span>
          )}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-overlay mt-3 w-full"
      />
      <p className="mt-1.5 font-sans text-[11px] font-light leading-relaxed text-faint">{hint}</p>
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
  dim = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 last:border-b-0 ${
        dim ? 'opacity-45' : ''
      }`}
    >
      <span className={`font-sans text-xs font-light ${strong ? 'text-primary' : 'text-secondary'}`}>
        {label}
      </span>
      <span
        className={`nums-tabular font-sans text-sm ${
          strong ? 'font-normal text-accent' : 'font-light text-primary'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
