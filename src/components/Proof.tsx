import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { StatsRow } from "./Stats";
import { FEATURED_PROJECTS } from "./ProjectsSection";
import { Section, Grid, Stack, Divider, MediaFrame } from "./layout";
import villaHoyo19 from "@/assets/villa-hoyo-19.webp";
import sohoBoho from "@/assets/soho-boho.webp";
import alpineRetreat from "@/assets/alpine-retreat.webp";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Real photographs, sourced from the owner's own Drive ("Listing Pictures"),
 * matched by folder name against the three case-study names — not guessed.
 * Villa Hoyo 19 is confirmed as the "2C" unit specifically (there are two,
 * 1A and 2C, and Almedin named 2C) — still on the exterior sunset shot from
 * §14, a direct-link replacement (`docs/DECISIONS.md §18`) failed to download
 * four times running and was not forced. Soho Boho and Alpine Retreat are both
 * on photos Almedin supplied directly by Drive link (§18): Soho Boho's is
 * still from the "pics bad quali" folder — the only material that exists for
 * this listing — but a brighter, better-composed shot than the one it
 * replaces; Alpine Retreat swapped its exterior chalet shot for a genuine
 * interior (the same unit, "Theresia", confirmed via its Drive folder name).
 */
const CASE_IMAGES = [villaHoyo19, sohoBoho, alpineRetreat];

/**
 * The evidence, in two registers: the portfolio at a glance, then three houses
 * with the numbers attached.
 *
 * It merges what used to be `Stats` and the second half of `ProjectsSection`
 * on this page. Both survive as components — the landing page still renders
 * the numbers on their own and /projects still renders the full chapter — but
 * on the owner page they were separated by four sections, so the scale and the
 * proof of it never met.
 *
 * "Our Destinations" does not come with them. It opened the old section at
 * display size and answered a question ("where do you operate") that an owner
 * with one specific house has already answered for themselves. Removing it is
 * decision R1 in docs/DESIGN.md §9, which had been waiting on exactly this
 * rebuild; the regions still exist in full on /projects.
 *
 * One green band from the numbers to the CTA, because the whole point is that
 * the case studies are the numbers, seen close up.
 */
const Proof = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("proof-eyebrow"));
  const [heading, setHeading] = useState(t("stats-title"));
  const [benefitsHeading, setBenefitsHeading] = useState(t("proof-benefits-heading"));
  const [casesLabel, setCasesLabel] = useState(t("proof-cases-label"));
  const [ctaText, setCtaText] = useState(t("proof-cta"));

  // FEATURED_PROJECTS (title/location/description/stats) isn't translated
  // yet — it's shared with /projects and is closer to verified case-study
  // data than generic marketing copy. See src/lib/translations.ts's
  // file-level scope note.
  const [projects, setProjects] = useState(FEATURED_PROJECTS);
  // Was "Before and After" — accurate once B4's renovation photography
  // arrives, wrong today: these are each property's current listing photos,
  // not a before/after pair. Swap the label back when the real pairs land.
  const [beforeAfterLabel, setBeforeAfterLabel] = useState(t("proj-fp-ba"));
  const [caseImages, setCaseImages] = useState(CASE_IMAGES);

  useEffect(() => {
    setEyebrow(t("proof-eyebrow"));
    setHeading(t("stats-title"));
    setBenefitsHeading(t("proof-benefits-heading"));
    setCasesLabel(t("proof-cases-label"));
    setCtaText(t("proof-cta"));
    setBeforeAfterLabel(t("proj-fp-ba"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updateCaseImage = (index: number, url: string) => {
    const u = [...caseImages]; u[index] = url; setCaseImages(u);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const u = [...projects]; u[index] = { ...u[index], [field]: value }; setProjects(u);
  };
  const updateStat = (index: number, field: string, value: string) => {
    const u = [...projects];
    u[index] = { ...u[index], stats: { ...u[index].stats, [field]: value } };
    setProjects(u);
  };

  return (
    <Section id="proof" tone="primary" size="lg" edge="both">
      <Stack gap="xl">
        <div className="max-w-3xl mx-auto text-center space-y-sm">
          <EditableText
            id="proof-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="span"
            className="block t-meta text-accent-on-primary"
          >
            {eyebrow}
          </EditableText>
          {/* Keeps the id it had as the Stats heading — same sentence, same
              job, one section further up the page. */}
          <EditableText
            id="stats-title"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-primary-foreground text-balance"
          >
            {heading}
          </EditableText>
        </div>

        <StatsRow />

        <Stack gap="lg">
          {/* Eyebrow-then-heading, the order every other header on the site
              uses (SectionIntro) — this one had drifted to heading-then-label
              because "The Benefits" was added after the fact rather than
              designed in from the start. Fixed, and "The Benefits" is now
              t-section: the same size as "A Portfolio Built on..." above it,
              not a size down (t-block), so the two read as equally weighted
              chapter headings rather than one looking like a subheading of
              the other. */}
          <div className="text-center space-y-sm">
            <EditableText
              id="proof-cases-label"
              value={casesLabel}
              onChange={setCasesLabel}
              as="span"
              className="block t-meta text-accent-on-primary"
            >
              {casesLabel}
            </EditableText>
            <EditableText
              id="proof-benefits-heading"
              value={benefitsHeading}
              onChange={setBenefitsHeading}
              as="h3"
              className="t-section text-primary-foreground text-balance"
            >
              {benefitsHeading}
            </EditableText>
          </div>

          <Grid cols={3}>
            {projects.map((project, index) => (
              <div key={index}>
                {/* Real photos, not the owner's actual before/after pairs —
                    docs/PROJECT.md B4 (renovation before/after shots) is
                    still open, the client hasn't supplied those. These are
                    each property's own current listing photography, sourced
                    from the "Listing Pictures" Drive and matched by folder
                    name (see docs/DECISIONS.md §14) after Supabase stayed
                    unreachable for confirming the match by database lookup. */}
                <MediaFrame
                  id={`proof-case-image-${index}`}
                  src={caseImages[index]}
                  onChange={(url) => updateCaseImage(index, url)}
                  alt={`${project.title}, a Frontier Residences managed property`}
                  note={`Featured property — ${project.title}`}
                  aspect="square"
                  onPrimary
                />
                <EditableText
                  id={`proj-fp-ba-${index}`}
                  value={beforeAfterLabel}
                  onChange={setBeforeAfterLabel}
                  as="p"
                  className="t-meta text-accent-on-primary mt-xs mb-sm"
                >
                  {beforeAfterLabel}
                </EditableText>

                {/* The short gold bar, not the full-width hairline: this
                    opens one card's own text block rather than separating
                    rows in a list, which is exactly the distinction
                    Divider's `bar` tone exists to carry. */}
                <Divider tone="bar" onPrimary className="mb-sm" />

                <EditableText
                  id={`proj-fp-title-${index}`}
                  value={project.title}
                  onChange={(v) => updateProject(index, "title", v)}
                  as="h3"
                  className="t-block text-primary-foreground mb-1"
                >
                  {project.title}
                </EditableText>
                <EditableText
                  id={`proj-fp-loc-${index}`}
                  value={project.location}
                  onChange={(v) => updateProject(index, "location", v)}
                  as="p"
                  className="t-meta text-accent-on-primary mb-sm"
                >
                  {project.location}
                </EditableText>
                <EditableText
                  id={`proj-fp-desc-${index}`}
                  value={project.description}
                  onChange={(v) => updateProject(index, "description", v)}
                  as="p"
                  multiline
                  className="t-body text-primary-foreground/80 mb-sm"
                >
                  {project.description}
                </EditableText>

                {/* The three numbers carry the result; §5 of DECISIONS is why
                    no sentence next to them repeats it. */}
                <div className="flex flex-wrap gap-x-md gap-y-xs">
                  {([
                    ["occupancy", t("proof-stat-occupancy"), `proj-fp-occ-${index}`],
                    ["revenue", t("proof-stat-revenue"), `proj-fp-rev-${index}`],
                    ["rating", t("proof-stat-rating"), `proj-fp-rating-${index}`],
                  ] as const).map(([key, label, id]) => (
                    <div key={key}>
                      <EditableText
                        id={id}
                        value={project.stats[key]}
                        onChange={(v) => updateStat(index, key, v)}
                        as="p"
                        className="t-block text-accent-on-primary tabular-nums"
                      >
                        {project.stats[key]}
                      </EditableText>
                      <p className="t-meta text-primary-foreground/65 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Grid>
        </Stack>

        {/* The analysis stays on its own page (DECISIONS §2): /evaluate is the
            one that carries the consultation form under the result. */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold px-8 py-6 text-base"
          >
            <Link to="/evaluate">
              <EditableText id="proof-cta" value={ctaText} onChange={setCtaText} as="span">
                {ctaText}
              </EditableText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </Stack>
    </Section>
  );
};

export default Proof;
