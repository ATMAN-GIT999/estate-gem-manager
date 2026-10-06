import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import WinterSearchBar from "./WinterSearchBar";
import { Container, Stack } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { WinterRentalCity } from "@/lib/winterRentals";
import heroImage from "@/assets/wf-villa-higueron.webp";

interface WinterHeroProps {
  place: WinterRentalCity["slug"] | "";
  moveInDate?: Date;
  onPlaceChange: (value: WinterRentalCity["slug"] | "") => void;
  onMoveInChange: (value: Date | undefined) => void;
  onSearch: () => void;
}

/**
 * The hub's own hero — full-bleed photo at the same footprint as Hero.tsx
 * (`pt-20` under the fixed nav, the same `min-h-[clamp(36rem,78vh,52rem)]`,
 * the same centred Stack), a photo in place of the homepage's video since
 * there is no winter-rentals clip. Centred rather than left-aligned on
 * purpose (Almedin, 06.10.2026) — an earlier asymmetric pass read as a
 * second, competing hero language instead of the same one with different
 * words, which is what this page is meant to be.
 */
const WinterHero = ({ place, moveInDate, onPlaceChange, onMoveInChange, onSearch }: WinterHeroProps) => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("wr-overview-eyebrow"));
  const [headline, setHeadline] = useState(t("wr-overview-h1"));
  const [lead, setLead] = useState(t("wr-overview-lead"));

  useEffect(() => {
    setEyebrow(t("wr-overview-eyebrow"));
    setHeadline(t("wr-overview-h1"));
    setLead(t("wr-overview-lead"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <section className="relative flex items-end overflow-hidden pt-20 min-h-[clamp(36rem,78vh,52rem)]">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Same overlay token Hero.tsx's video uses — a longer fade at the top
            under the floating nav, consistent darkening for the white text. */}
        <div className="absolute inset-0 overlay-hero" aria-hidden="true" />
      </div>

      <Container measure="wide" className="relative z-10 pb-2xl pt-lg text-center">
        <Stack gap="md" align="center" className="animate-fade-in">
          <EditableText
            id="wr-overview-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-[0.6875rem] text-white/75"
          >
            {eyebrow}
          </EditableText>

          <EditableText
            id="wr-overview-h1"
            value={headline}
            onChange={setHeadline}
            as="h1"
            className="t-display text-[clamp(2.185rem,1.265rem+4.14vw,4.169rem)] text-white text-balance"
          >
            {headline}
          </EditableText>

          <EditableText
            id="wr-overview-lead"
            value={lead}
            onChange={setLead}
            as="p"
            className="t-body text-[19px] text-white/[0.86] max-w-[52ch] mx-auto"
          >
            {lead}
          </EditableText>

          <WinterSearchBar
            place={place}
            moveInDate={moveInDate}
            onPlaceChange={onPlaceChange}
            onMoveInChange={onMoveInChange}
            onSearch={onSearch}
          />
        </Stack>
      </Container>
    </section>
  );
};

export default WinterHero;
