import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";
import { Section, Container } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { useInlineEdit } from "@/contexts/InlineEditContext";
import { cn } from "@/lib/utils";
import logoSurFilm from "@/assets/partner-sur-film.webp";
import logoGuesty from "@/assets/partner-guesty.webp";
import logoVasari from "@/assets/partner-vasari.webp";
import logoChekin from "@/assets/partner-chekin.webp";

/**
 * The lightest section on the page, on purpose — a short breather right
 * after Proof, the heaviest one. No headline, no body copy, no CTA: just an
 * eyebrow and a row of logos, on the beige page background rather than
 * continuing Proof's green fill, so the change of register itself reads as
 * "we can stop pushing for a moment."
 *
 * Deliberately mixes different kinds of "partner" under one label —
 * guest-facing brands alongside trade contractors and vendors — confirmed
 * with Almedin rather than assumed; both belong here as "who we work with"
 * in the broadest sense.
 *
 * All four logos are real now (22.08.2026). Sur Film and Guesty started as
 * screenshot crops off each company's own site (DECISIONS.md §42, no
 * downloadable brand asset existed on either site) and were later replaced
 * with the official transparent files Almedin supplied, auto-cropped to
 * their opaque content (`Image.getbbox()` after keying white to
 * transparent) plus a small uniform padding so all four sit at a visually
 * similar scale despite arriving at different native sizes. Grupo Vasari's
 * emblem keeps its own white tile as-is, since that square is part of how
 * the brand presents the mark, not an artifact of the crop. Chekin (guest
 * ID verification / online check-in) replaced the Netflix placeholder slot
 * — Netflix never got a logo file, Chekin arrived with one already supplied.
 * `object-contain`, not MediaFrame's own `object-cover`, since a cropped
 * logo is a wrong logo in a way a cropped photo usually isn't.
 */
interface Partner {
  /** Shown in the placeholder until a real logo is supplied. */
  name: string;
  src?: string;
  /** Each partner's own site — confirmed real URLs, not guessed (Chekin's
      via a web search, since Almedin never sent that one directly). */
  href: string;
}

const INITIAL_PARTNERS: Partner[] = [
  { name: "Sur Film", src: logoSurFilm, href: "https://www.sur-film.com" },
  { name: "Guesty", src: logoGuesty, href: "https://www.guesty.com" },
  { name: "Chekin", src: logoChekin, href: "https://chekin.com" },
  { name: "Grupo Vasari", src: logoVasari, href: "https://www.grupovasari.com" },
];

const WorkingWith = () => {
  const { t, language } = useLocale();
  const { editMode } = useInlineEdit();
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
            shrink at the smallest breakpoint instead — four 192px slots
            with a 2xl gap between them cannot fit one row on a phone,
            regardless of wrap behaviour.

            Sized up 22.08.2026 (DECISIONS §44) — 72px is the ceiling that
            still fits four boxes plus three `gap-x-xs` (12px) gaps inside a
            375px phone's content width (~335px after gutters): 4×72 + 3×12
            = 324px, just under. Going wider here would overflow on the
            narrowest still-relevant phones instead of just looking tight. */}
        <div className="flex flex-nowrap items-center justify-center gap-x-xs sm:gap-x-xl">
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${partner.name}`}
              // In edit mode a click has to reach EditableImage's own pencil
              // button (opens the swap-image dialog), not leave the page —
              // preventDefault still lets that click bubble and fire.
              onClick={editMode ? (e) => e.preventDefault() : undefined}
              className="flex h-14 w-[72px] shrink-0 items-center justify-center sm:h-20 sm:w-48"
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
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WorkingWith;
