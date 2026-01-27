import { useState, useRef } from "react";
import { 
  Type, 
  Image, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  Quote, 
  Video, 
  Code, 
  Minus, 
  GripVertical,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BlockType = 
  | "heading1" 
  | "heading2" 
  | "heading3" 
  | "paragraph" 
  | "image" 
  | "quote" 
  | "list" 
  | "video" 
  | "code" 
  | "divider"
  | "spacer";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  settings?: {
    alignment?: "left" | "center" | "right";
    imageUrl?: string;
    imageAlt?: string;
    videoUrl?: string;
    listItems?: string[];
  };
}

interface BlogBuilderProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BLOCK_TYPES = [
  { type: "heading1" as BlockType, icon: Heading1, label: "Heading 1" },
  { type: "heading2" as BlockType, icon: Heading2, label: "Heading 2" },
  { type: "heading3" as BlockType, icon: Heading3, label: "Heading 3" },
  { type: "paragraph" as BlockType, icon: Type, label: "Paragraph" },
  { type: "image" as BlockType, icon: Image, label: "Image" },
  { type: "quote" as BlockType, icon: Quote, label: "Quote" },
  { type: "list" as BlockType, icon: List, label: "Bullet List" },
  { type: "video" as BlockType, icon: Video, label: "Video Embed" },
  { type: "code" as BlockType, icon: Code, label: "Code Block" },
  { type: "divider" as BlockType, icon: Minus, label: "Divider" },
];

export default function BlogBuilder({ blocks, onChange }: BlogBuilderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addBlock = (type: BlockType, afterIndex?: number) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: "",
      settings: {
        alignment: "left",
        listItems: type === "list" ? [""] : undefined,
      },
    };

    const newBlocks = [...blocks];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : blocks.length;
    newBlocks.splice(insertIndex, 0, newBlock);
    onChange(newBlocks);
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onChange(newBlocks);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveBlock(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {/* Block Elements Toolbar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border rounded-xl p-3 mb-4 shadow-sm">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Add Element</p>
        <div className="flex flex-wrap gap-1">
          {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addBlock(type)}
              className="h-9 px-3 gap-1.5 hover:bg-primary/10 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-2 min-h-[200px]">
        {blocks.length === 0 && (
          <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
            <Type className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">Start building your post</p>
            <p className="text-sm mb-4">Click an element above to add it to your content</p>
            <Button type="button" variant="outline" onClick={() => addBlock("paragraph")}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Block
            </Button>
          </div>
        )}

        {blocks.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "group relative",
              draggedIndex === index && "opacity-50",
              dragOverIndex === index && "border-t-2 border-primary"
            )}
          >
            <BlockEditor
              block={block}
              isActive={activeBlockId === block.id}
              onFocus={() => setActiveBlockId(block.id)}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => index > 0 && moveBlock(index, index - 1)}
              onMoveDown={() => index < blocks.length - 1 && moveBlock(index, index + 1)}
              onAddBelow={(type) => addBlock(type, index)}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface BlockEditorProps {
  block: ContentBlock;
  isActive: boolean;
  onFocus: () => void;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: (type: BlockType) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function BlockEditor({
  block,
  isActive,
  onFocus,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  canMoveUp,
  canMoveDown,
}: BlockEditorProps) {
  const setAlignment = (alignment: "left" | "center" | "right") => {
    onUpdate({ settings: { ...block.settings, alignment } });
  };

  const updateListItem = (index: number, value: string) => {
    const items = [...(block.settings?.listItems || [])];
    items[index] = value;
    onUpdate({ settings: { ...block.settings, listItems: items } });
  };

  const addListItem = () => {
    const items = [...(block.settings?.listItems || []), ""];
    onUpdate({ settings: { ...block.settings, listItems: items } });
  };

  const removeListItem = (index: number) => {
    const items = (block.settings?.listItems || []).filter((_, i) => i !== index);
    onUpdate({ settings: { ...block.settings, listItems: items } });
  };

  return (
    <div
      onClick={onFocus}
      className={cn(
        "relative rounded-lg border bg-card transition-all duration-200",
        isActive ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border hover:border-primary/50"
      )}
    >
      {/* Drag Handle & Controls */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center justify-center gap-1 border-r bg-muted/50 rounded-l-lg",
        "opacity-0 group-hover:opacity-100 transition-opacity"
      )}>
        <button type="button" className="cursor-grab active:cursor-grabbing p-1 hover:bg-background rounded">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <button 
          type="button"
          onClick={onMoveUp} 
          disabled={!canMoveUp}
          className="p-1 hover:bg-background rounded disabled:opacity-30"
        >
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        </button>
        <button 
          type="button"
          onClick={onMoveDown} 
          disabled={!canMoveDown}
          className="p-1 hover:bg-background rounded disabled:opacity-30"
        >
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>

      {/* Block Content */}
      <div className="ml-10 p-4">
        {/* Block Type Label */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {block.type.replace(/([0-9])/g, " $1")}
          </span>
          
          <div className="flex items-center gap-1">
            {/* Alignment Controls for text blocks */}
            {["heading1", "heading2", "heading3", "paragraph", "quote"].includes(block.type) && (
              <div className="flex gap-0.5 mr-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", block.settings?.alignment === "left" && "bg-primary/10")}
                  onClick={() => setAlignment("left")}
                >
                  <AlignLeft className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", block.settings?.alignment === "center" && "bg-primary/10")}
                  onClick={() => setAlignment("center")}
                >
                  <AlignCenter className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", block.settings?.alignment === "right" && "bg-primary/10")}
                  onClick={() => setAlignment("right")}
                >
                  <AlignRight className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Add Block Below */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
                  <DropdownMenuItem key={type} onClick={() => onAddBelow(type)}>
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Block */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Block-specific editors */}
        {block.type === "heading1" && (
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Heading 1"
            className={cn(
              "text-3xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0",
              block.settings?.alignment === "center" && "text-center",
              block.settings?.alignment === "right" && "text-right"
            )}
          />
        )}

        {block.type === "heading2" && (
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Heading 2"
            className={cn(
              "text-2xl font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0",
              block.settings?.alignment === "center" && "text-center",
              block.settings?.alignment === "right" && "text-right"
            )}
          />
        )}

        {block.type === "heading3" && (
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Heading 3"
            className={cn(
              "text-xl font-medium border-none shadow-none p-0 h-auto focus-visible:ring-0",
              block.settings?.alignment === "center" && "text-center",
              block.settings?.alignment === "right" && "text-right"
            )}
          />
        )}

        {block.type === "paragraph" && (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Start writing..."
            className={cn(
              "min-h-[60px] border-none shadow-none p-0 resize-none focus-visible:ring-0",
              block.settings?.alignment === "center" && "text-center",
              block.settings?.alignment === "right" && "text-right"
            )}
          />
        )}

        {block.type === "image" && (
          <div className="space-y-3">
            <Input
              value={block.settings?.imageUrl || ""}
              onChange={(e) => onUpdate({ settings: { ...block.settings, imageUrl: e.target.value } })}
              placeholder="Image URL"
            />
            <Input
              value={block.settings?.imageAlt || ""}
              onChange={(e) => onUpdate({ settings: { ...block.settings, imageAlt: e.target.value } })}
              placeholder="Alt text (for accessibility)"
            />
            {block.settings?.imageUrl && (
              <div className="rounded-lg overflow-hidden border bg-muted">
                <img 
                  src={block.settings.imageUrl} 
                  alt={block.settings.imageAlt || ""} 
                  className="max-h-60 w-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {block.type === "quote" && (
          <div className={cn(
            "border-l-4 border-primary pl-4",
            block.settings?.alignment === "center" && "text-center border-l-0 border-t-4 border-b-4 pt-4 pb-4 pl-0",
            block.settings?.alignment === "right" && "text-right border-l-0 border-r-4 pr-4 pl-0"
          )}>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter quote..."
              className="min-h-[60px] border-none shadow-none p-0 resize-none focus-visible:ring-0 italic text-lg"
            />
          </div>
        )}

        {block.type === "list" && (
          <div className="space-y-2">
            {(block.settings?.listItems || [""]).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <Input
                  value={item}
                  onChange={(e) => updateListItem(index, e.target.value)}
                  placeholder={`List item ${index + 1}`}
                  className="border-none shadow-none p-0 h-auto focus-visible:ring-0"
                />
                {(block.settings?.listItems?.length || 0) > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removeListItem(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addListItem} className="mt-2">
              <Plus className="h-3 w-3 mr-1" />
              Add Item
            </Button>
          </div>
        )}

        {block.type === "video" && (
          <div className="space-y-3">
            <Input
              value={block.settings?.videoUrl || ""}
              onChange={(e) => onUpdate({ settings: { ...block.settings, videoUrl: e.target.value } })}
              placeholder="YouTube or Vimeo URL"
            />
            {block.settings?.videoUrl && (
              <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                <iframe
                  src={getEmbedUrl(block.settings.videoUrl)}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        {block.type === "code" && (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="// Your code here..."
            className="min-h-[100px] font-mono text-sm bg-muted/50 rounded-lg p-3"
          />
        )}

        {block.type === "divider" && (
          <hr className="border-t-2 border-border my-2" />
        )}
      </div>
    </div>
  );
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  
  return url;
}
