'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GoldBorderTraceProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number | string;
}

export default function GoldBorderTrace({
  children,
  className = '',
  borderRadius = 0
}: GoldBorderTraceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const perimeter = 2 * (dimensions.width + dimensions.height);

  return (
    <div
      ref={containerRef}
      className={`relative group ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf3d7" />
            <stop offset="50%" stopColor="#d4a843" />
            <stop offset="100%" stopColor="#a37c2c" />
          </linearGradient>
        </defs>
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter}
          initial={{ strokeDashoffset: perimeter }}
          whileHover={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </svg>
      {children}
    </div>
  );
}
