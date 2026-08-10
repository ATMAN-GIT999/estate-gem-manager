import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";

/**
 * The hand-off between the two halves of the site: everything above is written
 * for a guest choosing a stay, everything it leads to is written for an owner
 * choosing a manager.
 *
 * Built to match the Portfolio section rather than to stand apart from it —
 * centred heading, the same stat cards, the same light surface. The question
 * itself is what does the work; an owner scrolling past reads "Own a Property?"
 * and stops because it is addressed to them, not because the section shouts.
 *
 * `bg-background` is the site's light surface (#efe6d9) rather than pure white:
 * the cards are `--card`, which *is* white, so they only read as cards against
 * something slightly darker.
 */
const OwnAProperty = () => {
  const [heading, setHeading] = useState("Own a Property?");
  const [subheading, setSubheading] = useState("See what it could earn with us.");
  const [ctaText, setCtaText] = useState("Discover Property Management");

  // The figures the Portfolio section carries on the property management page.
  const [stats, setStats] = useState([
    { number: "41", label: "Properties Managed" },
    { number: "1500+", label: "Successful Reservations" },
    { number: "8", label: "Destinations" },
    { number: "50+", label: "Collaborators" },
  ]);

  const updateStat = (index: number, field: "number" | "label", value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  return (
    <section id="own-a-property" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* h2, not h1 — the page's h1 is the hero. Sized to match the
              Portfolio heading it sits alongside. */}
          <EditableText
            id="oap-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4"
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
            className="font-playfair text-xl md:text-2xl text-accent-strong"
          >
            {subheading}
          </EditableText>
        </div>

        {/* Same treatment as the Portfolio numbers: a hairline and space
            instead of a raised panel. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-10 max-w-5xl mx-auto mb-14">
          {stats.map((stat, index) => (
            <div key={index} className="border-t border-primary/15 pt-6">
              <EditableText
                id={`oap-stat-number-${index}`}
                value={stat.number}
                onChange={(v) => updateStat(index, "number", v)}
                as="p"
                className="font-playfair text-4xl md:text-5xl font-bold text-accent-strong mb-3 tabular-nums"
              >
                {stat.number}
              </EditableText>
              <EditableText
                id={`oap-stat-label-${index}`}
                value={stat.label}
                onChange={(v) => updateStat(index, "label", v)}
                as="p"
                className="text-sm uppercase tracking-widest text-foreground/60"
              >
                {stat.label}
              </EditableText>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/property-management">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8 py-6 text-base"
            >
              <EditableText id="oap-cta" value={ctaText} onChange={setCtaText} as="span">
                {ctaText}
              </EditableText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OwnAProperty;
