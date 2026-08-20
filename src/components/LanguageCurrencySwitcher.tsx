import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocale, type Language, type Currency } from "@/contexts/LocaleContext";

const LANGUAGES: Language[] = ["EN", "DE", "ES"];
const CURRENCIES: Currency[] = ["EUR", "USD", "GBP"];

interface LanguageCurrencySwitcherProps {
  /** Site-wide header shows language + currency; Property Management shows language only. */
  showCurrency?: boolean;
  /**
   * "dropdown" (default) — closed pill showing only the active selection,
   * opens a panel to change it. Used everywhere.
   * "inline" — every language shown at once, dot-separated, no panel to
   * open. Only the Property Management header uses this (its own reference
   * screenshot shows "EN · DE · FR · ES · PT" always fully visible).
   */
  variant?: "dropdown" | "inline";
  /** "sm" reads deliberately quieter than the "Book a Stay" CTA next to it —
   * the contrast the OmniVillas reference header uses between its outlined
   * utility pill and its solid dark button. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * The OmniVillas pattern: a closed pill showing only the *active* selection
 * (never the full option list), that opens into a small panel with one chip
 * row per choice. Transparent/outlined rather than filled, on Almedin's
 * request, even though the site's CTAs are otherwise solid gold.
 *
 * Reads/writes `LocaleContext`, so the selection here is the same selection
 * `PropertyCard`/`PropertyDetail` read to convert displayed prices — but
 * there is still no real i18n system wired up. Picking "DE" changes what
 * this component itself reports; it does not yet translate page copy
 * anywhere else. That's a separate, considerably larger piece of work,
 * pending Almedin confirming its scope.
 */
const LanguageCurrencySwitcher = ({ showCurrency = false, variant = "dropdown", size = "md", className }: LanguageCurrencySwitcherProps) => {
  const { language, setLanguage, currency, setCurrency } = useLocale();
  const [open, setOpen] = useState(false);
  const compact = size === "sm";

  const chipClass = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border text-foreground hover:border-primary/40",
    );

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-primary-foreground/30 text-primary-foreground",
          compact ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm",
          className,
        )}
      >
        {LANGUAGES.map((lang, i) => (
          <span key={lang} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-primary-foreground/40">·</span>}
            <button
              type="button"
              onClick={() => setLanguage(lang)}
              className={cn(
                "transition-colors",
                lang === language ? "font-semibold text-primary-foreground" : "text-primary-foreground/60 hover:text-primary-foreground",
              )}
            >
              {lang}
            </button>
          </span>
        ))}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "rounded-full border border-primary-foreground/30 text-primary-foreground transition-colors hover:border-primary-foreground/60",
            compact ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm",
            className,
          )}
        >
          {showCurrency ? `${language} · ${currency}` : language}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="z-[70] w-64 p-4">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wide text-accent-strong mb-2">
            Language
          </span>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={chipClass(lang === language)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {showCurrency && (
          <>
            <div className="my-3 border-t border-border" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-accent-strong mb-2">
                Currency
              </span>
              <div className="flex flex-wrap gap-2">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={chipClass(curr === currency)}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Prices shown in other currencies are indicative — every stay is billed in EUR.
            </p>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default LanguageCurrencySwitcher;
