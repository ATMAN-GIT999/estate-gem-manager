# Offene Punkte

Aus `docs/archive/edits/avantstay.md`, mit dem, was die Code-Prüfung dazu ergeben
hat. Reihenfolge der Abarbeitung: **2 → 1 → 3 → 4**.

---

## 1 · Preis-Anzeige stimmt nicht

**Status:** ⚠️ teilweise erledigt · **Priorität:** hoch

**Was sich herausgestellt hat:** **Alle 23 Objekte** haben eine Guesty-Anbindung,
also dynamische Preise. Es gibt kein einziges mit statischem Preis.

Die **Detailseite war bereits korrekt** — bei Guesty-Objekten zeigt sie „Live
pricing — Rates are calculated in real-time in the booking engine" statt einer
Zahl. Der statische Zweig dort ist praktisch toter Code.

**Die Karten waren die einzige Stelle**, die den eingefrorenen Wert als aktuellen
Preis ausgab. Sie zeigen jetzt **„from €X / night"**.

**Damit noch nicht gelöst:**
- „from" unterstellt, dass der Basispreis eine Untergrenze ist. Sollte gegen
  Guesty geprüft werden — dynamische Preise können auch darunter liegen.
- Die Zahl altert weiter bis zum nächsten Import.
- **Der eigentliche Fix** bleibt ein nächtlicher Job, der pro Objekt den
  günstigsten Live-Preis holt und zwischenspeichert. Dann kann die Karte wieder
  eine echte Zahl zeigen.
- Der Import müsste einmal neu laufen, damit die Basiswerte aktuell sind — das
  schreibt in die Live-Datenbank und sollte bewusst ausgelöst werden.

<details>
<summary>Ursprüngliche Diagnose</summary>

Die Website zeigt einen Preis, der nicht der Preis ist.

| Wo | Was passiert |
|---|---|
| `supabase/functions/import-guesty-properties/index.ts:165` | schreibt `guestyProperty.prices?.basePrice \|\| 0` **einmalig** in die Spalte `price_per_night` |
| `src/components/PropertyCard.tsx:105` | zeigt `€{property.price_per_night}` — den eingefrorenen Wert |
| `src/pages/PropertyDetail.tsx:268` | dasselbe; `:282` reicht ihn nur als `fallbackNightlyRate` weiter |
| `supabase/functions/guesty-get-quote` | liefert echte, datumsabhängige Preise — wird **nur im Buchungsdialog** benutzt |

**Die berichteten 250 €** sind kein Hardcode, sondern der gespeicherte Basispreis
eines Objekts zum Import-Zeitpunkt. In der Datenbank stehen aktuell Werte von
65 € bis 1.300 €, genau ein Objekt hat 250 €.

**Zwei Wege:**
- *Kurzfristig:* „ab 250 €" statt „250 €", plus Import neu laufen lassen. Die
  Aussage stimmt dann wenigstens.
- *Sauber:* nächtlicher Job, der pro Objekt den günstigsten Live-Preis holt und
  zwischenspeichert. Live-Abfrage pro Karte wären 23 Requests beim Seitenaufbau.

**Nebenbefund:** Das `|| 0` im Import bedeutet, dass ein Objekt ohne `basePrice`
mit **0 €** angezeigt würde. Aktuell hat keines den Wert 0 — aber die Falle steht.

</details>

---

## 2 · Property-Seite: Bilder von ~80 % auf ~50 %

**Status:** ✅ erledigt · **Priorität:** hoch (größter UX-Gewinn, eine Datei)

**Umgesetzt:** ein Leitbild mit vier kleineren daneben, auf 50 vh begrenzt
(min 320, max 560 px). Kacheln ohne eigene Rundung auf 2 px Abstand innerhalb
*eines* gerundeten Rahmens — liest sich als ein Bild, nicht als fünf Boxen.
Unter `md` nur das Leitbild. Jede Kachel öffnet einen Dialog mit allen Fotos.

**Nebenbefund behoben:** Die alte Galerie schnitt nach dem sechsten Bild ab
(`images.slice(0, 6)`) — alles danach war nicht erreichbar. Jetzt zeigt der
Dialog alle.

<details>
<summary>Ausgangslage</summary>

`src/pages/PropertyDetail.tsx:153` rendert **sechs Kacheln im Dreier-Raster mit
4:3** — zwei volle Reihen à rund 340 px, also ~700 px Bild, bevor überhaupt Text
kommt.

**AvantStay-Muster:** ein großes Bild plus zwei bis drei kleinere daneben,
zusammen etwa halbe Bildschirmhöhe, mit „Alle Fotos anzeigen" für den Rest.

Laut Notiz kann das Design „oberflächlich" übernommen werden — Backend-
Verlinkungen gehen tief, da ist zu prüfen, was leicht übertragbar ist.

</details>

---

## 3 · Weniger Rahmen und Boxen (ganze Website)

**Status:** angefangen · **Priorität:** mittel

Leitsatz aus der Notiz: *„Design wirkt entfernter/übersichtlicher — weniger
Rahmen/Boxes = professioneller."*

**Erledigt:** die drei Säulen in `PropertyManagement.tsx` — vorher Box in Box
(gefüllte grüne Panels mit gefüllten Kästchen darin), jetzt eine Fläche mit
Haarlinien und Abstand.

**Offen:**

| Section | Datei |
|---|---|
| Stats | `Stats.tsx` |
| Projects | `ProjectsSection.tsx` |
| Technology | `TechnologySection.tsx` |
| Financial Performance | `FinancialPerformance.tsx` |
| Ways to Work Together | `WaysToWorkTogether.tsx` |
| Own a Property? | `OwnAProperty.tsx` |
| Cashflow-Rechner | `PropertyEvaluator.tsx` |
| Property-Karten | `PropertyCard.tsx` |

---

## 4 · Stripe / Buchungsabschluss

**Status:** offen · **Priorität:** zuletzt · ⚠️ **höchstes Risiko**

Aus der Notiz: *„Stripe bzw. Buchungsabschluss Funktion fixen und flüssig
bekommen."*

**Scope-Hinweis:** Die ursprüngliche Anweisung lautete „Buchungs-Engine / Guesty
/ Stripe nicht anfassen". Der Punkt ist inzwischen ausdrücklich freigegeben, wird
aber als Letztes bearbeitet — hier geht es um echte Zahlungen, nicht um Layout.
Vor Änderungen am Zahlungsfluss jeweils einzeln rückfragen.

Beteiligte Funktionen:
`guesty-booking-auth` · `guesty-create-reservation` · `guesty-get-quote` ·
`guesty-stripe-config` · `guesty-webhook`

Beteiligte Komponenten:
`BookingSummary.tsx` · `InstantBookFallbackDialog.tsx` · `AvailabilityCalendar.tsx`
· `pages/Book.tsx` · `pages/BookingConfirmation.tsx`

---

## Nicht aus der Notiz, aber offen

- **`collection`-Spalte für die Property-Tabelle.** Die drei Reihen auf der
  Landingpage (`PropertyCollections.tsx`) leiten die Zuordnung aus `location`
  und dem Namen ab. Eine Immobilie in einem neuen Ort erscheint in **keiner**
  Reihe, bis jemand den Ort im Code ergänzt. Eine Spalte würde das dem Kunden
  im Admin-Bereich in die Hand geben.
- **Vorher/Nachher-Fotos** für die drei Projekte auf der PM-Seite — dort stehen
  noch „Coming Soon"-Platzhalter.
- **Testimonials von Eigentümern** für die PM-Seite.
- **Terminbuchungs-Link** statt `mailto:` im CTA der PM-Seite.
