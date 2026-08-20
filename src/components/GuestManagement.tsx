import { useEffect, useState } from "react";
import { Users, Shield, Key, Clock, BookOpen, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/**
 * Lifted out of PropertyManagement, where it was the middle of three pillars,
 * because it belongs in front of guests rather than owners: it is the answer to
 * "who looks after me once I have booked".
 *
 * The copy is written to the guest, in the second person. It previously spoke
 * over their head to the owner — "your guests can contact us", and a screening
 * card about keeping unwanted guests out, which on a booking page a reader
 * applies to themselves. Every item states the same fact as before from the
 * side of the person reading it.
 *
 * Structurally this was the site's densest surviving box: a `<Card>` on a
 * gradient, holding four more translucent cards with borders, each with a hover
 * state. §25 and the project's own "fewer boxes" rule both land on the same
 * answer — the green band already separates this from the page, so the items
 * on it need a hairline and space, not four more frames.
 */
const ITEM_ICONS = ["Shield", "Key", "Clock", "BookOpen"];

const GuestManagement = () => {
  const { t, language } = useLocale();
  const [guestTitle, setGuestTitle] = useState(t("pm-guest-title"));
  const [guestDesc, setGuestDesc] = useState(t("pm-guest-desc"));
  const [guestBadge, setGuestBadge] = useState(t("pm-guest-badge"));
  const [contactBtnText, setContactBtnText] = useState(t("pm-contact-btn-2"));

  const buildItems = () =>
    ITEM_ICONS.map((icon, i) => ({
      icon,
      title: t(`pm-guest-title-${i}` as TranslationKey),
      description: t(`pm-guest-desc-${i}` as TranslationKey),
    }));

  const [guestManagement, setGuestManagement] = useState(buildItems());

  useEffect(() => {
    setGuestTitle(t("pm-guest-title"));
    setGuestDesc(t("pm-guest-desc"));
    setGuestBadge(t("pm-guest-badge"));
    setContactBtnText(t("pm-contact-btn-2"));
    setGuestManagement(buildItems());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const iconMap: Record<string, any> = { Users, Shield, Key, Clock, BookOpen, Package };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...guestManagement];
    updated[index] = { ...updated[index], [field]: value };
    setGuestManagement(updated);
  };

  return (
    <Section tone="primary" size="md" edge="both">
      <Stack gap="lg">
        <div className="max-w-3xl space-y-sm">
          {/* Was a filled gold pill. An eyebrow says the same thing in the
              typography the rest of the site already uses for it. */}
          <EditableText
            id="pm-guest-badge"
            value={guestBadge}
            onChange={setGuestBadge}
            as="span"
            className="block t-meta text-accent-on-primary"
          >
            {guestBadge}
          </EditableText>
          <EditableText id="pm-guest-title" value={guestTitle} onChange={setGuestTitle} as="h2" className="t-section text-primary-foreground text-balance">{guestTitle}</EditableText>
          <EditableText id="pm-guest-desc" value={guestDesc} onChange={setGuestDesc} as="p" multiline className="t-body text-primary-foreground/85">{guestDesc}</EditableText>
        </div>

        <Grid cols={4}>
          {guestManagement.map((item, index) => {
            const Icon = iconMap[item.icon] || Package;
            return (
              <div key={index} className="border-t border-primary-foreground/20 pt-sm">
                <Icon className="w-6 h-6 text-accent-on-primary mb-sm" strokeWidth={1.5} />
                <EditableText id={`pm-guest-title-${index}`} value={item.title} onChange={(v) => updateItem(index, "title", v)} as="h3" className="t-item text-primary-foreground mb-xs">{item.title}</EditableText>
                <EditableText id={`pm-guest-desc-${index}`} value={item.description} onChange={(v) => updateItem(index, "description", v)} as="p" className="t-body text-primary-foreground/75">{item.description}</EditableText>
              </div>
            );
          })}
        </Grid>

        {/* Was `/properties` (see docs/DECISIONS.md §32 for the `/book`
            history before that) — Almedin asked "Contact us" to lead to the
            actual contact form, and `#get-in-touch` on the PM page is the
            only one that exists on this site. It asks for a property
            address as a required field, which is an owner's question, not a
            guest's — flagged in the same decision entry rather than silently
            fixed, since the right answer (a separate guest enquiry form) is
            a bigger piece of work than a link change. */}
        <div>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-soft px-8 py-6 text-base"
          >
            <a href="/property-management#get-in-touch">
              <EditableText id="pm-contact-btn-2" value={contactBtnText} onChange={setContactBtnText} as="span">{contactBtnText}</EditableText>
            </a>
          </Button>
        </div>
      </Stack>
    </Section>
  );
};

export default GuestManagement;
