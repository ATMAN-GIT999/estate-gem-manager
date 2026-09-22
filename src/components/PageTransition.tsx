import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

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
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
};

export default PageTransition;
