import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Wallet,
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Properties", icon: Building, href: "/admin/properties" },
  { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
  { label: "Blog", icon: FileText, href: "/admin/blog" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const moneyMakingItems: NavItem[] = [
  { label: "Marketing", icon: Megaphone, href: "/admin/marketing" },
  { label: "Messages", icon: MessageCircle, href: "/admin/messages" },
  { label: "Task Board", icon: ListTodo, href: "/admin/tasks" },
  { label: "Calendar", icon: CalendarDays, href: "/admin/calendar" },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-white/10",
          active
            ? "bg-white/20 text-white font-medium shadow-lg"
            : "text-white/70 hover:text-white"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    );

    if (collapsed) {
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
        "bg-gradient-to-b from-primary via-primary/95 to-primary/90",
        "backdrop-blur-xl border-r border-white/10",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Building className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-playfair font-bold text-white text-lg truncate">
                Frontier
              </h1>
              <p className="text-white/60 text-xs truncate">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {mainNavItems.map(renderNavItem)}
        </div>

        {/* Money Making Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 mb-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Revenue Center
              </span>
            )}
          </div>
          <div className="space-y-1">
            {moneyMakingItems.map(renderNavItem)}
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-white/70 hover:text-white hover:bg-white/10",
            !collapsed && "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
