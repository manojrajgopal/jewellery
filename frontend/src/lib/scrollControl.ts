/**
 * A single claim on the page's vertical scroll.
 *
 * SmoothScroll eases window.scrollY toward its own target on every wheel event.
 * A section that needs to drive the scroll itself — stepping one panel per
 * gesture, say — would otherwise spend a second fighting that easing for the
 * last word on window.scrollTo, which reads as jitter. Claiming control here
 * makes SmoothScroll stand down and resync instead of competing.
 */
let owner: symbol | null = null;

export function takeScrollControl(token: symbol) {
  owner = token;
}

export function releaseScrollControl(token: symbol) {
  if (owner === token) owner = null;
}

export function isScrollControlled() {
  return owner !== null;
}
