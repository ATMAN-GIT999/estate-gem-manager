import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import AddressAutocomplete from "./AddressAutocomplete";
import { MediaFrame } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTrackEvent } from "@/hooks/use-track-event";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/wf-evaluator-hero.webp";

/**
 * The owner page opens on the calculator, not on a picture.
 *
 * The estimator used to sit on the landing page — owner language on the guest
 * side, which is the one mistake this site is built to avoid — and asked for
 * six fields in a card before it would do anything. Here it is the hero, and
 * only ever ONE field is visible at a time: the address, and then, once an
 * address exists, the bedrooms. The result card beside it shows the shape of
 * an answer without claiming one; an empty area would promise nothing and an
 * invented number would be a lie.
 *
 * Submitting still hands off to /evaluate, which is where the real analysis
 * runs (the `analyze-property` edge function). The card here is the promise,
 * not the calculation.
 */

const BEDROOM_CHOICES = ["2", "3", "4", "5", "6"] as const;

const OwnerHero = () => {
  const { t, language } = useLocale();
  const navigate = useNavigate();
  const { user } = useAuth();
  const track = useTrackEvent();

  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const [eyebrow, setEyebrow] = useState(t("pmp-hero-eyebrow"));
  const [title, setTitle] = useState(t("pmp-page-title"));
  const [lead, setLead] = useState(t("pmp-page-lead"));
  const [altLine, setAltLine] = useState(t("pmp-hero-alt"));
  const [cardTitle, setCardTitle] = useState(t("ev-card-title"));
  const [image, setImage] = useState<string | undefined>(heroImage);

  useEffect(() => {
    setEyebrow(t("pmp-hero-eyebrow"));
    setTitle(t("pmp-page-title"));
    setLead(t("pmp-page-lead"));
    setAltLine(t("pmp-hero-alt"));
    setCardTitle(t("ev-card-title"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  /** State B — the second field appears only once there is an address. */
  const hasAddress = address.trim().length > 3;
  // State C only starts once both fields are answered — a silently invented
  // bedroom count would be exactly the kind of made-up number DECISIONS.md
  // §38 already ruled out for prices ("a made-up figure is worse than a lost
  // lead"). The arrow button stays disabled until both are true.
  const canSubmit = hasAddress && bedrooms !== "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Counted here, at the moment of asking — /evaluate then decides whether
    // an answer comes back. `signed_in` is there because it does not for most
    // owners: Evaluate.tsx sends anyone without an account to /auth, and this
    // is how many were stopped there (compare evaluator_result_viewed).
    void track("evaluator_submitted", { entry: "owner-hero", signed_in: Boolean(user) });
    // The six fields /evaluate needs are asked for there; the two that decide
    // the answer are asked for here, so the hero stays one field deep.
    // Bathrooms/type/size/guests are left unset rather than guessed —
    // Evaluate.tsx and the edge function both already treat a missing value
    // as "not specified" instead of a fact.
    navigate("/evaluate", {
      state: { propertyData: { address, bedrooms } },
    });
  };

  return (
    // Not a <Section>: the sage band sets its own geometry — a fixed-height
    // two-column split where the right column IS the photograph, with the
    // result card floating centred on top of it.
    <section className="relative bg-primary text-primary-foreground overflow-hidden pt-20">
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

          <form onSubmit={submit} className="mt-1.5 max-w-[470px]">
            {/* State A — one field. The pill is the field: the Input inside
                loses its own border, fill and ring so the two do not read as
                a box in a box. Its left padding stays, because
                AddressAutocomplete puts a pin icon there.

                ⚠️ Almedin, 29.09.2026 — two bugs fixed here:
                (1) `[&_input]:focus-visible:ring-0` put `:focus-visible` on
                THIS div, not on the input — a plain div never matches it, so
                the override was dead and the Input's own default ring
                (`--ring`, a dark sage) showed in full on focus, reading as a
                stray black outline. The pseudo-class has to sit inside the
                bracket, on the actual target: `[&_input:focus-visible]`.
                (2) Nothing set the input's text colour, so it inherited
                `text-primary-foreground` (white) from this section's own
                text colour — white text and a white caret on the white pill,
                invisible while typing. `[&_input]:text-foreground` fixes it.

                ⚠️ Almedin, 02.10.2026 — third bug: `overflow-hidden` here was
                clipping AddressAutocomplete's own suggestion dropdown (an
                absolutely-positioned child), not just squaring off the accent
                button's corners it was added for — so Nominatim's results came
                back (visible in the network tab) but never appeared on screen.
                The pill shape no longer depends on clipping its children:
                the button gets its own `rounded-r-full` to cap the right
                edge, and the left side was already transparent, so it needs
                no rounding of its own — the parent's `rounded-full` background
                shows through underneath either way. */}
            <div className="flex items-stretch bg-background rounded-full">
              <div className="flex-1 min-w-0 flex items-center pl-4 [&_input]:border-0 [&_input]:bg-transparent [&_input]:h-[58px] [&_input]:text-base [&_input]:text-foreground [&_input]:shadow-none [&_input:focus-visible]:ring-0 [&_input:focus-visible]:ring-offset-0 [&_svg]:text-accent-strong">
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  placeholder={t("ev-address-placeholder")}
                />
              </div>
              <button
                type="submit"
                aria-label={t("ev-address-placeholder")}
                // Stays disabled through State B too — it only goes live once
                // a bedroom count is actually picked, not the moment State B
                // appears, so the pills read as required rather than optional.
                // No more `disabled:opacity-45` (Almedin, 29.09.2026): the
                // gold read as grayed-out/broken rather than "not yet" —
                // `disabled` still blocks the actual click.
                disabled={!canSubmit}
                className="shrink-0 w-[60px] rounded-r-full bg-accent text-accent-foreground inline-flex items-center justify-center"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            {/* State B — the bedrooms appear only now. */}
            {hasAddress && (
              <div className="mt-4 animate-fade-in">
                <p className="t-tag text-primary-foreground/70 mb-2">{t("ev-bedrooms-label")}</p>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_CHOICES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setBedrooms(n)}
                      className={cn(
                        "h-9 min-w-9 px-3 rounded-full border text-[15px] transition-colors",
                        bedrooms === n
                          ? "bg-accent border-accent text-accent-foreground"
                          : "border-primary-foreground/30 text-primary-foreground hover:border-primary-foreground/60"
                      )}
                    >
                      {n === "6" ? "6+" : n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          <p className="text-sm text-primary-foreground/[0.66]">
            <EditableText id="pmp-hero-alt" value={altLine} onChange={setAltLine} as="span">
              {altLine}
            </EditableText>{" "}
            ·{" "}
            <a href="tel:+34649429678" className="text-accent-on-primary hover:underline">
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
