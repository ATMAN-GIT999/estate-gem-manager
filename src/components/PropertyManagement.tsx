import { useState } from "react";
import { Monitor, DollarSign, Shield, Key, Clock, BookOpen, Sparkles, Shirt, Wrench, Package } from "lucide-react";
import platformConnections from "@/assets/platform-connections.webp";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";

/**
 * The three things Frontier takes off an owner's hands: the listing, the guests,
 * the building.
 *
 * Presented as three passes over one surface rather than three cards. The
 * previous version put two of the pillars in filled green panels and then put
 * four filled boxes inside each of those — a box inside a box, twice — while
 * the third pillar sat on the page background with no panel at all, so the
 * three read as different kinds of thing. Now the only structure is space, a
 * hairline, and the width of the text.
 *
 * The pillars used to end with three "→ Contact us" buttons pointing at /book,
 * which is the guest booking flow: an owner reading about management was being
 * sent into a funnel for booking a holiday. The page closes with its own call
 * to action, so they are gone rather than repointed.
 */
const PropertyManagement = () => {
  // The benefit leads, the category label follows: "Short-Term Rental
  // Management" describes the trade, "We manage while you relax" describes what
  // an owner gets. The second is what makes someone keep reading.
  const [sectionTitle, setSectionTitle] = useState("We manage while you relax.");
  const [sectionSubtitle, setSectionSubtitle] = useState("Short-Term Rental Management");

  const [listingTitle, setListingTitle] = useState("Listing management");
  const [listingDesc, setListingDesc] = useState("Your property advertised on all major platforms. We keep listings updated for maximum visibility.");
  const [listingBadge, setListingBadge] = useState("Listings that stand out");
  const [platformImage, setPlatformImage] = useState(platformConnections);

  // The guest pillar. The same four facts run on the booking page in
  // GuestManagement, written to the guest; here they are written to the owner,
  // whose question is not "will I be looked after" but "do I have to deal with
  // any of this". Without it the page never tells an owner that guest handling
  // is covered at all — the single largest part of the job.
  const [guestBadge, setGuestBadge] = useState("Guests, handled");
  const [guestTitle, setGuestTitle] = useState("Guest management");
  const [guestDesc, setGuestDesc] = useState("Every enquiry, booking, arrival and complaint comes to us, not to you. It is the largest part of the work and the part owners most want to stop doing.");

  const [propertyTitle, setPropertyTitle] = useState("Property care");
  const [propertyDesc, setPropertyDesc] = useState("Your home is cleaned and inspected after every stay. Once guests check out we go through the property to catch any damage before the next arrival.");
  const [propertyBadge, setPropertyBadge] = useState("Homes in good hands");

  const [listingManagement, setListingManagement] = useState([
    { icon: "Monitor", title: "Optimal listing", description: "Your home will be advertised with inviting, clear photos and clear text." },
    { icon: "BookOpen", title: "Your house rules", description: "The house rules are communicated through the advertisement to avoid misunderstandings and to prevent any damage." },
    { icon: "DollarSign", title: "Dynamic pricing", description: "Prices are adjusted based on location, amenities, and time of year. Certain cancellation policies are also determined." },
    { icon: "Package", title: "Admin assistance", description: "We advise you on insurance and legislation relating to the home, and handle traveller registration and compliance." },
  ]);

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

  const iconMap: Record<string, any> = { Monitor, DollarSign, Shield, Key, Clock, BookOpen, Sparkles, Shirt, Wrench, Package };

  /**
   * An item is a rule, an icon, a name and a sentence — no fill, no border box.
   * The hairline is what separates them, so four of them read as one row of
   * related things rather than four objects.
   */
  const renderItems = (
    items: any[],
    setter: (v: any[]) => void,
    prefix: string
  ) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 mt-14">
      {items.map((item, index) => {
        const Icon = iconMap[item.icon] || Package;
        const update = (field: string, value: string) => {
          const updated = [...items];
          updated[index] = { ...updated[index], [field]: value };
          setter(updated);
        };
        return (
          <div key={index} className="border-t border-primary/15 pt-5">
            <Icon className="w-6 h-6 text-accent-strong mb-4" strokeWidth={1.5} />
            <EditableText
              id={`${prefix}-title-${index}`}
              value={item.title}
              onChange={(v) => update("title", v)}
              as="h4"
              className="font-semibold text-primary mb-2"
            >
              {item.title}
            </EditableText>
            <EditableText
              id={`${prefix}-desc-${index}`}
              value={item.description}
              onChange={(v) => update("description", v)}
              as="p"
              className="text-sm text-foreground/70 leading-relaxed"
            >
              {item.description}
            </EditableText>
          </div>
        );
      })}
    </div>
  );

  const renderPillarHead = (
    badge: string,
    setBadge: (v: string) => void,
    title: string,
    setTitle: (v: string) => void,
    prefix: string
  ) => (
    <>
      <EditableText
        id={`${prefix}-badge`}
        value={badge}
        onChange={setBadge}
        as="span"
        className="block text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong mb-3"
      >
        {badge}
      </EditableText>
      <EditableText
        id={`${prefix}-title`}
        value={title}
        onChange={setTitle}
        as="h3"
        className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-5"
      >
        {title}
      </EditableText>
    </>
  );

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
          <EditableText
            id="pm-section-subtitle"
            value={sectionSubtitle}
            onChange={setSectionSubtitle}
            as="span"
            className="block text-sm font-medium uppercase tracking-widest text-accent-strong mb-4"
          >
            {sectionSubtitle}
          </EditableText>
          <EditableText
            id="pm-section-title"
            value={sectionTitle}
            onChange={setSectionTitle}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary text-balance"
          >
            {sectionTitle}
          </EditableText>
        </div>

        <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
          {/* Listing — keeps the platform artwork, which is the one place an
              image says something the text cannot. */}
          <div>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                {renderPillarHead(listingBadge, setListingBadge, listingTitle, setListingTitle, "pm-listing")}
                <EditableText
                  id="pm-listing-desc"
                  value={listingDesc}
                  onChange={setListingDesc}
                  as="p"
                  className="text-lg text-foreground/70 leading-relaxed"
                >
                  {listingDesc}
                </EditableText>
              </div>
              <EditableImage
                id="pm-platforms-image"
                src={platformImage}
                alt="Connected booking platforms"
                onChange={setPlatformImage}
                className="w-full max-w-md mx-auto"
              />
            </div>
            {renderItems(listingManagement, setListingManagement, "pm-listing")}
          </div>

          {/* Guests */}
          <div className="max-w-3xl">
            {renderPillarHead(guestBadge, setGuestBadge, guestTitle, setGuestTitle, "pm-guest-owner")}
            <EditableText
              id="pm-guest-desc-owner"
              value={guestDesc}
              onChange={setGuestDesc}
              as="p"
              multiline
              className="text-lg text-foreground/70 leading-relaxed"
            >
              {guestDesc}
            </EditableText>
            {renderItems(guestManagement, setGuestManagement, "pm-guest-owner")}
          </div>

          {/* Property care */}
          <div className="max-w-3xl">
            {renderPillarHead(propertyBadge, setPropertyBadge, propertyTitle, setPropertyTitle, "pm-property")}
            <EditableText
              id="pm-property-desc1"
              value={propertyDesc}
              onChange={setPropertyDesc}
              as="p"
              multiline
              className="text-lg text-foreground/70 leading-relaxed"
            >
              {propertyDesc}
            </EditableText>
            {renderItems(propertyManagement, setPropertyManagement, "pm-prop")}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyManagement;
