import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Mail,
  User,
  Home,
  Plus,
  ChevronRight,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Video,
  MessageSquare,
  Settings,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plug,
  Bell,
  Sparkles,
  ExternalLink,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ChannelSettingsDialog from "@/components/admin/ChannelSettingsDialog";
import { useToast } from "@/hooks/use-toast";

// Channel configuration with setup guides
const channelConfig: Record<string, {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  gradient: string;
  description: string;
  setupSteps: string[];
}> = {
  whatsapp: {
    icon: Phone,
    label: "WhatsApp",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    gradient: "from-green-500 to-emerald-600",
    description: "Receive and reply to guest inquiries via WhatsApp Business API",
    setupSteps: [
      "Create a Meta Business account",
      "Set up WhatsApp Business API",
      "Enter your Phone Number ID and Access Token",
      "Test the connection",
    ],
  },
  airbnb: {
    icon: Home,
    label: "Airbnb",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    gradient: "from-rose-500 to-pink-600",
    description: "Sync guest messages from your Airbnb listings automatically",
    setupSteps: [
      "Log into your Airbnb Host account",
      "Navigate to Account Settings → API",
      "Generate an API key",
      "Paste the key in the settings dialog",
    ],
  },
  booking_com: {
    icon: Globe,
    label: "Booking.com",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    gradient: "from-blue-500 to-indigo-600",
    description: "Connect to Booking.com messaging for guest communications",
    setupSteps: [
      "Log into your Booking.com Extranet",
      "Go to Account → Connectivity",
      "Copy your username and password",
      "Enter credentials in settings",
    ],
  },
  email: {
    icon: Mail,
    label: "Email",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    gradient: "from-amber-500 to-orange-600",
    description: "Forward guest inquiry emails to your universal inbox",
    setupSteps: [
      "Enter your support email address",
      "Configure IMAP server settings",
      "Generate an App Password (Gmail/Outlook)",
      "Test email forwarding",
    ],
  },
  instagram: {
    icon: Instagram,
    label: "Instagram",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    description: "Manage Instagram DMs through Meta Business Suite integration",
    setupSteps: [
      "Connect Instagram to a Facebook Page",
      "Set up Meta Business Suite",
      "Generate a Page Access Token",
      "Enter Page ID and Token",
    ],
  },
  sms: {
    icon: MessageSquare,
    label: "SMS",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    gradient: "from-purple-500 to-violet-600",
    description: "Send and receive SMS messages via Twilio integration",
    setupSteps: [
      "Create a Twilio account",
      "Get a phone number",
      "Copy Account SID and Auth Token",
      "Connect via Twilio connector",
    ],
  },
  tiktok: {
    icon: Video,
    label: "TikTok",
    color: "text-foreground",
    bgColor: "bg-foreground/10",
    gradient: "from-gray-800 to-gray-900",
    description: "Monitor and respond to TikTok DMs and comments",
    setupSteps: [
      "Apply for TikTok Developer access",
      "Create a TikTok app",
      "Configure OAuth redirect",
      "Connect your account",
    ],
  },
  facebook: {
    icon: Facebook,
    label: "Facebook",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    gradient: "from-blue-600 to-blue-700",
    description: "Manage Facebook Messenger conversations from your Page",
    setupSteps: [
      "Connect your Facebook Page",
      "Set up Messenger permissions",
      "Generate Page Access Token",
      "Test the webhook",
    ],
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    color: "text-sky-600",
    bgColor: "bg-sky-500/10",
    gradient: "from-sky-600 to-blue-700",
    description: "Track LinkedIn messages and inquiries",
    setupSteps: [
      "Create a LinkedIn Developer App",
      "Request Messaging API access",
      "Configure OAuth 2.0",
      "Connect your profile",
    ],
  },
};

interface Conversation {
  id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  channel: string;
  status: string;
  unread_count: number;
  last_message_at: string | null;
}

interface Message {
  id: string;
  content: string;
  sender_type: string;
  created_at: string;
}

interface ChannelConnection {
  id: string;
  channel: string;
  is_connected: boolean;
  connection_status: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [channelConnections, setChannelConnections] = useState<ChannelConnection[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
    fetchChannelConnections();
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [searchQuery, selectedChannel]);

  useEffect(() => {
    if (selectedConversation) fetchMessages(selectedConversation.id);
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChannelConnections = async () => {
    const { data } = await supabase.from("channel_connections").select("id, channel, is_connected, connection_status");
    if (data) setChannelConnections(data as ChannelConnection[]);
  };

  const fetchConversations = async () => {
    setLoading(true);
    let query = supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (searchQuery) query = query.ilike("guest_name", `%${searchQuery}%`);
    if (selectedChannel && Object.keys(channelConfig).includes(selectedChannel)) {
      query = query.eq("channel", selectedChannel as any);
    }

    const { data } = await query;
    if (data) setConversations(data as Conversation[]);
    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (data) setMessages(data as Message[]);

    await supabase.from("conversations").update({ unread_count: 0 }).eq("id", conversationId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      content: newMessage.trim(),
      sender_type: "admin",
      message_type: "text",
    });
    if (!error) {
      setNewMessage("");
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedConversation.id);
      fetchMessages(selectedConversation.id);
    }
    setSending(false);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const isChannelConnected = (channel: string) =>
    channelConnections.some((c) => c.channel === channel && c.is_connected);

  const connectedCount = channelConnections.filter((c) => c.is_connected).length;
  const totalChannels = Object.keys(channelConfig).length;

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.guest_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = !selectedChannel || c.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Universal Inbox</h1>
                <p className="text-sm text-muted-foreground">
                  {connectedCount} of {totalChannels} channels connected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Channel Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Channel Filter Bar */}
        <div className="border-b bg-background/95 backdrop-blur px-4 py-2">
          <ScrollArea className="w-full">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChannel(null)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                  selectedChannel === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                <Sparkles className="h-4 w-4" />
                All Channels
              </button>
              {Object.entries(channelConfig).map(([key, config]) => {
                const Icon = config.icon;
                const connected = isChannelConnected(key);
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedChannel(key)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border relative",
                      selectedChannel === key
                        ? cn(config.bgColor, config.color, "border-current")
                        : "bg-background hover:bg-muted border-border"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{config.label}</span>
                    {connected && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List */}
          <div className={cn(
            "w-full md:w-80 border-r flex flex-col bg-muted/30",
            selectedConversation && "hidden md:flex"
          )}>
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredConversations.map((conv) => {
                  const config = channelConfig[conv.channel] || { icon: MessageCircle, label: "Other", color: "text-muted-foreground", bgColor: "bg-muted" };
                  const Icon = config.icon;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-all hover:bg-muted",
                        selectedConversation?.id === conv.id && "bg-primary/10 border border-primary/20"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-sm font-medium">
                              {getInitials(conv.guest_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-background",
                            config.bgColor
                          )}>
                            <Icon className={cn("h-2.5 w-2.5", config.color)} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">{conv.guest_name}</span>
                            {conv.unread_count > 0 && (
                              <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-primary text-xs">
                                {conv.unread_count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.guest_email || conv.guest_phone || "No contact info"}
                          </p>
                          {conv.last_message_at && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {format(new Date(conv.last_message_at), "MMM d, HH:mm")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredConversations.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Center Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="border-b p-3 bg-background">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 font-medium">
                        {getInitials(selectedConversation.guest_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedConversation.guest_name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {(() => {
                          const config = channelConfig[selectedConversation.channel] || { icon: MessageCircle, label: "Other", color: "text-muted-foreground" };
                          const Icon = config.icon;
                          return (
                            <>
                              <Icon className={cn("h-3 w-3", config.color)} />
                              <span>{config.label}</span>
                              {selectedConversation.guest_email && (
                                <>
                                  <span>•</span>
                                  <span>{selectedConversation.guest_email}</span>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn("flex", msg.sender_type === "admin" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] px-4 py-2.5 rounded-2xl",
                            msg.sender_type === "admin"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <span className={cn(
                            "text-[10px] mt-1 block",
                            msg.sender_type === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {format(new Date(msg.created_at), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-3 bg-background">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[44px] max-h-32 resize-none"
                      rows={1}
                    />
                    <Button onClick={handleSendMessage} disabled={sending} className="h-11 px-4">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Channel Setup Center - replaces Intelligent Output Extractor */
              <ScrollArea className="flex-1">
                <div className="p-6 max-w-4xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto">
                      <Plug className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Channel Setup Center</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Connect your messaging channels to receive all guest inquiries in one universal inbox
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Badge variant="outline" className="text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                        {connectedCount} Connected
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        <XCircle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {totalChannels - connectedCount} Remaining
                      </Badge>
                    </div>
                  </div>

                  {/* Channel Cards */}
                  <div className="grid gap-4">
                    {Object.entries(channelConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      const connected = isChannelConnected(key);

                      return (
                        <Card
                          key={key}
                          className={cn(
                            "transition-all duration-200 overflow-hidden",
                            connected && "ring-2 ring-emerald-500/30 border-emerald-500/50"
                          )}
                        >
                          <CardContent className="p-0">
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "h-11 w-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg",
                                    config.gradient
                                  )}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold">{config.label}</h3>
                                      {connected ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Connected
                                        </Badge>
                                      ) : (
                                        <Badge variant="secondary" className="text-xs">
                                          Not Connected
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                      {config.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {!connected && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setExpandedGuide(expandedGuide === key ? null : key)}
                                    >
                                      {expandedGuide === key ? "Hide Guide" : "Setup Guide"}
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() => setSettingsOpen(true)}
                                    className={cn(
                                      connected
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : "bg-gradient-to-r from-primary to-primary/80"
                                    )}
                                  >
                                    {connected ? (
                                      <>
                                        <Settings className="h-4 w-4 mr-1" />
                                        Manage
                                      </>
                                    ) : (
                                      <>
                                        <Plug className="h-4 w-4 mr-1" />
                                        Connect
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Expandable Setup Guide */}
                            {expandedGuide === key && !connected && (
                              <div className="border-t bg-muted/30 p-4">
                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-primary" />
                                  How to connect {config.label}
                                </h4>
                                <div className="space-y-2">
                                  {config.setupSteps.map((step, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                        {i + 1}
                                      </div>
                                      <p className="text-sm text-muted-foreground">{step}</p>
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  className="mt-4 w-full"
                                  onClick={() => setSettingsOpen(true)}
                                >
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Open Connection Settings
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Help Banner */}
                  <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm">Notifications & Activity Tracking</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Once channels are connected, every inquiry, booking request, and message will appear here in real-time. You'll be able to respond to all channels from this single inbox.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Right Sidebar - Contact Info (when conversation selected) */}
          {selectedConversation && (
            <div className="hidden xl:flex w-72 border-l bg-muted/30 flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm">Contact Details</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedConversation.guest_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{selectedConversation.guest_email || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedConversation.guest_phone || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Channel</h4>
                    {(() => {
                      const config = channelConfig[selectedConversation.channel] || { icon: MessageCircle, label: "Other", color: "text-muted-foreground", gradient: "from-gray-500 to-gray-600" };
                      const Icon = config.icon;
                      return (
                        <div className="flex items-center gap-2">
                          <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br text-white flex items-center justify-center", config.gradient)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{config.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-background border text-center">
                        <div className="text-2xl font-bold">{messages.length}</div>
                        <div className="text-xs text-muted-foreground">Messages</div>
                      </div>
                      <div className="p-3 rounded-lg bg-background border text-center">
                        <div className="text-2xl font-bold text-primary">
                          {selectedConversation.status === "active" ? "Active" : "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Channel Settings Dialog */}
      <ChannelSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
