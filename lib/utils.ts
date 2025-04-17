import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines classnames with tailwind
 * @param inputs Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Keep track of whether the user has interacted with the page
// This helps with browser autoplay policies
let hasUserInteracted = false;

// Function to track user interaction
export function trackUserInteraction() {
  hasUserInteracted = true;
  // Remove listeners once interaction is detected
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', trackUserInteraction);
    window.removeEventListener('touchstart', trackUserInteraction);
    window.removeEventListener('keydown', trackUserInteraction);
  }
}

// Function to check if user has interacted
export function hasUserInteractedWithPage() {
  return hasUserInteracted;
}

// Setup interaction listeners
if (typeof window !== 'undefined') {
  // Setup listeners when the module is first imported
  window.addEventListener('click', trackUserInteraction);
  window.addEventListener('touchstart', trackUserInteraction);
  window.addEventListener('keydown', trackUserInteraction);
}
