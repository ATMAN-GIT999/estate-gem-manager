import { useEffect, useRef, useState } from "react";
import EditableText from "./admin/EditableText";
import { COUNTRIES, SITE_FIGURES } from "@/lib/siteFigures";

/**
 * The trust band that closes the hero.
 *
 * It sits between the search bar and the first real section, and it has one
 * job: tell a visitor who has never heard of us how much sits behind the
 * search they just used. A heading, four numbers, a line of geography.
 *
 * Everything about its weight is tuned to stay under the sections below it —
 * a smaller heading, plain figures instead of the elevated cards it used to
 * render, less vertical padding. It is the last beat of the hero, not the
 * page's first chapter.
 *
 * Figures come from siteFigures.ts so they can never drift apart from the rest
 * of the page again.
 */
const Stats = () => {
  const [sectionTitle, setSectionTitle] = useState(
    "A Portfolio Built on Precision & Performance"
  );
  const [locations, setLocations] = useState(COUNTRIES);

  const stats = [
    { number: SITE_FIGURES.propertiesManaged, label: "Properties managed" },
    { number: SITE_FIGURES.reservations, label: "Successful reservations" },
    { number: SITE_FIGURES.destinations, label: "Destinations" },
    { number: SITE_FIGURES.collaborators, label: "Collaborators" },
  ];

  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section
      id="stats"
      ref={sectionRef}
      className="py-16 bg-gradient-hero border-b border-border scroll-mt-20"
    >
      <div className="container mx-auto px-4">
        {/* One step down from the section headings below (text-4xl md:text-5xl)
            on purpose — the hierarchy is what keeps this reading as a band
            closing the hero rather than the page's first chapter. */}
        <EditableText
          id="stats-title"
          value={sectionTitle}
          onChange={setSectionTitle}
          as="h2"
          className="font-playfair text-3xl md:text-4xl font-bold text-primary text-center text-balance mb-12"
        >
          {sectionTitle}
        </EditableText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={index}
              stat={stat}
              index={index}
              hasAnimated={hasAnimated}
            />
          ))}
        </div>
        <EditableText
          id="stats-locations"
          value={locations}
          onChange={setLocations}
          as="p"
          className="mt-10 text-center text-sm uppercase tracking-widest text-foreground/50"
        >
          {locations}
        </EditableText>
      </div>
    </section>
  );
};

const AnimatedStat = ({
  stat,
  index,
  hasAnimated,
}: {
  stat: { number: string; label: string };
  index: number;
  hasAnimated: boolean;
}) => {
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
    <div className="text-center">
      <div className="font-playfair text-3xl md:text-4xl font-bold text-accent-strong">
        {displayNumber}
      </div>
      <div className="mt-1 text-sm text-foreground/60">{stat.label}</div>
    </div>
  );
};

export default Stats;
