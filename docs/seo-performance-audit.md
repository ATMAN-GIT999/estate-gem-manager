# SEO- & Performance-Befunde

Externe Prüfung am 2026-08-11 anhand der AS-Intel-Skills (`.claude/skills/website-stack`,
`website-seo-geo`) — Code-Durchsicht plus ein echter `npm run build`. Ergänzt
`open-todos.md`, ersetzt es nicht: dort geht es um Content/Struktur/Bugs, hier um
Ladezeit und Auffindbarkeit. **Keiner der Punkte hier berührt Buchungs-Engine,
Guesty oder Stripe.**

Empfohlene Reihenfolge: **1 → 2 → 3 → 4 → 5 → 6** (Aufwand steigt, Risiko bleibt
überall niedrig — reine Technik, kein Content-Redesign).

---

## 1 · Admin-Bereich lädt bei jedem Besuch mit

**Status:** offen · **Priorität:** hoch (größter Hebel, ein Datei-Umbau)

**Befund:** `npm run build` liefert **ein JS-Bundle mit 2,77 MB (750 KB gzip)** —
Vite warnt beim Build selbst davor ("Some chunks are larger than 500 kB").

**Ursache:** `src/App.tsx` importiert alle ~30 Routen **statisch** am Dateianfang,
inklusive des kompletten `/admin/*`-Bereichs (Dashboard, Analytics, Marketing,
Calendar, Messages — und `AdminBuilder`, das `grapesjs` einbindet, eine
vollständige visuelle Editor-Bibliothek). Kein `React.lazy()` irgendwo im Projekt.

**Konsequenz:** Ein anonymer Gast, der nur Fotos einer Ferienwohnung ansehen will,
lädt denselben Code wie der Admin-Bereich mit.

**Fix:** `/admin/*`-Routen in `src/App.tsx` auf `React.lazy()` + `<Suspense>`
umstellen. Reine Technik, kein Design/Content betroffen, keine Freigabe nötig.

---

## 2 · Alle Seiten teilen sich Titel & Beschreibung

**Status:** offen · **Priorität:** hoch

**Befund:** `index.html` setzt `<title>` und `<meta name="description">` einmal,
global. Im gesamten `src/`-Ordner gibt es kein `react-helmet`, kein dynamisches
`document.title`, keine per-Route-Metadaten.

**Konsequenz:** About, Property Management, Guaranteed Income, Renovations,
Investments und **jede einzelne der 23 Property-Detail-Seiten** haben für Google
denselben Titel und dieselbe Beschreibung. Die Property-Seiten sind eigentlich
einzigartiger Content (Adresse, Preis, Fotos) — aktuell für die Suche unsichtbar.

**Fix:** `react-helmet-async` (oder gleichwertig) einbauen, pro Seite eigenes
Title/Description setzen. Bei Property-Detail: Titel aus Objektname + Ort bauen.

---

## 3 · Keine strukturierten Daten (JSON-LD)

**Status:** offen · **Priorität:** mittel-hoch

**Befund:** kein `application/ld+json`, kein `schema.org` irgendwo im Code.

**Konsequenz:** Für ein Property-Management-Unternehmen mit echten, buchbaren
Objekten ist `Product`/`Offer`-Schema pro Immobilie eine der wertvollsten
Maßnahmen überhaupt — Preis-Rich-Snippets in Google, Sichtbarkeit in
KI-Antworten (ChatGPT, Perplexity, Google AI Overviews) bei Anfragen wie
„Ferienwohnung Marbella mit Pool".

**Fix:** JSON-LD-Helper analog zu `templates/starter-astro-marketing/src/lib/schema.ts`
im AS-Intel-Repo, `Organization`/`LodgingBusiness` global + `Product`+`Offer` pro
Property-Detail-Seite.

---

## 4 · Social-Preview zeigt noch den Lovable-Platzhalter

**Status:** offen · **Priorität:** mittel (schnell erledigt, sichtbarer Marken-Tell)

**Befund:** `index.html` → `og:image` zeigt `https://lovable.dev/opengraph-image-p98pqg.png`.

**Konsequenz:** Teilt jemand den Link in WhatsApp/LinkedIn, erscheint das
generische Lovable-Platzhalterbild statt einer echten Frontier-Residences-Vorschau
— für eine Luxusmarke ein sichtbares „das wurde mit einem KI-Tool gebaut"-Signal.

**Fix:** echtes Marken-/Hero-Bild als `og:image` hinterlegen (1200×630px).

---

## 5 · Vier Property-Fotos unkomprimiert

**Status:** offen · **Priorität:** mittel

**Befund:** in `src/assets` liegen `property-2.png` (1,22 MB), `property-3.png`
(686 KB), `property-4.png` (1,36 MB), `property-5.png` (840 KB) — unkomprimiertes
PNG. `about-hero.webp` (108 KB) zeigt, dass WebP im Projekt schon bekannt ist,
nur nicht konsequent angewendet.

**Fix:** zu WebP/AVIF konvertieren, wie bei `about-hero` bereits gemacht.

---

## 6 · Fehlende Basis-Bausteine

**Status:** offen · **Priorität:** niedrig, aber schnell erledigt

- **Google Fonts extern geladen** (`fonts.googleapis.com` in `index.html`) statt
  selbst gehostet — zusätzlicher Request, und für ein Unternehmen mit
  Kunden/Sitz in Österreich ein bekanntes DSGVO-Risiko (deutsche/österreichische
  Gerichte werten das externe Nachladen als Verstoß, da die IP-Adresse des
  Besuchers an Google übertragen wird). Fix: `@fontsource` oder eigenes Hosting.
- **Keine `sitemap.xml`** — weder unter `public/` noch im Build erzeugt.
- **Kein `llms.txt`** — Sichtbarkeit in KI-Antwortmaschinen (siehe Skill
  `website-seo-geo`).

---

## Referenz

Vorgaben/Herleitung: `.claude/skills/website-stack/SKILL.md` und
`.claude/skills/website-seo-geo/SKILL.md` in diesem Projekt (kopiert aus dem
AS-Intel-Monorepo). Konkrete, lauffähige Beispiele für JSON-LD-Helper und
Meta-Tag-Komponente: `templates/starter-astro-marketing/src/lib/schema.ts` im
AS-Intel-Repo (`OneDrive\Desktop\AS-Intel`) — Muster übertragbar, auch wenn der
Stack dort Astro statt Vite/React ist.
