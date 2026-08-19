import HeroSection from '@/app/_sections/home/HeroSection';
import TrustStrip from '@/app/_sections/home/TrustStrip';
import CollectionsSection from '@/app/_sections/home/CollectionsSection';
import CoverflowSection from '@/app/_sections/home/CoverflowSection';
import SignaturePieces from '@/app/_sections/home/SignaturePieces';
import FilmSection from '@/app/_sections/home/FilmSection';
import ShowcaseSection from '@/app/_sections/home/ShowcaseSection';
import StoneSchoolSection from '@/app/_sections/home/StoneSchoolSection';
import VitrineSection from '@/app/_sections/home/VitrineSection';
import CraftsmanshipSection from '@/app/_sections/home/CraftsmanshipSection';
import HeritageSection from '@/app/_sections/home/HeritageSection';
import AtelierToolsSection from '@/app/_sections/home/AtelierToolsSection';
import BespokeSection from '@/app/_sections/home/BespokeSection';
import TestimonialsSection from '@/app/_sections/home/TestimonialsSection';
import ServicesSection from '@/app/_sections/home/ServicesSection';
import AppointmentSection from '@/app/_sections/home/AppointmentSection';
import GiftFinderSection from '@/app/_sections/home/GiftFinderSection';
import BoutiqueSection from '@/app/_sections/home/BoutiqueSection';
import CTASection from '@/app/_sections/home/CTASection';
import LookbookSection from '@/app/_sections/home/LookbookSection';
import StoneLibrarySection from '@/app/_sections/home/StoneLibrarySection';
import ArtisansSection from '@/app/_sections/home/ArtisansSection';
import ProvenanceSection from '@/app/_sections/home/ProvenanceSection';
import JournalSection from '@/app/_sections/home/JournalSection';
import PresentationSection from '@/app/_sections/home/PresentationSection';
import PrivateViewSection from '@/app/_sections/home/PrivateViewSection';
import MoodboardSection from '@/app/_sections/home/MoodboardSection';
import GoldDivider from '@/components/ui/GoldDivider';

/**
 * Home is paced deliberately: two pinned scroll scenes (the film sequence and
 * the vitrine rail) are the page's tentpoles, and they are kept far apart so the
 * visitor never hits two long pins back to back. Everything between them is
 * ordinary vertical scroll, which is what makes the pins land.
 *
 * The same rule governs the two sticky stacks that arrived with the editorial
 * sections. A sticky stack behaves like a short pin, so the lookbook rail and the
 * journal positions are separated by the whole atelier run — and neither is placed
 * adjacent to a tentpole.
 *
 * Order follows the arc of a visit rather than importance: look, then understand,
 * then trust, then decide, then arrange. The reference material (stones, provenance,
 * the journal) sits in the middle third, where a visitor who is interested has
 * committed to reading but has not yet started choosing.
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

      {/* The season as an editorial wall, before the film — a visitor who has just
          browsed pieces is still in a looking mood, not yet a reading one. */}
      <LookbookSection />

      {/* Tentpole one: the house's story as a scroll-scrubbed film */}
      <FilmSection />

      {/* The stone itself — drawn, lit and turnable */}
      <ShowcaseSection />

      {/* Having just watched one turn, the visitor is handed the grading dials */}
      <StoneSchoolSection />

      {/* And then the library the dials are measured against */}
      <StoneLibrarySection />

      <CraftsmanshipSection />

      {/* The bench, by name — placed against the atelier rather than the heritage
          block, because these are the people in the photographs above. */}
      <ArtisansSection />

      {/* Tentpole two: collections passing sideways */}
      <VitrineSection />

      <GoldDivider variant="wide" className="px-6" />

      <HeritageSection />

      {/* Custody and the outside verification of it, straight after the history —
          the claim and its evidence belong on the same stretch of page. */}
      <ProvenanceSection />

      {/* The practical half: sizer, live rates, restoration bench */}
      <AtelierToolsSection />

      {/* The house's positions, stacked. Far from the lookbook rail, so the two
          sticky stacks never sit back to back. */}
      <JournalSection />

      {/* The commission itself — a ring the visitor draws, priced live */}
      <BespokeSection />

      {/* What it says and what it arrives in — asked only once something is chosen */}
      <PresentationSection />

      <TestimonialsSection />

      {/* Four questions, scored against the catalogue */}
      <GiftFinderSection />

      <ServicesSection />

      {/* Everything the visitor has saved, arranged by them, plus the two guides
          they reach for while deciding. Late on purpose: by here most people have
          saved something, so the board is not empty. */}
      <MoodboardSection />

      {/* The three questions about timing — the doors, the money, the occasion */}
      <PrivateViewSection />

      {/* Somewhere concrete for the appointment form to point at */}
      <BoutiqueSection />

      <AppointmentSection />
      <CTASection />
    </>
  );
}
