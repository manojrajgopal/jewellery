'use client';

import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import ClientVault from '@/components/ui/ClientVault';
import HeirloomNote from '@/components/ui/HeirloomNote';
import StackBuilder from '@/components/ui/StackBuilder';
import HouseCircle from '@/components/ui/HouseCircle';
import AnniversaryDial from '@/components/ui/AnniversaryDial';
import OccasionReminder from '@/components/ui/OccasionReminder';
import OwnershipLedger from '@/components/ui/OwnershipLedger';
import ReadingQueue from '@/components/ui/ReadingQueue';
import StitchPathReveal from '@/components/motion/StitchPathReveal';

import MosaicShuffle from '@/components/motion/MosaicShuffle';
import KaleidoscopeGem from '@/components/motion/KaleidoscopeGem';
import BokehDrift from '@/components/motion/BokehDrift';
import StageSweep from '@/components/motion/StageSweep';
import EchoTrailText from '@/components/motion/EchoTrailText';
import ScrollSpineTimeline, { type SpineNode } from '@/components/motion/ScrollSpineTimeline';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import RippleGrid from '@/components/motion/RippleGrid';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import PortfolioBalance from '@/components/ui/PortfolioBalance';
import MetalRateHistory from '@/components/ui/MetalRateHistory';
import CoverageGap from '@/components/ui/CoverageGap';
import AtelierToolsSection from '@/app/_sections/home/AtelierToolsSection';

/**
 * What the house does with a piece over a lifetime, as the sequence it actually
 * happens in rather than as a list of services.
 *
 * Written as intervals rather than as dates because a vault page is read by
 * somebody at an unknown point in that sequence, and 'every eighteen months' is
 * useful to all of them where '2027' is useful to none.
 */
const LIFETIME: SpineNode[] = [
  {
    marker: 'Day one',
    title: 'The file opens',
    body: 'Sizes, the alloy, the stone\u2019s report number, and a photograph of the piece before it has been worn. Everything a claim or a repair will ever need, recorded while it is still easy.',
    aside: 'Kept whether or not you ever come back',
  },
  {
    marker: 'Month 6',
    title: 'The first check',
    body: 'Claws settle in the first half-year more than in the ten after it. We look at every one of them, tighten what has moved, and say nothing if nothing has.',
    aside: 'No charge, no appointment, no receipt needed',
  },
  {
    marker: 'Every 18 months',
    title: 'Clean, and look again',
    body: 'An ultrasonic bath for what can take it and a hand clean for what cannot, then the same claw check under ten magnifications. This is the interval at which a loose stone is still a tightening rather than a loss.',
  },
  {
    marker: 'Year 3',
    title: 'Revalue',
    body: 'Metal and stone prices move enough in three years to underinsure a piece by a third. A written valuation at replacement cost, dated, in a form an insurer accepts.',
    aside: 'The commonest cause of a low settlement is an old valuation',
  },
  {
    marker: 'Year 10',
    title: 'The first real service',
    body: 'Shank thinning is measured rather than guessed at, worn claw tips are re-tipped rather than polished away, and any plating is renewed. This is the point at which a well-made ring stops being new and starts being kept.',
  },
  {
    marker: 'Whenever',
    title: 'It changes hands',
    body: 'Resized for a different finger, reset into something the next wearer will actually wear, or simply recorded against a new name. The file follows the piece, not the buyer.',
    aside: 'The only entry here with no interval attached',
  },
];

/**
 * The visitor's own page.
 *
 * Four stores on this site already remember things — saved pieces, the compare
 * tray, what has been looked at, and the dates somebody asked us to count down
 * to — and until now none of them had a page. The tray showed three pieces, the
 * drawer showed the list, and nothing showed the whole picture of a decision that
 * has taken four visits to make.
 *
 * Ordered as a returning visitor's session actually goes: what did I save, what
 * was I comparing, what am I building, what do I want written in the lid, and when
 * is the day I need it by. The stack builder sits in the middle because it is the
 * one thing on the page that *makes* something new rather than recalling it.
 *
 * Not indexed, and it says on its face that there is no account behind it. A page
 * that looks like a customer record but is really localStorage has to be explicit
 * about that, or it is a promise the house has not made.
 */
export default function VaultClient() {
  return (
    <>
      <PageBanner
        title="Your Vault"
        subtitle="Everything this browser has been asked to remember"
        breadcrumbs={[{ label: 'Vault' }]}
        backgroundImage="/images/collections/heritage.jpg"
        compact
      />

      <div className="overflow-hidden bg-canvas">
        {/* ---- The ledger ---- */}
        <section className="relative py-16 md:py-24">
          <RippleGrid spacing={40} reach={150} push={9} />
          <div className="relative mx-auto max-w-6xl px-6">
            <SectionHeading
              align="left"
              eyebrow="The Ledger"
              title="Where a decision that took four visits adds up"
              highlightWords={['four']}
              subtitle="Saved pieces, the comparison tray, what you have looked at, and the dates you asked us to keep. All of it held on this device only."
            />
            <ClientVault className="mt-12" />
          </div>
        </section>

        <GoldRibbonWeave className="px-6" height={100} ribbons={4} />

        {/* ---- Build something ---- */}
        <section className="relative border-y border-hairline bg-canvas-alt py-20 md:py-28">
          <div className="relative mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="The Stack"
              title="Six bands, in the order they will sit"
              highlightWords={['order']}
              subtitle="A stack cannot be judged one band at a time. Add them, drag them into the order they will be worn in, and watch what changing the order does to the whole object."
            />
            <StackBuilder className="mt-14" />
          </div>
        </section>

        {/* ---- The note ---- */}
        <CinematicLetterbox slate="The Card In The Lid" slateNote="Written beforehand, not at the counter" barHeight={0.08}>
          <section className="relative py-20 md:py-28">
            <CausticsCanvas intensity={0.5} />
            <div className="relative mx-auto max-w-6xl px-6">
              <SectionHeading
                eyebrow="What It Says"
                title="The part that is kept in a drawer for thirty years"
                highlightWords={['thirty']}
                subtitle="Nobody writes this well standing at a counter with a borrowed pen. Write it here, see it set on the stock we actually print, and bring the words in."
              />
              <HeirloomNote className="mt-14" />
            </div>
          </section>
        </CinematicLetterbox>

        {/* ---- The date ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
          <div className="relative mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="The Day"
              title="Work backwards from the date, not forwards from today"
              highlightWords={['backwards']}
              subtitle="A commission is twelve weeks and a resize is ten days. Tell this page the date and it will tell you which of those is still available to you."
            />
            <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
              <OccasionReminder />
              <aside className="self-start rounded-3xl border border-hairline bg-canvas/60 p-6">
                <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                  Lead times, honestly
                </span>
                <dl className="mt-4 space-y-3 font-sans text-xs">
                  {[
                    ['Clean and prong check', 'Same day'],
                    ['Resize or engraving', '7–10 days'],
                    ['A piece from the cases, sized', '2–3 weeks'],
                    ['Bespoke, drawing to hand', '12–16 weeks'],
                    ['Restoration of an heirloom', 'Up to 18 months'],
                  ].map(([what, when]) => (
                    <div key={what} className="flex justify-between gap-4 border-b border-hairline pb-2">
                      <dt className="text-muted">{what}</dt>
                      <dd className="whitespace-nowrap text-right text-accent nums-tabular">{when}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 font-sans text-[11px] font-light leading-relaxed text-faint">
                  Restoration is eighteen months because it waits for the one bench that can do it,
                  and that wait is the reason the result is worth having.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* ---- Close: the archive, assembling ---- */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
              <MosaicShuffle
                src="/images/collections/statement.jpg"
                alt="An archive piece, assembled from the contact sheet"
                columns={7}
                from="centre"
                className="rounded-3xl border border-hairline"
              />
              <div>
                <ScrollAssembleText
                  text="Nothing here is an account"
                  as="h2"
                  highlightWords={['account']}
                  className="font-display text-3xl leading-tight text-primary sm:text-4xl"
                />
                <p className="mt-6 font-sans text-sm font-light leading-relaxed text-secondary">
                  There is no login on this website and no record of you on our side of it. Everything
                  on this page lives in your browser&rsquo;s own storage, which means it is private,
                  and also means it is fragile: clear your browsing data and it is gone. If a list
                  here matters, bring it in or write it down.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <CTAButton variant="secondary" href="/experiences" size="md" showArrow>
                    Book a visit around it
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </section>


        <GoldDivider variant="wide" className="px-6" />

        {/* ---- Afterwards ----
             Every other list on this page is about deciding: pieces saved, pieces
             compared, dates worth keeping. This is the only one that assumes the
             decision was made years ago — three pieces bought over a decade, no
             records anywhere, and a claw that has been slowly opening since 2019
             with nothing to warn anybody about it.

             The interval is computed rather than asked for, from the two things
             an owner definitely knows. A field asking somebody to nominate a
             service interval gets a guess, and the guess is always too long. */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="After The Buying"
              title="It is almost never the metal that fails"
              highlightWords={['never']}
              subtitle="Record what you own and the interval works itself out — how often it is worn and whether it has stones in it are the only two questions, and the second halves the answer. Held in this browser and nowhere else."
              align="center"
              className="mb-14"
            />

            <OwnershipLedger />

            <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
              <ReadingQueue />

              <div className="rounded-2xl border border-hairline bg-surface-raised/35 p-7">
                <StitchPathReveal motif="grid" pitch={5} duration={3}>
                  <p className="mt-4 font-accent text-[10px] uppercase tracking-luxe text-accent">
                    The tray bed
                  </p>
                  <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                    Quilted rather than flat, and the reason is mechanical: a quilted bed grips a
                    piece enough that it does not travel when the drawer is closed. Everything on
                    the ledger above is a consequence of pieces moving against each other in the
                    dark.
                  </p>
                </StitchPathReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Standing ----
             The vault is the one page addressed to somebody who has already
             bought, which makes it the only honest place to publish the tiers.
             Both routes are shown: cumulative spend, and years since the first
             piece. Somebody who bought one ring in 1998 and nothing since is a
             patron of this house, and a scheme that counts only money says
             otherwise. */}
        <section className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <StageSweep intensity={0.2} width={0.26} seconds={19} />
            <BokehDrift count={20} intensity={0.42} speed={0.55} blades={6} />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Your Standing"
              title="What we owe you afterwards"
              highlightWords={['afterwards']}
              subtitle="Every house in this trade keeps its customers in tiers and almost none publish where the lines are \u2014 which is how a house avoids ever honouring the top one. Ours are below, with both routes to each, and not one of the benefits is a discount."
              align="center"
              className="mb-14"
            />

            <HouseCircle />
          </div>
        </section>

        {/* ---- The dates ----
             Directly under the standings, because one of the two routes to a
             standing is measured in years and this is the calendar those years
             are counted on. Apart, the second route looks like an afterthought. */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <RippleGrid spacing={52} reach={180} dot={1} />

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Dates"
              title="Two traditions, and they disagree"
              highlightWords={['disagree']}
              subtitle="The older list is materials \u2014 paper, cotton, leather \u2014 and it runs out of ideas by year fifteen. The gemstone list was written by a retail jewellers\u2019 association in 1937, largely because the first list had almost no jewellery in it. Both are here, and labelled."
              align="center"
              className="mb-14"
            />

            <AnniversaryDial />
          </div>
        </section>

        {/* ---- The long sequence ----
             Drawn rather than listed. The line arrives at each entry as you
             scroll to it, which is the only way to make an interval-based
             schedule read as a sequence rather than as a price list. */}
        {/* ---- The shape of it ----
             Everything above is an inventory: what you own, what is due a check,
             what you have asked us to remember. This is the *shape* — and the
             shape is the one thing an owner cannot see, because they acquired the
             pieces one at a time over decades and every decision was made against
             an occasion rather than against the collection.

             The gaps are observations rather than prescriptions, and there is no
             price anywhere in them. A person with no earrings may simply not have
             pierced ears, and a tool that reads that as "buy earrings" is worse
             than one that says nothing. It also reads only what you entered
             yourself: a wishlist and a collection are different objects, and
             merging them would make the whole readout a sales instrument. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <StageSweep intensity={0.2} width={0.32} seconds={21} />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Shape"
              title="What it is made of, and what is missing"
              highlightWords={['missing']}
              subtitle="Read off the pieces you have entered above and nothing else. Most collections turn out to be heavy on occasions and light on everyday, which is the usual shape and the usual regret — and the answer to it is almost never another piece."
              align="center"
              className="mb-14"
            />

            <PortfolioBalance />
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt/40 py-20 md:py-28">
          <CausticsCanvas intensity={0.3} lobes={5} speed={34} />

          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-16 text-center">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Over a lifetime
              </p>
              <EchoTrailText
                text="A piece is not finished when you take it home."
                as="h2"
                echoes={3}
                spread={16}
                direction="left"
                persistent
                className="mx-auto max-w-2xl font-display text-3xl leading-snug text-primary md:text-4xl"
              />
              <p className="mx-auto mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
                Intervals rather than dates, because you are reading this at an unknown point in the
                sequence. Everything below happens whether or not you ask for it.
              </p>
            </div>

            <ScrollSpineTimeline nodes={LIFETIME} />
          </div>
        </section>

        <GoldDivider variant="wide" className="px-6" />

        {/* ---- What the metal has done ----
             The vault lists the pieces and says which are due a service. This
             is the other axis, and it is the one a holder actually wonders
             about between visits.

             Indexed rather than plotted at face value, which is the whole
             design decision: gold at six thousand rupees a gram and silver at
             ninety cannot share an axis honestly, and the usual fix — a second
             y-axis — lets whoever draws the chart choose where the lines
             cross. One axis, one meaning. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Two years of metal"
              title="Indexed, because a second axis is a way of choosing your own conclusion"
              highlightWords={['choosing']}
              subtitle="Every line starts at 100 on the day the window opens, so a line at 118 has risen 18% whichever metal it is. The rupee figures are in the tooltip and in the table — they are simply never the thing that sets the geometry."
              align="left"
              className="mb-14"
            />

            <MetalRateHistory />
          </div>
        </section>

        {/* ---- And what it is covered for ----
             Directly after the rates, because the rates are the cause. A
             collection valued four years ago is insured for what gold cost
             four years ago, and the way most policies handle that is worse
             than paying the shortfall — under average, a schedule that is 30%
             short can reduce a claim on a fully covered single piece by the
             same 30%. */}
        <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The clause nobody reads"
              title="What you would actually be paid, rather than what you are insured for"
              highlightWords={['actually']}
              subtitle="Three traps and all three are ordinary: an unspecified piece is capped at about ₹50,000 however large the policy, average reduces a claim by however short the schedule is, and indemnity pays second-hand value. Work out your own number below."
              align="left"
              className="mb-14"
            />

            <CoverageGap />
          </div>
        </section>

        <AtelierToolsSection />

        <section className="relative px-6 py-20 text-center md:py-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center">
            <KaleidoscopeGem
              src="/images/collections/gemstone.jpg"
              className="w-56 md:w-72"
              segments={14}
              caption="Your saved pieces, mirrored"
            />
            <SectionHeading
              className="mt-10"
              eyebrow="Bring It In"
              title="Walk in already knowing what you want shown"
              highlightWords={['knowing']}
              subtitle="Read the list off your phone at the counter. It is the fastest appointment anyone has here, and the one that ends in the right piece."
            />
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <CTAButton variant="primary" href="/book-appointment" size="lg" showArrow>
                Arrange the visit
              </CTAButton>
              <CTAButton variant="ghost" href="/collections" size="lg">
                Keep browsing
              </CTAButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
