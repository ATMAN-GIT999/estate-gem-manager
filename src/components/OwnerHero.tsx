import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import { MediaFrame } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/wf-evaluator-hero.webp";

/**
 * The owner page opens on the calculator, not on a picture.
 *
 * The estimator used to sit on the landing page — owner language on the guest
 * side, which is the one mistake this site is built to avoid. Here it is the
 * hero, but as one button rather than a form: the address field and the
 * bedroom pills that used to sit in this column asked for the same things
 * /evaluate asks for, so an owner answered the same questions twice
 * (Almedin, 21.10.2026). The button goes to /evaluate, which renders the full
 * calculator when it arrives without a property.
 *
 * The result card beside it shows the shape of an answer without claiming
 * one; an empty area would promise nothing and an invented number would be a
 * lie. The real analysis runs on /evaluate (the `analyze-property` edge
 * function).
 */

const OwnerHero = () => {
  const { t, language } = useLocale();

  const [eyebrow, setEyebrow] = useState(t("pmp-hero-eyebrow"));
  const [title, setTitle] = useState(t("pmp-page-title"));
  const [lead, setLead] = useState(t("pmp-page-lead"));
  const [altLine, setAltLine] = useState(t("pmp-hero-alt"));
  const [calcCta, setCalcCta] = useState(t("pmp-hero-calc-cta"));
  const [cardTitle, setCardTitle] = useState(t("ev-card-title"));
  const [image, setImage] = useState<string | undefined>(heroImage);

  useEffect(() => {
    setEyebrow(t("pmp-hero-eyebrow"));
    setTitle(t("pmp-page-title"));
    setLead(t("pmp-page-lead"));
    setAltLine(t("pmp-hero-alt"));
    setCalcCta(t("pmp-hero-calc-cta"));
    setCardTitle(t("ev-card-title"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    // Not a <Section>: the sage band sets its own geometry — a fixed-height
    // two-column split where the right column IS the photograph, with the
    // result card floating centred on top of it.
    <section
      id="property-calculator"
      className="relative bg-primary text-primary-foreground overflow-hidden pt-20 scroll-mt-24"
    >
      {/* ⚠️ Almedin, 02.10.2026 — brought in line with the Lovable "template"
          rebuild (see chat): the text column used to be WIDER than the photo
          (1.12fr vs 1fr), which read as text-led rather than photographic.
          42/58 gives the picture the visual weight a property-management
          hero wants. `min-h` instead of a fixed `h` so a longer DE/ES
          translation can still grow the row instead of being clipped. */}
      <div className="grid lg:grid-cols-[42%_58%] lg:min-h-[680px]">
        {/* Left — the whole argument, and the one field. */}
        <div className="flex flex-col justify-center gap-5 py-xl lg:py-0 pl-[var(--container-gutter)] pr-[var(--container-gutter)] lg:pr-[60px]">
          <EditableText
            id="pmp-hero-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-accent-on-primary"
          >
            {eyebrow}
          </EditableText>

          <EditableText
            id="pmp-page-title"
            value={title}
            onChange={setTitle}
            as="h1"
            className="t-display text-primary-foreground text-balance max-w-[20ch]"
          >
            {title}
          </EditableText>

          <EditableText
            id="pmp-page-lead"
            value={lead}
            onChange={setLead}
            as="p"
            className="t-body text-[18px] text-primary-foreground/[0.82] max-w-[42ch]"
          >
            {lead}
          </EditableText>

          {/* White pill at rest, gold on hover with the arrow sliding in at the
              end (Almedin, 21.10.2026). The arrow's wrapper starts at zero
              width and a negative margin that cancels the flex gap, so the
              label stays centred at rest instead of sitting off-centre next
              to an invisible icon. `focus-visible` mirrors hover so keyboard
              users get the same state. Colours are the tokens — border and
              text only change to the gold pair, never to a new shade. */}
          <Link
            to="/evaluate"
            className="cta-base group mt-1.5 self-start h-14 px-8 bg-background text-foreground border border-foreground/25 hover:bg-accent hover:text-accent-foreground hover:border-accent focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:border-accent"
          >
            <EditableText id="pmp-hero-calc-cta" value={calcCta} onChange={setCalcCta} as="span">
              {calcCta}
            </EditableText>
            <span
              aria-hidden="true"
              className="inline-flex w-0 -ml-[0.5625rem] overflow-hidden opacity-0 transition-all duration-200 ease-out group-hover:w-5 group-hover:ml-0 group-hover:opacity-100 group-focus-visible:w-5 group-focus-visible:ml-0 group-focus-visible:opacity-100"
            >
              <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} />
            </span>
          </Link>

          {/* One colour for the whole line (Lovable reference, 02.10.2026):
              the phone number used to be gold at rest, which made it read as
              a second, competing accent next to the eyebrow and the submit
              button. Gold now only shows up on hover, same as the rest of
              the line's hover state. */}
          <p className="text-sm text-primary-foreground/[0.66]">
            <EditableText id="pmp-hero-alt" value={altLine} onChange={setAltLine} as="span">
              {altLine}
            </EditableText>{" "}
            ·{" "}
            <a href="tel:+34649429678" className="transition-colors hover:text-accent-on-primary">
              +34 649 429 678
            </a>
          </p>
        </div>

        {/* Right — the photograph, with the result card centred on it. The
            card promises a shape and does not claim a number: an empty area
            would promise nothing, an invented figure would be a lie. The real
            number comes from /evaluate. */}
        {/* No padding here any more (Almedin, 02.10.2026): it used to inset
            the photo from all four edges, which read as a framed picture in
            a box rather than the true full-bleed photographic half the
            Lovable template uses. MediaFrame's `fill` now reaches the
            section's actual edges; the estimate card still centres on it via
            `place-items-center`. */}
        <div className="relative grid place-items-center min-h-[22rem] lg:min-h-0">
          <MediaFrame
            id="pmp-hero-image"
            src={image}
            onChange={setImage}
            alt="An infinity pool on the terrace of a managed villa, looking out over the sea"
            note="Owner hero — infinity pool over the sea"
            onPrimary
            fill
            priority
          />

          <div className="relative w-[330px] max-w-full bg-background text-foreground rounded-md px-8 pt-[30px] pb-[34px] shadow-[0_12px_40px_-10px_hsl(var(--ink)/0.4)]">
            <EditableText
              id="ev-card-title"
              value={cardTitle}
              onChange={setCardTitle}
              as="p"
              className="t-block text-center mb-[18px]"
            >
              {cardTitle}
            </EditableText>

            <p className="border border-border rounded-sm py-4 text-center tracking-[0.45em] text-muted-foreground font-mono">
              — — — —
            </p>

            {/* Out of focus on purpose: it is the shape of an answer, not an
                answer. Dropped on a phone, where the hero is already the
                tallest thing on the screen. */}
            <div
              className="hidden sm:flex items-end gap-[7px] h-[92px] mt-[22px] blur-[3px] opacity-50"
              aria-hidden="true"
            >
              {[38, 62, 80, 46, 70, 94, 84, 52].map((h, i) => (
                <span
                  key={i}
                  className={cn("flex-1", i === 5 ? "bg-accent" : "bg-primary")}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnerHero;
