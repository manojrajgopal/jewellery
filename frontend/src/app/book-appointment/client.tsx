'use client';

import React, { useState } from 'react';
import { CalendarCheck, Clock, Gem, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

import PageBanner from '@/components/ui/PageBanner';
import GlassPanel from '@/components/ui/GlassPanel';
import CTAButton from '@/components/ui/CTAButton';
import SectionHeading from '@/components/ui/SectionHeading';
import GradientOrb from '@/components/ui/GradientOrb';
import SparkleBurst from '@/components/motion/SparkleBurst';
import { Reveal } from '@/components/animations/Reveal';
import { useToast } from '@/components/providers/ToastProvider';

/**
 * A dedicated booking flow, deliberately separate from /contact.
 *
 * Contact is for open questions and messages; this page does one thing — reserve
 * a specific kind of visit at a specific time — so it carries its own focused
 * form rather than sending the visitor to the general contact form. It shares no
 * tool with any other page: the appointment form here is unique to this route.
 *
 * The site is a static export with no backend, so submission confirms in-browser
 * with a concierge toast; the fields are the ones an advisor needs to prepare for
 * the visit before a human follows up.
 */

const TYPES = [
  {
    value: 'private-viewing',
    label: 'Private Viewing',
    icon: Gem,
    blurb: 'The boutique, an advisor and the pieces you want to see, to yourself.',
  },
  {
    value: 'bespoke',
    label: 'Bespoke Consultation',
    icon: Sparkles,
    blurb: 'Begin a commission — sketches, stones and a first estimate at the bench.',
  },
  {
    value: 'valuation',
    label: 'Valuation & Appraisal',
    icon: ShieldCheck,
    blurb: 'An insurance-grade written valuation of a piece, ours or otherwise.',
  },
  {
    value: 'restoration',
    label: 'Repair & Restoration',
    icon: Clock,
    blurb: 'Bring a piece to the restoration bench for assessment and a quote.',
  },
];

const BOUTIQUES = [
  'AURUM Flagship — Mumbai',
  'AURUM — New Delhi',
  'AURUM — Bengaluru',
  'AURUM — Hyderabad',
  'AURUM — Chennai',
  'AURUM — Kolkata',
];

const TIMES = [
  '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

const GUESTS = ['Just me', '2 guests', '3 guests', '4 guests'];

const ASSURANCES = [
  {
    icon: UserRound,
    title: 'One advisor, undivided',
    body: 'A single advisor is assigned to your visit and stays with you throughout — no handovers, no queue.',
  },
  {
    icon: CalendarCheck,
    title: 'Confirmed within the hour',
    body: 'A concierge confirms your slot by phone or email within an hour of booking, during boutique hours.',
  },
  {
    icon: ShieldCheck,
    title: 'Private and no-obligation',
    body: 'Every appointment is discreet and entirely without obligation. Come to look, to learn, or to begin.',
  },
];

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  type: 'private-viewing',
  boutique: '',
  date: '',
  time: '',
  guests: 'Just me',
  notes: '',
};

const FIELD =
  'peer w-full border-b border-line-strong bg-transparent py-3 font-sans text-primary placeholder-transparent transition-colors duration-300 focus:border-accent focus:outline-none';
const LABEL =
  'pointer-events-none absolute left-0 -top-3.5 font-sans text-xs text-accent transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-faint peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-accent';
const SELECT =
  'w-full appearance-none border-b border-line-strong bg-transparent py-3 font-sans text-sm text-primary transition-colors duration-300 focus:border-accent focus:outline-none';

export default function BookAppointmentClient() {
  const [form, setForm] = useState(EMPTY);
  const [celebrating, setCelebrating] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCelebrating(true);
    const type = TYPES.find((t) => t.value === form.type)?.label ?? 'appointment';
    toast({
      kind: 'luxe',
      title: 'Appointment requested',
      message: `Your ${type.toLowerCase()} is reserved — a concierge will confirm shortly.`,
    });
    setForm(EMPTY);
    window.setTimeout(() => setCelebrating(false), 1400);
  };

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <PageBanner
        title="Book an Appointment"
        subtitle="Reserve a private visit with an AURUM advisor"
        breadcrumbs={[{ label: 'Book an Appointment' }]}
      />

      <div className="relative mx-auto max-w-7xl overflow-hidden px-6 py-24 md:px-12">
        <GradientOrb color="gold" size="lg" position="top-right" intensity={0.1} />

        <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-[1.3fr_1fr]">
          {/* Booking form */}
          <Reveal>
            <GlassPanel className="relative p-8 md:p-12">
              <SparkleBurst active={celebrating} />

              <h2 className="mb-8 font-display text-3xl text-primary">Reserve Your Visit</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Appointment type */}
                <fieldset>
                  <legend className="mb-4 font-accent text-[10px] uppercase tracking-luxest text-accent">
                    What would you like to do?
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {TYPES.map((t) => {
                      const Icon = t.icon;
                      const active = form.type === t.value;
                      return (
                        <label
                          key={t.value}
                          className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors ${
                            active
                              ? 'border-gold-500/50 bg-gold-500/10'
                              : 'border-hairline hover:border-gold-500/40'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="type"
                              value={t.value}
                              checked={active}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <Icon
                              size={16}
                              strokeWidth={1.7}
                              className={active ? 'text-accent' : 'text-muted'}
                            />
                            <span
                              className={`font-accent text-xs uppercase tracking-luxe ${
                                active ? 'text-accent' : 'text-primary'
                              }`}
                            >
                              {t.label}
                            </span>
                          </span>
                          <span className="font-sans text-xs font-light leading-relaxed text-muted">
                            {t.blurb}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Contact details */}
                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <div className="relative">
                    <input
                      id="b-name"
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className={FIELD}
                    />
                    <label htmlFor="b-name" className={LABEL}>
                      Full Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="b-email"
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={FIELD}
                    />
                    <label htmlFor="b-email" className={LABEL}>
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <div className="relative">
                    <input
                      id="b-phone"
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className={FIELD}
                    />
                    <label htmlFor="b-phone" className={LABEL}>
                      Phone Number
                    </label>
                  </div>
                  <div className="relative">
                    <label htmlFor="b-boutique" className="sr-only">
                      Preferred boutique
                    </label>
                    <select
                      id="b-boutique"
                      name="boutique"
                      required
                      value={form.boutique}
                      onChange={handleChange}
                      className={`${SELECT} ${form.boutique ? 'text-primary' : 'text-faint'}`}
                    >
                      <option value="" disabled>
                        Preferred boutique
                      </option>
                      {BOUTIQUES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date / time / guests */}
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
                  <div className="relative">
                    <label
                      htmlFor="b-date"
                      className="mb-2 block font-accent text-[10px] uppercase tracking-luxe text-accent"
                    >
                      Preferred date
                    </label>
                    <input
                      id="b-date"
                      type="date"
                      name="date"
                      required
                      value={form.date}
                      onChange={handleChange}
                      className={SELECT}
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="b-time"
                      className="mb-2 block font-accent text-[10px] uppercase tracking-luxe text-accent"
                    >
                      Preferred time
                    </label>
                    <select
                      id="b-time"
                      name="time"
                      required
                      value={form.time}
                      onChange={handleChange}
                      className={`${SELECT} ${form.time ? 'text-primary' : 'text-faint'}`}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="b-guests"
                      className="mb-2 block font-accent text-[10px] uppercase tracking-luxe text-accent"
                    >
                      Guests
                    </label>
                    <select
                      id="b-guests"
                      name="guests"
                      value={form.guests}
                      onChange={handleChange}
                      className={SELECT}
                    >
                      {GUESTS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="relative pt-2">
                  <textarea
                    id="b-notes"
                    name="notes"
                    rows={4}
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    className={`${FIELD} resize-none`}
                  />
                  <label htmlFor="b-notes" className={LABEL}>
                    Anything we should prepare? (optional)
                  </label>
                </div>

                <CTAButton type="submit" variant="primary" size="lg" showArrow className="w-full">
                  Request Appointment
                </CTAButton>
              </form>
            </GlassPanel>
          </Reveal>

          {/* Assurances */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-3 font-accent text-[10px] uppercase tracking-luxest text-accent">
                  What to expect
                </p>
                <h3 className="font-display text-2xl font-light leading-snug text-primary md:text-3xl">
                  A visit arranged around you, not the other way round
                </h3>
              </div>

              <div className="flex flex-col gap-5">
                {ASSURANCES.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.title}
                      className="flex gap-4 rounded-2xl border border-hairline bg-surface-raised/30 p-5"
                    >
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-accent">
                        <Icon size={18} strokeWidth={1.6} />
                      </span>
                      <div>
                        <h4 className="font-display text-lg text-primary">{a.title}</h4>
                        <p className="mt-1 font-sans text-sm font-light leading-relaxed text-muted">
                          {a.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="font-sans text-sm font-light leading-relaxed text-muted">
                Prefer to talk first, or have a question that is not a booking? The
                concierge is a message away on the{' '}
                <a href="/contact" className="text-accent underline-offset-4 hover:underline">
                  contact page
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>

        <div className="relative z-10 mt-24">
          <SectionHeading
            eyebrow="No Appointment Needed"
            title="Some things you can just walk in for"
            highlightWords={['walk in']}
            subtitle="A cleaning and a prong check take fifteen minutes, any weekday, at no charge. A booking is only for the private and the bespoke."
            align="center"
          />
        </div>
      </div>
    </main>
  );
}
