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

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CollectionsSection />
      
      {/* Subtle Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      
      <SignaturePieces />
      <CraftsmanshipSection />
      
      {/* Subtle Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      
      <HeritageSection />
      <TestimonialsSection />
      <ServicesSection />
      <AppointmentSection />
      <CTASection />
    </>
  );
}
