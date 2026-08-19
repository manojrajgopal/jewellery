'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export interface OrbitItem {
  id: string;
  label: string;
  image: string;
  href?: string;
}

interface OrbitShowcaseProps {
  items: OrbitItem[];
  /** Diameter of the outer ring in px at the largest breakpoint. */
  size?: number;
  /** Seconds per revolution. */
  duration?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Pieces orbiting a centrepiece, like a display carousel in a vitrine.
 *
 * The ring rotates and each item counter-rotates by the same amount, so the
 * photographs stay upright while their positions travel. Without the
 * counter-rotation the images tumble, which looks like a bug rather than an
 * orbit.
 */
export default function OrbitShowcase({
  items,
  size = 520,
  duration = 44,
  children,
  className = '',
}: OrbitShowcaseProps) {
  const reduced = useReducedMotion();
  const radius = size / 2;

  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ width: size, height: size, maxWidth: '100%' }}
    >
      {/* Orbit paths */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-dashed border-gold-500/18"
      />
      <span
        aria-hidden="true"
        className="animate-breathe absolute inset-[16%] rounded-full border border-gold-500/12"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[30%] rounded-full bg-gold-radial blur-2xl"
        style={{ opacity: 'var(--bloom)' }}
      />

      {/* The ring */}
      <motion.div
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        {items.map((item, i) => {
          const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          const x = radius + Math.cos(angle) * radius - radius * 0.13;
          const y = radius + Math.sin(angle) * radius - radius * 0.13;

          return (
            <motion.div
              key={item.id}
              // Cancels the ring's rotation so the photograph stays upright.
              animate={reduced ? {} : { rotate: -360 }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
              className="absolute"
              style={{
                left: x,
                top: y,
                width: radius * 0.26,
                height: radius * 0.26,
              }}
            >
              <OrbitNode item={item} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Centrepiece */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}

function OrbitNode({ item }: { item: OrbitItem }) {
  const body = (
    <motion.div
      whileHover={{ scale: 1.16, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative h-full w-full"
    >
      <div className="relative h-full w-full overflow-hidden rounded-full border border-gold-500/30 shadow-gold">
        <Image
          src={item.image}
          alt={item.label}
          fill
          sizes="140px"
          className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
        />
        <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-gold-200/25" />
      </div>

      {/* Label, revealed on hover below the node */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {item.label}
      </span>
    </motion.div>
  );

  if (item.href) {
    return (
      <Link href={item.href} aria-label={item.label} data-cursor="View" className="block h-full w-full">
        {body}
      </Link>
    );
  }
  return body;
}
