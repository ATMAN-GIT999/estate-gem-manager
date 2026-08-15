import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CalendarClock, CheckCircle2, Loader2 } from "lucide-react";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";
import { Container, Section } from "./layout";
import ownerFormImage from "@/assets/about-hero.webp";

/**
 * Provisional — Frontier has no Cal.com/Calendly of its own yet (see
 * docs/open-todos.md, point 5). This is Almedin's own booking link, standing
 * in until the client provides theirs; swap the href when that arrives.
 */
const VIDEO_CALL_URL = "https://cal.com/almedin-sinanovic-ff4chx/videocall-mit-mir";

/**
 * The close of the owner page, and the destination of the hero button.
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

const OwnerContactForm = () => {
  const { toast } = useToast();
  const [heading, setHeading] = useState("Less hassle, higher income, protected value.");
  const [lead, setLead] = useState("Tell us about your property and we'll come back to you with what managing it with us would look like — usually within one working day.");
  const [ctaText, setCtaText] = useState("Send enquiry");
  const [callCtaText, setCallCtaText] = useState("Book a video call");
  const [sentHeading, setSentHeading] = useState("Thank you — we have your details.");
  const [sentBody, setSentBody] = useState("One of the founders will read this personally and come back to you within one working day.");
  const [formImage, setFormImage] = useState(ownerFormImage);

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
        title: "Check your details",
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
        title: "We could not send that",
        description: `Please email us directly at ${CONTACT_EMAIL} — we don't want to lose your enquiry.`,
      });
      return;
    }

    setSent(true);
  };

  return (
    <Section id="owner-contact" size="none" bleed className="pt-md">
      <Container>
        {sent ? (
          <div className="max-w-2xl mx-auto text-center pb-xl">
            <CheckCircle2 className="w-12 h-12 text-accent-strong mx-auto mb-6" strokeWidth={1.5} />
            <EditableText
              id="owner-form-sent-heading"
              value={sentHeading}
              onChange={setSentHeading}
              as="h2"
              className="t-section text-primary mb-4 text-balance"
            >
              {sentHeading}
            </EditableText>
            <EditableText
              id="owner-form-sent-body"
              value={sentBody}
              onChange={setSentBody}
              as="p"
              multiline
              className="t-body text-foreground/70"
            >
              {sentBody}
            </EditableText>
          </div>
        ) : (
          /* True edge-to-edge photo, cropped into the section and darkened
             at the edges so text stays legible over it — the form sits on
             top as its own light card, a small window rather than a column
             fighting the image for space.

             `w-screen` plus the calc() margins is the standard full-bleed
             trick: it pulls the block out to the viewport edges regardless
             of how wide its parent `container` is, at every breakpoint —
             unlike a plain negative margin, which only has room to work
             once the container itself stops being 100% of the viewport.
             Square corners here on purpose: the gold top/bottom edge is
             meant to read as one continuous line flush with the browser
             edge, not a rounded card floating mid-screen.

             Gold top and bottom only — no side bars. Two horizontal lines
             read as an architectural datum across the page; a full frame
             around a full-bleed photo just reads as a border.

             The band is shorter than it was (640px → a clamp topping out at
             560px): §7 asks for the media to support the composition rather
             than own the screen, and that applies to the owner page's opening
             image as much as to the video on the landing page. */
          <div className="relative app-bleed py-2.5 md:py-3.5 bg-gradient-to-r from-accent-strong via-accent to-accent-strong shadow-2xl">
            <div className="relative overflow-hidden min-h-[clamp(30rem,52vh,35rem)] flex items-center justify-center md:justify-end">
              <EditableImage
                id="owner-form-image"
                src={formImage}
                alt="A Frontier Residences managed property"
                onChange={setFormImage}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* `scrim`, not black — the palette's dark green (see the token
                  in tailwind.config.ts and §10). */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-scrim/55 to-transparent pointer-events-none" aria-hidden="true" />
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-scrim/55 to-transparent pointer-events-none" aria-hidden="true" />

              {/* The form column stops at the container's right edge instead
                  of a hard 4rem, so it lines up with every other section on
                  the page rather than sitting at its own inset.

                  MARGIN, not padding. As `pr-[var(--container-inset)]` the
                  inset was subtracted from `max-w-md` instead of sitting
                  outside it: on a 2053px screen that is 354px of the panel's
                  448px, which left the form 29px wide and stretched the photo
                  band to 2181px tall to fit it. */}
              <div className="relative z-10 w-full max-w-md mx-sm my-md md:mr-[var(--container-inset)] md:ml-0">
                <div className="bg-muted/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="mb-sm">
                  <EditableText
                    id="owner-form-heading"
                    value={heading}
                    onChange={setHeading}
                    as="h2"
                    className="t-block text-primary mb-3 text-balance"
                  >
                    {heading}
                  </EditableText>
                  <EditableText
                    id="owner-form-lead"
                    value={lead}
                    onChange={setLead}
                    as="p"
                    multiline
                    className="t-body text-foreground/70"
                  >
                    {lead}
                  </EditableText>
                </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="owner-first-name">First name *</Label>
                    <Input
                      id="owner-first-name"
                      value={form.firstName}
                      onChange={update("firstName")}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-last-name">Last name</Label>
                    <Input
                      id="owner-last-name"
                      value={form.lastName}
                      onChange={update("lastName")}
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Email *</Label>
                    <Input
                      id="owner-email"
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-phone">Phone</Label>
                    <Input
                      id="owner-phone"
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-address">Where is the property? *</Label>
                  <Input
                    id="owner-address"
                    value={form.propertyAddress}
                    onChange={update("propertyAddress")}
                    placeholder="Marbella, Málaga, Vienna…"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-message">Anything we should know?</Label>
                  <Textarea
                    id="owner-message"
                    value={form.message}
                    onChange={update("message")}
                    rows={4}
                    placeholder="Size, current use, whether it is already rented out…"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant py-6 text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending…
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
                    className="flex-1 border-primary/30 text-primary hover:bg-primary/5 py-6 text-base"
                  >
                    <a href={VIDEO_CALL_URL} target="_blank" rel="noopener noreferrer">
                      <CalendarClock className="w-5 h-5 mr-2" />
                      <EditableText id="owner-form-call-btn" value={callCtaText} onChange={setCallCtaText} as="span">
                        {callCtaText}
                      </EditableText>
                    </a>
                  </Button>
                </div>

                <p className="t-meta text-muted-foreground text-center">
                  We use your details to answer your enquiry, nothing else. You can also reach us at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-strong hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default OwnerContactForm;
