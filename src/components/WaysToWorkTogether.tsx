import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack, Panel } from "./layout";

/**
 * The commercial decision, stated as a decision.
 *
 * This used to be an editorial spread rather than two product cards (§20,
 * §22 of the original brief): a gold rule opening and closing the pair, a
 * thin rule between the two rows, the model name in a left column with the
 * terms in the right — on the reasoning that cards side by side say "two
 * things you could buy", while Full-service management and Guaranteed Income
 * are mutually exclusive, so "one choice, two answers" fit better as two
 * rows sharing one set of rules than as two cards.
 *
 * Almedin asked for the card treatment back regardless — the site-wide "1b"
 * container (docs/DESIGN.md §11) now covers exactly this kind of side-by-side
 * comparison, and by his own account the two-rows-not-cards distinction was
 * reading as more inconsistency (why do these two get special treatment when
 * the six system steps and the two Renovations/Investments paths are boxed)
 * than as a meaningful signal. The A/B letter mark stays — it is still a
 * choice, not a sequence — now as the opening mark inside each card instead
 * of the left column of a shared row.
 *
 * Renovations and Investments used to nest inside the Guaranteed Income row
 * here, indented behind a gold rule. They are their own section now
 * (`RenovationsAndInvestments`), directly underneath, connected by copy
 * ("before you hand it over") rather than by indentation.
 */
const WaysToWorkTogether = () => {
  const [eyebrow, setEyebrow] = useState("How we work together");
  const [heading, setHeading] = useState("Two ways to start to work with us.");

  const [models, setModels] = useState([
    {
      name: "Full-service management",
      summary: "We run the property and you earn what it earns.",
      detail: "Your income moves with the season, the market and how well the home performs. In a strong year you keep the upside.",
      href: "",
      linkText: "",
    },
    {
      name: "Guaranteed income",
      summary: "We lease the property from you and pay a fixed amount every month.",
      detail: "Booked or empty, the payment is the same, and we maintain the home throughout. You trade the strong months for certainty in the weak ones.",
      href: "/guaranteed-income",
      linkText: "See how it works",
    },
  ]);

  return (
    <Section id="ways-to-work" size="lg">
      <Stack gap="lg">
        <div className="max-w-3xl mx-auto text-center space-y-sm">
          <EditableText
            id="ways-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="span"
            className="block t-meta text-accent-strong"
          >
            {eyebrow}
          </EditableText>
          <EditableText
            id="ways-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-primary text-balance"
          >
            {heading}
          </EditableText>
        </div>

        <Grid cols={2}>
          {models.map((model, index) => (
            <Panel key={index}>
              <Stack gap="sm">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-accent-strong t-meta text-accent-strong shrink-0">
                    {index === 0 ? "A" : "B"}
                  </span>
                  <EditableText
                    id={`ways-model-name-${index}`}
                    value={model.name}
                    onChange={(v) => { const u = [...models]; u[index] = { ...u[index], name: v }; setModels(u); }}
                    as="h3"
                    className="t-block text-primary text-balance"
                  >
                    {model.name}
                  </EditableText>
                </div>

                <EditableText
                  id={`ways-model-summary-${index}`}
                  value={model.summary}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], summary: v }; setModels(u); }}
                  as="p"
                  multiline
                  className="t-item text-primary"
                >
                  {model.summary}
                </EditableText>
                <EditableText
                  id={`ways-model-detail-${index}`}
                  value={model.detail}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], detail: v }; setModels(u); }}
                  as="p"
                  multiline
                  className="t-body text-foreground/70"
                >
                  {model.detail}
                </EditableText>

                {model.href && (
                  <Link
                    to={model.href}
                    className="inline-flex items-center gap-1.5 t-meta text-accent-strong hover:gap-2.5 transition-all"
                  >
                    {model.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </Stack>
            </Panel>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
};

export default WaysToWorkTogether;
