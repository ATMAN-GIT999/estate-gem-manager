import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Lightbulb, Calculator, HardHat, Package, Palette, Camera, TrendingUp } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Section, Container, Grid, Panel, SectionIntro } from "@/components/layout";

/**
 * One of the three "side door" content pages (`/renovations`,
 * `/investments`, `/guaranteed-income`) rebuilt onto the shared layout
 * system — docs/PROJECT.md C5. They predated `redesign/v2`'s layout work
 * entirely: raw `container mx-auto px-4` plus a fresh `max-w-*` per section,
 * `font-playfair text-4xl md:text-6xl font-bold` instead of the `.t-*`
 * scale, and shadcn `<Card>` wrappers around every service — exactly the
 * "different website" break DECISIONS.md §11's zoom-out test was written
 * about, just on the pages that test never reached.
 *
 * `bg-gradient-hero` (a near-invisible beige-on-beige gradient) is dropped
 * rather than added as a new `Section` tone: at this subtlety it read as a
 * leftover Lovable polish effect, not a real design signature worth a
 * primitive of its own.
 */
const RenovationsPageContent = () => {
  const [servicesTitle, setServicesTitle] = useState("What We Handle");
  const [processTitle, setProcessTitle] = useState("Our Process");
  const [processText, setProcessText] = useState("From initial concept to final staging, we manage every detail to ensure your property reaches its full potential.");

  const iconMap: Record<string, any> = { Lightbulb, Calculator, HardHat, Package, Palette, Camera, TrendingUp };

  const [processSteps, setProcessSteps] = useState(["Concept", "Construction", "Delivery", "Staging"]);

  const [services, setServices] = useState([
    { icon: "Lightbulb", title: "Architectural concept & mood boards", description: "We create inspiring visual concepts that capture the Mediterranean essence." },
    { icon: "Calculator", title: "Budget planning", description: "Transparent cost estimation and financial planning for your project." },
    { icon: "HardHat", title: "Renovation management", description: "End-to-end project oversight ensuring quality and timely delivery." },
    { icon: "Package", title: "Material & furniture sourcing", description: "Curated selection of premium materials and furnishings." },
    { icon: "Palette", title: "Full interior design", description: "Complete design solutions from layout to final styling." },
    { icon: "Camera", title: "Styling & photography", description: "Professional staging and photography to showcase your property." },
    { icon: "TrendingUp", title: "Rental optimisation post-renovation", description: "Maximise your return with strategic positioning and pricing." },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Renovations & Interior Design"
        description="Timeless Mediterranean interiors that raise a home's value and its rental performance. We run the full process: concept, construction, delivery, staging."
        path="/renovations"
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Renovations", path: "/renovations" }])}
      />
      <Navigation />
      <main className="flex-1 pt-24 overflow-x-clip">
        <Section size="lg" tone="muted">
          <SectionIntro
            idPrefix="reno-hero"
            eyebrow="Renovations & Design"
            heading="Timeless Mediterranean Interiors. Elevated Asset Value."
            lead="Our renovation and design team transforms properties into refined, contemporary Mediterranean spaces. We oversee the entire process with a focus on craftsmanship, functionality, and increased rental performance."
            headingAs="h1"
          />
        </Section>

        <Section size="lg">
          <Container measure="wide">
            <EditableText id="reno-services-title" value={servicesTitle} onChange={setServicesTitle} as="h2" className="t-section text-primary text-balance text-center mb-lg">{servicesTitle}</EditableText>
            <Grid cols={2} gap="md">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Lightbulb;
                return (
                  <Panel key={index}>
                    <Icon className="w-7 h-7 text-accent-strong mb-sm" strokeWidth={1.5} />
                    <EditableText
                      id={`reno-service-title-${index}`}
                      value={service.title}
                      onChange={(v) => { const u = [...services]; u[index] = { ...u[index], title: v }; setServices(u); }}
                      as="h3"
                      className="t-block text-primary mb-2"
                    >{service.title}</EditableText>
                    <EditableText
                      id={`reno-service-desc-${index}`}
                      value={service.description}
                      onChange={(v) => { const u = [...services]; u[index] = { ...u[index], description: v }; setServices(u); }}
                      as="p"
                      className="t-body text-foreground/70"
                    >{service.description}</EditableText>
                  </Panel>
                );
              })}
            </Grid>
          </Container>
        </Section>

        <Section size="lg" tone="muted">
          <Container measure="text" className="text-center">
            <EditableText id="reno-process-title" value={processTitle} onChange={setProcessTitle} as="h2" className="t-section text-primary mb-md">{processTitle}</EditableText>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {processSteps.map((step, index) => (
                <span key={index} className="flex items-center gap-4">
                  <EditableText
                    id={`reno-step-${index}`}
                    value={step}
                    onChange={(v) => { const u = [...processSteps]; u[index] = v; setProcessSteps(u); }}
                    as="span"
                    className="t-block text-accent-strong"
                  >{step}</EditableText>
                  {index < processSteps.length - 1 && <span className="text-accent-strong t-block" aria-hidden="true">→</span>}
                </span>
              ))}
            </div>
            <EditableText id="reno-process-text" value={processText} onChange={setProcessText} as="p" className="mt-md t-body text-foreground/70 max-w-2xl mx-auto">{processText}</EditableText>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

const RenovationsPage = () => (<PageWrapper slug="site--renovations"><RenovationsPageContent /></PageWrapper>);
export default RenovationsPage;
