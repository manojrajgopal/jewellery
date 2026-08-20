'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Gold, mixed.
 *
 * Pure gold is 24 karat and almost nobody has ever owned any, because pure gold
 * is useless as jewellery. It is soft enough to mark with a fingernail, it will
 * not hold a claw over a stone for a year, and a ring made of it goes oval in a
 * pocket. Everything anybody wears is an alloy, and the interesting part is
 * that the *other* metals — the quarter of an 18K ring that is not gold — decide
 * almost everything about how the piece behaves and what colour it is.
 *
 * Which makes this the one panel on the site where a customer can hold the
 * actual trade-off. Karat is not quality. Karat is a mixing ratio, and every
 * step up it costs hardness.
 *
 * The figures are real:
 *
 *   - **Fineness.** 24K is 999 parts per thousand, 22K is 916, 18K is 750, 14K
 *     is 585, 9K is 375. The Indian market runs on 22K, the European on 18K,
 *     and the reason is cultural rather than technical: 22K is bought as stored
 *     value that happens to be wearable, 18K is bought as an object.
 *   - **Hardness.** Vickers, and it roughly doubles from 24K (about 25 HV) to a
 *     hard 18K (around 180 HV). That is why a 22K bangle dents and an 18K one
 *     does not.
 *   - **Colour.** Copper reddens, silver greens and pales, palladium whitens.
 *     Rose gold is not a different metal, it is 18K with the silver taken out
 *     and put into copper.
 *
 * The one thing the panel refuses to do is treat white gold as a colour. White
 * gold is grey-yellow and it is rhodium plated to look white, that plating is
 * a few microns thick, and it wears off in two to four years on a ring. That is
 * a maintenance fact that half of the people who own white gold discover by
 * accident, and it is stated here rather than in the small print.
 */

interface KaratSpec {
  karat: number;
  fineness: number;
  gold: number;
  label: string;
  region: string;
}

const KARATS: KaratSpec[] = [
  { karat: 24, fineness: 999, gold: 0.999, label: '24K', region: 'Bullion. Not jewellery.' },
  { karat: 22, fineness: 916, gold: 0.916, label: '22K', region: 'The Indian standard' },
  { karat: 18, fineness: 750, gold: 0.75, label: '18K', region: 'The European standard' },
  { karat: 14, fineness: 585, gold: 0.585, label: '14K', region: 'The American standard' },
  { karat: 9, fineness: 375, gold: 0.375, label: '9K', region: 'British, and legally gold' },
];

/**
 * Colour of the alloy, computed from the mix rather than looked up.
 *
 * The base is fine gold at rgb(255, 215, 0)-ish; copper pulls it red and down,
 * silver pulls it pale and green, palladium pulls the whole thing grey. The
 * weights are tuned against the alloys the trade actually sells, so 75/12.5/12.5
 * lands on the yellow everybody recognises and 75/4.5/20.5 lands on rose.
 */
function alloyColour(gold: number, silver: number, copper: number, palladium: number) {
  const base = { r: 255, g: 209, b: 92 };
  const r = base.r - silver * 40 - palladium * 70 + copper * 6;
  const g = base.g - copper * 128 - palladium * 24 + silver * 22;
  const b = base.b - copper * 78 + silver * 96 + palladium * 118;
  const wash = 1 - gold * 0.12;
  return `rgb(${Math.round(Math.min(255, Math.max(60, r * wash)))}, ${Math.round(
    Math.min(255, Math.max(60, g * wash))
  )}, ${Math.round(Math.min(255, Math.max(50, b * wash)))})`;
}

/** Vickers, from the alloy. Copper hardens most; palladium hardens and stiffens. */
function hardness(gold: number, silver: number, copper: number, palladium: number) {
  return Math.round(25 + copper * 320 + palladium * 240 + silver * 90 - gold * 12);
}

function colourName(silver: number, copper: number, palladium: number) {
  const total = silver + copper + palladium || 1;
  const s = silver / total;
  const c = copper / total;
  const p = palladium / total;
  if (p > 0.6) return 'White';
  if (p > 0.3) return 'Pale grey-yellow';
  if (c > 0.72) return 'Red';
  if (c > 0.56) return 'Rose';
  if (c > 0.4) return 'Warm yellow';
  if (s > 0.72) return 'Green';
  return 'Yellow';
}

const PRESETS = [
  { name: '22K yellow', karat: 22, silver: 40, copper: 60, palladium: 0 },
  { name: '18K yellow', karat: 18, silver: 50, copper: 50, palladium: 0 },
  { name: '18K rose', karat: 18, silver: 18, copper: 82, palladium: 0 },
  { name: '18K white', karat: 18, silver: 8, copper: 4, palladium: 88 },
  { name: '18K green', karat: 18, silver: 92, copper: 8, palladium: 0 },
];

export default function AlloyMixer({ className = '' }: { className?: string }) {
  const [karat, setKarat] = useState(18);
  // Shares of the *alloying* portion, which always sums to 100. Modelling it
  // this way rather than as absolute percentages is what stops a visitor from
  // building a mix that does not add up to a metal.
  const [silver, setSilver] = useState(50);
  const [copper, setCopper] = useState(50);
  const [palladium, setPalladium] = useState(0);

  const spec = KARATS.find((k) => k.karat === karat) ?? KARATS[2];

  const mix = useMemo(() => {
    const total = silver + copper + palladium || 1;
    const rest = 1 - spec.gold;
    const ag = (silver / total) * rest;
    const cu = (copper / total) * rest;
    const pd = (palladium / total) * rest;
    return { ag, cu, pd };
  }, [silver, copper, palladium, spec.gold]);

  const colour = alloyColour(spec.gold, mix.ag, mix.cu, mix.pd);
  const hv = hardness(spec.gold, mix.ag, mix.cu, mix.pd);
  const name = colourName(silver, copper, palladium);
  const rhodium = mix.pd / (1 - spec.gold) > 0.55;

  // How much of a ring wears away per decade, roughly. Softer metal, more loss.
  const wearYears = Math.max(4, Math.round(hv / 6));

  const set = (which: 'ag' | 'cu' | 'pd', value: number) => {
    // Kept as independent shares that are normalised on read, rather than three
    // sliders that fight each other. Three coupled sliders is the version of
    // this control that everybody builds first and nobody can use.
    if (which === 'ag') setSilver(value);
    if (which === 'cu') setCopper(value);
    if (which === 'pd') setPalladium(value);
  };

  return (
    <div className={className}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        {/* The button of metal itself. */}
        <div>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-canvas-alt">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_46%_at_44%_18%,rgb(var(--hairline)/0.1),transparent_72%)]"
            />

            {/* A poured button, which is what an alloy actually looks like when
                it comes off a crucible: a dome with a shrinkage dimple in the
                middle where the last of it froze. */}
            <motion.div
              className="relative h-44 w-44 rounded-full"
              animate={{ background: colour }}
              transition={{ duration: 0.5 }}
              style={{
                boxShadow: `inset -14px -18px 40px -12px rgba(0,0,0,0.55), inset 12px 14px 30px -10px rgba(255,255,255,0.5), 0 24px 50px -26px rgba(0,0,0,0.7)`,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-[34%] rounded-full"
                style={{ boxShadow: 'inset 0 6px 14px -4px rgba(0,0,0,0.4)' }}
              />
              {rhodium && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[linear-gradient(140deg,rgb(var(--diamond)/0.9),rgb(var(--platinum)/0.75)_52%,rgb(var(--ink-200)/0.8))]"
                />
              )}
            </motion.div>

            {rhodium && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe text-accent">
                Shown plated — the metal underneath is not this colour
              </p>
            )}
          </div>

          {/* The three figures that come out of the mix. */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="spec-plate p-3">
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">Colour</p>
              <p className="mt-1 font-display text-2xl text-primary">{name}</p>
            </div>
            <div className="spec-plate p-3">
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Hardness
              </p>
              <p className="nums-instrument mt-1 font-display text-2xl text-primary">
                {hv}
                <span className="ml-1 font-accent text-xs text-muted">HV</span>
              </p>
            </div>
            <div className="spec-plate p-3">
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Fineness
              </p>
              <p className="nums-instrument mt-1 font-display text-2xl text-primary">
                {spec.fineness}
              </p>
            </div>
          </div>

          <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
            {rhodium ? (
              <>
                This is white gold, and white gold is not white. Under the
                plating it is the grey-yellow you would see if you took the
                rhodium off, which is what happens by itself in{' '}
                <span className="text-primary">two to four years</span> on a ring
                worn daily. Replating is a twenty-minute job and we do not charge
                for it on anything we made — but nobody tells you it is coming,
                and that is the part worth knowing before you choose it.
              </>
            ) : (
              <>
                A band in this alloy will lose about a tenth of a millimetre of
                section every{' '}
                <span className="nums-instrument text-primary">{wearYears} years</span> of
                daily wear. That is the whole argument between 22K and 18K said
                as a number rather than as a preference — one of them is softer,
                and softer means the ring is quietly getting thinner.
              </>
            )}
          </p>
        </div>

        {/* The mixing bench. */}
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">Karat</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {KARATS.map((k) => (
              <button
                key={k.karat}
                type="button"
                onClick={() => setKarat(k.karat)}
                aria-pressed={karat === k.karat}
                className={`rounded-full border px-3.5 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  karat === k.karat
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
          <p className="mt-2 font-sans text-xs font-light text-faint">{spec.region}</p>

          <div className="mt-7 space-y-5 border-t border-line-subtle pt-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              The other {Math.round((1 - spec.gold) * 100)}%
            </p>

            {[
              {
                id: 'ag' as const,
                label: 'Silver',
                value: silver,
                pct: mix.ag,
                note: 'Pales the colour and pushes it green. Softens. Also the metal that makes an alloy easy to work, which is why almost every yellow gold has some.',
              },
              {
                id: 'cu' as const,
                label: 'Copper',
                value: copper,
                pct: mix.cu,
                note: 'Reddens and hardens, in that order. Past about 60% of the alloy it also starts to tarnish and to crack if it is worked cold for too long.',
              },
              {
                id: 'pd' as const,
                label: 'Palladium',
                value: palladium,
                pct: mix.pd,
                note: 'Whitens, hardens, and costs. The alternative is nickel, which is cheaper, whiter and the single commonest metal allergy there is — we do not use it.',
              },
            ].map((metal) => (
              <div key={metal.id}>
                <div className="flex items-baseline justify-between">
                  <label
                    htmlFor={`alloy-${metal.id}`}
                    className="font-accent text-[10px] uppercase tracking-luxe text-muted"
                  >
                    {metal.label}
                  </label>
                  <span className="nums-instrument font-accent text-[10px] text-primary">
                    {(metal.pct * 100).toFixed(1)}%
                  </span>
                </div>
                <input
                  id={`alloy-${metal.id}`}
                  type="range"
                  min={0}
                  max={100}
                  value={metal.value}
                  onChange={(e) => set(metal.id, Number(e.target.value))}
                  className="range-overlay mt-2 w-full"
                  disabled={karat === 24}
                />
                <p className="mt-1 font-sans text-xs font-light leading-relaxed text-faint">
                  {metal.note}
                </p>
              </div>
            ))}

            {karat === 24 && (
              <p className="rounded-lg border border-accent/25 bg-accent/[0.05] p-3 font-sans text-xs font-light leading-relaxed text-muted">
                Nothing to mix. 24K is 999 parts gold, it is soft enough to mark
                with a fingernail, and it is bought as stored value rather than
                as something to wear. We will sell it to you as a coin or a bar
                and we will argue with you about a ring.
              </p>
            )}
          </div>

          <div className="mt-7 border-t border-line-subtle pt-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              Alloys we actually pour
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setKarat(p.karat);
                    setSilver(p.silver);
                    setCopper(p.copper);
                    setPalladium(p.palladium);
                  }}
                  className="rounded-full border border-hairline px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
