import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const Stats = () => {
  const stats = [
    { number: "34", label: "Properties Managed" },
    { number: "570+", label: "Successful Reservations" },
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
