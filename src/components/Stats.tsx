import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import EditableText from "./admin/EditableText";
import { COUNTRIES, SITE_FIGURES } from "@/lib/siteFigures";

/**
 * Compact trust band. Not a chapter of its own — it backs up the positioning
 * line above it and hands straight over to the services section.
 *
 * The regions line ("Costa del Sol • Vienna & Carinthia • Istria") used to sit
 * under the countries line saying the same thing twice; the regions are told
 * properly, with context, by the country cards in the projects section.
 */
const Stats = () => {
  const [sectionTitle, setSectionTitle] = useState("A Portfolio Built on Precision & Performance");
  const [locations, setLocations] = useState(COUNTRIES);

  // Sourced from siteFigures so these can never drift out of step with the
  // rest of the page again.
  const stats = [
    { number: SITE_FIGURES.propertiesManaged, label: "Properties Managed" },
    { number: SITE_FIGURES.reservations, label: "Successful Reservations" },
    { number: SITE_FIGURES.destinations, label: "Destinations" },
    { number: SITE_FIGURES.collaborators, label: "Collaborators" },
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
    <section id="stats" ref={sectionRef} className="py-20 bg-gradient-hero scroll-mt-20">
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
      <div className="font-playfair text-4xl md:text-5xl font-bold text-accent-strong mb-2">
        {displayNumber}
      </div>
      <div className="text-foreground/70 font-medium">{stat.label}</div>
    </Card>
  );
};

export default Stats;
