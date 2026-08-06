import { useState, useRef } from "react";
import { useInlineEdit } from "@/contexts/InlineEditContext";
import { Pencil, Upload, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditableImageProps {
  id: string;
  src: string;
  alt?: string;
  onChange?: (url: string) => void;
  className?: string;
  bucketName?: string;
}

export default function EditableImage({
  id,
  src,
  alt = "",
  onChange,
  className,
  // The default used to be "images", a bucket that does not exist — the
  // project has exactly one, `property-images`. Every inline image upload has
  // therefore been failing with "Bucket not found" since this was written.
  // `property-images` is public to read and admin-only to write, which is
  // exactly what this component needs.
  bucketName = "property-images",
}: EditableImageProps) {
  const { editMode, isEditing, setIsEditing } = useInlineEdit();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isActive = isEditing === id;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      
      onChange?.(data.publicUrl);
      setDialogOpen(false);
      setIsEditing(null);
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange?.(urlInput.trim());
      setDialogOpen(false);
      setIsEditing(null);
      setUrlInput("");
    }
  };

  // If not in edit mode, just render image normally
  if (!editMode) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <>
      <div className="group relative inline-block">
        <img src={src} alt={alt} className={cn(className, "outline outline-2 outline-dashed outline-primary/40 outline-offset-2 rounded")} />
        <button
          onClick={() => {
            setIsEditing(id);
            setDialogOpen(true);
          }}
          className={cn(
            "absolute top-2 right-2 z-50",
            "h-10 w-10 rounded-full",
            "bg-primary text-primary-foreground shadow-xl",
            "flex items-center justify-center",
            "opacity-100",
            "transition-all duration-200 hover:scale-110",
            "ring-2 ring-background",
            "animate-pulse"
          )}
          title="Edit image"
        >
          <Pencil className="h-5 w-5" />
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) setIsEditing(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Current Image Preview */}
            <div className="relative rounded-lg overflow-hidden border bg-muted">
              <img 
                src={src} 
                alt="Current" 
                className="w-full h-40 object-cover"
              />
            </div>

            {/* Upload Option */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Upload new image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </>
                )}
              </Button>
            </div>

            {/* URL Option */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Or enter image URL</p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
