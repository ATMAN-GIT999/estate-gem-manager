import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/frontier-logo.png";
import EditableText from "./admin/EditableText";

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

  /**
   * The site is a one-pager now, so the content links are in-page anchors.
   * Generalised from what used to be a bespoke handler for Property Evaluation
   * — the same two cases apply to every section: scroll if we are already on
   * the landing page, otherwise navigate there and let Index's hash effect do
   * the scrolling once it has mounted.
   */
  const handleAnchorClick = (anchor: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${anchor}`);
    }
    setIsOpen(false);
  };

  const handleEvaluationClick = handleAnchorClick("property-evaluation");

  const navLinks = [
    { anchor: "business-areas", label: navLabel1, setLabel: setNavLabel1, id: "nav-1" },
    { anchor: "projects", label: navLabel2, setLabel: setNavLabel2, id: "nav-2" },
    { anchor: "about", label: navLabel3, setLabel: setNavLabel3, id: "nav-3" },
  ];

  // The bar is fixed, so it sits outside the document flow: h-20 (5rem) of page
  // content would be hidden underneath it. Content pages clear it with `pt-24`
  // on their <main> — the 5rem of header plus 1rem of breathing room. Anchor
  // targets use `scroll-mt-20` and the sticky filter bar on /properties uses
  // `top-20` for the same reason. Change all four together.
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
              <a
                key={link.anchor}
                href={`/#${link.anchor}`}
                onClick={handleAnchorClick(link.anchor)}
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium"
              >
                <EditableText id={link.id} value={link.label} onChange={link.setLabel} as="span" className="text-primary-foreground">{link.label}</EditableText>
              </a>
            ))}
            <Link
              to="/properties"
              className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium"
            >
              <EditableText id="nav-4" value={navLabel4} onChange={setNavLabel4} as="span" className="text-primary-foreground">{navLabel4}</EditableText>
            </Link>
            <button
              onClick={handleEvaluationClick}
              className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium"
            >
              <EditableText id="nav-5" value={navLabel5} onChange={setNavLabel5} as="span" className="text-primary-foreground">{navLabel5}</EditableText>
            </button>
            {user ? (
              <Link to={isAdmin ? "/admin/dashboard" : "/book"}>
                <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold">
                  <EditableText id="nav-auth-btn" value={isAdmin ? dashboardLabel : myBookingsLabel} onChange={isAdmin ? setDashboardLabel : setMyBookingsLabel} as="span">{isAdmin ? dashboardLabel : myBookingsLabel}</EditableText>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold">
                  <EditableText id="nav-signin-btn" value={signInLabel} onChange={setSignInLabel} as="span">{signInLabel}</EditableText>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary-foreground hover:text-accent-on-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/10 animate-fade-in bg-primary">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.anchor}
                  href={`/#${link.anchor}`}
                  onClick={handleAnchorClick(link.anchor)}
                  className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/properties"
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {navLabel4}
              </Link>
              <button
                onClick={handleEvaluationClick}
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2 text-left"
              >
                {navLabel5}
              </button>
              {user ? (
                <Link to={isAdmin ? "/admin/dashboard" : "/book"} className="w-full">
                  <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                    {isAdmin ? dashboardLabel : myBookingsLabel}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth" className="w-full">
                  <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
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
