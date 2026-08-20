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
import LightStudySection from '@/app/_sections/home/LightStudySection';
import StylingSection from '@/app/_sections/home/StylingSection';
import ExperienceInviteSection from '@/app/_sections/home/ExperienceInviteSection';
import LexiconSection from '@/app/_sections/home/LexiconSection';
import CabinetSection from '@/app/_sections/home/CabinetSection';
import LedgerSection from '@/app/_sections/home/LedgerSection';
import ManifestoSection from '@/app/_sections/home/ManifestoSection';
import LightingRoomSection from '@/app/_sections/home/LightingRoomSection';
import ThresholdSection from '@/app/_sections/home/ThresholdSection';
import ClaspSection from '@/app/_sections/home/ClaspSection';
import HeirloomSection from '@/app/_sections/home/HeirloomSection';
import SustainabilitySection from '@/app/_sections/home/SustainabilitySection';
import SuiteSection from '@/app/_sections/home/SuiteSection';
import HelixSection from '@/app/_sections/home/HelixSection';
import GateSection from '@/app/_sections/home/GateSection';
import BlueprintSection from '@/app/_sections/home/BlueprintSection';
import AlloySection from '@/app/_sections/home/AlloySection';
import ForgeSection from '@/app/_sections/home/ForgeSection';
import CaptureSection from '@/app/_sections/home/CaptureSection';
import StrikeSection from '@/app/_sections/home/StrikeSection';
import StrandSection from '@/app/_sections/home/StrandSection';
import ApproachSection from '@/app/_sections/home/ApproachSection';
import GoldDivider from '@/components/ui/GoldDivider';

/**
 * Home is paced deliberately: four pinned scroll scenes are the page's
 * tentpoles, and they are kept far apart so the visitor never hits two long pins
 * back to back. Everything between them is ordinary vertical scroll, which is
 * what makes the pins land.
 *
 * In order down the page they are the film sequence, the threshold corridor, the
 * vitrine rail and the collections helix — and they are deliberately of
 * decreasing length as well as increasing distance apart, because a visitor's
 * tolerance for being held in one place falls the further into a page they are.
 * The corridor and the helix are the two quiet ones: no controls, nothing to
 * operate, and each is placed where the page changes what it is talking about.
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

      {/* The photography itself, admitted to. Placed between the stone turning and
          the physics of why it does that, because this is the only point on the
          page where a visitor has just been asked to judge something from an
          image and has not yet been told who lit it. */}
      <GateSection />

      {/* The physics before the vocabulary. A visitor who has just watched a stone
          turn is looking at fire and scintillation without having names for them,
          and the grading dials below are far more legible once they do. */}
      <LightStudySection />

      {/* Having just watched one turn, the visitor is handed the grading dials */}
      <StoneSchoolSection />

      {/* And then the library the dials are measured against */}
      <StoneLibrarySection />

      {/* The room the stone will actually be looked at in. Placed here because
          this is the point of maximum faith in paper — a dozen mineral names and
          four grading dials in, and nobody has yet said that our showroom light
          is the most flattering light the piece will ever have. */}
      <LightingRoomSection />

      {/* The words for all of it. Placed here because this is the point of
          maximum vocabulary debt — four dials and a dozen mineral names in,
          and nobody has yet said what a girdle is. */}
      <LexiconSection />

      {/* Tentpole three, and the quietest of them: a walk from the reference
          material into the workshop. No controls, nothing to read but five lines
          passed under. A page this long needs a corridor where it changes
          subject, and a hard cut is exactly what a building never does. */}
      <ThresholdSection />

      <CraftsmanshipSection />

      {/* The bench, by name — placed against the atelier rather than the heritage
          block, because these are the people in the photographs above. */}
      <ArtisansSection />

      {/* The making run, in the order it actually happens. The page has always
          shown finished work being refined and has never shown the two days
          before that, when the material is not yet an object: a drawing, an
          alloy, a forge, a setting, a punch. It sits here rather than earlier
          because none of it means anything until the people at the bench have
          been introduced by name — these are the five things the faces above
          spend their week doing.

          The pacing rule holds. Nothing in this run pins, every scene is driven
          by ordinary scroll, and the two that hold a reader longest — the forge
          and the polishing bench — are separated by the setting, which is over
          in four seconds. */}
      <BlueprintSection />

      <AlloySection />

      <ForgeSection />

      <CaptureSection />

      {/* Genuinely the last thing done to a finished piece, so it closes the
          run rather than sitting anywhere inside it. */}
      <StrikeSection />

      {/* The most bench-side subject on the page, next to the people whose
          decision it actually is. Every other section here is about what a piece
          looks like; this one is about whether it gets worn. */}
      <ClaspSection />

      {/* The same question from the other end: a clasp is how a necklace is
          closed and a knot is how it survives being open. Adjacent on purpose —
          both are engineering decisions taken by a bench rather than by a
          designer, and apart they would each read as a curiosity. */}
      <StrandSection />

      {/* The collections as objects rather than as a display — dealt, cut and
          thrown. Sits here rather than in the browsing run because handing
          something over only means anything once the looking is finished. */}
      <CabinetSection />

      {/* Tentpole two: collections passing sideways */}
      <VitrineSection />

      <GoldDivider variant="wide" className="px-6" />

      <HeritageSection />

      {/* Custody and the outside verification of it, straight after the history —
          the claim and its evidence belong on the same stretch of page. */}
      <ProvenanceSection />

      {/* The claims themselves, weighted by what they are worth as evidence —
          including the two this house cannot make. The custody claim is above;
          this is the audit of it. */}
      <LedgerSection />

      {/* The same discipline, applied to what the house can measure rather than
          to what it can prove. Adjacent to the provenance audit on purpose —
          apart, each would borrow credibility from the other without earning it. */}
      <SustainabilitySection />

      {/* And the question asked from the other end: somebody holding an object
          whose history nobody recorded, deciding what happens to it next. */}
      <HeirloomSection />

      {/* The practical half: sizer, live rates, restoration bench */}
      <AtelierToolsSection />

      {/* A held breath before the commercial half of the page. No controls, no
          reading — one shot, and the house saying what it is for. */}
      <ManifestoSection />

      {/* The house's positions, stacked. Far from the lookbook rail, so the two
          sticky stacks never sit back to back. */}
      <JournalSection />

      {/* The commission itself — a ring the visitor draws, priced live */}
      <BespokeSection />

      {/* What it says and what it arrives in — asked only once something is chosen */}
      <PresentationSection />

      {/* The band that has to live beside the ring for fifty years. Straight
          after the commission, because the head height just chosen has already
          decided which bands are available — a year before anybody finds out. */}
      <SuiteSection />

      <TestimonialsSection />

      {/* Four questions, scored against the catalogue */}
      <GiftFinderSection />

      {/* The wearer's own three constraints, answered in inches and outlines. The
          gift finder above scores pieces against an occasion; this scores pieces
          against the person wearing them, which is a different question. */}
      <StylingSection />

      <ServicesSection />

      {/* Everything the visitor has saved, arranged by them, plus the two guides
          they reach for while deciding. Late on purpose: by here most people have
          saved something, so the board is not empty. */}
      <MoodboardSection />

      {/* The catalogue's last appearance, and the only one that refuses
          comparison: six collections threaded on one axis and met singly. */}
      <HelixSection />

      {/* The three questions about timing — the doors, the money, the occasion */}
      <PrivateViewSection />

      {/* The page's one camera move, at the point where the subject changes
          from what we have to coming here. A change of subject that large
          deserves a shot rather than a heading, and this is the only place on
          the site where the camera itself travels rather than the layers being
          pushed about under a pointer. */}
      <ApproachSection />

      {/* What the room is actually like, before the address of it */}
      <ExperienceInviteSection />

      {/* Somewhere concrete for the appointment form to point at */}
      <BoutiqueSection />

      <AppointmentSection />

      <CTASection />
    </>
  );
}
