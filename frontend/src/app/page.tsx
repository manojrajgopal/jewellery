import HeroSection from '@/app/_sections/home/HeroSection';
import TrustStrip from '@/app/_sections/home/TrustStrip';
import CollectionsSection from '@/app/_sections/home/CollectionsSection';
import CoverflowSection from '@/app/_sections/home/CoverflowSection';
import SignaturePieces from '@/app/_sections/home/SignaturePieces';
import FilmSection from '@/app/_sections/home/FilmSection';
import ShowcaseSection from '@/app/_sections/home/ShowcaseSection';
import VitrineSection from '@/app/_sections/home/VitrineSection';
import CraftsmanshipSection from '@/app/_sections/home/CraftsmanshipSection';
import HeritageSection from '@/app/_sections/home/HeritageSection';
import AtelierToolsSection from '@/app/_sections/home/AtelierToolsSection';
import TestimonialsSection from '@/app/_sections/home/TestimonialsSection';
import ServicesSection from '@/app/_sections/home/ServicesSection';
import AppointmentSection from '@/app/_sections/home/AppointmentSection';
import CTASection from '@/app/_sections/home/CTASection';
import GoldDivider from '@/components/ui/GoldDivider';

/**
 * Home is paced deliberately: two pinned scroll scenes (the film sequence and
 * the vitrine rail) are the page's tentpoles, and they are kept far apart so the
 * visitor never hits two long pins back to back. Everything between them is
 * ordinary vertical scroll, which is what makes the pins land.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CollectionsSection />

      <GoldDivider variant="wide" className="px-6" />

      {/* Browse — coverflow rail, then the orbiting pieces */}
      <CoverflowSection />

      <SignaturePieces />

      {/* Tentpole one: the house's story as a scroll-scrubbed film */}
      <FilmSection />

      {/* The stone itself — drawn, lit and turnable */}
      <ShowcaseSection />

      <CraftsmanshipSection />

      {/* Tentpole two: collections passing sideways */}
      <VitrineSection />

      <GoldDivider variant="wide" className="px-6" />

      <HeritageSection />

      {/* The practical half: sizer, live rates, restoration bench */}
      <AtelierToolsSection />

      <TestimonialsSection />
      <ServicesSection />
      <AppointmentSection />
      <CTASection />
    </>
  );
}
