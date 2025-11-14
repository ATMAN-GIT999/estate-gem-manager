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
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/JFC-seoKRkI?autoplay=1&mute=1&loop=1&playlist=JFC-seoKRkI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          title="Background Video"
          allow="autoplay; encrypted-media"
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 text-balance drop-shadow-2xl">
            Luxury Property Management
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Transform ownership into effortless elegance
          </p>
        </div>

        {/* Booking Engine Slide-in */}
        {showBooking && (
          <Card className="mt-12 max-w-4xl mx-auto p-6 md:p-8 shadow-elegant animate-slide-in-right bg-card/95 backdrop-blur">
            <h3 className="font-playfair text-2xl font-semibold text-primary mb-6">Find Your Perfect Stay</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Check-In</label>
                <div className="border border-border rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors bg-background">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    {checkIn ? checkIn.toLocaleDateString() : "Select date"}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Check-Out</label>
                <div className="border border-border rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors bg-background">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    {checkOut ? checkOut.toLocaleDateString() : "Select date"}
                  </span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft h-12 text-lg font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Search Available Properties
            </Button>
          </Card>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
