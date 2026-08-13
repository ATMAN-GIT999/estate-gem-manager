import { useState } from "react";
import { Monitor, DollarSign, BookOpen, Package } from "lucide-react";
import EditableText from "./admin/EditableText";

/**
 * The four things that make up the listing itself — split out of the old
 * "Listing management" pillar so it can carry its own weight as a section.
 * Back on the page background with hairlines, not a fill colour: the brown
 * fill read as heavy rather than premium.
 */
const ListingWorkflow = () => {
  const [heading, setHeading] = useState("This is how we work together.");
  const [lead, setLead] = useState("Four things, handled before your first guest ever arrives.");

  const [items, setItems] = useState([
    { icon: "Monitor", title: "Optimal listing", description: "Your home will be advertised with inviting, clear photos and clear text." },
    { icon: "BookOpen", title: "Your house rules", description: "The house rules are communicated through the advertisement to avoid misunderstandings and to prevent any damage." },
    { icon: "DollarSign", title: "Dynamic pricing", description: "Prices are adjusted based on location, amenities, and time of year. Certain cancellation policies are also determined." },
    { icon: "Package", title: "Admin assistance", description: "We advise you on insurance and legislation relating to the home, and handle traveller registration and compliance." },
  ]);

  const iconMap: Record<string, any> = { Monitor, DollarSign, BookOpen, Package };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <section className="py-28 md:py-36 bg-background">
      <div className="container mx-auto px-4">
        {/* Deliberately more air than the section's other headings: the
            headline is meant to land on its own before the eye moves on to
            the lead line, and the lead line again before the grid — a
            paced descent rather than heading-then-immediately-content. */}
        <div className="max-w-3xl mx-auto text-center mb-24 md:mb-32">
          <EditableText
            id="listing-workflow-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-primary text-balance mb-6"
          >
            {heading}
          </EditableText>
          <EditableText
            id="listing-workflow-lead"
            value={lead}
            onChange={setLead}
            as="p"
            className="t-body text-foreground/70"
          >
            {lead}
          </EditableText>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14 max-w-6xl mx-auto">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Package;
            return (
              <div key={index} className="border-t border-primary/15 pt-5">
                <Icon className="w-6 h-6 text-accent-strong mb-4" strokeWidth={1.5} />
                <EditableText
                  id={`listing-workflow-title-${index}`}
                  value={item.title}
                  onChange={(v) => updateItem(index, "title", v)}
                  as="h4"
                  className="t-item text-primary mb-2"
                >
                  {item.title}
                </EditableText>
                <EditableText
                  id={`listing-workflow-desc-${index}`}
                  value={item.description}
                  onChange={(v) => updateItem(index, "description", v)}
                  as="p"
                  className="t-body text-foreground/70"
                >
                  {item.description}
                </EditableText>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ListingWorkflow;
