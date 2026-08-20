'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeLens, springsHeavy } from '@/lib/motion';

/**
 * Band profiles, with the numbers a bench actually works from.
 *
 * `inner` is the shape of the surface against the skin, and it is the only thing
 * on this list that a wearer feels. `sizeShift` is the correction in ring sizes
 * that profile needs against a flat band of the same nominal size — a court
 * profile runs about half a size loose because the contact patch is narrower, and
 * getting this wrong is the most common cause of a ring that will not stay put.
 *
 * The figures are the trade's own rules of thumb rather than measurements, and
 * they are stated as such below the fold.
 */
interface Profile {
  id: string;
  name: string;
  alias?: string;
  /** The outer face. */
  outer: 'flat' | 'domed' | 'half-round' | 'knife' | 'bevel';
  /** The face against the finger — the one that decides comfort. */
  inner: 'flat' | 'domed';
  /** Ring sizes to add or subtract against a flat band. */
  sizeShift: number;
  /** 1–5: how easily it passes a knuckle. */
  ease: number;
  /** 1–5: how likely it is to spin once on. */
  spin: number;
  /** 1–5: how much a scratch shows. */
  showsWear: number;
  description: string;
  candour: string;
}

const PROFILES: Profile[] = [
  {
    id: 'flat',
    name: 'Flat',
    outer: 'flat',
    inner: 'flat',
    sizeShift: 0,
    ease: 2,
    spin: 1,
    showsWear: 5,
    description:
      'Square in section, with two hard edges inside and out. The most modern-looking of the profiles and the reference every other is measured against.',
    candour:
      'Two inside edges mean two lines of pressure on the finger. Fine on a narrow band, noticeably uncomfortable above about 5mm.',
  },
  {
    id: 'court',
    name: 'Court',
    alias: 'comfort fit',
    outer: 'domed',
    inner: 'domed',
    sizeShift: -0.5,
    ease: 5,
    spin: 4,
    showsWear: 2,
    description:
      'Gently curved on both faces, so the band rides on a curve rather than on edges. What most people mean when they say a ring is comfortable.',
    candour:
      'It runs about half a size loose for the same nominal measurement, and it will rotate on the finger. Order it half a size down from your flat-band size.',
  },
  {
    id: 'half-round',
    name: 'Half-round',
    alias: "D-shape",
    outer: 'half-round',
    inner: 'flat',
    sizeShift: 0,
    ease: 3,
    spin: 2,
    showsWear: 3,
    description:
      'Rounded outside, flat inside. The traditional wedding band shape, and the compromise that has outlasted every alternative.',
    candour:
      'The flat inner face grips well but the two edges are still there. On a wide band they can leave a mark after a long day.',
  },
  {
    id: 'bevel',
    name: 'Bevelled',
    outer: 'bevel',
    inner: 'flat',
    sizeShift: 0,
    ease: 3,
    spin: 2,
    showsWear: 4,
    description:
      'Flat across the top with the outer edges cut away at an angle, so the band catches light along two crisp lines.',
    candour:
      'Those two bright lines are the first thing to dull. A bevelled band needs polishing more often than any other profile to keep looking new.',
  },
  {
    id: 'knife',
    name: 'Knife-edge',
    outer: 'knife',
    inner: 'domed',
    sizeShift: -0.25,
    ease: 4,
    spin: 3,
    showsWear: 5,
    description:
      'Rising to a ridge along the centre line, so the band reads as much finer than its actual weight of metal.',
    candour:
      'The ridge is a wearing edge. On a ring worn daily it softens visibly within a few years, and restoring it removes metal each time.',
  },
];

const WIDTHS = [2, 2.5, 3, 4, 5, 6, 8] as const;

interface BandProfileSelectorProps {
  className?: string;
}

/**
 * The shape of the band, and what it does to the wearing of it.
 *
 * A band is chosen from a photograph of its front, which shows the one face that
 * does not matter. What decides whether a ring is worn every day for forty years
 * or lives in a drawer is the *inside* profile and the width — and neither is
 * ever illustrated.
 *
 * So the drawing here is a section, drawn to the selected width so the change
 * from 2mm to 8mm is a real change in proportion rather than a label. And the
 * size correction is stated as a number: a court profile runs half a size loose,
 * which is the single most useful thing on this page and is almost never
 * mentioned before a ring is ordered.
 *
 * The section morphs between profiles rather than cutting, because the shapes are
 * genuinely close to each other and a cut hides how small the differences are —
 * which is itself worth knowing before paying a premium for one.
 */
export default function BandProfileSelector({ className = '' }: BandProfileSelectorProps) {
  const reduced = useReducedMotion();
  const [id, setId] = useState('court');
  const [widthIndex, setWidthIndex] = useState(3); // 4mm — the commonest band.
  const [baseSize, setBaseSize] = useState(12);

  const profile = PROFILES.find((p) => p.id === id) ?? PROFILES[0];
  const width = WIDTHS[widthIndex];

  /**
   * Width compounds the profile's own correction: a wide flat band grips harder
   * than a narrow one, so it needs more room, while a wide court band spreads
   * the load and needs slightly less. The bench rule is a quarter size per 2mm
   * beyond 4mm, signed by whether the inner face is flat.
   */
  const widthShift = useMemo(() => {
    const beyond = Math.max(0, width - 4);
    return profile.inner === 'flat' ? (beyond / 2) * 0.25 : -(beyond / 2) * 0.1;
  }, [width, profile.inner]);

  const recommended = baseSize + profile.sizeShift + widthShift;

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* ================= The section, drawn to width ================= */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setId(p.id)}
                aria-pressed={p.id === id}
                className={`rounded-full border px-3.5 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                  p.id === id
                    ? 'border-accent bg-accent text-onaccent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface-sunken p-8">
            <div className="flex items-baseline justify-between">
              <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
                In section, at {width}mm
              </span>
              <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                {profile.outer} outside · {profile.inner} inside
              </span>
            </div>

            <div className="mt-8 flex items-end justify-center" style={{ height: '11rem' }}>
              <ProfileSection profile={profile} width={width} reduced={!!reduced} />
            </div>

            {/* The finger it sits on — drawn so the inner face has something to
                be a shape against. */}
            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-line-subtle" />
              <span className="font-accent text-[9px] uppercase tracking-luxer text-faint">
                skin
              </span>
              <span className="h-px w-16 bg-line-subtle" />
            </div>
          </div>

          {/* ---- Width ---- */}
          <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="band-width"
                className="font-accent text-[10px] uppercase tracking-luxer text-accent"
              >
                Width
              </label>
              <span className="font-display text-2xl text-primary nums-tabular">{width} mm</span>
            </div>
            <input
              id="band-width"
              type="range"
              min={0}
              max={WIDTHS.length - 1}
              step={1}
              value={widthIndex}
              onChange={(e) => setWidthIndex(Number(e.target.value))}
              className="mt-4 w-full accent-[rgb(var(--accent))]"
            />
            <div className="mt-2 flex justify-between font-accent text-[9px] text-faint nums-tabular">
              {WIDTHS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= The consequences ================= */}
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-3xl text-primary">{profile.name}</h3>
            {profile.alias && (
              <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
                also sold as {profile.alias}
              </span>
            )}
            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-secondary">
              {profile.description}
            </p>
          </div>

          {/* ---- The three wearing scores ---- */}
          <div className="space-y-3.5 rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
            {[
              { label: 'Passes the knuckle', value: profile.ease, good: true },
              { label: 'Spins once on', value: profile.spin, good: false },
              { label: 'Shows a scratch', value: profile.showsWear, good: false },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between">
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                    {row.label}
                  </span>
                  <span className="font-accent text-[10px] text-faint nums-tabular">
                    {row.value}/5
                  </span>
                </div>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.span
                      key={n}
                      initial={false}
                      animate={{
                        opacity: n <= row.value ? 1 : 0.16,
                        scaleY: n <= row.value ? 1 : 0.55,
                      }}
                      transition={
                        reduced ? { duration: 0 } : { ...springsHeavy.detent, delay: n * 0.02 }
                      }
                      className={`h-1.5 flex-1 origin-center rounded-full ${
                        row.good ? 'bg-accent' : 'bg-burgundy-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ---- The size correction, which is the useful part ---- */}
          <div className="rounded-3xl border border-accent/30 bg-accent/[0.06] p-6">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Order it at
            </span>

            <div className="mt-4 flex items-baseline gap-3">
              <label htmlFor="band-base" className="sr-only">
                Your size in a flat band
              </label>
              <input
                id="band-base"
                type="number"
                min={4}
                max={30}
                step={0.5}
                value={baseSize}
                onChange={(e) => setBaseSize(Number(e.target.value) || 0)}
                className="w-20 rounded-xl border border-hairline bg-surface-sunken px-3 py-2 text-center font-display text-xl text-primary outline-none nums-tabular focus:border-accent/60"
              />
              <span className="font-sans text-xs font-light text-muted">
                is your size in a flat band
              </span>
            </div>

            <motion.p
              key={`${recommended}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeLens.focusRing }}
              className="mt-5 font-display text-4xl text-accent nums-tabular"
            >
              {recommended % 1 === 0 ? recommended.toFixed(0) : recommended.toFixed(2)}
            </motion.p>
            <p className="mt-1 font-accent text-[10px] uppercase tracking-luxe text-faint">
              in a {width}mm {profile.name.toLowerCase()} band
            </p>

            <div className="mt-4 space-y-1 font-sans text-xs font-light text-muted nums-tabular">
              <p>
                Profile correction: {profile.sizeShift >= 0 ? '+' : ''}
                {profile.sizeShift}
              </p>
              <p>
                Width correction at {width}mm: {widthShift >= 0 ? '+' : ''}
                {widthShift.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              What nobody mentions
            </span>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
              {profile.candour}
            </p>
          </div>

          <p className="font-sans text-xs font-light leading-relaxed text-faint">
            These corrections are the bench&rsquo;s rules of thumb, not measurements — a quarter size per
            2mm beyond 4mm, signed by whether the inner face is flat. They get you to the right half
            size to try on, which is all a number can honestly do.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   The section drawing. One <path> that morphs, so the closeness of the
   profiles to each other is visible rather than hidden by a cut.
   ========================================================================= */
function ProfileSection({
  profile,
  width,
  reduced,
}: {
  profile: Profile;
  width: number;
  reduced: boolean;
}) {
  // 8mm maps to the full 200-unit box, so the drawing is genuinely to scale
  // against itself across the whole width range.
  const w = (width / 8) * 170;
  const h = 62;
  const x0 = 100 - w / 2;
  const x1 = 100 + w / 2;
  const yTop = 100 - h / 2;
  const yBot = 100 + h / 2;

  /** Outer face, left to right along the top. */
  const outerPath = () => {
    switch (profile.outer) {
      case 'domed':
        return `M${x0} ${yTop + 10} Q100 ${yTop - 16} ${x1} ${yTop + 10}`;
      case 'half-round':
        return `M${x0} ${yTop + 14} Q100 ${yTop - 20} ${x1} ${yTop + 14}`;
      case 'knife':
        return `M${x0} ${yTop + 16} L100 ${yTop - 18} L${x1} ${yTop + 16}`;
      case 'bevel':
        return `M${x0} ${yTop + 14} L${x0 + w * 0.16} ${yTop} L${x1 - w * 0.16} ${yTop} L${x1} ${yTop + 14}`;
      default:
        return `M${x0} ${yTop} L${x1} ${yTop}`;
    }
  };

  /** Inner face, right to left along the bottom, closing the shape. */
  const innerPath = () =>
    profile.inner === 'domed'
      ? `L${x1} ${yBot - 12} Q100 ${yBot + 14} ${x0} ${yBot - 12} Z`
      : `L${x1} ${yBot} L${x0} ${yBot} Z`;

  const d = `${outerPath()} ${innerPath()}`;

  return (
    <svg
      viewBox="0 0 200 170"
      className="h-full w-full"
      role="img"
      aria-label={`${profile.name} profile at ${width} millimetres, in cross-section`}
    >
      <defs>
        <linearGradient id="band-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--gold-200))" />
          <stop offset="34%" stopColor="rgb(var(--gold-400))" />
          <stop offset="70%" stopColor="rgb(var(--gold-600))" />
          <stop offset="100%" stopColor="rgb(var(--gold-800))" />
        </linearGradient>
      </defs>

      {/* The skin line, so the inner face is a shape against something. */}
      <line
        x1="10"
        y1={yBot + 20}
        x2="190"
        y2={yBot + 20}
        stroke="rgb(var(--border))"
        strokeWidth="1"
      />

      <motion.path
        initial={false}
        animate={{ d }}
        transition={reduced ? { duration: 0 } : springsHeavy.tray}
        fill="url(#band-metal)"
        stroke="rgb(var(--gold-200))"
        strokeWidth="0.75"
        strokeOpacity="0.5"
      />

      {/* Width dimension, drawn the way a bench drawing does it. */}
      <g stroke="rgb(var(--accent))" strokeWidth="0.75" opacity="0.55">
        <motion.line initial={false} animate={{ x1: x0, x2: x1 }} y1={yTop - 26} y2={yTop - 26} transition={reduced ? { duration: 0 } : springsHeavy.tray} />
        <motion.line initial={false} animate={{ x1: x0, x2: x0 }} y1={yTop - 31} y2={yTop - 21} transition={reduced ? { duration: 0 } : springsHeavy.tray} />
        <motion.line initial={false} animate={{ x1: x1, x2: x1 }} y1={yTop - 31} y2={yTop - 21} transition={reduced ? { duration: 0 } : springsHeavy.tray} />
      </g>
      <text
        x="100"
        y={yTop - 32}
        textAnchor="middle"
        fontSize="9"
        letterSpacing="1.5"
        fill="rgb(var(--accent))"
        className="font-accent"
      >
        {width}mm
      </text>
    </svg>
  );
}
