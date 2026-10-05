# SEO-Struktur — Schritt 3

> Aus der gebauten Wireframe-Struktur eine Suchstruktur machen.
> Kein Code, keine Massenseiten: **welche Seiten es gibt, welche Aufgabe jede
> hat, unter welcher URL, mit welchem Inhalt, welcher Verlinkung, welcher
> Indexierung und welchem Conversion-Ziel.**
>
> Stand: 25.09.2026 · Grundlage: `data/properties/inventar-2026-09-25.md`
> (23 Objekte, live abgefragt), `docs/PROJECT_MAP.md`, `docs/DECISIONS.md`

---

## Die zwei Regeln, aus denen alles Folgende abgeleitet ist

1. **Gäste zuerst** (DECISIONS §5). Jede Seite unten hat eine Nummer: 1 =
   jetzt, 2 = danach, 3 = später. Alles mit „1" bedient den Buchungsfunnel.
2. **Eine Seite entsteht nur mit echtem Bestand oder echtem eigenen Inhalt.**
   Nicht, weil ein Keyword existiert. Das ist die Grenze zwischen
   Location-Seite und Doorway-Page — und sie ist bei Frontier real, weil in
   drei beworbenen Orten kein Objekt liegt.

---

## 1 · Der Seitenbaum

```text
/                                   Start (Gast)                      ①
│
├── /properties                     alle 23 Objekte, filterbar         ①
│   └── /property/:slug             Objektseite · 23×                  ①
│
├── /vacation-rentals/              Übersicht aller Orte               ①
│   ├── malaga                      9 Objekte                          ①
│   ├── marbella                    4 Objekte                          ①
│   ├── fuengirola                  3 Objekte                          ①
│   ├── vienna                      2 Objekte                          ①
│   └── carinthia                   5 Objekte (Lima Alpine Lodges)     ①
│
├── /property-management            Eigentümer-Einstieg                ②
│   ├── malaga                                                         ②
│   ├── marbella                                                       ②
│   └── fuengirola                                                     ②
│
├── /guaranteed-income                                                 ②
├── /renovations                    ← Kroatien lebt hier als Case      ②
├── /investments                                                       ②
├── /evaluate                       Cashflow-Rechner                   ②
│
├── /about · /projects              Vertrauen                          ②
├── /aviso-legal                    rechtlich, noindex-nah             —
│
└── /journal                        redaktionell                       ③
    └── /journal/:slug                                                 ③
```

**Warum `/vacation-rentals/<ort>` und nicht `/destinations/<ort>`:** Die
Suchabsicht dieser Seiten ist transaktional („vacation rental marbella",
„ferienwohnung málaga", „villa rental costa del sol"). Das Keyword gehört in
die URL. „Destinations" bleibt als **Navigationslabel** erhalten — das Label
im Menü und die URL müssen nicht identisch sein. `/destinations/` bleibt
damit frei für spätere redaktionelle Ortsguides, die dann auf die
buchbaren Seiten verlinken statt mit ihnen zu konkurrieren.

⚠️ **Eine Ortsebene, nicht zwei.** Es gibt pro Stadt genau **eine** buchbare
Seite. Kein zweites Set aus „Villas in Marbella" / „Apartments in Marbella" —
bei 4 Objekten wäre das eine Aufteilung von Nichts in Nochweniger, und beide
Seiten würden um dieselbe Suche konkurrieren.

---

## 2 · Jede Seite, ihre Aufgabe, ihr Ziel

| Seite | Zielgruppe | **Eine** Aufgabe | Conversion-Ziel | Prio |
|---|---|---|---|---|
| `/` | Gast | in 5 Sekunden zeigen, was buchbar ist, und in die Suche führen | Suche gestartet / Objekt geöffnet | ① |
| `/vacation-rentals/<ort>` | Gast | die Frage „habt ihr etwas in X" mit echten Objekten **und** Ortswissen beantworten | Objekt geöffnet | ① |
| `/properties` | Gast | den gesamten Bestand filterbar zeigen | Objekt geöffnet | ① |
| `/property/:slug` | Gast | ein Haus so zeigen, dass die Buchung ohne Rückfrage möglich ist | Quote angefragt → Buchung | ① |
| `/property-management` | Eigentümer | die Zahlenfrage beantworten und Vertrauen aufbauen | Anfrage abgeschickt | ② |
| `/property-management/<ort>` | Eigentümer | lokale Substanz: Regulatorik, Saison, echte Zahlen des Ortes | Anfrage abgeschickt | ② |
| `/guaranteed-income` | Eigentümer | ein Modell erklären, das Auslastungsrisiko nimmt | Anfrage | ② |
| `/renovations` | Eigentümer/Käufer | Renovierungskompetenz belegen — **hier lebt Istrien** | Anfrage | ② |
| `/investments` | Käufer | Kaufgelegenheiten und Betrieb | Gespräch | ② |
| `/evaluate` | Eigentümer | eine Zahl liefern | Lead mit Adresse | ② |
| `/about` · `/projects` | beide | Belege statt Behauptungen | Weiterklick | ② |
| `/journal/:slug` | Gast (später Eigentümer) | eine Frage vor der Buchung beantworten | Klick auf Ort oder Objekt | ③ |

---

## 3 · Die fünf Ortsseiten im Detail

Zuordnung nach DECISIONS §10. **Torremolinos → Málaga** und **Calahonda →
Fuengirola** sind übernommen wie vorgeschlagen; wenn du eine davon anders
willst, ist es eine Zeile Änderung, kein Umbau.

### `/vacation-rentals/malaga` — 9 Objekte · die stärkste Seite

| | |
|---|---|
| **H1** | Vacation Rentals in Málaga |
| **Title** | `Vacation Rentals in Málaga & Torremolinos \| Frontier Residences` |
| **Description** | Nine apartments in Málaga's Soho and Centro Histórico and on the beach in Torremolinos. Book directly with the team that manages them — live availability and rates. |
| **Bestand** | 6× Soho/Centro Histórico (Apartments + 1 Loft), 3× Torremolinos (2 Apartments, 1 Studio, Strand erste Reihe) |
| **Eigener Inhalt** | Soho als Kunstviertel · Centro Histórico zu Fuß · Torremolinos als Strandalternative 15 Min. entfernt · Anreise ab Flughafen AGP · beste Reisezeit |
| **Besonderheit** | „6th floor Malaga Soho" hat 63 Nächte Mindestaufenthalt — gehört **nicht** in die normale Objektliste dieser Seite, sondern separat als Langzeitmiete ausgewiesen oder ausgeblendet |

### `/vacation-rentals/marbella` — 4 Objekte

| | |
|---|---|
| **H1** | Vacation Rentals in Marbella |
| **Title** | `Luxury Vacation Rentals in Marbella \| Frontier Residences` |
| **Description** | Four homes in and around Marbella — Los Monteros, Los Flamingos and Benahavís. Managed by us, booked directly with us. |
| **Bestand** | Los Monteros Retreat (Río Real) · The Hideaway Los Flamingos · Luxury Escape Los Flamingos Golf Retreat · Casa Heredia (Benahavís) |
| **Eigener Inhalt** | Los Monteros / Golden Mile / Los Flamingos als drei sehr verschiedene Lagen · Golf · Benahavís als ruhige Alternative im Hinterland |
| **Voraussetzung** | Die Zuordnung dieser vier Objekte muss vorher existieren — heute stehen drei davon unter `Málaga` bzw. `Río Real` (DECISIONS §11) |

### `/vacation-rentals/fuengirola` — 3 Objekte

| | |
|---|---|
| **H1** | Villas & Apartments in Fuengirola |
| **Title** | `Villa & Apartment Rentals in Fuengirola, Higuerón \| Frontier Residences` |
| **Description** | Two sea-view villas in Reserva del Higuerón and a golf apartment in Calahonda. Book directly with Frontier Residences. |
| **Bestand** | THE ONE – Sea View Luxury Villa · Luxury Villa with Infinity Pool, Higuerón · Oaks&Thistle Calahonda Golf |
| **Eigener Inhalt** | Higuerón als Resortlage · Calahonda/Mijas Costa · die beiden einzigen echten Villen im Bestand — hier gehören die besten Bilder hin |

### `/vacation-rentals/vienna` — 2 Objekte

| | |
|---|---|
| **H1** | Apartments in Vienna |
| **Title** | `Serviced Apartments in Vienna \| Frontier Residences` |
| **Bestand** | 2BR Prater/City Center · Vienna City Duplex Ottakring |
| **Eigener Inhalt** | Bezirke, Anreise, Städtereise statt Strandurlaub — **anderer Reiseanlass als Spanien**, das muss der Text tragen |

### `/vacation-rentals/carinthia` — 5 Objekte · Sonderfall

| | |
|---|---|
| **H1** | Lima Alpine Lodges, Carinthia |
| **Title** | `Alpine Lodges in Carinthia — Lima Alpine Lodges \| Frontier Residences` |
| **Bestand** | 5 Einheiten **einer** Anlage (4 Cabins + 1 Haus, 6–8 Gäste) |
| **Besonderheit** | Diese Seite ist faktisch die **Anlagenseite**. Fünf Einzelseiten, die sich um dieselbe Suche streiten, wäre der Fehler; die Ortsseite trägt die Anlage, die fünf Objektseiten die einzelnen Einheiten. |

### Baukasten jeder Ortsseite (in dieser Reihenfolge)

1. **H1 + ein Absatz**, der den Ort für einen Gast einordnet — kein
   Keyword-Absatz, ein echter Satz
2. **Objektraster** (aus der DB, `PropertyCard` wiederverwendet)
3. **Lagen/Viertel** — 2–4 kurze Absätze, das eigentliche Unique-Content-Stück
4. **Anreise** (Flughafen, Fahrzeit) und **Saison**
5. **3–5 FAQ** → speist direkt das `FAQPage`-Schema
6. **Eine** dezente Eigentümer-Brücke am Ende → `/property-management/<ort>`

Ohne Punkt 3–5 ist es keine Location-Seite, sondern eine gefilterte Liste mit
eigener URL. Das ist der Unterschied, auf den es ankommt.

---

## 4 · Titles und Descriptions — die Muster

| Seitentyp | Title-Muster | Description-Muster |
|---|---|---|
| Start | `Luxury Vacation Rentals in Spain and Austria \| Frontier Residences` | Bestand + Direktbuchung + „managed by us" |
| Ort | `<Angebot> in <Ort> \| Frontier Residences` | Anzahl + konkrete Lagen + „book directly" |
| Objekt | `<Name> — <Ort> \| Frontier Residences` | Schlafzimmer + Typ + Ort + Gäste + „book directly" *(bereits implementiert)* |
| Service | `<Leistung> in <Region> \| Frontier Residences` | was die Leistung konkret umfasst |
| Journal | `<Frage oder Thema> \| Frontier Residences` | die Antwort in einem Satz |

**Regeln:** Title ≤ 60 Zeichen inklusive Markenteil, Description 140–160,
jede Description enthält eine **konkrete Zahl oder einen Ortsnamen** — keine
austauschbaren Adjektivketten.

---

## 5 · Was aus Guesty kommt und was redaktionell ist

Die Trennung ist keine Stilfrage: **`import-guesty-properties` überschreibt
bei jedem Lauf `name`, `slug`, `location`, `description`, `images`,
`price_per_night`.** Alles, was Frontier selbst schreibt, muss in Felder, die
der Import nicht anfasst.

| Inhalt | Quelle | Wer gewinnt |
|---|---|---|
| Verfügbarkeit, Preise, Kalender | Guesty live | Guesty |
| Bilder, Schlafzimmer, Bäder, Gäste, Amenities, Geo | Guesty (Import) | Guesty |
| **Ortsgruppe** (Málaga/Marbella/Fuengirola/Wien/Kärnten) | Frontier | **Frontier** — neue Spalte `city_group` |
| **SEO-Slug** | Frontier | **Frontier** — neue Spalte `seo_slug` |
| **Objekttext für die Seite** | Frontier | **Frontier** — neue Spalte `editorial_description`, Guesty-Text als Fallback |
| Ortsseiten-Text, FAQ, Anreise, Saison | Frontier | Frontier |
| Titles, Descriptions, Schema | Frontier | Frontier |

Guesty wird nur dort korrigiert, wo Guesty **sachlich falsch** liegt.
Benahavís ist Benahavís — die Zusammenfassung unter Marbella passiert in der
Frontier-Ebene.

---

## 6 · URLs und der Slug-Umbau

Heute: `/property/casa-heredia-rural-andalusian-retreat-830366` — Titel plus
sechs Zeichen Guesty-ID, **kein Ort**, und der Import baut ihn bei jedem Lauf
neu.

**Vorschlag:** `/property/<ort>-<kurzname>`, z. B.
`/property/benahavis-casa-heredia`, `/property/malaga-soho-art-experience`,
`/property/fuengirola-the-one-higueron`.

**Warum jetzt und nicht später:** es sind 23 URLs, sie tragen praktisch keine
externen Links, und die ausgelieferte Sitemap ist ohnehin veraltet. In sechs
Monaten mit Rankings darauf ist derselbe Schritt teuer.

**Wie ohne Risiko:** `seo_slug` als eigene Spalte, der Router akzeptiert beide
Formen, alte Slugs bekommen einen **301** auf den neuen. Die Sitemap führt nur
noch den neuen. Der Import darf `seo_slug` nicht anfassen.

---

## 7 · Was indexiert wird — und was nicht

| | Regel |
|---|---|
| ✅ indexieren | `/`, `/properties`, alle `/property/:slug`, alle fünf Ortsseiten, `/vacation-rentals/`, alle Service- und Vertrauensseiten, später `/journal/*` |
| 🚫 **nicht** indexieren | `/admin/*`, `/auth`, `/update-password`, `/booking-confirmation` *(bereits)* |
| 🚫 **nicht** indexieren | `/p/:slug` — rendert beliebiges gespeichertes HTML ohne eigenen Titel und ohne Canonical. Bis geklärt ist, wofür es gedacht ist: `noindex` |
| 🔁 Canonical | jede `?checkIn=…&checkOut=…&guests=…`-Variante → auf den reinen Slug *(bereits)* |
| 🔁 Canonical | jede Filter- und Sortiervariante von `/properties` → auf `/properties` |
| ⛔ gar nicht erst erzeugen | keine automatischen Kombiseiten („3-bedroom villas in Marbella"), keine Seiten für Orte ohne Bestand, keine Seite pro Amenity |
| ⚠️ zu klären | Objekte ohne Buchbarkeit (63-Nächte-Mindestaufenthalt, drei ohne Live-Preis) — eine indexierte Seite, die nie buchbar ist, ist ein Sackgassen-Ergebnis |
| ⚠️ Statuscode | die SPA antwortet auf 404 mit **HTTP 200**. `NotFound` ist zwar `noindex`, die Search Console meldet trotzdem Soft-404s |

**Sprachen:** DE/ES schalten heute ohne eigene URL um und sind für
Suchmaschinen unsichtbar. Das ist **kein Fehler, den man nebenbei behebt** —
eigene URLs plus `hreflang` sind eine eigene Phase, und die DE/ES-Texte sind
ausdrücklich ungeprüfte KI-Entwürfe. Bis dahin bleibt Englisch die indexierte
Fassung.

---

## 8 · Interne Verlinkung

Heute ist jede Objektseite eine Sackgasse — der einzige Weg zurück ist
`/properties`. Das kostet Crawling **und** Buchungen.

| von | nach | wie |
|---|---|---|
| `/` | die fünf Ortsseiten | der bestehende Destinations-Rail zeigt künftig auf die Ortsseiten statt auf eine gefilterte Suche |
| `/properties` | Ortsseiten | Filterchips „Málaga · Marbella · Fuengirola · Vienna · Carinthia" verlinken echt |
| `/property/:slug` | **Ortsseite** | im Breadcrumb: Home › Vacation Rentals › **Marbella** › Objekt |
| `/property/:slug` | 3 ähnliche Objekte | „Similar homes" — zuerst gleicher Ort, dann gleiche Gästezahl |
| `/property/:slug` | `/property-management/<ort>` | **eine** Zeile ganz unten, keine Eigentümer-Sprache im Gästeteil |
| Ortsseite | ihre Objekte · Nachbarort · Service im Ort | |
| `/property-management` | die drei Eigentümer-Ortsseiten | |
| `/renovations` | Istrien-Case · `/projects` | |
| Journal (später) | Ort · Objekt · Service | jeder Artikel verlinkt mindestens einen Ort |

**Breadcrumb ist Pflicht auf jeder Seite außer `/`** — er trägt gleichzeitig
das `BreadcrumbList`-Schema.

---

## 9 · Structured Data pro Seitentyp

| Seite | Schema |
|---|---|
| `/` | `RealEstateAgent` (feste `@id`) + `FAQPage` *(bereits)* |
| Ortsseite | `CollectionPage` + `ItemList` der Objekte + `BreadcrumbList` + `FAQPage` |
| `/property/:slug` | `Accommodation` + `BreadcrumbList` *(bereits)* — **Preis erst, wenn der Sync live ist** (DECISIONS §8) |
| Service | `Service` + `BreadcrumbList` + `FAQPage` |
| `/about` | `AboutPage` + Bezug auf die Organisations-`@id` |
| Journal | `Article` + `BreadcrumbList` |

Zielbild für später: Googles `VacationRental`-Programm. Die Datenvoraussetzungen
erfüllt der Bestand bereits (≥ 8 Bilder überall, Geo überall, Beschreibung
überall) — das Programm selbst ist zugangsbeschränkt und **kein Ziel dieser
Phase**.

---

## 10 · Übergabe an Code — was gebaut werden muss

In der Reihenfolge, in der es gebaut wird:

| # | Aufgabe | Betrifft |
|---|---|---|
| 1 | `main` in den Branch mergen | Git |
| 2 | `index.html`: Description auf `siteMeta.ts` ziehen, Kroatien raus, `og:image` prüfen | `index.html` |
| 3 | **H1 der Startseite**: `hero-headline` → „Luxury Vacation Rentals in Spain and Austria" (EN + DE + ES, sonst schlägt `tsc` fehl) | `src/lib/translations.ts` |
| 4 | `PageWrapper` entsperren — kein Render-Block hinter einer Supabase-Abfrage | `src/components/PageWrapper.tsx` |
| 5 | Migration: `city_group`, `seo_slug`, `editorial_description` — **schreiben ja, anwenden nur nach Absprache** | `supabase/migrations/` |
| 6 | Import so ändern, dass er die drei neuen Felder **nicht** überschreibt | `import-guesty-properties` |
| 7 | Die 23 Objekte den fünf Gruppen zuordnen, `seo_slug` vergeben | Daten |
| 8 | Route `/vacation-rentals/:city` + Übersichtsseite, mit `<Seo>` und Schema | neu |
| 9 | Breadcrumb auf Objektseiten auf die Ortsseite zeigen lassen | `PropertyDetail.tsx` |
| 10 | „Similar homes" + Eigentümer-Zeile auf der Objektseite | `PropertyDetail.tsx` |
| 11 | Destinations-Rail und Filterchips auf die Ortsseiten verlinken | `DestinationsRail.tsx`, `Properties.tsx` |
| 12 | Sitemap um die Ortsseiten erweitern, alte Slugs 301 | `scripts/generate-sitemap.mjs`, `_redirects` |
| 13 | `/p/:slug` auf `noindex` | `DynamicPage.tsx` |
| 14 | Bildattribute `width`/`height`, `loading="lazy"`, echte Alt-Texte | 12 `<img>` |
| 15 | Vier Analytics-Events | mehrere |

Punkte 1–4 und 14 hängen von nichts ab und können sofort laufen.

---

## 11 · Was diese Struktur bewusst **nicht** tut

- keine Seite für einen Ort ohne Bestand (Estepona, Benalmádena bleiben ohne
  eigene Seite, solange dort nichts liegt)
- keine Aufspaltung eines Ortes in Objekttypen
- keine Stadtteil-Ebene unterhalb von Marbella oder Málaga
- keine eigenen Sprach-URLs in dieser Phase
- kein Preis in strukturierten Daten, bevor der Sync live ist
- kein Journal-Inhalt, bevor die Route existiert
