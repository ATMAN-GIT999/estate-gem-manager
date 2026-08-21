import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import PageWrapper from "@/components/PageWrapper";
import aboutHero from "@/assets/about-hero.webp";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Section, Container, Grid, Stack, Panel } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/**
 * See docs/PROJECT.md C5 / the comment atop RenovationsPage.tsx — same
 * rebuild onto the shared layout system.
 *
 * The mission and story blocks lost their `<Card>` wrapper: both are prose to
 * be read, not items to be scanned side by side, which is the distinction
 * `Panel`'s own doc comment draws — a box on one and not the other read as an
 * accident, not a decision. "Why Choose Us" lost its per-item `bg-card` box
 * for the same reason DESIGN.md §6 gives everywhere else on the site: five
 * short claims in a row don't need five separate cards to be legible as a
 * list.
 */
const TEAM_NAMES = ["Alejandro Marinetto Rohr", "Lorenz Aschbacher", "Olek", "Julien"];
const PROCESS_STEP_NUMBERS = ["1", "2", "3", "4", "5"];

const AboutContent = () => {
  const { t, language } = useLocale();
  const [heroImage, setHeroImage] = useState(aboutHero);
  const [pageEyebrow, setPageEyebrow] = useState(t("about-page-eyebrow"));
  const [pageTitle, setPageTitle] = useState(t("about-page-title"));
  const [pageSubtitle, setPageSubtitle] = useState(t("about-page-subtitle"));
  const [missionTitle, setMissionTitle] = useState(t("about-mission-title"));
  const [missionText, setMissionText] = useState(t("about-mission-text"));
  const [storyTitle, setStoryTitle] = useState(t("about-story-title"));
  const [storyText1, setStoryText1] = useState(t("about-story-text1"));
  const [storyText2, setStoryText2] = useState(t("about-story-text2"));
  const [whyChooseTitle, setWhyChooseTitle] = useState(t("about-why-choose-title"));
  const [teamTitle, setTeamTitle] = useState(t("about-team-title"));
  const [teamSubtitle, setTeamSubtitle] = useState(t("about-team-subtitle"));
  const [howItWorksTitle, setHowItWorksTitle] = useState(t("about-how-it-works-title"));
  const [ctaButtonText, setCtaButtonText] = useState(t("about-cta-button"));

  const buildWhyChooseItems = () => [0, 1, 2, 3, 4].map((i) => t(`about-why-item-${i}` as TranslationKey));
  const [whyChooseItems, setWhyChooseItems] = useState(buildWhyChooseItems());

  // Team member names are never translated (personal names) — only role and
  // description come from the dictionary.
  const buildTeamMembers = () =>
    TEAM_NAMES.map((name, i) => ({
      name,
      role: t(`about-team-role-${i}` as TranslationKey),
      description: t(`about-team-desc-${i}` as TranslationKey),
    }));
  const [teamMembers, setTeamMembers] = useState(buildTeamMembers());

  const buildProcessSteps = () =>
    PROCESS_STEP_NUMBERS.map((step, i) => ({
      step,
      title: t(`about-step-title-${i}` as TranslationKey),
      description: t(`about-step-desc-${i}` as TranslationKey),
    }));
  const [processSteps, setProcessSteps] = useState(buildProcessSteps());

  useEffect(() => {
    setPageEyebrow(t("about-page-eyebrow"));
    setPageTitle(t("about-page-title"));
    setPageSubtitle(t("about-page-subtitle"));
    setMissionTitle(t("about-mission-title"));
    setMissionText(t("about-mission-text"));
    setStoryTitle(t("about-story-title"));
    setStoryText1(t("about-story-text1"));
    setStoryText2(t("about-story-text2"));
    setWhyChooseTitle(t("about-why-choose-title"));
    setTeamTitle(t("about-team-title"));
    setTeamSubtitle(t("about-team-subtitle"));
    setHowItWorksTitle(t("about-how-it-works-title"));
    setCtaButtonText(t("about-cta-button"));
    setWhyChooseItems(buildWhyChooseItems());
    setTeamMembers(buildTeamMembers());
    setProcessSteps(buildProcessSteps());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const updateProcessStep = (index: number, field: string, value: string) => {
    const updated = [...processSteps];
    updated[index] = { ...updated[index], [field]: value };
    setProcessSteps(updated);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="About Us"
        description="The team behind Frontier Residences — a boutique property management company operating luxury homes on the Costa del Sol and in Austria."
        path="/about"
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])}
      />
      <Navigation />
      <main className="flex-1 overflow-x-clip">
        {/* Hero Section — pt-20 clears the fixed header, same as every other
            photo hero on the site (Hero.tsx, OwnerHero.tsx). */}
        <div className="relative min-h-[60vh] flex items-center [align-items:safe_center] justify-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <EditableImage
              id="about-hero-image"
              src={heroImage}
              alt="A Frontier Residences property"
              onChange={setHeroImage}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Scrim. Darkest at the bottom, where the subheading sits, so the
                text stays legible even if the photo is swapped for a brighter
                one. Paired with the drop shadows below. */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/65" />
          </div>
          <Container measure="text" className="relative z-10 text-center py-lg">
            <EditableText id="about-page-eyebrow" value={pageEyebrow} onChange={setPageEyebrow} as="span" className="block t-meta text-accent-on-primary mb-sm drop-shadow-lg">{pageEyebrow}</EditableText>
            <EditableText id="about-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="t-display text-white mb-sm text-balance drop-shadow-2xl">{pageTitle}</EditableText>
            <EditableText id="about-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" className="t-body text-white/90 drop-shadow-lg">{pageSubtitle}</EditableText>
          </Container>
        </div>

        {/* Mission */}
        <Section size="lg">
          <Container measure="text" className="text-center">
            <EditableText id="about-mission-title" value={missionTitle} onChange={setMissionTitle} as="h2" className="t-section text-primary mb-md">{missionTitle}</EditableText>
            <EditableText id="about-mission-text" value={missionText} onChange={setMissionText} as="p" multiline className="t-body text-foreground/80">{missionText}</EditableText>
          </Container>
        </Section>

        {/* Our Story */}
        <Section size="lg" tone="muted">
          <Container measure="text" className="text-center">
            <EditableText id="about-story-title" value={storyTitle} onChange={setStoryTitle} as="h2" className="t-section text-primary mb-md">{storyTitle}</EditableText>
            <Stack gap="sm">
              <EditableText id="about-story-text1" value={storyText1} onChange={setStoryText1} as="p" multiline className="t-body text-foreground/80">{storyText1}</EditableText>
              <EditableText id="about-story-text2" value={storyText2} onChange={setStoryText2} as="p" multiline className="t-body text-foreground/80">{storyText2}</EditableText>
            </Stack>
          </Container>
        </Section>

        {/* Why Choose Us */}
        <Section size="lg">
          <Container measure="text">
            <EditableText id="about-why-choose-title" value={whyChooseTitle} onChange={setWhyChooseTitle} as="h2" className="t-section text-primary text-balance text-center mb-lg">{whyChooseTitle}</EditableText>
            <Grid cols={2} gap="sm">
              {whyChooseItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-strong shrink-0 mt-0.5" strokeWidth={1.5} />
                  <EditableText
                    id={`about-why-item-${index}`}
                    value={item}
                    onChange={(newValue) => {
                      const newItems = [...whyChooseItems];
                      newItems[index] = newValue;
                      setWhyChooseItems(newItems);
                    }}
                    as="p"
                    className="t-body text-foreground"
                  >{item}</EditableText>
                </div>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Team Section */}
        <Section size="lg" tone="muted">
          <Container measure="wide">
            <div className="text-center mb-lg">
              <EditableText id="about-team-title" value={teamTitle} onChange={setTeamTitle} as="h2" className="t-section text-primary mb-2">{teamTitle}</EditableText>
              <EditableText id="about-team-subtitle" value={teamSubtitle} onChange={setTeamSubtitle} as="p" className="t-body text-foreground/70 max-w-2xl mx-auto">{teamSubtitle}</EditableText>
            </div>
            <Grid cols={3} gap="md">
              {teamMembers.map((member, index) => (
                <Panel key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-sage rounded-full mx-auto mb-sm" aria-hidden="true" />
                  <EditableText
                    id={`about-team-name-${index}`}
                    value={member.name}
                    onChange={(v) => updateTeamMember(index, "name", v)}
                    as="h3"
                    className="t-block text-primary mb-1"
                  >{member.name}</EditableText>
                  <EditableText
                    id={`about-team-role-${index}`}
                    value={member.role}
                    onChange={(v) => updateTeamMember(index, "role", v)}
                    as="p"
                    className="t-meta text-accent-strong mb-sm"
                  >{member.role}</EditableText>
                  <EditableText
                    id={`about-team-desc-${index}`}
                    value={member.description}
                    onChange={(v) => updateTeamMember(index, "description", v)}
                    as="p"
                    className="t-body text-foreground/70"
                  >{member.description}</EditableText>
                </Panel>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* The Listing Process */}
        <Section size="lg">
          <Container measure="wide">
            <EditableText id="about-how-it-works-title" value={howItWorksTitle} onChange={setHowItWorksTitle} as="h2" className="t-section text-primary text-balance text-center mb-lg">{howItWorksTitle}</EditableText>
            <Grid cols={3} gap="md">
              {processSteps.map((item, index) => (
                <Panel key={index} className="text-center">
                  <span className="t-meta text-foreground/40 block mb-2" aria-hidden="true">{item.step.padStart(2, "0")}</span>
                  <EditableText
                    id={`about-step-title-${index}`}
                    value={item.title}
                    onChange={(v) => updateProcessStep(index, "title", v)}
                    as="h3"
                    className="t-block text-primary mb-2"
                  >{item.title}</EditableText>
                  <EditableText
                    id={`about-step-desc-${index}`}
                    value={item.description}
                    onChange={(v) => updateProcessStep(index, "description", v)}
                    as="p"
                    className="t-body text-foreground/70"
                  >{item.description}</EditableText>
                </Panel>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Only contact channel that exists on the site — same destination
            and same caveat as GuestManagement.tsx's "Contact us": the form
            asks for a property address as a required field, an owner's
            question. See docs/DECISIONS.md §32. */}
        <Section size="md" tone="muted">
          <Container measure="text" className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold px-8 py-6 text-base"
            >
              <a href="/property-management#get-in-touch">
                <EditableText id="about-cta-button" value={ctaButtonText} onChange={setCtaButtonText} as="span">
                  {ctaButtonText}
                </EditableText>
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

const About = () => (
  <PageWrapper slug="site--about">
    <AboutContent />
  </PageWrapper>
);

export default About;
