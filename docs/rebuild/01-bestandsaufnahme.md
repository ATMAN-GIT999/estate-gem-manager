# 01 · Bestandsaufnahme — was heute im Code steht

> **Rolle dieser Datei:** rein faktisch. Was ist da, wo liegt es, was hängt
> daran. **Keine Empfehlungen, keine Urteile** — die stehen in
> [02-mapping.md](02-mapping.md).
>
> Stand: 12.09.2026 · Branch `redesign/wireframe-2026-09` (von `main`,
> HEAD `4542726`, Arbeitsverzeichnis war sauber)

---

## 0 · Ausgangslage der Session

| | |
|---|---|
| `git status` | sauber, kein Stash, keine unstaged Änderungen |
| Branch | `redesign/wireframe-2026-09`, abgezweigt von `main` |
| Die im Prompt genannten „offenen" Dateien | alle committed (`PropertyCard.tsx`, `PropertyDetail.tsx`, `Properties.tsx`, `LocationAutocomplete.tsx`, `public/_redirects`, `vercel.json`, `translations.ts`, `ProjectsSection.tsx`, `WaysToWorkTogether.tsx` — zuletzt in `4598b5c`…`4542726`) |

### Wie das Repo deployt wird

Über **Lovables GitHub-Sync**, nicht über eine CI im Repo.

- Lovable-Projekt `estate-gem-manager`, ID `a38d8473-65e2-4999-9a44-3f15d4958a70`,
  Workspace „Frontier's Lovable", `is_published: true`, zuletzt dort bearbeitet
  am 30.08.2026.
- Lovables eigener Vorschau-Screenshot trägt die URL
  `…id-preview-4542726b--a38d8473….lovable.app…` — `4542726` ist der aktuelle
  HEAD von `main`. Lovable baut also **den Default-Branch**.
- Es gibt **kein** `.github/`, **keine** `netlify.toml`. `vercel.json`
  (Rewrite auf `/index.html`) und `public/_redirects` (`/* /index.html 200`)
  liegen beide im Repo, weil der Host offen ist — DECISIONS §55. Keine der
  beiden Dateien ist nachweislich an einen aktiven Host gebunden.
- `vite.config.ts` lädt `lovable-tagger` (nur im Dev-Mode).

⚠️ **Nicht feststellbar von hier aus:** Lovable meldet als veröffentlichte URL
`https://estate-gem-manager.lovable.app` — **nicht** `frontier-residences.com`.
Ob die Custom-Domain an diesem Projekt hängt, steht in keiner erreichbaren
Quelle.

⚠️ **Bekannte Lovable-Falle** (DECISIONS §46, PROJECT.md §3): Der
Lovable-Editor setzt `.env` beim Öffnen still auf das tote Supabase-Projekt
`xjvtuderbirlwudatgxg` zurück. Vor jedem Push prüfen, ob dort noch
`womaoywuhjchtubacbvn` steht.

---

## 1 · Routen (verifiziert gegen `src/App.tsx`)

Öffentlich und eager importiert: `/`, `/about`, `/projects`,
`/business-areas`, `/property-management`, `/guaranteed-income`,
`/renovations`, `/investments`, `/evaluate`, `/auth`, `/update-password`,
`/properties`, `/booking-confirmation`, `/property/:slug`, `/aviso-legal`,
`/p/:slug`, `*`.

13 Admin-Routen unter `/admin/*`, jede einzeln `lazy()`.

Die vier Routen dieses Rebuilds: **`/`**, **`/property-management`**,
**`/properties`**, **`/property/:slug`**.

---

## 2 · Route `/` — Landing

Gerendert von `src/pages/Index.tsx`, gewrappt in
`PageWrapper slug="site--home"`.

| # | Section | Datei | Edit-Layer | Text aus |
|---|---|---|---|---|
| 1 | `Navigation overlay` | `src/components/Navigation.tsx` | `nav-1` · `nav-3` · `nav-signin-btn` · `nav-auth-btn` · `nav-book-stay-cta` | `translations.ts` |
| 2 | `Hero` (enthält `SearchBar`) | `src/components/Hero.tsx` | `hero-video` (EditableVideo) · `hero-headline` · `hero-subheadline` | `translations.ts` |
| 3 | `PropertyCollections` | `src/components/PropertyCollections.tsx` | Reihen-Titel/Leads · `collections-view-all` | `translations.ts` (`coll-*`) |
| 4 | `GuestManagement` | `src/components/GuestManagement.tsx` | `pm-guest-badge/title/desc` · `pm-guest-title-0…5` · `pm-guest-desc-0…5` · `pm-contact-btn-2` | `translations.ts` |
| 5 | `FAQ` | `src/components/FAQ.tsx` | `faq-eyebrow` · `faq-heading` | `translations.ts` (`faq-q-*`, `faq-a-*`) |
| 6 | `OwnAProperty` | `src/components/OwnAProperty.tsx` | `oap-image` (MediaFrame) · `oap-heading` · `oap-subheading` · `oap-cta` | `translations.ts` |
| 7 | `PropertyEvaluator` | `src/components/PropertyEvaluator.tsx` | `pe-section-title` · `pe-section-subtitle` · `pe-button-text` | `translations.ts` (`pe-*`) |
| 8 | `Footer` | `src/components/Footer.tsx` | 17 `footer-*`-IDs | `translations.ts` |

> ⚠️ **`docs/PROJECT.md` §2 beschreibt diese Seite falsch.** Die Tabelle dort
> führt `Stats heading=""` als Section 3 und `FAQ` als Section 8 hinter
> `PropertyEvaluator`. Im Code ist `Stats` auf `/` **gar nicht mehr
> eingebunden**, und `FAQ` steht **vor** `OwnAProperty` — mit einem Kommentar
> in `Index.tsx`, der beides begründet („drop the stats section from the
> landing page"; „a guest with a question gets it answered before the page
> asks them to switch audiences"). PROJECT.md ist hier nachzuziehen.

Weitere Fakten:

- `Stats.tsx` lebt weiter, exportiert aber nur noch `StatsRow` und
  `PORTFOLIO_STATS` für `Proof` auf der PM-Seite.
- `Index.tsx` schreibt einen `page_view` nach `analytics_events` — erst nach
  Cookie-Zustimmung (`useCookieConsent`).
- `Seo` mit `organizationSchema()` + `faqSchema(FAQ_ITEMS)`.
- Bilder: `oap-villa-entrance.webp` (OwnAProperty), Hero-Video
  `public/videos/hero-background.mp4`, Property-Fotos aus Guesty über
  `PropertyCard`.

### Guesty auf `/`

Nur indirekt: `PropertyCollections` liest `properties` aus Supabase
(`supabase.from("properties").select("*")`) und rendert `PropertyCard`.
`PropertyCard` nimmt `property.images[0].url` — das sind Guesty-Bilder aus dem
Import. **Kein** Edge-Function-Aufruf auf dieser Seite. `SearchBar` im Hero
schreibt nur URL-Parameter und navigiert nach `/properties`.

---

## 3 · Route `/property-management`

Gerendert von `src/pages/PropertyManagementPage.tsx`, gewrappt in
`PageWrapper slug="site--property-management"`.

| # | Section | Datei | Gewicht (PROJECT.md) | Edit-IDs (Auswahl) |
|---|---|---|---|---|
| 1 | `OwnerHero` | `src/components/OwnerHero.tsx` | hoch | `pmp-hero-image` · `pmp-hero-eyebrow` · `pmp-page-title` · `pmp-page-lead` · `pmp-hero-cta-1/2` |
| 2 | `TheSystem` | `src/components/TheSystem.tsx` | sehr hoch | `wid-*` (Kopf) · `sys-label-0…5` · `sys-body-0…5` · `sys-closing-line` |
| 3 | `Proof` | `src/components/Proof.tsx` | hoch | `proof-eyebrow` · `stats-title` · `proof-cases-label` · `proof-benefits-heading` · `proof-case-image-0…2` · `proof-cta` |
| 4 | `WorkingWith` | `src/components/WorkingWith.tsx` | leicht | `working-with-eyebrow` + Logo-Slots |
| 5 | `WaysToWorkTogether` | `src/components/WaysToWorkTogether.tsx` | hoch | `ways-eyebrow` · `ways-heading` · `ways-model-*-0/1` · `beyond-eyebrow` · `beyond-heading` · `ways-sub-*-0/1` |
| 6 | `AboutMini` | `src/components/AboutMini.tsx` | mittel | `am-cta` · `am-link` + Team-Panels |
| 7 | `FAQ eyebrow="" heading="Frequently Asked Questions"` | `src/components/FAQ.tsx` | mittel | wie auf `/` |
| 8 | `OwnerContactForm` | `src/components/OwnerContactForm.tsx` | hoch | `pm-relax-image` · `owner-form-eyebrow` · `pm-section-title` · `owner-form-lead` · `owner-form-btn` · `owner-form-call-btn` |
| — | `Footer` | `src/components/Footer.tsx` | leicht | |

`Navigation` läuft hier als `variant="propertyManagement"` — kein Sign-in,
Switcher nur mit Sprachen, goldener Button „Apply →" auf `#get-in-touch`.

Bilder: `pmp-hero-villa-higueron.webp` (Hero), `platform-connections.webp`
(TheSystem), `villa-hoyo-19.webp` · `soho-boho.webp` · `alpine-retreat.webp`
(Proof-Cases), vier Partnerlogos (`partner-sur-film` · `partner-guesty` ·
`partner-vasari` · `partner-chekin`), `team-lorenz/alejandro/julien.webp`
(AboutMini), `los-monteros-relax.webp` (Kontaktformular).

### Guesty / Backend auf `/property-management`

- **Kein Guesty-Aufruf.** Die Seite ist vollständig statisch bis auf zwei
  Schreibpfade.
- `OwnerContactForm` schreibt nach Supabase-Tabelle `contacts`:
  `source: LEAD_SOURCE = "consultation-booking"` (Zeile 56/155). Die
  Unterscheidung zur `/evaluate`-Einsendung läuft über
  `metadata.submitted_from`. **`source` ist nicht frei wählbar** — die
  RLS-Policy lässt nur diesen Wert durch (PROJECT.md §4).
- `AboutMini` liest Supabase (Auth-State für den CTA).
- Die vier Zahlen in `Proof` kommen aus `PORTFOLIO_STATS` in `Stats.tsx`:
  hartkodiert `41 Properties Managed` · `1500+ Successful Reservations` ·
  `8 Destinations` · `50+ Collaborators`.
- Die drei Case Studies kommen aus `FEATURED_PROJECTS` in
  `ProjectsSection.tsx` (geteilt mit `/projects`): Hoyo 19 (Benahavís),
  Soho Boho (Málaga), Alpine Retreat (Kärnten).

### `PropertyEvaluator` → `/evaluate`

`PropertyEvaluator.tsx` steht heute auf `/`, nicht auf der PM-Seite. Es ist ein
Formular mit **sechs** Feldern in einer shadcn-`<Card>`: Adresse
(`AddressAutocomplete`), Schlafzimmer, Bäder, Objekttyp, Größe, Gäste.
`handleSubmit` rechnet nichts — es navigiert mit
`navigate("/evaluate", { state: { propertyData } })`. Die eigentliche Analyse
läuft auf `Evaluate.tsx` über die Edge Function `analyze-property`
(Gemini `gemini-3.6-flash`).

---

## 4 · Route `/properties`

Gerendert von `src/pages/Properties.tsx`, gewrappt in
`PageWrapper slug="site--properties"`.

Aufbau, von oben:

1. `Navigation` (default, **nicht** overlay) · `<main className="pt-24">`
2. Sticky Filterleiste: `<div sticky top-20 border-b bg-background>` mit
   `SearchBar collapsible` (→ `LocationAutocomplete`), darunter ein
   „Filter aktiv"-Hinweis mit Clear-Link.
3. `<Section size="sm">` mit Eyebrow (`properties-page-eyebrow`), H1
   (`properties-page-title`), Trefferzahl und einem `Select` für die
   Sortierung (Recommended · Preis auf · Preis ab; Default **`price-desc`**).
4. `<Grid cols={3} gap="sm">` mit `PropertyCard`, sonst Skeletons oder der
   Leerzustand (`properties.noMatch` · `tryDifferent` · `clearFilters`).
5. `Footer`.

Edit-Layer: nur `properties-page-eyebrow` und `properties-page-title`.
Alles andere über `t()`.

### Guesty auf `/properties` — die kritische Stelle

```
useEffect([activeCheckIn, activeCheckOut, properties])
  └─ für JEDES Objekt mit guesty_listing_id, SEQUENZIELL:
       supabase.functions.invoke("guesty-get-calendar", { listingId, checkIn, checkOut })
```

Drei Dinge hängen daran und dürfen bei einem Re-Skin nicht verloren gehen:

- **Sequenziell, nicht parallel** (Kommentar Zeile ~108): Guesty erlaubt nur
  3 Tokens / 24 h. Parallele Aufrufe versuchen alle gleichzeitig zu
  refreshen und laufen ins Rate-Limit.
- **Fehler blendet nicht aus:** schlägt der Kalender fehl, wird das Objekt als
  `available: true` behandelt, statt es aus der Liste zu werfen.
- `checkingAvailability` rendert einen zentrierten Spinner über dem Titel —
  bewusst groß, weil die Prüfung mehrere Sekunden dauert (DECISIONS §53).

Die Liste selbst kommt aus Supabase (`properties`, `available = true`,
`featured desc`, `created_at desc`). Standort- und Gästefilter laufen
**clientseitig** über `location`/`address`/`name`.

`PropertyCard` (`src/components/PropertyCard.tsx`): Foto **4:3**, gerahmte
Karte (`rounded-xl bg-card shadow-sm hover:shadow-md`), Titel `.t-item`,
Standort `.t-meta`, Fakten `.t-body`, Preis mit `from`-Präfix nur wenn
`guesty_listing_id` gesetzt ist. Bild: `property.images[0].url`, sonst die
Ein-Eintrag-Map `{"los-monteros-retreat": los-monteros-card.webp}`, sonst
`property-3.webp`.

---

## 5 · Route `/property/:slug`

Gerendert von `src/pages/PropertyDetail.tsx`.
**Kein `PageWrapper`, kein einziges `EditableText`/`EditableImage`.** Alle
UI-Texte über `t("pd-*")`, alle Inhalte aus der Zeile in `properties`.

Aufbau, von oben:

1. `Navigation` (default) · `<main className="pt-24 pb-12">`
2. `<div className="container mx-auto px-4">` — **das Layout-System ist auf
   dieser Seite nicht angekommen.** Kein `Container`, kein `Section`, kein
   `Grid`.
3. „Back to Properties"-Button (rekonstruiert die Suchparameter zurück).
4. Galerie: ein Leitbild + vier kleine in einem `grid-cols-4 grid-rows-2`,
   `h-[50vh]`, eine `rounded-2xl`-Klammer, 2px Gap. Darüber ein
   „Show all N photos"-Button. Zwei Dialoge: Übersichtsraster und
   Solo-Lightbox mit Pfeilen.
5. `grid lg:grid-cols-5`: links (3 Spalten) Titel, Standort, Typ-Badge,
   Featured-Badge, Fakten (Betten/Bäder/Gäste), „About", **die vollständige
   Amenities-Liste** (zweispaltig, Icons aus `lib/amenityIcons`), „Location"
   als reiner Adresstext, ggf. Registriernummer.
6. Rechts (2 Spalten) die Buchungskarte: shadcn `<Card className="sticky
   top-24">` mit „Live pricing"-Hinweis (bei `guesty_listing_id`) bzw.
   `price_per_night`, `AvailabilityCalendar`, Gästefeld, „Book now".
7. `Footer` und der `BookingSummary`-Dialog.

### Typografie-Ist-Zustand dieser Seite

`font-playfair text-4xl font-bold` (H1), `font-playfair text-2xl font-bold`
(drei H2), `text-xl`, `text-lg`, `text-3xl`, `text-sm`, `text-xs`. Die
`.t-*`-Skala wird hier **nicht** benutzt. Das ist der letzte größere Rest aus
PROJECT.md C5.

### Guesty auf `/property/:slug` — der Zahlungspfad

```
AvailabilityCalendar  → functions.invoke("guesty-get-calendar")
BookingSummary        → functions.invoke("guesty-stripe-config")
                      → functions.invoke("guesty-get-quote")
                      → functions.invoke("guesty-create-reservation")
                      + Stripe Elements (CardElement, createPaymentMethod)
```

Zustände in `BookingSummary.tsx`, die die Präsentation mittragen muss:

| Zustand | Wirkung |
|---|---|
| `quoteError` / `!quote` | kein Preis wird erfunden, Absenden ist blockiert (DECISIONS §38) |
| `paymentUnavailable` | Kartenfeld weg, sichtbarer Fehler, Ausweichpfad „Send booking request instead" |
| `datesValid` | `Book now` ist deaktiviert, bis der Kalender gültige Daten meldet |

`AvailabilityCalendar` bekommt `fallbackNightlyRate={property.price_per_night}`
und zeigt Preise pro Tag im DayPicker.

---

## 6 · Global — Tokens, Schriften, Primitives

### Farb-Tokens (`src/index.css`, `@layer base :root`)

| Token | Wert heute | entspricht | Wireframe-Pendant |
|---|---|---|---|
| `--background` | `32 26% 92%` | ≈ `#F0EBE5` | `bg` `#FFFFFF` |
| `--foreground` | `133 14% 22%` | `#30402F`-nah | `fg` `#304034` ✅ |
| `--card` | `0 0% 100%` | `#FFFFFF` | — |
| `--primary` | `133 11% 36%` | `#526656`-nah | `sage` `#526656` ✅ |
| `--primary-foreground` | `0 0% 100%` | | |
| `--secondary` | `32 24% 87%` | `#E6DED6` | Platzhalterfläche `#E6DED6` ✅ |
| `--muted` | `32 20% 88%` | | |
| `--muted-foreground` | `133 10% 34%` | grünstichig | `muted` `#59615F` (kühler) ❌ |
| `--accent` | `40 42% 52%` | | `gold` `#C2A15C` = `41 46% 56%` ❌ knapp daneben |
| `--accent-foreground` | `36 30% 12%` | | Text auf Gold `#241C0B` ≈ ✅ |
| `--accent-strong` | `38 55% 30%` | `#775822` | `goldS` `#775822` ✅ |
| `--accent-on-primary` | `42 60% 82%` | | `goldL` `#EDDCB6` ≈ ✅ |
| `--border` / `--input` | `32 16% 83%` | `#DBD4CD` | `rule` `#DBD4CD` ✅ |
| `--radius` | `0.75rem` | | Buttons `999px` |
| — | existiert nicht | | `ink` `#131B15` fehlt |

⚠️ Der Kommentar an `--background` sagt `/* #efe6d9 */`, der Wert
`32 26% 92%` rendert aber `#F0EBE5`. Wert und Kommentar stimmen heute nicht
überein.

Weitere Tokens: `--space-xs…2xl` (12 · 24 · 28→40 · 40→64 · 56→96 · 72→140),
`--container-max: 1440px`, `--container-gutter: clamp(1.25rem, 3.5vw, 3rem)`,
`--overlay-media`, `--shadow-elegant/soft/gold`, `--gradient-gold`.

`tailwind.config.ts` verdrahtet die Spacing-Leiter als `py-lg`/`gap-md`/… und
kennt zwei Schriftfamilien: `playfair` und `lato`.

### Typo-Skala heute (`@layer components` in `index.css`)

| Klasse | Familie | Größe (clamp) | Gewicht |
|---|---|---|---|
| `.t-display` | Playfair | 38 → 64px | 700 |
| `.t-section` | Playfair | 30 → 44px | 700 |
| `.t-block` | Playfair | 22 → 28px | 700 |
| `.t-item` | Lato | 17 → 18px | 700 |
| `.t-body` | Lato | 16 → 17px | 400 |
| `.t-meta` | Lato | 12 → 13px | 700, uppercase, `0.12em` |

**Sechs Rollen.** Das Wireframe-Artboard „Type scale" definiert **sieben** —
neu ist `Card title` (19/17px, 400, +7 % Tracking, uppercase) für
Objektnamen.

### Schriften — wie sie eingebunden sind

Selbst gehostet über `@fontsource`, in `src/index.css` Zeile 24–28:

```
@import '@fontsource-variable/playfair-display';
@import '@fontsource-variable/playfair-display/wght-italic.css';
@import '@fontsource/lato/latin-300.css';
@import '@fontsource/lato/latin-400.css';
@import '@fontsource/lato/latin-700.css';
```

Kein Link auf `fonts.googleapis.com`, weder in `index.html` noch im Build —
ausdrücklich als DSGVO-Entscheidung kommentiert (Büro und Kunden in
Österreich). `src/pages/admin/Builder.tsx` importiert dieselben Fontsource-CSS
zusätzlich als `?url`, um sie in den GrapesJS-Vorschau-Iframe zu injizieren.
`package.json` führt `@fontsource-variable/playfair-display`,
`@fontsource/playfair-display` und `@fontsource/lato`.

⚠️ Das Wireframe-HTML selbst enthält in jedem Artboard ein
`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo…">`.
Das ist Prototyp-Technik und darf nicht mitwandern.

### Layout-Primitives (`src/components/layout/`)

| Primitive | Props |
|---|---|
| `Container` | `measure`: `full` · `wide` (max-w-5xl) · `text` (max-w-3xl) · `narrow` (max-w-xl) |
| `Section` | `tone`: `page` (`bg-background`) · `muted` (`bg-secondary/30`) · `primary` (`bg-primary`); `size`: `none`/`sm`(py-lg)/`md`(py-xl)/`lg`(py-2xl); `edge`: `none`/`top`/`bottom`/`both` (Goldnaht); `measure`; `bleed` |
| `Grid` | `cols` (n gleiche Spalten) oder rohes 12-Spalten-Grid; `gap` |
| `Stack` · `Divider` (`tone="gold"` / `"bar"` 56×2px) · `Panel` · `Surface` (`silver`/`card`/`outline`, `rounded-[2rem]`) | |

### `MediaFrame` — wie es funktioniert

`src/components/layout/MediaFrame.tsx`. Ein Bildslot mit zwei Zuständen:

- **mit `src`** → rendert `EditableImage` (also Foto + Inline-CMS),
- **ohne `src`** → rendert `.bg-placeholder-hatch` plus den `note`-Text als
  `.t-meta`, `aria-hidden="true"`.

Props: `id`, `src?`, `alt?`, `onChange?`, `note` (Pflicht — das Briefing),
`fill?`, `aspect?` (`wide` 16:9 · `photo` 4:3 · `square`), `onPrimary?`.

Die Schraffur in `index.css`:

```css
.bg-placeholder-hatch {
  background-color: hsl(var(--secondary));            /* #E6DED6 */
  background-image: repeating-linear-gradient(115deg,
    hsl(var(--accent-strong) / 0.14) 0 8px,
    hsl(var(--accent-strong) / 0.05) 8px 16px);       /* #775822 */
}
.bg-placeholder-hatch-on-primary { … hsl(var(--primary)) + weiß 0.13/0.06 … }
```

Das ist **dieselbe Fläche, dieselbe Farbe, derselbe Winkel** wie die
Platzhalterflächen im Wireframe (`#E6DED6`, 115°, `rgba(119,88,34,.15/.05)`,
9/18px statt 8/16px).

**Im Einsatz heute:** `OwnAProperty` (`oap-image`, `fill`),
`OwnerHero` (`pmp-hero-image`, `fill`), `Proof`
(`proof-case-image-0…2`, drei Case-Karten), `OwnerContactForm`
(`pm-relax-image`).

---

## 7 · Bild-Inventur `src/assets/`

Alle Dateien angesehen, nicht nur die Namen gelesen.

### Echte Fotos (12 Motive)

| Datei | Motiv |
|---|---|
| `about-hero.webp` | überdachte Terrasse, Sonne, Meer/Berge im Rücken |
| `property-2.webp` | **dasselbe Motiv wie `about-hero.webp`** |
| `alpine-retreat.webp` | Holz-Schlafzimmer, Alpenhütte |
| `los-monteros-card.webp` | weiße Küche, Marmorplatte |
| `los-monteros-relax.webp` | weiße Anlage mit Brunnen, Palmen, Pavillon |
| `oap-villa-entrance.webp` | Villeneingang, Holztür, Pflanzkübel |
| `pmp-hero-villa-higueron.webp` | Wohnraum mit Terrasse und Meerblick |
| `property-3.webp` | Wohnraum, Marmor, Glasfront, Meer |
| `property-4.webp` | Wohnraum mit Treppe, weiß |
| `property-5.webp` | beiges Sofa, gemusterte Tapete, TV-Sideboard |
| `soho-boho.webp` | Stadtwohnung, Wohnzimmer mit TV |
| `villa-higueron.webp` | **Schlafzimmer** mit Terrassentür |
| `villa-hoyo-19.webp` | Sonnenuntergang über Ort/Küste |

### Porträts (3)

`team-lorenz.webp` (blond, Garten) · `team-alejandro.webp` (Bart, weißer
Hintergrund) · `team-julien.webp` (Garten).

### Logos und Icons (nicht Motiv)

`frontier-logo.webp` · `frontier-logo.png` · `frontier-logo-transparent.webp` ·
`asi-logo.webp` · `partner-chekin` · `partner-guesty` · `partner-sur-film` ·
`partner-vasari` · `platform-connections.webp` · `whatsapp-icon.webp`.

### Die dokumentierten Doubletten — nachgeprüft

`docs/DESIGN.md` §10 behauptet zwei Paare:

| Behauptung | Befund |
|---|---|
| `about-hero.webp` = `property-2.webp` | ✅ **stimmt.** Visuell dasselbe Terrassenfoto. |
| `villa-higueron.webp` = `property-3.webp` | ❌ **stimmt heute nicht mehr.** `villa-higueron.webp` ist ein **Schlafzimmer**, `property-3.webp` ein **Wohnraum**. Zwei verschiedene Aufnahmen. |

Erklärung: die **PNG**-Originale `villa-higueron.png` und `property-3.png` sind
byteidentisch (`md5 bbbda849…`), die daraus abgeleiteten `.webp` sind es nicht.
Irgendwann wurde `villa-higueron.webp` durch ein anderes Foto ersetzt, ohne
DESIGN.md nachzuziehen.

Byteidentisch sind im gesamten `src/assets/` **nur**
`property-3.png` / `villa-higueron.png`.

### Alte PNGs

`property-1.png` … `property-5.png`, `villa-higueron.png`,
`platform-connections.png`, `frontier-logo.png`, `whatsapp-icon.png` liegen
absichtlich noch da (PROJECT.md, „Bewusst so gelassen") und landen in keinem
Build. `property-1.png` ist laut PROJECT.md §2 zum Löschen vorgemerkt.

### Verwaiste Komponenten (PROJECT.md §2, weiterhin im Repo)

`FinancialPerformance.tsx` · `WhyItMakesADifference.tsx` ·
`ListingWorkflow.tsx` · `GetInTouch.tsx` — von nichts importiert.

---

## 8 · Das Wireframe — was tatsächlich geliefert ist

⚠️ **`docs/wireframe/` existiert im Repo nicht.** Weder
`frontier-wireframe-2026-09.html` noch `design-tokens.md`, und auch
`claude/handoff-2026-08-29-*.md` / `claude/handoff-2026-08-30-*.md` liegen
nicht im Repo. Das Wireframe wurde für diese Bestandsaufnahme über den
Artefakt-Link gezogen und lokal ausgepackt; die Tokens stammen aus der
`design-tokens.md`, die Almedin in die Session gelegt hat.

### Elf Artboards, nicht acht

| Artboard | Größe | Seite |
|---|---|---|
| `Main` — /landingpage Desktop | 1440 × 4600 | Pages |
| `LandingMobile` | 390 × 3430 | Pages |
| `PropertyManagement` Desktop | 1440 × 6792 | Pages |
| `PropertyManagementMobile` | 390 × 5439 | Pages |
| `Properties` Desktop | 1440 × 2266 | Pages |
| `PropertiesMobile` | 390 × 1786 | Pages |
| `PropertyDetail` Desktop | 1440 × 3453 | Pages |
| `PropertyDetailMobile` | 390 × 2936 | Pages |
| **`HeaderStates`** — drei Zustände | 1440 × 1280 | States |
| **`EvaluatorStates`** — drei Zustände | 1440 × 790 | States |
| **`TypeScale`** — Archivo, sieben Rollen | 1000 × 1330 | Type scale |

Die Mobil-Artboards sind auf **390px** gezeichnet, nicht auf 420 wie in
`design-tokens.md` §6 angegeben.

### Die 23 eingebetteten Fotos

Im Wireframe stecken 23 JPEGs. Abgleich gegen `src/assets/`:

| Wireframe-Datei | im Repo? |
|---|---|
| `losflamingos-card.jpg` | ✅ **dasselbe Motiv** wie `about-hero.webp` / `property-2.webp` |
| `owner-bridge-desktop/-mobile.jpg` | ✅ dasselbe Motiv wie `oap-villa-entrance.webp` |
| `villa-higueron-card.jpg` | ≈ dasselbe Haus wie `property-3.webp`, andere Aufnahme |
| `losmonteros-card.jpg` | ≈ dieselbe Anlage wie `los-monteros-relax.webp`, andere Aufnahme |
| `team-1.jpg` · `team-3.jpg` | ≈ dieselben Personen wie `team-lorenz` / `team-julien`, anderer Ausschnitt |
| `team-2.jpg` | ❌ **anderes Foto** als `team-alejandro.webp` (schwarzer Pullover, verschränkte Arme) |
| `hero-landing-desktop/-mobile.jpg` | ❌ nicht im Repo (Luftaufnahme Küste/Villen) |
| `marbella-carousel(-mobile).jpg` | ❌ nicht im Repo (Golfplatz + Berge) |
| `malaga-carousel(-mobile-peek).jpg` | ❌ nicht im Repo (Hafen/Stadt von oben) |
| `vienna-carousel.jpg` | ❌ nicht im Repo (Wien, Dämmerung) |
| `whateverystayincludes-desktop/-mobile.jpg` | ❌ nicht im Repo (überdachte Essplatz-Terrasse) |
| `we-take-it-on-desktop/-mobile.jpg` | ❌ nicht im Repo (Luftbild moderne weiße Kubus-Villen) |
| `renov-opener.jpg` | ❌ nicht im Repo (Luftbild Anlage mit Ziegeldächern) |
| `estimated-income-pm.jpg` | ❌ nicht im Repo (Infinity-Pool, Meer) |
| `contact-bg(-mobile).jpg` | ❌ nicht im Repo (Villa bei Nacht, beleuchteter Pool) |

⚠️ **Auflösung:** Die eingebetteten Dateien sind Wireframe-Kopien, keine
Produktionsbilder — `hero-landing-desktop.jpg` misst **720 × 379 px**,
`we-take-it-on-desktop.jpg` 860 × 338, `renov-opener.jpg` 1200 × 349. Für
Vollbild-Bänder auf 1440px reicht das nicht.

### Tokens des Wireframes gegen den Ist-Zustand

Die vollständige Tabelle steht oben unter §6. Die Kernaussage: `rule`,
`goldS`, `sage`, `fg` und die Platzhalterfläche stimmen **schon heute**
punktgenau mit den Repo-Tokens überein. Verschoben werden müssen
`--background` (beige → weiß), `--muted-foreground` (grün → kühl), `--accent`
(minimal), und `ink` fehlt ganz.

### Schriften im Wireframe

Archivo (300/400/500/600/700 + Italic 400) für **alle** Textrollen, IBM Plex
Mono (500/600) ausschließlich für Tags, Labels und Meta-Marker. Playfair
Display und Lato entfallen vollständig.

Weder `@fontsource/archivo` noch `@fontsource/ibm-plex-mono` sind in
`package.json` vorhanden.

---

## 9 · Wo die Texte herkommen

`src/lib/translations.ts`, 1158 Zeilen, drei Wörterbücher:

```ts
export const en = { … }                                  // ~397 Schlüssel
export const de: Record<TranslationKey, string> = { … }
export const es: Record<TranslationKey, string> = { … }
```

Zwei Fakten mit Folgen für den Umbau:

1. **Die Schlüssel sind dieselben Strings wie die `EditableText`-IDs**, wo
   eine Komponente eine hat. Text ohne Edit-ID bekommt einen Punktpfad
   (`common.from`, `searchbar.whereLabel`, `properties.noMatch`).
2. `de` und `es` sind als `Record<TranslationKey, string>` typisiert.
   **Ein neuer EN-Schlüssel ohne DE- und ES-Eintrag lässt `npx tsc --noEmit`
   fehlschlagen.** Neue Wireframe-Copy kostet also immer drei Einträge.

Die DE/ES-Fassungen sind laut Dateikopf **KI-entworfen (20.08.2026) und
warten auf eine muttersprachliche Prüfung** (DECISIONS §30).

### Bewusst *nicht* in `translations.ts`

Die sieben FAQ-Antworten als Fließtext, `FEATURED_PROJECTS` (Proof-Cases),
`PORTFOLIO_STATS`, die Zod-Validierungsmeldungen, `description`/`amenities`
eines Objekts (kommen aus der DB) und der gesamte Admin-Bereich.

### Harte Strings im JSX der vier Routen

- `Properties.tsx`: `"Loading…"`.
- `PropertyDetail.tsx`: `"Loading..."`, die Alt-Texte
  `${property.name} — ${idx}`, `"photo N of M"` (sr-only).
- `BookingSummary.tsx`: mehrere englische Fehlertexte
  („We couldn't retrieve a price for these dates.", „Card payment is currently
  unavailable", „Close", „Cancel").
- `ProjectsSection.tsx` / `Stats.tsx`: `FEATURED_PROJECTS` und
  `PORTFOLIO_STATS` vollständig hartkodiert.

---

## 10 · Verifikation in diesem Projekt

```bash
npm run dev       # Port 8080
npm run build     # Vite + scripts/generate-sitemap.mjs
npm run lint      # 9 bekannte Altlast-Fehler in Properties.tsx/PropertyDetail.tsx
npx tsc --noEmit  # läuft NICHT im Build mit
```

Es gibt keine Tests. `npm run lint` meldet vor jeder Änderung schon 9 Fehler
(`no-explicit-any`, `no-unused-expressions`) — maßgeblich ist, ob **neue**
dazukommen.
