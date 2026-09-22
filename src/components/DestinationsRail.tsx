import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Container, MediaFrame, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import placeMarbella from "@/assets/wf-place-marbella.webp";
import placeMalaga from "@/assets/wf-place-malaga.webp";
import placeVienna from "@/assets/wf-place-vienna.webp";

/**
 * "Where we are at home" — the four places, full-bleed, with the fourth
 * deliberately cropped at the right edge so the row reads as continuing rather
 * than as a grid that happens to have run out.
 *
 * Every slot is a MediaFrame: there is no place photography in the repo yet
 * (a villa interior standing in for "Marbella" would be the worse answer), so
 * each frame names the shot it is waiting for until the photographs arrive.
 */

interface Place {
  id: string;
  labelKey: "dest-marbella" | "dest-malaga" | "dest-vienna" | "dest-carinthia";
  /** What /properties should filter on when the card is clicked. */
  query: string;
  src?: string;
  note: string;
}

const PLACES: Place[] = [
  { id: "dest-image-marbella", labelKey: "dest-marbella", query: "Marbella", src: placeMarbella, note: "Marbella — golf and the Sierra Blanca behind it, 3:2" },
  { id: "dest-image-malaga", labelKey: "dest-malaga", query: "Málaga", src: placeMalaga, note: "Málaga — the port and the old town from above, 3:2" },
  { id: "dest-image-vienna", labelKey: "dest-vienna", query: "Vienna", src: placeVienna, note: "Vienna — the inner city at dusk, 3:2" },
  // Still waiting on a photograph. A Costa del Sol pool standing in for an
  // Alpine lake would be the worse answer than an honest empty frame.
  { id: "dest-image-carinthia", labelKey: "dest-carinthia", query: "Carinthia", note: "Carinthia — lake and mountains in summer, 3:2" },
];

const DestinationsRail = () => {
  const { t, language } = useLocale();
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement>(null);
  const [heading, setHeading] = useState(t("dest-heading"));

  useEffect(() => {
    setHeading(t("dest-heading"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // One card plus its gap, so an arrow click always lands on a card edge.
    el.scrollBy({ left: dir * 444, behavior: "smooth" });
  };

  return (
    <Section size="md" bleed>
      <Container className="flex items-baseline justify-between gap-md mb-[34px]">
        <EditableText
          id="dest-heading"
          value={heading}
          onChange={setHeading}
          as="h2"
          className="t-section text-foreground"
        >
          {heading}
        </EditableText>

        {/* Always visible, not `hidden md:flex` — on a phone the rail is the
            only way through the row and the arrows are how you know it moves. */}
        <div className="flex gap-3 shrink-0">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scrollBy(dir)}
              aria-label={dir === -1 ? "Previous destinations" : "Next destinations"}
              className="h-11 w-11 rounded-full border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors inline-flex items-center justify-center"
            >
              {dir === -1 ? (
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          ))}
        </div>
      </Container>

      {/* app-bleed-inset lines the first card up with the container above it
          while the row itself still runs to the viewport edge. */}
      {/* Three whole cards and the fourth cut off at the right edge — the row
          has to read as continuing, which a tidy four-up grid does not. Fixed
          420px cards on a 24px gap, starting at the container's own left edge:
          110 + 3×420 + 2×24 = 1418 of 1440, so card four shows 22px of itself
          and the rest is behind the viewport. */}
      {/* `scroll-pl` matters: with snap alignment and no scroll padding the
          browser snaps a card's leading edge to the scroll-port edge and eats
          the container inset, so the row jumps flush to the viewport and the
          first caption is clipped. */}
      <div
        ref={railRef}
        className="app-bleed-inset scroll-pl-[var(--container-inset)] flex gap-6 overflow-x-auto snap-x snap-proximity pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PLACES.map((place) => (
          <button
            key={place.id}
            type="button"
            onClick={() => navigate(`/properties?location=${encodeURIComponent(place.query)}`)}
            className="group snap-start shrink-0 w-[72vw] sm:w-[44vw] lg:w-[420px] text-left"
          >
            <div className="overflow-hidden">
              <MediaFrame
                id={place.id}
                src={place.src}
                alt={t(place.labelKey)}
                note={place.note}
                aspect="wide"
                className="aspect-[3/2] lg:aspect-auto lg:h-[300px] transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <p className="t-card text-foreground mt-3.5 group-hover:text-accent-strong transition-colors">
              {t(place.labelKey)}
            </p>
          </button>
        ))}
      </div>
    </Section>
  );
};

export default DestinationsRail;
