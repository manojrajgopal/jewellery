'use client';

import React, { ElementType, useRef, useState } from 'react';

interface MetalTextProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  /** Sweep the sheen on a loop even when the pointer is elsewhere. */
  idle?: boolean;
  /** 'gold' | 'platinum' | 'rose' — which alloy the type is struck from. */
  alloy?: 'gold' | 'platinum' | 'rose';
}

const ALLOY: Record<string, string> = {
  gold:
    'rgb(var(--gold-800)) 0%, rgb(var(--gold-400)) 22%, rgb(var(--gold-100)) 42%, rgb(var(--gold-300)) 58%, rgb(var(--gold-700)) 82%, rgb(var(--gold-500)) 100%',
  platinum:
    'rgb(var(--ink-500)) 0%, rgb(var(--ink-200)) 24%, #FFFFFF 44%, rgb(var(--ink-100)) 60%, rgb(var(--ink-400)) 84%, rgb(var(--ink-300)) 100%',
  rose:
    'rgb(var(--rose-700)) 0%, rgb(var(--rose-500)) 24%, rgb(var(--rose-100)) 44%, rgb(var(--rose-300)) 60%, rgb(var(--rose-700)) 84%, rgb(var(--rose-500)) 100%',
};

/**
 * Type struck from metal, with a specular band that tracks the pointer.
 *
 * The gradient is clipped to the glyphs, and its highlight stop is driven by the
 * pointer's horizontal position over the element. Moving the light rather than
 * the type is what makes the letters read as a solid object being lit — a
 * looping shimmer, by contrast, always reads as a surface effect painted on.
 */
export default function MetalText({
  children,
  as: Component = 'span',
  className = '',
  idle = true,
  alloy = 'gold',
}: MetalTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState<number | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(((e.clientX - r.left) / r.width) * 100);
  };

  const El = Component as ElementType;

  return (
    <El
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setPos(null)}
      className={`bg-clip-text text-transparent ${
        pos === null && idle ? 'animate-gradient-pan' : ''
      } ${className}`}
      style={{
        backgroundImage: `linear-gradient(100deg, ${ALLOY[alloy]})`,
        backgroundSize: '220% 100%',
        // Tracking mode pins the band under the pointer; idle mode hands the
        // position back to the keyframe animation.
        backgroundPosition: pos === null ? undefined : `${100 - pos}% 50%`,
        transition: pos === null ? 'background-position 700ms ease-out' : 'none',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </El>
  );
}
