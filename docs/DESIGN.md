# DESIGN — Layout-System, Typografie, Formatierung

> **Rolle dieser Datei:** Sie regelt, **wie** etwas aussieht — Container, Grid,
> Spacing, Farben, Typo-Skala, Blockmuster. Sie regelt **nicht**, welcher Text
> wo steht: das ist [PROJECT.md](PROJECT.md).
>
> Bei Konflikt zwischen dieser Datei und PROJECT.md gewinnt bei
> **Layout-Architektur** diese Datei, bei **Seitenzuordnung von Inhalten**
> PROJECT.md.

---

## 1 · Der Grundsatz

> **Full-Width-Section → kontrollierter Content-Container → konsistentes Grid →
> konsistentes Spacing**

Die Seite soll auch beim starken Herauszoomen wie **ein einziges, stabiles,
professionell konstruiertes System** aussehen — nicht wie eine Aneinanderreihung
einzelner Landingpage-Module.

```text
┌──────────────────────────────────────────────┐
│               FULL-WIDTH SECTION             │
│     ┌────────────────────────────────┐       │
│     │        CONTENT CONTAINER       │       │
│     │    Text / Image / Cards        │       │
│     └────────────────────────────────┘       │
└──────────────────────────────────────────────┘
```

### Der Zoom-Out-Test

Nach jeder größeren Änderung die Seite bei **100 % / 80 % / 67 % / 50 %** Zoom
ansehen. Bei 50–67 % muss die Gesamtarchitektur weiterhin klar erkennbar sein.
Es darf nicht aussehen wie viele kleine, isolierte Boxen mit großen leeren
Flächen dazwischen.

⚠️ Der Test gilt heute nachweislich nur für die PM-Seite und die Landingpage.
Für die Unterseiten ist er nicht anwendbar, bis sie migriert sind
(PROJECT.md, C5).

---

## 2 · Das Layout-System

Alles Öffentliche baut auf `src/components/layout/` —
`Container`, `Section`, `Grid`, `Stack`, `Surface`, `Divider`.

### Eine Achse

Alle Sections rendern ihren Inhalt durch `<Container>` (1440 px, Gutter
`clamp(1.25rem, 3.5vw, 3rem)`). Vorher hatte jede Section `container mx-auto
px-4` *plus* ein eigenes `max-w-3xl/4xl/5xl/6xl` — vier verschiedene Textkanten
auf einer Seite.

Schmaler wird nur über `measure="wide|text|narrow"`, damit die Verengung eine
**benannte Entscheidung** bleibt.

### Eine Spacing-Leiter

`--space-xs … --space-2xl` in `index.css`, als `py-lg`, `gap-md`, `space-y-sm`
in Tailwind verdrahtet. `<Section size>` kennt `sm | md | lg`.

**Keine neuen `py-<Zahl>`** in öffentlichen Komponenten.

### Ein Grid

12 Spalten, `gap: clamp(16px, 2vw, 32px)` — über `layout/Grid.tsx`. Zu nutzen
für Text+Bild, Destinationen, Feature-Sections, Services, CTA-Bereiche. Nicht
für jede Section eigene, willkürliche Breiten definieren.

> **Wenn eine neue Section nach einem rohen `max-w-*`, `py-<Zahl>` oder eigenem
> `container mx-auto px-4` greift, fehlt etwas im Primitive — dann das Primitive
> erweitern, nicht daran vorbeibauen.**

---

## 3 · Farbwelt

**Beige-Hintergrund · Sage-Grün · Gold-Akzent.** Warm, ruhig, zurückhaltend.
**Keine neuen Farbtöne erfinden.**

- Alle Farben leben als HSL-Tokens in `src/index.css` und werden in
  `tailwind.config.ts` verdrahtet. **Keine Hex-Werte oder `bg-[#...]` im
  Komponentencode.**
- **Gold hat drei Varianten aus Kontrastgründen** — die Unterscheidung nicht
  auflösen:

  | Token | Verwendung |
  |---|---|
  | `bg-accent` | als Fläche (mit `accent-foreground` darauf) |
  | `text-accent-strong` | Text/Icons auf hellen Flächen |
  | `text-accent-on-primary` | Text/Icons auf der grünen `--primary`-Fläche |
  | ~~`text-accent`~~ | erreicht nur 2.19:1 → **nicht benutzen** |

- **Die Seite ist bewusst light-only.** Kein `.dark`-Block, kein Theme-Toggle,
  keine `dark:`-Utilities.
- Schatten, Gradients, Overlays und Glows werden **aus der bestehenden Palette
  abgeleitet** — grüne Schatten aus dem Frontier-Grün, warme aus Cream/Gold,
  dunkle Overlays aus den dunklen Brand-Farben. Keine beliebigen Grau-, Blau-
  oder Schwarzwerte.
- Overlays über Fotos: `--overlay-media` bzw. das `scrim`-Token — das dunkle
  Marken-Grün, **nie** neutrales Schwarz.

### Die Goldlinie

Die dünne Goldlinie ist ein **Akzent, kein Trenner**. Sie gehört an
Grün/Hell-Nähte (`<Section edge>`) und an echte Kapitelwechsel
(`<Divider tone="gold">`) — **nicht zwischen jede Section.** Sie soll wie ein
architektonisches Detail wirken, nicht wie eine Standard-Web-Border.

---

## 4 · Schriften

Playfair Display (Headings) / Lato (Body), **selbst gehostet über
`@fontsource`**.

> **Nie einen Link zu `fonts.googleapis.com` einbauen.** Der Kunde hat Büro und
> Kunden in Österreich — das ist ein DSGVO-Thema und steht als Kommentar in
> `index.css` und `index.html`. Der Fehler ist im Projekt schon zweimal
> passiert (zuletzt in der Vorschau-Iframe des Page-Builders).

Zwei Details, die leicht kaputtgehen:

- Der Variable-Font registriert sich als **`'Playfair Display Variable'`** — ein
  anderer Familienname. `index.css` und `tailwind.config.ts` müssen das kennen,
  sonst fallen alle Überschriften still auf `serif` zurück.
- Lato wird **latin-only** importiert. Die Vollversion bringt latin-ext mit,
  das Vite als base64 ins CSS einbettet — 15 KB im Render-Pfad. latin deckt
  U+0000–00FF ab, also Málaga, Wien und Sauerwald.

---

## 5 · Die Typo-Skala

Sechs Rollen, mehr nicht. Als Klassen `.t-display … .t-meta` in `src/index.css`
(`@layer components`).

| Rolle | Desktop | Mobil | Familie | Gewicht | Verwendung |
|---|---:|---:|---|---:|---|
| **Display** | 64px | 38px | Playfair | 700 | Nur H1. Genau einmal pro Seite. |
| **Section** | 44px | 30px | Playfair | 700 | H2 — Titel einer Section |
| **Block** | 28px | 22px | Playfair | 700 | H3 — Untereinheit innerhalb einer Section |
| **Item** | 18px | 17px | **Lato** | 700 | H4 — einzelner Punkt in einer Aufzählung |
| **Body** | 17px | 16px | Lato | 400 | Fließtext |
| **Meta** | 13px | 12px | Lato | 700 · uppercase · `tracking-[0.12em]` | Eyebrows, Labels, Bildunterschriften |

**Item und Body unterscheiden sich fast nur im Gewicht** (18/700 gegen 17/400).
Das ist Absicht: In einem Layout ohne Karten trennt Gewicht sauberer als Größe.

> **Warum 700 und nicht 600.** Lato besitzt die Schnitte 100 · 300 · 400 · 700 ·
> 900 — **ein 600er existiert nicht.** Ein `font-weight: 600` auf Lato lässt den
> Browser entweder aufrunden oder einen künstlichen Fettschnitt berechnen;
> beides ist unkontrolliert.

> **Warum eine Klasse pro Rolle und keine Tailwind-`fontSize`-Tokens.** Ein
> `fontSize`-Token trägt Größe, Zeilenhöhe, Laufweite und Gewicht — **aber keine
> Schriftfamilie.** Größe und Familie auf zwei Klassen zu verteilen ist genau
> der Mechanismus, durch den zwölf 16px-Überschriften in einer Display-Serif
> gelandet sind. Eine Klasse schweißt beide Entscheidungen zusammen.
>
> Die Größen sind `clamp()`-Werte statt fester Zahlen mit `md:`-Varianten. Das
> entfernt die zweite Driftquelle — Überschriften, bei denen der Breakpoint
> gesetzt wurde und beim Nachbarn nicht.

### Die vier Regeln

1. **Playfair erst ab 28px.** Alles darunter ist Lato.
2. **Eine Ebene = eine Größe, auf allen Seiten.** Eine H2 ist immer Section.
3. **Keine Überschrift darf so groß sein wie die Ebene über ihr.** Wenn eine H4
   optisch nach H2 aussieht, ist entweder die Auszeichnung falsch oder die
   Struktur.
4. **Im Fließtext nur zwei Gewichte:** 400 normal, 700 für die zwei bis drei
   Wörter, die den Satz tragen. Kein 500, kein 600, kein Kursiv.

### Prüfbare Regel

In einer öffentlichen Content-Komponente steht **kein `text-xs` … `text-7xl`**
mehr. Ausgenommen bleiben zwei Ebenen, die nicht zur Content-Typografie gehören:
**UI-Primitives** (shadcn `Button`, `Badge`, `Label`, `Select` — 12/14px) und die
**Navigation** (16px). Für CTA-Buttons gilt einheitlich `text-base`.

Die globale `h1…h6`-Regel in `index.css` bleibt als Rückfallebene für den
Admin-Bereich bestehen; die `.t-*`-Klassen überschreiben sie.

---

## 6 · Das „weniger Boxen"-Prinzip

Leitsatz des Kunden: *„Design wirkt entfernter/übersichtlicher — weniger
Rahmen/Boxes = professioneller."* Die ganze Website wurde darauf umgebaut.

**Das etablierte Muster für neue Sections:**

> Haarlinie oben · Abstand darunter · Icon mit `strokeWidth={1.5}` in
> `accent-strong` — **statt** gefüllter Karte mit Rahmen und Hover-Schatten.

Bevorzugt: große Flächen, Editorial-Layouts, Text + Bild, horizontale
Strukturen, wenige gezielt eingesetzte Cards. Die Seite soll wie eine
**Premium-Hospitality-Plattform** wirken, nicht wie ein SaaS-Dashboard.

**Bewusste Ausnahmen:** Eingabeformulare (profitieren von einem Container) und
echte Platzhalterflächen (eine leere Fläche ohne Begrenzung liest sich als
Layoutfehler).

**Neue `<Card>`-Wrapper um Inhaltsblöcke sind ein Rückschritt und müssen
begründet werden.**

---

## 7 · Das Blockmuster

Jeder Block folgt derselben Abfolge:

```
[Meta-Label]      optional, ein bis drei Wörter
Überschrift       eine Zeile, keine zwei
Ein Satz          was der Block behauptet — genau einer
Inhalt            Liste, Karten, Zahlen, Formular
```

Harte Obergrenzen:

| Element | Maximum |
|---|---:|
| Section gesamt | **120 Wörter** |
| Lede unter einer Überschrift | **1 Satz** |
| Beschreibung eines Items | **12 Wörter** |
| Zeilen pro Überschrift | **1** |

Was über der Grenze liegt, ist nicht zu lang geschrieben — es sind **zwei
Blöcke, die als einer getarnt sind.** Dann wird geteilt, nicht gekürzt.

### Weißraum spreizen

Kraft entsteht durch Kontrast, nicht durch überall „mittel":

| | Abstand |
|---|---|
| Innerhalb einer Gruppe (Item zu Item) | eng — `gap-4` … `gap-6` |
| Zwischen Gruppen (Block zu Block) | `mt-16` … `mt-20` |
| Zwischen Sections | `py-24` … `py-28` |

Faustregel: Der Sprung von „innerhalb" zu „zwischen" soll mindestens Faktor 6
betragen, nicht Faktor 3.

### Der Maßstab steht schon auf der Seite

„Two ways to work with us" ist bereits genau das, worauf alles hinauslaufen
soll — **aktiv und ein Gedanke pro Zeile**:

> ✅ „We run the property and you earn what it earns." (10 W)
> ✅ „We lease the property from you and pay a fixed amount every month." (13 W)

Dagegen aus derselben Seite:

> ❌ „The house rules are communicated through the advertisement to avoid
> misunderstandings and to prevent any damage." (Passiv, zwei Gedanken)

Der Unterschied ist nicht die Länge allein, sondern **Aktiv statt Passiv** und
**ein Gedanke statt zwei**.

---

## 8 · Responsive

Stabil auf großen Desktops, normalen Desktops, Tablets und Mobile. Keine festen
Positionierungen, die bei kleineren Viewports brechen. Unnötiges
`position: absolute` vermeiden — stattdessen Grid, Flexbox, `clamp()`, relative
Maße.

⚠️ Nicht systematisch über alle Breakpoints geprüft. Kein bekannter Bruch, aber
auch kein expliziter Test.

---

## 9 · Offener Refactor-Auftrag (Stand 16.08.2026 — **nicht umgesetzt**)

> Almedin hat einen zweiten, erweiterten Refactor-Auftrag formuliert (bisher als
> loses `design-refactor.md` im Root). Er nimmt **OmniVillas** als zweite
> Referenz neben AvantStay auf. **Nichts davon ist im Code.** Die Punkte unten
> sind offene Vorschläge, keine Beschreibung des Ist-Zustands.

### Was sich mit dem heutigen Stand deckt

Container/Grid/Spacing-System, Full-Width-Sections, Goldlinie als Akzent,
Hero-Kompaktierung, Trust-Zahlen nach dem Hero, „Earns" vor „Relax", Technologie
als dominanter Differenzierer, FAQ auf derselben Silver-Surface wie der Hero,
Zoom-Out-Test, Palette unverändert. Das ist bereits gebaut.

### Was neu wäre — und noch entschieden werden muss

| # | Vorschlag | Konflikt mit heute |
|---|---|---|
| R1 | **„Our Destinations" vollständig entfernen** und Feature Transformations direkt hinter „It's in the Details" ziehen, als Proof-/Case-Study-Section. | 🔴 **Direkter Widerspruch.** Heute steht `ProjectsSection` als Ebene 8 auf der PM-Seite und ist dort ausdrücklich als Discovery-/Portfolio-Kapitel gewollt. Beides geht nicht. |
| R2 | **Visuelle Gewichtung als explizites System** — Level 1 (Major Statement) / Level 2 (Supporting) / Level 3 (Detail), Rhythmus `BIG → SMALL → BIG → MEDIUM → BIG` statt durchgehend MEDIUM. | Ergänzung, kein Widerspruch. Teilweise schon gelebt (`FinancialPerformance` vs. `PropertyManagement`). |
| R3 | **Operating-System-Darstellung** statt Service-Liste: Technology → Revenue → Guest Experience → Operations → Property Care → Owner Visibility als *ein* verbundenes System. | Ergänzung. |
| R4 | **Owner-Visibility-Visual** — eine UI-Darstellung von Revenue, Occupancy, Bookings, Reviews. Ausdrücklich als Visual, nicht als echtes Backend. | Neu. Aufwand nicht trivial. |
| R5 | **CTA-System nach Intent** statt überall „Contact Us": *See What Your Property Could Earn* (Revenue) · *Talk to Our Team* (Management) · *Explore Properties* (Guest) · *Get in Touch* (General). | Ergänzung, teilweise schon so (die zwei Hero-CTAs der PM-Seite). |
| R6 | **Onboarding-/Prozessdarstellung** in fünf Schritten (Tell us → Evaluation → Set up → Go live → Start earning). | Neu. |
| R7 | **Microinteractions** — sanfter Bild-Zoom, dezente Shadow-Änderung, Hover-Reveal, Light Sweep. Subtil, performant, nicht verspielt. | Neu. `prefers-reduced-motion` beachten (`website-stack`). |
| R8 | **Portfolio als kuratierter Editorial-Katalog** statt Grid identischer Airbnb-Cards — große Bilder, Nummerierung, ruhige Typografie. | Betrifft `/properties`, das ohnehin noch auf dem alten Layout läuft. |

**R1 ist die Entscheidung, die zuerst fallen muss** — sie ändert die
Section-Reihenfolge der PM-Seite und damit die Tabelle in PROJECT.md §2.
