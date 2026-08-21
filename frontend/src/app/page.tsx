import HeroSection from '@/app/_sections/home/HeroSection';
import TrustStrip from '@/app/_sections/home/TrustStrip';
import CollectionsSection from '@/app/_sections/home/CollectionsSection';
import CoverflowSection from '@/app/_sections/home/CoverflowSection';
import FilmSection from '@/app/_sections/home/FilmSection';
import ShowcaseSection from '@/app/_sections/home/ShowcaseSection';
import VitrineSection from '@/app/_sections/home/VitrineSection';
import CraftsmanshipSection from '@/app/_sections/home/CraftsmanshipSection';
import HeritageSection from '@/app/_sections/home/HeritageSection';
import AtelierToolsSection from '@/app/_sections/home/AtelierToolsSection';
import TestimonialsSection from '@/app/_sections/home/TestimonialsSection';
import ServicesSection from '@/app/_sections/home/ServicesSection';
import GiftFinderSection from '@/app/_sections/home/GiftFinderSection';
import CTASection from '@/app/_sections/home/CTASection';
import LookbookSection from '@/app/_sections/home/LookbookSection';
import ArtisansSection from '@/app/_sections/home/ArtisansSection';
import ProvenanceSection from '@/app/_sections/home/ProvenanceSection';
import JournalSection from '@/app/_sections/home/JournalSection';
import ExperienceInviteSection from '@/app/_sections/home/ExperienceInviteSection';
import LexiconSection from '@/app/_sections/home/LexiconSection';
import LedgerSection from '@/app/_sections/home/LedgerSection';
import ManifestoSection from '@/app/_sections/home/ManifestoSection';
import LightingRoomSection from '@/app/_sections/home/LightingRoomSection';
import ThresholdSection from '@/app/_sections/home/ThresholdSection';
import HeirloomSection from '@/app/_sections/home/HeirloomSection';
import SustainabilitySection from '@/app/_sections/home/SustainabilitySection';
import SuiteSection from '@/app/_sections/home/SuiteSection';
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
 * Home is paced deliberately: three pinned scroll scenes are the page's
 * tentpoles, and they are kept far apart so the visitor never hits two long pins
 * back to back. Everything between them is ordinary vertical scroll, which is
 * what makes the pins land.
 *
 * In order down the page they are the film sequence, the threshold corridor and
 * the vitrine rail — deliberately of decreasing length as well as increasing
 * distance apart, because a visitor's tolerance for being held in one place falls
 * the further into a page they are. The corridor is the quiet one: no controls,
 * nothing to operate, placed where the page changes what it is talking about.
 *
 * The same rule governs the two sticky stacks. A sticky stack behaves like a
 * short pin, so the lookbook rail and the journal positions are separated by the
 * whole atelier run — and neither is placed adjacent to a tentpole.
 *
 * Order follows the arc of a visit rather than importance: look, then understand,
 * then trust, then decide, then arrange.
 *
 * ---------------------------------------------------------------------------
 * What this page deliberately does *not* carry
 * ---------------------------------------------------------------------------
 * Home is a route through the house, not a second copy of it. Fourteen sections
 * that duplicated a dedicated page were taken out, because a visitor who reaches
 * the same tool twice learns nothing the second time and the page pays for it
 * either way. The stone reference belongs to /gemstones, fit and wear to /care,
 * the product grid to /collections, the commission studio to /bespoke, engraving
 * and packaging to /bespoke and /services, the locator and the booking form to
 * /contact. What is kept here is the material that exists nowhere else — the film,
 * the corridor, the vitrine, the turnable stone, the five-step making run — plus
 * the short teasers that send a visitor to the page that owns the subject.
 *
 * Sections are rendered and hydrated normally. Deferring hydration per section
 * was tried and abandoned: React cannot hydrate a subtree whose render
 * suspended, so a Suspense boundary used that way discards its server HTML and
 * client-renders instead — which either blanks the section or saves nothing,
 * depending on the fallback. The cost is dealt with where it actually lives
 * instead: the scenes themselves no longer run when they are off screen.
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

      {/* The knot is an engineering decision taken by a bench rather than by a
          designer, which is why it sits at the end of the making run rather than
          anywhere near the catalogue. Its former neighbour — the clasp library —
          now lives only on /care, where the rest of the wear-and-fit material is. */}
      <StrandSection />

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

      {/* The band that has to live beside the ring for fifty years. Straight
          after the commission, because the head height just chosen has already
          decided which bands are available — a year before anybody finds out. */}
      <SuiteSection />

      <TestimonialsSection />

      {/* Four questions, scored against the catalogue */}
      <GiftFinderSection />

      <ServicesSection />

      {/* The page's one camera move, at the point where the subject changes
          from what we have to coming here. A change of subject that large
          deserves a shot rather than a heading, and this is the only place on
          the site where the camera itself travels rather than the layers being
          pushed about under a pointer. */}
      <ApproachSection />

      {/* What the room is actually like, before the address of it */}
      <ExperienceInviteSection />

      <CTASection />
    </>
  );
}
