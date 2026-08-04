import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Camera, Globe, MessageSquare, Users, TrendingUp, Sparkles, Wrench, LayoutDashboard, FileCheck, Cpu, Check } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";

const PropertyManagementPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Luxury Property Management Designed for Exceptional Homes");
  const [pageSubtitle, setPageSubtitle] = useState("We deliver a personalised management plan for every property — combining hotel-level hospitality with advanced AI-driven systems to maximise revenue, elevate guest satisfaction, and protect the long-term value of your home.");
  const [servicesTitle, setServicesTitle] = useState("Our Services");
  const [aiTitle, setAiTitle] = useState("AI-Driven Hospitality & Operations");
  const [aiSubtitle, setAiSubtitle] = useState("Frontier Residences uses state-of-the-art technology to deliver consistent, precise performance.");
  const [systemsTitle, setSystemsTitle] = useState("Our systems use:");
  const [ensuresTitle, setEnsuresTitle] = useState("This ensures:");

  const iconMap: Record<string, any> = { Camera, Globe, MessageSquare, Users, TrendingUp, Sparkles, Wrench, LayoutDashboard, FileCheck };

  const [services, setServices] = useState([
    { icon: "Camera", text: "Luxury photography & staging" },
    { icon: "Globe", text: "Listings on top global booking channels" },
    { icon: "MessageSquare", text: "24/7 guest communication" },
    { icon: "Users", text: "Personal or remote check-ins" },
    { icon: "TrendingUp", text: "Dynamic pricing algorithm" },
    { icon: "Sparkles", text: "Professional housekeeping" },
    { icon: "Wrench", text: "Preventive maintenance & inspections" },
    { icon: "LayoutDashboard", text: "Owner portal with real-time reporting" },
    { icon: "FileCheck", text: "Legal traveller registration & compliance" },
  ]);

  const [aiFeatures, setAiFeatures] = useState([
    "Real-time Airbnb & hotel price analysis",
    "Automated rate adjustments (multiple times daily)",
    "AI-supported guest messaging in all languages",
    "Predictive maintenance alerts",
    "Smart cleaning and task automation",
    "Algorithm-based reviews and feedback management",
  ]);

  const [benefits, setBenefits] = useState([
    "Higher occupancy",
    "Better nightly rates",
    "Faster responses",
    "Zero operational gaps",
    "Increased long-term value",
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <EditableText id="pmp-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6">{pageTitle}</EditableText>
              <EditableText id="pmp-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" multiline className="text-xl text-foreground/80 leading-relaxed">{pageSubtitle}</EditableText>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EditableText id="pmp-services-title" value={servicesTitle} onChange={setServicesTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">{servicesTitle}</EditableText>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = iconMap[service.icon] || FileCheck;
                  return (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-accent-strong" />
                        </div>
                        <EditableText
                          id={`pmp-service-${index}`}
                          value={service.text}
                          onChange={(v) => { const u = [...services]; u[index] = { ...u[index], text: v }; setServices(u); }}
                          as="p"
                          className="text-foreground/90 font-medium pt-2"
                        >{service.text}</EditableText>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
                  <Cpu className="w-8 h-8 text-accent-on-primary" />
                </div>
                <EditableText id="pmp-ai-title" value={aiTitle} onChange={setAiTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold mb-6">{aiTitle}</EditableText>
                <EditableText id="pmp-ai-subtitle" value={aiSubtitle} onChange={setAiSubtitle} as="p" className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">{aiSubtitle}</EditableText>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 mt-12">
                <div>
                  <EditableText id="pmp-systems-title" value={systemsTitle} onChange={setSystemsTitle} as="h3" className="text-xl font-semibold mb-6 text-accent-on-primary">{systemsTitle}</EditableText>
                  <ul className="space-y-4">
                    {aiFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-accent-on-primary mt-1">•</span>
                        <EditableText
                          id={`pmp-ai-feature-${index}`}
                          value={feature}
                          onChange={(v) => { const u = [...aiFeatures]; u[index] = v; setAiFeatures(u); }}
                          as="span"
                          className="text-primary-foreground/90"
                        >{feature}</EditableText>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <EditableText id="pmp-ensures-title" value={ensuresTitle} onChange={setEnsuresTitle} as="h3" className="text-xl font-semibold mb-6 text-accent-on-primary">{ensuresTitle}</EditableText>
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-accent-on-primary shrink-0" />
                        <EditableText
                          id={`pmp-benefit-${index}`}
                          value={benefit}
                          onChange={(v) => { const u = [...benefits]; u[index] = v; setBenefits(u); }}
                          as="span"
                          className="text-primary-foreground/90"
                        >{benefit}</EditableText>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
