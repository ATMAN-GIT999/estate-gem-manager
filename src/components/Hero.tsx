import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import SearchBar from "./SearchBar";
import EditableText from "./admin/EditableText";
import EditableVideo from "./admin/EditableVideo";
import { Container, Stack } from "./layout";

/**
 * Headline, one supporting line and the search bar, as a single block over a
 * band of video.
 *
 * It used to be `min-h-screen`: the video owned the entire first screen and
 * the search bar arrived half a second late on a slide-in from the right,
 * separated from the text above it by up to 48px of empty space. That is what
 * made it read as something laid over the hero rather than part of it, and it
 * meant nothing below the fold existed until the visitor scrolled.
 *
 * Now the band is ~62vh, so the section underneath is already visible at rest
 * — the video supports the composition instead of being it (§7). The three
 * pieces share one Stack, so the gap between the headline and the field the
 * visitor is meant to type in is one step on the same ladder the rest of the
 * page uses (§8).
 */
const Hero = () => {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const navigate = useNavigate();

  // Editable content state
  const [headline, setHeadline] = useState("Luxury Villas & Vacation Rentals in Spain and Austria");
  const [subheadline, setSubheadline] = useState("Handpicked homes on the Costa del Sol, in Málaga, Vienna and the Austrian Alps — booked directly with the team that manages them.");
  const [videoId, setVideoId] = useState("tqmWpFCv_1M");

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
    // pt-20 clears the fixed 80px header. The height is clamped at both ends
    // rather than left at 62vh: the lower bound keeps the stacked mobile
    // search form from overflowing a short viewport, the upper bound stops the
    // band from turning back into a full-screen video on a tall monitor.
    //
    // `items-center` and `[align-items:safe_center]` are both here on purpose
    // (the editor flags them as duplicates): the second wins where it is
    // supported and falls back to top-alignment instead of overflowing in both
    // directions when the block still does not fit, and the first is what
    // browsers without `safe` keyword support fall back to.
    <section className="relative flex items-center [align-items:safe_center] overflow-hidden pt-20 min-h-[clamp(34rem,62vh,44rem)]">
      <EditableVideo
        id="hero-video"
        type="youtube"
        src={videoId}
        onChange={handleVideoChange}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&start=0&end=23&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; encrypted-media"
            style={{ pointerEvents: 'none', border: 'none' }}
            title="Frontier Residences"
          />
          {/* Palette-derived, not black — see --overlay-media in index.css. */}
          <div className="absolute inset-0 overlay-media" aria-hidden="true" />
        </div>
      </EditableVideo>

      {/* z-10 keeps the block above the overlay; the search bar's own popovers
          carry higher stacking of their own. `measure="wide"` rather than the
          full 1440px container: the bar reads as a single control at ~1024px,
          and stretched to the full container it starts to look like a toolbar
          welded to the page. */}
      <Container measure="wide" className="relative z-10 py-lg">
        <Stack gap="md" align="center" className="animate-fade-in">
          <div className="space-y-sm">
            <EditableText
              id="hero-headline"
              value={headline}
              onChange={setHeadline}
              as="h1"
              className="t-display text-white text-balance drop-shadow-2xl"
            >
              {headline}
            </EditableText>
            {/* Deliberately held to one line's worth of width and left at body
                size: §9 asks for the headline to get the room and the
                supporting text not to compete with the search bar. */}
            <EditableText
              id="hero-subheadline"
              value={subheadline}
              onChange={setSubheadline}
              as="p"
              className="t-body text-white/90 max-w-2xl mx-auto drop-shadow-lg"
            >
              {subheadline}
            </EditableText>
          </div>

          <div className="text-left">
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
        </Stack>
      </Container>
    </section>
  );
};

export default Hero;
