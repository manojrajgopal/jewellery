'use client';

import { Ear, Eye, Footprints, Hand } from 'lucide-react';

import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import ExperienceBooker from '@/components/ui/ExperienceBooker';
import AtelierLiveStatus from '@/components/ui/AtelierLiveStatus';

import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import VaultDoorReveal from '@/components/motion/VaultDoorReveal';
import SilkWave from '@/components/motion/SilkWave';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import PrismDispersion from '@/components/motion/PrismDispersion';
import HoverPeelCard from '@/components/motion/HoverPeelCard';
import MoltenPour from '@/components/motion/MoltenPour';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import RippleGrid from '@/components/motion/RippleGrid';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import StageSweep from '@/components/motion/StageSweep';
import SmokeVeil from '@/components/motion/SmokeVeil';
import BokehDrift from '@/components/motion/BokehDrift';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import VertigoZoom from '@/components/motion/VertigoZoom';
import EchoTrailText from '@/components/motion/EchoTrailText';

/**
 * The four senses a visit uses, and what each one gets. Written as sensory claims
 * rather than as a feature list, because the argument for coming in person is that
 * a screen only carries one of the four.
 */
const SENSES = [
  {
    icon: Eye,
    title: 'What you see',
    front: 'Fire, not sparkle',
    body:
      'A stone photographed under a lightbox returns white light. Under the boutique spots it returns colour — and which colours, and how far across the room, is the whole difference between two stones of the same grade.',
  },
  {
    icon: Hand,
    title: 'What you feel',
    front: 'Weight, and the edge of a setting',
    body:
      'Nobody can guess the weight of a 22K bangle from a photograph. It is the first thing every visitor comments on, and the reason chain thickness is chosen at the counter rather than online.',
  },
  {
    icon: Ear,
    title: 'What you hear',
    front: 'A clasp closing correctly',
    body:
      'A good box clasp makes one sound, once. A tired one makes two. It is the cheapest quality test in the trade, and you cannot run it through a screen.',
  },
  {
    icon: Footprints,
    title: 'Where you stand',
    front: 'Four feet from the bench',
    body:
      'The setters work with a 1.2mm cutter under a scope. Standing beside that for ten minutes explains the price of hand-setting better than any paragraph we could write about it.',
  },
] as const;

/**
 * The experiences page.
 *
 * The site can do everything except the one thing that actually sells jewellery,
 * which is putting a piece in somebody's hand. So this page is built as an argument
 * for the journey rather than as a booking form with copy around it: the senses
 * first (what a screen cannot carry), then the room as it is working right now, then
 * the diary.
 *
 * The vault scene is placed *before* the diary deliberately. It is the page's one
 * long mechanism, and putting a mechanism between the argument and the form gives
 * the visitor a beat to decide in — a booking form immediately under a persuasive
 * paragraph reads as a sales funnel.
 */
export default function ExperiencesClient() {
  return (
    <>
      <PageBanner
        title="Come and Stand In It"
        subtitle="Four ways into the room the photographs were taken in"
        breadcrumbs={[{ label: 'Experiences' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      <div className="overflow-hidden bg-canvas">
        {/* ---- Opening: the argument, letterboxed ---- */}
        <CinematicLetterbox slate="Reel One · The Room" slateNote="Interior, morning">
          <section className="relative py-20 md:py-28">
            <PrismDispersion at={{ x: 0.24, y: 0.4 }} size={150} />
            <div className="relative mx-auto max-w-6xl px-6">
              <SectionHeading
                eyebrow="Why Come In"
                title="A screen carries one sense out of four"
                highlightWords={['one']}
                subtitle="Everything below is a thing this website cannot do, listed honestly. Lift a corner to read the rest of each one."
              />

              <div className="mt-14 grid gap-5 sm:grid-cols-2">
                {SENSES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <HoverPeelCard
                      key={s.title}
                      className="min-h-[13rem]"
                      underside={
                        <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                          {s.body}
                        </p>
                      }
                    >
                      <div className="p-6 md:p-8">
                        <span className="grid h-11 w-11 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="mt-4 font-display text-2xl text-primary">{s.title}</h3>
                        <p className="mt-2 font-accent text-[11px] uppercase tracking-luxe text-accent">
                          {s.front}
                        </p>
                      </div>
                    </HoverPeelCard>
                  );
                })}
              </div>
            </div>
          </section>
        </CinematicLetterbox>

        <GoldRibbonWeave className="px-6" height={110} />

        {/* ---- The room, right now ---- */}
        <section className="relative border-y border-hairline bg-canvas-alt py-20 md:py-28">
          <RippleGrid spacing={44} reach={150} push={9} />
          <div className="relative mx-auto max-w-5xl px-6">
            <SectionHeading
              eyebrow="At This Hour"
              title="What the benches are doing today"
              highlightWords={['today']}
              subtitle="Read from your own clock against the hours each bench is worked. Come on a Saturday morning and the first of these is the one you can stand at."
            />
            <AtelierLiveStatus className="mt-12" />
          </div>
        </section>

        {/* ---- The safe, as a scene ---- */}
        <section className="relative bg-canvas py-6">
          <VaultDoorReveal
            label="After Hours"
            note="Keep scrolling. The doors are on your scroll, not on a timer."
          >
            <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
              <CausticsCanvas className="opacity-60" />
              <div className="relative">
                <ScrollAssembleText
                  text="The pieces that are not on the floor"
                  className="font-display text-3xl leading-tight text-primary sm:text-4xl md:text-5xl"
                />
                <p className="mx-auto mt-6 max-w-2xl font-sans text-base font-light leading-relaxed text-secondary">
                  Perhaps a fifth of what the house holds is in the safe rather than the cases —
                  single stones bought against a commission, estate pieces mid-restoration, and the
                  archive we draw the heritage line from. A private evening is the only way to see
                  any of it, and you have to say in advance what you want brought out.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-4">
                  <CTAButton variant="secondary" href="#diary" size="md">
                    Ask for an evening
                  </CTAButton>
                  <CTAButton variant="ghost" href="/gemstones" size="md" showArrow>
                    Read about the stones first
                  </CTAButton>
                </div>
              </div>
            </div>
          </VaultDoorReveal>
        </section>

        {/* ---- The cloth ---- */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <SilkWave
              src="/images/collections/bridal.jpg"
              alt="A bridal suite laid out on the presentation cloth"
              className="rounded-3xl border border-hairline"
              panels={16}
            />
            <div>
              <SectionHeading
                align="left"
                eyebrow="How It Is Shown"
                title="Nothing is handed to you across a counter"
                highlightWords={['counter']}
                subtitle="A piece is laid on the cloth, turned once under the light, and then left alone while you look at it. Advisors here are told not to fill that silence."
              />
              <ul className="mt-8 space-y-4">
                {[
                  'One piece on the tray at a time. Three pieces at once and you will remember none of them.',
                  'The light is 3000K, which is the light most rooms you will wear it in actually have.',
                  'You will be left alone with it for as long as you like. Say so and we will leave the room.',
                ].map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 font-sans text-sm font-light leading-relaxed text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 block h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-accent"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---- The diary ---- */}
        <section id="diary" className="relative py-20 md:py-28">
          <div className="relative mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="The Diary"
              title="Ask for a day the visit can actually run"
              highlightWords={['actually']}
              subtitle="Each visit runs on its own days, with its own room limit. Choose one and the diary shows you only those — so nothing you ask for has to be declined."
            />
            <ExperienceBooker className="mt-14" />
          </div>
        </section>

        <GoldDivider variant="wide" className="px-6" />


        {/* ---- The lighting itself ----
             Everything above describes what happens in the room. This is about
             the room \u2014 specifically about its light, which is the single
             largest difference between seeing a stone here and seeing one on a
             screen, and the thing a visitor cannot be shown any other way.

             So the section is built from light rather than from copy: two beams
             crossing on a physical pivot, smoke to make them visible, and leaks
             at the edges. It is the only place on the site where the atmospheric
             layers are the content rather than the texture underneath it. */}
        <section className="relative overflow-hidden border-y border-hairline bg-surface-sunken py-28 md:py-36">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <StageSweep intensity={0.3} width={0.28} crossed seconds={15} />
            <SmokeVeil intensity={0.32} originX={0.3} speed={0.85} count={22} />
            <BokehDrift count={20} intensity={0.44} speed={0.6} blades={7} />
            <LightLeakOverlay intensity={0.4} interval={8} onClick />
            <div className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_50%,rgb(var(--canvas)/0.8),transparent_78%)]" />
          </div>

          <VertigoZoom intensity={0.7} className="relative z-10">
            <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
              <p className="mb-8 font-accent text-[10px] uppercase tracking-luxest text-accent">
                4000 kelvin, from four directions
              </p>

              <TypeSlamHeading
                lines={['No screen has ever', 'shown you a stone.']}
                highlightWords={['never', 'stone.']}
                as="h2"
                gap={0.2}
                className="font-display text-3xl leading-[1.1] text-primary sm:text-4xl md:text-6xl"
              />

              <p className="mx-auto mt-10 max-w-xl font-sans text-base font-light leading-relaxed text-secondary md:text-lg">
                A display emits light. A diamond returns it, from forty-odd facets, differently every
                time your head moves. That is the entire property you are buying and it is the one
                thing a photograph structurally cannot record.
              </p>

              <div className="mt-10">
                <EchoTrailText
                  text="Which is why the room is worth the journey."
                  as="p"
                  echoes={3}
                  spread={16}
                  direction="right"
                  persistent
                  className="font-display text-2xl leading-snug text-primary md:text-3xl"
                />
              </div>
            </div>
          </VertigoZoom>
        </section>

        {/* ---- Close ---- */}
        <section className="relative px-6 py-24 text-center md:py-32">
          <div className="mx-auto max-w-3xl">
            <MoltenPour word="Poured" note="Cast on a Tuesday, worn for forty years" />
            <p className="mx-auto mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-secondary">
              Every piece in the cases left this building as liquid metal in a crucible somebody
              was watching. That is the whole reason to come and see where.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CTAButton variant="primary" href="/contact" size="lg" showArrow>
                Find the boutique
              </CTAButton>
              <CTAButton variant="secondary" href="/craftsmanship" size="lg">
                Tour the atelier here first
              </CTAButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
