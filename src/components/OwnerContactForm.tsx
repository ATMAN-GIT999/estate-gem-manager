import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import EditableText from "./admin/EditableText";

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
 * ⚠️ Writing here depends on the RLS policy in
 * `20260810211500_owner_enquiries_public_insert.sql`. Until that migration is
 * applied, every submission is rejected. That is why the failure path below
 * shows the email address rather than a generic apology: a lead that cannot be
 * stored must still have somewhere to go.
 */
const CONTACT_EMAIL = "Hello@frontier-residences.com";

/** Must match the WITH CHECK clause of the insert policy exactly. */
const LEAD_SOURCE = "website_owner_form";

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
  const [sentHeading, setSentHeading] = useState("Thank you — we have your details.");
  const [sentBody, setSentBody] = useState("One of the founders will read this personally and come back to you within one working day.");

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
    <section id="owner-contact" className="py-24 md:py-28 bg-gradient-hero scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-accent-strong mx-auto mb-6" strokeWidth={1.5} />
              <EditableText
                id="owner-form-sent-heading"
                value={sentHeading}
                onChange={setSentHeading}
                as="h2"
                className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4 text-balance"
              >
                {sentHeading}
              </EditableText>
              <EditableText
                id="owner-form-sent-body"
                value={sentBody}
                onChange={setSentBody}
                as="p"
                multiline
                className="text-lg text-foreground/70 leading-relaxed"
              >
                {sentBody}
              </EditableText>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <EditableText
                  id="owner-form-heading"
                  value={heading}
                  onChange={setHeading}
                  as="h2"
                  className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4 text-balance"
                >
                  {heading}
                </EditableText>
                <EditableText
                  id="owner-form-lead"
                  value={lead}
                  onChange={setLead}
                  as="p"
                  multiline
                  className="text-lg text-foreground/70 leading-relaxed"
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

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant py-6 text-base"
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

                <p className="text-xs text-muted-foreground text-center">
                  We use your details to answer your enquiry, nothing else. You can also reach us at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-strong hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OwnerContactForm;
