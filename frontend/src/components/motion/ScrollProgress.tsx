'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * Top-edge reading indicator: a metallic bar with a travelling comet head,
 * plus a side rail of section markers that light as each one is reached.
 */
export default function ScrollProgress({
  sections = [],
  /** Route the section rail belongs to; elsewhere only the top bar shows. */
  railPath = '/',
}: {
  sections?: { id: string; label: string }[];
  railPath?: string;
}) {
  const pathname = usePathname();
  // The anchors only exist on the home page — showing the rail elsewhere
  // would render a column of dots that can never activate.
  const showRail = pathname === railPath && sections.length > 0;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const headLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!showRail) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections, showRail]);

  return (
    <>
      {/* Top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]">
        <motion.div
          className="h-full origin-left bg-metal-bar bg-size-200 animate-shimmer"
          style={{ scaleX }}
        />
        <motion.div
          className="absolute top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full bg-gold-200 blur-[3px]"
          style={{ left: headLeft, x: '-100%' }}
        />
      </div>

      {/* Section rail */}
      {showRail && (
        <nav
          aria-label="Section navigation"
          className="fixed right-5 top-1/2 z-[90] hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
        >
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-3"
                aria-current={active ? 'true' : undefined}
              >
                <span
                  className={`font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                    active
                      ? 'text-accent opacity-100'
                      : 'text-muted opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {s.label}
                </span>
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      active
                        ? 'h-2.5 w-2.5 bg-gold-400 shadow-[0_0_10px_2px_rgb(var(--gold-400)/0.6)]'
                        : 'h-1.5 w-1.5 bg-line-strong group-hover:bg-gold-600'
                    }`}
                  />
                  {active && (
                    <span className="absolute inline-flex h-2.5 w-2.5 animate-scale-pulse rounded-full bg-gold-400/60" />
                  )}
                </span>
              </a>
            );
          })}

        </nav>
      )}
    </>
  );
}
