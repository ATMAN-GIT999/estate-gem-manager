# Elevating the luxury feel across the site

Colors, logos, page order and layout stay exactly as they are. This is the list of suggestions for you to review. Nothing changes until you pick which ones you want.

## 1. Typography (chosen: "Quiet modern")
- Headlines in **Libre Baskerville**, a refined bookish serif that gives you the editorial, hotel-brand feel.
- Body text in **IBM Plex Sans**, clean and precise. It matches the small monospace labels the site already uses.
- Headlines get slightly larger and lighter, with more space between lines. Small labels above headlines stay all caps with wider letter spacing.
- Applied the same way on every page (homepage, villa list and detail, owner pages).

## 2. Breathing room
- More space between sections and around headlines, so each block reads as its own "room" rather than a list.
- Narrower text columns so paragraphs read like a magazine, not a document.

## 3. Photography first
- Bigger villa photos on the homepage and in the property list, with fewer visible boxes and borders around them.
- Villa detail page: a large opening photo, similar to the homepage top, before the booking details.
- A slow, subtle zoom when you hover over a property photo.

## 4. Quiet motion
- Soft fade-and-rise as sections come into view while scrolling.
- Turned off automatically for visitors who prefer reduced motion.

## 5. Finer details
- Thin gold hairlines and small gold numbers ("01, 02, 03") as accents, used sparingly.
- Buttons: slimmer, all caps with wider spacing, with a gentle fill on hover instead of heavy blocks.
- Owner pages and other subpage tops get the same polished header treatment as the homepage.

## Suggested order
1. Fonts (biggest effect for the smallest change)
2. Breathing room + finer details
3. Photography and motion

## Technical notes
- Fonts self-hosted via `@fontsource` (no Google Fonts link, which keeps GDPR compliance for Austria). The swap happens in `tailwind.config.ts` and the `.t-*` type classes in `src/index.css`, so every page updates together.
- Spacing via the existing `--space-*` ladder and the `Section`/`Container` primitives, not per-component values.
- Motion via IntersectionObserver plus CSS, respecting `prefers-reduced-motion`.
- Booking, payment and inline-editing logic are not touched. `docs/DESIGN.md` and project memory get updated to the new font choice.
