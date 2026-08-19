'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface VelvetTrayProps {
  image: string;
  alt: string;
  /** Printed inside the lid, the way a jeweller's case carries the house name. */
  house?: string;
  title: string;
  subtitle?: string;
  meta?: string[];
  className?: string;
  /** 'view' opens once on scroll; 'hover' opens and closes with the pointer. */
  trigger?: 'view' | 'hover' | 'click';
  children?: React.ReactNode;
}

/**
 * A presentation case that opens to show the piece inside.
 *
 * The lid is hinged on its top edge and swings back past 90°, which is what makes
 * it read as a lid rather than as a panel sliding away — a lid that stops at 90°
 * looks like it is still in the way. It swings to 112°, far enough to be clearly
 * open and not so far that its printed underside turns away from the viewer.
 *
 * Three things happen on the same beat as the lid: the velvet bed lifts its
 * shadow, the piece rises out of the well, and the caustic wash comes up. Opening
 * them together is what gives the moment weight; staggering them makes the case
 * feel like three separate animations that happen to share a container.
 *
 * The `click` trigger exists for touch, where there is no hover and a case that
 * opens on scroll and never closes gives the visitor nothing to do.
 */
export default function VelvetTray({
  image,
  alt,
  house = 'Aurum',
  title,
  subtitle,
  meta = [],
  className = '',
  trigger = 'view',
  children,
}: VelvetTrayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-18% 0px' });

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // A short beat after the case comes into view, so the visitor sees it closed
  // first. Opening the instant it crosses the fold means nobody ever sees a lid.
  const [viewOpen, setViewOpen] = useState(false);
  useEffect(() => {
    if (trigger !== 'view' || !inView) return;
    const t = window.setTimeout(() => setViewOpen(true), reduced ? 0 : 520);
    return () => window.clearTimeout(t);
  }, [trigger, inView, reduced]);

  const open =
    trigger === 'hover' ? hovered : trigger === 'click' ? clicked : viewOpen || hovered;

  const swing = reduced ? 112 : open ? 112 : 0;

  return (
    <div
      ref={ref}
      className={`group relative ${className}`}
      style={{ perspective: 1600 }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Case body */}
      <div
        className="relative overflow-hidden rounded-2xl border border-gold-500/25 shadow-cinema"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* The well. Velvet, with the piece sitting in it. */}
        <div className="velvet-bed relative aspect-[4/3] w-full overflow-hidden">
          {/* Caustics coming up with the lid */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-caustic-pool bg-gold-radial"
            animate={{ opacity: open ? 0.9 : 0.15 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* The piece, rising out of the well as the lid clears it */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-10"
            animate={{
              y: open ? 0 : 18,
              scale: open ? 1 : 0.9,
              opacity: open ? 1 : 0.55,
              filter: open ? 'blur(0px)' : 'blur(3px)',
            }}
            transition={
              reduced ? { duration: 0 } : { duration: 1.05, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
              />
            </div>
          </motion.div>

          {/* Specular glints on the stone, only once it is out in the light */}
          {open && !reduced && (
            <>
              <span className="pointer-events-none absolute left-[36%] top-[34%] h-2 w-2 animate-facet-glint rounded-full bg-gold-50" />
              <span
                className="pointer-events-none absolute left-[62%] top-[52%] h-1.5 w-1.5 animate-facet-glint rounded-full bg-champagne-100"
                style={{ animationDelay: '1.6s' }}
              />
            </>
          )}

          {/* Rim shadow the lid casts into the well */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
            animate={{ opacity: open ? 0.25 : 0.85 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(180deg, rgb(var(--shadow-color) / 0.95), transparent)',
            }}
          />
        </div>

        {/* The lid. Hinged at the top, printed on its underside. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 origin-top"
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
          animate={{ rotateX: -swing }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: 'spring', stiffness: 68, damping: 15, mass: 1.15 }
          }
        >
          {/* Outer face — tooled leather in the house colour */}
          <div className="absolute inset-0 backface-hidden overflow-hidden rounded-2xl">
            <div className="velvet-bed absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900/60 via-ink-950/40 to-ink-900/70" />

            {/* Blind-stamped house mark */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="stitch-border rounded-xl px-10 py-6">
                <span className="text-emboss-gold block font-accent text-2xl uppercase tracking-luxest">
                  {house}
                </span>
              </span>
              <span className="font-sans text-[9px] font-light uppercase tracking-luxe text-gold-200/45">
                Established 1892
              </span>
            </div>

            {/* Sheen crossing the lid as it swings */}
            <span className="pointer-events-none absolute inset-0 animate-sheen-diagonal bg-gold-sheen opacity-40 mix-blend-overlay" />
          </div>

          {/* Inner face — satin lining, seen once the lid is back */}
          <div
            className="absolute inset-0 backface-hidden overflow-hidden rounded-2xl"
            style={{ transform: 'rotateX(180deg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cream-100/12 via-cream-100/5 to-transparent" />
            <div className="absolute inset-0 frosted-etch" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-sm italic text-gold-200/60">
                {subtitle ?? 'Presented by hand'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Clasp. Retracts as the case opens. */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
          animate={{ y: open ? -14 : 0, opacity: open ? 0 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block h-6 w-10 rounded-b-md border border-t-0 border-gold-500/50 bg-gradient-to-b from-gold-600 to-gold-800 shadow-gold" />
        </motion.span>
      </div>

      {/* Card beneath the case, the way a boutique presents a piece */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: open ? 1 : 0.4, y: open ? 0 : 10 }}
        transition={{ duration: 0.7, delay: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-light text-primary md:text-3xl">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1.5 font-sans text-sm font-light text-muted">{subtitle}</p>
            )}
          </div>
          <Sparkles
            size={16}
            strokeWidth={1.6}
            className={`mt-1.5 flex-shrink-0 transition-colors duration-700 ${
              open ? 'text-accent' : 'text-faint'
            }`}
          />
        </div>

        {meta.length > 0 && (
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4">
            {meta.map((m) => (
              <dd
                key={m}
                className="font-accent text-[9px] uppercase tracking-luxe text-faint"
              >
                {m}
              </dd>
            ))}
          </dl>
        )}

        {children}
      </motion.div>

      {/* Touch affordance */}
      {trigger === 'click' && (
        <button
          onClick={() => setClicked((v) => !v)}
          aria-expanded={clicked}
          aria-label={clicked ? `Close the case for ${title}` : `Open the case for ${title}`}
          className="absolute inset-0 z-30 cursor-pointer"
          data-cursor={clicked ? 'Close' : 'Open'}
        />
      )}
    </div>
  );
}
