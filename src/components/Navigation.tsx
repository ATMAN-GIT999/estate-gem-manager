import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import EditableText from "./admin/EditableText";
import { Container } from "./layout";
import LanguageCurrencySwitcher from "./LanguageCurrencySwitcher";
import { useLocale } from "@/contexts/LocaleContext";
import { AUSTRIA_DESTINATIONS, SPAIN_DESTINATIONS } from "@/lib/destinations";
import villaHigueron from "@/assets/wf-villa-higueron.webp";

/**
 * The header has three states, and only three — there is no in-between.
 *
 *   1. Over a full-bleed hero: fully transparent, white text. The bar itself
 *      carries no fill and no gradient; legibility comes from the hero's own
 *      `.overlay-media` darkening underneath it.
 *   2. Approached or scrolled past 0.6 viewport heights: the whole surface
 *      turns white in ONE step, text drops to `--foreground`. Not a fade
 *      through a translucent panel — the half-way state is what used to read
 *      as the header text being dimmed.
 *   3. Destinations panel open: a white sheet under the bar with two country
 *      columns, the occasions list, and one property teaser.
 *
 * Croatia deliberately does not appear in the panel: it is not an inventory
 * market, only a target market on /investments (docs/PROJECT.md §1).
 */

interface NavigationProps {
  /** Kept for call-site compatibility; the bar is the same on every page now. */
  variant?: "default" | "propertyManagement";
  /**
   * Sit transparently on top of a full-bleed hero instead of opening solid
   * white. Only the two pages that open on a hero pass this.
   */
  overlay?: boolean;
}

const SPAIN = SPAIN_DESTINATIONS;
const AUSTRIA = AUSTRIA_DESTINATIONS;

const OCCASIONS = [
  { label: "Golf & sea", query: "golf" },
  { label: "Families", query: "family" },
  { label: "Large groups", query: "" },
];

const Navigation = ({ variant = "default", overlay = false }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll(); // a reload part-way down the page must not start transparent
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // The panel is a sheet, not a dropdown — clicking anywhere else closes it.
  useEffect(() => {
    if (!panelOpen) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanelOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  // State 2 whenever the bar is not floating over a hero, or once the page has
  // scrolled, or while either overlay (mobile menu / destinations) is open.
  const solid = !overlay || scrolled || isOpen || panelOpen;

  const [listYourHome, setListYourHome] = useState(t("nav-list-your-home"));
  const [destinationsLabel, setDestinationsLabel] = useState(t("nav-destinations"));
  const [signInLabel, setSignInLabel] = useState(t("nav-signin-btn"));
  const [dashboardLabel, setDashboardLabel] = useState("Dashboard");
  const [myBookingsLabel, setMyBookingsLabel] = useState(t("nav-auth-btn"));
  const [bookAStayLabel, setBookAStayLabel] = useState(t("nav-book-stay-cta"));

  useEffect(() => {
    setListYourHome(t("nav-list-your-home"));
    setDestinationsLabel(t("nav-destinations"));
    setSignInLabel(t("nav-signin-btn"));
    setMyBookingsLabel(t("nav-auth-btn"));
    setBookAStayLabel(t("nav-book-stay-cta"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const authDestination = isAdmin ? "/admin/dashboard" : "/properties";
  const authLabel = isAdmin ? dashboardLabel : myBookingsLabel;
  const setAuthLabel = isAdmin ? setDashboardLabel : setMyBookingsLabel;

  const go = (query: string) => {
    setPanelOpen(false);
    setIsOpen(false);
    navigate(query ? `/properties?location=${encodeURIComponent(query)}` : "/properties");
  };

  const linkClass = cn(
    "text-sm font-medium transition-colors",
    solid ? "text-foreground hover:text-accent-strong" : "text-white hover:text-white/75"
  );

  const panelLink =
    "block py-1.5 t-body text-foreground/80 hover:text-accent-strong transition-colors text-left w-full";

  // The bar is fixed, so it sits outside the flow: h-20 (5rem) of page content
  // would be hidden underneath it. Content pages clear it with `pt-24` on
  // <main>; anchors use `scroll-mt-20`. Change those together with this.
  return (
    <nav
      ref={panelRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        solid ? "bg-background border-b border-border" : "bg-transparent"
      )}
    >
      <Container>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-20 gap-4">
          {/* Left — destinations panel trigger and the owner entry point. */}
          <div className="hidden lg:flex items-center gap-7 whitespace-nowrap">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className={cn(linkClass, "inline-flex items-center gap-1.5")}
              aria-expanded={panelOpen}
            >
              <EditableText
                id="nav-destinations"
                value={destinationsLabel}
                onChange={setDestinationsLabel}
                as="span"
              >
                {destinationsLabel}
              </EditableText>
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", panelOpen && "rotate-180")}
                strokeWidth={1.5}
              />
            </button>

            <Link to="/property-management" className={linkClass}>
              <EditableText
                id="nav-list-your-home"
                value={listYourHome}
                onChange={setListYourHome}
                as="span"
              >
                {listYourHome}
              </EditableText>
            </Link>
          </div>

          {/* Mobile menu button sits where the left column is on desktop. */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn("lg:hidden justify-self-start p-2", solid ? "text-foreground" : "text-white")}
            aria-label="Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Centre — the wordmark. Tracking eases off from the wireframe's
              0.24em (tuned for the five-letter "FRONTIER" alone) — at the
              same tracking "FRONTIER RESIDENCES" would run past the side
              columns on a narrow desktop window. */}
          <Link
            to="/"
            className={cn(
              "justify-self-center t-meta tracking-[0.12em] sm:tracking-[0.16em] text-sm sm:text-base transition-opacity hover:opacity-70 whitespace-nowrap",
              solid ? "text-foreground" : "text-white"
            )}
          >
            FRONTIER RESIDENCES
          </Link>

          {/* Right — utilities and the one filled action. */}
          <div className="justify-self-end flex items-center gap-4 whitespace-nowrap">
            <Link
              to={user ? authDestination : "/auth"}
              className={cn(linkClass, "hidden lg:inline-flex items-center")}
              aria-label={user ? authLabel : signInLabel}
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} />
            </Link>

            <span className={cn("hidden lg:block h-4 w-px", solid ? "bg-border" : "bg-white/30")} />

            <div className="hidden lg:block">
              <LanguageCurrencySwitcher
                showCurrency
                variant="dropdown"
                size="sm"
                onDark={!solid}
              />
            </div>

            <Link to="/properties" className="cta-base cta-primary h-10 px-5 text-[0.9375rem]">
              <EditableText
                id="nav-book-stay-cta"
                value={bookAStayLabel}
                onChange={setBookAStayLabel}
                as="span"
              >
                {bookAStayLabel}
              </EditableText>
              <ArrowRight className="h-4 w-4 hidden sm:block" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Container>

      {/* State 3 — the destinations sheet. */}
      {panelOpen && (
        <div className="hidden lg:block border-t border-border bg-background animate-fade-in">
          <Container className="py-lg">
            <div className="grid grid-cols-12 gap-md">
              <div className="col-span-3">
                <p className="t-tag text-accent-strong mb-4">Spain</p>
                {SPAIN.map((d) => (
                  <button key={d.label} type="button" className={panelLink} onClick={() => go(d.query)}>
                    {d.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go("Costa del Sol")}
                  className="cta-link mt-4 text-[0.9375rem]"
                >
                  All on the Costa del Sol →
                </button>
              </div>

              <div className="col-span-3">
                <p className="t-tag text-accent-strong mb-4">Austria</p>
                {AUSTRIA.map((d) => (
                  <button key={d.label} type="button" className={panelLink} onClick={() => go(d.query)}>
                    {d.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go("Austria")}
                  className="cta-link mt-4 text-[0.9375rem]"
                >
                  All in Austria →
                </button>
              </div>

              <div className="col-span-3">
                <p className="t-tag text-accent-strong mb-4">By occasion</p>
                {OCCASIONS.map((d) => (
                  <button key={d.label} type="button" className={panelLink} onClick={() => go(d.query)}>
                    {d.label}
                  </button>
                ))}
              </div>

              <Link
                to="/property/villa-higueron"
                className="col-span-3 group"
                onClick={() => setPanelOpen(false)}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={villaHigueron}
                    alt="Villa Higuerón, Benalmádena — living room with sea view"
                    width={480}
                    height={640}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="t-card text-foreground mt-3">Villa Higuerón</p>
                <p className="t-body text-muted-foreground">Benalmádena · from €1,180</p>
              </Link>
            </div>
          </Container>
        </div>
      )}

      {/* Mobile — the same set, stacked. */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <Container className="py-md">
            <div className="flex flex-col gap-1">
              <p className="t-tag text-accent-strong mb-2">Destinations</p>
              {[...SPAIN, ...AUSTRIA].map((d) => (
                <button key={d.label} type="button" className={panelLink} onClick={() => go(d.query)}>
                  {d.label}
                </button>
              ))}

              <Link
                to="/property-management"
                className="t-item text-foreground py-3 mt-3 border-t border-border"
                onClick={() => setIsOpen(false)}
              >
                {listYourHome}
              </Link>
              <Link
                to="/about"
                className="t-item text-foreground py-2"
                onClick={() => setIsOpen(false)}
              >
                {t("nav-3")}
              </Link>
              <Link
                to={user ? authDestination : "/auth"}
                className="t-item text-foreground py-2"
                onClick={() => setIsOpen(false)}
              >
                {user ? authLabel : signInLabel}
              </Link>

              <div className="py-3">
                <LanguageCurrencySwitcher showCurrency variant="dropdown" />
              </div>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
