import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Search } from "lucide-react";

const Hero = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBooking(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige via-secondary to-beige-dark">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1YTY5NTkiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-primary mb-6 text-balance">
            Luxury Property Management for Discerning Homeowners
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Frontier Residences delivers a bespoke management experience designed for exclusive villas and residences.
            From turnkey rental operations to premium renovations, we transform ownership into effortless elegance.
          </p>
        </div>

        {/* Booking Engine Slide-in */}
        {showBooking && (
          <Card className="mt-12 max-w-4xl mx-auto p-6 md:p-8 shadow-elegant animate-slide-in-right bg-card">
            <h3 className="font-playfair text-2xl font-semibold text-primary mb-6">Find Your Perfect Stay</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Check-In</label>
                <div className="border border-border rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:border-accent transition-colors">
                  <CalendarIcon className="w-5 h-5 text-accent" />
                  <span className="text-foreground">
                    {checkIn ? checkIn.toLocaleDateString() : "Select date"}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Check-Out</label>
                <div className="border border-border rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:border-accent transition-colors">
                  <CalendarIcon className="w-5 h-5 text-accent" />
                  <span className="text-foreground">
                    {checkOut ? checkOut.toLocaleDateString() : "Select date"}
                  </span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold h-12 text-lg font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Search Available Properties
            </Button>
          </Card>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-accent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
