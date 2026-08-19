'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Move, Plus } from 'lucide-react';

export interface PanoramaStation {
  id: string;
  label: string;
  /** Horizontal position in the panorama, 0–1 across its full width. */
  at: number;
  /** Vertical placement of the hotspot, as a percentage of the frame. */
  y: number;
  detail: string;
}

interface AtelierPanoramaProps {
  /** Background plates, laid end to end to form the panorama. */
  plates: { src: string; alt: string }[];
  stations?: PanoramaStation[];
  className?: string;
  /** Height of the viewport onto the panorama, in px. */
  height?: number;
  /** Drift slowly on its own until the visitor takes hold of it. */
  autoDrift?: boolean;
}

/**
 * A draggable pan across the workshop, with hotspots on the benches.
 *
 * Not a scroll container. The panorama is a wide strip translated by a value this
 * component owns, driven by pointer drag, wheel and arrow keys — which is the only
 * way to keep a horizontal pan from stealing vertical wheel events from the page.
 * An `overflow-x: auto` strip captures the trackpad the moment the pointer is over
 * it, and on a site with a custom smooth scroller that reads as the page jamming.
 *
 * Layers move at different rates: the plates pan at full speed, the hotspots at
 * full speed with them, and the atmospheric wash at two-thirds — which gives the
 * pan some depth without needing separate artwork for a background.
 *
 * The drift is deliberately slow and stops for good on first contact. A panorama
 * that keeps drifting while someone is reading a hotspot is fighting them.
 */
export default function AtelierPanorama({
  plates,
  stations = [],
  className = '',
  height = 460,
  autoDrift = true,
}: AtelierPanoramaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /** Pan offset in px. Negative moves the strip left, revealing what is to the right. */
  const [offset, setOffset] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  // The strip is `plates.length` frames wide, so the furthest it can travel is
  // everything but the last frame. Measured, because the frame is fluid.
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      setLimit(Math.max(0, w * (plates.length - 1)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [plates.length]);

  const clamp = useCallback((v: number) => Math.min(0, Math.max(-limit, v)), [limit]);

  /* ---- Drag ---- */
  const drag = useRef<{ startX: number; startOffset: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { startX: e.clientX, startOffset: offset };
    setDragging(true);
    setEngaged(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setOffset(clamp(drag.current.startOffset + (e.clientX - drag.current.startX)));
  };

  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  /* ---- Wheel ----
     Bound natively with `passive: false` rather than through onWheel. React
     registers its wheel listener as passive, so a preventDefault from a synthetic
     handler is ignored and logs a warning — which would leave the browser free to
     start its own horizontal scroll underneath the pan.

     Only a predominantly horizontal gesture is claimed. A vertical wheel over the
     panorama has to keep scrolling the page, or the strip becomes a trap. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      setEngaged(true);
      setOffset((o) => clamp(o - e.deltaX));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clamp]);

  /* ---- Keyboard ---- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const stepPx = (frameRef.current?.getBoundingClientRect().width ?? 600) * 0.3;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setEngaged(true);
      setOffset((o) => clamp(o - stepPx));
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setEngaged(true);
      setOffset((o) => clamp(o + stepPx));
    }
  };

  /* ---- Drift ---- */
  useEffect(() => {
    if (!autoDrift || engaged || reduced || limit === 0) return;
    let raf = 0;
    let last = performance.now();
    // 14px/s. Slow enough to read as a slow pan rather than as a carousel.
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setOffset((o) => {
        const next = o - 14 * dt;
        // Turn around at the far end rather than snapping back to the start.
        return next < -limit ? -limit : next;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [autoDrift, engaged, reduced, limit]);

  const station = stations.find((s) => s.id === open);
  const progress = limit === 0 ? 0 : -offset / limit;

  return (
    <div className={className}>
      <div
        ref={frameRef}
        tabIndex={0}
        role="group"
        aria-roledescription="panorama"
        aria-label="Pan across the atelier"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className={`relative w-full touch-none overflow-hidden rounded-2xl border border-hairline bg-surface-sunken outline-none ring-offset-4 ring-offset-canvas focus-visible:ring-1 focus-visible:ring-gold-500/50 ${
          dragging ? 'cursor-grabbing' : 'cursor-grab-x'
        }`}
        style={{ height }}
      >
        {/* Atmospheric wash, panning at two-thirds speed for depth */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[300%] bg-gold-mesh opacity-40"
          animate={{ x: offset * 0.66 }}
          transition={dragging || reduced ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 26 }}
        />

        {/* The strip */}
        <motion.div
          className="absolute inset-y-0 left-0 flex h-full"
          style={{ width: `${plates.length * 100}%` }}
          animate={{ x: offset }}
          transition={
            dragging || reduced
              ? { duration: 0 }
              : { type: 'spring', stiffness: 140, damping: 26 }
          }
        >
          {plates.map((plate, i) => (
            <div key={`${plate.src}-${i}`} className="relative h-full flex-1">
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
                draggable={false}
              />
              {/* Seam softener between plates */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-950/40 to-transparent"
                />
              )}
            </div>
          ))}

          {/* Hotspots, positioned along the full strip */}
          {stations.map((s) => (
            <button
              key={s.id}
              onClick={(e) => {
                // Guard against a drag that ends on a hotspot registering as a tap.
                if (dragging) return;
                e.stopPropagation();
                setEngaged(true);
                setOpen((cur) => (cur === s.id ? null : s.id));
              }}
              aria-pressed={open === s.id}
              aria-label={s.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.at * 100}%`, top: `${s.y}%` }}
            >
              <span className="relative flex h-9 w-9 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-pulse-ring rounded-full border border-gold-300/50"
                />
                <span
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-400 ${
                    open === s.id
                      ? 'rotate-45 border-accent bg-accent text-onaccent'
                      : 'border-gold-300/60 bg-ink-950/45 text-gold-100'
                  }`}
                >
                  <Plus size={13} strokeWidth={2.2} />
                </span>
              </span>
              <span className="mt-1.5 block whitespace-nowrap font-accent text-[8px] uppercase tracking-luxe text-gold-100/80">
                {s.label}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Edge vignette, so the pan reads as a window rather than as a cropped photo */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_-24px_rgb(0_0_0/0.85)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-canvas/45 to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-canvas/45 to-transparent"
        />

        {/* Prompt, retired on first contact */}
        <AnimatePresence>
          {!engaged && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2"
            >
              <span className="hud flex items-center gap-2 rounded-full px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-on-media-soft">
                <Move size={12} strokeWidth={1.8} className="text-accent" />
                Drag to pan the workshop
              </span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Position rail */}
        <div className="pointer-events-none absolute inset-x-8 bottom-3 h-px bg-on-media-wash">
          <motion.span
            className="absolute -top-px h-[3px] w-12 rounded-full bg-accent"
            animate={{ left: `${progress * 100}%` }}
            style={{ x: '-50%' }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
          />
        </div>
      </div>

      {/* Hotspot reading */}
      <AnimatePresence mode="wait">
        {station && (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 14, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 flex items-start gap-4 rounded-xl border border-hairline bg-surface-raised/60 p-5 backdrop-blur-xl">
              <span
                aria-hidden="true"
                className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-accent"
              />
              <div>
                <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                  {station.label}
                </p>
                <p className="mt-2 max-w-prose font-sans text-sm font-light leading-relaxed text-muted">
                  {station.detail}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
