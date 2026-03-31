import { useState } from "react";
import { Cpu, TrendingUp, Globe, MessageSquare, Wrench, LayoutDashboard, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "./admin/EditableText";

const TechnologySection = () => {
  const [title, setTitle] = useState("Technology That Redefines Property Management");
  const [description, setDescription] = useState(
    "Frontier Residences operates with a fully integrated 360º software ecosystem connecting reservations, cleaning, maintenance, pricing, guest communications, and owner reporting into one seamless platform."
  );
  const [tagline, setTagline] = useState("We don't just manage homes — we engineer high-performance assets.");
  const [aiHeading, setAiHeading] = useState("Our advanced AI ensures:");

  const [features, setFeatures] = useState([
    { icon: "TrendingUp", text: "Higher ROI through real-time dynamic pricing" },
    { icon: "Globe", text: "Market analysis using hotel & Airbnb data" },
    { icon: "MessageSquare", text: "Automated multilingual guest communication" },
    { icon: "Wrench", text: "Predictive maintenance & optimized scheduling" },
    { icon: "LayoutDashboard", text: "Full transparency with live dashboards" },
    { icon: "Zap", text: "Zero operational errors thanks to smart automation" },
  ]);

  const iconMap: Record<string, any> = { TrendingUp, Globe, MessageSquare, Wrench, LayoutDashboard, Zap };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], text: value };
    setFeatures(updated);
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
              <Cpu className="w-8 h-8 text-accent" />
            </div>
            <EditableText id="tech-title" value={title} onChange={setTitle} as="h2" className="font-playfair text-4xl md:text-5xl font-bold mb-6">{title}</EditableText>
            <EditableText id="tech-description" value={description} onChange={setDescription} as="p" multiline className="text-lg text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">{description}</EditableText>
          </div>

          <div className="mt-12">
            <EditableText id="tech-ai-heading" value={aiHeading} onChange={setAiHeading} as="h3" className="text-xl font-semibold text-center mb-8 text-primary-foreground">{aiHeading}</EditableText>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Zap;
                return (
                  <Card key={index} className="p-6 bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm hover:bg-primary-foreground/15 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <EditableText
                        id={`tech-feature-${index}`}
                        value={feature.text}
                        onChange={(v) => updateFeature(index, v)}
                        as="p"
                        className="text-primary-foreground/90"
                      >{feature.text}</EditableText>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mt-12 text-center">
            <EditableText id="tech-tagline" value={tagline} onChange={setTagline} as="p" className="font-playfair text-2xl italic text-primary-foreground">{tagline}</EditableText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
