# 03 · Build-Plan

> Die Arbeitspakete in der Reihenfolge, in der sie gebaut werden, jeweils mit
> den konkreten Dateien aus [02-mapping.md](02-mapping.md) und einem
> Checkpoint am Ende.
>
> Ein Branch: `redesign/wireframe-2026-09`. Fünf Checkpoints. Nach jedem wird
> angeschaut, bevor es weitergeht.
>
> Stand: 12.09.2026

---

## Vor P1 — was entschieden sein muss

P1 ist nicht blockiert. Die folgenden Punkte aus 02-mapping.md blockieren
**spätere** Pakete und sollten beantwortet sein, bevor das jeweilige Paket
beginnt:

| Frage | blockiert |
|---|---|
| **K1** Video oder Foto im Hero | P2 |
| **K3** „It's in the details." | P2 |
| **K4** Wohin der Evaluator gehört, und wie weit | **P3** (nicht P2 — der Evaluator ist ein Datenfluss) |
| **K6** sechs Systemschritte oder drei | P2 |
| **K7** Footer-Spalten | P2 |
| **K8** „Working with" oder „Where your home goes live" | P2 |
| **K9** Investments-Abbinder | P2 |
| **K10** Eigentümer-FAQ | P2 |
| **K11** die drei Case Studies | P2 |
| **F2 · F3 · F4** Filter, H1, Paginierung | P3 |
| **F5 · F6 · F7 · F8 · F9** Detailseiten-Daten | P3 |
| **F10** Header weiß / Footer ink | **P1** |
| **B1–B10** Bildmaterial | P2, P3, endgültig P5 |

**F10 ist die einzige, die P1 selbst blockiert.** Alles andere kann während
P1 geklärt werden.

---

## Querschnitt — gilt in **jedem** Paket

Kostet beim Umbau fast nichts und spart die spätere SEO-Phase:

- **Genau eine `<h1>` pro Seite**, darunter eine saubere Hierarchie ohne
  Sprünge. Beim Umbau einer Section prüfen, ob die Überschrift wirklich die
  Ebene trägt, die ihre Klasse behauptet.
- **Semantische Elemente statt div-Suppe** — `<header>`, `<nav>`, `<main>`,
  `<section>`, `<article>`, `<footer>`, `<figure>`/`<figcaption>`. `Section`
  rendert schon `<section>`; die Galerie und die Kartenraster tun es nicht.
- **Echte Alt-Texte an echten Bildern.** Nicht der Objektname allein
  (`${property.name} — 3` ist heute die Realität auf der Detailseite),
  sondern was zu sehen ist. Platzhalter-`MediaFrame`s bleiben
  `aria-hidden="true"` — ihr Briefing ist für das Team, nicht für einen
  Screenreader.
- **`width`/`height` an jedem `<img>`**, damit beim Laden nichts springt.

**Server-Rendering und Per-Route-Metadaten sind ausdrücklich NICHT Teil
dieses Branches.** `<Seo />` bleibt, wie es ist. Wir sollen uns SSR nur nicht
verbauen — also keine neuen Effekte, die Inhalt erst nach dem Mount erzeugen,
wo eine statische Variante genauso ginge.

**Keine harten Strings im JSX.** Jeder neue Text aus dem Wireframe geht nach
`src/lib/translations.ts`. Beachten: `de` und `es` sind
`Record<TranslationKey, string>` — **ein EN-Schlüssel ohne DE- und
ES-Eintrag lässt `npx tsc --noEmit` fehlschlagen.** Neue Copy kostet immer
drei Einträge, und die DE/ES-Fassungen bleiben KI-Entwürfe bis zur
muttersprachlichen Prüfung (DECISIONS §30).

**Verifikation nach jedem Paket** (es gibt keine Tests):

```bash
npx tsc --noEmit   # muss sauber sein
npm run build      # muss durchlaufen
npm run lint       # 9 Altlast-Fehler sind der Ausgangswert — zählt: keine neuen
npm run dev        # Port 8080, betroffene Seiten ansehen
```

---

## P1 · Fundament

**Ziel:** Farben gedreht, Schrift getauscht — und aufgeschrieben, was dadurch
bricht.

### Dateien

| Datei | Arbeit |
|---|---|
| `package.json` | `@fontsource/archivo` + `@fontsource/ibm-plex-mono` dazu; Playfair/Lato **noch nicht** entfernen (`admin/Builder.tsx` hängt daran) |
| `src/index.css` | `@import`s tauschen; `--background` → `0 0% 100%`; `ink` neu; `--muted-foreground` → `165 4% 36%`; `--accent` → `41 46% 56%`; `--radius`-Regel für Pill-Buttons; `.t-*` auf sieben Rollen |
| `tailwind.config.ts` | `fontFamily`: `archivo` + `mono`; Playfair/Lato als Übergang stehen lassen |
| `src/components/layout/Section.tsx` | neuer `tone` für die Beige-Akzentfläche (`bg-secondary`, nicht `bg-secondary/30`); `tone="ink"` für Footer/Cover |
| `src/components/layout/Surface.tsx` | `material="card"` prüfen — `bg-card` ist weiß und verschwindet auf weißem Grund |
| `src/components/layout/Panel.tsx` | Goldlinie oben + Sage-Ton gegen den neuen weißen Grund prüfen |
| `docs/DESIGN.md` | §3 Farbwelt, §4 Schriften, §5 Typo-Skala nachziehen |

### Die Token-Umkehrung im Detail

| Token | von | nach | Quelle |
|---|---|---|---|
| `--background` | `32 26% 92%` | `0 0% 100%` | `bg` `#FFFFFF` |
| neu `--surface-quiet` | — | `35 41% 89%` | `sand` `#EFE6D9` |
| neu `--ink` | — | `135 17% 9%` | `ink` `#131B15` |
| `--muted-foreground` | `133 10% 34%` | `165 4% 36%` | `muted` `#59615F` |
| `--accent` | `40 42% 52%` | `41 46% 56%` | `gold` `#C2A15C` |
| `--secondary` | `32 24% 87%` | **bleibt** | = Platzhalterfläche `#E6DED6` ✅ |
| `--border` | `32 16% 83%` | **bleibt** | = `rule` `#DBD4CD` ✅ |
| `--accent-strong` | `38 55% 30%` | **bleibt** | = `goldS` `#775822` ✅ |
| `--primary` | `133 11% 36%` | **bleibt** | ≈ `sage` `#526656` ✅ |

Und den falschen Kommentar an `--background` (`/* #efe6d9 */`, der Wert
rendert `#F0EBE5`) gleich mit korrigieren.

### Die neue Typo-Skala

Sieben Rollen, alle **Archivo**, Mono nur für Tags:

| Klasse | Rolle | Desktop / Mobil | Gewicht | Tracking |
|---|---|---|---|---|
| `.t-display` | Display | 52 / 34px | 500 | −0.035em |
| `.t-section` | Section | 34 / 26px | 500 | −0.03em |
| `.t-block` | Block | 24 / 20px | 600 | −0.02em |
| **`.t-card`** *(neu)* | Card title | 19 / 17px | 400 | +0.07em, uppercase |
| `.t-item` | Item | 17 / 16px | 600 | — |
| `.t-body` | Body | 17 / 16px | 400 | — |
| `.t-meta` | Meta | 12px | 600 | +0.14em, uppercase |
| `.t-tag` *(Mono)* | Eyebrow | 10px | 600 | +0.16em, uppercase |

Zwei alte Regeln fallen dabei ersatzlos weg und gehören in DESIGN.md
gestrichen, nicht stillschweigend übergangen:

- **„Playfair erst ab 28px"** — es gibt keine Serife mehr.
- **„700 statt 600, weil Lato kein 600 besitzt"** — Archivo hat 500 und 600,
  und das Wireframe benutzt genau die. Die Gewichte gehen also von 700 auf
  500/600 herunter.

### Fonts — worauf zu achten ist

- Selbst gehostet über `@fontsource`, **kein** `fonts.googleapis.com`. Das
  Wireframe-HTML enthält so einen Link; er darf nicht mitwandern.
- Archivo latin-only importieren, wie Lato es heute macht (latin deckt
  Málaga, Wien und Sauerwald ab; latin-ext ist ungenutzt und 15 KB im
  Render-Pfad).
- IBM Plex Mono nur 500 und 600.
- `src/pages/admin/Builder.tsx` importiert Playfair und Lato als `?url` für
  den GrapesJS-Iframe. **Nicht mitlöschen** — sonst fallen die
  Editor-Vorschauen auf `serif` zurück.

### Was durch die Umkehrung erfahrungsgemäß bricht

Beim Durchscrollen gezielt darauf achten und **aufschreiben**:

- `--card: 0 0% 100%` ist weiß — jede `bg-card`-Fläche verschwindet auf dem
  neuen weißen Grund. Betrifft `PropertyCard`, `Surface material="card"`,
  die Buchungskarte auf der Detailseite, die Evaluator-Card.
- `Section tone="muted"` (`bg-secondary/30`) wird auf Weiß fast unsichtbar.
- `--overlay-media` und der `scrim` sind aus dem dunklen Marken-Grün
  abgeleitet; gegen Weiß können die Kanten anders lesen.
- `edge-gold-top`/`-bottom` (die Goldnaht) sitzt an Grün/Hell-Nähten. Auf
  Weiß-gegen-Weiß hat sie keinen Job mehr.
- `.bg-silver-shimmer` (`Surface material="silver"`) ist eine Schichtung aus
  Weiß auf Beige — auf Weiß bleibt davon nichts.
- Der Footer ist `bg-primary` (Sage) mit `edge-gold-top`. Wird er `ink`,
  ändert sich der Kontrast jedes Footer-Links (`text-primary-foreground/80`).
- Der Header ist auf jeder Seite `bg-primary`. Das Wireframe will ihn im
  gefüllten Zustand **weiß** — siehe **F10**.
- Die `.t-*`-Klassen werden auf `/property/:slug` **nicht benutzt**. Der
  Schriftwechsel geht dort schlicht vorbei; die Seite bleibt nach P1 in
  Playfair, bis P3 sie nachzieht.

### Checkpoint P1

`npx tsc --noEmit` · `npm run build` sauber. Dann **alle vier Routen plus
`/about`, `/evaluate`, `/projects` von oben bis unten durchscrollen** und
notieren, was bricht — nicht reparieren, erst notieren. Der Zoom-Out-Test
(100 / 80 / 67 / 50 %) aus DESIGN.md §1 gilt hier besonders: die Umkehrung
zeigt sich beim Herauszoomen zuerst.

---

## P2 · Statische Seiten (Desktop)

**Ziel:** `/` und `/property-management` stehen auf Desktop.

Voraussetzung: K1 · K3 · K6 · K7 · K8 · K9 · K10 · K11 sind entschieden.

### `/` — Landing

| Section | Datei | Arbeit |
|---|---|---|
| 01 Hero | `src/components/Hero.tsx` | Eyebrow, Display-Headline, ein sekundärer Button; `SearchBar` zieht raus; Video-Frage nach K1 |
| 02 Search | `src/components/SearchBar.tsx` + `src/pages/Index.tsx` | eigenes Band, Beige-Akzentfläche; `onSearch`-Logik unverändert |
| 03 Trio | `src/components/PropertyCollections.tsx` | Tab-Leiste + eine Reihe à drei Karten + „See all 23 homes →" |
| 04 Split | `src/components/GuestManagement.tsx` | Bild links, fünf Punkte auf Haarlinien rechts, weiß statt Grün — **nur nach K3** |
| 05 Carousel | **neu**, z. B. `src/components/DestinationsCarousel.tsx` | vier Ortsbilder, Pfeile, `bleed`; Bilder als `MediaFrame` bis **B1** geklärt ist |
| 06 FAQ | `src/components/FAQ.tsx` | nur Tokens/Typo — steht schon an der richtigen Stelle |
| 07 Owner Bridge | `src/components/OwnAProperty.tsx` | Vollbild-Foto, Verlauf bis `ink`, nahtlos in den Footer |
| — | `src/pages/Index.tsx` | `PropertyEvaluator` entfernen (zieht in P3 auf die PM-Seite) |

### `/property-management`

| Section | Datei | Arbeit |
|---|---|---|
| 01 Hero | `src/components/OwnerHero.tsx` | grünes Band, Foto rechts, links das Adressfeld; **die Evaluator-Karte kommt in P3** — in P2 steht dort der leere Zustand A als Layout |
| 02 Trust | `src/components/Stats.tsx` (`PORTFOLIO_STATS`) | vier neue Zahlen auf Beige — Werte nach **K5** |
| 03 The Claim | **neu** | zentrierter Claim + Vollbild-Foto; englischer Satz nach **F1** |
| 04 How it works | `src/components/TheSystem.tsx` | nach **K6** |
| 05 Two ways | `src/components/WaysToWorkTogether.tsx` | zwei `Panel`s; GI zuerst steht schon (§54); Indizes `-0`/`-1` **nicht** vertauschen |
| 06 Logo Band | `src/components/WorkingWith.tsx` | nach **K8**; fehlende Logos als `MediaFrame` (**B5**) |
| 07 Renovations & Investments | `src/components/WaysToWorkTogether.tsx` → ggf. eigene Datei | nach **K9**; darunter die Istria-Case-Study |
| 08 Team | `src/components/AboutMini.tsx` | drei mittig gesetzte Karten fester Breite |
| 09 FAQ | `src/components/FAQ.tsx` | nach **K10** |
| 10 Contact | `src/components/OwnerContactForm.tsx` | Nachtfoto bis `ink`; **`LEAD_SOURCE` und `metadata.submitted_from` bleiben unverändert** |

### Quer über beide Seiten

| Datei | Arbeit |
|---|---|
| `src/components/Navigation.tsx` | drei Zustände aus `HeaderStates`: transparent über dem Hero → in **einem** Schritt komplett weiß (kein Zwischenzustand) → Destinations-Panel. Wordmark mittig, „Destinations ▾" und „List Your Home" links. Der 0,6-Viewport-Trigger existiert schon. |
| `src/components/Footer.tsx` | `ink` statt Sage, drei Spalten nach **K7** |
| `src/components/PropertyCard.tsx` | 3:4, rahmenlos, `.t-card` — wird von `/` und `/properties` geteilt, deshalb hier schon |
| `src/lib/translations.ts` | alle neuen Strings, EN + DE + ES |

### Checkpoint P2

Beide Seiten auf Desktop gegen ihr Artboard halten — **Reihenfolge der
Sections, Textmenge, Bildformate, Flächenlogik weiß/beige.** Keine Abstände
nachmessen. Zoom-Out-Test. `tsc` / `build` / `lint` sauber.

---

## P3 · Daten-Templates

> ### Das ist ein Re-Skin über funktionierende Logik.
>
> **Guesty-Anbindung, Live-Pricing-Kalender und Buchungsflow bleiben.
> Getauscht wird die Präsentation.** Auf `/property/:slug` laufen echte
> Zahlungen. Vor jeder Änderung am Buchungs- oder Zahlungsfluss einzeln
> rückfragen.

Fünf Dinge, die dieses Paket nicht anfassen darf:

1. **Der sequenzielle Kalender-Loop in `Properties.tsx`.** Guesty erlaubt
   3 Tokens / 24 h; parallel laufen alle Aufrufe gleichzeitig in den
   Token-Refresh und ins Rate-Limit.
2. **Kein erfundener Preis.** `quoteError`/`!quote` blockiert das Absenden —
   „a made-up price is worse than a lost booking" (DECISIONS §38).
3. **`paymentUnavailable`** muss sichtbar bleiben, samt Ausweichpfad „Send
   booking request instead".
4. **`price_per_night` ist ein eingefrorener Importwert** (C4). Immer „from",
   nie „der Preis". Kein Preis ins Property-Schema.
5. **Beim Testen keine Reservierungen anlegen.** Quotes sind harmlos,
   Reservierungen nicht.

### `/properties`

| Element | Datei | Arbeit |
|---|---|---|
| Suche in Hero-Position | `src/pages/Properties.tsx`, `SearchBar.tsx` | aus der Sticky-Leiste nach oben |
| Filterleiste | **neu** | Bedrooms · Budget · Collection · Sort · Ansicht — nach **F2** |
| Raster | `src/pages/Properties.tsx` | drei Spalten, `PropertyCard` aus P2; **H1-Frage F3** |
| „View more homes" | | nach **F4** |
| Leerzustand | | bleibt; D12 (Marbella/Estepona ohne Bestand) ist davon unberührt |

### `/property/:slug`

**Diese Seite braucht zusätzlich den Nachzug von PROJECT.md C5** — sie läuft
noch auf `container mx-auto px-4` und `font-playfair text-4xl`. Layout-System
und `.t-*`-Skala kommen hier zum ersten Mal an. Das ist der Grund, warum
dieses Paket größer ist, als „Re-Skin" klingt.

| Element | Datei | Arbeit |
|---|---|---|
| Breadcrumb | `src/pages/PropertyDetail.tsx` | ersetzt den „Back to Properties"-Button; Suchparameter weiter durchreichen |
| Galerie | | Leitbild + 2×2, Share-Pille, „View gallery · N photos"; Lightbox-Dialoge bleiben |
| Kopf | | `.t-*`, Collection-Tag (**F6**), Fakten inkl. `m²` (**F5**) |
| Key Features | | acht statt der vollen Liste — Regel nach **F7** |
| Booking Panel | | Panel-B-Optik (Goldlinie oben, Sage-Ton), sticky auf Desktop; **Logik unverändert** |
| Surroundings | **neu** | Karte aus `latitude`/`longitude` (Leaflet liegt schon in `package.json`), Radius-Kreis um einen Pin; „Nearby" nach **F8** |
| Similar Homes | **neu** | dieselbe `PropertyCard`, Slideshow; Kriterium nach **F9** |

### Evaluator

Nach **K4** — und ausdrücklich hier, nicht in P2: Progressive Felder plus
Inline-Ergebnis sind ein Datenfluss mit Edge-Function-Aufruf, Lade- und
Fehlerzustand, nicht ein statisches Layout. Betroffen:
`src/components/PropertyEvaluator.tsx`, `src/pages/Evaluate.tsx`,
`supabase/functions/analyze-property/`.

### Checkpoint P3

Im Dev-Server: eine Suche mit Daten laufen lassen (Kalenderprüfung sichtbar),
eine Detailseite öffnen, **eine Quote** anfordern, den Fehlerzustand einmal
erzwingen. **Keine Reservierung.** `tsc` / `build` / `lint` sauber.

---

## P4 · Mobil

**Ziel:** alle vier Seiten gegen die Mobil-Artboards (390px gezeichnet).

| Seite | Worauf besonders zu achten ist |
|---|---|
| `/` | Suche als eine Zeile „Where? · When? · Who? →"; Carousel mit angeschnittener vierter Karte; Header wird ein Burger + „Book" |
| `/property-management` | Evaluator-Karte **unter** das Adressfeld, nur Überschrift und Platzhalterzahl, **kein Diagramm** (steht so in `EvaluatorStates`); Team als dreispaltiger Streifen, nicht als 2×2-Raster, das die dritte Person allein stranden lässt |
| `/properties` | Raster zweispaltig; Filterleiste ohne Ansichts-Umschalter |
| `/property/:slug` | Buchungspanel voll breit **unter** dem Inhalt und **nicht** sticky; Galerie nur das Leitbild (die vier Kacheln sind schon `hidden md:block`) |

Dazu, aus `website-stack`: `prefers-reduced-motion` an jeder neuen Animation
(Carousel, Slideshow, Header-Übergang).

### Checkpoint P4

Jede Seite bei 390px, 430px und einmal quer. Kein horizontaler Scroll —
`overflow-x-clip` ist schon auf `main` gesetzt, wo es gebraucht wird.

---

## P5 · Abschluss

1. **Offene Bildslots** (B1–B10): entweder echte Fotos einsetzen oder den
   `MediaFrame` mit einem brauchbaren Briefing stehen lassen. Ein zweites Mal
   dasselbe Motiv ist die schlechtere Lösung.
2. **Feinschliff:** Zoom-Out-Test auf allen vier Seiten, Kontraste der
   Gold-Varianten auf dem neuen weißen Grund nachrechnen
   (`text-accent-strong` war auf Beige 5,6:1 — auf Weiß wird es besser, aber
   `bg-accent`/`accent-foreground` ist neu zu prüfen).
3. **Playfair und Lato aus `package.json` entfernen** — aber erst, wenn
   `admin/Builder.tsx` umgestellt oder bewusst darauf belassen wurde.
4. **Dokumente nachziehen:**
   - `docs/DECISIONS.md` — ein Abschnitt pro getroffener K-Entscheidung, mit
     Begründung. Besonders K7 und K9 begraben ältere Einträge (§32/§33, §16);
     das gehört ausdrücklich hingeschrieben, nicht stillschweigend überschrieben.
   - `docs/PROJECT.md` §2 — die Landing-Page-Tabelle ist **schon heute
     falsch** (`Stats` ist nicht mehr eingebunden, `FAQ` steht vor
     `OwnAProperty`); danach die neue Struktur.
   - `docs/DESIGN.md` §3/§4/§5/§10 — Farbwelt, Schriften, sieben Typo-Rollen;
     und §10 korrigieren: `villa-higueron.webp` und `property-3.webp` sind
     **nicht** dasselbe Bild.
   - `docs/PROJECT.md` §6 — D4 (Kennzahlen), D8 (`collection`-Spalte),
     D11 (Owner-FAQ) sind durch diesen Rebuild berührt.

### Checkpoint P5 — und dann erst der Merge

Vor dem Merge nach `main`:

- `.env` prüft auf `womaoywuhjchtubacbvn` (Lovable setzt sie still zurück —
  DECISIONS §46).
- Im Build steht **keine** Referenz auf `fonts.googleapis.com`.
- **Die offene Frage aus der Bestandsaufnahme beantworten:** hängt
  `frontier-residences.com` überhaupt an diesem Lovable-Projekt? Lovable
  meldet als Live-URL `estate-gem-manager.lovable.app`. Solange das ungeklärt
  ist, ist die Release-Kette „Merge → Lovable zieht nach → Publish" nicht
  belegt.
- Während des gesamten Rebuilds bleibt Lovable eingefroren. Landet trotzdem
  ein Fix auf `main`: **`main` in den Branch mergen**, regelmäßig, nicht erst
  am Ende.

---

## Was dieser Branch ausdrücklich nicht tut

- Kein Server-Rendering, keine Per-Route-Metadaten über das hinaus, was
  `<Seo />` heute liefert.
- Keine Migration auf Astro (CLAUDE.md — der Abschnitt „Framework-Wahl" in
  `website-stack` gilt hier nicht).
- Keine Migration wird auf die Live-Datenbank angewendet. Sollten **F5**
  (`m²`), **F6** (`collection`) oder **F8** (`nearby_amenities`) neue Spalten
  brauchen: Migration schreiben ja, anwenden nur nach Absprache.
- Kein Anfassen von `LEAD_SOURCE`, `PHOTO_BUCKET` oder `metadata.submitted_from`.
- Keine Guesty-Reservierung zum Testen.
