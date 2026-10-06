import { Container, Stack } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import WinterSearchBar, { type WinterSearchValues } from "./WinterSearchBar";
import type { WinterRentalCity } from "@/lib/winterRentals";

/**
 * The opening band on /winter-rentals — same recipe as Hero.tsx (full-bleed
 * image, eyebrow, headline, lead, search bar on top) so this page reads as
 * the winter-rental line's own front door, not a lightweight sub-page of the
 * short-stay site (the 06.10.2026 decision: give winter rentals the same
 * character as `/`, scoped to its own options).
 *
 * A photo, not a video: there is no winter-specific clip, and shooting one
 * is out of scope here. The photo itself is not hand-picked — it's whichever
 * published home happens to have one (see WinterRentals.tsx), so the hero
 * improves on its own as Frontier uploads photos through `/admin/winter-
 * rentals` (PROJECT.md B7.2) rather than needing a code change later. Until
 * then it falls back to the same hatched placeholder MediaFrame uses
 * elsewhere, honestly, instead of borrowing a Guesty property photo that
 * isn't one of these homes.
 */
const WinterHero = ({
  image,
  search,
}: {
  image?: { url: string; caption?: string };
  search: WinterSearchValues & {
    onPlaceChange: (value: WinterRentalCity["slug"] | "") => void;
    onMoveInChange: (value: Date | undefined) => void;
    onSearch: () => void;
  };
}) => {
  const { t } = useLocale();

  return (
    <section className="relative flex items-end overflow-hidden pt-20 min-h-[clamp(30rem,66vh,44rem)]">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.caption ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-placeholder-hatch" aria-hidden="true" />
        )}
        <div className="absolute inset-0 overlay-media" aria-hidden="true" />
      </div>

      <Container measure="wide" className="relative z-10 pb-2xl pt-lg text-center">
        <Stack gap="md" align="center" className="animate-fade-in">
          <p className="t-tag text-[0.6875rem] text-white/75">{t("wr-overview-eyebrow")}</p>
          <h1 className="t-display text-[clamp(2.185rem,1.265rem+4.14vw,4.169rem)] text-white text-balance">
            {t("wr-overview-h1")}
          </h1>
          <p className="t-body text-[19px] text-white/[0.86] max-w-[52ch] mx-auto">{t("wr-overview-lead")}</p>

          <WinterSearchBar
            place={search.place}
            moveIn={search.moveIn}
            onPlaceChange={search.onPlaceChange}
            onMoveInChange={search.onMoveInChange}
            onSearch={search.onSearch}
          />
        </Stack>
      </Container>
    </section>
  );
};

export default WinterHero;
