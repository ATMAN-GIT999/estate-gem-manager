import { useState } from "react";
import platformConnections from "@/assets/platform-connections.webp";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";
import { Section, Grid, Stack } from "./layout";

/**
 * The counterweight to "We manage what the property earns": that section is
 * about the money, this one is about the owner's own time — hands-off
 * ownership, peace of mind, someone else holding the operational end.
 *
 * §14 is explicit that the two must not carry the same weight. The money
 * section opens with the widest band of air on the page and a full-width grid;
 * this one is a single quiet row on the muted surface, no grid, no list, one
 * sentence and the image. Reading it after the other should feel like the page
 * exhaling.
 *
 * Text 5 columns, image 7, on the shared 12-column grid rather than the
 * `lg:grid-cols-2` it used to use — at half and half the image was competing
 * with the sentence instead of supporting it.
 */
const PropertyManagement = () => {
  // Synonym for "Short-Term Rental Management".
  const [sectionBadge, setSectionBadge] = useState("Vacation Rental Management");
  const [sectionTitle, setSectionTitle] = useState("We manage while you relax.");
  const [listingDesc, setListingDesc] = useState("Your property advertised on all major platforms. We keep listings updated for maximum visibility.");
  const [platformImage, setPlatformImage] = useState(platformConnections);

  return (
    <Section tone="muted" size="md">
      <Grid className="items-center">
        <Stack gap="sm" className="md:col-span-5">
          <EditableText
            id="pm-section-badge"
            value={sectionBadge}
            onChange={setSectionBadge}
            as="span"
            className="block t-meta text-accent-strong"
          >
            {sectionBadge}
          </EditableText>
          <EditableText
            id="pm-section-title"
            value={sectionTitle}
            onChange={setSectionTitle}
            as="h2"
            className="t-section text-primary text-balance"
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
        </Stack>

        <EditableImage
          id="pm-platforms-image"
          src={platformImage}
          alt="Connected booking platforms"
          onChange={setPlatformImage}
          className="w-full h-auto md:col-span-7"
        />
      </Grid>
    </Section>
  );
};

export default PropertyManagement;
