import React from 'react';

type Variant = 'default' | 'gold' | 'new' | 'bestseller';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-inter font-medium rounded-full uppercase tracking-wider';

  const variantClasses = {
    default: 'bg-white/10 text-[#c0c0c8] border border-white/10',
    gold: 'bg-[#d4a843] text-[#060504]',
    new: 'bg-[#060504] text-[#d4a843] border border-[#d4a843]/30',
    bestseller: 'bg-[#4a1528] text-[#fdf3d7] border border-[#4a1528]',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {variant === 'new' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a843] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4a843]"></span>
        </span>
      )}
      {children}
    </span>
  );
}
