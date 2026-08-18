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
      style={{ opacity: OPACITY[intensity] }}
    >
      <motion.div style={parallax ? { y } : undefined} className="absolute inset-[-20%]">
        <div className="absolute left-[8%] top-[10%] h-[46vw] w-[46vw] animate-aurora-drift rounded-full bg-gold-500/25 blur-[120px]" />
        <div
          className="absolute right-[6%] top-[24%] h-[40vw] w-[40vw] animate-aurora-drift rounded-full bg-amethyst-700/25 blur-[130px]"
          style={{ animationDelay: '-9s' }}
        />
        <div
          className="absolute bottom-[6%] left-[26%] h-[42vw] w-[42vw] animate-aurora-drift rounded-full bg-jade-700/20 blur-[140px]"
          style={{ animationDelay: '-17s' }}
        />
        <div
          className="absolute bottom-[18%] right-[22%] h-[30vw] w-[30vw] animate-aurora-drift rounded-full bg-burgundy-700/25 blur-[120px]"
          style={{ animationDelay: '-4s' }}
        />
      </motion.div>

      {grid && (
        <div className="absolute inset-0 bg-grid-hairline bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      )}
    </div>
  );
}
