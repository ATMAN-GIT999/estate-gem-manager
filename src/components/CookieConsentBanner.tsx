import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Gates the one piece of tracking the site actually does — the page_view
 * insert in Index.tsx — behind an explicit choice, and lets that choice be
 * revisited from the footer or Aviso Legal. Never shown in the admin area:
 * consent is a guest-facing concern, and an admin is authenticated already.
 */
const CookieConsentBanner = () => {
  const { pathname } = useLocation();
  const { showBanner, accept, reject } = useCookieConsent();
  const { t } = useLocale();

  if (pathname.startsWith("/admin") || !showBanner) return null;

  return (
    <div
      role="region"
      aria-label={t("cookie-banner-aria")}
      className="fixed inset-x-0 bottom-0 z-[60] bg-primary text-primary-foreground edge-gold-top animate-in slide-in-from-bottom-8 fade-in duration-300"
    >
      <Container className="py-md flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="t-body text-primary-foreground/90 sm:pr-8">
          {t("cookie-banner-text")}{" "}
          {/* A plain <a>, not <Link>: this jumps across routes to a hash
              (matches the footer's FAQ/Beyond Management links) so the
              browser does its own real navigation and scrolls to #cookies —
              a client-side route change never does that on its own. */}
          <a
            href="/aviso-legal#cookies"
            className="underline underline-offset-2 hover:text-accent-on-primary"
          >
            {t("cookie-learn-more")}
          </a>
        </p>
        <div className="flex gap-sm shrink-0">
          <Button
            variant="outline"
            onClick={reject}
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            {t("cookie-reject")}
          </Button>
          <Button onClick={accept} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {t("cookie-accept")}
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default CookieConsentBanner;
