'use client';

import { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface InkBleedRevealProps {
  src: string;
  alt: string;
  className?: string;
  /** Aspect ratio of the frame, width / height. */
  ratio?: number;
  /** Seconds the bleed takes to cross the frame. */
  duration?: number;
  /** How ragged the wet edge is. Higher is wilder; past ~30 it tears. */
  roughness?: number;
}

/**
 * An image that arrives the way ink soaks into paper: a wet, ragged edge
 * travelling up the frame rather than a straight wipe.
 *
 * Done entirely inside one SVG, which is the part worth explaining. The obvious
 * approach — a CSS `mask-image: url(#mask)` on a div — is inconsistently
 * supported for HTML elements across browsers, and silently renders as *no mask
 * at all*, i.e. a fully visible image and no animation. Putting the photograph in
 * an `<image>` element inside the same SVG as the mask keeps everything in SVG's
 * own coordinate system, where masks and filters have been reliable for years.
 *
 * The raggedness is a fractal-noise displacement of the mask edge, not of the
 * photograph: the picture stays perfectly sharp while its boundary bleeds. Two
 * octaves is enough — more just makes the edge noisy rather than wet.
 *
 * Under a reduced-motion preference it renders the plain image at full opacity;
 * there is no version of a creeping edge that respects that setting.
 */
export default function InkBleedReveal({
  src,
  alt,
  className = '',
  ratio = 4 / 5,
  duration = 1.8,
  roughness = 18,
}: InkBleedRevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });

  // Ids must be unique per instance: two of these on a page would otherwise
  // share one mask, and the second would animate the first.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const maskId = `ink-mask-${uid}`;
  const filterId = `ink-filter-${uid}`;

  const w = 1000;
  const h = Math.round(w / ratio);

  if (reduced) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label={alt}
      >
        <defs>
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.03"
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={roughness}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            {/* A touch of blur after the displacement, so the torn edge reads as
                damp paper rather than as a cut. */}
            <feGaussianBlur stdDeviation="4" />
          </filter>

          <mask id={maskId} maskUnits="userSpaceOnUse">
            {/* The mask's own contents are filtered, never the photograph. Height
                is animated from the bottom edge upward, which is the direction
                ink actually travels when a page is laid on a wet surface. */}
            <motion.rect
              x={-w * 0.1}
              width={w * 1.2}
              fill="#fff"
              filter={`url(#${filterId})`}
              initial={{ height: 0, y: h }}
              animate={inView ? { height: h * 1.25, y: -h * 0.12 } : { height: 0, y: h }}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            />
          </mask>
        </defs>

        <image
          href={src}
          x={0}
          y={0}
          width={w}
          height={h}
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#${maskId})`}
        />
      </svg>

      {/* The wet sheen that follows the edge up. Purely on top, so it cannot
          affect the mask geometry. */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, y: '40%' }}
        animate={inView ? { opacity: [0, 0.5, 0], y: '-15%' } : { opacity: 0 }}
        transition={{ duration: duration * 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 h-1/3 bg-gradient-to-t from-transparent via-gold-100/25 to-transparent blend-screen"
      />
    </div>
  );
}
