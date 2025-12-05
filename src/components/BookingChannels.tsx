import { Globe } from "lucide-react";

const BookingChannels = () => {
  const platforms = [
    "Airbnb",
    "Booking.com",
    "Expedia Group",
    "VRBO",
    "Holidu",
    "TripAdvisor",
    "HomeToGo",
    "Direct Booking Engine",
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
            <Globe className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">
            Booking Channel Distribution
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-12">
            Your property is promoted across all major international booking platforms, ensuring global visibility and maximum occupancy.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-card border border-border rounded-full text-foreground font-medium hover:border-accent hover:shadow-soft transition-all duration-300"
              >
                {platform}
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            + Additional regional platforms
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingChannels;
