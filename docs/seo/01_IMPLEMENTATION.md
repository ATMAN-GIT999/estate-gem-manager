# SEO Foundation — Umsetzung in Claude Code

> Übergabe aus der Cowork-Analyse an die Code-Umgebung.
> Grundlage: `docs/seo-struktur-2026-09.md`, `docs/PROJECT_MAP.md`,
> `docs/DECISIONS.md`, `data/properties/inventar-2026-09-25.md`
>
> Stand: 25.09.2026

---

## So wird das hier benutzt

In VS Code im Repository `estate-gem-manager` eine Claude-Code-Session
starten und **ein Paket nach dem anderen** übergeben — nicht alle auf einmal.
Nach jedem Paket verifizieren, dann das nächste.

---

## Rahmen — gilt in jedem Paket

**Branch:** `redesign/wireframe-2026-09`. **`main` wird nicht angefasst** —
kein Merge, kein Rebase, kein Push nach `main`, auch nicht „nur rein". Der
Merge nach `main` passiert erst nach Freigabe durch Frontier Residences.

**Commit und Push nur auf ausdrückliche Ansage.** Commit-Messages beschreiben
die Wirkung, nicht die Mechanik, im Imperativ und auf Englisch.

**Nicht anfassen ohne Rückfrage:**

- Buchungs-Engine, Guesty-Anbindung, Stripe-Fluss
- `LEAD_SOURCE`, `PHOTO_BUCKET`, `metadata.submitted_from` — das sind die
  Werte, die die RLS-Policies durchlassen; eine Änderung lässt jeden Lead
  lautlos verschwinden
- die Farbpalette
- der sequenzielle Kalender-Loop in `Properties.tsx` (Guesty erlaubt nur
  3 Tokens / 24 h)

**Migrationen:** schreiben ja, **anwenden nur nach Absprache.**

**Beim Testen:** Quotes sind harmlos, **Reservierungen nicht.** Keine
Reservierung anlegen.

**Keine harten Strings im JSX.** Jeder neue Text geht nach
`src/lib/translations.ts` — und **jeder EN-Schlüssel braucht einen DE- und
einen ES-Eintrag**, sonst schlägt `npx tsc --noEmit` fehl.

**Verifikation nach jedem Paket** (es gibt keine Tests):

```bash
npx tsc --noEmit   # muss sauber sein
npm run build      # muss durchlaufen
npm run lint       # 9 Altlast-Fehler sind der Ausgangswert — zählt: keine neuen
npm run dev        # Port 8080, betroffene Seiten ansehen
```

Vor dem Push prüfen, ob `.env` noch auf `womaoywuhjchtubacbvn` zeigt — der
Lovable-Editor setzt sie still auf ein totes Altprojekt zurück.

---

## Paket A — sofort, hängt von nichts ab

**Ziel:** die Fehler, die jeder JS-lose Client und jeder Share-Link sieht.

### A1 · `index.html`

- `<meta name="description">` auf den Stand von `src/lib/siteMeta.ts` ziehen.
  **Kroatien streichen** — es ist ein abgeschlossenes Renovierungsprojekt,
  kein Markt (DECISIONS §7).
- `og:image` zeigt auf `https://lovable.dev/opengraph-image-p98pqg.png`.
  Ersetzen durch `https://frontier-residences.com/og-image.png` (die Datei
  liegt in `public/`).
- **Weiterhin keine** `og:title` / `og:description` ergänzen — Helmet hängt
  an statt zu ersetzen, es gäbe jede Angabe doppelt.

### A2 · Startseiten-H1

`src/lib/translations.ts`, Schlüssel `hero-headline`:

| | |
|---|---|
| EN | `Luxury Vacation Rentals in Spain and Austria` |
| DE | `Luxus-Ferienunterkünfte in Spanien und Österreich` |
| ES | `Alquileres vacacionales de lujo en España y Austria` |

Begründung in DECISIONS §12. **`Luxury Villas & Apartments to Book` auf
`/properties` bleibt** — dort stimmt es.

### A3 · `PageWrapper` entsperren

`src/components/PageWrapper.tsx` rendert nichts, bis eine Supabase-Abfrage
auf die Tabelle `pages` zurückkommt („Show nothing until we've checked").
Das blockiert den gesamten Inhalt von `/` und `/property-management` hinter
einem Netzwerk-Roundtrip, der für keine Seite einen Override liefert.

Zwei zulässige Lösungen — die einfachere wählen und begründen:

1. sofort die React-Seite rendern und einen gefundenen Override danach
   einblenden, oder
2. den Mechanismus für diese beiden Seiten abschalten

### A4 · Bilder

Alle zwölf `<img>` in `src/components/*.tsx` und `src/pages/*.tsx`
(ohne `admin/`):

- `width` und `height` setzen (echte Seitenverhältnisse, gegen CLS)
- `loading="lazy"` unterhalb des ersten Bildschirms — **nicht** am Hero-Bild
- Alt-Texte: beschreibend statt `${property.name} — 3`. Platzhalter-
  `MediaFrame`s bleiben `aria-hidden="true"`

### A5 · `/p/:slug`

`src/pages/DynamicPage.tsx` hat kein `<Seo>` und rendert beliebiges
gespeichertes HTML. Bis geklärt ist, wofür die Route gedacht ist:
`<Seo ... noindex />` ergänzen.

**Checkpoint A:** `tsc` / `build` / `lint` sauber, `/` und
`/property-management` im Dev-Server sichtbar schneller, Seitenquelltext von
`index.html` enthält kein „Croatia" und keine `lovable.dev`-URL mehr.

---

## Paket B — Datenebene

> **Voraussetzung:** Migration schreiben, **anwenden nur nach Absprache.**

**Ziel:** Frontier bekommt Felder, die der Guesty-Import nicht überschreibt.

### Warum

`supabase/functions/import-guesty-properties/index.ts` schreibt bei **jedem**
Lauf `name`, `slug`, `location`, `description`, `images` und
`price_per_night` neu. Erhalten bleiben nur `available` und `featured`. Jede
redaktionelle Korrektur an diesen Feldern ist beim nächsten Import weg
(DECISIONS §11).

### B1 · Migration schreiben

Neue Spalten auf `properties`:

| Spalte | Zweck |
|---|---|
| `city_group` | `malaga` · `marbella` · `fuengirola` · `vienna` · `carinthia` |
| `seo_slug` | die URL, die Frontier vergibt |
| `editorial_description` | Objekttext, den Frontier schreibt |

Optional gleich mit: `size_sqm` (Fläche fehlt heute komplett).

### B2 · Import anpassen

`baseProperty` in `import-guesty-properties` darf die neuen Spalten **nicht**
enthalten. Der `update`-Zweig darf sie nicht überschreiben. Ein Kommentar im
Code, der erklärt warum — sonst „räumt" eine spätere Session das wieder weg.

### B3 · Zuordnung und Slugs

Zuordnung laut `docs/seo-struktur-2026-09.md` §3:

| `city_group` | Objekte |
|---|---|
| `malaga` | 6 Stadtwohnungen Soho/Centro + 3 Torremolinos = 9 |
| `marbella` | Los Monteros Retreat · The Hideaway Los Flamingos · Luxury Escape Los Flamingos · Casa Heredia = 4 |
| `fuengirola` | THE ONE Higuerón · Luxury Villa Higuerón · Oaks&Thistle Calahonda = 3 |
| `vienna` | 2 |
| `carinthia` | 5 (Lima Alpine Lodges) |

`seo_slug` nach dem Muster `<ort>-<kurzname>`, z. B.
`benahavis-casa-heredia`, `malaga-soho-art-experience`,
`fuengirola-the-one-higueron`.

**Checkpoint B:** Migration geschrieben und besprochen; Import läuft und
überschreibt die neuen Felder nachweislich nicht.

---

## Paket C — die Ortsseiten

**Ziel:** `/vacation-rentals/:city` existiert, mit echtem Inhalt.

### C1 · Route und Seite

- `/vacation-rentals` — Übersicht aller fünf Orte
- `/vacation-rentals/:city` — Ortsseite, Objekte über `city_group` geladen

Aufbau in dieser Reihenfolge (Details in `docs/seo-struktur-2026-09.md` §3):
H1 + Einordnungsabsatz → Objektraster (`PropertyCard` wiederverwenden) →
2–4 Absätze Lagen/Viertel → Anreise und Saison → 3–5 FAQ → **eine** Zeile
Eigentümer-Brücke am Ende.

⚠️ Die Absätze 3–5 sind der Unterschied zwischen einer Location-Seite und
einer gefilterten Liste mit eigener URL. Ohne sie ist die Seite eine
Doorway-Page. **Keine erfundenen Ortsfakten** — was nicht belegt ist, kommt
nicht rein.

### C2 · `<Seo>` und Schema

Titles und Descriptions nach den Mustern in
`docs/seo-struktur-2026-09.md` §3 und §4.
Schema: `CollectionPage` + `ItemList` der Objekte + `BreadcrumbList` +
`FAQPage` (dieselben Items wie im Akkordeon, damit sie nicht auseinanderlaufen).

### C3 · Kärnten ist ein Sonderfall

`/vacation-rentals/carinthia` ist faktisch die Anlagenseite der Lima Alpine
Lodges — fünf Einheiten einer Anlage, nicht fünf Orte.

**Checkpoint C:** fünf Ortsseiten erreichbar, jede mit eigenem Titel, eigener
Description, Breadcrumb und funktionierendem Objektraster.

---

## Paket D — Verlinkung und Auffindbarkeit

### D1 · Breadcrumb auf der Objektseite

`Home › Vacation Rentals › <Ort> › <Objekt>` — der Ort verlinkt auf die neue
Ortsseite. Die Suchparameter, mit denen der Gast angekommen ist, weiter
durchreichen.

### D2 · „Similar homes"

Drei Objekte unterhalb der Objektseite: zuerst gleiche `city_group`, dann
gleiche Gästezahl. Dieselbe `PropertyCard`.

### D3 · Eigentümer-Brücke

**Eine** Zeile ganz unten auf der Objektseite nach
`/property-management`. Keine Eigentümer-Sprache im Gästeteil der Seite —
das ist der historische Hauptfehler dieses Projekts.

### D4 · Rail und Filter verlinken

`DestinationsRail.tsx` und die Ortsvorschläge in `Properties.tsx` zeigen
künftig auf `/vacation-rentals/<ort>` statt auf eine gefilterte Suche.

⚠️ `src/lib/destinations.ts` enthält **Estepona** und **Benalmádena**, wo kein
Objekt liegt. Diese beiden bekommen **keine** Ortsseite. Entweder aus der
Vorschlagsliste nehmen oder einen eigenen Hinweistext mit Anfrage-CTA geben —
der generische Leerzustand liest sich wie ein Fehler der Suche.

### D5 · Sitemap und Weiterleitungen

- `scripts/generate-sitemap.mjs`: die fünf Ortsseiten und
  `/vacation-rentals` aufnehmen; Property-URLs aus `seo_slug` bauen
- alte Property-Slugs per **301** auf die neuen — in `public/_redirects`
  (Netlify liefert aus, `vercel.json` ist tote Konfiguration)
- der Router akzeptiert übergangsweise beide Slug-Formen

**Checkpoint D:** von jeder Objektseite führt ein Weg zum Ort und zu drei
ähnlichen Objekten; die Sitemap enthält keine gelöschte Route und kein
Redirect-Ziel.

---

## Paket E — Messen

Vier Events genügen, um den Eigentümer-Funnel überhaupt sichtbar zu machen:

`pm_page_view` · `evaluator_submitted` · `evaluator_result_viewed` ·
`owner_enquiry_submitted`

⚠️ Das bestehende `page_view` auf `/` lief lange ins Leere, weil der
Supabase-Query-Builder lazy ist und der Aufruf nie `await`ed wurde. Jedes neue
Event **awaiten**. Tracking läuft erst nach Cookie-Zustimmung.

---

## Was in dieser Phase ausdrücklich nicht passiert

- kein Merge nach `main`, kein Anfassen von `main`
- kein Server-Rendering, kein Pre-Rendering (eigene Phase)
- keine eigenen Sprach-URLs, kein `hreflang`
- **kein Preis in den strukturierten Daten**, solange `price_per_night` ein
  eingefrorener Importwert ist
- keine Journal-Route (kommt zum Schluss)
- keine Seiten für Orte ohne Bestand
- keine automatischen Kombiseiten

---

## Offene Punkte, die während der Umsetzung auffallen werden

| | |
|---|---|
| `6th floor Malaga Soho Apartment` | 63 Nächte Mindestaufenthalt — gehört nicht in die normale Objektliste |
| Los Monteros Retreat · Luxury Escape Los Flamingos · THE ONE Higuerón | zeigten im Test keinen Live-Preis — in Guesty prüfen |
| Kennzahlen „41 Properties · 8 Destinations" | 41 = insgesamt gemanaged, 23 = aktuell buchbar. Getrennt ausweisen (DECISIONS §6) |
| SPA-404 antwortet mit HTTP 200 | Soft-404-Meldungen in der Search Console |
| `main` ist 2 Commits voraus | „Stop sharing the Lovable placeholder as the link preview image" (in A1 hier direkt behoben) und „Lead every landing-page rail with its priciest home". **Beim späteren Merge nach `main` beide gegenprüfen** |
