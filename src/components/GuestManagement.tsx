import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Shield, Key, Clock, BookOpen, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack } from "./layout";

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
const GuestManagement = () => {
  const [guestTitle, setGuestTitle] = useState("It's in the details.");
  const [guestDesc, setGuestDesc] = useState("From the moment you book to the morning you leave, the same team that looks after the home looks after you — and you can reach us at any hour.");
  const [guestBadge, setGuestBadge] = useState("Every stay, looked after");
  const [contactBtnText, setContactBtnText] = useState("Contact us");

  const [guestManagement, setGuestManagement] = useState([
    { icon: "Shield", title: "Confirmed by a person", description: "Every booking is reviewed by someone on our team before it's confirmed — which is also why these homes stay in the condition you'd want to arrive to." },
    { icon: "Key", title: "Self check-in", description: "Arrive when it suits you. Your personal key-box code reaches you before you travel, so there's no handover to wait around for." },
    { icon: "Clock", title: "24/7 availability", description: "Message us at any hour and a real person answers — the same people who manage the home you're staying in, not an outsourced line." },
    { icon: "BookOpen", title: "Your guide to the home", description: "A handbook written for the place you've booked: the Wi-Fi code, how everything works, and the spots nearby we'd send a friend to." },
  ]);

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

        {/* Was `/book` — a hardcoded mockup page with four fictional
            properties, no real Guesty data behind it (deleted, see
            docs/DECISIONS.md). "Contact us" leading there was already the
            wrong destination for its own label; there is no dedicated guest
            contact page on this site, so `/properties` is the honest next
            step for someone reading this section and wanting to act on it. */}
        <div>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-soft px-8 py-6 text-base"
          >
            <Link to="/properties">
              <EditableText id="pm-contact-btn-2" value={contactBtnText} onChange={setContactBtnText} as="span">{contactBtnText}</EditableText>
            </Link>
          </Button>
        </div>
      </Stack>
    </Section>
  );
};

export default GuestManagement;
