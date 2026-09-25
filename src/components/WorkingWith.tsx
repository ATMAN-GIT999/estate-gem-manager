import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";
import { Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import logoAirbnb from "@/assets/channel-airbnb.webp";
import logoBooking from "@/assets/channel-booking.webp";
import logoGuesty from "@/assets/channel-guesty.svg";
import logoPriceLabs from "@/assets/channel-pricelabs.webp";
import logoChekin from "@/assets/channel-chekin.webp";

/**
 * "We are working with" — the distribution channels, as one quiet row.
 *
 * Reverted from "Where your home goes live" (Almedin, 22.09.2026) back to the
 * "working with" framing. Still scoped to distribution channels only, not the
 * renovation trades (Sur Film, Vasari) the pre-wireframe version of this line
 * also carried — on the owner page the channels are an argument (this is
 * reach you do not have on your own), and a video company in the same row
 * blunts it. The trades are not gone from the business, only from this claim.
 *
 * Four of the six marks are not in the repo yet, so they render as the same
 * hatched placeholder the rest of the site uses rather than as a gap or a
 * wordmark typed out in the page font.
 */

type Slot = { id: string; src?: string; label: string; width?: number; height?: number };

// `width`/`height` are each mark's real pixel dimensions, read off the files
// themselves. Unlike the photographs elsewhere these are `object-contain` on
// `w-auto`, so the mark's own ratio is what decides how wide its slot ends up
// — a guessed ratio would shuffle the row sideways as the files land.
const CHANNELS: Slot[] = [
  { id: "channel-airbnb", src: logoAirbnb, label: "Airbnb", width: 600, height: 188 },
  { id: "channel-booking", src: logoBooking, label: "Booking.com", width: 600, height: 100 },
  // Still waiting on a usable Vrbo mark; the hatched slot names it rather
  // than the row quietly becoming five.
  { id: "channel-vrbo", label: "Vrbo" },
  { id: "channel-guesty", src: logoGuesty, label: "Guesty", width: 1441, height: 377 },
  { id: "channel-pricelabs", src: logoPriceLabs, label: "PriceLabs", width: 600, height: 156 },
  { id: "channel-chekin", src: logoChekin, label: "Chekin", width: 600, height: 176 },
];

const WorkingWith = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("logoband-eyebrow"));
  const [slots, setSlots] = useState(CHANNELS);

  useEffect(() => {
    setEyebrow(t("logoband-eyebrow"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const setSrc = (id: string, url: string) =>
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, src: url } : s)));

  return (
    <Section size="sm">
      <EditableText
        id="logoband-eyebrow"
        value={eyebrow}
        onChange={setEyebrow}
        as="h2"
        className="t-tag text-accent-strong text-center"
      >
        {eyebrow}
      </EditableText>

      {/* One row that wraps, not a grid: the marks are different widths and
          a fixed grid gives the narrow ones a box of their own. */}
      <ul className="mt-md flex flex-wrap items-center justify-center gap-x-lg gap-y-md">
        {slots.map((slot) => (
          <li key={slot.id} className="h-9 flex items-center">
            {slot.src ? (
              <EditableImage
                id={slot.id}
                src={slot.src}
                alt={slot.label}
                onChange={(url) => setSrc(slot.id, url)}
                width={slot.width}
                height={slot.height}
                loading="lazy"
                className="max-h-7 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity"
              />
            ) : (
              <span
                className="bg-placeholder-hatch h-8 w-28 inline-flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="t-tag text-accent-strong/70">{slot.label}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default WorkingWith;
