# Frontier Residences

Website für Frontier Residences (`frontier-residences.com`) — ein
Luxus-Property-Management-Unternehmen mit Sitz in Málaga und Objekten in Spanien
und Österreich. Kunde von AS Intel.

Die Seite bedient **zwei Zielgruppen mit gegenläufigen Interessen**: Gäste, die
eine Villa buchen (`/`), und Eigentümer, die ihre Villa verwalten lassen wollen
(`/property-management`).

---

## Hier anfangen, nicht hier

Diese README ist bewusst kurz. Die Dokumentation liegt in vier Dateien:

| Datei | Beantwortet |
|---|---|
| **[CLAUDE.md](CLAUDE.md)** | Wie in diesem Repo gearbeitet wird — Regeln, Guardrails, was ohne Rückfrage nicht angefasst wird |
| **[docs/PROJECT.md](docs/PROJECT.md)** | Was die Seite ist und wie sie **aktuell steht** — Seitenstruktur, Backend, offene Punkte |
| **[docs/DESIGN.md](docs/DESIGN.md)** | **Wie** gestaltet wird — Layout-System, Farben, Typo-Skala, Blockmuster |
| **[docs/DECISIONS.md](docs/DECISIONS.md)** | **Warum** die Seite so ist — Entscheidungsprotokoll, verworfene Ansätze |

Wo ein Dokument dem Code widerspricht: Code prüfen, dann das Dokument nachziehen.

---

## Stack

Vite + React 18 + TypeScript + shadcn/ui (Radix) + Tailwind + Supabase.
Paketmanager ist **npm**.

```bash
npm install
npm run dev      # Dev-Server auf Port 8080
npm run build    # Vite-Build + scripts/generate-sitemap.mjs
npm run lint     # ESLint
npx tsc --noEmit # Typprüfung (läuft nicht automatisch im Build)
```

**Es gibt keine automatisierten Tests.** Verifikation heißt hier
`npx tsc --noEmit`, `npm run build` und die betroffene Seite im Dev-Server
ansehen.

---

## Wo was liegt

```
src/
├── pages/              Routen (öffentlich eager, admin/ lazy)
├── components/
│   ├── layout/         Container · Section · Grid · Stack · Surface · Divider
│   ├── admin/          Inline-CMS (EditableText/Image/Video) — nie aus
│   │                   öffentlichem Code importieren
│   └── ui/             shadcn/ui-Bausteine
├── lib/                siteMeta · schema · supabaseClient · utils
└── integrations/       Supabase-Client und generierte Typen

supabase/
├── functions/          Edge Functions (Guesty-Anbindung, Cashflow-Analyse)
└── migrations/         nicht ungefragt auf die Live-DB anwenden

scripts/generate-sitemap.mjs   läuft im Build, Slugs live aus Supabase
docs/                          siehe Tabelle oben
```

Import-Alias ist `@/` → `src/`.

---

## Herkunft

Das Projekt begann als Lovable-Generierung. Daher stammen `lovable-tagger` in
`vite.config.ts`, die generierten Migrationsnamen und die `bun.lock*`-Dateien
(Altlast — aktiv ist `package-lock.json`).

Lovable-Sessions haben teils Backend-Teile gebaut, die im Frontend nie
angeschlossen wurden. **Vor dem Bauen einer neuen Migration prüfen, ob
Tabelle/Bucket/Policy schon existiert.**
