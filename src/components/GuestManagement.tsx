import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Shield, Key, Clock, BookOpen, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";

/**
 * Lifted out of PropertyManagement, where it was the middle of three pillars,
 * because it belongs in front of guests rather than owners: it is the answer to
 * "who looks after me once I have booked".
 *
 * ⚠️ The copy still addresses the owner — "your guests can contact us", and a
 * screening card written as keeping unwanted guests out. On the booking page a
 * guest reads that about themselves. The text needs a pass before this section
 * is considered finished; the move itself is deliberate, the wording is not.
 *
 * The two "→ Listing management" / "→ Property management" cross-links from the
 * original are dropped: they pointed at sibling pillars that now live on the PM
 * page, so they would dangle here.
 */
const GuestManagement = () => {
  const [guestTitle, setGuestTitle] = useState("Guest management");
  const [guestDesc, setGuestDesc] = useState("We ensure satisfied guests and provide support whenever needed. Your guests can contact us 24/7 with any questions or problems.");
  const [guestBadge, setGuestBadge] = useState("Stays that impress");
  const [contactBtnText, setContactBtnText] = useState("→ Contact us");

  const [guestManagement, setGuestManagement] = useState([
    { icon: "Shield", title: "Guest screening", description: "Before a booking is accepted, we review the terms and conditions to avoid unwanted guests." },
    { icon: "Key", title: "Self check-in", description: "Guests receive a personal code to retrieve the key to your home from a key box." },
    { icon: "Clock", title: "24/7 availability", description: "If guests have any questions, they can contact us at any time. We are responsible for all communication with guests." },
    { icon: "BookOpen", title: "Survival guide", description: "A customized handbook will be created to guide guests during their stay. This will include any house rules, Wi-Fi code and activities nearby." },
  ]);

  const iconMap: Record<string, any> = { Users, Shield, Key, Clock, BookOpen, Package };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...guestManagement];
    updated[index] = { ...updated[index], [field]: value };
    setGuestManagement(updated);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-beige via-background to-beige-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-primary border-none shadow-elegant overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-8">
                <div className="bg-accent rounded-full p-3">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="bg-accent text-accent-foreground px-6 py-2 rounded-full inline-block mb-4 font-semibold">
                    <EditableText id="pm-guest-badge" value={guestBadge} onChange={setGuestBadge} as="span">{guestBadge}</EditableText>
                  </div>
                </div>
              </div>

              {/* h2, not the h3 it was inside the three-pillar group: this is now
                  the section's own heading rather than one of three sub-heads. */}
              <EditableText id="pm-guest-title" value={guestTitle} onChange={setGuestTitle} as="h2" className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-6">{guestTitle}</EditableText>
              <EditableText id="pm-guest-desc" value={guestDesc} onChange={setGuestDesc} as="p" multiline className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">{guestDesc}</EditableText>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {guestManagement.map((item, index) => {
                  const Icon = iconMap[item.icon] || Package;
                  return (
                    <div key={index} className="bg-card/10 backdrop-blur-sm rounded-lg p-6 hover:bg-card/20 transition-all duration-300 animate-fade-in border border-primary-foreground/20" style={{ animationDelay: `${index * 100}ms` }}>
                      <Icon className="w-10 h-10 text-accent-on-primary mb-4" />
                      <EditableText id={`pm-guest-title-${index}`} value={item.title} onChange={(v) => updateItem(index, "title", v)} as="h3" className="text-lg font-semibold text-primary-foreground mb-2">{item.title}</EditableText>
                      <EditableText id={`pm-guest-desc-${index}`} value={item.description} onChange={(v) => updateItem(index, "description", v)} as="p" className="text-sm text-primary-foreground/80 leading-relaxed">{item.description}</EditableText>
                    </div>
                  );
                })}
              </div>

              <Link to="/book">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg">
                  <EditableText id="pm-contact-btn-2" value={contactBtnText} onChange={setContactBtnText} as="span">{contactBtnText}</EditableText>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GuestManagement;
