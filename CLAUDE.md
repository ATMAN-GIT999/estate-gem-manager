# CLAUDE.md

Arbeitsanweisung für Sessions in diesem Repo. Was die Seite **ist**, steht in
`docs/PROJECT.md` — hier steht, **wie hier gearbeitet wird**.

---

## Die wichtigste Regel

Die Seite bedient **zwei Zielgruppen mit gegenläufigen Interessen**:

| | Gast | Eigentümer |
|---|---|---|
| Einstieg | `/` (Booking-Landingpage) | `/property-management` |
| will | eine Villa buchen | seine Villa verwalten lassen |

**Vor jeder Copy-Änderung klären, wer die Section liest.** Der historische
Hauptfehler des Projekts war Eigentümer-Sprache auf Gäste-Seiten.

Website-Sprache ist **Englisch**. Kommunikation mit Almedin auf **Deutsch**.

---

## Welchem Dokument darf man glauben

| Datei | Rolle | Gewinnt bei Konflikt |
|---|---|---|
| **`docs/PROJECT.md`** | Ist-Zustand: Seitenstruktur, Backend, offene Punkte | bei der Frage, **was** wo liegt und wie es steht |
| **`docs/DESIGN.md`** | Layout-System, Farben, Typo-Skala, Blockmuster | bei der **Darstellung** |
| **`docs/DECISIONS.md`** | Entscheidungsprotokoll und Begründungen | als **Begründung**, nie als Bauanweisung |
| `README.md` | Kurzer Einstieg (Stack, Befehle, Ordner) | — |

**Wenn ein Dokument dem Code widerspricht: Code prüfen, dann das Dokument
nachziehen** — nicht stillschweigend das eine oder andere annehmen. Das ist im
Projekt schon mehrfach schiefgegangen.

---

## Stack und Verifikation

Vite + React 18 + TypeScript + shadcn/ui (Radix) + Tailwind + Supabase.
Paketmanager ist **npm**.

```bash
npm run dev      # Dev-Server auf Port 8080
npm run build    # Vite-Build + scripts/generate-sitemap.mjs
npm run lint     # ESLint
npx tsc --noEmit # Typprüfung (läuft NICHT automatisch im Build)
```

**Es gibt keine Tests.** Verifikation heißt: `npx tsc --noEmit`,
`npm run build`, und die betroffene Seite im Dev-Server ansehen. Behaupte nie,
etwas sei geprüft, wenn nur der Build durchgelaufen ist.

**Herkunft beachten:** Das Projekt kommt von Lovable. Frühere Sessions haben
Backend-Teile gebaut, die nie angeschlossen wurden — **vor dem Bauen einer neuen
Migration prüfen, ob Tabelle/Bucket/Policy schon existiert.**

---

## Design-System — die Kurzfassung

Vollständig in `docs/DESIGN.md`. Was man ohne Nachschlagen wissen muss:

- **Farbwelt: Beige · Sage-Grün · Gold.** Keine neuen Farbtöne erfinden. Alle
  Farben leben als HSL-Tokens in `src/index.css` — **keine Hex-Werte oder
  `bg-[#...]` im Komponentencode.**
- **Gold hat drei Varianten aus Kontrastgründen** (`bg-accent`,
  `text-accent-strong`, `text-accent-on-primary`). `text-accent` erreicht nur
  2.19:1 → nicht benutzen. Die Unterscheidung nicht auflösen.
- **Die Seite ist bewusst light-only.** Kein `.dark`-Block, kein Theme-Toggle,
  keine `dark:`-Utilities.
- **Nie einen Link zu `fonts.googleapis.com` einbauen** — DSGVO, der Kunde hat
  Büro und Kunden in Österreich. Fonts sind über `@fontsource` selbst gehostet.
- **Layout über `src/components/layout/`** (`Container`, `Section`, `Grid`,
  `Stack`, `Surface`, `Divider`). Keine neuen `py-<Zahl>`, kein rohes `max-w-*`,
  kein eigenes `container mx-auto px-4` in öffentlichen Komponenten. Greift eine
  Section danach, fehlt etwas im Primitive — **dann das Primitive erweitern,
  nicht daran vorbeibauen.**
- **Typo nur über die sechs `.t-*`-Klassen.** In öffentlichen
  Content-Komponenten steht kein `text-xs … text-7xl` mehr (Ausnahmen:
  shadcn-UI-Primitives und Navigation).
- **„Weniger Boxen".** Haarlinie oben, Abstand, Icon mit `strokeWidth={1.5}` in
  `accent-strong` — statt gefüllter Karte mit Rahmen und Hover-Schatten. Neue
  `<Card>`-Wrapper um Inhaltsblöcke sind ein Rückschritt und müssen begründet
  werden.
- **Die Goldlinie ist ein Akzent, kein Trenner** — nicht zwischen jede Section.

---

## SEO

`website-seo-geo` gilt; dazu projektspezifisch:

- Jede neue Route bekommt `<Seo />` (`src/components/Seo.tsx`) mit eigenem
  `title`, `description`, `path` und passendem Schema.
- Firmendaten (Name, Adresse, Telefon, Steuernummer) **nur** aus
  `src/lib/siteMeta.ts`. Diese Werte müssen mit `/aviso-legal`, dem Footer und
  dem Google-Business-Profil identisch bleiben — Abweichungen liest Local Search
  als zwei verschiedene Firmen.
- In `index.html` **keine** `og:title`/`og:description` ergänzen: Helmet hängt
  an statt zu ersetzen — es gäbe jede Angabe doppelt.
- **Kein Preis ins Property-Schema**, solange `price_per_night` nicht live
  gehalten wird (PROJECT.md, C4).

---

## Backend: Supabase, Guesty, Stripe

> **Vor Änderungen am Buchungs- oder Zahlungsfluss einzeln rückfragen.**
> Hier laufen echte Zahlungen, nicht Layout.

- `price_per_night` in der DB ist ein **eingefrorener Importwert**, kein
  aktueller Preis — nie als „der Preis" darstellen.
- **Guesty erlaubt nur 3 Tokens / 24 h.** Der Cache in `guesty-booking-auth`
  deckt das ab, aber beim Testen keine Tokens verbrennen. Quotes anzulegen ist
  harmlos; **Reservierungen anzulegen ist es nicht.**
- `LEAD_SOURCE` und `PHOTO_BUCKET` in den Formularen sind **keine freie Wahl**,
  sondern das, was die RLS-Policies durchlassen. Wird `source` geändert, weist
  RLS jede Einsendung ab und der Lead verschwindet lautlos.
- Migrationen in `supabase/migrations/` werden **nicht ungefragt auf die
  Live-Datenbank angewendet**. Schreiben ja, anwenden nur nach Absprache.
- `.env` enthält ausschließlich öffentliche `VITE_`-Keys. **Service-Role-,
  Guesty- und Stripe-Secrets gehören in die Supabase-Secrets, nie ins Repo.**

---

## Konventionen im Code

- **Kommentare erklären das WARUM, nicht das WAS.** Das ist im Projekt
  durchgehend so gehalten (siehe `index.css`, `tailwind.config.ts`, `App.tsx`,
  `Seo.tsx`). Wo eine Entscheidung nicht offensichtlich ist — besonders wenn sie
  leicht „aufgeräumt" und damit kaputtgemacht werden kann — gehört ein Satz
  dazu, der erklärt, was sonst passiert.
- Import-Alias ist `@/` → `src/`.
- Admin-Routen sind per `lazy()` einzeln aus dem Hauptbundle gelöst. **Keinen
  statischen Import aus `pages/admin/` oder von `grapesjs` in öffentlichen Code
  ziehen** — das schickt den Seitenbau-Editor an jeden Gast.
- Öffentliche Seiten bleiben eager importiert; das ist Absicht.

---

## Git

- Branch für den Umbau: `redesign/v2`. Basis ist `main`.
- **Commit-Messages beschreiben die Wirkung, nicht die Mechanik**, im Imperativ
  und auf Englisch. Etabliertes Muster:
  „Stop shipping the admin area to every visitor",
  „Give the owner page something to do before section nine".
  Nicht: „refactor App.tsx".
- **Commit und Push nur auf ausdrückliche Ansage.**

---

## Nicht anfassen ohne Rückfrage

- Buchungs-Engine, Guesty-Anbindung, Stripe-Fluss
- Das `EditableText`/`EditableImage`-Inline-CMS (die Mechanik; einzelne Texte
  dürfen sich ändern)
- Die Farbpalette
- Die Gäste-Fassung von „It's in the details." (`GuestManagement.tsx`) — der
  Text dort ist geprüft
- Der Stack selbst — siehe nächster Abschnitt

---

## AS-Intel-Skills in diesem Projekt

Unter `.claude/skills/` liegen vier Skills, die auch im AS-Intel-Monorepo
verwendet werden: `website-design`, `website-conversion`, `website-stack`,
`website-seo-geo`. Sie gelten auch hier für Redesign und Fine-Tuning.

**Eine Ausnahme:** Der Abschnitt „Framework-Wahl" in `website-stack` (Astro als
Standard) gilt **nicht** für dieses Projekt — der Stack steht fest. Nicht auf
Astro umstellen. Der Rest von `website-stack` (Lenis/GSAP-Setup,
Performance-Budget, `prefers-reduced-motion`) gilt trotzdem.

`website-design`, `website-conversion` und `website-seo-geo` gelten
uneingeschränkt — insbesondere die Anti-Pattern-Liste in `website-design` ist
bei einem shadcn/ui-Projekt besonders relevant zu prüfen (shadcn/Radix ist ein
häufiger technischer Unterbau für den generischen KI-Look).
