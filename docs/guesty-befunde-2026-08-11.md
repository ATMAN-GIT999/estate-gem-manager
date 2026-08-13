# Guesty-Befunde — Live-Abfrage vom 11.08.2026

Antworten auf „Teil 1" aus [`guesty-stripe-api.md`](guesty-stripe-api.md), erhoben
über den Guesty-MCP-Konnektor gegen das Live-Konto **Frontier Residences**
(`accountId 66c4630d701825383a6441b7`). Alle Abfragen waren **rein lesend** —
es wurde nichts angelegt, geändert oder gelöscht.

Die Ausgangsdiagnose der bestehenden Doku bleibt gültig. Diese Datei ergänzt sie
um belegte Antworten und **zwei neue Befunde**, die vorher nicht bekannt waren.

---

## Zusammenfassung

| # | Frage | Ergebnis |
|---|---|---|
| 1 | Welcher Stripe-Key? | Konto identifiziert, Key weiterhin **nicht gesetzt** |
| 2 | Total = `subTotalPrice + totalTaxes`? | ✅ **Ja, exakt** — an 6 Reservierungen belegt |
| 3 | Instant Book aktiv? | ✅ Regel, nicht Ausnahme (20 von 24) |
| 4 | Warum immer `minNights`? | ✅ Kein Bug — Objekt steht auf 63 Nächte |
| 5 | `basePrice` als Untergrenze? | ❌ Nein, in **beide** Richtungen falsch |
| 6 | Kommen Webhooks an? | ❌ **Nie** — Webhook ist gar nicht registriert |

**Neu entdeckt:**
- 🔴 **City Tax ist falsch konfiguriert** — erzeugt 97–144 % Steuer. Blockiert Punkt 2.1.
- 🟠 **Webhook-Secret-Prüfung ist optional** — ohne Secret steht der Endpoint offen.

---

## 1 · Stripe-Konto

Guesty hat **genau einen** Payment Provider, und **alle 24 Objekte** hängen daran
(`paymentProviderId` durchgehend identisch — kein Zuordnungsproblem).

| Feld | Wert |
|---|---|
| `providerAccountId` | `acct_1Pqi8YRsGzWWYqz8` |
| `accountName` | Frontier Residences |
| `status` | `ACTIVE` |
| `defaultCurrency` | `eur` |
| `rails` | `["CARD"]` |
| verbunden am | 22.08.2024 durch `aschbacher@frontier-residences.com` |
| verbundene Objekte | 24 von 24 |

**Live oder Test?** Guesty gibt den Modus nicht direkt aus. Das Konto verarbeitet
aber reale Reservierungen mit realen Beträgen — es ist die **Live-Umgebung**.
Gebraucht wird also der `pk_live_…` aus genau diesem Stripe-Konto.

**Status des Secrets — weiterhin offen.** Gegengeprüft am 11.08.2026:

```
POST /functions/v1/guesty-stripe-config
→ HTTP 500  {"error":"Stripe publishable key not configured"}
```

`GUESTY_STRIPE_PUBLISHABLE_KEY` ist in den Supabase Edge Function Secrets nach wie
vor nicht gesetzt. Punkt A der Ausgangsdiagnose gilt unverändert.

---

## 2 · Ist der Gast-Gesamtbetrag `subTotalPrice + totalTaxes`?

**Ja — die Gleichung gilt exakt, in allen geprüften Fällen.**

| Confirmation | Quelle | `subTotalPrice` | `totalTaxes` | `hostPayout` | `balanceDue` |
|---|---|---:|---:|---:|---:|
| `GY-jCGDu9cs` | **website** | 1.638,80 | 0,00 | 1.638,80 | 1.638,80 |
| `BC-4vG4zjMKJ` | Booking.com | 1.066,79 | 0,00 | 1.066,79 | 1.066,79 |
| `HMFBM5XKCE` | Airbnb | 954,00 | 0,00 | 954,00 | 954,00 |
| `GY-ERtupLw6` | manual | 876,00 | 0,00 | 876,00 | 876,00 |
| `HMDXSJ8CTQ` | Airbnb | 217,38 | 650,43 | 867,81 | 867,81 |
| `HMSXSNP3EK` | Airbnb | −777,13 | 2.438,40 | 1.661,27 | 1.661,27 |

In jeder Zeile gilt `hostPayout = subTotalPrice + totalTaxes = balanceDue`.

**Die Kommissionsfrage ist damit erledigt.** Die Sorge der Ausgangsdoku war, dass
`hostPayout` und die Summe auseinanderlaufen, sobald eine Kommission greift. Tut
sie nicht — Kommission läuft über `netIncome`/`ownerRevenue`, nicht über
`hostPayout`:

- `BC-4vG4zjMKJ`: `hostServiceFee` 300,89 € · `commission` 185,36 € → `hostPayout` bleibt 1.066,79 €
- `HMFBM5XKCE`: `hostServiceFee` 175,00 € · `commission` 174,80 € → `hostPayout` bleibt 954,00 €

**Empfehlung bestätigt:** `subTotalPrice + totalTaxes` rechnen. `balanceDue` wäre
gleichwertig und beschreibt am direktesten, was offen ist.

> ⚠️ Diese Formel ist nur so gut wie die Steuer-Konfiguration dahinter — siehe
> den City-Tax-Befund unten. **Punkt 2.1 nicht umsetzen, bevor der geklärt ist.**

---

## 🔴 Neuer Befund: Die City Tax ist in Guesty falsch konfiguriert

Aufgefallen bei der Prüfung von Frage 2. Am Objekt Vienna Ottakring
(`6a33b2567b418e001377caff`) ist hinterlegt:

```json
{
  "name": "City Tax",
  "type": "HOME_SHARING_TAX",
  "amount": 3.2,
  "units": "PERCENTAGE",
  "quantifier": "PER_GUEST_PER_NIGHT",
  "appliedOnFees": ["AF"],
  "isInclusive": false
}
```

`PERCENTAGE` kombiniert mit `PER_GUEST_PER_NIGHT` lässt Guesty den Prozentsatz
**mit Gästen und Nächten multiplizieren**:

```
Steuer = 3,2 % × Unterkunft × Gäste × Nächte
```

**Gegenprobe an der Quote aus der Ausgangsdoku** (Ottakring, 02.–09.11.2026):

```
0,032 × 1.550 € × 2 Gäste × 7 Nächte = 694,40 €   ← exakt der dokumentierte Wert
korrekt (3,2 % vom Nächtigungsentgelt) =  49,60 €
```

Die Formel reproduziert den Wert auf den Cent. An echten Buchungen wird das
Ausmaß sichtbar:

| Reservierung | Gäste × Nächte | Unterkunft | `totalTaxes` | Steuerquote |
|---|---|---:|---:|---:|
| `HMDXSJ8CTQ` | 9 × 3 | 669,83 € | 650,43 € | **97 %** |
| `HMSXSNP3EK` | 5 × 8 | 1.694,83 € | 2.438,40 € | **144 %** |

Bei beiden kippt `subTotalPrice` dadurch ins Absurde — bei `HMSXSNP3EK` auf
**−777,13 €**. Ein negativer Zwischenbetrag ist für sich schon Beleg, dass die
Konfiguration nicht stimmen kann.

*(Bei den Airbnb-Buchungen weicht die Basis leicht von der reinen Formel ab —
Markup, Rabatte und die Inklusiv-Extraktion von Airbnb wirken mit hinein. Das
Muster „skaliert mit Gäste × Nächte" ist trotzdem eindeutig, und an der
Booking-Engine-Quote stimmt die Formel exakt.)*

### Warum das Punkt 2.1 blockiert

Die Ausgangsdoku behandelt die **2.494,40 €** als den korrekten Betrag, den die
Seite anzeigen soll. Tatsächlich sind **beide** Zahlen falsch:

| | Betrag |
|---|---:|
| Was die Seite heute zeigt | 1.800,00 € |
| Was Guesty heute abbuchen würde | 2.494,40 € |
| Was rechnerisch richtig wäre | **~1.849,60 €** |

Stellt man nur die Formel um, zeigt und bucht die Website einen um rund **645 €
zu hohen** Betrag. Der Anzeigefehler wäre behoben, der Geldfehler bliebe — und
würde erstmals auch abgerechnet.

### Zu tun (in Guesty, nicht per Code)

1. Am Objekt Ottakring den Quantifier der City Tax von `PER_GUEST_PER_NIGHT` auf
   **`PER_STAY`** ändern. Bei einer Prozent-Steuer ist das der richtige Wert.
2. Fachlich gegenprüfen, ob 3,2 % und die Bemessungsgrundlage der Wiener
   Ortstaxe entsprechen (Basis ist üblicherweise das Nettonächtigungsentgelt).
3. Danach eine frische Quote ziehen und `totalTaxes` gegen die Erwartung prüfen
   (≈ 49,60 € statt 694,40 € im Beispiel oben).
4. **Erst dann** Punkt 2.1 umsetzen.

Betroffen ist nach aktuellem Stand nur Ottakring — es ist das einzige Objekt mit
einer eigenen Steuer. Account-Level-Steuern gibt es keine
(`financialsTaxesList` → leer), Calahonda hat ebenfalls keine.

---

## 3 · Ist Instant Book aktiv?

**Ja, bei der klaren Mehrheit.** Instant Book ist die Regel, nicht die Ausnahme.

| Zustand | Anzahl |
|---|---:|
| Airbnb Instant Book `everyone` | 20 |
| Airbnb Instant Book `off` | 2 |
| ohne Airbnb-Anbindung | 2 |
| **Payment Provider zugewiesen** | **24 von 24** |

Die zwei mit `off`:
- `69c0291069caed0011ebe170` — 6th floor Malaga Soho *(steht ohnehin auf Langzeitmiete, siehe Frage 4)*
- `6861942f486b17001a84aba9` — THE ONE Higuerón

Ohne Airbnb-Anbindung: `6a6862aeb61e740012830366` (Casa Heredia),
`67e6e5d71de68f00137065f6` (Urban Exclusive Malaga).

**Beleg, dass der Direktbuchungsweg funktioniert:** Reservierung `GY-jCGDu9cs`
ist mit `source: website`, `channel: direct` und gesetzter
`ratePlanId: 66d5a2354efb35ace5a355bc` als `confirmed` angelegt — über genau
diesen Weg, 10 Nächte, 1.638,80 €.

⇒ Die Kartenerfassung als Voreinstellung im Formular ist richtig. Der
`InstantBookFallbackDialog` bleibt der Ausnahmefall und muss nicht nach vorne.

> Anmerkung: `revenueRatePlansGetByListing` liefert für `booking_engine` eine
> leere Liste. Das ist **kein** Hinweis auf ein Problem — diese Pilot-API zeigt
> nur eigenständig angelegte Rate Plans, nicht die regulären.

---

## 4 · Warum meldet ein Objekt bei *jeder* Anfrage `minNights`?

**Kein Bug — weder im Payload noch im Objekt.**

`69c0291069caed0011ebe170` (6th floor Malaga Soho) ist auf **Langzeitmiete**
konfiguriert:

```
terms.minNights = 63
```

Im Kalender steht durchgehend `minNights: 63` / `baseMinNights: 63`. Anfragen mit
5, 10 oder 14 Nächten werden damit völlig korrekt abgelehnt — auch die 14, die in
der Ausgangsdoku als „ergibt keinen Sinn" markiert war. Sie ergibt Sinn: 14 < 63.

Passend dazu steht bei diesem Objekt auch Airbnb Instant Book auf `off`. Es ist
schlicht kein Kurzzeit-Mietobjekt.

**Offene Produktfrage:** Soll ein Objekt mit 63 Nächten Mindestaufenthalt
überhaupt im normalen Buchungsfluss der Website auftauchen? Ein Gast, der Daten
wählt, bekommt dort ausnahmslos eine Absage.

---

## 5 · Ist `basePrice` eine Untergrenze?

**Nein — und der Fehler geht in beide Richtungen.**

Kalenderwerte für den 02.–09.11.2026:

| Objekt | `basePrice` | echte Tagesraten | Verhältnis |
|---|---:|---|---|
| Vienna Ottakring | 340 € | 172 – 264 € | zu **hoch** |
| Oaks&Thistle Calahonda | 65 € | 84 – 86 € | zu **niedrig** |

Alle geprüften Kalendertage tragen `isBasePrice: false` — die tatsächlichen
Preise kommen also nicht aus `basePrice`, sondern von **PriceLabs**
(als Webhook im Konto verbunden, siehe Frage 6). `basePrice` ist nur der
Rückfallwert, wenn für einen Tag keine dynamische Rate vorliegt.

**Für „from €X" taugt `basePrice` damit nicht.** Die richtige Quelle ist das
Minimum über `price` aus `anpCalendarGet` für die kommenden Tage — also genau
der nächtliche Cache-Job aus `open-todos.md`. Ein passenderes Einzelfeld gibt es
nicht; der Wert muss aus dem Kalender aggregiert werden.

---

## 6 · Kommen die Webhooks an?

**Nein — es kann nie eines angekommen sein.** Der Endpoint ist in Guesty
schlicht nicht registriert.

Registriert sind genau drei Webhooks, alle von Drittanbietern:

| URL | Events |
|---|---|
| `https://a.chekin.io/api/v3/pms-integrations/guesty/webhooks/` | `reservation.updated`, `reservation.new`, `guest.updated` |
| `https://api.nuki.io/service/guesty/notify?token=…` | `reservation.new`, `reservation.updated` |
| `https://webhooks.pricelabs.co/webhooks/reservations/guesty` | `reservation.new`, `reservation.updated`, `reservation.reviewed` |

`https://xjvtuderbirlwudatgxg.supabase.co/functions/v1/guesty-webhook` ist
**nicht dabei**. Die Frage nach dem Secret-Abgleich stellt sich damit noch gar
nicht — es gibt nichts, das abgeglichen werden könnte.

*(Nebenbei bestätigt der PriceLabs-Webhook die Erklärung aus Frage 5: Die Preise
werden dynamisch von außen gesetzt.)*

---

## 🟠 Neuer Befund: Die Secret-Prüfung im Webhook ist optional

In `supabase/functions/guesty-webhook/index.ts:88-102`:

```ts
const expectedSecret = Deno.env.get("GUESTY_WEBHOOK_SECRET");
if (expectedSecret) {
  // … Signatur prüfen, sonst 401
}
```

Ist das Secret **nicht** gesetzt, wird die Prüfung **komplett übersprungen** und
der Request ungeprüft verarbeitet — er löscht aus `guesty_calendar_cache` und
schreibt mit dem Service-Role-Key in `guesty_webhook_events`.

Die Ausgangsdoku beschreibt nur die eine Richtung („nur auf einer Seite gesetzt →
alles 401"). Die andere Richtung ist die gefährlichere:

| Secret in Supabase | Secret in Guesty | Ergebnis |
|---|---|---|
| gesetzt | fehlt/abweichend | alle Events 401 — laut, aber harmlos |
| **fehlt** | egal | **jeder Request wird akzeptiert** |

Da die Endpoint-URL im Repo dokumentiert ist, wäre der Endpoint nach dem Anlegen
des Webhooks für jeden offen, der sie kennt.

### Richtige Reihenfolge beim Einrichten

Das Secret vergibt Guesty erst **beim Anlegen** des Webhooks — es kann vorher
nicht in Supabase hinterlegt werden. Damit ergibt sich zwingend:

1. Webhook in Guesty anlegen (`reservation.new`, `reservation.updated`)
2. Secret über Guesty abrufen (`accountWebhooksGetSecret`)
3. Secret **sofort** als `GUESTY_WEBHOOK_SECRET` in die Supabase Edge Function
   Secrets eintragen
4. Erst danach in Guesty scharf schalten bzw. Events auslösen lassen

Zwischen Schritt 1 und 3 besteht ein offenes Fenster — es sollte kurz sein.

**Empfehlung für den Code:** Den `if (expectedSecret)`-Zweig umdrehen, sodass ein
fehlendes Secret den Request **ablehnt** statt durchzulassen. Fail closed statt
fail open. Das ist ein kleiner Eingriff und macht die Reihenfolge oben unkritisch.

---

## Empfohlene Reihenfolge

1. **City Tax in Guesty korrigieren** und mit frischer Quote gegenprüfen
   → ohne das weist die Website auch nach 2.1 einen falschen Preis aus
2. **`GUESTY_STRIPE_PUBLISHABLE_KEY` setzen** (`pk_live_…` aus `acct_1Pqi8YRsGzWWYqz8`)
   → ohne den bleibt der Abschluss tot, egal was am Code passiert
3. **Punkt 2.1 umsetzen** — Total auf `subTotalPrice + totalTaxes`, Taxes-Zeile
4. Webhook fail-closed machen, dann registrieren und Secret setzen
5. Punkte 2.2 bis 2.4
6. Testbuchung — sinnvollerweise erst, wenn 1 bis 3 stehen

---

## Erhebungsmethodik

Alle Werte stammen aus Live-Abfragen vom 11.08.2026 über den Guesty-MCP-Konnektor
(`@guestyorg/sdk`), plus einem lesenden HTTP-Aufruf gegen
`guesty-stripe-config`. Verwendete Endpunkte:

`paymentsPaymentProvidersGetDefault` · `paymentsPaymentProvidersList` ·
`paymentsPaymentProvidersGetByListing` · `propertiesList` · `propertiesGet` ·
`anpCalendarGet` · `reservationsList` · `reservationsGetLegacy` ·
`financialsTaxesList` · `financialsTaxesGetActual` ·
`revenueRatePlansGetByListing` · `accountWebhooksList`

Es wurde **keine** Reservierung und **keine** Quote angelegt — das Token-Limit
von 3 pro 24 Stunden blieb unberührt (der MCP-Server nutzte einen Token aus dem
Cache).
