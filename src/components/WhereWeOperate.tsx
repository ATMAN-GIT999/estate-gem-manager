import { MapPin } from "lucide-react";
import { Grid, Section, SectionIntro } from "./layout";

const AREAS = [
  {
    name: "Marbella & Puerto Banús",
    body: "Villas with private pools, golf-front apartments and residences moments from the marina and the Golden Mile.",
  },
  {
    name: "Benahavís",
    body: "Quiet hillside homes among the golf valleys, with views to the sea and the mountains.",
  },
  {
    name: "Fuengirola & Mijas",
    body: "Beachside apartments and traditional Andalusian townhouses, ideal for a short-term rental on the Costa del Sol.",
  },
  {
    name: "Málaga",
    body: "City apartments in Soho and by the beach — well suited to monthly rentals in Málaga.",
  },
] as const;

const WhereWeOperate = () => (
  <Section id="where-we-operate" tone="quiet" size="md">
    <SectionIntro
      eyebrow="Where We Operate"
      heading="Short-term rentals across the Costa del Sol"
    />
    <Grid cols={4} gap="md" className="mt-lg">
      {AREAS.map((a) => (
        <div key={a.name} className="border-t border-border pt-md">
          <MapPin className="w-5 h-5 text-accent-strong" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="t-item mt-sm">{a.name}</h3>
          <p className="t-body text-muted-foreground mt-2">{a.body}</p>
        </div>
      ))}
    </Grid>
    <p className="t-body text-muted-foreground mt-lg">
      Also in Austria – city apartments in Vienna and alpine lodges.
    </p>
  </Section>
);

export default WhereWeOperate;
