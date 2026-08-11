import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [avisoLegalLink, setAvisoLegalLink] = useState("Aviso Legal");
  const [copyright, setCopyright] = useState("Frontier Residences. All rights reserved.");

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
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

          <div>
            <EditableText
              id="footer-services-title"
              value={servicesTitle}
              onChange={setServicesTitle}
              as="h4"
              className="font-semibold mb-4 text-lg"
            >
              {servicesTitle}
            </EditableText>
            <ul className="space-y-2">
              <li>
                <Link to="/business-areas" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
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
                <Link to="/business-areas" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
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
                <Link to="/business-areas" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
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
                <Link to="/business-areas" className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent-on-primary transition-colors">
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
              className="font-semibold mb-4 text-lg"
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
              className="font-semibold mb-4 text-lg"
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