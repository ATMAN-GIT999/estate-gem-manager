import { useState } from "react";
import { Monitor, DollarSign, BookOpen, Package } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack, Divider } from "./layout";

/**
 * The second detail layer (§16): the differentiation chapter above makes the
 * claim, this section is what backs it with things an owner can picture.
 *
 * Two densities in one section, on purpose. The four listing items carry
 * enough detail to be worth a sentence each; the six operational lines
 * underneath are named and left at that, because §16 is explicit that none of
 * them should grow into its own section.
 *
 * Nothing in the second list is new writing — each one is a service already
 * stated elsewhere on the page, collected here under one heading rather than
 * spread across four: guest communication and predictive maintenance from the
 * technology block, cleaning and inspections from "Property care", owner
 * reporting from "Transparent reporting", responsiveness from "Faster
 * responses". Same rule the FAQ follows: name what the site already stands
 * behind, invent nothing.
 */
const ListingWorkflow = () => {
  const [heading, setHeading] = useState("It's in the details.");
  const [lead, setLead] = useState("Four things handled before your first guest ever arrives — and the routine that keeps running after they do.");

  const [items, setItems] = useState([
    { icon: "Monitor", title: "Optimal listing", description: "Your home will be advertised with inviting, clear photos and clear text." },
    { icon: "BookOpen", title: "Your house rules", description: "The house rules are communicated through the advertisement to avoid misunderstandings and to prevent any damage." },
    { icon: "DollarSign", title: "Dynamic pricing", description: "Prices are adjusted based on location, amenities, and time of year. Certain cancellation policies are also determined." },
    { icon: "Package", title: "Admin assistance", description: "We advise you on insurance and legislation relating to the home, and handle traveller registration and compliance." },
  ]);

  const [routineLabel, setRoutineLabel] = useState("And every week after that");
  const [routine, setRoutine] = useState([
    "Guest communication",
    "Cleaning quality",
    "Property inspections",
    "Maintenance coordination",
    "Owner communication",
    "Operational responsiveness",
  ]);

  const iconMap: Record<string, any> = { Monitor, DollarSign, BookOpen, Package };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <Section size="md">
      <Stack gap="lg">
        <div className="max-w-3xl mx-auto text-center space-y-sm">
          <EditableText
            id="listing-workflow-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-primary text-balance"
          >
            {heading}
          </EditableText>
          <EditableText
            id="listing-workflow-lead"
            value={lead}
            onChange={setLead}
            as="p"
            multiline
            className="t-body text-foreground/70"
          >
            {lead}
          </EditableText>
        </div>

        <Grid cols={4}>
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Package;
            return (
              <div key={index} className="border-t border-primary/15 pt-sm">
                <Icon className="w-6 h-6 text-accent-strong mb-sm" strokeWidth={1.5} />
                <EditableText
                  id={`listing-workflow-title-${index}`}
                  value={item.title}
                  onChange={(v) => updateItem(index, "title", v)}
                  as="h3"
                  className="t-item text-primary mb-1"
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
        </Grid>

        {/* Named, not explained. A gold rule marks the change of density so
            the shorter lines read as a deliberate second register rather than
            four items that ran out of copy. */}
        <div>
          <Divider tone="gold" className="mb-md" />
          <div className="flex flex-wrap items-baseline gap-x-md gap-y-xs">
            <EditableText
              id="listing-routine-label"
              value={routineLabel}
              onChange={setRoutineLabel}
              as="span"
              className="t-meta text-accent-strong"
            >
              {routineLabel}
            </EditableText>
            <ul className="flex flex-wrap gap-x-md gap-y-xs">
              {routine.map((entry, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-strong shrink-0" aria-hidden="true" />
                  <EditableText
                    id={`listing-routine-${index}`}
                    value={entry}
                    onChange={(v) => { const u = [...routine]; u[index] = v; setRoutine(u); }}
                    as="span"
                    className="t-body text-foreground/80"
                  >
                    {entry}
                  </EditableText>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Stack>
    </Section>
  );
};

export default ListingWorkflow;
