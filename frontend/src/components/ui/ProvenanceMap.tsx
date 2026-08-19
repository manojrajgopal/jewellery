'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { BadgeCheck, MapPin } from 'lucide-react';
import { provenance } from '@/data/atelier';

interface ProvenanceMapProps {
  className?: string;
  /** Step through the chain on its own once it comes into view. */
  autoplay?: boolean;
}

/**
 * The chain from mine to showcase, plotted on a schematic plate.
 *
 * Deliberately a schematic rather than a projection. A real map would imply mine
 * coordinates we do not publish, and it would put the reader's attention on
 * geography when the actual claim is about *custody* — that each link in the chain
 * is verified by a named check. A stylised plate makes the chain the subject.
 *
 * The connecting arcs are drawn as quadratic curves whose control point is lifted
 * above the midpoint, so consecutive stops read as hops rather than as a polyline.
 * Each arc draws itself only once its origin stop has landed, which is what makes
 * the sequence read as a journey instead of as a diagram fading in.
 */
export default function ProvenanceMap({ className = '', autoplay = true }: ProvenanceMapProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();

  const [active, setActive] = useState(0);
  // Stops that have landed. Separate from `active` because an arc's visibility
  // depends on its origin having arrived, not on it being the current selection.
  const [reached, setReached] = useState(0);
  const [engaged, setEngaged] = useState(false);

  // Walk the chain once, then stop. Interrupted for good on the first interaction:
  // a visitor reading stop three does not want to be moved to stop four.
  useEffect(() => {
    if (!inView || engaged) return;
    if (reduced) {
      setReached(provenance.length - 1);
      return;
    }
    if (reached >= provenance.length - 1) return;
    const t = window.setTimeout(() => {
      setReached((r) => r + 1);
      setActive((a) => a + 1);
    }, autoplay ? 1500 : 400);
    return () => window.clearTimeout(t);
  }, [inView, engaged, reached, reduced, autoplay]);

  const select = (i: number) => {
    setEngaged(true);
    setActive(i);
    // Selecting ahead of the walk reveals the chain up to that point, so the arcs
    // never dangle from a stop that has not appeared.
    setReached((r) => Math.max(r, i));
  };

  const stop = provenance[active];

  const W = 100;
  const H = 100;

  /** Quadratic arc between two stops, lifted above the straight line. */
  const arc = (a: typeof provenance[number], b: typeof provenance[number]) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    // Lift proportional to the span, so short hops are shallow and long ones bow.
    const lift = Math.hypot(b.x - a.x, b.y - a.y) * 0.32;
    return `M ${a.x} ${a.y} Q ${mx} ${my - lift} ${b.x} ${b.y}`;
  };

  return (
    <div ref={ref} className={className}>
      {/* ---- The plate ---- */}
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-sunken">
        <div aria-hidden="true" className="absolute inset-0 blueprint-field opacity-60" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-30"
        />

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="relative aspect-[16/9] w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`route-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(var(--gold-700))" />
              <stop offset="50%" stopColor="rgb(var(--gold-300))" />
              <stop offset="100%" stopColor="rgb(var(--gold-600))" />
            </linearGradient>
          </defs>

          {/* Arcs. Rendered before the stops so the pins always sit on top. */}
          {provenance.slice(0, -1).map((from, i) => {
            const to = provenance[i + 1];
            const shown = reached > i;
            return (
              <g key={`${from.id}-${to.id}`}>
                {/* Ghost route, always present, so the shape of the chain is legible
                    before the walk has run. */}
                <path
                  d={arc(from, to)}
                  fill="none"
                  stroke="rgb(var(--hairline) / 0.18)"
                  strokeWidth="0.4"
                  strokeDasharray="1.5 2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* The travelled route */}
                <motion.path
                  d={arc(from, to)}
                  fill="none"
                  stroke={`url(#route-${uid})`}
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </g>
            );
          })}

          {/* Stops */}
          {provenance.map((s, i) => {
            const landed = reached >= i;
            const on = active === i;
            return (
              <g key={s.id}>
                {/* Halo on the current stop */}
                {on && landed && (
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r="3.4"
                    fill="none"
                    stroke="rgb(var(--accent))"
                    strokeOpacity="0.4"
                    strokeWidth="0.4"
                    vectorEffect="non-scaling-stroke"
                    className="svg-center animate-pulse-ring"
                  />
                )}
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r={on ? 1.9 : 1.3}
                  fill={landed ? 'rgb(var(--accent))' : 'rgb(var(--border-strong))'}
                  initial={{ scale: 0 }}
                  animate={{ scale: landed ? 1 : 0.6 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                />
              </g>
            );
          })}
        </svg>

        {/* Labels, as HTML rather than SVG text so they keep the site's type stack
            and are not distorted by the plate's non-uniform preserveAspectRatio. */}
        {provenance.map((s, i) => {
          const landed = reached >= i;
          const on = active === i;
          return (
            <button
              key={s.id}
              onClick={() => select(i)}
              aria-pressed={on}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${s.x}%`, top: `${s.y}%`, marginTop: '1.4rem' }}
            >
              <span
                className={`block font-accent text-[8px] uppercase tracking-luxe transition-colors duration-500 sm:text-[9px] ${
                  on ? 'text-accent' : landed ? 'text-muted' : 'text-faint'
                }`}
              >
                {s.label}
              </span>
              <span
                className={`mx-auto mt-1 block h-px transition-all duration-500 ${
                  on ? 'w-6 bg-accent' : 'w-0 bg-transparent'
                }`}
              />
            </button>
          );
        })}

        {/* Step counter */}
        <span className="pointer-events-none absolute right-4 top-4 font-accent text-[9px] uppercase tracking-luxe text-faint">
          {String(active + 1).padStart(2, '0')} / {String(provenance.length).padStart(2, '0')}
        </span>
      </div>

      {/* ---- The reading ---- */}
      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxest text-accent">
              <MapPin size={11} strokeWidth={1.9} />
              {stop.place}
            </p>
            <h3 className="mt-2.5 font-display text-2xl font-light text-primary md:text-3xl">
              {stop.label}
            </h3>
            <p className="mt-3 max-w-prose font-sans text-sm font-light leading-relaxed text-muted">
              {stop.detail}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* The verified check for this stop */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${stop.id}-check`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="flex items-center gap-3 rounded-xl border border-jade-500/25 bg-jade-900/10 px-5 py-4"
          >
            <BadgeCheck
              size={16}
              strokeWidth={1.8}
              className="flex-shrink-0 text-jade-300"
            />
            <span>
              <span className="block font-accent text-[8px] uppercase tracking-luxe text-faint">
                Verified at this stop
              </span>
              <span className="mt-0.5 block font-sans text-xs font-light text-secondary">
                {stop.check}
              </span>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
