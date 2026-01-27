import { useAuth } from "@/contexts/AuthContext";
import { useInlineEdit } from "@/contexts/InlineEditContext";
import { Button } from "@/components/ui/button";
import { Pencil, PencilOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditModeToggle() {
  const { isAdmin } = useAuth();
  const { editMode, toggleEditMode } = useInlineEdit();

  // Only show for admins
  if (!isAdmin) return null;

  return (
    <Button
      onClick={toggleEditMode}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "h-16 px-6 rounded-2xl shadow-2xl",
        "flex items-center gap-3",
        "transition-all duration-300 transform hover:scale-105",
        "font-semibold text-base",
        editMode
          ? "bg-green-500 hover:bg-green-600 text-white ring-4 ring-green-500/30"
          : "bg-primary hover:bg-primary/90 text-primary-foreground ring-4 ring-primary/20"
      )}
    >
      {editMode ? (
        <>
          <PencilOff className="h-7 w-7" />
          <span>Exit Editor</span>
        </>
      ) : (
        <>
          <Pencil className="h-7 w-7" />
          <span>Edit Mode</span>
        </>
      )}
    </Button>
  );
}
