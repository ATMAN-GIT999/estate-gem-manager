# 02 · Mapping — Wireframe gegen Code

> **Rolle dieser Datei:** hier stehen **Entscheidungen**, nicht Feststellungen.
> Der Ist-Zustand steht in [01-bestandsaufnahme.md](01-bestandsaufnahme.md).
>
> Urteil ist genau eines von **behalten · umbauen · neu · raus**.
> Datenquelle ist genau eines von **statisch · Guesty · translations.ts · Bild**.
>
> Stand: 12.09.2026 · Branch `redesign/wireframe-2026-09`

---

## Wie die Tabellen zu lesen sind

„behalten" heißt: die Komponente bleibt inhaltlich und strukturell, sie erbt
nur die neuen Tokens und die neue Schrift aus P1. „umbauen" heißt: dieselbe
Komponente, andere Anordnung oder anderer Text. „neu" heißt: es gibt heute
nichts, was diese Stelle füllt. „raus" heißt: die Section verschwindet von
dieser Seite.

Risiko ist **niedrig** (nur Darstellung), **mittel** (Copy, Struktur, Bilder)
oder **hoch** (Guesty, Preise, Buchung, Leads).

---

## 1 · `/` — Landing (Artboards `Main`, `LandingMobile`)

| # Wireframe | bestehende Komponente | Urteil | Datenquelle | Risiko | offene Frage |
|---|---|---|---|---|---|
| 01 · S1 Hero | `Hero.tsx` | **umbauen** | Bild | mittel | **K1** — Foto statt Video? |
| 02 · S2 Search | `SearchBar.tsx` (heute *im* Hero) | **umbauen** | statisch | niedrig | — |
| 03 · S4 Trio | `PropertyCollections.tsx` | **umbauen** | Guesty | mittel | **K2** — drei Rails werden eine Reihe mit Tabs |
| 04 · S8 Split | `GuestManagement.tsx` | **umbauen** | translations.ts | mittel | **K3** — geprüfte Gäste-Copy wird ersetzt |
| 05 · S5 Carousel | — | **neu** | Bild | mittel | **B1** — vier Ortsfotos fehlen |
| 06 · S11 FAQ | `FAQ.tsx` | **behalten** | translations.ts | niedrig | 5 statt 7 Fragen, neue Wortlaute |
| 07 · S10 Owner Bridge | `OwnAProperty.tsx` | **umbauen** | Bild | niedrig | — |
| 08 · Footer | `Footer.tsx` | **umbauen** | translations.ts | niedrig | **K7** — Footer-Spalten |
| — | `PropertyEvaluator.tsx` | **raus** (zieht auf die PM-Seite) | — | hoch | **K4** |

### Was das im Einzelnen heißt

**01 Hero.** Heute ein Vollbild-Video (`hero-background.mp4`) mit der
`SearchBar` darin und `Navigation overlay` darüber. Das Wireframe zeigt ein
Standfoto, die Suche als eigenes beiges Band darunter, Eyebrow
„Costa del Sol · Vienna · Carinthia", Headline „Homes you will only find with
us" und **einen** sekundären Button („See our homes"). Der Video-Pfad bleibt
in `Hero.tsx` erhalten (`videoType`), das Wireframe nutzt ihn nur nicht.

**02 Search.** Die `SearchBar` verlässt den Hero und bekommt ein eigenes,
beiges Band — die einzige beige Fläche auf der ganzen Landing Page. Die
Logik (`onSearch` → URL-Parameter → `/properties`) bleibt unangetastet.

**03 Trio.** Heute drei horizontale Rails („Costa del Sol" · „City" ·
„Off-grid") mit je einer Kartenreihe, abgeleitet aus `location`/`name`.
Das Wireframe zeigt **eine** Reihe von drei Karten mit einer Tab-Leiste
darüber (Costa del Sol · Vienna · Carinthia · Neu) und „See all 23 homes →".
Die Karten tragen zusätzlich Ausstattungs-Chips („Heated pool", „Sea view").
Datenquelle bleibt dieselbe Supabase-Abfrage.

**04 Split.** Bild links, rechts fünf Punkte auf Haarlinien: „Self check-in,
any hour", „Verified Wi-Fi", „Someone on the ground", „Professional final
clean", „Booked direct". Heute steht dort das grüne Band „It's in the
details." mit sechs Icon-Punkten. Siehe **K3** — das ist geprüfte Copy.

**05 Carousel.** Vollbild-Reihe „Where we are at home": Marbella · Málaga ·
Vienna · Carinthia (das vierte angeschnitten). Es gibt heute nichts
Vergleichbares auf `/`; „Our Destinations" wurde mit R1 von der PM-Seite
entfernt und lebt auf `/projects`.

**07 Owner Bridge.** `OwnAProperty` bleibt inhaltlich, wird aber ein
Vollbild-Foto, das an seiner Unterkante bis auf `ink` abdunkelt und ohne Naht
in den Footer läuft. Das Muster existiert im Repo schon (`MediaFrame fill` +
`--overlay-media`), der Verlauf bis Volltonschwarz nicht.

---

## 2 · `/property-management` (Artboards `PropertyManagement`, `…Mobile`)

| # Wireframe | bestehende Komponente | Urteil | Datenquelle | Risiko | offene Frage |
|---|---|---|---|---|---|
| 01 · Hero + Evaluator | `OwnerHero.tsx` + `PropertyEvaluator.tsx` | **umbauen** | statisch + Bild | **hoch** | **K4** — Ergebnis im Hero statt `/evaluate` |
| 02 · S3 Trust | `Proof.tsx` → `StatsRow` / `PORTFOLIO_STATS` | **umbauen** | statisch | mittel | **K5** — vier neue Zahlen |
| 03 · S6 The Claim | — | **neu** | Bild | mittel | **B2** + **F1** (deutscher Satz im Wireframe) |
| 04 · S9 How it works | `TheSystem.tsx` | **umbauen** | translations.ts | mittel | **K6** — sechs Punkte werden drei |
| 05 · Two ways | `WaysToWorkTogether.tsx` (erste Hälfte) | **behalten** | translations.ts | niedrig | Reihenfolge GI-zuerst steht schon (§54) |
| 06 · S3 Logo Band | `WorkingWith.tsx` | **umbauen** | Bild | mittel | **K8** — Kanäle statt Partner |
| 07 · Renovations & Investments | `WaysToWorkTogether.tsx` („Beyond management") | **umbauen** | translations.ts + Bild | mittel | **K9** — der bekannte Investments-Abbinder |
| — · Istria Case Study | — | **neu** | Bild | mittel | **B3** |
| 08 · S8 Team | `AboutMini.tsx` | **umbauen** | Bild | niedrig | **B4** — drittes Porträt |
| 09 · S11 FAQ | `FAQ.tsx` | **umbauen** | translations.ts | mittel | **K10** — Eigentümer-FAQ (D11) |
| 10 · Contact | `OwnerContactForm.tsx` | **umbauen** | Bild | **hoch** | `LEAD_SOURCE` bleibt unverändert |
| 11 · Footer | `Footer.tsx` | **umbauen** | translations.ts | niedrig | **K7** |
| — | `Proof.tsx` — drei Case Studies | **raus** | — | mittel | **K11** |
| — | `TheSystem.tsx` — `platform-connections.webp` | **raus** | — | niedrig | ersetzt durch 06 |

### Was das im Einzelnen heißt

**01 Hero + Evaluator.** Das Wireframe macht den Evaluator zum Helden der
Seite: grünes Band, Foto rechts, links ein einziges Adressfeld und daneben
die Karte „Estimated income" mit Platzhalterbalken. Das Artboard
`EvaluatorStates` beschreibt drei Zustände — leer, Adresse erkannt
(Schlafzimmer-Auswahl erscheint), Ergebnis (`[AMOUNT]` + Diagramm + Button
„Calculate the fixed rent →"). Ausdrücklich: **„Only ever one field is visible
in the hero."** Heute sind es sechs Felder in einer Card, und `handleSubmit`
navigiert nach `/evaluate`. Das ist kein Re-Skin — siehe **K4**.

**02 Trust.** Vier Zahlen auf Beige: `42 homes managed since 2019` ·
`23 in the portfolio today` · `1,500+ stays since 2019` ·
`3 languages in the team`. Das löst PROJECT.md **D4** zur Hälfte auf
(„8 Destinations" und „50+ Collaborators" fallen weg, „23 in the portfolio"
passt endlich zur Sitemap) — aber mit `42` statt der heutigen `41`.

**04 How it works.** Heute `TheSystem`: sechs `Panel`s auf einem Goldfaden,
laut PROJECT.md das Schwergewicht der Seite („sehr hoch"), gebaut aus drei
zusammengelegten Sections (§11) und mit sechs von Almedin freigegebenen
Texten (§14). Das Wireframe zeigt **drei** Schritte in einer schlichten
Dreierzeile. Siehe **K6**.

**06 Logo Band.** Das Wireframe beschriftet es „Where your home goes live" und
listet in seiner eigenen Notiz: Airbnb · Booking.com · Vrbo · Guesty ·
PriceLabs · Chekin — also **Vertriebskanäle**. Im Repo liegen vier Logos, von
denen zwei (`partner-sur-film`, `partner-vasari`) Gewerke sind, keine Kanäle.
Siehe **K8** und **B5**.

**10 Contact.** Vollbild-Nachtfoto, das bis `ink` abdunkelt und nahtlos in den
Footer läuft. Formularfelder und Absendepfad bleiben **exakt** wie sie sind:
`supabase.from("contacts").insert({ source: "consultation-booking", … })`,
`metadata.submitted_from = "property-management"`. Wird `source` angefasst,
weist RLS still ab und der Lead ist weg.

---

## 3 · `/properties` (Artboards `Properties`, `PropertiesMobile`)

| # Wireframe | bestehende Komponente | Urteil | Datenquelle | Risiko | offene Frage |
|---|---|---|---|---|---|
| 01 · Header solid | `Navigation` (default) | **behalten** | statisch | niedrig | steht schon so |
| 02 · Search | `SearchBar collapsible` | **umbauen** | statisch | niedrig | von sticky-Leiste zu Hero-Position |
| 03 · Filter Bar | Sortier-`Select` | **neu** | Guesty/DB | mittel | **F2** — woher kommen Budget und Collection? |
| 04 · Grid | `Grid cols={3}` + `PropertyCard` | **umbauen** | Guesty | mittel | **F3** — H1 verschwindet · **F4** — „View more homes" |
| 05 · Footer | `Footer.tsx` | **umbauen** | translations.ts | niedrig | **K7** |

`PropertyCard` ändert sich in drei Punkten: Bildformat **4:3 → 3:4**, Rahmen
weg (heute `rounded-xl bg-card shadow-sm hover:shadow-md`, neu rahmenlos auf
weißem Grund), Objektname in der neuen Rolle **Card title** (19/17px, 400,
uppercase, +7 % Tracking) statt `.t-item`. Dieselbe Karte läuft auf `/`
(Trio) und in „Similar Homes" auf der Detailseite.

Die Filterleiste ist die eigentliche Neuarbeit: „All filters · Bedrooms ·
Budget · Collection · Sort · ▦/☰". Von den fünf existiert heute **nur** Sort.

---

## 4 · `/property/:slug` (Artboards `PropertyDetail`, `…Mobile`)

> **Diese Seite ist ein Re-Skin über funktionierende Logik.** Guesty-Anbindung,
> Live-Pricing-Kalender und Buchungsflow bleiben; getauscht wird die
> Präsentation.

| # Wireframe | bestehende Komponente | Urteil | Datenquelle | Risiko | offene Frage |
|---|---|---|---|---|---|
| 01 · Header solid | `Navigation` (default) | **behalten** | statisch | niedrig | — |
| 02 · Breadcrumb | „Back to Properties"-Button | **umbauen** | Guesty | niedrig | — |
| 03 · Gallery | Galerie-Grid + zwei Dialoge | **umbauen** | Guesty | niedrig | Share-Pille ist neu |
| 04a · Head | Titelblock + Amenities | **umbauen** | Guesty | mittel | **F5** — `m²` · **F6** — Collection-Tag · **F7** — welche acht Key Features |
| 04b · Booking Panel | `<Card sticky>` + `AvailabilityCalendar` | **umbauen** | **Guesty** | **hoch** | Panel-B-Optik (Goldlinie oben, Sage-Ton) |
| 05 · Surroundings | — | **neu** | Guesty + ? | mittel | **F8** — „Nearby"-Daten existieren nicht |
| 06 · Similar Homes | — | **neu** | Guesty | mittel | **F9** — nach welchem Kriterium ähnlich? |
| 07 · Footer | `Footer.tsx` | **umbauen** | translations.ts | niedrig | **K7** |

Das Buchungspanel muss drei Zustände aus `BookingSummary.tsx` weiter zeigen
können, sonst geht Geld verloren: `quoteError`/`!quote` (kein erfundener
Preis, Absenden blockiert), `paymentUnavailable` (Kartenfeld weg, Ausweichpfad
„Send booking request instead"), `datesValid` (Button deaktiviert, bis der
Kalender gültige Daten meldet).

Die Karte zeigt im Wireframe `Total · 7 nights €8,260` mit dem Zusatz „Taxes
and cleaning fee calculated at checkout". Das ist mit dem heutigen Fluss
vereinbar: die echte Summe kommt aus `guesty-get-quote` im Dialog.

---

## 5 · Global

| Gegenstand | Urteil | Risiko |
|---|---|---|
| `--background` beige → weiß, `ink` neu, `--muted-foreground` kühler, `--accent` minimal nachziehen | **umbauen** | mittel (jede Seite) |
| Playfair + Lato → Archivo + IBM Plex Mono, selbst gehostet | **umbauen** | mittel (jede Seite) |
| Typo-Skala sechs → sieben Rollen (`Card title` neu) | **umbauen** | mittel |
| `Section tone` braucht eine echte Beige-Stufe | **umbauen** | niedrig |
| `MediaFrame` + `.bg-placeholder-hatch` | **behalten** | — (deckt sich schon mit dem Wireframe) |
| `Navigation` — drei neue Zustände, weiß statt grün gefüllt | **umbauen** | mittel |
| `Footer` — `ink` statt Sage, neue Spalten | **umbauen** | niedrig |

---

## a) KONFLIKTE

Stellen, an denen Wireframe und Live-Code sich widersprechen und **beide
Varianten vertretbar sind.** Ich entscheide hier nichts.

### K1 · Hero-Video oder Hero-Foto

**Für das Wireframe:** Es zeigt ein Standfoto. Ein Foto lädt sofort, ist auf
Mobil billiger und hält das Performance-Budget aus `website-stack` leichter
ein.

**Für den Code:** Das Hero-Video ist dreimal bewusst produziert und getauscht
worden — C6/§22 (4K-Aufnahme Puente Romano, auf 5,8 MB re-encodiert), §32 und
§41 je ein neues. Almedin hat dafür echtes Material geliefert; das wortlos
gegen ein Standbild zu tauschen wäre der teuerste stille Rückbau im Rebuild.

*Möglich wäre auch: Video bleibt auf `/`, das Wireframe-Foto wird der
Poster-Frame.*

### K2 · Drei Rails oder eine Reihe mit Tabs

**Für das Wireframe:** Eine Reihe mit Tab-Leiste zeigt drei Objekte in voller
Größe statt neun angeschnittener. Ruhiger, katalogähnlicher.

**Für den Code:** Die drei Rails („Costa del Sol" · „City" · „Off-grid") sind
in §24–§26 gegen OmniVillas-Screenshots feingeschliffen worden, inklusive der
Mobil-Pfeile aus §40. Und: PROJECT.md **D8** hängt daran — die Zuordnung wird
aus `location`/`name` abgeleitet, ein Objekt in einem neuen Ort erscheint in
**keiner** Reihe. Mit Tabs (Costa del Sol · Vienna · Carinthia · Neu) wird
dieses Problem sichtbarer, nicht kleiner.

### K3 · „It's in the details." gegen „What every stay includes"

**Für das Wireframe:** Die fünf neuen Punkte sind konkreter und prüfbar
(„A code instead of a key handover. Arriving at 11pm is not a problem.") und
folgen dem Blockmuster besser als die heutigen sechs Icon-Kacheln.

**Für den Code:** `CLAUDE.md` führt „Die Gäste-Fassung von *It's in the
details.* (`GuestManagement.tsx`)" ausdrücklich unter **„Nicht anfassen ohne
Rückfrage — der Text dort ist geprüft"**. Das ist genau diese Section.
Außerdem verliert sie ihr grünes Band; auf der Landing Page wäre dann
zwischen Hero und Owner-Bridge keine Markenfläche mehr.

**Hier braucht es ein ausdrückliches Ja von dir, kein Mapping-Urteil.**

### K4 · Wohin gehört der Property Evaluator

**Für das Wireframe:** Der Evaluator ist der Held der Eigentümerseite, mit
Ergebnis direkt im Hero. Auf der Gästeseite hat er ohnehin nichts verloren —
er ist Eigentümer-Sprache auf `/`, also genau der historische Hauptfehler des
Projekts.

**Für den Code:** Die Rechnung läuft heute auf `/evaluate` über
`analyze-property` (Gemini). Ein Ergebnis *im Hero* heißt: Edge-Function-Call
aus dem Hero heraus, Ladezustand im Hero, Fehlerzustand im Hero — und die
Frage, was aus `/evaluate` und seinem Lead-Formular wird. Das ist **kein
Re-Skin, sondern ein Umbau am Lead-Pfad.**

Drei Wege, ohne Empfehlung:
1. Evaluator zieht um, aber die sechs Felder bleiben, Ergebnis weiter auf
   `/evaluate`. Wenig Risiko, das Artboard `EvaluatorStates` bleibt ungebaut.
2. Progressive Felder im Hero, Ergebnis weiter auf `/evaluate`.
3. Alles wie gezeichnet — Ergebnis inline. Größter Aufwand, berührt
   `analyze-property` und die Lead-Erfassung.

### K5 · 41 oder 42 Objekte

Das Wireframe schreibt „42 homes managed since 2019", der Code „41 Properties
Managed". PROJECT.md **D4** hält beide für unbelegt und merkt an, dass die
Sitemap 23 Objekte kennt und `ProjectsSection` „20+ premium properties" für
Spanien nennt. Das Wireframe entschärft das (es trennt „seit 2019" von „heute
im Portfolio") — aber welche Zahl stimmt, weiß keiner von uns beiden.

### K6 · Sechs Systemschritte oder drei

**Für das Wireframe:** Drei Schritte sind lesbar. Die Seite hat mit dem
Evaluator im Hero bereits ein Schwergewicht; ein zweites direkt darunter
wäre gegen den Rhythmus.

**Für den Code:** `TheSystem` ist laut PROJECT.md §2 der Schwerpunkt der
Seite und entstand aus der Zusammenlegung von drei Sections (§11). Die sechs
Fließtexte sind von dir freigegebene, neu geschriebene Copy (§14, IDs
`sys-body-0…5`). DESIGN.md §9 nennt `TheSystem` außerdem als eingelöstes R3
(„Operating-System-Darstellung"). Von sechs auf drei zu gehen heißt, drei
freigegebene Texte zu streichen.

### K7 · Footer-Spalten

**Für das Wireframe:** „For guests · For owners · Company" trennt die beiden
Zielgruppen auch im Footer — konsequent für eine Seite, deren ganze Architektur
auf dieser Trennung beruht.

**Für den Code:** Die Links, die das Wireframe zurückholt, sind in **§32/§33
bewusst entfernt** worden: Guaranteed Income und Projects ganz raus,
Renovations und Investments zu einer „Beyond Management"-Zeile zusammengelegt.
Das Wireframe listet alle vier wieder einzeln plus Projects. Entweder war §32
falsch oder das Wireframe ist es — beides gleichzeitig geht nicht.

### K8 · „Working with" oder „Where your home goes live"

**Für das Wireframe:** „Where your home goes live" ist ein Argument mit einer
klaren Aussage: Ihr Haus erscheint auf diesen Kanälen. Airbnb, Booking.com,
Vrbo, Guesty, PriceLabs, Chekin gehören zusammen.

**Für den Code:** §35 hält fest, dass du das Mischen von gästeseitigen Marken
und Gewerken unter einem „Working with" **ausdrücklich so wolltest**. Sur Film
(Video) und Vasari (Bau) sind unter „Where your home goes live" nicht
unterzubringen — sie müssten raus oder eine eigene Zeile bekommen.

### K9 · Der Investments-Abbinder

**Für das Wireframe:** Renovations und Investments bekommen eine eigene
Section (07), zwei gleichgewichtige Panels nebeneinander, darunter die
Istria-Case-Study. Investments steht damit gleichrangig neben Renovations.

**Für den Code:** §16 hat genau das aufgelöst — Renovations/Investments ist
seit dem 19.08.2026 **keine eigene Ebene mehr**, sondern die zweite Hälfte von
„Zwei Wege" hinter der goldenen „Beyond management"-Linie. Begründung in
DECISIONS §2: Investments zielt auf einen **Käufer**, nicht auf den
Eigentümer, für den der Rest der Seite geschrieben ist — deshalb zuletzt und
nachgeordnet, nicht gleichgewichtig.

**Doppelt bauen ist in keinem Fall die Antwort.** Entweder die eigene Section
kommt zurück (§16 wird rückgängig gemacht) oder der Abbinder bleibt, wo er
ist.

### K10 · Gäste-FAQ oder Eigentümer-FAQ auf der PM-Seite

**Für das Wireframe:** Fünf echte Eigentümerfragen („Commission or fixed
rent — which suits my house?", „How long does this tie me in?", „Can I still
use the house myself?", „Who is liable for damage?", „When does the money
arrive?").

**Für den Code:** PROJECT.md führt unter „Bewusst so gelassen": die FAQ auf
der PM-Seite ist **wortwörtlich die gästeseitige FAQ**, nur mit neuer
Überschrift, „von Almedin bewusst so angefordert". D11 nennt die
Eigentümer-Variante inhaltlich stärker, aber abhängig von **belastbaren
Antworten vom Kunden** — und die Frage nach der Provision (D5) ist bis heute
unbeantwortet.

### K11 · Die drei Case Studies

**Für das Wireframe:** Die PM-Seite hat nur noch **eine** Case Study (Istria,
unter Renovations). Der Rest des Beweises sind die vier Zahlen im Trust-Band.

**Für den Code:** `Proof` mit Hoyo 19, Soho Boho und Alpine Retreat ist
DESIGN.md **R1** — die entschiedene und umgesetzte Ersetzung von „Our
Destinations". Die drei Objekte tragen belegte Zahlen (Occupancy, Revenue,
Rating) und sind die einzige Stelle der Seite, an der etwas Konkretes
behauptet wird. Ersatzlos zu streichen heißt, den Beweis auf vier hartkodierte
Zahlen zu reduzieren.

*Das Wireframe verlegt die Istria-Renovierung nach Kroatien. PROJECT.md §1
hält fest: **Kroatien ist kein Bestandsmarkt**, es erscheint nur auf
`/investments` als Zielmarkt. Eine Case Study auf der PM-Seite mit
„Istria, Croatia" darüber bricht diese Trennung — oder hebt sie bewusst auf.*

---

## b) BILDSLOTS OHNE MATERIAL

Ehrlich, ohne Notbehelf: **Wo es kein Foto gibt, kommt ein beschrifteter
`MediaFrame` mit Briefing-Text hin, kein zweites Mal dasselbe Motiv**
(DESIGN.md §10).

Vorweg der Befund, der alles andere überlagert:

> **Die 23 Fotos im Wireframe sind Wireframe-Kopien, keine Produktionsbilder.**
> `hero-landing-desktop.jpg` misst 720 × 379 px, `we-take-it-on-desktop.jpg`
> 860 × 338, `renov-opener.jpg` 1200 × 349. Für ein Vollbild-Band auf 1440px
> reicht keines davon. **Frage an dich: gibt es die Originale, und wo?**
> Liegen sie im Drive, ist das der billigste Weg durch die ganze Liste unten.

| # | Slot | Seite | Repo hat | Briefing für den `MediaFrame` |
|---|---|---|---|---|
| **B1** | Carousel · 4 Ortsfotos | `/` 05 | ✗ | Marbella, Málaga, Wien, Kärnten — je ein Ortsbild 3:2, kein Objektfoto |
| **B2** | „We take it on" | `/pm` 03 | ✗ | Luftbild moderner weißer Villen mit Pools, Querformat ≈ 21:9 |
| **B3** | Istria Case Study | `/pm` 07 | ✗ | Luftbild der sanierten Anlage, Querformat |
| **B4** | Porträt 2 (Alejandro) | `/pm` 08 | ≈ | `team-alejandro.webp` existiert, ist aber ein **anderes** Foto als `team-2.jpg` im Wireframe |
| **B5** | Kanal-Logos | `/pm` 06 | 4 von 6 | Airbnb, Booking.com, Vrbo und PriceLabs fehlen; Sur Film und Vasari passen nicht ins Raster (**K8**) |
| **B6** | Hero-Foto | `/` 01 | ✗ | nur relevant, falls **K1** gegen das Video entschieden wird |
| **B7** | „What every stay includes" | `/` 04 | ✗ | überdachter Essplatz/Terrasse, Hochformat-tauglich |
| **B8** | Evaluator-Hero-Foto | `/pm` 01 | ✗ | Infinity-Pool mit Meerblick, Hochformat |
| **B9** | Kontakt-Hintergrund | `/pm` 10 | ✗ | Villa bei Nacht, beleuchteter Pool, muss bis Volltonschwarz abdunkelbar sein |
| **B10** | Property-Karten ohne Foto | `/properties` 04 | teilweise | das Wireframe zeigt es selbst richtig: `[PROPERTY]` + schraffierte Fläche |

Zwei Slots brauchen **kein** neues Material:

- **Owner Bridge** (`/` 07): `owner-bridge-desktop.jpg` ist dasselbe Motiv wie
  `oap-villa-entrance.webp` — das Foto liegt schon im Repo.
- **Los Flamingos Karte**: `losflamingos-card.jpg` ist dasselbe Terrassenfoto
  wie `about-hero.webp` / `property-2.webp`. Achtung: es steht heute auf
  `/about` als Hero. Zweimal dasselbe Motiv auf zwei Seiten ist vertretbar,
  zweimal in einem Scroll nicht.

Und eine Doppelung, die im Wireframe **nicht** existiert, obwohl sie so
aussieht: `renov-opener.jpg` und `we-take-it-on-desktop.jpg` sind zwei
verschiedene Luftaufnahmen (Ziegeldächer gegen weiße Kuben). Nicht
zusammenlegen.

---

## c) WAS NICHT GEBAUT WIRD

Alles im Wireframe, das **Spezifikation** ist und nicht Interface. Explizit
gelistet, damit es später niemand versehentlich umsetzt.

1. **Die Mono-Marker in den Ecken der Artboards** — `01 · S1 HERO`,
   `05 · SURROUNDINGS`, `04 · GRID`, `08 · FOOTER`, `03 · FILTER BAR` und alle
   weiteren. CSS-Klasse `.secnum`, absolut positioniert. Sie nummerieren
   Kapitel des Design Blueprints, sie sind kein UI.

2. **Die Zustandsbeschriftungen** auf `HeaderStates` und `EvaluatorStates` —
   „State 1 · over the hero", „State A · empty", „The card promises, it does
   not claim …". Das sind Notizen an den Umsetzenden.

3. **Das gesamte `TypeScale`-Artboard.** Es ist eine Spezifikation für
   `index.css`, keine Seite.

4. **Der Google-Fonts-`<link>`** in jedem Artboard-`<helmet>`. Archivo und
   IBM Plex Mono kommen über `@fontsource`. Ein Link auf
   `fonts.googleapis.com` ist im Repo ein DSGVO-Verstoß und ist dort schon
   zweimal versehentlich gelandet (DESIGN.md §4).

5. **Die Artboard-Rahmenmaße** — 1440 × 4600 px und so weiter. Die Seite ist
   flüssig, kein Artboard.

6. **Die eingebetteten Fotos selbst** als Produktionsassets — zu klein, siehe
   oben.

7. **Die eckigen Klammern** — `[AMOUNT]`, `[PROPERTY]`, `[TERM]`, `[NOTICE]`,
   `[RANGE]`, `[GUESTS]`, `[PRICE]`, `[NAME]`, `[LANGUAGE]`. Das sind fehlende
   Angaben, keine Textbausteine. Keine davon darf als Literal in den Code.

8. **Die Karten-Grafik auf `/property/:slug` und der Kartenverlauf** als
   gezeichnete Fläche. Das Wireframe malt Land und Wasser als CSS-Gradient;
   im Code wäre das eine echte Karte (Leaflet liegt in `package.json`).

Was dagegen **Interface ist und bleibt:** die Eyebrow-Tags — `BEACHFRONT
COLLECTION`, `LOCATION`, `OUR COLLECTION`, `MORE HOMES NEARBY`,
`FOR OWNERS`, `YOUR STAY`, `RENOVATIONS`, `INVESTMENTS`, `TALK TO US`,
`RECOMMENDED FOR SECOND HOMES`, `FOR INVESTORS`, `KEY FEATURES`,
`WHERE YOUR HOME GOES LIVE`.

---

## d) OFFENE FRAGEN OHNE KONFLIKT

Punkte, an denen das Wireframe etwas verlangt, wofür es im Code schlicht keine
Grundlage gibt. Kein Widerspruch, nur eine Lücke.

| # | Frage |
|---|---|
| **F1** | Im Artboard `PropertyManagement` 03 steht ein **deutscher Satz**: „Von der Renovations bis zur garantierten Monatsmiete — vier Leistungen, die sonst vier Dienstleister brauchen." Die Website-Sprache ist Englisch. Wie lautet der englische Satz? (Er steht im Mobil-Artboard genauso.) |
| **F2** | `/properties` Filterleiste: „Bedrooms" geht (`properties.bedrooms`), „Budget" geht nur über `price_per_night` — und das ist der **eingefrorene Importwert**, kein Preis. „Collection" hat **keine Spalte** (PROJECT.md D8). Welche Filter sollen real sein? |
| **F3** | Das `/properties`-Artboard hat **keine H1** mehr — nur die Zeile „23 homes on the Costa del Sol, in Vienna and in Carinthia". Der SEO-Querschnitt verlangt genau eine H1 pro Seite. Wird diese Zeile die H1, oder kommt der Titel zurück? |
| **F4** | „View more homes →" unter dem Raster: Paginierung, Lazy-Load — oder nur Dekoration? Heute lädt die Seite alle 23 auf einmal. |
| **F5** | „420 m²" auf der Detailseite: **die `properties`-Tabelle hat keine Größenspalte.** Liefert Guesty das (dann Import erweitern) oder fällt die Angabe weg? |
| **F6** | Der Tag „Beachfront Collection": **keine `collection`-Spalte** (D8). Woraus soll er kommen? |
| **F7** | „Key Features", auf acht kuratiert statt der vollen Amenity-Liste: nach welcher Regel? Die ersten acht aus `amenities` wären willkürlich, eine Rangliste bräuchte eine neue Spalte oder eine Whitelist im Code. |
| **F8** | „Nearby: Beach — 2 min walk · Puerto Marina — 10 min drive · Málaga Airport — 25 min drive". Es gibt eine Spalte `nearby_amenities` (Json) — **sie wird von nichts geschrieben und von nichts gelesen**, eine unangeschlossene Lovable-Altlast. Also: Wege und Zeiten von Hand pflegen, aus Koordinaten berechnen, oder Section ohne Wegzeiten? (`latitude`/`longitude` **sind** befüllt, die Karte selbst geht.) |
| **F9** | „Similar Homes": nach welchem Kriterium ähnlich — gleicher Ort, gleiche Größe, gleiche Preisklasse? Und filterbar „by the same date/guest chips", also mit Verfügbarkeitsprüfung? Letzteres wäre ein weiterer `guesty-get-calendar`-Aufruf pro Objekt. |
| **F10** | Der Header wird im gefüllten Zustand **weiß**, der Footer wird **ink**. Heute ist beides Sage-Grün (`bg-primary`). Bestätigt? Das ist der sichtbarste Einzeleffekt des ganzen Umbaus. |
| **F11** | Die Mobil-Artboards sind auf **390px** gezeichnet, `design-tokens.md` §6 nennt 420px. Nicht wichtig für die Umsetzung, aber die Token-Datei sollte stimmen. |
| **F12** | `docs/wireframe/` liegt nicht im Repo. Sollen Artboards und `design-tokens.md` dort eingecheckt werden, damit jede spätere Phase dieselbe Referenz hat? |

---

## e) Was diese Session am Plan geändert hat

Drei Dinge, die der Handoff vom 12.09. so nicht vorhergesehen hat:

1. **Elf Artboards statt acht.** `HeaderStates`, `EvaluatorStates` und
   `TypeScale` kamen dazu. `TypeScale` gehört in **P1** (es ist die
   Spezifikation für `index.css`), `HeaderStates` ebenfalls nach P1 oder P2,
   `EvaluatorStates` nach **P3** — nicht nach P2, denn es ist kein statisches
   Layout, sondern ein Formularfluss mit einem Edge-Function-Aufruf.

2. **Die Typo-Skala hat sieben Rollen, nicht sechs.** `Card title` ist neu.
   Damit fällt auch die Regel „Playfair erst ab 28px" ersatzlos weg (es gibt
   keine Serife mehr) und die Begründung „700 statt 600, weil Lato kein 600
   hat" wird gegenstandslos — Archivo hat 500 und 600, und das Wireframe nutzt
   beide. `DESIGN.md` §5 ist in P1 mitzuziehen.

3. **`/property/:slug` ist nicht nur ein Re-Skin, sondern auch der Nachzug von
   C5.** Die Seite läuft noch auf `container mx-auto px-4` und
   `font-playfair text-4xl`. Sie ist die einzige der vier, die das
   Layout-System und die `.t-*`-Skala überhaupt nie bekommen hat — der
   Schriftwechsel in P1 geht dort also schlicht vorbei, solange das nicht
   nachgeholt wird.
