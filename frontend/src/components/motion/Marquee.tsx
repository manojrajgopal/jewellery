'use client';

import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 'normal',
  pauseOnHover = false,
  className = ''
}: MarqueeProps) {
  const speedClass = {
    slow: 'duration-[60s]',
    normal: 'duration-[40s]',
    fast: 'duration-[20s]'
  }[speed];

  return (
    <div className={`relative flex overflow-hidden w-full ${className} mask-image-marquee`}>
      <div
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 animate-marquee ${speedClass} ${
          pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
        }`}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 animate-marquee ${speedClass} ${
          pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
        }`}
      >
        {children}
      </div>
      <style jsx>{`
        .mask-image-marquee {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}
