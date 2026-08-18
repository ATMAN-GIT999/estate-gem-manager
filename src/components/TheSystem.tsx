import { useState } from "react";
import EditableText from "./admin/EditableText";
import { Section, SectionIntro, Stack, Divider } from "./layout";

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
 * sections rather than three paragraphs. Almost nothing here is new writing;
 * the sentences are the surviving ones, collected under the step they belong
 * to. The ids they carry are the ids they had.
 *
 * Laid out on a single gold thread rather than a card grid, because six equal
 * boxes say "six products" and this is one operation with six parts. The rule
 * above each step and the numbered marker do the work a border used to
 * (DESIGN.md §6).
 *
 * The thread and its markers are desktop only. On a phone the steps stack into
 * one column anyway, and a decorative rail down the left would cost a quarter
 * of the reading width to say something the numbers already say.
 *
 * Each step used to carry two headings: this label as a small-caps eyebrow,
 * and a separate invented headline underneath it ("Your home, shown at its
 * best.", "Priced against the live market." …) that came from the Claude
 * Design mockup, not from the reviewed content. Per Almedin's correction
 * (docs/DECISIONS.md §12), the invented headlines are gone and the label
 * itself — Optimal listing, Dynamic pricing, Advertised everywhere, Guest
 * management, Property care, Transparent reporting — is now the only
 * heading, promoted to `t-block` size. The six words are the verified list;
 * do not reintroduce a second, styled-up title next to them.
 */

interface Step {
  /** The heading, e.g. "Optimal listing" — verbatim, see the note below. */
  label: string;
  /** What it means, one sentence. */
  body: string;
  /** An optional second sentence — one thought per line, never a paragraph. */
  note?: string;
  /** Ids of the EditableTexts, kept from wherever the sentence used to live. */
  bodyId: string;
  noteId?: string;
}

/**
 * The platforms, as words rather than logos.
 *
 * The brief asked for the marks lifted out of `platform-connections.webp`
 * (§2, step 3). That file is a single flat illustration of logos wired to a
 * hub — there are no separate logo assets behind it, and cutting them out of
 * a raster would leave us redistributing eleven companies' trademarks at
 * whatever quality survived the crop. Set as text they cost no asset, carry
 * no trademark question, and match the "fewer boxes" register better than a
 * row of white tiles would.
 */
const PLATFORMS = ["Airbnb", "Booking.com", "Google", "Tripadvisor", "Vrbo", "Expedia"];

const TheSystem = () => {
  const [steps, setSteps] = useState<Step[]>([
    {
      label: "Optimal listing",
      body: "Your home will be advertised with inviting, clear photos and clear text.",
      bodyId: "listing-workflow-desc-0",
    },
    {
      label: "Dynamic pricing",
      body: "Rates adjusted automatically, several times a day.",
      bodyId: "fin-pillar-desc-0",
      note: "Priced against live hotel and Airbnb market data.",
      noteId: "fin-pillar-desc-1",
    },
    {
      label: "Advertised everywhere",
      body: "Your property advertised on all major platforms. We keep listings updated for maximum visibility.",
      bodyId: "pm-listing-desc",
    },
    {
      label: "Guest management",
      body: "Every enquiry, booking, arrival and complaint comes to us, not to you.",
      bodyId: "wid-guest-desc",
      note: "Automated multilingual guest communication.",
      noteId: "wid-feature-1",
    },
    {
      label: "Property care",
      body: "Your home is cleaned and inspected after every stay, before the next arrival.",
      bodyId: "wid-property-desc",
      note: "We advise you on insurance and legislation relating to the home, and handle traveller registration and compliance.",
      noteId: "listing-workflow-desc-3",
    },
    {
      label: "Transparent reporting",
      /* NOT "plus a live dashboard anytime", which is what this line said for
         as long as it lived in FinancialPerformance, and not the mockup's
         "full visibility anytime" either. There is no owner dashboard: the
         entire public site contains one tracking call (docs/PROJECT.md, D6).
         The statement is real and detailed, so it is what we claim. */
      body: "Monthly statement, with every booking and every cost itemised.",
      bodyId: "fin-pillar-desc-2",
    },
  ]);

  // The line that used to close the technology section, then the money one.
  // It is the outcome of all six steps, so it closes all six.
  const [outcomes, setOutcomes] = useState([
    "Higher occupancy",
    "Better nightly rates",
    "Faster responses",
    "Zero operational gaps",
    "Increased long-term value",
  ]);

  const updateStep = (index: number, field: keyof Step, value: string) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: value };
    setSteps(next);
  };

  return (
    <Section id="the-system" size="lg">
      <Stack gap="xl">
        <SectionIntro
          idPrefix="wid"
          eyebrow="One team, every part of it"
          heading="Less for you to manage. More for your property to earn."
          lead="One integrated system gives us full control of your portfolio, so every guest, every price and every euro is handled before it becomes your problem."
        />

        {/* `relative` is the anchor for the thread and the markers. Both are
            absolutely positioned, which §8 asks to avoid — justified here
            because they are ornament: if either failed to position, every
            word would still be exactly where it is. */}
        <ol className="relative space-y-xl">
          <div
            className="hidden md:block absolute left-[11px] top-6 bottom-6 w-px spine-gold"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <li key={index} className="relative md:pl-16">
              {/* Sits at x=0..24 while the text starts at x=64, so the marker
                  centre (12px) lands exactly on the thread above. */}
              <span
                className="hidden md:flex absolute left-0 top-4 w-6 h-6 rounded-full border border-accent bg-background"
                aria-hidden="true"
              />

              <Divider className="mb-sm" />

              {/* The number is structure, not copy — it stays outside the
                  editable span so the client edits "Optimal listing" and
                  cannot accidentally renumber the sequence. `items-baseline`
                  lines the small numeral up with the heading's baseline
                  rather than its cap-height, which is what a plain
                  `items-center` produces between an 11px and a 28px line. */}
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

              {step.note && step.noteId && (
                <EditableText
                  id={step.noteId}
                  value={step.note}
                  onChange={(v) => updateStep(index, "note", v)}
                  as="p"
                  multiline
                  className="t-body text-foreground/70 max-w-2xl mt-2"
                >
                  {step.note}
                </EditableText>
              )}

              {/* The one place in this section that shows rather than states.
                  It belongs to distribution and nowhere else. */}
              {index === 2 && (
                <ul className="flex flex-wrap items-center gap-x-md gap-y-xs mt-sm">
                  {PLATFORMS.map((platform) => (
                    <li key={platform} className="t-meta text-foreground/45">
                      {platform}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>

        {/* What the six add up to, as one quiet line rather than a checklist
            with five ticks — the outcome of the section, not a seventh step. */}
        <div className="max-w-3xl mx-auto text-center">
          <Divider tone="gold" className="mb-md" />
          <ul className="flex flex-wrap justify-center gap-x-md gap-y-xs">
            {outcomes.map((outcome, index) => (
              <li key={index} className="t-meta text-accent-strong">
                <EditableText
                  id={`fin-outcome-${index}`}
                  value={outcome}
                  onChange={(v) => { const u = [...outcomes]; u[index] = v; setOutcomes(u); }}
                  as="span"
                >
                  {outcome}
                </EditableText>
              </li>
            ))}
          </ul>
        </div>
      </Stack>
    </Section>
  );
};

export default TheSystem;
