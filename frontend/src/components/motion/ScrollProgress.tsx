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
          className="absolute top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full bg-accent-soft blur-[3px]"
          style={{ left: headLeft, x: '-100%' }}
        />
      </div>

      {/* Section rail.
          The gap tightens once the list is long. At the original eighteen sections a
          1rem gap measured ~470px and always fitted; the home page now runs to
          twenty-six, which at that spacing overflows a 700px-tall window even on a
          desktop-width viewport. The height cap and the scroll are the backstop for
          anything longer still — a rail that runs off the screen loses its last
          entries silently, which is worse than one that scrolls. */}
      {showRail && (
        <nav
          aria-label="Section navigation"
          className={`scrollbar-hide fixed right-5 top-1/2 z-[90] hidden max-h-[82vh] -translate-y-1/2 flex-col items-end overflow-y-auto py-1 xl:flex ${
            sections.length > 20 ? 'gap-2.5' : 'gap-4'
          }`}
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
                {/* The rail floats over photography as well as over the page,
                    so the label carries its own plate rather than relying on
                    whatever happens to be behind it. */}
                {/* The blur is attached to the two states that can actually be
                    seen, not to all forty-nine labels. A backdrop-filter costs
                    a compositing pass whether or not the element it belongs to
                    is transparent, so a permanent `backdrop-blur-md` here was
                    forty-nine live blur layers pinned over the page for the
                    whole visit — one of the few costs on the site that scrolling
                    away from did not reduce. */}
                <span
                  className={`rounded-full px-2 py-0.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                    active
                      ? 'chrome-tint-scrolled text-accent opacity-100 backdrop-blur-md'
                      : 'chrome-tint text-secondary opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md'
                  }`}
                >
                  {s.label}
                </span>
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      active
                        ? 'h-2.5 w-2.5 bg-accent shadow-[0_0_10px_2px_rgb(var(--accent)/0.6)]'
                        : 'h-1.5 w-1.5 bg-line-strong group-hover:bg-accent'
                    }`}
                  />
                  {active && (
                    <span className="absolute inline-flex h-2.5 w-2.5 animate-scale-pulse rounded-full bg-accent/60" />
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
