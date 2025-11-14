import { Home, Users, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";

const HowWeKeepItKozy = () => {
  const services = [
    {
      icon: Home,
      title: "Listing management",
      description: "Your property will be advertised on your preferred platforms. We'll keep this listing updated to ensure we get the most out of your vacation home.",
    },
    {
      icon: Users,
      title: "Guest management",
      description: "We ensure satisfied guests and provide support whenever needed. Your guests can contact us 24/7 with any questions or problems.",
    },
    {
      icon: Wrench,
      title: "Property management",
      description: "Your home will be thoroughly inspected and cleaned after each stay. We take great care of your property.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">
            How We Keep It Kozy
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            "A home away from home"<br />
            At KOZY Marbella, we strive for the most personal approach possible.
            Our goal is to create a warm and welcoming environment where guests immediately feel at home.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="p-8 bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-primary">
                    {service.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowWeKeepItKozy;
