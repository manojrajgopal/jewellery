'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FileText, Plane, ShieldCheck } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * Destinations we actually ship to, with the two rates that decide the landed
 * cost and the one rule that catches people out.
 *
 * `duty` is the import duty on jewellery as a fraction of declared value, and
 * `tax` is the consumption tax applied *on top of the duty-inclusive value* —
 * which is the compounding almost nobody expects and is why a 20% headline can
 * arrive as 27%.
 *
 * `threshold` is the declared value below which nothing is charged. Under it the
 * whole calculation collapses to zero, and knowing where the line sits is often
 * worth more than knowing the rates.
 *
 * These are indicative figures for jewellery specifically, not general
 * merchandise rates, and they move. The panel says so, and the only honest use
 * of it is to know the order of magnitude before you commit.
 */
interface Destination {
  id: string;
  name: string;
  /** Import duty on jewellery, as a fraction. */
  duty: number;
  /** Consumption tax (VAT/GST/sales), as a fraction. */
  tax: number;
  /** Whether the tax is charged on the duty-inclusive value. */
  compounds: boolean;
  /** De minimis, in rupees, below which nothing is charged. */
  threshold: number;
  /** The local rule that catches people out. */
  catch: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: 'uk',
    name: 'United Kingdom',
    duty: 0.025,
    tax: 0.2,
    compounds: true,
    threshold: 4000,
    catch:
      'VAT is charged on the duty-inclusive value *and* on the shipping, so the courier’s fee is taxed too. Hallmarking law also requires UK assay for anything sold onward.',
  },
  {
    id: 'us',
    name: 'United States',
    duty: 0.055,
    tax: 0,
    compounds: false,
    threshold: 66000,
    catch:
      'No federal sales tax on import, but the state you receive it in may levy use tax when you register it for insurance. The de minimis is high — most single pieces arrive clear.',
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    duty: 0.05,
    tax: 0.05,
    compounds: true,
    threshold: 22000,
    catch:
      'Gold jewellery above 22K is treated differently from set pieces at some ports. Declare the karat on the invoice or expect the consignment to be held for assay.',
  },
  {
    id: 'sg',
    name: 'Singapore',
    duty: 0,
    tax: 0.09,
    compounds: false,
    threshold: 25000,
    catch:
      'No duty at all on jewellery, which makes it the cheapest destination on this list — but GST is charged on the full CIF value with no relief for personal effects.',
  },
  {
    id: 'au',
    name: 'Australia',
    duty: 0.05,
    tax: 0.1,
    compounds: true,
    threshold: 55000,
    catch:
      'GST applies from the first dollar once the threshold is crossed, not just to the excess — so a consignment just over the line is charged on all of it.',
  },
  {
    id: 'ca',
    name: 'Canada',
    duty: 0.065,
    tax: 0.13,
    compounds: true,
    threshold: 1200,
    catch:
      'The lowest threshold on this list by a wide margin, and the tax rate varies by province. Assume something is payable on anything worth insuring.',
  },
];

/** What has to be in the envelope, and what happens without each one. */
const PAPERS = [
  {
    id: 'invoice',
    label: 'Commercial invoice, with the karat and stone weights itemised',
    without: 'The consignment is valued by the officer rather than by you, and their figure is final.',
  },
  {
    id: 'certificate',
    label: 'The grading report for every stone above 0.30ct',
    without: 'Set stones are assumed to be the highest grade consistent with their size, which raises the declared value.',
  },
  {
    id: 'kimberley',
    label: 'Kimberley Process certificate for loose diamonds',
    without: 'Loose diamonds without it do not enter. This is not a fine, it is a refusal.',
  },
  {
    id: 'hallmark',
    label: 'BIS hallmark declaration and the assay certificate',
    without: 'Some destinations require local assay before onward sale, and having ours shortens that to a formality.',
  },
  {
    id: 'insurance',
    label: 'The insurance schedule, naming the carrier and the transit',
    without: 'Cover almost always lapses at the border unless the policy names the crossing. This is the one people discover afterwards.',
  },
];

const RUPEES = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/**
 * What it costs to send a piece somewhere else.
 *
 * A boutique with six addresses in one country still ships internationally every
 * week, and the question is always the same: not what the ring costs, but what
 * arrives to pay when it lands. The answer is almost never the headline duty
 * rate, for two reasons that are both invisible until somebody does the
 * arithmetic — the consumption tax usually compounds on the duty-inclusive
 * value, and the shipping and insurance are part of the taxable value rather
 * than separate from it.
 *
 * So the breakdown is itemised in the order the customs computation actually
 * happens, rather than presented as a single percentage. Seeing insurance get
 * taxed is the moment the number stops being surprising.
 *
 * The figures are indicative and they move; the panel is explicit about that.
 * The useful output is an order of magnitude and a list of the five documents,
 * because the documents are the part that cannot be fixed after the parcel has
 * left.
 */
export default function DutyEstimator({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(325000);
  const [destId, setDestId] = useState(DESTINATIONS[0].id);
  const [insure, setInsure] = useState(true);

  const dest = DESTINATIONS.find((d) => d.id === destId) ?? DESTINATIONS[0];

  const breakdown = useMemo(() => {
    // The order here is the order a customs computation runs in, and it is the
    // whole content of the component.
    const freight = 4200;
    const insurance = insure ? Math.round(value * 0.011) : 0;
    const cif = value + freight + insurance;

    const clear = cif < dest.threshold;
    const duty = clear ? 0 : cif * dest.duty;
    const taxBase = dest.compounds ? cif + duty : cif;
    const tax = clear ? 0 : taxBase * dest.tax;
    const handling = clear ? 0 : 1800;

    return {
      freight,
      insurance,
      cif,
      clear,
      duty,
      taxBase,
      tax,
      handling,
      total: duty + tax + handling,
      landed: cif + duty + tax + handling,
    };
  }, [value, dest, insure]);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="space-y-7">
          {/* Value. */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="duty-value" className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Declared value of the piece
              </label>
              <span className="nums-tabular font-display text-3xl text-accent">{RUPEES(value)}</span>
            </div>
            <input
              id="duty-value"
              type="range"
              min={20000}
              max={2500000}
              step={5000}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="range-overlay mt-3 w-full"
            />
            <p className="mt-1.5 font-sans text-[11px] font-light text-faint">
              Declare the price paid. Under-declaring is the one shortcut on this page that
              invalidates the insurance as well as being an offence.
            </p>
          </div>

          {/* Destination. */}
          <fieldset>
            <legend className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Where it is going
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDestId(d.id)}
                  aria-pressed={d.id === destId}
                  className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                    d.id === destId
                      ? 'border-accent/60 bg-accent/12 text-accent'
                      : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={insure}
              onChange={(e) => setInsure(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]"
            />
            <span>
              <span className="block font-sans text-sm font-light text-secondary">
                Insured in transit, door to door
              </span>
              <span className="mt-0.5 block font-sans text-[11px] font-light text-faint">
                1.1% of declared value. We will not ship a piece over ₹50,000 without it — and
                note that the premium itself becomes part of the taxable value.
              </span>
            </span>
          </label>

          <motion.p
            key={dest.id}
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeCine.glass }}
            className="flex gap-2.5 rounded-xl border border-hairline bg-surface-raised/30 p-4 font-sans text-xs font-light leading-relaxed text-secondary"
          >
            <Plane className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" aria-hidden="true" />
            <span>
              <strong className="font-normal text-accent">{dest.name}.</strong> {dest.catch}
            </span>
          </motion.p>
        </div>

        {/* The computation, in the order it happens. */}
        <div className="rounded-2xl border border-hairline bg-surface-raised/45 p-6">
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            What arrives to pay
          </p>

          <div className="mt-5 space-y-0">
            <Row label="Declared value" value={RUPEES(value)} />
            <Row label="Insured air freight" value={RUPEES(breakdown.freight)} />
            <Row
              label="Transit insurance"
              value={breakdown.insurance ? RUPEES(breakdown.insurance) : '—'}
              dim={!breakdown.insurance}
            />
            <Row label="Taxable value at the border" value={RUPEES(breakdown.cif)} strong />

            {breakdown.clear ? (
              <p className="mt-5 rounded-xl border border-jade-300/40 bg-jade-900/10 p-4 font-sans text-xs font-light leading-relaxed text-secondary">
                Under {dest.name}’s {RUPEES(dest.threshold)} threshold, so nothing is charged at
                all. This is the only genuinely cheap way to send jewellery anywhere, and it is
                worth knowing where each line sits before splitting a consignment.
              </p>
            ) : (
              <>
                <Row
                  label={`Import duty at ${(dest.duty * 100).toFixed(1)}%`}
                  value={RUPEES(breakdown.duty)}
                />
                <Row
                  label={
                    dest.tax === 0
                      ? 'Consumption tax — none'
                      : `${(dest.tax * 100).toFixed(0)}% ${
                          dest.compounds ? 'on the duty-inclusive value' : 'on the border value'
                        }`
                  }
                  value={breakdown.tax ? RUPEES(breakdown.tax) : '—'}
                  dim={!breakdown.tax}
                />
                <Row label="Broker and handling" value={RUPEES(breakdown.handling)} />
              </>
            )}
          </div>

          <div className="mt-6 border-t border-hairline pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                Payable on arrival
              </span>
              <motion.span
                key={breakdown.total}
                initial={reduced ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="nums-tabular font-display text-3xl text-accent"
              >
                {RUPEES(breakdown.total)}
              </motion.span>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-4">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                Landed cost, all in
              </span>
              <span className="nums-tabular font-display text-xl text-primary">
                {RUPEES(breakdown.landed)}
              </span>
            </div>
            <p className="mt-2 nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
              {((breakdown.total / value) * 100).toFixed(1)}% on top of the piece itself
            </p>
          </div>

          <p className="mt-5 border-t border-hairline pt-4 font-sans text-[11px] font-light leading-relaxed text-faint">
            Indicative only. Rates and thresholds change, jewellery is classified differently from
            general goods in most tariffs, and the officer at the port has the final word on
            valuation. Use this to know the order of magnitude, then ask us for a firm quotation
            before you commit.
          </p>
        </div>
      </div>

      {/* The five documents, which is the part that cannot be fixed later. */}
      <div className="rounded-2xl border border-hairline bg-surface-raised/30 p-6 md:p-8">
        <p className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-accent">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          What travels with it
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {PAPERS.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={reduced ? undefined : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.45, delay: reduced ? 0 : i * 0.05, ease: easeCine.glass }}
              className="flex gap-3"
            >
              <ShieldCheck className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                  {paper.label}
                </p>
                <p className="mt-1 font-sans text-[11px] font-light leading-relaxed text-faint">
                  Without it: {paper.without}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
      <span
        className={`font-sans text-xs font-light ${strong ? 'text-primary' : 'text-secondary'}`}
      >
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
