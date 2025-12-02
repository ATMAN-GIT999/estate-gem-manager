import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/frontier-logo.png";

const GUESTY_BOOKING_URL = "https://booking.guesty.com/properties?brandId=67471cfce5b88600014f0647";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEvaluationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on homepage, scroll to section
      const element = document.getElementById("property-evaluation");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to homepage with hash
      navigate("/#property-evaluation");
    }
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/business-areas", label: "Our Business Areas" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logo} alt="Frontier Residences" className="h-12 md:h-14" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-primary-foreground hover:text-secondary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={GUESTY_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-secondary transition-colors font-medium inline-flex items-center gap-1"
            >
              Book Your Stay
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleEvaluationClick}
              className="text-primary-foreground hover:text-secondary transition-colors font-medium"
            >
              Property Evaluation
            </button>
            {user ? (
              <Link to={isAdmin ? "/admin/dashboard" : "/book"}>
                <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary shadow-gold">
                  {isAdmin ? "Dashboard" : "My Bookings"}
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary shadow-gold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary-foreground hover:text-secondary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/10 animate-fade-in bg-primary">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground hover:text-secondary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={GUESTY_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground hover:text-secondary transition-colors font-medium py-2 inline-flex items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                Book Your Stay
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={handleEvaluationClick}
                className="text-primary-foreground hover:text-secondary transition-colors font-medium py-2 text-left"
              >
                Property Evaluation
              </button>
              {user ? (
                <Link to={isAdmin ? "/admin/dashboard" : "/book"} className="w-full">
                  <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary w-full">
                    {isAdmin ? "Dashboard" : "My Bookings"}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth" className="w-full">
                  <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;