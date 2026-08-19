import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { StatsRow } from "./Stats";
import { FEATURED_PROJECTS } from "./ProjectsSection";
import { Section, Grid, Stack, Divider, MediaFrame } from "./layout";

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
  const [eyebrow, setEyebrow] = useState("Built to perform");
  const [heading, setHeading] = useState("A Portfolio Built on Precision & Performance");
  const [benefitsHeading, setBenefitsHeading] = useState("The Benefits");
  const [casesLabel, setCasesLabel] = useState("What that looks like on three homes");
  const [ctaText, setCtaText] = useState("See what yours could earn");

  const [projects, setProjects] = useState(FEATURED_PROJECTS);
  const [beforeAfterLabel, setBeforeAfterLabel] = useState("Before and After");

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
          <div className="text-center space-y-xs">
            {/* The prominent heading Almedin asked for, sitting above the
                existing small-caps label rather than instead of it — "The
                Benefits" names the chapter, the label underneath still says
                specifically what these three cases are. */}
            <EditableText
              id="proof-benefits-heading"
              value={benefitsHeading}
              onChange={setBenefitsHeading}
              as="h3"
              className="t-block text-primary-foreground"
            >
              {benefitsHeading}
            </EditableText>
            <EditableText
              id="proof-cases-label"
              value={casesLabel}
              onChange={setCasesLabel}
              as="p"
              className="t-meta text-accent-on-primary"
            >
              {casesLabel}
            </EditableText>
          </div>

          <Grid cols={3}>
            {projects.map((project, index) => (
              <div key={index}>
                {/* Waiting on the owner's before/after photography — the one
                    item in docs/PROJECT.md B4 this section cannot fake.

                    Almedin asked for each placeholder to be swapped for that
                    property's real first photo, but the Supabase project
                    (odloyonqqsgnpxvqrrep) was paused when this was checked —
                    the query timed out rather than confirming or denying that
                    "Villa Hoyo 19" / "Soho Boho" / "Alpine Retreat" match real
                    listings. Left as placeholders rather than guessed; see
                    docs/PROJECT.md B4/B5 for the follow-up. */}
                <MediaFrame
                  id={`proof-case-image-${index}`}
                  note={`Before / after — ${project.title}`}
                  aspect="photo"
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
                    ["occupancy", "Occupancy", `proj-fp-occ-${index}`],
                    ["revenue", "Revenue", `proj-fp-rev-${index}`],
                    ["rating", "Rating", `proj-fp-rating-${index}`],
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
