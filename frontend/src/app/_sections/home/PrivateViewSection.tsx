'use client';

import { motion } from 'framer-motion';
import { MapPin, Ticket, Users } from 'lucide-react';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import OccasionReminder from '@/components/ui/OccasionReminder';
import SavingsPlanner from '@/components/ui/SavingsPlanner';
import FlipClock from '@/components/motion/FlipClock';
import FoilCard from '@/components/motion/FoilCard';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import { brandData } from '@/data/brand';

/**
 * The private view, the savings plan and the date list.
 *
 * Grouped because all three are about *timing* rather than about pieces — when the doors
 * open, when the money is ready, and when the occasion falls. A visitor thinking about
 * any one of them is thinking about the other two.
 *
 * The countdown targets a fixed date rather than one computed from load time. A clock
 * counting down to "three weeks from whenever you arrived" is theatre, and a visitor who
 * reloads and sees it reset knows immediately that it is.
 */
export default function PrivateViewSection() {
  const PRIVATE_VIEW = '2026-11-14T18:00:00';

  return (
    <section
      id="private-view"
      className="relative overflow-hidden bg-canvas py-24 md:py-32"
    >
      <CausticsCanvas intensity={0.28} lobes={5} speed={36} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* ---- The invitation ---- */}
        <div className="mb-20">
          <FoilCard tilt={5} travel={80}>
            <div className="grid gap-10 p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12">
              <div>
                <p className="mb-4 flex items-center gap-2.5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                  <Ticket size={13} strokeWidth={1.8} />
                  By Invitation
                </p>

                <h2 className="text-emboss-gold font-display text-3xl font-light leading-tight md:text-4xl">
                  The whole season, on velvet, for one evening
                </h2>

                <p className="mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
                  Every plate from the lookbook laid out in the boutique, with the artisan
                  who made it standing next to it. The bench answers questions until the
                  doors close.
                </p>

                <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
                  {[
                    { icon: Users, text: 'Forty places' },
                    { icon: MapPin, text: brandData.contact.address.split(',')[0] },
                    { icon: Ticket, text: 'No obligation to buy' },
                  ].map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-faint"
                    >
                      <Icon size={11} strokeWidth={1.9} className="text-accent/70" />
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap gap-4">
                  <CTAButton variant="primary" size="md" href="/contact" showArrow>
                    Request an invitation
                  </CTAButton>
                  <CTAButton variant="secondary" size="md" href="/lookbook">
                    See what is showing
                  </CTAButton>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
                <span className="font-accent text-[9px] uppercase tracking-luxest text-faint">
                  Doors open in
                </span>
                <FlipClock to={PRIVATE_VIEW} />
                <span className="nums-tabular font-sans text-[11px] font-light italic text-faint">
                  14 November 2026 · 6pm
                </span>
              </div>
            </div>
          </FoilCard>
        </div>

        {/* ---- Timing, the practical half ---- */}
        <SectionHeading
          eyebrow="Timing"
          title="Everything here is a question about when"
          highlightWords={['when']}
          subtitle="A commission needs six weeks and engraving needs ten days. Set aside monthly, keep the dates that matter, and we will tell you what is still possible."
          align="center"
          className="mb-16"
        />

        <div className="grid gap-8">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SavingsPlanner />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <OccasionReminder />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
