import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageCircle,
  Send,
  X,
  Phone,
  Home,
  Mail,
  Instagram,
  Globe,
  ChevronLeft,
  Search,
  Settings,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Channel = "whatsapp" | "airbnb" | "booking_com" | "email" | "instagram" | "all";

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

interface ChannelConnection {
  channel: string;
  is_connected: boolean;
  connection_status: string;
}

const channelConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  whatsapp: { icon: Phone, label: "WhatsApp", color: "bg-green-500" },
  airbnb: { icon: Home, label: "Airbnb", color: "bg-rose-500" },
  booking_com: { icon: Globe, label: "Booking.com", color: "bg-blue-600" },
  email: { icon: Mail, label: "Email", color: "bg-amber-500" },
  instagram: { icon: Instagram, label: "Instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  other: { icon: MessageCircle, label: "Other", color: "bg-muted" },
};

interface MessengerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function MessengerPanel({ isOpen, onClose, onOpenSettings }: MessengerPanelProps) {
  const [activeChannel, setActiveChannel] = useState<Channel>("all");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelConnections, setChannelConnections] = useState<ChannelConnection[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch channel connections
  useEffect(() => {
    const fetchConnections = async () => {
      const { data } = await supabase
        .from("channel_connections")
        .select("channel, is_connected, connection_status");
      if (data) {
        setChannelConnections(data as ChannelConnection[]);
      }
    };
    fetchConnections();
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!isOpen) return;

    const fetchConversations = async () => {
      setLoading(true);
      let query = supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (activeChannel !== "all") {
        query = query.eq("channel", activeChannel);
      }

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

    // Subscribe to realtime updates
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
  }, [isOpen, activeChannel, searchQuery]);

  // Fetch messages for selected conversation
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

    // Mark as read
    supabase
      .from("conversations")
      .update({ unread_count: 0 })
      .eq("id", selectedConversation.id);

    // Subscribe to new messages
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

  // Scroll to bottom on new messages
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
      // Update conversation last message time
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

  const getChannelIcon = (channel: string) => {
    const config = channelConfig[channel] || channelConfig.other;
    const Icon = config.icon;
    return <Icon className="h-3 w-3" />;
  };

  const isChannelConnected = (channel: string) => {
    const connection = channelConnections.find((c) => c.channel === channel);
    return connection?.is_connected || false;
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[640px] bg-background border-l shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          {selectedConversation && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
              className="lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <MessageCircle className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-lg">Messages</h2>
            {totalUnread > 0 && (
              <span className="text-xs text-muted-foreground">
                {totalUnread} unread
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
        <Button
          variant={activeChannel === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveChannel("all")}
          className="shrink-0"
        >
          All
        </Button>
        {Object.entries(channelConfig).map(([key, config]) => {
          if (key === "other") return null;
          const Icon = config.icon;
          const connected = isChannelConnected(key);
          return (
            <Button
              key={key}
              variant={activeChannel === key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveChannel(key as Channel)}
              className={cn("shrink-0 gap-1.5", !connected && "opacity-50")}
            >
              <div className={cn("p-1 rounded", config.color)}>
                <Icon className="h-3 w-3 text-white" />
              </div>
              <span className="hidden sm:inline">{config.label}</span>
              {!connected && (
                <Circle className="h-2 w-2 text-muted-foreground" />
              )}
            </Button>
          );
        })}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div
          className={cn(
            "w-full lg:w-72 border-r flex flex-col",
            selectedConversation && "hidden lg:flex"
          )}
        >
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-3 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">
                  Connect your channels to start receiving messages
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {conversations.map((conv) => {
                  const config = channelConfig[conv.channel] || channelConfig.other;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-colors flex items-start gap-3",
                        selectedConversation?.id === conv.id
                          ? "bg-primary/10"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs">
                            {getInitials(conv.guest_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 p-1 rounded-full",
                            config.color
                          )}
                        >
                          {getChannelIcon(conv.channel)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            {conv.guest_name}
                          </span>
                          {conv.unread_count > 0 && (
                            <Badge
                              variant="default"
                              className="h-5 min-w-[20px] px-1.5 text-xs"
                            >
                              {conv.unread_count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.last_message_at
                            ? format(new Date(conv.last_message_at), "MMM d, h:mm a")
                            : "No messages yet"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            !selectedConversation && "hidden lg:flex"
          )}
        >
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getInitials(selectedConversation.guest_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedConversation.guest_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="gap-1">
                      {getChannelIcon(selectedConversation.channel)}
                      {channelConfig[selectedConversation.channel]?.label || "Other"}
                    </Badge>
                    {selectedConversation.guest_email && (
                      <span>{selectedConversation.guest_email}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender_type === "admin" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2",
                          msg.sender_type === "admin"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
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
                      </div>
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
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim() || sending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <h3 className="font-medium text-lg mb-1">Select a conversation</h3>
                <p className="text-sm">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
