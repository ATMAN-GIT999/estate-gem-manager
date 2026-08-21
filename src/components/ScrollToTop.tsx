import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router does not reset scroll position on navigation — it is a single
 * page, so nothing forces the browser to. Without this, following a `Link`
 * from partway down one page lands on the new page at that same pixel
 * offset, which usually means arriving on a photo band or mid-paragraph with
 * no heading in sight. That reads as "the click did nothing" far more than a
 * full page reload would, which is the opposite of what an SPA is for.
 *
 * Skipped when the new URL carries a `#hash` — that already names an exact
 * landing spot (`/property-management#faq`), and resetting to the top first
 * would fight whatever scrolls to the hash afterwards.
 *
 * Instant, not smooth: the route has already changed and new content is on
 * screen, so a slow scroll up plays like a second, disconnected animation
 * after the navigation rather than part of it. The smooth motion this task
 * asked for belongs to same-page anchor jumps, which `html { scroll-behavior:
 * smooth }` in index.css now covers on its own — and covers a touch too well
 * for this one call site: the two-argument `scrollTo(x, y)` form is used
 * deliberately here rather than the `{ top, behavior }` options object,
 * because only the options form consults that CSS property. The plain form
 * always jumps immediately, which is what a route change needs.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
