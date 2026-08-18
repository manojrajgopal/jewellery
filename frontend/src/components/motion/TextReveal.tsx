'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

export default function TextReveal({
  text,
  className = '',
  highlightWords = [],
  delay = 0,
  as: Component = 'p'
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay }
    }
  };

  const child = {
    hidden: { opacity: 0, y: '115%' },
    visible: {
      opacity: 1,
      y: '0%',
      transition: {
        type: 'tween',
        ease: [0.22, 1, 0.36, 1],
        duration: 0.8
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionComponent = motion(Component as React.ElementType as any);

  return (
    <MotionComponent
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {words.map((word, i) => {
        const wordClean = word.replace(/[^a-zA-Z0-9]/g, '');
        const isHighlight = highlightWords.includes(wordClean) || highlightWords.includes(word);
        return (
          <span key={i} className="inline-block overflow-hidden relative leading-tight align-bottom">
            <motion.span
              variants={child}
              className={`inline-block ${
                isHighlight ? 'text-gold-500 italic font-light' : ''
              }`}
            >
              {word}
            </motion.span>
            <span className="inline-block">&nbsp;</span>
          </span>
        );
      })}
    </MotionComponent>
  );
}
