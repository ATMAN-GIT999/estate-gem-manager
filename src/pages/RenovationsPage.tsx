import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Lightbulb, Calculator, HardHat, Package, Palette, Camera, TrendingUp } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";

const RenovationsPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Timeless Mediterranean Interiors. Elevated Asset Value.");
  const [pageSubtitle, setPageSubtitle] = useState("Our renovation and design team transforms properties into refined, contemporary Mediterranean spaces. We oversee the entire process with a focus on craftsmanship, functionality, and increased rental performance.");
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
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <EditableText id="reno-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6">{pageTitle}</EditableText>
              <EditableText id="reno-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" multiline className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto">{pageSubtitle}</EditableText>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EditableText id="reno-services-title" value={servicesTitle} onChange={setServicesTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">{servicesTitle}</EditableText>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => {
                  const Icon = iconMap[service.icon] || Lightbulb;
                  return (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                          <EditableText
                            id={`reno-service-title-${index}`}
                            value={service.title}
                            onChange={(v) => { const u = [...services]; u[index] = { ...u[index], title: v }; setServices(u); }}
                            as="h3"
                            className="font-semibold text-primary text-lg mb-2"
                          >{service.title}</EditableText>
                          <EditableText
                            id={`reno-service-desc-${index}`}
                            value={service.description}
                            onChange={(v) => { const u = [...services]; u[index] = { ...u[index], description: v }; setServices(u); }}
                            as="p"
                            className="text-foreground/70"
                          >{service.description}</EditableText>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <EditableText id="reno-process-title" value={processTitle} onChange={setProcessTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-8">{processTitle}</EditableText>
              <div className="flex flex-wrap justify-center items-center gap-4 text-lg text-foreground/80">
                {processSteps.map((step, index) => (
                  <span key={index} className="flex items-center gap-4">
                    <EditableText
                      id={`reno-step-${index}`}
                      value={step}
                      onChange={(v) => { const u = [...processSteps]; u[index] = v; setProcessSteps(u); }}
                      as="span"
                      className="font-semibold text-accent"
                    >{step}</EditableText>
                    {index < processSteps.length - 1 && <span className="text-accent">→</span>}
                  </span>
                ))}
              </div>
              <EditableText id="reno-process-text" value={processText} onChange={setProcessText} as="p" className="mt-8 text-foreground/70 max-w-2xl mx-auto">{processText}</EditableText>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const RenovationsPage = () => (<PageWrapper slug="site--renovations"><RenovationsPageContent /></PageWrapper>);
export default RenovationsPage;
