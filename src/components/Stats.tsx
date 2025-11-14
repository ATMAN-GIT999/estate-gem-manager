import { Card } from "@/components/ui/card";

const Stats = () => {
  const stats = [
    { number: "34", label: "Properties Managed" },
    { number: "570+", label: "Successful Reservations" },
    { number: "8", label: "Destinations" },
    { number: "50+", label: "Collaborators" },
  ];

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-8 text-center bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 hover:scale-105"
            >
              <div className="font-playfair text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="text-foreground/70 font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
