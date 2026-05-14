/**
 * Color palette configuration for Neon Stick War.
 *
 * These color constants are used throughout the game for rendering
 * player trails, bullet effects, pet glows, UI elements, and more.
 *
 * Original minified variable mappings:
 *   n = cyan,  i = magenta, s = green,  c = orange,
 *   d = yellow, h = purple, f = red,    u = bgDark,
 *   m = gold,   x = pink,   p = blue,   g = white
 */
export const COLORS = {
  /** Primary neon cyan — default player & wolf color */
  cyan: "#00ffff",
  /** Vivid magenta — void/drake theme */
  magenta: "#ff00ff",
  /** Bright green — crystal/toxic theme */
  green: "#00ff66",
  /** Hot orange — fire/plasma theme */
  orange: "#ff6600",
  /** Bright yellow — lightning/thunder theme */
  yellow: "#ffff00",
  /** Deep purple — shadow/void theme */
  purple: "#aa00ff",
  /** Bright red — danger/damage theme */
  red: "#ff3333",
  /** Very dark blue-black — game background */
  bgDark: "#050510",
  /** Gold — legendary/currency theme */
  gold: "#ffd700",
  /** Hot pink — neon-cat theme */
  pink: "#ff69b4",
  /** Bright blue — sapphire/water theme */
  blue: "#4488ff",
  /** Pure white — ice/celestial theme */
  white: "#ffffff",
} as const;

/** Type representing any of the named color keys */
export type ColorName = keyof typeof COLORS;

/** Type representing the hex string values of colors */
export type ColorHex = (typeof COLORS)[ColorName];
