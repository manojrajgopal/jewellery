'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { useOwnedPieces } from '@/hooks/useOwnedPieces';

/**
 * The gap between what a collection is insured for and what it would cost to
 * replace.
 *
 * The vault already lists the pieces and says which are due a service, and the
 * care bench already lists the documents an insurer will ask for. Neither of
 * them answers the question that actually costs people money, which is: the
 * valuation in the file is four years old, and gold has moved.
 *
 * Underinsurance is not a fringe problem. A collection valued in 2020 and never
 * revisited is, on any reasonable index, covered for something like two thirds
 * of what it would now cost to replace — and the way most policies handle that
 * is worse than simply paying two thirds. Under *average*, an insurer may
 * reduce a claim by the same proportion the policy is underinsured, so a 30%
 * shortfall on the schedule can mean a 30% reduction on a claim for a single
 * lost ring that was itself fully covered. That clause is in almost every
 * household policy and almost nobody has read it.
 *
 * Three traps are laid out here because all three are common and none of them
 * is a secret:
 *
 *   - **Single article limit.** A household policy typically caps any one item
 *     at a fraction of the total, often around ₹50,000 unless the piece is
 *     specified by name. A ₹4,00,000 ring inside a ₹15,00,000 policy is not
 *     covered for ₹4,00,000 unless it is scheduled individually.
 *   - **Indemnity versus new-for-old.** Indemnity pays the second-hand value,
 *     which for jewellery is roughly half. The difference in premium between
 *     the two is small and the difference at claim is enormous.
 *   - **Away from home.** Most household cover stops at the front door unless
 *     personal possessions cover is added, and jewellery is overwhelmingly lost
 *     away from home.
 *
 * The index is indicative and the panel says so. This is not a valuation and it
 * is not advice — it is arithmetic anybody can check, done in public.
 */

/** Indicative annual movement, by what the piece is mostly made of. */
const DRIFT = {
  gold: 0.092,
  stones: 0.041,
  labour: 0.068,
} as const;

const rupees = (n: number) =>
  `₹${Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const THIS_YEAR = 2026;

export default function CoverageGap({ className = '' }: { className?: string }) {
  const { count, hydrated } = useOwnedPieces();

  const [sumInsured, setSumInsured] = useState(1_500_000);
  const [valuedIn, setValuedIn] = useState(2021);
  // Composition of the collection by value, which decides which index applies.
  const [goldShare, setGoldShare] = useState(55);
  const [stoneShare, setStoneShare] = useState(30);
  const [scheduled, setScheduled] = useState(false);
  const [newForOld, setNewForOld] = useState(true);
  const [largest, setLargest] = useState(400_000);

  const labourShare = Math.max(0, 100 - goldShare - stoneShare);
  const years = Math.max(0, THIS_YEAR - valuedIn);

  const replacement = useMemo(() => {
    const g = (goldShare / 100) * sumInsured * (1 + DRIFT.gold) ** years;
    const s = (stoneShare / 100) * sumInsured * (1 + DRIFT.stones) ** years;
    const l = (labourShare / 100) * sumInsured * (1 + DRIFT.labour) ** years;
    return g + s + l;
  }, [sumInsured, goldShare, stoneShare, labourShare, years]);

  const gap = replacement - sumInsured;
  const shortfallPct = replacement > 0 ? gap / replacement : 0;

  // What a claim on the largest single piece would actually pay, once the
  // single-article cap, average, and the indemnity basis have all been applied.
  const claim = useMemo(() => {
    const cap = scheduled ? largest : Math.min(largest, 50_000);
    const afterAverage = cap * (1 - Math.max(0, shortfallPct));
    return newForOld ? afterAverage : afterAverage * 0.5;
  }, [scheduled, largest, shortfallPct, newForOld]);

  const recovered = largest > 0 ? claim / largest : 0;

  const severity =
    recovered > 0.85 ? 'var(--series-1)' : recovered > 0.5 ? 'var(--series-2)' : 'var(--series-4)';

  return (
    <div className={className}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        {/* What is on the policy. */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="cov-sum"
              className="font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              Sum insured on the schedule
            </label>
            <p className="nums-instrument mt-1 font-display text-3xl text-primary">
              {rupees(sumInsured)}
            </p>
            <input
              id="cov-sum"
              type="range"
              min={100_000}
              max={10_000_000}
              step={50_000}
              value={sumInsured}
              onChange={(e) => setSumInsured(Number(e.target.value))}
              className="range-overlay mt-2 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="cov-year"
              className="font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              Last valued
            </label>
            <p className="nums-instrument mt-1 font-display text-3xl text-primary">
              {valuedIn}
              <span className="ml-2 font-accent text-xs uppercase tracking-luxe text-muted">
                {years === 0 ? 'this year' : `${years} year${years === 1 ? '' : 's'} ago`}
              </span>
            </p>
            <input
              id="cov-year"
              type="range"
              min={2012}
              max={THIS_YEAR}
              value={valuedIn}
              onChange={(e) => setValuedIn(Number(e.target.value))}
              className="range-overlay mt-2 w-full"
            />
          </div>

          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              What the collection is made of, by value
            </p>
            <div className="mt-3 space-y-4">
              <Share
                id="gold"
                label="Metal"
                value={goldShare}
                onChange={setGoldShare}
                tone="var(--series-2)"
              />
              <Share
                id="stone"
                label="Stones"
                value={stoneShare}
                onChange={setStoneShare}
                tone="var(--series-3)"
              />
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
                    <span
                      className="series-swatch"
                      style={{ background: 'rgb(var(--series-1))' }}
                      aria-hidden="true"
                    />
                    Making
                  </span>
                  <span className="nums-instrument font-accent text-[10px] text-primary">
                    {labourShare}%
                  </span>
                </div>
                <p className="mt-1 font-sans text-xs font-light text-faint">
                  Whatever is left. Bench hours have risen faster than stones and
                  slower than gold, and they are the part a valuation from five
                  years ago understates most quietly.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-line-subtle pt-5">
            <Toggle
              label="Pieces are specified individually"
              hint="Scheduled by name and value, rather than sitting inside the general contents sum."
              on={scheduled}
              onChange={setScheduled}
            />
            <Toggle
              label="Cover is new-for-old"
              hint="Rather than indemnity, which pays the second-hand value — roughly half, for jewellery."
              on={newForOld}
              onChange={setNewForOld}
            />
          </div>

          <div>
            <label
              htmlFor="cov-largest"
              className="font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              Your single most valuable piece
            </label>
            <p className="nums-instrument mt-1 font-display text-2xl text-primary">
              {rupees(largest)}
            </p>
            <input
              id="cov-largest"
              type="range"
              min={25_000}
              max={2_500_000}
              step={25_000}
              value={largest}
              onChange={(e) => setLargest(Number(e.target.value))}
              className="range-overlay mt-2 w-full"
            />
          </div>
        </div>

        {/* What it would actually cost, and what a claim would actually pay. */}
        <div>
          <div className="chart-surface rounded-2xl p-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              Cover against replacement
            </p>

            <div className="mt-5 space-y-4">
              <Bar
                label="Insured for"
                value={sumInsured}
                max={Math.max(replacement, sumInsured)}
                tone="var(--series-1)"
                display={rupees(sumInsured)}
              />
              <Bar
                label="Would cost to replace today"
                value={replacement}
                max={Math.max(replacement, sumInsured)}
                tone="var(--series-2)"
                display={rupees(replacement)}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-line-subtle pt-5">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                Shortfall
              </span>
              <span
                className="nums-instrument font-display text-3xl"
                style={{ color: gap > 0 ? 'rgb(var(--series-4))' : 'rgb(var(--series-1))' }}
              >
                {gap > 0 ? rupees(gap) : 'None'}
                {gap > 0 && (
                  <span className="ml-2 font-accent text-sm">
                    {Math.round(shortfallPct * 100)}%
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* The claim, which is the number that matters and the one nobody
              works out until the day they need it. */}
          <motion.div
            key={`${scheduled}-${newForOld}-${Math.round(recovered * 100)}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="spec-plate mt-6 p-5"
          >
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              If you lost that one piece tomorrow
            </p>

            <div className="mt-4 flex items-end gap-4">
              <div>
                <p className="nums-instrument font-display text-4xl" style={{ color: `rgb(${severity})` }}>
                  {rupees(claim)}
                </p>
                <p className="mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                  paid, against {rupees(largest)} to replace it
                </p>
              </div>
              <p
                className="nums-instrument ml-auto font-display text-2xl"
                style={{ color: `rgb(${severity})` }}
              >
                {Math.round(recovered * 100)}%
              </p>
            </div>

            <ul className="mt-5 space-y-2 border-t border-line-subtle pt-4">
              {!scheduled && largest > 50_000 && (
                <li className="font-sans text-sm font-light leading-relaxed text-muted">
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    Single article limit ·{' '}
                  </span>
                  Unspecified, so the policy caps this piece at about ₹50,000
                  however much the total cover is. Specifying it costs almost
                  nothing and is the single highest-value thing on this panel.
                </li>
              )}
              {shortfallPct > 0.05 && (
                <li className="font-sans text-sm font-light leading-relaxed text-muted">
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    Average ·{' '}
                  </span>
                  The schedule is {Math.round(shortfallPct * 100)}% short, so an
                  insurer applying average may reduce this claim by the same
                  proportion — even though this individual piece was within its
                  own limit.
                </li>
              )}
              {!newForOld && (
                <li className="font-sans text-sm font-light leading-relaxed text-muted">
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    Indemnity ·{' '}
                  </span>
                  Pays second-hand value, which for jewellery is around half. The
                  premium difference to new-for-old is usually a few hundred
                  rupees a year.
                </li>
              )}
              {scheduled && newForOld && shortfallPct <= 0.05 && (
                <li className="font-sans text-sm font-light leading-relaxed text-muted">
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    Nothing to flag ·{' '}
                  </span>
                  Specified, new-for-old, and valued recently enough that average
                  should not bite. This is what a policy is supposed to look
                  like, and it is unusual.
                </li>
              )}
            </ul>
          </motion.div>

          {hydrated && count > 0 && (
            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
              You have{' '}
              <span className="nums-instrument text-primary">{count}</span>{' '}
              piece{count === 1 ? '' : 's'} recorded in the vault. Bring
              the list and we will value the lot in one appointment — an
              insurance valuation is a written document with photographs, and it
              is what an insurer asks for when they have already decided to argue.
            </p>
          )}

          <p className="mt-5 border-t border-line-subtle pt-5 font-sans text-xs font-light leading-relaxed text-faint">
            Indicative arithmetic, not a valuation and not advice. The indices
            are our own working figures — metal 9.2%, stones 4.1%, bench 6.8% a
            year — and they are shown rather than hidden so you can disagree with
            them. Your policy wording governs, and it is the document worth
            twenty minutes of a Sunday.
          </p>
        </div>
      </div>
    </div>
  );
}

function Share({
  id,
  label,
  value,
  onChange,
  tone,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={`cov-${id}`}
          className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted"
        >
          <span className="series-swatch" style={{ background: `rgb(${tone})` }} aria-hidden="true" />
          {label}
        </label>
        <span className="nums-instrument font-accent text-[10px] text-primary">{value}%</span>
      </div>
      <input
        id={`cov-${id}`}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-overlay mt-2 w-full"
      />
    </div>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]"
      />
      <span>
        <span className="font-accent text-[10px] uppercase tracking-luxe text-primary">
          {label}
        </span>
        <span className="mt-1 block font-sans text-xs font-light leading-relaxed text-faint">
          {hint}
        </span>
      </span>
    </label>
  );
}

function Bar({
  label,
  value,
  max,
  tone,
  display,
}: {
  label: string;
  value: number;
  max: number;
  tone: string;
  display: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
          <span className="series-swatch" style={{ background: `rgb(${tone})` }} aria-hidden="true" />
          {label}
        </span>
        <span className="nums-instrument font-accent text-[10px] text-primary">{display}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
        <motion.div
          className="h-full origin-left rounded-full"
          style={{ background: `rgb(${tone})` }}
          animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 26 }}
        />
      </div>
    </div>
  );
}
