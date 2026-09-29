import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";
import { Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import logoAirbnb from "@/assets/channel-airbnb.webp";
import logoBooking from "@/assets/channel-booking.webp";
import logoVrbo from "@/assets/channel-vrbo.svg";
import logoGuesty from "@/assets/channel-guesty.svg";
import logoPriceLabs from "@/assets/channel-pricelabs.webp";
import logoChekin from "@/assets/channel-chekin.webp";
import logoVasari from "@/assets/partner-vasari.png";

/**
 * "We are working with" — distribution channels plus renovation partners, as
 * one quiet row.
 *
 * Reverted from "Where your home goes live" (Almedin, 22.09.2026) back to the
 * "working with" framing. Vasari (a renovation trade) was deliberately left
 * out of that pass — the channels alone were the argument (reach you do not
 * have on your own), and a trade in the same row blunts it. Put back in on
 * Almedin's explicit call (29.09.2026): "working with" now reads as the whole
 * network around a listing, not only its booking reach. Sur Film is still not
 * in the repo, so it stays out rather than becoming a bare wordmark — a slot
 * with no `src` renders as the same hatched placeholder the rest of the site
 * uses, rather than as a gap.
 */

type Slot = {
  id: string;
  src?: string;
  label: string;
  width?: number;
  height?: number;
  /** Overrides the shared `max-h-9` when one mark needs to read larger than the rest. */
  maxH?: string;
};

// `width`/`height` are each mark's real pixel dimensions, read off the files
// themselves. Unlike the photographs elsewhere these are `object-contain` on
// `w-auto`, so the mark's own ratio is what decides how wide its slot ends up
// — a guessed ratio would shuffle the row sideways as the files land.
const CHANNELS: Slot[] = [
  { id: "channel-airbnb", src: logoAirbnb, label: "Airbnb", width: 600, height: 188 },
  { id: "channel-booking", src: logoBooking, label: "Booking.com", width: 600, height: 100 },
  { id: "channel-vrbo", src: logoVrbo, label: "Vrbo", width: 600, height: 222 },
  { id: "channel-guesty", src: logoGuesty, label: "Guesty", width: 1441, height: 377 },
  { id: "channel-pricelabs", src: logoPriceLabs, label: "PriceLabs", width: 600, height: 156 },
  { id: "channel-chekin", src: logoChekin, label: "Chekin", width: 600, height: 176 },
  // Renovation partner, not a booking channel — back in this row on
  // Almedin's call (29.09.2026); see the block comment above for why it had
  // been left out. Sized up a step past the shared max-h-9 (Almedin,
  // 29.09.2026): the mark reads thin and light next to the others at the
  // same height, and this is the one entry meant to stand out as a partner
  // rather than blend in as a seventh channel.
  { id: "partner-vasari", src: logoVasari, label: "Vasari", width: 315, height: 140, maxH: "max-h-12" },
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

      {/* One row, not a grid: the marks are different widths and a fixed
          grid gives the narrow ones a box of their own.
          `flex-nowrap` keeps all seven on one line at the widths this row
          actually renders at; `overflow-x-auto` is only a safety net for a
          narrower window, not the intended way to read it (Almedin,
          29.09.2026 — the row used to wrap to a second line). */}
      <ul
        className={cn(
          "mt-md flex flex-nowrap items-center justify-center gap-x-md gap-y-md",
          "overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {slots.map((slot) => (
          <li key={slot.id} className="flex items-center shrink-0">
            {slot.src ? (
              <EditableImage
                id={slot.id}
                src={slot.src}
                alt={slot.label}
                onChange={(url) => setSrc(slot.id, url)}
                width={slot.width}
                height={slot.height}
                loading="lazy"
                className={cn(
                  "w-auto object-contain opacity-90 hover:opacity-100 transition-opacity",
                  slot.maxH ?? "max-h-9"
                )}
              />
            ) : (
              <span
                className="bg-placeholder-hatch h-10 w-36 inline-flex items-center justify-center"
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
