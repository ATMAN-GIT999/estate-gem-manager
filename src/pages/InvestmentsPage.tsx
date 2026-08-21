import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, BarChart3, Handshake, HardHat, Settings, MapPin } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Section, Container, Grid, Panel, SectionIntro } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

const SERVICE_ICONS = ["Search", "BarChart3", "Handshake", "HardHat", "Settings"];

/** See docs/PROJECT.md C5 / the comment atop RenovationsPage.tsx — same rebuild. */
const InvestmentsPageContent = () => {
  const { t, language } = useLocale();
  const [servicesTitle, setServicesTitle] = useState(t("inv-services-title"));
  const [destinationsTitle, setDestinationsTitle] = useState(t("inv-destinations-title"));

  const iconMap: Record<string, any> = { Search, BarChart3, Handshake, HardHat, Settings };

  const buildServices = () =>
    SERVICE_ICONS.map((icon, i) => ({
      icon,
      title: t(`inv-service-title-${i}` as TranslationKey),
      description: t(`inv-service-desc-${i}` as TranslationKey),
    }));
  const [services, setServices] = useState(buildServices());

  const buildLocations = () =>
    [0, 1, 2].map((i) => ({
      country: t(`inv-loc-country-${i}` as TranslationKey),
      region: t(`inv-loc-region-${i}` as TranslationKey),
      description: t(`inv-loc-desc-${i}` as TranslationKey),
    }));
  const [locations, setLocations] = useState(buildLocations());

  useEffect(() => {
    setServicesTitle(t("inv-services-title"));
    setDestinationsTitle(t("inv-destinations-title"));
    setServices(buildServices());
    setLocations(buildLocations());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Property Investments"
        description="Curated real estate investments in Spain and Austria, guided from acquisition through renovation to turnkey rental operation."
        path="/investments"
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Investments", path: "/investments" }])}
      />
      <Navigation />
      <main className="flex-1 pt-24 overflow-x-clip">
        <Section size="lg" tone="muted">
          <SectionIntro
            idPrefix="inv-hero"
            eyebrow={t("inv-hero-eyebrow")}
            heading={t("inv-hero-heading")}
            lead={t("inv-hero-lead")}
            headingAs="h1"
          />
        </Section>

        <Section size="lg">
          <Container measure="wide">
            <EditableText id="inv-services-title" value={servicesTitle} onChange={setServicesTitle} as="h2" className="t-section text-primary text-balance text-center mb-lg">{servicesTitle}</EditableText>
            <Grid cols={3} gap="md">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Settings;
                return (
                  <Panel key={index}>
                    <Icon className="w-7 h-7 text-accent-strong mb-sm" strokeWidth={1.5} />
                    <EditableText
                      id={`inv-service-title-${index}`}
                      value={service.title}
                      onChange={(v) => { const u = [...services]; u[index] = { ...u[index], title: v }; setServices(u); }}
                      as="h3"
                      className="t-block text-primary mb-2"
                    >{service.title}</EditableText>
                    <EditableText
                      id={`inv-service-desc-${index}`}
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

        <Section size="lg" tone="primary">
          <Container measure="wide">
            <EditableText id="inv-destinations-title" value={destinationsTitle} onChange={setDestinationsTitle} as="h2" className="t-section text-primary-foreground text-balance text-center mb-lg">{destinationsTitle}</EditableText>
            <Grid cols={3} gap="md">
              {locations.map((location, index) => (
                <Panel key={index} tone="primary" className="text-center">
                  <MapPin className="w-7 h-7 text-accent-on-primary mb-sm mx-auto" strokeWidth={1.5} />
                  <EditableText
                    id={`inv-loc-country-${index}`}
                    value={location.country}
                    onChange={(v) => { const u = [...locations]; u[index] = { ...u[index], country: v }; setLocations(u); }}
                    as="h3"
                    className="t-block text-primary-foreground mb-1"
                  >{location.country}</EditableText>
                  <EditableText
                    id={`inv-loc-region-${index}`}
                    value={location.region}
                    onChange={(v) => { const u = [...locations]; u[index] = { ...u[index], region: v }; setLocations(u); }}
                    as="p"
                    className="t-meta text-accent-on-primary mb-sm"
                  >{location.region}</EditableText>
                  <EditableText
                    id={`inv-loc-desc-${index}`}
                    value={location.description}
                    onChange={(v) => { const u = [...locations]; u[index] = { ...u[index], description: v }; setLocations(u); }}
                    as="p"
                    className="t-body text-primary-foreground/80"
                  >{location.description}</EditableText>
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

const InvestmentsPage = () => (<PageWrapper slug="site--investments"><InvestmentsPageContent /></PageWrapper>);
export default InvestmentsPage;
