'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export default function RevealImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-square',
  priority = false
}: RevealImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full ${aspectRatio} ${className}`}>
      {!isLoaded && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent"
        />
      )}
      <motion.div
        initial={{ scale: 1.02, filter: 'blur(10px)' }}
        animate={{
          scale: isLoaded ? 1 : 1.02,
          filter: isLoaded ? 'blur(0px)' : 'blur(10px)'
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}
