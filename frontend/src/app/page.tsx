import HeroSection from '@/app/_sections/home/HeroSection';
import TrustStrip from '@/app/_sections/home/TrustStrip';
import CollectionsSection from '@/app/_sections/home/CollectionsSection';
import SignaturePieces from '@/app/_sections/home/SignaturePieces';
import CraftsmanshipSection from '@/app/_sections/home/CraftsmanshipSection';
import HeritageSection from '@/app/_sections/home/HeritageSection';
import TestimonialsSection from '@/app/_sections/home/TestimonialsSection';
import ServicesSection from '@/app/_sections/home/ServicesSection';
import AppointmentSection from '@/app/_sections/home/AppointmentSection';
import CTASection from '@/app/_sections/home/CTASection';
import GoldDivider from '@/components/ui/GoldDivider';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CollectionsSection />

      <GoldDivider variant="wide" className="px-6" />

      <SignaturePieces />
      <CraftsmanshipSection />

      <GoldDivider variant="wide" className="px-6" />

      <HeritageSection />
      <TestimonialsSection />
      <ServicesSection />
      <AppointmentSection />
      <CTASection />
    </>
  );
}
