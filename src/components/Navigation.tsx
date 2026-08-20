import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/frontier-logo-transparent.webp";
import EditableText from "./admin/EditableText";
import { Container } from "./layout";
import LanguageCurrencySwitcher from "./LanguageCurrencySwitcher";
import { useLocale } from "@/contexts/LocaleContext";

interface NavigationProps {
  /**
   * "default" — every page except Property Management: Property Management
   *             and About Us as plain links (no submenus), the language +
   *             currency switcher, Sign In (or Dashboard / My Bookings once
   *             logged in) as plain text, and one gold "Book a Stay" button
   *             routing to `/properties`.
   * "propertyManagement" — the same flat pattern for `/property-management`
   *             itself: "Property Management" smooth-scrolls to the page's
   *             own first section instead of linking anywhere, "Book a
   *             Stay" is a plain link back to `/`, the switcher shows every
   *             language at once with no panel to open (its own reference
   *             screenshot), and the one gold button is "Apply", to the
   *             contact form.
   *
   */
  variant?: "default" | "propertyManagement";
  /**
   * Sit transparently on top of a full-bleed hero photo/video instead of the
   * plain `bg-primary` bar every other page uses. Only the two pages that
   * open on one pass this (`Index.tsx`, `PropertyManagementPage.tsx`).
   *
   * A first version of this used a `bg-primary` fill plus a separate
   * gradient scrim that faded out over the top 160px, for legibility over a
   * bright photo. That fade is what read as the header text being dimmed —
   * the darkening was inconsistent by design (strong at the very top, gone
   * by 160px down), so the text sitting on it looked unevenly shaded rather
   * than cleanly readable. This is the OmniVillas approach instead: one
   * constant translucent panel (`bg-primary/55` + `backdrop-blur`) across
   * the whole bar, so contrast is the same everywhere on it regardless of
   * what's behind — a wall, not a fade. Fills to fully solid on scroll, same
   * as before.
   */
  overlay?: boolean;
}

const Navigation = ({ variant = "default", overlay = false }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLocale();
  const isPM = variant === "propertyManagement";

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll(); // a reload part-way down the page must not start solid-less
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const filled = !overlay || scrolled || isOpen;

  const [navLabel1, setNavLabel1] = useState(t("nav-1"));
  const [navLabel3, setNavLabel3] = useState(t("nav-3"));
  const [signInLabel, setSignInLabel] = useState(t("nav-signin-btn"));
  // Admin-only label — never guest-facing, so it stays out of the
  // translation dictionary on purpose (see src/lib/translations.ts's scope note).
  const [dashboardLabel, setDashboardLabel] = useState("Dashboard");
  const [myBookingsLabel, setMyBookingsLabel] = useState(t("nav-auth-btn"));
  const [bookAStayLabel, setBookAStayLabel] = useState(t("nav-book-stay-cta"));
  const [applyLabel, setApplyLabel] = useState(t("nav-apply"));

  // Switching language resets these to the new dictionary default rather
  // than preserving a manual inline-CMS edit — there is nothing to preserve
  // today (docs/PROJECT.md C7: EditableText edits don't persist past a
  // reload anyway), so this doesn't lose anything a page refresh wouldn't
  // already have lost.
  useEffect(() => {
    setNavLabel1(t("nav-1"));
    setNavLabel3(t("nav-3"));
    setSignInLabel(t("nav-signin-btn"));
    setMyBookingsLabel(t("nav-auth-btn"));
    setBookAStayLabel(t("nav-book-stay-cta"));
    setApplyLabel(t("nav-apply"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  /** Only rendered on `/property-management` itself, so this always has the
   * section on the current page — the route fallback is defensive, not the
   * common case. */
  const handleSystemScrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("the-system");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/property-management#the-system");
    }
    setIsOpen(false);
  };

  const authDestination = isAdmin ? "/admin/dashboard" : "/properties";
  const authLabel = isAdmin ? dashboardLabel : myBookingsLabel;
  const setAuthLabel = isAdmin ? setDashboardLabel : setMyBookingsLabel;

  const linkClass = "text-primary-foreground hover:text-accent-on-primary transition-colors font-medium";
  // `rounded-full`: the gold CTA used to inherit the button default
  // (`rounded-md`), which next to the fully round green/sage buttons
  // elsewhere on the site (the search bar's Search button, the guest
  // stepper) read as a different, squarer button family. Same shape now.
  // Sized up a step (`h-11 px-6 text-base` over the button default `h-10
  // px-4 text-sm`) opposite the switcher's `size="sm"` — deliberate
  // contrast between the one solid CTA and the quieter outlined utility
  // pill beside it, the same relationship the OmniVillas header has.
  const ctaButtonClass = "rounded-full h-11 px-6 text-base bg-accent hover:bg-accent/90 text-accent-foreground shadow-soft gap-1.5";

  // The bar is fixed, so it sits outside the document flow: h-20 (5rem) of
  // page content would be hidden underneath it. Content pages clear it with
  // `pt-24` on their <main> — the 5rem of header plus 1rem of breathing
  // room. Anchor targets use `scroll-mt-20` and the sticky filter bar on
  // /properties uses `top-20` for the same reason. Change all three
  // together. Hero.tsx/OwnerHero.tsx run their own background under the bar
  // and clear it for their own text with an internal `pt-20` — neither
  // needs anything from here.
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300",
        filled
          ? "bg-primary border-primary-foreground/10"
          : "bg-primary/55 backdrop-blur-md border-primary-foreground/15",
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logo} alt="Frontier Residences" className="h-12 md:h-14" />
          </Link>

          {/* whitespace-nowrap: the bar is a fixed row with no space to give
              back, and a label wrapping to two lines would collide with the
              row below it. */}
          <div className="hidden lg:flex items-center gap-8 whitespace-nowrap">
            {isPM ? (
              <a href="#the-system" onClick={handleSystemScrollClick} className={linkClass}>
                <EditableText id="nav-1" value={navLabel1} onChange={setNavLabel1} as="span" className="text-primary-foreground">{navLabel1}</EditableText>
              </a>
            ) : (
              <Link to="/property-management" className={linkClass}>
                <EditableText id="nav-1" value={navLabel1} onChange={setNavLabel1} as="span" className="text-primary-foreground">{navLabel1}</EditableText>
              </Link>
            )}

            <Link to="/about" className={linkClass}>
              <EditableText id="nav-3" value={navLabel3} onChange={setNavLabel3} as="span" className="text-primary-foreground">{navLabel3}</EditableText>
            </Link>

            <LanguageCurrencySwitcher showCurrency={!isPM} variant={isPM ? "inline" : "dropdown"} size="sm" />

            {isPM ? (
              <Link to="/" className={linkClass}>
                <EditableText id="nav-pm-book-stay" value={bookAStayLabel} onChange={setBookAStayLabel} as="span" className="text-primary-foreground">{bookAStayLabel}</EditableText>
              </Link>
            ) : (
              <Link to={user ? authDestination : "/auth"} className={linkClass}>
                <EditableText id={user ? "nav-auth-btn" : "nav-signin-btn"} value={user ? authLabel : signInLabel} onChange={user ? setAuthLabel : setSignInLabel} as="span" className="text-primary-foreground">{user ? authLabel : signInLabel}</EditableText>
              </Link>
            )}

            {isPM ? (
              <a href="#get-in-touch">
                <Button variant="default" className={ctaButtonClass}>
                  <EditableText id="nav-apply" value={applyLabel} onChange={setApplyLabel} as="span">{applyLabel}</EditableText>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Link to="/properties">
                <Button variant="default" className={ctaButtonClass}>
                  <EditableText id="nav-book-stay-cta" value={bookAStayLabel} onChange={setBookAStayLabel} as="span">{bookAStayLabel}</EditableText>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary-foreground hover:text-accent-on-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation — the same flat set, stacked. */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/10 animate-fade-in bg-primary">
            <div className="flex flex-col gap-1">
              {isPM ? (
                <a
                  href="#the-system"
                  onClick={handleSystemScrollClick}
                  className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                >
                  {navLabel1}
                </a>
              ) : (
                <Link
                  to="/property-management"
                  className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {navLabel1}
                </Link>
              )}

              <Link
                to="/about"
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {navLabel3}
              </Link>

              {isPM ? (
                <Link
                  to="/"
                  className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {bookAStayLabel}
                </Link>
              ) : (
                <Link
                  to={user ? authDestination : "/auth"}
                  className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {user ? authLabel : signInLabel}
                </Link>
              )}

              <div className="py-2">
                <LanguageCurrencySwitcher showCurrency={!isPM} variant={isPM ? "inline" : "dropdown"} />
              </div>

              {isPM ? (
                <a href="#get-in-touch" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className={cn(ctaButtonClass, "w-full justify-center")}>
                    {applyLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link to="/properties" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className={cn(ctaButtonClass, "w-full justify-center")}>
                    {bookAStayLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navigation;
