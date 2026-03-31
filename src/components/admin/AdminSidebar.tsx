import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Megaphone,
  MessageCircle,
  ListTodo,
  CalendarDays,
  Menu,
  Store,
  Heart,
  PlusSquare,
  Users,
  MessageSquare,
  Paintbrush,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Properties", icon: Building, href: "/admin/properties" },
  { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
  { label: "Messages", icon: MessageCircle, href: "/admin/messages" },
  { label: "Blog", icon: FileText, href: "/admin/blog" },
  { label: "Notifications", icon: Heart, href: "/admin/notifications" },
  { label: "Create", icon: PlusSquare, href: "/admin/create" },
  { label: "Page Builder", icon: Paintbrush, href: "/admin/builder" },
];

const discoverItems: NavItem[] = [
  { label: "Marketing", icon: Megaphone, href: "/admin/marketing" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Accounts", icon: Users, href: "/admin/accounts" },
];

const communityItems: NavItem[] = [
  { label: "Tasks", icon: ListTodo, href: "/admin/tasks" },
];

export default function AdminSidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    const linkContent = (
      <NavLink
        to={item.href}
        className={cn(
          "flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200",
          "hover:bg-muted",
          active
            ? "bg-muted font-medium"
            : "text-foreground/80 hover:text-foreground"
        )}
      >
        <Icon className={cn("h-6 w-6 shrink-0", active && "stroke-[2.5px]")} />
        {expanded && <span className="text-[15px]">{item.label}</span>}
        {item.badge && item.badge > 0 && (
          <Badge className="ml-auto h-5 min-w-[20px] px-1.5 text-xs bg-destructive">
            {item.badge}
          </Badge>
        )}
      </NavLink>
    );

    if (!expanded) {
      return (
        <TooltipProvider key={item.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.href}>{linkContent}</div>;
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 z-40 transition-all duration-300",
        "bg-background border-r",
        expanded ? "w-[220px]" : "w-[72px]"
      )}
    >
      {/* Logo */}
      <div className="p-4 pt-6">
        <NavLink to="/admin" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center shrink-0">
            <Building className="h-4 w-4 text-background" />
          </div>
          {expanded && (
            <span className="font-playfair font-bold text-xl">Frontier</span>
          )}
        </NavLink>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-3">
        <nav className="space-y-1">
          {mainNavItems.map(renderNavItem)}
        </nav>

        {/* Discover Section */}
        <div className="mt-6 pt-4 border-t">
          {expanded && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Discover
            </span>
          )}
          <nav className="mt-2 space-y-1">
            {discoverItems.map(renderNavItem)}
          </nav>
        </div>

        {/* Community Section */}
        <div className="mt-6 pt-4 border-t">
          {expanded && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Community
            </span>
          )}
          <nav className="mt-2 space-y-1">
            {communityItems.map(renderNavItem)}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t space-y-1">
        {/* Profile */}
        <NavLink
          to="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
            "hover:bg-muted",
            isActive("/admin/settings") && "bg-muted"
          )}
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-primary/10">FR</AvatarFallback>
          </Avatar>
          {expanded && <span className="text-sm">Profile</span>}
          {!expanded && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] bg-primary">
              1
            </Badge>
          )}
        </NavLink>

        {/* More Menu */}
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full justify-start gap-3 px-3 py-2.5 h-auto",
            "text-foreground/80 hover:text-foreground hover:bg-muted"
          )}
        >
          <Menu className="h-6 w-6 shrink-0" />
          {expanded && <span className="text-[15px]">More</span>}
        </Button>
      </div>
    </aside>
  );
}
