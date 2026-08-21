'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

  /**
   * A plain vertical run of the five stages.
   *
   * This section used to be a pinned, scroll-driven horizontal stepper: it took
   * over the wheel to advance exactly one stage per gesture. That mechanism
   * fought the page's scrolling — it could trap the visitor on the last card and
   * auto-advance on the smallest movement — so it was replaced with an ordinary
   * stacked layout. Every stage, its plate, number, detail and copy are kept
   * exactly as before; only the scroll hijacking is gone, so the section now
   * scrolls at the same 1:1 speed as the rest of the page and each stage simply
   * fades up as it is reached.
   */
  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 40 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-15%' },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

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

      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-24 md:gap-28 md:px-12 md:pb-32">
        {STAGES.map((stage, idx) => (
          <div
            key={stage.title}
            className={`flex flex-col gap-8 md:items-center lg:gap-16 ${
              idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
            }`}
          >
            {/* Plate */}
            <motion.div
              {...reveal()}
              className="relative h-[42vh] w-full overflow-hidden rounded-2xl shadow-lift md:h-[60vh] md:w-1/2"
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
              <span className="absolute bottom-5 left-5 font-accent text-[10px] uppercase tracking-luxer text-gold-200">
                {stage.detail}
              </span>
            </motion.div>

            {/* Copy */}
            <motion.div
              {...reveal(0.1)}
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
      </div>
    </section>
  );
}
