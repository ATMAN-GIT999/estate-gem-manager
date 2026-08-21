---
name: website-design
description: Use whenever designing or building UI, layout, typography, color, imagery, or motion for an AS Intel client website (Immobilien, SHK/Handwerk, lokale B2B-Dienstleister). Read BEFORE choosing fonts, hero layout, component styling, or animation. Produces premium-but-restrained design decisions calibrated for trust-building local B2B clients — explicitly NOT Awwwards/3D-spectacle level. Triggers on: "Website gestalten", "Hero-Section", "Landingpage-Layout", "Typografie", "Farbschema", "Kundenwebsite", "Immobilien-Website", "SHK-Website", "Handwerker-Website", "Design-System".
---

# Website-Design für AS Intel

Hintergrund/Herleitung: `docs/strategie-state-of-the-art-websites.md` im Repo-Root.

## Formel

**Premium + performant + conversion-orientiert.** Nicht "State of the Art"/Awwwards-Niveau (kein 3D, kein WebGL, keine Shader, keine experimentelle Navigation) — die Zielkundschaft (Immobilienunternehmen, SHK-Betriebe, Handwerk, lokale Dienstleister) braucht Seriosität und Vertrauen, keine Kunstinstallation.

Stilreferenz: [csaw.at](https://www.csaw.at/de) — klare Typografie mit bewusster Hierarchie, echte Fotografie aus dem Betrieb, Vertrauenssignale (Zertifikate/Gütesiegel) prominent, klare wiederkehrende CTAs, Testimonials + FAQ, aufgeräumtes aber nicht langweiliges Layout.

## Typografie

- Maximal 2 Schriftfamilien (eine für Headlines, ggf. eine zweite für Fließtext — oft reicht eine Familie in mehreren Schnitten).
- Bewusste Größenhierarchie: Headlines deutlich größer als Standard-Templates (Selbstbewusstsein zeigen), aber Lesbarkeit im Fließtext hat Vorrang vor Experiment.
- Keine Systemfont-Defaults (Arial/Helvetica ungestylt) — das ist das deutlichste Signal für "generische Website".

## Farbe & Kontrast

- Eine klare Markenfarbe + neutrale Basis (nicht mehr als 1 Akzentfarbe zusätzlich) statt bunter Gradient-Blobs.
- Kontrast immer barrierefrei prüfen (WCAG AA mindestens), gerade bei CTA-Buttons.
- Kein "generisches SaaS-Lila/Blau-Gradient" — das ist der klassische KI-Website-Tell.

## Layout

- Bewusste, asymmetrische Sektionsgestaltung statt immer zentriertem Standard-Grid — aber Lesbarkeit und klare Leserichtung haben Vorrang vor Verspieltheit.
- Jede Sektion hat einen klaren Zweck (siehe Skill `website-conversion` für die Reihenfolge). Keine beliebig austauschbaren Sektionen.
- Weißraum bewusst einsetzen — knapp wirkende Layouts wirken günstig.

## Bildsprache

- Echte Fotografie/Video vom Kunden (Team, Baustelle, Objekt, Werkstatt) hat immer Vorrang vor Stockfotos.
- Wenn kein Kundenmaterial vorhanden ist: das explizit als offene Aufgabe an den Kunden zurückspielen, nicht mit generischen Stock-Klischees (Handschlag-Fotos, austauschbare Business-Meetings) auffüllen.
- Icons: falls nötig, konsistentes Set statt gemischter Icon-Stile.

## Bewegung/Motion

- **Lenis als Standard** für weiches Scroll-Gefühl auf jeder Seite.
- **GSAP dezent** für funktionale Übergänge (Elemente faden/verschieben sich beim Einscrollen leicht, Hover-Feedback) — keine choreografierten Show-Sequenzen.
- **Kein Three.js/WebGL/3D als Standard.** Nur bei explizitem Kundenwunsch und entsprechendem Budget (siehe `website-stack`).
- `prefers-reduced-motion` immer respektieren (technische Umsetzung siehe `website-stack`).
- Faustregel: Wenn eine Animation keinen Zweck hat (Bedeutung/Feedback/Orientierung), fliegt sie raus.

## Anti-Patterns: "generischer KI-Website-Look" — aktiv vermeiden

Warum das passiert: KI-Tools sagen statistisch wahrscheinliche Muster voraus, nicht Originalität. Ohne explizite Vorgaben liefern sie den "Durchschnitt" ihrer Trainingsdaten — deshalb sehen unstrukturiert erzeugte Websites austauschbar aus. Diese Skills sind genau die expliziten Vorgaben, die das verhindern.

Konkrete Tells, aktiv vermeiden:

- **Typografie:** Inter (oder vergleichbarer Standard-Sans) komplett ungestylt als einzige Schrift — Signal, dass Typografie nie bewusst gestaltet wurde. Stattdessen: eine markante Headline-Schrift + eine gut lesbare Fließtext-Schrift, bewusst gewählt.
- **Farbe:** "Lila-Blau-Gradient-Syndrom" in Hero/Buttons/Akzenten — gewählt aus statistischer Sicherheit, nicht aus Markenbedeutung. Stattdessen: semantisches Farbsystem mit klaren, funktionalen Rollen (Primäraktion, Erfolg, Warnung) statt Dekoration.
- **Komponenten:** identische Border-Radien (z. B. überall pauschal 16px) und identisches Padding (z. B. überall pauschal 24px) an jedem Element — erzeugt flache, uniforme Hierarchie ohne Absicht. Stattdessen: bewusst unterschiedliche Abstufungen je nach Elementgewicht.
- **Hero-Sections:** riesiger, zentrierter Hero mit vager Aussage ("Die Zukunft gestalten") statt konkretem Leistungsversprechen.
- **Layout:** Card-Grids für alles, beliebig viele gleich aussehende "Feature-Cards" ohne Priorisierung.
- **Bilder:** Stockfotos mit unrealistisch gut ausgeleuchteten Büros/Handschlag-Szenen, oder KI-generierte Illustrationen, die "zu glatt, zu symmetrisch, leicht plastikhaft" wirken.
- **Bewegung:** komplett fehlende Mikro-Interaktionen, Buttons die abrupt "snappen" statt sanft einzublenden ("ease" statt "snap"), oder umgekehrt uniforme Fade-ins auf jedem Element ohne Unterschied.
- **Copy:** vage, hedgende Sprache ("kann helfen", "könnte eventuell"), generische Superlative ("erstklassig", "innovativste Lösung") — grammatisch korrekt, aber komplett vergessbar.
- Icon-Sets, die stilistisch nicht zueinander passen.

**Praxis-Test vor dem Abliefern:** Würde *dieser konkrete Kunde* (der Immobilienmakler, der SHK-Betrieb) diesen Satz tatsächlich so sagen? Wenn die Antwort "das könnte jede Konkurrenzseite auch behaupten" lautet, ist der Text zu generisch.

## Vor dem Abliefern prüfen

1. Sieht die Seite aus wie *dieser* Kunde, oder könnte sie 1:1 für jeden Wettbewerber stehen?
2. Wirkt jede Bewegung zweckgebunden?
3. Ist die Typografie-/Farbentscheidung bewusst getroffen oder Default geblieben?
4. Würde die Seite neben csaw.at als seriös und hochwertig bestehen?
