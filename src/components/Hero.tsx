import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import LocationAutocomplete from "./LocationAutocomplete";

const Hero = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBooking(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    setCheckInOpen(false);
    setTimeout(() => setCheckOutOpen(true), 100);
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOutDate(date);
    setCheckOutOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkInDate) params.set('checkIn', format(checkInDate, 'yyyy-MM-dd'));
    if (checkOutDate) params.set('checkOut', format(checkOutDate, 'yyyy-MM-dd'));
    if (guests) params.set('guests', guests);
    navigate(`/properties?${params.toString()}`);
  };

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

        {/* Compact Search Bar */}
        {showBooking && (
          <div className="mt-12 max-w-5xl mx-auto animate-slide-in-right">
            <Card className="p-3 shadow-elegant bg-card/95 backdrop-blur">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                {/* Location */}
                <div className="flex-1 border-r border-border">
                  <LocationAutocomplete
                    value={location}
                    onChange={setLocation}
                    placeholder="Where to?"
                  />
                </div>
                
                {/* Check-in */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
                  <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                  <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-normal justify-start text-left hover:bg-transparent"
                      >
                        {checkInDate ? format(checkInDate, "PPP") : "Check-in"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={handleCheckInSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Check-out */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
                  <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                  <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-normal justify-start text-left hover:bg-transparent"
                      >
                        {checkOutDate ? format(checkOutDate, "PPP") : "Check-out"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={handleCheckOutSelect}
                        disabled={(date) => date < new Date() || (checkInDate && date <= checkInDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Guests */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <Users className="w-5 h-5 text-primary shrink-0" />
                  <Input
                    type="number"
                    min="1"
                    placeholder="Guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft h-12 px-8 rounded-full"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
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