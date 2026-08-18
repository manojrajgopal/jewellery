'use client';

import React, { useState } from 'react';
import PageBanner from '@/components/ui/PageBanner';
import GlassPanel from '@/components/ui/GlassPanel';
import CTAButton from '@/components/ui/CTAButton';
import FAQAccordion from '@/components/ui/FAQAccordion';
import SectionHeading from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/animations/Reveal';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

const faqs = [
  { question: 'What is the purity of your gold?', answer: 'All AURUM pieces are crafted in 18k solid gold, ensuring the perfect balance of rich color, durability, and lasting value.' },
  { question: 'Do you create custom bespoke pieces?', answer: 'Yes, bespoke creation is at the heart of our brand. You can work directly with our artisans to design a truly unique piece.' },
  { question: 'What is your return policy?', answer: 'We offer a 30-day return or exchange policy on all standard collection pieces in unworn condition. Custom bespoke pieces are final sale.' },
  { question: 'How do I know my ring size?', answer: 'We recommend visiting our boutique for a professional fitting, or we can send you a complimentary sizing kit to your home.' },
  { question: 'Are your diamonds certified?', answer: 'Yes, all diamonds over 0.5 carats are accompanied by a GIA (Gemological Institute of America) grading report.' },
  { question: 'Do you offer international delivery?', answer: 'We ship securely worldwide via insured courier services. Delivery times vary by location.' },
  { question: 'How should I care for my jewellery?', answer: 'We recommend avoiding harsh chemicals and removing your pieces during strenuous activities. Bring them to us annually for a complimentary spa treatment.' },
  { question: 'Is there a warranty on your pieces?', answer: 'Every AURUM creation comes with a lifetime warranty against manufacturing defects.' },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message. An AURUM concierge will be in touch shortly.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-[#060504] text-gold-100 pb-24">
      <PageBanner
        title="Get in Touch"
        subtitle="We would love to hear from you"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Form Side */}
          <Reveal>
            <GlassPanel className="p-8 md:p-12">
              <h3 className="font-display text-3xl mb-8">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-gold-100 placeholder-transparent focus:outline-none focus:border-gold-500 peer"
                      placeholder="Name"
                    />
                    <label className="absolute left-0 -top-3.5 text-white/50 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-xs">
                      Full Name
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-gold-100 placeholder-transparent focus:outline-none focus:border-gold-500 peer"
                      placeholder="Email"
                    />
                    <label className="absolute left-0 -top-3.5 text-white/50 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-xs">
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-gold-100 placeholder-transparent focus:outline-none focus:border-gold-500 peer"
                      placeholder="Phone"
                    />
                    <label className="absolute left-0 -top-3.5 text-white/50 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-xs">
                      Phone Number
                    </label>
                  </div>
                  <div className="relative">
                    <select 
                      name="subject" value={formData.subject} onChange={handleChange} required
                      className="w-full bg-[#060504] border-b border-white/20 py-3 text-gold-100 focus:outline-none focus:border-gold-500 text-sm"
                    >
                      <option value="" disabled>Select Subject</option>
                      <option value="bespoke">Bespoke Inquiry</option>
                      <option value="appointment">Book Appointment</option>
                      <option value="support">Customer Support</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>
                </div>

                <div className="relative pt-6">
                  <textarea 
                    name="message" required rows={4} value={formData.message} onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-gold-100 placeholder-transparent focus:outline-none focus:border-gold-500 peer resize-none"
                    placeholder="Message"
                  />
                  <label className="absolute left-0 top-2 text-white/50 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-9 peer-focus:top-2 peer-focus:text-gold-500 peer-focus:text-xs">
                    Your Message
                  </label>
                </div>

                <CTAButton type="submit" variant="primary" className="w-full mt-8" showArrow>
                  Send Inquiry
                </CTAButton>
              </form>
            </GlassPanel>
          </Reveal>

          {/* Info Side */}
          <div className="space-y-6">
            <Reveal delay={0.2} direction="left">
              <GlassPanel className="p-8 flex items-start gap-6">
                <MapPin className="text-gold-500 w-8 h-8 shrink-0" />
                <div>
                  <h4 className="font-display text-xl mb-2">Boutique Location</h4>
                  <p className="text-white/70 font-body text-sm leading-relaxed">
                    1892 Aurum Avenue<br/>
                    Luxury District<br/>
                    London, W1K 7AL, UK
                  </p>
                </div>
              </GlassPanel>
            </Reveal>

            <Reveal delay={0.3} direction="left">
              <GlassPanel className="p-8 flex items-start gap-6">
                <Clock className="text-gold-500 w-8 h-8 shrink-0" />
                <div>
                  <h4 className="font-display text-xl mb-2">Opening Hours</h4>
                  <p className="text-white/70 font-body text-sm leading-relaxed">
                    Monday - Friday: 10:00 AM - 7:00 PM<br/>
                    Saturday: 11:00 AM - 6:00 PM<br/>
                    Sunday: By Private Appointment Only
                  </p>
                </div>
              </GlassPanel>
            </Reveal>

            <div className="grid grid-cols-2 gap-6">
              <Reveal delay={0.4} direction="left" className="h-full">
                <GlassPanel className="p-6 h-full flex flex-col items-center justify-center text-center">
                  <Phone className="text-gold-500 w-6 h-6 mb-3" />
                  <p className="text-white/70 font-body text-sm">+44 20 7123 4567</p>
                </GlassPanel>
              </Reveal>
              <Reveal delay={0.5} direction="left" className="h-full">
                <GlassPanel className="p-6 h-full flex flex-col items-center justify-center text-center">
                  <Mail className="text-gold-500 w-6 h-6 mb-3" />
                  <p className="text-white/70 font-body text-sm">concierge@aurum.com</p>
                </GlassPanel>
              </Reveal>
            </div>
            
            <Reveal delay={0.6} direction="left">
              <div className="flex gap-6 pt-4 px-4">
                <a href="#" className="text-white/50 hover:text-gold-500 transition-colors"><Instagram className="w-6 h-6" /></a>
                <a href="#" className="text-white/50 hover:text-gold-500 transition-colors"><Facebook className="w-6 h-6" /></a>
                <a href="#" className="text-white/50 hover:text-gold-500 transition-colors"><Twitter className="w-6 h-6" /></a>
              </div>
            </Reveal>

          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <Reveal>
          <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-ink-900 to-[#060504] border border-gold-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/images/hero/hero-main.jpg')] opacity-20 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000 grayscale" />
            <div className="absolute inset-0 bg-ink-950/80" />
            <MapPin className="text-gold-500 w-12 h-12 mb-4 relative z-10" />
            <h3 className="font-display text-3xl text-gold-100 relative z-10">Visit Our Boutique</h3>
            <p className="text-white/60 mt-2 font-body relative z-10">Get directions via Google Maps</p>
          </div>
        </Reveal>
      </div>

      {/* FAQ Section */}
      <section className="bg-ink-950 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading 
            eyebrow="Knowledge"
            title="Frequently Asked Questions"
            align="center"
            className="mb-16"
          />
          <Reveal>
            <FAQAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <Reveal>
          <h2 className="font-display text-4xl mb-6">Experience Aurum in Person</h2>
          <CTAButton href="/contact" variant="primary" size="lg" showArrow>
            Schedule a Private Viewing
          </CTAButton>
        </Reveal>
      </section>
    </main>
  );
}
