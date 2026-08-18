'use client';

import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
  /** Fade the leading and trailing edges into the page. */
  fadeEdges?: boolean;
}

const DURATION: Record<string, string> = {
  slow: '68s',
  normal: '42s',
  fast: '22s',
};

/**
 * Seamless infinite ticker. Two identical tracks translate by exactly -50%,
 * so the loop point is invisible at any width.
 */
export default function Marquee({
  children,
  speed = 'normal',
  pauseOnHover = false,
  reverse = false,
  className = '',
  fadeEdges = true,
}: MarqueeProps) {
  const animation = reverse ? 'animate-marquee-reverse' : 'animate-marquee';
  const pause = pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '';

  return (
    <div
      className={`group relative flex w-full overflow-hidden ${
        fadeEdges ? 'mask-fade-x' : ''
      } ${className}`}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={`flex min-w-full shrink-0 items-center justify-around gap-8 ${animation} ${pause}`}
          style={{ animationDuration: DURATION[speed] }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
