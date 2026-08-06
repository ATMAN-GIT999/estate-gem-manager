import { useState } from "react";
import { BadgeCheck, Headset, HandCoins, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

const ICONS = [BadgeCheck, Headset, HandCoins, KeyRound];

/**
 * Why book here instead of on a platform.
 *
 * Grown out of the old StayValue block, with a fourth card recovered from the
 * two owner sections that used to sit further down the page — keybox check-in
 * and the local guide were listed there as things we do *for owners*, which
 * meant the guest reading the page never learned they get them.
 *
 * These four also carry the page's keyword weight: this is the only place on
 * the landing page where the copy can say plainly what kind of company this is
 * without interrupting either the search or the story.
 */
const WhatMakesUsDifferent = () => {
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
    {
      title: "Arrive and it works",
      description:
        "Self check-in with your own keybox code, and a local guide written by the team who looks after the house.",
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
    <section id="different" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="wmd"
          eyebrow="What makes us different"
          heading="More than a place to stay."
          lead="We manage every home in this collection ourselves — which is why the stay behaves the same way whichever one you pick."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
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
                  id={`wmd-title-${index}`}
                  value={value.title}
                  onChange={(v) => updateValue(index, "title", v)}
                  as="h3"
                  className="font-playfair text-xl font-bold text-primary mb-3"
                >
                  {value.title}
                </EditableText>
                <EditableText
                  id={`wmd-desc-${index}`}
                  value={value.description}
                  onChange={(v) => updateValue(index, "description", v)}
                  as="p"
                  multiline
                  className="text-foreground/70 leading-relaxed text-sm"
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

export default WhatMakesUsDifferent;
