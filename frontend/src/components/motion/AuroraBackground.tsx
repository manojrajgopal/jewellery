'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AuroraBackgroundProps {
  /** Tailwind-ish intensity of the whole field. */
  intensity?: 'subtle' | 'medium' | 'bold';
  /** Adds a faint hairline grid over the colour field. */
  grid?: boolean;
  /** Parallax the field slightly against page scroll. */
  parallax?: boolean;
  className?: string;
}

const OPACITY = { subtle: 0.35, medium: 0.6, bold: 0.9 };

/**
 * Slow-drifting jewel-toned light field: gold, amethyst, jade and burgundy
 * blooms behind a heavy blur. Purely decorative, GPU-cheap (transform only).
 */
export default function AuroraBackground({
  intensity = 'subtle',
  grid = false,
  parallax = true,
  className = '',
}: AuroraBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      // Scaled by --bloom so the jewel field stays a whisper on cream.
      style={{ opacity: `calc(${OPACITY[intensity]} * var(--bloom, 1))` }}
    >
      {/* The blooms are the most expensive single thing in the site's CSS: a
          gaussian blur costs in proportion to the area it covers, and these are
          circles 40–46% of the viewport *width* across with radii up to 140px.
          The radius now comes through `.fx-bloom`, which scales it by device
          tier — a 42px blur on a 46vw circle is indistinguishable from a 140px
          one at this opacity, and on a 2GB device it is the difference between
          a layer that rasterises within a frame and one that does not. */}
      <motion.div style={parallax ? { y } : undefined} className="absolute inset-[-20%]">
        <div
          className="fx-bloom absolute left-[8%] top-[10%] h-[46vw] w-[46vw] animate-aurora-drift rounded-full bg-gold-500/25"
          style={{ ['--fx-r' as string]: '120px' }}
        />
        <div
          className="fx-bloom absolute right-[6%] top-[24%] h-[40vw] w-[40vw] animate-aurora-drift rounded-full bg-amethyst-700/25"
          style={{ animationDelay: '-9s', ['--fx-r' as string]: '130px' }}
        />
        <div
          className="fx-bloom absolute bottom-[6%] left-[26%] h-[42vw] w-[42vw] animate-aurora-drift rounded-full bg-jade-700/20"
          style={{ animationDelay: '-17s', ['--fx-r' as string]: '140px' }}
        />
        <div
          className="fx-bloom absolute bottom-[18%] right-[22%] h-[30vw] w-[30vw] animate-aurora-drift rounded-full bg-burgundy-700/25"
          style={{ animationDelay: '-4s', ['--fx-r' as string]: '120px' }}
        />
      </motion.div>

      {grid && (
        <div className="absolute inset-0 bg-grid-hairline bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      )}
    </div>
  );
}
