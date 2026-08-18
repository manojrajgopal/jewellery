'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import CTAButton from '@/components/ui/CTAButton';
import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Collections', href: '/collections' },
  { name: 'About', href: '/about' },
  { name: 'Craftsmanship', href: '/craftsmanship' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleNavClick = (name: string) => {
    setActiveLink(name);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ${
          isScrolled ? 'pt-2' : 'pt-6'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div 
          className={`flex items-center justify-between w-full max-w-7xl mx-auto rounded-full border transition-all duration-500 ${
            isScrolled 
              ? 'bg-ink-950/90 backdrop-blur-2xl border-white/10 py-2 px-6' 
              : 'bg-ink-950/70 backdrop-blur-xl border-white/5 py-4 px-8'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0" onClick={() => handleNavClick('Home')}>
            <span className="font-accent text-gold-500 uppercase tracking-[0.25em] text-xl font-bold">
              AURUM
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.name)}
                className="relative text-sm uppercase tracking-widest text-cream-50/80 hover:text-gold-300 transition-colors py-2 group"
              >
                {link.name}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold-500 origin-left transition-transform duration-300 ease-out ${
                    activeLink === link.name ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="text-cream-50/80 hover:text-gold-300 transition-colors w-8 h-8 flex items-center justify-center relative overflow-hidden rounded-full"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ y: 30, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -30, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ y: 30, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -30, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <CTAButton variant="primary" size="sm" href="#appointment">
              Book Appointment
            </CTAButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-cream-50 hover:text-gold-300 transition-colors p-2"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-3xl flex flex-col"
          >
            <div className="flex items-center justify-between px-8 py-6">
              <span className="font-accent text-gold-500 uppercase tracking-[0.25em] text-xl font-bold">
                AURUM
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-cream-50 hover:text-gold-300 transition-colors p-2"
                aria-label="Close Menu"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8">
              <nav className="flex flex-col items-center w-full max-w-md">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex flex-col items-center"
                  >
                    <Link
                      href={link.href}
                      onClick={() => handleNavClick(link.name)}
                      className={`font-display text-3xl sm:text-4xl py-6 tracking-wide transition-colors ${
                        activeLink === link.name ? 'text-gold-500' : 'text-cream-50 hover:text-gold-300'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {i !== navLinks.length - 1 && (
                      <div className="w-12 h-[1px] bg-gold-500/30" />
                    )}
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12"
              >
                <CTAButton variant="primary" size="lg" href="#appointment" onClick={() => setMobileMenuOpen(false)}>
                  Book Appointment
                </CTAButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
