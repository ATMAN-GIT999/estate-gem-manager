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
import { WINTER_RENTALS_PATH, WINTER_RENTAL_CITIES, wrKey, type WinterRentalCity } from "@/lib/winterRentals";
import villaHigueron from "@/assets/wf-villa-higueron.webp";
import frontierLockup from "@/assets/frontier-lockup.svg";
import frontierLockupBeige from "@/assets/frontier-lockup-beige.svg";

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
 *
 * Logo left, links right (Almedin, 07.10.2026, matching the Lovable landing
 * reference) with the typed wordmark lockup from the brand folder instead of
 * the centred monogram: the green lockup on white, the all-beige one while the
 * bar floats over a hero.
 */

interface NavigationProps {
  /** Kept for call-site compatibility; the bar is the same on every page now. */
  variant?: "default" | "propertyManagement";
  /**
   * Sit transparently on top of a full-bleed hero instead of opening solid
   * white. Only the pages that open on a hero pass this.
   */
  overlay?: boolean;
  /**
   * Kept for call-site compatibility. The lockup's green letters vanish on any
   * dark photo or on the owner page's green fill, so the beige lockup now
   * replaces the green one for EVERY floating bar (`overlay && !solid`), not
   * only where this was passed — a regular lockup over a darkened photo was the
   * one case the old monogram could get away with and the wordmark cannot.
   */
  logoOnDark?: boolean;
  /**
   * Slide away while the visitor scrolls down and come back — white — on the
   * first upward scroll (Almedin, 07.10.2026). Opt-in and only passed by `/`:
   * /properties parks a sticky filter strip directly under this bar, and a bar
   * that leaves would strand that strip with a gap above it.
   */
  hideOnScroll?: boolean;
}

/** Scroll depth after which a hide-on-scroll bar may leave. Below it the bar is
 *  still over the hero, where leaving would only flicker. */
const HIDE_AFTER = 120;
/** Scroll depth at which a hide-on-scroll bar stops being transparent. Small on
 *  purpose: it only ever shows below this line after an upward scroll, and a
 *  transparent bar over page content would be unreadable. */
const SOLID_AT = 24;

const SPAIN = SPAIN_DESTINATIONS;
const AUSTRIA = AUSTRIA_DESTINATIONS;

const Navigation = ({
  variant = "default",
  overlay = false,
  logoOnDark = false,
  hideOnScroll = false,
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlay) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (!hideOnScroll) {
        setScrolled(y > window.innerHeight * 0.6);
        return;
      }
      setScrolled(y > SOLID_AT);
      // Direction is read off a few pixels of travel, not every event: trackpad
      // inertia and iOS rubber-banding fire tiny opposite-signed deltas that
      // would make the bar flicker. `lastY` only advances once the threshold is
      // crossed, so a slow scroll still accumulates into a direction.
      const delta = y - lastY;
      if (Math.abs(delta) < 4) return;
      setScrolledDown(delta > 0 && y > HIDE_AFTER);
      lastY = y;
    };
    onScroll(); // a reload part-way down the page must not start transparent
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay, hideOnScroll]);

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
  // Never hide a bar whose menu or destinations sheet is open — they hang off
  // it and would vanish under the visitor's cursor.
  const offscreen = hideOnScroll && scrolledDown && !isOpen && !panelOpen;

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

  const goToWinterCity = (slug: WinterRentalCity["slug"]) => {
    setPanelOpen(false);
    setIsOpen(false);
    navigate(`${WINTER_RENTALS_PATH}/${slug}`);
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
      // Tabbing into a bar that has slid away would focus something the
      // visitor cannot see — bringing it back is the only sane answer.
      onFocusCapture={() => setScrolledDown(false)}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[transform,background-color] duration-300 motion-reduce:transition-none",
        solid ? "bg-background border-b border-border" : "bg-transparent",
        offscreen && "-translate-y-full"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Left — the wordmark lockup. Green on white; all-beige while the
              bar floats over a hero (see `logoOnDark` above). The two SVGs are
              cropped to their artwork, so the height alone sets the size. */}
          <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
            <img
              src={overlay && !solid ? frontierLockupBeige : frontierLockup}
              alt="Frontier Residences"
              width={566}
              height={179}
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          {/* Right — destinations, owner entry, utilities, the one filled action. */}
          <div className="flex items-center gap-4 lg:gap-7 whitespace-nowrap">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className={cn(linkClass, "hidden lg:inline-flex items-center gap-1.5")}
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

            <Link to="/property-management" className={cn(linkClass, "hidden lg:inline")}>
              <EditableText
                id="nav-list-your-home"
                value={listYourHome}
                onChange={setListYourHome}
                as="span"
              >
                {listYourHome}
              </EditableText>
            </Link>

            <div className="hidden lg:block">
              <LanguageCurrencySwitcher
                showCurrency
                variant="dropdown"
                size="sm"
                onDark={!solid}
              />
            </div>

            <Link
              to={user ? authDestination : "/auth"}
              className={cn(linkClass, "hidden lg:inline-flex items-center")}
              aria-label={user ? authLabel : signInLabel}
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} />
            </Link>

            {/* Square, no arrow — the landing reference's button, and the only
                gold fill in the bar. */}
            <Link to="/properties" className="cta-base cta-primary cta-square h-10 px-5 text-[0.9375rem]">
              <EditableText
                id="nav-book-stay-cta"
                value={bookAStayLabel}
                onChange={setBookAStayLabel}
                as="span"
              >
                {bookAStayLabel}
              </EditableText>
            </Link>

            {/* Mobile menu button — after the CTA now that the logo owns the
                left edge. */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn("lg:hidden p-2 -mr-2", solid ? "text-foreground" : "text-white")}
              aria-label="Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {/* State 3 — the destinations sheet. */}
      {panelOpen && (
        <div className="hidden lg:block border-t border-border bg-background animate-fade-in">
          <Container className="py-lg">
            <div className="grid grid-cols-12 gap-md">
              {/* Leftmost on purpose (Almedin, 29.09.2026): the one column
                  meant to read as "see everything" leads the row instead of
                  trailing Spain and Austria, where it used to read as an
                  afterthought once those two were already answered. Replaces
                  the old "By occasion" column (golf, families, large groups)
                  — none of the three led anywhere as useful as just browsing
                  every place at once.
                  "All destinations" and "All winter rentals" share this
                  column, top and bottom (Almedin, 06.10.2026) — a same-width
                  second column for winter rentals existed for one round, but
                  read as one extra column rather than "the second half of the
                  same idea". Top-aligned (no more `justify-center`) so
                  "Explore" starts level with "Spain"/"Austria"; the winter
                  block sits on `mt-auto` instead of a fixed gap, so it lands
                  at the bottom of the row — level with "All on the Costa del
                  Sol →"/"All in Austria →" below their own lists — and the
                  panel reads as two rows across three columns (this one,
                  Spain+Austria together, the photo) rather than four columns
                  in a single row. */}
              <div className="col-span-3 flex flex-col">
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

                <div className="mt-auto pt-6">
                  {/* Same face as a property title (WinterListingCard.tsx,
                      PropertyCard.tsx) — .t-card is Archivo, tracked-out
                      caps; deliberately NOT .t-section's Sora, so the
                      question reads as catalogue voice, not a second heading
                      competing with "All destinations"/"All winter rentals". */}
                  <p className="t-card text-foreground mb-2">Interested in staying the offseason?</p>
                  <p className="t-tag text-accent-strong mb-4">Winter-Midterm Rental</p>
                  <Link
                    to={WINTER_RENTALS_PATH}
                    onClick={() => setPanelOpen(false)}
                    className="group/winter inline-flex items-start gap-2 t-section text-foreground hover:text-accent-strong transition-colors text-balance"
                  >
                    All winter rentals
                    <ArrowRight
                      className="h-5 w-5 shrink-0 mt-2 transition-transform group-hover/winter:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>
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

              {/* Winter Rentals had no mobile entry point at all before this
                  (Almedin, 06.10.2026) — the desktop panel's own gap, just
                  harder to miss here since there is no hover state to stumble
                  onto it with. Same parallel framing as the desktop panel:
                  its own heading, not folded into "Destinations" above. */}
              <p className="t-tag text-accent-strong mb-2 mt-4 pt-4 border-t border-border">
                Winter &amp; Midterm
              </p>
              {WINTER_RENTAL_CITIES.map((city) => (
                <button
                  key={city.slug}
                  type="button"
                  className={panelLink}
                  onClick={() => goToWinterCity(city.slug)}
                >
                  {t(wrKey(city.slug, "name"))}
                </button>
              ))}
              <Link
                to={WINTER_RENTALS_PATH}
                onClick={() => setIsOpen(false)}
                className="cta-link mt-2 text-[0.9375rem] inline-block"
              >
                All winter rentals →
              </Link>

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
