import { useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PRERENDERED_ID } from "@/lib/prerender";

/**
 * A quick fade + rise on every route change, so clicking through the site
 * reads as moving between rooms rather than a series of instant page swaps.
 *
 * Keyed on `pathname` (not the full location) so React unmounts and
 * remounts this wrapper — and therefore restarts the CSS animation on it —
 * only when the route itself changes. A query-string-only change (paging
 * `/properties?location=Marbella`, a date picked on a property page) keeps
 * the same key and stays un-animated, which is correct: that is filtering
 * in place, not moving to a different page.
 *
 * Entrance-only. React Router swaps the outgoing page for the incoming one
 * synchronously, so there is nothing to animate OUT without a library like
 * framer-motion, which isn't part of this stack (`website-stack`). Sits
 * inside <Suspense> in App.tsx: a lazy admin chunk shows the plain
 * `RouteFallback` spinner first, un-animated, and only the resolved page
 * fades in — a loading spinner doesn't need an entrance of its own.
 *
 * No reduced-motion branch needed here: the global
 * `@media (prefers-reduced-motion: reduce)` rule in index.css already
 * collapses every animation's duration to ~0.
 */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  // On a prerendered page the visitor is already looking at the saved copy
  // (src/lib/prerender.ts) while the live app draws itself underneath. Fading
  // that copy in from zero would make the page blink right as it is handed
  // over, so the *first* page skips the entrance. Every later navigation
  // animates as before.
  const landing = useRef({
    path: pathname,
    skip: document.getElementById(PRERENDERED_ID) !== null,
  });
  if (landing.current.skip && pathname !== landing.current.path) {
    landing.current.skip = false;
  }

  return (
    <div key={pathname} className={landing.current.skip ? undefined : "animate-page-in"}>
      {children}
    </div>
  );
};

export default PageTransition;
