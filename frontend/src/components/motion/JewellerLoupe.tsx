'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';

interface JewellerLoupeProps {
  src: string;
  alt: string;
  /** Magnification. 2–3 reads as a loupe; past 4 the source resolution shows. */
  zoom?: number;
  /** Lens diameter in px. Scaled down on narrow viewports. */
  size?: number;
  /** Natural size of the source, used to compute the zoomed backdrop. */
  className?: string;
  /** Caption shown inside the lens rim, e.g. a carat weight or a clarity grade. */
  readout?: string;
  /** Framed aspect ratio for the plate the loupe sits over. */
  aspect?: string;
}

/**
 * A jeweller's loupe over a photograph.
 *
 * The lens is a second copy of the same image, scaled up and offset so the
 * point under the pointer stays under the pointer. That is the whole trick, and
 * it is the only approach that stays sharp — a CSS `scale` on the original
 * magnifies the already-downsampled bitmap the browser chose for the layout
 * size, which reads as a blur rather than as glass.
 *
 * Three details are what make it read as optics rather than as a zoom widget:
 * a bright rim, a crescent of internal flare that drifts, and colour fringing
 * confined to the edge of the field. All three are in the v4 CSS layer.
 *
 * Touch gets the same lens by dragging, since there is no hover to key off.
 */
export default function JewellerLoupe({
  src,
  alt,
  zoom = 2.15,
  size = 190,
  className = '',
  readout,
  aspect = '4 / 3',
}: JewellerLoupeProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [active, setActive] = useState(false);
  // Position of the lens centre, in px relative to the frame.
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [lensSize, setLensSize] = useState(size);

  // The lens has to shrink on a phone or it covers the whole plate and there is
  // nothing left to aim it at.
  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      setLensSize(w < 480 ? Math.round(size * 0.62) : w < 768 ? Math.round(size * 0.8) : size);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [size]);

  // Measured rather than assumed: the plate is fluid, and the zoomed backdrop
  // has to be sized from its real pixel box or the offsets drift.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setFrame({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const track = useCallback((clientX: number, clientY: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Clamped to the frame so the lens never hangs off an edge showing blank.
    setPos({
      x: Math.min(Math.max(clientX - r.left, 0), r.width),
      y: Math.min(Math.max(clientY - r.top, 0), r.height),
    });
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    track(e.clientX, e.clientY);
    if (!active) setActive(true);
  };

  // Touch drags the lens. preventDefault keeps the gesture from scrolling the
  // page out from under the plate mid-inspection.
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    track(t.clientX, t.clientY);
    if (!active) setActive(true);
  };

  const half = lensSize / 2;
  const bgW = frame.w * zoom;
  const bgH = frame.h * zoom;

  return (
    <figure className={`group relative ${className}`}>
      <div
        ref={frameRef}
        style={{ aspectRatio: aspect }}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(false)}
        onTouchStart={onTouchMove}
        onTouchMove={onTouchMove}
        onTouchEnd={() => setActive(false)}
        className="cursor-loupe relative w-full touch-none overflow-hidden rounded-2xl border border-hairline bg-surface-sunken"
      >
        {/* The plate itself. Deliberately a plain img rather than next/image:
            the lens needs the same URL at an arbitrary background-size, and an
            optimiser that rewrites the src to a fixed width defeats that. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="drag-none h-full w-full object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-[1.02]"
        />

        {/* Grid graticule, faint, so the plate reads as an inspection surface */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-hairline bg-grid opacity-40"
        />

        {/* Corner registration marks */}
        {(
          [
            'left-3 top-3 border-l border-t',
            'right-3 top-3 border-r border-t',
            'left-3 bottom-3 border-b border-l',
            'right-3 bottom-3 border-b border-r',
          ] as const
        ).map((cls) => (
          <span
            key={cls}
            aria-hidden="true"
            className={`pointer-events-none absolute h-5 w-5 border-gold-400/45 transition-opacity duration-500 ${cls} ${
              active ? 'opacity-100' : 'opacity-40'
            }`}
          />
        ))}

        {/* The lens */}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{
            opacity: active && !reduced ? 1 : 0,
            scale: active && !reduced ? 1 : 0.72,
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: lensSize,
            height: lensSize,
            // translate3d rather than left/top: the lens moves on every pointer
            // event, and only a transform stays on the compositor.
            transform: `translate3d(${pos.x - half}px, ${pos.y - half}px, 0)`,
          }}
          className="loupe-lens pointer-events-none absolute left-0 top-0 overflow-hidden rounded-full"
        >
          {/* Magnified field. The offset is the pointer position scaled up, less
              half the lens, which is what keeps the aimed-at point centred. */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${bgW}px ${bgH}px`,
              backgroundPosition: `${-(pos.x * zoom - half)}px ${-(pos.y * zoom - half)}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Edge fringing and internal flare */}
          <span className="loupe-fringe absolute inset-0 rounded-full" />
          <span className="loupe-crescent animate-loupe-flare absolute inset-0 rounded-full mix-blend-screen" />

          {/* Crosshair, thin enough not to obscure what is being judged */}
          <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-gold-100/30" />
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-gold-100/30" />

          {/* Power readout on the rim */}
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe text-gold-100/80">
            {readout ?? `${zoom.toFixed(1)}×`}
          </span>
        </motion.div>

        {/* Prompt, which retires once the visitor has found the lens */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: active ? 0 : 1, y: active ? 8 : 0 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-5"
        >
          <span className="hud flex items-center gap-2 rounded-full px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-on-media-soft">
            <Search size={12} strokeWidth={1.8} className="text-accent" />
            Move across to inspect
          </span>
        </motion.div>
      </div>

      <figcaption className="mt-3 flex items-center justify-between gap-4 font-sans text-[11px] font-light text-faint">
        <span>{alt}</span>
        <span className="nums-tabular font-accent uppercase tracking-luxe text-accent/70">
          {zoom.toFixed(1)}× loupe
        </span>
      </figcaption>
    </figure>
  );
}
