import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import EditableText from "./admin/EditableText";
import EditableVideo from "./admin/EditableVideo";
import SearchBar from "./SearchBar";
import { Container } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import heroPoster from "@/assets/wf-hero-poster.webp";

/**
 * The opening band: eyebrow, headline, one supporting line, search bar — on
 * full-bleed video.
 *
 * ⚠️ A same-day trial (Almedin, 29.09.2026) swapped this video for a still
 * photograph — reverted the same day ("nicht das hero video entfernen"). The
 * photo (Villa Higuerón's stairwell glass) moved to TheClaim.tsx instead,
 * full-bleed there. If a photo hero comes up again, swap the block below for
 * a plain `<img>` + `.overlay-media` div, the way that trial did it — no
 * need to rediscover the approach.
 *
 * Back to holding the search bar itself (Almedin, 29.09.2026) — it had moved
 * out to its own beige band directly underneath (SearchBand.tsx) for a
 * while; that band is gone now, not just visually folded back in here. The
 * "See our homes" button that used to sit where the search bar is now is
 * also gone — a second, quieter action right next to the search field just
 * argued with it. The subheadline itself came back the same day with new
 * copy naming the actual places rather than a number of villas.
 *
 * Full-screen again, left-aligned (Almedin, 07.10.2026, taken 1:1 from the
 * Lovable landing reference): `min-h-[100svh]`, the copy block set into the
 * bottom-left, the search box on the right of the sub line. This reverses the
 * ~62vh band below, which existed so the section underneath was already
 * visible at rest — the reference deliberately spends the whole first screen
 * on the video instead. If "nothing below the fold" starts to cost
 * conversions, that band is the thing to go back to.
 *
 * The earlier band (for the record): it used to be `min-h-screen` with the
 * search bar arriving half a second late on a slide-in from the right, up to
 * 48px of empty space between the text and the bar. That read as something laid
 * over the hero rather than part of it, so it was cut to ~62vh and the bar and
 * the text were made one Stack.
 */
/**
 * Sets the place name in gold inside the headline — the one coloured phrase of
 * the page's H1. Found by text, not by position, so the three translations
 * ("…Costa del Sol…" in EN/DE/ES) and an inline-CMS edit all keep working; a
 * headline that no longer contains it simply renders plain.
 */
const HIGHLIGHT = "Costa del Sol";
const withHighlight = (text: string) => {
  const at = text.indexOf(HIGHLIGHT);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      {/* `text-accent`, not `accent-on-primary`: this is 99px display type on
          the darkened video, where the brass reads at full strength and the
          lighter on-primary variant washes out to beige. The "never
          `text-accent`" rule is about its 2.19:1 on WHITE — it does not apply
          here, and must not be copied to a light surface. */}
      <span className="text-accent">{HIGHLIGHT}</span>
      {text.slice(at + HIGHLIGHT.length)}
    </>
  );
};

const Hero = () => {
  const { t, language } = useLocale();
  const navigate = useNavigate();

  // Editable content state
  const [eyebrow, setEyebrow] = useState(t("hero-eyebrow"));
  const [headline, setHeadline] = useState(t("hero-headline"));
  const [subheadline, setSubheadline] = useState(t("hero-subheadline"));

  // See Navigation.tsx's identical effect — resets to the new language's
  // default rather than preserving a manual inline-CMS edit, since nothing
  // persists past a reload today anyway (docs/PROJECT.md C7).
  useEffect(() => {
    setEyebrow(t("hero-eyebrow"));
    setHeadline(t("hero-headline"));
    setSubheadline(t("hero-subheadline"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // The same state and URL contract SearchBand.tsx used to hold — moved back
  // in here with it, not rebuilt.
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

  /**
   * Self-hosted since 19.08.2026 (docs/DECISIONS.md §22, resolves PROJECT.md
   * C6). `public/videos/hero-background.mp4` used to look like the
   * self-hosted replacement for the YouTube embed below — present,
   * plausibly named, never actually wired up, and not even a real video (its
   * first bytes were `<!doctype html>`). Almedin supplied a real clip
   * (Puente Romano); re-encoded from a 222MB/4K source to 1280×720, audio
   * stripped (it autoplays muted regardless), capped around 2.2 Mbps —
   * 5.8MB for a 21s loop, in line with the performance budget `website-stack`
   * asks for. This also removes the privacy trade-off the previous comment
   * here used to name: `youtube.com/embed` no longer loads for every visitor
   * before they have clicked anything.
   *
   * `videoId` stays set as the dormant fallback — flip `videoType` back to
   * `"youtube"` (or use the editor's YouTube tab) if a reason to prefer the
   * embed ever comes up again; `EditableVideo` and the branch below still
   * support both.
   */
  const [videoType, setVideoType] = useState<"youtube" | "file" | "none">("file");
  const [videoId, setVideoId] = useState("tqmWpFCv_1M");
  const [videoFileSrc, setVideoFileSrc] = useState("/videos/hero-background.mp4");

  const handleVideoChange = (src: string, type: "youtube" | "file") => {
    setVideoType(type);
    if (type === "youtube") {
      setVideoId(src);
    } else {
      setVideoFileSrc(src);
    }
  };

  return (
    // `items-end` pins the copy to the bottom of the first screen, the way the
    // reference does; `pt-20` still clears the fixed 80px header on a short
    // viewport where the block grows tall enough to reach it. `100svh`, not
    // `100vh`: on a phone the latter is taller than what is actually visible
    // once the browser's address bar is up, and would push the search box off.
    <section className="relative flex items-end overflow-hidden pt-20 min-h-[100svh]">
      <EditableVideo
        id="hero-video"
        type={videoType === "none" ? "file" : videoType}
        src={videoType === "youtube" ? videoId : videoFileSrc}
        onChange={handleVideoChange}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {videoType === "youtube" && videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&start=0&end=23&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
              allow="autoplay; encrypted-media"
              style={{ pointerEvents: 'none', border: 'none' }}
              title="Frontier Residences"
            />
          ) : videoType === "file" && videoFileSrc ? (
            <video
              src={videoFileSrc}
              /* A poster so the first paint is the brand rather than a black
                 rectangle — the clip is 5.8 MB and decodes a beat after the
                 rest of the page is already up. */
              poster={heroPoster}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // Reached only if the video is cleared in the editor with nothing
            // swapped in yet — the same hatched placeholder MediaFrame uses
            // elsewhere, rather than a photograph borrowed from another page.
            <div
              className="absolute inset-0 bg-placeholder-hatch flex items-end justify-end p-sm"
              aria-hidden="true"
            >
              <p className="t-meta text-accent-strong/70 text-balance text-right">
                Hero video — replace via the editor
              </p>
            </div>
          )}
          {/* Palette-derived, not black — see --overlay-hero in index.css.
              Hero-only variant of --overlay-media: a longer fade at the top
              (under the floating nav) and a touch more darkening throughout
              (Almedin, 04.10.2026). */}
          <div className="absolute inset-0 overlay-hero" aria-hidden="true" />
        </div>
      </EditableVideo>

      {/* z-10 keeps the block above the overlay; the search bar's own popovers
          carry higher stacking of their own. Full container width and left
          aligned — the 12-column split below (5 + 7) is what puts the search
          box to the right of the sub line instead of under a centred stack. */}
      {/* `md:pb-24` rather than the reference's 56px: the fixed WhatsApp button
          sits bottom-right and would otherwise overlap the search box's corner. */}
      <Container className="relative z-10 pb-10 pt-lg md:pb-24 animate-fade-in">
        <EditableText
          id="hero-eyebrow"
          value={eyebrow}
          onChange={setEyebrow}
          as="p"
          className="t-tag text-[0.6875rem] text-accent-on-primary"
        >
          {eyebrow}
        </EditableText>

        {/* `max-w-5xl` is what makes it break into four short lines instead of
            two long ones at 99px — a text measure, not a container width. */}
        <EditableText
          id="hero-headline"
          value={headline}
          onChange={setHeadline}
          as="h1"
          className="t-hero mt-6 max-w-5xl text-white"
        >
          {withHighlight(headline)}
        </EditableText>

        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          <EditableText
            id="hero-subheadline"
            value={subheadline}
            onChange={setSubheadline}
            as="p"
            className="t-body max-w-md text-white/[0.86] md:col-span-5"
          >
            {subheadline}
          </EditableText>

          <div className="md:col-span-7">
            <SearchBar
              variant="editorial"
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
        </div>
      </Container>
    </section>
  );
};

export default Hero;
