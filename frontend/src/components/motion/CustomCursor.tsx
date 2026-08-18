'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Two-part pointer: a small gold bead that tracks exactly, and a lagging
 * ring that swells over interactive elements. Fine pointers only — touch
 * devices and reduced-motion users keep the native cursor.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<'default' | 'link' | 'view' | 'text'>('default');
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 900, damping: 42, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 42, mass: 0.2 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);

    // Hide the OS pointer only once ours is actually mounted, so a failed
    // mount never leaves the page with no cursor at all.
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        'a, button, [role="button"], input, textarea, select, [data-cursor]'
      );

      if (!el) {
        setVariant('default');
        setLabel('');
        return;
      }

      const custom = el.getAttribute('data-cursor');
      if (custom) {
        setVariant('view');
        setLabel(custom);
        return;
      }
      if (el.matches('input, textarea, select')) {
        setVariant('text');
        setLabel('');
        return;
      }
      setVariant('link');
      setLabel('');
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringSize = variant === 'view' ? 84 : variant === 'link' ? 52 : variant === 'text' ? 4 : 34;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] hidden lg:block" aria-hidden="true">
      {/* Lagging ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0"
      >
        <motion.div
          animate={{
            width: ringSize,
            height: variant === 'text' ? 30 : ringSize,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.82 : 1,
            borderRadius: variant === 'text' ? 2 : 999,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="-translate-x-1/2 -translate-y-1/2 border border-gold-400/70 bg-gold-500/[0.06] backdrop-blur-[1px] flex items-center justify-center"
        >
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-accent text-[9px] uppercase tracking-luxe text-gold-200"
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Tracking bead */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute left-0 top-0"
      >
        <motion.div
          animate={{
            opacity: visible && variant !== 'view' ? 1 : 0,
            scale: pressed ? 1.6 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_12px_2px_rgb(var(--gold-400)/0.7)]"
        />
      </motion.div>
    </div>
  );
}
