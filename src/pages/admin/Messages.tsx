import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Send,
  Search,
  ChevronDown,
  PenSquare,
  Phone,
  Home,
  Mail,
  Instagram,
  Globe,
  MessageCircle,
  ChevronLeft,
  Settings,
  Plus,
  Target,
  CheckCircle2,
  Circle,
  Tag,
  ListTodo,
  X,
  Facebook,
  Linkedin,
  Video,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ChannelSettingsDialog from "@/components/admin/ChannelSettingsDialog";

interface Conversation {
  id: string;
  channel: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  property_id: string | null;
  status: string;
  unread_count: number;
  last_message_at: string | null;
  created_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: string;
  content: string;
  message_type: string;
  created_at: string;
  read_at: string | null;
}

interface Goal {
  id: string;
  title: string;
  tags: string[];
  subtasks: { id: string; text: string; completed: boolean }[];
  color: string;
}

// Extended channel config with all platforms
const channelConfig: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  whatsapp: { icon: Phone, label: "WhatsApp", color: "text-green-600", bgColor: "bg-green-500/10" },
  airbnb: { icon: Home, label: "Airbnb", color: "text-rose-500", bgColor: "bg-rose-500/10" },
  booking_com: { icon: Globe, label: "Booking.com", color: "text-blue-600", bgColor: "bg-blue-500/10" },
  email: { icon: Mail, label: "Email", color: "text-amber-600", bgColor: "bg-amber-500/10" },
  instagram: { icon: Instagram, label: "Instagram", color: "text-pink-500", bgColor: "bg-pink-500/10" },
  tiktok: { icon: Video, label: "TikTok", color: "text-foreground", bgColor: "bg-foreground/10" },
  facebook: { icon: Facebook, label: "Facebook", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  linkedin: { icon: Linkedin, label: "LinkedIn", color: "text-sky-600", bgColor: "bg-sky-500/10" },
  sms: { icon: MessageSquare, label: "SMS", color: "text-purple-500", bgColor: "bg-purple-500/10" },
  other: { icon: MessageCircle, label: "Other", color: "text-muted-foreground", bgColor: "bg-muted" },
};

const goalColors = [
  "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  "from-rose-500/20 to-pink-500/20 border-rose-500/30",
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [goalEditorOpen, setGoalEditorOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Follow up with leads",
      tags: ["urgent", "sales"],
      subtasks: [
        { id: "s1", text: "Send intro email", completed: true },
        { id: "s2", text: "Schedule call", completed: false },
      ],
      color: goalColors[0],
    },
    {
      id: "2",
      title: "Guest check-in reminders",
      tags: ["operations"],
      subtasks: [
        { id: "s3", text: "Send welcome message", completed: false },
        { id: "s4", text: "Share access codes", completed: false },
      ],
      color: goalColors[1],
    },
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTags, setNewGoalTags] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      let query = supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (searchQuery) {
        query = query.ilike("guest_name", `%${searchQuery}%`);
      }

      if (activeChannel && ["whatsapp", "airbnb", "booking_com", "email", "instagram", "other"].includes(activeChannel)) {
        query = query.eq("channel", activeChannel as "whatsapp" | "airbnb" | "booking_com" | "email" | "instagram" | "other");
      }

      const { data, error } = await query;
      if (!error && data) {
        setConversations(data as Conversation[]);
      }
      setLoading(false);
    };

    fetchConversations();

    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchQuery, activeChannel]);

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      }
    };

    fetchMessages();

    supabase
      .from("conversations")
      .update({ unread_count: 0 })
      .eq("id", selectedConversation.id);

    const channel = supabase
      .channel(`messages-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_type: "admin",
      content: newMessage.trim(),
      message_type: "text",
    });

    if (!error) {
      setNewMessage("");
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedConversation.id);
    }
    setSending(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      tags: newGoalTags.split(",").map((t) => t.trim()).filter(Boolean),
      subtasks: [],
      color: goalColors[goals.length % goalColors.length],
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
    setNewGoalTags("");
  };

  const handleAddSubtask = (goalId: string) => {
    if (!newSubtask.trim()) return;
    setGoals(
      goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              subtasks: [
                ...g.subtasks,
                { id: Date.now().toString(), text: newSubtask, completed: false },
              ],
            }
          : g
      )
    );
    setNewSubtask("");
  };

  const toggleSubtask = (goalId: string, subtaskId: string) => {
    setGoals(
      goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              subtasks: g.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            }
          : g
      )
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Channel Bar */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Inbox</h1>
              <Badge variant="secondary" className="rounded-full">
                {conversations.length}
              </Badge>
            </div>
            <Button
              onClick={() => setGoalEditorOpen(true)}
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              <Target className="h-4 w-4" />
              Goals Editor
            </Button>
          </div>

          {/* Channel Pills */}
          <ScrollArea className="w-full">
            <div className="flex items-center gap-2 px-4 pb-3">
              <button
                onClick={() => setActiveChannel(null)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  "border backdrop-blur-sm",
                  activeChannel === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 hover:bg-muted border-border"
                )}
              >
                <Sparkles className="h-4 w-4" />
                All Channels
              </button>
              {Object.entries(channelConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveChannel(key)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                      "border backdrop-blur-sm",
                      activeChannel === key
                        ? cn(config.bgColor, config.color, "border-current")
                        : "bg-background/50 hover:bg-muted border-border"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Goals Section - Glassmorphic Cards */}
        {goals.length > 0 && (
          <div className="border-b bg-gradient-to-r from-background via-muted/30 to-background p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Active Goals</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={cn(
                    "relative p-4 rounded-xl border backdrop-blur-md bg-gradient-to-br",
                    goal.color,
                    "hover:shadow-lg transition-all duration-300"
                  )}
                >
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-background/50 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <h4 className="font-medium text-sm mb-2 pr-6">{goal.title}</h4>
                  {goal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {goal.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-2 py-0 bg-background/50 backdrop-blur-sm"
                        >
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {goal.subtasks.length > 0 && (
                    <div className="space-y-1.5">
                      {goal.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => toggleSubtask(goal.id, subtask.id)}
                            className="h-3.5 w-3.5"
                          />
                          <span
                            className={cn(
                              "text-xs",
                              subtask.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {subtask.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-current/10">
                    <span className="text-[10px] text-muted-foreground">
                      {goal.subtasks.filter((s) => s.completed).length}/{goal.subtasks.length} completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List Panel */}
          <div
            className={cn(
              "w-full md:w-[350px] border-r flex flex-col bg-background",
              selectedConversation && "hidden md:flex"
            )}
          >
            {/* Search */}
            <div className="px-4 py-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50 border-0 h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 px-4 py-3 border-b">
              <button
                onClick={() => setActiveTab("messages")}
                className={cn(
                  "text-sm font-medium pb-1 border-b-2 transition-colors",
                  activeTab === "messages"
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent"
                )}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={cn(
                  "text-sm font-medium pb-1 border-b-2 transition-colors",
                  activeTab === "requests"
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent"
                )}
              >
                Requests
              </button>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="px-4 py-2 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No conversations yet</p>
                  <p className="text-xs mt-1">Start connecting with your guests</p>
                </div>
              ) : (
                <div className="px-2 py-2">
                  {conversations.map((conv) => {
                    const channel = channelConfig[conv.channel] || channelConfig.other;
                    const Icon = channel.icon;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={cn(
                          "w-full px-3 py-3 rounded-xl text-left transition-all flex items-center gap-3 mb-1",
                          selectedConversation?.id === conv.id
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-sm bg-gradient-to-br from-muted to-muted-foreground/20">
                              {getInitials(conv.guest_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 p-1 rounded-full border-2 border-background",
                              channel.bgColor
                            )}
                          >
                            <Icon className={cn("h-3 w-3", channel.color)} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">
                              {conv.guest_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conv.last_message_at
                                ? format(new Date(conv.last_message_at), "MMM d")
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={cn("text-[10px] px-1.5 py-0", channel.bgColor, channel.color)}
                            >
                              {channel.label}
                            </Badge>
                          </div>
                        </div>
                        {conv.unread_count > 0 && (
                          <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                            {conv.unread_count}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-muted/20",
              !selectedConversation && "hidden md:flex"
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-background flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(selectedConversation.guest_name)}
                      </AvatarFallback>
                    </Avatar>
                    {(() => {
                      const channel = channelConfig[selectedConversation.channel] || channelConfig.other;
                      const Icon = channel.icon;
                      return (
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 p-1 rounded-full border-2 border-background",
                            channel.bgColor
                          )}
                        >
                          <Icon className={cn("h-2.5 w-2.5", channel.color)} />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{selectedConversation.guest_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      via {channelConfig[selectedConversation.channel]?.label || "Unknown"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.sender_type === "admin" ? "justify-end" : "justify-start"
                        )}
                      >
                        <Card
                          className={cn(
                            "max-w-[70%] px-4 py-2.5 shadow-sm border-0",
                            msg.sender_type === "admin"
                              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                              : "bg-background rounded-2xl rounded-bl-sm"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <span
                            className={cn(
                              "text-[10px] mt-1 block",
                              msg.sender_type === "admin"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {format(new Date(msg.created_at), "h:mm a")}
                          </span>
                        </Card>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-background">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-end gap-2"
                  >
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                        className="min-h-[44px] max-h-32 resize-none rounded-2xl bg-muted/50 border-0 pr-12"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!newMessage.trim() || sending}
                      className="rounded-full h-11 w-11 shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                  <Send className="h-10 w-10 text-primary stroke-[1.5px]" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
                  Connect with guests across all channels from one unified inbox
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {Object.entries(channelConfig).slice(0, 6).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <Badge
                        key={key}
                        variant="secondary"
                        className={cn("gap-1.5 py-1.5 px-3", config.bgColor, config.color)}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Editor Dialog */}
      <Dialog open={goalEditorOpen} onOpenChange={setGoalEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Messaging Goals Editor
            </DialogTitle>
            <DialogDescription>
              Create and manage your messaging goals with tags and subtasks
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            {/* Add New Goal */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 mb-6">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Goal
              </h4>
              <div className="space-y-3">
                <Input
                  placeholder="Goal title (e.g., 'Follow up with leads')"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="bg-background"
                />
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder="Tags (comma separated: urgent, sales, operations)"
                    value={newGoalTags}
                    onChange={(e) => setNewGoalTags(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Button onClick={handleAddGoal} disabled={!newGoalTitle.trim()} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </div>

            {/* Existing Goals */}
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={cn(
                    "p-4 rounded-xl border backdrop-blur-md bg-gradient-to-br",
                    goal.color
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      {goal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {goal.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-background/50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-2 mb-3">
                    {goal.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-background/30"
                      >
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() => toggleSubtask(goal.id, subtask.id)}
                        />
                        <span
                          className={cn(
                            "text-sm flex-1",
                            subtask.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {subtask.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add Subtask */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add subtask..."
                      value={editingGoal?.id === goal.id ? newSubtask : ""}
                      onChange={(e) => {
                        setEditingGoal(goal);
                        setNewSubtask(e.target.value);
                      }}
                      onFocus={() => setEditingGoal(goal)}
                      className="bg-background/50 text-sm h-9"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        handleAddSubtask(goal.id);
                        setEditingGoal(null);
                      }}
                      disabled={!newSubtask.trim() || editingGoal?.id !== goal.id}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ChannelSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
