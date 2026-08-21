'use client';

import React, { Children, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

type Mode = 'rise' | 'mask' | 'blur' | 'flip' | 'iris' | 'facet';
type Order = 'forward' | 'reverse' | 'centre' | 'edges';

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  mode?: Mode;
  order?: Order;
  stagger?: number;
  delay?: number;
  /** Wrapper element for each child. Use 'li' inside a list. */
  as?: 'div' | 'li' | 'span';
  once?: boolean;
  /** Applied to every generated wrapper — usually a grid/flex child class. */
  itemClassName?: string;
}

/**
 * Entrances are built per item so each can carry its own delay without
 * discarding the curve — passing a bare `transition={{ delay }}` on the element
 * replaces the variant's transition wholesale, which silently flattens the ease.
 */
const MODES: Record<Mode, (delay: number) => Variants> = {
  rise: (delay) => ({
    hidden: { opacity: 0, y: 46 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }),
  mask: (delay) => ({
    hidden: { clipPath: 'inset(0 0 100% 0)', y: 24 },
    visible: {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      transition: { duration: 1, delay, ease: [0.76, 0, 0.24, 1] },
    },
  }),
  blur: (delay) => ({
    // See the note in SplitText: the blur belongs in the keyframes, not in the
    // waiting state. A transparent element's blur cannot be seen and still costs
    // a layer, and these variants are applied to whole grids of cards.
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      filter: ['blur(14px)', 'blur(0px)'],
      scale: 1,
      transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }),
  flip: (delay) => ({
    hidden: { opacity: 0, rotateY: -62, transformPerspective: 1200 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transformPerspective: 1200,
      transition: { duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }),
  iris: (delay) => ({
    hidden: { clipPath: 'circle(0% at 50% 50%)', opacity: 0.4 },
    visible: {
      clipPath: 'circle(120% at 50% 50%)',
      opacity: 1,
      transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }),
  facet: (delay) => ({
    hidden: { opacity: 0, scale: 0.86, rotate: -4 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: ['blur(8px)', 'blur(0px)'],
      transition: { type: 'spring', stiffness: 150, damping: 18, mass: 0.9, delay },
    },
  }),
};

/**
 * Reveals a set of siblings in a chosen sequence with a chosen entrance.
 *
 * This exists because the same twelve-line `whileInView` block was being
 * rewritten in every grid on the site and the timings had drifted apart between
 * them. One component means one rhythm.
 *
 * `order` matters as much as `mode`: a centre-out grid reads as opening and an
 * edges-in grid reads as closing, from exactly the same entrance variant.
 */
export default function StaggerReveal({
  children,
  className = '',
  mode = 'rise',
  order = 'forward',
  stagger = 0.085,
  delay = 0,
  as = 'div',
  once = true,
  itemClassName = '',
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-10%' });
  const items = Children.toArray(children);
  const n = items.length;

  const delayFor = (i: number) => {
    switch (order) {
      case 'reverse':
        return delay + (n - 1 - i) * stagger;
      case 'centre': {
        const mid = (n - 1) / 2;
        return delay + Math.abs(i - mid) * stagger;
      }
      case 'edges': {
        const mid = (n - 1) / 2;
        return delay + (mid - Math.abs(i - mid)) * stagger;
      }
      default:
        return delay + i * stagger;
    }
  };

  const Item = motion[as];

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <Item
          key={i}
          variants={MODES[mode](delayFor(i))}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className={itemClassName}
        >
          {child}
        </Item>
      ))}
    </div>
  );
}
