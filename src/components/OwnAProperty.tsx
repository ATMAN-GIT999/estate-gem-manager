import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { Section, Stack } from "./layout";

/**
 * The hand-off between the two halves of the site: everything above is written
 * for a guest choosing a stay, everything it leads to is written for an owner
 * choosing a manager.
 *
 * It used to repeat the four portfolio numbers (41 properties, 1500+
 * reservations, 8 destinations, 50+ collaborators). Those now open the page as
 * the trust band directly under the hero (§11), so showing them again here
 * would be the same four figures twice on one scroll — and it left this
 * section carrying a full grid when its whole job is one question and one way
 * out of the page.
 *
 * The question is what does the work. An owner scrolling past reads "Own a
 * Property?" and stops because it is addressed to them, not because the
 * section shouts.
 */
const OwnAProperty = () => {
  const [heading, setHeading] = useState("Own a Property?");
  const [subheading, setSubheading] = useState("See what it could earn with us.");
  const [ctaText, setCtaText] = useState("Discover Property Management");

  return (
    <Section id="own-a-property" tone="muted" size="md" measure="text">
      <Stack gap="md" align="center">
        <div className="space-y-xs">
          {/* h2, not h1 — the page's h1 is the hero. */}
          <EditableText
            id="oap-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-primary"
          >
            {heading}
          </EditableText>

          {/* text-accent-strong, not text-accent: index.css keeps a darker gold
              for text on light surfaces, the mid gold is a fill colour. */}
          <EditableText
            id="oap-subheading"
            value={subheading}
            onChange={setSubheading}
            as="p"
            className="t-block text-accent-strong"
          >
            {subheading}
          </EditableText>
        </div>

        <div>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8 py-6 text-base"
          >
            <Link to="/property-management">
              <EditableText id="oap-cta" value={ctaText} onChange={setCtaText} as="span">
                {ctaText}
              </EditableText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </Stack>
    </Section>
  );
};

export default OwnAProperty;
