import { useEffect, useRef, useState } from "react";
import EditableText from "./admin/EditableText";

/**
 * Four numbers, no cards.
 *
 * They were in raised, bordered, hover-scaling panels, which made four facts
 * look like four buttons. A number this large needs no container to be found —
 * a hairline above each and space between is enough, and it lets the numbers
 * sit at the same weight as the rest of the page instead of floating over it.
 */
const Stats = () => {
  const [sectionTitle, setSectionTitle] = useState("A Portfolio Built on Precision & Performance");

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
    <section ref={sectionRef} className="py-24 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <EditableText
            id="stats-title"
            value={sectionTitle}
            onChange={setSectionTitle}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary text-balance"
          >
            {sectionTitle}
          </EditableText>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <AnimatedStat
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

const AnimatedStat = ({ stat, index, hasAnimated }: { stat: { number: string; label: string }; index: number; hasAnimated: boolean }) => {
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
    <div className="border-t border-primary/15 pt-6">
      <div className="font-playfair text-5xl md:text-6xl font-bold text-accent-strong mb-3 tabular-nums">
        {displayNumber}
      </div>
      <div className="text-sm uppercase tracking-widest text-foreground/60">{stat.label}</div>
    </div>
  );
};

export default Stats;
