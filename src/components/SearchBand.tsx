import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import SearchBar from "./SearchBar";
import { Section } from "./layout";

/**
 * The search bar, on the landing page's one beige band.
 *
 * It used to sit inside the hero, over the video. White is the ground now, so
 * beige has to be spent deliberately — and the one thing a guest is meant to
 * do on this page is the only place worth spending it. Same control, same
 * `onSearch` contract (URL params → /properties); only the surface under it
 * changed.
 */
const SearchBand = () => {
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkInDate) params.set("checkIn", format(checkInDate, "yyyy-MM-dd"));
    if (checkOutDate) params.set("checkOut", format(checkOutDate, "yyyy-MM-dd"));
    if (guests) params.set("guests", guests);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <Section tone="quiet" size="sm" measure="wide">
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
    </Section>
  );
};

export default SearchBand;
