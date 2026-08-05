import { useState } from "react";
import { BadgeCheck, Headset, HandCoins } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

const ICONS = [BadgeCheck, Headset, HandCoins];

/**
 * Three reasons to book here rather than through a platform.
 *
 * It does double duty, which is why it sits where it does: read as a guest it
 * is the case for booking direct, and read a moment later — once RevealBand
 * has said who runs these homes — the same three claims are the case for
 * letting us manage yours. Same evidence, two audiences, no repetition.
 */
const StayValue = () => {
  const [values, setValues] = useState([
    {
      title: "Verified quality",
      description:
        "Every home inspected and cleaned to hotel standard before you arrive.",
    },
    {
      title: "Concierge on call",
      description:
        "24/7 multilingual support, from check-in to local recommendations.",
    },
    {
      title: "Direct-booking benefits",
      description:
        "Best rates and a real human team — no platform middleman.",
    },
  ]);

  const updateValue = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const next = [...values];
    next[index] = { ...next[index], [field]: value };
    setValues(next);
  };

  return (
    <section id="stay-value" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="sv"
          eyebrow="Why book direct"
          heading="More than a place to stay."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = ICONS[index] ?? BadgeCheck;
            return (
              <Card
                key={index}
                className="p-8 bg-card border-border shadow-elegant"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-accent-strong" />
                </div>
                <EditableText
                  id={`sv-title-${index}`}
                  value={value.title}
                  onChange={(v) => updateValue(index, "title", v)}
                  as="h3"
                  className="font-playfair text-xl font-bold text-primary mb-3"
                >
                  {value.title}
                </EditableText>
                <EditableText
                  id={`sv-desc-${index}`}
                  value={value.description}
                  onChange={(v) => updateValue(index, "description", v)}
                  as="p"
                  multiline
                  className="text-foreground/70 leading-relaxed"
                >
                  {value.description}
                </EditableText>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StayValue;
