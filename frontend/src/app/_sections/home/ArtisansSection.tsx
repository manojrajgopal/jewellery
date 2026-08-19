'use client';

import { motion } from 'framer-motion';

import CTAButton from '@/components/ui/CTAButton';
import ArtisanRoster from '@/components/ui/ArtisanRoster';
import CountUp from '@/components/motion/CountUp';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import { artisans } from '@/data/atelier';

/**
 * The bench, by name.
 *
 * The figure that carries this section is the total years at the bench, summed from the
 * roster rather than written as a round number. It comes to 172 across six people, which
 * is a more persuasive claim than "over a century of experience" precisely because it is
 * arithmetic anyone can check against the names underneath.
 */
export default function ArtisansSection() {
  const totalYears = artisans.reduce((sum, a) => sum + a.years, 0);
  const generations = new Set(artisans.map((a) => a.generation)).size;
  const disciplines = new Set(artisans.map((a) => a.discipline)).size;

  return (
    <section id="artisans" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <CausticsCanvas intensity={0.26} lobes={5} speed={36} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              The Bench, By Name
            </p>

            <ScrollAssembleText
              text="One hundred and seventy-two years, six people"
              as="h2"
              highlightWords={['six']}
              spread={72}
              className="max-w-2xl font-display text-3xl font-light leading-[1.1] text-primary sm:text-4xl md:text-5xl"
            />

            <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
              Every piece carries the mark of the person who finished it, struck inside
              alongside the hallmark. These are the marks.
            </p>
          </div>

          {/* Summed from the roster, so the figure cannot drift out of step with it */}
          <dl className="grid grid-cols-3 gap-7 border-t border-hairline pt-6 lg:border-0 lg:pt-0">
            {[
              { k: 'Years at the bench', v: totalYears, s: '' },
              { k: 'Generations', v: generations, s: '' },
              { k: 'Disciplines', v: disciplines, s: '' },
            ].map((row) => (
              <div key={row.k}>
                <dd className="nums-tabular font-display text-3xl text-accent md:text-4xl">
                  <CountUp end={row.v} duration={2} suffix={row.s} />
                </dd>
                <dt className="mt-1.5 font-accent text-[9px] uppercase tracking-luxe text-faint">
                  {row.k}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <ArtisanRoster />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-hairline pt-10"
        >
          <p className="max-w-xl font-display text-lg italic leading-snug text-secondary">
            &ldquo;The goal is that nobody can tell I was here. If the repair is visible, I
            have failed twice.&rdquo;
            <span className="mt-2 block font-sans text-[11px] font-light not-italic text-faint">
              Joseph Fernandes · Restoration Bench · 36 years
            </span>
          </p>

          <div className="flex flex-wrap gap-4">
            <CTAButton variant="primary" size="md" href="/craftsmanship" showArrow>
              Inside the atelier
            </CTAButton>
            <CTAButton variant="secondary" size="md" href="/journal/four-generations-one-bench">
              The bench itself
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
