import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";
import { Section, Container } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

/**
 * The lightest section on the page, on purpose — a short breather right
 * after Proof, the heaviest one. No headline, no body copy, no CTA: just an
 * eyebrow and a row of logos, on the beige page background rather than
 * continuing Proof's green fill, so the change of register itself reads as
 * "we can stop pushing for a moment."
 *
 * Deliberately mixes two different kinds of "partner" under one label —
 * guest-facing brands (Netflix, bundled into the stays) alongside trade
 * contractors (renovation partners) — confirmed with Almedin rather than
 * assumed; both belong here as "who we work with" in the broadest sense.
 *
 * None of the four logo files exist in the project yet (checked
 * src/assets and every component for a reusable logo pattern first —
 * `platform-connections.webp` is a single flat graphic for a completely
 * different purpose, booking-platform distribution, not a partner-logo
 * component). Each slot renders the same hatched placeholder MediaFrame
 * uses elsewhere for a missing photograph — `object-contain`, not
 * MediaFrame's own `object-cover`, since a cropped logo is a wrong logo in
 * a way a cropped photo usually isn't. Supplying a real file via
 * `EditableImage` (in edit mode) is all a call site needs to change once
 * Almedin has them.
 */
interface Partner {
  /** Shown in the placeholder until a real logo is supplied. */
  name: string;
  src?: string;
}

const INITIAL_PARTNERS: Partner[] = [
  { name: "Netflix" },
  { name: "Partner 2" },
  { name: "Partner 3" },
  { name: "Partner 4" },
];

const WorkingWith = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("working-with-eyebrow"));
  const [partners, setPartners] = useState(INITIAL_PARTNERS);

  useEffect(() => {
    setEyebrow(t("working-with-eyebrow"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updateLogo = (index: number, url: string) => {
    const next = [...partners];
    next[index] = { ...next[index], src: url };
    setPartners(next);
  };

  return (
    <Section size="sm">
      <Container measure="text" className="text-center">
        <EditableText
          id="working-with-eyebrow"
          value={eyebrow}
          onChange={setEyebrow}
          as="span"
          className="block t-meta text-accent-strong mb-lg"
        >
          {eyebrow}
        </EditableText>

        {/* flex-nowrap, not flex-wrap: Almedin asked for the four side by
            side, not two-by-two on narrow screens. The boxes and gap both
            shrink at the smallest breakpoint instead — four 144px slots
            with a 2xl gap between them cannot fit one row on a phone,
            regardless of wrap behaviour. */}
        <div className="flex flex-nowrap items-center justify-center gap-x-xs sm:gap-x-xl">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex h-10 w-16 shrink-0 items-center justify-center sm:h-14 sm:w-36"
            >
              {partner.src ? (
                <EditableImage
                  id={`working-with-logo-${index}`}
                  src={partner.src}
                  alt={partner.name}
                  onChange={(url) => updateLogo(index, url)}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div
                  className={cn("bg-placeholder-hatch flex h-full w-full items-center justify-center rounded-md p-1 sm:p-2")}
                  aria-hidden="true"
                >
                  <p className="t-meta text-accent-strong/70 text-center leading-tight">{partner.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WorkingWith;
