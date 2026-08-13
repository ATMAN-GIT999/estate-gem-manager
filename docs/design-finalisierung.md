# Design-Finalisierung — Formatierung und Blockmuster

Letzter Schritt vor dem Livegang. Diese Datei regelt **nicht**, welche Sections es
gibt oder welcher Text darin steht — sie regelt, **wie** das Vorhandene formatiert
ist, damit die Seite beim ersten Lesen verstanden wird.

## Abgrenzung zu den anderen Dokumenten

| Datei | Regelt | Gewinnt bei Konflikt |
|---|---|---|
| `target-structure.md` | **WAS** gebaut wird — Sections, Reihenfolge, Navigation | inhaltlich |
| `pm-page-content-analysis.md` | **WELCHER Text** bleibt — Redundanzen, Streichliste | inhaltlich |
| `pm-page-build-sheet.md` | Konkreter Text pro Ebene | inhaltlich |
| **diese Datei** | **WIE es aussieht** — Größen, Gewichte, Blocklänge | bei der Darstellung |

Wenn diese Datei einer der oberen widerspricht, gilt die obere. Diese Datei fügt
nur eine Ebene hinzu, die bisher fehlte.

---

## 1 · Befund — gemessen, nicht gefühlt

Messung am 13.08.2026 im laufenden Dev-Server, Branch `redesign/v2`, Viewport
1440×900. Zum Vergleich die AS-Intel-Landingpage, die als Maßstab dient.

| | Landing `/` | PM-Seite | AS Intel (Maßstab) |
|---|---:|---:|---:|
| Wörter gesamt | 746 | **1.250** | 406 |
| Verschiedene Schriftgrößen | 8 | **10** | — |
| Größter zusammenhängender Block | — | **352 W** | 97 W |

Die PM-Seite trägt dreimal so viel Text wie die Referenz, und ein einziger Block
darin enthält 28 % der ganzen Seite. Das allein erklärt das Gefühl, zweimal lesen
zu müssen — aber es ist nicht die eigentliche Ursache.

### 1.1 Die Überschriften-Ebenen widersprechen sich

Das ist der Kernbefund. Dieselbe semantische Ebene tritt in bis zu **fünf**
verschiedenen Größen auf:

| Ebene | Gemessene Größen auf der PM-Seite |
|---|---|
| H1 | 60px |
| H2 | 48px … **36px** |
| H3 | 36px · 30px · 24px · 20px … **14px** |
| H4 | 30px · 24px · 20px · 18px … **16px** |

Konkret heißt das:

- „Villa Hoyo 19" ist eine **H4 mit 30px**.
- „WHAT THE SYSTEM ACTUALLY DOES:" ist eine **H3 mit 14px** — kleiner als der
  Fließtext daneben (16px).
- Die Abschluss-Überschrift „Less hassle, higher income, protected value." ist
  eine **H2 mit 36px**, während jede andere H2 der Seite 48px hat. Ausgerechnet
  der Abschluss ist die kleinste Section-Überschrift.

**Warum das ermüdet:** Der Leser orientiert sich unbewusst an der Größe. Wenn
Größe und Ebene nicht zusammenpassen, muss er den Inhalt lesen, um zu wissen, wo
er ist — statt es zu sehen. Das ist das „zweimal lesen".

### 1.2 Playfair steht bis auf 14px hinunter

`src/index.css` setzt global:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display Variable', 'Playfair Display', serif;
  font-weight: 600;
}
```

Playfair ist eine Display-Serif mit starkem Strichkontrast — sie lebt von Größe.
Unter etwa 24px verliert sie ihren Charakter und liest sich nur noch als „leicht
seltsamer Fließtext". Aktuell stehen **zwölf H4 mit 16px** und eine
Versalien-H3 mit 14px in Playfair. Die Schrift arbeitet dort gegen sich selbst.

### 1.3 Die Ursache: es gibt keine Skala

`index.css` legt nur Familie und Gewicht fest. **Jede Größe wird am Einsatzort
einzeln per Tailwind-Klasse gesetzt** — im `src`-Baum finden sich 673 Vorkommen
von `text-xs` … `text-7xl` über 90 Dateien.

Es existiert also nichts, womit man konsistent sein *könnte*. Jede neue Section
erfindet ihre Hierarchie neu. Alles unter 1.1 und 1.2 ist Symptom davon.

### 1.4 Was auf der Landingpage zu korrigieren ist

Dort ist die Lage besser (8 Größen), aber derselbe Fehler in klein:

- „Luxury Stays for You", „Explore the City", „Off-Grid Experiences" sind H2 mit
  **36px**.
- „Own a Property?", „It's in the details.", „Property Cashflow Analysis" sind
  H2 mit **48px**.

Sechs gleichrangige Sections, zwei Größen.

---

## 2 · Der Maßstab steht schon auf der Seite

„Two ways to work with us" ist bereits genau das, worauf alles hinauslaufen
soll — kurz, aktiv, parallel gebaut:

| | Text | Wörter |
|---|---|---:|
| ✅ Full-service management | „We run the property and you earn what it earns." | 10 |
| ✅ Guaranteed Income | „We lease the property from you and pay a fixed amount every month." | 13 |

Dagegen aus derselben Seite:

| | Text | Wörter |
|---|---|---:|
| ❌ Your house rules | „The house rules are communicated through the advertisement to avoid misunderstandings and to prevent any damage…" | 16 |
| ❌ Guest screening | „We review every booking against your conditions before accepting it, so the people in your home are people you…" | 24 |

Der Unterschied ist nicht die Länge allein. Oben steht **Aktiv** („We run", „We
lease") und ein Gedanke. Unten steht **Passiv** („are communicated") und zwei
Gedanken in einem Satz.

Der Maßstab muss also nicht erfunden werden — er muss nur auf den Rest der Seite
übertragen werden.

---

## 3 · Das System

### 3.1 Die Skala — sechs Stufen, mehr nicht

| Rolle | Desktop | Mobil | Familie | Gewicht | Verwendung |
|---|---:|---:|---|---:|---|
| **Display** | 64px | 38px | Playfair | 700 | Nur H1. Genau einmal pro Seite. |
| **Section** | 44px | 30px | Playfair | 700 | H2 — der Titel einer Section |
| **Block** | 28px | 22px | Playfair | 700 | H3 — eine Untereinheit innerhalb einer Section |
| **Item** | 18px | 17px | **Lato** | 700 | H4 — einzelner Punkt in einer Aufzählung |
| **Body** | 17px | 16px | Lato | 400 | Fließtext |
| **Meta** | 13px | 12px | Lato | 700 · uppercase · `tracking-[0.12em]` | Eyebrows, Labels, Bildunterschriften |

**Item und Body unterscheiden sich fast nur im Gewicht** (18/700 gegen 17/400).
Das ist Absicht: In einem Layout ohne Karten trennt Gewicht sauberer als Größe,
und es hält die Skala kurz.

> **Warum 700 und nicht 600.** Lato besitzt die Schnitte 100 · 300 · 400 · 700 ·
> 900 — **ein 600er existiert nicht.** Gebunden sind in `index.css` die Schnitte
> 300, 400 und 700. Ein `font-weight: 600` auf Lato lässt den Browser entweder
> auf 700 aufrunden oder einen künstlichen Fettschnitt berechnen; beides ist
> unkontrolliert. Playfair ist der variable Schnitt und deckt 400–700 stufenlos
> ab — dort wäre 600 möglich, wird aber der Einheitlichkeit halber ebenfalls
> nicht verwendet.

### 3.2 Die vier Regeln

1. **Playfair erst ab 28px.** Alles darunter ist Lato. Das betrifft sofort alle
   zwölf 16px-H4 und die 14px-Versalien-H3.
2. **Eine Ebene = eine Größe, auf allen Seiten.** Eine H2 ist immer Section. Es
   gibt keine 36px-H2 mehr und keine 48px-H2 mehr — es gibt nur Section.
3. **Keine Überschrift darf so groß sein wie die Ebene über ihr.** Wenn eine H4
   optisch nach H2 aussieht, ist entweder die Auszeichnung falsch oder die
   Struktur.
4. **Im Fließtext nur zwei Gewichte:** 400 normal, 700 für die zwei bis drei
   Wörter, die den Satz tragen. Kein 500, kein 600, kein Kursiv. Aktuell gibt es
   auf beiden Seiten **keine einzige Hervorhebung im Fließtext** — das ist der
   billigste verfügbare Hebel für Scanbarkeit.

### 3.3 Das Blockmuster — ein Gedanke pro Block

Jeder Block folgt derselben Abfolge, ohne Ausnahme:

```
[Meta-Label]      optional, ein bis drei Wörter
Überschrift       eine Zeile, keine zwei
Ein Satz          was der Block behauptet — genau einer
Inhalt            Liste, Karten, Zahlen, Formular
```

Harte Obergrenzen:

| Element | Maximum |
|---|---:|
| Section gesamt | **120 Wörter** |
| Lede unter einer Überschrift | **1 Satz** |
| Beschreibung eines Items | **12 Wörter** |
| Zeilen pro Überschrift | **1** |

Was über der Grenze liegt, ist nicht zu lang geschrieben — es sind zwei Blöcke,
die als einer getarnt sind. Dann wird geteilt, nicht gekürzt.

### 3.4 Weißraum spreizen

Aktuell ist jeder Abstand „mittel". Kraft entsteht durch Kontrast:

| | Abstand |
|---|---|
| Innerhalb einer Gruppe (Item zu Item) | eng — `gap-4` … `gap-6` |
| Zwischen Gruppen (Block zu Block) | `mt-16` … `mt-20` |
| Zwischen Sections | `py-24` … `py-28` (bestehende Regel aus CLAUDE.md) |

Faustregel: Der Sprung von „innerhalb" zu „zwischen" soll mindestens Faktor 6
betragen, nicht Faktor 3.

---

## 4 · Anwendung, Section für Section

### PM-Seite

| # | Section | W | Ist | Zu tun |
|---|---|---:|---|---|
| 2 | Hero | 49 | H1 60px, **zwei** Lede-Absätze | Ein Lede-Satz. Der zweite („precision, discretion, hospitality of a world-class boutique hotel") sagt dasselbe wie der erste. |
| 3 | We manage while you relax | **352** | H2 48, 3× H3 36, 12× H4 16 Playfair | Größter Hebel der Seite. H3 → Block, H4 → Item (Lato). Jede der 12 Beschreibungen auf ≤ 12 W. Ziel: **352 → ~150 W**. |
| 4 | We don't just manage… | 124 | 3× H3 20px, „What that adds up to:" als H3 | „What that adds up to:" ist ein Label, keine Überschrift → Meta. H3 → Block. |
| 5 | Stats | 17 | H2 48 | Passt. Die vier Zahlen auf Display-Größe ziehen — sie *sind* der Inhalt. |
| 6 | Our Work | 221 | H3 30, H4 **30** | Projektnamen (H4) sind so groß wie ihre Überschrift. H3 → Block 28, H4 → Item 18. Text auf ≤ 120 W. |
| 7 | Cashflow Analysis | 123 | Formular | Formular bleibt als Container — dokumentierte Ausnahme vom Box-Verbot. Nur Überschriften angleichen. |
| 8 | Technology | 55 | H3 **14px** Versalien | → Meta-Label, keine H3. |
| 9 | Team | 55 | H2 48 | Passt. Nur Skala. |
| 10 | Two ways to work with us | 136 | H3 24, H4 20 | **Referenzblock — Text nicht anfassen.** Nur H3 → Block, H4 → Item. |
| 11 | CTA | 68 | H2 **36px** | Auf Section (44). Der Abschluss darf nicht die kleinste Überschrift der Seite sein. |

### Landingpage

| Section | Ist | Zu tun |
|---|---|---|
| Hero | H1 72px | Auf Display (64). |
| Luxury Stays / Explore the City / Off-Grid | H2 **36px** | Auf Section (44). |
| Own a Property? / It's in the details. / Cashflow | H2 **48px** | Auf Section (44). |
| Property-Karten | H3 20px | Auf Item (18, Lato) — es sind Kartentitel, keine Blockebene. |
| „It's in the details."-Punkte | H3 18px | Auf Item. |

---

## 5 · Umsetzung in drei Schritten

Die drei Schritte sind bewusst getrennt: Nur Schritt 3 fasst Text an und braucht
damit Aufmerksamkeit vom Besitzer.

### ✅ Schritt 1 — Skala verankern — **erledigt**

Sechs Klassen `.t-display` … `.t-meta` in `src/index.css`, `@layer components`.

**Abweichung vom ursprünglichen Plan.** Hier standen Tailwind-`fontSize`-Tokens.
Das geht nicht: Ein `fontSize`-Token trägt Größe, Zeilenhöhe, Laufweite und
Gewicht — **aber keine Schriftfamilie.** Größe und Familie auf zwei Klassen zu
verteilen ist genau der Mechanismus, durch den zwölf 16px-Überschriften in einer
Display-Serif gelandet sind. Eine Klasse pro Rolle schweißt beide Entscheidungen
zusammen.

Zweite Abweichung: Die Größen sind `clamp()`-Werte statt fester Zahlen mit
`md:`-Varianten. `.t-section` ist damit von sich aus 30px auf dem Handy und 44px
am Desktop. Das entfernt die zweite Driftquelle — Überschriften, bei denen der
Breakpoint gesetzt wurde und beim Nachbarn nicht.

Die globale `h1…h6`-Regel bleibt als Rückfallebene bestehen (Admin-Bereich,
noch nicht migrierte Stellen); die `.t-*`-Klassen überschreiben sie.

**Prüfbare Regel:** In einer öffentlichen Content-Komponente steht kein
`text-xs` … `text-7xl` mehr. Ausgenommen bleiben zwei Ebenen, die nicht zur
Content-Typografie gehören: **UI-Primitives** (shadcn `Button`, `Badge`,
`Label`, `Select` — 12/14px) und die **Navigation** (16px). Für CTA-Buttons gilt
einheitlich `text-base`.

### ✅ Schritt 2 — Klassen auf die Skala ziehen — **erledigt**

Beide Seiten. Ergebnis gemessen im Dev-Server:

| Ebene | Vorher | Nachher |
|---|---|---|
| H1 | 60 / 72px | **64px Playfair 700** |
| H2 | 48px · 36px | **44px Playfair 700** |
| H3 | 36 · 30 · 24 · 20 · 14px | **28px Playfair 700** |
| H4 | 30 · 24 · 20 · 18 · 16px | **18px Lato 700** |

Eine Größe pro Ebene, auf beiden Seiten. `npx tsc --noEmit` und `npm run build`
laufen durch.

**Drei Auszeichnungen wurden dabei korrigiert**, weil sie die Ebene falsch
benannt haben:

| Element | War | Ist | Warum |
|---|---|---|---|
| „What that adds up to:" | `h3` | `p` · Meta | Listen-Einleitung, keine Section |
| „What the system actually does:" | `h3` 14px | `p` · Meta | war die kleinste Überschrift der Seite, unter Fließtextgröße |
| Footer-Markenname | `h3` | `p` · Block | Markenmarke, kein Gliederungsknoten |

### Schritt 3 — Texte auf das Blockmuster kürzen

Erst jetzt, und in dieser Reihenfolge nach Wirkung:

1. Section 3 (352 → ~150 W) — bringt allein 16 % der Seitenlänge
2. Section 6 (221 → ~120 W)
3. Hero: zweiter Lede-Absatz raus
4. Rest nach Bedarf

Gesamtziel: **1.250 → ~900 Wörter**, ohne eine Information zu verlieren.

> **Korrektur zur ersten Fassung dieser Datei.** Dort stand „~700 Wörter". Das
> war zu optimistisch — die konkreten Umschreibungen in Anhang A ergeben ~935.
> Wichtiger ist ohnehin die Grenze **pro Block**, nicht pro Seite: Die PM-Seite
> hat legitim mehr zu sagen als eine Ein-Produkt-Landingpage. Bei neun Blöcken
> sind ~900 Wörter genau die 100 pro Block, die das Blockmuster vorsieht.

---

## 6 · Was Freigabe braucht

Schritt 1 und 2 sind reine Formatierung und können sofort laufen.

Schritt 3 fasst Kundentext an. Vor dem Livegang zu klären:

1. **Hero-Lede:** Welcher der beiden Sätze bleibt? Empfehlung: der erste („Your
   home deserves more than management…") — er ist konkreter und laut
   `pm-page-content-analysis.md` §2 „der stärkste Satz der Seite".
2. **Die zwölf Item-Texte in Section 3** werden neu geschrieben. Inhaltlich
   identisch, aber aktiv und auf ≤ 12 Wörter. Sollte der Besitzer gegenlesen.
3. Unverändert offen aus den bestehenden Dokumenten: Vorher/Nachher-Bilder,
   Testimonials, `mailto:` → Terminbuchung, Aktualität der Kennzahlen.

---

## Anhang A · Die konkreten Kürzungen

Vorschlag, noch nicht umgesetzt. Prinzip durchgehend: **Aktiv statt Passiv, ein
Gedanke pro Zeile, und was die Zahl daneben schon sagt, sagt der Satz nicht
nochmal.**

### A.1 Hero — 49 → 42 W

⚠️ **Hier gilt eine bestehende Entscheidung.** `pm-page-build-sheet.md` Punkt 2
legt fest, dass die Positionierung mit „Your home deserves…" führt und der
Boutique-Hotel-Satz als **zweiter Satz folgt**. Die Blockregel „Lede = 1 Satz"
tritt dahinter zurück. Gekürzt wird deshalb nur der zweite Satz, nicht gestrichen.

| | Text | W |
|---|---|---:|
| Satz 1 · unverändert | „Your home deserves more than management — it deserves care, strategy, and master craftsmanship." | 14 |
| Satz 2 · alt | „We manage it with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset." | 21 |
| Satz 2 · **neu** | „We run it like a boutique hotel — more revenue, and a home that keeps its value." | 17 |

Drei abstrakte Substantive („precision, discretion, hospitality") gegen zwei
konkrete Ergebnisse. Die Positionierung „boutique hotel" bleibt erhalten.

### A.2 Section 3 „We manage while you relax" — 352 → ~145 W

Der größte Hebel der Seite.

**Säule 1 · Listing management** — 76 → 43 W

| Element | Alt | Neu |
|---|---|---|
| Intro | „Your property advertised on all major platforms. We keep listings updated for maximum visibility." | „Listed on every major platform and kept up to date." |
| Optimal listing | „Your home will be advertised with inviting, clear photos and clear text." | „Professional photos and copy that make people click." |
| Your house rules | „The house rules are communicated through the advertisement to avoid misunderstandings and to prevent any damage." | „Stated up front, so guests arrive knowing them." |
| Dynamic pricing | „Prices are adjusted based on location, amenities, and time of year. Certain cancellation policies are also determined." | „Rates follow the season, the market and your amenities." |
| Admin assistance | „We advise you on insurance and legislation relating to the home, and handle traveller registration and compliance." | „Traveller registration, compliance and insurance questions — handled." |

**Säule 2 · Guest management** — 126 → 54 W

| Element | Alt | Neu |
|---|---|---|
| Intro | „Every enquiry, booking, arrival and complaint comes to us, not to you. It is the largest part of the work and the part owners most want to stop doing." | „Every enquiry, booking and complaint comes to us. Not to you." |
| Guest screening | „We review every booking against your conditions before accepting it, so the people in your home are people you would have said yes to." | „We check every booking against your conditions before accepting." |
| Check-in without you | „Guests receive a personal key-box code before they travel. You are never the one handing over keys or waiting for a late arrival." | „Guests get a key-box code before they travel. You never wait up." |
| All guest contact, 24/7 | „Every message, question and problem comes to us at any hour — including the ones at 2am. You hear about it only if it concerns the property." | „Any hour, including 2am. You hear from us only if it matters." |
| A handbook per property | „We write a guide for your home: house rules, Wi-Fi, how things work, what is worth seeing nearby. Fewer questions, fewer mistakes, better reviews." | „House rules, Wi-Fi, how things work. Fewer questions, better reviews." |

Der gestrichene Halbsatz im Intro („It is the largest part of the work…")
ist eine Aussage *über* die Leistung, nicht die Leistung selbst.

**Säule 3 · Property care** — 95 → 39 W

| Element | Alt | Neu |
|---|---|---|
| Intro | „Your home is cleaned and inspected after every stay. Once guests check out we go through the property to catch any damage before the next arrival." | „Cleaned and inspected after every stay, before the next arrival." |
| House cleaning | „Your home will be thoroughly cleaned after each stay, so that everything is perfect again for the next guests." | „Thoroughly, after every single stay." |
| Laundry service | „Sheets and towels are washed and ironed after each stay. A set of towels is provided for each guest." | „Sheets and towels washed, ironed, and set out fresh." |
| Repair service | „Our handyman service is responsible for repairs and any maintenance issues according to the vacation home." | „Our own handyman handles repairs and maintenance." |
| Facilities | „We always provide some basic amenities: toilet paper, garbage bags, cleaning products, coffee/tea, soap, shampoo, etc." | „Toilet paper, soap, coffee, cleaning supplies — always stocked." |

### A.3 Section 6 „Our Work" — 221 → ~120 W

⚠️ **Diese Texte sind Aussagen über reale Objekte des Besitzers.** Kürzen heißt
hier auch: anders behaupten. Vor dem Livegang gegenlesen lassen.

| Element | Alt | Neu |
|---|---|---|
| Unterzeile | „Showcasing properties by country with before/after transformations, renovation stories, revenue improvements, and occupancy results." | „What these homes did after we took them on." |
| Spain | „Luxury villas and apartments in Marbella, Málaga, and surrounding areas" + „20+ premium properties under management" | „Marbella, Málaga and the surrounding coast." + „20+ properties under management" |
| Austria | „Urban elegance and Alpine retreats with exceptional rental yields" + „Cosmopolitan apartments and leisure properties" | „City apartments in Vienna, Alpine lodges in Carinthia." *(zweite Zeile entfällt — sagt dasselbe)* |
| Villa Hoyo 19 | „A stunning contemporary villa overlooking the golf course with panoramic sea views. Complete renovation transformed this property into one of the most sought-after rentals in the area." | „Renovated completely. Now one of the most booked villas in La Quinta." |
| Soho Boho | „Transformed from €13,000 to €65,000 annual income through strategic renovation and positioning in Málaga's vibrant Soho Arts District." | „€13,000 to €65,000 a year, after renovation and repositioning." |
| Alpine Retreat | „A charming Alpine property converted into a year-round rental with exceptional winter and summer appeal." | „Converted into a rental that books in both winter and summer." |

Die Unterzeile beschrieb, was die Section *ist* — reine Meta-Aussage. Bei den
drei Objekten tragen die Kennzahlen daneben (85 % · +120 % · 4,9) das Ergebnis
bereits; der Satz muss nur noch sagen, **was getan wurde**.

Die „Before & After Photos — Coming Soon"-Platzhalter bleiben stehen —
Entscheidung 4 im Build-Sheet.

### A.4 Bilanz

| Section | Alt | Neu | Δ |
|---|---:|---:|---:|
| Hero | 49 | 42 | −7 |
| 3 · We manage while you relax | 352 | ~145 | **−207** |
| 6 · Our Work | 221 | ~120 | −101 |
| **PM-Seite gesamt** | **1.250** | **~935** | **−315** |

Danach liegt **jeder Block unter der 120-Wörter-Grenze**. Weitere Kürzungen
(Section 4 und 7) wären möglich, sind aber nicht nötig, um die Regel zu erfüllen.
