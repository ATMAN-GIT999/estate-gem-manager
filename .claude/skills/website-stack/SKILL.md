---
name: website-stack
description: Use whenever scaffolding a new AS Intel client website project, choosing the tech stack/CMS, or implementing scroll/animation/performance behavior. Read BEFORE running a framework scaffold command, adding an animation library, or making CMS/hosting choices. Enforces the standard AS Intel stack (Astro-first, Lenis+GSAP restrained, no Three.js by default) and the non-negotiable performance/accessibility budget. Triggers on: "neues Projekt aufsetzen", "Tech-Stack", "Astro", "Next.js", "CMS wählen", "Lenis", "GSAP", "Performance-Budget", "Core Web Vitals", "Barrierefreiheit", "prefers-reduced-motion".
---

# Website-Stack für AS Intel

Hintergrund/Herleitung: `docs/strategie-state-of-the-art-websites.md` im Repo-Root. Für Meta-Tags, Schema/strukturierte Daten, Sitemap und GEO-Vorgaben siehe Skill `website-seo-geo`.

## Framework-Wahl

- **Standard für praktisch jedes Kundenprojekt (Immobilien, SHK, Handwerk, lokale Dienstleister): Astro.** Liefert standardmäßig kein/kaum JavaScript aus, Interaktivität wird gezielt als "Island" hinzugefügt. Entscheidend für die mobile, oft ungeduldige Zielgruppe dieser Branchen.
- **Next.js nur, wenn ein Kunde echte App-Logik braucht** (Login/Kundenportal, dynamische Backend-Prozesse, API-Routen). Nicht den schwereren Stack auf eine einfache Marketing-/Leistungsseite setzen.
- Solange `templates/starter-astro-marketing` im Monorepo noch nicht existiert: neues Projekt frisch mit Astro aufsetzen und dabei die Standards aus diesem Skill (Lenis-Setup, Performance-Budget, Accessibility-Defaults) direkt einbauen — und danach erwägen, das Setup als wiederverwendbares Template unter `templates/` zurückzuführen, damit das nächste Projekt nicht wieder bei null anfängt.

## Animation-Setup

- **Lenis** als Standard-Scroll-Library auf jedem Projekt (weiches Scroll-Gefühl, ~3 KB, eigener rAF-Loop).
- **GSAP** nur für klar definierte, funktionale Übergänge (siehe `website-design` für die Gestaltungsregeln dazu) — sparsam einsetzen, nicht als Show-Choreografie.
- **Kein Three.js/WebGL als Standard.** Nur bei explizitem Kundenwunsch UND entsprechendem Budget/Zeitrahmen einplanen — vorher mit Almedin abstimmen, nicht eigenständig entscheiden.
- `prefers-reduced-motion` ist Pflicht, keine Kür — Basis-Snippet:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Bei GSAP/Lenis zusätzlich programmatisch prüfen (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`) und Scroll-Animationen/Lenis-Smoothing dann deaktivieren statt nur zu verkürzen.

## CMS-Wahl

- **Sanity**, wenn der Kunde selbst redaktionell pflegen will und Kollaboration/Komfort im Vordergrund steht.
- **Payload**, wenn AS Intel die Pflege übernimmt oder volle Kontrolle/kein Vendor-Lock-in gewünscht ist (self-hosted, TypeScript-nativ).
- Solange nicht agenturweit final entschieden (offene Frage in `docs/strategie-state-of-the-art-websites.md`, Abschnitt 8): pro Projekt bewusst wählen und Begründung kurz dokumentieren, nicht automatisch das gleiche CMS wie beim letzten Projekt übernehmen.

## Nicht verhandelbares Performance-Budget

| Metrik | Ziel |
|---|---|
| LCP (Largest Contentful Paint) | < 2,5 s |
| INP (Interaction to Next Paint) | < 200 ms |
| CLS (Cumulative Layout Shift) | < 0,1 |
| Animationen | konstant 60 fps, auch auf Mittelklasse-Hardware/Handys |

Diese Werte von Anfang an im Setup mitdenken (Bildoptimierung, keine ungenutzten JS-Bundles, Fonts mit `font-display: swap` o. ä.), nicht erst am Ende der Entwicklung nachbessern.

## Monorepo-Konventionen

- Neues Kundenprojekt kommt unter `clients/<kundenname>/` und ist eigenständig (eigenes `package.json`, eigene Build-Config).
- Wiederverwendbares (Design-Tokens, UI-Komponenten, Motion-Utilities) gehört nach `shared/`, sobald es von einem zweiten Projekt tatsächlich gebraucht wird — nicht vorab spekulativ auslagern.
- `pnpm workspaces` + Turborepo erst einführen, wenn `shared/` wirklich von 2+ aktiven Projekten gleichzeitig genutzt wird (siehe Strategiedokument, Abschnitt 5). Bis dahin bleibt jedes Client-Projekt unabhängig.

## Vor dem Abliefern prüfen

1. Lighthouse/PageSpeed-Check gegen die Budget-Tabelle oben, insbesondere mobil.
2. `prefers-reduced-motion` real getestet (nicht nur Code vorhanden, sondern Verhalten geprüft).
3. Wurde Three.js/eine schwere Library ungeprüft "weil cool" hinzugefügt? Falls ja: zurücknehmen oder mit Almedin abstimmen.
4. Ist das CMS bewusst gewählt und nicht nur übernommen?
