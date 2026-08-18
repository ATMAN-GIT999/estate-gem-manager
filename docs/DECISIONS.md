# DECISIONS — Warum die Seite so ist, wie sie ist

> **Rolle dieser Datei:** Das Gedächtnis des Projekts. Sie beantwortet „warum
> steht dieser Satz genau so da" und „warum wurde X verworfen" — damit eine
> Entscheidung nicht in der nächsten Session versehentlich zurückgedreht wird.
>
> Sie ist **keine Bauanweisung.** Was gebaut ist, steht in
> [PROJECT.md](PROJECT.md); wie formatiert wird, in [DESIGN.md](DESIGN.md).

---

## 1 · Die Grundentscheidung: zwei Zielgruppen, zwei Seiten

Aus einem Videocall mit dem Besitzer: Vacation Rental und Property Management
werden **klar getrennt** — getrennte Suchintention, getrennte Journey, getrennte
Seiten. Ein Besucher soll sofort verstehen, welcher Bereich für ihn relevant ist.

Daraus folgt alles Weitere: die Landingpage bleibt gäste-primär, die PM-Seite
sammelt den Eigentümer-Content, und „Own a Property?" ist die **einzige**
Übergabe zwischen beiden.

**Warum das so streng gehandhabt wird:** Der historische Hauptfehler des
Projekts war Eigentümer-Sprache auf Gäste-Seiten. Vorher standen Collections →
Own a Property → Guest Management, was die Seite zweimal die Zielgruppe wechseln
ließ, bevor der Gast mit dem Lesen fertig war.

---

## 2 · Protokoll der Struktur-Entscheidungen

| Frage | Entscheidung |
|---|---|
| Basis für alles | `main`; Umbau-Branch ist `redesign/v2` |
| Aus `experiment/one-pager` übernehmen | Nur `StaysYouLove` und `AboutMini` |
| Landing-Hero und PM-Hero | **Zwei verschiedene Heroes.** „Bespoke Property Management" gehört auf die PM-Seite, nicht auf die Booking-Landingpage |
| Bestehende PM-Seite | Bleibt Basis, wird erweitert — **nicht neu gebaut** |
| Guaranteed Income | Bleibt unter Property Management, keine eigene „Zwei Modelle"-Hauptrubrik. Es ist aber ein **zweites Geschäftsmodell** (Festmiete statt Provision), kein „Additional Service" — deshalb prominent in „Two ways to start with us" |
| Renovations & Investments | Bleiben eigenständige Unterseiten, unter *Guaranteed Income* verschachtelt. Als eigenständige große Boxen aufgelöst |
| Investments-Persona | Investments zielt auf einen **Investor, der kaufen will**, nicht auf den Eigentümer, der verwalten lassen will. Deshalb bewusst sekundär auf der PM-Seite |
| Cashflow Analysis | Formular auf `/` und auf `/evaluate`. Die PM-Seite **verlinkt nur noch dorthin** — kein zweites eingebettetes Formular |
| Projects | Inhalt als Section auf der PM-Seite, Nav-Punkt entfällt |
| About Us | `AboutMini` als Section auf der PM-Seite; `/about` bleibt als Seite **und** als Menüpunkt |
| Guest Management | Gehört auf die Booking-Landingpage, nicht auf die PM-Seite |
| Farbpalette | `main` ist Referenz. Die veränderten Beige-Töne aus dem Experiment-Branch wurden zurückgenommen |
| „Hybrid models" | Gestrichen — der Halbsatz auf `/guaranteed-income` verwies auf ein drittes Modell, das es nicht gibt |
| Guaranteed-Income-Details | Festbetrag, Vertragsdauer, Kostenträger, Eigennutzung, Wechsel werden **bewusst nicht** auf der Website beantwortet. Das klärt sich im Gespräch |

---

## 3 · Warum diese Reihenfolge auf der PM-Seite

> ⚠️ **Dieser Abschnitt beschreibt den Stand bis 16.08.2026.** Die
> Reihenfolge wurde mit dem Umbau ersetzt — was heute gilt, steht in §11 und
> in PROJECT.md §2. Er bleibt stehen, weil die Begründungen erklären, wogegen
> §11 entschieden hat.

Die Reihenfolge ist **ein Argument, keine Liste**:

> was es einbringt → was es dich an Aufwand kostet → warum wir → wie das im
> Alltag aussieht → wo → wer → wie man anfängt

Ein Block verschoben zerlegt den Satz, nicht nur das Layout.

- **Earns vor Relax.** Erst der wirtschaftliche Nutzen, dann die Entlastung.
  Psychologisch: *Revenue → Relaxation*. Die Relax-Section darf deshalb ruhiger
  wirken und soll nicht noch einmal Revenue erklären.
- **Different vor Details.** Der Anspruch muss vor seinem eigenen Beleg kommen,
  sonst trifft der Leser eine Aufgabenliste ohne etwas, woran sie hängt.
- **Kontaktformular als Hero.** Die erste Handlungsaufforderung war ursprünglich
  Section 9 von 10 — davor acht Sections reine Information. Der Hero hat jetzt
  zwei Buttons, weil Eigentümer in zwei Zuständen ankommen: der entschlossene
  will eine Person („Talk to us about your property"), der neugierige gibt
  seinen Namen noch nicht her und nimmt lieber eine Zahl mit („See what it could
  earn").

---

## 4 · Die Redundanz-Regel

Bei der Content-Analyse zeigte sich, dass **sieben echte Leistungen bis zu
dreimal** erklärt wurden — Dynamic Pricing, 24/7-Kommunikation, Housekeeping,
Listings, Reporting, Compliance, Check-ins, verteilt über Business Areas,
Technology und die Säulen.

**Die Regel seitdem:** Jede Leistung wird **genau einmal** erklärt — in ihrer
Heimat-Säule. Technologie nennt sie nur noch als „Wie" (Proof). Die Finanz-Ebene
nennt Pricing/Revenue/Reporting nur als „Ergebnis/Geld".

Gleiches galt für die Positionierung: Es existierten **fünf Formulierungen
derselben Aussage**. Zwei waren stark („deserves more than management",
„boutique hotel"), drei waren aufgeblähte Wiederholungen — gestrichen, ohne
einen neuen Satz zu schreiben.

---

## 5 · Text-Herleitung, die sonst nirgends steht

Diese Punkte erklären, warum einzelne Formulierungen genau so lauten. Nützlich,
bevor jemand sie „aufräumt".

- **„A small team, on the ground in every region we host."** (`AboutMini`) —
  bewusst als Antwort auf die Frage, die bei einem 3–8-Millionen-Objekt
  tatsächlich über den Auftrag entscheidet: *wem gebe ich den Schlüssel*.
- **„Every enquiry, booking, arrival and complaint comes to us, not to you."**
  (`WhyItMakesADifference`) — der gestrichene Halbsatz („It is the largest part
  of the work…") war eine Aussage *über* die Leistung, nicht die Leistung selbst.
- **„What that adds up to:" und „What the system actually does:"** waren als
  `h3` ausgezeichnet und damit die kleinsten Überschriften der Seite — unter
  Fließtextgröße. Sie sind jetzt `p` mit Meta-Rolle, weil sie
  Listen-Einleitungen sind, keine Gliederungsknoten. Derselbe Grund beim
  Footer-Markennamen.
- **Die Kennzahlen der Projekte** (85 % · +120 % · 4,9) tragen das Ergebnis
  bereits. Der Satz daneben muss nur noch sagen, **was getan wurde** — nicht das
  Ergebnis wiederholen.
- **„Before & After Photos — Coming Soon"** bleibt bewusst als Rahmen stehen,
  bis echtes Material da ist. Die Bildunterschrift sitzt **unter** dem Rahmen
  und funktioniert unverändert weiter, sobald Fotos hineinwandern.
- **Die Projekt-Texte sind Aussagen über reale Objekte des Besitzers.** Kürzen
  heißt hier auch: anders behaupten. Vor dem Livegang gegenlesen lassen.

---

## 6 · Technische Entscheidungen mit Begründung

| Entscheidung | Warum |
|---|---|
| **Admin-Routen einzeln `lazy()`** statt einem gemeinsamen Admin-Chunk | Wer Bookings öffnet, braucht den Page-Builder nicht. Der Brocken war `grapesjs` (1,14 MB). Ergebnis: Haupt-JS 750,5 → **377,5 KB** gzip |
| **Öffentliche Seiten bleiben eager importiert** | Absicht — sie sind der Normalfall, nicht die Ausnahme |
| **Fonts selbst gehostet** | DSGVO. Österreichische und deutsche Gerichte behandeln den Google-Fonts-Abruf wiederholt als Verstoß, und dieses Unternehmen hat Büro und Kunden in Österreich |
| ~~YouTube-Embed im Hero entfernt~~ | War derselbe Grund wie bei den Fonts — jeder Seitenaufruf lud `youtube.com/embed`, plus Cookies, plus teuerster denkbarer LCP. **Auf Almedins ausdrückliche Weisung am 18.08.2026 zurückgeholt** (§12); das DSGVO-Risiko besteht weiter und ist jetzt eine bewusst getroffene Geschäftsentscheidung, keine offene Baustelle |
| **Kein Preis im Property-JSON-LD** | Die einzige verfügbare Zahl (`price_per_night`) ist nachweislich in beide Richtungen falsch. Ein fehlender Preis kostet ein Rich Snippet; ein falscher ist ein Widerspruch, den der Gast beim Bezahlen entdeckt |
| **`robots.txt` auf eine einzige Gruppe reduziert** | Vorher hatten Googlebot, Bingbot, Twitterbot und facebookexternalhit eigene `Allow`-Gruppen. Da ein Crawler nur seine spezifischste Gruppe liest, hätte jedes künftige `Disallow` in der `*`-Gruppe **genau diese vier nicht erreicht** |
| **`og:title`/`og:description` aus `index.html` entfernt** | Helmet hängt Tags **an statt zu ersetzen** — sonst hätte jede Seite zwei davon, und ein Parser, der den ersten nimmt, läse immer den generischen |
| **Webhook fail-closed** | Ohne gesetztes Secret wurde vorher **jeder** Request ungeprüft verarbeitet — er löscht aus `guesty_calendar_cache` und schreibt mit dem Service-Role-Key. Da die Endpoint-URL im Repo dokumentiert ist, wäre er für jeden offen gewesen, der sie kennt. Jetzt: kein Secret → 503 |
| **Fotos zuerst, Lead-Zeile zuletzt** (`ConsultationBooking`) | Ein fehlgeschlagener Upload darf die Anfrage nicht kosten. Fehler werden gesammelt und in der Zeile vermerkt statt abzubrechen |
| **Bestätigung ersetzt das Formular nach dem Absenden** | Ein ausgefülltes Formular lädt sonst zur zweiten identischen Einsendung ein |
| **Datum und Fotos im Beratungsformular optional** | Pflicht bleiben nur Name, E-Mail, Objektadresse — das Minimum zum Nachfassen. Ein Pflicht-Fotoupload ist eine Bewerbung; die verlangt man nach dem Erstkontakt, nicht davor |
| **`/evaluate` rendert den Evaluator selbst, wenn kein State da ist** | Vorher war die Route nur als Ergebnisseite erreichbar. Der Footer-Link „Property Evaluation" war damit auf **jeder Seite** eine Sackgasse: Klick → kommentarloser Sprung auf die Startseite |

---

## 7 · Zwei Fehler, die sich wiederholen können

**1 · Migrationen bauen, die es schon gibt.** Bei den Kontaktformularen wurden
zwei eigene Migrationen geschrieben und wieder entfernt — eine frühere
Lovable-Session hatte Bucket (`consultation-uploads`) und alle Policies längst
angelegt, nur nie angeschlossen. Die eigenen Migrationen hätten einen zweiten,
konkurrierenden Bucket erzeugt.

→ **Vor jeder neuen Migration prüfen, ob Tabelle/Bucket/Policy schon existiert.**

**2 · Formulare, die nichts speichern.** `ConsultationBooking.handleSubmit`
prüfte Datum und Bilder, zeigte „We'll review your property and contact you
within 24 hours" — und hörte auf. Kein `supabase.from(...)`, kein Mailversand,
kein Upload. Die Komponente stand am wärmsten Lead, den die Seite erzeugt.

→ **Bei jedem Formular verifizieren, dass die Einsendung tatsächlich ankommt** —
und zwar gegen die RLS-Policy, nicht nur gegen den Code.

---

## 8 · Die Referenzen und wie sie gemeint sind

**AvantStay** ist der strukturelle Benchmark für Informationsarchitektur,
Conversion-Flow und visuelle Gewichtung. **OmniVillas** kommt im offenen
Refactor-Auftrag als zweite Referenz für Hierarchie und Interaktion dazu
(DESIGN.md §9).

> **Nicht visuell kopieren.** Übernommen werden die strukturellen Prinzipien
> einer professionellen Vacation-Rental-Plattform — die eigene visuelle
> Identität, Farbpalette, Typografie, Bilder und der Charakter von Frontier
> Residences bleiben.

Die Leitfrage lautet: **Welche Information kommt wann, warum und mit welchem
visuellen Gewicht?**

---

## 9 · Verworfene Ansätze

| Verworfen | Grund |
|---|---|
| **7 Fragen = 7 Sections** als PM-Struktur | „Wie wird optimiert" und „Was unterscheidet uns" überschneiden sich fast vollständig — es wären wieder zwei fast gleiche Tech-Abschnitte entstanden. Stattdessen sauber getrennt: **Finanz-Performance** (Outcome/Geld) vs. **Technologie** (das Wie/Proof) |
| **Guaranteed Income als „Additional Service"** | Es ist ein zweites Geschäftsmodell. Unter „weitere Leistungen" vergraben verschenkt es einen starken Conversion-Hebel |
| **Tailwind-`fontSize`-Tokens für die Typo-Skala** | Ein `fontSize`-Token trägt keine Schriftfamilie. Größe und Familie auf zwei Klassen zu verteilen war genau der Mechanismus, durch den zwölf 16px-Überschriften in Playfair landeten |
| **„Zero operational errors thanks to smart automation"** | Absolutbehauptung, kaum haltbar |
| **Zielwort „~700 Wörter" für die PM-Seite** | Zu optimistisch. Wichtiger ist ohnehin die Grenze **pro Block**, nicht pro Seite — die PM-Seite hat legitim mehr zu sagen als eine Ein-Produkt-Landingpage |
| **Die vier Kennzahlen ein zweites Mal in „Own a Property?"** | Dieselben vier Zahlen zweimal auf einem Scroll. Sie stehen jetzt oben in `Stats` |
| **`OwnerCta.tsx` (mailto-Abschluss)** und **`IntroSection.tsx`** | Durch `OwnerContactForm` bzw. den heutigen Hero ersetzt; beide waren von nichts mehr importiert und wurden gelöscht |

---

## 10 · Wichtige unbelegte Behauptungen auf der Seite

Zur Kenntnis, nicht als Vorwurf — jemand sollte sie vor dem Livegang bestätigen:

- **„41 Properties Managed"** gegenüber 23 Objekten in der Sitemap und „20+
  premium properties" für Spanien in `ProjectsSection`. Ein skeptischer
  Eigentümer zählt die Objektliste nach.
- **„8 Destinations"** — offen, ob kroatische Orte mitgezählt sind. Kroatien ist
  kein Bestandsmarkt.
- **„1500+ Successful Reservations" / „50+ Collaborators"** — Marketing-Copy als
  `useState`-Default, keine Live-Daten.
- Alle Positionierungs-Adjektive („bespoke", „precision", „discretion") sind
  reine Behauptung. Der stärkste verfügbare Beleg ist stattdessen konkret und
  steht bereits auf der Seite: **„from €13,000 to €65,000 annual income"**
  (Soho Boho).

Ein sofort verfügbarer, belegbarer Differenzierer wäre die Aufnahmehürde:
**„Every home is visited in person before we take it on."** Das ist wahr (lokale
Teams in jeder Region), kostet nichts und dreht die Beziehung von Bewerbung auf
Auswahl.

---

## 11 · Der PM-Umbau vom 16.08.2026

Grundlage: eine Konzeptphase außerhalb des Codes, orientiert an **OmniVillas**
(Struktur) und **AvantStay** (Bookend-CTA), daraus ein visuelles Mockup in
`docs/property-management-page.html`. Das Mockup war **Referenz für Layout,
Hierarchie und Bildplatzierung**, nicht für Inhalt — bei Widerspruch galt die
Section-Tabelle aus dem Auftrag.

### Das Kontaktformular ist vom Hero ans Seitenende gewandert

**Das dreht §3 um.** Dort steht als Begründung: die erste Handlungsaufforderung
war Section 9 von 10, davor acht Sections reine Information — also wanderte das
Formular in den ersten Screen.

Das war die richtige Diagnose und eine zu teure Behandlung: Die Seite öffnete
über einem Objekt von 3–8 Mio. € mit einer Dateneingabe. Ein Eigentümer, der
noch nicht weiß, wer wir sind, füllt kein Formular aus — er sieht eines und
scrollt daran vorbei.

Der Hero zeigt jetzt das Objekt und **beide** Zustände als Button: „Contact Us"
springt per Anker zum Formular, „See what yours could earn" führt auf
`/evaluate`. Damit ist die Konversion **einen Klick** entfernt statt acht
Sections — die Diagnose aus §3 bleibt also behandelt, nur ohne die Nebenwirkung.
Zusätzlich trägt Section 5 (About) den einen CTA in der Seitenmitte, an der
Stelle, an der ein Eigentümer die Frage stellt, die tatsächlich entscheidet:
*wem gebe ich den Schlüssel*.

> **Wer das Formular zurück nach oben schiebt, muss diesen Absatz widerlegen,
> nicht nur §3 zitieren.** Ob die Änderung wirkt, kann heute niemand messen —
> siehe PROJECT.md D6.

### Drei Sections wurden zu einer

`FinancialPerformance`, `WhyItMakesADifference` und `ListingWorkflow` erzählten
Scheiben derselben Geschichte. §4 dieser Datei hat 2026 die Regel aufgestellt,
dass jede Leistung **genau einmal** erklärt wird — die Redundanz war danach
nicht zurückgekehrt, sie war nur von der Absatz- auf die Section-Ebene
gewandert: dieselben sieben Leistungen, verteilt auf drei Überschriften.

`TheSystem` erzählt sie einmal, in der Reihenfolge, in der sie einem Objekt
passieren. Fast kein Satz ist neu geschrieben; die IDs sind mit ihren Sätzen
mitgewandert (Tabelle in PROJECT.md §2).

**Was das kostet, offen benannt:** Die Überschrift „We manage what the property
earns." gibt es nicht mehr, und damit die eigene Geld-Ebene aus §3. Getragen
wird sie jetzt von Schritt 2 und 6 (Pricing, Reporting), der Outcome-Zeile und
den Zahlen in Proof. Wer den Eindruck hat, das Geldargument sei zu leise
geworden, hat einen legitimen Punkt — die Antwort wäre aber ein stärkerer
Schritt 2, keine vierte Section.

**Ersatzlos gestrichen:** „Predictive maintenance & optimized scheduling"
(`wid-feature-2`) — im neuen Ablauf gibt es keinen Platz dafür, und
„predictive" ist eine Behauptung in derselben Klasse wie das schon einmal
gestrichene „Zero operational errors".

### Kein Dashboard mehr behaupten

„Transparent reporting" sagte an zwei Stellen zu viel: „plus a live dashboard
anytime" und „Full transparency with live dashboards". **Es gibt kein
Owner-Dashboard** (PROJECT.md D6). Das Mockup schlug „full visibility anytime"
vor, was dasselbe Versprechen mit weicheren Worten ist.

Heute steht dort: **„Monthly statement, with every booking and every cost
itemised."** Das ist konkreter als das, was es ersetzt, und es stimmt.

### Plattform-Logos als Wortmarken

Schritt 3 sollte die Marken aus `platform-connections.webp` zeigen. Die Datei
ist **eine flache Illustration** — dahinter liegen keine einzelnen Logos.
Sie herauszuschneiden hieße, elf fremde Wortmarken in Rastermüll
weiterzuverbreiten. Sie stehen jetzt als Text. Kostet kein Asset, wirft keine
Markenfrage auf, und passt besser zum „weniger Boxen"-Register als eine Reihe
weißer Kacheln.

### Was aus dem Mockup bewusst NICHT übernommen wurde

| Im Mockup | Warum nicht |
|---|---|
| Reihenfolge `Two ways → About` | Die Auftragstabelle sagt `About → Two ways`, und der geforderte Rhythmus bestätigt sie |
| Neue Copy für „Two ways" (Headline, Bullet-Listen) | Die bestehenden Sätze sind der Maßstab, den DESIGN.md §7 selbst zitiert |
| Erfundene Owner-FAQ (Kosten, Laufzeit, Onboarding) | Im Mockup selbst als Platzhalter markiert. Braucht echte Antworten vom Kunden — PROJECT.md D11 |
| Neue Renovations-/Investments-Texte | Der Bestandssatz nennt Kroatien korrekt als **Kauf**markt; „in our regions" hätte genau die Unterscheidung eingeebnet, die PROJECT.md §1 schützt |
| Google-Fonts-`preconnect` im `<head>` | DSGVO. Das Mockup weist im eigenen Footer darauf hin |
| Unterstrich-Felder im Kontaktformular | Sieht im Screenshot besser aus und füllt sich schlechter aus. Das ist der wärmste Lead der Seite |

---

## 12 · Nachbesserung vom 18.08.2026

Fünf Korrekturen an §11, nach Ansicht des ersten gebauten Stands. Vier davon
sind Layout-Feinschliff; die fünfte dreht eine Grundsatzentscheidung um und
gehört deshalb ausführlich protokolliert.

### Das YouTube-Embed kommt zurück — auf ausdrückliche Weisung

**Das widerspricht §6 dieser Datei.** Dort steht, warum das Embed entfernt
wurde: es lud `youtube.com/embed` für jeden Besucher, bevor irgendwer geklickt
hatte — derselbe DSGVO-Grund, aus dem die Schriften selbst gehostet werden,
nur für Video statt Typografie. Diese Session hatte das aus genau diesem Grund
auf ein Standbild umgestellt.

Almedin hat das **explizit zurückgewiesen**: „das youtube-embed video MUSS
wieder zurückkommen! und integriert werden in unsere md's". Das ist eine
Geschäftsentscheidung, keine technische — er trägt das Abwägen zwischen
Video-Wirkung und dem DSGVO-Risiko, nicht der Code. Umgesetzt:

- `Hero.tsx` (Landing-Page) läuft wieder mit `videoType: "youtube"`,
  Default-ID `tqmWpFCv_1M` — dieselbe ID, die vor der Entfernung zuletzt lief
  (verifiziert über `git log -S "youtube.com/embed"`, Commit `6e4f23f`,
  12.12.2025).
- Der Bildfallback (`villa-higueron.webp`) ist aus `Hero.tsx` **entfernt**,
  nicht nur zweitrangig gemacht — das Bild gehört jetzt an einen anderen Ort
  (siehe unten). Löscht jemand das Video im Editor ohne Ersatz, zeigt die
  Fläche die geteilte Schraffur (`.bg-placeholder-hatch`) statt eines
  geliehenen Fotos.
- Die DSGVO-Begründung aus §6 ist **nicht falsch geworden** — sie steht
  weiterhin im Code-Kommentar über dem `videoType`-State, als das Risiko, das
  diese Entscheidung bewusst eingeht.

> **Wer das hier wieder rausnehmen will:** Diese Entscheidung ist zweimal
> gefallen — einmal für Datenschutz (§6), einmal von Almedin explizit
> dagegen (hier). Bei der dritten Änderung bitte direkt mit ihm klären, nicht
> nach eigenem Ermessen zwischen den beiden hin- und herschalten.

### Warum das Video zurückzuholen den Bild-Streit aus §11 auflöst

§11 hatte ein Problem offen gelassen: der Hero-Slot der PM-Seite war leer
(Platzhalter), weil das einzig verfügbare Motiv (`villa-higueron.webp`) schon
im Landing-Hero steckte und eine Verdopplung vermieden werden sollte. Mit dem
Video zurück im Landing-Hero braucht die Landingpage kein Bild mehr — das Bild
wandert jetzt dorthin, wofür es ursprünglich vorgesehen war: der PM-Hero.

**Offen bleibt der bereits gemeldete Vorbehalt:** `villa-higueron.webp` ist
byteweise `property-3.webp` (dieselbe Datei zweimal im Repo) und zeigt einen
**Innenraum** — Marmorboden, Glasfront, Pool und Meer nur durch die Scheibe zu
sehen — nicht die Villa-Außenansicht mit Infinity-Pool, die ursprünglich
spezifiziert war. Almedin hat auf diesen Punkt nicht geantwortet, nur die
Video-Frage entschieden; das Bild wurde trotzdem verschoben, weil es
Almedins eigener Anweisung aus der Nachbesserung folgt („dieses exakte Bild
… verschieben, nicht neu von den Assets raten") und weil ohne Verschiebung
der PM-Hero leer bliebe. **Bleibt offen, siehe PROJECT.md B5** — ein echtes
Außenfoto ersetzt es, sobald eines existiert.

### Header-Scrim als eigenes Element, nicht als Verlauf auf der Leiste

Die vorige Fassung hatte den Scrim entfernt, weil ein Gradient direkt auf der
80px hohen Nav-Box exakt dort endete, wo die Box endete — eine harte
waagerechte Kante quer über Foto oder Video. Jetzt ist der Scrim ein
eigenständiges, 160px hohes Element, das doppelt so hoch ist wie die Leiste
selbst und **innerhalb dieser Höhe vollständig auf Transparent ausläuft** —
es gibt keine Kante zu sehen, weil an der Stelle, an der die Box endet,
ohnehin schon nichts mehr da ist. Nutzt das `scrim`-Token (dasselbe
Dunkelgrün wie `--overlay-media`), nicht Schwarz. Nur sichtbar im
transparenten Zustand — sobald die Leiste grün gefüllt ist, braucht sie keine
Hilfe von unten.

### Zahnrad-Überschriften: die erfundenen Titel raus, das Label rauf

Jeder der sechs Schritte in `TheSystem` trug zwei Überschriften: das
kleingeschriebene Label („OPTIMAL LISTING") und darunter einen von Claude
Design erfundenen Satz („Your home, shown at its best."), der nicht aus dem
geprüften Content stammte. Der erfundene Satz ist komplett gestrichen; das
Label selbst ist jetzt die einzige Überschrift, hochgestuft auf `t-block`
(die Größe, die der gestrichene Satz hatte). Die sechs verbindlichen Labels:
Optimal listing · Dynamic pricing · Advertised everywhere · Guest management ·
Property care · Transparent reporting. Die IDs `sys-title-0…5` sind damit
ersatzlos entfallen; `sys-label-0…5` trägt jetzt sowohl den Text als auch die
`t-block`-Auszeichnung.

### FAQ: die einzige bewusste Ausnahme vom „nicht 1:1 übernehmen"

Bislang lief die FAQ in einem Silver-Panel (`<Surface material="silver">`),
geteilt mit dem alten PM-Hero-Panel — das Panel, das seit §11 nicht mehr
existiert, weil der Hero jetzt ein Bild ist. Die gemeinsame Begründung war
damit hinfällig, unabhängig von dieser Nachbesserung.

Übernommen aus der Design-Referenz, wie von Almedin angeordnet: Haarlinien
statt Panel, Frage in Playfair (`t-block`), ein echter Glyphenwechsel
Plus/Minus in Gold statt rotierendem Chevron, dieselbe Öffnen/Schließen-
Transition wie zuvor. **Weiterhin über die bestehende `FAQ.tsx` und ihre
`EditableText`-IDs** — `faq-eyebrow` und `faq-heading` unverändert, Fragen und
Antworten unverändert (sie speisen das FAQPage-JSON-LD und sind nicht
editierbar). Technisch auf dem rohen Radix-Primitive (`@radix-ui/react-
accordion`) statt `ui/accordion.tsx`, weil dieser Wrapper den Chevron fest
einbaut — Barrierefreiheit und die Öffnen/Schließen-Animation kommen in
beiden Fällen von Radix bzw. den bereits vorhandenen Keyframes in
`tailwind.config.ts`.

⚠️ `FAQ.tsx` läuft auch auf der Landingpage — die Optik ändert sich dort mit,
was konsistent ist (dort gibt es ebenfalls kein Silver-Panel mehr), aber
außerhalb dessen liegt, was für diese Nachbesserung angefragt war.
