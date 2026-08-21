'use client';

import { motion } from 'framer-motion';

import SectionHeading from '@/components/ui/SectionHeading';
import LiveGoldRate from '@/components/ui/LiveGoldRate';
import ImageCompare from '@/components/motion/ImageCompare';
import CountUp from '@/components/motion/CountUp';
import Marquee from '@/components/motion/Marquee';
import ValuationCalculator from '@/components/ui/ValuationCalculator';
import CertificateVerify from '@/components/ui/CertificateVerify';
import CausticsCanvas from '@/components/motion/CausticsCanvas';

const RESTORATION_STATS = [
  { label: 'Pieces restored', value: 4200, suffix: '+', separator: true },
  { label: 'Bench hours a year', value: 18000, suffix: '', separator: true },
  // A year must not be grouped — "1,904" reads as a quantity, not a date.
  { label: 'Oldest piece serviced', value: 1904, suffix: '', separator: false },
];

/**
 * The practical half of the page: today's rate, what a piece is worth, how a
 * certificate is verified, and the restoration bench shown as a before-and-after
 * they can drag.
 *
 * Ring sizing used to sit here too, but it is owned by /care (alongside the rest
 * of the fit-and-wear tools) and was removed so the same sizer never runs on two
 * pages. The remaining tools are the ledger-and-assurance kind, which is why this
 * section now lives on /vault beside the visitor's own records.
 */
export default function AtelierToolsSection() {
  return (
    <section id="tools" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      {/* Soft wash so the section separates from the plates above and below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />
      <CausticsCanvas intensity={0.3} lobes={5} speed={34} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading
          eyebrow="Everything To Hand"
          title="Rate it, value it, verify it"
          subtitle="Check the day's rate, see what a piece is worth, confirm a certificate, and watch what our restoration bench can do — the practical side, all in one place."
          highlightWords={['value', 'verify']}
          className="mb-16"
        />

        {/* ---- Rates ---- */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <LiveGoldRate />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ---- Valuation ---- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <ValuationCalculator />
          </motion.div>

          {/* ---- Restoration bench ---- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                The Restoration Bench
              </span>
              <h3 className="mt-3 font-display text-2xl font-light leading-tight text-primary md:text-3xl">
                Drag to see <span className="italic text-accent">forty years</span> come off
              </h3>
            </div>

            <ImageCompare
              beforeImage="/images/collections/heritage.jpg"
              afterImage="/images/collections/statement.jpg"
              beforeLabel="As received"
              afterLabel="After the bench"
              className="h-72 md:h-80"
            />

            <dl className="grid grid-cols-3 gap-4 border-t border-hairline pt-5">
              {RESTORATION_STATS.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-xl text-primary tabular-nums md:text-2xl">
                    <CountUp
                      end={stat.value}
                      duration={2}
                      suffix={stat.suffix}
                      separator={stat.separator}
                    />
                  </dd>
                  <dt className="mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>

        {/* ---- Verification ---- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <CertificateVerify />
        </motion.div>
      </div>

      {/* ---- Services ticker ---- */}
      <div className="relative z-10 mt-20 border-y border-hairline py-5">
        <Marquee speed="slow" pauseOnHover>
          {[
            'Re-tipping',
            'Rhodium plating',
            'Stone replacement',
            'Chain soldering',
            'Pearl restringing',
            'Antique cleaning',
            'Clasp renewal',
            'Engraving',
            'Re-sizing',
            'Valuation',
          ].map((service) => (
            <span
              key={service}
              className="mx-8 inline-flex items-center gap-8 font-accent text-sm uppercase tracking-luxe text-muted"
            >
              {service}
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent/50" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
