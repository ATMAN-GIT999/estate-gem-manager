# Frontier Residences — Marketing- & CX-Teardown

**Scope:** Startseite (`/`) und Property-Management-Seite (`/property-management`).
**Branch:** `redesign/v2` · **Stand:** 13.08.2026 · **Primäres Ziel:** Eigentümer-Anfragen.

Reine Analyse. Es wurde nichts geändert. Alle Befunde sind gegen den tatsächlichen
Code belegt, nicht gegen die Dokumentation — wo Doku und Code auseinandergehen,
steht der Code.

**Gelesen:** `src/App.tsx` · `pages/Index.tsx` · `pages/PropertyManagementPage.tsx` ·
`pages/Evaluate.tsx` · `components/Hero.tsx` · `Navigation.tsx` ·
`PropertyCollections.tsx` · `OwnAProperty.tsx` · `GuestManagement.tsx` ·
`PropertyEvaluator.tsx` · `PropertyManagement.tsx` · `FinancialPerformance.tsx` ·
`Stats.tsx` · `ProjectsSection.tsx` · `TechnologySection.tsx` · `AboutMini.tsx` ·
`WaysToWorkTogether.tsx` · `OwnerContactForm.tsx` · `BusinessAreas.tsx` ·
`Footer.tsx` · `Seo.tsx` · `lib/siteMeta.ts` · `src/index.css` · `tailwind.config.ts`

---

## 1 · Der 5-Sekunden-Test

### Startseite — Eigentümer (primär)

> *„Das ist ein Ferienvermieter."*

Er sieht ein autoplayendes Video, eine Suchleiste mit *Where to? · Check-in ·
Check-out · Guests*, und eine Überschrift, die eine Kategorie benennt statt ein
Versprechen: **„Luxury Villas & Vacation Rentals in Spain and Austria"**
(`Hero.tsx`, laut `target-structure.md` §Offene Punkte 2 ein **Platzhalter**).

Nichts auf dem ersten Bildschirm ist an ihn gerichtet. Der einzige gefüllte Button
im Header heißt **„Sign In"**. Er ordnet Frontier als Buchungsplattform ein — und
eine Buchungsplattform vertraut man kein 5-Millionen-Haus an. Der Eigentümer-
Einstieg kommt erst nach zwei kompletten Sektionen.

**Verdikt:** Nicht auf Augenhöhe. Kompetent gemacht, aber als Gäste-Portal lesbar.

### Startseite — Gast (sekundär)

> *„Okay, Villen in Spanien. Suchen wir mal."*

Funktioniert. Video, Suche, drei kuratierte Reihen (`PropertyCollections.tsx`:
*Luxury Stays for You · Explore the City · Off-Grid Experiences*). Der Gast ist
schnell orientiert. Er stolpert allerdings über **„Own a Property?"** mitten im
Stöbern — ein Zielgruppenwechsel, den er nicht bestellt hat.

### Property-Management-Seite — Eigentümer

> *„Klingt gut. Wer seid ihr?"*

Der Hero ist ruhig, die Typografie sitzt (nach dem Typo-Pass sauber
Display → Block → Body), die Positionierung ist klar formuliert. Aber es ist
**reine Behauptung**: „bespoke", „precision, discretion, hospitality of a
world-class boutique hotel". Kein Name, kein Gesicht, keine Stimme eines anderen
Eigentümers, keine Zahl, die nicht selbstberichtet ist.

**Verdikt:** Deutlich besser als die Startseite. Aber es ist eine Broschüre, kein
Beweis.

---

## 2 · Der Eigentümer-Funnel — wo genau er abbricht

```
  /  Hero (Gäste-Suche über YouTube-Video)
  │   └─ nichts für den Eigentümer · einziger Button: „Sign In"
  ▼
  PropertyCollections  ── 3 Reihen Gäste-Content
  ▼
  OwnAProperty  ── ERSTES Eigentümer-Signal
  │   „Own a Property?" + 4 Zahlen + 1 Button
  │   → /property-management                                    ✔ korrekt geroutet
  ▼
  PM-Hero · zwei CTAs
  ├── „Talk to us about your property"  → #owner-contact        ✔ korrekt
  └── „See what it could earn"          → #property-evaluation  ✔ korrekt
                                                │
                                                ▼
                              PropertyEvaluator · 6 Felder
                                                │
                                                ▼
                                          /evaluate
                                                │
                    ██  SACKGASSE  ██
                    kein Kontaktfeld · kein Lead gespeichert
                    kein Button · kein Link · kein mailto
```

Das Routing ist **überall korrekt** — es gibt keinen Eigentümer-CTA, der
fälschlich in den Gäste-Buchungsflow `/book` führt. Geprüft in
`OwnAProperty.tsx:97`, `PropertyManagementPage.tsx:66-83`, `Navigation.tsx:24-36`.

**Der Bruch liegt woanders und ist schwerwiegender:** Der Pfad, auf den der
sekundäre Hero-CTA und der Navigationspunkt „Property Evaluator" den Eigentümer
schicken, endet ohne Ergebnis für Frontier.

---

## 3 · Befunde

### 🔴 KRITISCH

---

#### K1 · Der Rechner selbst erfasst keinen Kontakt — der Abbrecher ist unsichtbar

> **Korrigiert am 13.08.2026.** Die ursprüngliche Fassung behauptete, `/evaluate`
> sei eine vollständige Sackgasse ohne jede Kontakterfassung. Das war falsch. Die
> Prüfung lief per Suche **innerhalb** von `Evaluate.tsx` und hat übersehen, dass
> das Formular in einer importierten Komponente steckt: `Evaluate.tsx:5` importiert
> `ConsultationBooking`, `:514` rendert es als `{!loading && analysis && <ConsultationBooking />}`.
> Der Befund bleibt bestehen, aber schwächer als beschrieben.

**Beobachtung.** `PropertyEvaluator.tsx:22-29` sammelt `address`, `bedrooms`,
`bathrooms`, `propertyType`, `size`, `guests`. **Kein Name, keine E-Mail, keine
Telefonnummer.** `handleSubmit` (Zeile 53) navigiert mit den Daten im Router-State
nach `/evaluate`.

**Erst nachdem die Analyse fertig gerechnet ist**, erscheint darunter
`ConsultationBooking` — Name, E-Mail, Telefon, Objektadresse, Wunschtermin und bis
zu zehn Fotos, die seit dem Fix in `contacts` und den Bucket `consultation-uploads`
geschrieben werden. Das ist ein funktionierender und sogar sehr reichhaltiger
Lead-Weg.

**Was bleibt:** Die Erfassung hängt vollständig daran, dass der Eigentümer die
Analyse **abwartet und danach ein zehnfeldriges Formular ausfüllt** — inklusive
Pflicht-Fotoupload (`ConsultationBooking.tsx`, Bilder sind erforderlich). Wer die
Zahl sieht und geht, hinterlässt **nichts**: keine Adresse, kein Objektprofil,
nicht einmal die Information, dass er da war (siehe H6).

Dieselbe Sektion ist auf **beiden** Seiten eingebunden (`Index.tsx`,
`PropertyManagementPage.tsx`) und ist der **Navigationspunkt „Property Evaluator"**.
Es ist der meistbeworbene Eigentümer-Pfad der ganzen Website.

**Warum es Conversion kostet.** Der Cashflow-Rechner bringt einen Eigentümer aus
reinem Eigeninteresse dazu, seine Objektdaten einzugeben — der wertvollste Moment
im gesamten Funnel. Diese Daten liegen bereits im Router-State und werden
**verworfen**, wenn er das große Formular danach nicht ausfüllt. Der Pflicht-Upload
von Fotos ist an dieser Stelle die härteste Hürde der ganzen Website: Sie steht vor
dem Erstkontakt, nicht danach.

**Severity: Hoch** (herabgestuft von Kritisch — der Weg existiert, er ist nur zu eng).

**Die 10x-Version.** AvantStay und Le Collectionist gaten nicht den *Input*,
sondern das *Ergebnis*. Konkret:
1. Nach Absenden sofort eine **Spanne** zeigen („€48.000 – €71.000 / Jahr") — ohne
   Gegenleistung, das erzeugt Reziprozität.
2. Die **Aufschlüsselung** (Monatskurve, Auslastungsannahme, Vergleichsobjekte)
   hinter ein einziges E-Mail-Feld legen: *„Send me the full breakdown."*
3. Auf der Ergebnisseite ein zweiter CTA: *„Have a revenue manager walk you through
   it — 20 minutes."*
4. Jede Eingabe in `contacts` schreiben, auch ohne E-Mail (Adresse + Objektprofil
   ist bereits ein qualifizierter Lead für den Vertrieb).

---

#### K2 · Der einzige gefüllte Button im Header ist ein Gäste-Login

**Beobachtung.** `Navigation.tsx:84-88`. Das visuell dominanteste Element im
Header — Gold, `shadow-gold` — ist **„Sign In"**. „Property Management" ist ein
Textlink unter vieren (`Navigation.tsx:41-45`).

Für einen eingeloggten Nutzer wird daraus „My Bookings" → `/book`
(`Navigation.tsx:78`). Auch das ist Gäste-Funktionalität.

**Warum es Conversion kostet.** Der Header ist auf jeder Seite und in jedem
Scroll-Zustand sichtbar (`fixed top-0`). Die stärkste Handlungsaufforderung der
gesamten Website ist für die primäre Zielgruppe **irrelevant**. Gleichzeitig ist
sie das erste Signal, das die Marke einordnet: Wer „Sign In" prominent zeigt, ist
eine Plattform, kein Vermögensverwalter.

**Severity: Kritisch.**

**Die 10x-Version.** onefinestay und Le Collectionist führen dauerhaft **einen**
gefüllten Button, und der gehört dem Eigentümer: *„List your home"* /
*„Partner with us"*. Sign-in wird ein kleiner Textlink oder ein Personen-Icon ganz
rechts. Für Frontier: **„Talk to us about your property"** als einziger gefüllter
Button, auf jeder Seite, mit Ziel `#owner-contact` bzw. `/property-management#owner-contact`.

---

#### K3 · Der einzige echte Anfrage-Weg steht in Sektion 9 von 9

**Beobachtung.** `PropertyManagementPage.tsx:99-111` rendert in dieser Reihenfolge:

| # | Sektion | Rolle |
|---|---|---|
| 1 | `PropertyManagement` | Leistung |
| 2 | `FinancialPerformance` | Nutzen |
| 3 | `Stats` | Beleg |
| 4 | `ProjectsSection` | Beleg |
| 5 | `PropertyEvaluator` | → Sackgasse (K1) |
| 6 | `TechnologySection` | Mechanik |
| 7 | `AboutMini` | Vertrauen |
| 8 | `WaysToWorkTogether` | Modelle |
| 9 | `OwnerContactForm` | **einziger Lead-Weg** |

`OwnerContactForm.tsx` ist die **einzige** Komponente auf beiden Seiten, die in
`contacts` schreibt (`OwnerContactForm.tsx:90`, `source = 'consultation-booking'`).
Sie ist gut gebaut — Vorname, Nachname, E-Mail, Telefon, Objektadresse,
Freitext, dazu eine glaubwürdige Zusage („within one working day", Zeile 54).

Sie steht am Ende von ~1.250 Wörtern. Der Hero-CTA „Talk to us about your property"
springt korrekt dorthin — aber wer scrollt, passiert vorher die Sackgasse aus K1.

Das weicht zudem von `target-structure.md` Ebene 8 ab, die Rechner **und** CTA
gemeinsam als Abschluss vorsieht.

**Warum es Conversion kostet.** Der zeitknappe Eigentümer entscheidet nicht am
Seitenende. Er entscheidet direkt nach dem stärksten Beweis — und der ist
`ProjectsSection` („von €13.000 auf €65.000"). Dort gibt es keinen Weg zu
sprechen.

**Severity: Kritisch.**

**Die 10x-Version.** Rechner und Anfrage zu **einem** Abschlussblock verschmelzen
(„Get your number, then talk to us"), und direkt nach `ProjectsSection` einen
schlanken Zweitzugang setzen: eine Zeile plus Feld, *„See what your home could
earn →"*. Le Collectionist platziert den Eigentümer-Einstieg nach jedem
Beweisblock, nicht einmal am Ende.

---

#### K4 · Jeder geteilte Link bewirbt das Build-Tool

**Beobachtung.** `lib/siteMeta.ts`:

```ts
export const DEFAULT_OG_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";
```

Der Kommentar darüber weist es selbst als offenen Punkt aus. `Seo.tsx:40` nutzt
diesen Wert als Default für `og:image` und `twitter:image` — und **keine** der
beiden Seiten übergibt ein eigenes Bild.

**Warum es Conversion kostet.** Ein Eigentümer entscheidet über sein Haus nicht
allein. Er schickt den Link an seine Frau, seinen Steuerberater, seinen Anwalt.
Genau in diesem Moment — dem Moment mit der höchsten Kaufabsicht — erscheint in
WhatsApp und LinkedIn die Grafik eines fremden Software-Produkts. Der Empfänger,
der die Marke noch nicht kennt, sieht als Erstes „lovable.dev".

**Severity: Kritisch** (nicht wegen des Aufwands, sondern wegen des Zeitpunkts).

**Die 10x-Version.** Zwei 1200×630-Bilder: eines für den Gäste-Teil (bestes
Objektfoto), eines für `/property-management` (Objekt + Wortmarke, kein Text-Overlay
mit Claim). Aman und Le Collectionist behandeln die Share-Karte wie eine
Anzeigenfläche, nicht wie eine Metadatenpflicht.

---

#### K5 · Der Hero lädt ein YouTube-iframe — im direkten Widerspruch zur eigenen DSGVO-Haltung

**Beobachtung.** `Hero.tsx:59`:

```
https://www.youtube.com/embed/tqmWpFCv_1M?autoplay=1&mute=1&loop=1&...
```

Dem gegenüber steht `src/index.css:1-13`, wo ausführlich begründet wird, warum die
Schriften **selbst gehostet** sind:

> *„Loading them from fonts.googleapis.com sends every visitor's IP address to
> Google before the page has even rendered, which Austrian and German courts have
> repeatedly treated as a GDPR breach — and this business has clients and an office
> in Austria."*

Für Schriften wurde dieser Aufwand betrieben. Der Hero tut auf **jedem Seitenaufruf
genau das** — plus Cookies, denn es ist `youtube.com`, nicht `youtube-nocookie.com`,
und es läuft vor jeder Einwilligung.

**Warum es Conversion kostet.** Drei Ebenen. (1) Rechtlich: Die Zielgruppe sitzt in
Österreich und Deutschland — dort ist genau dieser Embed abgemahnt worden. (2)
Performance: Ein Video-iframe als Hero-Hintergrund ist der teuerste denkbare LCP.
(3) Markencode: Kein Haus dieser Kategorie spielt ein YouTube-Embed. Aman,
Le Collectionist und onefinestay hosten kurze, farbkorrigierte, stumme Loops selbst
— weil Bildqualität und Kontrolle Teil des Versprechens sind.

**Severity: Kritisch.**

**Die 10x-Version.** Ein selbst gehosteter, farbkorrigierter 8–12-Sekunden-Loop
(2–4 MB, `muted autoplay playsinline loop`, Poster-Still als LCP-Element), oder —
oft stärker — **ein einziges herausragendes Standbild**. Reduktion wirkt nur mit
erstklassigem Material; ein ruhiges Foto schlägt ein mittelmäßiges Video.

---

### 🟠 HOCH

---

#### H1 · Die Kennzahlen sind hartkodierte Copy, stehen doppelt und laden zur Gegenrechnung ein

**Beobachtung.** `OwnAProperty.tsx:27-32` und `Stats.tsx` führen **dieselben vier
Zahlen**: 41 Properties Managed · 1500+ Successful Reservations · 8 Destinations ·
50+ Collaborators. Beide sind `useState`-Defaults — **Marketing-Copy, keine
Live-Daten.**

Der Eigentümer sieht sie auf der Startseite und, nach einem Klick, unverändert
wieder auf der PM-Seite.

Dazu ein Glaubwürdigkeitsrisiko: Der Sitemap-Build meldet **23 Objekte**, und
`ProjectsSection` nennt „20+ premium properties under management" für Spanien.
Gegenüber „41 Properties Managed" ist das erklärungsbedürftig. Ob die Zahl stimmt,
kann ich nicht beurteilen — aber ein skeptischer Eigentümer zählt die Objektliste.

**Warum es Conversion kostet.** Wiederholung ohne neue Information liest sich dünn.
Und eine Zahl, die der Besucher selbst widerlegen kann, beschädigt jede andere Zahl
auf der Seite mit.

**Severity: Hoch.**

**Die 10x-Version.** Zahlen datieren und spezifisch machen: *„41 homes under
management · as of January 2026"*. Le Collectionist veröffentlicht stattdessen
Kennzahlen, die ein Wettbewerber **nicht** behaupten kann — Vetting-Quote, NPS,
durchschnittliche Eigentümerbindung in Jahren. Auf der Startseite gehören andere
Zahlen als auf der PM-Seite.

---

#### H2 · Keine Testimonials, keine Gesichter, keine Namen

**Beobachtung.** `AboutMini.tsx:56-64` zeigt ein Foto nur, wenn
`team_members.avatar_url` gefüllt ist — sonst **Initialen in einem farbigen Kreis**.
Im gerenderten Zustand sind es Initialen. Der Kommentar (Zeile 20) benennt das als
bekannten Zustand.

Auf der gesamten PM-Seite gibt es **kein einziges Eigentümer-Testimonial**.
`pm-page-content-analysis.md` §7.2 führt das seit Wochen als offenen Punkt.

**Warum es Conversion kostet.** Bei einem Objekt zwischen 3 und 8 Millionen Euro
ist die eigentliche Frage nicht „was kostet es", sondern „wem gebe ich den
Schlüssel". Die Seite beantwortet sie mit vier grauen Kreisen. Zahlen belegen
Kompetenz, Menschen belegen Verlässlichkeit — und die zweite Frage ist die, an der
es scheitert.

**Severity: Hoch.**

**Die 10x-Version.** Drei Eigentümer mit vollem Namen, Objekttyp und Region, je ein
Satz, der **Geld oder Kontrollverlust** anspricht — nicht „great service". Dazu
Teamfotos in einheitlicher Bildsprache. onefinestay hat damit den Kategoriestandard
gesetzt: erst der Mensch, der dein Haus betritt, dann die Technik.

---

#### H3 · Fee-Transparenz fehlt vollständig

**Beobachtung.** `WaysToWorkTogether.tsx` stellt beide Modelle klar gegenüber —
Full-service management und Guaranteed Income, jeweils mit benanntem Tausch. Das ist
der beste Textblock der Seite. Aber **nirgendwo steht, was es kostet**: keine
Provisionsspanne, keine Aussage, was in der Provision enthalten ist, kein „ab".

`pm-page-build-sheet.md` §Erledigt hält fest, dass die Detailfragen bewusst ins
Gespräch verlagert wurden. Für die *Details* ist das richtig. Für die
**Größenordnung** kostet es Anfragen.

**Warum es Conversion kostet.** Ein Eigentümer, der die Provision nicht findet,
unterstellt entweder „teuer" oder „verhandelbar, also beliebig" — beides schlecht.
Vor allem aber verschiebt es die Frage in ein Erstgespräch, das er dann lieber mit
dem Anbieter führt, der die Zahl genannt hat.

**Severity: Hoch.**

**Die 10x-Version.** Eine Zeile pro Modell: *„Full-service management: X % of
booking revenue. No setup fee, no minimum term."* AvantStay und Le Collectionist
nennen das Modell offen — es filtert unpassende Anfragen heraus und macht die
passenden wärmer.

---

#### H4 · Frontier prüft den Eigentümer nicht sichtbar

**Beobachtung.** Auf der gesamten PM-Seite gibt es kein Kriterium, das eine
Immobilie erfüllen muss. Exklusivität wird durchgehend **behauptet** („bespoke",
„exceptional homes", „boutique hotel"), aber nie durch einen Filter **belegt**.

**Warum es Conversion kostet.** In der Luxus-Hospitality kehrt der stärkste
Positionierungshebel die Richtung um: Nicht „bitte beauftragen Sie uns", sondern
„nicht jedes Haus passt zu uns". Solange Frontier jeden nimmt, ist Frontier
austauschbar — und der Eigentümer verhandelt über den Preis statt über die Aufnahme.

**Severity: Hoch.**

**Die 10x-Version.** Le Collectionist' schärfste Waffe ist eine einzige Zeile:
*„We visit every home. We accept about one in four."* Für Frontier belegbar und
sofort verfügbar: **„Every home is visited in person before we take it on."** Das
ist wahr (lokale Teams in jeder Region), kostet nichts und dreht die Dynamik.

---

#### H5 · `/business-areas` ist eine verwaiste Route mit konkurrierendem PM-Content

**Beobachtung.** `App.tsx:80` hält die Route aktiv; `BusinessAreasPage.tsx:47`
rendert `BusinessAreas`. In `Navigation.tsx:41-45` kommt sie nicht vor — sie ist
über die Website nicht erreichbar, für Google aber sehr wohl.

`BusinessAreas.tsx:12-20` trägt weiterhin „Business Areas", „Comprehensive services
designed to maximize your property's potential", „Property Management" und das
„Guaranteed Income Program" mit einem **„Included"-Badge** — eine Darstellung, die
`pm-page-build-sheet.md` §Offene Entscheidungen 1 ausdrücklich zugunsten von „Two
ways to work with us" verworfen hat.

**Warum es Conversion kostet.** Zwei Seiten konkurrieren um dieselben Keywords, und
die verwaiste gewinnt manchmal. Ein Eigentümer, der über Google auf
`/business-areas` landet, sieht eine ältere, widersprüchliche Version der
Positionierung — ohne den neuen Beweis- und Anfrageaufbau.

**Severity: Hoch.**

**Die 10x-Version.** 301 auf `/property-management`. Eine Eigentümer-Landingpage,
nicht zwei.

---

#### H6 · Der Eigentümer-Funnel ist nicht messbar

**Beobachtung.** Im gesamten öffentlichen Code existiert **ein einziger**
Tracking-Aufruf: `Index.tsx:32`, ein `page_view` auf `/`. Der einzige vorkommende
Wert für `event_type` ist `"page_view"`.

Kein Event für: Aufruf von `/property-management`, Absenden des Evaluators, Absenden
der Eigentümer-Anfrage, Klick auf einen CTA.

**Warum es Conversion kostet.** Kein einziger Befund aus diesem Dokument lässt sich
nach der Umsetzung verifizieren. Ob K1 tatsächlich der größte Hebel ist, ob der
Header-CTA wirkt, wie viele Eigentümer den Rechner abbrechen — alles unbekannt.

**Severity: Hoch.**

**Die 10x-Version.** Vier Events genügen: `pm_page_view`, `evaluator_submitted`,
`evaluator_result_viewed`, `owner_enquiry_submitted`, jeweils mit `source`. Danach
ist die Eigentümer-Conversion eine Zahl statt einer Meinung.

---

### 🟡 MITTEL

---

#### M1 · Die Value Proposition ist auf beiden Seiten eine Kategorie, kein Versprechen

**Beobachtung.** Landing-H1: „Luxury Villas & Vacation Rentals in Spain and Austria"
(Platzhalter laut `target-structure.md`). PM-H1: „Bespoke Property Management",
gefolgt von zwei Lede-Sätzen.

Beide sagen, **was** Frontier ist. Keiner sagt, **warum ausgerechnet Frontier**.
„Bespoke", „precision", „discretion" behauptet jeder Wettbewerber.

**Severity: Mittel** (hoher Hebel, aber abhängig von der Freigabe des Besitzers).

**Die 10x-Version.** Eine Zahl in die H1. AvantStay-Muster:
*„Your home, run like a boutique hotel. Owners earned +38 % last year."* Falls keine
belastbare Portfolio-Zahl vorliegt, das Soho-Boho-Ergebnis nach oben ziehen — es ist
das stärkste Argument, das Frontier besitzt, und steht aktuell auf Position 4.

---

#### M2 · Der Eigentümer-Einstieg auf der Startseite trägt keinen Beweis

**Beobachtung.** `OwnAProperty.tsx:22-23`: „Own a Property?" / „See what it could
earn with us.", darunter die vier bereits kritisierten Zahlen und ein Button.

Die **Platzierung** ist klug und im Code begründet (Zeile 8-15): direkt nachdem der
Besucher gesehen hat, was Frontier mit fremden Häusern macht. Der **Inhalt** nutzt
das nicht — er wiederholt nur Kennzahlen.

**Severity: Mittel.**

**Die 10x-Version.** An dieser Stelle gehört genau ein Beleg hin, kein Statistikblock:
das Soho-Boho-Vorher/Nachher mit der Zahl, oder ein Eigentümer-Zitat. Ein
konkretes Haus schlägt vier abstrakte Zahlen.

---

#### M3 · Der Rechner verlangt sechs Angaben, bevor er irgendetwas gibt

**Beobachtung.** `PropertyEvaluator.tsx:41-48`: `address`, `bedrooms`, `bathrooms`
sind Pflicht; `propertyType`, `size`, `guests` stehen optisch gleichwertig daneben.
Sechs Felder Kaltstart ohne jeden Gegenwert.

**Severity: Mittel** (wird durch K1 ohnehin mitangefasst).

**Die 10x-Version.** Nur die Adresse. Sofort eine grobe Spanne zeigen. Dann:
*„Refine this — 3 quick questions"*, um die Spanne zu verengen. Progressive
Disclosure verdoppelt in dieser Kategorie regelmäßig die Abschlussrate.

---

#### M4 · „Before & After Photos — Coming Soon", dreimal, im stärksten Beweisblock

**Beobachtung.** `ProjectsSection.tsx` zeigt bei allen drei Projekten einen
Platzhalter statt Bildern. `pm-page-build-sheet.md` §Offene Entscheidungen 4 lässt
sie bewusst stehen, bis Material da ist.

**Warum es Conversion kostet.** Eine angekündigte Lücke ist schlechter als keine
Lücke. Der Beweisblock ist die Stelle, an der der Eigentümer überzeugt wird — und
dort steht dreimal „kommt noch".

**Severity: Mittel.**

**Die 10x-Version.** Bis die Bilder da sind: Platzhalter entfernen und die Zahlen
groß setzen (85 % · +120 % · 4,9 tragen die Sektion allein). Danach ist das
Vorher/Nachher das visuell stärkste Element der gesamten Website.

---

#### M5 · Textmenge

Die PM-Seite trägt **1.250 Wörter**, der größte Block **352**. Detailanalyse,
Regelwerk und konkrete Kürzungen stehen in
[`design-finalisierung.md`](design-finalisierung.md), Anhang A — hier nur der
Querverweis, um nichts doppelt zu führen.

**Severity: Mittel.**

---

### 🟢 NIEDRIG

| # | Befund | Datei |
|---|---|---|
| N1 | `GUESTY_BOOKING_URL` ist deklariert, aber nirgends verwendet — Rest eines entfernten Buchungspfads | `Navigation.tsx:9` |
| N2 | `property-1.png` (1,1 MB) hat kein WebP-Pendant; mehrere PNG-Dubletten liegen weiter im Verzeichnis | `src/assets/` |
| N3 | Die Landing-Meta-Description adressiert Gast und Eigentümer im selben Satz — für keinen der beiden optimal | `pages/Index.tsx` |
| N4 | Nach dem Typo-Pass sind H3 und H4 auf der Startseite beide 18 px — visuell gewollt, semantisch eine Ebene ohne Unterschied | `PropertyCard.tsx`, `Footer.tsx` |

---

## 4 · Bild- und Editorial-Qualität — ehrlich

Reduziertes Design funktioniert **ausschließlich** mit erstklassiger Fotografie.
Der Typo-Pass hat gerade Weißraum freigelegt; dieser Weißraum verlangt jetzt Bilder,
die ihn rechtfertigen.

Der Bestand in `src/assets/`: fünf Objektbilder, ein About-Hero, eine
Plattform-Grafik, ein Logo, ein WhatsApp-Icon. **Kein einziges eigentümer-gerichtetes
Bild** — keine Übergabe, kein Team vor Ort, kein Detail, das Sorgfalt zeigt. Die
Objektbilder auf der Startseite kommen aus der Datenbank
(`PropertyCard.tsx:70`), sind also Guesty-Listing-Fotos: gut genug für eine
Buchungsplattform, nicht auf Le-Collectionist-Niveau.

**Die drei fehlenden Bildstrecken, nach Wirkung:**

1. **Vorher/Nachher der drei Projekte.** Das mit Abstand stärkste verfügbare Asset.
   „Von €13.000 auf €65.000" wird erst dann körperlich.
2. **Das Team an den Objekten.** Ersetzt die Initialen-Kreise und beantwortet die
   Frage, die tatsächlich über den Auftrag entscheidet.
3. **Ein einziges Hero-Standbild in Kampagnenqualität** — ersetzt das
   YouTube-Embed und löst K5 gleich mit.

---

## 5 · Marketing & Sichtbarkeit

| Punkt | Befund | Severity |
|---|---|---|
| **Title/Description** | PM-Seite gut und keyword-tragend (`PropertyManagementPage.tsx:38-39`). Landing mischt beide Zielgruppen. | Niedrig |
| **OG-Image** | Lovable-Platzhalter auf allen Seiten → **K4** | Kritisch |
| **SSR / Crawlability** | Reine Vite-SPA. Titel und Schema kommen per `react-helmet-async` erst nach dem JS. Google rendert das inzwischen — **WhatsApp, LinkedIn, Facebook und die meisten LLM-Crawler nicht.** Sie sehen ausschließlich `index.html`. | Hoch |
| **Kannibalisierung** | `/business-areas` konkurriert um dieselben Keywords → **H5** | Hoch |
| **Schema** | Organization/Breadcrumb sauber verdrahtet, ein `@id` für die ganze Site. Solide. | — |
| **Tracking** | Ein `page_view` auf `/`, sonst nichts → **H6** | Hoch |

Der SSR-Punkt verdient eine Bemerkung, weil er mit K4 zusammenhängt: Selbst wenn das
OG-Bild ersetzt wird, greifen **per-Seite**-Vorschauen erst mit Prerendering. Ohne
das zeigt jeder geteilte Link Titel und Bild aus `index.html` — für jede Route
dieselben. Für eine Seite, deren Conversion vom Weiterleiten an Berater abhängt, ist
das relevanter als das übliche SEO-Argument.

---

## 6 · Benchmark-Gap — pro Sektion ein Satz

| Sektion | Was ein Top-0,1-%-Anbieter stattdessen tut |
|---|---|
| Landing-Hero | **Aman:** ein einziges, ruhiges, selbst gehostetes Bild plus eine Zeile Haltung — statt Suchleiste über Autoplay-Video. |
| PropertyCollections | **Plum Guide:** jede Reihe trägt ein Aufnahmekriterium („The top 3 % of homes in Marbella"), nicht nur einen Namen. |
| OwnAProperty | **AvantStay:** ein konkretes Haus mit einer Zahl statt vier abstrakter Kennzahlen. |
| PM-Hero | **Le Collectionist:** die Aufnahmehürde steht im Hero, nicht das Leistungsversprechen. |
| PropertyManagement (3 Säulen) | **onefinestay:** was der Eigentümer *nicht mehr tut*, statt was Frontier alles tut. |
| FinancialPerformance | **AvantStay:** eine Portfolio-Zahl mit Zeitraum statt fünf qualitativer Ergebnisse. |
| Stats | **Le Collectionist:** Vetting-Quote und NPS — Zahlen, die ein Wettbewerber nicht behaupten kann. |
| ProjectsSection | **Le Collectionist:** Vorher/Nachher großformatig, Zahl als Bildunterschrift — der Beweis wird zum Hero der Seite. |
| PropertyEvaluator | **AvantStay:** Adresse rein, Spanne sofort raus, Aufschlüsselung gegen E-Mail. |
| TechnologySection | **AvantStay:** ein Screenshot des Owner-Portals schlägt vier Feature-Zeilen. |
| AboutMini | **onefinestay:** Gesichter mit Namen und Region, nicht Initialen. |
| WaysToWorkTogether | Bereits auf Benchmark-Niveau — es fehlt allein die Provisionsspanne (**H3**). |
| OwnerContactForm | **Le Collectionist:** Terminbuchung mit sichtbaren Slots statt Formular plus Warten. |

---

## TOP 5 FÜR 10x

Nach Effekt auf Eigentümer-Anfragen, nicht nach Aufwand.

---

### 1 · Die Hürde am Rechner senken  → **K1**

*Korrigiert: Der Weg ist nicht tot, er ist zu eng.* Nach der Analyse steht ein
Formular mit zehn Feldern **und Pflicht-Fotoupload**, bevor Frontier auch nur den
Namen kennt. Wer die Zahl sieht und geht, hinterlässt nichts — obwohl Adresse und
Objektprofil zu diesem Zeitpunkt bereits im Router-State liegen.

Zwei Stufen statt einer: die Objektdaten sofort als Lead speichern, danach ein
einziges E-Mail-Feld („Send me the full breakdown"), und die Fotos erst im
Gespräch. Ein Fotoupload ist eine Bewerbung — die verlangt man nach dem
Erstkontakt, nicht davor.

*Wirkung: Aus dem qualifiziertesten Moment der Website entsteht ein Lead, auch wenn
der Eigentümer abbricht.*

---

### 2 · Den Header dem Eigentümer geben  → **K2**

Ein gefüllter Button, auf jeder Seite, in jedem Scroll-Zustand — „Talk to us about
your property". „Sign In" wird ein Textlink. Das ist die einzige Änderung, die auf
**allen** Seiten gleichzeitig wirkt, und sie korrigiert zugleich die
Markeneinordnung im Fünf-Sekunden-Test.

*Wirkung: Der Eigentümer hat ab Sekunde eins einen Weg, statt ab Sektion drei.*

---

### 3 · Beweis vor Behauptung — Gesichter, Stimmen, Bilder  → **H2 · M4**

Drei Eigentümer-Testimonials mit Namen und Region, Teamfotos statt
Initialen-Kreisen, und die drei Vorher/Nachher-Strecken. Das ist der einzige Punkt
der Liste, der **Material vom Besitzer** braucht — deshalb sollte er heute
angefragt werden, damit er nicht zum Engpass wird.

*Wirkung: Beantwortet die Frage, an der die Entscheidung tatsächlich hängt — „wem gebe ich den Schlüssel".*

---

### 4 · Die Aufnahmehürde sichtbar machen  → **H4**

Eine Zeile: *„Every home is visited in person before we take it on."* Belegbar,
kostenlos, sofort umsetzbar. Sie dreht die Beziehung von Bewerbung auf Auswahl und
rechtfertigt rückwirkend jedes „bespoke" auf der Seite.

*Wirkung: Stärkster Positionierungseffekt pro investierter Minute auf der ganzen Liste.*

---

### 5 · Anfrage-Weg nach vorn ziehen und Share-Karte reparieren  → **K3 · K4**

Zweitzugang direkt nach `ProjectsSection`, dort wo die Überzeugung entsteht; Rechner
und Formular zu einem Abschlussblock verschmelzen. Dazu die zwei OG-Bilder —
zwanzig Minuten Arbeit, die verhindern, dass jeder weitergeleitete Link fremde
Software bewirbt.

*Wirkung: Fängt den Eigentümer im Moment der Überzeugung ab, statt neun Sektionen später.*

---

**Nicht in den Top 5, aber vor dem Livegang zu klären:** das YouTube-Embed (**K5**,
rechtliches Risiko in der Kernzielgruppe), die Provisionsspanne (**H3**), die
verwaiste Route `/business-areas` (**H5**) und die vier Tracking-Events (**H6**) —
ohne die letzten lässt sich der Erfolg der ersten vier nicht nachweisen.
