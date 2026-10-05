# Property-Inventar — Ist-Stand

> Direkt aus der Live-Datenbank (`properties`, Supabase `womaoywuhjchtubacbvn`)
> abgefragt am **25.09.2026**. Keine Schätzung, keine Copy — die tatsächliche
> Datenlage, auf der die SEO-Struktur aufsetzt.
>
> **23 Objekte, alle `available = true`.** Alle haben eine Beschreibung
> (> 200 Zeichen), Geokoordinaten und zwischen 12 und 77 Bildern.

---

## Verteilung nach `location`

| Ort (`location`) | Objekte | Typen |
|---|---|---|
| **Málaga** | 8 | 7 Apartments + 1 Loft |
| **Sauerwald** (Kärnten) | 5 | 4 Cabins + 1 House — „Lima Alpine Lodges" |
| **Torremolinos** | 3 | 2 Apartments + 1 Studio |
| **Wien** | 2 | Apartments |
| **Fuengirola** | 2 | Villas (Higuerón) |
| **Río Real** | 1 | Apartment |
| **Calahonda** | 1 | Apartment |
| **Benahavís** | 1 | House |

Das sind **genau 8 verschiedene `location`-Werte** — die Aussage
„8 Destinations" auf der Website ist damit belegbar, zählt aber „Sauerwald"
und „Río Real" als eigene Destinationen mit.

---

## Drei Befunde, die die Seitenstruktur bestimmen

### 1 · Marbella existiert im Bestand — ist aber falsch abgelegt

Drei Objekte gehören sachlich in den Marbella-Raum, tragen aber andere
`location`-Werte:

| Objekt | `location` in der DB | tatsächlich |
|---|---|---|
| The Hideaway Los Flamingos – **Marbella** | `Málaga` | Los Flamingos (Benahavís/New Golden Mile) |
| Luxury Escape – Los Flamingos Golf Retreat | `Málaga` | Los Flamingos |
| Los Monteros Retreat | `Río Real` | Stadtteil von Marbella |

`Málaga` ist hier der **Provinzname**, nicht die Stadt. Für die Suche heißt
das: Frontier hat Marbella-Bestand, zeigt ihn aber unter „Málaga" —
gleichzeitig wird Marbella als Ort beworben, an dem es angeblich nichts gibt.
**Das ist eine Datenkorrektur, keine SEO-Maßnahme**, und sie geht jeder
Location-Seite voraus.

### 2 · Die stärksten Cluster sind nicht die beworbenen

- **Málaga Stadt / Soho–Centro Histórico: 6 Apartments.** Der mit Abstand
  größte echte Cluster — und in der Außendarstellung praktisch unsichtbar.
  „Luxury Villas in Marbella" beschreibt den Bestand nicht.
- **Lima Alpine Lodges, Sauerwald: 5 Einheiten einer einzigen Anlage.** Das
  gehört auf **eine** Objektgruppen-Seite mit fünf Einheiten, nicht auf fünf
  konkurrierende Einzelseiten, die sich gegenseitig kannibalisieren.
- **Torremolinos: 3 Strandwohnungen erster Reihe** — eigener, klar
  beschreibbarer Suchintent („first line beach").
- **Higuerón/Fuengirola: 2 Villas** — die einzigen echten Luxusvillen, und
  genau die, die die Marke visuell trägt.

### 3 · Die Slugs taugen nicht für SEO

Beispiel: `casa-heredia-rural-andalusian-retreat-830366`

Jeder Slug trägt einen angehängten Guesty-Hash und **keinen Ort**. Für
Property-URLs ist das doppelt ungünstig: kein Ortssignal in der URL, und ein
Zahlenanhang, den kein Mensch tippt oder verlinkt. Eine Umstellung braucht
Weiterleitungen (die alten URLs stehen in der Sitemap) — deshalb **jetzt**
entscheiden, nicht nachträglich.

---

## Was für `VacationRental`-Strukturdaten bereits reicht

| Anforderung | Stand |
|---|---|
| ≥ 8 Bilder | ✅ alle Objekte haben 12–77 |
| `latitude`/`longitude` | ✅ überall gesetzt |
| Beschreibung | ✅ überall > 200 Zeichen |
| stabiler `identifier` | ✅ `guesty_listing_id` |
| Fläche (m²) | ❌ Spalte existiert nicht |
| `collection` | ❌ Spalte existiert nicht, wird im Code aus Ort/Name geraten |

---

## Einzelobjekte

| Ort | Objekt | Typ | Schlafz. | Gäste | Bilder |
|---|---|---|---|---|---|
| Benahavís | Casa Heredia – Rural Andalusian Retreat | House | 2 | 4 | 44 |
| Calahonda | Oaks&Thistle Calahonda Golf | Apartment | 2 | 4 | 77 |
| Fuengirola | Luxury Villa with Infinity Pool & Sea Views, Higuerón | Villa | 3 | 6 | 36 |
| Fuengirola | THE ONE – Sea View Luxury Villa in Higuerón | Villa | 4 | 8 | 55 |
| Málaga | 6th floor Malaga Soho Apartment ⚠️ 63 Nächte Mindestaufenthalt | Apartment | 2 | 5 | 28 |
| Málaga | Centro Historico Soho | Apartment | 4 | 7 | 21 |
| Málaga | Luxury Escape – Los Flamingos Golf Retreat | Apartment | 2 | 4 | 34 |
| Málaga | Native Quarter Malaga Centro | Apartment | 3 | 5 | 35 |
| Málaga | Soho Alameda Art District | Apartment | 2 | 5 | 39 |
| Málaga | Soho Art Experience | Apartment | 2 | 6 | 33 |
| Málaga | Studio Malaga Centro | Loft | 1 | 4 | 21 |
| Málaga | The Hideaway Los Flamingos – Marbella | Apartment | 2 | 4 | 26 |
| Río Real | Los Monteros Retreat | Apartment | 2 | 4 | 38 |
| Sauerwald | Lima Alpine Lodges – Almhaus Gertraud | Cabin | 2 | 6 | 20 |
| Sauerwald | Lima Alpine Lodges – Almhaus Petra | House | 4 | 8 | 23 |
| Sauerwald | Lima Alpine Lodges – Almhaus Theresia | Cabin | 2 | 6 | 20 |
| Sauerwald | Lima Alpine Lodges – Troadkasten Lisa | Cabin | 2 | 6 | 30 |
| Sauerwald | Lima Alpine Lodges – Troadkasten Matthias | Cabin | 2 | 6 | 25 |
| Torremolinos | Cozy Ground-Floor 2BR, Steps from Playa Mar Beach | Apartment | 2 | 4 | 13 |
| Torremolinos | New Renovated – First Line Beach Apartment | Apartment | 2 | 4 | 12 |
| Torremolinos | Sol, Arena y Mar First Line Beach Studio | Studio | 0 | 3 | 22 |
| Wien | 2BR Apartment Near Prater & City Center | Apartment | 2 | 5 | 15 |
| Wien | Vienna City Duplex Apartment Ottakring | Apartment | 4 | 9 | 19 |

Drei dieser Objekte zeigten im Test keinen Live-Preis (Los Monteros Retreat,
Luxury Escape Los Flamingos, THE ONE Higuerón) — in Guesty zu prüfen.
