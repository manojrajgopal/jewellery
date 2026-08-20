'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

/**
 * What actually happens in the room, said before anybody has to walk into it.
 *
 * The site can book an appointment, describe the experiences on offer and report
 * whether the bench is working. What none of that addresses is the reason a
 * meaningful number of people never book at all: they do not know what is
 * expected of them, and a shop like this is intimidating in a way we are
 * extremely badly placed to notice.
 *
 * So the questions here are the ones people are too embarrassed to ask, phrased
 * as they are actually asked. Every answer is a commitment rather than
 * reassurance — "you will not be followed round the room" is worth nothing
 * without "and here is what we do instead".
 *
 * The two-column arrangement is deliberate. The left is what we do; the right is
 * what you are under no obligation to do. Publishing the second column is the
 * point of the whole component — a list of what a customer is *not* required to
 * do is the only version of this that is any use, because the anxieties are all
 * about obligation.
 */
interface Question {
  id: string;
  ask: string;
  answer: string;
  /** The commitment, stated separately so it cannot be softened by the prose. */
  promise: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'dress',
    ask: 'What do I wear?',
    answer:
      'Whatever you are already wearing. We would gently suggest one practical thing rather than one sartorial one: if you are coming to try rings, no hand cream that morning, and if you are coming for a necklace, a plain neckline rather than a high one — you cannot judge a piece against a collar.',
    promise: 'Nobody here has ever been dressed for the room. Several of the bench come in aprons.',
  },
  {
    id: 'browse',
    ask: 'Can I just look?',
    answer:
      'Yes, and it is the most common reason people come in. You will be greeted, told where things are, and then left alone. If you want somebody, the nearest person will be watching for you to look up — that is the whole signal, and it is the only one you need to learn.',
    promise: 'You will not be followed round the room, and nobody will ask what your budget is.',
  },
  {
    id: 'budget',
    ask: 'Do I have to say what I can spend?',
    answer:
      'Not at any point. It is useful information and it is entirely yours to volunteer. What we will do instead, if you would rather not, is show you three things at three obviously different prices and let you tell us which direction to go — which gets to the same place without anybody having to name a number out loud.',
    promise: 'The prices are on the tickets. Nothing in the room is priced on application.',
  },
  {
    id: 'alone',
    ask: 'Can I bring somebody?',
    answer:
      'Please do, and bring the person whose opinion you will actually take rather than the person who is free. If the decision is a joint one and one of you is elsewhere, we will set up a camera on the bench and they can be in the room for the part that matters.',
    promise: 'Up to four people in the private room, and we will bring chairs for all of them.',
  },
  {
    id: 'try',
    ask: 'Can I try things on if I am not buying today?',
    answer:
      'Yes. Trying on is not a signal of anything and we do not treat it as one. Ask for the mirror by the window rather than the one at the counter — the counter light is flattering and the window light is honest, and we would rather you saw the honest one before you decided.',
    promise: 'Nothing you try on will be brought up again, by anybody, on a later visit.',
  },
  {
    id: 'time',
    ask: 'How long will it take?',
    answer:
      'A first visit with no particular object is twenty minutes. A serious look at engagement rings is closer to ninety, and we will say so when you book rather than discovering it together at minute forty. If you have to leave, leave — we will hold the notes and pick it up next time.',
    promise: 'We will tell you the honest length when you book, and we will not run over it.',
  },
  {
    id: 'no',
    ask: 'How do I say no?',
    answer:
      'Any way at all, including saying nothing and leaving. If it helps, the sentence that works best here is &ldquo;not this one&rdquo; — it tells us something useful and it ends the conversation about that piece completely.',
    promise: 'No follow-up call unless you ask for one. Not one, ever.',
  },
  {
    id: 'own',
    ask: 'Can I bring in something you did not make?',
    answer:
      'Yes, and we would like you to. Anything at all — including things bought elsewhere, things inherited with no papers, and things you suspect are not what you were told they were. The last category is the one we most want through the door, and the answer is free.',
    promise: 'We will not comment on where it came from unless you ask us to.',
  },
];

/** What the room contains, so it is not a surprise. */
const ROOM = [
  { thing: 'A bench, working', note: 'Behind glass, at the back. You can watch it, and you can ask what is happening.' },
  { thing: 'Two mirrors', note: 'One flattering, one honest. Both are labelled. This is not a joke.' },
  { thing: 'A private room', note: 'Door, chairs, and a lock on the inside. Available without booking if it is free.' },
  { thing: 'Water and tea', note: 'Offered once, then left alone. Saying no does not mean it stops being available.' },
  { thing: 'No music', note: 'Deliberately. You cannot hear a clasp click over a playlist.' },
  { thing: 'A loupe on every counter', note: 'Yours to pick up. Nobody will ask why you want it.' },
];

export default function EtiquetteBriefing() {
  const [open, setOpen] = useState('budget');
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        {/* ---- The questions ---- */}
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            The questions nobody asks out loud
          </p>

          <ul className="mt-6 divide-y divide-[rgb(var(--hairline)/0.12)]">
            {QUESTIONS.map((q) => {
              const isOpen = open === q.id;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? '' : q.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-baseline gap-4 py-5 text-left"
                  >
                    {/* A mark rather than a chevron. A chevron says "expand"; a
                        mark says "this is a question", which is the register the
                        whole component is written in. */}
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 45 : 0, opacity: isOpen ? 1 : 0.5 }}
                      transition={reduced ? { duration: 0 } : { duration: 0.35, ease: easeCine.catch }}
                      className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-accent"
                    />
                    <span
                      className={`flex-1 font-display text-xl leading-snug transition-colors duration-400 ${
                        isOpen ? 'text-accent' : 'text-primary'
                      }`}
                    >
                      {q.ask}
                    </span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.45, ease: easeCine.glass }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 pl-[1.625rem]">
                      <p
                        className="font-sans text-base font-light leading-relaxed text-muted"
                        dangerouslySetInnerHTML={{ __html: q.answer }}
                      />
                      {/* The commitment, set apart. Reassurance in prose is
                          worthless; a promise on its own line can be held to. */}
                      <p className="mt-4 border-l-2 border-accent/40 pl-4 font-display text-base italic leading-snug text-primary">
                        {q.promise}
                      </p>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---- What is in the room ---- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-hairline bg-surface-raised/40 p-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              What is actually in there
            </p>
            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
              Six things, so that walking in is a recognition rather than a discovery.
            </p>

            <ul className="mt-6 space-y-5">
              {ROOM.map((r, i) => (
                <motion.li
                  key={r.thing}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: easeCine.glass }}
                >
                  <p className="font-display text-base text-primary">{r.thing}</p>
                  <p className="mt-1 font-sans text-sm font-light leading-relaxed text-muted">
                    {r.note}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="mt-6 font-sans text-sm font-light leading-relaxed text-muted">
            If any of this turns out not to be true on the day, say so at the counter and it will be
            dealt with before you leave. It is written down here precisely so that it can be held
            against us.
          </p>
        </div>
      </div>
    </div>
  );
}
