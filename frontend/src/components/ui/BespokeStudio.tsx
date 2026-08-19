'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Diamond,
  Gem,
  Hammer,
  Heart,
  RotateCcw,
  Sparkles,
  Type as TypeIcon,
} from 'lucide-react';

import RingPreview from '@/components/motion/RingPreview';
import Odometer from '@/components/motion/Odometer';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import CTAButton from '@/components/ui/CTAButton';
import { useToast } from '@/components/providers/ToastProvider';
import {
  BANDS,
  BASE_FEE,
  CARATS,
  ENGRAVING_FREE_CHARS,
  ENGRAVING_PER_CHAR,
  METALS,
  SETTINGS,
  STONES,
} from '@/data/bespoke';

const STEPS = [
  { id: 'metal', label: 'Metal', icon: Hammer },
  { id: 'stone', label: 'The Cut', icon: Diamond },
  { id: 'carat', label: 'Weight', icon: Gem },
  { id: 'setting', label: 'Setting', icon: Sparkles },
  { id: 'band', label: 'Shank', icon: RotateCcw },
  { id: 'engraving', label: 'Engraving', icon: TypeIcon },
] as const;

type StepId = (typeof STEPS)[number]['id'];

interface Spec {
  metal: string;
  stone: string;
  carat: number;
  setting: string;
  band: string;
  engraving: string;
}

const DEFAULT_SPEC: Spec = {
  metal: 'yellow-22k',
  stone: 'round',
  carat: 1,
  setting: 'solitaire',
  band: 'court',
  engraving: '',
};

const STORE_KEY = 'aurum-bespoke-spec';

/**
 * The bespoke studio: pick a metal, a cut, a weight, a setting, a shank and an
 * engraving, and watch a vector ring rebuild itself around every choice while a
 * running commission estimate rolls underneath.
 *
 * Three decisions shape this component.
 *
 * The estimate is additive rather than a lookup table, because a commission
 * genuinely is quoted that way at the enquiry stage — a base fee for the bench
 * work, plus the stone, plus whatever the setting costs in labour. That lets the
 * number move on every single click, which is the point.
 *
 * The spec persists to localStorage on change rather than on submit, so a
 * visitor who wanders off to read the craftsmanship page comes back to the ring
 * they were building. Losing twenty clicks of configuration to a stray
 * navigation is the fastest way to make someone abandon a form like this.
 *
 * Steps are navigable in any order, not gated. Gating suits checkout, where the
 * order matters; here the visitor is playing, and being told they cannot look at
 * settings until they have chosen a metal is simply irritating.
 */
export default function BespokeStudio({ className = '' }: { className?: string }) {
  const { toast } = useToast();
  const [spec, setSpec] = useState<Spec>(DEFAULT_SPEC);
  const [step, setStep] = useState<StepId>('metal');
  const [restored, setRestored] = useState(false);

  // Restore before the first interaction, then keep writing on every change.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Spec>;
        setSpec((s) => ({ ...s, ...parsed }));
        setRestored(true);
      }
    } catch {
      /* corrupt or blocked storage — the defaults are perfectly usable */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(spec));
    } catch {
      /* nothing to do; the session still works from memory */
    }
  }, [spec]);

  const metal = METALS.find((m) => m.id === spec.metal) ?? METALS[0];
  const stone = STONES.find((s) => s.id === spec.stone) ?? STONES[0];
  const setting = SETTINGS.find((s) => s.id === spec.setting) ?? SETTINGS[0];
  const band = BANDS.find((b) => b.id === spec.band) ?? BANDS[0];
  const caratRow = CARATS.find((c) => c.value === spec.carat) ?? CARATS[2];

  const engravingCost = Math.max(
    0,
    spec.engraving.trim().length - ENGRAVING_FREE_CHARS
  ) * ENGRAVING_PER_CHAR;

  const total = useMemo(
    () =>
      BASE_FEE +
      metal.delta +
      stone.delta +
      caratRow.delta +
      setting.delta +
      band.delta +
      engravingCost,
    [metal.delta, stone.delta, caratRow.delta, setting.delta, band.delta, engravingCost]
  );

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const go = useCallback((dir: 1 | -1) => {
    setStep((current) => {
      const i = STEPS.findIndex((s) => s.id === current);
      const next = Math.min(STEPS.length - 1, Math.max(0, i + dir));
      return STEPS[next].id;
    });
  }, []);

  const set = <K extends keyof Spec>(key: K, value: Spec[K]) =>
    setSpec((s) => ({ ...s, [key]: value }));

  const reset = () => {
    setSpec(DEFAULT_SPEC);
    setStep('metal');
    toast({ title: 'Studio reset', message: 'Back to the house default.', kind: 'info' });
  };

  const summary = `${spec.carat}ct ${stone.label} · ${metal.label} · ${setting.label} · ${band.label} shank${
    spec.engraving.trim() ? ` · engraved “${spec.engraving.trim()}”` : ''
  }`;

  const copySpec = async () => {
    try {
      await navigator.clipboard.writeText(
        `AURUM bespoke commission\n${summary}\nIndicative estimate: ₹${total.toLocaleString('en-IN')}`
      );
      toast({ title: 'Specification copied', message: 'Paste it into your enquiry.', kind: 'success' });
    } catch {
      toast({ title: 'Could not copy', message: 'Your browser blocked the clipboard.', kind: 'error' });
    }
  };

  const submit = () => {
    toast({
      title: 'Commission enquiry noted',
      message: 'A design consultant will write within one working day.',
      kind: 'luxe',
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
        {/* ---------------- The bench: live preview ---------------- */}
        <div className="relative">
          <div className="vitrine-glass plate-metal sticky top-28 overflow-hidden rounded-4xl p-6 sm:p-8">
            <CausticsCanvas intensity={0.5} lobes={6} />
            <DiamondSparkles density={22} shape="star" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                  On the bench
                </span>
                <span className="rim-live rounded-full px-3 py-1 font-accent text-[9px] uppercase tracking-luxe text-muted">
                  Live
                </span>
              </div>

              <RingPreview
                metal={metal}
                stone={stone}
                setting={spec.setting}
                band={spec.band}
                carat={spec.carat}
                engraving={spec.engraving}
                className="mx-auto aspect-[10/11] w-full max-w-[340px]"
              />

              {/* Running estimate */}
              <div className="mt-6 border-t border-hairline pt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="mb-1 block font-accent text-[10px] uppercase tracking-luxer text-faint">
                      Indicative estimate
                    </span>
                    <span className="font-display text-3xl text-primary sm:text-4xl">
                      <Odometer
                        value={total}
                        prefix="₹"
                        group
                        onView={false}
                        duration={0.9}
                        className="text-gradient-static"
                      />
                    </span>
                  </div>
                  <span className="pb-2 text-right font-sans text-[10px] leading-snug text-faint">
                    Excludes GST.
                    <br />
                    Firm quote follows a bench review.
                  </span>
                </div>

                {/* Cost breakdown, so the number is never a black box. */}
                <ul className="mt-4 space-y-1.5">
                  {[
                    ['Bench commission', BASE_FEE],
                    [metal.label, metal.delta],
                    [`${stone.label}`, stone.delta],
                    [`${spec.carat.toFixed(2)} carat`, caratRow.delta],
                    [setting.label, setting.delta],
                    [`${band.label} shank`, band.delta],
                    ...(engravingCost ? [['Engraving', engravingCost] as const] : []),
                  ].map(([label, value]) => (
                    <li
                      key={String(label)}
                      className="flex items-baseline justify-between gap-3 font-sans text-[11px]"
                    >
                      <span className="truncate text-muted">{label}</span>
                      <span className="shrink-0 nums-tabular text-faint">
                        {Number(value) === 0
                          ? '—'
                          : `${Number(value) > 0 ? '' : '−'}₹${Math.abs(
                              Number(value)
                            ).toLocaleString('en-IN')}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- The order book: choices ---------------- */}
        <div>
          {/* Step rail */}
          <div className="scrollbar-hide -mx-1 mb-8 flex gap-1 overflow-x-auto pb-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = s.id === step;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  aria-current={active ? 'step' : undefined}
                  className={`group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                    active ? 'text-onaccent' : 'text-muted hover:text-accent'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bespoke-step-pill"
                      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-accent shadow-gold"
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                    {s.label}
                    <span className="nums-tabular opacity-50">{i + 1}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div className="min-h-[26rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -28, filter: 'blur(8px)' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 'metal' && (
                  <OptionGrid
                    options={METALS}
                    selected={spec.metal}
                    onSelect={(id) => set('metal', id)}
                    swatch={(o) => (
                      <span
                        className="block h-8 w-8 rounded-full ring-1 ring-inset ring-white/25"
                        style={{
                          backgroundImage: `linear-gradient(140deg, ${(o as typeof METALS[number]).stops.join(', ')})`,
                        }}
                      />
                    )}
                  />
                )}

                {step === 'stone' && (
                  <OptionGrid
                    options={STONES}
                    selected={spec.stone}
                    onSelect={(id) => set('stone', id)}
                    swatch={(o) => (
                      <svg viewBox="0 0 100 100" className="h-8 w-8">
                        <path
                          d={(o as typeof STONES[number]).path}
                          fill="rgb(var(--diamond) / 0.35)"
                          stroke="rgb(var(--gold-300))"
                          strokeWidth={3}
                        />
                      </svg>
                    )}
                  />
                )}

                {step === 'carat' && (
                  <CaratPicker value={spec.carat} onChange={(v) => set('carat', v)} />
                )}

                {step === 'setting' && (
                  <OptionGrid
                    options={SETTINGS}
                    selected={spec.setting}
                    onSelect={(id) => set('setting', id)}
                  />
                )}

                {step === 'band' && (
                  <OptionGrid
                    options={BANDS}
                    selected={spec.band}
                    onSelect={(id) => set('band', id)}
                  />
                )}

                {step === 'engraving' && (
                  <EngravingPanel
                    value={spec.engraving}
                    onChange={(v) => set('engraving', v)}
                    cost={engravingCost}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer controls */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
            <button
              onClick={() => go(-1)}
              disabled={stepIndex === 0}
              className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            {stepIndex < STEPS.length - 1 ? (
              <button
                onClick={() => go(1)}
                className="group flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-accent text-[10px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow hover:shadow-gold-lg"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <CTAButton variant="primary" size="sm" onClick={submit} showArrow>
                Request this piece
              </CTAButton>
            )}

            <button
              onClick={copySpec}
              className="ml-auto flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors hover:text-accent"
            >
              <Copy className="h-3.5 w-3.5" /> Copy spec
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors hover:text-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {/* Live summary line */}
          <p className="mt-5 font-sans text-xs leading-relaxed text-muted">
            <span className="font-accent uppercase tracking-luxe text-accent">Your piece · </span>
            {summary}
          </p>

          {restored && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 font-sans text-[11px] text-faint"
            >
              <Heart className="h-3 w-3 text-accent" /> Restored from your last visit.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

interface GridOption {
  id: string;
  label: string;
  note: string;
  delta: number;
}

function OptionGrid({
  options,
  selected,
  onSelect,
  swatch,
}: {
  options: readonly GridOption[];
  selected: string;
  onSelect: (id: string) => void;
  swatch?: (o: GridOption) => React.ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o, i) => {
        const active = o.id === selected;
        return (
          <motion.button
            key={o.id}
            onClick={() => onSelect(o.id)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            aria-pressed={active}
            className={`edge-trace group relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-500 ${
              active
                ? 'border-accent/60 bg-accent/[0.07] shadow-gold'
                : 'border-line bg-surface/40 hover:border-accent/40'
            }`}
          >
            <div className="flex items-start gap-3">
              {swatch && <span className="mt-0.5 shrink-0">{swatch(o)}</span>}
              <span className="min-w-0 flex-1">
                <span className="mb-1 flex items-center gap-2">
                  <span className="font-accent text-xs uppercase tracking-luxe text-primary">
                    {o.label}
                  </span>
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-accent"
                      >
                        <Check className="h-2.5 w-2.5 text-onaccent" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="block font-sans text-[11px] leading-relaxed text-muted">
                  {o.note}
                </span>
                <span className="mt-2 block font-accent text-[10px] uppercase tracking-luxe text-faint">
                  {o.delta === 0
                    ? 'Included'
                    : `${o.delta > 0 ? '+' : '−'} ₹${Math.abs(o.delta).toLocaleString('en-IN')}`}
                </span>
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function CaratPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const index = CARATS.findIndex((c) => c.value === value);

  return (
    <div>
      {/* Comparative scale — the circles are sized by the cube root of weight,
          the same rule the preview uses, so the picker does not promise a
          proportion the ring then contradicts. */}
      <div className="mb-8 flex items-end justify-between gap-2 rounded-2xl border border-line bg-surface/40 p-6">
        {CARATS.map((c) => {
          const active = c.value === value;
          const size = 16 * Math.cbrt(c.value / 0.5);
          return (
            <button
              key={c.value}
              onClick={() => onChange(c.value)}
              aria-pressed={active}
              className="group flex flex-1 flex-col items-center gap-3"
            >
              <motion.span
                animate={{
                  width: size,
                  height: size,
                  opacity: active ? 1 : 0.42,
                  boxShadow: active
                    ? '0 0 22px 5px rgb(var(--gold-400) / 0.5)'
                    : '0 0 0 0 transparent',
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="rotate-45 bg-gradient-to-br from-diamond to-platinum ring-1 ring-inset ring-white/40"
              />
              <span
                className={`nums-tabular font-accent text-[10px] tracking-luxe transition-colors ${
                  active ? 'text-accent' : 'text-faint group-hover:text-muted'
                }`}
              >
                {c.value.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-line bg-surface/40 p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-accent text-xs uppercase tracking-luxe text-accent">
            {value.toFixed(2)} carat
          </span>
          <span className="nums-tabular font-sans text-[11px] text-faint">
            {CARATS[index]?.delta
              ? `+ ₹${CARATS[index].delta.toLocaleString('en-IN')}`
              : 'Included'}
          </span>
        </div>
        <p className="font-sans text-[11px] leading-relaxed text-muted">
          {CARAT_NOTES[value] ?? 'A weight our bench cuts to order.'}
        </p>
      </div>
    </div>
  );
}

const CARAT_NOTES: Record<number, string> = {
  0.5: 'Reads as jewellery rather than as a statement. Sits flush under a glove.',
  0.7: 'The commonest bridal weight in the room, and for good reason.',
  1: 'The benchmark. Everything above this is priced against it.',
  1.5: 'The first weight that catches light across a table.',
  2: 'Unmistakable. Needs a shank built to carry it.',
  3: 'Estate territory. Expect a six-month wait for the right stone.',
};

function EngravingPanel({
  value,
  onChange,
  cost,
}: {
  value: string;
  onChange: (v: string) => void;
  cost: number;
}) {
  const remaining = ENGRAVING_FREE_CHARS - value.trim().length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-surface/40 p-6">
        <label
          htmlFor="engraving"
          className="mb-3 block font-accent text-[10px] uppercase tracking-luxer text-accent"
        >
          Inside the shank
        </label>
        <input
          id="engraving"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 24))}
          placeholder="A date, a name, or nothing at all"
          maxLength={24}
          className="input-gold w-full bg-transparent font-display text-xl"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="nums-tabular font-sans text-[11px] text-faint">
            {value.length} / 24 characters
          </span>
          <motion.span
            key={cost}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-muted"
          >
            {cost > 0
              ? `+ ₹${cost.toLocaleString('en-IN')}`
              : `${Math.max(0, remaining)} characters included`}
          </motion.span>
        </div>

        {/* Hand-engraving is charged per character above the allowance, and the
            bar makes the threshold visible before the number moves. */}
        <div className="mt-3 h-px w-full overflow-hidden bg-line">
          <motion.span
            animate={{
              width: `${Math.min(100, (value.trim().length / ENGRAVING_FREE_CHARS) * 100)}%`,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="block h-px bg-gradient-to-r from-gold-600 to-gold-300"
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {['15 · 08 · 1892', 'Always', 'Sempre insieme'].map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className="rounded-full border border-line px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>

      <p className="font-sans text-[11px] leading-relaxed text-faint">
        Engraving is cut by hand with a graver, not lasered. It is the one part of
        the commission we cannot undo, so the proof sheet comes to you before the
        tool touches metal.
      </p>
    </div>
  );
}
