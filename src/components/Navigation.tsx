import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/frontier-logo.webp";
import EditableText from "./admin/EditableText";

const INSTAGRAM_URL = "https://www.instagram.com/frontier.residences/";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [navLabel1, setNavLabel1] = useState("Property Management");
  const [navLabel3, setNavLabel3] = useState("About Us");
  const [navLabel4, setNavLabel4] = useState("Stay With Us");
  const [navLabel5, setNavLabel5] = useState("Property Evaluator");
  const [propertiesLabel, setPropertiesLabel] = useState("Properties");
  const [postsLabel, setPostsLabel] = useState("Our Newest Posts");
  const [signInLabel, setSignInLabel] = useState("Sign In");
  const [dashboardLabel, setDashboardLabel] = useState("Dashboard");
  const [myBookingsLabel, setMyBookingsLabel] = useState("My Bookings");

  const handleEvaluationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Ask the page rather than the route: the evaluator lives on the landing
    // page and the property management page, and hard-coding "/" sent anyone
    // on the latter back to the homepage to reach a section already on screen.
    const element = document.getElementById("property-evaluation");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#property-evaluation");
    }
    setIsOpen(false);
  };

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
            {/* Property Management — link, plus a hover dropdown that holds
                the Property Evaluator, which used to be its own top-level
                item. */}
            <div className="relative group">
              <Link
                to="/property-management"
                className="flex items-center gap-1 text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
              >
                <EditableText id="nav-1" value={navLabel1} onChange={setNavLabel1} as="span" className="text-primary-foreground">{navLabel1}</EditableText>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute left-0 top-full pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
                <div className="bg-primary border border-primary-foreground/15 rounded-lg shadow-elegant py-2 min-w-[220px]">
                  <Link
                    to="/property-management"
                    className="block px-4 py-2 text-primary-foreground hover:text-accent-on-primary hover:bg-primary-foreground/5 transition-colors"
                  >
                    {navLabel1}
                  </Link>
                  <button
                    onClick={handleEvaluationClick}
                    className="block w-full text-left px-4 py-2 text-primary-foreground hover:text-accent-on-primary hover:bg-primary-foreground/5 transition-colors"
                  >
                    <EditableText id="nav-5" value={navLabel5} onChange={setNavLabel5} as="span" className="text-primary-foreground">{navLabel5}</EditableText>
                  </button>
                </div>
              </div>
            </div>

            {/* Stay With Us — link to /properties, plus a dropdown offering
                the listings and the Instagram feed. */}
            <div className="relative group">
              <Link
                to="/properties"
                className="flex items-center gap-1 text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
              >
                <EditableText id="nav-4" value={navLabel4} onChange={setNavLabel4} as="span" className="text-primary-foreground">{navLabel4}</EditableText>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute left-0 top-full pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
                <div className="bg-primary border border-primary-foreground/15 rounded-lg shadow-elegant py-2 min-w-[220px]">
                  <Link
                    to="/properties"
                    className="block px-4 py-2 text-primary-foreground hover:text-accent-on-primary hover:bg-primary-foreground/5 transition-colors"
                  >
                    <EditableText id="nav-4-properties" value={propertiesLabel} onChange={setPropertiesLabel} as="span" className="text-primary-foreground">{propertiesLabel}</EditableText>
                  </Link>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-primary-foreground hover:text-accent-on-primary hover:bg-primary-foreground/5 transition-colors"
                  >
                    <EditableText id="nav-4-posts" value={postsLabel} onChange={setPostsLabel} as="span" className="text-primary-foreground">{postsLabel}</EditableText>
                  </a>
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium"
            >
              <EditableText id="nav-3" value={navLabel3} onChange={setNavLabel3} as="span" className="text-primary-foreground">{navLabel3}</EditableText>
            </Link>

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

        {/* Mobile Navigation — dropdowns become an indented sub-list under
            each parent, always expanded, rather than a second level of
            tap-to-open menus. */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/10 animate-fade-in bg-primary">
            <div className="flex flex-col gap-1">
              <Link
                to="/property-management"
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {navLabel1}
              </Link>
              <button
                onClick={handleEvaluationClick}
                className="text-primary-foreground/80 hover:text-accent-on-primary transition-colors py-2 pl-4 text-left text-sm"
              >
                {navLabel5}
              </button>

              <Link
                to="/properties"
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2 mt-3"
                onClick={() => setIsOpen(false)}
              >
                {navLabel4}
              </Link>
              <Link
                to="/properties"
                className="text-primary-foreground/80 hover:text-accent-on-primary transition-colors py-2 pl-4 text-sm"
                onClick={() => setIsOpen(false)}
              >
                {propertiesLabel}
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-accent-on-primary transition-colors py-2 pl-4 text-sm"
              >
                {postsLabel}
              </a>

              <Link
                to="/about"
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2 mt-3"
                onClick={() => setIsOpen(false)}
              >
                {navLabel3}
              </Link>

              {user ? (
                <Link to={isAdmin ? "/admin/dashboard" : "/book"} className="w-full mt-3">
                  <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                    {isAdmin ? dashboardLabel : myBookingsLabel}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth" className="w-full mt-3">
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
