import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Stack } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

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
 *
 * `variant="owner"` (PropertyManagementPage.tsx) swaps in
 * `OWNER_FAQ_ITEMS` below instead of reusing this guest set with a
 * relabelled heading — the wireframe draws five real owner questions here,
 * not the guest FAQ again. Two of the five (term/notice, damage liability)
 * don't have a published number to state, the same situation the guest
 * cancellation-policy answer above is already in — so they say plainly that
 * it's agreed with you rather than inventing a figure (docs/PROJECT.md D11,
 * DECISIONS §38's "a made-up figure is worse than a lost lead"). The other
 * three are grounded in what's already true elsewhere on this page: the two
 * commercial models, the "one statement a month" cadence from TheSystem.tsx,
 * and self-use as a standard, low-risk part of onboarding.
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

/** The five owner questions from the 09/2026 wireframe's PM-page FAQ. English
 *  canonical text, same role `FAQ_ITEMS` plays for the guest set — used for
 *  `FAQPage` JSON-LD; the on-screen copy is the localised `faq-owner-q/a-N`
 *  keys below, picked up by index like the guest set. */
export const OWNER_FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: "Commission or fixed rent — which suits my house?",
    answer:
      "It depends on how much certainty you want. Guaranteed Income pays the same amount every month, occupied or not. Full-service management shares what the house actually earns, season by season. We'll recommend one once we've seen the property — not before.",
  },
  {
    question: "How long does this tie me in?",
    answer:
      "Term and notice are agreed with you before you sign, not fixed by us in advance — they're part of the proposal we send after seeing the house, not a number we publish upfront.",
  },
  {
    question: "Can I still use the house myself?",
    answer:
      "Yes. Tell us the dates you want to keep for yourself when we set things up, and we work the booking calendar around them.",
  },
  {
    question: "Who is liable for damage?",
    answer:
      "Guest damage runs through the booking platform's own guest protection or a security deposit, depending on the channel — we file and chase the claim, not you.",
  },
  {
    question: "When does the money arrive?",
    answer:
      "Monthly, on one consolidated statement — the same rhythm whether you're on Guaranteed Income or the commission model.",
  },
];

interface FAQProps {
  /** Empty string hides the eyebrow entirely — the PM page has no use for one. */
  eyebrow?: string;
  heading?: string;
  /** "owner" swaps in `OWNER_FAQ_ITEMS` and drops the guest→owner crossover
   *  on the last item — an owner reading this FAQ is already on the owner
   *  page, so the last question just answers itself like the other four. */
  variant?: "guest" | "owner";
}

const FAQ = ({ eyebrow: eyebrowProp, heading: headingProp, variant = "guest" }: FAQProps = {}) => {
  const { t, language } = useLocale();
  const isOwner = variant === "owner";
  const items = isOwner ? OWNER_FAQ_ITEMS : FAQ_ITEMS;
  const keyPrefix = isOwner ? "faq-owner" : "faq";

  // `??`, not `||`: the PM page passes eyebrow="" on purpose to hide it
  // entirely, and that explicit empty string must not be overridden by the
  // translated default the way a falsy-string check would.
  const [eyebrow, setEyebrow] = useState(eyebrowProp ?? t("faq-eyebrow"));
  const [heading, setHeading] = useState(
    headingProp ?? t(isOwner ? "faq-owner-heading" : "faq-heading")
  );

  useEffect(() => {
    if (eyebrowProp === undefined) setEyebrow(t("faq-eyebrow"));
    if (headingProp === undefined) setHeading(t(isOwner ? "faq-owner-heading" : "faq-heading"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, isOwner]);

  return (
    <Section id="faq" size="md" containerClassName="max-w-[820px] mx-auto">
      <Stack gap="sm">
        <div className="space-y-sm">
          {eyebrow && (
            <EditableText
              id="faq-eyebrow"
              value={eyebrow}
              onChange={setEyebrow}
              as="span"
              className="t-tag block text-accent-strong"
            >
              {eyebrow}
            </EditableText>
          )}
          <EditableText
            id="faq-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-foreground mb-[26px]"
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
          {items.map((_item, index) => {
            // Only the guest set's last item crosses over to the owner page
            // — an owner reading OWNER_FAQ_ITEMS is already there.
            const isCrossover = !isOwner && index === items.length - 1;
            return (
            <AccordionPrimitive.Item
              key={index}
              value={`item-${index}`}
              className="border-t border-border last:border-b"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className="group flex w-full items-center justify-between gap-6 py-[22px] text-left"
                >
                  <span className="t-item text-[18px] text-foreground">
                    {t(`${keyPrefix}-q-${index}` as TranslationKey)}
                  </span>
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
                <div className="pb-sm max-w-3xl t-body text-muted-foreground">
                  {isCrossover ? (
                    <span className="flex flex-wrap items-center gap-2">
                      {t("faq-owner-lead-in")}
                      <Link
                        to="/property-management"
                        className="inline-flex items-center gap-1.5 text-accent-strong font-semibold hover:gap-2.5 transition-all"
                      >
                        {t("faq-see-how-it-works")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </span>
                  ) : (
                    t(`${keyPrefix}-a-${index}` as TranslationKey)
                  )}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
            );
          })}
        </AccordionPrimitive.Root>
      </Stack>
    </Section>
  );
};

export default FAQ;
