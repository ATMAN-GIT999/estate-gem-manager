# PM-Seite — Bauliste für Phase 2b

> **Status: umgesetzt.** Die Seite hat jetzt diese Struktur:
>
> | # | Ebene | Komponente |
> |---|---|---|
> | 1 | Positioning | Hero in `PropertyManagementPage.tsx` |
> | 2 | Was wir übernehmen | `PropertyManagement.tsx` — **3 Säulen** |
> | 3 | Was es bringt | `FinancialPerformance.tsx` — **neu** |
> | 4 | Beweis | `Stats.tsx` + `ProjectsSection.tsx` |
> | 5 | Technologie | `TechnologySection.tsx` — auf 4 Punkte reduziert |
> | 6 | Wer dahintersteht | `AboutMini.tsx` |
> | 7 | Zwei Wege + darüber hinaus | `WaysToWorkTogether.tsx` — **neu** |
> | 8 | Rechnen und sprechen | `PropertyEvaluator.tsx` + `OwnerCta.tsx` |
>
> Von 12 Sections auf 9 Blöcke, gelöscht: „Our Services", die zweite
> Technologie-Liste, drei Positionierungs-Dopplungen, der Business-Areas-Wrapper.
> `BusinessAreas.tsx` selbst bleibt unangetastet — `/business-areas` nutzt es weiter.

Die Zielstruktur aus `pm-page-content-analysis.md`, aber **mit dem vorhandenen
Text darunter**. Pro Ebene steht hier, was wir schon haben, wo es aktuell liegt,
und was fehlt.

Zweck: beim Bauen nicht mehr zwischen Dateien suchen müssen — und sofort sehen,
wo tatsächlich neu geschrieben werden muss und wo nur verschoben wird.

**Legende:** ✅ vorhanden, direkt verwenden · ♻️ vorhanden, umformulieren ·
✍️ muss neu geschrieben werden · ❌ streichen

---

## Ebene 1 · Positioning — wer wir sind

> Ein Eigentümer soll in fünf Sekunden wissen: Was ist das hier, und für wen?

**Entsteht aus:** Hero + IntroSection + dem Positionierungssatz aus Business Areas

| | Text | Quelle |
|---|---|---|
| ✅ **Überschrift** | „Bespoke Property Management" | `PropertyManagementPage.tsx` Hero |
| ♻️ **Kernsatz** | „Your home deserves more than management — it deserves care, strategy, and master craftsmanship." | `IntroSection.tsx` |
| ♻️ **Positionierung** | „We manage your home with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset." | `BusinessAreas.tsx` `pmDescription` |
| ❌ Hero-Untertitel | „We deliver a personalised management plan for every property — combining hotel-level hospitality with advanced AI-driven systems to maximise revenue, elevate guest satisfaction, and protect the long-term value of your home." | sagt dasselbe wie die zwei Sätze darüber, nur länger |
| ❌ Intro-Untertitel | „Frontier Residences combines five-star hospitality with real estate intelligence to elevate every aspect of property ownership — ensuring financial performance, flawless operations, and a beautifully curated guest experience." | dito |
| ❌ | „Bespoke management for villas and luxury residences" | `BusinessAreas.tsx` `pmSubtitle` — dritte Variante desselben Satzes |

**Befund:** Wir haben **fünf Formulierungen derselben Positionierung**. Zwei
davon sind stark („deserves more than management", „boutique hotel"), drei sind
aufgeblähte Wiederholungen.

**Zu tun:** Aus 5 Sätzen 2 machen. Kein neuer Text nötig — nur auswählen.

---

## Ebene 2 · Was wir übernehmen — die operative Arbeit

> Die größte Section der Seite. Hier steht, was tatsächlich passiert.

**Entsteht aus:** `PropertyManagement.tsx` (2 Säulen) + „Our Services"

| | Text | Quelle |
|---|---|---|
| ✅ **Dach-Überschrift** | „Short-Term Rental Management" / „We manage while you relax" | `PropertyManagement.tsx` |
| ✅ **Säule 1** | Badge „Listings that stand out" · „Listing management" · „Your property advertised on all major platforms. We keep listings updated for maximum visibility." | `PropertyManagement.tsx` |
| ✅ ↳ 4 Karten | **Optimal listing** „inviting, clear photos and clear text" · **Your house rules** „communicated through the advertisement to avoid misunderstandings" · **Dynamic pricing** „adjusted based on location, amenities, and time of year" · **Admin assistance** „We advise you on insurance and legislation" | `PropertyManagement.tsx` |
| ✅ **Säule 2** | Badge „Homes in good hands" · „Property management" · „Your home will be thoroughly inspected and cleaned after each stay." + „Once guests have checked out, we will conduct a thorough inspection to detect any damage." | `PropertyManagement.tsx` |
| ✅ ↳ 4 Karten | **House cleaning** · **Laundry service** · **Repair service** · **Facilities** (Toilettenpapier, Müllbeutel, Kaffee/Tee, Seife …) | `PropertyManagement.tsx` |
| ✍️ **Säule 3 fehlt** | Gästebetreuung — Screening, Check-in, 24/7, Survival Guide | Text existiert nur noch **gast-gerichtet** in `GuestManagement.tsx` auf der Booking-Seite |
| ✍️ **Reporting fehlt** | Monatliches Reporting / Owner Portal | steht nur als Stichwort in „Our Services" |

**Der kritische Punkt dieser Ebene.** Als Guest Management auf die Booking-Seite
gewandert ist, hat die PM-Seite ihre dritte Säule verloren. Ein Eigentümer
erfährt aktuell **nur noch als Stichwort in „Our Services"**, dass Gäste betreut
werden — der Kern der Dienstleistung.

**Rohmaterial für Säule 3** (aus `GuestManagement.tsx`, muss von Gast- auf
Eigentümer-Ansprache zurückgedreht werden):

| Karte | Gast-Fassung (aktuell live) | Für den Eigentümer gemeint |
|---|---|---|
| Screening | „Every booking is reviewed by someone on our team before it's confirmed" | Wir prüfen jede Buchung, bevor sie bestätigt wird |
| Check-in | „Your personal key-box code reaches you before you travel" | Schlüsselübergabe ohne Ihr Zutun |
| 24/7 | „Message us at any hour and a real person answers" | Wir übernehmen die gesamte Gästekommunikation |
| Guide | „A handbook written for the place you've booked" | Individuelles Handbuch pro Objekt |

**Diese 9 Punkte aus „Our Services" lösen hier auf:**
Luxury photography & staging → Säule 1 · Listings on top global booking channels →
Säule 1 · 24/7 guest communication → **Säule 3** · Personal or remote check-ins →
**Säule 3** · Dynamic pricing algorithm → Säule 1 · Professional housekeeping →
Säule 2 · Preventive maintenance & inspections → Säule 2 · Owner portal with
real-time reporting → **fehlt, neu** · Legal traveller registration & compliance →
Säule 1 (Admin assistance)

**Erst wenn Säule 3 und Reporting stehen, darf „Our Services" gelöscht werden.**

---

## Ebene 3 · Was es bringt — Finanz-Ebene

> Die wichtigste neue Ebene. §17 des Strategie-Briefs.

**Entsteht aus:** verstreuten Finanz-Aussagen, erstmals gebündelt

| | Text | Quelle |
|---|---|---|
| ✅ **Ergebnisse** | „Higher occupancy" · „Better nightly rates" · „Faster responses" · „Zero operational gaps" · „Increased long-term value" | aktuell in `TechnologySection.tsx` (2a dorthin verschoben) |
| ✅ **Pricing** | „Dynamic pricing — adjusted based on location, amenities, and time of year. Certain cancellation policies are also determined." | `PropertyManagement.tsx` Säule 1 |
| ✅ **ROI** | „Higher ROI through real-time dynamic pricing" · „Market analysis using hotel & Airbnb data" | `TechnologySection.tsx` |
| ✅ **Reporting** | „Full transparency with live dashboards" | `TechnologySection.tsx` |
| ✅ **Guaranteed Income** | „Effortless ownership with a fixed monthly payment. We lease your property long-term, guaranteeing steady income regardless of occupancy — while maintaining and improving your home." | `BusinessAreas.tsx` |
| ✍️ **Überschrift + Rahmen** | z. B. „How we improve your property's financial performance" | existiert nicht |

**Befund:** Das Material ist vollständig da — es ist nur über vier Sections
verstreut. **Neu zu schreiben ist praktisch nur die Überschrift und ein
verbindender Satz.**

Wichtig: Die fünf Ergebnisse und „Higher ROI" sitzen aktuell in der
Technologie-Section. Sie müssen dort **raus**, sonst wiederholt sich Ebene 5.

---

## Ebene 4 · Beweis — Zahlen und Objekte

> Vorgezogen vor die Technologie: erst zeigen, dass es funktioniert.

**Entsteht aus:** Stats + Projects

| | Text | Quelle |
|---|---|---|
| ✅ **Überschrift** | „A Portfolio Built on Precision & Performance" | `Stats.tsx` |
| ✅ **Zahlen** | 41 Properties Managed · 1500+ Successful Reservations · 8 Destinations · 50+ Collaborators | `Stats.tsx` — vom Besitzer bestätigt |
| ✅ **Regionen** | Spain / Costa del Sol „20+ premium properties under management" · Austria / Vienna & Carinthia | `ProjectsSection.tsx` |
| ✅ **Projekt 1** | **Villa Hoyo 19**, La Quinta Marbella — 85 % Auslastung, +120 % Umsatz, 4,9 | `ProjectsSection.tsx` |
| ✅ **Projekt 2** | **Soho Boho**, Málaga — „from €13,000 to €65,000 annual income", 92 %, +400 %, 4,8 | `ProjectsSection.tsx` |
| ✅ **Projekt 3** | **Alpine Retreat**, Kärnten — 78 %, +85 %, 4,9 | `ProjectsSection.tsx` |
| ❌ | „Before & After Photos — Coming Soon" | Platzhalter — echte Bilder oder Block weg |
| ⏳ **Testimonials** | — | kommen später vom Besitzer |

**Befund:** Diese Ebene ist inhaltlich die stärkste der Seite und braucht
**keinen neuen Text** — nur die richtige Position. „Von 13.000 € auf 65.000 €"
ist das überzeugendste Argument, das Frontier hat.

---

## Ebene 5 · Wie wir das schaffen — Technologie

> Nur noch das *Wie*. Kein Ergebnis, kein Service.

**Entsteht aus:** `TechnologySection.tsx`, weiter reduziert

| | Text | Quelle |
|---|---|---|
| ✅ **Überschrift** | „Technology That Redefines Property Management" | `TechnologySection.tsx` |
| ✅ **Rahmen** | „a fully integrated 360º software ecosystem connecting reservations, cleaning, maintenance, pricing, guest communications, and owner reporting into one seamless platform" | `TechnologySection.tsx` |
| ✅ **Proof-Punkt 1** | „Market analysis using hotel & Airbnb data" | `TechnologySection.tsx` |
| ✅ **Proof-Punkt 2** | „Automated multilingual guest communication" | `TechnologySection.tsx` |
| ✅ **Proof-Punkt 3** | „Predictive maintenance & optimized scheduling" | `TechnologySection.tsx` |
| ✅ **Proof-Punkt 4** | „Full transparency with live dashboards" | `TechnologySection.tsx` |
| ➡️ **verschieben** | „Higher ROI through real-time dynamic pricing" | gehört auf **Ebene 3** |
| ➡️ **verschieben** | die 5 „This ensures"-Ergebnisse | gehören auf **Ebene 3** |
| ❌ | „Zero operational errors thanks to smart automation" | Absolutbehauptung, kaum haltbar |

**Zu tun:** Von 6 auf 4 Punkte, Ergebnisse nach Ebene 3. Kein neuer Text.

---

## Ebene 6 · Wer dahintersteht

**Entsteht aus:** `AboutMini.tsx` — unverändert übernehmen

| | Text |
|---|---|
| ✅ **Eyebrow** | „Who looks after your property" |
| ✅ **Überschrift** | „A small team, on the ground in every region we host." |
| ✅ **Text** | „Frontier was founded because owners of exceptional homes were being offered standard management — and their guests could tell." |
| ✅ **Team** | Alejandro Marinetto Rohr · Lorenz Aschbacher · Olek · Julien |
| ✅ **Link** | „Read our story" → `/about` |

**Zu tun:** nichts. Diese Section ist fertig.

---

## Ebene 7 · Darüber hinaus

> Kompakt, sichtbar sekundär, verlinkt auf die bestehenden Unterseiten.

| | Text | Ziel |
|---|---|---|
| ✅ **Guaranteed Income** | „Effortless ownership with a fixed monthly payment…" | `/guaranteed-income` — ⚠️ **oder Ebene 3**, nicht beides |
| ✅ **Renovations & Design** | „Timeless Mediterranean interiors designed to elevate your home's value and rental performance." + „concept → construction → delivery → staging" | `/renovations` |
| ✅ **Investments** | „Curated real estate investments across Spain and Austria." + „We guide investors from acquisition to renovation and turnkey operations." | `/investments` |
| ❌ | „Business Areas" / „Comprehensive services designed to maximize your property's potential" / „Our Expertise" | Wrapper-Überschriften ohne eigene Aussage |

**Zu entscheiden:** Guaranteed Income ist ein Finanzmodell — es könnte auf
Ebene 3 stehen statt hier. Zweimal wäre eine neue Redundanz.

---

## Ebene 8 · Rechnen und sprechen

**Entsteht aus:** `PropertyEvaluator.tsx` + `OwnerCta.tsx` — beide fertig

| | Text |
|---|---|
| ✅ **Rechner** | „Property Cashflow Analysis" / „Find out your property's short term and long term rental income potential using live market data" / Button „Get Free Cash Flow Analysis" |
| ✅ **Abschluss** | „Less hassle, higher income, protected value." + „Tell us about your property and we'll walk you through what managing it with us would look like." + „Talk to us" |
| ⏳ | `mailto:` → Terminbuchung | kommt später |

**Zu tun:** nichts. Beide Sections sind fertig.

---

## Zusammenfassung: wo wirklich Arbeit liegt

| Ebene | Aufwand | Art |
|---|---|---|
| 1 · Positioning | klein | **auswählen** — 5 Varianten auf 2 reduzieren |
| 2 · Was wir übernehmen | **groß** | Säule 3 (Gäste) zurückbauen + Reporting ergänzen — **einzige Stelle mit echtem Schreibbedarf** |
| 3 · Was es bringt | mittel | Material ist da, muss eingesammelt werden; Überschrift neu |
| 4 · Beweis | klein | nur umsortieren |
| 5 · Technologie | klein | nur reduzieren |
| 6 · Team | — | fertig |
| 7 · Darüber hinaus | klein | Wrapper weg, Teaser bleiben |
| 8 · Rechnen + CTA | — | fertig |

**Von acht Ebenen brauchen zwei echten neuen Text** (Säule 3 + Überschrift der
Finanz-Ebene). Alles andere ist Auswählen, Verschieben und Streichen.

---

## Offene Entscheidungen vor dem Bauen

1. **Guaranteed Income** wird zu **„Two ways to work with us"** — ein Block, der
   beide Geschäftsmodelle nebeneinanderstellt, statt eines „Programms" mit
   „Included"-Badge. Liegt auf **Ebene 7**, direkt vor dem Abschluss: Der Leser
   hat dann alles gesehen und entscheidet, *wie* er zusammenarbeiten will.
   Formulierung darf später noch nachgeschärft werden.

   > **Full-service management** — We run the property and you earn what it
   > earns. Your income moves with the season, the market and how well the home
   > performs.
   >
   > **Guaranteed Income** — We lease the property from you and pay a fixed
   > amount every month, booked or not. You trade the strong months for
   > certainty in the weak ones.

   Wichtig: Der Satz benennt den **Tausch**. Ein Angebot ohne erkennbaren Haken
   wirkt bei einer Millionen-Immobilie entweder zu schön oder ausweichend.

2. **Positionierung führt mit** „Your home deserves more than management — it
   deserves care, strategy, and master craftsmanship." Der Boutique-Hotel-Satz
   folgt als zweiter Satz. Die drei übrigen Varianten entfallen.

3. **Dach-Überschrift ist** „We manage while you relax." · „Short-Term Rental
   Management" rutscht darunter als kleine Überschrift des Inhaltsblocks.

4. **„Before & After"-Platzhalter bleiben stehen**, bis die Bilder da sind.

## Erledigt

- **„Hybrid models"** — gestrichen. Der Halbsatz auf `/guaranteed-income`
  verwies auf ein drittes Modell, das es nicht gibt.
- **Die Detailfragen zum Guaranteed Income** (Festbetrag, Vertragsdauer,
  Kostenträger, Eigennutzung, Wechsel) werden bewusst nicht auf der Website
  beantwortet — das klärt sich im Gespräch.
