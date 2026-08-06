import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Star } from "lucide-react";
import SearchBar from "./SearchBar";
import EditableText from "./admin/EditableText";
import EditableVideo from "./admin/EditableVideo";

/**
 * The guest entry point, and the page's only H1.
 *
 * The headline carries the search terms a guest actually types ("luxury
 * villas", "vacation rentals", "Costa del Sol") as real text rather than
 * burning them into the video, and the line under it is the whole business in
 * six words — a stay, or an income — which is what lets the owner link sit
 * here without competing with the search bar.
 *
 * Below the engine: the rating, because a trust anchor is worth most at the
 * moment someone is deciding whether to type anything at all, and one link per
 * audience.
 */
const Hero = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const navigate = useNavigate();

  // Editable content state.
  const [headline, setHeadline] = useState(
    "Luxury Villas & Vacation Rentals on the Costa del Sol"
  );
  const [subheadline, setSubheadline] = useState("To stay in — or to earn from.");
  // ⚠️ PLACEHOLDER. This score is invented scaffolding, not a measured rating.
  // Replace it with the real Airbnb/Booking figures before this goes live —
  // publishing a rating we have not earned is misleading, and in the EU it is
  // also unlawful under the Unfair Commercial Practices Directive. The numbers
  // are not stored anywhere yet; they need a Guesty/Booking sync first.
  const [ratingText, setRatingText] = useState("4.8 · Airbnb & Booking rating");
  const [guestCtaText, setGuestCtaText] = useState("Find your stay");
  const [ownerCtaText, setOwnerCtaText] = useState(
    "Own a property? See what it could earn"
  );
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
            className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6 text-balance drop-shadow-2xl"
          >
            {headline}
          </EditableText>
          <EditableText
            id="hero-subheadline"
            value={subheadline}
            onChange={setSubheadline}
            as="p"
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
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

        {/* Trust anchor + one link per audience */}
        <div className="mt-8 flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <EditableText
              id="hero-rating"
              value={ratingText}
              onChange={setRatingText}
              as="span"
              className="text-sm font-medium text-white/90 drop-shadow"
            >
              {ratingText}
            </EditableText>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-x-8 gap-y-3">
            <Link
              to="/properties"
              className="text-sm font-medium text-white hover:text-accent-on-primary transition-colors drop-shadow"
            >
              <EditableText
                id="hero-guest-cta"
                value={guestCtaText}
                onChange={setGuestCtaText}
                as="span"
              >
                {guestCtaText}
              </EditableText>
              {" →"}
            </Link>
            <Link
              to="/property-management"
              className="text-sm font-medium text-white/80 hover:text-accent-on-primary transition-colors drop-shadow"
            >
              <EditableText
                id="hero-owner-cta"
                value={ownerCtaText}
                onChange={setOwnerCtaText}
                as="span"
              >
                {ownerCtaText}
              </EditableText>
              {" →"}
            </Link>
          </div>
        </div>
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
