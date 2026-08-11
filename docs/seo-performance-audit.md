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

**Status:** ✅ erledigt · **Priorität:** hoch

**Umgesetzt:** `react-helmet-async`, `<HelmetProvider>` in `main.tsx`, dazu
`src/components/Seo.tsx` und `src/lib/siteMeta.ts` als einzige Quelle für
Firmendaten. **Alle 17 öffentlichen Routen** haben jetzt eigenen Titel,
Beschreibung, Canonical und Social-Tags.

**Canonical ist hier wichtiger als üblich:** Die Property-Karten hängen
`?checkIn=…&checkOut=…&guests=…` an, sobald jemand aus einer Suche kommt. Eine
einzelne Immobilie ist dadurch unter beliebig vielen URLs erreichbar, die ohne
Canonical alle gegeneinander antreten. Der Canonical zeigt immer auf den
reinen Slug.

`/auth`, `/update-password`, `/booking-confirmation` und die 404-Seite sind auf
`noindex` gesetzt.

**Nachgewiesen** durch serverseitiges Rendern der Komponente: Titel,
Description, Canonical, `og:*`, `twitter:*`, JSON-LD und `noindex` erscheinen
alle korrekt.

### ⚠️ Bekannte Grenze: Social-Previews

WhatsApp, LinkedIn und Facebook führen **kein JavaScript aus** — sie sehen nur
`index.html`. Per-Seite-Vorschauen brauchen Prerendering oder SSR. Google
rendert JS und sieht die Helmet-Werte.

Deshalb stehen in `index.html` nur noch neutrale Fallbacks: `og:title` und
`og:description` wurden dort entfernt, weil Helmet Tags **anhängt statt
ersetzt** — sonst hätte jede Seite zwei davon, und ein Parser, der den ersten
nimmt, hätte immer den generischen gelesen.

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

**Status:** ✅ erledigt (mit einer bewussten Auslassung) · **Priorität:** mittel-hoch

**Umgesetzt:** `src/lib/schema.ts` mit drei Bausteinen.

- **`RealEstateAgent`** (spezifischer als `LocalBusiness`) auf Start- und
  PM-Seite — mit Firmendaten aus dem Aviso Legal, Einzugsgebiet, Sprachen und
  den drei Leistungen als `makesOffer`. Eine feste `@id`, die überall
  referenziert wird, damit die Seiten als **ein** Unternehmen gelten.
- **`Accommodation`** pro Immobilie: Name, Beschreibung, Fotos, Ort,
  Schlafzimmer, Bäder, Belegung, Ausstattung, `provider` → Organisation.
- **`BreadcrumbList`** auf allen Unterseiten.

### Warum kein Preis im Property-Schema

Das Audit wollte `Product` + `Offer` für Preis-Snippets — das ist auch das
richtige Ziel. Nur: Die einzige verfügbare Zahl ist `price_per_night`, der beim
Import eingefrorene Basispreis, und der ist **nachweislich in beide Richtungen
falsch** (Wien 340 gespeichert gegen 221 live, Calahonda 65 gegen 90).

Diese Zahl als strukturierte Daten zu veröffentlichen hieße, Google einen Preis
zu nennen, den die Buchungsmaschine nicht abbucht — auf einer Seite, die selbst
„Live pricing" schreibt. Ein fehlender Preis kostet ein Rich Snippet; ein
falscher ist ein Widerspruch zwischen Markup und Seite, den der Gast beim
Bezahlen entdeckt.

**Punkt 1 in `open-todos.md`** (nächtlicher Job für den günstigsten Live-Preis)
schaltet das frei. Dann gehört `offers` in `propertySchema()`.

### Offen: `FAQPage`

Es gibt auf der ganzen Website **keine FAQ-Sektion**. Laut Skill
`website-seo-geo` sind Frage-Antwort-Paare das wertvollste Einzelformat für
Sichtbarkeit in KI-Antworten, weil sie direkt extrahierbar sind. Eine FAQ auf
der PM-Seite („Was kostet die Verwaltung?", „Wie lange bindet mich das?",
„Was passiert bei Schäden?") plus `FAQPage`-Schema wäre der nächste große
GEO-Hebel — braucht aber echte Antworten vom Kunden.

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

**Status:** ✅ erledigt · **Priorität:** mittel

Es waren nicht vier, sondern acht. Alle zu WebP konvertiert (Qualität 82,
Fotos auf max. 1600 px begrenzt):

| Datei | vorher | nachher | |
|---|---|---|---|
| property-4 | 1.329 KB | 165 KB | −88 % |
| property-2 | 1.191 KB | 115 KB | −91 % |
| property-5 | 821 KB | 112 KB | −87 % |
| property-3 | 670 KB | 66 KB | −90 % |
| villa-higueron | 670 KB | 65 KB | −90 % |
| platform-connections | 309 KB | 89 KB | −72 % |
| **frontier-logo** | **148 KB** | **12 KB** | **−92 %** |
| **whatsapp-icon** | **106 KB** | **5 KB** | **−95 %** |

**Der eigentliche Fund waren Logo und Icon.** Beide lagen als PNG mit 1.640
bzw. 1.920 px Breite vor und wurden mit 48–56 px dargestellt — das Logo auf
**jeder einzelnen Seite**. Auf 512 bzw. 128 px verkleinert bleibt reichlich
Reserve für Retina.

**Im Build gibt es jetzt kein einziges PNG mehr**; alle Bilder zusammen wiegen
**680 KB** statt vorher gut 5,5 MB.

**Nebenbefund:** `property-1.png` (1,1 MB) wird nirgends importiert. Vite
bündelt es deshalb gar nicht — es kostet nichts zur Laufzeit, liegt aber
unnötig im Repo. Die alten PNGs sind absichtlich liegengelassen worden, falls
die Originale nochmal gebraucht werden; sie landen in keinem Build.

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
