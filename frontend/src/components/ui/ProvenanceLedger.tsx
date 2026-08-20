'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, CircleAlert, FileCheck2, Minus } from 'lucide-react';

import { easeLens, springsHeavy } from '@/lib/motion';

/**
 * The claims a house can make about where its materials came from, and what each
 * one is actually worth as evidence.
 *
 * `weight` is how much the claim should move a buyer's confidence, and it is
 * deliberately not proportional to how impressive the claim sounds. A named mine
 * with a batch number is worth more than any certification scheme, because it can
 * be checked by a third party. "Conflict-free" is worth almost nothing on its
 * own, because the Kimberley Process defines conflict narrowly enough that most
 * of what a buyer is worried about falls outside it.
 *
 * `status` is this house's honest position: 'held' means we can produce the
 * document, 'partial' means for some material only, 'none' means we cannot and
 * will say so rather than implying otherwise.
 */
type ClaimStatus = 'held' | 'partial' | 'none';

interface Claim {
  id: string;
  claim: string;
  /** What the claim actually establishes. */
  means: string;
  /** What it does not establish, which is usually the more useful half. */
  limit: string;
  /** 1–5: evidential weight, not marketing weight. */
  weight: number;
  status: ClaimStatus;
  /** Where we stand, in the first person. */
  position: string;
  category: 'stones' | 'metal' | 'labour' | 'environment';
}

const CLAIMS: Claim[] = [
  {
    id: 'mine-named',
    claim: 'Named mine, with batch',
    means:
      'The specific mine and the specific parcel are recorded, and both can be put to an independent party.',
    limit:
      'Says nothing about conditions at that mine beyond what the mine itself is audited for.',
    weight: 5,
    status: 'partial',
    position:
      'Held for every coloured stone above 0.5ct and for all Botswana and Canadian diamond. Not held for melee, where the parcel is aggregated before we ever see it.',
    category: 'stones',
  },
  {
    id: 'kimberley',
    claim: 'Kimberley Process certificate',
    means: 'The rough was not sold by a rebel group to finance a war against a legitimate government.',
    limit:
      'That is the whole of the definition. It does not address wages, child labour, mine safety, or state violence — a government-run mine with appalling conditions issues valid certificates.',
    weight: 2,
    status: 'held',
    position:
      'Held for all rough diamond, as a legal requirement rather than as an achievement. We do not present it as an ethics claim because it is not one.',
    category: 'stones',
  },
  {
    id: 'recycled-gold',
    claim: 'Recycled gold content',
    means:
      'Gold that has already been mined and refined once, re-refined to the same purity. Chemically indistinguishable from new.',
    limit:
      'Recycled gold displaces demand only if total demand is flat. It also cannot be traced to an origin, by definition — that history is destroyed in the refining.',
    weight: 4,
    status: 'held',
    position:
      '78% of the gold in our own castings by weight, verified by refinery declaration. The remaining 22% is new metal, and we say so on the invoice.',
    category: 'metal',
  },
  {
    id: 'fairmined',
    claim: 'Fairmined or Fairtrade gold',
    means:
      'Artisanal mining cooperatives audited on wages, mercury handling, child labour and land rehabilitation.',
    limit:
      'Supply is genuinely small and costs a premium of 5–15%. A house claiming to use it throughout is either paying that premium or not using much.',
    weight: 5,
    status: 'partial',
    position:
      'Used for the bespoke commissions where the client elects it and pays the premium. We will not claim it across the range, because we could not supply the range with it.',
    category: 'metal',
  },
  {
    id: 'bench-wages',
    claim: 'Bench wages published',
    means: 'What the people who made the piece are actually paid, in the open.',
    limit:
      'A published figure is not an audited one. Ours is not independently verified and we do not claim it is.',
    weight: 4,
    status: 'held',
    position:
      'Every artisan on our bench is salaried, not piece-rate. Piece-rate is what produces the fourteen-hour days that the trade is known for, and we do not use it.',
    category: 'labour',
  },
  {
    id: 'child-labour',
    claim: 'No child labour in the chain',
    means:
      'A claim about every tier of supply, including the ones a house does not directly buy from.',
    limit:
      'Nobody can honestly claim this for aggregated melee or for artisanally-mined coloured stone. Anyone who does has not looked at their fourth tier.',
    weight: 3,
    status: 'partial',
    position:
      'Verified to the second tier by site visit. Beyond that we rely on supplier declaration, which is weaker, and we would rather say so than round it up.',
    category: 'labour',
  },
  {
    id: 'lab-grown',
    claim: 'Lab-grown alternative offered',
    means:
      'Chemically and optically identical stone, grown in weeks, with no mine and no chain to audit.',
    limit:
      'It is energy-intensive, and the resale value is currently a fraction of mined equivalent and still falling. It solves the sourcing question and creates a value one.',
    weight: 3,
    status: 'held',
    position:
      'Offered for any commission, priced separately and labelled permanently on the certificate and inside the shank. We will not sell one as mined, ever.',
    category: 'stones',
  },
  {
    id: 'water',
    claim: 'Closed-loop plating and polishing',
    means:
      'The water and the metal-bearing sludge from plating and polishing are captured and reprocessed rather than discharged.',
    limit:
      'It is a workshop practice, not a supply-chain one. It says nothing about the mine.',
    weight: 3,
    status: 'held',
    position:
      'Both benches run closed-loop, and the recovered metal comes back into casting. It is genuinely the cheapest ethical thing we do.',
    category: 'environment',
  },
  {
    id: 'carbon',
    claim: 'Carbon accounting, published',
    means: 'Emissions measured across scopes one to three and stated.',
    limit:
      'Scope three — everything upstream — is the vast majority and the least certain. A house publishing only scopes one and two is publishing the easy 8%.',
    weight: 4,
    status: 'none',
    position:
      'We do not have this. Scope one and two we could publish tomorrow; scope three we cannot yet measure honestly, and publishing the easy part would be worse than publishing nothing.',
    category: 'environment',
  },
  {
    id: 'buyback',
    claim: 'Lifetime buy-back at metal weight',
    means:
      'The house will take the piece back for its material value at any point, which keeps it out of a landfill and out of a pawnbroker.',
    limit:
      'Metal weight is not what you paid. This is a floor, not a resale value, and the difference is the making.',
    weight: 3,
    status: 'held',
    position:
      'Offered on everything we have ever made, at the day\'s rate, with no time limit and regardless of who owns it now.',
    category: 'metal',
  },
];

const CATEGORIES = [
  { id: 'stones', label: 'Stones' },
  { id: 'metal', label: 'Metal' },
  { id: 'labour', label: 'Labour' },
  { id: 'environment', label: 'Environment' },
] as const;

const STATUS_META: Record<ClaimStatus, { label: string; icon: typeof Check; tone: string }> = {
  held: { label: 'We hold this', icon: Check, tone: 'text-jade-300 border-jade-500/40 bg-jade-500/10' },
  partial: {
    label: 'In part',
    icon: Minus,
    tone: 'text-accent border-accent/40 bg-accent/10',
  },
  none: {
    label: 'We do not',
    icon: CircleAlert,
    tone: 'text-burgundy-300 border-burgundy-500/40 bg-burgundy-500/10',
  },
};

interface ProvenanceLedgerProps {
  className?: string;
}

/**
 * A sourcing ledger that includes the entries we fail.
 *
 * Every jeweller publishes an ethics page and they are all the same page, because
 * they all list only what the house can claim. That makes the whole genre
 * worthless as information: a page with no negative entries carries no signal.
 *
 * So this one is built the other way round. Each row is a *claim the trade makes*
 * — not a claim this house makes — and it carries three things: what the claim
 * actually establishes, what it conspicuously does not, and where this house
 * stands, including the row where the answer is "we do not have this."
 *
 * The weights are evidential rather than promotional and they are deliberately
 * counter-intuitive. A Kimberley certificate scores 2 because the definition of
 * conflict it uses excludes most of what a buyer is worried about. A named mine
 * with a batch number scores 5 because a third party can check it. Sorting by
 * weight is the default, so the strongest evidence is at the top and the
 * best-marketed claim is near the bottom.
 *
 * The tally at the foot is honest arithmetic: claims held over claims possible,
 * weighted. It is not a score out of ten designed to land at nine.
 */
export default function ProvenanceLedger({ className = '' }: ProvenanceLedgerProps) {
  const reduced = useReducedMotion();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]['id'] | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>('kimberley');
  const [sortBy, setSortBy] = useState<'weight' | 'status'>('weight');

  const rows = useMemo(() => {
    const out = CLAIMS.filter((c) => (category === 'all' ? true : c.category === category));
    const order: Record<ClaimStatus, number> = { none: 0, partial: 1, held: 2 };
    return [...out].sort((a, b) =>
      sortBy === 'weight' ? b.weight - a.weight : order[a.status] - order[b.status],
    );
  }, [category, sortBy]);

  /** Weighted tally: what fraction of the available evidence we can actually produce. */
  const tally = useMemo(() => {
    const possible = CLAIMS.reduce((sum, c) => sum + c.weight, 0);
    const earned = CLAIMS.reduce(
      (sum, c) => sum + c.weight * (c.status === 'held' ? 1 : c.status === 'partial' ? 0.5 : 0),
      0,
    );
    return { pct: Math.round((earned / possible) * 100), earned, possible };
  }, []);

  return (
    <div className={className}>
      {/* ---- Filters ---- */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory('all')}
          aria-pressed={category === 'all'}
          className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
            category === 'all'
              ? 'border-accent bg-accent text-onaccent'
              : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
          }`}
        >
          The whole ledger
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(category === c.id ? 'all' : c.id)}
            aria-pressed={category === c.id}
            className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
              category === c.id
                ? 'border-accent bg-accent text-onaccent'
                : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
            }`}
          >
            {c.label}
          </button>
        ))}

        <span className="ml-auto flex items-center gap-2">
          <span className="font-accent text-[9px] uppercase tracking-luxer text-faint">Sort</span>
          {(['weight', 'status'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSortBy(s)}
              aria-pressed={sortBy === s}
              className={`rounded-full border px-3 py-1 font-accent text-[9px] uppercase tracking-luxe transition-all duration-300 ${
                sortBy === s
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-hairline text-faint hover:text-accent'
              }`}
            >
              {s === 'weight' ? 'By evidence' : 'By our standing'}
            </button>
          ))}
        </span>
      </div>

      {/* ---- The ledger ---- */}
      <div className="mt-7 space-y-3">
        {rows.map((claim, i) => {
          const open = openId === claim.id;
          const meta = STATUS_META[claim.status];
          const Icon = meta.icon;

          return (
            <motion.div
              key={claim.id}
              layout={!reduced}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3) }}
              className={`overflow-hidden rounded-3xl border transition-colors duration-500 ${
                open ? 'border-accent/40 bg-canvas-alt/70' : 'border-hairline bg-canvas-alt/40'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : claim.id)}
                aria-expanded={open}
                className="flex w-full items-start gap-4 p-5 text-left md:p-6"
              >
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border ${meta.tone}`}
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="font-display text-lg leading-tight text-primary md:text-xl">
                    {claim.claim}
                  </span>
                  <span className="mt-1 block font-accent text-[9px] uppercase tracking-luxer text-faint">
                    {meta.label}
                  </span>
                </span>

                {/* Evidential weight, as pips. */}
                <span className="mt-1 flex shrink-0 items-center gap-1" aria-label={`Evidential weight ${claim.weight} of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rotate-45 ${
                        n <= claim.weight ? 'bg-accent' : 'bg-line'
                      }`}
                    />
                  ))}
                </span>
              </button>

              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.45, ease: easeLens.focusRing }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-5 px-5 pb-6 md:grid-cols-3 md:px-6">
                    <div>
                      <span className="font-accent text-[9px] uppercase tracking-luxer text-accent">
                        What it establishes
                      </span>
                      <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                        {claim.means}
                      </p>
                    </div>
                    <div>
                      <span className="font-accent text-[9px] uppercase tracking-luxer text-accent">
                        What it does not
                      </span>
                      <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                        {claim.limit}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-hairline bg-surface-sunken p-4">
                      <span className="font-accent text-[9px] uppercase tracking-luxer text-accent">
                        Where we stand
                      </span>
                      <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                        {claim.position}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ---- The tally ---- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={springsHeavy.leaf}
        className="mt-9 flex flex-col gap-6 rounded-3xl border border-accent/30 bg-accent/[0.05] p-7 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-5">
          <FileCheck2 aria-hidden="true" className="h-8 w-8 shrink-0 text-accent" />
          <div>
            <span className="font-display text-4xl text-accent nums-tabular">{tally.pct}%</span>
            <span className="ml-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
              of the available evidence
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: tally.pct / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: easeLens.focusRing }}
              className="h-full origin-left rounded-full bg-gradient-to-r from-accent/50 to-accent"
            />
          </div>
          <p className="mt-3 font-sans text-xs font-light leading-relaxed text-muted">
            Weighted by evidential value, half credit where we hold it in part. It is not out of ten
            and it is not designed to land at nine. The two rows we fail are in the list above rather
            than left out of it.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
