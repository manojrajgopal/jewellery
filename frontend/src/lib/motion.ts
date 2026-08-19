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
