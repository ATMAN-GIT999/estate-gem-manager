import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CalendarClock, CheckCircle2, Loader2 } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Container, MediaFrame, Section } from "./layout";
import losMonterosRelax from "@/assets/los-monteros-relax.webp";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Provisional — Frontier has no Cal.com/Calendly of its own yet (see
 * docs/PROJECT.md §6, B4). This is Almedin's own booking link, standing
 * in until the client provides theirs; swap the href when that arrives.
 */
const VIDEO_CALL_URL = "https://cal.com/almedin-sinanovic-ff4chx/videocall-mit-mir";

/**
 * The close of the owner page, and the destination of every "Contact Us" on it.
 *
 * It replaces a `mailto:` link. A mail link looks like an action and is not
 * one: it hands the reader an empty compose window and loses everyone browsing
 * without a mail client configured, which on a phone is most of them.
 *
 * Six fields, four of them required. Every field on a lead form costs
 * completions, so this asks for what a first conversation actually needs — who
 * you are, how to reach you, and which property — and leaves the rest for that
 * conversation.
 *
 * It sat directly under the hero until this rebuild, which fixed a real
 * problem (the first call to action used to be section nine of ten) by opening
 * a page about a €3–8M asset with a data-entry task. It is section nine again
 * — but the hero, the About section and the header now all point down here, so
 * the form is one click away from the first screen rather than eight sections
 * of scrolling. docs/DECISIONS.md carries the reasoning; read it before moving
 * this back up.
 *
 * The failure path shows the email address rather than a generic apology: a
 * lead that cannot be stored must still have somewhere to go.
 */
const CONTACT_EMAIL = "Hello@frontier-residences.com";

/**
 * The deployed policy "Anyone can submit a consultation request" ends in
 * `source = 'consultation-booking'` and accepts nothing else, so both public
 * forms share the value. `metadata.submitted_from` is what tells them apart in
 * the CRM — widen the policy and this can become its own source.
 */
const LEAD_SOURCE = "consultation-booking";

const enquirySchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(100),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{6,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  propertyAddress: z.string().trim().min(1, "Please tell us where the property is").max(300),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

/**
 * Fields on the sage-green fill.
 *
 * shadcn's Input defaults to `bg-background` with a light border, which on
 * this band is a row of beige slabs. Filled at low opacity with a lightened
 * border keeps them unmistakably fields — the mockup's underline-only
 * treatment looks better in a screenshot and is worse to fill in, and this is
 * the warmest lead the site produces.
 */
const FIELD_CLASS =
  "bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent-on-primary";
const LABEL_CLASS = "text-primary-foreground/80";

const OwnerContactForm = () => {
  const { toast } = useToast();
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("owner-form-eyebrow"));
  /* "We manage while you relax." and its photo both moved down from the
     standalone `PropertyManagement` section, which is retired (see
     docs/DECISIONS.md §15) — that section's whole job was to be a single
     quiet exhale between Proof and the rest of the page, and folding it into
     the form it now sits directly above does that with one section instead
     of two. "Less hassle, higher income." is gone, not just relocated: it
     said plainly what the form already goes on to ask for, which "We manage
     while you relax." does not. */
  const [heading, setHeading] = useState(t("pm-section-title"));
  const [lead, setLead] = useState(t("owner-form-lead"));
  const [ctaText, setCtaText] = useState(t("owner-form-btn"));
  const [callCtaText, setCallCtaText] = useState(t("owner-form-call-btn"));
  const [sentHeading, setSentHeading] = useState(t("owner-form-sent-heading"));
  const [sentBody, setSentBody] = useState(t("owner-form-sent-body"));
  // Los Monteros' garden — the same photo the Relax band used before it was
  // retired, not a new one, so nothing about the page's photography changed,
  // only where this particular image sits.
  const [formImage, setFormImage] = useState(losMonterosRelax);

  useEffect(() => {
    setEyebrow(t("owner-form-eyebrow"));
    setHeading(t("pm-section-title"));
    setLead(t("owner-form-lead"));
    setCtaText(t("owner-form-btn"));
    setCallCtaText(t("owner-form-call-btn"));
    setSentHeading(t("owner-form-sent-heading"));
    setSentBody(t("owner-form-sent-body"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyAddress: "",
    message: "",
  });

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: t("owner-form-toast-check-title"),
        description: parsed.error.issues[0]?.message ?? "Please review the form.",
      });
      return;
    }

    setSubmitting(true);
    // No `.select()` on purpose. There is no SELECT policy for visitors, so
    // asking for the row back would turn a successful write into an error.
    const { error } = await supabase.from("contacts").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName || null,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      source: LEAD_SOURCE,
      status: "lead",
      // `property_interest` is a foreign key to an existing listing, not an
      // address — an owner writing in has no row there yet, so the address goes
      // into the notes with the message.
      notes: [
        `Property: ${parsed.data.propertyAddress}`,
        parsed.data.message ? `\n${parsed.data.message}` : "",
      ].join(""),
      metadata: {
        property_address: parsed.data.propertyAddress,
        submitted_from: "property-management",
      },
    });
    setSubmitting(false);

    if (error) {
      console.error("Owner enquiry insert failed:", error);
      toast({
        variant: "destructive",
        title: t("owner-form-toast-fail-title"),
        description: t("owner-form-toast-fail-desc").replace("{email}", CONTACT_EMAIL),
      });
      return;
    }

    setSent(true);
  };

  return (
    <Section id="get-in-touch" size="none" tone="primary" edge="top" bleed>
      {sent ? (
        /* The confirmation replaces the form rather than sitting next to it:
           a filled-in form left on screen invites a second identical send. */
        <Container measure="text" className="text-center py-2xl">
          <CheckCircle2 className="w-12 h-12 text-accent-on-primary mx-auto mb-6" strokeWidth={1.5} />
          <EditableText
            id="owner-form-sent-heading"
            value={sentHeading}
            onChange={setSentHeading}
            as="h2"
            className="t-section text-primary-foreground mb-4 text-balance"
          >
            {sentHeading}
          </EditableText>
          <EditableText
            id="owner-form-sent-body"
            value={sentBody}
            onChange={setSentBody}
            as="p"
            multiline
            className="t-body text-primary-foreground/80"
          >
            {sentBody}
          </EditableText>
        </Container>
      ) : (
        /* Half picture, half form, edge to edge — the bookend to the hero.
           The old treatment put the form in a light card floating on a
           full-bleed photograph; at the top of the page that read as a window
           onto the image, but as the page's closing statement it reads as a
           dialog box. Splitting the band gives the form a side of its own and
           the photograph the other, with the gold seam on top carrying the
           transition into the green exactly as it does above Proof.

           No container and no rounded corners: the two halves are meant to
           meet the browser edge. */
        <div className="grid md:grid-cols-2 items-stretch">
          {/* A minimum height so the picture is still a picture on a phone,
              where it stacks above the form instead of sitting beside it.
              Trimmed with the rest of the band (18rem → 15rem, the same ~10%
              this whole section came down by) rather than left at its old
              size while everything around it shrank. */}
          <div className="relative min-h-[13rem]">
            <MediaFrame
              id="pm-relax-image"
              src={formImage}
              alt="A terrace at one of the managed properties"
              onChange={setFormImage}
              note="Relax — sunlit rooftop terrace, golden hour"
              fill
              onPrimary
            />
          </div>

          {/* Centred in its own half rather than pinned to the split, and a
              measure wider than a form usually gets: against 700-odd px of
              photograph, a 448px column pushed to the left edge leaves the
              right third of the band empty and the two halves stop reading as
              halves.

              py-lg, not py-xl: one step down the spacing ladder (DESIGN.md
              §2) for the ~10% more compact band Almedin asked for — a step on
              the existing ladder rather than an arbitrary new value. */}
          <div className="flex flex-col justify-center px-sm py-lg md:px-lg">
            <div className="w-full max-w-lg mx-auto">
              <div className="mb-md">
                <EditableText
                  id="owner-form-eyebrow"
                  value={eyebrow}
                  onChange={setEyebrow}
                  as="span"
                  className="block t-meta text-accent-on-primary mb-4"
                >
                  {eyebrow}
                </EditableText>
                <EditableText
                  id="pm-section-title"
                  value={heading}
                  onChange={setHeading}
                  as="h2"
                  className="t-section text-primary-foreground mb-3 text-balance"
                >
                  {heading}
                </EditableText>
                <EditableText
                  id="owner-form-lead"
                  value={lead}
                  onChange={setLead}
                  as="p"
                  multiline
                  className="t-body text-primary-foreground/80"
                >
                  {lead}
                </EditableText>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="owner-first-name" className={LABEL_CLASS}>{t("owner-form-first-name")}</Label>
                    <Input
                      id="owner-first-name"
                      value={form.firstName}
                      onChange={update("firstName")}
                      autoComplete="given-name"
                      className={FIELD_CLASS}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-last-name" className={LABEL_CLASS}>{t("owner-form-last-name")}</Label>
                    <Input
                      id="owner-last-name"
                      value={form.lastName}
                      onChange={update("lastName")}
                      autoComplete="family-name"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="owner-email" className={LABEL_CLASS}>{t("owner-form-email")}</Label>
                    <Input
                      id="owner-email"
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      autoComplete="email"
                      className={FIELD_CLASS}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-phone" className={LABEL_CLASS}>{t("owner-form-phone")}</Label>
                    <Input
                      id="owner-phone"
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      autoComplete="tel"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-address" className={LABEL_CLASS}>{t("owner-form-address-label")}</Label>
                  <Input
                    id="owner-address"
                    value={form.propertyAddress}
                    onChange={update("propertyAddress")}
                    placeholder={t("owner-form-address-placeholder")}
                    className={FIELD_CLASS}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-message" className={LABEL_CLASS}>{t("owner-form-message-label")}</Label>
                  <Textarea
                    id="owner-message"
                    value={form.message}
                    onChange={update("message")}
                    rows={4}
                    placeholder={t("owner-form-message-placeholder")}
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold py-6 text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t("owner-form-sending")}
                      </>
                    ) : (
                      <>
                        <EditableText id="owner-form-btn" value={ctaText} onChange={setCtaText} as="span">
                          {ctaText}
                        </EditableText>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    asChild
                    className="flex-1 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground py-6 text-base"
                  >
                    <a href={VIDEO_CALL_URL} target="_blank" rel="noopener noreferrer">
                      <CalendarClock className="w-5 h-5 mr-2" />
                      <EditableText id="owner-form-call-btn" value={callCtaText} onChange={setCallCtaText} as="span">
                        {callCtaText}
                      </EditableText>
                    </a>
                  </Button>
                </div>

                {/* Left, not centred: in this column it runs to three lines,
                    and three centred lines of all-caps is a paragraph nobody
                    reads — which is the opposite of the point of saying it. */}
                <p className="t-meta text-primary-foreground/65">
                  {t("owner-form-privacy-note")}{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-on-primary hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default OwnerContactForm;
