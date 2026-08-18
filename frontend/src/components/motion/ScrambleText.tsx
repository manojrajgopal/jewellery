'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789◆◇✦✧';

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** ms per character before it locks into place */
  speed?: number;
  /** Re-run the scramble whenever the element is hovered. */
  scrambleOnHover?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Decodes text from random glyphs — used on eyebrows and stat labels so even
 * small type has a moment of motion.
 */
export default function ScrambleText({
  text,
  className = '',
  speed = 34,
  scrambleOnHover = true,
  as: Tag = 'span',
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [output, setOutput] = useState(text);
  const timer = useRef<number | null>(null);

  const run = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    let frame = 0;

    timer.current = window.setInterval(() => {
      const revealed = Math.floor(frame / 2);
      setOutput(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < revealed) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      frame += 1;
      if (revealed >= text.length) {
        if (timer.current) window.clearInterval(timer.current);
        setOutput(text);
      }
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    run();
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [inView, run]);

  // Casting to a plain element type keeps TS from expanding every intrinsic
  // element's prop union, which it cannot represent.
  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={className}
      onMouseEnter={scrambleOnHover ? run : undefined}
      aria-label={text}
    >
      <span aria-hidden="true">{output}</span>
    </Component>
  );
}
