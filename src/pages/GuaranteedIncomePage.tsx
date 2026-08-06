import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Wallet, ShieldCheck, Wrench, Paintbrush, Cpu, Check } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import Seo from "@/components/Seo";
import PageWrapper from "@/components/PageWrapper";

const GuaranteedIncomePageContent = () => {
  const [pageTitle, setPageTitle] = useState("Effortless Ownership. Guaranteed Monthly Income.");
  const [pageSubtitle, setPageSubtitle] = useState("Our Guaranteed Income Program is ideal for homeowners seeking financial stability. We lease your property long-term, guaranteeing a fixed monthly payment — regardless of occupancy.");
  const [contentText, setContentText] = useState("Frontier Residences manages, maintains, and enhances your property while you enjoy stress-free income.");
  const [benefitsTitle, setBenefitsTitle] = useState("Program Benefits");
  const [ctaTitle, setCtaTitle] = useState("Ready for Stress-Free Income?");
  const [ctaText, setCtaText] = useState("Contact us to learn how our Guaranteed Income Program can work for your property.");

  const iconMap: Record<string, any> = { Wallet, ShieldCheck, Wrench, Paintbrush, Cpu };

  const [benefits, setBenefits] = useState([
    { icon: "Wallet", title: "Predictable monthly earnings", description: "Receive a fixed payment every month, regardless of bookings or occupancy rates." },
    { icon: "ShieldCheck", title: "Zero vacancy risk", description: "No more worrying about empty periods — your income is guaranteed." },
    { icon: "Wrench", title: "Professional upkeep", description: "We maintain your property to the highest standards, protecting its long-term value." },
    { icon: "Paintbrush", title: "Optional interior upgrades", description: "We can invest in design improvements to enhance your property's appeal." },
    { icon: "Cpu", title: "AI-enhanced pricing & premium guest standards", description: "For hybrid models, benefit from our advanced technology and hospitality expertise." },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        path="/guaranteed-income"
        title="Guaranteed Rental Income for Property Owners | Frontier Residences"
        description="We lease your property long-term and pay a fixed monthly income regardless of occupancy, while maintaining and improving your home."
      />
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <EditableText id="gip-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6">{pageTitle}</EditableText>
              <EditableText id="gip-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" multiline className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto">{pageSubtitle}</EditableText>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <EditableText id="gip-content-text" value={contentText} onChange={setContentText} as="p" className="text-lg text-foreground/80 leading-relaxed">{contentText}</EditableText>
            </div>

            <div className="max-w-6xl mx-auto">
              <EditableText id="gip-benefits-title" value={benefitsTitle} onChange={setBenefitsTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">{benefitsTitle}</EditableText>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = iconMap[benefit.icon] || Wallet;
                  return (
                    <Card key={index} className="p-8 hover:shadow-elegant transition-all duration-300 text-center">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-accent-strong" />
                      </div>
                      <EditableText
                        id={`gip-benefit-title-${index}`}
                        value={benefit.title}
                        onChange={(v) => { const u = [...benefits]; u[index] = { ...u[index], title: v }; setBenefits(u); }}
                        as="h3"
                        className="font-playfair text-xl font-semibold text-primary mb-3"
                      >{benefit.title}</EditableText>
                      <EditableText
                        id={`gip-benefit-desc-${index}`}
                        value={benefit.description}
                        onChange={(v) => { const u = [...benefits]; u[index] = { ...u[index], description: v }; setBenefits(u); }}
                        as="p"
                        className="text-foreground/70"
                      >{benefit.description}</EditableText>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <EditableText id="gip-cta-title" value={ctaTitle} onChange={setCtaTitle} as="h2" className="font-playfair text-3xl font-bold text-primary mb-6">{ctaTitle}</EditableText>
              <EditableText id="gip-cta-text" value={ctaText} onChange={setCtaText} as="p" className="text-lg text-foreground/80 mb-8">{ctaText}</EditableText>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const GuaranteedIncomePage = () => (<PageWrapper slug="site--guaranteed-income"><GuaranteedIncomePageContent /></PageWrapper>);
export default GuaranteedIncomePage;
