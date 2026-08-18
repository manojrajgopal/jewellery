'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Diamond, Mail, MapPin, Phone } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import GlassPanel from '@/components/ui/GlassPanel';
import GradientOrb from '@/components/ui/GradientOrb';
import SparkleBurst from '@/components/motion/SparkleBurst';
import { useToast } from '@/components/providers/ToastProvider';
import { brandData } from '@/data/brand';

type FieldName = 'name' | 'email' | 'phone' | 'service' | 'date' | 'message';

const EMPTY: Record<FieldName, string> = {
  name: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  message: '',
};

const SERVICE_OPTIONS = [
  'Bridal Consultation',
  'Bespoke Design',
  'Private Viewing',
  'Repairs & Care',
  'Valuation',
];

interface FieldProps {
  label: string;
  name: FieldName;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  textarea?: boolean;
  options?: string[];
  required?: boolean;
}

/**
 * Defined at module scope on purpose. Declaring it inside the section made
 * React remount every input on each keystroke, so the field lost focus after
 * a single character.
 */
function FloatingField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  textarea = false,
  options,
  required = true,
}: FieldProps) {
  const filled = value.length > 0;
  // Date and select controls always show their own chrome, so the label
  // has to stay lifted rather than sitting on top of it.
  const alwaysLifted = filled || type === 'date' || Boolean(options);

  const control =
    'peer block w-full appearance-none border-b bg-transparent pb-2 pt-5 font-sans text-primary transition-colors duration-300 focus:outline-none focus:ring-0';
  const borders = 'border-line-strong focus:border-accent';

  return (
    <div className="group relative mb-8 w-full">
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          className={`${control} ${borders} min-h-[104px] resize-none`}
        />
      ) : options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${control} ${borders} ${filled ? 'text-primary' : 'text-faint'}`}
        >
          <option value="" disabled>
            Select a service
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${control} ${borders}`}
        />
      )}

      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 font-sans transition-all duration-300 ${
          alwaysLifted
            ? 'top-0 text-xs text-accent'
            : 'top-5 text-base text-faint peer-focus:top-0 peer-focus:text-xs peer-focus:text-accent'
        }`}
      >
        {label}
      </label>

      {/* Gold underline that grows from the left on focus */}
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-luxury peer-focus:scale-x-100" />
    </div>
  );
}

const CONTACT_ROWS = [
  {
    icon: MapPin,
    label: 'Address',
    value: brandData.contact?.address ?? '1892 Fifth Avenue, New York, NY 10019',
  },
  { icon: Phone, label: 'Phone', value: brandData.contact?.phone ?? '+1 (212) 555-0192' },
  { icon: Mail, label: 'Email', value: brandData.contact?.email ?? 'concierge@aurum.com' },
  {
    icon: Clock,
    label: 'Hours',
    value: brandData.contact?.hours ?? 'Mon–Sat: 10am – 7pm · Sunday: Closed',
  },
];

export default function AppointmentSection() {
  const [form, setForm] = useState(EMPTY);
  const [celebrating, setCelebrating] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCelebrating(true);
    toast({
      kind: 'luxe',
      title: 'Request received',
      message: 'Our concierge will be in touch within one business day.',
    });
    setForm(EMPTY);
    window.setTimeout(() => setCelebrating(false), 1400);
  };

  return (
    <section id="contact" className="relative w-full overflow-hidden bg-canvas py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-60" />
      <GradientOrb color="gold" size="md" position="top-left" intensity={0.12} />
      <GradientOrb color="jade" size="md" position="bottom-right" intensity={0.1} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Experience Awaits"
          title="Book a Private Consultation"
          highlightWords={['Private']}
          subtitle="An hour with a master jeweller, entirely yours. Tell us what you are looking for and we will prepare the vault."
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <SparkleBurst active={celebrating} />

            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg lg:mx-0">
              <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <FloatingField label="Full Name" name="name" value={form.name} onChange={handleChange} />
                <FloatingField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <FloatingField
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <FloatingField
                  label="Service Type"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  options={SERVICE_OPTIONS}
                />
                <FloatingField
                  label="Preferred Date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <FloatingField
                label="Your Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                textarea
                required={false}
              />

              <CTAButton
                variant="primary"
                size="lg"
                type="submit"
                className="mt-4 w-full justify-center"
                showArrow
              >
                Request Appointment
              </CTAButton>

              <p className="mt-4 text-center font-sans text-xs font-light text-faint">
                We reply within one business day. Your details are never shared.
              </p>
            </form>
          </motion.div>

          {/* Boutique details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col space-y-8"
          >
            <GlassPanel variant="default" className="p-8 md:p-10">
              <h3 className="mb-8 font-display text-3xl text-primary">Visit Our Boutique</h3>

              <div className="space-y-6">
                {CONTACT_ROWS.map(({ icon: Icon, label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.09 }}
                    className="group flex items-start gap-4"
                  >
                    <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-gold-500/5 text-accent transition-all duration-300 group-hover:border-gold-500/50 group-hover:bg-gold-500/10">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    <div>
                      <h4 className="mb-1 font-accent text-[10px] uppercase tracking-luxe text-accent-soft">
                        {label}
                      </h4>
                      <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                        {value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>

            <motion.div
              whileHover={{ y: -4 }}
              className="relative flex flex-col items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/5 p-7 text-center"
            >
              <Diamond className="mb-3 h-6 w-6 animate-sparkle text-accent" strokeWidth={1.3} />
              <p className="font-display text-lg text-primary">Private Viewing Available</p>
              <p className="mt-1 font-sans text-sm font-light text-muted">
                Experience our collections in complete privacy, after hours.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
