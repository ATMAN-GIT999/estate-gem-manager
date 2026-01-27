import { useState } from "react";
import { useInlineEdit } from "@/contexts/InlineEditContext";
import { Pencil, Check, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditableVideoProps {
  id: string;
  type: "youtube" | "file";
  src: string;
  onChange?: (src: string, type: "youtube" | "file") => void;
  className?: string;
  children?: React.ReactNode;
}

export default function EditableVideo({
  id,
  type,
  src,
  onChange,
  className,
  children,
}: EditableVideoProps) {
  const { editMode, isEditing, setIsEditing } = useInlineEdit();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoType, setVideoType] = useState<"youtube" | "file">(type);
  const [youtubeUrl, setYoutubeUrl] = useState(type === "youtube" ? src : "");
  const [fileUrl, setFileUrl] = useState(type === "file" ? src : "");

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSave = () => {
    if (videoType === "youtube" && youtubeUrl) {
      const videoId = extractYoutubeId(youtubeUrl);
      if (videoId) {
        onChange?.(videoId, "youtube");
        setDialogOpen(false);
        setIsEditing(null);
      }
    } else if (videoType === "file" && fileUrl) {
      onChange?.(fileUrl, "file");
      setDialogOpen(false);
      setIsEditing(null);
    }
  };

  // If not in edit mode, just render children
  if (!editMode) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="group relative">
        <div className="outline outline-2 outline-dashed outline-primary/40 outline-offset-2 rounded-lg">
          {children}
        </div>
        <button
          onClick={() => {
            setIsEditing(id);
            setDialogOpen(true);
          }}
          className={cn(
            "absolute top-4 right-4 z-50",
            "h-12 w-12 rounded-full",
            "bg-primary text-primary-foreground shadow-xl",
            "flex items-center justify-center",
            "opacity-100",
            "transition-all duration-200 hover:scale-110",
            "ring-2 ring-background",
            "animate-pulse"
          )}
          title="Edit video"
        >
          <Pencil className="h-6 w-6" />
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) setIsEditing(null);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Change Video
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={videoType} onValueChange={(v) => setVideoType(v as "youtube" | "file")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
              <TabsTrigger value="file">Video File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="youtube" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Paste a YouTube video URL or embed link
                </p>
              </div>
              
              {youtubeUrl && extractYoutubeId(youtubeUrl) && (
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={`https://img.youtube.com/vi/${extractYoutubeId(youtubeUrl)}/hqdefault.jpg`}
                    alt="Video thumbnail"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Video File URL</Label>
                <Input
                  placeholder="https://example.com/video.mp4"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct link to an MP4 video file
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setDialogOpen(false);
              setIsEditing(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
