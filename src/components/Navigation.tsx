import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/frontier-logo.png";
import EditableText from "./admin/EditableText";

const GUESTY_BOOKING_URL = "https://booking.guesty.com/properties?brandId=67471cfce5b88600014f0647";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [navLabel1, setNavLabel1] = useState("Our Business Areas");
  const [navLabel2, setNavLabel2] = useState("Projects");
  const [navLabel3, setNavLabel3] = useState("About Us");
  const [navLabel4, setNavLabel4] = useState("Book Your Stay");
  const [navLabel5, setNavLabel5] = useState("Property Evaluation");
  const [signInLabel, setSignInLabel] = useState("Sign In");
  const [dashboardLabel, setDashboardLabel] = useState("Dashboard");
  const [myBookingsLabel, setMyBookingsLabel] = useState("My Bookings");

  const handleEvaluationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const element = document.getElementById("property-evaluation");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#property-evaluation");
    }
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/business-areas", label: navLabel1, setLabel: setNavLabel1, id: "nav-1" },
    { href: "/projects", label: navLabel2, setLabel: setNavLabel2, id: "nav-2" },
    { href: "/about", label: navLabel3, setLabel: setNavLabel3, id: "nav-3" },
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
                <EditableText id={link.id} value={link.label} onChange={link.setLabel} as="span" className="text-primary-foreground">{link.label}</EditableText>
              </Link>
            ))}
            <Link
              to="/properties"
              className="text-primary-foreground hover:text-secondary transition-colors font-medium"
            >
              <EditableText id="nav-4" value={navLabel4} onChange={setNavLabel4} as="span" className="text-primary-foreground">{navLabel4}</EditableText>
            </Link>
            <button
              onClick={handleEvaluationClick}
              className="text-primary-foreground hover:text-secondary transition-colors font-medium"
            >
              <EditableText id="nav-5" value={navLabel5} onChange={setNavLabel5} as="span" className="text-primary-foreground">{navLabel5}</EditableText>
            </button>
            {user ? (
              <Link to={isAdmin ? "/admin/dashboard" : "/book"}>
                <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary shadow-gold">
                  <EditableText id="nav-auth-btn" value={isAdmin ? dashboardLabel : myBookingsLabel} onChange={isAdmin ? setDashboardLabel : setMyBookingsLabel} as="span">{isAdmin ? dashboardLabel : myBookingsLabel}</EditableText>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary shadow-gold">
                  <EditableText id="nav-signin-btn" value={signInLabel} onChange={setSignInLabel} as="span">{signInLabel}</EditableText>
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
              <Link
                to="/properties"
                className="text-primary-foreground hover:text-secondary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {navLabel4}
              </Link>
              <button
                onClick={handleEvaluationClick}
                className="text-primary-foreground hover:text-secondary transition-colors font-medium py-2 text-left"
              >
                {navLabel5}
              </button>
              {user ? (
                <Link to={isAdmin ? "/admin/dashboard" : "/book"} className="w-full">
                  <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary w-full">
                    {isAdmin ? dashboardLabel : myBookingsLabel}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth" className="w-full">
                  <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-primary w-full">
                    {signInLabel}
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
