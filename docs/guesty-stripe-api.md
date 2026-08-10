# Guesty & Stripe — Übergabe für die Desktop-App

Diese Datei ist als Startprompt gedacht. In der Desktop-App gibt es direkte
Konnektoren zur Guesty- und Stripe-API — die fehlen in der Terminal-Session, und
genau daran ist die Diagnose an drei Stellen stehengeblieben.

**Repo:** `estate-gem-manager` · **Branch:** `redesign/v2` ·
**Supabase-Projekt:** `xjvtuderbirlwudatgxg`

---

## Startprompt

> Lies `docs/guesty-stripe-api.md`. Arbeite Abschnitt „Teil 1" mit den Guesty-
> und Stripe-Konnektoren ab und beantworte die sechs Fragen mit echten Daten,
> nicht aus dem Code. Danach setz die Code-Änderungen aus „Teil 2" im Repo um —
> aber frag vor jeder einzelnen nochmal nach, es geht um echte Zahlungen.

---

## Ausgangslage

Der Buchungsabschluss bricht ab, und die angezeigten Preise stimmen nicht. Gegen
die Live-API getestet am 10.08.2026, **ohne** dabei etwas zu ändern:

### A · Das Zahlungsformular lädt endlos

`guesty-stripe-config` antwortet **HTTP 500 — „Stripe publishable key not
configured"**. Das Supabase-Secret `GUESTY_STRIPE_PUBLISHABLE_KEY` ist nicht
gesetzt.

Danach kippt die Kette um: Der Fehler landet nur in der Browser-Konsole
(`BookingSummary.tsx:161-167`), `stripePromise` bleibt `null`, das Kartenfeld
wird nie gerendert, `onReady` feuert nie, `cardReady` bleibt `false` — und
„Complete Booking" ist über `disabled` (`:875`) dauerhaft tot. Der Klick kann
gar nichts auslösen.

**Kein Code-Fehler. Ein fehlendes Secret.**

### B · Der Gesamtpreis ist zu niedrig

Echte Quote, Vienna Ottakring (`6a33b2567b418e001377caff`), 02.–09.11.2026:

| Guesty-Feld | Wert |
|---|---|
| `fareAccommodation` | 1.550,00 € |
| `fareCleaning` / `totalFees` | 250,00 € |
| `subTotalPrice` | 1.800,00 € |
| `totalTaxes` (City Tax) | **694,40 €** |
| `hostPayout` | **2.494,40 €** |

`BookingSummary.tsx:227` nimmt `subTotalPrice` als Total. Die Seite zeigt
**1.800 €**, Guesty bucht **2.494,40 €** ab. Die Steuerzeile fehlt in der
Aufschlüsselung komplett, weil `fees` (`:214`) nur `totalFees` liest.

### C · Erfundene Preise beim Fehlerfall

Schlägt die Quote fehl, rechnet `fetchQuote` still
`price_per_night × Nächte × 1,1` (`:291-301`). Die 10 % sind erfunden,
`price_per_night` ist der eingefrorene Importwert. Der Gast sieht eine
glaubwürdige Zahl ohne Hinweis und kann damit buchen.

Bei `DATES_NOT_AVAILABLE` (`:271-281`) wird `quote` gar nicht gesetzt — die
Zusammenfassung rendert dann „€" ohne Zahl.

### D · „from €X" auf den Karten stimmt in beide Richtungen nicht

| Objekt | gespeichert | echte Live-Rate/Nacht |
|---|---|---|
| Vienna Ottakring | 340 € | 221 € |
| Oaks&Thistle Calahonda | 65 € | 90 € |

Gehört zu Punkt 1 in `docs/open-todos.md` und wird erst durch einen nächtlichen
Cache-Job wirklich gelöst.

### Was funktioniert

`guesty-booking-auth` (Token-Cache greift, wichtig wegen Guestys Limit von
3 Tokens/24 h) · `guesty-get-quote` liefert saubere Quotes mit `_id` und
`ratePlanId` · `guesty-create-reservation` inkl. Fehlerübersetzung und
Inquiry-Fallback · `guesty-webhook` inkl. Signaturprüfung und
Cache-Invalidierung.

---

## Teil 1 — Fragen, die nur die Konnektoren beantworten

### 1 · Welcher Stripe-Publishable-Key ist der richtige? *(Stripe + Guesty)*

Nicht irgendeiner. Guesty verarbeitet die Karte über **das Stripe-Konto, das in
Guesty als Payment Provider hinterlegt ist**. Der Publishable Key muss aus genau
diesem Konto stammen — sonst erzeugt der Browser ein `pm_…`-Token, das Guesty
nicht einlösen kann, und die Reservierung scheitert mit
`WRONG_PAYMENT_CONFIG`.

Zu prüfen:
- Welches Stripe-Konto ist in Guesty verbunden? (Account-ID abgleichen)
- **Live oder Test?** Beide Seiten müssen im selben Modus sein. Ein
  `pk_test_…` gegen ein Live-Guesty-Konto scheitert lautlos an derselben Stelle.
- Der Key gehört dann als `GUESTY_STRIPE_PUBLISHABLE_KEY` in die Supabase Edge
  Function Secrets (Project Settings → Edge Functions → Secrets). **Nur der
  Publishable Key** — der Secret Key hat dort nichts zu suchen.

### 2 · Ist der Gast-Gesamtbetrag wirklich `subTotalPrice + totalTaxes`? *(Guesty)*

In der Testquote gilt `hostPayout = subTotalPrice + totalTaxes` exakt. Ob das
immer so ist, ist die Frage: `hostPayout` ist das, was **der Host bekommt** —
sobald irgendwo eine Kommission greift, laufen die beiden Zahlen auseinander.

An einer **echten, bereits bestätigten Reservierung** gegenprüfen: Was steht in
`money.balanceDue`, was in den `invoiceItems`, was wurde tatsächlich abgebucht?
Danach entscheiden, welches Feld in der Zusammenfassung als Total steht.

Empfehlung bis zum Gegenbeweis: `subTotalPrice + totalTaxes` rechnen statt
`hostPayout` lesen — die Formel bleibt richtig, auch wenn später Kommissionen
dazukommen.

### 3 · Ist Instant Book pro Listing überhaupt aktiv? *(Guesty)*

Der Code hat einen ausgebauten Fallback für den Fall, dass es nicht aktiv ist
(`InstantBookFallbackDialog`) — aber niemand weiß, ob er die Regel oder die
Ausnahme ist. Für die 23 Listings prüfen: Instant Book aktiviert? Payment
Provider zugewiesen? Rate Plan bookable?

Wenn Instant Book bei den meisten aus ist, ist die ganze Kartenerfassung im
Formular die falsche Voreinstellung und der Anfrage-Weg gehört nach vorne.

### 4 · Warum meldet ein Listing bei *jeder* Anfrage `minNights`? *(Guesty)*

`69c0291069caed0011ebe170` (6th floor Malaga Soho) antwortet bei 5, 10 **und**
14 Nächten mit `notApplicable.minNights: true`. Bei 14 Nächten ergibt das keinen
Sinn — entweder ist die Mindestaufenthaltsregel im Listing kaputt, oder unser
Payload wird nicht so gelesen, wie wir denken.

In Guesty die Rate-Plan- und Availability-Regeln des Listings ansehen und mit
einer Quote über die Konnektoren gegenprüfen.

### 5 · Ist `basePrice` wirklich eine Untergrenze? *(Guesty)*

Für das „from €X" auf den Karten. Die Messung oben sagt nein — Calahonda steht
mit 65 € drin und kostet real 90 €. Zu klären, ob `prices.basePrice` überhaupt
als Floor taugt oder ob es dafür ein passenderes Feld gibt.

### 6 · Kommen die Webhooks an? *(Guesty)*

Der Webhook-Handler ist fertig gebaut, aber ungeprüft. In Guesty schauen, ob die
Webhooks auf
`https://xjvtuderbirlwudatgxg.supabase.co/functions/v1/guesty-webhook`
registriert sind und ob `GUESTY_WEBHOOK_SECRET` auf beiden Seiten identisch ist.
Ist es nur auf einer Seite gesetzt, werden alle Events mit **401** verworfen.

---

## Teil 2 — Code-Änderungen danach

Alle in `src/components/BookingSummary.tsx`. **Vor jeder einzeln rückfragen.**

### 2.1 · Steuern in Total und Aufschlüsselung *(dringendste)*

- Total auf `subTotalPrice + totalTaxes` umstellen (`:227`) — bzw. auf das, was
  Frage 2 ergeben hat.
- Eigene Zeile **„Taxes"** in die Aufschlüsselung (`:761-781`), zwischen Fees und
  Total.

Ohne das nennt die Seite einen Preis, den sie nicht abbucht.

### 2.2 · Sichtbarer Fehler statt Endlos-Spinner

Schlägt `guesty-stripe-config` fehl (`:161-167`), einen Fehlerzustand setzen
statt nur `console.error`. Das Formular soll dann sagen, dass die Kartenzahlung
gerade nicht verfügbar ist, und den Anfrage-Weg anbieten — nicht ewig laden bei
totem Button.

### 2.3 · Den stillen Fantasiepreis entfernen

Der Fallback `price_per_night × Nächte × 1,1` (`:245-253`, `:291-301`) muss weg.

**Offene Entscheidung von Almedin:** Wenn Guesty keinen Preis liefert —
Buchung **blockieren** („Preis gerade nicht abrufbar") oder als unverbindliche
**Anfrage** weiterlaufen lassen?

Empfehlung: blockieren. Eine Buchung zu einem geratenen Preis macht hinterher
mehr Ärger als eine verlorene Anfrage.

### 2.4 · Kleinigkeit

Bei `DATES_NOT_AVAILABLE` (`:271-281`) den Dialog schließen oder eine klare
Meldung zeigen, statt eine Zusammenfassung mit leeren „€" stehen zu lassen.

---

## Reihenfolge

1. **Frage 1 klären und das Secret setzen** — ohne den Key bleibt der Abschluss
   tot, egal was am Code passiert.
2. **2.1 umsetzen** — der einzige Punkt, bei dem es um Geld geht, das falsch
   ausgewiesen wird.
3. Fragen 2–6 abarbeiten, dann 2.2 bis 2.4.
4. Erst danach eine echte Testbuchung, am besten im Stripe-Testmodus.

---

## Nicht vergessen

- **Guesty-Token-Limit: 3 pro 24 Stunden.** Der Cache in
  `guesty-booking-auth` deckt das ab, aber beim Testen nicht mutwillig
  Tokens verbrennen.
- Quotes anzulegen ist harmlos — sie laufen nach 24 h ab und kosten nichts.
  Reservierungen anzulegen ist es **nicht**.
- `git status` vor dem Start: `redesign/v2`, `main` bleibt unberührt.
