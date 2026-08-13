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
 * elsewhere so nothing here is a new claim:
 *   - booking review, self check-in, 24/7 reachability → GuestManagement.tsx
 *   - dynamic/live pricing → PropertyDetail.tsx, PropertyCard.tsx
 *   - cancellation terms varying per property → BookingSummary.tsx's
 *     `quote.cancellationPolicy`, which is genuinely per-listing, not fixed.
 * The one owner-facing item at the end mirrors the existing "Own a Property?"
 * section already on this page rather than adding a new crossover.
 *
 * Also carries `FAQPage` JSON-LD (see Index.tsx) — question/answer pairs are
 * the single format answer engines extract most directly.
 */
export const FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: "How does booking work?",
    answer:
      "Search by dates and guests, choose a home, and get a live quote for those exact dates. Every booking is reviewed by a person on our team before it's confirmed — not an automated instant-accept.",
  },
  {
    question: "Is the price I see final?",
    answer:
      "Rates are calculated per stay from real-time availability, not a fixed nightly price. You'll see the full breakdown — accommodation, fees and taxes — before you pay anything.",
  },
  {
    question: "What's check-in like?",
    answer:
      "Self check-in, on your schedule. Your key-box code is sent before you travel, so there's no host to coordinate a handover with.",
  },
  {
    question: "Can I reach someone during my stay?",
    answer:
      "Yes, at any hour. You're messaging the same team that manages the home you're staying in, not an outsourced call centre.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "It varies by property and rate plan, and is shown clearly before you confirm your booking — never after.",
  },
  {
    question: "Where are your properties?",
    answer:
      "Marbella and the Costa del Sol, Málaga, Vienna, and Carinthia — villas, city apartments and cabins.",
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

const FAQ = () => {
  const [eyebrow, setEyebrow] = useState("Questions");
  const [heading, setHeading] = useState("Before you book.");

  return (
    <section id="faq" className="py-24 md:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <EditableText
              id="faq-eyebrow"
              value={eyebrow}
              onChange={setEyebrow}
              as="span"
              className="t-meta block text-accent-strong mb-4"
            >
              {eyebrow}
            </EditableText>
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
    </section>
  );
};

export default FAQ;
