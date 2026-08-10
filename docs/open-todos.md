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

**Status:** ✅ erledigt · **Priorität:** mittel

**Das durchgehende Muster:** Haarlinie oben, Abstand darunter, Icon mit
`strokeWidth={1.5}` in `accent-strong` — statt gefüllter Karte mit Rahmen und
Hover-Schatten. Sektionsabstände von `py-20` auf `py-24/28`.

| Section | Was weg ist |
|---|---|
| `PropertyManagement.tsx` | zwei grüne Panels mit je vier Kästchen darin |
| `Stats.tsx` | vier gehobene Karten mit Hover-Skalierung; Beige-Verlauf → Seitenhintergrund |
| `OwnAProperty.tsx` | dieselben vier Karten |
| `FinancialPerformance.tsx` | drei Karten |
| `TechnologySection.tsx` | vier durchscheinende Panels, jedes mit Kachel hinter dem Icon, auf grüner Fläche |
| `ProjectsSection.tsx` | tiefste Verschachtelung: Karte → getöntes Kennzahlen-Panel; Regionen-Karten mit eigenem Header |
| `WaysToWorkTogether.tsx` | zwei Modell-Karten, zwei Teaser-Kästen |
| `PropertyCard.tsx` | Rahmen um das Foto |

**Bewusst behalten:** der Platzhalter „Before & After" (eine leere Fläche ohne
Begrenzung liest sich als Layoutfehler) und die Formular-Karte im
`PropertyEvaluator` — ein Eingabeformular profitiert von einem Container.

<details>
<summary>Ausgangslage</summary>

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

</details>

---

## 4 · Stripe / Buchungsabschluss

**Status:** diagnostiziert, nichts geändert · **Priorität:** zuletzt · ⚠️ **höchstes Risiko**

Aus der Notiz: *„Stripe bzw. Buchungsabschluss Funktion fixen und flüssig
bekommen."*

**Scope-Hinweis:** Die ursprüngliche Anweisung lautete „Buchungs-Engine / Guesty
/ Stripe nicht anfassen". Der Punkt ist inzwischen ausdrücklich freigegeben, wird
aber als Letztes bearbeitet — hier geht es um echte Zahlungen, nicht um Layout.
Vor Änderungen am Zahlungsfluss jeweils einzeln rückfragen.

### Befund A — das Zahlungsformular lädt ewig

`guesty-stripe-config` antwortet **HTTP 500: „Stripe publishable key not
configured"**. Das Secret `GUESTY_STRIPE_PUBLISHABLE_KEY` ist im Supabase-Projekt
nicht gesetzt.

Die Kette dahinter:

| Schritt | `BookingSummary.tsx` | Folge |
|---|---|---|
| Config-Aufruf schlägt fehl | `:161-167` — nur `console.error`, kein Toast | `stripePromise` bleibt `null` |
| Kartenfeld wird nie gerendert | `:847-861` | „Loading secure payment form…" läuft endlos |
| `onReady` feuert nie | `:850-854` | `cardReady` bleibt `false` |
| Button ist dauerhaft deaktiviert | `:875` `disabled={… \|\| !cardReady}` | Klick tut nichts |

Genau das beschriebene Verhalten. **Kein Code-Fehler — ein fehlendes Secret.**
Zwei getrennte Sachen: Almedin setzt den Key, ich baue die sichtbare
Fehlermeldung statt des ewigen Spinners.

### Befund B — der Gesamtpreis ist zu niedrig

Live-Quote, Vienna Ottakring, 02.–09.11.2026:

| Guesty-Feld | Wert |
|---|---|
| `fareAccommodation` | 1.550,00 € |
| `fareCleaning` / `totalFees` | 250,00 € |
| `subTotalPrice` | 1.800,00 € |
| **`totalTaxes`** (City Tax) | **694,40 €** |
| **`hostPayout`** = was der Gast zahlt | **2.494,40 €** |

`BookingSummary.tsx:227` nimmt `money.subTotalPrice` als Total → die Seite zeigt
**1.800 €**, Guesty bucht **2.494,40 €** ab. Die Steuerzeile taucht in der
Aufschlüsselung überhaupt nicht auf, weil `fees` (`:214`) nur `totalFees` liest.

Richtig wäre `hostPayout` (bzw. `subTotalPrice + totalTaxes`) plus eine eigene
Zeile „Taxes".

### Befund C — stille Fantasiepreise, wenn Guesty nicht antwortet

`fetchQuote` fängt jeden Fehler ab und rechnet ersatzweise
`price_per_night × Nächte × 1,1` (`:291-301`). Die 10 % sind erfunden, und
`price_per_night` ist der eingefrorene Importwert aus Punkt 1. Der Gast sieht
eine glaubwürdige Zahl ohne jeden Hinweis, dass sie geraten ist — und kann damit
buchen.

Bei `DATES_NOT_AVAILABLE` (`:271-281`) wird `quote` gar nicht gesetzt, die
Zusammenfassung rendert dann „€" ohne Zahl.

### Befund D — „from €X" auf den Karten stimmt in beide Richtungen nicht

| Objekt | gespeichert | echte Live-Rate/Nacht |
|---|---|---|
| Vienna Ottakring | 340 € | **221 €** |
| Oaks&Thistle Calahonda | 65 € | **90 €** |

„from" behauptet eine Untergrenze, die keine ist. Das ist derselbe Defekt wie
Punkt 1 und wird erst durch den nächtlichen Cache-Job wirklich gelöst.

### Was in Ordnung ist

`guesty-booking-auth` (Token-Cache greift) · `guesty-get-quote` liefert saubere
Quotes mit `_id` und `ratePlanId` · `guesty-create-reservation` mit
Fehlerübersetzung und Inquiry-Fallback · `guesty-webhook` inkl. Signaturprüfung
und Cache-Invalidierung.

Beteiligte Funktionen:
`guesty-booking-auth` · `guesty-create-reservation` · `guesty-get-quote` ·
`guesty-stripe-config` · `guesty-webhook`

Beteiligte Komponenten:
`BookingSummary.tsx` · `InstantBookFallbackDialog.tsx` · `AvailabilityCalendar.tsx`
· `pages/Book.tsx` · `pages/BookingConfirmation.tsx`

---

## 5   CTA PM Page

**Status:** ✅ gebaut · ⚠️ **Migration muss noch angewendet werden**

Ein Call to Action mit einem Button muss viel früher kommen auf dieser Seite, da sonst man sich zu sehr durch Informationen durchliest. Was dementsprechend auch bedeutet, dass man sich überlegen muss, welche Art von Call to Action Button man nehmen möchte: ob es ein Kalender-Termin-Buchungslink ist oder zum Kontaktformular. Wobei man ein Kontaktformular eher unten anbringen kann, vor dem Footer, und oben eine Termin-Buchung. Dann auch noch mal schauen, bezüglich der Sections überhalb und drunterhalb, ob man da eventuell im Inhalt etwas austauschen kann oder die chronologische Reihenfolge ändern kann.

### Ausgangslage

Die **erste Handlungsaufforderung war Section 9 von 10**. Davor acht Sections
reine Information. Der Hero bestand aus drei gestapelten Textblöcken und hatte
keinen einzigen Button.

### Umgesetzt

**Hero:** zwei Buttons. Primär „Talk to us about your property" springt zum
Formular am Seitenende, sekundär „See what it could earn" zur Cashflow-Analyse.
Zwei, weil Eigentümer in zwei Zuständen ankommen — der entschlossene will eine
Person, der neugierige gibt seinen Namen noch nicht her und nimmt lieber eine
Zahl mit.

**Reihenfolge:** Die Cashflow-Analyse ist von Platz 9 auf Platz 6 gerückt,
direkt hinter Stats und Projects. Sie beantwortet damit genau die Frage, die der
Beweis darüber gerade ausgelöst hat, und der zweite Hero-Button springt vier
statt acht Sections weit.

| | vorher | jetzt |
|---|---|---|
| 1 | Hero (ohne CTA) | Hero **+ 2 Buttons** |
| 2–5 | Säulen · Financial · Stats · Projects | unverändert |
| 6 | Technology | **Cashflow-Analyse** ⬆ |
| 7–9 | About · Ways · Cashflow | Technology · About · Ways |
| 10 | Owner CTA (`mailto`) | **Kontaktformular** |

**Formular:** `OwnerContactForm.tsx` ersetzt den `mailto`-CTA. Sechs Felder,
vier davon Pflicht, schreibt in die vorhandene CRM-Tabelle `contacts` mit
`source = 'website_owner_form'`.

### Offen

- ⚠️ **`20260810211500_owner_enquiries_public_insert.sql` muss angewendet
  werden.** `contacts` hatte nur eine Admin-Policy — ohne die neue INSERT-Policy
  weist RLS jede Einsendung ab. Das Formular fängt das ab und zeigt dann die
  E-Mail-Adresse, aber der Lead landet nirgends.
- `OwnerCta.tsx` wird nicht mehr verwendet und kann gelöscht werden.
- Der Terminbuchungs-Link bleibt offen (siehe unten) — der obere Button springt
  vorerst zum Formular statt in einen Kalender.

### 🔴 Getrennter Fund: `ConsultationBooking.tsx` speichert nichts

Nicht Teil von Punkt 5, aber beim Suchen aufgefallen und gravierender als die
CTA-Platzierung.

`handleSubmit` (`:42-67`) prüft Datum und Bilder, zeigt „We'll review your
property and contact you within 24 hours" — und hört auf. Kein
`supabase.from(...)`, kein Mailversand, kein Upload der Fotos.

Die Komponente steht auf `/evaluate` unter dem Ergebnis der Cashflow-Analyse
(`Evaluate.tsx:506`), also am wärmsten Lead, den die Seite überhaupt erzeugt.
Der Eigentümer lädt Adresse, Telefonnummer und bis zu zehn Fotos hoch, bekommt
eine Bestätigung, und die Anfrage existiert nirgends.

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
