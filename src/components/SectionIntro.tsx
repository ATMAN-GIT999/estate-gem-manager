import { useState } from "react";
import { cn } from "@/lib/utils";
import EditableText from "./admin/EditableText";

/**
 * The one section header every block on the landing page uses: a small
 * all-caps eyebrow, a headline that is a whole sentence rather than a noun
 * label, and one guiding line underneath.
 *
 * It exists so the page reads as one voice. Before this, each section invented
 * its own header — different sizes, some with a pill badge, some with a lead
 * paragraph, some without — and the scroll felt like five pages stitched
 * together rather than one argument.
 *
 * `tone` picks the palette: "light" for the beige and card surfaces, "primary"
 * for the sage-green bands, where gold text has to switch to the lighter
 * `accent-on-primary` variant to stay legible.
 */
export type SectionTone = "light" | "primary";

interface SectionIntroProps {
  /** Prefix for the three EditableText ids: `${idPrefix}-eyebrow` etc. */
  idPrefix: string;
  eyebrow: string;
  heading: string;
  lead?: string;
  tone?: SectionTone;
  align?: "center" | "left";
  className?: string;
}

const SectionIntro = ({
  idPrefix,
  eyebrow,
  heading,
  lead,
  tone = "light",
  align = "center",
  className,
}: SectionIntroProps) => {
  const [eyebrowText, setEyebrowText] = useState(eyebrow);
  const [headingText, setHeadingText] = useState(heading);
  const [leadText, setLeadText] = useState(lead ?? "");

  const onPrimary = tone === "primary";

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "",
        className
      )}
    >
      <EditableText
        id={`${idPrefix}-eyebrow`}
        value={eyebrowText}
        onChange={setEyebrowText}
        as="span"
        className={cn(
          "block t-meta mb-4",
          onPrimary ? "text-accent-on-primary" : "text-accent-strong"
        )}
      >
        {eyebrowText}
      </EditableText>

      <EditableText
        id={`${idPrefix}-heading`}
        value={headingText}
        onChange={setHeadingText}
        as="h2"
        className={cn(
          "t-section text-balance",
          onPrimary ? "text-primary-foreground" : "text-primary"
        )}
      >
        {headingText}
      </EditableText>

      {lead !== undefined && (
        <EditableText
          id={`${idPrefix}-lead`}
          value={leadText}
          onChange={setLeadText}
          as="p"
          multiline
          className={cn(
            "mt-5 t-body",
            onPrimary ? "text-primary-foreground/80" : "text-foreground/70",
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {leadText}
        </EditableText>
      )}
    </div>
  );
};

export default SectionIntro;
