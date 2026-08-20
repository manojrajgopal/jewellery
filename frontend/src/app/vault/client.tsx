'use client';

import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import ClientVault from '@/components/ui/ClientVault';
import HeirloomNote from '@/components/ui/HeirloomNote';
import StackBuilder from '@/components/ui/StackBuilder';
import OccasionReminder from '@/components/ui/OccasionReminder';

import MosaicShuffle from '@/components/motion/MosaicShuffle';
import KaleidoscopeGem from '@/components/motion/KaleidoscopeGem';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import RippleGrid from '@/components/motion/RippleGrid';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';

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
              <CTAButton variant="primary" href="/contact" size="lg" showArrow>
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
