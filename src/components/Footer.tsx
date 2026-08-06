import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import EditableText from "./admin/EditableText";

/**
 * Only networks with a real profile are rendered. Facebook and LinkedIn are
 * listed here so adding them later is a one-line change — until then they stay
 * out of the markup rather than linking to "#", which reads as a broken link.
 */
const SOCIAL_LINKS: { label: string; href: string; Icon: typeof Instagram }[] = [
  { label: "Instagram", href: "https://www.instagram.com/frontier.residences/", Icon: Instagram },
  // { label: "Facebook", href: "", Icon: Facebook },
  // { label: "LinkedIn", href: "", Icon: Linkedin },
];

type FooterLink = { id: string; label: string; to: string };
type FooterColumn = { id: string; title: string; links: FooterLink[] };

/**
 * The footer mirrors the header, which is not decoration: the header's
 * dropdown panels only exist in the DOM once someone hovers them, so this is
 * the path a crawler actually walks to reach /properties, /property-management
 * and the evaluator. Every destination in the header appears here as a plain
 * link, and anything added to one belongs in the other.
 *
 * It also carries the pages that hang off the owner branch — Guaranteed
 * Income, Renovations, Investments — which is the whole reason they are
 * reachable without loading detail into either main scroll.
 */
const INITIAL_COLUMNS: FooterColumn[] = [
  {
    id: "footer-rental-title",
    title: "Vacation Rental",
    links: [
      { id: "footer-properties-link", label: "All properties", to: "/properties" },
      { id: "footer-faq-link", label: "Guest questions", to: "/#faq" },
    ],
  },
  {
    id: "footer-services-title",
    title: "Property Management",
    links: [
      { id: "footer-pm-link", label: "Property management", to: "/property-management" },
      {
        id: "footer-eval-link",
        label: "Property evaluator",
        to: "/property-management#property-evaluation",
      },
      { id: "footer-gi-link", label: "Guaranteed income", to: "/guaranteed-income" },
      { id: "footer-renovations-link", label: "Renovations", to: "/renovations" },
      { id: "footer-investments-link", label: "Investments", to: "/investments" },
    ],
  },
  {
    id: "footer-company-title",
    title: "Company",
    links: [
      { id: "footer-about-link", label: "About us", to: "/about" },
      { id: "footer-projects-link", label: "Projects", to: "/projects" },
      { id: "footer-portal-link", label: "Homeowner portal", to: "/auth" },
      { id: "footer-aviso-legal-link", label: "Aviso Legal", to: "/aviso-legal" },
    ],
  },
];

const LINK_CLASS =
  "inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors";

/**
 * Module scope on purpose: defined inside Footer this would be a new component
 * type on every render, so an EditableText would lose focus after each
 * keystroke in admin edit mode.
 */
const FooterNavLink = ({
  link,
  onAnchorClick,
  onChange,
}: {
  link: FooterLink;
  onAnchorClick: (anchor: string) => (e: React.MouseEvent) => void;
  onChange: (value: string) => void;
}) => {
  const label = (
    <EditableText
      id={link.id}
      value={link.label}
      onChange={onChange}
      as="span"
      className="text-primary-foreground/80"
    >
      {link.label}
    </EditableText>
  );

  // Landing-page anchors need the scroll handler; everything else is a route.
  if (link.to.startsWith("/#")) {
    const anchor = link.to.slice(2);
    return (
      <li>
        <a href={link.to} onClick={onAnchorClick(anchor)} className={LINK_CLASS}>
          {label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link to={link.to} className={LINK_CLASS}>
        {label}
      </Link>
    </li>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Scroll if we are already on the landing page, otherwise navigate there and
   * let Index's hash effect do the scrolling once it has mounted.
   */
  const handleAnchorClick = (anchor: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${anchor}`);
    }
  };

  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [tagline, setTagline] = useState(
    "Bespoke property management and investment solutions for exclusive properties."
  );
  const [email, setEmail] = useState("Hello@frontier-residences.com");
  const [phone, setPhone] = useState("+34 665 51 18 53");
  const [companyName, setCompanyName] = useState("Frontier Residences");
  const [contactTitle, setContactTitle] = useState("Contact");
  const [copyright, setCopyright] = useState("Frontier Residences. All rights reserved.");

  const updateColumnTitle = (columnIndex: number, value: string) => {
    const next = [...columns];
    next[columnIndex] = { ...next[columnIndex], title: value };
    setColumns(next);
  };

  const updateLinkLabel = (
    columnIndex: number,
    linkIndex: number,
    value: string
  ) => {
    const next = [...columns];
    const links = [...next[columnIndex].links];
    links[linkIndex] = { ...links[linkIndex], label: value };
    next[columnIndex] = { ...next[columnIndex], links };
    setColumns(next);
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <div>
            <EditableText
              id="footer-company-name"
              value={companyName}
              onChange={setCompanyName}
              as="h3"
              className="font-playfair text-2xl font-bold mb-4"
            >
              {companyName}
            </EditableText>
            <EditableText
              id="footer-tagline"
              value={tagline}
              onChange={setTagline}
              as="p"
              multiline
              className="text-primary-foreground/80 leading-relaxed"
            >
              {tagline}
            </EditableText>
          </div>

          {columns.map((column, columnIndex) => (
            <div key={column.id}>
              <EditableText
                id={column.id}
                value={column.title}
                onChange={(v) => updateColumnTitle(columnIndex, v)}
                as="h4"
                className="font-semibold mb-4 text-lg"
              >
                {column.title}
              </EditableText>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <FooterNavLink
                    key={link.id}
                    link={link}
                    onAnchorClick={handleAnchorClick}
                    onChange={(v) => updateLinkLabel(columnIndex, linkIndex, v)}
                  />
                ))}
              </ul>
            </div>
          ))}

          <div>
            <EditableText
              id="footer-contact-title"
              value={contactTitle}
              onChange={setContactTitle}
              as="h4"
              className="font-semibold mb-4 text-lg"
            >
              {contactTitle}
            </EditableText>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4 shrink-0" />
                <EditableText
                  id="footer-email"
                  value={email}
                  onChange={setEmail}
                  as="span"
                  className="text-primary-foreground/80"
                >
                  {email}
                </EditableText>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4 shrink-0" />
                <EditableText
                  id="footer-phone"
                  value={phone}
                  onChange={setPhone}
                  as="span"
                  className="text-primary-foreground/80"
                >
                  {phone}
                </EditableText>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Frontier Residences on ${label}`}
                  className="inline-block p-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <EditableText
              id="footer-copyright"
              value={copyright}
              onChange={setCopyright}
              as="span"
            >
              {copyright}
            </EditableText>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
