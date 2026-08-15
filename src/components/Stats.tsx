import { useEffect, useRef, useState } from "react";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack } from "./layout";

/**
 * Four numbers on the green fill — the one band on either page that is
 * entirely colour, so portfolio scale reads as a statement rather than another
 * paragraph.
 *
 * It spans the whole container rather than the `max-w-5xl` it used to sit in.
 * §11 asks for a trust block with real width and weight instead of a small
 * group floating in the middle, and at 1024px inside a 1440px band the four
 * numbers were doing the opposite.
 *
 * `heading` is optional because the same numbers serve two audiences. On the
 * property-management page they open a chapter about the portfolio and get a
 * title. Directly under the booking hero they are a trust bar and get none —
 * "A Portfolio Built on Precision & Performance" is written to an owner, and
 * on the guest landing page that is the exact mistake this project keeps
 * having to undo (CLAUDE.md, "der historische Hauptfehler").
 */
interface StatsProps {
  /** Empty string renders the numbers alone, as a band rather than a chapter. */
  heading?: string;
}

const Stats = ({ heading: headingProp = "A Portfolio Built on Precision & Performance" }: StatsProps = {}) => {
  const [sectionTitle, setSectionTitle] = useState(headingProp);

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
    // The gold seam belongs on this band specifically: it is where the light
    // page meets the green fill, which is the transition §24 reserves the line
    // for — not a divider dropped between every pair of sections.
    <Section tone="primary" size={headingProp ? "md" : "sm"} edge="both">
      <div ref={sectionRef}>
        <Stack gap="lg">
          {headingProp && (
            <EditableText
              id="stats-title"
              value={sectionTitle}
              onChange={setSectionTitle}
              as="h2"
              className="t-section text-primary-foreground text-balance max-w-3xl mx-auto text-center"
            >
              {sectionTitle}
            </EditableText>
          )}
          <Grid cols={4}>
            {stats.map((stat, index) => (
              <AnimatedStat
                key={index}
                stat={stat}
                index={index}
                hasAnimated={hasAnimated}
              />
            ))}
          </Grid>
        </Stack>
      </div>
    </Section>
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
    <div className="border-t border-primary-foreground/25 pt-sm">
      {/* Display size on a non-heading, which is the one deliberate exception
          to "Display appears once per page": in this section the numbers ARE
          the content — the heading only frames them. */}
      <div className="t-display text-accent-on-primary mb-xs tabular-nums">
        {displayNumber}
      </div>
      <div className="t-meta text-primary-foreground/70">{stat.label}</div>
    </div>
  );
};

export default Stats;
