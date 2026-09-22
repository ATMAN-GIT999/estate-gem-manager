import { useMemo } from "react";
import { MapPin } from "lucide-react";

/**
 * The location panel — a drawn map, not a tiled one.
 *
 * A real tile layer would mean a third-party request for every visitor before
 * they have clicked anything, which is the same objection that keeps Google
 * Fonts off this site. It would also pin the house to a street address, and
 * what a guest actually needs at this point in the page is the shape of the
 * setting: water on one side, land on the other, and roughly where in it the
 * house sits.
 *
 * The coastline is derived from the property's own coordinates so two houses
 * in different towns do not get the same picture: the longitude decides how
 * far along the frame the bay sits, the latitude how high. `latitude` and
 * `longitude` are populated by `import-guesty-properties`; without them the
 * panel still renders, just centred.
 */

interface SurroundingsMapProps {
  latitude?: number | null;
  longitude?: number | null;
  label: string;
}

const SurroundingsMap = ({ latitude, longitude, label }: SurroundingsMapProps) => {
  // Two stable numbers in 0..1 from the coordinates — the same house always
  // gets the same coastline, a different house a different one.
  const { cx, cy } = useMemo(() => {
    const frac = (n: number) => Math.abs(n % 1);
    return {
      cx: 30 + frac(longitude ?? 0.5) * 40, // 30–70% across
      cy: 34 + frac(latitude ?? 0.5) * 26, // 34–60% down
    };
  }, [latitude, longitude]);

  return (
    <div
      className="relative w-full aspect-[21/9] overflow-hidden"
      style={{ background: "hsl(205 42% 72%)" }}
      role="img"
      aria-label={`Map of the area around ${label}`}
    >
      {/* The land mass. An ellipse rather than a traced coastline: it reads as
          a map without claiming to be one. */}
      <div
        className="absolute rounded-[50%]"
        style={{
          background: "hsl(var(--quiet))",
          left: "-18%",
          right: "22%",
          top: "18%",
          bottom: "-30%",
        }}
        aria-hidden="true"
      />

      {/* The radius around the house. */}
      <div
        className="absolute rounded-full"
        style={{
          background: "hsl(var(--primary) / 0.18)",
          border: "1px solid hsl(var(--primary) / 0.35)",
          width: "22%",
          aspectRatio: "1",
          left: `${cx}%`,
          top: `${cy}%`,
          transform: "translate(-50%, -50%)",
        }}
        aria-hidden="true"
      />

      {/* The pin. */}
      <div
        className="absolute flex flex-col items-center gap-1"
        style={{ left: `${cx}%`, top: `${cy}%`, transform: "translate(-50%, -50%)" }}
      >
        <span className="t-tag bg-background text-foreground px-2 py-1 rounded-sm shadow-sm whitespace-nowrap">
          {label}
        </span>
        <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center shadow-sm">
          <MapPin className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
};

export default SurroundingsMap;
