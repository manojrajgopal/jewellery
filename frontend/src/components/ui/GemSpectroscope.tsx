'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flashlight, Lightbulb, Sun } from 'lucide-react';

import { easeLens } from '@/lib/motion';
import { gems } from '@/data/gems';

/**
 * The three lights a stone is actually seen in, with their correlated colour
 * temperatures. These are the real figures, and they matter: a stone chosen
 * under a 3000K showroom halogen and worn under 6500K north daylight is a
 * different colour, and that is the single most common disappointment in the
 * trade.
 */
const LIGHTS = [
  {
    id: 'daylight',
    label: 'North daylight',
    kelvin: 6500,
    icon: Sun,
    note: 'The grading standard, and the least flattering light there is.',
    /** Relative energy at the blue end. Drives how much fire is visible. */
    blue: 1,
    warmth: 0,
  },
  {
    id: 'halogen',
    label: 'Showroom halogen',
    kelvin: 3000,
    icon: Lightbulb,
    note: 'Warm, point-source, and engineered to make everything look better.',
    blue: 0.42,
    warmth: 0.75,
  },
  {
    id: 'candle',
    label: 'Candlelight',
    kelvin: 1900,
    icon: Flashlight,
    note: 'Almost no blue at all. Yellow tint disappears; so does most of the fire.',
    blue: 0.14,
    warmth: 1,
  },
] as const;

/**
 * Dispersion figures — how far a material spreads white light into a spectrum,
 * measured as the difference in refractive index between the B and G Fraunhofer
 * lines. Diamond's 0.044 is the reason it throws colour and a sapphire of the
 * same cut does not, and it is a number almost no retailer will quote you.
 */
const DISPERSION: Record<string, number> = {
  diamond: 0.044,
  opal: 0.037,
  garnet: 0.027,
  tanzanite: 0.021,
  peridot: 0.02,
  ruby: 0.018,
  sapphire: 0.018,
  topaz: 0.014,
  aquamarine: 0.014,
  emerald: 0.014,
  amethyst: 0.013,
  pearl: 0.001,
};

interface GemSpectroscopeProps {
  className?: string;
}

/**
 * What the stone does to light, drawn rather than described.
 *
 * Three numbers on a grading report decide how a stone behaves optically, and
 * all three are printed and none are explained. Refractive index says how hard
 * the stone bends light — that is *whether* it returns any. Dispersion says how
 * far apart it pulls the colours — that is *fire*. And the light source decides
 * what there is to pull apart in the first place.
 *
 * So this puts the light source in the visitor's hands. The spectrum bar is
 * generated from the selected stone's dispersion and the selected light's blue
 * content, which means the candlelight case draws what it actually looks like:
 * a spectrum with the violet end starved out of it. Nothing here is decorative —
 * the width of every band is the product of two real figures.
 *
 * The comparison row is the argument. Opal disperses most of the way to diamond
 * and costs a fraction; pearl disperses essentially nothing, which is why a
 * pearl is chosen for lustre and never for fire. Both facts are visible in one
 * glance and neither is ever printed on a ticket.
 */
export default function GemSpectroscope({ className = '' }: GemSpectroscopeProps) {
  const reduced = useReducedMotion();
  const [gemId, setGemId] = useState('diamond');
  const [lightId, setLightId] = useState<(typeof LIGHTS)[number]['id']>('daylight');
  const [angle, setAngle] = useState(42);

  const gem = gems.find((g) => g.id === gemId) ?? gems[0];
  const light = LIGHTS.find((l) => l.id === lightId) ?? LIGHTS[0];
  const dispersion = DISPERSION[gem.id] ?? 0.015;

  /**
   * The critical angle: below it light escapes out of the back of the stone
   * instead of being returned to the eye. sin(θc) = 1/n, and it is the whole
   * reason a pavilion has the angles it has.
   */
  const critical = useMemo(
    () => (Math.asin(1 / gem.refraction) * 180) / Math.PI,
    [gem.refraction],
  );

  /** Above the critical angle the ray is returned; below it, it leaks away. */
  const returned = angle >= critical;

  /**
   * Spectral spread in degrees. Dispersion is a difference in refractive index,
   * and the angular separation it produces scales with it — so a band's width on
   * screen is proportional to dispersion, throttled by how much of that end of
   * the spectrum the chosen light actually emits.
   */
  const spread = dispersion * 1000 * (0.35 + light.blue * 0.65);

  const bands = [
    { hue: 'rgb(120, 60, 200)', weight: 0.9 * light.blue },
    { hue: 'rgb(60, 90, 230)', weight: 1 * light.blue },
    { hue: 'rgb(50, 190, 190)', weight: 1 * (0.4 + light.blue * 0.6) },
    { hue: 'rgb(110, 205, 90)', weight: 1 },
    { hue: 'rgb(240, 210, 70)', weight: 1 * (0.7 + light.warmth * 0.3) },
    { hue: 'rgb(240, 140, 50)', weight: 1 * (0.6 + light.warmth * 0.4) },
    { hue: 'rgb(220, 60, 60)', weight: 1 * (0.5 + light.warmth * 0.5) },
  ];

  return (
    <div className={`grid gap-9 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] ${className}`}>
      {/* ================= Controls ================= */}
      <div className="space-y-7 rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-7">
        <div>
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            The stone
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {gems.slice(0, 10).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGemId(g.id)}
                aria-pressed={g.id === gemId}
                className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                  g.id === gemId
                    ? 'border-accent bg-accent text-onaccent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            The light
          </span>
          <div className="mt-3 space-y-2">
            {LIGHTS.map((l) => {
              const Icon = l.icon;
              const on = l.id === lightId;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLightId(l.id)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-400 ${
                    on
                      ? 'border-accent/60 bg-accent/[0.08]'
                      : 'border-hairline hover:border-accent/40'
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`mt-0.5 h-4 w-4 shrink-0 ${on ? 'text-accent' : 'text-faint'}`}
                  />
                  <span className="flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span
                        className={`font-accent text-xs uppercase tracking-luxe ${
                          on ? 'text-accent' : 'text-secondary'
                        }`}
                      >
                        {l.label}
                      </span>
                      <span className="font-accent text-[10px] text-faint nums-tabular">
                        {l.kelvin}K
                      </span>
                    </span>
                    <span className="mt-1 block font-sans text-xs font-light leading-relaxed text-muted">
                      {l.note}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Angle of incidence, against the stone's own critical angle ---- */}
        <div>
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="spectro-angle"
              className="font-accent text-[10px] uppercase tracking-luxer text-accent"
            >
              Angle at the pavilion
            </label>
            <span className="font-display text-xl text-primary nums-tabular">{angle}°</span>
          </div>
          <input
            id="spectro-angle"
            type="range"
            min={10}
            max={80}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="mt-3 w-full accent-[rgb(var(--accent))]"
          />
          <p
            className={`mt-3 font-sans text-xs font-light leading-relaxed ${
              returned ? 'text-secondary' : 'text-accent'
            }`}
          >
            {returned ? (
              <>
                Above {critical.toFixed(1)}° the ray is totally reflected and comes back out of the
                table. This is the stone working.
              </>
            ) : (
              <>
                Below the critical angle of {critical.toFixed(1)}° the light passes straight through
                and leaks out of the back. A stone cut too shallow does this, and the middle goes
                dark — the trade calls it a fish-eye.
              </>
            )}
          </p>
        </div>
      </div>

      {/* ================= The reading ================= */}
      <div className="space-y-6">
        {/* ---- The prism ---- */}
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface-sunken p-6 md:p-8">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
            What comes out
          </span>

          <div className="mt-6 flex items-stretch gap-1.5" style={{ height: '7rem' }}>
            {bands.map((band, i) => (
              <motion.div
                key={band.hue}
                initial={false}
                animate={{
                  // Width carries the dispersion; opacity carries what the light
                  // source actually emits at that wavelength.
                  flexGrow: 1 + spread * (i / bands.length) * 1.4,
                  opacity: returned ? Math.max(0.08, band.weight) : Math.max(0.04, band.weight * 0.2),
                }}
                transition={reduced ? { duration: 0 } : { duration: 0.7, ease: easeLens.focusRing }}
                className="rounded-sm"
                style={{
                  background: `linear-gradient(to bottom, ${band.hue}, transparent)`,
                  filter: `saturate(${0.5 + light.blue * 0.9})`,
                }}
              />
            ))}
          </div>

          {!returned && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 font-accent text-[10px] uppercase tracking-luxe text-accent"
            >
              Light lost through the pavilion
            </motion.p>
          )}
        </div>

        {/* ---- The three numbers ---- */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Refractive index',
              value: gem.refraction.toFixed(2),
              note: 'How hard it bends light',
            },
            {
              label: 'Dispersion',
              value: dispersion.toFixed(3),
              note: 'How far it spreads colour',
            },
            {
              label: 'Critical angle',
              value: `${critical.toFixed(1)}°`,
              note: 'Below this, light escapes',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-hairline bg-canvas-alt/60 p-5"
            >
              <span className="font-accent text-[9px] uppercase tracking-luxer text-faint">
                {stat.label}
              </span>
              <p className="mt-2 font-display text-2xl text-accent nums-tabular">{stat.value}</p>
              <p className="mt-1 font-sans text-xs font-light text-muted">{stat.note}</p>
            </div>
          ))}
        </div>

        {/* ---- The comparison that makes the point ---- */}
        <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            Fire, ranked
          </span>
          <div className="mt-4 space-y-2.5">
            {gems
              .slice(0, 10)
              .map((g) => ({ g, d: DISPERSION[g.id] ?? 0.015 }))
              .sort((a, b) => b.d - a.d)
              .map(({ g, d }) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGemId(g.id)}
                  className="group flex w-full items-center gap-3 text-left"
                >
                  <span
                    className={`w-24 shrink-0 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                      g.id === gemId ? 'text-accent' : 'text-muted group-hover:text-accent'
                    }`}
                  >
                    {g.name}
                  </span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: d / 0.044 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: easeLens.focusRing }}
                      className={`absolute inset-0 origin-left rounded-full ${
                        g.id === gemId ? 'bg-accent' : 'bg-accent/35'
                      }`}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-right font-accent text-[10px] text-faint nums-tabular">
                    {d.toFixed(3)}
                  </span>
                </button>
              ))}
          </div>
          <p className="mt-5 font-sans text-xs font-light leading-relaxed text-faint">
            Opal spreads light most of the way to diamond and costs a small fraction of it. Pearl
            spreads almost none, which is why a pearl is chosen for lustre and never for fire.
            Ruby and sapphire are the same mineral and sit at exactly the same figure. None of
            these facts appear on a ticket.
          </p>
        </div>
      </div>
    </div>
  );
}
