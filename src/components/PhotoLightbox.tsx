import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/contexts/LocaleContext";

interface PhotoLightboxProps {
  images: string[];
  /** The photo on show; `null` keeps the lightbox closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  /** Read by screen readers as the dialog's name, with the photo count. */
  title: string;
  /** The alt text for photo number `n` (1-based). */
  altFor: (n: number) => string;
}

/** A horizontal drag shorter than this is a tap, not a swipe. */
const SWIPE_PX = 50;

/**
 * One photo at a time, whole, with a way to the next and the previous one.
 *
 * ⚠️ The photograph sits in an `absolute inset-0` box, not in a `h-full`
 * child of the dialog. `DialogContent` is a CSS grid, and a percentage height
 * inside a grid row that sizes itself to its content is circular: the image
 * decided the row's height, so `max-h-full` never clipped anything. A photo
 * of 3000 × 4500 px became ~1500 px tall in a 700 px window, the middle 20 %
 * of it showed, and the arrows — centred on that oversized box — sat below the
 * bottom of the screen, so a guest who reached the first portrait photo could
 * not get on (found 11.10.2026). An absolutely positioned box has a definite
 * size from the fixed dialog around it, and everything inside resolves
 * against that.
 *
 * Arrow keys and swiping step through as well: the buttons are not the only
 * way on.
 */
const PhotoLightbox = ({ images, index, onIndexChange, title, altFor }: PhotoLightboxProps) => {
  const { t } = useLocale();
  const open = index !== null;
  const count = images.length;
  const touchStartX = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null || count < 2) return;
      onIndexChange((index + delta + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    if (!open || count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, count, step]);

  // Fetch the neighbours ahead of the click so stepping does not wait on a
  // 3000-px photograph.
  useEffect(() => {
    if (index === null || count < 2) return;
    for (const neighbour of [index + 1, index - 1]) {
      const src = images[(neighbour + count) % count];
      if (src) new Image().src = src;
    }
  }, [index, count, images]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <DialogContent
        className="max-w-6xl w-[calc(100vw-2rem)] h-[calc(100vh-4rem)] max-h-[calc(100dvh-1rem)] p-0 bg-background/95 border-0 [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-background/90 [&>button]:p-2 [&>button]:text-foreground [&>button]:opacity-100 [&>button]:shadow-elegant"
      >
        <DialogTitle className="sr-only">
          {title} — photo {index !== null ? index + 1 : 0} of {count}
        </DialogTitle>
        {index !== null && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const start = touchStartX.current;
              touchStartX.current = null;
              const end = e.changedTouches[0]?.clientX;
              if (start === null || end === undefined) return;
              if (end - start > SWIPE_PX) step(-1);
              else if (start - end > SWIPE_PX) step(1);
            }}
          >
            <img
              key={index}
              src={images[index]}
              alt={altFor(index + 1)}
              className="max-h-full max-w-full object-contain select-none"
            />
            {count > 1 && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label={t("pd-previous-photo")}
                  onClick={() => step(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background shadow-elegant"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label={t("pd-next-photo")}
                  onClick={() => step(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background shadow-elegant"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 t-body text-foreground shadow-elegant">
                  {index + 1} / {count}
                </span>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoLightbox;
