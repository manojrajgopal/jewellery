'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GoldBorderTraceProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number | string;
  /** Trace continuously instead of only on hover. */
  always?: boolean;
  duration?: number;
}

/**
 * A gold hairline that draws itself around the element's perimeter on hover,
 * plus corner ticks that flare at the same moment.
 *
 * The gradient gets a unique id per instance — a shared id meant every card on
 * a page reused the first one's gradient.
 */
export default function GoldBorderTrace({
  children,
  className = '',
  borderRadius = 0,
  always = false,
  duration = 1.4,
}: GoldBorderTraceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const gradientId = `gold-trace-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const perimeter = 2 * (width + height) || 1;

  return (
    <div ref={containerRef} className={`group relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--gold-100))" />
            <stop offset="45%" stopColor="rgb(var(--gold-400))" />
            <stop offset="100%" stopColor="rgb(var(--gold-700))" />
          </linearGradient>
        </defs>
        <motion.rect
          x="1"
          y="1"
          width={Math.max(0, width - 2)}
          height={Math.max(0, height - 2)}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeDasharray={perimeter}
          initial={{ strokeDashoffset: perimeter }}
          animate={always ? { strokeDashoffset: 0 } : undefined}
          whileHover={always ? undefined : { strokeDashoffset: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          style={{ strokeDashoffset: perimeter }}
          className="[transition:stroke-dashoffset_1.4s_cubic-bezier(0.22,1,0.36,1)] group-hover:[stroke-dashoffset:0]"
        />
      </svg>

      {/* Corner ticks */}
      {(['left-2 top-2', 'right-2 top-2', 'left-2 bottom-2', 'right-2 bottom-2'] as const).map(
        (pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`pointer-events-none absolute ${pos} z-20 h-1.5 w-1.5 rotate-45 bg-gold-400 opacity-0 transition-all duration-500 group-hover:opacity-90`}
          />
        )
      )}

      {children}
    </div>
  );
}
