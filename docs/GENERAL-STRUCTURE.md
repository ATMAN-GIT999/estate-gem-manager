# Frontier Residences — AvantStay-inspirierter Layout- und Design-Refactor

> ## Stand 15.08.2026 — größtenteils umgesetzt
>
> Dieses Dokument war ursprünglich ein Umbau-Auftrag (Imperativ: „Überarbeite…",
> „Refactore…"). Er ist inzwischen zu **~90 % umgesetzt** — jeder Abschnitt trägt
> jetzt eine eigene Status-Zeile. Es bleibt trotzdem das führende Dokument für
> Layout-Architektur (siehe `CLAUDE.md`): Konflikte mit anderen Docs entscheidet
> weiterhin dieses hier, und die Prinzipien (Container/Grid/Spacing-Leiter,
> Goldlinie als Akzent, Zoom-Out-Test) gelten unverändert als Regel für alles
> Neue.
>
> **Die eine große Lücke:** Das Layout-System (`src/components/layout/`) läuft
> nur auf der Property-Management-Seite und der Landingpage. Alle Unterseiten
> — `/renovations`, `/investments`, `/guaranteed-income`, `/about`,
> `/properties`, `/business-areas` — sind unverändert im alten Muster. Details
> in `docs/open-todos.md`, Punkt 9.

Überarbeite die bestehende **Frontier Residences Website**, insbesondere die Homepage und die Property-Management-Erfahrung, mit **AvantStay als professionellem Referenzpunkt für Informationsarchitektur, Layout-Hierarchie, Content-Gruppierung, Spacing und Conversion Flow**.

**Wichtig:** AvantStay soll **nicht visuell kopiert** werden. Übernimm die strukturellen Prinzipien einer professionellen Vacation-Rental-/Property-Management-Plattform, behalte aber die **eigene visuelle Identität, Farbpalette, Typografie, Bilder und den Charakter von Frontier Residences**.

Das Ziel ist eine Website, die beim normalen Scrollen hochwertig wirkt und beim starken Herauszoomen ebenfalls wie **ein einziges, stabiles und professionell konstruiertes System** aussieht.

---

# 1. Grundziel — zuerst die Website-Architektur verbessern

> **Status 15.08.2026: ✅ erledigt** — `src/components/layout/`, aber bisher nur auf der PM-Seite und der Landingpage verdrahtet. Unterseiten offen, siehe `open-todos.md` Punkt 9.

Die aktuelle Seite enthält viele Sections, die einzeln funktionieren. Beim Herauszoomen wird jedoch sichtbar:

* Inhalte sind teilweise zu schmal
* zu viel ungenutzte horizontale Fläche
* uneinheitliche Breiten
* uneinheitliche vertikale Abstände
* zu viele isolierte Cards / Container
* unterschiedliche Geometrien zwischen Sections
* manche Bereiche wirken wie einzelne Landingpage-Module statt wie Teile einer gemeinsamen Website

Deshalb soll nicht einfach jede Section einzeln „schöner“ gemacht werden.

**Refactore zuerst das globale Layout-System.**

Das Grundprinzip soll sein:

> **Full-Width Section → kontrollierter Content-Container → konsistentes Grid → konsistentes Spacing**

---

# 2. AvantStay als strukturelles Referenzmodell

Nutze AvantStay als Benchmark für die **Informationsarchitektur** und nicht als visuelle Vorlage.

Die übergeordnete Logik soll ungefähr so funktionieren:

```text
Header
↓
Hero + Search / Conversion
↓
Trust / Portfolio Numbers
↓
Primary Value Proposition
↓
Benefits / Services
↓
Property / Destination Discovery
↓
Differentiation / Technology
↓
Social Proof / About
↓
Additional Services
↓
FAQ
↓
Final CTA
↓
Footer
```

Frontier Residences soll dadurch stärker wie eine **professionelle Hospitality-/Real-Estate-Plattform** wirken und weniger wie eine Aneinanderreihung einzelner Sections.

---

# 3. Globales Layout-System schaffen

> **Status: ✅ erledigt.**

Bevor einzelne Sections neu gestaltet werden, soll ein gemeinsames Layout-System etabliert werden.

## Globaler Content-Container

Nutze eine zentrale maximale Content-Breite für die Website.

Beispiel:

```css
.container {
  width: min(100% - 48px, 1440px);
  margin-inline: auto;
}
```

Der exakte Wert darf an die bestehende Website angepasst werden.

Wichtig ist:

**Die wichtigsten Sections sollen dieselben linken und rechten Content-Grenzen verwenden.**

Dadurch entsteht eine klare vertikale Achse über die gesamte Seite.

---

# 4. Einheitliches 12-Spalten-Grid

> **Status: ✅ erledigt** (`layout/Grid.tsx`).

Für größere Layouts ein konsistentes Grid verwenden.

Beispiel:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 32px);
}
```

Das Grid soll für folgende Bereiche genutzt werden:

* Text + Bild
* Destinationen
* Feature Sections
* Technology
* Services
* CTA-Bereiche
* größere Content-Kompositionen

Nicht für jede Section eigene, willkürliche Breiten definieren.

---

# 5. Full-Width Sections + kontrollierter Content

> **Status: ✅ erledigt** (`layout/Section.tsx`, `layout/Container.tsx`).

Die Sections selbst dürfen die gesamte Browserbreite einnehmen.

Der eigentliche Content bleibt innerhalb des globalen Containers.

Also:

```text
┌──────────────────────────────────────────────┐
│               FULL-WIDTH SECTION             │
│                                              │
│     ┌────────────────────────────────┐       │
│     │        CONTENT CONTAINER       │       │
│     │                                │       │
│     │    Text / Image / Cards        │       │
│     │                                │       │
│     └────────────────────────────────┘       │
│                                              │
└──────────────────────────────────────────────┘
```

Damit verschwinden die momentan sichtbaren riesigen, ungenutzten Flächen links und rechts.

---

# 6. Einheitliches vertikales Spacing

> **Status: ✅ erledigt** (`--space-xs … --space-2xl` in `index.css`).

Die aktuellen Sections haben teilweise zu große bzw. uneinheitliche Abstände.

Erstelle ein konsistentes Spacing-System.

Zum Beispiel:

```text
XS   12px
SM   24px
MD   40px
LG   64px
XL   96px
2XL  140px
```

Oder eine gleichwertige responsive Lösung mit `clamp()`.

Diese Werte sollen für:

* Section Padding
* Überschriften
* Textabstände
* CTA-Abstände
* Card-Gaps
* Content-Gruppen

wiederverwendet werden.

Nicht für jede einzelne Section neue Abstände erfinden.

---

# 7. Hero deutlich kompakter machen

> **Status: ✅ erledigt** — Landingpage-Hero, ~62vh statt `min-h-screen`.

Der aktuelle Hero bzw. die Video-/Bildfläche ist zu dominant.

Reduziere die sichtbare Höhe des Hero-Mediums auf ungefähr **50–60 % der aktuellen Höhe**.

Wichtig:

Nicht einfach nur die Höhe des bestehenden Videos verkleinern.

Die gesamte Komposition aus:

* Headline
* Supporting Text
* Search Engine
* Bild/Video

soll neu ausbalanciert werden.

Das Bild/Video soll den Content unterstützen und nicht selbst die komplette erste Bildschirmfläche dominieren.

---

# 8. Hero — Text und Suchmaschine als eine Einheit

> **Status: ✅ erledigt.**

Die Search Engine soll nicht wie ein zufällig darübergelegtes Element wirken.

Sie soll ein **zentraler Bestandteil des Hero-Designs** sein.

Die Hierarchie sollte ungefähr so funktionieren:

```text
Headline

Supporting Text

┌─────────────────────────────────────────────┐
│ Where to? │ Check-in │ Check-out │ Guests │ Search │
└─────────────────────────────────────────────┘

Background Image / Video
```

Text und Search müssen visuell zusammengehören.

Die Suchmaschine soll als primärer Conversion-Mechanismus sofort verständlich sein.

---

# 9. Hero-Headline

> **Status: ✅ erledigt** — Headline steht wortgleich im Code.

Die bestehende Headline soll klar und hochwertig präsentiert werden:

**Luxury Villas & Vacation Rentals in Spain and Austria**

Der Titel soll genügend Raum erhalten, ohne unnötig klein oder zu schmal gesetzt zu werden.

Supporting Text darunter kompakt halten und nicht mit der Search Engine konkurrieren lassen.

---

# 10. Bestehende Frontier-Farbpalette vollständig beibehalten

> **Status: laufende Regel, eingehalten.**

**Keine neue Farbwelt einführen.**

Nutze die aktuelle Frontier-Residences-Palette weiter:

* bestehende Grüntöne
* bestehende Cream-/Off-White-Töne
* bestehende neutrale Töne
* bestehende Gold-Akzente
* bestehende dunkle Brand-Farben

---

## Besonders wichtig bei Schatten und Effekten

Für:

* Shadows
* Gradients
* Overlays
* Glows
* Borders
* Depth Effects

sollen **nahe Varianten der bereits vorhandenen Farben** verwendet werden.

Beispielsweise:

* grüne Schatten aus dem bestehenden Frontier-Grün ableiten
* warme Schatten aus Cream/Braun/Gold ableiten
* dunkle Overlays aus den vorhandenen dunklen Brand-Farben ableiten
* helle Effekte aus dem bestehenden White/Cream/Silver-Bereich ableiten

Keine zufälligen neuen Farben einführen.

---

# 11. Trust / Portfolio Numbers direkt nach dem Hero

> **Status: ✅ erledigt** (`Stats.tsx`, jetzt mit `heading`-Prop für beide Seiten).

Direkt nach Hero + Search soll ein klarer Trust-/Statistics-Block stehen.

Verwende die bestehenden Kennzahlen:

* **41 Properties Managed**
* **1500+ Guest Reviews**
* **8 Destinations**
* **50+ Collaborators**

Diese Zahlen sollen als **breiter, sauber strukturierter Trust-Bereich** gestaltet werden.

Nicht als kleine, mittig schwebende Gruppe.

Die Section soll visuell genügend Breite und Gewicht haben.

---

# 12. WICHTIG — Reihenfolge der beiden Sections ändern

> **Status: ✅ erledigt und verifiziert** — `FinancialPerformance` steht vor `PropertyManagement` in `PropertyManagementPage.tsx`.

Diese beiden Sections müssen ihre Position tauschen.

### Neue Reihenfolge:

**1. We Manage What the Property Earns**

↓

**2. We Manage While You Relax**

Diese Reihenfolge ist verbindlich.

---

# 13. “We Manage What the Property Earns”

> **Status: ✅ erledigt** (`FinancialPerformance.tsx`).

Diese Section soll als eine der wichtigsten Value-Proposition-Sections der Seite funktionieren.

Sie soll vermitteln:

* Revenue Performance
* Occupancy
* Financial Visibility
* Property Profitability
* Strategic Management

Die **Property Cash Flow Analysis** soll nicht mehr als großes Formular innerhalb dieser Section dargestellt werden.

Stattdessen:

* kurze Erklärung
* kurze Darstellung des Nutzens
* klarer CTA
* Button führt auf die separate **Property Cash Flow Analysis Page**

Die Analyse selbst bleibt auf der separaten Seite.

---

# 14. “We Manage While You Relax”

> **Status: ✅ erledigt** (`PropertyManagement.tsx`).

Diese Section folgt unmittelbar danach.

Sie soll vor allem vermitteln:

* weniger Aufwand für den Eigentümer
* Convenience
* professionelle Betreuung
* Peace of Mind
* Hands-off Ownership

Die Section darf bewusst etwas ruhiger wirken und soll die vorherige Revenue-Section ergänzen.

Nicht beide Sections gleich stark gestalten.

---

# 15. Zentrale Differenzierungs-Section

> **Status: ✅ erledigt** (`WhyItMakesADifference.tsx`).

Baue eine größere Section nach dem Prinzip:

## “What Makes Frontier Residences Different?”

Hier soll der wichtigste strategische Unterschied erklärt werden:

**Technology + Operational Organization + Revenue Intelligence + Human Management**

Diese Section sollte nicht aus vier gleich großen Cards bestehen.

Stattdessen eine klare Hierarchie schaffen.

### Empfohlene Struktur:

```text
┌─────────────────────────────────────────────┐
│                                             │
│    Technology That Refines Property         │
│    Management                               │
│                                             │
│    AI / Systems / Organization              │
│    Dashboards / Visibility                  │
│                                             │
├────────────────────────┬────────────────────┤
│ Guest Management       │ Property Care      │
└────────────────────────┴────────────────────┘
```

Die Technology-Section soll visuell dominant sein.

Guest Management und Property Care sind darunter die unterstützenden klassischen Leistungen.

---

# 16. “It’s in the Details”

> **Status: ✅ erledigt** (`ListingWorkflow.tsx`) — steht jetzt aber wortgleich auch als Titel einer Gäste-Section auf `/`, siehe `open-todos.md` Punkt 9.

Das bestehende Konzept **“It’s in the details”** soll als zweite Detailebene funktionieren.

Hier können die konkreteren Leistungen kompakt zusammengefasst werden:

* Guest Communication
* Cleaning Quality
* Property Inspections
* Maintenance Coordination
* Owner Communication
* Operational Responsiveness

Nicht jede dieser Leistungen als eigene große Section darstellen.

Die Section soll die große Differenzierungsbotschaft mit konkreten Details belegen.

---

# 17. Our Destinations

> **Status: ✅ erledigt** (`ProjectsSection.tsx`).

## “Our Destinations”

soll als klare Kapitelüberschrift behandelt werden.

Die Überschrift soll stärker wirken als die direkt nachfolgende kleinere Feature-Transformation-Section.

Darunter die Destinationen sauber und breit darstellen.

Die Section soll wie ein **Discovery-/Portfolio-Kapitel** wirken.

---

# 18. Feature Transformations

> **Status: ✅ erledigt.**

Danach:

## “Feature Transformations”

Hier die bestehenden Before-/After-Bilder verwenden.

Die Überschrift:

**Before and After**

und der erklärende Text sollen **unter bzw. direkt unterhalb des entsprechenden Bildbereichs** erscheinen.

Die Hierarchie:

```text
Our Destinations
↓
Destination Content

Feature Transformations
↓
Transformation Images
↓
Before / After Text
```

---

# 19. About / Trusted Agency

> **Status: ✅ erledigt** (`AboutMini.tsx`) — die eigenständige `/about`-Seite selbst läuft noch auf dem alten Layout-System.

Die bestehende About-/Trusted-Agency-Section erhalten.

Sie soll innerhalb des globalen Containers neu ausgerichtet werden.

Funktion dieser Section:

* Vertrauen
* Professionalität
* lokale Kompetenz
* persönliche Betreuung
* Markenidentität

Nicht unnötig viele Cards verwenden.

---

# 20. “Two Ways to Start with Us”

> **Status: ✅ erledigt** (`WaysToWorkTogether.tsx`).

Diese Section soll stärker wie ein hochwertiges Editorial-/Architektur-Layout wirken und nicht wie zwei große Standard-Cards.

Die beiden Hauptmöglichkeiten:

### Full Service Management

### Guaranteed Income

Die Darstellung soll mit:

* dünnen Goldlinien
* bestehenden Grün-Akzenten
* horizontalen Trennlinien
* Typografie
* Spacing
* kleinen geometrischen Details

arbeiten.

---

# 21. Renovations and Design + Investments integrieren

> **Status: ✅ erledigt** — als kleinere Unterpunkte unter Guaranteed Income verschachtelt.

Die bisherigen großen eigenständigen Boxen:

* Renovations and Design
* Investments

sollen aufgelöst werden.

Sie werden stattdessen unter:

### Guaranteed Income

integriert.

Neue Hierarchie:

```text
Two Ways to Start with Us

Full Service Management

Guaranteed Income
    ├── Renovations & Design
    └── Investments
```

Die beiden Unterpunkte sollen:

* deutlich kleiner sein
* als Secondary Services erkennbar sein
* nicht mit den beiden Hauptoptionen konkurrieren
* aber weiterhin hochwertig und sichtbar dargestellt werden

---

# 22. “Two Ways to Start with Us” stärker visuell strukturieren

> **Status: ✅ erledigt.**

Diese Section darf mehr Linien und Farbbetonung bekommen.

Verwende dafür:

* dünne Goldlinien
* dezente grüne Akzente
* horizontale Verbindungen
* subtile geometrische Details
* größere typografische Hierarchie

Aber:

**Keine UI-Dashboard-Optik und keine überladene Kartenstruktur.**

Die Section soll eher nach:

**Luxury Editorial + Architecture**

aussehen.

---

# 23. FAQ

> **Status: ✅ erledigt** (`<Surface material="silver">`, gemeinsam mit dem Hero).

Die komplette FAQ-Box soll den gleichen **silber-weiß schimmernden, hellen Premium-Hintergrund** verwenden wie der Hero.

Dabei:

* weiche silber/weiße Highlights
* dezente, aus der bestehenden Farbpalette abgeleitete Schatten
* leicht abgerundete Kanten
* klarer Kontrast für Text
* sauberes Accordion

Dadurch entsteht eine visuelle Verbindung zwischen Hero und FAQ.

---

# 24. Goldlinien als Designsystem

> **Status: ✅ erledigt** (`<Section edge>` in `layout/Section.tsx`).

Die bestehende dünne Goldlinie soll erhalten bleiben.

Sie soll als wiederkehrendes Designelement genutzt werden:

* zwischen wichtigen Sections
* bei Übergängen
* als Akzent
* bei bestimmten Überschriften oder Strukturen

Aber **nicht zwischen jeder einzelnen Section**.

Die Linie soll wie ein hochwertiges architektonisches Detail wirken.

---

# 25. Weniger Cards, mehr große Flächen

> **Status: ✅ weitgehend erledigt auf PM-Seite und Landingpage.** Die Unterseiten (`/renovations`, `/investments`, `/guaranteed-income`, `/about`) haben noch die alten weißen Karten mit Rahmen und Schatten.

Nicht jede Information als Card darstellen.

Bevorzugt:

* große Flächen
* Editorial Layouts
* Text + Bild
* große visuelle Blöcke
* horizontale Strukturen
* wenige, gezielt eingesetzte Cards

Die Seite soll wie eine **Premium-Hospitality-/Real-Estate-Plattform** wirken und nicht wie ein SaaS-Dashboard.

---

# 26. Responsive Verhalten

> **Status: ⚠️ nicht systematisch geprüft.** Kein bekannter Bruch, aber kein expliziter Test über alle Breakpoints.

Die gesamte Struktur muss stabil funktionieren auf:

* großen Desktop-Displays
* normalen Desktop-Displays
* Tablets
* Mobile

Keine festen Positionierungen, die bei kleineren Viewports brechen.

Vermeide unnötiges `position: absolute`.

Nutze stattdessen:

* Grid
* Flexbox
* responsive Container
* `clamp()`
* relative Maße

---

# 27. Zoom-Out-Test

> **Status: ⚠️ gilt nachweislich für PM-Seite und Landingpage.** Für die Unterseiten (altes Layout-System) nicht anwendbar, bis sie migriert sind.

Nach dem Refactor die Seite bei folgenden Zoom-Stufen prüfen:

* 100 %
* 80 %
* 67 %
* 50 %

Bei 50–67 % muss die Gesamtarchitektur weiterhin klar erkennbar sein:

```text
HEADER
↓
HERO + SEARCH
↓
TRUST
↓
WE MANAGE WHAT THE PROPERTY EARNS
↓
WE MANAGE WHILE YOU RELAX
↓
WHAT MAKES US DIFFERENT
↓
IT'S IN THE DETAILS
↓
OUR DESTINATIONS
↓
FEATURE TRANSFORMATIONS
↓
ABOUT / TRUST
↓
TWO WAYS TO START WITH US
↓
FAQ
↓
CTA
↓
FOOTER
```

Es darf beim Herauszoomen nicht mehr aussehen wie viele kleine, voneinander isolierte Boxen mit großen leeren Flächen dazwischen.

---

# 28. Technischer Refactor

> **Status: ✅ erledigt** (`src/components/layout/`).

Nicht versuchen, die Probleme durch immer mehr individuelle CSS-Regeln für einzelne Sections zu lösen.

Stattdessen zuerst gemeinsame UI-/Layout-Primitives schaffen:

```text
Container
Section
Grid
Stack
Surface
Divider
Button
Heading
```

Danach bestehende Sections auf dieses System umstellen.

Das Ziel:

**Ein Designsystem → viele Sections**

und nicht:

**Viele Sections → viele unterschiedliche CSS-Systeme**

---

# 29. Zielbild

Die fertige Seite soll:

* hochwertig
* ruhig
* architektonisch
* professionell
* großzügig
* strukturiert
* conversion-orientiert
* konsistent
* technisch stabil

wirken.

Die Website soll die **strukturelle Professionalität und Informationsarchitektur einer Plattform wie AvantStay** erreichen, aber optisch und markentechnisch eindeutig **Frontier Residences** bleiben.

---

# 30. Wichtigster Punkt

Bitte nicht einfach die bestehenden Sections noch einmal optisch verschönern.

**Refactore die zugrunde liegende Layout-Architektur, das Grid, die Container, das Spacing und die Content-Hierarchie.**

Dadurch soll die gesamte Website als **ein zusammenhängendes System** funktionieren.

Verwende dabei konsequent die **bestehende Frontier-Residences-Farbpalette**, auch für Schatten, Overlays, Gradients und Glow-Effekte. Neue Farben nur dann verwenden, wenn sie direkt aus den bestehenden Farben abgeleitet sind.

Und zwingend:

**“We Manage What the Property Earns” kommt vor “We Manage While You Relax”.**
