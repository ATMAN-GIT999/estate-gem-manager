import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * The hinge of the page.
 *
 * Everything above it is written for a guest; everything below it is written
 * for an owner. Rather than switching audiences with a heading and hoping the
 * reader follows, this band earns the turn: the homes you have just scrolled
 * past are the proof of the service being offered from here down.
 *
 * It is the only full-bleed green band in the scroll, which is what makes it
 * read as a chapter break rather than another section.
 */
const RevealBand = () => {
  const [ctaText, setCtaText] = useState("See what your property could earn");

  const scrollToEvaluator = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("property-evaluation")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="reveal" className="py-24 bg-gradient-sage scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="reveal"
          tone="primary"
          eyebrow="Behind every stay"
          heading="Every home you just saw is managed by Frontier."
          lead="The five-star stay guests remember is the standard we deliver for owners — every booking, every turnover, every day."
        />

        <div className="mt-10 text-center">
          <a href="#property-evaluation" onClick={scrollToEvaluator}>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold font-semibold px-8"
            >
              <EditableText
                id="reveal-cta"
                value={ctaText}
                onChange={setCtaText}
                as="span"
              >
                {ctaText}
              </EditableText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RevealBand;
