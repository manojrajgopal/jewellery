'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Route change choreography: three gold-tinted panels sweep across the
 * viewport while the incoming page fades up beneath them.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} className="relative">
        {/* Sweeping panels */}
        <motion.div
          className="pointer-events-none fixed inset-0 z-[130] flex"
          initial={{ pointerEvents: 'auto' }}
          animate={{ pointerEvents: 'none' }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-full flex-1 bg-canvas"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              style={{ originY: 0 }}
              transition={{
                duration: 0.75,
                delay: i * 0.07,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
