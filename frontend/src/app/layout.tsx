import { Cormorant_Garamond, Inter, Cinzel } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/motion/ScrollProgress';
import type { Metadata } from 'next';

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AURUM | Luxury Jewellers Since 1892',
  description: 'Four generations of master artisans crafting timeless gold, diamond, and gemstone jewellery. BIS Hallmarked, GIA Certified.',
  keywords: 'luxury jewelry, gold, diamond, gemstone, fine jewelry, AURUM, master artisans',
  openGraph: {
    title: 'AURUM | Luxury Jewellers Since 1892',
    description: 'Four generations of master artisans crafting timeless gold, diamond, and gemstone jewellery.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AURUM',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${cormorant.variable} ${cinzel.variable} font-sans antialiased bg-canvas text-cream-50 overflow-x-hidden`}>
        <ScrollProgress />
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
