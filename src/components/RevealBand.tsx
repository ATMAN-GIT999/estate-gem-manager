import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * The owner teaser — the one place on a guest-primary page where the other
 * half of the business gets to speak.
 *
 * It used to be the hinge of a one-pager, turning the scroll from guests to
 * owners in place. Now the owner story has its own page, so this band's job is
 * smaller and sharper: use the homes the reader has just scrolled past as the
 * argument, then hand them over. One sentence, one link, no service list.
 *
 * It is the only full-bleed green band in the scroll, which is what stops it
 * reading as just another section.
 */
const RevealBand = () => {
  const [ctaText, setCtaText] = useState("See what your property could earn");

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
          <Link to="/property-management">
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
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RevealBand;
