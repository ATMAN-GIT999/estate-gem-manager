import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import EditableText from "./admin/EditableText";

const Stats = () => {
  const [sectionTitle, setSectionTitle] = useState("A Portfolio Built on Precision & Performance");
  const [locations, setLocations] = useState("Spain • Austria • Croatia");
  const [regions, setRegions] = useState("Costa del Sol • Vienna & Carinthia • Istria");

  const stats = [
    { number: "41", label: "Properties Managed" },
    { number: "1500+", label: "Successful Reservations" },
    { number: "8", label: "Destinations" },
    { number: "50+", label: "Collaborators" },
  ];

  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <EditableText
            id="stats-title"
            value={sectionTitle}
            onChange={setSectionTitle}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4"
          >
            {sectionTitle}
          </EditableText>
          <EditableText
            id="stats-locations"
            value={locations}
            onChange={setLocations}
            as="p"
            className="text-lg text-foreground/70"
          >
            {locations}
          </EditableText>
          <EditableText
            id="stats-regions"
            value={regions}
            onChange={setRegions}
            as="p"
            className="text-muted-foreground"
          >
            {regions}
          </EditableText>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <AnimatedStatCard
              key={index}
              stat={stat}
              index={index}
              hasAnimated={hasAnimated}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AnimatedStatCard = ({ stat, index, hasAnimated }: { stat: { number: string; label: string }; index: number; hasAnimated: boolean }) => {
  const [displayNumber, setDisplayNumber] = useState("0");

  useEffect(() => {
    if (!hasAnimated) return;

    const target = parseInt(stat.number.replace(/\D/g, ""));
    const suffix = stat.number.match(/[+]/)?.[0] || "";
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const delay = index * 100;

    setTimeout(() => {
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayNumber(target + suffix);
          clearInterval(timer);
        } else {
          setDisplayNumber(Math.floor(current).toString());
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);
  }, [hasAnimated, stat.number, index]);

  return (
    <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 hover:scale-105">
      <div className="font-playfair text-4xl md:text-5xl font-bold text-accent mb-2">
        {displayNumber}
      </div>
      <div className="text-foreground/70 font-medium">{stat.label}</div>
    </Card>
  );
};

export default Stats;
