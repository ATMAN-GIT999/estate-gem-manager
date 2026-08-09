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
Redundanzen aufgelöst und die Hierarchie geschärft — anhand des archivierten
Content-Audits.

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

| # | Section | Komponente / Quelle | Herkunft | Status |
|---|---|---|---|---|
| 1 | Navigation | `Navigation.tsx` | main | ✅ umgebaut |
| 2 | Hero „Bespoke Property Management" | `PropertyManagementPage.tsx` | main | ✅ erledigt |
| 3 | „Your home deserves…" | `IntroSection.tsx` | main (von Landing) | ✅ verschoben |
| 4 | Stats | `Stats.tsx` | main (von Landing) | ✅ verschoben |
| 5 | Business Areas | `BusinessAreas.tsx` | main (von Landing) | ✅ verschoben |
| 6 | Technology | `TechnologySection.tsx` | main (von Landing) | ✅ verschoben |
| 7 | Short-Term Rental Mgmt (Listing + Property Care) | `PropertyManagement.tsx` | main (von Landing) | ✅ verschoben, enthält nur noch 2 der 3 Säulen |
| 8 | Our Services | `PropertyManagementPage.tsx` | main | vorhanden |
| 9 | AI-Driven Hospitality & Operations | `PropertyManagementPage.tsx` | main | vorhanden |
| 10 | Projects | `ProjectsSection.tsx` | main | ✅ verschoben (Seite `/projects` nutzt dieselbe Komponente) |
| 11 | About Us (kompakt) | `AboutMini.tsx` | experiment | ✅ verschoben, Eyebrow auf Eigentümer angepasst |
| 12 | Cashflow Analysis | `PropertyEvaluator.tsx` | main | ✅ ergänzt |
| 13 | CTA / Kontakt | `OwnerCta.tsx` | **neu** | ✅ gebaut — mailto, siehe offene Punkte |
| 14 | Footer | `Footer.tsx` | main | vorhanden |

**Bekannte Redundanzen** — bewusst erst in Phase 2 anfassen, nicht beim Verschieben:
- #6 Technology und #9 AI-Driven sind inhaltlich fast dieselbe Liste.
- #5 Business Areas („What's Included") überschneidet sich mit #7 und #8.
- #10 Projects („Our Destinations": Spain · Austria · Croatia) wiederholt die
  Regionen, die #4 Stats direkt darüber schon aufzählt.
- #10 enthält noch „Before & After Photos — Coming Soon"-Platzhalter.

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
7. **Kontaktweg für Eigentümer:** Der CTA am Ende der PM-Seite ist ein `mailto:`
   auf die Footer-Adresse, weil es keinen anderen eigentümer-gerichteten Kanal
   gibt. Ein Terminbuchungs-Link oder Kontaktformular würde deutlich besser
   konvertieren — Entscheidung des Besitzers.
