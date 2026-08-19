'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import RarityMeter from '@/components/ui/RarityMeter';
import { gems, gemsForMonth, MONTHS } from '@/data/gems';
import { products } from '@/data/products';

interface BirthstoneWheelProps {
  className?: string;
  /** Diameter of the dial in px at the widest breakpoint. */
  size?: number;
}

/**
 * A twelve-month dial that turns to bring a month under the index mark.
 *
 * The dial rotates rather than the marker moving, which is the whole reason this
 * is a wheel and not a row of buttons — the selected month always arrives at the
 * same place, so the eye never has to hunt for what changed.
 *
 * Rotation is tracked as an unbounded accumulated angle, not as a value modulo
 * 360. That is what makes December → January turn one step forward instead of
 * spinning eleven steps backward: the shortest signed path is computed against
 * the current angle and added to it, so the dial can wind past 360° indefinitely.
 *
 * Dragging works too, and lands on the nearest month rather than wherever the
 * finger left off — a dial that stops between two labels is a broken dial.
 */
export default function BirthstoneWheel({ className = '', size = 380 }: BirthstoneWheelProps) {
  const reduced = useReducedMotion();
  const [month, setMonth] = useState(1);
  // Accumulated, unbounded. See the note above on why this is not modulo 360.
  const [angle, setAngle] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const step = 360 / 12;

  // Open on the visitor's own month. Done after mount, because this project is a
  // static export — reading the date during render would bake the build date into
  // the HTML and every visitor would see whatever month we happened to deploy in.
  useEffect(() => {
    const now = new Date().getMonth() + 1;
    setHydrated(true);
    select(now);
    // Intentionally once: this is an initial position, not a subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (next: number) => {
    setMonth(next);
    setAngle((current) => {
      // Where the dial would have to sit for `next` to be under the mark.
      const want = -(next - 1) * step;
      // Shortest signed distance from where it is now, wrapped to ±180, then
      // *added* to the running angle — which is what lets the dial wind past 360°
      // instead of unwrapping backwards through eleven months.
      let delta = (((want - current) % 360) + 540) % 360 - 180;
      // Six months away is exactly 180° and genuinely ambiguous; bias forward so
      // the dial never stalls choosing between two equal paths.
      if (Math.abs(Math.abs(delta) - 180) < 0.01) delta = 180;
      return current + delta;
    });
  };

  const stones = useMemo(() => gemsForMonth(month), [month]);
  const primary = stones[0] ?? gems[0];

  // Pieces that actually feature the month's stone, matched on the gemstone field.
  const matches = useMemo(
    () =>
      products
        .filter((p) =>
          p.gemstone?.toLowerCase().includes(primary.name.toLowerCase().split(' ')[0])
        )
        .slice(0, 3),
    [primary]
  );

  /* ---- Drag to spin ---- */
  const dialRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startAngle: number; startPointer: number } | null>(null);
  // Mirrored into state because the transition below is chosen during render, and
  // a ref mutated by a pointer handler is not a render-time source of truth — the
  // spring would keep fighting the drag until some unrelated update happened to
  // re-render the component.
  const [dragging, setDragging] = useState(false);

  const bearing = (clientX: number, clientY: number) => {
    const el = dialRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return (
      (Math.atan2(clientY - (r.top + r.height / 2), clientX - (r.left + r.width / 2)) *
        180) /
      Math.PI
    );
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { startAngle: angle, startPointer: bearing(e.clientX, e.clientY) };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const delta = bearing(e.clientX, e.clientY) - drag.current.startPointer;
    setAngle(drag.current.startAngle + delta);
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    // Land on the nearest month, then let `select` do the accumulated-angle maths
    // so the snap and the click path behave identically.
    const raw = (((-angle / step) % 12) + 12) % 12;
    select((Math.round(raw) % 12) + 1);
  };

  return (
    <div className={`grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 ${className}`}>
      {/* ---- The dial ---- */}
      <div className="flex flex-col items-center">
        <div
          className="relative select-none"
          style={{ width: '100%', maxWidth: size, aspectRatio: '1 / 1' }}
        >
          {/* Index mark at the top — the reading position */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-30 flex -translate-x-1/2 flex-col items-center"
          >
            <span className="block h-3 w-3 rotate-45 bg-accent shadow-[0_0_14px_3px_rgb(var(--gold-500)/0.6)]" />
            <span className="mt-1 block h-4 w-px bg-gradient-to-b from-accent to-transparent" />
          </span>

          {/* Bezel */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-gold-500/25"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[7%] rounded-full border border-hairline"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-radar-sweep rounded-full bg-conic-gold opacity-[0.16]"
          />

          {/* Turning plate */}
          <motion.div
            ref={dialRef}
            className="cursor-grab-x absolute inset-0 touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            animate={{ rotate: angle }}
            transition={
              dragging || reduced
                ? { duration: 0 }
                : { type: 'spring', stiffness: 90, damping: 18, mass: 0.9 }
            }
          >
            {MONTHS.map((label, i) => {
              const stone = gemsForMonth(i + 1)[0];
              const active = month === i + 1;
              // Each month sits at its own bearing on the plate, then the label
              // counter-rotates so it stays upright as the plate turns.
              return (
                <button
                  key={label}
                  onClick={() => select(i + 1)}
                  aria-pressed={active}
                  aria-label={`${label} — ${stone?.name ?? ''}`}
                  className="absolute left-1/2 top-1/2 origin-center"
                  style={{
                    transform: `rotate(${i * step}deg) translateY(-${size * 0.4}px)`,
                  }}
                >
                  <span
                    className="flex flex-col items-center gap-1.5"
                    style={{ transform: `rotate(${-(i * step) - angle}deg)` }}
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-7 w-7 bg-gradient-to-br ${stone?.swatch ?? ''} ${
                        stone?.cut ?? 'clip-diamond'
                      } transition-all duration-500 ${
                        active
                          ? 'scale-[1.45] drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]'
                          : 'opacity-55 hover:opacity-90'
                      }`}
                    />
                    <span
                      className={`font-accent text-[8px] uppercase tracking-luxe transition-colors duration-500 ${
                        active ? 'text-accent' : 'text-faint'
                      }`}
                    >
                      {label.slice(0, 3)}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Hub — the current stone, drawn large */}
          <div className="pointer-events-none absolute inset-[24%] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={primary.id}
                initial={{ scale: 0.5, opacity: 0, rotate: -35 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.7, opacity: 0, rotate: 25 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className={`block h-full w-full bg-gradient-to-br ${primary.swatch} ${primary.cut} shadow-[0_18px_50px_-14px_rgba(0,0,0,0.7)]`}
              />
            </AnimatePresence>

            {/* Glints on the hub stone */}
            <span className="absolute left-[34%] top-[30%] h-2 w-2 animate-facet-glint rounded-full bg-gold-50" />
            <span
              className="absolute left-[62%] top-[58%] h-1.5 w-1.5 animate-facet-glint rounded-full bg-champagne-100"
              style={{ animationDelay: '2s' }}
            />
          </div>
        </div>

        <p className="mt-6 text-center font-sans text-[11px] font-light italic text-faint">
          Turn the dial, or drag it. {hydrated ? 'Opened on your month.' : ''}
        </p>
      </div>

      {/* ---- The reading ---- */}
      <div className="flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={month}
            initial={{ opacity: 0, x: 26, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -18, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              {MONTHS[month - 1]}
            </span>

            <h3 className="mt-3 font-display text-3xl font-light leading-tight text-primary md:text-5xl">
              {primary.name}
            </h3>

            {primary.alias && (
              <p className="mt-1.5 font-display text-base italic text-secondary">
                {primary.alias}
              </p>
            )}

            <p className="mt-5 font-display text-lg italic leading-snug text-secondary md:text-xl">
              {primary.meaning}
            </p>

            <p className="mt-4 max-w-prose font-sans text-sm font-light leading-relaxed text-muted">
              {primary.note}
            </p>

            {/* Figures */}
            <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-hairline py-5">
              {[
                { k: 'Hardness', v: `${primary.hardness}`, u: 'Mohs' },
                { k: 'Fire', v: primary.refraction.toFixed(2), u: 'RI' },
                { k: 'Density', v: primary.density.toFixed(2), u: 'SG' },
              ].map((row) => (
                <div key={row.k}>
                  <dd className="nums-tabular font-display text-2xl text-accent">
                    {row.v}
                    <span className="ml-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {row.u}
                    </span>
                  </dd>
                  <dt className="mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {row.k}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="mt-5 max-w-xs">
              <RarityMeter value={primary.rarity} />
            </div>

            <p className="mt-5 flex items-start gap-2.5 font-sans text-[11px] font-light leading-relaxed text-muted">
              <Sparkles size={12} strokeWidth={1.8} className="mt-0.5 flex-shrink-0 text-accent" />
              {primary.care}
            </p>

            {/* Pieces featuring the stone */}
            {matches.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 font-accent text-[9px] uppercase tracking-luxe text-faint">
                  In the collection
                </p>
                <ul className="flex flex-col gap-2">
                  {matches.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/collections/${p.collection}`}
                        data-cursor="View"
                        className="group flex items-center justify-between gap-4 rounded-lg border border-hairline px-4 py-3 transition-colors duration-300 hover:border-gold-500/40"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-sans text-sm font-light text-primary transition-colors group-hover:text-accent">
                            {p.name}
                          </span>
                          <span className="block font-accent text-[9px] uppercase tracking-luxe text-faint">
                            {p.gemstone}
                          </span>
                        </span>
                        <span className="flex items-center gap-3 flex-shrink-0">
                          <span className="nums-tabular font-sans text-xs text-muted">
                            {p.formattedPrice ?? p.price}
                          </span>
                          <ArrowUpRight
                            size={13}
                            className="text-accent opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
