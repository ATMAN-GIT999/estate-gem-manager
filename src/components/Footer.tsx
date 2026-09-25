import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Container } from "./layout";
import { BUSINESS } from "@/lib/siteMeta";
import logo from "@/assets/frontier-logo-transparent.webp";
import { useLocale } from "@/contexts/LocaleContext";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

/**
 * The footer, on ink rather than the sage green it used to carry.
 *
 * Three columns split by audience — guests, owners, company — because the
 * whole site's architecture rests on that split, and the footer was the one
 * place that still mixed the two. The band above it (owner bridge on the
 * landing page, contact form on the owner page) fades a photograph to exactly
 * this ink, so the two meet with no visible seam. No gold rule between them
 * for that reason: a line there would put back the join the fade removes.
 */

const SOCIAL_LINKS: { label: string; href: string; Icon: typeof Instagram }[] = [
  { label: "Instagram", href: "https://www.instagram.com/frontier.residences/", Icon: Instagram },
];

const Footer = () => {
  const { t, language } = useLocale();
  const { openSettings } = useCookieConsent();

  const [positioning, setPositioning] = useState(t("footer-positioning"));
  const [guestsTitle, setGuestsTitle] = useState(t("footer-guests-title"));
  const [ownersTitle, setOwnersTitle] = useState(t("footer-owners-title"));
  const [companyTitle, setCompanyTitle] = useState(t("footer-company-title"));
  const [copyright, setCopyright] = useState(t("footer-copyright"));
  // Must stay identical to the Aviso Legal and the Google Business Profile —
  // local search reads a mismatched number as two different businesses.
  const [phone, setPhone] = useState("+34 649 429 678");

  useEffect(() => {
    setPositioning(t("footer-positioning"));
    setGuestsTitle(t("footer-guests-title"));
    setOwnersTitle(t("footer-owners-title"));
    setCompanyTitle(t("footer-company-title"));
    setCopyright(t("footer-copyright"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const linkClass =
    "inline-block py-1.5 t-body text-ink-foreground/70 hover:text-accent-on-primary transition-colors";

  const guestLinks = [
    { label: t("footer-all-homes-link"), to: "/properties" },
    { label: t("footer-costa-link"), to: "/properties?location=Costa%20del%20Sol" },
    { label: t("footer-austria-link"), to: "/properties?location=Austria" },
    { label: t("footer-faq-link"), to: "/#faq" },
    { label: t("footer-signin-link"), to: "/auth" },
  ];

  const ownerLinks = [
    { label: t("footer-pm-link"), to: "/property-management" },
    { label: t("footer-earn-link"), to: "/evaluate" },
    { label: t("footer-gi-link"), to: "/guaranteed-income" },
    { label: t("footer-renovations-link"), to: "/renovations" },
    { label: t("footer-investments-link"), to: "/investments" },
  ];

  const companyLinks = [
    { label: t("footer-about-link"), to: "/about" },
    { label: t("footer-projects-link"), to: "/projects" },
    { label: t("footer-aviso-legal-link"), to: "/aviso-legal" },
  ];

  return (
    // `pb-24` below `sm:`: the floating WhatsApp button is fixed to the
    // viewport's bottom-right, and on a narrow screen scrolled to the true
    // page end its 56px circle sits over the centred copyright line.
    <footer className="bg-ink text-ink-foreground pt-2xl pb-24 sm:pb-xl">
      <Container>
        <div className="grid gap-lg md:grid-cols-12">
          {/* The full lockup (monogram + "Frontier Residences" + tagline)
              lives in one image — a separate hand-typed wordmark beside it
              at the old 44px height just duplicated text the logo already
              carries, illegibly small. At half the column's width the
              logo's own type is what reads, so the duplicate is gone. */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <img
                src={logo}
                alt="Frontier Residences — Bespoke Property Management"
                width={1640}
                height={586}
                loading="lazy"
                className="w-1/2 min-w-[220px] h-auto brightness-0 invert opacity-90"
              />
            </Link>
            <EditableText
              id="footer-positioning"
              value={positioning}
              onChange={setPositioning}
              as="p"
              multiline
              className="t-body text-ink-foreground/60 max-w-xs"
            >
              {positioning}
            </EditableText>
          </div>

          <div className="md:col-span-8 grid gap-lg sm:grid-cols-3">
            <div>
              <EditableText
                id="footer-guests-title"
                value={guestsTitle}
                onChange={setGuestsTitle}
                as="h2"
                className="t-tag text-accent-on-primary mb-3"
              >
                {guestsTitle}
              </EditableText>
              <ul>
                {guestLinks.map(({ label, to }) => (
                  <li key={label}>
                    {to.startsWith("/#") ? (
                      <a href={to} className={linkClass}>
                        {label}
                      </a>
                    ) : (
                      <Link to={to} className={linkClass}>
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <EditableText
                id="footer-owners-title"
                value={ownersTitle}
                onChange={setOwnersTitle}
                as="h2"
                className="t-tag text-accent-on-primary mb-3"
              >
                {ownersTitle}
              </EditableText>
              <ul>
                {ownerLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <EditableText
                id="footer-company-title"
                value={companyTitle}
                onChange={setCompanyTitle}
                as="h2"
                className="t-tag text-accent-on-primary mb-3"
              >
                {companyTitle}
              </EditableText>
              <ul>
                {companyLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={openSettings} className={linkClass}>
                    {t("footer-cookie-settings-link")}
                  </button>
                </li>
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className={linkClass}>
                    <EditableText id="footer-phone" value={phone} onChange={setPhone} as="span">
                      {phone}
                    </EditableText>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-2xl flex flex-col sm:flex-row items-center justify-between gap-3 t-body text-ink-foreground/45">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <EditableText id="footer-copyright" value={copyright} onChange={setCopyright} as="span">
              {copyright}
            </EditableText>{" "}
            · {BUSINESS.city}
          </p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Frontier Residences on ${label}`}
                className="inline-flex items-center gap-2 hover:text-accent-on-primary transition-colors"
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
