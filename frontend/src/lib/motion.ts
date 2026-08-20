import { Variants } from "framer-motion";

export const luxuryEase = [0.22, 1, 0.36, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1,
      ease: luxuryEase
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      ease: luxuryEase
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      ease: luxuryEase
    }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      ease: luxuryEase
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      ease: luxuryEase
    }
  }
};

export const cardItem: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      ease: luxuryEase
    }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      ease: luxuryEase
    }
  }
};

export const slideInFromLeft: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: luxuryEase
    }
  }
};

export const slideInFromRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: luxuryEase
    }
  }
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: luxuryEase
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.4,
      ease: luxuryEase
    }
  }
};

export const goldShimmer: Variants = {
  hidden: { backgroundPosition: "200% center" },
  visible: {
    backgroundPosition: "-200% center",
    transition: {
      repeat: Infinity,
      duration: 3.5,
      ease: "linear"
    }
  }
};

/* ===========================================================================
   CINEMATIC ADDITIONS
   Everything below is shot-language: entrances with a lens character, staged
   sequences, and the easing curves that hold them together.
   =========================================================================== */

/** Easing vocabulary. Named for what they feel like, not for their numbers. */
export const ease = {
  /** The house curve — decisive out, long settle. */
  luxury: [0.22, 1, 0.36, 1] as const,
  /** Symmetric; for anything that has to feel mechanical. */
  silk: [0.65, 0, 0.35, 1] as const,
  /** Overshoots. Use on small elements only. */
  spring: [0.34, 1.56, 0.64, 1] as const,
  /** Slams in, slams out. Curtains, panels, wipes. */
  curtain: [0.76, 0, 0.24, 1] as const,
  /** Almost linear at the start, then falls away. Camera moves. */
  camera: [0.16, 1, 0.3, 1] as const,
  /** Anticipation before the move. Reveals. */
  anticipate: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

/** Duration scale in seconds, so timings stay in proportion to each other. */
export const dur = {
  instant: 0.18,
  fast: 0.32,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.4,
  epic: 2.2,
} as const;

/* ---------------------------------------------------------------------------
   Lens-flavoured entrances
--------------------------------------------------------------------------- */

/** Rack focus: arrives out of focus and resolves. */
export const focusPull: Variants = {
  hidden: { opacity: 0, filter: "blur(16px)", scale: 1.06 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: dur.cinematic, ease: ease.luxury },
  },
};

/** Dolly in — the subject grows toward the viewer as it fades up. */
export const dollyIn: Variants = {
  hidden: { opacity: 0, scale: 0.86, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: dur.slow, ease: ease.camera },
  },
};

/** Dolly out — starts oversized, as if the camera pulls back off it. */
export const dollyOut: Variants = {
  hidden: { opacity: 0, scale: 1.22 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: dur.cinematic, ease: ease.luxury },
  },
};

/** Crane down: drops in from above with a slight rotation, like a jib shot. */
export const craneDown: Variants = {
  hidden: { opacity: 0, y: -70, rotateX: -18 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: dur.slow, ease: ease.camera },
  },
};

/** Wipe from the left, revealed by its own clip rather than by opacity. */
export const wipeRight: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: dur.slow, ease: ease.curtain },
  },
};

export const wipeUp: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: dur.slow, ease: ease.curtain },
  },
};

/** Iris — the oldest transition in film. */
export const irisIn: Variants = {
  hidden: { clipPath: "circle(0% at 50% 50%)" },
  visible: {
    clipPath: "circle(75% at 50% 50%)",
    transition: { duration: dur.cinematic, ease: ease.luxury },
  },
};

/** A card turning over on its vertical axis. */
export const flipY: Variants = {
  hidden: { opacity: 0, rotateY: -68, transformPerspective: 1200 },
  visible: {
    opacity: 1,
    rotateY: 0,
    transformPerspective: 1200,
    transition: { duration: dur.slow, ease: ease.luxury },
  },
};

/** Unrolls horizontally from its centre — for rules, bars and dividers. */
export const unfurl: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: dur.slow, ease: ease.luxury },
  },
};

/** For anything that should feel weighted: a clasp closing, a lid settling. */
export const settle: Variants = {
  hidden: { opacity: 0, y: -24, scale: 1.04 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 18, mass: 1.2 },
  },
};

/* ---------------------------------------------------------------------------
   Sequencing
--------------------------------------------------------------------------- */

/**
 * Stagger container with tunable rhythm. Prefer this over hand-writing a
 * transition block on every section — the timings drift apart otherwise.
 */
export const sequence = (stagger = 0.09, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Same, but children resolve back-to-front — good for stacked cards. */
export const sequenceReverse = (stagger = 0.09, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay, staggerDirection: -1 },
  },
});

/** Children radiate outward from the middle of the row. */
export const sequenceFromCentre = (stagger = 0.07): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
});

/* ---------------------------------------------------------------------------
   Recurring choreography
--------------------------------------------------------------------------- */

/** Masked line of type rising out of an overflow-hidden parent. */
export const lineRise: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: dur.slow, ease: ease.luxury },
  },
};

/** Per-character rise with a blur, for display type. */
export const glyphRise: Variants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: ease.luxury },
  },
};

/** Hover state shared by every interactive plate on the site. */
export const plateHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.014,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
  tap: { scale: 0.985, transition: { duration: dur.instant } },
};

/** Draws an SVG stroke on, then holds. */
export const strokeDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, ease: ease.luxury },
      opacity: { duration: 0.3 },
    },
  },
};

/** Slow orbit for decorative rings and seals. */
export const orbit = (seconds = 24, reverse = false): Variants => ({
  visible: {
    rotate: reverse ? -360 : 360,
    transition: { duration: seconds, repeat: Infinity, ease: "linear" },
  },
});

/** Ambient float, for anything meant to hang in space. */
export const hover3d = (distance = 12, seconds = 6): Variants => ({
  visible: {
    y: [0, -distance, 0],
    transition: { duration: seconds, repeat: Infinity, ease: "easeInOut" },
  },
});

/* ---------------------------------------------------------------------------
   Route / overlay choreography
--------------------------------------------------------------------------- */

/** Full-screen overlays: modals, drawers, palettes. */
export const overlayBackdrop: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(18px)",
    transition: { duration: dur.base, ease: ease.luxury },
  },
  exit: { opacity: 0, transition: { duration: dur.fast } },
};

export const drawerRight: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 240, damping: 30 } },
  exit: { x: "100%", transition: { duration: dur.fast, ease: ease.curtain } },
};

export const modalPop: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 280, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: dur.fast, ease: ease.luxury },
  },
};

/**
 * Respects the OS setting without every caller having to. Returns a variant set
 * whose hidden state is already the visible one, so nothing moves.
 */
export const stillFor = (reduced: boolean, variants: Variants): Variants =>
  reduced ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : variants;

/* ===========================================================================
   SHOT LANGUAGE v4
   The v3 block above covers entrances and sequencing. This block covers the
   three things it left out: camera moves that carry motion blur, mechanical
   reveals that move a mask rather than the subject, and helpers for the
   viewport contract every section repeats by hand.
   =========================================================================== */

/**
 * The viewport settings almost every section wants: fire once, and start a
 * little before the element is fully on screen so the motion is already
 * underway when the visitor's eye arrives. Spread it rather than retyping it —
 * the margins drifting apart between sections is what makes a page feel
 * assembled instead of directed.
 */
export const onceInView = { once: true, margin: '-12% 0px -12% 0px' } as const;

/** Same contract, but for elements that are tall enough to need an earlier cue. */
export const onceInViewEarly = { once: true, margin: '-4% 0px -24% 0px' } as const;

/* ---------------------------------------------------------------------------
   Camera moves with lens character
--------------------------------------------------------------------------- */

/** Whip pan: arrives smeared along its travel, then resolves. */
export const whipPan = (from: 'left' | 'right' = 'left'): Variants => ({
  hidden: {
    opacity: 0,
    x: from === 'left' ? -90 : 90,
    filter: 'blur(14px)',
    skewX: from === 'left' ? 7 : -7,
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    skewX: 0,
    transition: { duration: dur.slow, ease: ease.camera },
  },
});

/** Tilt-shift: the plane of focus rolls past the subject. */
export const tiltShift: Variants = {
  hidden: { opacity: 0, rotateX: 14, y: 44, filter: 'blur(10px)', transformPerspective: 1400 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    filter: 'blur(0px)',
    transformPerspective: 1400,
    transition: { duration: dur.cinematic, ease: ease.luxury },
  },
};

/** Push in on the Z axis rather than by scale, so siblings keep their depth. */
export const pushIn3D: Variants = {
  hidden: { opacity: 0, z: -180, transformPerspective: 1200 },
  visible: {
    opacity: 1,
    z: 0,
    transformPerspective: 1200,
    transition: { duration: dur.slow, ease: ease.camera },
  },
};

/** A handheld settle — the frame overshoots slightly and corrects. */
export const handheldSettle: Variants = {
  hidden: { opacity: 0, y: 26, rotate: -0.7 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 190, damping: 17, mass: 0.9 },
  },
};

/* ---------------------------------------------------------------------------
   Mechanical reveals — the mask moves, not the subject
--------------------------------------------------------------------------- */

/** Camera shutter: slats part from the centre outward. */
export const shutterOpen: Variants = {
  hidden: { clipPath: 'inset(50% 0 50% 0)' },
  visible: {
    clipPath: 'inset(0% 0 0% 0)',
    transition: { duration: dur.slow, ease: ease.curtain },
  },
};

/** Diagonal wipe, the way a printed page is uncovered by a turning sheet. */
export const wipeDiagonal: Variants = {
  hidden: { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' },
  visible: {
    clipPath: 'polygon(0 0, 140% 0, 140% 140%, 0 140%)',
    transition: { duration: dur.cinematic, ease: ease.curtain },
  },
};

/** Unrolls downward from its top edge — for panels and drawers. */
export const unrollDown: Variants = {
  hidden: { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
  visible: {
    scaleY: 1,
    opacity: 1,
    transformOrigin: 'top center',
    transition: { duration: dur.base, ease: ease.luxury },
  },
};

/** An accordion fold opening flat, hinged on its top edge. */
export const foldOpen: Variants = {
  hidden: { rotateX: -78, opacity: 0, transformPerspective: 900, transformOrigin: 'top center' },
  visible: {
    rotateX: 0,
    opacity: 1,
    transformPerspective: 900,
    transformOrigin: 'top center',
    transition: { duration: dur.slow, ease: ease.luxury },
  },
};

/** Circular iris anchored anywhere — pass the origin as a CSS position. */
export const irisFrom = (at = '50% 50%'): Variants => ({
  hidden: { clipPath: `circle(0% at ${at})` },
  visible: {
    clipPath: `circle(140% at ${at})`,
    transition: { duration: dur.cinematic, ease: ease.luxury },
  },
});

/* ---------------------------------------------------------------------------
   Objects arriving
--------------------------------------------------------------------------- */

/** Dealt onto the table from off to one side. */
export const cardDeal = (index = 0): Variants => ({
  hidden: { opacity: 0, x: -70, y: 40, rotate: -14, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: dur.slow, delay: index * 0.07, ease: ease.luxury },
  },
});

/** Dropped from above and bounced once, like a stone set into a tray. */
export const pinDrop: Variants = {
  hidden: { opacity: 0, y: -80, scale: 0.7 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 16, mass: 0.8 },
  },
};

/** A stone turning into place as it arrives. */
export const facetTurnIn: Variants = {
  hidden: { opacity: 0, rotate: -35, scale: 0.6, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: dur.slow, ease: ease.spring },
  },
};

/** Rises with a slight crown, for anything presented as the hero of its row. */
export const crownRise: Variants = {
  hidden: { opacity: 0, y: 54, scale: 0.86, rotateX: 22, transformPerspective: 1000 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transformPerspective: 1000,
    transition: { duration: dur.cinematic, ease: ease.luxury },
  },
};

/* ---------------------------------------------------------------------------
   Sequencing, continued
--------------------------------------------------------------------------- */

/**
 * Stagger that eases rather than ticking: children near the middle of the row
 * resolve fastest. Framer has no built-in for this, so the delay is computed
 * per child and applied through a custom prop.
 */
export const waveDelay = (index: number, total: number, spread = 0.5) => {
  if (total <= 1) return 0;
  const t = index / (total - 1);
  // A raised cosine, so the ends lag and the centre leads.
  return ((1 - Math.cos(t * Math.PI * 2)) / 2) * spread;
};

/** Children arrive in a wave. Pair with waveDelay via the `custom` prop. */
export const waveItem: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(7px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: dur.slow, delay, ease: ease.luxury },
  }),
};

/** Depth layers: each level sits further back and arrives slightly later. */
export const depthLayer = (level = 0): Variants => ({
  hidden: { opacity: 0, y: 30 + level * 12, scale: 1 - level * 0.02 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: dur.slow, delay: level * 0.09, ease: ease.camera },
  },
});

/* ---------------------------------------------------------------------------
   Interaction states
--------------------------------------------------------------------------- */

/** Lifts and blooms. For plates whose whole content is a photograph. */
export const liftGlow = {
  rest: { y: 0, scale: 1, boxShadow: '0 12px 30px -22px rgb(0 0 0 / 0.4)' },
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow: '0 34px 70px -30px rgb(0 0 0 / 0.65)',
    transition: { type: 'spring' as const, stiffness: 240, damping: 20 },
  },
  tap: { scale: 0.99, transition: { duration: dur.instant } },
};

/** Presses in rather than lifting — for controls that read as struck metal. */
export const pressIn = {
  rest: { scale: 1, filter: 'brightness(1)' },
  hover: { scale: 1.03, filter: 'brightness(1.08)', transition: { duration: dur.fast } },
  tap: { scale: 0.96, filter: 'brightness(0.93)', transition: { duration: dur.instant } },
};

/** The rail's own drag physics, so every draggable rail on the site matches. */
export const railDrag = {
  dragElastic: 0.14,
  dragTransition: { power: 0.28, timeConstant: 320, bounceStiffness: 220, bounceDamping: 28 },
} as const;

/* ---------------------------------------------------------------------------
   Reduced motion
--------------------------------------------------------------------------- */

/**
 * Companion to stillFor: returns a transition that collapses to nothing when
 * the OS asks for stillness, so a component can keep one code path.
 */
export const timing = (reduced: boolean | null, t: object) => (reduced ? { duration: 0 } : t);

/* ===========================================================================
   SHOT LANGUAGE v5
   v4 covered camera moves, mask reveals and arrivals. This block covers the
   three things the pages kept hand-rolling afterwards: lens artefacts that
   belong to a *lens* rather than to a subject, choreography that reads across a
   grid instead of along a row, and the small physics presets that made every
   interactive control feel slightly different from its neighbour.

   Nothing above is modified. Everything here is additive, so a section can mix
   a v3 entrance with a v5 attention state without the timings arguing.
   =========================================================================== */

/**
 * Second easing set. Kept separate from `ease` so callers that spread the first
 * one keep working, and so the two vocabularies stay legible: `ease` is camera
 * work, `easeMech` is the behaviour of *things* — hinges, weights, springs.
 */
export const easeMech = {
  /** Falls, then stops dead. Weight without bounce. */
  gravity: [0.55, 0.06, 0.68, 0.19] as const,
  /** Rubber band. Two overshoots, both small. */
  elastic: [0.6, -0.28, 0.735, 0.045] as const,
  /** A hinge swinging shut against a stop. */
  hinge: [0.86, 0, 0.07, 1] as const,
  /** Slow in, slow out, long middle — for anything mechanical and heavy. */
  vault: [0.83, 0, 0.17, 1] as const,
  /** Reads as a shutter blade: instant, then a fraction of settle. */
  blade: [0.9, 0.02, 0.16, 1] as const,
} as const;

/**
 * Spring presets, named for the object they belong to. Retyping stiffness and
 * damping per component is how a site ends up with nine slightly different
 * hover feels; import one of these instead.
 */
export const springs = {
  /** Default for plates, cards and panels. */
  plate: { type: 'spring' as const, stiffness: 240, damping: 24, mass: 1 },
  /** Small controls: chips, toggles, dots. */
  chip: { type: 'spring' as const, stiffness: 420, damping: 26, mass: 0.6 },
  /** Anything being dragged or thrown. */
  drag: { type: 'spring' as const, stiffness: 180, damping: 22, mass: 1.2 },
  /** Heavy: a door, a lid, a tray. */
  heavy: { type: 'spring' as const, stiffness: 120, damping: 20, mass: 2.4 },
  /** Bouncy, for confirmations only — it overshoots visibly. */
  pop: { type: 'spring' as const, stiffness: 520, damping: 18, mass: 0.5 },
  /** Cursor-followers and magnetic fields; heavily damped on purpose. */
  follow: { type: 'spring' as const, stiffness: 300, damping: 40, mass: 0.8 },
} as const;

/* ---------------------------------------------------------------------------
   Lens artefacts
--------------------------------------------------------------------------- */

/** Zoom blur: arrives scaled with a radial smear, resolves sharp. */
export const zoomBlurIn: Variants = {
  hidden: { opacity: 0, scale: 1.35, filter: 'blur(22px) saturate(1.35)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) saturate(1)',
    transition: { duration: dur.cinematic, ease: ease.camera },
  },
};

/** Anamorphic squeeze — the frame is compressed horizontally, then released. */
export const anamorphicRelease: Variants = {
  hidden: { opacity: 0, scaleX: 1.18, scaleY: 0.86, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    filter: 'blur(0px)',
    transition: { duration: dur.slow, ease: ease.luxury },
  },
};

/** Slit-scan: the subject arrives sheared, as if the sensor read it line by line. */
export const slitScan: Variants = {
  hidden: { opacity: 0, skewY: 6, scaleY: 1.14, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    skewY: 0,
    scaleY: 1,
    filter: 'blur(0px)',
    transition: { duration: dur.slow, ease: easeMech.blade },
  },
};

/** Depth of field: this one resolves. Pair with `defocus` on its siblings. */
export const focusIn: Variants = {
  hidden: { filter: 'blur(9px) brightness(0.82)', scale: 0.985 },
  visible: {
    filter: 'blur(0px) brightness(1)',
    scale: 1,
    transition: { duration: dur.base, ease: ease.luxury },
  },
};

/** The other half of a rack focus — what the plane of focus leaves behind. */
export const defocus: Variants = {
  visible: { filter: 'blur(0px) brightness(1)', transition: { duration: dur.base } },
  away: {
    filter: 'blur(7px) brightness(0.76)',
    transition: { duration: dur.base, ease: ease.luxury },
  },
};

/** Bloom: overexposes on arrival and settles back to correct exposure. */
export const bloomIn: Variants = {
  hidden: { opacity: 0, filter: 'brightness(2.4) saturate(0.4) blur(14px)' },
  visible: {
    opacity: 1,
    filter: 'brightness(1) saturate(1) blur(0px)',
    transition: { duration: dur.cinematic, ease: ease.camera },
  },
};

/* ---------------------------------------------------------------------------
   Projection furniture
--------------------------------------------------------------------------- */

/** Letterbox bars closing in from both edges. Drive the bars, not the frame. */
export const letterboxClose: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: dur.slow, ease: easeMech.blade } },
};

/** A title card: rises, holds, then lifts away. Three states, not two. */
export const titleCard: Variants = {
  hidden: { opacity: 0, y: 26, letterSpacing: '0.5em', filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0.28em',
    filter: 'blur(0px)',
    transition: { duration: dur.cinematic, ease: ease.luxury },
  },
  away: {
    opacity: 0,
    y: -24,
    letterSpacing: '0.42em',
    transition: { duration: dur.base, ease: ease.curtain },
  },
};

/** Countdown leader: a hard cut in, a hold, a hard cut out. */
export const leaderFlash: Variants = {
  hidden: { opacity: 0, scale: 1.4 },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [1.4, 1, 1, 0.94],
    transition: { duration: 0.9, times: [0, 0.18, 0.7, 1], ease: 'linear' },
  },
};

/* ---------------------------------------------------------------------------
   Choreography across a grid
--------------------------------------------------------------------------- */

/**
 * Delay for a cell in a grid, measured as distance from an origin corner or
 * from the middle. Framer staggers along child order, which reads as a
 * typewriter across a grid rather than as a wave through it — this fixes that
 * without every caller hard-coding its own row width.
 */
export const gridDelay = (
  index: number,
  cols: number,
  total: number,
  from: 'top-left' | 'centre' | 'bottom-right' = 'top-left',
  step = 0.055
) => {
  const rows = Math.max(1, Math.ceil(total / cols));
  const r = Math.floor(index / cols);
  const c = index % cols;
  if (from === 'centre') {
    const dr = r - (rows - 1) / 2;
    const dc = c - (cols - 1) / 2;
    return Math.hypot(dr, dc) * step;
  }
  if (from === 'bottom-right') return (rows - 1 - r + (cols - 1 - c)) * step;
  return (r + c) * step;
};

/** Grid cell arrival. Pair with gridDelay through the `custom` prop. */
export const gridCell: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 22, filter: 'blur(6px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: dur.base, delay, ease: ease.luxury },
  }),
};

/** A tile that turns over as it lands — for mosaics assembling into an image. */
export const tileFlip: Variants = {
  hidden: { opacity: 0, rotateY: 92, scale: 0.9, transformPerspective: 900 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformPerspective: 900,
    transition: { duration: dur.slow, delay, ease: ease.luxury },
  }),
};

/** Diagonal cascade for lists that read as a pile of paper rather than a grid. */
export const cascadeDelay = (index: number, step = 0.07, skew = 0.4) =>
  index * step + (index % 2) * step * skew;

/* ---------------------------------------------------------------------------
   Objects, continued
--------------------------------------------------------------------------- */

/** Swings in on a hinge fixed to its left edge, like a case opening. */
export const hingeOpen: Variants = {
  hidden: { rotateY: -104, opacity: 0, transformOrigin: 'left center', transformPerspective: 1400 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transformOrigin: 'left center',
    transformPerspective: 1400,
    transition: { duration: dur.cinematic, ease: easeMech.hinge },
  },
};

/** Two leaves parting — pass -1 for the left one, 1 for the right. */
export const vaultLeaf = (dir: -1 | 1): Variants => ({
  hidden: { x: '0%', filter: 'brightness(1)' },
  visible: {
    x: `${dir * 102}%`,
    filter: 'brightness(0.82)',
    transition: { duration: dur.epic, ease: easeMech.vault },
  },
});

/** Spirals in while unrolling — for seals, monograms and hallmarks. */
export const spiralIn: Variants = {
  hidden: { opacity: 0, rotate: -140, scale: 0.35 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: dur.cinematic, ease: ease.spring },
  },
};

/** A pendulum settling, hinged above its own top edge. */
export const pendulumSettle: Variants = {
  hidden: { rotate: -13, opacity: 0, transformOrigin: 'top center' },
  visible: {
    rotate: 0,
    opacity: 1,
    transformOrigin: 'top center',
    transition: { type: 'spring', stiffness: 90, damping: 9, mass: 1.4 },
  },
};

/** Poured: fills from the bottom edge. Drives a clip, so the subject never moves. */
export const pourFill: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: dur.epic, ease: easeMech.gravity },
  },
};

/* ---------------------------------------------------------------------------
   Attention states — for things already on screen
--------------------------------------------------------------------------- */

/** Breathes. For live badges and anything claiming to be current. */
export const breathe = (scale = 1.04, seconds = 3.4): Variants => ({
  visible: {
    scale: [1, scale, 1],
    opacity: [0.85, 1, 0.85],
    transition: { duration: seconds, repeat: Infinity, ease: 'easeInOut' },
  },
});

/** A single, small shudder — for a rejected input, never for an accepted one. */
export const shudder: Variants = {
  visible: {
    x: [0, -7, 6, -4, 2, 0],
    transition: { duration: 0.42, ease: 'easeOut' },
  },
};

/** Confirmation pop that leaves the element on its own baseline. */
export const confirmPop: Variants = {
  visible: {
    scale: [1, 1.14, 0.98, 1],
    transition: { duration: 0.5, ease: ease.spring },
  },
};

/** Slow drift for anything meant to feel suspended rather than placed. */
export const drift = (px = 10, seconds = 9): Variants => ({
  visible: {
    x: [0, px, 0, -px, 0],
    y: [0, -px * 0.6, 0, px * 0.6, 0],
    transition: { duration: seconds, repeat: Infinity, ease: 'easeInOut' },
  },
});

/** A travelling highlight across metal or glass. Drives backgroundPosition only. */
export const sheenTravel = (seconds = 4.5): Variants => ({
  visible: {
    backgroundPosition: ['-150% 50%', '250% 50%'],
    transition: { duration: seconds, repeat: Infinity, repeatDelay: 1.4, ease: 'linear' },
  },
});

/* ---------------------------------------------------------------------------
   Interaction states, continued
--------------------------------------------------------------------------- */

/** Tilts toward the pointer without needing a per-card pointer listener. */
export const tiltHover = {
  rest: { rotateX: 0, rotateY: 0, scale: 1, transformPerspective: 1200 },
  hover: {
    rotateX: -4,
    rotateY: 5,
    scale: 1.025,
    transformPerspective: 1200,
    transition: springs.plate,
  },
  tap: { scale: 0.99, transition: { duration: dur.instant } },
};

/** For a control that should read as a switch being thrown. */
export const throwSwitch = {
  rest: { rotate: 0, y: 0 },
  hover: { rotate: -1.5, y: -3, transition: springs.chip },
  tap: { rotate: 2, y: 2, transition: { duration: dur.instant } },
};

/** Reveals a hidden second layer by sliding the first one off upward. */
export const slideSwap = {
  rest: { y: '0%' },
  hover: { y: '-100%', transition: { duration: dur.fast, ease: ease.curtain } },
};

/* ---------------------------------------------------------------------------
   Scroll helpers
--------------------------------------------------------------------------- */

/**
 * Maps a 0–1 scroll progress onto a value range with a dead zone at each end, so
 * a scene holds its first and last frame instead of snapping out of them the
 * instant the section crosses the viewport edge. Returns the two arrays
 * useTransform wants, in order.
 */
export const holdRange = (
  from: number,
  to: number,
  hold = 0.15
): [number[], number[]] => [
  [0, hold, 1 - hold, 1],
  [from, from, to, to],
];

/** The viewport contract for scenes that must be fully committed before running. */
export const onceInViewFull = { once: true, margin: '-30% 0px -30% 0px' } as const;

/** For rails and marquees: fires early and re-fires, because they loop. */
export const alwaysInView = { once: false, margin: '10% 0px 10% 0px' } as const;

/* ===========================================================================
   CINEMA II — a second grammar, added rather than replacing the first.
   Everything above stays as it was; what follows is the vocabulary the newer
   sections are built from. The split is deliberate: the original set is tuned
   for reveals (something arrives), this set is tuned for *camera* (the frame
   itself moves, focuses, or is cut).
   =========================================================================== */

/**
 * Easing curves borrowed from camera hardware rather than from UI convention.
 *
 * A physical lens does not ease the way a CSS default does — a focus ring has
 * mass and backlash, a zoom rocker ramps, a shutter is nearly instant at both
 * ends. These are the curves that make a transform read as an optical event
 * instead of a div moving.
 */
export const easeLens = {
  /** Focus ring: slow to break static friction, then quick, then a hair of settle. */
  focusRing: [0.16, 0.84, 0.24, 1] as const,
  /** Zoom rocker: linear-ish middle with soft ends, the way a servo ramps. */
  rocker: [0.45, 0.05, 0.55, 0.95] as const,
  /** Shutter: violent open, violent close. */
  shutter: [0.85, 0, 0.15, 1] as const,
  /** Whip: everything happens in the first fifth of the duration. */
  whip: [0.05, 0.7, 0.1, 1] as const,
  /** Crash: overshoots hard, the way a crash zoom lands past its mark. */
  crash: [0.5, 1.6, 0.3, 1] as const,
  /** Gravity: accelerates all the way in, no ease-out — for anything falling. */
  gravity: [0.55, 0.02, 0.9, 0.35] as const,
  /** Silk drape: fabric settling, long tail. */
  drape: [0.12, 0.62, 0.2, 1] as const,
} as const;

/**
 * Spring presets keyed by the physical thing they imitate, so a call site reads
 * as a decision about material rather than a pair of magic numbers.
 */
export const springsHeavy = {
  /** A vault door — enormous mass, almost no bounce. */
  vault: { type: 'spring', stiffness: 42, damping: 26, mass: 2.6 },
  /** A velvet tray sliding on a runner. */
  tray: { type: 'spring', stiffness: 120, damping: 22, mass: 1.3 },
  /** A gemstone dropped into a setting — quick, one small rebound. */
  seat: { type: 'spring', stiffness: 420, damping: 20, mass: 0.6 },
  /** A pendant on a chain — swings twice before it stills. */
  pendant: { type: 'spring', stiffness: 90, damping: 9, mass: 1 },
  /** A loupe snapping to its detent. */
  detent: { type: 'spring', stiffness: 700, damping: 34, mass: 0.5 },
  /** Paper — light, over-damped, no overshoot at all. */
  leaf: { type: 'spring', stiffness: 180, damping: 30, mass: 0.4 },
} as const;

/**
 * Rack focus: the background gives up sharpness as the subject takes it.
 *
 * Used as a pair — `rackFocusNear` on the layer that ends sharp, `rackFocusFar`
 * on the one that ends soft. Both animate `filter` and a whisker of scale,
 * because a real lens breathes: pulling focus changes the field of view very
 * slightly, and without that the two plates read as a crossfade instead.
 */
export const rackFocusNear: Variants = {
  hidden: { opacity: 0.55, filter: 'blur(14px) saturate(0.8)', scale: 1.06 },
  visible: {
    opacity: 1,
    filter: 'blur(0px) saturate(1)',
    scale: 1,
    transition: { duration: 1.1, ease: easeLens.focusRing },
  },
};

export const rackFocusFar: Variants = {
  hidden: { opacity: 1, filter: 'blur(0px) saturate(1)', scale: 1 },
  visible: {
    opacity: 0.7,
    filter: 'blur(10px) saturate(0.82)',
    scale: 1.04,
    transition: { duration: 1.1, ease: easeLens.focusRing },
  },
};

/**
 * Dolly zoom — the vertigo shot. Subject holds its size while the field of view
 * collapses around it, which on a flat page means scaling the frame up while
 * pulling perspective down.
 *
 * It has to be applied to a container with `transformStyle: preserve-3d` and a
 * child that counter-scales, otherwise it is just a zoom. `VertigoZoom` does
 * that wiring; this is the variant it drives.
 */
export const vertigoPush: Variants = {
  hidden: { scale: 1, perspective: 1400 },
  visible: {
    scale: 1.35,
    perspective: 380,
    transition: { duration: 1.6, ease: easeLens.rocker },
  },
};

/** The counter-transform the subject inside a vertigo frame needs. */
export const vertigoHold: Variants = {
  hidden: { scale: 1, z: 0 },
  visible: { scale: 0.74, z: 120, transition: { duration: 1.6, ease: easeLens.rocker } },
};

/**
 * Crash zoom: a hard push that lands past its mark and snaps back. Deliberately
 * short — anything over about 500ms stops reading as a crash and starts reading
 * as a slow zoom that happens to overshoot.
 */
export const crashZoom: Variants = {
  hidden: { scale: 0.62, opacity: 0, filter: 'blur(8px)' },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.48, ease: easeLens.crash },
  },
};

/**
 * Match cut: the outgoing and incoming frames share a silhouette, so the cut
 * lands on the shape rather than on the content. Scale and rotation stay put;
 * only the fill changes.
 */
export const matchCut: Variants = {
  hidden: { opacity: 0, filter: 'brightness(2.4) contrast(0.6)' },
  visible: {
    opacity: 1,
    filter: 'brightness(1) contrast(1)',
    transition: { duration: 0.55, ease: easeLens.shutter },
  },
};

/**
 * Swish pan — a whip with motion blur baked into the skew. The blur is faked
 * with skewX rather than a filter because a real blur filter on a full-bleed
 * plate is a repaint the compositor cannot hand to the GPU.
 */
export const swishPan = (from: 'left' | 'right' = 'right'): Variants => {
  const dir = from === 'right' ? 1 : -1;
  return {
    hidden: { x: `${dir * 55}%`, skewX: dir * -14, opacity: 0 },
    visible: {
      x: '0%',
      skewX: 0,
      opacity: 1,
      transition: { duration: 0.72, ease: easeLens.whip },
    },
  };
};

/** A film-burn flash: the frame blooms white-hot, then resolves. */
export const filmBurn: Variants = {
  hidden: { opacity: 0, filter: 'brightness(3) saturate(0) blur(6px)', scale: 1.08 },
  visible: {
    opacity: 1,
    filter: 'brightness(1) saturate(1) blur(0px)',
    scale: 1,
    transition: { duration: 0.9, ease: easeLens.shutter, filter: { duration: 1.2 } },
  },
};

/**
 * Parallax depth, expressed as a plate number rather than a pixel offset.
 *
 * Plate 0 is the matte painting at infinity, plate 4 is the foreground gauze.
 * Keeping it ordinal means a scene stays internally consistent when someone
 * changes the scroll distance later — the plates keep their relationship.
 */
export const platePlane = (plate = 0) => {
  const depth = Math.max(0, Math.min(4, plate));
  return {
    /** Multiplier to apply to a scroll-linked translate. */
    rate: 0.16 + depth * 0.22,
    /** Plates further back are hazier and slightly desaturated. */
    haze: Math.max(0, (2 - depth) * 0.09),
    scale: 1 + (4 - depth) * 0.012,
  };
};

/**
 * Gravity drop: accelerates the whole way down and lands without a bounce, then
 * the shadow catches up. For anything that should feel like it has weight —
 * an ingot, a case lid, a stone into a tray.
 */
export const gravityDrop: Variants = {
  hidden: { y: -140, opacity: 0, rotate: -4 },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.62, ease: easeLens.gravity },
  },
};

/** Elastic unfold — a hinged panel opening past flat and settling back. */
export const elasticUnfold: Variants = {
  hidden: { rotateX: -92, opacity: 0, transformPerspective: 1000 },
  visible: {
    rotateX: 0,
    opacity: 1,
    transformPerspective: 1000,
    transition: springsHeavy.leaf,
  },
};

/** Revolve on Y — a plate turning to face the reader. */
export const revolveY = (from: -1 | 1 = 1): Variants => ({
  hidden: { rotateY: from * 78, opacity: 0, transformPerspective: 1200 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transformPerspective: 1200,
    transition: { duration: 0.95, ease: easeLens.drape },
  },
});

/**
 * Prism split: the three channels arrive from slightly different places, the
 * way white light does through a wedge. The offsets are deliberately uneven —
 * a symmetric split reads as a mistake rather than as dispersion.
 */
export const prismSplit: Variants = {
  hidden: {
    opacity: 0,
    textShadow: '-8px 0 0 rgb(255 60 60 / 0.6), 7px 2px 0 rgb(60 200 255 / 0.55)',
    letterSpacing: '0.24em',
  },
  visible: {
    opacity: 1,
    textShadow: '0px 0 0 rgb(255 60 60 / 0), 0px 0 0 rgb(60 200 255 / 0)',
    letterSpacing: '0em',
    transition: { duration: 1.05, ease: easeLens.focusRing },
  },
};

/** Clock wipe — a conic sweep, useful for anything that measures or times. */
export const clockWipe: Variants = {
  hidden: { clipPath: 'polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%)' },
  visible: {
    clipPath: 'polygon(50% 50%, 50% -60%, 160% -60%, 160% 160%, -60% 160%, -60% -60%, 50% -60%)',
    transition: { duration: 1.2, ease: easeLens.rocker },
  },
};

/** A vertical iris that opens from the centre line outward. */
export const verticalWipe: Variants = {
  hidden: { clipPath: 'inset(50% 0% 50% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.9, ease: easeLens.shutter },
  },
};

/** Page turn — a leaf lifting off the stack at its spine. */
export const pageTurn: Variants = {
  hidden: { rotateY: 0, opacity: 1 },
  visible: {
    rotateY: -168,
    opacity: 0.15,
    transition: { duration: 1.05, ease: easeLens.drape },
  },
};

/**
 * Two-dimensional stagger. A flat index stagger sweeps a grid diagonally in one
 * direction only; this lets the wave start from any corner or the centre, which
 * matters when a grid sits next to the thing that "caused" the animation.
 */
export const gridWave = (
  col: number,
  row: number,
  cols: number,
  rows: number,
  from: 'tl' | 'tr' | 'bl' | 'br' | 'centre' = 'tl',
  step = 0.045,
) => {
  const cx = from === 'centre' ? (cols - 1) / 2 : from === 'tr' || from === 'br' ? cols - 1 : 0;
  const cy = from === 'centre' ? (rows - 1) / 2 : from === 'bl' || from === 'br' ? rows - 1 : 0;
  return Math.hypot(col - cx, row - cy) * step;
};

/**
 * Magnetic settle — arrives fast, is pulled a little past centre, and is drawn
 * back as if by a magnet rather than a spring. The difference from a spring is
 * that there is exactly one overshoot, which reads as intent instead of bounce.
 */
export const magneticSettle: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: [0.9, 1.045, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.7, times: [0, 0.62, 1], ease: easeLens.focusRing },
  },
};

/** A held breath before a reveal — for anything that should feel anticipated. */
export const anticipate: Variants = {
  hidden: { scale: 1, y: 0 },
  visible: {
    scale: [1, 0.965, 1.02, 1],
    y: [0, 6, -4, 0],
    transition: { duration: 0.85, times: [0, 0.3, 0.62, 1], ease: easeLens.focusRing },
  },
};

/** Ghost trail — the element leaves copies of itself behind as it arrives. */
export const ghostTrail: Variants = {
  hidden: { x: -40, opacity: 0, filter: 'blur(3px)' },
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeLens.whip },
  },
};

/** Slow orbital arrival — comes in along an arc rather than a straight line. */
export const orbitalIn = (radius = 60, angle = -40): Variants => {
  const rad = (angle * Math.PI) / 180;
  return {
    hidden: {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
      rotate: angle * 0.25,
      opacity: 0,
      scale: 0.88,
    },
    visible: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: easeLens.drape },
    },
  };
};

/**
 * Type slam: a heading that lands hard enough to move the air around it. Pair
 * with a shockwave element using `shockwave` below, keyed to the same delay.
 */
export const typeSlam: Variants = {
  hidden: { scale: 1.9, opacity: 0, filter: 'blur(14px)', letterSpacing: '0.3em' },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    letterSpacing: '0em',
    transition: { duration: 0.55, ease: easeLens.shutter },
  },
};

/** The ring of displaced air a slammed title throws off. */
export const shockwave: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  visible: {
    scale: 2.6,
    opacity: [0, 0.5, 0],
    transition: { duration: 0.9, times: [0, 0.18, 1], ease: 'easeOut' },
  },
};

/** Liquid morph — a blob shape easing between two organic radii. */
export const liquidMorph: Variants = {
  hidden: { borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%', scale: 0.94, opacity: 0 },
  visible: {
    borderRadius: [
      '42% 58% 63% 37% / 41% 44% 56% 59%',
      '62% 38% 34% 66% / 58% 62% 38% 42%',
      '38% 62% 57% 43% / 47% 39% 61% 53%',
      '42% 58% 63% 37% / 41% 44% 56% 59%',
    ],
    scale: 1,
    opacity: 1,
    transition: {
      borderRadius: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
      scale: { duration: 0.9, ease: easeLens.drape },
      opacity: { duration: 0.9 },
    },
  },
};

/**
 * Scroll-linked helper: map a 0–1 progress to a value that rises, holds, then
 * falls. `holdRange` above does the input side; this does the output side for
 * the common case of a three-point envelope.
 */
export const envelope = <T,>(rise: T, hold: T, fall: T) => ({
  points: [0, 0.28, 0.72, 1] as const,
  values: [rise, hold, hold, fall] as const,
});

/** Press feedback with a little more travel than `pressIn`, for large plates. */
export const plateePress = {
  whileHover: { y: -4, scale: 1.012 },
  whileTap: { y: 1, scale: 0.985 },
  transition: springsHeavy.detent,
};

/** A slow, permanent shimmer for anything meant to read as precious metal. */
export const metalIdle = (seconds = 7): Variants => ({
  animate: {
    backgroundPosition: ['0% 50%', '200% 50%'],
    transition: { duration: seconds, repeat: Infinity, ease: 'linear' },
  },
});

/** A candle-flicker opacity loop — irregular on purpose. */
export const candleFlicker: Variants = {
  animate: {
    opacity: [0.82, 1, 0.88, 0.97, 0.84, 1],
    transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Viewport preset for scenes that should re-run every time they are passed. */
export const replayInView = { once: false, margin: '-15% 0px -15% 0px' } as const;

/** Viewport preset that fires the moment any part of the element appears. */
export const eagerInView = { once: true, margin: '0px 0px -2% 0px' } as const;

/* ===========================================================================
   v6 — the optics layer
   ---------------------------------------------------------------------------
   Everything above describes how an element *arrives*. This batch is about the
   camera and the light: lens behaviours that were previously hand-rolled inside
   individual components, plus the scatter helpers that a radial or helical
   layout needs and a grid stagger cannot express.

   Nothing here replaces an earlier export. Where a name looks close to one
   above it differs in mechanism — `snapZoom` is a two-frame cut where
   `crashZoom` is a continuous push, and `crossDissolve` overlaps two opacities
   where `matchCut` swaps a shape.
   =========================================================================== */

/**
 * Curves for mechanisms rather than for motion. `curtain` is weighted so a
 * falling panel accelerates and then arrests hard, the way cloth on a rail
 * does; `glass` is almost linear because a sheet of glass sliding in a groove
 * has no bounce to give; `heavy` is for anything with real mass behind it.
 */
export const easeCine = {
  curtain: [0.7, 0, 0.18, 1] as const,
  glass: [0.42, 0.02, 0.32, 1] as const,
  heavy: [0.62, 0.01, 0.24, 1] as const,
  /** Overshoots once and settles — a lid, a hinge, a sprung catch. */
  catch: [0.34, 1.42, 0.52, 1] as const,
};

/**
 * Springs tuned for surfaces the pointer is touching directly. Lower mass than
 * `springs` above, because a plate that lags behind the finger reads as broken
 * rather than as weighty.
 */
export const springsSilk = {
  /** Follows a pointer with no perceptible lag. */
  touch: { type: 'spring', stiffness: 420, damping: 34, mass: 0.34 } as const,
  /** For values that are read as numbers — settles without ringing. */
  readout: { type: 'spring', stiffness: 200, damping: 30, mass: 0.7 } as const,
  /** A long, slow settle for anything the size of a section. */
  stage: { type: 'spring', stiffness: 64, damping: 22, mass: 1.4 } as const,
};

/**
 * A Dutch tilt: the camera rolls off level. Used to unsettle a frame without
 * moving it — the roll is small enough that most visitors read it as unease
 * rather than as a rotation.
 */
export const dutchTilt: Variants = {
  hidden: { opacity: 0, rotate: -4.5, scale: 1.06 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 1.1, ease: easeCine.heavy },
  },
};

/**
 * A snap zoom — two held frames rather than a travel. The scale jumps, holds,
 * and only the opacity is interpolated, which is what makes it read as a cut
 * on a longer lens instead of a dolly.
 */
export const snapZoom: Variants = {
  hidden: { opacity: 0, scale: 1.24 },
  visible: {
    opacity: [0, 1, 1],
    scale: [1.24, 1.05, 1],
    transition: { duration: 0.52, times: [0, 0.34, 1], ease: 'linear' },
  },
};

/** Two panels part from the centre line, like barn doors on a studio lamp. */
export const barnDoorOpen: Variants = {
  hidden: { clipPath: 'inset(0% 50% 0% 50%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.05, ease: easeCine.curtain },
  },
};

/**
 * A checkerboard wipe — the transition an optical printer gives you for free
 * and a browser does not. Cells carry their own delay through `custom`, so the
 * variant is applied per cell and the pattern comes from the delay function.
 */
export const checkerWipe: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: easeCine.glass },
  }),
};

/**
 * A bellows focus: the frame breathes in and out of sharpness once before
 * settling. Reads as a lens being seated rather than as a blur fading off.
 */
export const bellowsFocus: Variants = {
  hidden: { opacity: 0, filter: 'blur(14px)', scale: 1.04 },
  visible: {
    opacity: 1,
    filter: ['blur(14px)', 'blur(1px)', 'blur(4px)', 'blur(0px)'],
    scale: 1,
    transition: { duration: 1.35, ease: easeCine.glass, times: [0, 0.42, 0.62, 1] },
  },
};

/**
 * Swings in on an arc with its origin below the frame, so the element travels
 * sideways *and* rises — a jib arm rather than a slide.
 */
export const arcSwing = (from: -1 | 1 = 1): Variants => ({
  hidden: { opacity: 0, x: 90 * from, y: 40, rotate: 6 * from },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 1, ease: easeCine.heavy },
  },
});

/**
 * Released from one side and allowed to swing to rest. Distinct from
 * `pendulumSettle` above, which starts already hanging — this one starts held.
 */
export const pendulumRelease: Variants = {
  hidden: { opacity: 0, rotate: -16, transformOrigin: '50% 0%' },
  visible: {
    opacity: 1,
    rotate: [-16, 9, -4.5, 2, 0],
    transition: { duration: 1.6, ease: 'easeOut', times: [0, 0.34, 0.58, 0.8, 1] },
  },
};

/** Turns in from depth on its own axis — a card rotating out of the stack. */
export const spinInDepth: Variants = {
  hidden: { opacity: 0, rotateY: -62, z: -180, scale: 0.9 },
  visible: {
    opacity: 1,
    rotateY: 0,
    z: 0,
    scale: 1,
    transition: { duration: 1.05, ease: easeCine.heavy },
  },
};

/** An idle that reads as a lens hunting very slightly for focus. */
export const lensBreathe = (seconds = 8): Variants => ({
  animate: {
    filter: ['blur(0px)', 'blur(0.6px)', 'blur(0px)'],
    scale: [1, 1.006, 1],
    transition: { duration: seconds, repeat: Infinity, ease: 'easeInOut' },
  },
});

/**
 * A masked slide: the element travels under a fixed window rather than the
 * window travelling with it, so the leading edge is always crisp.
 */
export const slideRevealMask = (axis: 'x' | 'y' = 'y'): Variants => ({
  hidden: {
    opacity: 0,
    ...(axis === 'y' ? { y: '110%' } : { x: '110%' }),
    clipPath: 'inset(0% 0% 0% 0%)',
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.95, ease: easeCine.curtain },
  },
});

/** Struck down onto the page and rebounding once, like a hallmark punch. */
export const stampPress: Variants = {
  hidden: { opacity: 0, scale: 1.5, rotate: -8 },
  visible: {
    opacity: 1,
    scale: [1.5, 0.94, 1.02, 1],
    rotate: [-8, 1.5, -0.5, 0],
    transition: { duration: 0.68, ease: easeCine.catch, times: [0, 0.5, 0.76, 1] },
  },
};

/** Unwraps downward from a fold at the top edge. */
export const unwrapY: Variants = {
  hidden: { opacity: 0, scaleY: 0.02, transformOrigin: '50% 0%' },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.85, ease: easeCine.curtain },
  },
};

/** A cloth lifted straight up off whatever was under it. */
export const curtainLift: Variants = {
  hidden: { y: '0%' },
  visible: {
    y: '-104%',
    transition: { duration: 1.15, ease: easeCine.curtain },
  },
};

/**
 * The overlap half of a dissolve. Apply to the outgoing layer with
 * `initial="visible"` and the incoming one with the usual pair; both hold the
 * same 0.9s so the mid-point sits at exactly 50 percent of each.
 */
export const crossDissolve: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: 'linear' } },
};

/** An iris that opens from a point rather than from a rectangle's inset. */
export const wipeCircle = (at = '50% 50%'): Variants => ({
  hidden: { clipPath: `circle(0% at ${at})` },
  visible: {
    clipPath: `circle(140% at ${at})`,
    transition: { duration: 1.2, ease: easeCine.glass },
  },
});

/** Arrives on a bloom of light rather than on a movement. */
export const flareIn: Variants = {
  hidden: { opacity: 0, filter: 'brightness(2.4) saturate(0.4)' },
  visible: {
    opacity: 1,
    filter: ['brightness(2.4) saturate(0.4)', 'brightness(1.18) saturate(0.9)', 'brightness(1) saturate(1)'],
    transition: { duration: 1.1, ease: 'easeOut', times: [0, 0.4, 1] },
  },
};

/** A long, soft rise for body copy that should not compete with a headline. */
export const driftUpFade: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.25, ease: ease.luxury },
  },
};

/** Embers off a quench: rises, wanders, and goes out. Loops forever. */
export const emberFloat = (index = 0): Variants => ({
  animate: {
    y: [0, -140 - (index % 4) * 26],
    x: [0, (index % 2 ? 1 : -1) * (14 + (index % 3) * 9), 0],
    opacity: [0, 0.85, 0],
    scale: [0.6, 1, 0.4],
    transition: {
      duration: 5.4 + (index % 5) * 0.7,
      repeat: Infinity,
      delay: index * 0.42,
      ease: 'easeOut',
    },
  },
});

/** Folds toward the viewer on the Z axis, hinged on its left edge. */
export const foldZ: Variants = {
  hidden: { opacity: 0, rotateY: 74, transformOrigin: '0% 50%' },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: { duration: 0.95, ease: easeCine.heavy },
  },
};

/** Drops open on a hinge at its top edge — a shop shutter, a flap, a leaf. */
export const hingeDown: Variants = {
  hidden: { opacity: 0, rotateX: -82, transformOrigin: '50% 0%' },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.9, ease: easeCine.catch },
  },
};

/**
 * A splice passing the gate: one frame of white, a jump, and then steady. Two
 * held frames rather than a fade, because a splice is a physical join.
 */
export const filmSplice: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: [0, 1, 0.4, 1],
    y: [-6, 2, -1, 0],
    filter: ['brightness(2.6)', 'brightness(1)', 'brightness(1.6)', 'brightness(1)'],
    transition: { duration: 0.4, times: [0, 0.3, 0.55, 1], ease: 'linear' },
  },
};

/** Two beats, the second smaller — for anything that should read as alive. */
export const heartbeat = (seconds = 3.6): Variants => ({
  animate: {
    scale: [1, 1.055, 1, 1.028, 1],
    transition: {
      duration: seconds,
      repeat: Infinity,
      times: [0, 0.09, 0.2, 0.29, 1],
      ease: 'easeOut',
    },
  },
});

/** Rises as the section is scrolled rather than on entry. Pair with `holdRange`. */
export const parallaxRise: Variants = {
  hidden: { opacity: 0, y: 64, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.15, ease: easeCine.glass },
  },
};

/** A stone dropping onto the cloth: overshoot, one small bounce, still. */
export const caratPop: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: -30 },
  visible: {
    opacity: 1,
    scale: [0.3, 1.14, 0.96, 1],
    y: [-30, 0, -4, 0],
    transition: { duration: 0.82, ease: easeCine.catch, times: [0, 0.52, 0.76, 1] },
  },
};

/* ---------------------------------------------------------------------------
   Scatter helpers.

   `gridDelay` above orders a rectangular grid. These order the layouts a grid
   cannot describe: rings, spirals, chains and anything whose sequence is a
   distance rather than a row and a column.
--------------------------------------------------------------------------- */

/**
 * Delay by distance from a centre point, so a reveal travels outward as a ring.
 * `centre` is in the same index space as `index`, defaulting to the middle.
 */
export const radialDelay = (
  index: number,
  total: number,
  step = 0.06,
  centre = (total - 1) / 2
) => Math.abs(index - centre) * step;

/**
 * Delay along a spiral: the further out a turn, the longer the arm takes to
 * reach it, so the step grows with the square root of the index rather than
 * linearly. A linear step on a spiral looks like it decelerates.
 */
export const spiralDelay = (index: number, step = 0.09) => Math.sqrt(index) * step;

/** Delay around a ring, measured as the shorter way round from `from`. */
export const orbitDelay = (index: number, total: number, from = 0, step = 0.07) => {
  const raw = Math.abs(index - from);
  return Math.min(raw, total - raw) * step;
};

/**
 * Delay down a chain, where each link is held back by the one above it and the
 * hold accumulates — so the bottom of a long chain lags noticeably.
 */
export const chainDelay = (index: number, step = 0.05, sag = 0.012) =>
  index * step + index * index * sag;

/**
 * A 2D wave whose crest travels on a diagonal. Distinct from `gridWave` above:
 * that one takes a corner, this one takes an angle, which is what a light
 * source moving across a wall actually produces.
 */
export const staggerWave2D = (
  col: number,
  row: number,
  angleDeg = 32,
  step = 0.05
) => {
  const rad = (angleDeg * Math.PI) / 180;
  return (col * Math.cos(rad) + row * Math.sin(rad)) * step;
};

/** Straight index stagger with an optional cap, so long lists stay watchable. */
export const staggerFromIndex = (index: number, step = 0.06, max = 0.9) =>
  Math.min(index * step, max);

/**
 * Depth in a stack, as the three values a plate needs to sit behind another:
 * scale, vertical offset and dim. Kept together because changing one without
 * the others breaks the illusion immediately.
 */
export const depthOf = (level = 0) => ({
  scale: 1 - level * 0.045,
  y: level * -14,
  opacity: 1 - level * 0.16,
});

/**
 * Map a scroll progress to a sub-range of it, clamped. The common case for
 * scenes with several beats: beat three should start at 0.5 and finish at 0.7,
 * and should not run backwards outside that window.
 */
export const scrubRange = (progress: number, start: number, end: number) => {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
};

/** Picks a transition or a zero-duration one, by preference. One-liner, used everywhere. */
export const easeFor = (reduced: boolean | null | undefined, t: object) =>
  reduced ? { duration: 0 } : t;

/** Fires late, so a tall scene has already been partly read before it moves. */
export const onceInViewLate = { once: true, margin: '-38% 0px -38% 0px' } as const;

/** Re-runs on every pass, but only once the element is well inside the frame. */
export const replayInViewSoft = { once: false, margin: '-28% 0px -28% 0px' } as const;

/* ===========================================================================
   v7 — the projection layer
   ---------------------------------------------------------------------------
   v6 described the camera and the light. This batch describes everything
   *between* the camera and the eye: the gate the film runs through, the splice
   where two reels meet, the heat that bends the air over a forge, the leaf
   being laid onto a surface.

   The distinction matters because projection artefacts obey different rules
   from camera moves. A camera move is smooth and intentional, so it wants an
   ease. A projection artefact is mechanical and slightly wrong on purpose, so
   it wants a *step* — which is why several curves here are deliberately jerky
   and why the weave helpers below return unsmoothed values.

   As with every earlier batch, nothing here replaces an existing export. Where
   a name reads close to one above, the mechanism differs: `gateWeave` is a
   two-axis mechanical jitter where `handheldSettle` is a damped arrival, and
   `spliceCut` is a hard frame replacement where `filmSplice` is a bleached
   overlap.
   =========================================================================== */

/**
 * Curves for mechanisms that are not trying to be graceful.
 *
 * `gate` is the pull-down claw: nothing, then everything, then nothing — a real
 * projector advances a frame in about a fifth of the time the frame is on
 * screen. `sprocket` is linear because a perforation strip has no acceleration
 * to give. `ratchet` arrives early and holds, which is what a stepped dial does
 * between its stops.
 */
export const easeMachine = {
  gate: [0.85, 0, 0.15, 1] as const,
  sprocket: [0, 0, 1, 1] as const,
  ratchet: [0.18, 0.94, 0.24, 1] as const,
  /** A shutter blade: symmetrical, and fast at both ends. */
  blade: [0.55, 0, 0.45, 1] as const,
};

/**
 * The gate weave. A projector never holds a frame perfectly still — the claw
 * has play in it, so the image drifts a fraction of a percent in both axes and
 * the drift is not periodic.
 *
 * Returned as a keyframe array rather than a spring because the whole point is
 * that it does *not* settle. Two prime-ish cycle counts on the two axes keep the
 * pattern from repeating on any interval a viewer can perceive.
 */
export const gateWeave = (amount = 1): Variants => ({
  hidden: { x: 0, y: 0 },
  visible: {
    x: [0, amount * 0.6, -amount * 0.35, amount * 0.2, -amount * 0.5, 0],
    y: [0, -amount * 0.4, amount * 0.7, -amount * 0.25, amount * 0.3, 0],
    transition: {
      duration: 1.7,
      repeat: Infinity,
      ease: 'linear',
      times: [0, 0.19, 0.37, 0.58, 0.81, 1],
    },
  },
});

/**
 * A hard splice: one frame replaces another with no overlap at all, plus the
 * single bleached frame that a physical splice always leaves behind.
 *
 * The bleach is the reason this is not just an opacity swap. Tape splices pass
 * more light for exactly one frame, and that flash is the thing an audience
 * reads as "the reel changed" rather than as "the shot changed".
 */
export const spliceCut: Variants = {
  hidden: { opacity: 0, filter: 'brightness(2.4) contrast(0.6)' },
  visible: {
    opacity: [0, 1, 1],
    filter: ['brightness(2.4) contrast(0.6)', 'brightness(1.5) contrast(0.85)', 'brightness(1) contrast(1)'],
    transition: { duration: 0.34, ease: easeMachine.blade, times: [0, 0.12, 1] },
  },
};

/**
 * Cue dots — the two marks in the top-right corner that tell a projectionist to
 * start the second machine. Eight frames on, gone. Not decorative: it is the
 * only diegetic way a page has of saying "something is about to change".
 */
export const cueDot: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [0.7, 1, 1, 1.1],
    transition: { duration: 0.42, times: [0, 0.1, 0.78, 1], ease: 'linear' },
  },
};

/**
 * An anamorphic desqueeze. Real anamorphic glass records a 2x horizontally
 * compressed image, and the projector stretches it back — so a title that
 * *arrives* through that path should arrive narrow and widen, never the reverse.
 *
 * The vertical is left alone deliberately. Squeezing both axes is a zoom, and a
 * zoom says something completely different.
 */
export const desqueeze: Variants = {
  hidden: { scaleX: 0.62, opacity: 0, filter: 'blur(6px)' },
  visible: {
    scaleX: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * The horizontal streak anamorphic glass puts across a highlight. Travels, and
 * is at its brightest in the middle third rather than at either end, because a
 * flare peaks when the source crosses the axis of the lens.
 */
export const streakFlare = (seconds = 2.8): Variants => ({
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: [0, 1, 1, 0],
    opacity: [0, 0.9, 0.55, 0],
    transition: { duration: seconds, times: [0, 0.28, 0.7, 1], ease: 'easeInOut' },
  },
});

/**
 * Gilding. Gold leaf is laid, not painted, so it arrives in irregular patches
 * that overlap — which means the useful animation is a *mask* growing in steps
 * rather than an opacity ramp.
 *
 * The brightness spike at the two-thirds mark is the burnisher: the moment the
 * agate goes over the leaf and it stops looking like foil.
 */
export const leafLay = (index = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.86, rotate: (index % 2 ? -1 : 1) * (3 + (index % 5)) },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.62,
      delay: index * 0.055,
      ease: easeMachine.ratchet,
    },
  },
});

/** The burnish pass over already-laid leaf. Brightness only — nothing moves. */
export const burnish: Variants = {
  hidden: { filter: 'brightness(0.82) saturate(0.7)' },
  visible: {
    filter: [
      'brightness(0.82) saturate(0.7)',
      'brightness(1.35) saturate(1.25)',
      'brightness(1) saturate(1.05)',
    ],
    transition: { duration: 1.4, times: [0, 0.66, 1], ease: 'easeOut' },
  },
};

/**
 * Heat haze. The air over a forge does not shimmer evenly — the column rises,
 * so the distortion is strongest low and dies out with height, and it drifts
 * upward while it does it.
 *
 * Expressed as a scale-and-skew pair because an SVG turbulence filter cannot be
 * animated cheaply on the main thread; this is the compositor-only version of
 * the same illusion and it holds up at any size under about 400px.
 */
export const heatRise = (strength = 1): Variants => ({
  hidden: { skewX: 0, scaleY: 1 },
  visible: {
    skewX: [0, strength * 0.5, -strength * 0.35, strength * 0.42, 0],
    scaleY: [1, 1 + strength * 0.004, 1 - strength * 0.003, 1 + strength * 0.005, 1],
    transition: { duration: 3.1, repeat: Infinity, ease: 'easeInOut' },
  },
});

/**
 * A cast shadow responding to a light that has moved. Shadows do three things at
 * once when a source travels and only the first is usually animated: they swing,
 * they *lengthen*, and they soften as they lengthen. Doing the swing alone is
 * the tell that a shadow is a decoration.
 */
export const shadowThrow = (angle = 0, distance = 1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.42 / Math.max(0.6, distance),
    x: Math.cos(angle) * 26 * distance,
    y: Math.sin(angle) * 26 * distance,
    scaleY: 1 + distance * 0.22,
    filter: `blur(${(3 + distance * 5).toFixed(1)}px)`,
    transition: { type: 'spring', stiffness: 140, damping: 24, mass: 0.8 },
  },
});

/**
 * A time-slice column. Each vertical strip of a slit-scan image is a different
 * moment, so each one arrives from a different offset — and the offset has to be
 * a *function of the column index* rather than random, or the reconstruction
 * reads as noise instead of as time.
 */
export const sliceColumn = (index: number, total: number, lean = 1): Variants => {
  const t = total > 1 ? index / (total - 1) : 0;
  return {
    hidden: { y: `${(t - 0.5) * 46 * lean}%`, opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.9, delay: t * 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };
};

/**
 * A magnifier's edge distortion. A real lens does not simply enlarge — it
 * enlarges at the centre and compresses at the rim, so the useful pair is a
 * scale *and* a counter-scaled ring.
 */
export const loupeOpen: Variants = {
  hidden: { scale: 0.4, opacity: 0, filter: 'blur(4px)' },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 26, mass: 0.5 },
  },
};

/**
 * Two plates hinged along their shared edge, opening like a locket. Distinct
 * from `foldOpen` above, which rotates a single plate — a locket has to move
 * both halves in opposite directions or the hinge appears to slide.
 */
export const locketOpen = (half: 'top' | 'bottom'): Variants => ({
  hidden: { rotateX: half === 'top' ? 0 : 0, opacity: 1 },
  visible: {
    rotateX: half === 'top' ? -152 : 4,
    transition: { duration: 1.1, ease: easeMachine.ratchet },
  },
});

/**
 * A needle settling on a dial with real inertia: overshoots, comes back past
 * the mark, and stops. Distinct from `pendulumSettle`, which is symmetrical —
 * a sprung needle is damped much harder on the return than on the throw.
 */
export const needleSwing = (to: number): Variants => ({
  hidden: { rotate: -46 },
  visible: {
    rotate: [-46, to + 7, to - 2.5, to],
    transition: { duration: 1.15, times: [0, 0.52, 0.78, 1], ease: 'easeOut' },
  },
});

/**
 * Weighing pans finding their balance. Both pans move, in opposition, and the
 * beam they hang from settles first — which is why the delay is on the pans and
 * not on the beam.
 */
export const balanceSettle = (side: -1 | 1, tilt = 0): Variants => ({
  hidden: { y: side * 18, rotate: 0 },
  visible: {
    y: side * tilt * 18,
    rotate: -side * tilt * 4,
    transition: { type: 'spring', stiffness: 90, damping: 14, mass: 1.1, delay: 0.12 },
  },
});

/**
 * A drawer coming out of a cabinet. Travels on Z rather than Y, and the shadow
 * it throws back onto the carcass is the part that sells it — a drawer with no
 * shadow reads as a card sliding on a flat plane.
 */
export const drawerPull: Variants = {
  hidden: { z: 0, y: 0, boxShadow: '0 0 0 0 rgb(0 0 0 / 0)' },
  visible: {
    z: 90,
    y: 14,
    boxShadow: '0 30px 60px -24px rgb(0 0 0 / 0.55)',
    transition: { type: 'spring', stiffness: 180, damping: 26, mass: 0.9 },
  },
};

/**
 * A sheet of tissue being lifted off something. Two things move: the sheet, and
 * the *light* on what was under it. Lifting the sheet alone is a slide.
 */
export const tissueLift: Variants = {
  hidden: { y: 0, rotate: 0, opacity: 1 },
  visible: {
    y: '-118%',
    rotate: -7,
    opacity: 0,
    transition: { duration: 1.25, ease: easeMachine.ratchet },
  },
};

/**
 * Vignette breathing. A projected image is never evenly lit and the falloff
 * moves very slightly with the lamp. Slow enough that nobody sees it happen and
 * fast enough that a still frame never looks like a screenshot.
 */
export const lampBreathe = (seconds = 11): Variants => ({
  hidden: { opacity: 0.5 },
  visible: {
    opacity: [0.5, 0.36, 0.56, 0.44, 0.5],
    transition: { duration: seconds, repeat: Infinity, ease: 'easeInOut' },
  },
});

/** ---------------------------------------------------------------------------
    Helpers — index maths for the layouts v7 introduces.
    ------------------------------------------------------------------------ */

/**
 * Delay for anything laid along a serpentine path: left to right on even rows,
 * right to left on odd ones. A grid stagger cannot express this, and the
 * difference is visible the moment a row is more than about four cells wide —
 * a plain stagger restarts at the left edge, which reads as a jump.
 */
export const boustrophedonDelay = (index: number, perRow: number, step = 0.05) => {
  const row = Math.floor(index / perRow);
  const col = index % perRow;
  const along = row % 2 === 0 ? col : perRow - 1 - col;
  return (row * perRow + along) * step;
};

/**
 * Delay weighted by distance from a moving front rather than from a point. Used
 * where a sweep crosses a field at an angle — a diagonal wipe over a grid is
 * this, and a radial delay is visibly wrong for it.
 */
export const frontDelay = (
  x: number,
  y: number,
  angleDeg = 35,
  step = 0.5
) => {
  const a = (angleDeg * Math.PI) / 180;
  return Math.max(0, (x * Math.cos(a) + y * Math.sin(a))) * step;
};

/**
 * Maps a 0–1 progress onto a value that rises, holds and falls — the shape
 * almost every scroll-driven overlay actually wants. Returns 0 outside the
 * window, so an overlay built on it is genuinely absent rather than transparent.
 */
export const pulseAt = (progress: number, centre: number, width = 0.2) => {
  const d = Math.abs(progress - centre);
  if (d > width) return 0;
  return 1 - d / width;
};

/**
 * Quantises a continuous progress to whole steps. The reason this exists rather
 * than a `Math.round` at each call site is that a stepped value read off a
 * continuous one has to be *stable* at the boundaries, and rounding alone
 * flickers between two steps when a scroll rests exactly on the edge.
 */
export const quantise = (progress: number, steps: number, hysteresis = 0.02) => {
  const raw = progress * (steps - 1);
  const base = Math.floor(raw);
  const frac = raw - base;
  if (frac < 0.5 - hysteresis) return base;
  if (frac > 0.5 + hysteresis) return Math.min(steps - 1, base + 1);
  return Math.min(steps - 1, Math.round(raw));
};

/** Fires only when an element is fully across the frame — for pinned scenes. */
export const onceFullyInView = { once: true, margin: '-45% 0px -45% 0px' } as const;

/** Replays, and fires early enough that a tall scene is already moving. */
export const replayInViewEager = { once: false, margin: '8% 0px 8% 0px' } as const;

/* ===========================================================================
   v8 — the workshop, and the bench drawing that precedes it
   ---------------------------------------------------------------------------
   The batch number is one ahead of the CSS wave that landed with it, because
   this file reached "the projection layer" a wave earlier than the stylesheet
   did. Nothing is renamed to reconcile them — the numbers are labels for the
   order things arrived in, not a version anybody depends on.

   Every earlier batch here describes how something is *seen*: a camera move, a
   lens artefact, a projection fault, a light. This one describes how something
   is *made*. Metal is heated until its grain relaxes and then quenched. An
   ingot is squeezed between two rollers and comes out longer. Wire is dragged
   through a hole smaller than itself. A punch is struck. Four claws are bent
   over a stone. A strand is knotted between every pearl.

   That difference has a real consequence for the curves rather than being a
   thematic note. A camera move is chosen by a person, so it eases: slow in,
   slow out. A workshop process is governed by material, so it does not. Metal
   under a roller accelerates as it thins because the same force acts on less
   section. A punch decelerates against nothing at all — it stops because the
   metal stops it, which is a collision and not an ease. A drawn wire creeps
   and then runs. The curves below are shaped from that rather than from taste,
   which is why several of them are asymmetric in a way none of the cinematic
   ones are.

   As always: nothing here replaces an existing export. Where a name reads close
   to one above, the mechanism differs and the comment says how.
   =========================================================================== */

/**
 * Curves taken from material rather than from a camera operator.
 *
 * `draw` is a wire coming through a die: nothing happens for a long moment
 * while the load builds, then it runs. `roll` is the opposite — an ingot moves
 * fastest at the instant it is bitten and slows as the section thickens toward
 * the tail. `strike` has almost no out-curve at all, because a punch stops
 * against metal rather than easing to rest, and `anneal` is nearly linear
 * because heat soaks at a rate the smith cannot hurry.
 */
export const easeForge = {
  draw: [0.86, 0.02, 0.34, 1] as const,
  roll: [0.1, 0.72, 0.32, 1] as const,
  strike: [0.62, 0, 0.86, 0.24] as const,
  anneal: [0.4, 0.06, 0.6, 0.94] as const,
  /** A quench: violent, then absolutely finished. */
  quench: [0.05, 0.92, 0.12, 1] as const,
};

/**
 * Springs for parts that are held by something rather than floating.
 *
 * `claw` is stiff and barely bounces, because gold that has been bent over a
 * girdle does not spring back — if it did, the stone would be loose. `strand`
 * is the opposite: a knotted pearl strand is heavy and lightly damped, so it
 * swings for a while. `jaw` is a caliper closing, which is a slide with
 * friction rather than a spring at all, so it is heavily overdamped.
 */
export const springsBench = {
  claw: { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const,
  strand: { type: 'spring', stiffness: 90, damping: 12, mass: 1.4 } as const,
  jaw: { type: 'spring', stiffness: 260, damping: 40, mass: 1 } as const,
  punch: { type: 'spring', stiffness: 900, damping: 26, mass: 1.6 } as const,
};

/**
 * Metal coming up to annealing heat, as a background-position sweep across the
 * colour ramp in `.anneal-skin`.
 *
 * The ramp is the one a bench actually watches for. Steel and silver both run
 * straw → brown → purple → blue; gold alloys skip most of it and go to a dull
 * cherry. Either way the smith is reading a *colour* to decide a *temperature*,
 * which is one of the last places in any trade where that is still true, and it
 * is the reason this is a gradient sweep rather than a fade to orange.
 */
export const annealRamp: Variants = {
  hidden: { backgroundPosition: '0% 0' },
  visible: {
    backgroundPosition: '100% 0',
    transition: { duration: 2.4, ease: easeForge.anneal },
  },
};

/**
 * The quench. Down fast, a shudder as the steam jacket collapses, and then
 * completely still — colder and harder than it started.
 */
export const quenchDrop: Variants = {
  hidden: { y: -18, scale: 1.04, filter: 'brightness(1.5) saturate(1.4)' },
  visible: {
    y: [-18, 6, 0],
    scale: [1.04, 0.98, 1],
    filter: [
      'brightness(1.5) saturate(1.4)',
      'brightness(1.05) saturate(1.05)',
      'brightness(1) saturate(1)',
    ],
    transition: { duration: 0.72, ease: easeForge.quench, times: [0, 0.42, 1] },
  },
};

/**
 * An ingot bitten by a rolling mill: it gets thinner and, because the volume
 * has nowhere else to go, exactly that much longer.
 *
 * `pass` is which pass through the mill this is — the mill is closed a little
 * further each time, so every pass takes less and the piece approaches its
 * final section asymptotically rather than linearly. Three passes is the usual
 * number before the metal has to be annealed again.
 */
export const rollPass = (pass = 1): Variants => {
  const reduction = 1 - 0.26 / pass;
  return {
    hidden: { scaleY: 1, scaleX: 1 },
    visible: {
      scaleY: reduction,
      scaleX: 1 / reduction,
      transition: { duration: 0.9, ease: easeForge.roll },
    },
  };
};

/**
 * Wire pulled through a draw plate. It creeps while the load builds and then
 * runs, and it comes out of the far side thinner by the square root of the area
 * ratio — which is why `to` is applied to the cross-section and not to the
 * width the caller thinks it is setting.
 */
export const wireDraw = (to = 0.62): Variants => ({
  hidden: { scaleY: 1, x: '-4%' },
  visible: {
    scaleY: Math.sqrt(to),
    x: '0%',
    transition: { duration: 1.3, ease: easeForge.draw },
  },
});

/**
 * A punch struck, and the recoil that follows it.
 *
 * The recoil is the detail. A hallmark is struck once and the punch bounces —
 * and the bounce is *small*, because most of the energy went into the metal.
 * Anything springier than this reads as a toy hammer.
 */
export const punchStrike: Variants = {
  hidden: { y: '-140%', opacity: 0 },
  visible: {
    y: ['-140%', '0%', '-16%', '0%'],
    opacity: 1,
    transition: { duration: 0.54, ease: easeForge.strike, times: [0, 0.52, 0.7, 1] },
  },
};

/**
 * The bruise a punch leaves: the impression appears at the instant of contact
 * and the displaced metal rises around it a beat later, because metal takes a
 * moment to flow.
 */
export const punchImpression: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: 0.28, ease: easeForge.strike },
  },
};

/**
 * Four claws bent over a girdle, one after another.
 *
 * A setter does not close claws in a circle — they close opposite pairs, the
 * way a wheel nut is tightened, so the stone cannot walk out of true. `index`
 * is the claw's position and the delay order below is 0, 2, 1, 3 rather than
 * 0, 1, 2, 3 for exactly that reason.
 */
export const clawClose = (index = 0, total = 4): Variants => {
  const half = Math.max(1, Math.floor(total / 2));
  const order = index % 2 === 0 ? index / 2 : half + (index - 1) / 2;
  return {
    hidden: { rotate: index % 2 === 0 ? -26 : 26 },
    visible: {
      rotate: 0,
      transition: { ...springsBench.claw, delay: order * 0.16 },
    },
  };
};

/**
 * A pearl threaded onto a strand and the knot cinched behind it.
 *
 * Knotting between pearls is the one piece of stringing that everybody
 * recognises and almost nobody knows the reason for: it is not decoration and
 * it is not spacing. It is so that a broken strand loses one pearl rather than
 * all of them, and so that the pearls cannot abrade each other's nacre.
 */
export const beadThread = (index = 0, step = 0.055): Variants => ({
  hidden: { x: '-90%', scale: 0.5, opacity: 0 },
  visible: {
    x: '0%',
    scale: 1,
    opacity: 1,
    transition: { ...springsBench.jaw, delay: index * step },
  },
});

export const knotCinch = (index = 0, step = 0.055): Variants => ({
  hidden: { scale: 0.2, opacity: 0 },
  visible: {
    scale: [0.2, 1.24, 1],
    opacity: 1,
    transition: {
      duration: 0.34,
      delay: index * step + 0.12,
      ease: [0.34, 1.42, 0.52, 1],
      times: [0, 0.62, 1],
    },
  },
});

/**
 * A caliper closing onto something and stopping dead against it.
 *
 * `from` is how far open the jaw starts, in pixels. There is deliberately no
 * overshoot on the closing jaw — a caliper that bounced off the work would be a
 * caliper you could not trust — but there *is* a tiny settle, because the
 * thumbwheel is turned by a hand and a hand overshoots.
 */
export const caliperClose = (from = 44): Variants => ({
  hidden: { x: -from },
  visible: {
    x: [-from, 2, 0],
    transition: { duration: 0.86, ease: easeForge.draw, times: [0, 0.82, 1] },
  },
});

/**
 * A dimension line drawn across a drawing, then its figure written above it.
 *
 * Two exports rather than one because the order is the whole convention: a
 * draughtsman rules the extension lines, then the dimension line between them,
 * then writes the figure. A figure that appears before its line has nothing to
 * refer to.
 */
export const dimensionRule = (delay = 0): Variants => ({
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

export const dimensionFigure = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: delay + 0.44, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * Silverpoint hatching, building tone in passes.
 *
 * A silverpoint line cannot be made darker by pressing harder — the stylus lays
 * down a fixed amount of metal — so a draughtsman builds tone by crossing more
 * lines over the same area. That is why this animates a *mask* rather than an
 * opacity: opacity would fade a finished drawing in, and what actually happens
 * is that an unfinished drawing gets more lines.
 */
export const hatchBuild = (passes = 3): Variants => ({
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.5 * passes, ease: [0.42, 0.02, 0.32, 1] },
  },
});

/**
 * A sheet unfolding along a crease.
 *
 * Distinct from `foldOpen` and `unwrapY` above: both of those rotate a whole
 * panel about an edge. This one carries the *shade* the raised leaf throws on
 * the leaf beneath it, which is the only thing that makes a fold read as paper
 * rather than as a hinged card.
 */
export const creaseOpen = (index = 0): Variants => ({
  hidden: { rotateX: -92, opacity: 0 },
  visible: {
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.78,
      delay: index * 0.22,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

/** The shade cast into the fold, which is deepest exactly while it is moving. */
export const creaseShade = (index = 0): Variants => ({
  hidden: { opacity: 0.55 },
  visible: {
    opacity: [0.55, 0.28, 0],
    transition: { duration: 0.78, delay: index * 0.22, times: [0, 0.6, 1] },
  },
});

/**
 * A camera rig driven by scroll rather than by time.
 *
 * Returns the four numbers a move is actually made of, given a 0–1 progress:
 * how far the camera has travelled in, how far it has panned, how far it has
 * tilted, and how much roll it has picked up. Keeping them together matters,
 * because a dolly with no roll at all reads as a slider and a dolly with too
 * much reads as a drone — the ratio between them is the personality of the move
 * and it is the thing worth having one definition of.
 */
export const cameraMove = (
  progress: number,
  opts: { dolly?: number; pan?: number; tilt?: number; roll?: number } = {}
) => {
  const { dolly = 120, pan = 0, tilt = 0, roll = 0 } = opts;
  // Eased rather than linear: a scroll is linear and a camera operator is not.
  const t = progress * progress * (3 - 2 * progress);
  return {
    z: t * dolly,
    x: (t - 0.5) * 2 * pan,
    rotateX: (t - 0.5) * 2 * tilt,
    rotateZ: (t - 0.5) * 2 * roll,
  };
};

/**
 * How much a layer at `depth` moves for a given camera translation.
 *
 * Real parallax is a division, not a multiplication: a layer twice as far away
 * moves half as much, and the near layer is the one that should be fast. Most
 * web parallax gets this backwards by assigning speeds directly, which is why
 * it so often reads as a set of sliding planes rather than as depth.
 */
export const parallaxAt = (depth = 1, travel = 100) => travel / Math.max(0.2, depth);

/**
 * Granules seeking their positions in a pattern.
 *
 * Granulation is gold beads fused to a surface without solder, and the beads
 * are placed one at a time with a brush and a held breath. The delay is
 * proportional to distance from the centre of the pattern, because that is the
 * order somebody laying them would work in — outside in would leave nowhere to
 * rest a hand.
 */
export const granuleSettle = (distance = 0, spread = 0.9): Variants => ({
  hidden: { scale: 0, opacity: 0, y: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.44,
      delay: distance * spread,
      ease: [0.34, 1.42, 0.52, 1],
    },
  },
});

/**
 * A polishing lap turning, and slowing when it is let go of.
 *
 * Constant while the section is in view, then a long spin-down rather than a
 * stop: a lap wheel is heavy and it coasts for a surprisingly long time, which
 * is the reason bench guards exist.
 */
export const lapSpin = (rpm = 40): Variants => ({
  hidden: { rotate: 0 },
  visible: {
    rotate: 360,
    transition: { duration: 60 / rpm, ease: 'linear', repeat: Infinity },
  },
});

/**
 * Sparks off a lap. `angle` is where the stone meets the wheel, so the spray
 * leaves on the tangent rather than radially — which is the single thing that
 * separates a spark spray from a firework.
 */
export const sparkFly = (angle: number, index: number): Variants => {
  const spread = ((index % 7) - 3) * 0.13;
  const theta = angle + spread;
  const reach = 34 + (index % 5) * 13;
  return {
    hidden: { x: 0, y: 0, scale: 1, opacity: 0 },
    visible: {
      x: Math.cos(theta) * reach,
      y: Math.sin(theta) * reach,
      scale: 0.2,
      opacity: [0, 1, 0],
      transition: {
        duration: 0.5 + (index % 4) * 0.12,
        delay: (index % 9) * 0.07,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 0.5,
      },
    },
  };
};

/**
 * A bar or a column growing from its own baseline.
 *
 * Kept here rather than written at each call site because the origin is the
 * part that is easy to get wrong, and a bar that grows from its centre is a bar
 * that lies about where zero is.
 */
export const barGrow = (index = 0, step = 0.06, axis: 'x' | 'y' = 'x'): Variants => ({
  hidden: axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
  visible: {
    ...(axis === 'x' ? { scaleX: 1 } : { scaleY: 1 }),
    transition: { duration: 0.72, delay: index * step, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * A plotted line drawing itself left to right.
 *
 * Paired with `barGrow` so a panel with both never has to invent two different
 * arrival speeds for the same data.
 */
export const traceLine = (delay = 0, seconds = 1.1): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: seconds, delay, ease: [0.42, 0.02, 0.32, 1] },
      opacity: { duration: 0.2, delay },
    },
  },
});

/**
 * A crosshair snapping to the nearest sample.
 *
 * Fast on purpose. A tooltip that eases into place lags the pointer and reads
 * as broken; the only thing that should be smooth about a crosshair is where it
 * lands, not how long it takes.
 */
export const crosshairSnap: Variants = {
  hidden: { opacity: 0, scaleY: 0.5 },
  visible: { opacity: 1, scaleY: 1, transition: { duration: 0.12 } },
};

/**
 * Nap left in velvet by a pointer, fading as the pile stands back up.
 *
 * The fade is slow and the appearance is instant, which is the whole behaviour
 * of a pile fabric: it takes the mark immediately and gives it up over seconds.
 */
export const napTrail: Variants = {
  hidden: { opacity: 0.85 },
  visible: { opacity: 0, transition: { duration: 1.7, ease: 'easeOut' } },
};

/**
 * A tilt-shift band tightening as a section is scrolled through — the plane of
 * focus narrowing until the scene reads as a model of itself.
 */
export const tiltShiftBand = (progress: number, maxBlur = 6) => ({
  '--tilt-blur': `${(1 - Math.abs(progress - 0.5) * 2) * maxBlur}px`,
  '--tilt-centre': `${30 + progress * 40}%`,
});

/**
 * Rough being sawn, and the two halves parting.
 *
 * `side` is which half. The parting is not symmetrical: a sawn stone is cleaved
 * or laser-sawn along one plane and the two halves are almost never the same
 * size, which is the fact the whole yield question rests on.
 */
export const sawPart = (side: -1 | 1, share = 0.5): Variants => ({
  hidden: { x: 0, rotate: 0, opacity: 1 },
  visible: {
    x: side * (26 + share * 30),
    rotate: side * (4 + share * 6),
    transition: { duration: 0.9, ease: easeForge.draw },
  },
});

/** Fires as soon as any part of a tall panel is on screen. */
export const inViewLoose = { once: true, margin: '0px 0px -6% 0px' } as const;

/** Replays every time, and only once the element is properly central. */
export const replayInViewCentred = { once: false, margin: '-34% 0px -34% 0px' } as const;
