import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CookieConsent = "accepted" | "rejected";

const STORAGE_KEY = "cookie_consent";

interface CookieConsentContextValue {
  /** null until the visitor has made a choice — analytics stays off until then. */
  consent: CookieConsent | null;
  /** Whether the banner should currently be rendered. */
  showBanner: boolean;
  accept: () => void;
  reject: () => void;
  /** Re-opens the banner so a returning visitor can change an earlier choice
   * (used by the "Cookie settings" links in the footer and Aviso Legal). */
  openSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    } else {
      setShowBanner(true);
    }
  }, []);

  const decide = (value: CookieConsent) => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    setShowBanner(false);
  };

  const value: CookieConsentContextValue = {
    consent,
    showBanner,
    accept: () => decide("accepted"),
    reject: () => decide("rejected"),
    openSettings: () => setShowBanner(true),
  };

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  return ctx;
};
