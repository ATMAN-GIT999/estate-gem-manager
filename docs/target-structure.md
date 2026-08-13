# Frontier Residences — Zielstruktur

**Diese Datei ist die einzige verbindliche Quelle dafür, WAS gebaut wird.**

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

Gäste-primär, kompakt. Kein Property-Management-Content außer der Übergangs-Section.

| # | Section | Komponente | Herkunft | Status |
|---|---|---|---|---|
| 1 | Navigation | `Navigation.tsx` | main | ✅ umgebaut |
| 2 | Hero mit Booking-Engine | `Hero.tsx` (enthält `SearchBar`) | main | ✅ neue Headline (Platzhalter) |
| 3 | Stays You'll Love | `StaysYouLove.tsx` | experiment | ✅ erledigt |
| 4 | Guest Management | `GuestManagement.tsx` | main, aus `PropertyManagement` extrahiert | ✅ verschoben, ⚠️ Text offen |
| 5 | **Own a Property?** | `OwnAProperty.tsx` | **neu** | ✅ gebaut — goldenes Band, randlos; Texte als erster Entwurf |
| 6 | Cashflow Analysis | `PropertyEvaluator.tsx` | main | vorhanden |
| 7 | Footer | `Footer.tsx` | main | vorhanden |

✅ **Von der Landingpage entfernt** (jetzt auf der PM-Seite):
`IntroSection.tsx`, `Stats.tsx`, `BusinessAreas.tsx`, `TechnologySection.tsx`,
`PropertyManagement.tsx`.

---

## Seite 2 — Property-Management-Seite (`/property-management`)

Eigentümer-primär. Sammelt den gesamten PM-Content.

**Phase 2 (13.08.2026): Kontaktformular als CTA nach vorne, Guest/Property zu
„Why it makes a difference" verschmolzen, Renovations/Investments als eigene
Section, Zwei-Modelle-Vergleich als Linienbalken.** Tabelle unten ist der
aktuelle Ist-Zustand, nicht mehr die Phase-1-Verschiebung.

| # | Section | Komponente | Status |
|---|---|---|---|
| 1 | Navigation | `Navigation.tsx` | ✅ |
| 2 | Hero + Kontaktformular (Bild daneben, „Send enquiry" + Cal.com-Termin-Button) | `PropertyManagementPage.tsx` + `OwnerContactForm.tsx` | ✅ — Cal.com-Link ist Almedins eigener, provisorisch (siehe offene Punkte) |
| 3 | Portfolio-Zahlen + CTA zum Cashflow-Rechner | `Stats.tsx` | ✅ |
| 4 | „We manage what the property earns." (Financial Performance) | `FinancialPerformance.tsx` | ✅ |
| 5 | Cashflow-Rechner | `PropertyEvaluator.tsx` | ✅ |
| 6 | „We manage while you relax." (Listing-Intro, eine Fläche) | `PropertyManagement.tsx` | ✅ — Guest/Property-Pillars ausgelagert nach #8 |
| 7 | „This is how we work together." (4 Listing-Cards, dunkler Hintergrund) | `ListingWorkflow.tsx` | ✅ **neu** |
| 8 | „Our Destinations" / Before & After (dunkler Hintergrund, weiße Schrift) | `ProjectsSection.tsx` | ✅ — auch auf `/projects` |
| 9 | „Why it makes a difference." (Technology + Guest Management + Property Care, reduziert) | `WhyItMakesADifference.tsx` | ✅ **neu**, ersetzt `TechnologySection.tsx` (gelöscht) |
| 10 | About Us (kompakt) | `AboutMini.tsx` | unverändert |
| 11 | „What else we do?" (Renovations & Investments, zwei Container) | `BeyondManagement.tsx` | ✅ **neu**, aus `WaysToWorkTogether.tsx` gelöst |
| 12 | „Two ways to start to work with us." (Linienbalken statt Karten) | `WaysToWorkTogether.tsx` | ✅ redesignt |
| 13 | FAQ („Frequently Asked Questions", ohne Eyebrow) | `FAQ.tsx` | ✅ — Inhalt bleibt gästeseitig formuliert, siehe offene Punkte |
| 14 | „Get in touch." (kleine CTA vor dem Footer) | `GetInTouch.tsx` | ✅ **neu** |
| 15 | Footer | `Footer.tsx` | ✅ erweitert (Adresse, FAQ-Link) |

**Phase 1 ist damit abgeschlossen.** Beide Seiten sind strukturell vollständig.

**Guaranteed Income, Renovations, Investments** bleiben eigenständige Unterseiten
(`/guaranteed-income`, `/renovations`, `/investments`). Die PM-Seite bekommt in
Phase 2 eine kompakte Teaser-Ebene, die dorthin verlinkt.

---

## Header-Navigation

**Property Management** · **Book Your Stay** · **About Us** · **Property Evaluator**

| Label | Ziel |
|---|---|
| Property Management | `/property-management` |
| Book Your Stay | `/properties` |
| About Us | `/about` — die Seite bleibt als eigene Seite bestehen |
| Property Evaluator | Anker `#property-evaluation` (Button, kein Link) |

`/business-areas` und `/projects` sind keine Menüpunkte mehr. Die `/about`-Seite
bleibt vollständig erhalten und verlinkt; die PM-Seite bekommt zusätzlich die
kompakte `AboutMini`-Variante als Section.

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
| Cashflow Analysis | Auf **beiden** Seiten |
| Projects | Inhalt als Section auf PM-Seite, Nav-Punkt entfällt |
| About Us | `AboutMini` als Section auf der PM-Seite; `/about` bleibt als Seite **und** als Menüpunkt |
| Guest Management | Gehört auf die Booking-Landingpage, nicht auf die PM-Seite |
| Header-Navigation | Property Management · Book Your Stay · About Us · Property Evaluator |
| Farbpalette | `main` ist Referenz |

---

## Offene Punkte

1. **Guest-Management-Texte sind an Eigentümer gerichtet** („your guests can
   contact us", Screening-Karte über „unwanted guests"). Auf der Booking-Seite
   liest ein Gast das über sich selbst. Braucht einen Text-Pass vor dem Livegang —
   früher als der Rest von Phase 2.
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
