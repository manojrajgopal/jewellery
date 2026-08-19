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
