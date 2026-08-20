'use client';

import { CalendarCheck, DoorOpen, Users } from 'lucide-react';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import HoverPeelCard from '@/components/motion/HoverPeelCard';
import SilkWave from '@/components/motion/SilkWave';
import GodRays from '@/components/motion/GodRays';

/**
 * Three ways in, each with the constraint that makes it real on the sheet
 * underneath. The constraint is the persuasive part: "up to four people, Saturdays
 * only, because the bench cannot take more" is a far better invitation than
 * "book your exclusive experience today".
 */
const WAYS = [
  {
    icon: DoorOpen,
    kicker: 'No appointment',
    title: 'Walk in and be left alone',
    detail:
      'The cases are open to anyone during boutique hours, and nobody will approach you for the first ten minutes. If you want an advisor, catch an eye — that is the whole system, and it is deliberate.',
  },
  {
    icon: Users,
    kicker: 'Saturday mornings',
    title: 'Stand at the front bench',
    detail:
      'One artisan works where you can watch and interrupt. Four people at a time, because a fifth cannot see the work — and the work slows to about a third of normal speed, which is why it is only three hours a week.',
  },
  {
    icon: CalendarCheck,
    kicker: 'By arrangement',
    title: 'The room after hours',
    detail:
      'The boutique to yourselves with an advisor and a gemmologist, and whatever you asked for brought out of the safe. The bench is closed, so anything technical is answered on the Monday.',
  },
] as const;

/**
 * The invitation to come in.
 *
 * The site's own appointment form is further down and asks for a date; the
 * boutique block gives an address. Neither answers the question a visitor actually
 * has at this point in the page, which is "what would I be walking into". So this
 * is three specific descriptions of the room, each hiding its own constraint under
 * a lifted corner — read the front and it is an invitation, lift it and it is a
 * schedule.
 *
 * The full diary lives on its own page rather than here. A twenty-one-day
 * availability grid at this point would stop the page dead; this section's job is
 * to make somebody want to open it.
 */
export default function ExperienceInviteSection() {
  return (
    <section
      id="experiences"
      className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32"
    >
      <GodRays />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="In Person"
              title="What you would be walking into"
              highlightWords={['walking']}
              subtitle="Three ways in, and the constraint on each one. Lift a corner to read what it actually involves."
            />

            <div className="mt-12 space-y-5">
              {WAYS.map((w) => {
                const Icon = w.icon;
                return (
                  <HoverPeelCard
                    key={w.title}
                    className="min-h-[9.5rem]"
                    corner={{ rest: 22, open: 130 }}
                    from="top-right"
                    underside={
                      <p className="max-w-md font-sans text-sm font-light leading-relaxed text-secondary">
                        {w.detail}
                      </p>
                    }
                  >
                    <div className="flex items-start gap-4 p-6">
                      <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                          {w.kicker}
                        </span>
                        <h3 className="mt-1 font-display text-2xl leading-tight text-primary">
                          {w.title}
                        </h3>
                      </div>
                    </div>
                  </HoverPeelCard>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <CTAButton variant="primary" href="/experiences" size="md" showArrow>
                See the diary
              </CTAButton>
              <CTAButton variant="ghost" href="/vault" size="md">
                Or take your list with you
              </CTAButton>
            </div>
          </div>

          {/* The cloth coming off a tray — the first thing that happens when you
              are shown something here. */}
          <div>
            <SilkWave
              src="/images/hero/craftsmanship.jpg"
              alt="A tray uncovered at the front bench"
              ratio={3 / 4}
              panels={12}
              className="rounded-3xl border border-hairline shadow-lift"
            />
            <p className="mt-4 font-accent text-[10px] uppercase tracking-luxer text-faint">
              The cloth comes off once, and then we leave you with it
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
