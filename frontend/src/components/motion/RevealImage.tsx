'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Tailwind aspect class, or the bare word ('square', '4/5', 'video'). */
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  /** Panel wipe on entry in addition to the blur-up. */
  curtain?: boolean;
  /** Scale factor applied on hover. */
  zoom?: number;
}

/**
 * Tailwind only sees class names that appear literally in source, so the
 * supported ratios are spelled out here rather than interpolated.
 */
const ASPECTS: Record<string, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '4/5': 'aspect-[4/5]',
  '5/4': 'aspect-[5/4]',
  '3/2': 'aspect-[3/2]',
  '2/3': 'aspect-[2/3]',
  '16/9': 'aspect-video',
};

const normalizeAspect = (value: string) => {
  if (!value) return 'aspect-square';
  if (value.startsWith('aspect-')) return value;
  return ASPECTS[value] ?? 'aspect-square';
};

/**
 * Images arrive twice: a gold curtain wipes off, then the picture resolves
 * from blur as it decodes. Hovering pushes a slow zoom with a warm wash.
 */
export default function RevealImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-square',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  curtain = true,
  zoom = 1.07,
}: RevealImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <div
      ref={ref}
      className={`group relative w-full overflow-hidden ${normalizeAspect(aspectRatio)} ${className}`}
    >
      {/* Shimmer placeholder until the file decodes */}
      {!loaded && <div className="skeleton absolute inset-0 z-10" aria-hidden="true" />}

      <motion.div
        initial={{ scale: 1.16, filter: 'blur(14px)', opacity: 0 }}
        animate={
          loaded && inView
            ? { scale: 1, filter: 'blur(0px)', opacity: 1 }
            : { scale: 1.16, filter: 'blur(14px)', opacity: 0 }
        }
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: zoom }}
        className="relative h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover drag-none"
          onLoad={() => setLoaded(true)}
        />
        {/* Warm wash on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gold-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      </motion.div>

      {curtain && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
          style={{ originY: 1 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 z-20 bg-gradient-to-b from-gold-600 to-gold-800"
        />
      )}
    </div>
  );
}
