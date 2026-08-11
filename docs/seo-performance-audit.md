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

**Status:** ✅ erledigt · **Priorität:** hoch (größter Hebel, ein Datei-Umbau)

**Umgesetzt:** alle 13 `/admin/*`-Routen in `src/App.tsx` auf `React.lazy()`
umgestellt, ein `<Suspense>` um die `<Routes>`. Bewusst pro Route statt einem
gemeinsamen Admin-Chunk — wer Bookings öffnet, braucht den Page-Builder nicht.

| | vorher | nachher |
|---|---|---|
| Haupt-JS (gzip) | 750,5 KB | **377,5 KB** |
| Haupt-CSS (gzip) | 29,3 KB | **17,5 KB** |
| JS-Chunks | 1 | 32 |

**Der eigentliche Brocken war `grapesjs`** im Page-Builder: 1,14 MB, jetzt in
`Builder-*.js` ausgelagert und wird nur unter `/admin/builder` geladen. Die
Vite-Warnung bleibt bestehen, betrifft aber jetzt nur noch diesen Chunk.

Alle Routen inklusive `/admin/builder` und `/admin/dashboard` weiterhin 200.

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

**Status:** ✅ erledigt · **Priorität:** vorgezogen (enthielt den einzigen
rechtlichen Punkt der Liste)

**Fonts selbst gehostet.** `@fontsource-variable/playfair-display` +
`@fontsource/lato`, die beiden `fonts.googleapis.com`-Links aus `index.html`
entfernt. Im gesamten Build gibt es **keine Google-Font-Referenz mehr**.

Drei Details, die dabei aufgefallen sind:

- Der Variable-Font registriert sich als **`'Playfair Display Variable'`** —
  ein anderer Familienname. `index.css` und `tailwind.config.ts` mussten
  nachziehen, sonst wären alle Überschriften still auf `serif` zurückgefallen.
- Lato wird **latin-only** importiert. Die Vollversion bringt latin-ext mit,
  dessen drei woff-Subsets klein genug sind, dass Vite sie als base64 direkt
  ins CSS einbettet — 15 KB im Render-Pfad, die sich kaum komprimieren.
  latin deckt U+0000–00FF ab, also Málaga, Wien und Sauerwald.
- Der **Page-Builder** lud Google Fonts in seine Vorschau-Iframe
  (`Builder.tsx:101`). Nur Admins betroffen, aber derselbe Defekt — jetzt über
  `?url` auf die lokalen Dateien. Dort die statische Playfair-Variante, weil
  die Schriftauswahl im Editor „Playfair Display" anbietet.

Kosten: Haupt-CSS 17,54 → **18,19 KB** gzip, dafür zwei externe Requests und
zwei DNS/TLS-Verbindungen weniger.

**`sitemap.xml` wird beim Build erzeugt** (`scripts/generate-sitemap.mjs`,
in `npm run build` eingehängt): 35 URLs, davon **23 Property-Seiten**, deren
Slugs live aus Supabase kommen. Schlägt die Abfrage fehl, entsteht eine
Sitemap nur mit statischen Routen statt eines fehlgeschlagenen Deploys.

**`llms.txt` angelegt** — Leistungen, Regionen, Firmendaten und die wichtigsten
Seiten in extrahierbarer Form.

**`robots.txt` korrigiert.** Vorher standen dort eigene `Allow`-Gruppen für
Googlebot, Bingbot, Twitterbot und facebookexternalhit. Da ein Crawler nur
seine spezifischste Gruppe liest und alle anderen ignoriert, hätte jedes
künftige `Disallow` in der `*`-Gruppe **genau diese vier nicht erreicht**.
Jetzt eine einzige Gruppe, plus Sitemap-Verweis. KI-Crawler sind namentlich im
Kommentar als erwünscht festgehalten, damit sie niemand später aussperrt.

### ⚠️ Nebenbefund: zwei verschiedene Telefonnummern

| Wo | Nummer |
|---|---|
| `Footer.tsx`, `InstantBookFallbackDialog.tsx` | +34 665 51 18 53 |
| `AvisoLegal.tsx` (Impressum) | +34 649 429 678 |

Für lokales SEO zählt NAP-Konsistenz (Name/Adresse/Telefon überall identisch,
auch im Google-Business-Profil). **Welche ist die richtige?** Wird für das
`LocalBusiness`-Schema in Punkt 3 gebraucht.

---

## Referenz

Vorgaben/Herleitung: `.claude/skills/website-stack/SKILL.md` und
`.claude/skills/website-seo-geo/SKILL.md` in diesem Projekt (kopiert aus dem
AS-Intel-Monorepo). Konkrete, lauffähige Beispiele für JSON-LD-Helper und
Meta-Tag-Komponente: `templates/starter-astro-marketing/src/lib/schema.ts` im
AS-Intel-Repo (`OneDrive\Desktop\AS-Intel`) — Muster übertragbar, auch wenn der
Stack dort Astro statt Vite/React ist.
