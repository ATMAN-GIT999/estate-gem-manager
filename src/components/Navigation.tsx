import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/frontier-logo.png";
import EditableText from "./admin/EditableText";

/**
 * The header splits the site's two audiences before a visitor has scrolled a
 * pixel: guests go down the Vacation Rental branch, owners down Property
 * Management, and the primary button is the owner's entry point.
 *
 * It used to be a flat row of in-page anchors, which only worked while every
 * audience lived in one scroll. Anchors are gone from here entirely — each
 * item is a real route now.
 *
 * Dropdown entries are `<a>` elements (NavigationMenuLink asChild + react-router
 * Link), not JS-only handlers, so they carry anchor text. Radix mounts panel
 * content on open, so a crawler that never hovers won't see them — every
 * destination in here is therefore also linked from the footer.
 */

/** The green header needs the inverse of the default trigger palette: no fill, white text, gold on hover. */
const headerItemStyle =
  "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent " +
  "text-primary-foreground hover:text-accent-on-primary focus:text-accent-on-primary " +
  "data-[state=open]:text-accent-on-primary text-base font-medium px-3";

type DropdownItem = { title: string; description: string; to: string };

/**
 * Module scope on purpose: defined inside Navigation this would be a new
 * component type on every render, so an EditableText would lose focus after
 * each keystroke in admin edit mode.
 */
const DropdownLink = ({
  item,
  idPrefix,
  index,
  onChange,
  onNavigate,
}: {
  item: DropdownItem;
  idPrefix: string;
  index: number;
  onChange: (index: number, field: "title" | "description", value: string) => void;
  onNavigate?: () => void;
}) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        to={item.to}
        onClick={onNavigate}
        className="block rounded-lg p-3 transition-colors hover:bg-muted focus:bg-muted"
      >
        <EditableText
          id={`${idPrefix}-title-${index}`}
          value={item.title}
          onChange={(v) => onChange(index, "title", v)}
          as="span"
          className="block font-semibold text-primary"
        >
          {item.title}
        </EditableText>
        <EditableText
          id={`${idPrefix}-desc-${index}`}
          value={item.description}
          onChange={(v) => onChange(index, "description", v)}
          as="span"
          className="mt-0.5 block text-sm text-foreground/70"
        >
          {item.description}
        </EditableText>
      </Link>
    </NavigationMenuLink>
  </li>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const [rentalLabel, setRentalLabel] = useState("Vacation Rental");
  const [managementLabel, setManagementLabel] = useState("Property Management");
  const [aboutLabel, setAboutLabel] = useState("About Us");
  const [portalLabel, setPortalLabel] = useState("Homeowner Portal");
  const [ctaLabel, setCtaLabel] = useState("List your property");

  const [rentalItems, setRentalItems] = useState<DropdownItem[]>([
    {
      title: "Properties",
      description: "Browse every villa and apartment we manage.",
      to: "/properties",
    },
  ]);

  const [managementItems, setManagementItems] = useState<DropdownItem[]>([
    {
      title: "Property Management",
      description: "Full-service management for villas and apartments.",
      to: "/property-management",
    },
    {
      title: "Property Evaluator",
      description: "See what your home could earn — free, no commitment.",
      to: "/property-management#property-evaluation",
    },
  ]);

  const updateItem =
    (items: DropdownItem[], setItems: (next: DropdownItem[]) => void) =>
    (index: number, field: "title" | "description", value: string) => {
      const next = [...items];
      next[index] = { ...next[index], [field]: value };
      setItems(next);
    };

  /** Signed-in owners land in their own area rather than back at the login form. */
  const portalTo = user ? (isAdmin ? "/admin/dashboard" : "/book") : "/auth";

  const closeMobile = () => setIsOpen(false);

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
          <div className="hidden lg:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={headerItemStyle}>
                    <EditableText
                      id="nav-rental-label"
                      value={rentalLabel}
                      onChange={setRentalLabel}
                      as="span"
                    >
                      {rentalLabel}
                    </EditableText>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[320px] p-3">
                      {rentalItems.map((item, index) => (
                        <DropdownLink
                          key={item.to}
                          item={item}
                          idPrefix="nav-rental-item"
                          index={index}
                          onChange={updateItem(rentalItems, setRentalItems)}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={headerItemStyle}>
                    <EditableText
                      id="nav-management-label"
                      value={managementLabel}
                      onChange={setManagementLabel}
                      as="span"
                    >
                      {managementLabel}
                    </EditableText>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[340px] p-3">
                      {managementItems.map((item, index) => (
                        <DropdownLink
                          key={item.to}
                          item={item}
                          idPrefix="nav-management-item"
                          index={index}
                          onChange={updateItem(managementItems, setManagementItems)}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/about"
                      className={cn(navigationMenuTriggerStyle(), headerItemStyle)}
                    >
                      <EditableText
                        id="nav-about-label"
                        value={aboutLabel}
                        onChange={setAboutLabel}
                        as="span"
                      >
                        {aboutLabel}
                      </EditableText>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={portalTo}
                      className={cn(navigationMenuTriggerStyle(), headerItemStyle)}
                    >
                      <EditableText
                        id="nav-portal-label"
                        value={portalLabel}
                        onChange={setPortalLabel}
                        as="span"
                      >
                        {portalLabel}
                      </EditableText>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/property-management">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold font-semibold">
                <EditableText
                  id="nav-cta-label"
                  value={ctaLabel}
                  onChange={setCtaLabel}
                  as="span"
                >
                  {ctaLabel}
                </EditableText>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2 text-primary-foreground hover:text-accent-on-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation — the same destinations, flattened. A dropdown
            inside a burger menu is two taps to reach what one tap can show. */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/10 animate-fade-in bg-primary">
            <div className="flex flex-col gap-1">
              <MobileGroup label={rentalLabel} items={rentalItems} onNavigate={closeMobile} />
              <MobileGroup label={managementLabel} items={managementItems} onNavigate={closeMobile} />

              <Link
                to="/about"
                onClick={closeMobile}
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2.5"
              >
                {aboutLabel}
              </Link>
              <Link
                to={portalTo}
                onClick={closeMobile}
                className="text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2.5"
              >
                {portalLabel}
              </Link>

              <Link to="/property-management" onClick={closeMobile} className="mt-3">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  {ctaLabel}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const MobileGroup = ({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: DropdownItem[];
  onNavigate: () => void;
}) => (
  <div className="py-1">
    <p className="text-xs uppercase tracking-widest text-accent-on-primary/70 pt-2 pb-1">
      {label}
    </p>
    {items.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className="block text-primary-foreground hover:text-accent-on-primary transition-colors font-medium py-2.5"
      >
        {item.title}
      </Link>
    ))}
  </div>
);

export default Navigation;
