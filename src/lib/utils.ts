/**
 * UTILITY — CSS class name merger
 *
 * cn() combines multiple class names and intelligently resolves conflicts
 * (e.g. if two Tailwind classes set padding, the last one wins).
 * Used by shadcn/ui components.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
