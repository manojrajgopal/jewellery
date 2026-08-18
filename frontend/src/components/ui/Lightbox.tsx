'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface LightboxImage {
  src: string;
  alt: string;
  category?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen viewer with directional slide transitions, keyboard control,
 * a drag-to-dismiss gesture, and a thumbnail rail.
 */
export default function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => setIndex(initialIndex), [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goNext, goPrev]);

  const current = images[index];

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[160] flex items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
        >
          <div className="absolute inset-0 bg-ink-950/96 backdrop-blur-2xl" />

          {/* Controls */}
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="absolute right-5 top-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-ink-900/70 text-cream-50 backdrop-blur-md transition-all duration-300 hover:border-gold-500/50 hover:text-accent"
          >
            <X size={22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-ink-900/70 text-cream-50 backdrop-blur-md transition-all duration-300 hover:border-gold-500/50 hover:text-accent md:left-8"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-ink-900/70 text-cream-50 backdrop-blur-md transition-all duration-300 hover:border-gold-500/50 hover:text-accent md:right-8"
          >
            <ChevronRight size={22} />
          </button>

          {/* Plate */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 70, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -70, scale: 0.94 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -90) goNext();
                if (info.offset.x > 90) goPrev();
              }}
              className="relative z-20 h-[64vh] w-[86vw] cursor-grab active:cursor-grabbing md:h-[74vh] md:w-[70vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain drag-none"
                sizes="86vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Caption + thumbnails */}
          <div
            className="absolute inset-x-0 bottom-5 z-30 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="px-6 text-center font-display text-lg text-cream-50">{current.alt}</p>

            <div className="scrollbar-hide flex max-w-[92vw] gap-2 overflow-x-auto px-4">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`View ${img.alt}`}
                  className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border transition-all duration-300 ${
                    i === index
                      ? 'border-gold-400 opacity-100'
                      : 'border-transparent opacity-40 hover:opacity-80'
                  }`}
                >
                  <Image src={img.src} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>

            <span className="font-accent text-xs tracking-luxe text-ink-400 tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
