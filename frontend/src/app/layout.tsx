import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Jost, Marcellus } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/motion/ScrollProgress';
import Preloader, { introInitScript } from '@/components/motion/Preloader';
import { perfInitScript } from '@/lib/perf';
import CustomCursor from '@/components/motion/CustomCursor';
import SmoothScroll from '@/components/motion/SmoothScroll';
import BackToTop from '@/components/motion/BackToTop';
import PageTransition from '@/components/motion/PageTransition';
import ThemeProvider, { themeInitScript } from '@/components/providers/ThemeProvider';
import PerfProbe from '@/components/providers/PerfProbe';
import OffscreenAnimationPause from '@/components/perf/OffscreenAnimationPause';
import ToastProvider from '@/components/providers/ToastProvider';
import CinemaProvider, { cinemaInitScript } from '@/components/providers/CinemaProvider';
import KeyboardLayer from '@/components/providers/KeyboardLayer';
import FilmGrain from '@/components/motion/FilmGrain';
import GoldDustTrail from '@/components/motion/GoldDustTrail';
import ClickSparkle from '@/components/motion/ClickSparkle';
import ScrollVelocitySkew from '@/components/motion/ScrollVelocitySkew';
import IdleAttractLoop from '@/components/motion/IdleAttractLoop';
import CompareTray from '@/components/ui/CompareTray';
import ConciergeDock from '@/components/ui/ConciergeDock';

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

// Order must match the order the sections actually appear in app/page.tsx —
// the navigator reads scroll position against this list, so a stale entry makes
// the dots jump. An entry for a section that no longer exists is worse than a
// wrong one: the observer never finds the element, so that dot can never light
// and every dot after it reads one position behind the page.
const HOME_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'trust', label: 'Assurance' },
  { id: 'collections', label: 'Collections' },
  { id: 'coverflow', label: 'Cabinet' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'film', label: 'The Film' },
  { id: 'showcase', label: 'The Stone' },
  { id: 'gate', label: 'Four Exposures' },
  { id: 'threshold', label: 'Come Through' },
  { id: 'craftsmanship', label: 'Atelier' },
  { id: 'artisans', label: 'The Bench' },
  { id: 'blueprint', label: 'The Drawing' },
  { id: 'alloy', label: 'The Mixture' },
  { id: 'forge', label: 'The Forge' },
  { id: 'capture', label: 'The Setting' },
  { id: 'strike', label: 'The Strike' },
  { id: 'strand', label: 'The Strand' },
  { id: 'vitrine', label: 'Vitrine' },
  { id: 'about', label: 'Heritage' },
  { id: 'manifesto', label: 'What For' },
  { id: 'journal', label: 'Journal' },
  { id: 'testimonials', label: 'Patrons' },
  { id: 'services', label: 'Services' },
  { id: 'approach', label: 'The Door' },
  { id: 'experiences', label: 'In Person' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // data-intro defaults to 'seen' so the curtain stays hidden if scripting is
  // unavailable; introInitScript upgrades it to 'playing' before the first paint.
  return (
    // data-perf must be declared here even though perfInitScript writes the real
    // value before first paint. React reconciles <html> on hydration and strips
    // any attribute it does not own — data-theme/intro/cinema survive precisely
    // because they are declared, and data-perf was silently being removed, which
    // disabled the entire performance-tier system (every CSS blur reduction,
    // canvas DPR cap and SmoothScroll gate keys off this attribute). The literal
    // 'high' is only the SSR placeholder; suppressHydrationWarning lets the
    // script's real tier stand, exactly as it does for the theme.
    <html
      lang="en"
      data-theme="light"
      data-intro="seen"
      data-cinema="off"
      data-perf="high"
      suppressHydrationWarning
    >
      <head>
        {/* Paint the stored theme before first frame to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Decide before first paint whether this visit gets the intro curtain,
            so it can never appear on top of an already-visible page. */}
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
        {/* Cinema mode grades the page through CSS variables, so the attribute
            has to land before the first paint or the page renders ungraded and
            then visibly darkens. */}
        <script dangerouslySetInnerHTML={{ __html: cinemaInitScript }} />
        {/* Classify the device before anything is painted. Every expensive
            declaration on the site — the very large blurs, the backdrop
            filters, the canvas resolutions — is keyed off data-perf, so doing
            this from React instead would mean painting one full frame at
            desktop cost on exactly the hardware that cannot afford it. */}
        <script dangerouslySetInnerHTML={{ __html: perfInitScript }} />
      </head>
      <body
        className={`${jost.variable} ${playfair.variable} ${marcellus.variable} font-sans antialiased bg-canvas text-primary overflow-x-hidden`}
      >
        <ThemeProvider>
          <CinemaProvider>
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
              <GoldDustTrail />
              <ClickSparkle />
              {/* Writes the scroll-inertia variables; only opted-in elements
                  read them, so nothing global is ever transformed. */}
              <ScrollVelocitySkew />
              <ScrollProgress sections={HOME_SECTIONS} />

              <Navbar />

              <main id="main" className="relative">
                <PageTransition>{children}</PageTransition>
              </main>

              <Footer />
              <BackToTop />

              {/* Shows itself only once something has been added to it. */}
              <CompareTray />

              {/* Bottom-left, opposite BackToTop and the compare tray so the three
                  never overlap. Hides itself on /contact, where everything it
                  offers is already on the page. */}
              <ConciergeDock />

              {/* After a long stretch of no input at all, the page stops waiting
                  and says something. Any input dismisses it instantly, and it
                  never appears at all under a reduced-motion preference. */}
              <IdleAttractLoop />

              {/* Projection layer sits above the page, below the cursor. */}
              <FilmGrain />

              {/* Owns the keyboard shortcuts and the two overlays they open. */}
              <KeyboardLayer />

              {/* Measures real frame intervals once the page is idle and lowers
                  the tier if the device cannot hold the rate the static
                  signals promised. */}
              <PerfProbe />

              {/* The CSS counterpart to the canvas scenes' visibility gating:
                  animations in sections far from the viewport hold their
                  position instead of ticking every frame. */}
              <OffscreenAnimationPause />
            </ToastProvider>
          </CinemaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
