import { createContext, useContext, useState, type ReactNode } from "react";
import { dictionaries, type Language, type TranslationKey } from "@/lib/translations";

export type { Language };
export type Currency = "EUR" | "USD" | "GBP";

/**
 * Static and approximate — set 2026-08-20, not live-updated. A real rate
 * feed (a Supabase edge function calling an FX API, cached) would be the
 * correct long-term source; this is the smaller, honest stopgap for a
 * clearly-labelled "indicative" price, not something to trust for anything
 * that gets charged. `price_per_night` itself, Stripe and the Guesty quote
 * flow are all untouched and stay EUR-only regardless of this setting.
 */
const EUR_RATES: Record<Currency, number> = { EUR: 1, USD: 1.08, GBP: 0.85 };
const CURRENCY_SYMBOLS: Record<Currency, string> = { EUR: "€", USD: "$", GBP: "£" };

interface LocaleContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencySymbol: string;
  /** EUR amount → the selected display currency, rounded up (matches the
   * existing "from €X" display convention). Display only — never use this
   * for a value that gets booked or charged. */
  convertPrice: (amountEur: number) => number;
  /** Looks up `key` in the current language's dictionary (src/lib/translations.ts),
   * falling back to the English source string if a translation is missing. */
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("EN");
  const [currency, setCurrency] = useState<Currency>("EUR");

  const value: LocaleContextValue = {
    language,
    setLanguage,
    currency,
    setCurrency,
    currencySymbol: CURRENCY_SYMBOLS[currency],
    convertPrice: (amountEur) => Math.ceil(amountEur * EUR_RATES[currency]),
    t: (key) => dictionaries[language][key] ?? dictionaries.EN[key],
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
};
