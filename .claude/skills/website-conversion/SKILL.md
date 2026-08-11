---
name: website-conversion
description: Use whenever writing copy, structuring page flow, CTAs, forms, or trust signals for an AS Intel client website (Immobilien, SHK/Handwerk, lokale B2B-Dienstleister). Read BEFORE drafting hero copy, choosing CTA wording, ordering page sections, or designing a contact/lead form. Produces a conversion-oriented structure (Vertrauen aufbauen -> Einwände entkräften -> CTA) tailored to local B2B services. Triggers on: "CTA", "Conversion", "Formular", "Landingpage-Struktur", "Copy schreiben", "Leadformular", "Kontaktseite", "Vertrauenssignale", "Anfrage".
---

# Website-Conversion für AS Intel

Hintergrund/Herleitung: `docs/strategie-state-of-the-art-websites.md` im Repo-Root.

## Grundprinzip

Jede Seite hat **ein** Conversion-Ziel (Anruf, Anfrageformular, Terminbuchung, Objektanfrage, Angebot einholen). Jede Sektion arbeitet auf dieses eine Ziel hin — visuelle Selbstdarstellung ist Mittel zum Zweck, nicht das Ziel.

## Seitenstruktur-Formel

1. **Hero:** Klares Leistungsversprechen + primärer CTA sofort sichtbar (kein Scrollen nötig). Kein vages "Willkommen bei..." — konkret sagen, was der Betrieb löst.
2. **Vertrauen aufbauen:** Zertifikate, Referenzen/Kundenlogos, Erfahrung (Jahre im Geschäft, Anzahl Projekte), echte Ansprechpartner mit Foto.
3. **Leistungen konkret:** Was genau wird angeboten — spezifisch, nicht generisch ("Badsanierung, Heizungstausch, Wartung" statt "Wir bieten Komplettlösungen").
4. **Einwände entkräften:** Testimonials, Vorher-Nachher, FAQ zu typischen Bedenken (Preis, Dauer, Ablauf, Notdienst-Verfügbarkeit). FAQ zusätzlich als `FAQPage`-Schema auszeichnen (siehe Skill `website-seo-geo`) — nützt Conversion und GEO-Sichtbarkeit gleichzeitig.
5. **CTA wiederholen:** Nicht nur einmal am Seitenende — an mehreren sinnvollen Punkten (nach Leistungen, nach Testimonials, im Footer).

## CTA-Regeln

- Konkret und handlungsorientiert: "Jetzt Angebot anfragen", "Rückruf vereinbaren", "Notdienst anrufen" — nicht nur "Mehr erfahren" oder "Kontakt".
- CTA-Wortlaut passend zur Dringlichkeit: SHK-Notdienst braucht andere CTA-Priorität ("Jetzt anrufen" oben rechts, immer sichtbar) als eine Immobilien-Objektseite ("Besichtigung anfragen").
- Telefonnummern immer als `tel:`-Link, auf Mobile besonders prominent (Klick-zum-Anrufen ist bei diesen Zielgruppen oft die Hauptconversion).

## Formular-Prinzipien

- So wenig Pflichtfelder wie möglich (Name, Telefon/E-Mail, kurze Nachricht reichen meist — jedes zusätzliche Feld kostet Abschlussquote).
- Bei Immobilien: Objektbezug automatisch mitgeben (welches Objekt wurde angefragt), Exposé-Download als Lead-Magnet erwägen.
- Bei SHK/Handwerk: Dringlichkeits-Auswahl erwägen (Notfall vs. Terminanfrage), da das die Priorisierung beim Betrieb erleichtert und dem Nutzer zeigt, dass er ernst genommen wird.
- Bestätigung nach Absenden immer mit konkreter Erwartungshaltung ("Wir melden uns innerhalb von X Stunden"), nicht nur "Danke".

## Vertrauenssignale

- Zertifikate/Innungen/Gütesiegel sichtbar plazieren (nicht im Footer verstecken).
- Echte Kundenstimmen mit Name/Ort statt anonymer Sternebewertungen ohne Kontext.
- Referenzprojekte mit Bild, wenn vorhanden — konkreter als Textbeschreibung.

## Lokales SEO (wirkt direkt auf Conversion, da Auffindbarkeit vorausgeht)

- NAP-Konsistenz (Name, Adresse, Telefonnummer identisch auf Website, Google Business Profile, Branchenverzeichnissen).
- Schema.org-Markup passend zur Branche (`LocalBusiness`, `RealEstateAgent`, `HVACBusiness` o. ä.).
- Standortbezug im Content (Stadt/Region explizit nennen, nicht nur "in Ihrer Nähe").

## Vor dem Abliefern prüfen

1. Ist auf jeder Unterseite eindeutig, welche eine Aktion der Besucher als Nächstes ausführen soll?
2. Ist die Telefonnummer/das Formular ohne Scrollen oder nach minimalem Scrollen erreichbar?
3. Werden branchentypische Einwände (Preis, Vertrauen, Dringlichkeit) aktiv adressiert statt ignoriert?
4. Passt der CTA-Ton zur Dringlichkeit der Branche (Notdienst vs. Beratungstermin)?
