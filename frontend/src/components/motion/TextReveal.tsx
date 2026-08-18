'use client';

import SplitText from './SplitText';

interface TextRevealProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  /** 'chars' assembles glyph by glyph; 'words' is calmer for long copy. */
  mode?: 'chars' | 'words';
  blur?: boolean;
}

/**
 * Kept as the site-wide heading entrance. Now a thin wrapper over SplitText so
 * every reveal shares one implementation.
 */
export default function TextReveal({
  text,
  className = '',
  highlightWords = [],
  delay = 0,
  as = 'p',
  mode = 'chars',
  blur = true,
}: TextRevealProps) {
  return (
    <SplitText
      text={text}
      as={as}
      mode={mode}
      className={className}
      highlightWords={highlightWords}
      delay={delay}
      blur={blur}
    />
  );
}
