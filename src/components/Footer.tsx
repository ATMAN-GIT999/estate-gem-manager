import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Container } from "./layout";
import { BUSINESS } from "@/lib/siteMeta";
import logo from "@/assets/frontier-logo-transparent.webp";

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

const Footer = () => {
  const [tagline, setTagline] = useState("Bespoke property management and investment solutions for exclusive properties.");
  const [email, setEmail] = useState("Hello@frontier-residences.com");
  // Must stay identical to the number in the Aviso Legal and the Google
  // Business Profile — local search treats a mismatched phone number as a
  // signal that it is looking at two different businesses.
  const [phone, setPhone] = useState("+34 649 429 678");
  const [companyName, setCompanyName] = useState("Frontier Residences");
  const [servicesTitle, setServicesTitle] = useState("Services");
  const [companyTitle, setCompanyTitle] = useState("Company");
  const [contactTitle, setContactTitle] = useState("Contact");
  const [pmLink, setPmLink] = useState("Property Management");
  const [giLink, setGiLink] = useState("Guaranteed Income");
  const [renovationsLink, setRenovationsLink] = useState("Renovations");
  const [investmentsLink, setInvestmentsLink] = useState("Investments");
  const [aboutLink, setAboutLink] = useState("About Us");
  const [projectsLink, setProjectsLink] = useState("Projects");
  const [evalLink, setEvalLink] = useState("Property Evaluation");
  const [faqLink, setFaqLink] = useState("FAQ");
  const [avisoLegalLink, setAvisoLegalLink] = useState("Aviso Legal");
  // Must stay identical to the Aviso Legal and the Google Business Profile,
  // for the same reason as the phone number above.
  const [address, setAddress] = useState(`${BUSINESS.street}, ${BUSINESS.postalCode} ${BUSINESS.city}`);
  const [copyright, setCopyright] = useState("Frontier Residences. All rights reserved.");

  return (
    // `edge-gold-top` rather than the `border-t-2 border-accent` this used to
    // carry: the footer is one of three green/light seams on the site
    // (portfolio numbers, the differentiation band, here) and §24 only works
    // if all three are the same line. A 2px version here and a 1px version
    // above read as two different ideas.
    <footer className="bg-primary text-primary-foreground edge-gold-top py-lg">
      <Container>
        <div className="grid md:grid-cols-4 gap-md mb-lg">
          <div>
            <EditableText
              id="footer-company-name"
              value={companyName}
              onChange={setCompanyName}
              /* The brand mark, not an outline node. As an <h3> it was the one
                 heading on the page carrying a different size from every other
                 h3, because it is not the same kind of thing. */
              as="p"
              className="t-block mb-4"
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
            {/* Matches the header logo's own height exactly (h-12 md:h-14) —
                it was a flat h-12 before, which read small next to a footer
                carrying four columns of its own weight. */}
            <img src={logo} alt="Frontier Residences" className="h-12 md:h-14 mt-6" />
          </div>

          <div>
            <EditableText
              id="footer-services-title"
              value={servicesTitle}
              onChange={setServicesTitle}
              as="h4"
              className="t-item mb-4"
            >
              {servicesTitle}
            </EditableText>
            {/* Each of these four used to point at `/business-areas` — one
                orphaned, out-of-date page (docs/PROJECT.md D2) standing in
                for four actual destinations. Now each links to the real page
                it names. */}
            <ul className="space-y-2">
              <li>
                <Link to="/property-management" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-pm-link"
                    value={pmLink}
                    onChange={setPmLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {pmLink}
                  </EditableText>
                </Link>
              </li>
              <li>
                <Link to="/guaranteed-income" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-gi-link"
                    value={giLink}
                    onChange={setGiLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {giLink}
                  </EditableText>
                </Link>
              </li>
              <li>
                <Link to="/renovations" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-renovations-link"
                    value={renovationsLink}
                    onChange={setRenovationsLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {renovationsLink}
                  </EditableText>
                </Link>
              </li>
              <li>
                <Link to="/investments" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-investments-link"
                    value={investmentsLink}
                    onChange={setInvestmentsLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {investmentsLink}
                  </EditableText>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <EditableText
              id="footer-company-title"
              value={companyTitle}
              onChange={setCompanyTitle}
              as="h4"
              className="t-item mb-4"
            >
              {companyTitle}
            </EditableText>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-about-link"
                    value={aboutLink}
                    onChange={setAboutLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {aboutLink}
                  </EditableText>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-projects-link"
                    value={projectsLink}
                    onChange={setProjectsLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {projectsLink}
                  </EditableText>
                </Link>
              </li>
              <li>
                <Link to="/evaluate" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-eval-link"
                    value={evalLink}
                    onChange={setEvalLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {evalLink}
                  </EditableText>
                </Link>
              </li>
              <li>
                <Link to="/property-management#faq" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-faq-link"
                    value={faqLink}
                    onChange={setFaqLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {faqLink}
                  </EditableText>
                </Link>
              </li>
              <li>
                <Link to="/aviso-legal" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
                  <EditableText
                    id="footer-aviso-legal-link"
                    value={avisoLegalLink}
                    onChange={setAvisoLegalLink}
                    as="span"
                    className="text-primary-foreground/80"
                  >
                    {avisoLegalLink}
                  </EditableText>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <EditableText
              id="footer-contact-title"
              value={contactTitle}
              onChange={setContactTitle}
              as="h4"
              className="t-item mb-4"
            >
              {contactTitle}
            </EditableText>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
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
                <Phone className="w-4 h-4" />
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
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <EditableText
                  id="footer-address"
                  value={address}
                  onChange={setAddress}
                  as="span"
                  className="text-primary-foreground/80"
                >
                  {address}
                </EditableText>
              </li>
            </ul>
            {/* w-4 h-4, no padding on the anchor: the contact list above uses
                16px icons flush with the column's left edge. The old w-5 h-5
                plus p-1.5 wrapper made the Instagram mark both bigger and
                offset from that edge, which is the "schief" (crooked)
                Almedin flagged — it wasn't crooked, it just wasn't aligned to
                its own column. */}
            <div className="flex gap-4 mt-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Frontier Residences on ${label}`}
                  className="inline-block text-primary-foreground/80 hover:text-accent-on-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-md text-center text-primary-foreground/60">
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
      </Container>
    </footer>
  );
};

export default Footer;