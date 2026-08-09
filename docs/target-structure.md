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

---

## Seite 1 — Booking-Landingpage (`/`)

Gäste-primär, kompakt. Kein Property-Management-Content außer der Übergangs-Section.

| # | Section | Komponente | Herkunft | Status |
|---|---|---|---|---|
| 1 | Navigation | `Navigation.tsx` | main | vorhanden |
| 2 | Hero mit Booking-Engine | `Hero.tsx` (enthält `SearchBar`) | main | vorhanden, Headline offen (s. u.) |
| 3 | Stays You'll Love | `StaysYouLove.tsx` | experiment | ✅ erledigt |
| 4 | **Own a Property?** | — | **neu** | offen — große, aufmerksamkeitsstarke Section, verlinkt auf `/property-management` |
| 5 | Cashflow Analysis | `PropertyEvaluator.tsx` | main | vorhanden |
| 6 | About Us (kompakt) | `AboutMini.tsx` | experiment | offen |
| 7 | Footer | `Footer.tsx` | main | vorhanden |

**Von der Landingpage entfernen** (wandern auf die PM-Seite):
`IntroSection.tsx`, `Stats.tsx`, `BusinessAreas.tsx`, `TechnologySection.tsx`,
`PropertyManagement.tsx`.

---

## Seite 2 — Property-Management-Seite (`/property-management`)

Eigentümer-primär. Sammelt den gesamten PM-Content.

| # | Section | Komponente / Quelle | Herkunft | Status |
|---|---|---|---|---|
| 1 | Navigation | `Navigation.tsx` | main | vorhanden |
| 2 | Hero „Bespoke Property Management" | `PropertyManagementPage.tsx` | main | ✅ erledigt |
| 3 | „Your home deserves…" | `IntroSection.tsx` | main (von Landing) | offen |
| 4 | Stats | `Stats.tsx` | main (von Landing) | offen |
| 5 | Business Areas | `BusinessAreas.tsx` | main (von Landing) | offen |
| 6 | Technology | `TechnologySection.tsx` | main (von Landing) | offen |
| 7 | Short-Term Rental Mgmt (3 Säulen) | `PropertyManagement.tsx` | main (von Landing) | offen |
| 8 | Our Services | `PropertyManagementPage.tsx` | main | vorhanden |
| 9 | AI-Driven Hospitality & Operations | `PropertyManagementPage.tsx` | main | vorhanden |
| 10 | Projects | Inhalt aus `pages/Projects.tsx` | main | offen |
| 11 | About Us (ausführlich) | Inhalt aus `pages/About.tsx` | main | offen |
| 12 | Cashflow Analysis | `PropertyEvaluator.tsx` | main | offen |
| 13 | CTA / Kontakt | — | **neu** | offen — existiert bisher nicht |
| 14 | Footer | `Footer.tsx` | main | vorhanden |

**Bekannte Redundanzen** — bewusst erst in Phase 2 anfassen, nicht beim Verschieben:
- #6 Technology und #9 AI-Driven sind inhaltlich fast dieselbe Liste.
- #5 Business Areas („What's Included") überschneidet sich mit #7 und #8.

**Guaranteed Income, Renovations, Investments** bleiben eigenständige Unterseiten
(`/guaranteed-income`, `/renovations`, `/investments`). Die PM-Seite bekommt in
Phase 2 eine kompakte Teaser-Ebene, die dorthin verlinkt.

---

## Header-Navigation

Aktuell: `/business-areas` · `/projects` · `/about`

Nach dem Umbau entfallen **Projects** und **About** als Menüpunkte — ihre Inhalte
leben als Sections auf der PM-Seite.

⚠️ **Offen:** Damit bliebe nur `/business-areas` im Menü, dessen Inhalt aber
ebenfalls auf die PM-Seite wandert. Naheliegend wäre ein Menüpunkt
„Property Management" → `/property-management`. Muss noch entschieden werden.

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
| About | Inhalt als Section auf PM-Seite, Nav-Punkt entfällt |
| Farbpalette | `main` ist Referenz |

---

## Offene Punkte

1. **Landing-Hero-Headline** — „Bespoke Property Management" ist auf die PM-Seite
   gewandert. Die Booking-Landingpage braucht eine gäste-gerichtete Headline.
   Vorschlag steht aus; sollte der Besitzer absegnen.
2. **Header-Navigation** nach Wegfall von Projects/About (siehe oben).
3. **„Own a Property?"** existiert auf `main` nicht und wird neu gebaut — es gibt
   dafür keine Vorlage im Experiment-Branch außer einer Zeile im dortigen Hero.
4. **Testimonials** für die Proof-Ebene der PM-Seite müssen vom Besitzer kommen;
   können nicht erfunden werden.
5. **`AboutMini` verlinkt auf die About-Seite** — dieser Link braucht ein neues
   Ziel, sobald `/about` kein eigener Menüpunkt mehr ist.
6. **SEO:** Der bisherige PM-Seitentitel „Luxury Property Management Designed for
   Exceptional Homes" war keyword-stärker als „Bespoke Property Management".
   Der keyword-starke Begriff könnte im `<title>`-Tag erhalten bleiben.
