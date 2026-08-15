# Frontier Residences — Zielstruktur

> **⚠️ Vorrang:** Für **Layout-Architektur und Section-Reihenfolge** gilt seit
> dem AvantStay-Refactor `docs/GENERAL-STRUCTURE.md`. Bei Widerspruch gewinnt
> jene Datei.
>
> Diese Datei bleibt verbindlich für die Frage, die §27 nicht beantwortet:
> **welcher Inhalt auf welche Seite gehört** — also die Trennung zwischen der
> Gäste-Landingpage und der Eigentümer-Seite. Das ist der historische
> Hauptfehler des Projekts und keine Layout-Frage.

**Diese Datei ist die verbindliche Quelle dafür, WAS auf welcher Seite steht.**

Die Dokumente in `docs/archive/` erklären das WARUM (Strategie-Brief des Besitzers,
Content-Audit). Sie sind als Begründung wertvoll, aber **nicht als Bauanweisung zu
lesen** — sie wurden vor den Entscheidungen unten geschrieben und beschreiben
teilweise den Branch `experiment/one-pager` so, als wäre er der Ist-Zustand.

Basis für alles ist `main`. Aus `experiment/one-pager` wird nur übernommen, was
unten ausdrücklich als Herkunft „experiment" ausgewiesen ist.

---

## Arbeitsweise: zwei Phasen

**Phase 1 — Struktur herstellen.** Sections werden 1:1 verschoben. Kein
Text-Redesign, keine Kürzung, keine neue Farbwelt. Ziel ist nur, dass jeder
Inhalt auf der richtigen Seite liegt.

**Phase 2 — Inhaltlich verdichten.** Erst danach werden Texte gekürzt,
Redundanzen aufgelöst und die Hierarchie geschärft. Grundlage dafür ist
`docs/pm-page-content-analysis.md` — Section-für-Section-Analyse der PM-Seite
mit Redundanz-Landkarte, Streichliste und Ziel: 12 Sections → 8.

Die Vermischung beider Phasen war bisher die Hauptquelle für Missverständnisse.
In Phase 1 gilt: verschieben, nicht verbessern.

**Eine Ausnahme:** Wenn ein Umzug die *Zielgruppe* wechselt, muss der Text früher
mit. Betrifft aktuell Guest Management (siehe unten).

---

## Seite 1 — Booking-Landingpage (`/`)

Gäste-primär, kompakt. Kein Property-Management-Content außer der
Übergangs-Section.

| # | Section | Komponente | Zielgruppe |
|---|---|---|---|
| 1 | Navigation | `Navigation.tsx` | — |
| 2 | Hero + Suchleiste (~62 vh, §7–§9) | `Hero.tsx` (enthält `SearchBar`) | Gast |
| 3 | Trust-Zahlen (§11) | `Stats.tsx` mit `heading=""` | Gast |
| 4 | Property Collections | `PropertyCollections.tsx` | Gast |
| 5 | „It's in the details." | `GuestManagement.tsx` | Gast |
| 6 | **Own a Property?** — die einzige Übergabe | `OwnAProperty.tsx` | Eigentümer |
| 7 | Cashflow Analysis | `PropertyEvaluator.tsx` | Eigentümer |
| 8 | FAQ | `FAQ.tsx` | Gast |
| 9 | Footer | `Footer.tsx` | — |

**Warum diese Reihenfolge:** Der Zielgruppenwechsel passiert **genau einmal**,
bei #6. Vorher standen Collections → Own a Property → Guest Management, was die
Seite zweimal die Zielgruppe wechseln ließ, bevor der Gast mit dem Lesen fertig
war.

⚠️ `Stats.tsx` läuft hier **ohne** Überschrift. „A Portfolio Built on Precision
& Performance" ist an Eigentümer geschrieben; die vier Zahlen selbst sind für
Gäste lesbarer Trust. Die Überschrift nur auf der PM-Seite zeigen.

⚠️ `OwnAProperty.tsx` zeigt die vier Zahlen **nicht mehr** — sie stehen jetzt
oben in `Stats`. Wieder einbauen hieße dieselben vier Zahlen zweimal auf einem
Scroll.

---

## Seite 2 — Property-Management-Seite (`/property-management`)

Eigentümer-primär. Sammelt den gesamten PM-Content.

**Reihenfolge = `GENERAL-STRUCTURE.md` §27.** Sie ist ein Argument, keine
Liste: was es einbringt → was es dich an Aufwand kostet → warum wir → wie das
im Alltag aussieht → wo → wer → wie man anfängt. Ein Block verschoben zerlegt
den Satz, nicht nur das Layout.

| # | §27-Ebene | Komponente |
|---|---|---|
| 1 | Navigation | `Navigation.tsx` |
| 2 | Hero + Kontaktformular (Konversion im ersten Screen) | `PropertyManagementPage.tsx` + `OwnerContactForm.tsx` |
| 3 | **Trust** — Portfolio-Zahlen | `Stats.tsx` (mit Überschrift) |
| 4 | **Earns** — „We manage what the property earns." | `FinancialPerformance.tsx` |
| 5 | **Relax** — „We manage while you relax." | `PropertyManagement.tsx` |
| 6 | **Different** — Technologie dominant, Guest/Property darunter | `WhyItMakesADifference.tsx` |
| 7 | **Details** — „It's in the details." | `ListingWorkflow.tsx` |
| 8 | **Destinations + Transformations** | `ProjectsSection.tsx` (auch auf `/projects`) |
| 9 | **About / Trust** | `AboutMini.tsx` |
| 10 | **Two ways to start** (Renovations & Investments darin verschachtelt) | `WaysToWorkTogether.tsx` |
| 11 | FAQ | `FAQ.tsx` |
| 12 | **CTA** — „Get in touch." | `GetInTouch.tsx` |
| 13 | Footer | `Footer.tsx` |

**Zwingend (§12):** *Earns* steht vor *Relax*. **Zwingend (§15/§16):**
*Different* steht vor *Details* — der Anspruch muss vor seinem eigenen Beleg
kommen, sonst trifft der Leser eine Aufgabenliste ohne etwas, woran sie hängt.

**Gewicht ist absichtlich ungleich (§14):** `FinancialPerformance` bekommt
`size="lg"` und das volle Grid, `PropertyManagement` ist eine ruhige Zeile auf
`tone="muted"`. Beide gleich stark zu gestalten war ausdrücklich nicht
gewünscht.

**Der Cashflow-Rechner steht nicht mehr auf dieser Seite (§13)** — nur ein
Button nach `/evaluate`. `BeyondManagement.tsx` ist aufgelöst, Renovations und
Investments hängen unter *Guaranteed Income* (§21).

**Guaranteed Income, Renovations, Investments** bleiben eigenständige Unterseiten
(`/guaranteed-income`, `/renovations`, `/investments`). Die PM-Seite bekommt in
Phase 2 eine kompakte Teaser-Ebene, die dorthin verlinkt.

---

## Header-Navigation

**Stand 15.08.2026** (`Navigation.tsx`) — zwei der vier Punkte sind
Dropdowns, kein Direkt-Link mehr:

**Property Management** ⌄ · **Stay With Us** ⌄ · **About Us** · **Sign In**

| Label | Ziel | Dropdown |
|---|---|---|
| Property Management | `/property-management` | → Property Management (nochmal) · **Property Evaluator** (Anker `#property-evaluation`, Button statt Link) |
| Stay With Us | `/properties` | → Properties (`/properties`) · Our Newest Posts (Instagram, extern) |
| About Us | `/about` — die Seite bleibt als eigene Seite bestehen | — |
| Sign In | `/auth` | — |

Property Evaluator ist damit aus der Hauptzeile ins Property-Management-Dropdown
gewandert, „Book Your Stay" heißt jetzt „Stay With Us". `/business-areas` und
`/projects` sind keine Menüpunkte mehr. Die `/about`-Seite bleibt vollständig
erhalten und verlinkt; die PM-Seite bekommt zusätzlich die kompakte
`AboutMini`-Variante als Section.

---

## Nicht anfassen

- Buchungs-Engine, Guesty-Anbindung, Stripe
- Das `EditableText`-CMS (Mechanik; einzelne Texte dürfen sich ändern)
- Farbpalette: Green / Cream / Gold / Brown wie auf `main`. Keine neuen Farbtöne,
  keine Beige-Varianten aus dem Experiment-Branch.

---

## Protokoll der Entscheidungen

| Frage | Entscheidung |
|---|---|
| Basis für alles | `main` |
| Aus `experiment/one-pager` übernehmen | Nur `StaysYouLove` und `AboutMini` |
| Hero-Headline „Bespoke Property Management" | Gehört auf die PM-Seite, nicht auf die Booking-Landingpage |
| Guaranteed Income | Bleibt unter Property Management, keine eigene „Zwei Modelle"-Ebene |
| Investments | Bleibt bei PM (Teaser + eigene Unterseite), keine eigene Hauptrubrik |
| Renovations | Bleibt bei PM (Teaser + eigene Unterseite) |
| Landing-Hero und PM-Hero | Zwei verschiedene Heroes |
| Bestehende PM-Seite | Bleibt Basis, wird erweitert — nicht neu gebaut |
| Unterseiten GI/Renovations/Investments | Bleiben bestehen, PM-Seite verlinkt nur |
| Cashflow Analysis | Formular auf `/` und auf `/evaluate`. Die PM-Seite verlinkt nur noch dorthin (§13) — kein zweites eingebettetes Formular. |
| Projects | Inhalt als Section auf PM-Seite, Nav-Punkt entfällt |
| About Us | `AboutMini` als Section auf der PM-Seite; `/about` bleibt als Seite **und** als Menüpunkt |
| Guest Management | Gehört auf die Booking-Landingpage, nicht auf die PM-Seite |
| Header-Navigation | Property Management · Book Your Stay · About Us · Property Evaluator |
| Farbpalette | `main` ist Referenz |

---

## Offene Punkte

1. **Guest-Management-Texte:** ✅ gelöst — die vier Punkte sind auf den Gast
   umgeschrieben (zweite Person), die Screening-Karte formuliert dieselbe
   Tatsache von der Seite des Lesers.
2. **Landing-Hero-Headline** ist ein Platzhalter
   („Luxury Villas & Vacation Rentals in Spain and Austria"), vom Besitzer
   abzusegnen.
3. **„Own a Property?"-Texte** sind ein erster Entwurf und vom Besitzer
   abzusegnen — insbesondere „earn **with** us" (Partnerschaft, Provisionsmodell)
   gegenüber „earn **from** us" (das wäre Guaranteed Income, also Festmiete).
4. **Testimonials** für die Proof-Ebene der PM-Seite müssen vom Besitzer kommen;
   können nicht erfunden werden.
5. **SEO:** Der bisherige PM-Seitentitel „Luxury Property Management Designed for
   Exceptional Homes" war keyword-stärker als „Bespoke Property Management".
   Der keyword-starke Begriff könnte im `<title>`-Tag erhalten bleiben.
6. **`/business-areas`** ist kein Menüpunkt mehr, existiert aber weiter als Route.
   Offen, ob die Seite bestehen bleibt oder in der PM-Seite aufgeht.
7. **Kontaktweg für Eigentümer:** ✅ gelöst — Kontaktformular ist jetzt der
   Hero der PM-Seite (`OwnerContactForm.tsx`).
8. **Cal.com-Termin-Button ist provisorisch.** `OwnerContactForm.tsx` verlinkt
   aktuell auf Almedins eigenen Cal.com-Link
   (`cal.com/almedin-sinanovic-ff4chx/videocall-mit-mir`), weil Frontier
   Residences noch keinen eigenen hat. Muss ausgetauscht werden, sobald der
   Kunde einen liefert.
9. **FAQ auf der PM-Seite ist wortwörtlich die gästeseitige FAQ** von `/`
   (Buchungsablauf, Check-in, Storno), nur mit neuer Überschrift. Das ist die
   Umkehrung des Projekt-Hauptfehlers (Gäste-Sprache auf einer
   Eigentümer-Seite) — bewusst so von Almedin angefordert, aber wenn eigentümer-
   spezifische Fragen gewünscht sind, braucht es eigenen Content.
10. **Hero-/Formularbild ist eine Zweitverwertung von `about-hero.webp`**
    (bereits das Bild der About-Seite), weil kein dediziertes Bild existierte.
    Über `EditableImage` im Admin austauschbar.
11. **„It's in the details." steht jetzt auf beiden Seiten.** §16 verlangt die
    Formulierung als Detailebene der PM-Seite (`ListingWorkflow.tsx`); sie war
    bereits die Überschrift der Gäste-Section auf `/`
    (`GuestManagement.tsx`). Zwei Seiten, zwei Zielgruppen — kaputt ist das
    nicht, aber eine der beiden sollte einen eigenen Titel bekommen. Die
    Gäste-Fassung nicht ohne Rückfrage ändern: der Text dort ist geprüft.
12. **`Stats.tsx` hat jetzt einen `heading`-Prop.** Leerer String = nur die
    Zahlen (Startseite), gesetzt = Kapitelüberschrift (PM-Seite). Wer die
    Überschrift auf `/` einschaltet, holt Eigentümer-Sprache auf die
    Gäste-Seite zurück.
13. **Die drei Before-/After-Rahmen auf der PM-Seite sind weiterhin
    Platzhalter** („Coming Soon"). Die Bildunterschrift „Before and After"
    sitzt seit §18 **unter** dem Rahmen — sie funktioniert unverändert
    weiter, sobald echte Fotos in den Rahmen wandern.
