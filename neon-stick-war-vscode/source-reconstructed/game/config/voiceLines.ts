/**
 * Voice line pools for Neon Stick War.
 *
 * The game plays voice lines (shown as text overlays) during combat
 * for various events like killing enemies, taking damage, clearing
 * waves, using abilities, encountering specific enemy types, etc.
 *
 * Lines are randomly selected from the appropriate pool when triggered.
 *
 * Original minified variable: `_` (voice line pool object)
 * Also includes intro wave lines from local variable `k` at line 2549
 */

/**
 * Voice line pools keyed by trigger category.
 *
 * Each pool contains an array of possible lines. When the trigger
 * event occurs, a random line is selected and displayed.
 */
export const VOICE_LINES = {
  /** Played when the player kills an enemy */
  kill: [
    "Deleted.",
    "Stay down.",
    "One less.",
    "Crashed.",
    "Lights out.",
    "Too slow.",
    "Dust.",
    "Erased.",
  ],

  /** Played when the player takes damage */
  damage: [
    "That all you got?",
    "Just a scratch.",
    "Not today.",
    "I've had worse.",
    "Tickles.",
    "Keep coming.",
  ],

  /** Played when a wave/zone is cleared */
  waveClear: [
    "Zone secured.",
    "Moving up.",
    "Area clear.",
    "Next.",
    "Too easy.",
    "Onward.",
  ],

  /** Played when the player dashes */
  dash: [
    "Too fast.",
    "Can't touch this.",
    "Gone.",
    "Blurred.",
  ],

  /** Played when the player blocks with shield */
  shield: [
    "Blocked.",
    "Nope.",
    "Nice try.",
    "Not even close.",
  ],

  /** Played when the player uses a special/ultimate ability */
  special: [
    "OVERLOAD!",
    "BURN IT DOWN!",
    "LIGHT 'EM UP!",
    "UNLEASH THE GRID!",
    "MAXIMUM POWER!",
  ],

  /** Played when gang allies are called to attack */
  gang: [
    "Gang, attack!",
    "Together!",
    "Blue Gang never quits!",
    "Crew assemble!",
  ],

  /** Played during rescue missions (saving Luna) */
  rescue: [
    "Luna, I'm coming!",
    "Hold on!",
    "I'll find you!",
    "Hang in there!",
  ],

  /** Played during protect missions (defending Mom) */
  protect: [
    "Not touching her!",
    "Stay back from Mom!",
    "Over my dead body!",
    "Shield up!",
  ],

  /** Played during dramatic story moments */
  dramatic: [
    "Reinforcements have arrived!",
    "We will beat the Red King!",
    "Stay with me, partner!",
    "This ends NOW!",
    "They think they can break us?",
    "NOT TODAY!",
    "I am NOT done yet!",
    "For EVERYONE you hurt!",
    "The Grid fights with me!",
    "I AM the storm!",
  ],

  /** Played when a boss enrages / enters second phase */
  bossEnrage: [
    "You're only making me ANGRY!",
    "Is that ALL you've got?!",
    "NOW you'll see REAL power!",
    "You woke the WRONG stickman!",
  ],

  /** Played when the player's pet scores a kill */
  pet: [
    "Good boy!",
    "Get 'em!",
    "Atta boy!",
    "Nice shot, partner!",
  ],

  /** Played when encountering a Dragon enemy */
  dragon: [
    "A DRAGON! Bring it down!",
    "Fire can't stop me!",
    "Dragon slayer incoming!",
  ],

  /** Played when encountering a Phoenix enemy */
  phoenix: [
    "It rises from the ashes?!",
    "Burn again, bird!",
    "Phoenix down!",
  ],

  /** Played when encountering a Mech Golem enemy */
  mechGolem: [
    "Tin can incoming!",
    "Dismantle it!",
    "Mech detected — engaging!",
  ],

  /** Played when encountering a Shadow Assassin enemy */
  shadowAssassin: [
    "I can barely see it!",
    "Show yourself!",
    "Shadows can't hide from me!",
  ],

  /** Played when encountering a Void Bat enemy */
  voidBat: [
    "Bats from the void!",
    "Fast little nightmares!",
    "They come from the dark!",
  ],

  /** Played when encountering a Storm Eagle enemy */
  stormEagle: [
    "Lightning bird incoming!",
    "That eagle's charged up!",
    "Storm wings above!",
  ],

  /** Played when encountering an Ember Wisp enemy */
  emberWisp: [
    "Fire spirits! Watch out!",
    "Those wisps burn!",
    "Floating flames!",
  ],

  /** Played when encountering a Frost Wraith enemy */
  frostWraith: [
    "Ice ghost detected!",
    "It's freezing in here!",
    "A cold wind rises!",
  ],

  /** Played when encountering a Shadow Drake enemy */
  shadowDrake: [
    "Shadow dragon approaches!",
    "The darkness has teeth!",
    "That drake is not natural!",
  ],

  /** Played when encountering a Plasma Serpent enemy */
  plasmaSerpent: [
    "Energy serpent spotted!",
    "It's made of pure plasma!",
    "That snake electrifies everything!",
  ],

  /** Played when encountering a Neon Wyrm enemy */
  neonWyrm: [
    "THE WYRM! Look at the size of it!",
    "Neon wyrm! Stay clear!",
    "That thing is massive!",
  ],

  /** Played when encountering a Crystal Moth enemy */
  crystalMoth: [
    "Crystal moths? Beautiful but deadly!",
    "Those wings are sharp!",
    "Don't let it shimmer close!",
  ],
} as const;

/**
 * Intro voice lines played at the start of a new level/wave.
 *
 * These are randomly selected for the first wave of a level
 * (only for wave index 0). They provide atmosphere and motivation.
 *
 * Source: local variable `k` in level generation function
 */
export const INTRO_VOICE_LINES: readonly string[] = [
  "Stay focused. They're coming.",
  "Another wave... bring it.",
  "We've come too far to stop now.",
  "This zone is crawling with them.",
  "Keep pushing. Don't look back.",
  "They think they can stop us?",
  "For Luna. For everyone.",
  "This is getting intense...",
  "We will beat the Red King!",
  "I can do this all day.",
  "The Grid trembles before us.",
  "No retreat. No surrender.",
  "I am the Neon Stickman. I don't go dark.",
  "Every battle makes me stronger.",
  "This realm will know my name.",
] as const;

/** Type representing all voice line category keys */
export type VoiceLineCategory = keyof typeof VOICE_LINES;
