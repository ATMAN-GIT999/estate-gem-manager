import { useState } from "react";
import EditableText from "./admin/EditableText";

/**
 * The band under the hero: where the homes are listed, and where they are.
 *
 * It absorbs the section that used to be called WhereWeHost — three regions
 * with an icon and half a line each, which was a whole screen of scrolling to
 * say what fits on one line now that the headline already names the coast.
 *
 * Distribution names carry weight for a guest deciding whether to book direct
 * ("these are the same listings I saw on Airbnb") and for an owner reading the
 * same page ("they are actually on the channels that matter").
 */
const TrustStrip = () => {
  const [listedLabel, setListedLabel] = useState("Listed on");
  const [channels, setChannels] = useState([
    "Airbnb",
    "Booking.com",
    "Idealista",
  ]);
  const [regions, setRegions] = useState(
    "Costa del Sol · Vienna & Carinthia · Istria"
  );

  const updateChannel = (index: number, value: string) => {
    const next = [...channels];
    next[index] = value;
    setChannels(next);
  };

  return (
    <section
      id="trust"
      className="py-10 bg-background border-b border-border scroll-mt-20"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <EditableText
              id="trust-listed-label"
              value={listedLabel}
              onChange={setListedLabel}
              as="span"
              className="text-xs uppercase tracking-widest text-foreground/50"
            >
              {listedLabel}
            </EditableText>
            {channels.map((channel, index) => (
              <EditableText
                key={index}
                id={`trust-channel-${index}`}
                value={channel}
                onChange={(v) => updateChannel(index, v)}
                as="span"
                className="font-playfair text-lg font-semibold text-primary/70"
              >
                {channel}
              </EditableText>
            ))}
          </div>

          <EditableText
            id="trust-regions"
            value={regions}
            onChange={setRegions}
            as="p"
            className="text-sm text-foreground/60"
          >
            {regions}
          </EditableText>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
