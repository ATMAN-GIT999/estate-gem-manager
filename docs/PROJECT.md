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
| `/properties` · `/property/:slug` · `/booking-confirmation` | Buchungsflow | Gast |
| `/evaluate` | Cashflow-Analyse | Eigentümer |
| `/about` · `/projects` | Vertrauen / Portfolio | beide |
| `/guaranteed-income` · `/renovations` · `/investments` | Unterseiten PM | Eigentümer |
| `/business-areas` | ⚠️ verwaist — Route lebt, kein Menüpunkt | — |
| `/auth` · `/update-password` | Login | — |
| `/aviso-legal` | Impressum (rechtlich) | — |
| `/p/:slug` | `DynamicPage` (CMS-Seiten aus Tabelle `pages`) | — |

Admin-Routen liegen unter `/admin/*` und sind einzeln `lazy()`-geladen.

`/book` ist am 19.08.2026 gelöscht worden (DECISIONS.md §15) — eine
Lovable-Attrappe ohne echte Guesty-/Stripe-/Supabase-Anbindung, kein Verlust
an Buchungsfunktionalität. Verweise darauf zeigen jetzt auf `/properties`.

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
Am 19.08.2026 (§15) auf acht Sections reduziert: „We manage while you relax"
hat keine eigene Ebene mehr, sondern lebt jetzt als Bild + Überschrift im
Kontaktformular am Seitenende. Noch am selben Tag (§16) auf sieben Sections
weiter reduziert: Renovations & Investments ist keine eigene Ebene mehr,
sondern die zweite Hälfte von „Zwei Wege", hinter einer goldenen
Trennlinie mit Label („Beyond management").

| # | Ebene | Komponente | Gewicht |
|---|---|---|---|
| 1 | **Hero** — Bild, H1, zwei CTAs | `OwnerHero` | hoch |
| 2 | **Das System** — 6 Schritte auf einer Goldlinie, jetzt als Panel-Cards | `TheSystem` | sehr hoch |
| 3 | **Proof** — 4 Zahlen + 3 Case Studies, auf Grün | `Proof` | hoch |
| 4 | **Zwei Wege** — Full-service vs. Guaranteed Income, dann „Beyond management" mit Renovations & Investments, alles Panel-Cards | `WaysToWorkTogether` | hoch |
| 5 | **About** — 4 Gesichter + „Contact Us" | `AboutMini` | mittel |
| 6 | FAQ | `FAQ` | mittel |
| 7 | **Get in touch** — „We manage while you relax", Los-Monteros-Bild, Formular | `OwnerContactForm` | hoch |
| — | Footer | `Footer` | leicht |

**Der Rhythmus ist Teil der Struktur.** Nach Section 3 dürfen nie zwei schwere
Sections direkt aufeinander folgen — die Eröffnungssequenz 1–3 ist die einzige
Ausnahme.

**Verbindlich und nicht „aufzuräumen":**

- **System vor Proof.** Erst was wir tun, dann was es gebracht hat.
- **Investments zuletzt innerhalb von „Zwei Wege".** Es zielt auf einen
  Käufer, nicht auf den Eigentümer, für den der Rest der Seite geschrieben ist.
- **„We manage while you relax" schließt die Seite, nicht die Mitte.** Die
  Entlastung ist jetzt der letzte Ton vor dem Formular, nicht mehr eine
  eigene Pause zwischen Proof und der kommerziellen Entscheidung (§15).

### Was der Umbau ersetzt hat

| Alte Komponente | Wohin |
|---|---|
| Hero-Panel in `PropertyManagementPage` | `OwnerHero` (Bild statt Silver-Surface) |
| `FinancialPerformance` · `WhyItMakesADifference` · `ListingWorkflow` | verschmolzen zu `TheSystem` — **verwaist, zum Löschen** |
| `GetInTouch` | entfällt; das Formular steht jetzt selbst am Seitenende — **verwaist, zum Löschen** |
| `PropertyManagement` (eigenständige „We manage while you relax"-Section) | am 19.08.2026 **gelöscht** (§15); Bild + Überschrift leben jetzt in `OwnerContactForm` |
| `Book.tsx` (`/book`) | am 19.08.2026 **gelöscht** (§15) — Lovable-Attrappe ohne echte Buchungsanbindung |
| `Stats` | lebt weiter für `/`; `Proof` nutzt `StatsRow` + `PORTFOLIO_STATS` daraus |
| `ProjectsSection` | lebt weiter für `/projects`; `Proof` nutzt `FEATURED_PROJECTS` daraus |
| „Our Destinations" auf der PM-Seite | ersatzlos (Entscheidung R1, siehe DESIGN.md §9) |

⚠️ Drei verwaiste Dateien sind von nichts mehr importiert, liegen aber noch im
Repo — das Löschen wurde von den Berechtigungen abgelehnt. Zu entfernen:
`src/components/FinancialPerformance.tsx`, `WhyItMakesADifference.tsx`,
`ListingWorkflow.tsx`, `GetInTouch.tsx` und `src/assets/property-1.png`.
(`PropertyManagement.tsx` und `Book.tsx` selbst sind bereits gelöscht.)

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
| `pm-section-title` · `pm-relax-image` | `OwnerContactForm` (Formular-Kopf) | `PropertyManagement`, gelöscht §15 |
| `ways-sub-title-0/1` · `beyond-title-0/1` · `ways-sub-desc-0/1` | `WaysToWorkTogether` (Beyond-management-Hälfte) | `RenovationsAndInvestments.tsx`, gelöscht §16 |
| `owner-form-eyebrow` · `owner-form-lead` · `owner-form-*` (Formularfelder) | `OwnerContactForm` | unverändert |

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

⚠️ **Dritte Nachbesserung 19.08.2026 (§14):** Alle sechs Zahnrad-Fließtexte in
`TheSystem` sind neu geschriebene, von Almedin freigegebene Copy — keine
verschobenen Sätze mehr, deshalb neue IDs statt der bisher vererbten:
`sys-body-0…5` ersetzt `listing-workflow-desc-0` · `fin-pillar-desc-0/1` ·
`pm-listing-desc` · `wid-guest-desc` · `wid-feature-1` · `wid-property-desc` ·
`listing-workflow-desc-3` · `fin-pillar-desc-2`. `sys-label-0…5` (die
Überschriften) bleiben unverändert. Die Outcome-Zeile ist einer kursiven
Abschlusszeile gewichen: `sys-closing-line` neu, `fin-outcome-0…4` entfällt.
`proj-fp-ba-0…2` trägt jetzt „Featured Property" statt „Before and After" —
gleiche ID, veränderter Standardtext, weil die neuen Bilder aktuelle
Bestandsfotos sind, keine Vorher/Nachher-Paare.

⚠️ **Vierte Nachbesserung 19.08.2026, zweite Runde (§15):** `pm-section-title`
und `pm-relax-image` ziehen von der gelöschten `PropertyManagement.tsx` in
`OwnerContactForm` um und ersetzen dort `owner-form-heading` /
`owner-form-image` — gleiche Rolle (Formular-Überschrift, Formular-Bild),
neuer Ort, weil „We manage while you relax" jetzt der Formular-Kopf ist statt
einer eigenen Section.

⚠️ **Fünfte Nachbesserung 19.08.2026, dritte Runde (§16):** `beyond-eyebrow`
und `beyond-heading` neu — der Kopf der „Beyond management"-Hälfte, die es als
eigene Section vorher nicht gab. `beyond-image-0/1` entfällt ersatzlos: die
Referenzskizze läuft ohne Foto-Slot bei den beiden Karten, und da nie ein Bild
dafür geliefert wurde, gibt es keinen Inhalt, der eine ID bräuchte.

**Ersatzlos entfallen:** `pmp-page-subtitle` · `fin-eyebrow` · `fin-heading` ·
`fin-cta` · `fin-outcomes-heading` · `wid-tech-heading` · `wid-feature-0/2/3` ·
`listing-workflow-heading` · `listing-workflow-lead` ·
`listing-workflow-desc-1/2` · `listing-workflow-title-*` · `listing-routine-*` ·
`pm-section-badge` · `pm-platforms-image` · `ways-sub-label` ·
`fin-outcome-0…4` · `wid-eyebrow` · `wid-heading` · `wid-lead` ·
`listing-workflow-desc-0` · `fin-pillar-desc-0/1/2` · `pm-listing-desc` ·
`wid-guest-desc` · `wid-feature-1` · `wid-property-desc` ·
`listing-workflow-desc-3` (alle acht: Text ersetzt, siehe §14 oben) ·
`get-in-touch-*` · `proj-fp-type-*` (nur auf der PM-Seite) · `nav-4` ·
`nav-4-properties` · `nav-4-posts` · `nav-5` (die „Stay With Us"/„Property
Evaluator"-Dropdowns, siehe §28 unten — kein Ersatz, die Aktionen dahinter
bleiben über den goldenen „Book a Stay"-Button bzw. die Seite selbst
erreichbar) · `footer-gi-link` · `footer-renovations-link` ·
`footer-investments-link` · `footer-projects-link` (§32/§33: Guaranteed
Income und Projects ganz aus dem Footer entfernt, Renovations/Investments
zu einer „Beyond Management"-Zeile zusammengelegt — die Seiten
`/guaranteed-income`, `/renovations`, `/investments`, `/projects` selbst
existieren weiterhin unverändert, nur ihre Footer-Zeilen sind weg)

### Navigation

`Navigation.tsx` hat seit §28 nur noch zwei Varianten (`variant`-Prop), beide
flach (keine Dropdowns) und **immer** auf solidem `bg-primary` — die frühere
transparente „legt sich über das Hero-Foto und füllt beim Scrollen auf"-
Variante ist komplett weg (§28: der Verlaufs-Scrim dafür ließ den Header-Text
wie abgedunkelt wirken, und OmniVillas' eigener Referenz-Header ist ohnehin
immer eine solide Leiste, nie transparent über einem Foto).

**`variant="default"`** (jede Seite außer der PM-Seite, inkl. `/`) —
Property Management (`/property-management`) · About Us (`/about`) ·
Sprach-/Währungs-Switcher (`LanguageCurrencySwitcher.tsx`, geschlossene
Pille mit Dropdown-Panel, DE/EN/ES + EUR/USD/GBP) · Sign In (Klartext-Link
statt Button, `/auth` bzw. `/admin/dashboard`/`/properties` eingeloggt) ·
goldener, abgerundeter Button „Book a Stay →" → `/properties`.

**`variant="propertyManagement"`** (`PropertyManagementPage.tsx`,
`/property-management`) — Property Management (smooth-scroll zu
`#the-system`, keine Navigation) · About Us · Switcher (nur Sprache, alle
drei immer sichtbar nebeneinander, kein Dropdown-Panel) · „Book a Stay"
(Klartext-Link → `/`) · goldener, abgerundeter Button „Apply →" →
`#get-in-touch`.

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

### Supabase-Projekt: `womaoywuhjchtubacbvn`, nicht mehr `xjvtuderbirlwudatgxg`

Am 19.08.2026 gewechselt (DECISIONS §20). `xjvtuderbirlwudatgxg` — das
Projekt, das vorher in `.env` stand — war für niemanden erreichbar, weder für
Almedin noch über den hier verfügbaren Supabase-MCP-Zugriff, und war laut
einer früheren Session ohnehin nie das echte Live-Backend (nur der leere
Lovable-Remix-Fork; die tatsächlich live laufende Seite nutzt ein drittes,
ebenfalls unerreichbares Projekt, `gonvfprvmbhzrczmpleq`). Neues Projekt unter
Almedins eigener, erreichbarer Supabase-Organisation angelegt, alle 27
Migrationen plus eine neu geschriebene (die `consultation-uploads`-Bucket-
Lücke, DECISIONS §20) abgespielt, alle 9 Edge Functions neu deployed.

**Secrets im neuen Projekt** (Project Settings → Edge Functions → Secrets) —
die alten Werte stecken unsichtbar im unerreichbaren Alt-Projekt, brauchten
also neue Zugangsdaten, nicht nur einen Umzug (DECISIONS §21):

| Secret | Status |
|---|---|
| `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` | ✅ gesetzt, `import-guesty-properties` erfolgreich gelaufen (23/23 Objekte) |
| `GUESTY_WEBHOOK_SECRET` | ✅ gesetzt |
| `GUESTY_STRIPE_PUBLISHABLE_KEY` | 🔴 offen, B1 |
| `GEMINI_API_KEY` | ✅ gesetzt, ersetzt `LOVABLE_API_KEY` (Lovables AI-Gateway ist eine „seamless"-Integration ohne kopierbaren Key, siehe DECISIONS §21); `analyze-property` ruft jetzt Gemini direkt auf (`gemini-3.6-flash`), Ende-zu-Ende mit einem temporären Testnutzer verifiziert |

Bis `GUESTY_STRIPE_PUBLISHABLE_KEY` gesetzt ist, bleibt nur noch der
Buchungsabschluss/Stripe tot (B1) — alles andere läuft: Property-Anzeige,
Formulare, Guesty-Webhook, KI-Analyse auf `/evaluate`.

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
| ~~B1~~ | ~~Stripe-Publishable-Key fehlte~~ — **erledigt am 21.08.2026** (DECISIONS §34). Almedin hat `pk_live_…` aus dem Guesty-Payment-Konto (`acct_1Pqi8YRsGzWWYqz8`) als `GUESTY_STRIPE_PUBLISHABLE_KEY` in die Edge-Function-Secrets des **neuen** Projekts `womaoywuhjchtubacbvn` eingetragen. Verifiziert: `guesty-stripe-config` liefert jetzt HTTP 200 mit dem korrekten Key statt HTTP 500. |
| ~~B2~~ | ~~City Tax war in Guesty falsch konfiguriert~~ — **erledigt am 21.08.2026** (DECISIONS §37). Almedin hat am Objekt Vienna Ottakring den Quantifier von `PER_GUEST_PER_NIGHT` auf `PER_STAY` umgestellt (Properties overview → Objekt → Pricing & policies → Pricing → Abschnitt „Tax" → Edit). Ungetestet bleibt, ob eine neue Quote jetzt eine plausible Steuer statt 97–144 % zeigt — noch keine frische Quote seit der Umstellung angefragt. |
| ~~B3~~ | ~~Guesty-Webhook ist nicht registriert~~ — **erledigt am 19.08.2026** (DECISIONS §19/§20/§21). Verifikation im Code korrigiert (echte Svix-Header statt eines erfundenen), Webhook über die Open API registriert, nach dem Projektwechsel auf die neue URL umgezogen (`_id: 6a85d5115666c70051150575`, zeigt auf `womaoywuhjchtubacbvn`) und `GUESTY_WEBHOOK_SECRET` gesetzt. Ungetestet bleibt, ob ein echtes Guesty-Event bereits erfolgreich durchgelaufen ist — noch kein Live-Event seit der Registrierung beobachtet. |
| B4 | **Material vom Besitzer:** Echte Vorher/Nachher-Fotos für die drei Case-Studies (Proof zeigt seit 19.08.2026 stattdessen jedes Objekts aktuelles Bestandsfoto aus dem Drive-Ordner „Listing Pictures" — kein Vorher/Nachher-Paar, siehe DECISIONS §14), Eigentümer-Testimonials, ein eigener Cal.com-Link (aktuell zeigt `OwnerContactForm` auf Almedins persönlichen Link). |
| ~~B5~~ | ~~Der PM-Hero läuft auf dem falschen Motiv~~ — **erledigt am 19.08.2026** (DECISIONS §17). `OwnerHero.tsx` zeigt jetzt ein eigenes, von Almedin per Drive-Link geliefertes Foto (`pmp-hero-villa-higueron.webp`, „Villa Higueron-11.jpg"), kein wiederverwendetes Karten-/Detailbild mehr. |
| B6 | **`property-5.webp` (Bild hinter „Own a Property" auf `/`) hat keine bestätigte Herkunft.** Der Code ordnet es `villa-in-higueron` zu, aber das Motiv (beiges Sofa, gemusterte Tapete, klassisches TV-Sideboard) passt stilistisch nicht zu den bestätigten Villa-Higuerón-Fotos (durchgehend minimalistisch, Marmor, Glasfronten). Vermutlich eine falsche Lovable-Altlast. Wartet darauf, dass Almedin den richtigen Drive-Ordner nennt oder das Foto direkt liefert (DECISIONS §17). |

### 🔴 Offen im Code

| # | Punkt |
|---|---|
| ~~C1~~ | ~~Der Gesamtpreis im Buchungsdialog war zu niedrig~~ — **erledigt am 21.08.2026** (DECISIONS §37, nach B2). `BookingSummary.tsx` rechnet jetzt `total = subTotalPrice + totalTaxes` statt `subTotalPrice` allein; FEE- und TAX-Invoice-Items werden getrennt statt über eine gemeinsame Regex zusammengefasst; eine eigene „Taxes"-Zeile erscheint in der Aufschlüsselung, sobald `taxes > 0`. Ungetestet bleibt eine echte Quote mit der korrigierten Guesty-Konfiguration (B2) dahinter. |
| ~~C2~~ | ~~Stille Fantasiepreise~~ — **bereits im Code gelöst, am 21.08.2026 beim Audit gefunden** (DECISIONS §38). `fetchQuote` erfindet bei fehlgeschlagener Quote **keinen** Preis mehr (kein `× 1,1` mehr im Code); stattdessen `setQuote(null)` + `setQuoteError(...)`, mit Kommentar „a made-up price is worse than a lost booking". `validateBookingInput` blockiert zusätzlich das Absenden, solange `!quote \|\| quoteError`. Damit ist bereits die empfohlene Variante („blockieren") umgesetzt — die Doku war schlicht nicht nachgezogen worden. |
| ~~C3~~ | ~~Endlos-Spinner statt Fehlermeldung~~ — **bereits im Code gelöst, am 21.08.2026 beim Audit gefunden** (DECISIONS §38). Schlägt `guesty-stripe-config` fehl, setzt `BookingSummary.tsx` `paymentUnavailable`, zeigt einen sichtbaren Fehlerzustand („Card payment is currently unavailable") und bietet „Send booking request instead" als Ausweichpfad über `handleSwitchToInquiry`; der tote „Complete Booking"-Button wird dabei ausgeblendet. |
| C4 | **Nächtlicher Preis-Sync: angewendet, aber architektonisch kaputt — Cron bewusst deaktiviert.** `supabase/migrations/20260813200000_nightly_price_sync.sql` wurde am 21.08.2026 mit Freigabe auf `womaoywuhjchtubacbvn` angewendet (DECISIONS §39), dabei drei echte Bugs gefunden und gefixt (tote alte Projekt-URL im Retry-Zweig, fehlende Spalte `price_last_synced_at`, mehrdeutige `slug`-Variable). Der eigentliche manuelle Testlauf schlug trotzdem für alle 23 Objekte fehl: `net.http_post()` und `net._http_collect_response()` liefen im selben PL/pgSQL-Funktionsaufruf — also derselben Transaktion —, und pg_nets Hintergrund-Worker kann eine wartende Anfrage erst sehen, nachdem die Transaktion committet ist. Kein Retry/Sleep *innerhalb* der Funktion kann das beheben, das ist ein Architekturproblem, kein Tippfehler. **Der nächtliche Cron-Job wurde deshalb sofort wieder deaktiviert** (`cron.unschedule`), damit er nicht jede Nacht 23 nutzlose Guesty-Anfragen verbrennt. Empfohlener nächster Schritt: den Sync als Edge Function bauen (normales `fetch`/`await`, kein `pg_net`), die `pg_cron` nur noch einmal pro Lauf anstößt, statt der Post-dann-Collect-Logik direkt in SQL. Bis dahin bleibt `price_per_night` der eingefrorene Importwert (siehe „Preise — die wichtigste Falle" oben). |
| ~~C5~~ | ~~Das Layout-System endet fast überall~~ — **fünf von sechs Unterseiten erledigt am 19.08.2026** (DECISIONS §23): `/renovations`, `/investments`, `/guaranteed-income`, `/about`, `/properties` laufen jetzt auf `Section`/`Container`/`Grid`/`Panel` und der `.t-*`-Skala statt `container mx-auto px-4` + `font-playfair text-4xl…`. `SectionIntro` bekam dafür einen neuen `headingAs?: "h1" \| "h2"`-Prop. `/business-areas` bewusst ausgelassen (siehe D2 — verwaist, Redirect-Kandidat, keine Arbeit an einer absehbar verschwindenden Seite wert). `tsc`/`build`/`lint` sauber; die Browser-Sichtprüfung steht noch aus, weil die Chrome-DevTools-Verbindung zum Zeitpunkt der Umstellung getrennt war — nachzuholen. |
| ~~C6~~ | ~~`public/videos/hero-background.mp4` ist kaputt~~ — **erledigt am 19.08.2026** (DECISIONS §22). Almedin lieferte eine echte 4K-Aufnahme (Puente Romano, 222 MB); mit neu installiertem `ffmpeg` auf 1280×720, ohne Ton, ~5,8 MB re-encodiert. `Hero.tsx` läuft jetzt per Default auf `videoType: "file"`, der YouTube-Embed bleibt als unbenutzter Fallback im State. |
| C7 | **Texte sind nicht dauerhaft im CMS änderbar.** `EditableText` / `EditableImage` / `EditableVideo` schreiben nur in lokalen React-State — nach einem Reload ist jede Änderung weg. Es gibt keine Persistenz-Tabelle; der einzige Override-Mechanismus (`PageWrapper` → Tabelle `pages`) ist für keine Seite aktiv. **Konsequenz:** Was im Code steht, ist der Text. „Das ändert der Kunde später selbst" stimmt heute nicht. |

### 🟡 Offen, braucht eine Entscheidung

| # | Punkt |
|---|---|
| ~~D1~~ | ~~Der einzige gefüllte Header-Button ist ein Gäste-Login~~ — **erledigt am 20.08.2026** (DECISIONS §27). Der neue `variant="propertyManagement"`-Header hat kein „Sign In" mehr; der einzige gefüllte Button ist „Apply" (→ `#get-in-touch`, das Kontaktformular) — ein eigentümer-relevanter CTA statt eines Gäste-Logins. |
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
- **Verbliebene leere Bildslots zeigen ihr Briefing statt ein vorhandenes Foto
  ein zweites Mal.** Hero, Relax/Kontakt und die drei Case-Studies sind seit
  §14–§17 alle mit echten Fotos befüllt; offen sind nur noch die Slots, für
  die es nie eine Aufnahme gab.
- **Die Detailfragen zum Guaranteed Income** (Festbetrag, Vertragsdauer,
  Kostenträger, Eigennutzung) werden absichtlich nicht auf der Website
  beantwortet — das klärt sich im Gespräch.
- **Die alten PNGs in `src/assets/`** liegen absichtlich noch da, falls die
  Originale nochmal gebraucht werden. Sie landen in keinem Build.
