import { useMemo } from "react";

/**
 * The location panel — a real Google Maps embed, not the drawn placeholder
 * this used to be.
 *
 * ⚠️ Decision (Almedin, 29.09.2026): loads on every page view, no
 * click-to-load gate. That is a deliberate exception to the rest of the
 * site's no-third-party-request-before-consent stance (the reasoning that
 * keeps Google Fonts off this site) — the owner asked for the map itself
 * over the drawn placeholder, and for it to load immediately.
 *
 * Built on the keyless `output=embed` iframe rather than the official Maps
 * Embed API on purpose: the official API needs a Google Cloud project with
 * billing enabled and an API key, which nobody has set up. The keyless
 * version is undocumented and Google could change it without notice, but it
 * has been the common way to embed a Maps location for years. If Google ever
 * breaks it, swap the iframe `src` for the official Embed API URL once a key
 * exists — the rest of this component does not need to change.
 *
 * Coordinates give the tightest, most accurate pin; `address` is the
 * fallback when a listing has none (Google then geocodes the text itself),
 * and `label` (the town/area name) is the last resort so the panel still
 * renders something rather than nothing.
 */

interface SurroundingsMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  label: string;
}

const SurroundingsMap = ({ latitude, longitude, address, label }: SurroundingsMapProps) => {
  const query = useMemo(() => {
    if (latitude != null && longitude != null) return `${latitude},${longitude}`;
    if (address) return address;
    return label;
  }, [latitude, longitude, address, label]);

  const zoom = latitude != null && longitude != null ? 14 : 12;
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;

  return (
    // aspect-video (16:9), not the old 21/9 full-bleed strip (Almedin,
    // 04.10.2026) — sits inside the page's normal container now, not
    // edge-to-edge, see the Section it's rendered in on PropertyDetail.tsx.
    <div className="relative w-full aspect-video overflow-hidden bg-quiet">
      <iframe
        src={src}
        title={`Map of the area around ${label}`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default SurroundingsMap;
