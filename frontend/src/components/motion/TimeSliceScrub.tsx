'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

interface TimeSliceScrubProps {
  src: string;
  alt: string;
  /** Number of vertical strips. Prime-ish counts avoid visible banding. */
  columns?: number;
  className?: string;
  /** How far the outer strips travel, as a fraction of frame height. */
  lean?: number;
  /** Caption, set as an instrument reading rather than a sentence. */
  reading?: string;
  /** Lay the strips horizontally instead. A face wants columns; a horizon rows. */
  axis?: 'x' | 'y';
}

/**
 * A slit-scan: one photograph reassembled out of strips that arrive at
 * different moments.
 *
 * The site has plenty of images that reveal — wipes, masks, mosaics, facet
 * shatters. Every one of them treats the picture as a single object being
 * uncovered. This treats it as a *recording*: each strip is read as though it
 * were captured at a slightly later instant than the one beside it, which is
 * literally how a focal-plane shutter and a slit-scan camera work, and it is
 * why a slit-scan of anything moving comes out sheared.
 *
 * Three decisions carry it:
 *
 *  1. The offset per strip is a smooth function of the strip's index, not a
 *     random value. Random offsets read as noise or as a glitch effect; a
 *     monotonic ramp reads as time, because time is monotonic.
 *  2. The ramp is centred, so the middle strips barely move and the outer ones
 *     travel furthest. That puts the subject — which in a portrait or a piece of
 *     jewellery is almost always central — under the least distortion, and it is
 *     the difference between a shear and a smear.
 *  3. Every strip renders the *whole* picture and is cropped to its own column
 *     by a parent with `overflow-hidden`. Slicing the source into separate
 *     images would need N requests for one photograph; this needs one, and the
 *     browser paints it once per strip off the same decoded bitmap.
 *
 * The scrub is the page's own scroll, spring-smoothed. Wheel input is noisy
 * enough that a raw scroll-linked shear judders at strip boundaries, and the
 * spring costs nothing because it drives a transform rather than layout.
 */
export default function TimeSliceScrub({
  src,
  alt,
  columns = 13,
  className = '',
  lean = 0.5,
  reading,
  axis = 'x',
}: TimeSliceScrubProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  const strips = Array.from({ length: columns }, (_, i) => i);
  const vertical = axis === 'y';

  return (
    <figure ref={ref} className={`relative ${className}`}>
      {/* The frame owns the aspect ratio; the strips only divide it. Putting the
          ratio on the strips instead makes each one as tall as it is narrow,
          which at thirteen columns is a row of slivers rather than a picture. */}
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-sm bg-surface-sunken ${
          vertical ? 'flex flex-col' : 'flex items-stretch'
        }`}
      >
        {strips.map((i) => {
          // Centred ramp: -1 at the first strip, +1 at the last, 0 in the middle.
          const t = columns > 1 ? (i / (columns - 1)) * 2 - 1 : 0;
          const size = `${100 / columns}%`;

          return (
            <Strip
              key={i}
              index={i}
              total={columns}
              t={t}
              size={size}
              lean={lean}
              vertical={vertical}
              progress={smooth}
              reduced={!!reduced}
              src={src}
              alt={i === 0 ? alt : ''}
            />
          );
        })}

        {/* The seams. Drawn on top rather than left as gaps between the strips,
            because a gap lets the background through and a seam does not — and
            a slit-scan has seams, not gaps. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            // Inline rather than a class, because the pitch is the strip count
            // and Tailwind cannot interpolate a runtime value into an arbitrary
            // value. A hardcoded pitch here draws seams that miss the joins.
            backgroundImage: `repeating-linear-gradient(${
              vertical ? '0deg' : '90deg'
            }, transparent 0 calc(100% / ${columns} - 1px), rgb(var(--shadow-color) / 0.22) calc(100% / ${columns} - 1px), transparent calc(100% / ${columns}))`,
          }}
        />
      </div>

      {reading && (
        <figcaption className="mt-3 flex items-baseline gap-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
          <span>{reading}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line/50" />
          <span className="nums-instrument">{columns} slices</span>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * One strip. Extracted because every strip needs its own `useTransform`, and a
 * hook inside a `.map` in the parent body is only legal while the array length
 * never changes — which is true here today and would be a real bug the first
 * time `columns` became stateful.
 */
function Strip({
  index,
  total,
  t,
  size,
  lean,
  vertical,
  progress,
  reduced,
  src,
  alt,
}: {
  index: number;
  total: number;
  t: number;
  size: string;
  lean: number;
  vertical: boolean;
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
  src: string;
  alt: string;
}) {
  // Fully sheared at both ends of the pass, flush in the middle. The strip is
  // therefore *correct* exactly once, at the centre of the viewport — which is
  // the frame a visitor stops on.
  const shift = useTransform(progress, [0, 0.5, 1], [t * lean * 70, 0, t * lean * -70]);
  const fade = useTransform(progress, [0, 0.16, 0.84, 1], [0.35, 1, 1, 0.35]);

  const style = reduced ? {} : vertical ? { x: shift, opacity: fade } : { y: shift, opacity: fade };

  return (
    <motion.div
      aria-hidden={alt ? undefined : 'true'}
      style={{ ...style, [vertical ? 'height' : 'width']: size }}
      className={`relative shrink-0 overflow-hidden ${
        vertical ? 'w-full' : 'h-full'
      } will-transform`}
    >
      {/* The whole picture, positioned so this strip's window lands on this
          strip's part of it. Scaled by the strip count on the cross axis. */}
      <div
        className="absolute inset-0"
        style={
          vertical
            ? { height: `${total * 100}%`, top: `${-index * 100}%` }
            : { width: `${total * 100}%`, left: `${-index * 100}%` }
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover"
          priority={false}
        />
      </div>
    </motion.div>
  );
}
