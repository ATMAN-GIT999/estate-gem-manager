import { useState } from "react";
import { MapPin } from "lucide-react";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * First stop after the hero: where these homes actually are.
 *
 * Replaces the old IntroSection, which opened the page with a positioning
 * statement about property management — an owner message directly under a
 * guest search bar. A reader who has just typed dates wants to know one thing
 * here, and it is geography.
 *
 * Three regions, a half-line each, no paragraph. The detail belongs on the
 * property pages.
 */
const WhereWeHost = () => {
  const [regions, setRegions] = useState([
    {
      name: "Costa del Sol",
      line: "Marbella, Málaga and the villages along the coast.",
    },
    {
      name: "Austria",
      line: "City apartments in Vienna, lake and mountain retreats in Carinthia.",
    },
    {
      name: "Croatia",
      line: "Istria — the Adriatic before the crowds find it.",
    },
  ]);

  const updateRegion = (index: number, field: "name" | "line", value: string) => {
    const next = [...regions];
    next[index] = { ...next[index], [field]: value };
    setRegions(next);
  };

  return (
    <section id="where-we-host" className="py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="wwh"
          eyebrow="Where we host"
          heading="Stays in the places worth staying."
          lead="A tightly curated portfolio across Southern Spain, Austria and Croatia — every home visited, vetted, and managed by us."
        />

        <div className="mt-16 grid gap-10 sm:grid-cols-3 max-w-4xl mx-auto">
          {regions.map((region, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5">
                <MapPin className="w-5 h-5 text-accent-strong" />
              </div>
              <EditableText
                id={`wwh-region-name-${index}`}
                value={region.name}
                onChange={(v) => updateRegion(index, "name", v)}
                as="h3"
                className="font-playfair text-xl font-bold text-primary mb-2"
              >
                {region.name}
              </EditableText>
              <EditableText
                id={`wwh-region-line-${index}`}
                value={region.line}
                onChange={(v) => updateRegion(index, "line", v)}
                as="p"
                className="text-sm text-foreground/70 leading-relaxed"
              >
                {region.line}
              </EditableText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhereWeHost;
