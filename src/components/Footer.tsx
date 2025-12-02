import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">Frontier Residences</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Bespoke property management and investment solutions for exclusive properties.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business-areas" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Property Management
                </Link>
              </li>
              <li>
                <Link to="/business-areas" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Guaranteed Income
                </Link>
              </li>
              <li>
                <Link to="/business-areas" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Renovations
                </Link>
              </li>
              <li>
                <Link to="/business-areas" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Investments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/evaluate" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Property Evaluation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                Hello@frontier-residences.com
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                +34 665 51 18 53
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Frontier Residences. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
