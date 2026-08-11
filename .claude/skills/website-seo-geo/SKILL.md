---
name: website-seo-geo
description: Use whenever building or reviewing pages for an AS Intel client website regarding search visibility — page titles/meta descriptions, structured data/schema, sitemap, robots.txt, llms.txt, heading/content structure, or AI-answer-engine visibility (ChatGPT, Perplexity, Google AI Overviews). Read BEFORE writing meta tags, adding schema markup, structuring page headings/content, or setting up sitemap/robots. Bakes klassisches SEO UND GEO (Generative Engine Optimization) von Anfang an ein statt nachträglich. Triggers on: "SEO", "GEO", "Meta-Tags", "Schema", "strukturierte Daten", "Sitemap", "robots.txt", "llms.txt", "Google-Ranking", "KI-Suche", "ChatGPT Sichtbarkeit", "Local SEO".
---

# SEO & GEO für AS Intel

Hintergrund/Herleitung: `docs/strategie-state-of-the-art-websites.md` im Repo-Root. Ergänzt die Skills `website-design`, `website-conversion` und `website-stack` um die Sichtbarkeits-Dimension.

## Warum beides von Anfang an mitgedacht wird

- SEO (klassisches Google-Ranking) und GEO (Sichtbarkeit in KI-generierten Antworten: ChatGPT, Perplexity, Google AI Overviews, Gemini) sind zwei unterschiedliche, aber eng verwandte Disziplinen — eine solide technische SEO-Basis ist Voraussetzung für gute GEO.
- Die Überschneidung zwischen klassischen Top-Google-Ergebnissen und von KI zitierten Quellen liegt inzwischen unter 20 % und schrumpft weiter — SEO-Erfolg garantiert also keine GEO-Sichtbarkeit mehr. Beides muss aktiv verfolgt werden, nicht nur eins.
- Für lokale B2B-Betriebe (Immobilien, SHK, Handwerk) ist das der zuverlässigste Weg zu dauerhaft qualifizierten Anfragen ohne laufendes Werbebudget — deshalb Pflichtbestandteil jedes Projekts, nicht nachträgliche Optimierung.

## Technisches SEO-Fundament (jede Seite, jedes Projekt)

- **JSON-LD als einzige Form strukturierter Daten** (`<script type="application/ld+json">`) — kein Microdata/RDFa mehr, das ist 2026 der von Google bevorzugte Standard.
- **LocalBusiness-Schema** (oder branchenspezifischer Subtyp: `RealEstateAgent`, `HVACBusiness`, `Plumber`, `GeneralContractor` …) auf jeder relevanten Seite, mindestens mit `name`, `address`, `telephone`, `openingHoursSpecification` — plus `geo`-Koordinaten und `sameAs`-Link zum Google Business Profile.
- Mehrere Standorte: eigene LocalBusiness-Instanz pro Standortseite, konsistente NAP-Daten (Name/Adresse/Telefon identisch überall), eine zentrale `Organization`-`@id`.
- Zusätzliches Schema wo passend: `FAQPage` (deckt sich mit der FAQ-Sektion aus `website-conversion`), `BreadcrumbList`, `Review`/`AggregateRating` nur bei echten, vorhandenen Bewertungen — nie fingieren.
- **Individuelle Meta-Tags pro Seite**, nie generisch dupliziert: eindeutiger `<title>`, `meta description`, Canonical-URL, Open-Graph-/Twitter-Tags mit passendem Vorschaubild.
- **Sitemap** automatisiert beim Build generieren (im Astro-Standard-Stack: `@astrojs/sitemap`); keine toten/Preview-/Test-URLs darin.
- `robots.txt` explizit prüfen: **keine** KI-Crawler (GPTBot, PerplexityBot, ClaudeBot, Google-Extended etc.) versehentlich blockieren — sonst ist GEO von vornherein unmöglich.
- Core-Web-Vitals-Budget aus `website-stack` gilt hier doppelt: Ladezeit ist selbst ein Rankingfaktor.

## GEO — Sichtbarkeit in KI-Antworten

- **Die ersten ca. 200 Wörter jeder Seite/jedes Abschnitts beantworten die Kernfrage direkt.** KI-Systeme mit Echtzeit-Retrieval (Perplexity, Google AI Overviews) bewerten primär den Seitenanfang.
- **Konkrete, faktendichte Aussagen statt Marketing-Floskeln.** KI-Engines zitieren extrahierbare Fakten (Leistungen, Einzugsgebiet, Reaktionszeiten, Ablauf) — keine vagen Superlative wie "erstklassiger Service".
- **Content aktuell halten.** KI-Engines gewichten Aktualität; veraltete, ungepflegte Seiten verlieren gegen frischere Inhalte.
- **FAQ-Sektionen sind GEO-Gold**, weil sie Frage-Antwort-Paare in der Form liefern, die KI-Antwortmaschinen direkt extrahieren können — als `FAQPage`-Schema auszeichnen.
- **`llms.txt` als Standard-Baustein einplanen:** eine Markdown-Datei im Root (analog zu `robots.txt`, aber für LLMs), die Struktur, wichtigste Seiten und Kerninhalte des Betriebs zusammenfasst. 2026 noch kein offizieller Standard, aber wachsende Praxis bei technisch fortschrittlichen Seiten — geringer Aufwand, potenziell hoher Nutzen.
- **Original statt austauschbar:** echte, betriebsspezifische Informationen einbauen (konkrete Referenzprojekte, Einzugsgebiet, Spezialisierung) statt generischer Textbausteine — erhöht sowohl Zitierwahrscheinlichkeit bei GEO als auch Differenzierung gegen den generischen KI-Look (siehe `website-design`).

## Optionale Vertiefung: Audit-Tools

Für eine tiefere technische Prüfung (251+ Regeln über Core SEO, Performance, Structured Data, AI/GEO-Readiness, Accessibility, Security …) existieren spezialisierte CLI-Audit-Tools (z. B. `seomator`/`@seomator/seo-audit`, quelloffen auf GitHub). Nicht als Standard-Abhängigkeit in Projekte einbauen, aber bei Bedarf für eine QA-Prüfung nach Fertigstellung erwägen — ersetzt nicht die Vorgaben oben, die von Anfang an eingebaut werden.

## Vor dem Abliefern prüfen

1. Hat jede Seite individuelles Title/Description/Canonical statt Duplikaten?
2. Ist LocalBusiness-Schema (oder branchenspezifisch) vorhanden und mit echten Daten gefüllt?
3. Beantwortet der erste Absatz jeder wichtigen Seite die Kernfrage sofort?
4. Sind FAQ-Inhalte als `FAQPage`-Schema ausgezeichnet?
5. Ist sichergestellt, dass `robots.txt` keine KI-Crawler blockiert?
6. Existiert eine Sitemap ohne tote/Test-URLs?
7. `llms.txt` vorhanden oder bewusst als Nächstes eingeplant?
