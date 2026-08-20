'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Aperture, Rainbow, Sun } from 'lucide-react';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import PrismDispersion from '@/components/motion/PrismDispersion';
import KaleidoscopeGem from '@/components/motion/KaleidoscopeGem';
import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import { ease, gridCell, gridDelay, springs } from '@/lib/motion';

/**
 * The three things light does inside a cut stone, and the word the trade uses for
 * each. Together they are the reason two stones with identical certificates can
 * look nothing alike across a room, which is the argument of the section.
 */
const BEHAVIOURS = [
  {
    id: 'brilliance',
    icon: Sun,
    term: 'Brilliance',
    plain: 'White light coming straight back',
    body:
      'Light entering the table, bouncing off two pavilion facets and leaving the way it came. It is the only one of the three a photograph reliably captures, which is why online stones all look the same.',
    source: '/images/products/ring.jpg',
    segments: 10,
  },
  {
    id: 'fire',
    icon: Rainbow,
    term: 'Fire',
    plain: 'White light split into colour',
    body:
      'Dispersion. The stone works as a prism, and the spectrum leaves at a different angle from the white light — so fire is only visible when the stone, the light and your eye are in three different places. Move, and it appears.',
    source: '/images/collections/gemstone.jpg',
    segments: 14,
  },
  {
    id: 'scintillation',
    icon: Aperture,
    term: 'Scintillation',
    plain: 'The flashing as it moves',
    body:
      'The pattern of light and dark as the stone turns. It is a function of how many facets there are and how they are arranged, and it is the single thing that makes a stone look alive on a hand rather than set into it.',
    source: '/images/collections/statement.jpg',
    segments: 18,
  },
] as const;

/**
 * A study of light, before the section that grades it.
 *
 * The 4Cs section further down the page teaches the grading vocabulary, and the
 * stone showcase turns a drawn diamond. Neither explains the physics, and the
 * physics is what a customer is actually looking at when they say one stone is
 * "brighter" than another with the same certificate.
 *
 * So this is three optical behaviours, each with the plain-English version beside
 * the trade term, and each illustrated by the same photograph seen through a
 * different number of kaleidoscope mirrors — a real optical construction rather
 * than a decorative one. Selecting a behaviour changes both the mirrors and the
 * prism's angle of incidence, so the whole section is one instrument with three
 * settings rather than three cards in a row.
 */
export default function LightStudySection() {
  const [active, setActive] = useState<(typeof BEHAVIOURS)[number]['id']>('fire');
  const current = BEHAVIOURS.find((b) => b.id === active) ?? BEHAVIOURS[1];

  return (
    <section id="light" className="relative overflow-hidden bg-canvas-alt">
      <CinematicLetterbox slate="A Study In Light" slateNote="Three behaviours, one stone" barHeight={0.09}>
        <div className="relative py-24 md:py-32">
          {/* The prism's origin follows the selected behaviour: brilliance comes
              straight back, fire fans wide, scintillation sits high and narrow. */}
          <PrismDispersion
            at={
              active === 'brilliance'
                ? { x: 0.2, y: 0.3 }
                : active === 'fire'
                  ? { x: 0.32, y: 0.52 }
                  : { x: 0.26, y: 0.7 }
            }
            size={active === 'fire' ? 220 : 160}
            rays={active === 'fire' ? 42 : 26}
          />

          <div className="relative mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="Before The Grades"
              title="Two stones, one certificate, nothing alike"
              highlightWords={['nothing']}
              subtitle="Grading measures what a stone is. This is what it does — the three things light can do once it is inside a cut, and the only one of them a photograph can carry."
            />

            <div className="mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
              {/* The instrument */}
              <div className="mx-auto w-full max-w-xs">
                <KaleidoscopeGem
                  key={current.id}
                  src={current.source}
                  segments={current.segments}
                  spin={active === 'scintillation' ? 16 : 6}
                  caption={`${current.segments} mirrors`}
                  className="w-full"
                />
                <p className="mt-4 text-center font-sans text-[11px] font-light leading-relaxed text-faint">
                  Move the pointer across it. Distance from the centre zooms the source; angle
                  turns the barrel.
                </p>
              </div>

              {/* The three settings */}
              <div className="space-y-4">
                {BEHAVIOURS.map((b, i) => {
                  const on = b.id === active;
                  const Icon = b.icon;
                  return (
                    <motion.button
                      key={b.id}
                      type="button"
                      onClick={() => setActive(b.id)}
                      variants={gridCell}
                      custom={gridDelay(i, 1, BEHAVIOURS.length, 'top-left', 0.09)}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover={{ x: 6, transition: springs.plate }}
                      aria-pressed={on}
                      className={`prism-edge block w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 md:p-6 ${
                        on
                          ? 'border-accent/50 bg-surface-raised/80'
                          : 'border-hairline bg-surface-raised/35 hover:border-accent/30'
                      }`}
                    >
                      <span className="relative flex items-start gap-4">
                        <span
                          className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border ${
                            on
                              ? 'border-accent/60 bg-accent/12 text-accent'
                              : 'border-hairline text-muted'
                          }`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block font-display text-2xl leading-tight ${
                              on ? 'text-spectral' : 'text-primary'
                            }`}
                          >
                            {b.term}
                          </span>
                          <span className="mt-0.5 block font-accent text-[10px] uppercase tracking-luxe text-accent">
                            {b.plain}
                          </span>
                          <motion.span
                            initial={false}
                            animate={{ opacity: on ? 1 : 0.62 }}
                            transition={{ duration: 0.4, ease: ease.luxury }}
                            className="mt-2 block font-sans text-sm font-light leading-relaxed text-secondary"
                          >
                            {b.body}
                          </motion.span>
                        </span>
                      </span>
                    </motion.button>
                  );
                })}

                <div className="flex flex-wrap gap-4 pt-4">
                  <CTAButton variant="secondary" href="/gemstones" size="sm" showArrow>
                    The stone library
                  </CTAButton>
                  <CTAButton variant="ghost" href="#stone-school" size="sm">
                    Then grade one yourself
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CinematicLetterbox>
    </section>
  );
}
