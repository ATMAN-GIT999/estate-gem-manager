# PROJECT — Was die Seite ist und wie sie aktuell steht

> **Rolle dieser Datei:** Sie beschreibt den **Ist-Zustand**. Was auf welcher
> Seite liegt, wie das Backend angebunden ist, was offen ist. Wo diese Datei dem
> Code widerspricht, gewinnt der Code — dann bitte diese Datei nachziehen.
>
> Das **WIE der Darstellung** steht in [DESIGN.md](DESIGN.md), das **WARUM**
> hinter Entscheidungen in [DECISIONS.md](DECISIONS.md).
>
> Stand: 16.08.2026 · Branch `redesign/v2`

---

## 1 · Das Projekt

**Frontier Residences** (`frontier-residences.com`) — Website eines
Luxus-Property-Management-Unternehmens mit Sitz in Málaga. Kunde von AS Intel.

Verwaltete Objekte liegen in **Spanien** (Costa del Sol) und **Österreich**
(Wien, Kärnten). **Kroatien ist kein Bestandsmarkt**, sondern erscheint nur auf
`/investments` als Zielmarkt für Kaufgelegenheiten (Istrien) — die Unterscheidung
ist bewusst und darf nicht eingeebnet werden.

Website-Sprache ist **Englisch**. Kommunikation mit Almedin auf **Deutsch**.

### Die wichtigste Regel des Projekts

Die Seite bedient **zwei Zielgruppen mit gegenläufigen Interessen**:

| | Gast | Eigentümer |
|---|---|---|
| Einstieg | `/` (Booking-Landingpage) | `/property-management` |
| will | eine Villa buchen | seine Villa verwalten lassen |
| Kern-Flow | Suche → Objekt → Guesty-Quote → Stripe | Kontaktformular / Cashflow-Rechner |

**Vor jeder Copy-Änderung klären, wer die Section liest.** Der historische
Hauptfehler dieses Projekts war Eigentümer-Sprache auf Gäste-Seiten. Der
Zielgruppenwechsel auf `/` passiert **genau einmal**, bei „Own a Property?".

---

## 2 · Seitenstruktur (verifiziert gegen `src/App.tsx`)

### Öffentliche Routen

| Route | Seite | Zielgruppe |
|---|---|---|
| `/` | `Index.tsx` | Gast |
| `/property-management` | `PropertyManagementPage.tsx` | Eigentümer |
| `/properties` · `/property/:slug` · `/book` · `/booking-confirmation` | Buchungsflow | Gast |
| `/evaluate` | Cashflow-Analyse | Eigentümer |
| `/about` · `/projects` | Vertrauen / Portfolio | beide |
| `/guaranteed-income` · `/renovations` · `/investments` | Unterseiten PM | Eigentümer |
| `/business-areas` | ⚠️ verwaist — Route lebt, kein Menüpunkt | — |
| `/auth` · `/update-password` | Login | — |
| `/aviso-legal` | Impressum (rechtlich) | — |
| `/p/:slug` | `DynamicPage` (CMS-Seiten aus Tabelle `pages`) | — |

Admin-Routen liegen unter `/admin/*` und sind einzeln `lazy()`-geladen.

### Landingpage `/` — tatsächliche Reihenfolge

| # | Komponente | Zielgruppe |
|---|---|---|
| 1 | `Navigation` | — |
| 2 | `Hero` (enthält `SearchBar`) | Gast |
| 3 | `Stats heading=""` — nur die Zahlen, **ohne** Überschrift | Gast |
| 4 | `PropertyCollections` | Gast |
| 5 | `GuestManagement` — „It's in the details." | Gast |
| 6 | `OwnAProperty` — **die einzige Übergabe** | Eigentümer |
| 7 | `PropertyEvaluator` | Eigentümer |
| 8 | `FAQ` | Gast |
| 9 | `Footer` | — |

⚠️ `Stats` läuft hier bewusst **ohne** Überschrift. „A Portfolio Built on
Precision & Performance" ist an Eigentümer geschrieben; die vier Zahlen selbst
sind für Gäste lesbarer Trust. Wer die Überschrift auf `/` einschaltet, holt
Eigentümer-Sprache auf die Gäste-Seite zurück.

### Property-Management-Seite — tatsächliche Reihenfolge

Umgebaut am 16.08.2026 nach der Design-Referenz in
`docs/property-management-page.html`. Zehn Sections statt dreizehn; die
Begründungen stehen in [DECISIONS.md](DECISIONS.md) §11. Reihenfolge von
Ebene 5/6 am 18.08.2026 getauscht (§13) — Zwei Wege liegt jetzt vor About.

| # | Ebene | Komponente | Gewicht |
|---|---|---|---|
| 1 | **Hero** — Bild, H1, zwei CTAs | `OwnerHero` | hoch |
| 2 | **Das System** — 6 Schritte auf einer Goldlinie, jetzt als Panel-Cards | `TheSystem` | sehr hoch |
| 3 | **Proof** — 4 Zahlen + 3 Case Studies, auf Grün | `Proof` | hoch |
| 4 | **Relax** — „We manage while you relax." | `PropertyManagement` | leicht |
| 5 | **Zwei Wege** — Full-service vs. Guaranteed Income, als Panel-Cards | `WaysToWorkTogether` | hoch |
| 6 | **About** — 4 Gesichter + „Contact Us" | `AboutMini` | mittel |
| 7 | **Renovations & Investments**, als Panel-Cards mit Icon | `RenovationsAndInvestments` | mittel |
| 8 | FAQ | `FAQ` | mittel |
| 9 | **Get in touch** — Formular, Bookend zum Hero | `OwnerContactForm` | hoch |
| 10 | Footer | `Footer` | leicht |

**Der Rhythmus ist Teil der Struktur.** Nach Section 3 dürfen nie zwei schwere
Sections direkt aufeinander folgen — die Eröffnungssequenz 1–3 ist die einzige
Ausnahme. Deshalb läuft `RenovationsAndInvestments` auf `size="md"` und nicht
auf `lg`: zwei `lg`-Bänder hintereinander legen ~280 px Leere zwischen
„Guaranteed income" und das erste Bild, was sich liest, als sei die Seite
vorbei.

**Verbindlich und nicht „aufzuräumen":**

- **System vor Proof.** Erst was wir tun, dann was es gebracht hat.
- **Relax nach Proof, nicht davor.** Die Entlastung ist die Antwort auf die
  Dichte davor; vor Proof wäre sie eine Pause vor dem Anfang.
- **Investments zuletzt.** Es zielt auf einen Käufer, nicht auf den
  Eigentümer, für den der Rest der Seite geschrieben ist.

### Was der Umbau ersetzt hat

| Alte Komponente | Wohin |
|---|---|
| Hero-Panel in `PropertyManagementPage` | `OwnerHero` (Bild statt Silver-Surface) |
| `FinancialPerformance` · `WhyItMakesADifference` · `ListingWorkflow` | verschmolzen zu `TheSystem` — **verwaist, zum Löschen** |
| `GetInTouch` | entfällt; das Formular steht jetzt selbst am Seitenende — **verwaist, zum Löschen** |
| `Stats` | lebt weiter für `/`; `Proof` nutzt `StatsRow` + `PORTFOLIO_STATS` daraus |
| `ProjectsSection` | lebt weiter für `/projects`; `Proof` nutzt `FEATURED_PROJECTS` daraus |
| „Our Destinations" auf der PM-Seite | ersatzlos (Entscheidung R1, siehe DESIGN.md §9) |

⚠️ Die vier verwaisten Dateien sind von nichts mehr importiert, liegen aber
noch im Repo — das Löschen wurde von den Berechtigungen abgelehnt. Zu
entfernen: `src/components/FinancialPerformance.tsx`,
`WhyItMakesADifference.tsx`, `ListingWorkflow.tsx`, `GetInTouch.tsx` und
`src/assets/property-1.png`.

### EditableText-IDs nach dem Umbau

Wo ein Satz wörtlich weiterlebt, ist die ID mitgewandert — auch über
Komponentengrenzen hinweg. Das ist Absicht und darf nicht „vereinheitlicht"
werden:

| ID | steht jetzt in | kam aus |
|---|---|---|
| `wid-eyebrow` · `wid-heading` · `wid-lead` | `TheSystem` (Kopf) | `WhyItMakesADifference` |
| `listing-workflow-desc-0` | `TheSystem`, Schritt 1 | `ListingWorkflow` |
| `fin-pillar-desc-0/1` | `TheSystem`, Schritt 2 | `FinancialPerformance` |
| `pm-listing-desc` | `TheSystem`, Schritt 3 | `PropertyManagement` |
| `wid-guest-desc` · `wid-feature-1` | `TheSystem`, Schritt 4 | `WhyItMakesADifference` |
| `wid-property-desc` · `listing-workflow-desc-3` | `TheSystem`, Schritt 5 | beide |
| `fin-pillar-desc-2` | `TheSystem`, Schritt 6 | `FinancialPerformance` |
| `fin-outcome-0…4` | `TheSystem` (Outcome-Zeile) | `FinancialPerformance` |
| `stats-title` | `Proof` | `Stats` |
| `proj-fp-*` | `Proof` | `ProjectsSection` (dort weiterhin gültig für `/projects`) |
| `pm-section-title` | `PropertyManagement` | unverändert |
| `ways-sub-title-0/1` · `ways-sub-desc-0/1` | `RenovationsAndInvestments` | `WaysToWorkTogether` |
| alle `owner-form-*` | `OwnerContactForm` | unverändert |

**Neu vergeben:** `pmp-hero-eyebrow` · `pmp-hero-cta-1/2` · `pmp-hero-image` ·
`sys-label-0…5` · `proof-eyebrow` · `proof-cases-label` ·
`proof-cta` · `proof-case-image-0…2` · `pm-relax-line` · `pm-relax-image` ·
`am-cta` · `beyond-title-0/1` · `beyond-image-0/1` · `owner-form-eyebrow`

⚠️ **Nachbesserung 18.08.2026 (§12):** `sys-title-0…5` ist wieder entfallen —
die sechs erfundenen Zahnrad-Überschriften sind gestrichen, `sys-label-0…5`
trägt jetzt allein sowohl Text als auch Überschriften-Auszeichnung (`t-block`).

⚠️ **Zweite Nachbesserung 18.08.2026 (§13), design-system-weit:**
`proof-benefits-heading` neu (die zusätzliche „The Benefits"-Überschrift in
`Proof`). `oap-image` neu (`OwnAProperty` läuft jetzt über `MediaFrame`, mit
`property-5.webp` befüllt statt leer). `am-cta` bleibt, sitzt aber jetzt hinter
`WaysToWorkTogether` statt davor (Reihenfolge getauscht, IDs unverändert).

**Ersatzlos entfallen:** `pmp-page-subtitle` · `fin-eyebrow` · `fin-heading` ·
`fin-cta` · `fin-outcomes-heading` · `wid-tech-heading` · `wid-feature-0/2/3` ·
`listing-workflow-heading` · `listing-workflow-lead` ·
`listing-workflow-desc-1/2` · `listing-workflow-title-*` · `listing-routine-*` ·
`pm-section-badge` · `pm-platforms-image` · `ways-sub-label` ·
`get-in-touch-*` · `proj-fp-type-*` (nur auf der PM-Seite)

### Navigation

**Property Management** ⌄ · **Stay With Us** ⌄ · **About Us** · **Sign In**

| Label | Ziel | Dropdown |
|---|---|---|
| Property Management | `/property-management` | → Property Management · Property Evaluator (Anker `#property-evaluation`) |
| Stay With Us | `/properties` | → Properties · Our Newest Posts (Instagram, extern) |
| About Us | `/about` | — |
| Sign In | `/auth` | — |

`/business-areas` und `/projects` sind keine Menüpunkte mehr.

---

## 3 · Stack und Verifikation

Vite + React 18 + TypeScript + shadcn/ui (Radix) + Tailwind + Supabase.
Paketmanager ist **npm** (`package-lock.json` ist aktiv; die `bun.lock*`-Dateien
sind Altlast aus der Lovable-Zeit).

```bash
npm run dev      # Dev-Server auf Port 8080
npm run build    # Vite-Build + scripts/generate-sitemap.mjs
npm run lint     # ESLint
npx tsc --noEmit # Typprüfung (läuft NICHT automatisch im Build)
```

**Es gibt keine Tests.** Verifikation heißt hier: `npx tsc --noEmit`,
`npm run build`, und die betroffene Seite im Dev-Server ansehen.

### Herkunft: Lovable

Das Projekt kommt von Lovable (`lovable-tagger` in `vite.config.ts`, generierte
Migrationsnamen). Lovable-Sessions haben teils Backend-Teile gebaut, die im
Frontend nie angeschlossen wurden — **vor dem Bauen einer neuen Migration
prüfen, ob Tabelle/Bucket/Policy schon existiert.** Genau das ist bei den
Kontaktformularen passiert: Bucket und Policies waren längst da, zwei selbst
geschriebene Migrationen wurden wieder entfernt.

---

## 4 · Backend: Supabase, Guesty, Stripe

> **Vor Änderungen am Buchungs- oder Zahlungsfluss einzeln rückfragen.**
> Hier laufen echte Zahlungen, nicht Layout.

### Guesty-Anbindung

Alle Objekte hängen an Guesty (Konto `66c4630d701825383a6441b7`, 24 Listings im
Guesty-Konto, 23 in der Sitemap). Edge Functions in `supabase/functions/`:

| Function | Rolle |
|---|---|
| `guesty-booking-auth` | OAuth-Token mit aggressivem Cache — Guesty erlaubt nur **3 Tokens / 24 h** |
| `guesty-search-listings` · `guesty-get-calendar` | Verfügbarkeit; Kalender mit 1h-Cache, Backoff bei 429, Degraded-Mode statt Ausfall |
| `guesty-get-quote` | echtes datumsabhängiges Preisangebot |
| `guesty-create-reservation` | Instant Booking (Stripe) oder Inquiry, mit Fehlerübersetzung |
| `guesty-webhook` | Status-Rückmeldungen; loggt nach `guesty_webhook_events`, invalidiert Kalender-Cache |
| `guesty-stripe-config` | liefert den Stripe Publishable Key ans Frontend |
| `import-guesty-properties` | Stammdaten-Sync nach `properties` |
| `analyze-property` | Cashflow-Analyse (`/evaluate`) |

### Preise — die wichtigste Falle

`price_per_night` in der DB ist ein **eingefrorener Importwert**, kein aktueller
Preis. Nie als „der Preis" darstellen; die Karten zeigen deshalb „from €X /
night". `basePrice` aus Guesty taugt nachweislich **nicht** als Untergrenze —
die echten Raten kommen dynamisch von PriceLabs.

### RLS-Regeln, die man nicht frei wählen darf

`LEAD_SOURCE` und `PHOTO_BUCKET` in den Formularen sind **das, was die
RLS-Policies durchlassen**, keine freie Wahl:

- Beide Formulare senden `source = 'consultation-booking'`.
- Unterschieden werden sie über `metadata.submitted_from`
  (`property-management` bzw. `evaluate`).
- Wird `source` geändert, weist RLS jede Einsendung ab und der Lead verschwindet
  lautlos.

### Migrationen

Migrationen in `supabase/migrations/` werden **nicht ungefragt auf die
Live-Datenbank angewendet**. Schreiben ja, anwenden nur nach Absprache.
`.env` enthält ausschließlich öffentliche `VITE_`-Keys. Service-Role-, Guesty-
und Stripe-Secrets gehören in die Supabase-Secrets, **nie ins Repo**.

---

## 5 · SEO — Stand

Umgesetzt und verifiziert:

- **Per-Route-Metadaten** über `react-helmet-async` + `src/components/Seo.tsx`.
  Alle öffentlichen Routen haben eigenen Titel, Description, Canonical und
  Social-Tags. `/auth`, `/update-password`, `/booking-confirmation` und 404 sind
  `noindex`.
- **Canonical ist hier wichtiger als üblich:** Property-Karten hängen
  `?checkIn=…&checkOut=…&guests=…` an. Der Canonical zeigt immer auf den reinen
  Slug.
- **JSON-LD** (`src/lib/schema.ts`): `RealEstateAgent` mit fester `@id`,
  `Accommodation` pro Objekt, `BreadcrumbList`, `FAQPage`.
- **Fonts selbst gehostet** über `@fontsource`. Im Build gibt es **keine**
  Google-Font-Referenz. Grund ist DSGVO — der Kunde hat Büro und Kunden in
  Österreich.
- `sitemap.xml` wird beim Build erzeugt (Slugs live aus Supabase),
  `llms.txt` und eine korrigierte `robots.txt` liegen in `public/`.
- `og-image.png` ersetzt den früheren Lovable-Platzhalter.
- Firmendaten kommen **nur** aus `src/lib/siteMeta.ts`. Die Telefonnummer ist
  inzwischen überall identisch (`+34 649 429 678`) — Footer, Aviso Legal,
  `InstantBookFallbackDialog`.

**Regeln für Neues:**

- Jede neue Route bekommt `<Seo />` mit eigenem `title`, `description`, `path`
  und passendem Schema.
- In `index.html` **keine** `og:title`/`og:description` ergänzen: Helmet hängt
  an statt zu ersetzen — es gäbe jede Angabe doppelt.
- Kein Preis ins Property-Schema, solange `price_per_night` nicht live gehalten
  wird (siehe offene Punkte).

**Bekannte Grenze:** WhatsApp/LinkedIn/Facebook rendern kein JS und sehen nur
`index.html`. Per-Page-Vorschauen bräuchten Prerendering.

---

## 6 · Offene Punkte

### 🔴 Blockiert — wartet auf Almedin oder den Kunden, nicht auf Code

| # | Punkt |
|---|---|
| B1 | **Stripe-Publishable-Key.** `guesty-stripe-config` antwortet HTTP 500 („Stripe publishable key not configured"). Guesty hat genau ein Payment-Provider-Konto (`acct_1Pqi8YRsGzWWYqz8`, ACTIVE, alle 24 Objekte), verbunden von `aschbacher@frontier-residences.com`. Almedin muss den `pk_live_…` aus **genau diesem** Konto besorgen und als `GUESTY_STRIPE_PUBLISHABLE_KEY` in die Supabase Edge Function Secrets eintragen. Ohne den Key bleibt der Buchungsabschluss tot, egal was am Code passiert. |
| B2 | **City Tax ist in Guesty falsch konfiguriert.** Am Objekt Vienna Ottakring steht `PERCENTAGE` kombiniert mit `PER_GUEST_PER_NIGHT` → Guesty rechnet `3,2 % × Unterkunft × Gäste × Nächte` und kommt auf 97–144 % Steuer (bei einer Buchung kippt `subTotalPrice` auf −777,13 €). Zu ändern in **Guesty**, nicht im Code: Quantifier auf `PER_STAY`. **Erst danach** die Total-Berechnung im Code umstellen — sonst zeigt und bucht die Website einen um ~645 € zu hohen Betrag. |
| B3 | **Guesty-Webhook ist nicht registriert.** `…/functions/v1/guesty-webhook` steht in Guesty nicht in der Webhook-Liste (registriert sind nur Chekin, Nuki, PriceLabs). Es kann nie ein Event angekommen sein. Reihenfolge beim Einrichten: Webhook anlegen → Secret abrufen → **sofort** als `GUESTY_WEBHOOK_SECRET` in Supabase eintragen. Der Handler ist inzwischen **fail-closed** (ohne Secret → 503), das Fenster ist also eng. |
| B4 | **Material vom Besitzer:** Vorher/Nachher-Fotos für die drei Projekte, Eigentümer-Testimonials, ein eigener Cal.com-Link (aktuell zeigt `OwnerContactForm` auf Almedins persönlichen Link). |
| B5 | **Der PM-Hero läuft auf dem falschen Motiv.** Seit der Nachbesserung vom 18.08.2026 (DECISIONS §12) zeigt `OwnerHero.tsx` `villa-higueron.webp` — auf Almedins Anweisung dorthin verschoben, weil der Landing-Hero das Bild nicht mehr braucht (Video ist zurück). Das Bild ist aber ein **Innenraum** (Marmorboden, Glasfront, Pool/Meer nur durch die Scheibe), nicht die Villa-Außenansicht mit Infinity-Pool aus der ursprünglichen Spezifikation, und es ist **byteweise identisch** mit `property-3.webp`, das dieselbe Villa schon auf `/property/…` und ihrer Karte zeigt. Almedin hat auf diesen konkreten Punkt noch nicht geantwortet. Relax-, Kontakt- und die zwei Renovations/Investments-Slots bleiben leere `MediaFrame`-Plätze mit Bild-Briefing als `note` — dort reicht ein Pfad rein, ohne weitere Änderung. Dazu kommen die drei Case-Study-Bilder aus B4. |

### 🔴 Offen im Code

| # | Punkt |
|---|---|
| C1 | **Der Gesamtpreis im Buchungsdialog ist zu niedrig.** `BookingSummary.tsx` nimmt `subTotalPrice` als Total, die Steuerzeile fehlt in der Aufschlüsselung. Richtig wäre `subTotalPrice + totalTaxes` plus eigene Zeile „Taxes" — **aber erst nach B2.** |
| C2 | **Stille Fantasiepreise.** Schlägt die Quote fehl, rechnet `fetchQuote` ersatzweise `price_per_night × Nächte × 1,1`. Die 10 % sind erfunden, der Gast sieht eine glaubwürdige Zahl ohne Hinweis — und kann damit buchen. Offene Entscheidung von Almedin: Buchung **blockieren** oder als unverbindliche Anfrage weiterlaufen lassen? Empfehlung: blockieren. |
| C3 | **Endlos-Spinner statt Fehlermeldung.** Schlägt `guesty-stripe-config` fehl, landet der Fehler nur in der Konsole; das Kartenfeld rendert nie, der Button bleibt dauerhaft `disabled`. Es braucht einen sichtbaren Fehlerzustand plus den Anfrage-Weg als Ausweichpfad. |
| C4 | **Nächtlicher Preis-Sync ist geschrieben, aber nicht angewendet.** `supabase/migrations/20260813200000_nightly_price_sync.sql` — der Header der Datei dokumentiert genau, was live verifiziert wurde und was nicht. Vor dem Vertrauen: in den Supabase-SQL-Editor einfügen und `SELECT * FROM public.sync_guesty_prices();` von Hand laufen lassen. Bis dahin altert der manuelle Sync vom 13.08.2026 weiter ab. |
| C5 | **Das Layout-System endet fast überall.** `src/components/layout/` ist verdrahtet in `PropertyManagementPage.tsx` sowie den Komponenten `ProjectsSection.tsx` und `PropertyCollections.tsx` — **sonst nirgends.** Alle Unterseiten (`/renovations`, `/investments`, `/guaranteed-income`, `/about`, `/properties`, `/business-areas`) laufen noch auf `container mx-auto px-4` plus eigenem `max-w-*`. Wer über „Two ways to start with us" auf `/renovations` klickt, landet spürbar auf einer anderen Website. Größter sichtbarer Bruch im aktuellen Stand. |
| C6 | **`public/videos/hero-background.mp4` ist kaputt.** 900 KB, passend benannt, nie verdrahtet — aber die ersten Bytes sind `<!doctype html>`. Chrome quittiert mit `DEMUXER_ERROR_COULD_NOT_OPEN`. Bewusst liegen gelassen, falls die echte Datei noch existiert. `Hero.tsx` läuft seit der Nachbesserung vom 18.08.2026 wieder auf dem YouTube-Embed (`videoId: "tqmWpFCv_1M"`, DECISIONS §12) — sobald ein funktionierendes MP4 unter `public/videos/` liegt, reicht `videoType: "file"` plus Pfad als neuer Default, um vom Embed auf selbst gehostet umzustellen. |
| C7 | **Texte sind nicht dauerhaft im CMS änderbar.** `EditableText` / `EditableImage` / `EditableVideo` schreiben nur in lokalen React-State — nach einem Reload ist jede Änderung weg. Es gibt keine Persistenz-Tabelle; der einzige Override-Mechanismus (`PageWrapper` → Tabelle `pages`) ist für keine Seite aktiv. **Konsequenz:** Was im Code steht, ist der Text. „Das ändert der Kunde später selbst" stimmt heute nicht. |

### 🟡 Offen, braucht eine Entscheidung

| # | Punkt |
|---|---|
| D1 | **Der einzige gefüllte Header-Button ist ein Gäste-Login** („Sign In"), auf einer Seite, deren primäre Zielgruppe Eigentümer sind. Vorschlag aus dem CX-Teardown: „Talk to us about your property" als einziger gefüllter Button. Das ist eine Design-Entscheidung, kein Bugfix — braucht Freigabe. |
| D2 | **`/business-areas`** ist kein Menüpunkt mehr, die Route lebt weiter und trägt eine ältere, widersprüchliche Version der Positionierung („Business Areas", „Guaranteed Income Program" mit „Included"-Badge). Zwei Seiten konkurrieren um dieselben Keywords. Vorschlag: 301 auf `/property-management`. |
| ~~D3~~ | ~~„It's in the details." steht auf beiden Seiten~~ — **erledigt am 16.08.2026.** `ListingWorkflow` ist im Umbau aufgegangen; die Überschrift steht jetzt nur noch auf `/` (`GuestManagement.tsx`). Die Gäste-Fassung ist unverändert und bleibt es ohne Rückfrage. |
| D4 | **Die Kennzahlen sind hartkodierte Copy** (`41 Properties Managed · 1500+ Successful Reservations · 8 Destinations · 50+ Collaborators`), keine Live-Daten — und sie stehen auf `/` und der PM-Seite identisch. Der Sitemap-Build meldet **23 Objekte**, `ProjectsSection` nennt „20+ premium properties" für Spanien. Gegenüber „41" ist das erklärungsbedürftig. Offen ist auch, ob die „8 Destinations" kroatische Orte mitzählen — Kroatien ist kein Bestandsmarkt. |
| D5 | **Keine Fee-Transparenz.** `WaysToWorkTogether` stellt beide Modelle klar gegenüber, nennt aber nirgends eine Provisionsspanne. Für die *Details* ist die Verlagerung ins Gespräch richtig; für die **Größenordnung** kostet es Anfragen. |
| D6 | **Der Eigentümer-Funnel ist nicht messbar.** Im gesamten öffentlichen Code existiert ein einziger Tracking-Aufruf: `page_view` auf `/`. Vier Events würden genügen: `pm_page_view`, `evaluator_submitted`, `evaluator_result_viewed`, `owner_enquiry_submitted`. Ohne die lässt sich kein anderer Punkt dieser Liste nach der Umsetzung verifizieren. **Seit dem Umbau dringlicher:** das Kontaktformular ist vom ersten Screen ans Seitenende gewandert (DECISIONS §11). Ob das mehr oder weniger Anfragen bringt, ist genau die Frage, die diese Events beantworten würden — und aktuell beantwortet sie niemand. |
| D11 | **Owner-FAQ.** Die Design-Referenz schlägt statt der Gäste-FAQ echte Eigentümerfragen vor (Kosten, Vertragslaufzeit, Eigennutzung, Auszahlung, Onboarding-Dauer) und markiert ihre eigenen Antworten ausdrücklich als Platzhalter. Umgesetzt ist das **nicht** — die FAQ bleibt wie angefordert die Gäste-Fassung. Es wäre inhaltlich die stärkere Lösung, berührt aber D5 (Fee-Transparenz) und braucht belastbare Antworten vom Kunden, keine erfundenen. |
| D7 | **Landing-Hero-Headline ist ein Platzhalter** („Luxury Villas & Vacation Rentals in Spain and Austria"), vom Besitzer abzusegnen. Ebenso die „Own a Property?"-Texte — insbesondere „earn **with** us" (Provisionsmodell) gegenüber „earn **from** us" (das wäre Guaranteed Income, also Festmiete). |
| D8 | **`collection`-Spalte für die Property-Tabelle.** Die drei Reihen in `PropertyCollections.tsx` leiten die Zuordnung aus `location` und dem Namen ab. Eine Immobilie in einem neuen Ort erscheint in **keiner** Reihe, bis jemand den Ort im Code ergänzt. |
| D9 | **Objekt mit 63 Nächten Mindestaufenthalt im Buchungsfluss.** „6th floor Malaga Soho" steht auf Langzeitmiete (`terms.minNights = 63`). Ein Gast, der Daten wählt, bekommt dort ausnahmslos eine Absage. Produktfrage: soll es im normalen Flow überhaupt auftauchen? |
| D10 | **Drei Objekte ohne Live-Preis** (Los Monteros Retreat, Luxury Escape Los Flamingos Golf Retreat, THE ONE Higuerón) — bei jedem getesteten Zeitfenster bis 400 Tage voraus „nicht verfügbar". Liest sich als in Guesty blockiert/inaktiv. In Guesty prüfen. |

### Bewusst so gelassen

- **Die FAQ auf der PM-Seite ist wortwörtlich die gästeseitige FAQ** von `/`, nur
  mit neuer Überschrift. Das ist die Umkehrung des Projekt-Hauptfehlers — von
  Almedin bewusst so angefordert. Wenn eigentümer-spezifische Fragen gewünscht
  sind, braucht es eigenen Content vom Kunden.
- **Die Bildslots der PM-Seite sind leer und zeigen ihr Briefing** statt ein
  vorhandenes Foto ein zweites Mal (B5). Vorher lief das Formularbild auf
  `about-hero.webp` — dasselbe Foto, das die Relax-Section jetzt bekommen
  soll.
- **Die Detailfragen zum Guaranteed Income** (Festbetrag, Vertragsdauer,
  Kostenträger, Eigennutzung) werden absichtlich nicht auf der Website
  beantwortet — das klärt sich im Gespräch.
- **Die alten PNGs in `src/assets/`** liegen absichtlich noch da, falls die
  Originale nochmal gebraucht werden. Sie landen in keinem Build.
