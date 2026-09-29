import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import EditableText from "./admin/EditableText";
import { Container } from "./layout";
import LanguageCurrencySwitcher from "./LanguageCurrencySwitcher";
import { useLocale } from "@/contexts/LocaleContext";
import { AUSTRIA_DESTINATIONS, SPAIN_DESTINATIONS, type Destination } from "@/lib/destinations";
import villaHigueron from "@/assets/wf-villa-higueron.webp";
import frontierIcon from "@/assets/frontier-icon.png";
import frontierIconBeige from "@/assets/frontier-icon-beige.png";

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
 *      columns, one property teaser, and a link to the full destinations
 *      overview — the occasions column (golf, families, large groups) is
 *      gone (Almedin, 29.09.2026), replaced by that link.
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
  /**
   * The badge's letters are sage-green — fine on white, but low-contrast
   * wherever the transparent bar floats over something busy or green itself:
   * `/` (video) and `/property-management` (`OwnerHero`'s solid green fill)
   * both pass this (Almedin, 29.09.2026). Swaps in the all-beige badge only
   * while still floating (`overlay && !solid`); once scrolled solid, or on a
   * page that never passes this at all (a plain photo hero has enough of its
   * own darkening — see `.overlay-media` — for the regular badge to read),
   * the regular one is back.
   */
  logoOnDark?: boolean;
}

const SPAIN = SPAIN_DESTINATIONS;
const AUSTRIA = AUSTRIA_DESTINATIONS;

const Navigation = ({ variant = "default", overlay = false, logoOnDark = false }: NavigationProps) => {
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

  // Every place in the panel has a location page, and browsing a place opens
  // it; the region links below ("All on the Costa del Sol") stay searches.
  const goToPlace = (d: Destination) => {
    setPanelOpen(false);
    setIsOpen(false);
    navigate(`/vacation-rentals/${d.page}`);
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

          {/* Centre — the monogram badge, trying out for the typed wordmark
              (Almedin, 29.09.2026). The PNG's own ring and letters are the
              only opaque pixels in it — no card behind them — so unlike the
              text this mostly no longer needs the transparent/solid colour
              swap: beige ring and sage-green letters read on white (state
              2/3) fine. The one exception is `logoOnDark`, see the prop doc
              above — an all-beige badge swaps in while still transparent. */}
          <Link to="/" className="justify-self-center transition-opacity hover:opacity-80">
            <img
              src={logoOnDark && !solid ? frontierIconBeige : frontierIcon}
              alt="Frontier Residences"
              width={1736}
              height={2670}
              className="h-[52px] w-auto"
            />
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
              {/* Leftmost on purpose (Almedin, 29.09.2026): the one link
                  meant to read as "see everything" leads the row instead of
                  trailing Spain and Austria, where it used to read as an
                  afterthought once those two were already answered. Replaces
                  the old "By occasion" column (golf, families, large groups)
                  — none of the three led anywhere as useful as just browsing
                  every place at once. Sized up to t-section (the "section
                  title" role) on purpose — every other word in this panel is
                  t-tag or t-body, and this link needs to out-weigh all of
                  them, not blend in as a destination itself. */}
              <div className="col-span-3 flex flex-col justify-center">
                <p className="t-tag text-accent-strong mb-4">Explore</p>
                <Link
                  to="/vacation-rentals"
                  onClick={() => setPanelOpen(false)}
                  className="group/all inline-flex items-start gap-2 t-section text-foreground hover:text-accent-strong transition-colors text-balance"
                >
                  All destinations
                  <ArrowRight
                    className="h-5 w-5 shrink-0 mt-2 transition-transform group-hover/all:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>

              <div className="col-span-3">
                <p className="t-tag text-accent-strong mb-4">Spain</p>
                {SPAIN.map((d) => (
                  <button key={d.label} type="button" className={panelLink} onClick={() => goToPlace(d)}>
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
                  <button key={d.label} type="button" className={panelLink} onClick={() => goToPlace(d)}>
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

              <Link
                to="/vacation-rentals/fuengirola"
                className="col-span-3 group"
                onClick={() => setPanelOpen(false)}
              >
                {/* "Our favourite" (Almedin, 29.09.2026), same tag style as
                    "Spain"/"Austria" so the one curated pick reads as a peer
                    of those columns, not a caption on the photo. */}
                <p className="t-tag text-accent-strong mb-4">Our favourite</p>
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={villaHigueron}
                    alt="Villa Higuerón, Fuengirola — living room with sea view"
                    width={480}
                    height={640}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="t-card text-foreground mt-3">Villa Higuerón</p>
                {/* Links to the Fuengirola page: `/property/villa-higueron` was
                    never a real address (the Guesty slugs carry a hash), so it
                    ended on "not found". No price either — "from €1,180" was
                    typed in by hand, and a price here has to come from Guesty
                    live or not be shown (docs/PROJECT.md, "Preise"). */}
                <p className="t-body text-muted-foreground">Fuengirola</p>
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
                <button key={d.label} type="button" className={panelLink} onClick={() => goToPlace(d)}>
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
