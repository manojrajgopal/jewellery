'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const STAGES = [
  {
    title: 'Design Sketch',
    description: 'Every masterpiece begins with a vision. Our master designers translate inspiration into intricate sketches, capturing the essence of the final creation.',
    image: '/images/hero/craftsmanship.jpg'
  },
  {
    title: 'Wax Modeling',
    description: 'Precision meets artistry in every curve. The 2D design is painstakingly sculpted into a 3D wax model, ensuring perfect proportions before casting.',
    image: '/images/collections/bridal.jpg'
  },
  {
    title: 'Gold Casting',
    description: 'Ancient techniques, modern perfection. Molten gold is poured into the mold, a transformative moment where precious metal takes its eternal shape.',
    image: '/images/collections/heritage.jpg'
  },
  {
    title: 'Stone Setting',
    description: 'Each gem placed with surgical precision. Our master setters secure every diamond and gemstone by hand, maximizing brilliance and security.',
    image: '/images/collections/statement.jpg'
  },
  {
    title: 'Final Polish',
    description: 'Revealing the brilliance within. Hours of meticulous hand-polishing bring forth the signature AURUM mirror finish that lasts a lifetime.',
    image: '/images/products/ring.jpg'
  }
];

export default function CraftsmanshipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]); // 5 slides, move by 80%
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="craftsmanship" className="bg-ink-950 relative">
      {/* Intro Header */}
      <div className="pt-24 pb-12 px-6">
        <SectionHeading
          eyebrow="THE ATELIER"
          title="The Art of Creation"
          highlightWords={['Art']}
          align="center"
        />
      </div>

      {/* Scrollable Container - 400vh to give scrolling space */}
      <div ref={containerRef} className="h-[400vh] relative">
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: 'url("/images/noise.png")' }} />

          {/* Horizontal Strip */}
          <motion.div 
            style={{ x }} 
            className="flex w-[500vw] h-full relative z-10 items-center"
          >
            {STAGES.map((stage, idx) => (
              <div key={idx} className="w-[100vw] h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-12 lg:p-24 gap-8 lg:gap-16">
                
                {/* Image Side */}
                <div className="w-full md:w-1/2 h-[40vh] md:h-[60vh] relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={stage.image}
                    alt={stage.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 border border-gold-500/20 rounded-2xl" />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 max-w-xl">
                  <div className="flex flex-col gap-4">
                    <span className="font-display text-8xl text-gold-500/20 font-light leading-none">
                      0{idx + 1}
                    </span>
                    <h3 className="font-display text-4xl lg:text-5xl text-white -mt-8">
                      {stage.title}
                    </h3>
                    <div className="w-12 h-px bg-gold-500 my-4" />
                    <p className="font-body text-lg text-white/70 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
                
              </div>
            ))}
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-12 left-12 right-12 md:left-24 md:right-24 h-px bg-white/10 z-20">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gold-500"
              style={{ width: progressWidth }}
            />
            <div className="absolute top-0 left-0 w-full flex justify-between -mt-3">
              {STAGES.map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-ink-950 border border-gold-500/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
