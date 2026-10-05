import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTrackEvent } from "@/hooks/use-track-event";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/lib/supabaseClient";
import { whatsAppEnquiryUrl, type MidtermListing } from "@/lib/winterRentals";

/**
 * The enquiry form on a winter rental page. It writes to `midterm_requests`,
 * not `contacts` — see the migration for why. Nothing is booked or charged
 * here: Frontier confirms by hand, then sends the payment link.
 *
 * No `.select()` on the insert, for the same reason as the owner form: visitors
 * have no SELECT policy, so asking for the row back would turn a successful
 * write into an error.
 */
/**
 * Emails Frontier through Web3Forms. It is called from the browser on purpose:
 * Web3Forms' free plan refuses server-side calls, and the key is meant to be
 * public (it only lets someone send a form mail to the address it was created
 * for). That is also why the enquiry itself is stored in Supabase first — this
 * mail is a notification, never the record. The key comes from the build
 * environment (VITE_WEB3FORMS_ACCESS_KEY, set in Netlify); without it nothing
 * is sent and the admin list is the only place the enquiry shows up.
 */
const notifyFrontier = async (d: {
  home: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  moveIn: string;
  months: string;
  guests: string;
  message: string;
}) => {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return;
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Winter rental enquiry: ${d.home} (${d.name})`,
        from_name: "Frontier Residences website",
        // `email` is what Web3Forms uses as reply-to, so "Reply" goes to the guest.
        name: d.name,
        email: d.email,
        home: `${d.home} — ${d.location}`,
        phone: d.phone || "-",
        move_in: d.moveIn || "-",
        months: d.months || "-",
        guests: d.guests || "-",
        message: d.message || "-",
        botcheck: "",
      }),
    });
    if (!res.ok) console.warn("Enquiry mail not sent:", res.status);
  } catch (err) {
    console.warn("Enquiry mail not sent:", err);
  }
};

const WinterEnquiryForm = ({ home }: { home: MidtermListing }) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const track = useTrackEvent();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    // One field, like the reference card (costasolvillas.com) and the field
    // list Almedin gave — not split first/last. Stored whole in `first_name`;
    // `last_name` is nullable precisely for this (see the migration).
    name: "",
    email: "",
    phone: "",
    desiredFrom: home.available_from ?? "",
    desiredMonths: String(home.min_stay_months ?? ""),
    guests: "",
    message: "",
    // Honeypot: a real visitor never sees or fills it; a bot that fills every
    // field does, and the enquiry is then dropped silently.
    website: "",
  });

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const schema = z.object({
    name: z.string().trim().min(1, t("wr-form-error-name")).max(150),
    email: z.string().trim().email(t("wr-form-error-email")).max(255),
    phone: z.string().trim().max(40),
    message: z.string().trim().max(2000),
  });

  const toInt = (v: string, min: number, max: number) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) || n < min || n > max ? null : n;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: t("wr-form-error-title"),
        description: parsed.error.issues[0]?.message,
      });
      return;
    }
    if (form.website) {
      setSent(true);
      return;
    }

    setSubmitting(true);
    // The id is made here because visitors cannot read the row back; the notify
    // function needs it to find the enquiry.
    const id = crypto.randomUUID();
    const { error } = await supabase.from("midterm_requests").insert({
      id,
      listing_id: home.id,
      listing_name: home.name,
      first_name: parsed.data.name,
      last_name: null,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      desired_from: form.desiredFrom || null,
      desired_months: toInt(form.desiredMonths, 1, 24),
      guests: toInt(form.guests, 1, 20),
      message: parsed.data.message || null,
    });
    setSubmitting(false);

    if (error) {
      console.error("Winter enquiry insert failed:", error);
      toast({
        variant: "destructive",
        title: t("wr-form-fail-title"),
        description: t("wr-form-fail-desc"),
      });
      return;
    }
    // The enquiry is stored; the mail to Frontier is a courtesy on top. A failure
    // here must not tell the guest their enquiry failed — it is in the admin list.
    void notifyFrontier({
      home: home.name,
      location: home.location,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      moveIn: form.desiredFrom,
      months: form.desiredMonths,
      guests: form.guests,
      message: parsed.data.message,
    });
    // After the enquiry is safely stored; no personal data in analytics.
    void track("winter_enquiry_submitted", { city: home.city_group });
    setSent(true);
  };

  const whatsapp = whatsAppEnquiryUrl(
    t("wr-cta-message").replace("{name}", home.name).replace("{location}", home.location)
  );

  if (sent) {
    return (
      <div className="border-t border-border pt-md mt-md text-center">
        <CheckCircle2 className="h-10 w-10 text-accent-strong mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="t-block text-foreground text-balance">{t("wr-form-sent-heading")}</h2>
        <p className="t-body text-muted-foreground mt-2">{t("wr-form-sent-body")}</p>
      </div>
    );
  }

  return (
    // Price above, enquiry fields directly below in the same Panel — the
    // costasolvillas.com reference card Almedin pointed to (04.10.2026), not
    // a CTA that jumps down to a form further down the page. Single column
    // throughout: this lives in the sticky ~1/3-width Panel next to the
    // gallery, not a full-width page section, so a paired sm:grid-cols-2 row
    // (as OwnerContactForm.tsx uses on the wide property-management page)
    // would squeeze two fields into less room than one has here.
    <form onSubmit={handleSubmit} className="border-t border-border pt-md mt-md" noValidate>
      <h2 className="t-block text-foreground">{t("wr-form-heading")}</h2>
      <p className="t-meta text-muted-foreground mt-1">{t("wr-form-lead")}</p>

      <div className="space-y-3 mt-md">
        <div className="space-y-1">
          <Label htmlFor="wr-name">{t("wr-form-name")}</Label>
          <Input id="wr-name" autoComplete="name" required value={form.name} onChange={update("name")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="wr-email">{t("wr-form-email")}</Label>
          <Input id="wr-email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="wr-phone">{t("wr-form-phone")}</Label>
          <Input id="wr-phone" type="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="wr-from">{t("wr-form-from")}</Label>
          <Input id="wr-from" type="date" value={form.desiredFrom} onChange={update("desiredFrom")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="wr-months">{t("wr-form-months")}</Label>
          <Input id="wr-months" type="number" min={1} max={24} value={form.desiredMonths} onChange={update("desiredMonths")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="wr-guests">{t("wr-form-guests")}</Label>
          <Input id="wr-guests" type="number" min={1} max={20} value={form.guests} onChange={update("guests")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="wr-message">{t("wr-form-message")}</Label>
          <Textarea id="wr-message" rows={3} value={form.message} onChange={update("message")} />
        </div>
      </div>

      {/* Honeypot — off-screen rather than display:none, which some bots skip. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="wr-website">Website</label>
        <input id="wr-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
      </div>

      <button type="submit" disabled={submitting} className="cta-base cta-primary w-full mt-md">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("wr-form-sending")}
          </>
        ) : (
          t("wr-form-submit")
        )}
      </button>

      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 t-meta text-accent-strong hover:underline mt-3"
      >
        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
        {t("wr-form-or-whatsapp")}
      </a>
    </form>
  );
};

export default WinterEnquiryForm;
