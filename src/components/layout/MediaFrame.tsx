import { cn } from "@/lib/utils";
import EditableImage from "@/components/admin/EditableImage";

/**
 * One picture slot, in the two shapes the owner page needs — and the honest
 * empty state for the ones we do not have a photograph for yet.
 *
 * The redesign asks for five large images (hero, relax, contact, renovations,
 * investments) on top of the three case studies. `src/assets` holds four
 * distinct motifs, two of which are stored twice under different names
 * (`about-hero.webp` = `property-2.webp`, `villa-higueron.webp` =
 * `property-3.webp`), and none of them is the infinity pool the layout was
 * drawn around. Filling the gaps by repeating a motif would put the same
 * photograph on screen twice within one scroll, so the slots that have no
 * picture render a hatched frame that names the shot instead.
 *
 * `note` is therefore not decoration: it is the brief for whoever supplies the
 * photograph. Pass `src` and the frame becomes the real image with no other
 * change at the call site — which is the whole point of routing every one of
 * them through here rather than writing five bespoke <img> blocks.
 *
 * `fill` is for a picture used as a background (the section positions it,
 * this covers it); the default sits in the flow at a given aspect ratio.
 */
interface MediaFrameProps {
  id: string;
  /** Empty renders the placeholder. Set it and the slot becomes the photo. */
  src?: string;
  alt?: string;
  onChange?: (url: string) => void;
  /** What this slot is waiting for, e.g. "villa exterior, infinity pool". */
  note: string;
  /** Cover the positioned parent instead of sitting in the flow. */
  fill?: boolean;
  /** Ignored when `fill`. */
  aspect?: "wide" | "photo" | "square";
  /** Light the placeholder for the sage-green fill rather than the page. */
  onPrimary?: boolean;
  className?: string;
}

const aspectClass = {
  wide: "aspect-[16/9]",
  photo: "aspect-[4/3]",
  square: "aspect-square",
} as const;

const MediaFrame = ({
  id,
  src,
  alt = "",
  onChange,
  note,
  fill = false,
  aspect = "photo",
  onPrimary = false,
  className,
}: MediaFrameProps) => {
  const shape = fill
    ? "absolute inset-0 w-full h-full object-cover"
    : cn("w-full h-full object-cover", aspectClass[aspect]);

  if (src) {
    return (
      <EditableImage
        id={id}
        src={src}
        alt={alt}
        onChange={onChange}
        className={cn(shape, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        fill ? "absolute inset-0" : cn("w-full", aspectClass[aspect]),
        onPrimary ? "bg-placeholder-hatch-on-primary" : "bg-placeholder-hatch",
        // A full-bleed slot has copy laid over it and the fixed header across
        // its top, so its note goes bottom right — the one corner free in all
        // three of them. A slot sitting in the flow has the area to itself.
        "flex p-sm",
        fill ? "items-end justify-end" : "items-center justify-center",
        className
      )}
      // The frame stands in for a picture; its brief is for the team, not for
      // a screen reader trying to find out what the page says.
      aria-hidden="true"
    >
      <p
        className={cn(
          "t-meta text-center text-balance",
          onPrimary ? "text-primary-foreground/60" : "text-accent-strong/70"
        )}
      >
        {note}
      </p>
    </div>
  );
};

export default MediaFrame;
