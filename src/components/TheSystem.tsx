import { useState } from "react";
import { BarChart3, DollarSign, Globe, Home, Image, MessageSquare, type LucideIcon } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, SectionIntro, Stack, Panel, Grid, Divider } from "./layout";
import platformConnections from "@/assets/platform-connections.webp";

/**
 * The heart of the owner page: everything Frontier does, once, in the order it
 * happens to a property — listing, pricing, distribution, guests, care,
 * reporting.
 *
 * It replaces three sections that each told a slice of the same story and
 * overlapped badly: `FinancialPerformance` (the money), `WhyItMakesADifference`
 * (the technology) and `ListingWorkflow` (the day to day). Between them, seven
 * services were explained up to three times — the exact redundancy
 * docs/DECISIONS.md §4 made a rule about, which had crept back in as three
 * sections rather than three paragraphs.
 *
 * Laid out on a single gold thread threading through six `<Panel>`s, one per
 * step — a reversal of the section's first cut, which ran the six as bare
 * text on a hairline specifically to avoid "six products" (DESIGN.md §6).
 * Almedin asked for the boxed treatment back for exactly this kind of
 * side-by-side, scanned content (docs/DESIGN.md §11, the "1b" container), so
 * the thread now runs past six bordered cards instead of six plain blocks —
 * still one operation, not six products, because the thread and the shared
 * numbering carry that reading even with the boxes back.
 *
 * The thread and its markers are desktop only. On a phone the steps stack into
 * one column anyway, and a decorative rail down the left would cost a quarter
 * of the reading width to say something the numbers already say.
 *
 * The copy below is the second full rewrite of this section (docs/DECISIONS.md
 * §14). The six labels — Optimal Listing, Dynamic Pricing, Advertised
 * Everywhere, Guest Management, Property Care, Transparent Reporting — are the
 * one constant that survived both rewrites and stay as the heading of each
 * step. The sentences under them are new marketing copy this time, explicitly
 * supplied and approved by Almedin rather than lifted from a Claude Design
 * screenshot (the sperrklausel this round opened with) — including "Live
 * dashboards" in step 6, which the first rewrite deliberately avoided before
 * an owner dashboard was confirmed to be real.
 */

interface Step {
  /** The heading, e.g. "Optimal listing" — verbatim, kept across rewrites. */
  label: string;
  /** What it means, one sentence. */
  body: string;
  /** Ids of the EditableTexts. New this round: the sentences themselves are
      new copy, not a relocated one, so these are fresh ids rather than ones
      inherited from a retired component (docs/PROJECT.md tracks why). */
  bodyId: string;
  /** The mark in the spine circle for this step — gold, 1.5 stroke, inside
      the ring rather than beside it, so the ring stays the one marker per
      step instead of growing a second element next to it. */
  Icon: LucideIcon;
}

const TheSystem = () => {
  const [steps, setSteps] = useState<Step[]>([
    {
      label: "Optimal Listing",
      body: "Professional listings built to attract more guests and turn every property into a high-performing asset.",
      bodyId: "sys-body-0",
      Icon: Image,
    },
    {
      label: "Dynamic Pricing",
      body: "Real-time market analysis and automated rate adjustments to capture the best available revenue.",
      bodyId: "sys-body-1",
      Icon: DollarSign,
    },
    {
      label: "Advertised Everywhere",
      body: "Your property stays visible across major booking platforms, with listings continuously optimized and updated.",
      bodyId: "sys-body-2",
      Icon: Globe,
    },
    {
      label: "Guest Management",
      body: "AI-supported multilingual communication handles bookings, arrivals and guest requests before they become your problem.",
      bodyId: "sys-body-3",
      Icon: MessageSquare,
    },
    {
      label: "Property Care",
      body: "Smart cleaning, maintenance and operational coordination keep your property ready for every arrival.",
      bodyId: "sys-body-4",
      Icon: Home,
    },
    {
      label: "Transparent Reporting",
      // "Live dashboards" — deliberately avoided in the first rewrite
      // (docs/DECISIONS.md, "Owner-Dashboard bestätigt") because no owner
      // dashboard existed. The client has since confirmed one is real or
      // planned, so the claim is accurate again.
      body: "Live dashboards and detailed reporting give you a clear view of bookings, performance and operations.",
      bodyId: "sys-body-5",
      Icon: BarChart3,
    },
  ]);

  // The closing line under the gold rule — new copy this round, replacing
  // the five-tag outcome list ("Higher occupancy" etc.) the first rewrite
  // used to close the section.
  const [closingLine, setClosingLine] = useState(
    "We don't just manage homes.\nWe engineer high-performance assets."
  );

  const updateStep = (index: number, field: "label" | "body", value: string) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: value };
    setSteps(next);
  };

  return (
    <Section id="the-system" size="lg">
      <Stack gap="xl">
        <SectionIntro
          idPrefix="wid"
          eyebrow="AI-driven hospitality & operations"
          heading={"Less for you to manage.\nMore for your property to earn."}
          headingBreak
          lead="One integrated AI-driven system gives us full control of your property — from pricing and guest communication to maintenance, operations and reporting."
          measure="wide"
        />

        {/* `relative` is the anchor for the thread and the markers. Both are
            absolutely positioned, which §8 asks to avoid — justified here
            because they are ornament: if either failed to position, every
            word would still be exactly where it is.

            gap-md (28→40px), not the old space-y-xl (56→96px): once each step
            became its own bordered Panel, the old gap was doing two jobs at
            once — separating items AND giving the un-boxed text room to
            breathe. The Panel's own padding does the second job now, so the
            gap between panels could come down to the tighter figure Almedin
            asked for. */}
        <ol className="relative space-y-md">
          <div
            className="hidden md:block absolute left-[23px] top-6 bottom-6 w-px spine-gold"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const Icon = step.Icon;
            return (
              <li key={index} className="relative md:pl-16">
                {/* Sits at x=0..48 while the text starts at x=64, so the
                    marker centre (24px) lands exactly on the thread above.
                    top-[18px] keeps that centre roughly level with the
                    heading's cap-height, now that the ring itself is taller.

                    Icon grown from 14px to 24px — matching the icon size used
                    everywhere else content sits in a Panel (RenovationsAndInvestments,
                    GuestManagement), rather than the small mark it launched
                    with. The ring grew with it (24px → 48px) so the icon
                    still reads as sitting inside a frame instead of
                    overflowing one. */}
                <span
                  className="hidden md:flex absolute left-0 top-[18px] w-12 h-12 rounded-full border border-accent bg-background items-center justify-center"
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6 text-accent-strong" strokeWidth={1.5} />
                </span>

                <Panel>
                  {/* The number is structure, not copy — it stays outside the
                      editable span so the client edits "Optimal Listing" and
                      cannot accidentally renumber the sequence. */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="t-meta text-foreground/40 shrink-0" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <EditableText
                      id={`sys-label-${index}`}
                      value={step.label}
                      onChange={(v) => updateStep(index, "label", v)}
                      as="h3"
                      className="t-block text-primary text-balance"
                    >
                      {step.label}
                    </EditableText>
                  </div>

                  {/* Step 3 alone splits into text + the complete distribution
                      illustration, on Almedin's direction: the whole graphic,
                      not logos cropped out of it. */}
                  {index === 2 ? (
                    <Grid className="items-center" gap="sm">
                      <div className="md:col-span-7">
                        <EditableText
                          id={step.bodyId}
                          value={step.body}
                          onChange={(v) => updateStep(index, "body", v)}
                          as="p"
                          multiline
                          className="t-body text-foreground/70 max-w-2xl"
                        >
                          {step.body}
                        </EditableText>
                      </div>
                      <img
                        src={platformConnections}
                        alt="Frontier Residences distributed across Airbnb, Booking.com, Google, Tripadvisor, Vrbo and Expedia"
                        className="md:col-span-5 w-full max-w-xs mx-auto"
                      />
                    </Grid>
                  ) : (
                    <EditableText
                      id={step.bodyId}
                      value={step.body}
                      onChange={(v) => updateStep(index, "body", v)}
                      as="p"
                      multiline
                      className="t-body text-foreground/70 max-w-2xl"
                    >
                      {step.body}
                    </EditableText>
                  )}
                </Panel>
              </li>
            );
          })}
        </ol>

        {/* The closing line — italic, under the gold rule, the section's own
            signature rather than a checklist of outcomes. */}
        <div className="max-w-3xl mx-auto text-center">
          <Divider tone="gold" className="mb-md" />
          <EditableText
            id="sys-closing-line"
            value={closingLine}
            onChange={setClosingLine}
            as="p"
            multiline
            className="t-block italic text-primary whitespace-pre-line"
          >
            {closingLine}
          </EditableText>
        </div>
      </Stack>
    </Section>
  );
};

export default TheSystem;
