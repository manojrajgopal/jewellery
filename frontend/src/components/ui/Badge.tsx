import React from 'react';

type Variant =
  | 'default'
  | 'gold'
  | 'new'
  | 'bestseller'
  | 'jade'
  | 'amethyst'
  | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Badges are pinned over product photography, which is never veiled — so they
 * keep a fixed dark plate with light type in both themes. 'new' previously used
 * bg-canvas, which turned to cream in light and left pale gold on pale cream.
 */
const VARIANTS: Record<Variant, string> = {
  default: 'bg-white/10 text-platinum border border-white/10 backdrop-blur-md',
  gold: 'bg-gradient-to-br from-gold-300 to-gold-600 text-onaccent border border-gold-200/40 shadow-gold',
  new: 'bg-ink-950/75 text-gold-200 border border-gold-500/45 backdrop-blur-md',
  bestseller: 'bg-burgundy-700 text-gold-100 border border-burgundy-500/60',
  jade: 'bg-jade-900/80 text-jade-100 border border-jade-500/40 backdrop-blur-md',
  amethyst: 'bg-amethyst-900/80 text-amethyst-300 border border-amethyst-500/40 backdrop-blur-md',
  outline: 'bg-transparent text-accent border border-accent/40',
};

export default function Badge({
  children,
  variant = 'default',
  className = '',
  icon,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-accent text-[10px] uppercase tracking-luxe transition-transform duration-300 hover:scale-105 ${VARIANTS[variant]} ${className}`}
    >
      {variant === 'new' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
}
