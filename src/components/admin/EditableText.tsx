import { useState, useRef, useEffect } from "react";
import { useInlineEdit } from "@/contexts/InlineEditContext";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EditableTextProps {
  id: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  multiline?: boolean;
  children?: React.ReactNode;
}

export default function EditableText({
  id,
  value,
  onChange,
  className,
  as: Component = "p",
  multiline = false,
  children,
}: EditableTextProps) {
  const { editMode, isEditing, setIsEditing } = useInlineEdit();
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const isActive = isEditing === id;

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isActive]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onChange?.(editValue);
    setIsEditing(null);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  // If not in edit mode, just render children normally
  if (!editMode) {
    return <Component className={className}>{children || value}</Component>;
  }

  // In edit mode but not actively editing this element
  if (!isActive) {
    return (
      <div className="group relative inline-block">
        <Component className={cn(className, "outline outline-2 outline-dashed outline-primary/40 outline-offset-2 rounded")}>{children || value}</Component>
        <button
          onClick={() => setIsEditing(id)}
          className={cn(
            "absolute -top-3 -right-3 z-50",
            "h-8 w-8 rounded-full",
            "bg-primary text-primary-foreground shadow-xl",
            "flex items-center justify-center",
            "opacity-100",
            "transition-all duration-200 hover:scale-110",
            "ring-2 ring-background",
            "animate-pulse"
          )}
          title="Edit text"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Actively editing this element
  return (
    <div className="relative inline-block w-full">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            className,
            "w-full min-h-[100px] p-2 rounded-lg",
            "border-2 border-primary bg-background",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "resize-y"
          )}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            className,
            "w-full p-2 rounded-lg",
            "border-2 border-primary bg-background",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        />
      )}
      <div className="absolute -top-3 -right-3 flex gap-1 z-50">
        <Button
          size="icon"
          onClick={handleSave}
          className="h-7 w-7 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={handleCancel}
          className="h-7 w-7 rounded-full shadow-lg"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
