'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import GradientOrb from '@/components/ui/GradientOrb';
import { Star } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

// Fallback data if needed
const defaultTestimonials = [
  { id: 1, name: "Eleanor V.", location: "New York", product: "Bespoke Diamond Ring", quote: "The craftsmanship is unparalleled. They didn't just make a ring; they captured our story in platinum and diamonds.", rating: 5, initials: "EV", color: "bg-burgundy-900" },
  { id: 2, name: "James C.", location: "London", product: "Heritage Timepiece", quote: "A truly remarkable experience from consultation to delivery. The piece exceeded every expectation.", rating: 5, initials: "JC", color: "bg-ink-800" },
  { id: 3, name: "Sophia M.", location: "Paris", product: "Sapphire Pendant", quote: "AURUM's attention to detail is astonishing. The sapphire reflects light in ways I never thought possible.", rating: 5, initials: "SM", color: "bg-gold-900" },
  { id: 4, name: "William T.", location: "Geneva", product: "Classic Gold Bangles", quote: "An heirloom that will stay in our family for generations. The quality speaks for itself.", rating: 5, initials: "WT", color: "bg-burgundy-900" },
  { id: 5, name: "Olivia R.", location: "Milan", product: "Diamond Tennis Bracelet", quote: "Every time I wear it, I feel an extraordinary sense of elegance. True artistry.", rating: 5, initials: "OR", color: "bg-ink-800" },
  { id: 6, name: "Alexander K.", location: "Dubai", product: "Emerald Earrings", quote: "The design is bold yet timeless. AURUM has set a new standard for luxury.", rating: 5, initials: "AK", color: "bg-gold-900" }
];

export default function TestimonialsSection() {
  const data = testimonials?.length ? testimonials : defaultTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [data.length, isPaused]);

  const activeTestimonial = data[activeIndex];

  return (
    <section id="testimonials" className="relative w-full py-24 bg-ink-950 overflow-hidden">
      <GradientOrb color="gold" size="lg" position="bottom-right" className="opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="VOICES OF ELEGANCE"
          title="What Our Patrons Say"
          highlightWords={['Patrons']}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Orbital UI */}
          <div 
            className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Orbit Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[60%] h-[60%] rounded-full border border-gold-500/15" />
              <div className="absolute w-[90%] h-[90%] rounded-full border border-gold-500/15" />
            </div>

            {/* Active Center Avatar */}
            <div className="relative z-20 w-24 h-24 rounded-full border-2 border-gold-500 p-1 bg-ink-950 flex items-center justify-center shadow-[0_0_30px_rgba(212,168,67,0.2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full h-full rounded-full flex items-center justify-center text-2xl font-display text-gold-100 ${activeTestimonial.color || 'bg-burgundy-900'}`}
                >
                  {activeTestimonial.initials || activeTestimonial.name.charAt(0)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Orbiting Avatars */}
            <div className="absolute inset-0 animate-[spin_40s_linear_infinite] hover:[animation-play-state:paused]">
              {data.map((t, i) => {
                const angle = (i / data.length) * 360;
                const radius = i % 2 === 0 ? '45%' : '30%'; 
                
                return (
                  <div
                    key={t.id}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius})`,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <button
                      onClick={() => setActiveIndex(i)}
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gold-500/30 p-0.5 hover:border-gold-500 transition-colors z-30 animate-[spin_40s_linear_infinite_reverse]"
                    >
                      <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-display text-gold-100 ${t.color || 'bg-ink-800'}`}>
                        {t.initials || t.name.charAt(0)}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-center min-h-[300px]">
            <span className="font-display text-8xl text-gold-500/20 leading-none h-16">&ldquo;</span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
              >
                <p className="font-display text-2xl md:text-3xl italic text-cream-50 leading-relaxed mb-8">
                  {activeTestimonial.quote}
                </p>
                
                <div className="flex space-x-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < (activeTestimonial.rating || 5) ? 'fill-gold-500 text-gold-500' : 'text-ink-700'}`}
                    />
                  ))}
                </div>
                
                <div>
                  <h4 className="font-display text-xl text-gold-300">{activeTestimonial.name}</h4>
                  <p className="text-ink-400 text-sm mt-1">
                    {activeTestimonial.location} &bull; <span className="text-gold-700">{activeTestimonial.product}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
}
