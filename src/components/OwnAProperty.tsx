import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";

/**
 * The hand-off between the two halves of the site.
 *
 * Everything above it is written for a guest choosing a stay; everything it
 * leads to is written for an owner choosing a manager. It has to interrupt —
 * a reader in booking mode will not notice a polite invitation.
 *
 * Gold is the one brand colour not yet used as a large surface on this page,
 * which is what makes the interruption work without inventing anything: the
 * section above it is a green card on beige, the evaluator below is a light
 * form. Full-bleed rather than a card, so the break is the absence of a box
 * rather than another box. `bg-accent` + `text-accent-foreground` is the
 * pairing index.css documents at 6.05:1.
 *
 * The two actions are deliberately unequal. The button goes to the property
 * management page, which is this section's whole purpose. The quiet link goes
 * to the revenue calculator immediately below — the heading promises an answer
 * and that is where the answer is, so it costs a scroll rather than a page.
 */
const OwnAProperty = () => {
  const [kicker, setKicker] = useState("Own a Property?");
  const [heading, setHeading] = useState("See what it could earn with us.");
  const [lead, setLead] = useState(
    "From listings and guests to cleaning, dynamic pricing and monthly reporting — we run the whole operation. You keep the asset and the income."
  );
  const [ctaPrimary, setCtaPrimary] = useState("Discover Property Management");
  const [ctaSecondary, setCtaSecondary] = useState("Calculate your revenue");

  // Same figures the Stats section carries on the property management page.
  const [stats, setStats] = useState([
    { number: "41", label: "Properties Managed" },
    { number: "1,500+", label: "Successful Reservations" },
    { number: "8", label: "Destinations" },
  ]);

  const updateStat = (index: number, field: "number" | "label", value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  return (
    <section id="own-a-property" className="py-24 bg-accent scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <EditableText
              id="oap-kicker"
              value={kicker}
              onChange={setKicker}
              as="span"
              className="block text-base md:text-lg font-semibold uppercase tracking-[0.2em] text-accent-foreground/70 mb-5"
            >
              {kicker}
            </EditableText>

            <EditableText
              id="oap-heading"
              value={heading}
              onChange={setHeading}
              as="h2"
              className="font-playfair text-4xl md:text-6xl font-bold text-accent-foreground text-balance mb-6"
            >
              {heading}
            </EditableText>

            <EditableText
              id="oap-lead"
              value={lead}
              onChange={setLead}
              as="p"
              multiline
              className="text-lg md:text-xl text-accent-foreground/80 leading-relaxed max-w-xl mb-10"
            >
              {lead}
            </EditableText>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/property-management">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8 py-6 text-base"
                >
                  <EditableText id="oap-cta-primary" value={ctaPrimary} onChange={setCtaPrimary} as="span">
                    {ctaPrimary}
                  </EditableText>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              {/* Plain anchor: the evaluator sits directly below and already
                  carries `scroll-mt-20` to clear the fixed header. */}
              <a
                href="#property-evaluation"
                className="inline-flex items-center gap-2 text-accent-foreground font-medium underline underline-offset-4 decoration-accent-foreground/40 hover:decoration-accent-foreground transition-colors"
              >
                <EditableText id="oap-cta-secondary" value={ctaSecondary} onChange={setCtaSecondary} as="span">
                  {ctaSecondary}
                </EditableText>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Proof, stacked rather than in a row: three lines of hairline rule
              read as a ledger, which suits numbers an owner is meant to weigh. */}
          <div className="lg:pl-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-baseline justify-between gap-6 py-5 border-t border-accent-foreground/20 last:border-b"
              >
                <EditableText
                  id={`oap-stat-number-${index}`}
                  value={stat.number}
                  onChange={(v) => updateStat(index, "number", v)}
                  as="span"
                  className="font-playfair text-4xl md:text-5xl font-bold text-accent-foreground"
                >
                  {stat.number}
                </EditableText>
                <EditableText
                  id={`oap-stat-label-${index}`}
                  value={stat.label}
                  onChange={(v) => updateStat(index, "label", v)}
                  as="span"
                  className="text-sm md:text-base uppercase tracking-widest text-accent-foreground/70 text-right"
                >
                  {stat.label}
                </EditableText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnAProperty;
