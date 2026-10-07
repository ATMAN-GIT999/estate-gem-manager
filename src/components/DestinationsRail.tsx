import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Container, MediaFrame, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import placeMarbella from "@/assets/wf-place-marbella.webp";
import placeMalaga from "@/assets/wf-place-malaga.webp";
import placeVienna from "@/assets/wf-place-vienna.webp";
import placeCarinthia from "@/assets/wf-place-carinthia.jpg";

/**
 * "Where we are at home" — the four places as tall, frameless photographs.
 *
 * Rebuilt on the Lovable landing reference (Almedin, 07.10.2026). Two things
 * about it are deliberate and easy to "tidy" into something worse:
 *
 *   1. The card width is a share of the VIEWPORT (`vw`), not a fixed pixel
 *      width and not a share of the container. That is the whole point: zoom
 *      the browser out to 50% or 30% and the pictures keep filling the screen
 *      instead of shrinking into a small row floating in unused space (the
 *      "zoom-out test" in Container.tsx). Do not swap these for `w-[420px]`.
 *   2. The fourth card is cut off at the right edge, so the row reads as
 *      continuing rather than as a grid that happens to have run out. The row
 *      spans the whole window from its left gutter; only the heading sits in
 *      the centred container. Zoomed out, the heading therefore floats in the
 *      middle above a full-width row — that is the reference's behaviour and
 *      what was asked for.
 *
 * Every slot is a MediaFrame — a villa interior standing in for "Marbella"
 * would be the worse answer than an honest hatched placeholder naming the
 * shot it is waiting for. All four places have their photograph (Carinthia
 * last, 29.09.2026); a new destination added here still falls back to the
 * placeholder until its own picture arrives.
 */

interface Place {
  id: string;
  labelKey: "dest-marbella" | "dest-malaga" | "dest-vienna" | "dest-carinthia";
  /** The location page the card opens (`/vacation-rentals/<page>`). */
  page: "malaga" | "marbella" | "vienna" | "carinthia";
  src?: string;
  note: string;
}

const PLACES: Place[] = [
  { id: "dest-image-marbella", labelKey: "dest-marbella", page: "marbella", src: placeMarbella, note: "Marbella — golf and the Sierra Blanca behind it" },
  { id: "dest-image-malaga", labelKey: "dest-malaga", page: "malaga", src: placeMalaga, note: "Málaga — the port and the old town from above" },
  { id: "dest-image-vienna", labelKey: "dest-vienna", page: "vienna", src: placeVienna, note: "Vienna — the inner city at dusk" },
  { id: "dest-image-carinthia", labelKey: "dest-carinthia", page: "carinthia", src: placeCarinthia, note: "Carinthia — glacier peak above a green Alpine valley (Almedin, 29.09.2026)" },
];

const DestinationsRail = () => {
  const { t, language } = useLocale();
  const railRef = useRef<HTMLDivElement>(null);
  const [heading, setHeading] = useState(t("dest-heading"));

  useEffect(() => {
    setHeading(t("dest-heading"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // A share of the rail's own width, not a pixel count: the cards are
    // vw-wide, so any fixed step would drift off the card edges at other zooms.
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <Section id="destinations" size="md" bleed>
      <Container className="mb-lg flex items-end justify-between gap-md">
        <div>
          <p className="t-tag text-accent-strong">{t("eyebrow-places")}</p>
          <EditableText
            id="dest-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-chapter mt-4 text-foreground"
          >
            {heading}
          </EditableText>
        </div>

        {/* Always visible, not `hidden md:flex` — on a phone the rail is the
            only way through the row and the arrows are how you know it moves. */}
        <div className="flex shrink-0 gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scrollBy(dir)}
              aria-label={dir === -1 ? "Previous destinations" : "Next destinations"}
              className="inline-flex h-11 w-11 items-center justify-center border border-foreground text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {dir === -1 ? (
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          ))}
        </div>
      </Container>

      {/* The row is inset by the viewport GUTTER, not by `app-bleed-inset`
          (the container's edge). Deliberate, and it is what the reference does:
          the rail runs across the whole window and starts at its left gutter,
          while only the heading above sits in the centred container. With
          `app-bleed-inset` the first photograph lined up with the heading, but
          zoomed out the row then started in the middle of the screen and the
          left half was empty (Almedin, 07.10.2026, checked against the Lovable
          page at 30 % and 100 %). At normal widths the two are the same value.
          `scroll-pl` matters: with snap alignment and no scroll padding the
          browser snaps a card's leading edge to the scroll-port edge and eats
          the inset. `items-start` lets the odd cards sit lower (`mt-16`)
          without stretching to the tallest. */}
      <div
        ref={railRef}
        className="px-[var(--container-gutter)] scroll-pl-[var(--container-gutter)] flex items-start gap-5 overflow-x-auto snap-x snap-proximity pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PLACES.map((place, i) => (
          // A real link to the location page rather than a button into a
          // filtered search (docs/seo/struktur.md §8): the landing page is the
          // strongest page on the site, and an <a href> is the only kind of
          // link a crawler follows from it.
          <Link
            key={place.id}
            to={`/vacation-rentals/${place.page}`}
            className={cn(
              "group relative shrink-0 snap-start overflow-hidden",
              // Alternating height and drop — the staggered rhythm of the
              // reference. The `vw` widths are the load-bearing part, see above.
              i % 2 ? "mt-16 aspect-[3/4]" : "aspect-[4/5]",
              "w-[78vw] md:w-[34vw] lg:w-[28vw]"
            )}
          >
            <MediaFrame
              id={place.id}
              src={place.src}
              alt={t(place.labelKey)}
              note={place.note}
              fill
              className="transition-transform duration-700 group-hover:scale-105"
            />
            {/* Palette-derived, like every other photo band — never neutral
                black (see --overlay-media in index.css). The name sits at the
                bottom, so only the bottom is darkened. */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent"
              aria-hidden="true"
            />
            <span className="t-chapter absolute bottom-5 left-5 text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] uppercase text-white">
              {t(place.labelKey)}
            </span>
            <span className="t-meta absolute right-5 top-5 text-accent-on-primary">0{i + 1}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
};

export default DestinationsRail;
