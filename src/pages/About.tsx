import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import PageWrapper from "@/components/PageWrapper";
import aboutHero from "@/assets/about-hero.webp";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Section, Container, Grid, Stack, Panel } from "@/components/layout";

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
const AboutContent = () => {
  const [heroImage, setHeroImage] = useState(aboutHero);
  const [pageEyebrow, setPageEyebrow] = useState("Who we are");
  const [pageTitle, setPageTitle] = useState("About Frontier Residences");
  const [pageSubtitle, setPageSubtitle] = useState("Premier property management across Europe's most desirable locations");
  const [missionTitle, setMissionTitle] = useState("Our Mission");
  const [missionText, setMissionText] = useState("Transform property ownership into effortless elegance through bespoke management. We combine international hospitality standards with local expertise to maximize your property's potential while ensuring exceptional guest experiences.");
  const [storyTitle, setStoryTitle] = useState("Our Story");
  const [storyText1, setStoryText1] = useState("Founded with a passion for luxury hospitality and real estate, Frontier Residences emerged from the recognition that property owners deserve more than standard management services. We saw an opportunity to bridge the gap between traditional property management and the personalized, high-touch service that discerning owners and guests expect.");
  const [storyText2, setStoryText2] = useState("Today, we manage a curated portfolio of exceptional properties across Spain's Costa del Sol and Austria's Alpine regions. Each property in our collection is treated with the same care and attention as if it were our own.");
  const [whyChooseTitle, setWhyChooseTitle] = useState("Why Choose Us");
  const [teamTitle, setTeamTitle] = useState("Meet the Team");
  const [teamSubtitle, setTeamSubtitle] = useState("Our diverse team brings together expertise in hospitality, real estate, technology, and business development.");
  const [howItWorksTitle, setHowItWorksTitle] = useState("How It Works");

  const [whyChooseItems, setWhyChooseItems] = useState([
    "Tailored management plans for each property",
    "International presence across Spain and Austria",
    "Transparent communication and detailed owner reporting",
    "End-to-end services from renovation to rental management",
    "Hotel-level hospitality with real estate expertise",
  ]);

  const [teamMembers, setTeamMembers] = useState([
    { name: "Alejandro Marinetto Rohr", role: "Co-Founder", description: "Real estate strategy, marketing, and design leadership." },
    { name: "Lorenz Aschbacher", role: "Co-Founder", description: "Business development, investment strategy, client relations, and scale & growth." },
    { name: "Olek", role: "Marketing", description: "Brand strategy, digital marketing, and demand generation." },
    { name: "Julien", role: "Guest Manager", description: "Guest experience, hospitality operations, and end-to-end stay management." },
  ]);

  const [processSteps, setProcessSteps] = useState([
    { step: "1", title: "Assessment", description: "Property evaluation and strategy." },
    { step: "2", title: "Preparation", description: "Photography and listing optimization." },
    { step: "3", title: "Launch", description: "Multi-platform listing and marketing." },
    { step: "4", title: "Management", description: "Guest service and maintenance." },
    { step: "5", title: "Reporting", description: "Transparent performance updates." },
  ]);

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
