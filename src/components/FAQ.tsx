import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditableText from "./admin/EditableText";

/**
 * Landing-page FAQ, guest-only.
 *
 * This page's audience is the guest booking a stay — the project's one hard
 * rule is not to let owner-directed copy leak into guest sections (see
 * CLAUDE.md, "der historische Hauptfehler"). Every answer below is phrased to
 * the person booking a stay, sourced from what the site already states
 * elsewhere or from verified property data, so nothing here is invented:
 *   - self check-in, cancellation terms varying per property →
 *     GuestManagement.tsx, BookingSummary.tsx's `quote.cancellationPolicy`.
 *   - airport/marina distances, private pool count, WiFi+workspace coverage →
 *     computed 2026-08-14 from `properties.latitude/longitude` (haversine to
 *     AGP 36.6749,-4.4991 and Puerto Banús 36.4850,-4.9540) and
 *     `properties.amenities`, across the 16 non-Austria listings. Re-run that
 *     query before editing these numbers — they will drift as the portfolio
 *     changes, same as the price sync this project already tracks.
 *
 * Two real findings were deliberately left out rather than generalised:
 * "Pets allowed" and "Doorman" each appear on exactly one Costa del Sol
 * listing (Oaks&Thistle Calahonda Golf; Luxury Escape Los Flamingos). Turning
 * a single property's amenity into a portfolio-wide FAQ claim is the same
 * mistake as the frozen-price story elsewhere in this repo — true for one,
 * stated as if true for all.
 *
 * The one owner-facing item at the end mirrors the existing "Own a Property?"
 * section already on this page rather than adding a new crossover.
 *
 * Also carries `FAQPage` JSON-LD (see Index.tsx) — question/answer pairs are
 * the single format answer engines extract most directly, which is why the
 * geography-specific items exist at all: "how far is Marbella from Málaga
 * airport" and "villas near Puerto Banús" are real queries a prospective
 * guest researching the Costa del Sol actually asks a search engine or an AI
 * assistant, unlike generic questions about how booking works.
 */
export const FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: "Where are your properties?",
    answer:
      "Along the Costa del Sol — Marbella, the Los Flamingos golf area near Puerto Banús, Río Real, Calahonda, Fuengirola, Torremolinos and Málaga city — plus Vienna and Carinthia in Austria.",
  },
  {
    question: "How far are the properties from Málaga Airport?",
    answer:
      "It depends on the property: as close as 5 km from the beachfront apartments in Torremolinos, up to around 50 km for Marbella and the Los Flamingos area. Most of the Costa del Sol portfolio is within 30 km of Málaga (AGP), and several Marbella-area villas are also within 10 km of Puerto Banús.",
  },
  {
    question: "Can I work from the property during my stay?",
    answer:
      "Yes — every property has WiFi and a laptop-friendly workspace, so running things remotely during your stay isn't a compromise.",
  },
  {
    question: "Do any properties have a private pool?",
    answer:
      "Some do. A handful of our Costa del Sol villas have their own private pool — it's noted on that property's page, since it isn't standard across the portfolio.",
  },
  {
    question: "What's check-in like?",
    answer:
      "Self check-in, on your schedule. Your key-box code is sent before you travel, so there's no host to coordinate a handover with.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "It varies by property and rate plan, and is shown clearly before you confirm your booking — never after.",
  },
  {
    question: "Do you also manage properties for owners?",
    answer:
      "Yes. If you own a property here or in Austria, see how our management works and what it could earn.",
  },
];

/**
 * The lead-in sentence for the last FAQ item, rendered before the link to
 * /property-management. Kept as its own constant rather than trimmed out of
 * `FAQ_ITEMS[last].answer` at render time, so the JSON-LD text (which needs
 * the full sentence, since schema has no concept of a link) and the on-page
 * text can't drift apart from a fragile string match.
 */
const OWNER_ANSWER_LEAD_IN = "Yes. If you own a property here or in Austria,";

interface FAQProps {
  /** Empty string hides the eyebrow entirely — the PM page has no use for one. */
  eyebrow?: string;
  heading?: string;
}

const FAQ = ({ eyebrow: eyebrowProp = "Questions", heading: headingProp = "Before you book." }: FAQProps = {}) => {
  const [eyebrow, setEyebrow] = useState(eyebrowProp);
  const [heading, setHeading] = useState(headingProp);

  return (
    <section id="faq" className="py-24 md:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Same silver-shimmer material as the property-management hero
            panel (`.bg-silver-shimmer` in index.css) — the two are meant to
            read as the same design element reappearing, not two separately
            invented "light section" treatments. */}
        <div className="bg-silver-shimmer max-w-3xl mx-auto rounded-[2rem] px-6 py-10 md:px-12 md:py-14 shadow-soft">
          {/* Above the sheen overlay (`.bg-silver-shimmer::before`), which is
              itself positioned and would otherwise paint over in-flow
              content — this keeps the questions and answers at full
              contrast regardless. */}
          <div className="relative z-10">
            <div className="mb-12">
              {eyebrow && (
                <EditableText
                  id="faq-eyebrow"
                  value={eyebrow}
                  onChange={setEyebrow}
                  as="span"
                  className="t-meta block text-accent-strong mb-4"
                >
                  {eyebrow}
                </EditableText>
              )}
              <EditableText
                id="faq-heading"
                value={heading}
                onChange={setHeading}
                as="h2"
                className="t-section text-primary"
              >
                {heading}
              </EditableText>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-primary/15"
                >
                  <AccordionTrigger className="t-item text-primary text-left hover:no-underline py-6">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="t-body text-foreground/70 pb-6">
                    {index === FAQ_ITEMS.length - 1 ? (
                      <span className="flex flex-wrap items-center gap-2">
                        {OWNER_ANSWER_LEAD_IN}
                        <Link
                          to="/property-management"
                          className="inline-flex items-center gap-1.5 text-accent-strong font-semibold hover:gap-2.5 transition-all"
                        >
                          see how it works
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </span>
                    ) : (
                      item.answer
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
