'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import GradientOrb from '@/components/ui/GradientOrb';
import ParticleField from '@/components/motion/ParticleField';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import { testimonials } from '@/data/testimonials';

const ROTATE_MS = 7000;

/** Two initials from a full name — the data has no `initials` field. */
const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

/** Deterministic jewel tint per patron so the orbit reads as varied. */
const TINTS = [
  'bg-burgundy-700',
  'bg-jade-700',
  'bg-amethyst-700',
  'bg-ink-700',
  'bg-gold-800',
];

export default function TestimonialsSection() {
  const data = testimonials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(((next % data.length) + data.length) % data.length);
    },
    [index, data.length]
  );

  useEffect(() => {
    if (paused || data.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % data.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, data.length]);

  const active = data[index];
  if (!active) return null;

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden bg-canvas py-24 md:py-32"
    >
      <GradientOrb color="burgundy" size="lg" position="bottom-right" intensity={0.2} />
      <GradientOrb color="gold" size="md" position="top-left" intensity={0.14} />
      <CausticsCanvas intensity={0.32} lobes={6} speed={28} />
      <ParticleField count={26} rise />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Voices of Elegance"
          title="What Our Patrons Say"
          highlightWords={['Patrons']}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Orbit selector */}
          <div
            className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="absolute h-[58%] w-[58%] rounded-full border border-gold-500/15" />
              <span className="absolute h-[88%] w-[88%] rounded-full border border-gold-500/12" />
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
                className="absolute h-[88%] w-[88%] rounded-full border border-dashed border-gold-500/20"
              />
            </div>

            {/* Active avatar */}
            <div className="relative z-20 flex h-28 w-28 items-center justify-center rounded-full border border-gold-400/70 bg-canvas p-1 shadow-[0_0_40px_-8px_rgb(var(--gold-500)/0.55)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: 20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex h-full w-full items-center justify-center rounded-full font-display text-3xl text-gold-100 ${
                    TINTS[index % TINTS.length]
                  }`}
                >
                  {initialsOf(active.name)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Orbiting patrons */}
            <motion.div
              animate={{ rotate: paused ? undefined : 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              {data.map((t, i) => {
                const angle = (i / data.length) * 360;
                const radius = i % 2 === 0 ? 44 : 29;

                return (
                  <div
                    key={t.id}
                    className="absolute left-1/2 top-1/2 h-0 w-0"
                    style={{ transform: `rotate(${angle}deg) translateY(-${radius}%)` }}
                  >
                    <motion.button
                      onClick={() => go(i)}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ transform: `rotate(-${angle}deg)` }}
                      aria-label={`Read the review from ${t.name}`}
                      className={`flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border p-0.5 transition-colors duration-300 ${
                        i === index
                          ? 'border-gold-400 shadow-[0_0_18px_-2px_rgb(var(--gold-400)/0.8)]'
                          : 'border-gold-500/25 hover:border-gold-400/70'
                      }`}
                    >
                      <span
                        className={`flex h-full w-full items-center justify-center rounded-full font-display text-sm text-gold-100 ${
                          TINTS[i % TINTS.length]
                        }`}
                      >
                        {initialsOf(t.name)}
                      </span>
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Quote panel */}
          <div className="flex min-h-[340px] flex-col justify-center">
            <Quote
              className="mb-4 h-10 w-10 rotate-180 text-accent/25"
              strokeWidth={1.2}
              aria-hidden="true"
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={active.id}
                custom={direction}
                initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                <p className="mb-8 font-display text-2xl italic leading-relaxed text-primary md:text-3xl">
                  {active.quote}
                </p>

                <div className="mb-6 flex gap-1" aria-label={`Rated ${active.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 320 }}
                    >
                      <Star
                        className={`${
                          i < (active.rating ?? 5)
                            ? 'fill-gold-400 text-gold-400'
                            : 'text-line-strong'
                        }`}
                        size={18}
                      />
                    </motion.span>
                  ))}
                </div>

                <footer>
                  <cite className="not-italic">
                    <span className="block font-display text-xl text-accent-soft">
                      {active.name}
                    </span>
                    <span className="mt-1 block font-sans text-sm text-muted">
                      {active.location}
                      {active.product && (
                        <>
                          {' · '}
                          <span className="text-accent-deep">{active.product}</span>
                        </>
                      )}
                    </span>
                  </cite>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-10 flex items-center gap-4">
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous review"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-gold-500/40 hover:text-accent"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next review"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-gold-500/40 hover:text-accent"
              >
                <ChevronRight size={18} />
              </button>

              {/* Auto-rotate progress */}
              <div className="ml-2 h-px flex-1 overflow-hidden bg-line">
                <motion.div
                  key={`${index}-${paused}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused ? 0 : 1 }}
                  transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                  className="h-full origin-left bg-gradient-to-r from-gold-700 to-gold-300"
                />
              </div>

              <span className="font-sans text-xs tabular-nums tracking-luxe text-faint">
                {String(index + 1).padStart(2, '0')} / {String(data.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
