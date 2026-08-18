import React, { ElementType } from 'react';

type Variant = 'default' | 'strong' | 'soft';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  as?: ElementType;
}

export default function GlassPanel({
  children,
  className = '',
  variant = 'default',
  as: Component = 'div',
}: GlassPanelProps) {
  const baseClasses = 'border border-t-white/5 border-x-white/5 border-b-transparent rounded-2xl';
  
  const variantClasses = {
    default: 'backdrop-blur-xl bg-[#060504]/60',
    strong: 'backdrop-blur-2xl bg-[#060504]/80',
    soft: 'backdrop-blur-md bg-[#060504]/40',
  };

  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </Component>
  );
}
