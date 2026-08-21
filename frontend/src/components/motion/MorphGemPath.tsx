'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { useVisibleInterval } from '@/hooks/useVisibleInterval';

export interface GemShape {
  id: string;
  label: string;
  /** Path in a 0–100 viewBox. Must share its command structure with the others. */
  d: string;
  /** One-line note printed under the drawing. */
  note?: string;
}

/**
 * The house's cuts, drawn so every path shares one command structure — a moveto,
 * four cubics, a close.
 *
 * That constraint is why these are hand-written rather than exported from a
 * drawing tool. An exporter will happily emit six curves for one shape and nine
 * for the next, and two paths with different command lists cannot be tweened by
 * interpolation — they need a full resampling pass first. Matching the structure
 * up front is what makes the morph a one-line lerp.
 */
export const GEM_SHAPES: GemShape[] = [
  {
    id: 'brilliant',
    label: 'Round Brilliant',
    d: 'M 50 10 C 72.1 10 90 27.9 90 50 C 90 72.1 72.1 90 50 90 C 27.9 90 10 72.1 10 50 C 10 27.9 27.9 10 50 10 Z',
    note: '57 facets — the reference cut for fire',
  },
  {
    id: 'oval',
    label: 'Oval',
    d: 'M 50 8 C 68 8 82 26 82 50 C 82 74 68 92 50 92 C 32 92 18 74 18 50 C 18 26 32 8 50 8 Z',
    note: 'Lengthens the finger; reads larger per carat',
  },
  {
    id: 'pear',
    label: 'Pear',
    d: 'M 50 6 C 64 26 86 44 86 62 C 86 80 70 94 50 94 C 30 94 14 80 14 62 C 14 44 36 26 50 6 Z',
    note: 'A point and a shoulder — the drop cut',
  },
  {
    id: 'marquise',
    label: 'Marquise',
    d: 'M 50 6 C 62 24 82 40 82 50 C 82 60 62 76 50 94 C 38 76 18 60 18 50 C 18 40 38 24 50 6 Z',
    note: 'Two points, maximum spread per carat',
  },
  {
    id: 'cushion',
    label: 'Cushion',
    d: 'M 50 10 C 76 10 90 24 90 50 C 90 76 76 90 50 90 C 24 90 10 76 10 50 C 10 24 24 10 50 10 Z',
    note: 'Soft corners, antique light return',
  },
  {
    id: 'heart',
    label: 'Heart',
    d: 'M 50 94 C 20 72 6 50 6 32 C 6 14 30 4 50 26 C 70 4 94 14 94 32 C 94 50 80 72 50 94 Z',
    note: 'The hardest cut to keep symmetrical',
  },
];

interface MorphGemPathProps {
  shapes?: GemShape[];
  className?: string;
  /** Seconds each shape holds before the next morph begins. */
  hold?: number;
  /** Seconds a morph takes. */
  morph?: number;
  /** Controlled index. When supplied, autoplay is off and this drives it. */
  index?: number;
  /** Print the cut's name and note beneath the drawing. */
  caption?: boolean;
  /** Selectable chips beneath, so a visitor can drive the morph themselves. */
  selectable?: boolean;
  size?: number;
}

const ARITY: Record<string, number> = { M: 2, L: 2, C: 6, Q: 4, Z: 0 };

/** Split a path into its command letters and a flat list of its numbers. */
const tokenise = (d: string) => ({
  commands: d.match(/[A-Za-z]/g) ?? [],
  numbers: (d.match(/-?\d*\.?\d+/g) ?? []).map(Number),
});

/** Rebuild a path from a command list and a flat number list. */
const rebuild = (commands: string[], numbers: number[]) => {
  let n = 0;
  return commands
    .map((cmd) => {
      const take = ARITY[cmd.toUpperCase()] ?? 0;
      const args = numbers.slice(n, n + take);
      n += take;
      return args.length ? `${cmd} ${args.map((v) => v.toFixed(2)).join(' ')}` : cmd;
    })
    .join(' ');
};

/** The house curve, evaluated directly since this runs its own rAF loop. */
const easeLuxury = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A stone that changes its cut.
 *
 * Interpolating the path itself, rather than cross-fading two drawings, is the
 * whole point: the silhouette travels through the intermediate shapes, so the eye
 * reads one stone being recut instead of two stones swapping places.
 *
 * The tween writes `d` straight to the nodes from a rAF loop. Framer Motion
 * cannot interpolate a path string, and pushing a new `d` through React state 60
 * times a second would re-render the tree for a value nothing else reads. Two
 * nodes are kept in step — the clip path that the facets are cut against, and
 * the visible girdle stroke — which is one loop feeding two consumers.
 */
export default function MorphGemPath({
  shapes = GEM_SHAPES,
  className = '',
  hold = 2.4,
  morph = 1.15,
  index,
  caption = true,
  selectable = false,
  size = 260,
}: MorphGemPathProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const reduced = useReducedMotion();

  const svgRef = useRef<SVGSVGElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const facetRef = useRef<SVGGElement>(null);
  const rafRef = useRef(0);

  const [internal, setInternal] = useState(0);
  const current = index ?? internal;
  // Where the running tween started. Distinct from `current`, which is where it
  // is headed.
  const [settled, setSettled] = useState(current);

  const parsed = useMemo(() => shapes.map((s) => tokenise(s.d)), [shapes]);

  // Every shape has to agree on structure or the tween produces a torn path.
  // Checked once rather than trusted, because the shape list is a public prop.
  const structureOk = useMemo(() => {
    if (parsed.length === 0) return false;
    const first = parsed[0];
    return parsed.every(
      (p) =>
        p.numbers.length === first.numbers.length &&
        p.commands.join('') === first.commands.join('')
    );
  }, [parsed]);

  const paint = useCallback((d: string) => {
    clipRef.current?.setAttribute('d', d);
    outlineRef.current?.setAttribute('d', d);
  }, []);

  // Autoplay, unless the caller drives it, the OS asked for stillness, or the
  // shape is nowhere near the viewport — each advance starts a path tween, and
  // tweening an SVG path nobody can see is the most expensive kind of nothing.
  useVisibleInterval(
    svgRef,
    () => setInternal((i) => (i + 1) % shapes.length),
    index !== undefined || reduced || shapes.length < 2 ? null : (hold + morph) * 1000
  );
  useEffect(() => {
  }, [index, reduced, shapes.length, hold, morph]);

  // The morph.
  useEffect(() => {
    if (!structureOk) return;

    const from = parsed[settled] ?? parsed[0];
    const to = parsed[current] ?? parsed[0];

    if (settled === current || reduced) {
      paint(rebuild(to.commands, to.numbers));
      if (settled !== current) setSettled(current);
      return;
    }

    const start = performance.now();
    const ms = morph * 1000;

    const frame = (now: number) => {
      const raw = Math.min((now - start) / ms, 1);
      const t = easeLuxury(raw);

      paint(
        rebuild(
          to.commands,
          from.numbers.map((v, i) => v + ((to.numbers[i] ?? v) - v) * t)
        )
      );

      // The facet fan turns through the change, so the stone reads as rotating
      // while it is recut rather than merely deforming in place.
      facetRef.current?.setAttribute('transform', `rotate(${(t * 24).toFixed(2)} 50 50)`);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        facetRef.current?.setAttribute('transform', 'rotate(0 50 50)');
        setSettled(current);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
    // `settled` is the tween's start point, so it genuinely belongs in the deps.
  }, [current, settled, parsed, structureOk, reduced, morph, paint]);

  const shape = shapes[current] ?? shapes[0];
  const initialD = shapes[0]?.d ?? '';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${shape?.label ?? 'Gem'} cut`}
      >
        {/* The caustic pool the stone appears to sit in */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-caustic-pool rounded-full bg-gold-radial opacity-[var(--bloom)]"
        />

        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="relative h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id={`gem-fill-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(var(--gold-200))" stopOpacity="0.34" />
              <stop offset="42%" stopColor="rgb(var(--champagne-300))" stopOpacity="0.16" />
              <stop offset="100%" stopColor="rgb(var(--gold-700))" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id={`gem-stroke-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(var(--gold-100))" />
              <stop offset="50%" stopColor="rgb(var(--gold-400))" />
              <stop offset="100%" stopColor="rgb(var(--gold-700))" />
            </linearGradient>

            {/* Facets are clipped to the silhouette, so they follow the morph for
                free rather than needing a tween of their own. */}
            <clipPath id={`gem-clip-${uid}`}>
              <path ref={clipRef} d={initialD} />
            </clipPath>
          </defs>

          <g clipPath={`url(#gem-clip-${uid})`}>
            <rect x="0" y="0" width="100" height="100" fill={`url(#gem-fill-${uid})`} />

            <g ref={facetRef} stroke="rgb(var(--gold-200))" strokeWidth="0.4" opacity="0.5">
              {/* Crown facets, radiating from the table */}
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={(50 + Math.cos(a) * 60).toFixed(2)}
                    y2={(50 + Math.sin(a) * 60).toFixed(2)}
                  />
                );
              })}
              <circle cx="50" cy="50" r="17" fill="none" strokeWidth="0.55" opacity="0.85" />
              <circle cx="50" cy="50" r="30" fill="none" strokeWidth="0.35" opacity="0.5" />
            </g>

            {/* Specular band travelling through the stone.
                Animated on the `x` attribute rather than with the shared `sweep`
                keyframe: that keyframe translates by ±100%, and a percentage
                translate on an SVG rect resolves against its own 46-unit width — so
                the band would travel 46 units and never reach the stone at all.
                Driving the attribute in user units is unambiguous. */}
            {!reduced && (
              <motion.rect
                y="0"
                width="46"
                height="100"
                fill="rgb(var(--gold-100))"
                opacity="0.18"
                initial={{ x: -50 }}
                animate={{ x: 104 }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            )}
          </g>

          {/* Girdle, drawn last so the outline always reads over the facets */}
          <path
            ref={outlineRef}
            d={initialD}
            fill="none"
            stroke={`url(#gem-stroke-${uid})`}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />

          {/* Glint at the table. `svg-center` is required, not cosmetic: the glint
              keyframe scales, and without fill-box a scale on an SVG circle
              originates at the user-space origin and drags the glint toward (0,0). */}
          <circle
            cx="42"
            cy="38"
            r="2.6"
            fill="rgb(var(--gold-50))"
            className="svg-center animate-facet-glint"
          />
        </svg>
      </div>

      {caption && shape && (
        <div className="mt-4 min-h-[3.5rem] text-center">
          <p className="font-accent text-[11px] uppercase tracking-luxest text-accent">
            {shape.label}
          </p>
          {shape.note && (
            <p className="mt-1.5 font-sans text-xs font-light text-muted">{shape.note}</p>
          )}
        </div>
      )}

      {selectable && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {shapes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setInternal(i)}
              aria-pressed={i === current}
              className={`rounded-full border px-3.5 py-1.5 font-accent text-[9px] uppercase tracking-luxe transition-all duration-300 ${
                i === current
                  ? 'border-gold-500/60 bg-gold-500/12 text-accent'
                  : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
