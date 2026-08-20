import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Wallet, ShieldCheck, Wrench, Paintbrush } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Section, Container, Grid, Panel, SectionIntro } from "@/components/layout";

/** See docs/PROJECT.md C5 / the comment atop RenovationsPage.tsx — same rebuild. */
const GuaranteedIncomePageContent = () => {
  const [contentText, setContentText] = useState("Frontier Residences manages, maintains, and enhances your property while you enjoy stress-free income.");
  const [benefitsTitle, setBenefitsTitle] = useState("Program Benefits");
  const [ctaTitle, setCtaTitle] = useState("Ready for Stress-Free Income?");
  const [ctaText, setCtaText] = useState("Contact us to learn how our Guaranteed Income Program can work for your property.");

  const iconMap: Record<string, any> = { Wallet, ShieldCheck, Wrench, Paintbrush };

  const [benefits, setBenefits] = useState([
    { icon: "Wallet", title: "Predictable monthly earnings", description: "Receive a fixed payment every month, regardless of bookings or occupancy rates." },
    { icon: "ShieldCheck", title: "Zero vacancy risk", description: "No more worrying about empty periods — your income is guaranteed." },
    { icon: "Wrench", title: "Professional upkeep", description: "We maintain your property to the highest standards, protecting its long-term value." },
    { icon: "Paintbrush", title: "Optional interior upgrades", description: "We can invest in design improvements to enhance your property's appeal." },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Guaranteed Rental Income"
        description="We lease your property and pay a fixed amount every month, booked or empty, and maintain the home throughout — you trade the strong months for certainty in the weak ones."
        path="/guaranteed-income"
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guaranteed Income", path: "/guaranteed-income" }])}
      />
      <Navigation />
      <main className="flex-1 pt-24 overflow-x-clip">
        <Section size="lg" tone="muted">
          <SectionIntro
            idPrefix="gip-hero"
            eyebrow="Guaranteed Income"
            heading="Effortless Ownership. Guaranteed Monthly Income."
            lead="Our Guaranteed Income Program is ideal for homeowners seeking financial stability. We lease your property long-term, guaranteeing a fixed monthly payment — regardless of occupancy."
            headingAs="h1"
          />
        </Section>

        <Section size="lg">
          <Container measure="text" className="text-center mb-lg">
            <EditableText id="gip-content-text" value={contentText} onChange={setContentText} as="p" className="t-body text-foreground/80">{contentText}</EditableText>
          </Container>

          <Container measure="wide">
            <EditableText id="gip-benefits-title" value={benefitsTitle} onChange={setBenefitsTitle} as="h2" className="t-section text-primary text-balance text-center mb-lg">{benefitsTitle}</EditableText>
            <Grid cols={3} gap="md">
              {benefits.map((benefit, index) => {
                const Icon = iconMap[benefit.icon] || Wallet;
                return (
                  <Panel key={index} className="text-center">
                    <Icon className="w-7 h-7 text-accent-strong mb-sm mx-auto" strokeWidth={1.5} />
                    <EditableText
                      id={`gip-benefit-title-${index}`}
                      value={benefit.title}
                      onChange={(v) => { const u = [...benefits]; u[index] = { ...u[index], title: v }; setBenefits(u); }}
                      as="h3"
                      className="t-block text-primary mb-2"
                    >{benefit.title}</EditableText>
                    <EditableText
                      id={`gip-benefit-desc-${index}`}
                      value={benefit.description}
                      onChange={(v) => { const u = [...benefits]; u[index] = { ...u[index], description: v }; setBenefits(u); }}
                      as="p"
                      className="t-body text-foreground/70"
                    >{benefit.description}</EditableText>
                  </Panel>
                );
              })}
            </Grid>
          </Container>
        </Section>

        <Section size="md" tone="muted">
          <Container measure="text" className="text-center">
            <EditableText id="gip-cta-title" value={ctaTitle} onChange={setCtaTitle} as="h2" className="t-section text-primary mb-sm">{ctaTitle}</EditableText>
            <EditableText id="gip-cta-text" value={ctaText} onChange={setCtaText} as="p" className="t-body text-foreground/80">{ctaText}</EditableText>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

const GuaranteedIncomePage = () => (<PageWrapper slug="site--guaranteed-income"><GuaranteedIncomePageContent /></PageWrapper>);
export default GuaranteedIncomePage;
