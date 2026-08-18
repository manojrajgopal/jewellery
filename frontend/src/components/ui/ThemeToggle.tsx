'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

/**
 * Day/night switch. Clicking triggers a circular View Transition that expands
 * from the button itself, so the palette change reads as a sweep of light.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect();
    toggleTheme(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : undefined
    );
  };

  const isDark = theme === 'dark';

  return (
    <button
      ref={ref}
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-hairline transition-colors duration-300 hover:border-gold-500/40 ${className}`}
    >
      <span className="absolute inset-0 scale-0 rounded-full bg-gold-500/10 transition-transform duration-500 group-hover:scale-100" />

      {/* Before hydration both icons would be wrong half the time — render none. */}
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ y: 22, opacity: 0, rotate: -60 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -22, opacity: 0, rotate: 60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-accent"
          >
            {isDark ? <Sun size={17} strokeWidth={1.6} /> : <Moon size={17} strokeWidth={1.6} />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
