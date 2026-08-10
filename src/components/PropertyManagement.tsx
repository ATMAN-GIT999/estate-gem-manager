import { useState } from "react";
import { Monitor, Home, Users, DollarSign, CheckCircle2, Shield, Key, Clock, BookOpen, Sparkles, Shirt, Wrench, Package, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import platformConnections from "@/assets/platform-connections.png";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";

const PropertyManagement = () => {
  // The benefit leads, the category label follows: "Short-Term Rental
  // Management" describes the trade, "We manage while you relax" describes what
  // an owner gets. The second is what makes someone keep reading.
  const [sectionTitle, setSectionTitle] = useState("We manage while you relax.");
  const [sectionSubtitle, setSectionSubtitle] = useState("Short-Term Rental Management");
  const [listingTitle, setListingTitle] = useState("Listing management");
  const [listingDesc, setListingDesc] = useState("Your property advertised on all major platforms. We keep listings updated for maximum visibility.");
  const [listingBadge, setListingBadge] = useState("Listings that stand out");
  const [propertyTitle, setPropertyTitle] = useState("Property management");
  const [propertyDesc1, setPropertyDesc1] = useState("Your home will be thoroughly inspected and cleaned after each stay. We take great care of your property.");
  const [propertyDesc2, setPropertyDesc2] = useState("Once guests have checked out, we will conduct a thorough inspection of your property to detect any damage.");
  const [propertyBadge, setPropertyBadge] = useState("Homes in good hands");
  const [platformImage, setPlatformImage] = useState(platformConnections);
  const [contactBtnText, setContactBtnText] = useState("→ Contact us");
  const [listingMgmtLabel, setListingMgmtLabel] = useState("→ Listing management");

  const [listingManagement, setListingManagement] = useState([
    { icon: "Monitor", title: "Optimal listing", description: "Your home will be advertised with inviting, clear photos and clear text." },
    { icon: "BookOpen", title: "Your house rules", description: "The house rules are communicated through the advertisement to avoid misunderstandings and to prevent any damage." },
    { icon: "DollarSign", title: "Dynamic pricing", description: "Prices are adjusted based on location, amenities, and time of year. Certain cancellation policies are also determined." },
    { icon: "Package", title: "Admin assistance", description: "We advise you on insurance and legislation relating to the home, and handle traveller registration and compliance." },
  ]);

  // The guest pillar. The same four facts run on the booking page in
  // GuestManagement, written to the guest; here they are written to the owner,
  // whose question is not "will I be looked after" but "do I have to deal with
  // any of this". Without it the page never tells an owner that guest handling
  // is covered at all — the single largest part of the job.
  const [guestBadge, setGuestBadge] = useState("Guests, handled");
  const [guestTitle, setGuestTitle] = useState("Guest management");
  const [guestDesc, setGuestDesc] = useState("Every enquiry, booking, arrival and complaint comes to us, not to you. It is the largest part of the work and the part owners most want to stop doing.");

  const [guestManagement, setGuestManagement] = useState([
    { icon: "Shield", title: "Guest screening", description: "We review every booking against your conditions before accepting it, so the people in your home are people you would have said yes to." },
    { icon: "Key", title: "Check-in without you", description: "Guests receive a personal key-box code before they travel. You are never the one handing over keys or waiting for a late arrival." },
    { icon: "Clock", title: "All guest contact, 24/7", description: "Every message, question and problem comes to us at any hour — including the ones at 2am. You hear about it only if it concerns the property." },
    { icon: "BookOpen", title: "A handbook per property", description: "We write a guide for your home: house rules, Wi-Fi, how things work, what is worth seeing nearby. Fewer questions, fewer mistakes, better reviews." },
  ]);

  const [propertyManagement, setPropertyManagement] = useState([
    { icon: "Sparkles", title: "House cleaning", description: "Your home will be thoroughly cleaned after each stay, so that everything is perfect again for the next guests." },
    { icon: "Shirt", title: "Laundry service", description: "Sheets and towels are washed and ironed after each stay. A set of towels is provided for each guest." },
    { icon: "Wrench", title: "Repair service", description: "Our handyman service is responsible for repairs and any maintenance issues according to the vacation home." },
    { icon: "Package", title: "Facilities", description: "We always provide some basic amenities: toilet paper, garbage bags, cleaning products, coffee/tea, soap, shampoo, etc." },
  ]);

  const iconMap: Record<string, any> = { Monitor, Home, Users, DollarSign, CheckCircle2, Shield, Key, Clock, BookOpen, Sparkles, Shirt, Wrench, Package, LayoutDashboard };

  const updateItem = (setter: any, items: any[], index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

  const renderItemGrid = (items: any[], setter: any, prefix: string) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, index) => {
        const Icon = iconMap[item.icon] || Package;
        return (
          <div key={index} className="bg-card/10 backdrop-blur-sm rounded-lg p-6 hover:bg-card/20 transition-all duration-300 animate-fade-in border border-primary-foreground/20" style={{ animationDelay: `${index * 100}ms` }}>
            <Icon className="w-10 h-10 text-accent-on-primary mb-4" />
            <EditableText id={`${prefix}-title-${index}`} value={item.title} onChange={(v) => updateItem(setter, items, index, "title", v)} as="h4" className="text-lg font-semibold text-primary-foreground mb-2">{item.title}</EditableText>
            <EditableText id={`${prefix}-desc-${index}`} value={item.description} onChange={(v) => updateItem(setter, items, index, "description", v)} as="p" className="text-sm text-primary-foreground/80 leading-relaxed">{item.description}</EditableText>
          </div>
        );
      })}
    </div>
  );

  const renderListingItemGrid = (items: any[], setter: any, prefix: string) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, index) => {
        const Icon = iconMap[item.icon] || Package;
        return (
          <div key={index} className="bg-muted/50 backdrop-blur-sm rounded-lg p-6 hover:bg-muted transition-all duration-300 animate-fade-in border border-border" style={{ animationDelay: `${index * 100}ms` }}>
            <Icon className="w-10 h-10 text-primary mb-4" />
            <EditableText id={`${prefix}-title-${index}`} value={item.title} onChange={(v) => updateItem(setter, items, index, "title", v)} as="h4" className="text-lg font-semibold text-foreground mb-2">{item.title}</EditableText>
            <EditableText id={`${prefix}-desc-${index}`} value={item.description} onChange={(v) => updateItem(setter, items, index, "description", v)} as="p" className="text-sm text-foreground/70 leading-relaxed">{item.description}</EditableText>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-beige via-background to-beige-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <EditableText id="pm-section-subtitle" value={sectionSubtitle} onChange={setSectionSubtitle} as="span" className="block text-sm font-medium uppercase tracking-widest text-accent-strong mb-4">{sectionSubtitle}</EditableText>
          <EditableText id="pm-section-title" value={sectionTitle} onChange={setSectionTitle} as="h2" className="font-playfair text-4xl md:text-5xl font-bold text-primary">{sectionTitle}</EditableText>
        </div>

        {/* Listing Management Section */}
        <div className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-primary rounded-full p-3">
                      <Home className="w-6 h-6 text-accent-on-primary" />
                    </div>
                    <div>
                      <div className="bg-primary text-accent-on-primary px-6 py-2 rounded-full inline-block font-semibold">
                        <EditableText id="pm-listing-badge" value={listingBadge} onChange={setListingBadge} as="span">{listingBadge}</EditableText>
                      </div>
                    </div>
                  </div>
                  <EditableText id="pm-listing-title" value={listingTitle} onChange={setListingTitle} as="h3" className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">{listingTitle}</EditableText>
                  <EditableText id="pm-listing-desc" value={listingDesc} onChange={setListingDesc} as="p" className="text-lg text-foreground/80 leading-relaxed">{listingDesc}</EditableText>
                </div>
                <div className="flex justify-center">
                  <EditableImage id="pm-platforms-image" src={platformImage} alt="Connected booking platforms" onChange={setPlatformImage} className="w-full max-w-md animate-fade-in" />
                </div>
              </div>
              {renderListingItemGrid(listingManagement, setListingManagement, "pm-listing")}
              <Link to="/book">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg">
                  <EditableText id="pm-contact-btn-1" value={contactBtnText} onChange={setContactBtnText} as="span">{contactBtnText}</EditableText>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Guest Management Section — the owner-facing counterpart to the
            GuestManagement component on the booking page. Same four facts, but
            answering "do I have to deal with any of this" rather than "will I
            be looked after". */}
        <div className="mb-20">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-primary border-none shadow-elegant overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-accent rounded-full p-3">
                    <Users className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="bg-accent text-accent-foreground px-6 py-2 rounded-full inline-block mb-4 font-semibold">
                      <EditableText id="pm-guest-badge-owner" value={guestBadge} onChange={setGuestBadge} as="span">{guestBadge}</EditableText>
                    </div>
                  </div>
                </div>
                <EditableText id="pm-guest-title-owner" value={guestTitle} onChange={setGuestTitle} as="h3" className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-6">{guestTitle}</EditableText>
                <EditableText id="pm-guest-desc-owner" value={guestDesc} onChange={setGuestDesc} as="p" multiline className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">{guestDesc}</EditableText>
                {renderItemGrid(guestManagement, setGuestManagement, "pm-guest-owner")}
                <Link to="/book">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg">
                    <EditableText id="pm-contact-btn-2" value={contactBtnText} onChange={setContactBtnText} as="span">{contactBtnText}</EditableText>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Management Section */}
        <div>
          <div className="max-w-6xl mx-auto">
            <Card className="bg-primary border-none shadow-elegant overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-accent rounded-full p-3">
                    <Home className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="bg-accent text-accent-foreground px-6 py-2 rounded-full inline-block mb-4 font-semibold">
                      <EditableText id="pm-property-badge" value={propertyBadge} onChange={setPropertyBadge} as="span">{propertyBadge}</EditableText>
                    </div>
                  </div>
                </div>
                <EditableText id="pm-property-title" value={propertyTitle} onChange={setPropertyTitle} as="h3" className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-6">{propertyTitle}</EditableText>
                <div className="space-y-4 mb-8">
                  <EditableText id="pm-property-desc1" value={propertyDesc1} onChange={setPropertyDesc1} as="p" className="text-xl text-primary-foreground/90 leading-relaxed">{propertyDesc1}</EditableText>
                  <EditableText id="pm-property-desc2" value={propertyDesc2} onChange={setPropertyDesc2} as="p" className="text-xl text-primary-foreground/90 leading-relaxed">{propertyDesc2}</EditableText>
                </div>
                {renderItemGrid(propertyManagement, setPropertyManagement, "pm-prop")}
                <div className="flex flex-wrap gap-4 mb-8">
                  <EditableText id="pm-listing-mgmt-label2" value={listingMgmtLabel} onChange={setListingMgmtLabel} as="span" className="text-accent-on-primary text-lg font-medium">{listingMgmtLabel}</EditableText>
                </div>
                <Link to="/book">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg">
                    <EditableText id="pm-contact-btn-3" value={contactBtnText} onChange={setContactBtnText} as="span">{contactBtnText}</EditableText>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyManagement;
