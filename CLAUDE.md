# CLAUDE.md

## AS-Intel-Skills in diesem Projekt

Unter `.claude/skills/` liegen vier Skills, die auch im AS-Intel-Monorepo
(`OneDrive\Desktop\AS-Intel`) verwendet werden: `website-design`,
`website-conversion`, `website-stack`, `website-seo-geo`. Sie gelten auch
hier für Redesign/Fine-Tuning dieser Website.

**Eine Ausnahme:** Der Abschnitt "Framework-Wahl" in `website-stack`
(Astro als Standard) gilt **nicht** für dieses Projekt — der Stack steht
bereits fest: Vite + React + TypeScript + shadcn/ui + Tailwind + Supabase.
Nicht auf Astro umstellen. Der Rest von `website-stack` (Lenis/GSAP-Setup,
Performance-Budget, `prefers-reduced-motion`) gilt trotzdem.

`website-design`, `website-conversion` und `website-seo-geo` gelten
uneingeschränkt — insbesondere die Anti-Pattern-Liste in `website-design`
ist bei einem shadcn/ui-Projekt besonders relevant zu prüfen (shadcn/Radix
ist ein häufiger technischer Unterbau für den "generischen KI-Look").
