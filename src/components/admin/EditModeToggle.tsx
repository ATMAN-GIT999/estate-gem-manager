import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditModeToggle() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdmin) return null;
  // Hide on admin pages (builder is already the editor)
  if (location.pathname.startsWith("/admin")) return null;

  const handleClick = () => {
    const currentRoute = location.pathname;
    navigate(`/admin/builder?route=${encodeURIComponent(currentRoute)}`);
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "h-16 px-6 rounded-2xl shadow-2xl",
        "flex items-center gap-3",
        "transition-all duration-300 transform hover:scale-105",
        "font-semibold text-base",
        "bg-primary hover:bg-primary/90 text-primary-foreground ring-4 ring-primary/20"
      )}
    >
      <Pencil className="h-7 w-7" />
      <span>Edit Mode</span>
    </Button>
  );
}
