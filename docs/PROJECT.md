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

| # | Ebene | Komponente |
|---|---|---|
| 1 | Navigation | `Navigation` |
| 2 | Hero + Kontaktformular (Konversion im ersten Screen) | Hero in `PropertyManagementPage` + `OwnerContactForm` |
| 3 | **Trust** — Portfolio-Zahlen | `Stats` (mit Überschrift) |
| 4 | **Earns** — „We manage what the property earns." | `FinancialPerformance` |
| 5 | **Relax** — „We manage while you relax." | `PropertyManagement` |
| 6 | **Different** — Technologie dominant | `WhyItMakesADifference` |
| 7 | **Details** — „It's in the details." | `ListingWorkflow` |
| 8 | **Destinations + Transformations** | `ProjectsSection` |
| 9 | **About / Trust** | `AboutMini` |
| 10 | **Two ways to start** (Renovations & Investments verschachtelt) | `WaysToWorkTogether` |
| 11 | FAQ | `FAQ` |
| 12 | **CTA** — „Get in touch." | `GetInTouch` |
| 13 | Footer | `Footer` |

Zwei Reihenfolgen sind **verbindlich** und dürfen nicht „aufgeräumt" werden:

- **Earns vor Relax.** Erst was es einbringt, dann wie wenig Aufwand es macht.
- **Different vor Details.** Der Anspruch muss vor seinem Beleg kommen, sonst
  liest der Eigentümer eine Aufgabenliste ohne etwas, woran sie hängt.

Das Gewicht ist **absichtlich ungleich**: `FinancialPerformance` bekommt
`size="lg"` und das volle Grid, `PropertyManagement` ist eine ruhige Zeile auf
`tone="muted"`.

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
| B4 | **Material vom Besitzer:** Vorher/Nachher-Fotos für die drei Projekte (aktuell „Coming Soon"-Platzhalter), Eigentümer-Testimonials, ein eigener Cal.com-Link (aktuell zeigt `OwnerContactForm` auf Almedins persönlichen Link). |

### 🔴 Offen im Code

| # | Punkt |
|---|---|
| C1 | **Der Gesamtpreis im Buchungsdialog ist zu niedrig.** `BookingSummary.tsx` nimmt `subTotalPrice` als Total, die Steuerzeile fehlt in der Aufschlüsselung. Richtig wäre `subTotalPrice + totalTaxes` plus eigene Zeile „Taxes" — **aber erst nach B2.** |
| C2 | **Stille Fantasiepreise.** Schlägt die Quote fehl, rechnet `fetchQuote` ersatzweise `price_per_night × Nächte × 1,1`. Die 10 % sind erfunden, der Gast sieht eine glaubwürdige Zahl ohne Hinweis — und kann damit buchen. Offene Entscheidung von Almedin: Buchung **blockieren** oder als unverbindliche Anfrage weiterlaufen lassen? Empfehlung: blockieren. |
| C3 | **Endlos-Spinner statt Fehlermeldung.** Schlägt `guesty-stripe-config` fehl, landet der Fehler nur in der Konsole; das Kartenfeld rendert nie, der Button bleibt dauerhaft `disabled`. Es braucht einen sichtbaren Fehlerzustand plus den Anfrage-Weg als Ausweichpfad. |
| C4 | **Nächtlicher Preis-Sync ist geschrieben, aber nicht angewendet.** `supabase/migrations/20260813200000_nightly_price_sync.sql` — der Header der Datei dokumentiert genau, was live verifiziert wurde und was nicht. Vor dem Vertrauen: in den Supabase-SQL-Editor einfügen und `SELECT * FROM public.sync_guesty_prices();` von Hand laufen lassen. Bis dahin altert der manuelle Sync vom 13.08.2026 weiter ab. |
| C5 | **Das Layout-System endet fast überall.** `src/components/layout/` ist verdrahtet in `PropertyManagementPage.tsx` sowie den Komponenten `ProjectsSection.tsx` und `PropertyCollections.tsx` — **sonst nirgends.** Alle Unterseiten (`/renovations`, `/investments`, `/guaranteed-income`, `/about`, `/properties`, `/business-areas`) laufen noch auf `container mx-auto px-4` plus eigenem `max-w-*`. Wer über „Two ways to start with us" auf `/renovations` klickt, landet spürbar auf einer anderen Website. Größter sichtbarer Bruch im aktuellen Stand. |
| C6 | **`public/videos/hero-background.mp4` ist kaputt.** 900 KB, passend benannt, nie verdrahtet — aber die ersten Bytes sind `<!doctype html>`. Chrome quittiert mit `DEMUXER_ERROR_COULD_NOT_OPEN`. Bewusst liegen gelassen, falls die echte Datei noch existiert. Sobald ein funktionierendes MP4 unter `public/videos/` liegt, reicht in `Hero.tsx` `videoType: "file"` plus Pfad. |
| C7 | **Texte sind nicht dauerhaft im CMS änderbar.** `EditableText` / `EditableImage` / `EditableVideo` schreiben nur in lokalen React-State — nach einem Reload ist jede Änderung weg. Es gibt keine Persistenz-Tabelle; der einzige Override-Mechanismus (`PageWrapper` → Tabelle `pages`) ist für keine Seite aktiv. **Konsequenz:** Was im Code steht, ist der Text. „Das ändert der Kunde später selbst" stimmt heute nicht. |

### 🟡 Offen, braucht eine Entscheidung

| # | Punkt |
|---|---|
| D1 | **Der einzige gefüllte Header-Button ist ein Gäste-Login** („Sign In"), auf einer Seite, deren primäre Zielgruppe Eigentümer sind. Vorschlag aus dem CX-Teardown: „Talk to us about your property" als einziger gefüllter Button. Das ist eine Design-Entscheidung, kein Bugfix — braucht Freigabe. |
| D2 | **`/business-areas`** ist kein Menüpunkt mehr, die Route lebt weiter und trägt eine ältere, widersprüchliche Version der Positionierung („Business Areas", „Guaranteed Income Program" mit „Included"-Badge). Zwei Seiten konkurrieren um dieselben Keywords. Vorschlag: 301 auf `/property-management`. |
| D3 | **„It's in the details." steht auf beiden Seiten** — als Gäste-Section auf `/` (`GuestManagement.tsx`) und als Detailebene der PM-Seite (`ListingWorkflow.tsx`). Zwei Seiten, zwei Zielgruppen — kaputt ist das nicht, aber eine der beiden sollte einen eigenen Titel bekommen. **Die Gäste-Fassung nicht ohne Rückfrage ändern:** der Text dort ist geprüft. |
| D4 | **Die Kennzahlen sind hartkodierte Copy** (`41 Properties Managed · 1500+ Successful Reservations · 8 Destinations · 50+ Collaborators`), keine Live-Daten — und sie stehen auf `/` und der PM-Seite identisch. Der Sitemap-Build meldet **23 Objekte**, `ProjectsSection` nennt „20+ premium properties" für Spanien. Gegenüber „41" ist das erklärungsbedürftig. Offen ist auch, ob die „8 Destinations" kroatische Orte mitzählen — Kroatien ist kein Bestandsmarkt. |
| D5 | **Keine Fee-Transparenz.** `WaysToWorkTogether` stellt beide Modelle klar gegenüber, nennt aber nirgends eine Provisionsspanne. Für die *Details* ist die Verlagerung ins Gespräch richtig; für die **Größenordnung** kostet es Anfragen. |
| D6 | **Der Eigentümer-Funnel ist nicht messbar.** Im gesamten öffentlichen Code existiert ein einziger Tracking-Aufruf: `page_view` auf `/`. Vier Events würden genügen: `pm_page_view`, `evaluator_submitted`, `evaluator_result_viewed`, `owner_enquiry_submitted`. Ohne die lässt sich kein anderer Punkt dieser Liste nach der Umsetzung verifizieren. |
| D7 | **Landing-Hero-Headline ist ein Platzhalter** („Luxury Villas & Vacation Rentals in Spain and Austria"), vom Besitzer abzusegnen. Ebenso die „Own a Property?"-Texte — insbesondere „earn **with** us" (Provisionsmodell) gegenüber „earn **from** us" (das wäre Guaranteed Income, also Festmiete). |
| D8 | **`collection`-Spalte für die Property-Tabelle.** Die drei Reihen in `PropertyCollections.tsx` leiten die Zuordnung aus `location` und dem Namen ab. Eine Immobilie in einem neuen Ort erscheint in **keiner** Reihe, bis jemand den Ort im Code ergänzt. |
| D9 | **Objekt mit 63 Nächten Mindestaufenthalt im Buchungsfluss.** „6th floor Malaga Soho" steht auf Langzeitmiete (`terms.minNights = 63`). Ein Gast, der Daten wählt, bekommt dort ausnahmslos eine Absage. Produktfrage: soll es im normalen Flow überhaupt auftauchen? |
| D10 | **Drei Objekte ohne Live-Preis** (Los Monteros Retreat, Luxury Escape Los Flamingos Golf Retreat, THE ONE Higuerón) — bei jedem getesteten Zeitfenster bis 400 Tage voraus „nicht verfügbar". Liest sich als in Guesty blockiert/inaktiv. In Guesty prüfen. |

### Bewusst so gelassen

- **Die FAQ auf der PM-Seite ist wortwörtlich die gästeseitige FAQ** von `/`, nur
  mit neuer Überschrift. Das ist die Umkehrung des Projekt-Hauptfehlers — von
  Almedin bewusst so angefordert. Wenn eigentümer-spezifische Fragen gewünscht
  sind, braucht es eigenen Content vom Kunden.
- **Das Hero-/Formularbild der PM-Seite ist `about-hero.webp`**, also eine
  Zweitverwertung des About-Seiten-Bildes. Über `EditableImage` austauschbar.
- **Die Detailfragen zum Guaranteed Income** (Festbetrag, Vertragsdauer,
  Kostenträger, Eigennutzung) werden absichtlich nicht auf der Website
  beantwortet — das klärt sich im Gespräch.
- **Die alten PNGs in `src/assets/`** liegen absichtlich noch da, falls die
  Originale nochmal gebraucht werden. Sie landen in keinem Build.
