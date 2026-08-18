'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface CTAButtonProps extends Omit<HTMLMotionProps<"button">, 'size'> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}

export default function CTAButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  icon,
  showArrow = false,
  ...props
}: CTAButtonProps) {
  const baseClasses = 'relative overflow-hidden inline-flex items-center justify-center font-inter font-medium transition-colors duration-300 rounded-full group';
  
  const variantClasses = {
    primary: 'bg-[#d4a843] text-[#060504] hover:bg-[#f0d48a]',
    secondary: 'bg-transparent border border-[#d4a843] text-[#d4a843] hover:bg-[#d4a843]/10',
    ghost: 'bg-transparent text-[#d4a843] hover:text-[#f0d48a]',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const InnerContent = () => (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
        {showArrow && (
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        )}
      </span>
      <span className="absolute inset-0 z-0 overflow-hidden rounded-full">
        <span className="absolute top-0 -left-[100%] w-[150%] h-full skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-[#fdf3d7]/30 to-transparent pointer-events-none" />
      </span>
    </>
  );

  if (href) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spreadProps = props as Record<string, unknown>;
    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a
          className={combinedClasses}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...spreadProps}
        >
          <InnerContent />
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button
      className={combinedClasses}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <InnerContent />
    </motion.button>
  );
}
