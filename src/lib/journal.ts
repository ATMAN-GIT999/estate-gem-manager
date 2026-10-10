import type { Language } from "@/lib/translations";

const LOCALES: Record<Language, string> = { EN: "en-GB", DE: "de-AT", ES: "es-ES" };

/**
 * `2026-10-12` → "12 October 2026" in the visitor's language.
 *
 * Read as UTC on both ends: a plain `new Date("2026-10-12")` is UTC midnight
 * and would print the 11th for a visitor west of Greenwich.
 */
export const formatJournalDate = (isoDate: string, language: Language) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(LOCALES[language], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
