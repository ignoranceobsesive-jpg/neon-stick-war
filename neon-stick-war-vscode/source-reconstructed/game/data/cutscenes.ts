// =============================================================================
// NEON STICK WAR - Cutscene Data & Voice Lines
// =============================================================================
// Extracted from: 0cf1o-rq41zxz.beautified.js, lines 2665-3375
// Original variable names:
//   z = allCutscenes (the complete cutscene dictionary)
//   _ = voiceLines (voice line arrays by category)
// =============================================================================

import type { CutsceneData, VoiceLines } from '../types';

// ---------------------------------------------------------------------------
// Color constants referenced from the source
// ---------------------------------------------------------------------------
const CYAN = '#00ffff';
const ORANGE = '#ff6600';
const PURPLE = '#aa00ff';
const MAGENTA = '#ff00ff';
const RED = '#ff3333';
const YELLOW = '#ffff00';
const GOLD = '#ffd700';
const PINK = '#ff69b4';

// =============================================================================
// CUTSCENES
// =============================================================================

/**
 * Complete cutscene data dictionary.
 * Each entry maps a cutscene ID to an array of frames with:
 *   scene — the visual background/scenario
 *   dialogue — spoken text (empty string = no dialogue)
 *   speaker — who is speaking
 *   speakerColor — neon color of the speaker's name
 *   duration — frame duration in game ticks
 */
export const allCutscenes: Record<string, CutsceneData> = {
  // =========================================================================
  // CHAPTER INTROS
  // =========================================================================
  'ch1-intro': {
    id: 'ch1-intro',
    frames: [
      { scene: 'cityPan', dialogue: '', speaker: 'NARRATOR', speakerColor: ORANGE, duration: 180 },
      { scene: 'kidnapping', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
      { scene: 'blueWakes', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
    ],
  },

  'ch2-intro': {
    id: 'ch2-intro',
    frames: [
      { scene: 'warScene', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
      { scene: 'shadowAppears', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
      { scene: 'handshake', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
    ],
  },

  'ch2-blaze': {
    id: 'ch2-blaze',
    frames: [
      { scene: 'warScene', dialogue: '', speaker: 'BLAZE', speakerColor: ORANGE, duration: 180 },
      { scene: 'gangJoin', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 120 },
    ],
  },

  'ch3-intro': {
    id: 'ch3-intro',
    frames: [
      { scene: 'lunaCaptured', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 150 },
      { scene: 'blueAngry', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
    ],
  },

  'ch3-rescue': {
    id: 'ch3-rescue',
    frames: [
      { scene: 'reunion', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 150 },
      { scene: 'blueSeesLuna', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
    ],
  },

  'ch4-intro': {
    id: 'ch4-intro',
    frames: [
      { scene: 'motherThreat', dialogue: '', speaker: 'VOLT', speakerColor: YELLOW, duration: 180 },
      { scene: 'protectMother', dialogue: '', speaker: 'BLUE', speakerColor: RED, duration: 150 },
    ],
  },

  'ch5-intro': {
    id: 'ch5-intro',
    frames: [
      { scene: 'warScene', dialogue: '', speaker: 'BLUE', speakerColor: GOLD, duration: 180 },
      { scene: 'gangForming', dialogue: '', speaker: 'BLUE', speakerColor: GOLD, duration: 180 },
    ],
  },

  // =========================================================================
  // VICTORY / REVIVE
  // =========================================================================
  victory: {
    id: 'victory',
    frames: [
      { scene: 'bossDefeated', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 150 },
      { scene: 'victoryCelebration', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
      { scene: 'reunion', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 120 },
    ],
  },

  revive: {
    id: 'revive',
    frames: [
      { scene: 'blueWakes', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 120 },
    ],
  },

  // =========================================================================
  // STORY PROGRESSION — Procedural Level Milestones
  // =========================================================================
  'lv10-revelation': {
    id: 'lv10-revelation',
    frames: [
      { scene: 'darkRevelation', dialogue: '', speaker: 'VOLT', speakerColor: YELLOW, duration: 200 },
      { scene: 'flashback', dialogue: '', speaker: 'VOLT', speakerColor: YELLOW, duration: 200 },
      { scene: 'darkCorridor', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
      { scene: 'redKingPlan', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
    ],
  },

  'lv20-luna': {
    id: 'lv20-luna',
    frames: [
      { scene: 'lunaVision', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 200 },
      { scene: 'lunaVision', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 200 },
      { scene: 'mysteryFigure', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
    ],
  },

  'lv30-shadow': {
    id: 'lv30-shadow',
    frames: [
      { scene: 'shadowPast', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 200 },
      { scene: 'betrayal', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 200 },
      { scene: 'darkRevelation', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
      { scene: 'gangOath', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
    ],
  },

  'lv40-mother': {
    id: 'lv40-mother',
    frames: [
      { scene: 'motherSecret', dialogue: '', speaker: 'NEON', speakerColor: '#44ddaa', duration: 200 },
      {
        scene: 'flashback',
        dialogue: 'Your father was the First Guardian. He built the Grid. And the Red King... was his partner.',
        speaker: 'NEON',
        speakerColor: '#44ddaa',
        duration: 220,
      },
      { scene: 'darkRevelation', dialogue: '', speaker: 'NEON', speakerColor: '#44ddaa', duration: 200 },
      { scene: 'blueAngry', dialogue: '', speaker: 'BLUE', speakerColor: RED, duration: 180 },
    ],
  },

  'lv50-void': {
    id: 'lv50-void',
    frames: [
      { scene: 'voidRift', dialogue: '', speaker: 'BLAZE', speakerColor: ORANGE, duration: 180 },
      {
        scene: 'explosion',
        dialogue: 'The Void... it\'s bleeding into our world. The Red King tore the fabric of the Grid!',
        speaker: 'VOLT',
        speakerColor: YELLOW,
        duration: 200,
      },
      { scene: 'mysteryFigure', dialogue: '', speaker: 'ICE', speakerColor: '#44ddff', duration: 180 },
      { scene: 'stormApproaching', dialogue: '', speaker: 'BLUE', speakerColor: GOLD, duration: 200 },
    ],
  },

  'lv60-deal': {
    id: 'lv60-deal',
    frames: [
      { scene: 'hiddenBase', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 200 },
      {
        scene: 'theDeal',
        dialogue: 'I can enter the Void Rift. Merge with the Grid\'s core. But I might not come back.',
        speaker: 'LUNA',
        speakerColor: PINK,
        duration: 200,
      },
      { scene: 'silentPrayer', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
      {
        scene: 'sacrifice',
        dialogue: 'If it saves everyone... including you... I\'ll do it. With or without your permission.',
        speaker: 'LUNA',
        speakerColor: PINK,
        duration: 200,
      },
    ],
  },

  'lv70-betrayal': {
    id: 'lv70-betrayal',
    frames: [
      { scene: 'darkCorridor', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 200 },
      { scene: 'betrayal', dialogue: '', speaker: '???', speakerColor: ORANGE, duration: 200 },
      { scene: 'lastStand', dialogue: '', speaker: 'BLUE', speakerColor: RED, duration: 180 },
      { scene: 'gangOath', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
    ],
  },

  'lv80-truth': {
    id: 'lv80-truth',
    frames: [
      { scene: 'truthRevealed', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 220 },
      { scene: 'voidRift', dialogue: '', speaker: 'VOLT', speakerColor: YELLOW, duration: 200 },
      {
        scene: 'flashback',
        dialogue: 'My father created the Grid as a sanctuary. For everyone. The Red King turned it into a prison.',
        speaker: 'BLUE',
        speakerColor: CYAN,
        duration: 200,
      },
      { scene: 'gangOath', dialogue: '', speaker: 'BLUE', speakerColor: GOLD, duration: 180 },
    ],
  },

  'lv90-final': {
    id: 'lv90-final',
    frames: [
      { scene: 'hiddenBase', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
      { scene: 'gangForming', dialogue: '', speaker: 'BLUE', speakerColor: GOLD, duration: 200 },
      { scene: 'silentPrayer', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 200 },
      { scene: 'newDawn', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 180 },
    ],
  },

  'lv100-turning': {
    id: 'lv100-turning',
    frames: [
      { scene: 'bossDefeated', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 200 },
      {
        scene: 'voidRift',
        dialogue: 'Something is coming THROUGH the rift. Something that makes the Red King look like nothing.',
        speaker: 'VOLT',
        speakerColor: YELLOW,
        duration: 200,
      },
      { scene: 'mysteryFigure', dialogue: '', speaker: '???', speakerColor: '#ff0044', duration: 220 },
      {
        scene: 'stormApproaching',
        dialogue: 'A new enemy. A bigger war. But the Blue Gang doesn\'t surrender. We just fight HARDER.',
        speaker: 'BLUE',
        speakerColor: GOLD,
        duration: 200,
      },
    ],
  },

  // =========================================================================
  // BOSS INTRO CUTSCENES
  // =========================================================================
  'boss-redking-intro': {
    id: 'boss-redking-intro',
    frames: [
      { scene: 'bossIntro', dialogue: '', speaker: 'RED KING', speakerColor: RED, duration: 180 },
      { scene: 'bossIntro', dialogue: '', speaker: 'RED KING', speakerColor: RED, duration: 200 },
      { scene: 'blueAngry', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
    ],
  },

  'boss-dragon-intro': {
    id: 'boss-dragon-intro',
    frames: [
      { scene: 'bossIntro', dialogue: '', speaker: 'NARRATOR', speakerColor: ORANGE, duration: 180 },
      { scene: 'bossIntro', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 200 },
    ],
  },

  'boss-phoenix-intro': {
    id: 'boss-phoenix-intro',
    frames: [
      { scene: 'bossIntro', dialogue: '', speaker: 'NARRATOR', speakerColor: ORANGE, duration: 180 },
      { scene: 'bossIntro', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
    ],
  },

  'boss-mechgolem-intro': {
    id: 'boss-mechgolem-intro',
    frames: [
      { scene: 'bossIntro', dialogue: '', speaker: 'NARRATOR', speakerColor: ORANGE, duration: 180 },
      { scene: 'bossIntro', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
    ],
  },

  'boss-corrupted-intro': {
    id: 'boss-corrupted-intro',
    frames: [
      { scene: 'bossIntro', dialogue: '', speaker: 'VOLT', speakerColor: YELLOW, duration: 200 },
      { scene: 'bossIntro', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
    ],
  },

  'boss-father-intro': {
    id: 'boss-father-intro',
    frames: [
      { scene: 'darkCorridor', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 200 },
      { scene: 'bossIntro', dialogue: '', speaker: 'FATHER', speakerColor: '#44aaff', duration: 220 },
      { scene: 'blueAngry', dialogue: '', speaker: 'BLUE', speakerColor: RED, duration: 200 },
    ],
  },

  'boss-twin-intro': {
    id: 'boss-twin-intro',
    frames: [
      { scene: 'bossIntro', dialogue: '', speaker: 'BLAZE', speakerColor: ORANGE, duration: 180 },
      { scene: 'bossIntro', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
    ],
  },

  // =========================================================================
  // BOSS DEFEATED CUTSCENES
  // =========================================================================
  'boss-generic-defeated': {
    id: 'boss-generic-defeated',
    frames: [
      { scene: 'bossDefeated', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
      { scene: 'victoryCelebration', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 150 },
    ],
  },

  'boss-redking-defeated': {
    id: 'boss-redking-defeated',
    frames: [
      { scene: 'bossDefeated', dialogue: '', speaker: 'RED KING', speakerColor: RED, duration: 200 },
      { scene: 'bossDefeated', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 200 },
      { scene: 'victoryCelebration', dialogue: '', speaker: 'BLAZE', speakerColor: ORANGE, duration: 180 },
    ],
  },

  'boss-father-defeated': {
    id: 'boss-father-defeated',
    frames: [
      { scene: 'bossDefeated', dialogue: '', speaker: 'FATHER', speakerColor: '#44aaff', duration: 220 },
      { scene: 'silentPrayer', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 200 },
      { scene: 'bossDefeated', dialogue: '', speaker: 'FATHER', speakerColor: '#44aaff', duration: 220 },
    ],
  },

  // =========================================================================
  // RESCUE CUTSCENES
  // =========================================================================
  'rescue-luna': {
    id: 'rescue-luna',
    frames: [
      { scene: 'lunaCaptured', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 150 },
      { scene: 'reunion', dialogue: '', speaker: 'LUNA', speakerColor: PINK, duration: 180 },
      { scene: 'reunion', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
    ],
  },

  'rescue-mother': {
    id: 'rescue-mother',
    frames: [
      { scene: 'protectMother', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
      { scene: 'protectMother', dialogue: '', speaker: 'NEON', speakerColor: '#44ddaa', duration: 200 },
      { scene: 'protectMother', dialogue: '', speaker: 'BLUE', speakerColor: CYAN, duration: 180 },
    ],
  },

  'rescue-villagers': {
    id: 'rescue-villagers',
    frames: [
      { scene: 'walking', dialogue: '', speaker: 'SHADOW', speakerColor: PURPLE, duration: 180 },
      { scene: 'gangForming', dialogue: '', speaker: 'BLUE', speakerColor: GOLD, duration: 200 },
    ],
  },
};

// =============================================================================
// VOICE LINES
// =============================================================================

/**
 * Voice line arrays organized by trigger category.
 * Used when the player or game triggers specific events.
 */
export const voiceLines: VoiceLines = {
  kill: [
    'Deleted.', 'Stay down.', 'One less.', 'Crashed.', 'Lights out.',
    'Too slow.', 'Dust.', 'Erased.',
  ],
  damage: [
    'That all you got?', 'Just a scratch.', 'Not today.', "I've had worse.",
    'Tickles.', 'Keep coming.',
  ],
  waveClear: [
    'Zone secured.', 'Moving up.', 'Area clear.', 'Next.', 'Too easy.', 'Onward.',
  ],
  dash: ['Too fast.', "Can't touch this.", 'Gone.', 'Blurred.'],
  shield: ['Blocked.', 'Nope.', 'Nice try.', 'Not even close.'],
  special: [
    'OVERLOAD!', 'BURN IT DOWN!', "LIGHT 'EM UP!", 'UNLEASH THE GRID!', 'MAXIMUM POWER!',
  ],
  gang: [
    'Gang, attack!', 'Together!', 'Blue Gang never quits!', 'Crew assemble!',
  ],
  rescue: [
    "Luna, I'm coming!", 'Hold on!', "I'll find you!", 'Hang in there!',
  ],
  protect: [
    "Not touching her!", 'Stay back from Mom!', 'Over my dead body!', 'Shield up!',
  ],
  dramatic: [
    'Reinforcements have arrived!', 'We will beat the Red King!',
    'Stay with me, partner!', 'This ends NOW!',
    'They think they can break us?', 'NOT TODAY!',
    'I am NOT done yet!', 'For EVERYONE you hurt!',
    'The Grid fights with me!', 'I AM the storm!',
  ],
  bossEnrage: [
    "You're only making me ANGRY!", 'Is that ALL you\'ve got?!',
    "NOW you'll see REAL power!", 'You woke the WRONG stickman!',
  ],
  pet: ['Good boy!', "Get 'em!", 'Atta boy!', 'Nice shot, partner!'],
  dragon: ['A DRAGON! Bring it down!', "Fire can't stop me!", 'Dragon slayer incoming!'],
  phoenix: ['It rises from the ashes?!', 'Burn again, bird!', 'Phoenix down!'],
  mechGolem: ['Tin can incoming!', 'Dismantle it!', 'Mech detected — engaging!'],
  shadowAssassin: [
    'I can barely see it!', 'Show yourself!', "Shadows can't hide from me!",
  ],
  voidBat: [
    'Bats from the void!', 'Fast little nightmares!', 'They come from the dark!',
  ],
  stormEagle: [
    'Lightning bird incoming!', "That eagle's charged up!", 'Storm wings above!',
  ],
  emberWisp: [
    'Fire spirits! Watch out!', 'Those wisps burn!', 'Floating flames!',
  ],
  frostWraith: [
    'Ice ghost detected!', "It's freezing in here!", 'A cold wind rises!',
  ],
  shadowDrake: [
    'Shadow dragon approaches!', 'The darkness has teeth!', 'That drake is not natural!',
  ],
  plasmaSerpent: [
    'Energy serpent spotted!', "It's made of pure plasma!", 'That snake electrifies everything!',
  ],
  neonWyrm: [
    'THE WYRM! Look at the size of it!', 'Neon wyrm! Stay clear!', 'That thing is massive!',
  ],
  crystalMoth: [
    'Crystal moths? Beautiful but deadly!', 'Those wings are sharp!', "Don't let it shimmer close!",
  ],
};
