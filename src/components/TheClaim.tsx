import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { MediaFrame, Section } from "./layout";
import claimImage from "@/assets/wf-hero-villa-higueron.jpg";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

/**
 * The sentence the whole owner page is an argument for, with one photograph
 * under it.
 *
 * Staggered on purpose (Almedin, 26.09.2026): the words sit on the right, the
 * picture on the left, and the two overlap. It used to be a centred title over
 * a centred banner — the one section of the page that was symmetrical, which
 * made it read as a pause instead of the claim.
 *
 * What makes it more than an offset: the photograph is darkened slightly, so
 * the light boxes laid over its corner have something to stand out against,
 * and each line of the claim is set as its own coloured label. The two lines
 * are two colours — sage for what the owner saves, gold for what the property
 * earns — so the sentence can be read from the colours alone. The lead
 * paragraph sits in a beige box that straddles the photograph's top edge,
 * which is what ties text and picture into one composition.
 *
 * ⚠️ Below `lg` there is no room for an overlap, so the boxes stack above the
 * picture and stay right-aligned; only the desktop gets the layering.
 *
 * Photo is full-bleed since 29.09.2026 (Almedin: "the same width as the
 * hero") — `.app-bleed` breaks it out of this Section's Container back to
 * 100vw, the same trick DestinationsRail's row uses (`.app-bleed-inset`),
 * just without the inset padding since a photo has no leading card to line
 * up. The text block above stays Container-width and right-aligned exactly
 * as before; only the picture's own width changed, so the overlap still
 * lands the beige lead box over the photo's top edge, just further from that
 * edge now that the photo runs the full viewport instead of 72% of the
 * column. Villa Higuerón replaces the old aerial villa-cluster shot — same
 * trial that briefly stood in for the hero video, kept here instead once
 * Almedin asked for the video back.
 */
const TheClaim = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("claim-eyebrow"));
  const [heading, setHeading] = useState(t("claim-heading"));
  const [lead, setLead] = useState(t("claim-lead"));
  const [image, setImage] = useState<string | undefined>(claimImage);

  useEffect(() => {
    setEyebrow(t("claim-eyebrow"));
    setHeading(t("claim-heading"));
    setLead(t("claim-lead"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <Section size="md">
      {/* z-10 lifts the words above the photograph they overlap. */}
      <div className="relative z-10 ml-auto text-right lg:w-[56%]">
        <EditableText
          id="claim-eyebrow"
          value={eyebrow}
          onChange={setEyebrow}
          as="p"
          className="t-tag text-accent-strong"
        >
          {eyebrow}
        </EditableText>

        {/* The heading is one editable string with a line break in it; the
            children draw it as two labels, the editor still edits one string. */}
        <EditableText
          id="claim-heading"
          value={heading}
          onChange={setHeading}
          as="h2"
          className="t-section text-balance mt-3"
        >
          {heading.split("\n").map((line, index) => (
            <span
              key={index}
              className={cn(
                "block w-fit ml-auto px-4 py-2.5",
                index > 0 && "mt-2",
                index % 2 === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              )}
            >
              {line}
            </span>
          ))}
        </EditableText>

        <EditableText
          id="claim-lead"
          value={lead}
          onChange={setLead}
          as="p"
          className="t-body text-quiet-foreground bg-quiet shadow-elegant p-md mt-md ml-auto max-w-[34rem]"
        >
          {lead}
        </EditableText>
      </div>

      {/* Pulled up under the lead box on desktop so the two overlap.
          `app-bleed` takes it out to the full viewport width — see the file
          comment for why, and why the overlap still works at this width. */}
      <div className="relative app-bleed mt-md lg:mt-[-7rem]">
        <MediaFrame
          id="claim-image"
          src={image}
          onChange={setImage}
          alt="Villa Higuerón — the stairwell's angled glass over the pool"
          note="We take it on — Villa Higuerón's stairwell glass over the pool, full width"
          aspect="wide"
        />
        {/* Not black, and not on the frame itself: --ink is the palette's
            darkest green, so the photograph dims without going grey, and the
            overlay is a sibling so a placeholder frame is dimmed too. */}
        <div className="absolute inset-0 bg-ink/30 pointer-events-none" aria-hidden="true" />
      </div>
    </Section>
  );
};

export default TheClaim;
