'use client';

import React, { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import GlassPanel from '@/components/ui/GlassPanel';
import GradientOrb from '@/components/ui/GradientOrb';
import { MapPin, Phone, Mail, Clock, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppointmentSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for your request. Our concierge will contact you shortly.');
    setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' });
  };

  const FloatingInput = ({ label, type = "text", name, isTextArea = false, options = [] }: { label: string; type?: string; name: string; isTextArea?: boolean; options?: string[] }) => {
    const isFilled = formData[name as keyof typeof formData].length > 0;
    
    return (
      <div className="relative mb-8 w-full group">
        {isTextArea ? (
          <textarea
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="block w-full bg-transparent border-b border-ink-700 text-cream-50 focus:border-gold-500 focus:outline-none focus:ring-0 pt-4 pb-2 resize-none peer min-h-[100px] transition-colors"
            required
          />
        ) : type === 'select' ? (
          <select
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className={`block w-full bg-transparent border-b border-ink-700 focus:border-gold-500 focus:outline-none focus:ring-0 pt-4 pb-2 peer transition-colors appearance-none ${isFilled ? 'text-cream-50' : 'text-ink-500'}`}
            required
          >
            <option value="" disabled className="bg-ink-900 text-ink-500"></option>
            {options.map((opt: string) => (
              <option key={opt} value={opt} className="bg-ink-900 text-cream-50">{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="block w-full bg-transparent border-b border-ink-700 text-cream-50 focus:border-gold-500 focus:outline-none focus:ring-0 pt-4 pb-2 peer transition-colors"
            required
          />
        )}
        <label 
          className={`absolute left-0 top-4 text-ink-500 transition-all duration-300 pointer-events-none
            ${isFilled || type === 'date' ? '-translate-y-6 text-xs text-gold-500' : 'peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-gold-500'}
          `}
        >
          {label}
        </label>
      </div>
    );
  };

  return (
    <section id="contact" className="relative w-full py-24 bg-ink-950 overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ink-900/40 via-ink-950 to-ink-950 pointer-events-none" />
      <GradientOrb color="gold" size="md" position="top-left" className="opacity-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="THE EXPERIENCE AWAITS"
          title="Book a Private Consultation"
          highlightWords={['Private']}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto lg:mx-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <FloatingInput label="Full Name" name="name" />
                <FloatingInput label="Email Address" type="email" name="email" />
              </div>
              <FloatingInput label="Phone Number" type="tel" name="phone" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <FloatingInput 
                  label="Service Type" 
                  type="select" 
                  name="service" 
                  options={['Bridal Consultation', 'Bespoke Design', 'Viewing', 'Repairs & Care']} 
                />
                <FloatingInput label="Preferred Date" type="date" name="date" />
              </div>
              <FloatingInput label="Your Message" name="message" isTextArea />
              
              <CTAButton variant="primary" size="lg" className="w-full mt-4 flex justify-center">
                Request Appointment
              </CTAButton>
            </form>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-8"
          >
            <GlassPanel variant="default" className="p-8 md:p-10">
              <h3 className="font-display text-3xl text-cream-50 mb-8">Visit Our Boutique</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0 mt-1" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-gold-300 text-sm uppercase tracking-widest mb-1">Address</h5>
                    <p className="text-cream-50">1892 Fifth Avenue<br />New York, NY 10019</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0 mt-1" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-gold-300 text-sm uppercase tracking-widest mb-1">Phone</h5>
                    <p className="text-cream-50">+1 (212) 555-0192</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0 mt-1" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-gold-300 text-sm uppercase tracking-widest mb-1">Email</h5>
                    <p className="text-cream-50">concierge@aurum.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0 mt-1" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-gold-300 text-sm uppercase tracking-widest mb-1">Hours</h5>
                    <p className="text-cream-50">Mon-Sat: 10am - 7pm<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </GlassPanel>

            <div className="relative border border-gold-500/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center bg-gold-500/5">
              <Diamond className="w-6 h-6 text-gold-500 mb-3" strokeWidth={1.5} />
              <p className="text-cream-50 font-medium tracking-wide">Private Viewing Available</p>
              <p className="text-ink-400 text-sm mt-1">Experience our collections in total privacy.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
