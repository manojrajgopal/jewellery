'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * How to actually get into the building, said before anybody has to ask.
 *
 * The contact page can already book an appointment, find the boutique on a map,
 * say what the room is like and say what happens in it. What none of that
 * answers is the set of questions somebody has to telephone and ask a stranger,
 * and the reason they are worth publishing is that having to ask is itself the
 * barrier. A wheelchair user planning a visit does not want to be reassured
 * that the boutique is "accessible" — they want to know the width of the door
 * and whether the threshold has a lip, because "accessible" is a word that has
 * meant nothing since about 1994.
 *
 * So every answer here is a measurement or a plain no. Where the answer is no,
 * it says no and it says what we do instead, because the alternative — a
 * carefully phrased sentence that is technically true — is how somebody ends up
 * at the bottom of a step they were told did not exist.
 *
 * The `verified` date on each is deliberate. A building changes, and an access
 * statement with no date on it is a claim about a building that may no longer
 * be there.
 */

interface Note {
  id: string;
  question: string;
  answer: string;
  status: 'yes' | 'partial' | 'no';
  detail: string;
  verified: string;
  group: 'arriving' | 'inside' | 'sensory' | 'help';
}

const NOTES: Note[] = [
  {
    id: 'entrance',
    question: 'Is there a step at the door?',
    answer: 'No step. 12mm threshold, chamfered.',
    status: 'yes',
    detail:
      'Level from the pavement, with a 12mm bevelled threshold strip at the door itself. The doorway clear width is 910mm with the door held open, and it is held open on request rather than automatically — say so at the intercom and somebody will be there before you arrive at it.',
    verified: 'March 2026',
    group: 'arriving',
  },
  {
    id: 'parking',
    question: 'Where can I be dropped off?',
    answer: 'Directly outside. 4m of clear kerb, no bollards.',
    status: 'yes',
    detail:
      'The kerb outside is drop-off only between 11:00 and 20:00 and there is four metres of it with nothing in the way. Accessible parking is in the basement of the building next door, two spaces, and the lift from it comes up inside our lobby rather than onto the street.',
    verified: 'March 2026',
    group: 'arriving',
  },
  {
    id: 'lift',
    question: 'Is the private viewing room on the ground floor?',
    answer: 'No. First floor, and the lift is 1100 × 1400mm.',
    status: 'partial',
    detail:
      'The two private rooms are upstairs and there is one lift, 1100mm by 1400mm internally with an 800mm door — which takes most wheelchairs and does not take a large powered chair with a headrest. If that is you, tell us when you book and we will hold the ground-floor consulting room instead, which does everything the upstairs rooms do except that it has a window onto the street.',
    verified: 'March 2026',
    group: 'inside',
  },
  {
    id: 'wc',
    question: 'Is there an accessible lavatory?',
    answer: 'Yes, ground floor, left transfer only.',
    status: 'partial',
    detail:
      'Ground floor, 1500 × 2000mm, with a drop-down rail on the left and a fixed rail on the right. That means left-hand transfer only, which is the honest limitation and one that almost no premises state. There is no changing-places facility on site; the nearest is in the mall 400m north and we will happily telephone ahead.',
    verified: 'March 2026',
    group: 'inside',
  },
  {
    id: 'counter',
    question: 'Can I be served seated, at a height that works?',
    answer: 'Yes. Every consultation is seated, at 720mm.',
    status: 'yes',
    detail:
      'Nothing here is sold across a standing counter. Every appointment happens at a table with a 720mm clear knee height and moveable chairs, and the trays come to the table. This is how we serve everybody, so it is not an adjustment and nobody has to ask for it.',
    verified: 'March 2026',
    group: 'inside',
  },
  {
    id: 'hearing',
    question: 'Is there a hearing loop?',
    answer: 'Yes, both consulting rooms. Portable unit at the desk.',
    status: 'yes',
    detail:
      'A fixed induction loop in each of the two upstairs rooms and the ground-floor room, tested quarterly, plus a portable unit at the front desk for anything that happens on the shop floor. If the loop is not working, we will say so and offer the portable rather than letting you find out mid-conversation.',
    verified: 'March 2026',
    group: 'sensory',
  },
  {
    id: 'quiet',
    question: 'Can I visit when it is quiet?',
    answer: 'Yes. Tuesday and Wednesday, first hour.',
    status: 'yes',
    detail:
      'The first hour on Tuesday and Wednesday is held quiet by arrangement: music off, the polishing motor in the back workshop off, display lighting down about forty per cent, and no more than two other parties in the building. Ask for a quiet appointment and nothing else needs explaining.',
    verified: 'March 2026',
    group: 'sensory',
  },
  {
    id: 'lighting',
    question: 'How bright is it, and can it be changed?',
    answer: 'Bright by design. Dimmable in the rooms, not on the floor.',
    status: 'partial',
    detail:
      'The shop floor runs at around 900 lux with a lot of directional spotlighting, because that is what jewellery needs and there is no way round it. The consulting rooms are separately dimmable from 900 down to about 150 lux, and we can also bring pieces to you in the quietest, softest-lit corner of the building. If light is a difficulty, book a room rather than a floor visit.',
    verified: 'March 2026',
    group: 'sensory',
  },
  {
    id: 'dogs',
    question: 'Are assistance dogs welcome?',
    answer: 'Yes, anywhere in the building, including the workshop.',
    status: 'yes',
    detail:
      'Everywhere, without exception and without notice, and there is water in the lobby. The only room a dog cannot come into is the casting room, and that is a floor-temperature and molten-metal issue rather than a policy — it is also a room no customer goes into.',
    verified: 'March 2026',
    group: 'help',
  },
  {
    id: 'companion',
    question: 'Can somebody come with me?',
    answer: 'Yes, and they are not charged for anything.',
    status: 'yes',
    detail:
      'Any companion, carer or interpreter, and there is no limit on the number for a standard appointment. For the private viewings there are physically six chairs, and a carer does not count as one of the six.',
    verified: 'March 2026',
    group: 'help',
  },
  {
    id: 'language',
    question: 'What languages are on the floor?',
    answer: 'English, Hindi, Marathi, Gujarati. ISL by arrangement.',
    status: 'partial',
    detail:
      'Four languages are always on the floor and Tamil and Bengali are on the floor most days. We do not have an Indian Sign Language interpreter on staff — we book one, we pay for it, and we need about four working days. Ask when you book rather than on the day.',
    verified: 'March 2026',
    group: 'help',
  },
  {
    id: 'home',
    question: 'What if I cannot come at all?',
    answer: 'We come to you, within the city, at no charge.',
    status: 'yes',
    detail:
      'A home visit with a selection, a full valuation, or a fitting — anywhere inside the city, no charge, no minimum spend and no expectation of one. This is not a concession we make reluctantly; a third of our oldest customers have been served this way for years, and the only thing we cannot bring to a house is the bench.',
    verified: 'March 2026',
    group: 'help',
  },
];

const STATUS: Record<Note['status'], { label: string; tone: string }> = {
  yes: { label: 'Yes', tone: 'var(--series-1)' },
  partial: { label: 'With a limit', tone: 'var(--series-2)' },
  no: { label: 'No', tone: 'var(--series-4)' },
};

const GROUPS: { id: Note['group']; label: string }[] = [
  { id: 'arriving', label: 'Getting here' },
  { id: 'inside', label: 'Inside the building' },
  { id: 'sensory', label: 'Sound and light' },
  { id: 'help', label: 'Who can come, and what we will do' },
];

export default function AccessNotes({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={className}>
      {/* Legend, with the words as well as the colours — this panel of all
          panels cannot encode anything by colour alone. */}
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-line-subtle pb-5">
        {(Object.keys(STATUS) as Note['status'][]).map((k) => (
          <span
            key={k}
            className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted"
          >
            <span
              className="series-swatch"
              style={{ background: `rgb(${STATUS[k].tone})` }}
              aria-hidden="true"
            />
            {STATUS[k].label}
          </span>
        ))}
        <span className="ml-auto font-accent text-[9px] uppercase tracking-luxe text-faint">
          Every measurement checked March 2026
        </span>
      </div>

      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.id}>
            <h3 className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              {group.label}
            </h3>

            <div className="mt-4 divide-y divide-line-subtle border-y border-line-subtle">
              {NOTES.filter((n) => n.group === group.id).map((note) => {
                const isOpen = open === note.id;
                const status = STATUS[note.status];
                return (
                  <div key={note.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : note.id)}
                      aria-expanded={isOpen}
                      className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-4 py-4 text-left"
                    >
                      <span
                        className="series-swatch mt-1.5"
                        style={{ background: `rgb(${status.tone})` }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block font-display text-lg text-primary transition-colors group-hover:text-accent md:text-xl">
                          {note.question}
                        </span>
                        <span className="mt-1 block font-sans text-sm font-light text-secondary">
                          {note.answer}
                        </span>
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-accent text-lg leading-none text-accent"
                        aria-hidden="true"
                      >
                        +
                      </motion.span>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-6">
                        <p className="max-w-3xl font-sans text-sm font-light leading-relaxed text-muted">
                          {note.detail}
                        </p>
                        <p className="mt-3 font-accent text-[9px] uppercase tracking-luxe text-faint">
                          {status.label} · measured {note.verified}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-accent/25 bg-accent/[0.04] p-6">
        <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
          If something here is wrong
        </p>
        <p className="mt-3 max-w-3xl font-sans text-sm font-light leading-relaxed text-muted">
          Tell us and we will measure it again and change this page the same
          week, with the date on it. A building changes — a display case gets
          moved, a threshold strip lifts, a lift is out — and an access statement
          that is never revised is a statement about a building that no longer
          exists. Three of the entries above were rewritten after somebody wrote
          to us, and one of them was rewritten because the answer used to be
          softer than the truth.
        </p>
      </div>
    </div>
  );
}
