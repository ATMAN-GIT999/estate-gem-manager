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

## 27 · Header-Neuaufbau (Landing + PM), Standort-Dropdown-Bug, Lightbox, Studio-Anzeige, Mobile-Rail

Phase-0-gated (Analyse zuerst), mit zwei ausdrücklich zurückzumeldenden
Punkten statt sie zu erraten: der vermutlich fabrizierten Property (§ unten)
und der Währungsliste (offen, siehe Almedin-Nachricht).

**Punkt 0 — Fabrizierte Properties: es sind drei, nicht eine.** Per
DB-Abfrage bestätigt: „Peninsula Corner Villa Higueron", „Los Flamingos Golf
Resort" **und** „Puente Romano Hideaway" haben alle denselben
`created_at`-Zeitstempel (die ursprüngliche Seed-Migration), alle
`guesty_listing_id = null`, alle `featured = true` — keine einzige ist an
Guesty angebunden. Das sind exakt die drei Properties, die seit §24 als
„keine Badge-Inflation, nur 3/26 featured" bekannt waren; erst jetzt wird
klar, dass diese drei selbst das Problem sind, nicht eine Ausnahme davon.
Der Slug `villa-in-higueron`, auf den `villa-higueron.webp` in
`propertyImages` gemappt war, gehörte zu **keiner** existierenden Property —
die Bildzuordnung war bereits tot, bevor irgendetwas gelöscht wurde. Vor dem
Löschen per SQL geprüft, ob `bookings`, `conversations`, `campaign_events`
oder `tasks` auf eine der drei IDs verweisen (0 Treffer in allen vieren) —
Almedin hat sich für „Löschen" entschieden, alle drei Zeilen sind entfernt
(23 statt 26 Properties, Sitemap bestätigt das). Die jetzt toten Einträge in
`propertyImages` (`PropertyCard.tsx`, `PropertyDetail.tsx`) sowie die vier
dadurch ungenutzten Bild-Imports (`property2`, `property4`, `property5`,
`villaHigueron`) sind mit entfernt — die Bilddateien selbst bleiben, `grep`
zeigt sie noch in `OwnerHero.tsx`/`MediaFrame.tsx` in Verwendung.

**Punkt 7 — der Standort-Dropdown-Bug war ein Portal-Problem, kein
z-index-Problem**, wie im Prompt selbst vermutet. `LocationAutocomplete.tsx`
rendert seine Vorschlagsliste als einfaches `<div className="absolute">`,
nicht portalt — anders als Check-in/Check-out/Guests in `SearchBar.tsx`, die
alle drei ein Radix-`Popover` verwenden (portalt nach `document.body`).
`Hero.tsx`s äußere `<section>` trägt `overflow-hidden` (nötig, um das
Hintergrundvideo zu croppen); das schneidet jeden nicht portalten
Nachfahren ab, der über den Rand der ~62vh-Hero-Sektion hinausragt —
unabhängig vom z-index. Fix: `LocationAutocomplete` läuft jetzt auch auf
einem Radix-`Popover` (`PopoverAnchor` statt `PopoverTrigger`, da der
„Trigger" hier ein Texteingabefeld mit eigener Fokus-/Tipp-Logik ist, kein
Klick-Button) — `PopoverAnchor` neu in `ui/popover.tsx` exportiert, dieselbe
Portal-Mechanik wie bei den anderen drei Feldern. Der manuelle
`mousedown`-Listener für „Klick außerhalb schließt" ist damit überflüssig
geworden (Radix regelt das über `onOpenChange`) und wurde entfernt.

**Header — zwei neue `Navigation`-Varianten, alte bleibt unverändert.** Der
bisherige dropdown-lastige Header (Property-Management-Untermenü, Stay-
With-Us-Untermenü, gefüllter Sign-In-Button) läuft unverändert auf jeder
Seite außer den zwei angefragten weiter (`variant="default"`, der
Default-Wert). Neu: `variant="landing"` (`Index.tsx`) und
`variant="propertyManagement"` (`PropertyManagementPage.tsx`), beide flach
(keine Untermenüs) nach dem OmniVillas-Muster. Die PM-Variante zentriert den
Sprach-Switcher zwischen Logo und Link-Cluster über zwei `flex-1`-Wrapper
mit Zero-Basis (Standardtrick: beide Seiten wachsen exakt gleich, unabhängig
davon, wie breit Logo bzw. Link-Cluster tatsächlich sind — nur so bleibt die
Mitte wirklich mittig). „Property Management" auf der PM-Seite scrollt smooth
zu `#the-system` (existierte schon als ID); „Apply" verlinkt auf
`#get-in-touch` (`OwnerContactForm.tsx`, ebenfalls schon vorhandene ID).
„Book a Stay" existiert bewusst zweimal mit unterschiedlichem Ziel: als
schlichter Link auf der PM-Seite → `/` (zurück zur Gästeseite), als
goldener Button auf der Landing-Seite → `/properties` (weiter zu den
Listings) — beide Richtungen ergeben im jeweiligen Kontext Sinn.

**Neue Komponente `LanguageCurrencySwitcher.tsx`** — transparente Pille
(Rahmen statt Füllung, auf Almedins Wunsch, obwohl die Site-CTAs sonst
gefüllt-gold sind), zeigt geschlossen nur die aktive Auswahl (`EN` bzw.
`EN · EUR`), nie die volle Optionsliste. Sprachen nur DE/EN/ES (nicht die
fünf aus dem OmniVillas-Bild). **Reine Auswahl-UI** — es gibt in diesem
Codebase weder ein i18n-System noch eine Währungsumrechnung für
`price_per_night`; die Komponente hält die Auswahl nur in lokalem State,
übersetzt keine Seiteninhalte und rechnet keine Preise um. Beides wäre ein
separates, deutlich größeres Vorhaben. Währungsliste EUR/USD/GBP war der im
Prompt selbst vorgeschlagene Default, von Almedin bestätigt.

**`PropertyDetail.tsx`: echte Solo-Lightbox ergänzt.** Bisher öffnete jeder
Bild-Klick nur den vorhandenen Grid-Dialog (alle Fotos auf einmal) — nie ein
einzelnes Bild groß, trotz der Behauptung im vorherigen Prompt-Teil, es gäbe
gar keine Lightbox (es gab schon einen Dialog, nur keinen Solo-Viewer).
Klick auf das Hauptbild oder eines der vier Nebenbilder öffnet jetzt direkt
den neuen Solo-Dialog (`object-contain`, nicht `object-cover` — kein
Beschnitt) mit Vor/Zurück-Pfeilen und Zähler; „Show all X photos" öffnet
weiterhin den Grid-Überblick, von dem aus ein Klick in den Solo-Viewer
wechselt.

**Studio-Anzeige.** Nur eine Property hat `bedrooms = 0`
(„Sol, Arena y Mar First Line Beach Studio", `type: "Studio"`) — echte
Dateneingabe, keine Lücke. `PropertyCard.tsx` und `PropertyDetail.tsx` zeigen
jetzt „Studio" statt „0 bedrooms"/„0 Bedrooms".

**Mobile-Rail-Nachbesserung in `PropertyCollections.tsx`.** Karten liefen auf
festem `w-80` (320px) unabhängig von der Viewportbreite — auf einem
~360px-Phone blieb kaum ein Anriss der nächsten Karte sichtbar. Jetzt
`w-[85vw] max-w-80`: konsistenter Anriss bei jeder Handybreite, gedeckelt auf
dieselben 320px, die die Desktop-Breitenrechnung schon annimmt.
`snap-mandatory` → `snap-proximity` — auf iOS Safari fühlt sich „mandatory"
beim Swipen oft ruckartig/erzwungen an, „proximity" rastet nur ein, wenn man
ohnehin nah dran landet.

**Gold-Konsistenz (Punkt 8) bereits erfüllt, bis auf eine bekannt
ausgelassene Seite.** Einzige Fundstelle für das falsche, zu kontrastarme
`text-accent` (statt `text-accent-strong`) ist `BusinessAreas.tsx` — laut §11
bereits als verwaist markiert und Kandidat für ein 301-Redirect, deshalb
bewusst nicht angefasst (dieselbe Begründung wie in §23 für
`/business-areas`).

**Logo/About-Us/Sign-In wirkten „ausgeschattet" — zwei getrennte, echte
Ursachen, keine erfunden.** (1) Der Logo-Wortmark ist keine reine Farbe,
sondern ein Cremeton (~#ECE3D2) fest ins Bild gebacken — direkt neben
reinweißem (`text-primary-foreground`) Nav-Text wirkt er dadurch
unvermeidlich etwas gedämpfter; das lässt sich nicht per CSS beheben, ohne
an einem Markenwert-Asset zu drehen (CLAUDE.md: „Nicht anfassen ohne
Rückfrage"), also unangetastet gelassen — bei Bedarf müsste eine reinweiße
Logo-Variante vom Designer kommen. (2) „About Us"/„Sign In" hatten im Code
dieselbe `text-primary-foreground`-Klasse wie „Property Management"/„Stay
With Us" — der Dimm-Eindruck kam vom fehlenden Chevron/Dropdown-Gewicht der
anderen beiden, nicht von der Farbe. Da die neuen `landing`/
`propertyManagement`-Varianten alle Chevrons entfernen, verschwindet dieser
Effekt als Nebenwirkung des Umbaus.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt nur zwei vorbestehende `any`-Fehler in `PropertyDetail.tsx`
(unverändert von mir angefasste Zeilen), keine neuen. Browser-Prüfung
weiterhin nicht möglich, chrome-devtools-MCP bleibt getrennt.

## 28 · Header-Feinschliff: transparente Hero-Variante ersatzlos gestrichen, ein Header für die ganze Seite, abgerundete CTAs, Preis-Sortierung

Direktes Feedback zu §27, in einem Punkt eine echte Korrektur, nicht nur
Politur.

**„Der Text wird abgedeckt/schattiert" — das war der Scrim, nicht eine neue
Regression.** `landing`/`propertyManagement` liefen über `overlay`
transparent über dem Hero-Foto und füllten sich erst beim Scrollen zu
`bg-primary` — bis dahin sorgte ein Verlaufs-Scrim
(`bg-gradient-to-b from-scrim/55 to-transparent`) über den obersten 160px
für Lesbarkeit des weißen Textes auf hellem Foto/Video. Genau dieser Scrim
ist das, was als „Schrift wird in den Hintergrund geschattet" ankam — vorher
kaschierten ein gefüllter Gold-Button („Sign In") und zwei fette
Dropdown-Chevrons das etwas, der neue, bewusst leichtere Flach-Header
brachte es erst richtig zur Geltung. Fix: die ganze transparente Variante
ist weg, nicht nur abgeschwächt — `Navigation` rendert jetzt **immer**
solides `bg-primary`, auf jeder Seite, kein `overlay`-Prop, kein
Scroll-Listener, kein Scrim-Div mehr. Passt auch besser zum eigentlichen
OmniVillas-Referenzbild: deren Header ist selbst nie transparent über einem
Foto, sondern durchgehend eine solide helle Leiste.

**Ein Header für die ganze Seite, nicht nur zwei.** Die alte
dropdown-lastige `"default"`-Variante (Property-Management-Untermenü mit
Property Evaluator, Stay-With-Us-Untermenü mit Properties/Instagram) ist
komplett ersetzt durch den flachen Aufbau, den §27 nur für die Landingpage
gebaut hatte — jetzt einfach `variant="default"`, ohne dass irgendeine der
~15 Seiten, die nur `<Navigation />` ohne Props schreiben, angefasst werden
musste (der Wechsel passiert zentral in der Komponente). Property Evaluator
und der Instagram-Link aus dem alten „Stay With Us"-Untermenü haben im Nav
keinen Ersatz — beide bleiben über die Seiten selbst bzw. den goldenen
„Book a Stay"-Button (→ `/properties`) erreichbar, nicht mehr über ein
Dropdown im Header. `nav-4`, `nav-4-properties`, `nav-4-posts`, `nav-5`
entsprechend ersatzlos entfallen (PROJECT.md).

**PM-Seite: Sprach-Switcher jetzt inline statt Dropdown, aus der Mitte nach
rechts.** `LanguageCurrencySwitcher.tsx` bekam einen zweiten Modus,
`variant="inline"` — alle drei Sprachen (DE/EN/ES) immer sichtbar,
Punkt-getrennt, ohne Popover-Panel, exakt das zweite Referenzbild
(„EN · DE · FR · ES · PT", bei uns auf die bestätigten drei Sprachen
reduziert). Da der Switcher nicht mehr die einzige Mitte-Komponente ist, für
die sich das eigene Drei-Zonen-Layout aus §27 gelohnt hätte, ist die
PM-Variante jetzt strukturell identisch mit der Default-Variante (Logo links,
alles andere rechts, `justify-between`) — nur mit anderem Link-Inhalt. Der
Zwei-`flex-1`-Zentrier-Trick aus §27 ist damit hinfällig und raus.

**Gold-CTAs: Pfeil-Icon, abgerundet wie die grünen Buttons.** „Apply" und
„Book a Stay" bekommen `<ArrowRight>` nach dem Label (Referenzbild:
„Book direct →"). Beide liefen bisher auf dem Button-Default `rounded-md` —
neben den durchgehend `rounded-full` gebauten grünen/salbeifarbenen Buttons
(Suchleisten-Such-Button, Gäste-Stepper) sah das nach zwei verschiedenen
Button-Familien aus. Jetzt `rounded-full` für beide.

**`/properties`: Default-Sortierung auf „Price: high to low".** Bisher
„Recommended" (DB-Reihenfolge, featured zuerst). Neuer Default zeigt die
teuersten — in diesem Portfolio auch die eindrucksvollsten — Objekte zuerst.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt dieselben vorbestehenden Fehler wie in §27, keine neuen.
Browser-Prüfung weiterhin nicht möglich, chrome-devtools-MCP bleibt
getrennt — die Scrim-Diagnose in diesem Abschnitt beruht auf Code-Lektüre
(Stacking-/Opacity-Analyse), nicht auf einem visuellen Vergleich; sollte sie
nicht die ganze Ursache gewesen sein, bitte konkret zurückmelden, was noch
zu sehen ist.

## 29 · Transparenter Header zurück (als durchgehende Fläche statt Verlauf), echte Preisumrechnung, Switcher-Feinschliff

Korrektur zu §28: Almedin wollte die transparente Header-Variante nicht
loswerden, sondern nur den Verlauf, der sie hatte „abgeschattet" wirken
lassen — Referenzbild zeigt OmniVillas' eigenen Header, eine durchgehend
getönte Fläche über dem Foto, nicht ein- und ausfaltend.

**`overlay`-Prop zurück, aber neu gebaut.** `Navigation` hat wieder ein
`overlay`-Prop (nur `Index.tsx`, `PropertyManagementPage.tsx`), aber ohne
den separaten Verlaufs-Scrim-Div aus der alten Version — stattdessen trägt
die `<nav>` selbst im ungefüllten Zustand `bg-primary/55 backdrop-blur-md`,
eine konstante getönte Fläche über die ganze Leiste, kein Fade. Füllt sich
beim Scrollen (oder offenem Mobile-Menü) weiterhin zu vollem `bg-primary` —
dasselbe Verhalten wie vorher, nur die Zwischenstufe ist jetzt gleichmäßig
statt verlaufend.

**Echte Preisumrechnung, keine Auswahl-Attrappe mehr.** Neuer
`LocaleContext.tsx` (`LocaleProvider` in `App.tsx`, neben `AuthProvider`/
`InlineEditProvider`) hält `language`/`currency` jetzt global statt lokal im
Switcher — `PropertyCard.tsx` und `PropertyDetail.tsx`s Preisanzeige lesen
`convertPrice()`/`currencySymbol` von dort, Auswahl im Header wirkt sich
jetzt sichtbar aus. Kurse sind statisch und angenähert (EUR 1 / USD 1,08 /
GBP 0,85, Stand 20.08.2026) — kein Live-Kurs-Feed, das wäre eine eigene
Supabase-Function mit externem API-Key. Bewusst nur auf die
Marketing-Preisanzeige beschränkt: `BookingSummary.tsx`, die
Guesty-Live-Quote und der Stripe-Checkout bleiben unangetastet und laufen
weiter ausschließlich in EUR (CLAUDE.md: Buchungs-/Zahlungsfluss nicht ohne
Einzelrückfrage anfassen) — der bestehende Hinweistext im Switcher-Panel
sagt das auch explizit („every stay is billed in EUR").

**Sprache übersetzt weiterhin nichts.** Die Auswahl ist jetzt zwar global
sichtbar (`LocaleContext`), aber es gibt keine Übersetzungs-Infrastruktur
im Projekt und keine deutschen/spanischen Texte für die Seite — das ist ein
separates, deutlich größeres Vorhaben (i18n-System plus tatsächliche
Übersetzung jedes Textbausteins). Noch nicht begonnen, siehe Rückfrage an
Almedin im Chat.

**Switcher-Feinschliff:** mehr Innenabstand (`px-3.5/py-1.5` →
`px-4–5/py-2–2.5`, näher am OmniVillas-Referenzbild), `ChevronDown`-Icon
entfernt — der Klick auf die Pille öffnet das Dropdown weiterhin über Radix'
`PopoverTrigger`, unabhängig vom Icon. Größenkontrast zum CTA-Button: Switcher
`size="sm"`, Button auf `h-11 px-6 text-base` (über dem Default `h-10 px-4
text-sm`) angehoben — bewusster Unterschied zwischen der einen soliden CTA
und der zurückhaltenderen Outline-Pille daneben, wie im OmniVillas-Header.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt nur die zwei vorbestehenden `any`-Fehler in `PropertyDetail.tsx`
und eine `react-refresh/only-export-components`-Warnung in
`LocaleContext.tsx` — dieselbe Warnung, die `AuthContext.tsx` schon hat
(Context + Hook in einer Datei, etabliertes Muster in diesem Projekt), keine
neuen Fehler. Browser-Prüfung weiterhin nicht möglich.

## 30 · Erste i18n-Runde — DE/ES-Übersetzung von Header, Footer, Suche und der gesamten Landing Page

Almedin wollte die ganze Seite übersetzt, KI-Entwurf zur späteren Durchsicht
(„Ganze Seite, KI-Entwurf zur Durchsicht"). Diese Runde deckt Header, Footer,
Suchleiste und jede Section der Landing Page ab — nicht die komplette Website
auf einmal, siehe „Noch offen" unten.

**Architektur:** `src/lib/translations.ts` — ein `en`/`de`/`es`-Wörterbuch,
Schlüssel sind wo möglich identisch mit den bereits vorhandenen
`EditableText`-`id`s (ein Bezeichner statt zweier paralleler Namensschemata).
`LocaleContext.tsx` (schon aus §29 für die Währung da) bekam `t(key)` dazu,
plus `language` selbst. Jede Komponente mit `EditableText`-State liest ihren
Default jetzt über `t()` statt eines Literals und synchronisiert per
`useEffect` auf `[language]` neu — das setzt manuelle Inline-CMS-Edits beim
Sprachwechsel zurück auf den neuen Default, was nichts verliert, das ein
Reload nicht ohnehin schon verlieren würde (PROJECT.md C7: Edits persistieren
heute nicht). Komponenten ohne CMS-Editierung (SearchBar, LocationAutocomplete,
PropertyCard-Meta-Zeile) rufen `t()` direkt im JSX auf, ganz ohne eigenen
State.

**Abgedeckt:** `Navigation.tsx`, `Footer.tsx`, `SearchBar.tsx` +
`LocationAutocomplete.tsx` (Feld-Label, Platzhalter, Gäste-Panel),
`PropertyCard.tsx` (Meta-Zeile, „from"/„night"/„Featured"),
`Properties.tsx`-Kopfbereich (Eyebrow, Headline, Sortierung, Leerzustand),
und jede Section der Landing Page: `Hero.tsx`, `PropertyCollections.tsx`
(alle drei Rail-Titel/Leads), `GuestManagement.tsx` („It's in the
details." + die vier Punkte), `FAQ.tsx` (nur Eyebrow/Headline),
`OwnAProperty.tsx`, `PropertyEvaluator.tsx` (nur Sektionstitel/Untertitel/
Button).

**Noch offen, bewusst nicht in dieser Runde:**
- Die sieben FAQ-Frage/Antwort-Paare selbst (`FAQ_ITEMS` in `FAQ.tsx`) —
  längere Fließtext-Absätze mit Zahlen/Fakten, nicht nur Überschriften.
- `PropertyEvaluator.tsx`s Formularfelder (Bedrooms/Bathrooms/Property
  Type/Size/Guests-Labels und ca. 40 Dropdown-Optionen).
- `/about`, `/renovations`, `/investments`, `/guaranteed-income`.
- Die Property-Management-Seite selbst (`OwnerHero`, `TheSystem`, `Proof`,
  `WaysToWorkTogether`, `AboutMini`, `OwnerContactForm`) — nur ihr Header ist
  über die geteilte `Navigation`/`FAQ`-Wörterbucheinträge mit abgedeckt.
- `PropertyDetail.tsx`s Fließtext (Beschreibung, Amenities-Namen kommen
  ohnehin aus der DB, nicht aus dem Code).
- Das Admin-Gebiet — nie gästeseitig, bewusst ausgenommen.

Alles davon folgt demselben, jetzt etablierten Muster (`t()` +
`useEffect`-Reset) — reine Fortsetzungsarbeit, kein neues Konzept nötig.

**Qualität:** DE/ES sind von mir (Claude) übersetzt, nicht von einem
Muttersprachler geprüft — das war ausdrücklich als Entwurf angefragt.
Insbesondere die Rechts-/Marketingsprache (Impressum-Verlinkung „Aviso
Legal" ↔ „Impressum" auf Deutsch) sollte vor Veröffentlichung von jemandem
mit Sprachkenntnis gegengelesen werden.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt dieselben vorbestehenden Fehler wie in §29, keine neuen. Browser-
Prüfung weiterhin nicht möglich — insbesondere der Sprachwechsel selbst
(löst er wirklich re-render + korrekten Reset auf allen State-Variablen aus,
ohne einen Flackereffekt oder eine vergessene Stelle) ist nur durch
Code-Lektüre geprüft, nicht visuell.

## 31 · i18n zweite Runde — About/Renovations/Investments/Guaranteed Income, komplette Property-Management-Seite, PropertyDetail-UI

Fortsetzung von §30, auf Almedins „ja" zur Frage, ob mit den restlichen
Seiten weitergemacht werden soll. Deckt jetzt praktisch die gesamte
öffentliche Seite ab, mit den unten aufgeführten bewussten Ausnahmen.

**FAQ-Antworten jetzt auch übersetzt — als Anzeige-Text getrennt vom
Schema.** `FAQ_ITEMS` in `FAQ.tsx` bleibt englisch, weil es die
`FAQPage`-JSON-LD auf `Index.tsx` speist und strukturierte Daten den
kanonischen (englischen) Inhalt abbilden sollten, den ein Crawler indexiert
— nicht einen Client-seitigen Sprach-Toggle. Neue `faq-q-0…6`/`faq-a-0…6`-
Schlüssel im Wörterbuch versorgen stattdessen nur die sichtbare Anzeige;
`FAQ.tsx` rendert jetzt `t(...)` statt `item.question`/`item.answer` direkt.

**`SectionIntro.tsx` bekam einen Resync-Effect.** Renovations/Investments/
Guaranteed Income übergeben `eyebrow`/`heading`/`lead` als literale Props
(nicht eigenen State) — ein einfacher `useEffect(() => { setEyebrowText(eyebrow); ... }, [eyebrow, heading, lead])`
synchronisiert jetzt neu, sobald der Aufrufer selbst neu übersetzte Strings
liefert (Sprachwechsel). Kein `language`-Import in `SectionIntro.tsx` nötig
— die Props selbst sind bereits das Signal.

**Property-Management-Seite komplett:** `OwnerHero.tsx`, `AboutMini.tsx`
(Team-Rollen nur im Fallback-Zustand übersetzt — echte Daten aus
`team_members` werden nie von einem Sprachwechsel überschrieben),
`TheSystem.tsx` (alle sechs Schritte + Closing-Line), `WaysToWorkTogether.tsx`
(beide Modelle + beide „Beyond management"-Pfade), `OwnerContactForm.tsx`
(alle Formularfelder, Platzhalter, Toast-Meldungen, Datenschutzhinweis).

**`Proof.tsx`: nur die strukturellen Labels, nicht `FEATURED_PROJECTS`.**
Die drei Fallstudien (Titel/Lage/Beschreibung/Kennzahlen) kommen aus
`ProjectsSection.tsx`, geteilt mit `/projects` — das liegt näher an
verifizierten Fall-Daten als an generischem Marketingtext und bleibt
bewusst unangetastet. „Occupancy"/„Revenue"/„Rating" sind jetzt übersetzt.

**`PropertyDetail.tsx`: UI-Chrome übersetzt, DB-Inhalt nicht.**
Zurück-Button, Galerie-Button, Bedrooms/Bathrooms/Guests-Zeile,
Sektionsüberschriften, Live-Preise-Hinweis, Buchungskarte, alle
Toast-Meldungen. `property.description`/`property.amenities` kommen aus der
Datenbank, nicht aus dem Code — unverändert. Ein `useEffect`, der `slug`
lädt, bekam bewusst **kein** `t` in seinen Dependencies (Kommentar im Code):
Ansonsten hätte ein Sprachwechsel einen unnötigen Refetch der ganzen
Property ausgelöst, nur um den Wortlaut eines Fehler-Toasts aktuell zu
halten.

**Bewusst weiterhin nicht übersetzt:** die Zod-Validierungsmeldungen in
`PropertyEvaluator.tsx`/`OwnerContactForm.tsx` (nur bei ungültiger Eingabe
sichtbar, niedrigere Priorität), `FEATURED_PROJECTS`, das Admin-Gebiet (nie
gästeseitig). Die vollständige Coverage-Liste steht im Kopfkommentar von
`src/lib/translations.ts`.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt nur vorbestehende Fehler (`any`-Typen in mehreren `iconMap`-
Deklarationen, unverändert von mir angefasste Zeilen) und dieselbe
`react-refresh/only-export-components`-Warnung wie in §30 — eine neue
`react-hooks/exhaustive-deps`-Warnung in `PropertyDetail.tsx` wurde bewusst
mit Kommentar + `eslint-disable-next-line` unterdrückt (siehe oben), keine
sonstigen neuen Fehler. Browser-Prüfung weiterhin nicht möglich.

## 32 · Neues Hero-Video, höher aufgelöstes About-Bild, Contact-Us-Ziele, Footer-Überarbeitung

**Hero-Video ersetzt.** Almedin lieferte `VID PUENTE ROMANO 1 (1).mp4`
(4K, 3840×2160, 30fps, 27,8s, 290 MB) direkt aus seinen Downloads. Gleiches
Rezept wie beim ersten Mal (§22): mit dem winget-installierten `ffmpeg` auf
1280×720 skaliert, `libx264 -crf 30 -maxrate 2500k -bufsize 5000k`, ohne Ton
(`-an`), `+faststart`. Ergebnis: 6,4 MB, überschreibt
`public/videos/hero-background.mp4` direkt — kein Code in `Hero.tsx` musste
sich ändern, der Pfad blieb gleich.

**About-Hero-Bild ersetzt.** `DSC01050-HDR.jpg` (4597×3065, 5,1 MB JPEG) auf
2400px Breite skaliert und nach WebP konvertiert (Projekt-Konvention: keine
rohen JPGs unter `src/assets`), 390 KB. Überschreibt
`src/assets/about-hero.webp` direkt (vorher 1200×800, 108 KB) — auch hier
kein Code-Wechsel nötig, nur die Datei selbst.

**„Contact us"-Buttons zeigen jetzt auf die einzige echte Kontaktform der
Seite — mit einem offenen Punkt.** `GuestManagement.tsx`s „Contact us"
(Landing Page) zeigte vorher auf `/properties` — laut eigenem Code-Kommentar
selbst schon als Notlösung markiert, weil es „keine eigene Gäste-Kontaktseite
gibt". Jetzt zeigt der Button wie angefragt auf
`/property-management#get-in-touch`, dieselbe Adresse, die auch der neue
„Contact Us"-Button am Ende von `About.tsx` bekommen hat (dort gab es vorher
gar keinen Call-to-Action). **Aber:** Dieses Formular fragt „Where is the
property? *" als Pflichtfeld ab — eine Eigentümer-Frage, keine Gäste-Frage.
Ein Gast, der über die Landing Page oder About Us auf „Contact us" klickt,
landet damit auf einem Formular, das ihm eine für ihn unpassende Pflichtangabe
abverlangt. Das ist keine Verletzung von CLAUDE.mds Eigentümer-/Gäste-Trennung
in der Wortwahl (der Text „Contact us" bleibt unverändert, wie in
`GuestManagement.tsx` per CLAUDE.md vorgeschrieben), aber ein echtes
UX-Problem, das ich nicht stillschweigend gelöst habe — die richtige Lösung
(ein eigenes, kürzeres Gäste-Anfrageformular) ist ein größeres, eigenes
Vorhaben, kein Link-Wechsel. Absichtlich so umgesetzt, wie angefragt, mit
diesem Vermerk statt einer eigenmächtigen Änderung der Anfrage.

**`WaysToWorkTogether.tsx` bekam einen neuen Anker,** `id="beyond-management"`
mit `scroll-mt-24` (dieselbe Kopfzeilen-Freistellung wie jeder andere Anker
auf der Seite) auf dem Div mit der Gold-Linie/„Beyond management"-Eyebrow —
nicht auf der ganzen `#ways-to-work`-Section, damit ein Link direkt bei den
Renovations-/Investments-Karten landet statt bei den zwei
Engagement-Modellen darüber.

**Footer überarbeitet:**
- Logo von `h-12 md:h-14` (identisch zur Kopfzeile) auf `h-16 md:h-20`
  vergrößert — allein in einer ganzen Footer-Spalte wirkte die
  Kopfzeilen-Größe klein.
- „Guaranteed Income" als eigene Zeile ersatzlos entfernt (Almedins
  ausdrücklicher Wunsch) — die Seite `/guaranteed-income` existiert
  unverändert weiter, ist nur nicht mehr im Footer verlinkt.
- „Renovations" und „Investments" zu einer Zeile „Beyond Management"
  zusammengelegt, verlinkt auf `/property-management#beyond-management` —
  exakt das Label, das die PM-Seite selbst für genau diesen Abschnitt
  verwendet (statt zwei Footer-Zeilen für das, was auf der Seite selbst als
  ein Angebot unter einer Überschrift läuft).
- Neu: „Browse Homes" → `/properties`. Der Footer hatte bisher **keinen**
  Link zur eigentlichen Objektsuche — bei einer Seite, deren zentrale
  Gäste-Funktion genau das ist, eine echte Lücke, keine Geschmacksfrage.
- FAQ-Link korrigiert: lief auf `/property-management#faq` (die
  Eigentümer-Instanz von `FAQ.tsx`), zeigt jetzt auf `/#faq` — dieselbe
  Komponente läuft gästeseitig auch direkt auf der Landing Page, und ein
  Gast, der im Footer auf „FAQ" klickt, sollte auf dem für ihn geschriebenen
  Text landen, nicht im Eigentümer-Kontext der PM-Seite.
- `footer-gi-link`/`footer-renovations-link`/`footer-investments-link`
  ersatzlos entfallen (PROJECT.md), neue Keys `footer-beyond-link`/
  `footer-browse-link`.

**Verifikation:** `tsc --noEmit` und `npm run build` liefen sauber. `npm run
lint` zeigt nur denselben vorbestehenden `any`-Fehler in `GuestManagement.tsx`
(unveränderte `iconMap`-Zeile), keine neuen Fehler. Browser-Prüfung weiterhin
nicht möglich — insbesondere der neue `#beyond-management`-Anker und der
größere Footer-Logo-Sprung sind nur durch Code-Lektüre geprüft.

## 33 · Footer: FAQ-Link bestätigt, Projects entfernt

FAQ war bereits korrekt auf `/#faq` verlinkt (§32) — nichts weiter zu tun.
„Projects" als eigene Footer-Zeile ersatzlos entfernt (Almedins Wunsch);
`/projects` existiert als Seite unverändert weiter, nur ohne Footer-Link.
`footer-projects-link` aus allen drei Wörterbüchern und `projectsLink`-State
aus `Footer.tsx` entfernt, in PROJECT.md als entfallen vermerkt.
`tsc --noEmit`/`npm run build` sauber.

## 34 · B1 erledigt — Stripe Publishable Key gesetzt

Almedin hat den `pk_live_…` aus dem Guesty-Payment-Konto (`acct_1Pqi8YRsGzWWYqz8`)
als `GUESTY_STRIPE_PUBLISHABLE_KEY` in die Edge-Function-Secrets des neuen
Supabase-Projekts (`womaoywuhjchtubacbvn`) eingetragen — über das Dashboard,
nicht über mich: kein CLI-Login vorhanden (`supabase projects list` verlangt
einen Access Token), kein passendes MCP-Tool zum Setzen von Secrets, und ein
Publishable Key gehört laut CLAUDE.md ohnehin in die Supabase-Secrets, nie
ins Repo.

Verifiziert per `curl` gegen `guesty-stripe-config` (liest nur die Env-Var,
kein Guesty-Tokenverbrauch, also gefahrlos zu testen): vorher HTTP 500
(„Stripe publishable key not configured"), jetzt HTTP 200 mit
`{"publishableKey":"pk_live_…"}`. Der Buchungsabschluss selbst (Stripe
Elements laden, eine echte Karte durchlaufen lassen) ist damit noch nicht
getestet — nur, dass die Funktion den Schlüssel jetzt korrekt ausliefert.

## 35 · Neue Section „Working with" (Partnerlogos), Closing-Line in TheSystem größer

**„We don't just manage homes."** — `sys-closing-line` in `TheSystem.tsx` lief
auf `t-block` (H3, 1,375–1,75rem), jetzt auf `t-section` (H2, 1,875–2,75rem)
hochgestuft: die Sechs-Klassen-Typo-Skala kennt keine Zwischenstufe, und
CLAUDE.md verbietet rohe `text-*`-Werte in öffentlichen Content-Komponenten
— „ein bisschen größer" heißt in diesem System konkret „eine Stufe höher".
Zusätzlich `leading-relaxed`, da `t-section`s eigener Zeilenabstand (1,1) für
eine Schlagzeile gedacht ist, nicht für den Abstand, den ein zweizeiliges
Zitat hier bekommen sollte.

**Neue Section `WorkingWith.tsx`**, zwischen `Proof` und `WaysToWorkTogether`
auf der PM-Seite — Phase-0-Recherche zuerst: `platform-connections.webp` (in
`TheSystem.tsx`) ist eine einzelne flache Grafik für Buchungsplattform-
Distribution, kein wiederverwendbares Logo-Komponentenmuster; sonst gibt es
im Projekt nichts Vergleichbares. `MediaFrame` kam als Basis nicht infrage —
es croppt (`object-cover`), richtig für ein Foto, falsch für ein Logo — aber
sein Grundmuster (`bg-placeholder-hatch` für „fehlt noch") ist hier direkt
wiederverwendet, nur mit `object-contain` statt `object-cover`, sobald ein
echtes Bild über `EditableImage` gesetzt wird.

Bewusst die leichteste Section der Seite: nur Eyebrow „Working with" + eine
Logo-Reihe, kein Fließtext, kein CTA, Hintergrund bleibt Beige (Section ohne
`tone`-Override) statt Proofs grüner Fläche fortzusetzen — der Wechsel
selbst ist der Punkt, eine kurze Atempause zwischen den zwei schwersten
Sections der Seite. Mischt bewusst zwei Partner-Arten unter einem Label
(Netflix als gästeseitige Marke, Renovierungsunternehmen als Auftragnehmer)
— mit Almedin bestätigt, nicht angenommen.

**Alle vier Logo-Slots sind Platzhalter** — keine der vier Logo-Dateien
liegt im Projekt vor (auch nicht Netflix; ein Markenlogo selbst zu
generieren oder von irgendwoher zu laden wäre sowieso falsch gewesen).
Rückfrage an Almedin steht noch aus: die drei übrigen Partner (Namen +
Logo-Dateien) sowie eine Netflix-Logo-Datei selbst.

**Verifikation:** `tsc --noEmit`, `npm run build` und `npm run lint` liefen
sauber, keine neuen Fehler. Browser-Prüfung weiterhin nicht möglich.

## 36 · "Working with"-Logos bleiben in einer Reihe statt umzubrechen

`flex flex-wrap` in `WorkingWith.tsx` konnte auf schmalen Screens zwei Zeilen
zu je zwei Logos ergeben — Almedin wollte alle vier ausdrücklich
nebeneinander. Umgestellt auf `flex-nowrap`; da vier 144px-Slots mit
`gap-x-2xl` auf einem Telefon (Content-Breite auf einem 320px-Gerät ~280px)
so nie in eine Zeile passen, egal ob Umbruch erlaubt ist, schrumpfen Boxen
und Lücke stattdessen selbst: `h-10 w-16` mit `gap-x-xs` als Basis, ab
`sm:` zurück auf die ursprünglichen `h-14 w-36` mit `gap-x-xl`. Kein
eigener `xs:`-Breakpoint — `tailwind.config.ts` definiert keinen; nur `sm`
und aufwärts stehen als Stufen zur Verfügung.

Die Platzhalter-Beschriftung ("Partner 2" usw.) kann auf der kleinen
mobilen Box in zwei Zeilen umbrechen — hingenommen, weil es ein
Übergangszustand bis zu den echten Logos ist, keine dauerhafte UI.

**Verifikation:** `tsc --noEmit`, `npx eslint src/components/WorkingWith.tsx`
und `npm run build` liefen sauber, keine neuen Fehler.

## 37 · B2 erledigt — City Tax korrigiert; C1 im Code nachgezogen

Almedin hat die City Tax am Objekt Vienna Ottakring in Guesty korrigiert:
Properties overview → Objekt → Pricing & policies → Pricing → Abschnitt
„Tax" → Edit → Feld „Per" von `PER_GUEST_PER_NIGHT` auf `PER_STAY`
umgestellt. Die zentrale „Financials → Tax configurations"-Liste zeigte
diesen Eintrag nicht an — vermutlich weil sie nur Account-Level-Steuern
listet, während diese Steuer auf Listing-Ebene an das eine Objekt hängt.
Navigationspfad stammt aus der offiziellen Guesty-Doku (nicht selbst im
Interface geprüft, da kein Zugriff auf das Guesty-Dashboard besteht).

**C1 im Code nachgezogen**, wie mit B2 verabredet (PROJECT.md §6):
`BookingSummary.tsx` behandelte `subTotalPrice` bisher als fertigen Total —
das ist laut Guesty der **Betrag vor Steuer**. Jetzt: `total = preTax +
taxes`, mit `preTax = subTotalPrice` (Fallback unverändert: `subtotal +
fees - discount`). Zusätzlich werden `fees` und `taxes` aus den
`invoiceItems` jetzt getrennt statt über eine gemeinsame `/FEE|TAX/i`-
Regex zusammengefasst — sonst wäre die (jetzt korrigierte, vorher massiv
überhöhte) Steuer unbenannt in der „Fees"-Zeile mitgelaufen statt als
eigener Posten sichtbar zu sein. In der UI erscheint „Taxes" nur, wenn
`quote.taxes > 0` — die lokale Fallback-Quote für Objekte ohne
`guesty_listing_id` kennt keine echte Steuer und setzt `taxes: 0`, damit
dort keine falsche „Taxes: €0.00"-Zeile erscheint.

**Verifikation:** `tsc --noEmit` sauber. `npx eslint
src/components/BookingSummary.tsx` liefert weiterhin 13 `no-explicit-any`
+ 1 `exhaustive-deps`-Warnung — per `git stash`-Vergleich bestätigt: exakt
dieselben 14 Probleme vor und nach der Änderung, nur die Zeilennummern
verschoben. Keine neuen Fehler. `npm run build` erfolgreich.

**Live bestätigt (21.08.2026):** Almedin hat eine echte Quote angefragt (5
Nächte, Vienna Ottakring) — Subtotal 814 €, Fees 250 €, Taxes 26 €. 814 ×
3,2 % = 26,05 € — exakt der erwartete Wert für „einmal pro Aufenthalt"
statt des vorherigen Vielfachen aus Gästen × Nächten. Die 250 € Fees
liegen außerhalb dieser Änderung (Guestys eigene Gebühren-Konfiguration
für das Objekt, z. B. Reinigung) und wurden bewusst nicht weiter geprüft.
B2 und C1 gelten damit als vollständig verifiziert.

## 38 · Audit für den Main-Merge: C2 und C3 waren bereits gelöst, C4-Bug gefunden

Vor dem geplanten Merge nach `main` auf Wunsch die restlichen offenen
Code-Punkte (C2–C4) geprüft.

**C2 (stille Fantasiepreise) und C3 (Endlos-Spinner) waren beim
Code-Lesen bereits vollständig gelöst** — die PROJECT.md-Einträge waren
schlicht nicht nachgezogen worden (CLAUDE.md: „Code prüfen, dann das
Dokument nachziehen"). `fetchQuote` erfindet bei einer fehlgeschlagenen
Quote keinen Preis mehr (kein `× 1,1` im Code mehr), sondern setzt
`quote: null` + `quoteError`; `validateBookingInput` blockiert das
Absenden zusätzlich explizit, solange `!quote \|\| quoteError`. Für
`guesty-stripe-config`-Fehler setzt der Code `paymentUnavailable`, zeigt
einen sichtbaren Fehlerzustand und bietet „Send booking request instead"
(`handleSwitchToInquiry`) als Ausweichpfad; der „Complete Booking"-Button
wird dabei ausgeblendet statt tot dazustehen. Keine Codeänderung nötig,
nur die Doku korrigiert.

**C4: echter Bug gefunden, nicht angewendet.** Per Supabase-MCP (heute
zum ersten Mal in dieser Session tatsächlich erreichbar, siehe unten)
bestätigt: `20260813200000_nightly_price_sync` steht nicht in
`list_migrations` für `womaoywuhjchtubacbvn` — der Datei-Header-Hinweis
„NOT YET APPLIED" stimmt noch. Beim Lesen der Funktion fiel auf, dass der
63/70-Nächte-Retry-Zweig (für Objekte mit hoher Mindest-Nächte-Regel) an
`https://xjvtuderbirlwudatgxg.supabase.co/…` postet — das alte
Supabase-Projekt, das laut PROJECT.md §6 seit dem Projektwechsel am
19.08.2026 tot ist — mit einem `apikey`-Header aus
`current_setting('app.settings.supabase_anon_key', true)`, einer
Einstellung, die nie gesetzt wurde. Die primäre Anfrage direkt darüber
postet dagegen korrekt an `womaoywuhjchtubacbvn` mit einem hart codierten
Publishable Key. Der Retry-Zweig hätte also für genau die Objekte, für
die er gedacht ist, immer fehlgeschlagen. Beide Werte jetzt an die
primäre Anfrage angeglichen; per `list_edge_functions` bestätigt, dass
`guesty-get-quote` auf `womaoywuhjchtubacbvn` aktiv läuft, sodass die
primäre Anfrage der Funktion tatsächlich etwas erreichen kann.

**Supabase-MCP ist jetzt erreichbar** — anders als an jeder früheren
Stelle dieser Session (B1 musste noch manuell über das Dashboard gesetzt
werden, weil weder CLI-Login noch MCP-Zugriff bestanden). `list_projects`
zeigt `womaoywuhjchtubacbvn` (ACTIVE_HEALTHY) und das tote
`odloyonqqsgnpxvqrrep`. Damit sind `list_migrations`,
`list_edge_functions` und (nach Freigabe) `execute_sql`/`apply_migration`
direkt nutzbar, ohne Umweg über Almedins Dashboard.

**Migration noch nicht angewendet** — CLAUDE.md verlangt Absprache vor
jeder Anwendung auf die Live-DB, unabhängig davon, dass der MCP-Zugriff
das jetzt technisch erlauben würde. Wartet auf Almedins Freigabe; danach
`SELECT * FROM public.sync_guesty_prices();` von Hand laufen lassen und
jede Zeile prüfen (`ok = true` für die meisten der 23 Objekte, `detail`
ein plausibler Preis). **Fortsetzung: §39** — Almedin hat direkt im
selben Gespräch freigegeben, angewendet zu werden; dabei kam ein
tieferliegendes Problem zum Vorschein.

## 39 · C4 angewendet — Architekturproblem gefunden, Cron deaktiviert

Almedin hat die volle Freigabe gegeben („Ja, anwenden"). Migration
angewendet, `price_last_synced_at`-Spalte ergänzt (fehlte, siehe §38),
dann `SELECT * FROM public.sync_guesty_prices();` als eigentlichen
Verifikationsschritt laufen lassen — genau das, was der Datei-Header seit
dem 13.08. als offen markiert hatte.

**Erster Lauf: sofortiger neuer Fehler.** `column reference "slug" is
ambiguous` — die `RETURNS TABLE(slug text, ...)`-Ausgabevariable der
Funktion überdeckt `properties.slug` in der `FOR prop IN SELECT id, slug,
… FROM properties`-Abfrage. Mit einem Tabellen-Alias (`FROM properties
p`, `SELECT p.id, p.slug, …`) behoben, Funktion per
`CREATE OR REPLACE` neu angewendet.

**Zweiter Lauf: alle 23 Zeilen `ok = false`, `detail = "request matching
request_id not found"`.** Das sah zunächst wie derselbe Race aus, den der
Datei-Header schon als Risiko benannt hatte (`async := true` prüft
sofort, ohne zu warten). Stichprobe gegen `net._http_response` zeigte
aber: Die HTTP-Antworten kamen tatsächlich an (echte Zeilen mit
`status_code` 200/500, korrekt terminiert) — das Sammeln scheiterte
trotzdem systematisch.

**Isoliert getestet, um die echte Ursache zu finden:** Ein einzelner
`net.http_post()` gefolgt von `net._http_collect_response()` **in
derselben Anweisung/Transaktion** scheiterte auch mit drei Sekunden
`pg_sleep()` dazwischen — kein Timing-Problem im Sinne von „zu schnell
abgefragt". Des Rätsels Lösung, sichtbar erst beim Aufschlüsseln der
zurückgegebenen `jsonb`-Struktur (`{status, message, response}` statt der
von der Migration angenommenen flachen `{body, …}`-Form): pg_nets
Hintergrund-Worker sieht eine wartende Anfrage erst, **nachdem die
Transaktion committet ist, die sie eingereiht hat** (Postgres-MVCC). Eine
PL/pgSQL-Funktion committet aber erst, wenn sie zurückkehrt — `post` und
`collect` liefen also in derselben, noch offenen Transaktion, und der
Worker konnte die Anfrage prinzipiell nicht sehen, egal wie lange
gewartet wird. Genau das erklärt auch, warum die Datei selbst nie
„end-to-end" verifiziert war: Im SQL-Editor mit Autocommit sind
`http_post` und `collect_response` als zwei separate Anweisungen zwei
separate, sofort committende Transaktionen — in einer einzigen
PL/pgSQL-Funktion sind sie es nicht.

**Das ist kein Tippfehler mehr, sondern ein Architekturproblem.** Kein
Retry- oder Sleep-Zusatz *innerhalb* der Funktion kann das lösen (probiert
und bestätigt nutzlos). Der tragfähige Weg wäre, den Sync aus einer
einzelnen SQL-Funktion herauszulösen und als Edge Function zu bauen
(normales `fetch`/`await`, kein `pg_net`, kein MVCC-Sichtbarkeitsproblem)
— `pg_cron` würde dann nur noch einmal pro Lauf `net.http_post` auf diese
eine Edge Function abfeuern, statt 23-mal Post-dann-Collect in einer
Transaktion zu verschachteln. Das ist ein eigenständiger Bau-Auftrag, kein
Fix mehr innerhalb dieser Migration.

**Sofortmaßnahme:** `SELECT cron.unschedule('guesty-price-sync-nightly');`
live ausgeführt — der Job war ohnehin nur eingerichtet, nicht aber sinnvoll
lauffähig; ungeplant hätte er jede Nacht 23 echte Guesty-Quote-Anfragen
verbraucht, ohne je eine Zeile zu aktualisieren. Der geplante
`cron.schedule(...)`-Aufruf am Dateiende ist jetzt auskommentiert, mit
Hinweis, ihn erst nach der Edge-Function-Umstellung wieder scharfzustellen.
Die `COMMENT ON FUNCTION`-Beschreibung wurde live und im Repo gleichermaßen
aktualisiert, damit sie nicht weiter „scheduled nightly" behauptet.

**Nichts Falsches geschrieben:** Da jeder Testlauf mit `ok = false`
endete, hat `UPDATE public.properties SET price_per_night = …` kein
einziges Mal ausgeführt — `price_per_night` steht für alle 23 Objekte
weiterhin auf dem eingefrorenen Importwert, unverändert seit vor dieser
Session.

**Verifikation:** `apply_migration` (dreimal — Basismigration, Alias-Fix,
Race-Fix-Versuch) und alle `execute_sql`-Aufrufe liefen ohne
SQL-Fehler (bis auf die zwei hier dokumentierten, die zur Diagnose
führten). Kein `tsc`/`build` nötig — reine SQL-/DB-Änderung, kein
Frontend-Code betroffen.

## 40 · Mobile "Stays"-Reihen: Pfeile waren `hidden md:flex`, jetzt immer sichtbar

Almedin: auf Mobile zeigt die Reihe „eineinhalb Immobilien" und das
Pfeil-System ist nicht sichtbar. Diesmal mit tatsächlichem Browser-Zugriff
geprüft (`chrome-devtools`-MCP war die ganze bisherige Session über nicht
erreichbar, ist es jetzt) — Screenshot bei 390px Breite bestätigte beides
exakt: eine volle Karte plus ein abgeschnittener Rand der nächsten
(`PropertyCollections.tsx`s `w-[85vw]`-Kartenbreite, absichtlich als
„da kommt noch was"-Hinweis gebaut, DECISIONS §19), und die Pfeile liefen
auf `hidden md:flex` — auf dem Handy schlicht nicht im DOM sichtbar,
einzige Navigation war ein unentdeckbares Wisch-Gesture.

**Fix:** `hidden md:flex` → `flex` an der einen Stelle, wo die Pfeile
gerendert werden (`Rail`-Komponente, alle drei Reihen „Luxury Stays",
„Explore the City", „Off-Grid Experiences" gemeinsam betroffen, da alle
über dieselbe Komponente laufen). Der 85vw-Peek selbst bleibt unverändert
— mit sichtbaren, bedienbaren Pfeilen ist er wieder das, was er sein
sollte: ein Hinweis auf weitere Karten, kein unerklärter Abschnitt.

**Beim Testen ein Selbst-Fund:** Der erste Klick-Test über das
`chrome-devtools`-Click-Tool zeigte scheinbar keine Reaktion (`scrollLeft`
blieb 0). Isoliert nachgestellt: ein natives `element.click()` per
`evaluate_script` scrollte korrekt (`scrollLeft` 0 → 344 nach der
`smooth`-Animation). Der Unterschied lag am Test-Tool selbst — vermutlich
ein Koordinaten-/DPI-Effekt der mobilen Emulation (`deviceScaleFactor: 3`),
nicht am Code. Echte Touch-Taps auf einem Telefon laufen über dieselbe
native Event-Pipeline wie `.click()`, nicht über simulierte Maus-
Koordinaten — betrifft Endnutzer also nicht. Per Screenshot vor/nach
`.click()` visuell bestätigt: die zweite Karte („The Hideaway Los
Flamingos") ersetzte die erste nach dem Scroll.

**Verifikation:** `tsc --noEmit` und `npx eslint
src/components/PropertyCollections.tsx` sauber, `npm run build`
erfolgreich. Visuell in Chrome DevTools geprüft bei 390×844 (mobil) und
1440×900 (Desktop, unverändert vier Karten nebeneinander mit rechtsbündigen
Pfeilen) — das erste Mal in dieser gesamten Session, dass eine UI-Änderung
tatsächlich im Browser statt nur per Codelesen verifiziert werden konnte.

## 41 · Neues Hero-Video, Team-Fotos in About Us (Olek raus)

**Hero-Video ausgetauscht.** Almedin lieferte eine neue 4K-Drohnenaufnahme
(„VID PUENTE ROMANO - new.mp4", 3840×2160, 25s, 263 MB, mit Ton). Gleiche
Behandlung wie beim ersten Hero-Video (§22): mit `ffmpeg` auf 1280×720
skaliert, Ton entfernt (das Element spielt ohnehin `muted` ab), auf
~2,2 Mbps/Maxrate 2,5 Mbps gekappt — Ergebnis 6,8 MB statt 263 MB, in
derselben Größenordnung wie das vorige Video (6,7 MB). Die alte Datei liegt
als `hero-background-old-backup.mp4` weiter im Ordner, falls ein Rollback
nötig wird — nicht im Build referenziert, nur eine lokale Sicherung.

**Wasserzeichen bewusst belassen.** Im Rohmaterial ist unten rechts ein
fremdes Haus-Symbol-Logo eingebrannt (vermutlich der Drohnen-Operator).
Vor dem Re-Encode gemeldet und mit Screenshot gezeigt; Almedin hat
„lass Wasserzeichen" entschieden — es bleibt im finalen Video sichtbar,
keine Cropping-Maßnahme vorgenommen.

**About-Us-Team: Olek raus, echte Fotos rein, Kreise vergrößert.**
`About.tsx` hatte vier Teammitglieder (`TEAM_NAMES`), von denen keines je
ein echtes Foto hatte — jeder Kreis war ein 64px (`w-16 h-16`)
Platzhalter-Gradient. Almedin lieferte drei Fotos (Alejandro, Lorenz,
Julien) und bat, Olek zu entfernen und die Kreise zu vergrößern, „aktuell
sehr klein".

- `TEAM_NAMES` von vier auf drei Einträge gekürzt (Olek gestrichen).
  `about-team-role-2`/`about-team-desc-2` (vorher Oleks „Marketing")
  ersatzlos entfernt; die vormals dritten Einträge (`-3`, Juliens „Guest
  Manager") auf Index 2 nachgerückt, in allen drei Sprachen (EN/DE/ES) —
  sonst hätte sich Juliens Rolle/Beschreibung an der falschen Namens-
  Position gezeigt, da `buildTeamMembers` Name und Übersetzung ausschließlich
  über den Array-Index verknüpft.
- Die drei Fotos (JPEG, hochkant, teils mit schwarzen Rand-Balken bei
  Lorenz' Datei — offensichtlich ein Screenshot-Crop) wurden mit Pillow auf
  ein quadratisches Format zugeschnitten, manuell auf den Kopf zentriert
  (kein automatisches Gesichtserkennungs-Tool verfügbar, Zuschnitt-Fenster
  aus visueller Prüfung jedes Bilds bestimmt), auf 480×480 skaliert und als
  WebP (Qualität 82) unter `src/assets/team-{name}.webp` abgelegt.
- Der Platzhalter-Kreis ist jetzt `EditableImage` mit dem jeweiligen Foto,
  `w-32 h-32` (128px) statt `w-16 h-16` (64px) — doppelt so groß, plus
  `object-cover rounded-full` für den kreisrunden Zuschnitt zur Laufzeit.

**Verifikation:** `tsc --noEmit`, `npx eslint src/pages/About.tsx
src/lib/translations.ts` und `npm run build` sauber. Visuell in Chrome
DevTools bestätigt bei 1440×900 (drei Karten, korrekt zugeordnete
Rollen) und im schmalen Viewport (Kreise deutlich größer, keine
Bildverzerrung).

## 42 · Drei echte Partner-Logos für "Working with" — Screenshot-Crop statt Download

Almedin lieferte drei Partner-URLs (sur-film.com, guesty.com, grupovasari.com
— Netflix weiterhin ohne Datei). Keine der drei Seiten stellt ein
herunterladbares Markenpaket bereit (kein `/press`, kein SVG-Export im
Quelltext auffindbar) — der einzige verlässliche Weg an das Logo, das die
Firma selbst tatsächlich zeigt, war die eigene Seite live im Browser zu
laden (`chrome-devtools`-MCP) und den Logo-Bereich direkt aus einem
Screenshot herauszuschneiden, statt eine Nachbildung zu zeichnen.

- **Sur Film**: „SUR | FILM"-Wortmarke, dünne Outline-Typo. Weißer
  Hintergrund per Farbschlüssel transparent gemacht.
- **Guesty**: Haus-Symbol + „Guesty"-Schriftzug. Erster Versuch lag über
  einem Hero-Foto (kein sauberer Hintergrund zum Freistellen) — per
  `window.scrollTo` an eine Stelle gescrollt, an der der Header auf
  einfarbigem Beige sitzt, dort erneut geschossen. Hintergrund ebenfalls
  transparent gemacht.
- **Grupo Vasari**: Das „V"-Monogramm sitzt in einer eigenen weißen
  Box mit feinem Rand/Schatten — die ist Teil der Wortmarke, nicht Zuschnitt-
  Artefakt, deshalb **nicht** transparent gemacht, sondern als eigenständige
  Kachel übernommen. Der separate „VASARI grupo"-Schriftzug daneben ist in
  der Quelle weiß gesetzt (für Fotoüberlagerung gedacht) und auf hellem
  Grund unsichtbar gewesen — bewusst weggelassen, nur das Monogramm
  verwendet, statt einen unlesbaren Text mitzuschleppen.

Alle drei mit Pillow zugeschnitten/skaliert und als WebP unter
`src/assets/partner-{sur-film,guesty,vasari}.webp` abgelegt, in
`WorkingWith.tsx`s `INITIAL_PARTNERS` verdrahtet. Netflix bleibt der
vierte, weiterhin unbelegte Platzhalter-Slot.

**Verifikation:** `tsc --noEmit`, `npx eslint src/components/WorkingWith.tsx`
und `npm run build` sauber. Visuell auf `/property-management` bestätigt —
alle drei Logos sitzen sauber neben dem Netflix-Platzhalter, Größen wirken
im Vergleich zueinander stimmig trotz unterschiedlicher Quellauflösungen.

## 43 · Offizielle Partner-Logos ersetzen die Screenshot-Crops, Chekin ersetzt Netflix; About-Mini-Team synchronisiert mit About Us

**Offizielle Logo-Dateien geliefert.** Almedin lieferte drei echte
Logo-Dateien (`sur-film.avif`, `Logo-guesty.png`, `chekin.webp`, alle mit
Alpha-Kanal) statt der Screenshot-Crops aus §42. Zwei davon (Guesty,
Sur Film) hatten den Hintergrund als **opak weiß**, nicht transparent
(`getpixel()` bestätigte `alpha=255` an den Ecken trotz RGBA-Modus) — vor
dem Zuschnitt per Farbschlüssel (Schwellwert 245) transparent gemacht,
dann `Image.getbbox()` auf den tatsächlichen Inhalt zugeschnitten plus 5 %
einheitliches Padding, damit alle vier Logos trotz unterschiedlicher
Quellauflösungen (150px bis 1024px) ähnlich groß wirken. `chekin.webp` war
bereits sauber transparent (`alpha=0` an den Ecken), nur zugeschnitten.

**Chekin ersetzt den Netflix-Platzhalter.** Netflix hatte nie eine
Logo-Datei bekommen; Chekin (Gäste-ID-Verifizierung/Online-Check-in) kam
mit einer fertigen Datei — der leere vierte Slot ist jetzt belegt statt
weiter offen zu stehen. Grupo Vasari (§42, aus einem Screenshot-Crop,
keine offizielle Datei diesmal geliefert) bleibt unverändert.

**About-Mini auf der PM-Seite synchronisiert.** Almedin bat, die Gesichter
in `AboutMini.tsx` (die kompakte Team-Vorschau auf `/property-management`)
an den About-Us-Stand von §41 anzugleichen. Dieselbe Korrektur wie dort:
`TEAM_NAMES` von vier auf drei gekürzt (Olek raus), `am-member-role-2`
(vorher Oleks „Marketing") entfernt, der vormals dritte Eintrag (`-3`,
Juliens „Guest Manager") auf Index 2 nachgerückt — in allen drei Sprachen.
Die drei bereits für `About.tsx` zugeschnittenen Porträts
(`src/assets/team-{alejandro,lorenz,julien}.webp`) werden hier
wiederverwendet, nicht erneut zugeschnitten. `TeamFace`s bestehende
Fallback-Logik (Initialen-Kreis nur, wenn `avatar_url` fehlt) brauchte
keine Änderung — `avatar_url` ist jetzt einfach immer gesetzt. `Grid
cols={4}` → `cols={3}`, passend zur neuen Personenzahl. Die
Kreisgröße (`w-20 h-20`, 80px) blieb bewusst unverändert — das war nicht
Teil der Anfrage, und diese Sektion ist als kompakte Vorschau angelegt,
nicht als das ausführliche Team-Kapitel, das `About.tsx` ist.

**Verifikation:** `tsc --noEmit`, `npx eslint src/components/WorkingWith.tsx
src/components/AboutMini.tsx src/lib/translations.ts` und `npm run build`
sauber. Visuell auf `/property-management` bestätigt: alle vier
Partner-Logos in Originalfarben nebeneinander, und die Team-Vorschau zeigt
dieselben drei Personen mit denselben Fotos wie `/about`.

## 44 · Fotos und Logos generell größer

Almedin: „mache alles größer (personen fotos und logos)". Drei Stellen
betroffen:

- **`About.tsx`** (`/about`, das ausführliche Team-Kapitel): Kreise von
  `w-32 h-32` (128px) auf `w-40 h-40` (160px).
- **`AboutMini.tsx`** (die kompakte Vorschau auf `/property-management`,
  in §43 noch bewusst unverändert gelassen): Kreise von `w-20 h-20` (80px)
  auf `w-28 h-28` (112px) — jetzt doch angefasst, weil die Anfrage diesmal
  explizit „alles" sagte, nicht nur eine der beiden Stellen.
- **`WorkingWith.tsx`**: Logo-Slots von `h-10 w-16`/`sm:h-14 sm:w-36` auf
  `h-14 w-[72px]`/`sm:h-20 sm:w-48`.

**Die Mobile-Breite ist keine runde Zahl (`w-[72px]`), sondern nachgerechnet:**
vier Logo-Boxen plus drei `gap-x-xs`-Lücken (12px) müssen in die
Content-Breite eines 375px-Telefons passen (~335px nach Gutter-Abzug,
siehe §36). 4×72 + 3×12 = 324px, knapp unter dem Limit. Ein rundes `w-20`
(80px) hätte 356px ergeben — auf den schmalsten noch relevanten Telefonen
Überlauf riskiert. Live in Chrome DevTools bei 375px geprüft: alle vier
Logos bleiben in einer Zeile, `document.documentElement.scrollWidth >
clientWidth` liefert `false` — kein Seiten-Overflow.

**Verifikation:** `tsc --noEmit`, `npx eslint src/components/WorkingWith.tsx
src/pages/About.tsx src/components/AboutMini.tsx` und `npm run build`
sauber. Visuell bestätigt auf `/about` (1440px), `/property-management`
(1440px) und `/property-management` (375px, Logos).

## 45 · Logos verlinkt, About-Mini-Team bekommt Panel-Cards

**Logos klickbar.** Jedes der vier `WorkingWith`-Logos ist jetzt ein
`<a target="_blank" rel="noopener noreferrer">` auf die eigene Seite des
Partners. Drei URLs kamen direkt von Almedin (sur-film.com, guesty.com,
grupovasari.com); Chekins Adresse hatte er nie geschickt — per Websuche
bestätigt (`chekin.com`, offizielle Domain laut deren eigenem Blog/FAQ),
nicht geraten.

**Edit-Modus-Konflikt gelöst.** `EditableImage` legt im Admin-Edit-Modus
einen eigenen Stift-Button über das Bild, der einen Dialog zum
Bild-Austausch öffnet. Ein Klick darauf hätte als Klick auf den
umschließenden Link gezählt und die Seite verlassen, bevor der Dialog
aufgeht. Fix: `useInlineEdit()` importiert, der Link bekommt im Edit-Modus
ein `onClick={(e) => e.preventDefault()}` — verhindert nur die Navigation,
der Klick blubbert weiterhin zum Stift-Button durch, der Dialog öffnet
sich normal. Für Gäste (immer `editMode === false`) ist der Link
uneingeschränkt normal klickbar.

**`AboutMini.tsx` bekommt dieselben Panel-Cards wie `About.tsx`.**
Almedin: die drei Personen sollen auf der PM-Seite „mit cards abgebildet
werden wie auf about us page". `TeamFace` lief bisher auf einem reinen
`<div className="text-center">` ohne Rahmen; jetzt `<Panel
className="text-center">` — derselbe Goldrand-oben-plus-Flächenton-
Container, den `About.tsx`s Team-Grid, die sechs Zahnrad-Punkte und die
vier Proof-Zahlen bereits verwenden (`layout/Panel.tsx`). Kein neuer
Import nötig außer `Panel` selbst aus `./layout`, das die Datei schon
kennt. Inhalt (Name, Rolle, Foto) unverändert — nur die Umhüllung ist neu.

**Verifikation:** `tsc --noEmit`, `npx eslint src/components/WorkingWith.tsx
src/components/AboutMini.tsx` und `npm run build` sauber. Dev-Server war
zwischen den letzten beiden Sessions abgestürzt (`ERR_CONNECTION_REFUSED`)
— neu gestartet, dann live bestätigt: alle vier Logo-Links liefern die
korrekten `href`/`target="_blank"`-Werte (per `evaluate_script`
ausgelesen), und `/property-management`s Team-Sektion zeigt jetzt
sichtbar dieselben Karten wie `/about`.

**Nachbesserung, selber Tag:** §45 hatte die Karten-Umhüllung übernommen,
aber nicht die Größe — `AboutMini.tsx`s Grid trug noch ein eigenes
`max-w-3xl` (768px) statt `About.tsx`s `Container measure="wide"`
(1024px), und das Foto lief weiter auf `w-28 h-28` (112px) statt `w-40
h-40` (160px). Beides angeglichen: Grid-Cap auf `max-w-5xl` (1024px, exakt
Containers „wide"-Maß), Foto auf `w-40 h-40`. Eine Karte in der
PM-Seiten-Vorschau ist jetzt in Fotogröße und Kartenbreite identisch zu
ihrem Gegenstück auf `/about`, nicht nur im Rahmen-Stil. `tsc --noEmit`,
`npx eslint src/components/AboutMini.tsx` und `npm run build` sauber,
visuell auf `/property-management` bei 1440px bestätigt.
