# docs/seo — Übergabe aus der Strategie-Ebene

Diese drei Dateien sind eine **eingefrorene Übergabe** aus dem Ordner
`FR-seo-project` (dem strategischen Gehirn des Projekts), Stand **25.09.2026**.

| Datei | Rolle |
|---|---|
| `01_IMPLEMENTATION.md` | Die Arbeitsanweisung. Fünf Pakete A–E, **einzeln** übergeben, mit Checkpoint nach jedem. |
| `struktur.md` | Der Seitenbaum: URLs, Aufgabe je Seite, Titles/Descriptions, Indexierung, interne Verlinkung, Schema. |
| `inventar.md` | Der tatsächliche Bestand, live aus der Datenbank: 23 Objekte, ihre Orte, Bilder, Besonderheiten. |

## Wo geändert wird

**Nicht hier.** Ändert sich etwas an Strategie oder Struktur, wird es in
`FR-seo-project` geändert und von dort neu herüberkopiert. Sonst entstehen
zwei Wahrheiten — genau das, was `context/PROJECT_CONTEXT_SYSTEM.md` dort
ausschließt.

Was sich am **Code** ändert, gehört dagegen wie gewohnt nach
`docs/PROJECT.md`, `docs/DESIGN.md` und `docs/DECISIONS.md` in diesem Repo.

## Die zwei Regeln, die über allem stehen

1. **`main` wird nicht angefasst** — kein Merge in beide Richtungen, kein
   Push. Erst nach Freigabe durch Frontier Residences. Gearbeitet wird auf
   `redesign/wireframe-2026-09`.
2. **Gäste zuerst.** Property- und Ortsseiten vor dem Eigentümer-Cluster.
