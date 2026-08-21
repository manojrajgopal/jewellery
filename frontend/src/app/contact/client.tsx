'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import GlassPanel from '@/components/ui/GlassPanel';
import CTAButton from '@/components/ui/CTAButton';
import FAQAccordion from '@/components/ui/FAQAccordion';
import SectionHeading from '@/components/ui/SectionHeading';
import GradientOrb from '@/components/ui/GradientOrb';
import SparkleBurst from '@/components/motion/SparkleBurst';
import BoutiqueLocator from '@/components/ui/BoutiqueLocator';
import ParticleField from '@/components/motion/ParticleField';
import RippleGrid from '@/components/motion/RippleGrid';
import FlipClock from '@/components/motion/FlipClock';
import OccasionReminder from '@/components/ui/OccasionReminder';
import VisitChecklist from '@/components/ui/VisitChecklist';
import AtelierLiveStatus from '@/components/ui/AtelierLiveStatus';
import DutyEstimator from '@/components/ui/DutyEstimator';
import MagneticFieldLines from '@/components/motion/MagneticFieldLines';
import TypeOnPath from '@/components/motion/TypeOnPath';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import BokehDrift from '@/components/motion/BokehDrift';
import SmokeVeil from '@/components/motion/SmokeVeil';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import StageSweep from '@/components/motion/StageSweep';
import EchoTrailText from '@/components/motion/EchoTrailText';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import ChromaSplit from '@/components/motion/ChromaSplit';
import CallbackWindow from '@/components/ui/CallbackWindow';
import AccessNotes from '@/components/ui/AccessNotes';
import GiftFinderSection from '@/app/_sections/home/GiftFinderSection';
import { Reveal } from '@/components/animations/Reveal';
import { useToast } from '@/components/providers/ToastProvider';
import { brandData } from '@/data/brand';

/**
 * What a visitor can do without an appointment. Written as three specific offers
 * rather than as opening hours, because "Mon–Sat 11–8" answers when the door is
 * unlocked and not whether it is worth walking through.
 */
const OPEN_HOUSE = [
  {
    icon: Clock,
    when: 'Any weekday, no appointment',
    title: 'Cleaning and a prong check',
    body: 'Bring in anything, ours or not. Ultrasonic where the stone allows it, hand-cleaned where it does not, and a look along the setting for movement. Fifteen minutes, no charge, no obligation.',
  },
  {
    icon: MapPin,
    when: 'Saturdays, 11am to 2pm',
    title: 'The bench is open',
    body: 'One artisan works at the front bench where you can watch and interrupt. It slows the work down considerably and it is the best three hours of the week.',
  },
  {
    icon: Phone,
    when: 'Sundays, by appointment',
    title: 'A private hour',
    body: 'The boutique to yourself with an advisor and a gemmologist. The bench is closed, so anything technical is answered on the Monday — which is why this is the wrong day for a commission conversation.',
  },
];

const FAQS = [
  {
    question: 'What is the purity of your gold?',
    answer:
      'Collection pieces are crafted in 18k solid gold; our heritage and bridal work is available in 22k and 24k. Every piece is BIS hallmarked so the purity is independently verified.',
  },
  {
    question: 'Do you create custom bespoke pieces?',
    answer:
      'Yes — bespoke creation is at the heart of the house. You work directly with our artisans, from first sketch through stone selection to the final polish.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Thirty days for return or exchange on standard collection pieces in unworn condition. Bespoke commissions are final sale, which we confirm in writing before work begins.',
  },
  {
    question: 'How do I know my ring size?',
    answer:
      'We recommend a professional fitting at the boutique. If you cannot visit, we will send a complimentary sizing kit to your home.',
  },
  {
    question: 'Are your diamonds certified?',
    answer:
      'Every diamond over 0.5 carats arrives with a GIA grading report, and all our stones are Kimberley Process certified conflict-free.',
  },
  {
    question: 'Do you offer international delivery?',
    answer:
      'We ship worldwide by insured courier. Delivery times vary by destination and customs handling; your concierge will confirm before dispatch.',
  },
  {
    question: 'How should I care for my jewellery?',
    answer:
      'Avoid harsh chemicals and remove pieces during strenuous activity. Bring them to us annually for a complimentary spa treatment.',
  },
  {
    question: 'Is there a warranty on your pieces?',
    answer:
      'Every AURUM creation carries a lifetime warranty against manufacturing defects, alongside our lifetime care programme.',
  },
];

const SUBJECTS = [
  { value: 'bespoke', label: 'Bespoke Inquiry' },
  { value: 'appointment', label: 'Book Appointment' },
  { value: 'support', label: 'Customer Support' },
  { value: 'press', label: 'Press & Media' },
];

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: brandData.socialLinks?.instagram ?? '#' },
  { icon: Facebook, label: 'Facebook', href: brandData.socialLinks?.facebook ?? '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

/** Shared classes for the floating-label inputs below. */
const FIELD =
  'peer w-full border-b border-line-strong bg-transparent py-3 font-sans text-primary placeholder-transparent transition-colors duration-300 focus:border-accent focus:outline-none';
const LABEL =
  'pointer-events-none absolute left-0 -top-3.5 font-sans text-xs text-accent transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-faint peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-accent';

export default function ContactClient() {
  const [form, setForm] = useState(EMPTY);
  const [celebrating, setCelebrating] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCelebrating(true);
    toast({
      kind: 'luxe',
      title: 'Message sent',
      message: 'An AURUM concierge will be in touch shortly.',
    });
    setForm(EMPTY);
    window.setTimeout(() => setCelebrating(false), 1400);
  };

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <PageBanner
        title="Get in Touch"
        subtitle="We would love to hear from you"
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-12">
        <GradientOrb color="gold" size="lg" position="top-right" intensity={0.1} />

        <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Form */}
          <Reveal>
            <GlassPanel className="relative p-8 md:p-12">
              <SparkleBurst active={celebrating} />

              <h2 className="mb-8 font-display text-3xl text-primary">Send a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <div className="relative">
                    <input
                      id="c-name"
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className={FIELD}
                    />
                    <label htmlFor="c-name" className={LABEL}>
                      Full Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="c-email"
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={FIELD}
                    />
                    <label htmlFor="c-email" className={LABEL}>
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <div className="relative">
                    <input
                      id="c-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className={FIELD}
                    />
                    <label htmlFor="c-phone" className={LABEL}>
                      Phone Number
                    </label>
                  </div>

                  <div className="relative">
                    <label htmlFor="c-subject" className="sr-only">
                      Subject
                    </label>
                    <select
                      id="c-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className={`w-full appearance-none border-b border-line-strong bg-transparent py-3 font-sans text-sm transition-colors duration-300 focus:border-accent focus:outline-none ${
                        form.subject ? 'text-primary' : 'text-faint'
                      }`}
                    >
                      <option value="" disabled>
                        Select Subject
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative pt-4">
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className={`${FIELD} resize-none`}
                  />
                  <label htmlFor="c-message" className={LABEL}>
                    Your Message
                  </label>
                </div>

                <CTAButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-4 w-full justify-center"
                  showArrow
                >
                  Send Inquiry
                </CTAButton>
              </form>
            </GlassPanel>
          </Reveal>

          {/* Details */}
          <div className="space-y-6">
            <Reveal delay={0.15} direction="left">
              <GlassPanel interactive className="flex items-start gap-6 p-8">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/5 text-accent">
                  <MapPin size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="mb-2 font-display text-xl text-primary">Boutique Location</h3>
                  <p className="font-sans text-sm font-light leading-relaxed text-muted">
                    {brandData.contact.address}
                  </p>
                </div>
              </GlassPanel>
            </Reveal>

            <Reveal delay={0.25} direction="left">
              <GlassPanel interactive className="flex items-start gap-6 p-8">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/5 text-accent">
                  <Clock size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="mb-2 font-display text-xl text-primary">Opening Hours</h3>
                  <p className="font-sans text-sm font-light leading-relaxed text-muted">
                    {brandData.contact.hours}
                  </p>
                </div>
              </GlassPanel>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Reveal delay={0.35} direction="left" className="h-full">
                <a href={`tel:${brandData.contact.phone.replace(/\s/g, '')}`} className="block h-full">
                  <GlassPanel
                    interactive
                    className="flex h-full flex-col items-center justify-center p-6 text-center"
                  >
                    <Phone className="mb-3 h-5 w-5 text-accent" strokeWidth={1.6} />
                    <p className="font-sans text-sm text-secondary">{brandData.contact.phone}</p>
                  </GlassPanel>
                </a>
              </Reveal>

              <Reveal delay={0.45} direction="left" className="h-full">
                <a href={`mailto:${brandData.contact.email}`} className="block h-full">
                  <GlassPanel
                    interactive
                    className="flex h-full flex-col items-center justify-center p-6 text-center"
                  >
                    <Mail className="mb-3 h-5 w-5 text-accent" strokeWidth={1.6} />
                    <p className="break-all font-sans text-sm text-secondary">
                      {brandData.contact.email}
                    </p>
                  </GlassPanel>
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.55} direction="left">
              <div className="flex gap-3 px-1 pt-4">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -4, scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-gold-500/50 hover:text-accent"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </motion.a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Map panel */}
      <div className="mx-auto mb-24 max-w-7xl px-6 md:px-12">
        <Reveal>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Directions"
            className="group relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-gold-500/20"
          >
            <div className="absolute inset-0 bg-[url('/images/hero/hero-main.jpg')] bg-cover bg-center opacity-25 grayscale transition-transform duration-[1400ms] ease-luxury group-hover:scale-110 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-canvas/80 transition-colors duration-700 group-hover:bg-canvas/70" />

            {/* Pulsing pin */}
            <span className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-scale-pulse rounded-full bg-gold-500/40" />
              <MapPin className="relative h-11 w-11 text-accent" strokeWidth={1.4} />
            </span>

            <h3 className="relative z-10 font-display text-3xl text-primary">Visit Our Boutique</h3>
            <p className="relative z-10 mt-2 font-sans text-sm font-light text-muted">
              Get directions via Google Maps
            </p>
          </a>
        </Reveal>
      </div>

      {/* FAQ */}
      {/* The houses themselves — a map is the right answer to "where are you" */}
      <section className="relative overflow-hidden py-24">
        <ParticleField count={30} rise />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="The Houses"
            title="Six addresses, one bench in each"
            highlightWords={['one']}
            className="mb-14"
          />
          <BoutiqueLocator />
        </div>
      </section>

      {/* When the doors are actually open, and what is on behind them. The form
          above books an appointment; this is the answer to "can I just walk in". */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24">
        <RippleGrid spacing={48} reach={190} dot={1} />

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Walk In"
            title="What is on, and when"
            highlightWords={['when']}
            subtitle="Every address keeps the same hours. Sunday is by appointment because the bench is closed and there is nobody to answer a technical question."
            align="center"
            className="mb-14"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {OPEN_HOUSE.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-7 backdrop-blur-xl transition-colors duration-500 hover:border-gold-500/35"
              >
                <span
                  aria-hidden="true"
                  className="facet-fan pointer-events-none absolute -right-10 -top-10 h-36 w-36 animate-conic-spin-slow rounded-full opacity-20"
                />

                <span className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/30 text-accent">
                  <item.icon size={17} strokeWidth={1.6} />
                </span>

                <p className="relative font-accent text-[9px] uppercase tracking-luxest text-accent">
                  {item.when}
                </p>
                <h3 className="relative mt-2.5 font-display text-xl font-light leading-snug text-primary">
                  {item.title}
                </h3>
                <p className="relative mt-3 font-sans text-sm font-light leading-relaxed text-muted">
                  {item.body}
                </p>
              </motion.article>
            ))}
          </div>

          {/* The next private view, counted down */}
          <div className="mt-14 flex flex-col items-center gap-6 rounded-2xl border border-hairline bg-surface-raised/50 p-8 text-center backdrop-blur-xl md:p-10">
            <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              The Next Private View
            </p>
            <h3 className="max-w-2xl font-display text-2xl font-light leading-snug text-primary md:text-3xl">
              Forty places, the whole season on velvet, and the bench answering questions
            </h3>
            {/* A real date rather than a computed one — a countdown that resets on
                reload undermines the thing it is meant to make credible. */}
            <FlipClock to="2026-11-14T18:00:00" expiredLabel="The doors are open" />
            <p className="nums-tabular font-sans text-[11px] font-light italic text-faint">
              14 November 2026 · 6pm · {brandData.contact.address.split(',')[0]}
            </p>
          </div>
        </div>
      </section>


      {/* ---- What happens when you send it ----
           A contact form is the one place on a site where a visitor gives
           something and gets nothing back but a spinner, and the anxiety is
           always the same: did that go anywhere, and who reads it.

           So this answers both, in the plainest language on the site, and it is
           placed directly after the form rather than buried in a policy page.
           The atmosphere here is the lightest on any page \u2014 this section is
           reassurance, and reassurance should not be theatrical. */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <BokehDrift count={14} intensity={0.32} speed={0.5} blades={6} />
          <SmokeVeil intensity={0.16} originX={0.8} speed={0.55} count={12} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
          <ChromaSplit amount={4} saturateAt={2400}>
            <p className="mb-6 font-accent text-[10px] uppercase tracking-luxest text-accent">
              After you press send
            </p>
          </ChromaSplit>

          <TypeSlamHeading
            lines={['A person reads it.', 'Usually the same day.']}
            highlightWords={['person']}
            as="h2"
            gap={0.18}
            className="font-display text-3xl leading-[1.1] text-primary md:text-5xl"
          />

          <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
            {[
              {
                k: 'Who reads it',
                v: 'One of four people, all of whom work on the floor. There is no queue and no ticket number.',
              },
              {
                k: 'How long',
                v: 'Same working day for anything sent before four; next morning otherwise. If it will be longer, we say so rather than going quiet.',
              },
              {
                k: 'What we do with it',
                v: 'Answer it. Your details are not sold, not shared, and not added to anything you did not ask for.',
              },
            ].map((row) => (
              <div
                key={row.k}
                className="rounded-2xl border border-hairline bg-canvas-alt/50 p-6"
              >
                <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                  {row.k}
                </span>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-secondary">
                  {row.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- The invitation ----
           One held shot before the closing call to action. The page above is all
           logistics \u2014 hours, addresses, checklists \u2014 and a visitor who has
           read all of it deserves a reason rather than another instruction. */}
      <section className="relative overflow-hidden border-y border-hairline bg-surface-sunken py-28 md:py-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <StageSweep intensity={0.26} width={0.3} crossed seconds={16} />
          <LightLeakOverlay intensity={0.34} interval={10} onClick />
          <div className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_50%,rgb(var(--canvas)/0.8),transparent_78%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-12">
          <EchoTrailText
            text="You are not expected to buy anything."
            as="h2"
            echoes={3}
            spread={18}
            direction="left"
            persistent
            className="font-display text-3xl leading-snug text-primary md:text-5xl"
          />
          <p className="mx-auto mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-secondary md:text-lg">
            People come in to have a clasp looked at, to ask what a grandmother\u2019s ring is, or
            because they want to see a stone properly before deciding anything at all. All three are
            a normal Tuesday here, and none of them cost anything.
          </p>
        </div>
      </section>

      {/* ---- What to bring, and who is in today ----
           The two questions a visitor has once they have decided to come: is there
           anybody at the bench today, and what will I need in my bag. Neither was
           answerable from this page before, and a wasted journey for want of a
           certificate is the most common one in the trade. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Come Prepared"
            title="What to bring, and who is in today"
            highlightWords={['today']}
            subtitle="Every line on the checklist says what the visit costs without it, which is the only version anybody acts on. The ticks stay in your browser, so you can pack from it the night before."
            align="center"
            className="mb-14"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <VisitChecklist />
            <AtelierLiveStatus />
          </div>
        </div>
      </section>

      <GoldRibbonWeave className="px-6" height={100} />

      {/* ---- Sending it somewhere else ----
           Six addresses in one country and international consignments every week.
           The question is never what the ring costs, it is what arrives to pay
           when it lands — and the answer is almost never the headline duty rate,
           because the consumption tax usually compounds on the duty-inclusive
           value and the insurance is part of the taxable sum rather than separate
           from it. Both facts are invisible until somebody does the arithmetic. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24">
        <MagneticFieldLines lines={16} radius={240} strength={26} vertical className="opacity-60" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <TypeOnPath
            text="What arrives to pay"
            curve="dip"
            size={62}
            travel
            className="mx-auto mb-6 max-w-2xl"
          />

          <SectionHeading
            eyebrow="Across A Border"
            title="The duty rate is never the number"
            highlightWords={['never']}
            subtitle="Itemised in the order a customs computation actually runs, which is the only way the figure stops being a surprise — the tax compounds on the duty, and the insurance premium is taxed along with the piece. Six destinations, with the local rule that catches people out in each."
            align="center"
            className="mb-14"
          />

          <DutyEstimator />
        </div>
      </section>

      {/* Dates we should know about */}
      <section className="relative overflow-hidden py-24">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Before You Write"
            title="Tell yourself, not us"
            highlightWords={['yourself,']}
            subtitle="A commission needs six weeks and engraving needs ten days. Keep the dates that matter here and the panel will tell you which is still possible — the list stays in your browser and is never sent to us."
            align="center"
            className="mb-14"
          />

          <OccasionReminder />
        </div>
      </section>

      <section className="bg-surface-raised/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow="Knowledge"
            title="Frequently Asked Questions"
            highlightWords={['Questions']}
            align="center"
            className="mb-16"
          />
          <FAQAccordion items={FAQS} />
        </div>
      </section>

      {/* CTA */}
      {/* ---- A window in both clocks ----
           The page can already take a message and show the opening hours. Neither
           is any use to somebody in another time zone, because our hours mean
           nothing to them and every "preferred time" field on the internet
           quietly assumes one end of the conversation.

           So the grid is drawn in both clocks at once, which takes no more space
           than one and removes the arithmetic entirely. The arithmetic is where
           these arrangements fail — somebody converts a zone the wrong way about
           once in every four or five attempts, and it is always the customer who
           then waits by a phone. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <MagneticFieldLines />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Both Clocks"
            title="Pick a half hour that is civil at both ends"
            highlightWords={['both']}
            subtitle="Every cell shows your time above ours, so there is no conversion to get wrong. Three states rather than two, because &ldquo;the bench is open but nobody who can answer your question is here&rdquo; is a real situation and offering it would produce a call that has to happen twice."
            align="center"
            className="mb-16"
          />

          <CallbackWindow />
        </div>
      </section>

      {/* ---- Getting in ----
           The page can already book an appointment, find the building, say
           what the room is like and say when somebody is awake at both ends.
           What none of that answers is the set of questions somebody has to
           telephone a stranger to ask — and having to ask is itself the
           barrier.

           So every answer here is a measurement or a plain no. "Accessible"
           has meant nothing since about 1994; 910mm of clear door width and a
           12mm chamfered threshold mean something. Where the answer is no it
           says no, and says what we do instead. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Before you have to ask"
            title="Twelve questions nobody should have to telephone about"
            highlightWords={['telephone']}
            subtitle="Door widths in millimetres, which way the lavatory rail drops, the size of the lift, where the loop works and where it does not. Three of the twelve answers are “with a limit”, and those are the three worth reading — a carefully phrased yes is how somebody ends up at the bottom of a step."
            align="left"
            className="mb-14"
          />

          <AccessNotes />
        </div>
      </section>

      <GiftFinderSection />

      <section className="px-6 py-24 text-center">
        <Reveal>
          <SectionHeading
            eyebrow="In Person"
            title="Experience Aurum in Person"
            highlightWords={['Aurum']}
            align="center"
            className="mb-10"
          />
          <CTAButton href="/book-appointment" variant="primary" size="lg" showArrow>
            Schedule a Private Viewing
          </CTAButton>
        </Reveal>
      </section>
    </main>
  );
}
