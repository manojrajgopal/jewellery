'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Menu, X, Search, Heart } from 'lucide-react';
import CTAButton from '@/components/ui/CTAButton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchPalette from '@/components/ui/SearchPalette';
import { useWishlist } from '@/hooks/useWishlist';

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
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const pathname = usePathname();
  const { count } = useWishlist();
  const { scrollY } = useScroll();

  // Condense on scroll; hide entirely when descending fast, reveal on the way up.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > previous && latest > 320 && !menuOpen);
  });

  // Cmd/Ctrl-K opens search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close the drawer whenever the route actually changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <motion.header
        initial={{ y: -110, opacity: 0 }}
        animate={{ y: hidden ? -140 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[100] flex justify-center px-4 transition-[padding] duration-500 ${
          scrolled ? 'pt-2' : 'pt-5'
        }`}
      >
        <motion.div
          layout
          className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border transition-all duration-500 ${
            scrolled
              ? 'border-hairline bg-canvas/85 px-5 py-2 shadow-lift backdrop-blur-2xl'
              : 'border-transparent bg-canvas/45 px-7 py-3.5 backdrop-blur-xl'
          }`}
        >
          {/* Wordmark */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <motion.span
              whileHover={{ rotate: 135, scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              aria-hidden="true"
              className="block h-2.5 w-2.5 rotate-45 bg-accent shadow-[0_0_10px_2px_rgb(var(--gold-500)/0.5)]"
            />
            <span className="font-accent text-lg uppercase tracking-luxer text-gradient-static">
              Aurum
            </span>
          </Link>

          {/* Desktop navigation with a shared sliding pill */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.name)}
                  className={`relative px-3.5 py-2 font-accent text-[11px] uppercase tracking-luxe transition-colors duration-300 ${
                    active ? 'text-accent' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {hovered === link.name && (
                    <motion.span
                      layoutId="nav-hover"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full bg-gold-500/10"
                    />
                  )}
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Utilities */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search collections"
              className="group flex h-9 items-center gap-2 rounded-full border border-hairline px-3 text-muted transition-colors duration-300 hover:border-gold-500/40 hover:text-accent"
            >
              <Search size={15} strokeWidth={1.7} />
              <kbd className="font-sans text-[10px] tracking-widest text-faint">⌘K</kbd>
            </button>

            <Link
              href="/collections"
              aria-label={`Wishlist, ${count} saved`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-gold-500/40 hover:text-accent"
            >
              <Heart size={15} strokeWidth={1.7} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-sans text-[9px] font-medium text-onaccent"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <ThemeToggle />

            <CTAButton variant="primary" size="sm" href="/contact" className="ml-1">
              Book Appointment
            </CTAButton>
          </div>

          {/* Mobile utilities */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:text-accent"
            >
              <Search size={18} strokeWidth={1.7} />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:text-accent"
            >
              <Menu size={22} strokeWidth={1.7} />
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* Full-screen mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[120] flex flex-col bg-canvas/97 backdrop-blur-3xl"
          >
            {/* Ambient wash */}
            <div className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-60" />

            <div className="relative flex items-center justify-between px-7 py-5">
              <span className="font-accent text-lg uppercase tracking-luxer text-gradient-static">
                Aurum
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-primary transition-colors hover:border-gold-500/40 hover:text-accent"
              >
                <X size={22} strokeWidth={1.7} />
              </button>
            </div>

            <nav className="relative flex flex-1 flex-col items-center justify-center gap-1 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full max-w-sm"
                >
                  <Link
                    href={link.href}
                    className={`group flex items-baseline justify-between border-b border-hairline py-4 font-display text-3xl transition-colors sm:text-4xl ${
                      isActive(link.href) ? 'text-accent' : 'text-primary hover:text-accent'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="font-sans text-[10px] tracking-luxe text-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + navLinks.length * 0.06 }}
                className="mt-10"
              >
                <CTAButton variant="primary" size="lg" href="/contact" showArrow>
                  Book Appointment
                </CTAButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
