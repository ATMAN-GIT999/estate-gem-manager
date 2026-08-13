import { useState } from "react";
import platformConnections from "@/assets/platform-connections.webp";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";

/**
 * The opening statement of the PM page's operational section: what Frontier
 * takes off an owner's hands, in one line, plus the listing itself. Text
 * left, image large on the right — the layout this section had before the
 * centred-heading pass, restored because the image read as an afterthought
 * at max-w-md.
 */
const PropertyManagement = () => {
  // Synonym for "Short-Term Rental Management".
  const [sectionBadge, setSectionBadge] = useState("Vacation Rental Management");
  const [sectionTitle, setSectionTitle] = useState("We manage while you relax.");
  const [listingDesc, setListingDesc] = useState("Your property advertised on all major platforms. We keep listings updated for maximum visibility.");
  const [platformImage, setPlatformImage] = useState(platformConnections);

  return (
    <section className="py-24 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <EditableText
              id="pm-section-badge"
              value={sectionBadge}
              onChange={setSectionBadge}
              as="span"
              className="block t-meta text-accent-strong mb-4"
            >
              {sectionBadge}
            </EditableText>
            <EditableText
              id="pm-section-title"
              value={sectionTitle}
              onChange={setSectionTitle}
              as="h2"
              className="t-section text-primary text-balance mb-5"
            >
              {sectionTitle}
            </EditableText>
            <EditableText
              id="pm-listing-desc"
              value={listingDesc}
              onChange={setListingDesc}
              as="p"
              className="t-body text-foreground/70"
            >
              {listingDesc}
            </EditableText>
          </div>

          <EditableImage
            id="pm-platforms-image"
            src={platformImage}
            alt="Connected booking platforms"
            onChange={setPlatformImage}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyManagement;
