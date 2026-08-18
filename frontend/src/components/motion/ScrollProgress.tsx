'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-gradient-to-r from-gold-700 via-gold-400 to-gold-300"
      style={{ scaleX }}
    >
      <div className="absolute right-0 top-0 h-full w-[20px] shadow-[0_0_10px_2px_rgba(212,168,67,0.8)]" />
    </motion.div>
  );
}
