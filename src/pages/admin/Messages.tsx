import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
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

const channelConfig: Record<string, { icon: React.ElementType; label: string }> = {
  whatsapp: { icon: Phone, label: "WhatsApp" },
  airbnb: { icon: Home, label: "Airbnb" },
  booking_com: { icon: Globe, label: "Booking.com" },
  email: { icon: Mail, label: "Email" },
  instagram: { icon: Instagram, label: "Instagram" },
  other: { icon: MessageCircle, label: "Other" },
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const [settingsOpen, setSettingsOpen] = useState(false);
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
  }, [searchQuery]);

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

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <div className="flex-1 flex">
        {/* Conversation List Panel */}
        <div
          className={cn(
            "w-full md:w-[350px] border-r flex flex-col bg-background",
            selectedConversation && "hidden md:flex"
          )}
        >
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-1 font-semibold text-base hover:opacity-70 transition-opacity">
                <span>Frontier</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setSettingsOpen(true)}
              >
                <PenSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50 border-0 h-9 rounded-lg"
              />
            </div>
          </div>

          {/* Notes Prompt */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-xs font-medium text-muted-foreground">
                1
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">Ask friends anything...</p>
                <p className="text-xs text-muted-foreground/70">Your note</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 px-4 pb-2">
            <button
              onClick={() => setActiveTab("messages")}
              className={cn(
                "text-sm font-semibold pb-1",
                activeTab === "messages" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={cn(
                "text-sm pb-1",
                activeTab === "requests" ? "text-foreground font-semibold" : "text-muted-foreground"
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
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              <div className="px-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "w-full px-2 py-2 rounded-lg text-left transition-all flex items-center gap-3",
                      selectedConversation?.id === conv.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="text-sm bg-gradient-to-br from-muted to-muted-foreground/20">
                        {getInitials(conv.guest_name)}
                      </AvatarFallback>
                    </Avatar>
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
                      <p className="text-sm text-muted-foreground truncate">
                        {channelConfig[conv.channel]?.label || "Message"}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            !selectedConversation && "hidden md:flex"
          )}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getInitials(selectedConversation.guest_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{selectedConversation.guest_name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {channelConfig[selectedConversation.channel]?.label}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
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
                          "max-w-[70%] px-4 py-2 shadow-none",
                          msg.sender_type === "admin"
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                            : "bg-muted rounded-2xl rounded-bl-sm"
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
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1 rounded-full bg-muted/50 border-0"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim() || sending}
                    className="rounded-full h-10 w-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-24 w-24 rounded-full border-2 border-foreground flex items-center justify-center mb-4">
                <Send className="h-12 w-12 stroke-[1.5px]" />
              </div>
              <h2 className="text-xl font-medium mb-1">Your messages</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Send private photos and messages to a friend or group.
              </p>
              <Button onClick={() => setSettingsOpen(true)}>
                Send message
              </Button>
            </div>
          )}
        </div>
      </div>

      <ChannelSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
