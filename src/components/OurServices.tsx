import { Building2, CalendarRange, Hammer, Sun } from "lucide-react";
import { Grid, Section, SectionIntro } from "./layout";

/**
 * Four services in one row — hairline-topped blocks rather than filled cards,
 * per the "fewer boxes" rule in docs/DESIGN.md. Copy names the towns on
 * purpose: these are the local search phrases the homepage should rank for.
 */
const SERVICES = [
  {
    icon: Sun,
    title: "Holiday Rentals",
    body: "Luxury holiday rentals in Marbella, Benahavís and along the coast — each home inspected, styled and cared for by our own team. From a villa rental with private pool to a beachside apartment, every short-term rental on the Costa del Sol is booked directly with us.",
  },
  {
    icon: CalendarRange,
    title: "Mid-Term & Monthly Rentals",
    body: "Mid-term rentals in Marbella and monthly rentals in Málaga for those who stay a season rather than a week. Fully furnished homes with reliable Wi-Fi, housekeeping and a local contact, from one month to several.",
  },
  {
    icon: Building2,
    title: "Property Management for Owners",
    body: "Discreet, full-service property management in Marbella, Fuengirola and Mijas. Our Airbnb management on the Costa del Sol covers pricing, guest care, cleaning and maintenance, with transparent monthly reporting.",
  },
  {
    icon: Hammer,
    title: "Renovation & Investment",
    body: "Property renovation on the Costa del Sol, from concept to final styling, shaped around how a home will be lived in and let. We also advise on real estate investment on the Costa del Sol, from Málaga to Benahavís.",
  },
] as const;

const OurServices = () => (
  <Section id="services" size="md">
    <SectionIntro
      eyebrow="Our Services"
      heading="Luxury holiday rentals and property management in Marbella"
      lead="One boutique team for guests and owners alike, across the Costa del Sol."
    />
    <Grid cols={4} gap="md" className="mt-lg">
      {SERVICES.map(({ icon: Icon, title, body }) => (
        <div key={title} className="border-t border-border pt-md">
          <Icon className="w-6 h-6 text-accent-strong" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="t-item text-foreground mt-sm">{title}</h3>
          <p className="t-body text-muted-foreground mt-2">{body}</p>
        </div>
      ))}
    </Grid>
  </Section>
);

export default OurServices;
