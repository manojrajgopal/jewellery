'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import RarityMeter from '@/components/ui/RarityMeter';
import MorphGemPath, { GEM_SHAPES } from '@/components/motion/MorphGemPath';
import JewellerLoupe from '@/components/motion/JewellerLoupe';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ParticleField from '@/components/motion/ParticleField';
import { gems } from '@/data/gems';

/** Four stones that between them cover the whole hardness range. */
const FEATURED = ['diamond', 'emerald', 'sapphire', 'pearl'];

/**
 * The stone library, condensed to the one question it answers: can I wear this
 * every day?
 *
 * The full library lives on its own page with twelve stones and three axes. Here it is
 * four stones chosen to span the hardness scale from 10 down to 2.75, because the span
 * is the insight — a customer who learns that pearl and diamond are both "precious" and
 * three hundred times apart in scratch resistance has learned the useful thing.
 *
 * The cut morph and the loupe sit either side of it: one shows what cutting decides,
 * the other shows the magnification the grades were written at.
 */
export default function StoneLibrarySection() {
  const [cut, setCut] = useState(0);

  const featured = FEATURED.map((id) => gems.find((g) => g.id === id)).filter(Boolean) as typeof gems;

  return (
    <section id="stones" className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
      <CausticsCanvas intensity={0.3} lobes={6} speed={32} />
      <ParticleField count={24} rise />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The Stone Itself"
          title="Hardness is the only question that matters"
          highlightWords={['Hardness']}
          subtitle="Colour and clarity are what a report leads with. Whether a stone survives being worn is decided by one number, and these four span almost the whole scale."
          align="center"
          className="mb-16"
        />

        {/* ---- Four stones, spanning the scale ---- */}
        <div className="mb-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((gem, i) => {
            const wear =
              gem.hardness >= 8
                ? { label: 'Daily wear', tone: 'text-jade-300' }
                : gem.hardness >= 7
                  ? { label: 'Daily with care', tone: 'text-accent' }
                  : { label: 'Protected setting', tone: 'text-burgundy-300' };

            return (
              <motion.article
                key={gem.id}
                initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-gold-500/35"
              >
                <span
                  aria-hidden="true"
                  className="facet-fan pointer-events-none absolute -right-8 -top-8 h-32 w-32 animate-conic-spin-slow rounded-full opacity-20"
                />

                <span
                  aria-hidden="true"
                  className={`relative mb-5 block h-16 w-16 bg-gradient-to-br ${gem.swatch} ${gem.cut} shadow-[0_8px_22px_-8px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110`}
                />

                <h3 className="relative font-display text-xl font-light text-primary">
                  {gem.name}
                </h3>

                {/* The number, set large — it is the whole point of the card */}
                <p className="nums-tabular relative mt-3 font-display text-4xl leading-none text-accent">
                  {gem.hardness}
                  <span className="ml-1.5 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    Mohs
                  </span>
                </p>

                <p
                  className={`relative mt-3 flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe ${wear.tone}`}
                >
                  <span aria-hidden="true" className="block h-1 w-1 rotate-45 bg-current" />
                  {wear.label}
                </p>

                <p className="relative mt-4 font-display text-sm italic leading-snug text-secondary">
                  {gem.meaning}
                </p>

                <div className="relative mt-auto pt-5">
                  <RarityMeter value={gem.rarity} />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* ---- The cut, and the loupe ---- */}
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-center">
            <MorphGemPath index={cut} size={280} caption />

            {/* Driven from here rather than autoplaying, so the section has one
                thing to do and the visitor decides when it happens. */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {GEM_SHAPES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCut(i)}
                  aria-pressed={i === cut}
                  className={`rounded-full border px-3.5 py-1.5 font-accent text-[9px] uppercase tracking-luxe transition-all duration-300 ${
                    i === cut
                      ? 'border-gold-500/60 bg-gold-500/12 text-accent'
                      : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
                  }`}
                >
                  {s.label.replace('Round ', '')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Judged At Ten Times
            </p>

            <h3 className="font-display text-2xl font-light leading-tight text-primary md:text-3xl">
              A loupe is not a way of finding fault
            </h3>

            <p className="mt-5 max-w-prose font-sans text-base font-light leading-relaxed text-muted">
              Ten magnifications is the figure the entire clarity scale is defined at. It
              is the instrument the grade was written with, which makes it the only honest
              way to check that the report and the stone describe the same object. Move
              across the parcel and look for yourself.
            </p>

            <div className="mt-8">
              <JewellerLoupe
                src="/images/collections/gemstone.jpg"
                alt="A parcel of loose stones on the sorting tray"
                zoom={2.3}
                size={170}
                readout="10×"
                aspect="16 / 10"
              />
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <CTAButton variant="primary" size="md" href="/gemstones" showArrow>
                The whole library
              </CTAButton>
              <CTAButton variant="secondary" size="md" href="/care">
                How to look after it
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
