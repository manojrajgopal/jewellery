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
import { Reveal } from '@/components/animations/Reveal';
import { useToast } from '@/components/providers/ToastProvider';
import { brandData } from '@/data/brand';

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
      <section className="px-6 py-24 text-center">
        <Reveal>
          <SectionHeading
            eyebrow="In Person"
            title="Experience Aurum in Person"
            highlightWords={['Aurum']}
            align="center"
            className="mb-10"
          />
          <CTAButton href="/contact" variant="primary" size="lg" showArrow>
            Schedule a Private Viewing
          </CTAButton>
        </Reveal>
      </section>
    </main>
  );
}
