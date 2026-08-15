# Frontier Residences

Website for Frontier Residences (`frontier-residences.com`) — a luxury
property-management company based in Málaga, with properties in Spain and
Austria. Serves two audiences with opposite goals: guests booking a stay
(`/`) and owners looking to have their property managed
(`/property-management`).

Client of AS Intel.

## Start here, not here

This README is deliberately short. The document that actually governs how
work happens in this repo is **[`CLAUDE.md`](CLAUDE.md)** — what the project
is, which doc wins when two disagree, the design system, the backend
(Supabase/Guesty/Stripe) constraints, and what not to touch without asking.
Read that first.

## Stack

Vite + React 18 + TypeScript + shadcn/ui (Radix) + Tailwind + Supabase.
Package manager is npm.

```bash
npm run dev      # dev server on port 8080
npm run build    # Vite build + scripts/generate-sitemap.mjs
npm run lint     # ESLint
npx tsc --noEmit # type-check (not run automatically by the build)
```

There are no automated tests. Verification means `npx tsc --noEmit`,
`npm run build`, and looking at the affected page in the dev server.

## Where things live

- `src/pages/` — routes. `src/components/` — everything they're built from.
  `src/components/layout/` — the shared Container/Section/Grid/Stack/Surface
  primitives (currently wired into the landing page and the
  property-management page only — see `docs/open-todos.md`, point 9).
- `src/components/admin/` — the inline CMS (`EditableText`/`EditableImage`/
  `EditableVideo`). Lazy-loaded, never imported from public pages directly.
- `docs/` — everything else worth knowing that isn't obvious from the code.
  `docs/GENERAL-STRUCTURE.md` leads on layout, `docs/target-structure.md` on
  what lives on which page, `docs/open-todos.md` on current work. Full
  reading order is in `CLAUDE.md`.

## Origin

This project started as a Lovable generation. That history is why
`lovable-tagger` is still in `vite.config.ts`, why some migration names read
like they were auto-generated, and why a few backend pieces exist that the
frontend never got wired up to (check before adding a new migration —
`docs/open-todos.md` has examples). The original Lovable prompt is archived
at `docs/archive/lovable-original-prompt.md`.
