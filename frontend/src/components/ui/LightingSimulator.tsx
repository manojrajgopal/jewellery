'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CandlestickChart, Lamp, Lightbulb, Moon, Sun } from 'lucide-react';

import { easeCine, springsSilk } from '@/lib/motion';

/**
 * The five lights a piece is actually seen under, with their real correlated
 * colour temperatures.
 *
 * `cct` is in kelvin and it is not decoration: it is the number that decides
 * everything else in the row. Low kelvin is warm *and* diffuse, because the
 * sources that produce it are small and are usually bounced off something; high
 * kelvin is cool *and* hard, because the source is the sky or a bare LED. That
 * pairing is why a class which changed only the tint would be lying — a warm
 * light does not simply make gold yellower, it also collapses the contrast that
 * makes a diamond flash.
 *
 * `favours` and `punishes` are the practical half. Every one of them is a thing
 * a boutique either knows and exploits, or does not know and accidentally does.
 */
interface Source {
  id: 'candle' | 'tungsten' | 'led' | 'daylight' | 'dusk';
  name: string;
  where: string;
  cct: number;
  icon: typeof Sun;
  /** How hard the light is, 1–5. Drives the specular highlight's size. */
  hardness: number;
  favours: string;
  punishes: string;
  note: string;
}

const SOURCES: Source[] = [
  {
    id: 'candle',
    name: 'Candlelight',
    where: 'A restaurant at eight in the evening',
    cct: 1850,
    icon: CandlestickChart,
    hardness: 1,
    favours: 'Yellow gold, rubies, spinel, anything with warmth already in it. 22K looks extraordinary.',
    punishes: 'Diamonds, which need contrast to flash and get almost none. Sapphires go nearly black.',
    note: 'The softest light a piece will ever be seen in, and the most flattering to metal. It is also the one nobody tests a purchase under.',
  },
  {
    id: 'tungsten',
    name: 'Showroom halogen',
    where: 'Almost every jeweller, including ours',
    cct: 3000,
    icon: Lamp,
    hardness: 3,
    favours: 'Everything, deliberately. Warm enough to flatter gold and hard enough to make a stone flash.',
    punishes: 'Nothing — which is the problem. A stone chosen here has been chosen under the best light it will ever have.',
    note: 'If you take one thing from this panel: ask to see the piece by the window before you decide. Any honest jeweller will offer first.',
  },
  {
    id: 'led',
    name: 'Office LED',
    where: 'Where the piece will spend most of its life',
    cct: 4000,
    icon: Lightbulb,
    hardness: 4,
    favours: 'White metals and colourless diamonds. Platinum finally looks like the colour it is.',
    punishes: 'Rose gold, which loses its blush entirely, and warm-tinted diamonds, which read grey rather than warm.',
    note: 'A cheap LED also has gaps in its spectrum, so fire is dulled — the rainbow flashes need wavelengths the lamp is not emitting.',
  },
  {
    id: 'daylight',
    name: 'North daylight',
    where: 'The bench, and every grading laboratory',
    cct: 6500,
    icon: Sun,
    hardness: 5,
    favours: 'Truth. This is the light a stone is graded in, and the only one under which two stones can be fairly compared.',
    punishes: 'Any piece sold on warmth. It shows every inclusion, every tint and every solder line.',
    note: 'Indirect north light, never direct sun. Direct sun is so bright it hides inclusions rather than revealing them.',
  },
  {
    id: 'dusk',
    name: 'Dusk',
    where: 'Walking home, the light nobody plans for',
    cct: 9000,
    icon: Moon,
    hardness: 2,
    favours: 'Emeralds and blue sapphires, which hold colour when everything else has lost it.',
    punishes: 'Yellow gold, which turns greenish, and small diamonds, which stop existing.',
    note: 'The one light in which a piece is judged by strangers rather than by its owner.',
  },
];

/** Pieces worth putting under the lamps: one warm, one white, one coloured. */
const SUBJECTS = [
  { id: 'ring', label: 'Platinum solitaire', src: '/images/products/ring.jpg', metal: 'White metal, colourless stone' },
  { id: 'necklace', label: '22K kundan choker', src: '/images/collections/heritage.jpg', metal: 'Yellow gold, uncut stones' },
  { id: 'gem', label: 'Coloured gemstone', src: '/images/collections/gemstone.jpg', metal: 'Yellow gold, saturated colour' },
] as const;

/**
 * The same piece, under five lights.
 *
 * This is the single most useful thing a jeweller's website can tell somebody
 * and almost none of them do, because the honest version of it costs the shop a
 * sale now and then: a piece chosen under showroom halogen has been chosen under
 * the most flattering light it will ever be in, and the disappointment arrives
 * three days later at a desk under an LED panel.
 *
 * The grade is a CSS filter chain keyed off the source, declared in globals so
 * both halves of the split view share one definition. Colour temperature drives
 * the hue and the contrast together, and the specular highlight's *size* is
 * driven by `hardness` — a small hard source throws a tight bright spot, a large
 * soft one throws a broad dim one, and getting that relationship the wrong way
 * round is what makes most simulated lighting look like a filter.
 *
 * The comparison mode is the point of the whole thing. One light at a time is
 * interesting; two side by side is an argument.
 */
export default function LightingSimulator({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Source['id']>('tungsten');
  const [against, setAgainst] = useState<Source['id'] | null>('daylight');
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]['id']>('ring');

  const current = SOURCES.find((s) => s.id === active) ?? SOURCES[1];
  const other = against ? SOURCES.find((s) => s.id === against) ?? null : null;
  const piece = SUBJECTS.find((s) => s.id === subject) ?? SUBJECTS[0];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Which piece is on the stand. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
          On the stand
        </span>
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSubject(s.id)}
            aria-pressed={subject === s.id}
            className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
              subject === s.id
                ? 'border-accent/60 bg-accent/12 text-accent'
                : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* The stage. One plate, or two if a comparison is running. */}
      <div className={`grid gap-5 ${other ? 'md:grid-cols-2' : ''}`}>
        <LitPlate source={current} piece={piece} reduced={!!reduced} />
        {other && <LitPlate source={other} piece={piece} reduced={!!reduced} muted />}
      </div>

      {/* The lamp rail. Selecting sets the main light; the small "vs" toggles
          which one it is being compared against, so both halves of the split
          are reachable without a second control scheme. */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SOURCES.map((s) => {
          const on = s.id === active;
          const versus = s.id === against;
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              whileHover={reduced ? undefined : { y: -4 }}
              transition={springsSilk.touch}
              className={`relative overflow-hidden rounded-2xl border p-4 transition-colors duration-500 ${
                on
                  ? 'border-accent/55 bg-surface-raised/80'
                  : versus
                    ? 'border-accent/25 bg-surface-raised/50'
                    : 'border-hairline bg-surface-raised/30'
              }`}
            >
              <button
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={on}
                className="block w-full text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${on ? 'text-accent' : 'text-muted'}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`font-display text-lg leading-tight ${
                      on ? 'text-accent' : 'text-primary'
                    }`}
                  >
                    {s.name}
                  </span>
                </span>
                <span className="mt-1 block nums-tabular font-accent text-[10px] uppercase tracking-luxe text-faint">
                  {s.cct.toLocaleString('en-IN')}K · {s.where}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAgainst(versus ? null : s.id)}
                disabled={on}
                aria-pressed={versus}
                className={`mt-3 font-accent text-[9px] uppercase tracking-luxe transition-colors duration-300 disabled:opacity-25 ${
                  versus ? 'text-accent' : 'text-faint hover:text-accent'
                }`}
              >
                {versus ? '— comparing —' : 'compare against'}
              </button>

              {/* A hairline whose warmth tracks the colour temperature, so the
                  rail itself reads as a scale from candle to dusk. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, rgb(var(--gold-${
                    s.cct < 2500 ? '600' : s.cct < 3500 ? '400' : s.cct < 5000 ? '200' : '100'
                  }) / 0.7), transparent)`,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* What the selected light does. Two columns rather than a paragraph,
          because the whole value is that every light has a cost as well. */}
      <motion.div
        key={current.id}
        initial={reduced ? undefined : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeCine.glass }}
        className="grid gap-6 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:grid-cols-2 md:p-8"
      >
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-jade-300">
            Flatters
          </p>
          <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
            {current.favours}
          </p>
        </div>
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-burgundy-300">
            Costs
          </p>
          <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
            {current.punishes}
          </p>
        </div>
        <p className="md:col-span-2 border-t border-hairline pt-5 font-display text-lg italic leading-snug text-primary">
          {current.note}
        </p>
      </motion.div>
    </div>
  );
}

/**
 * One lit plate. The grade comes from the shared `light-stage` classes; the
 * specular spot is drawn here because its geometry depends on `hardness` and a
 * CSS class cannot take a parameter.
 */
function LitPlate({
  source,
  piece,
  reduced,
  muted = false,
}: {
  source: Source;
  piece: (typeof SUBJECTS)[number];
  reduced: boolean;
  muted?: boolean;
}) {
  // A hard source throws a small, bright, tightly-falling-off highlight; a soft
  // one throws a broad dim wash. Both radius and strength come off the same
  // number so they cannot disagree.
  const spread = 78 - source.hardness * 11;
  const strength = 0.08 + source.hardness * 0.055;

  return (
    <figure className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-sunken">
      <div className="light-stage relative aspect-golden" data-source={source.id}>
        <Image
          src={piece.src}
          alt={`${piece.label} under ${source.name}`}
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          className="object-cover"
        />

        {/* The specular pool. `screen` rather than `overlay` because a highlight
            adds light and never subtracts it — overlay darkens the shadows,
            which is exactly wrong for a lamp. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 blend-screen"
          style={{
            background: `radial-gradient(${spread}% ${spread * 0.8}% at 32% 22%, rgb(var(--gold-100) / ${strength}), transparent 70%)`,
          }}
        />

        {/* The shadow side. A hard light also means a hard shadow, so this
            tracks hardness in the opposite direction. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(${115 + source.hardness * 6}deg, transparent 42%, rgb(var(--shadow-color) / ${0.1 + source.hardness * 0.045}))`,
          }}
        />

        {!reduced && source.id === 'candle' && (
          // Only candlelight flickers. Adding a flicker to the others would be
          // decoration; on a candle it is the defining property.
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-flicker bg-[radial-gradient(60%_50%_at_30%_25%,rgb(var(--gold-300)/0.16),transparent_70%)]"
          />
        )}
      </div>

      <figcaption className="flex items-baseline justify-between gap-4 border-t border-hairline px-4 py-3">
        <span
          className={`font-accent text-[10px] uppercase tracking-luxe ${
            muted ? 'text-faint' : 'text-accent'
          }`}
        >
          {source.name}
        </span>
        <span className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-faint">
          {source.cct.toLocaleString('en-IN')}K
        </span>
      </figcaption>
    </figure>
  );
}
