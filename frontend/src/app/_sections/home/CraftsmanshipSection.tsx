'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const STAGES = [
  {
    title: 'Design Sketch',
    description:
      'Every masterpiece begins with a vision. Our master designers translate inspiration into intricate sketches, capturing the essence of the final creation.',
    image: '/images/hero/craftsmanship.jpg',
    detail: 'Graphite on vellum · 40+ hours',
  },
  {
    title: 'Wax Modeling',
    description:
      'Precision meets artistry in every curve. The 2D design is painstakingly sculpted into a 3D wax model, ensuring perfect proportions before casting.',
    image: '/images/collections/bridal.jpg',
    detail: 'Hand-carved · 0.1mm tolerance',
  },
  {
    title: 'Gold Casting',
    description:
      'Ancient techniques, modern perfection. Molten gold is poured into the mould, a transformative moment where precious metal takes its eternal shape.',
    image: '/images/collections/heritage.jpg',
    detail: '22K & 24K · 1064°C',
  },
  {
    title: 'Stone Setting',
    description:
      'Each gem placed with surgical precision. Our master setters secure every diamond and gemstone by hand, maximising brilliance and security.',
    image: '/images/collections/statement.jpg',
    detail: 'Microscope-assisted · GIA graded',
  },
  {
    title: 'Final Polish',
    description:
      'Revealing the brilliance within. Hours of meticulous hand-polishing bring forth the signature AURUM mirror finish that lasts a lifetime.',
    image: '/images/products/ring.jpg',
    detail: 'Seven-stage finish · Mirror bright',
  },
];

export default function CraftsmanshipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });

  // Five panels: the track travels four viewport widths.
  const x = useTransform(smooth, [0, 1], ['0%', `-${(STAGES.length - 1) * (100 / STAGES.length)}%`]);
  const progressWidth = useTransform(smooth, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const unsub = smooth.on('change', (v) => {
      setActiveStage(Math.min(STAGES.length - 1, Math.round(v * (STAGES.length - 1))));
    });
    return () => unsub();
  }, [smooth]);

  return (
    <section id="craftsmanship" className="relative bg-canvas">
      <div className="px-6 pb-12 pt-24 md:pt-32">
        <SectionHeading
          eyebrow="The Atelier"
          title="The Art of Creation"
          highlightWords={['Art']}
          subtitle="Five stages, hundreds of hours, and four generations of accumulated skill behind every piece that leaves our workshop."
          align="center"
        />
      </div>

      {/* Scroll-driven horizontal gallery */}
      <div ref={containerRef} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className="relative z-10 flex h-full items-center"
            // One panel per stage, each exactly one viewport wide.
          >
            {STAGES.map((stage, idx) => (
              <div
                key={stage.title}
                className="flex h-full w-screen flex-col items-center justify-center gap-8 p-6 md:flex-row md:p-12 lg:gap-16 lg:p-24"
              >
                {/* Plate */}
                <motion.div
                  initial={{ opacity: 0.4, scale: 0.94 }}
                  animate={{
                    opacity: activeStage === idx ? 1 : 0.45,
                    scale: activeStage === idx ? 1 : 0.94,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-[38vh] w-full overflow-hidden rounded-2xl shadow-lift md:h-[62vh] md:w-1/2"
                >
                  <Image
                    src={stage.image}
                    alt={stage.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-gold-500/25" />

                  {/* Stage caption on the plate */}
                  <span className="absolute bottom-5 left-5 font-accent text-[10px] uppercase tracking-luxer text-gold-200">
                    {stage.detail}
                  </span>
                </motion.div>

                {/* Copy */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{
                    opacity: activeStage === idx ? 1 : 0.3,
                    x: activeStage === idx ? 0 : 30,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-xl md:w-1/2"
                >
                  <span className="block font-display text-7xl font-light leading-none text-accent/25 lg:text-8xl">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="-mt-6 font-display text-4xl text-primary lg:text-5xl">
                    {stage.title}
                  </h3>
                  <span className="my-5 block h-px w-14 bg-accent" />
                  <p className="font-sans text-base font-light leading-relaxed text-muted lg:text-lg">
                    {stage.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Progress rail */}
          <div className="absolute inset-x-12 bottom-10 z-20 md:inset-x-24">
            <div className="relative h-px bg-line">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold-700 via-gold-400 to-gold-300"
                style={{ width: progressWidth }}
              />

              <div className="absolute inset-x-0 -top-3 flex justify-between">
                {STAGES.map((stage, i) => {
                  const reached = i <= activeStage;
                  return (
                    <span
                      key={stage.title}
                      className="group relative flex h-6 w-6 items-center justify-center"
                      aria-current={i === activeStage ? 'step' : undefined}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border bg-canvas transition-all duration-500 ${
                          reached ? 'border-gold-400' : 'border-line-strong'
                        }`}
                      >
                        <span
                          className={`block rounded-full transition-all duration-500 ${
                            i === activeStage
                              ? 'h-2.5 w-2.5 bg-gold-300 shadow-[0_0_10px_2px_rgb(var(--gold-400)/0.7)]'
                              : reached
                                ? 'h-1.5 w-1.5 bg-gold-500'
                                : 'h-1.5 w-1.5 bg-line-strong'
                          }`}
                        />
                      </span>
                      <span
                        className={`absolute -top-7 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe transition-opacity duration-300 ${
                          i === activeStage ? 'text-accent opacity-100' : 'opacity-0'
                        }`}
                      >
                        {stage.title}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
