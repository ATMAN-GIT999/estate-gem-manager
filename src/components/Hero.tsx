import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import SearchBar from "./SearchBar";
import EditableText from "./admin/EditableText";
import EditableVideo from "./admin/EditableVideo";

const Hero = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const navigate = useNavigate();

  // Editable content state
  const [headline, setHeadline] = useState("Luxury Villas & Vacation Rentals in Spain and Austria");
  const [subheadline, setSubheadline] = useState("Handpicked homes on the Costa del Sol, in Málaga, Vienna and the Austrian Alps — booked directly with the team that manages them.");
  const [videoId, setVideoId] = useState("tqmWpFCv_1M");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBooking(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkInDate) params.set('checkIn', format(checkInDate, 'yyyy-MM-dd'));
    if (checkOutDate) params.set('checkOut', format(checkOutDate, 'yyyy-MM-dd'));
    if (guests) params.set('guests', guests);
    navigate(`/properties?${params.toString()}`);
  };

  const handleVideoChange = (src: string, type: "youtube" | "file") => {
    if (type === "youtube") {
      setVideoId(src);
    }
  };

  return (
    // pt-20 keeps the centring area below the fixed 80px header, so the
    // headline can never drift underneath it on short viewports. `safe center`
    // then falls back to top-alignment if the block still doesn't fit (very
    // small phones, or a headline that wraps to three lines) instead of
    // overflowing equally in both directions the way plain centring does.
    <div className="relative min-h-screen flex items-center [align-items:safe_center] justify-center overflow-hidden pt-20">
      {/* Video Background */}
      <EditableVideo
        id="hero-video"
        type="youtube"
        src={videoId}
        onChange={handleVideoChange}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&start=0&end=23&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; encrypted-media"
            style={{ pointerEvents: 'none', border: 'none' }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </EditableVideo>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <EditableText
            id="hero-headline"
            value={headline}
            onChange={setHeadline}
            as="h1"
            className="t-display text-white mb-4 md:mb-6 text-balance drop-shadow-2xl"
          >
            {headline}
          </EditableText>
          <EditableText
            id="hero-subheadline"
            value={subheadline}
            onChange={setSubheadline}
            as="p"
            className="t-body text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto drop-shadow-lg"
          >
            {subheadline}
          </EditableText>
        </div>

        {/* Compact Search Bar */}
        {showBooking && (
          <div className="mt-6 sm:mt-12 max-w-5xl mx-auto animate-slide-in-right">
             <SearchBar
               location={location}
               checkInDate={checkInDate}
               checkOutDate={checkOutDate}
               guests={guests}
               onLocationChange={setLocation}
               onCheckInChange={setCheckInDate}
               onCheckOutChange={setCheckOutDate}
               onGuestsChange={setGuests}
               onSearch={handleSearch}
             />
          </div>
        )}
      </div>

      {/* Scroll Indicator — hidden on short viewports, where it would sit on
          top of the search bar rather than below it. Height-based rather than
          width-based: a wide-but-short window has the same problem. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce [@media(max-height:700px)]:hidden">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
