'use client';

import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost' | 'jewel' | 'outline-light';
type Size = 'sm' | 'md' | 'lg';

interface CTAButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: React.ReactNode;
  showArrow?: boolean;
  className?: string;
  /** Lean toward the pointer while hovered. */
  magnetic?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-onaccent shadow-gold hover:shadow-gold-lg border border-transparent',
  secondary:
    'bg-transparent border border-accent/60 text-accent hover:border-accent hover:bg-accent/10',
  ghost: 'bg-transparent text-accent hover:text-accent-soft border border-transparent',
  jewel:
    'text-gold-100 border border-gold-500/30 bg-gradient-to-br from-burgundy-700 via-burgundy-900 to-ink-950 shadow-lift',
  'outline-light':
    'bg-transparent border border-white/40 text-white hover:border-white hover:bg-white/10',
};

const SIZES: Record<Size, string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-7 py-3 text-sm',
  lg: 'px-9 py-4 text-base',
};

interface Ripple {
  id: number;
  x: number;
  y: number;
}

let rippleId = 0;

/**
 * The site's primary action. Layers a magnetic lean, a sheen sweep, an
 * expanding click ripple, and a nudging arrow — all of which degrade to a
 * plain accessible button when motion is reduced.
 */
export default function CTAButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  icon,
  showArrow = false,
  magnetic = true,
  ...props
}: CTAButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const base =
    'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-accent uppercase tracking-luxe transition-[color,background-color,border-color,box-shadow] duration-300 select-none';
  const classes = `${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const handleMove = (e: React.MouseEvent) => {
    if (!magnetic) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.22,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.22,
    });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const spawnRipple = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const id = ++rippleId;
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  const Inner = (
    <>
      <span className="relative z-20 flex items-center gap-2">
        {icon}
        {children}
        {showArrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
        )}
      </span>

      {/* Sheen sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-gold-100/35 to-transparent transition-transform duration-[900ms] ease-luxury group-hover:translate-x-full"
      />

      {/* Click ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden="true"
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-30"
        />
      ))}
    </>
  );

  const motionProps = {
    animate: { x: offset.x, y: offset.y },
    transition: { type: 'spring' as const, stiffness: 260, damping: 18, mass: 0.4 },
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.96 },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
  };

  if (href) {
    const spreadProps = props as Record<string, unknown>;
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          onClick={(e) => {
            spawnRipple(e);
            (onClick as unknown as React.MouseEventHandler)?.(e);
          }}
          {...(spreadProps as Record<string, never>)}
        >
          {Inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      onClick={(e) => {
        spawnRipple(e);
        onClick?.(e);
      }}
      {...motionProps}
      {...props}
    >
      {Inner}
    </motion.button>
  );
}
