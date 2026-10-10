/**
 * Glue between the build-time prerenderer (scripts/prerender.mjs) and the app.
 *
 * The prerenderer opens every indexable route in headless Chromium, and saves
 * the resulting HTML next to the static files so crawlers that do not run
 * JavaScript (WhatsApp, LinkedIn, AI crawlers) see a real page.
 */

/**
 * True only inside that build-time browser. The script sets the flag before any
 * app code runs; a visitor's browser never has it.
 *
 * It exists for one reason: a snapshot must not contain the *error* state of a
 * call the build deliberately blocks (Guesty — see the script for why). Anything
 * that fetches live data on mount checks this and stays quiet instead.
 */
export const isPrerendering = () =>
  typeof window !== "undefined" &&
  (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;

/** Id of the element the prerenderer puts the saved page into. */
export const PRERENDERED_ID = "prerendered";

/**
 * Takes the saved page off the screen once the live app has drawn its own.
 *
 * The app is a client-only SPA (`createRoot`, no hydration), so it always
 * renders from scratch. The snapshot therefore lives in its own element *above*
 * the empty `#root` rather than inside it: the visitor keeps looking at real
 * content while the bundle loads, and the swap happens only after the live
 * page has settled. Putting the snapshot inside `#root` would blank the page
 * at React's first commit, and again whenever a data-driven part (cards)
 * appeared a moment later — worse than the empty page that ships today.
 *
 * "Settled" is a quiet DOM: an `<h1>` exists, no spinner is showing, and
 * nothing has mutated for 250 ms. The 4 s cap guarantees the snapshot cannot
 * stay up forever on a page that never stops updating.
 */
export const releasePrerendered = (root: HTMLElement) => {
  const snapshot = document.getElementById(PRERENDERED_ID);
  if (!snapshot) return;

  let quietTimer: ReturnType<typeof setTimeout> | undefined;
  const release = () => {
    observer.disconnect();
    if (quietTimer) clearTimeout(quietTimer);
    clearTimeout(cap);
    snapshot.remove();
  };
  const arm = () => {
    if (quietTimer) clearTimeout(quietTimer);
    const ready = root.querySelector("h1") && !root.querySelector(".animate-spin");
    if (ready) quietTimer = setTimeout(release, 250);
  };

  const observer = new MutationObserver(arm);
  observer.observe(root, { childList: true, subtree: true, attributes: true });
  const cap = setTimeout(release, 4000);
  arm();
};
