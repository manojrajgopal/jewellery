import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Jost, Marcellus } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/motion/ScrollProgress';
import Preloader, { introInitScript } from '@/components/motion/Preloader';
import CustomCursor from '@/components/motion/CustomCursor';
import SmoothScroll from '@/components/motion/SmoothScroll';
import BackToTop from '@/components/motion/BackToTop';
import PageTransition from '@/components/motion/PageTransition';
import ThemeProvider, { themeInitScript } from '@/components/providers/ThemeProvider';
import ToastProvider from '@/components/providers/ToastProvider';

/* ---------------------------------------------------------------------------
   Typography — high-contrast Didone display, roman-capital accent, geometric
   sans for body. Exposed as CSS variables that tailwind.config.ts consumes.
--------------------------------------------------------------------------- */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-accent',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aurum.example.com'),
  title: {
    default: 'AURUM | Luxury Jewellers Since 1892',
    template: '%s | AURUM',
  },
  description:
    'Four generations of master artisans crafting timeless gold, diamond, and gemstone jewellery. BIS Hallmarked, GIA Certified.',
  keywords: [
    'luxury jewellery',
    'fine jewellery',
    'gold',
    'diamond',
    'gemstone',
    'bespoke design',
    'AURUM',
    'master artisans',
  ],
  authors: [{ name: 'AURUM' }],
  openGraph: {
    title: 'AURUM | Luxury Jewellers Since 1892',
    description:
      'Four generations of master artisans crafting timeless gold, diamond, and gemstone jewellery.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AURUM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURUM | Luxury Jewellers Since 1892',
    description: 'Timeless elegance, crafted in gold since 1892.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Light is the default theme, and the choice is ours rather than the OS's, so
  // a single value is correct here; ThemeProvider rewrites it on toggle.
  themeColor: '#faf6ef',
  width: 'device-width',
  initialScale: 1,
};

const HOME_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'trust', label: 'Assurance' },
  { id: 'collections', label: 'Collections' },
  { id: 'pieces', label: 'Signature' },
  { id: 'craftsmanship', label: 'Atelier' },
  { id: 'about', label: 'Heritage' },
  { id: 'testimonials', label: 'Patrons' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Visit' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // data-intro defaults to 'seen' so the curtain stays hidden if scripting is
  // unavailable; introInitScript upgrades it to 'playing' before the first paint.
  return (
    <html lang="en" data-theme="light" data-intro="seen" suppressHydrationWarning>
      <head>
        {/* Paint the stored theme before first frame to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Decide before first paint whether this visit gets the intro curtain,
            so it can never appear on top of an already-visible page. */}
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
      </head>
      <body
        className={`${jost.variable} ${playfair.variable} ${marcellus.variable} font-sans antialiased bg-canvas text-primary overflow-x-hidden`}
      >
        <ThemeProvider>
          <ToastProvider>
            {/* Skip link for keyboard users */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:font-accent focus:text-sm focus:uppercase focus:tracking-luxe focus:text-onaccent"
            >
              Skip to content
            </a>

            <Preloader />
            <SmoothScroll />
            <CustomCursor />
            <ScrollProgress sections={HOME_SECTIONS} />

            <Navbar />

            <main id="main" className="relative">
              <PageTransition>{children}</PageTransition>
            </main>

            <Footer />
            <BackToTop />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
