# CLAUDE.md

## Was dieses Projekt ist

**Frontier Residences** (`frontier-residences.com`) — Website eines Luxus-
Property-Management-Unternehmens mit Sitz in Málaga und Objekten in Spanien,
Österreich und Kroatien. Kunde von AS Intel.

Die Seite bedient **zwei Zielgruppen mit gegenläufigen Interessen**:

| | Gast | Eigentümer |
|---|---|---|
| Einstieg | `/` (Booking-Landingpage) | `/property-management` |
| will | eine Villa buchen | seine Villa verwalten lassen |
| Kern-Flow | Suche → Objekt → Guesty-Quote → Stripe | Cashflow-Rechner → Kontaktformular |

Das ist die wichtigste Regel für Texte: **Vor jeder Copy-Änderung klären, wer
die Section liest.** Der historische Hauptfehler des Projekts war
Eigentümer-Sprache auf Gäste-Seiten (siehe „Offene Punkte" in
`docs/target-structure.md`).

Website-Sprache ist **Englisch**. Kommunikation mit Almedin auf **Deutsch**.

---

## Welchem Dokument darf man glauben

Diese Reihenfolge ist verbindlich — sie hat schon mehrfach Missverständnisse
verursacht:

| Datei | Rolle |
|---|---|
| `docs/target-structure.md` | **Einzige Quelle dafür, WAS gebaut wird.** Section-Reihenfolge pro Seite, Navigation, Entscheidungsprotokoll. |
| `docs/open-todos.md` | Aktueller Arbeitsstand: was offen ist, was diagnostiziert wurde, was bewusst liegen bleibt. |
| `docs/seo-performance-audit.md` | Befunde und Restpunkte zu SEO/Performance. |
| `docs/pm-page-content-analysis.md` | Grundlage für Phase 2 (Verdichten der PM-Seite: 12 Sections → 8). |
| `docs/design-finalisierung.md` | **WIE formatiert wird** — Typo-Skala, Blockmuster, Wortgrenzen. Regelt die Darstellung, nie den Inhalt: bei Konflikt gewinnen die Zeilen darüber. |
| `docs/archive/` | Das **WARUM** (Strategie-Brief des Besitzers, Content-Audit). Wertvoll als Begründung, **nicht als Bauanweisung** — teils vor den Entscheidungen geschrieben. |
| `README.md` | ⚠️ **Keine Dokumentation.** Das ist der ursprüngliche Lovable-Generierungs-Prompt. Nicht als Ist-Zustand lesen, nicht als Vorgabe behandeln. |

Wenn ein Dokument dem Code widerspricht: Code prüfen, dann das Dokument
nachziehen — nicht stillschweigend das eine oder andere annehmen.

---

## Stack und Befehle

Vite + React 18 + TypeScript + shadcn/ui (Radix) + Tailwind + Supabase.
Paketmanager ist **npm** (`package-lock.json` ist der aktive Lockfile; die
`bun.lock*`-Dateien sind Altlast aus der Lovable-Zeit).

```bash
npm run dev      # Dev-Server auf Port 8080
npm run build    # Vite-Build + scripts/generate-sitemap.mjs
npm run lint     # ESLint
npx tsc --noEmit # Typprüfung (läuft nicht automatisch im Build)
```

Es gibt **keine Tests**. Verifikation heißt hier: `npx tsc --noEmit`,
`npm run build`, und die betroffene Seite im Dev-Server ansehen.

**Herkunft beachten:** Das Projekt kommt von Lovable (`lovable-tagger` in
`vite.config.ts`, generierte Migrationsnamen). Lovable-Sessions haben teils
Backend-Teile gebaut, die im Frontend nie angeschlossen wurden — **vor dem
Bauen einer neuen Migration prüfen, ob Tabelle/Bucket/Policy schon existiert.**
Genau das ist bei den Kontaktformularen passiert (`docs/open-todos.md`, Punkt 5).

---

## Design-System

Farbwelt: **Beige-Hintergrund · Sage-Grün · Gold-Akzent.** Warm, ruhig,
zurückhaltend. Keine neuen Farbtöne erfinden.

- Alle Farben leben als HSL-Tokens in [src/index.css](src/index.css) und werden
  in [tailwind.config.ts](tailwind.config.ts) verdrahtet. **Keine Hex-Werte
  oder `bg-[#...]` im Komponentencode.**
- **Gold hat drei Varianten aus Kontrastgründen** — die Unterscheidung nicht
  auflösen:
  - `bg-accent` als Fläche (mit `accent-foreground` darauf)
  - `text-accent-strong` für Text/Icons auf hellen Flächen
  - `text-accent-on-primary` für Text/Icons auf der grünen `--primary`-Fläche
  - `text-accent` direkt erreicht nur 2.19:1 → nicht benutzen.
- **Die Seite ist bewusst light-only.** Kein `.dark`-Block, kein Theme-Toggle,
  keine `dark:`-Utilities.
- Schriften: Playfair Display (Headings) / Lato (Body), **selbst gehostet über
  `@fontsource`**. Nie einen Link zu `fonts.googleapis.com` einbauen — der
  Kunde hat Büro und Kunden in Österreich, das ist ein DSGVO-Thema und steht
  als Kommentar in `index.css` und `index.html`.

### Das „weniger Boxen"-Prinzip

Leitsatz des Kunden: *„Design wirkt entfernter/übersichtlicher — weniger
Rahmen/Boxes = professioneller."* Die ganze Website wurde darauf umgebaut
(`docs/open-todos.md`, Punkt 3). Das etablierte Muster für neue Sections:

> Haarlinie oben · Abstand darunter · Icon mit `strokeWidth={1.5}` in
> `accent-strong` — **statt** gefüllter Karte mit Rahmen und Hover-Schatten.
> Sektionsabstände `py-24`/`py-28`.

Bewusste Ausnahmen: Eingabeformulare (profitieren von einem Container) und
echte Platzhalterflächen. Neue `<Card>`-Wrapper um Inhaltsblöcke sind ein
Rückschritt und müssen begründet werden.

---

## SEO

`website-seo-geo` gilt; dazu projektspezifisch:

- Jede neue Route bekommt `<Seo />` ([src/components/Seo.tsx](src/components/Seo.tsx))
  mit eigenem `title`, `description`, `path` und passendem Schema.
- Firmendaten (Name, Adresse, Telefon, Steuernummer) **nur** aus
  [src/lib/siteMeta.ts](src/lib/siteMeta.ts). Diese Werte müssen mit
  `/aviso-legal`, dem Footer und dem Google-Business-Profil identisch bleiben —
  Abweichungen liest Local Search als zwei verschiedene Firmen.
- In `index.html` **keine** `og:title`/`og:description` ergänzen: Helmet hängt
  an, statt zu ersetzen — es gäbe jede Angabe doppelt.
- Bekannte Grenze: WhatsApp/LinkedIn/Facebook rendern kein JS und sehen nur
  `index.html`. Per-Page-Vorschauen bräuchten Prerendering.
- Offen: `DEFAULT_OG_IMAGE` zeigt noch auf das Lovable-Platzhalterbild.

---

## Backend: Supabase, Guesty, Stripe

**Vor Änderungen am Buchungs- oder Zahlungsfluss einzeln rückfragen.** Hier
laufen echte Zahlungen, nicht Layout.

- Alle 23 Objekte hängen an Guesty. `price_per_night` in der DB ist ein
  **eingefrorener Importwert**, kein aktueller Preis — nie als „der Preis"
  darstellen (`docs/open-todos.md`, Punkte 1 und 4).
- `LEAD_SOURCE` und `PHOTO_BUCKET` in den Formularen sind **keine freie Wahl**,
  sondern das, was die RLS-Policies durchlassen. Wird `source` geändert, weist
  RLS jede Einsendung ab und der Lead verschwindet.
- Migrationen in `supabase/migrations/` werden **nicht ungefragt auf die
  Live-Datenbank angewendet**. Schreiben ja, anwenden nur nach Absprache.
- `.env` enthält ausschließlich öffentliche `VITE_`-Keys (Supabase URL +
  Publishable Key), die ohnehin im Browser landen. **Service-Role-, Guesty- und
  Stripe-Secrets gehören in die Supabase-Secrets, nie ins Repo.**

---

## Konventionen im Code

- **Kommentare erklären das WARUM, nicht das WAS.** Das ist im Projekt
  durchgehend so gehalten (siehe die Blöcke in `index.css`, `tailwind.config.ts`,
  `App.tsx`, `Seo.tsx`). Wo eine Entscheidung nicht offensichtlich ist —
  besonders wenn sie leicht „aufgeräumt" und damit kaputtgemacht werden kann —
  gehört ein Satz dazu, der erklärt, was sonst passiert.
- Import-Alias ist `@/` → `src/`.
- Admin-Routen sind per `lazy()` einzeln aus dem Hauptbundle gelöst. **Keinen
  statischen Import aus `pages/admin/` oder von `grapesjs` in öffentlichen Code
  ziehen** — das schickt den Seitenbau-Editor an jeden Gast.
- Öffentliche Seiten bleiben eager importiert; das ist Absicht.

## Git

- Branch für den Umbau: `redesign/v2`. Basis ist `main`.
- **Commit-Messages beschreiben die Wirkung, nicht die Mechanik**, im Imperativ
  und auf Englisch. Etabliertes Muster:
  „Stop shipping the admin area to every visitor",
  „Give the owner page something to do before section nine".
  Nicht: „refactor App.tsx".
- Commit und Push nur auf ausdrückliche Ansage.

---

## Nicht anfassen ohne Rückfrage

- Buchungs-Engine, Guesty-Anbindung, Stripe-Fluss
- Das `EditableText`/`EditableImage`-Inline-CMS (die Mechanik; einzelne Texte
  dürfen sich ändern)
- Die Farbpalette (siehe oben)
- Der Stack selbst — siehe nächster Abschnitt

---

## AS-Intel-Skills in diesem Projekt

Unter `.claude/skills/` liegen vier Skills, die auch im AS-Intel-Monorepo
(`OneDrive\Desktop\AS-Intel`) verwendet werden: `website-design`,
`website-conversion`, `website-stack`, `website-seo-geo`. Sie gelten auch
hier für Redesign/Fine-Tuning dieser Website.

**Eine Ausnahme:** Der Abschnitt "Framework-Wahl" in `website-stack`
(Astro als Standard) gilt **nicht** für dieses Projekt — der Stack steht
bereits fest: Vite + React + TypeScript + shadcn/ui + Tailwind + Supabase.
Nicht auf Astro umstellen. Der Rest von `website-stack` (Lenis/GSAP-Setup,
Performance-Budget, `prefers-reduced-motion`) gilt trotzdem.

`website-design`, `website-conversion` und `website-seo-geo` gelten
uneingeschränkt — insbesondere die Anti-Pattern-Liste in `website-design`
ist bei einem shadcn/ui-Projekt besonders relevant zu prüfen (shadcn/Radix
ist ein häufiger technischer Unterbau für den "generischen KI-Look").
