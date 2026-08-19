'use client';

import { motion } from 'framer-motion';
import { Award, Gem, ShieldCheck, Sparkles } from 'lucide-react';

import DiamondScene from '@/components/motion/DiamondScene';
import CircularText from '@/components/motion/CircularText';
import ScrollTextMask from '@/components/motion/ScrollTextMask';
import MagneticText from '@/components/motion/MagneticText';
import Typewriter from '@/components/motion/Typewriter';
import FlipCard from '@/components/motion/FlipCard';
import GodRays from '@/components/motion/GodRays';
import DiamondSparkles from '@/components/motion/DiamondSparkles';

const ASSURANCES = [
  {
    icon: Award,
    title: 'GIA Certified',
    detail: 'Every stone above 0.30ct ships with its own GIA report.',
    back: 'Cut, colour, clarity and carat, independently graded in Carlsbad — never in-house, never by us.',
  },
  {
    icon: ShieldCheck,
    title: 'BIS Hallmarked',
    detail: 'Six-digit HUID on every gold piece we sell.',
    back: 'Purity assayed by a BIS-licensed centre. Bring any piece back and we will re-assay it free, for life.',
  },
  {
    icon: Gem,
    title: 'Conflict-Free',
    detail: 'Kimberley Process chain of custody, documented.',
    back: 'We buy from four sightholders we have worked with for decades. Every parcel is traceable to its mine.',
  },
  {
    icon: Sparkles,
    title: 'Lifetime Care',
    detail: 'Cleaning, re-polishing and re-tipping, always free.',
    back: 'Walk in with a piece bought in 1970 and it gets the same bench time as one bought this morning.',
  },
];

/**
 * The showcase: an interactive stone the visitor can turn in their hands, with
 * the house's assurances as cards that flip to their detail.
 *
 * This is the section that earns the "cinematic" claim without a single
 * photograph — the stone is drawn, lit and rotated entirely in SVG.
 */
export default function ShowcaseSection() {
  return (
    <section
      id="showcase"
      className="gold-caustics relative overflow-hidden bg-canvas-alt py-28 md:py-40"
    >
      {/* Atmosphere */}
      <GodRays intensity="medium" originX={62} originY={-16} />
      <DiamondSparkles density={34} shape="mixed" className="z-[1]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-hairline bg-grid opacity-40"
      />
      {/* Vignette so the plate has edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_45%,rgb(var(--shadow-color)/0.22)_100%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* ---- Copy ---- */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex items-center gap-4"
            >
              <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                The Stone
              </span>
              <span className="h-px w-16 bg-gradient-to-r from-gold-400/70 to-transparent" />
            </motion.div>

            {/* Magnetic display type — the glyphs lean toward the pointer */}
            <MagneticText
              text="Light is the only material we cannot buy"
              as="h2"
              highlightWords={['Light']}
              radius={170}
              strength={20}
              className="mb-7 font-display text-4xl font-light leading-[1.03] text-primary md:text-5xl lg:text-6xl"
            />

            {/* Scroll-driven illumination: the words brighten as they are read */}
            <ScrollTextMask
              text="A stone returns exactly as much light as its geometry permits, and not a lumen more. Which is why our cutters will sacrifice a full carat of weight to gain half a degree on a pavilion angle — the market pays for size, but the eye only ever sees brilliance."
              highlightWords={['brilliance', 'geometry']}
              className="mb-9 max-w-lg font-sans text-base font-light leading-relaxed text-secondary md:text-lg"
            />

            {/* Live typewriter, cycling the three optical properties */}
            <div className="mb-10 flex items-baseline gap-3 font-accent text-sm uppercase tracking-luxe">
              <span className="text-faint">We cut for</span>
              <Typewriter
                phrases={[
                  'Fire — the spectral flash',
                  'Brilliance — the white return',
                  'Scintillation — the play of light',
                ]}
                speed={48}
                hold={2400}
                className="text-accent"
              />
            </div>

            {/* ---- Assurance cards, which flip to their detail ---- */}
            <div className="grid gap-4 sm:grid-cols-2">
              {ASSURANCES.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.09,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-40"
                  >
                    <FlipCard
                      className="h-full"
                      trigger="hover"
                      label={`${item.title} — turn for detail`}
                      front={
                        <div className="glass flex h-full flex-col justify-between p-5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/25 text-accent">
                            <Icon size={15} strokeWidth={1.7} />
                          </span>
                          <div>
                            <h3 className="font-accent text-xs uppercase tracking-luxe text-primary">
                              {item.title}
                            </h3>
                            <p className="mt-1.5 font-sans text-[11px] font-light leading-relaxed text-muted">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      }
                      back={
                        <div className="flex h-full flex-col justify-center rounded-2xl border border-gold-500/25 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 p-5">
                          <p className="font-sans text-[11px] font-light leading-relaxed text-cream-100">
                            {item.back}
                          </p>
                          <span className="mt-3 font-accent text-[9px] uppercase tracking-luxer text-gold-400">
                            {item.title}
                          </span>
                        </div>
                      }
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ---- The stone ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.86, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Certificate seal, rotating around the stone. Absolutely
                positioned by its wrapper rather than by overriding the
                component's own layout classes. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex"
            >
              <CircularText text="Aurum · Certified · Since 1892" size={430} duration={52} />
            </div>

            <DiamondScene size={340} satellites={3} className="relative z-10" />

            {/* Readout beneath, styled as a grading report */}
            <motion.dl
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="hud absolute -bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-6 rounded-full px-6 py-3"
            >
              {[
                { k: 'Cut', v: 'Excellent' },
                { k: 'Colour', v: 'D' },
                { k: 'Clarity', v: 'VVS1' },
              ].map((row) => (
                <div key={row.k} className="text-center">
                  <dt className="font-accent text-[8px] uppercase tracking-luxer text-faint">
                    {row.k}
                  </dt>
                  <dd className="mt-0.5 font-display text-sm text-accent">{row.v}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
