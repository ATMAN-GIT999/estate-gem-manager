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
| Property Evaluator (vormals „Cashflow Analysis") | Formular auf `/` und auf `/evaluate`. Die PM-Seite **verlinkt nur noch dorthin** — kein zweites eingebettetes Formular. Umbenannt am 18.08.2026 (§12) — vorher liefen drei verschiedene Namen für dasselbe Werkzeug nebeneinander (Nav „Property Evaluator", Sektion „Property Cashflow Analysis", Button „Get Free Cash Flow Analysis") |
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

### Owner-Dashboard bestätigt

Frühere Fassung dieses Abschnitts (Stand vor dem 19.08.2026): „Transparent
reporting" sagte an zwei Stellen zu viel — „plus a live dashboard anytime" und
„Full transparency with live dashboards" —, weil es kein Owner-Dashboard gab
(PROJECT.md D6). Das ist überholt: **der Kunde hat bestätigt, dass ein
Owner-Dashboard real ist bzw. eingeplant ist.** „Live dashboards" ist damit
eine korrekte Aussage, kein unbelegter Claim mehr, und Zahnrad 6 in
`TheSystem` darf sie wieder tragen.

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

---

## 13 · Nachbesserung vom 18.08.2026 (zweite Runde) — Design-System, PM-Seite, Landingpage

Ausgangspunkt: drei Claude-Design-Screenshots plus eine Sperrklausel, die
ausdrücklich nur **visuelle** Werte daraus erlaubte (Abstände, Box-Stil,
Farben, Schriftgewichte) — jeglicher Text kam entweder aus dem bestehenden,
geprüften Content oder aus expliziten Textanweisungen im Prompt, nie von dem,
was auf einem Screenshot zu lesen war. Die erfundenen Platzhaltertexte aus den
Screenshots ("Your home, shown at its best." usw.) sind exakt das Problem, das
§12 bereits einmal korrigiert hat.

### Das „1b"-Boxsystem: neuer Primitive, keine neue Farbpalette

Sechs Zahnrad-Punkte, vier Proof-Zahlen, die zwei "Two ways"-Modelle und die
zwei Renovations/Investments-Karten bekommen jetzt eine Box — Goldrahmen oben,
schwacher Flächenton, feste Innenabstände, kein Radius, kein Schatten. Neu
dafür: `layout/Panel.tsx`.

**Wichtig: Das brauchte keine einzige neue Farbe.** Die drei Werte aus dem
Prompt (`#b8964f` Rahmen, zwei Fläche-rgba()s) sind per HSL-Umrechnung
praktisch exakt `--accent`, `--primary` bei 5,5 % und `--primary-foreground`
bei 6 % — alles Tokens, die es schon gab. `Panel` nutzt ausschließlich diese
drei. CLAUDE.md listet die Farbpalette als „nicht anfassen ohne Rückfrage";
diese Umsetzung berührt sie nicht, weil sie nicht musste.

Der einzige Wert ohne Token-Entsprechung war `#3f4a41` (ein dunkleres Grün als
`--primary`, in der Referenz als Footer-Hintergrund erkennbar). Rückgefragt —
**Almedin hat sich für „Footer bleibt bei `--primary`" entschieden**, kein
neuer Token. Die Palette ist durch diese Nachbesserung also komplett
unverändert geblieben.

### Wo die kurze Goldlinie NICHT hinkam

Der Prompt listete Hero/Cases/Relax/Team/FAQ/Contact als Stellen, an denen die
dünne graue Linie einer kurzen goldenen (56×2px) weichen sollte. Rückgefragt,
weil FAQ seine Haarlinien als **volle Zeilentrenner** zwischen den Fragen
nutzt — eine kurze Linie hätte dort nur unter der ersten Frage gestanden und
die Liste wäre optisch auseinandergefallen. **Almedin hat FAQ ausdrücklich
ausgenommen.** Umgesetzt ist die kurze Linie (`Divider tone="bar"`, neu) nur
dort, wo tatsächlich eine Linie ein Card-Textblock öffnet — konkret die drei
Proof-Case-Karten. Hero, Relax und Team hatten ohnehin keine Linie, an der
etwas zu tauschen gewesen wäre.

### Zwei Kurskorrekturen, die eigene frühere Entscheidungen umdrehen

`WaysToWorkTogether` trug bisher eine ausführliche Begründung, **warum** die
zwei Modelle bewusst *keine* Cards sind (editorial statt Produktvergleich).
Almedin hat das Boxsystem trotzdem für diese Section angefordert — die
Begründung war laut ihm mehr Inkonsistenz (warum sind ausgerechnet diese zwei
Zeilen anders behandelt als die sechs System-Punkte) als ein tragendes Signal.
Umgesetzt als zwei `Panel`-Cards nebeneinander; der Kommentar in der
Komponente ist entsprechend umgeschrieben, nicht stillschweigend überschrieben.

`RenovationsAndInvestments` war zuvor bewusst von der `WaysToWorkTogether`-Box
gelöst worden (siehe deren eigener Kommentar zur Begradigung). Läuft jetzt
ebenfalls auf `Panel`, mit Icon — `HardHat` und `Search`, beide direkt von den
echten Unterseiten `/renovations` und `/investments` übernommen (deren erste
bzw. thematisch naheliegendste Service-Icons), nicht neu erfunden.

### Bildmaterial — was neu belegt wurde und was offen bleibt

Von den drei bislang unbenutzten, eindeutigen Fotomotiven (`property-4.webp`,
`property-5.webp`; `property-2.webp`/`about-hero.webp` ist weiterhin offen)
sind jetzt zwei vergeben: `property-4.webp` im Kontaktformular (Ersatz für
„protected value" in der Überschrift, dazu ein Bild mit Tiefenwirkung, das
einen hohen, schmalen Ausschnitt verträgt), `property-5.webp` bei „Own a
Property?" auf der Landingpage, die jetzt als Bildband mit linksbündiger
Überschrift läuft (OmniVillas-Muster, dieselbe `MediaFrame`+`overlay-media`-
Mechanik wie Hero und Relax). `property-2.webp`/`about-hero.webp` bleibt
unbelegt — für die Relax-Section vorgesehen (ihr `MediaFrame`-Briefing
beschreibt exakt dieses Motiv), aber das war in dieser Runde nicht angefragt.

**Die drei Proof-Case-Bilder (Villa Hoyo 19 / Soho Boho / Alpine Retreat)
bleiben Platzhalter.** Versucht: Live-Abgleich gegen die Supabase-`properties`-
Tabelle (Projekt `odloyonqqsgnpxvqrrep`). Das Projekt war beim Testen pausiert
(`status: INACTIVE`), die Anfrage lief in einen Timeout. Ob diese drei Namen
echten Objekten entsprechen, ist damit **weiterhin ungeklärt** — nicht geraten,
sondern offen gelassen. Sobald das Projekt reaktiviert ist, ist das eine
Ein-Zeilen-Abfrage.

### Logo: Hintergrund freigestellt, nicht neu gezeichnet

`frontier-logo.webp`/`.png` hatten das Sage-Grün **im Bild selbst** eingebrannt
— kein CSS-Hintergrund, sondern ein massives Rechteck im Pixelmaterial. Per
Farbschlüssel-Freistellung (Toleranzband um den exakt gesampelten Hintergrund-
Ton `rgb(84,100,88)`, mit weichem Übergang an den Kanten gegen ein hartes
Cutout) entfernt; Ergebnis auf Grün und auf einem mittleren Fototon gegen-
geprüft, keine sichtbaren Ränder. Läuft jetzt als eigene Datei
(`frontier-logo-transparent.webp`), verdrahtet in `Navigation.tsx` und
`Footer.tsx`. Die alten opaken Dateien liegen unverändert weiter im Repo (wie
die übrigen bewusst aufgehobenen alten Assets, PROJECT.md §6).

### Was bewusst nicht angefasst wurde

- **„It's in the details." (Landingpage, `GuestManagement.tsx`)** — laut
  CLAUDE.md und laut diesem Prompt selbst nur als Vorschlag zu behandeln, nicht
  automatisch zu ersetzen. Der Text dort ist geprüft. Ein Vorschlag ist im
  Chat-Verlauf dieser Session festgehalten, nicht im Code.
- **Icons an den sechs Zahnrad-Punkten** — als „Nebenidee, nicht erzwingen"
  angefragt. Geprüft und dagegen entschieden: jeder Punkt trägt durch den
  neuen Panel-Rahmen bereits sichtbares Gewicht, dazu die Nummer und den
  Spine-Kreis als Sequenz-Marker. Ein viertes visuelles Element (Icon) pro
  Punkt wäre genau die Überladung, vor der der Prompt selbst warnt.
- **Typografie-Gewichte** — im Code bereits `t-body: 400` und alle Playfair-
  Überschriften `700`. Der Prompt ging von „aktuell 300 / 400" aus; das trifft
  auf den heutigen Stand nicht zu. Da die Absicht ("dünne Schnitte wirken zu
  schwach") mit 700 bereits stärker erfüllt ist als mit dem vorgeschlagenen
  500, keine Änderung — ein Rückschritt auf 500 hätte die Überschriften
  dünner, nicht kräftiger gemacht.

### FAQ-Reihenfolge auf der Landingpage — ein Zielkonflikt, offen benannt

FAQ steht jetzt vor „Own a Property?" (wie angefordert). Die FAQ trägt aber
selbst eine letzte, eigentümer-gerichtete Frage, die laut ihrem eigenen
Kommentar bewusst **auf** „Own a Property?" verweist, statt einen eigenen
Übergang zu bauen. Mit dem Tausch kommt dieser Eigentümer-Hinweis jetzt vor
„Own a Property?" statt danach — die Seite wechselt die Zielgruppe damit
technisch zweimal (einmal in der FAQ, einmal in „Own a Property?"), statt wie
sonst im Projekt üblich genau einmal (CLAUDE.md, „der historische
Hauptfehler"). Umgesetzt wie angefordert, aber unkommentiert stehen lassen
wäre falsch gewesen — sollte sich das FAQ-Ende in der Praxis sperrig lesen,
ist das der Grund.

---

## 14 · Nachbesserung vom 19.08.2026 — Bildmaterial, Icons, letzte Textrunde

### Bildmaterial kommt jetzt aus dem echten Google-Drive-Ordner „Listing Pictures"

§13 hatte die drei Proof-Case-Bilder als Platzhalter stehen lassen, weil
Supabase pausiert war und sich „Villa Hoyo 19" / „Soho Boho" / „Alpine
Retreat" nicht gegen echte Objektnamen verifizieren ließen. Almedin hat
stattdessen Zugriff auf den Google-Drive-Ordner der echten Objektfotos
gegeben (`aschbacher@frontier-residences.com`, „Listing Pictures"). Abgleich
lief über den **Ordnernamen**, nicht über Supabase:

| Case-Study-Name | Drive-Ordner | Abgleich |
|---|---|---|
| Villa Hoyo 19 | „Hoyo 19 2C, Los Flamingos" | Zwei echte Einheiten existieren (1A und 2C) — **von Almedin ausdrücklich als 2C bestätigt**, nicht geraten |
| Soho Boho | „Soho Art, Calle Alemania" | Name + Bildinhalt (urbanes Apartment) passen; einziger Unterordner heißt „pics bad quali" |
| Alpine Retreat | „Lima Alpine Lodges" | Bestätigt über die Drohnenaufnahme „Theresia-Drohne-1.jpg" — zeigt exakt die Holzhütte mit Bergwiese und Weidevieh aus der Case-Study-Beschreibung |

Zusätzlich, nicht angefragt aber angeboten und angenommen: **„Los Monteros 3
bed Diana"** existiert ebenfalls als echter Ordner. Sein Foto füllt jetzt die
Relax-Section (`PropertyManagement.tsx`), die vorher komplett leer war —
nicht `property-2.webp`/`about-hero.webp`, wie ein früherer Prompt-Entwurf
annahm; der Slot war schlicht nie befüllt (PROJECT.md B5).

**Qualitätsunterschied offen benannt:** Villa Hoyo 19 und Alpine Retreat
stammen aus echten Hochauflösungs-Ordnern (4562×3041 bzw. gecroppt aus
2048×1534). Soho Boho kommt aus dem einzigen vorhandenen Ordner für dieses
Objekt, der selbst „bad quali" heißt — Quelle war 1200×800. Alle vier Bilder
wurden zentriert auf 4:3 (Case-Studies) bzw. 3:2 (Relax, volle Bildbreite)
zugeschnitten und als WebP re-encodiert (Pillow, Qualität 82), **nie
hochskaliert** — jeder Zuschnitt blieb kleiner als seine Quelle.

**Die Vorher/Nachher-Beschriftung ist mitgezogen.** Diese vier Fotos sind
aktuelle Bestandsfotos der Objekte, keine Renovierungs-Vorher/Nachher-Paare
(die aus PROJECT.md B4 bleiben offen, kommen vom Eigentümer). Das Label unter
den drei Case-Cards heißt deshalb jetzt „Featured Property" statt „Before and
After" — der alte Text wäre schlicht falsch gewesen.

### Icons an den sechs Zahnrad-Punkten — Kurskorrektur gegenüber §13

§13 hatte Icons an dieser Stelle **geprüft und abgelehnt**: der Panel-Rahmen,
die Nummer und der Spine-Kreis trügen schon genug visuelles Gewicht, ein
viertes Element wäre Überladung. Dieser Prompt hat das nicht als Vorschlag,
sondern als feste Anweisung mit exakter Zuordnung wiederholt — keine
Ermessensfrage mehr, umgesetzt:

01 Optimal Listing → `Image` · 02 Dynamic Pricing → `DollarSign` · 03
Advertised Everywhere → `Globe` · 04 Guest Management → `MessageSquare` · 05
Property Care → `Home` · 06 Transparent Reporting → `BarChart3` — alle
`lucide-react`, Gold (`text-accent-strong`), `strokeWidth={1.5}`, im
Spine-Kreis selbst statt zusätzlich daneben, damit kein fünftes Element
entsteht.

`RenovationsAndInvestments` bekam aus demselben Set einen Icon-Tausch:
`HardHat` → `Palette` (Renovations, passt zu Gestaltung statt Bauausführung),
`Search` → `Handshake` (Investments, passt zu Begleitung statt reiner
Marktrecherche) — beide bereits im selben `lucide-react`-Import verfügbar,
kein neuer Import nötig.

### CTA-Übergänge: eine Stelle statt vieler

„Smoother Übergang" ist jetzt in `buttonVariants` (`ui/button.tsx`) selbst
verdrahtet — `transition-colors` → `transition-all duration-200 ease-out` im
Basis-String, nicht an jeder einzelnen Button-Stelle gepatcht. Betrifft damit
automatisch jeden Button der Seite, auch künftige. Kein Transform/Scale
ergänzt — das hätte auf einer bewusst zurückhaltenden Seite (DESIGN.md §6)
verspielt gewirkt, gefragt war „smoother", nicht „mehr Bewegung".

## 15 · Nachbesserung vom 19.08.2026 (zweite Runde) — /book, Links, Relax-Zusammenlegung

### `/book` gelöscht — war eine Lovable-Attrappe, kein echter Buchungsflow

`Book.tsx` sah aus wie Buchungsfunktionalität, war es aber nicht: fest
codierte Fantasie-Objekte („Villa El Campanario" etc.), keinerlei Anbindung an
Guesty, Stripe oder Supabase. Das unterscheidet es klar von dem, was CLAUDE.md
unter „Buchungs-Engine, Guesty-Anbindung, Stripe-Fluss" schützt — dort ist
gemeint, was echte Reservierungen/Zahlungen auslöst, nicht alles, was wie eine
Buchungsseite aussieht. Geprüft (vollständiger Quelltext gelesen, keine
Supabase-/Guesty-Imports gefunden), dann gelöscht: Route in `App.tsx`, Eintrag
in der Admin-Seitenbau-Liste (`admin/Builder.tsx`).

Drei Verweise darauf zeigten noch auf `/book` und wurden auf `/properties`
umgebogen (es gibt keine eigene „Meine Buchungen"-Seite, `/properties` ist
die sinnvollste bestehende Zielseite): beide „My Bookings"-Links in
`Navigation.tsx` (Desktop + Mobile) und der „Contact us"-Button in
`GuestManagement.tsx`. Der geschützte Gast-Text dort selbst blieb unangetastet.

### Footer-Links: vier Owner-Links zeigten alle auf dieselbe verwaiste Seite

`Footer.tsx` verlinkte „Property Management", „Guaranteed Income",
„Renovations" und „Investments" allesamt auf `/business-areas` — eine Seite,
die keine der vier Unterscheidungen trifft. Nicht vom Prompt benannt, beim
Link-Audit gefunden und auf die vier echten Zielrouten korrigiert
(`/property-management`, `/guaranteed-income`, `/renovations`,
`/investments`).

### `los-monteros-retreat` zeigte auf ein fremdes Foto

Nebenbefund beim Bildaustausch: `PropertyCard.tsx` und `PropertyDetail.tsx`
ließen den Fallback für `los-monteros-retreat` exakt dieselbe Datei wie
`villa-in-higueron` verwenden — zwei verschiedene echte Villen zeigten
dasselbe Bild. Mit einem eigenen Los-Monteros-Foto aus dem Drive
(`los-monteros-card.webp`) behoben.

### Smooth Scroll: die Regel fehlte komplett, nicht nur an einer Stelle

`index.css` hatte einen `prefers-reduced-motion`-Override, der
`scroll-behavior: smooth` zurücksetzt — aber die Grundregel selbst war nirgends
gesetzt (toter Code). Ergänzt in `@layer base` auf `html`. Deckt beides ab, was
der Prompt wollte: native `<a href="#anchor">`-Sprünge innerhalb einer Seite
UND alle `scrollIntoView()`-Aufrufe laufen jetzt animiert statt abrupt.

Für Routenwechsel (andere Seite, nicht Anker) ist Sofort-Scroll weiterhin
richtig — ein neuer Seitenaufruf soll oben starten, nicht von der alten
Scroll-Position aus hochanimieren. Dafür `ScrollToTop.tsx`: bei jedem
Pfadwechsel ohne Hash `window.scrollTo(0, 0)` in der Zwei-Parameter-Form, die
laut Spezifikation immer sofort scrollt und die CSS-Regel ignoriert
(die Objekt-Form `{top, behavior}` würde sie respektieren und wäre hier falsch).

### Reeller Bug beim Verifizieren gefunden: `MediaFrame` mit `src` blies Bilder auf

Bei der Browser-Kontrolle der neuen quadratischen Case-Bilder (siehe unten)
saß der „See what yours could earn"-Button mitten auf der Soho-Boho-Karte statt
darunter. Ursache in `layout/MediaFrame.tsx`: der `src`-Zweig setzte `w-full
h-full` **zusammen mit** einer `aspect-*`-Klasse auf das `<img>` selbst, ohne
dass ein Vorfahre eine definierte Höhe hätte. `h-full` ohne gültige
Prozent-Basis plus `aspect-square` in einem CSS-Grid-Item mit
`grid-auto-rows: auto` erzeugt einen Zirkelschluss: das Bild bläst sich auf die
Zeilenhöhe auf, die Zeilenhöhe wächst mit dem Bild — am Ende war das Bild
~800px hoch statt quadratisch ~450px, und der restliche Karteninhalt (Titel,
Text, Zahlen) wurde nach unten aus dem Grid-Item hinausgedrückt.

Der Placeholder-Zweig (kein `src`) hatte das schon immer richtig gemacht —
nur `w-full` plus die Aspect-Klasse, kein `h-full`. Fix: den `src`-Zweig
genauso. Betraf nur die drei Proof-Case-Bilder, weil `MediaFrame` sonst nur
mit `fill` (Hero, Kontaktbild — dort ist `h-full` korrekt, der Elternknoten ist
positioniert) oder mit leerem `src` (Renovations/Investments-Platzhalter)
verwendet wird.

### „The Benefits": Eyebrow-Reihenfolge, Größe, quadratischer Zuschnitt

Eyebrow („What that looks like on three homes") stand unter der Überschrift
statt darüber — gedreht auf dieselbe Reihenfolge wie jeder andere
`SectionIntro`-Block. Überschrift „The Benefits" von `t-block` auf `t-section`
angehoben, damit sie exakt so groß wirkt wie „A Portfolio Built on Precision &
Performance" darüber — beide sind gleichrangige Kapitelüberschriften, nicht
Überschrift + Unterüberschrift.

Die drei Case-Bilder liefen vorher auf `aspect="photo"` (4:3) mit Quellmaterial,
das teils deutlich höher als breit war — auf `aspect="square"` umgestellt und
aus den Original-Rohdateien (nicht aus dem bereits zugeschnittenen 4:3-WebP,
um keinen doppelten Qualitätsverlust zu erzeugen) neu auf 1200×1200 zugeschnitten.
Der gemeldete „Abstand zur nächsten Section stimmt nicht" war identisch mit dem
`MediaFrame`-Bug oben — mit dem Fix behoben, kein separater Abstandswert nötig.

### „We manage while you relax" zieht in die Kontaktebene um

Die Relax-Section war die einzige Stelle auf der Owner-Seite ohne eigenen Job
im Argument der Seite (§2) — sie stand zwischen Proof und der kommerziellen
Entscheidung, ohne selbst eine zu transportieren. Auf Ansage zusammengelegt
mit dem Kontaktformular in `OwnerContactForm.tsx`: das Los-Monteros-Foto
(`los-monteros-relax.webp`) ersetzt das alte, nichtssagende Kontaktbild,
„We manage while you relax." ersetzt „Less hassle, higher income." als
Formular-Überschrift. Die PM-Seite hat dadurch acht Sections statt neun
(`PropertyManagementPage.tsx`, Kommentar aktualisiert).

Die alte, jetzt leere `PropertyManagement.tsx` (die frühere eigenständige
Relax-Section) wurde gelöscht, nachdem kein Import mehr auf sie zeigte.

### Bildaustausch aus dem Drive: höhere Auflösung, ein offener Rest

Zusätzlich zu den in §14 genannten vier Fotos wurden zwei weitere über
Ordnernamen im Drive gefunden und ersetzt: `villa-higueron.webp` (Peninsula
Villa A, Ordner „wetransfer_villa-higueron-1-jpg…", 4200×2800 Quelle) und
`property-4.webp` (Torre Verde Puente Romano, „Villa Puente Romano-1.jpg",
4200×2801 Quelle).

**Offen:** `property-2.webp` (Peninsula Villa C) ist NICHT ersetzt. Vier
Download-Versuche auf verschiedene Datei-IDs aus genau diesem einen
Drive-Ordner scheiterten wiederholt mit „session expired", während
`get_file_metadata` und Downloads aus allen anderen Ordnern im selben Zeitraum
funktionierten — kein allgemeiner Verbindungsausfall, sondern etwas an diesem
spezifischen Ordner/diesen Dateien. Nicht weiter erzwungen, um keine Retry-Schleife
gegen eine erkennbar gestörte Verbindung zu fahren. `property-5.webp` und
`about-hero.webp` sind aus einer früheren Runde ebenfalls unverändert
geblieben — für beide gab es keine eindeutige Drive-Entsprechung.

## 16 · Nachbesserung vom 19.08.2026 (dritte Runde) — Renovations/Investments in Zwei Wege

Almedin lieferte eine Referenz-Skizze (KI-generiertes Layoutbild): „Two ways
to start to work with us." (A/B-Karten), darunter eine goldene Linie mit
zentriertem Label „Beyond management", darunter „More ways we create value."
und die zwei Renovations-/Investments-Karten. Direkt danach soll About Us Mini
folgen.

`RenovationsAndInvestments.tsx` ist als eigene Datei gelöscht; ihr Inhalt lebt
jetzt als zweite Hälfte in `WaysToWorkTogether.tsx`, in einem gemeinsamen
`<Section>`. Die PM-Seite hat dadurch sieben Ebenen statt acht — About Us Mini
folgt jetzt direkt auf die zusammengelegte Section, ohne dass Renovations/
Investments noch einmal drei Ebenen weiter unten als eigener schwerer Block
auftaucht.

**Die goldene Trennlinie mit Label ist eine bewusste Ausnahme** von der Regel
„Gold ist Akzent, kein Trenner zwischen jeder Section" (DESIGN.md §24): die
Regel meint Trennung zwischen Sections, nicht innerhalb einer — und genau das
ist hier der Fall, ein echter Unterkapitel-Bruch innerhalb eines durchgehenden
Bands, keine Trennung zweier Sections voneinander.

**Die Bild-Slots der beiden Renovations-/Investments-Karten entfallen.** Die
Referenzskizze zeigt Icon + Text ohne Foto; da für diese beiden Karten ohnehin
nie ein Bild geliefert wurde (`beyond-image-0/1` liefen seit §7 als leere
`MediaFrame`-Platzhalter), ist der Slot mit dem Umzug ersatzlos entfallen statt
weiter als unbefüllter Platzhalter mitgeführt zu werden.

## 17 · Nachbesserung vom 19.08.2026 (vierte Runde) — echtes Hero-Foto

Almedin hat ein Foto direkt per Drive-Link geliefert (`Villa Higueron-11.jpg`,
`fileId 1NaHN_5VArxgzaWg2z5t33cR0p5tGimaf`) — Schlafzimmer mit Meerblick durch
bodentiefe Glasfronten, Marmorboden, aus demselben Ordner wie
`villa-higueron.webp` (Peninsula Villa A). Ersetzt das bisherige Hero-Bild in
`OwnerHero.tsx`, das laut eigenem Kommentar dort nur als Übergangslösung stand
(byte-identisch mit `property-3.webp`, wiederverwendet statt eines eigenen
PM-Hero-Fotos, PROJECT.md B5). B5 ist damit erledigt.

Neue Datei `src/assets/pmp-hero-villa-higueron.webp`, 1920×1280 (Quelle
4200×2800, nicht zugeschnitten — `fill`/`object-cover` übernimmt den Ausschnitt
pro Viewport), WebP Qualität 82. `villa-higueron.webp` selbst bleibt unverändert
im Einsatz für `PropertyCard`/`PropertyDetail` (villa-in-higueron).

**Bild-Übertragung technisch gelöst:** Ein direkt in den Chat eingefügtes Bild
lässt sich nicht ins Dateisystem übernehmen — Claude sieht es, hat aber keinen
Pfad dazu. Ein Drive-Link (wie hier) funktioniert dagegen wie jeder andere
Drive-Download dieser Session. Für zukünftige Bild-Übergaben ist der Drive-Link
der zuverlässige Weg, nicht das Einfügen ins Chatfenster.

### „Own a Property"-Bild (`property-5.webp`): Herkunft ungeklärt

Almedin fragte, welche Immobilie hinter dem Bild auf `/` unter „Own a
Property" steckt, um eine hochauflösende Version nachzuliefern. Der Code
(`PropertyDetail.tsx`) ordnet `property-5.webp` „villa-in-higueron" zu — aber
das Bild (beiges Sofa, gemusterte Tapete, klassisches Sideboard mit TV) passt
stilistisch nicht zu den bestätigten Villa-Higuerón-Fotos (durchgehend
minimalistisch, Marmor, Glasfronten, siehe oben). Die Zuordnung im Code stammt
vermutlich noch aus der Lovable-Zeit und ist wahrscheinlich falsch.

Eine blinde Bildsuche über alle ~23 Ordner in „Listing Pictures" (mehrere
Hundert Fotos, keine Vorschau ohne Volldownload) wurde nicht begonnen — zu
teuer für eine Vermutung ins Blaue, und genau die Art von Rätselraten zwischen
zwei möglichen Immobilien, die dieses Projekt vermeiden soll. Offen, bis
Almedin den richtigen Ordner benennt oder das Foto direkt per Drive-Link
liefert (siehe Antwort an ihn im Chat).

## 18 · Nachbesserung vom 19.08.2026 (fünfte Runde) — drei weitere Drive-Links

Almedin lieferte drei konkrete Drive-Links: eins für „Own a Property" auf `/`,
zwei für Case-Study-Bilder unter „The Benefits" (Hoyo 19, Soho Boho), plus die
Anweisung, für Alpine Retreat irgendein anderes Foto zu nehmen, das den
**Innenraum** des Hauses zeigt statt der Außenansicht.

**„Own a Property" (`OwnAProperty.tsx`, Landingpage):** `property-5.webp`
ersetzt durch `oap-villa-entrance.webp` (aus `DSC09264-HDR.jpg`, Ordner
„calidad web" unter Hoyo 19 1A — reine Hintergrundaufnahme, keine
Namenszuordnung zu einem bestimmten Case-Study nötig, da diese Section
generisch für „ein Zuhause" steht, nicht für eine benannte Immobilie).
`property-5.webp` selbst bleibt unverändert im Einsatz für `PropertyDetail.tsx`
(§17, B6 — Herkunft dort weiterhin ungeklärt).

**Soho Boho:** neues Foto aus demselben „pics bad quali"-Ordner (Soho Art) —
bestätigt korrekt, nur ein anderes, helleres Bild aus demselben, einzigen
verfügbaren Material für diese Immobilie.

**Alpine Retreat:** Innenaufnahme aus „Lima Alpine Lodges" → „Pictures" →
„final thomas" → `Theresia-36.jpg` — derselbe Ferienhaus-Einheit („Theresia"),
aus der auch die bisherige Drohnenaufnahme stammt (§14), also keine neue
Zuordnungsfrage. Zwei andere Kandidaten aus demselben Ordner (`Theresia-14.jpg`
= überdachte Terrasse, `Theresia-34.jpg` = Bad) wurden verworfen, weil sie
entweder kein echter Innenraum oder kein Raum sind, der die Geschichte
„gemütliches Alpen-Chalet" trägt — die gewählte Aufnahme (Holz-Empore mit Bett,
Karo-Bettwäsche) trifft das direkter.

**Hoyo 19 — offener Rest:** Der gelieferte Link
(`fileId 1OXIS14fystkzAgEI7RraNDTV3-_0qWNW`, „DSC01161-HDR.jpg", Ordner
„calidad maxima" unter Hoyo 19 2C — also die bestätigt richtige Einheit)
scheiterte bei fünf Download-Versuchen durchgehend mit „session expired",
während im selben Zeitraum mehrere andere Downloads (Own a Property, Soho
Boho, drei Theresia-Kandidaten) problemlos liefen. Exakt dasselbe Muster wie
bei `property-2.webp` in §14 — ein Problem an dieser spezifischen Datei, kein
allgemeiner Verbindungsausfall. Nicht weiter erzwungen. Villa Hoyo 19 zeigt
weiterhin die Sonnenuntergangs-Außenaufnahme aus §14, bis der Download
erfolgreich ist oder Almedin eine andere Quelle nennt.

## 19 · Guesty-Webhook (B3) — die Verifikation im Code war komplett falsch

PROJECT.md B3 ging davon aus, der Webhook ließe sich „in Guesty anlegen" und
das dabei ausgegebene Secret direkt als `GUESTY_WEBHOOK_SECRET` eintragen.
Beim Umsetzen zeigte sich: beides stimmt so nicht.

**Guesty liefert Webhooks über [Svix](https://www.svix.com) aus**, nicht über
einen eigenen Mechanismus. `guesty-webhook/index.ts` prüfte bisher einen
selbst erfundenen Header (`x-guesty-signature` / `x-webhook-secret` / ein
`secret`-Feld im Body) gegen einen simplen String-Vergleich — Guesty schickt
aber `svix-id` / `svix-timestamp` / `svix-signature` und signiert mit
HMAC-SHA256 nach dem Standard-Webhooks-Schema
(`{svix-id}.{svix-timestamp}.{raw body}`, Secret im Format `whsec_<base64>`).
**Mit korrekt gesetztem `GUESTY_WEBHOOK_SECRET` hätte der alte Code jeden
echten Webhook abgelehnt** — falscher Header, falsche Prüfmethode, nicht nur
ein fehlendes Secret. Behoben: `verifySvixSignature()` in
`guesty-webhook/index.ts` prüft jetzt die echten Svix-Header mit HMAC-SHA256
gegen das (base64-dekodierte) Secret, inklusive Zeitstempel-Toleranz gegen
Replay und Vergleich in konstanter Zeit. CORS-Header entsprechend angepasst
(`svix-*` statt `x-guesty-signature`).

**Die Registrierung selbst läuft über die Open API, nicht die Booking Engine
API.** Die bereits vorhandenen `GUESTY_CLIENT_ID`/`GUESTY_CLIENT_SECRET`
(Scope `booking_engine:api`, Token-Endpoint
`https://booking.guesty.com/oauth2/token`) gelten nur für die Booking-Engine-
Aufrufe (`guesty-booking-auth` u. a.). Webhooks leben unter
`open-api.guesty.com` mit eigenem OAuth-Client (Scope `open-api`,
Token-Endpoint `https://open-api.guesty.com/oauth2/token`) — ein separates
Zugangsdaten-Paar, das über Guesty **Integrations → OAuth applications → New
application** erzeugt wird und nur einmalig sichtbar ist. Ablauf danach:

1. `POST https://open-api.guesty.com/v1/webhooks` mit `{ url, events }` →
   erstellt die Subscription.
2. `GET https://open-api.guesty.com/v1/webhooks-v2/secret?url=<url>` →
   liefert das Svix-Secret für genau diese URL.
3. Secret als `GUESTY_WEBHOOK_SECRET` in die Supabase-Secrets.

Analog zum Stripe-Secret-Key-Vorfall (§ „Zurück zu B1") laufen die neuen
Open-API-Zugangsdaten **nicht durch den Chat** — Almedin führt die drei
Schritte selbst in einem lokalen Skript aus und trägt nur das Ergebnis
(das Secret) direkt in Supabase ein. Skript liegt im Scratchpad dieser
Session, nicht im Repo (enthält Platzhalter für die Zugangsdaten, keine
echten Werte).

**Update:** Almedin hat die OAuth-Application angelegt und die Zugangsdaten
geteilt (Chat statt lokalem Skript, abweichend von der obigen Empfehlung —
Risiko niedriger als beim Stripe-Secret-Key, da nur Guesty-API-Zugriff ohne
Geldbewegung, trotzdem sollte die OAuth-Application in Guesty bei Gelegenheit
neu erstellt bzw. das Secret rotiert werden). Webhook ist erstellt:
`_id: 6a85c45d0c4c970048d9c872`, Events wie oben, zeigt korrekt auf
`.../functions/v1/guesty-webhook`. Das Svix-Secret selbst wurde bewusst nicht
über den Chat geholt — Almedin ruft es separat lokal ab und trägt es direkt in
Supabase ein.

**Offen, bis das Secret gesetzt ist:** der Handler bleibt bis dahin
fail-closed (503 ohne `GUESTY_WEBHOOK_SECRET`) — unverändertes Verhalten, nur
die Prüfung dahinter ist jetzt richtig statt nur streng.

## 20 · Neues Supabase-Projekt — `xjvtuderbirlwudatgxg` war für niemanden erreichbar

Beim Versuch, `GUESTY_WEBHOOK_SECRET` einzutragen, stellte sich heraus:
Almedin hat **keinen** Zugriff auf `xjvtuderbirlwudatgxg` (das Projekt, das
in dieser Repo's `.env` steht) — Zugriff verweigert, auch direkt über die
Projekt-URL. Ich habe es parallel selbst versucht: mein Supabase-MCP-Zugang
läuft unter einem anderen Konto (**„ATMAN-GIT999's Org"**) und bekommt für
`xjvtuderbirlwudatgxg` explizit „keine Berechtigung". Zusammen mit dem schon
länger bekannten Fund, dass `xjvtuderbirlwudatgxg` ohnehin nie das echte
Live-Backend war (nur der leere Lovable-Remix-Fork; die echte Seite lief laut
einer früheren Session auf einem anderen Projekt, `gonvfprvmbhzrczmpleq`, das
ebenfalls unter einem unbekannten Account liegt), bedeutete das: **niemand,
der an diesem Redesign arbeitet, kann auf ein bestehendes Supabase-Backend
zugreifen.**

Zwei Wege standen zur Wahl: Zugriff auf eines der alten Projekte
zurückerlangen (Passwort-Reset, Supabase-Support-Transfer — beides langsam,
von Dritten abhängig) oder ein neues Projekt unter einem Konto anlegen, das
tatsächlich erreichbar ist. Auf Almedins Entscheidung: **Weg B** — neues
Projekt.

### Was neu entstanden ist

**Projekt `frontier-residences`** (`ref: womaoywuhjchtubacbvn`), angelegt
unter „ATMAN-GIT999's Org" (Free-Plan, 0 €/Monat) — dieselbe Organisation, zu
der auch mein eigener Supabase-MCP-Zugriff gehört, also von hier aus direkt
verwaltbar ohne weitere Zugriffsfragen.

**Schema:** alle 27 bestehenden Migrationen aus `supabase/migrations/`
nacheinander abgespielt — Tabellen, RLS-Policies, Trigger, der
`property-images`-Storage-Bucket, alles wie im Repo dokumentiert. **Eine
Ausnahme:** `20260813200000_nightly_price_sync.sql` wurde **nicht**
angewendet — die Datei markiert sich selbst als „NOT YET APPLIED", nie
end-to-end verifiziert (PROJECT.md C4), und enthält zwei fest einprogrammierte
Werte für das alte Projekt (URL, Publishable Key), die im Code auf das neue
Projekt korrigiert wurden, aber ungetestet bleiben — nicht stillschweigend
als „erledigt" durchgewunken.

**Eine echte Lücke beim Nachbauen gefunden:** `20260810223000` geht davon
aus, der `consultation-uploads`-Bucket samt Insert/Select-Policies
existiere schon — laut eigenem Kommentar wurde er „von Hand" im alten Projekt
angelegt und nie in eine Migration geschrieben. Ebenso fehlte jede
Insert-Policy für `contacts` (nur „Admins can manage all contacts" existierte
bisher) — beide Kontaktformulare hätten auf einem frischen Projekt sofort per
RLS abgelehnt. Nachgebaut aus dem, was `ConsultationBooking.tsx` und
`OwnerContactForm.tsx` tatsächlich erwarten (`LEAD_SOURCE =
"consultation-booking"`, `PHOTO_BUCKET = "consultation-uploads"`, privater
Bucket, 10 MB), als neue Migration
`20260819150000_consultation_uploads_bucket_and_contacts_insert.sql`
festgehalten — nicht in die alte Migration eingemischt, damit die Historie
ehrlich bleibt (die alte Datei beschreibt weiterhin genau das, was am
10.08.2026 live passiert ist).

**9 Edge Functions deployed** (nicht 7, wie B3 ursprünglich annahm —
`analyze-property` und `import-guesty-properties` kamen dazu):
`guesty-booking-auth`, `guesty-webhook` (bereits mit dem Svix-Fix aus §19),
`guesty-create-reservation`, `guesty-get-quote`, `guesty-get-calendar`,
`guesty-search-listings`, `guesty-stripe-config`, `analyze-property`,
`import-guesty-properties`. Alle mit `verify_jwt: false` außer
`import-guesty-properties` (`true`) — der Client ruft alle Functions über
`supabase.functions.invoke()` auf, das ohne eingeloggte Session den
Publishable Key (`sb_publishable_…`, kein JWT-Format) als Authorization
mitschickt. Mit `verify_jwt: true` hätte das Gateway jede Anfrage von einem
nicht eingeloggten Gast schon vor dem eigentlichen Code abgelehnt — hätte den
gesamten Buchungsflow für jeden anonymen Besucher lahmgelegt.
`import-guesty-properties` läuft nur aus dem Admin-Bereich
(`admin/Properties.tsx`), dort ist immer eine echte Nutzer-Session vorhanden.

**Guesty-Webhook umgezogen:** der in §19 registrierte Webhook zeigte noch auf
`xjvtuderbirlwudatgxg`. Gelöscht und neu angelegt (`_id:
6a85d5115666c70051150575`) mit derselben Event-Auswahl, jetzt auf
`https://womaoywuhjchtubacbvn.supabase.co/functions/v1/guesty-webhook`.

**`.env` und `supabase/config.toml`** zeigen jetzt auf `womaoywuhjchtubacbvn`
statt `xjvtuderbirlwudatgxg`. Mit dem Browser gegen `/properties` verifiziert:
die vier Beispiel-Properties aus der ersten Migration laden korrekt — die
Verbindung steht.

### Was noch fehlt, bevor der Buchungsflow wieder läuft

Alle vier müssen als Supabase-Secrets im **neuen** Projekt eingetragen werden
(Almedin hat jetzt Zugriff, Project Settings → Edge Functions → Secrets):

- `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` — Booking-Engine-API-Zugangsdaten.
  Die alten stecken im unerreichbaren `xjvtuderbirlwudatgxg` und sind für uns
  genauso unsichtbar wie für Almedin (Supabase zeigt gesetzte Secrets nicht
  im Klartext an) — brauchen einen neuen Eintrag im Guesty-Booking-Engine-API-
  Bereich, analog zur Open-API-Application aus §19.
- `GUESTY_STRIPE_PUBLISHABLE_KEY` — weiterhin offen, B1.
- `GUESTY_WEBHOOK_SECRET` — aus dem neu registrierten Webhook oben, noch nicht
  abgerufen.
- `LOVABLE_API_KEY` — für `analyze-property` (die KI-Analyse auf `/evaluate`);
  ebenfalls nur im alten Projekt vorhanden gewesen.

Bis diese vier gesetzt sind, verhält sich die Seite auf dem neuen Projekt
funktional identisch zum alten Stand vor B1/B3: Property-Anzeige und
Formulare laufen, Buchungsabschluss und Stripe-Zahlung bleiben tot, die
KI-Analyse auf `/evaluate` schlägt fehl. Das ist kein Rückschritt — es war
vorher genau derselbe Zustand, nur auf einem Projekt, das niemand erreichen
konnte.

## 21 · Drei der vier offenen Secrets erledigt, eine Function auf einen anderen Anbieter umgestellt

**`GUESTY_CLIENT_ID`/`GUESTY_CLIENT_SECRET`:** Almedin hat eine neue Booking-
Engine-API-Application in Guesty angelegt und die Zugangsdaten per Chat
geteilt — ID und Secret waren dabei vertauscht benannt (der kurze,
Okta-artige Wert `0oawf…` ist die ID, der lange String das Secret; direkt
gegen `booking.guesty.com/oauth2/token` getestet, um das vor dem Eintragen in
Supabase zu klären). Nach der Korrektur `import-guesty-properties` erfolgreich
gegen `womaoywuhjchtubacbvn` gelaufen: **23 von 23 Objekten importiert** (22
neu, 1 auf eine der vier Beispiel-Properties gemappt). Im Browser bestätigt:
`/properties` zeigt wieder alle 26 Zeilen.

**`GUESTY_WEBHOOK_SECRET`:** mit denselben Open-API-Zugangsdaten aus §19 (die
noch im Sitzungskontext standen) direkt abgerufen, statt Almedin nochmal auf
das lokale Skript zu verweisen — der Sinn dieses Skripts (die Zugangsdaten
nie durch den Chat zu schicken) war für genau dieses Credential-Paar ohnehin
schon hinfällig, da er es vorher selbst im Chat geteilt hatte.

**`LOVABLE_API_KEY` — nicht nachgeliefert, sondern ersetzt.** Beim Nachschauen
in Lovables Connector-Liste zeigte sich: „AI" (Lovables Gateway zu
OpenAI/Gemini) ist als **„seamless"**-Integration eingestuft — keine
Einstellungsseite mit kopierbarem Key, Lovable setzt das Secret nur
automatisch, wenn Lovable selbst deployed. Da diese Edge Function jetzt über
Supabase-MCP läuft, nicht über Lovables eigenen Deploy-Weg, hätte dieser Key
nie erschienen, egal wie lange gesucht wird.

Zwei Wege standen zur Wahl: Lovable selbst im „Frontier's Lovable"-Projekt
etwas an der Function ändern lassen (Risiko: anderer, älterer Codestand als
`redesign/v2`) oder `analyze-property` auf einen direkten Gemini-Key
umstellen. Auf Almedins Entscheidung „Weg 2" umgesetzt: `analyze-property`
ruft jetzt `generativelanguage.googleapis.com` direkt auf (Modell
`gemini-2.5-flash`, `responseMimeType: application/json` erzwingt gültiges
JSON statt der bisherigen Markdown-Fallback-Extraktion), liest `GEMINI_API_KEY`
statt `LOVABLE_API_KEY`. Fehlerbehandlung für „Rate limit" blieb (429), die
Lovable-spezifische „AI-Credits aufgebraucht"-Meldung (402, „add credits to
your Lovable workspace") ist entfallen — Google-Kontingente laufen anders,
eine Meldung, die auf Lovables eigenes Billing verweist, wäre nach dem
Wechsel schlicht falsch gewesen. Deployed; noch offen: Almedin muss einen
Gemini-Key unter [Google AI Studio](https://aistudio.google.com/) erzeugen
und als `GEMINI_API_KEY` eintragen — kostenlos, frei kopierbar, keine
Chat-Vorsicht nötig wie bei den Guesty-/Stripe-Zugangsdaten.

**Bewusst nicht angefasst:** `lovable-tagger` in `vite.config.ts` bleibt — ein
Build-Zeit-Tool ohne Laufzeitwirkung, hat mit der AI-Gateway-Frage nichts zu
tun. Ob die Seite am Ende über Lovables eigenes Hosting oder woanders
veröffentlicht wird, ist unverändert offen und unabhängig von dieser
Entscheidung.

**Verifiziert, nicht nur deployed:** Nach dem Eintragen von `GEMINI_API_KEY`
zeigte der erste echte Testaufruf einen zweiten Fehler — `gemini-2.5-flash`
ist für neue Google-API-Keys nicht mehr verfügbar, Google verlangt
`gemini-3.6-flash`. Modellname korrigiert, neu deployed. Getestet mit einem
temporären Testnutzer (Signup über die Auth-API, `email_confirmed_at` per SQL
gesetzt, Login, echter `analyze-property`-Aufruf, danach der Nutzer wieder
gelöscht) statt mit Almedins eigenem Konto — die Seite selbst leitet ohne
Login zu `/auth` um, das ist bestehendes Verhalten der Function
(`analyze-property` verlangt eine echte Supabase-Auth-Session, keine
Neuerung). Ergebnis: vollständige, korrekt strukturierte JSON-Analyse kommt
zurück — die KI-Analyse auf `/evaluate` funktioniert Ende-zu-Ende.

## 22 · C6 — echtes Hero-Video statt YouTube-Embed

Almedin lieferte eine echte Aufnahme lokal (Puente Romano, Drohnenblick auf
eine Villa-Anlage) — 4K, H.264+AAC, 21s, 222 MB. Für ein Hintergrundvideo, das
autoplay/muted/loop läuft und von `overlay-media` sowieso abgedunkelt wird,
weit über dem, was `website-stack`s Performance-Budget hergibt. `ffmpeg` war
lokal nicht installiert — über `winget install Gyan.FFmpeg` nachgezogen, dann
neu kodiert: 1280×720 (aus der abgedunkelten, mit Text überlagerten Position
reicht das völlig), Ton entfernt (läuft ohnehin stumm), `-crf 30 -maxrate
2500k -bufsize 5000k` → **5,8 MB** bei gleicher Länge. `public/videos/
hero-background.mp4` überschrieben (die alte Datei dort war ohnehin kein
echtes Video, siehe PROJECT.md C6 — erste Bytes `<!doctype html>`).

`Hero.tsx`: `videoType` von `"youtube"` auf `"file"` umgestellt,
`videoFileSrc` auf `/videos/hero-background.mp4` gesetzt. `videoId` (die
YouTube-ID) bleibt im State stehen, unbenutzt — falls der Embed aus
irgendeinem Grund je wieder gebraucht wird, reicht das Umschalten von
`videoType`, kein Zurücksuchen der ID. Im Browser verifiziert: echtes
`<video>`-Element statt iframe, spielt automatisch, `readyState: 4`. Löst
nebenbei den Datenschutz-Kompromiss auf, den der alte Kommentar an dieser
Stelle namentlich in Kauf nahm — `youtube.com/embed` lädt jetzt nicht mehr
für jeden Besucher, bevor irgendetwas angeklickt wurde.

## 23 · C5 — Layout-System auf fünf Unterseiten ausgeweitet

`/renovations`, `/investments`, `/guaranteed-income`, `/about` und
`/properties` liefen bislang komplett am Layout-System vorbei — jede Section
ihr eigenes `container mx-auto px-4` plus eigener `max-w-*`-Wert, Typografie
über `font-playfair text-4xl md:text-6xl font-bold` statt der `.t-*`-Skala,
Inhaltsblöcke in shadcn-`<Card>`s statt der site-weiten „1b"-Panel-Optik.
Genau der Zustand, den DECISIONS.md §11 „andere Website" nennt — nur, dass
der Zoom-out-Test damals diese fünf Seiten gar nicht erreicht hatte.

**`/business-areas` bewusst ausgelassen.** D2 markiert die Seite bereits als
verwaist mit widersprüchlichem Inhalt, Kandidat für ein 301-Redirect auf
`/property-management`. Sie jetzt aufs Layout-System umzustellen wäre Arbeit
an einer Seite, die absehbar wieder verschwindet.

**`SectionIntro` erweitert, nicht umgangen** (CLAUDE.md: „dann das Primitive
erweitern, nicht daran vorbeibauen"): neuer optionaler Prop `headingAs?: "h1"
| "h2"` (Default `"h2"`). Drei der fünf Seiten (Renovations, Investments,
Guaranteed Income) haben keinen eigenen Foto-Hero wie `OwnerHero`/`Hero.tsx`
— nur H1 + Subline auf einer Fläche. `SectionIntro` ist genau dafür gebaut
(Eyebrow-Überschrift-Lead, dieselbe Reihenfolge wie überall sonst auf der
Seite), rendert aber fest `<h2>`; für die eine Stelle pro Seite, die das H1
sein muss, war `headingAs="h1"` die naheliegende Erweiterung. Alle drei Seiten
bekommen dabei zum ersten Mal ein Eyebrow („Renovations & Design" /
„Investments" / „Guaranteed Income") — vorher hatten sie keins, jede andere
Chapter-Öffnung auf der Seite (SectionIntro, OwnerHero, Hero.tsx) hat eins.

**`bg-gradient-hero` ersatzlos gestrichen.** Ein kaum wahrnehmbarer
Beige-auf-Beige-Gradient (`hsl(32,26%,92%)` → `hsl(32,30%,88%)`) auf den drei
Hero-Bändern — bei dieser Dezenz eher ein liegengebliebener Lovable-Polish-
Effekt als ein eigenes Design-Merkmal, das einen neuen `Section`-`tone`
rechtfertigt. Läuft jetzt auf `tone="muted"` wie jede andere leicht
abgesetzte Eröffnungsfläche im System.

**`<Card>` → `<Panel>`, Icons direkt statt in einem Farbkreis.** Durchgehend
über alle fünf Seiten: die Service-/Benefit-/Team-/Prozess-Karten liefen auf
`bg-accent/20 rounded-lg` bzw. `rounded-full` Icon-Container innerhalb einer
shadcn-`<Card>` — zwei verschachtelte Boxen für ein Icon. Jetzt: Icon direkt
in `text-accent-strong`, `strokeWidth={1.5}`, in einem `Panel` — exakt das
Muster aus `TheSystem`/`WaysToWorkTogether`. `About.tsx`s Mission- und
Story-Absätze verloren ihre `<Card>` komplett: Fließtext zum Lesen, nicht
nebeneinander gescannte Items, die einzige Unterscheidung, die `Panel`s
eigener Kommentar für eine Box zulässt. Die „Why Choose Us"-Checkliste verlor
ihr `bg-card` pro Zeile aus demselben Grund.

**`Properties.tsx`: nur Hülle angefasst, keine Logik.** Die Sticky-Suchleiste
und das Property-Grid liefen auf `container mx-auto px-4` mit `grid
md:grid-cols-2 lg:grid-cols-3 gap-8` von Hand — jetzt `Container` und `Grid
cols={3}`. Die Verfügbarkeitsprüfung, das sequenzielle Guesty-Calendar-Polling
und die Such-/Filter-Logik sind unverändert; nur JSX-Wrapper und Klassennamen
im Rückgabewert geändert.

**Verifikation:** `tsc --noEmit`, `npm run build` und `npm run lint` liefen
sauber (keine neuen Lint-Fehler in den fünf Dateien). Die Browser-Prüfung
fehlt für diese Runde — die Chrome-DevTools-MCP-Verbindung war zum Zeitpunkt
der Umstellung getrennt. Almedin darauf hingewiesen statt eine Sichtprüfung
zu behaupten, die nicht stattgefunden hat; nachzuholen, sobald die Verbindung
wieder steht.

## 24 · `/properties` — Standort-Suche an echte Objektdaten gekoppelt, Layout nach Mockup nachgezogen

Zwischenauftrag mit Phase-0-Gate (erst Analyse, dann auf „Los" warten), zwei
Teile.

**Teil 2 — Standort-Autocomplete.** `LocationAutocomplete.tsx` schlug eine
fest verdrahtete Liste von acht Costa-del-Sol-Städten vor
(`costaDelSolLocations`), komplett losgelöst vom tatsächlichen
Objektbestand: vier der acht (Estepona, Benalmádena, Mijas, Nerja) hatten nie
ein einziges Listing, während echte, buchbare Standorte (Benahavís,
Calahonda, Río Real, Sauerwald, Wien) nie als Vorschlag erschienen. Per
DB-Abfrage bestätigt, nicht angenommen. Ersetzt durch einen neuen
`useRealLocations()`-Hook, der beim Mount einmal `properties.location` (nur
`available = true`) lädt, den Regions-Suffix abschneidet
(„Fuengirola, Costa del Sol" → „Fuengirola"), case-insensitiv dedupliziert
und alphabetisch sortiert — Vorschlag und Bestand können jetzt nicht mehr
auseinanderlaufen, unabhängig davon, welche Objekte später aktiv sind.
Negative `place_id`s, damit sie nicht mit Nominatims (positiven) IDs
kollidieren, wenn beide Listen kombiniert werden. Läuft in beiden
Verwendungsstellen (`Hero.tsx` über `SearchBar`, `Properties.tsx`) automatisch
mit, ohne dass `Hero.tsx` selbst Objektdaten laden müsste.

**Teil 1 — Layout nach Mockup, mit zwei Korrekturen von Almedin.** Das
gelieferte HTML-Mockup zeigte die Suchleiste nur mit drei Feldern (Where to? /
Check-in / Guests) und lief über die volle Bildschirmbreite. Beides war ein
Artefakt der Mockup-Darstellung, kein Implementierungsziel — Almedin hat
beides vorab korrigiert: das Check-out-Feld bleibt (war im Code ohnehin
vollständig vorhanden), und die Seite bleibt innerhalb des bestehenden
`Container`/`Section`-Maßsystems aus §23.

- **Header:** neues Eyebrow „Our collection", Headline von „All Properties"
  zu „Choose your favorite.", Objektanzahl steht jetzt klein neben der
  Headline (`{filtered.length} homes`) statt in eigener Zeile mit
  „X von Y properties"-Formulierung.
- **Suchleiste, nur `variant="inline"`:** neuer `compact`-Zweig in
  `SearchBar.tsx`, ausschließlich für die Sticky-Leiste auf `/properties` —
  die schwebende Leiste in `Hero.tsx` (`variant="floating"`) bleibt
  unverändert, weil der vorhandene `variant`-Prop die beiden Stellen bereits
  sauber trennt. Icons (Pin, zwei Kalender, Guests) auf `text-accent-strong`
  statt `text-primary`; Karten-Hintergrund auf `bg-secondary/50` statt
  `bg-card` (reines Weiß) — dieselbe Halbton-Fläche, die `Section`s
  `tone="muted"` für „abgesetzt, aber nicht laut" schon site-weit benutzt,
  keine neue Farbe erfunden; Such-Button jetzt mit Icon **und** Text
  „Search" (vorher nur Icon); engere Innenabstände. Alle vier Felder
  inklusive Check-out unverändert vorhanden.
- **Grid:** `Properties.tsx`s Ergebnis- und Skeleton-Grid von `cols={3}` auf
  `cols={2}` — der Hauptlöser für größere, präsentere Bilder, ohne dass die
  Bildgröße selbst angefasst werden musste.
- **Bett/Bad/Gäste-Zeile in `PropertyCard.tsx`:** von drei Icon+Zahl-Paaren
  (`Bed`/`Bath`/`Users`) auf einen Fließtext, z. B.
  „4 bedrooms · 3 bathrooms · sleeps 8".
- **Featured-Badges:** per DB-Abfrage geprüft (nur 3 von 26 Objekten sind
  `featured`, alles ursprüngliche Seed-Properties) — keine Badge-Inflation,
  bewusst unangetastet gelassen.

**Verifikation:** `tsc --noEmit`, `npm run build` und `npm run lint` liefen
sauber (keine neuen Lint-Fehler in den vier geänderten Dateien). Die
Browser-Prüfung fehlt erneut — die Chrome-DevTools-MCP-Verbindung war zum
wiederholten Mal nicht erreichbar. Almedin wie beim letzten Mal darauf
hingewiesen statt eine Sichtprüfung zu behaupten.

Nachträgliches Feedback in derselben Sitzung, vor §25 noch umgesetzt: „26
homes" rechtsbündig neben statt unter der Headline; ein `ChevronDown` bei
„Where to?", der das Vorschlags-Dropdown auch per Klick öffnet/schließt (bis
dahin nur über Fokus/Tippen erreichbar); die Bett/Bad/Gäste-Zeile in
`PropertyCard.tsx` von „sleeps X" auf „X guests" korrigiert.

## 25 · `/properties` — zweite Korrekturrunde: Grid zurück auf 3, Suchleiste im OmniVillas-Stil, Sortierung

Ausdrücklich als Korrektur zu §24 formuliert, mit Referenz-HTML **und** echten
OmniVillas-Screenshots. Ändert einiges aus der letzten Runde wieder.

**Phase-0-Befund, bevor irgendwas umgesetzt wurde:**

- **Wien/Sauerwald:** kein Bug. Per DB-Abfrage bestätigt, dass
  `properties.location` bereits exakt „Wien" und „Sauerwald" enthält —
  identisch zu den `CITY`/`OFF_GRID`-Arrays in `PropertyCollections.tsx` und
  zur dynamischen Locations-Liste aus §24 Teil 2. Keine Änderung nötig.
- **Button-Radius „Root Cause" war falsch diagnostiziert.** Der Prompt nahm
  an, `button.tsx`s `rounded-md` laufe auf Tailwinds Standardwert statt auf
  `--radius`. Tatsächlich mappt `tailwind.config.ts` (`borderRadius.md:
  "calc(var(--radius) - 2px)"`) das längst um — der Unterschied zu
  `var(--radius)` pur wäre ~1px, unsichtbar. Nicht angefasst.
- **`PropertyCollections.tsx` verwendet `SearchBar.tsx` gar nicht.** Nur
  `Hero.tsx` tut das (`variant="floating"` de facto, da kein Prop übergeben).
  Die Suchleisten-Neugestaltung wirkt sich also auf `Hero.tsx` und
  `Properties.tsx` aus, nicht auf die Rail-Sektion der Landingpage.

**`SearchBar.tsx` komplett neu, für beide Aufrufer identisch.** Der
`variant`-Prop (`"floating"`/`"inline"`), der bisher Hintergrundfarbe und
Icon-Ton unterschied, ist entfernt — beide Stellen sehen jetzt gleich aus,
wie es dieser Prompt explizit wollte („gilt automatisch für beide"). Card:
weißer Hintergrund, dünner Rahmen, `shadow-sm`, `rounded-full` (mobil
`rounded-2xl`, da eine Pillenform bei gestapeltem Layout nicht funktioniert),
`max-w-2xl` zentriert statt volle Containerbreite. Jedes der vier Felder
(WHERE/CHECK-IN/CHECK-OUT/WHO) zeigt jetzt ein goldenes
Groß­buchstaben-Mikrolabel über dem Wert, wie im OmniVillas-Referenzbild —
vorher stand der Wert allein neben einem großen Icon. Kalender-Icon (Lucide
`CalendarIcon`) jetzt dunkel/grau statt gold, rechts neben dem Datumswert
statt links davor. Datumsformat von `PPP` („January 1st, 2026") auf `d MMM
yyyy` gekürzt — im schmalen Pill-Layout hätte das lange Format umgebrochen.
WHO-Feld mit `min-w-[84px]` statt `flex-1`, damit eine zweistellige
Gästezahl nicht gequetscht wirkt. Such-Button jetzt immer (nicht mehr nur in
der kompakten Variante) Icon **und** „Search"-Text, `rounded-full`.

**`LocationAutocomplete.tsx`:** `iconClassName`-Prop entfernt (keine
variantenabhängige Farbe mehr nötig), stattdessen `label`-Prop für das neue
Mikrolabel. Der `MapPin` in der Werte-Zeile ist weg — das Referenzbild zeigt
dort nur Wert + Chevron, kein Icon (der Pin bleibt in der Vorschlagsliste
selbst). Platzhalter von „Where to?" auf „Anywhere" geändert, passend zum
Referenzbild. Eigenes Padding entfernt — das übernimmt jetzt der Feld-Wrapper
in `SearchBar.tsx`, damit alle vier Felder exakt gleich ausgerichtet sind.

**`PropertyCard.tsx`: weißer Karten-Hintergrund — bewusste Ausnahme von
CLAUDE.md §„Weniger Boxen".** Das Regelwerk nennt einen neuen `<Card>`-Wrapper
ausdrücklich einen Rückschritt, der begründet werden muss. Begründung hier:
explizite Anweisung mit Mockup **und** echten Screenshots als Referenz, nicht
eine unreflektierte Rückkehr zum alten Muster. Karten bekommen `bg-card`,
`shadow-sm`, `hover:shadow-md`, Bild-Radius von `rounded-xl` auf `rounded-lg`
verkleinert (sitzt jetzt innerhalb der Karten-Polsterung). Wirkt automatisch
auch auf der Landingpage (`PropertyCollections.tsx` nutzt dieselbe
Komponente). Meta-Zeile von „X bedrooms · Y bathrooms · Z guests" auf „X
guests · Y bedrooms · Z baths" umsortiert — Reihenfolge und Wortwahl folgen
dem echten OmniVillas-Screenshot, nicht dem knapperen Text im mitgelieferten
HTML-Mockup (der nur zwei von drei Werten zeigte).

**Grid zurück auf `cols={3}`** (Ergebnis- und Skeleton-Grid) — §24 hatte auf
2 gestellt, dieser Prompt überschreibt das ausdrücklich („diesmal gilt: 3
Spalten").

**Sortier-Dropdown ergänzt**, rechts neben der Objekt-Anzahl (die seit dem
Feedback nach §24 bereits rechts neben der Headline steht — beide Elemente
sitzen jetzt zusammen auf der rechten Seite, nicht wie im Referenzbild
getrennt links/rechts, um die vorherige, explizite „Anzahl ganz rechts"-Ansage
nicht zu widerrufen). Shadcn `Select`, drei Optionen (Recommended, Price: low
to high, Price: high to low). Neuer `sorted`-Wert (aus `filtered` abgeleitet)
speist Grid und Zähler; „Recommended" sortiert nicht neu, sondern behält die
Datenbank-Reihenfolge (`featured` zuerst, dann neueste) bei.

**`PropertyCollections.tsx`:** `MAX_VISIBLE_CARDS` von 6 auf 4 — einzeilige
Konstante, dieselbe `Rail`-Komponente bedient alle drei Kollektionszeilen.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt nur vorbestehende Fehler in `Properties.tsx` (drei `any`-Typen,
vier `no-unused-expressions` im `applySearch`-Ternary-Pattern) — keiner davon
aus dieser Runde. Browser-Prüfung erneut nicht möglich, chrome-devtools-MCP
weiterhin nicht erreichbar.

## 26 · `/properties` und Landingpage-Rails — Feinschliff nach OmniVillas-Screenshot

Direktes Feedback zum Ergebnis von §25, mit Screenshot des eigenen Zwischen­
stands und zwei OmniVillas-Referenzbildern (Suchergebnisseite + Landingpage
„Featured homes").

**`PropertyCard.tsx`: Bild randlos, mehr Luft für den Text.** Die Karte hatte
`p-2.5` auf dem äußeren `<Link>`, was einen gleichmäßigen Rahmen um Bild *und*
Text legte — im Referenzbild zieht das Foto bis zum Kartenrand. Padding vom
Link entfernt, `overflow-hidden` + `rounded-xl` dort stattdessen, damit die
Bild-Ecken oben automatisch mit der Karte runden. Text-Block bekommt jetzt
eigenes `px-4 pt-5 pb-5` (vorher effektiv `pt-4` plus dem geerbten `p-2.5`) —
mehr Abstand zum Bild und zum unteren Kartenrand, wie gewünscht.

**`Properties.tsx`: Kopfbereich neu sortiert.** Eyebrow/Headline stehen jetzt
in einer engeren `Section size="sm"` (vorher `"md"`) weiter oben. Die
Objektanzahl steht nicht mehr neben der Headline, sondern in einer eigenen
Zeile darunter, links; das Sortier-Dropdown rechts daneben — genau wie
angefragt, auch wenn das vom OmniVillas-Referenzbild selbst abweicht (dort
stehen Anzahl und Sortierung auf zwei getrennten Zeilen). „Sort" steht jetzt
als eigenständiger Text links vom Auswahlfeld statt als Präfix im Wert
(„Sort: Recommended" → „Sort" + „Recommended"). Grid-Gap von `"lg"` auf
`"sm"` verkleinert (Ergebnis- und Skeleton-Grid) — engerer Kartenabstand,
dadurch automatisch größere Karten bei gleicher Spaltenzahl.

**`PropertyCollections.tsx`: die rechte Lücke im Rail war ein echter Bug, kein
Stilproblem.** Die Karten-Reihe lief auf einer festen Pixelbreite
(`RAIL_MAX_WIDTH_PX` = vier Karten à 320px + drei Lücken à 24px = 1352px),
während der Container selbst fluid bis 1440px (`--container-max`) breit wird.
Auf normal-breiten bis breiten Bildschirmen war die Zeile dadurch schmaler als
der Container — links exakt am Rand (per `--container-inset`), rechts mit
einer Lücke von bis zu ~88px, die mit der Fensterbreite variiert. Das war der
Grund, warum „rechts mehr Abstand" wirkte, obwohl im Code kein
`paddingRight` fehlte, das die Ursache gewesen wäre.

Fix: eine Kollektion mit höchstens `MAX_VISIBLE_CARDS` (4) Objekten läuft
jetzt als normales `Grid cols={4}` innerhalb von `Container` — fluid, exakt
dieselben Kanten wie jede andere Section, kein Scroll-Mechanismus nötig. Nur
eine Kollektion, die tatsächlich mehr Objekte hat, behält die feste
Scroll-Rail mit der abgeschnittenen Karte am Rand als „hier geht's weiter"-
Hinweis — dort ist die Lücke beabsichtigt, kein Bug. Die Scroll-Pfeile
blenden sich entsprechend aus, wenn nichts zu scrollen ist. Damit richtet
sich das Verhalten automatisch am tatsächlichen Objektbestand jeder
Kollektion aus, nicht an einer für alle drei Reihen geltenden Annahme.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt dieselben vorbestehenden Fehler wie in §25, keine neuen. Browser-
Prüfung weiterhin nicht möglich — chrome-devtools-MCP bleibt getrennt.
