import { useAuth } from "@/contexts/AuthContext";
import { useInlineEdit } from "@/contexts/InlineEditContext";
import { Button } from "@/components/ui/button";
import { Pencil, PencilOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EditModeToggle() {
  const { isAdmin } = useAuth();
  const { editMode, toggleEditMode } = useInlineEdit();

  // Only show for admins
  if (!isAdmin) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleEditMode}
            size="icon"
            className={cn(
              "fixed bottom-20 right-6 z-50 h-12 w-12 rounded-full shadow-lg",
              "transition-all duration-300",
              editMode
                ? "bg-green-500 hover:bg-green-600 text-white ring-4 ring-green-500/30"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {editMode ? (
              <PencilOff className="h-5 w-5" />
            ) : (
              <Pencil className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-medium">
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
