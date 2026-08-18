import { useState } from "react";
import { Link } from "react-router-dom";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Stack } from "./layout";

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
    <Section id="faq" size="md" measure="wide">
      <Stack gap="lg">
        <div className="space-y-sm">
          {eyebrow && (
            <EditableText
              id="faq-eyebrow"
              value={eyebrow}
              onChange={setEyebrow}
              as="span"
              className="t-meta block text-accent-strong"
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

        {/* Hairlines and a gold +/− rather than the shadcn Accordion's boxed
            chevron — the design-reference mockup for this section (the one
            exception to "don't copy the mockup"; see docs/DECISIONS.md §12)
            gets this right, and it is what §6 asks for everywhere else on the
            site: a line above each item instead of a bordered, shadowed card.
            Built on the bare Radix primitive rather than `ui/accordion.tsx`
            because that wrapper hard-codes a rotating chevron; the a11y and
            the open/close animation come from Radix and the keyframes in
            tailwind.config.ts either way. */}
        <AccordionPrimitive.Root type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionPrimitive.Item
              key={index}
              value={`item-${index}`}
              className="border-t border-primary/15 last:border-b"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className="group flex w-full items-baseline justify-between gap-6 py-sm text-left"
                >
                  <span className="t-block text-primary">{item.question}</span>
                  {/* A genuine glyph swap, not a rotating chevron — Plus and
                      Minus stacked in the same box, toggled by the trigger's
                      own `data-state` the same way `ui/accordion.tsx` toggles
                      its chevron's rotation. */}
                  <span className="relative w-5 h-5 shrink-0 text-accent-strong">
                    <Plus className="absolute inset-0 w-5 h-5 group-data-[state=open]:opacity-0 transition-opacity" />
                    <Minus className="absolute inset-0 w-5 h-5 opacity-0 group-data-[state=open]:opacity-100 transition-opacity" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pb-sm max-w-3xl t-body text-foreground/70">
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
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </Stack>
    </Section>
  );
};

export default FAQ;
