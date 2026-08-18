import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack, Divider, MediaFrame } from "./layout";

/**
 * The two routes that are not "manage my house" — a property that needs work
 * first, and an owner who does not own here yet.
 *
 * They used to be indented under Guaranteed Income in `WaysToWorkTogether`,
 * which stated their relationship precisely and cost that section its balance
 * (see the note there). Out here they get room for a picture each, which is
 * what they need most: both are arguments about what a place could look like.
 *
 * Deliberately after the two models, not before. §21 of the owner brief and
 * DECISIONS §2 both put Investments last on this page — it targets an investor
 * looking to buy, which is a different person from the owner the rest of the
 * page is written for, and moving it up would interrupt them.
 *
 * Two of the four sentences here are the ones that were indented under
 * Guaranteed Income, ids included. The Croatia mention in the second is not
 * incidental: Croatia is a market Frontier helps people buy in, not one it
 * manages in (PROJECT.md §1), and "in our regions" would flatten exactly that
 * distinction.
 */
const RenovationsAndInvestments = () => {
  const [paths, setPaths] = useState([
    {
      label: "Renovations & Design",
      title: "Your property deserves a make-over before you hand it over.",
      description: "Timeless Mediterranean interiors, run start to finish, before the lease begins.",
      href: "/renovations",
      linkText: "See what we do",
      note: "Renovation — before / after of a completed interior",
    },
    {
      label: "Investments",
      title: "Not a homeowner here yet? We'll help you find one worth managing.",
      description: "Curated acquisitions across Spain, Austria and Croatia for owners building a portfolio.",
      href: "/investments",
      linkText: "See what we look for",
      note: "Investment — an acquisition-grade property, exterior",
    },
  ]);

  const update = (index: number, field: string, value: string) => {
    const u = [...paths]; u[index] = { ...u[index], [field]: value }; setPaths(u);
  };

  return (
    // `md`, not `lg`. These are the two side doors, not a third offer — and
    // the section above them is already `lg`, so two large bands in a row put
    // ~280px of nothing between the Guaranteed Income row and the first
    // picture, which reads as the page having ended.
    <Section id="renovations-investments" size="md">
      <Grid cols={2}>
        {paths.map((path, index) => (
          <Stack key={index} gap="sm">
            <MediaFrame
              id={`beyond-image-${index}`}
              note={path.note}
              aspect="wide"
            />

            <div>
              <Divider className="mb-sm" />
              <EditableText
                id={`ways-sub-title-${index}`}
                value={path.label}
                onChange={(v) => update(index, "label", v)}
                as="span"
                className="block t-meta text-accent-strong mb-2"
              >
                {path.label}
              </EditableText>
              <EditableText
                id={`beyond-title-${index}`}
                value={path.title}
                onChange={(v) => update(index, "title", v)}
                as="h3"
                className="t-block text-primary text-balance mb-2"
              >
                {path.title}
              </EditableText>
              <EditableText
                id={`ways-sub-desc-${index}`}
                value={path.description}
                onChange={(v) => update(index, "description", v)}
                as="p"
                multiline
                className="t-body text-foreground/70"
              >
                {path.description}
              </EditableText>
            </div>

            <Link
              to={path.href}
              className="inline-flex items-center gap-1.5 t-meta text-accent-strong hover:gap-2.5 transition-all"
            >
              {path.linkText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Stack>
        ))}
      </Grid>
    </Section>
  );
};

export default RenovationsAndInvestments;
