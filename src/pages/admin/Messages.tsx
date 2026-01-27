import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Mail,
  User,
  Home,
  CreditCard,
  Target,
  Trophy,
  Zap,
  DollarSign,
  CheckCircle2,
  Plus,
  X,
  Star,
  TrendingUp,
  Flame,
  Crown,
  Camera,
  MapPin,
  Clock,
  Sparkles,
  Brain,
  Rocket,
  ChevronRight,
  Edit3,
  Play,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Video,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Channel configuration
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

// Output extraction stages - the gamified funnel
const extractionStages = [
  { id: "attention", label: "Attention", icon: Zap, points: 10, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "name", label: "Name", icon: User, points: 15, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "contact", label: "Contact", icon: Phone, points: 20, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "property", label: "Property", icon: Home, points: 25, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "images", label: "Images", icon: Camera, points: 30, color: "text-pink-500", bg: "bg-pink-500/10" },
  { id: "address", label: "Address", icon: MapPin, points: 25, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "booking", label: "Booking", icon: Clock, points: 35, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "payment", label: "💰 MONEY", icon: CreditCard, points: 100, color: "text-emerald-600", bg: "bg-emerald-500/20" },
];

// Quick response templates for extracting outputs
const quickResponses: Record<string, string[]> = {
  attention: ["Hi! 👋 Thanks for reaching out!", "Welcome! How can I help you today?"],
  name: ["May I have your name?", "Who am I speaking with today?"],
  contact: ["What's the best number to reach you?", "Can I get your email for updates?"],
  property: ["Tell me about your ideal property?", "What type of property interests you?"],
  images: ["Could you share some photos?", "We'd love to see your property!"],
  address: ["What's the property address?", "Where exactly is it located?"],
  booking: ["When are you looking to book?", "What dates work for you?"],
  payment: ["Ready to secure your booking?", "I'll send you the payment link!"],
};

// Company mission
const companyMission = {
  title: "FRONTIER RESIDENCES",
  objective: "Convert Every Visitor Into Revenue",
  values: ["Excellence", "Precision", "Results"],
  dailyGoal: 5000,
  currentRevenue: 3250,
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

interface ActiveTask {
  id: string;
  objective: string;
  target: string;
  stage: string;
  deadline: string;
  priority: "hot" | "warm" | "cold";
}

interface LeadScore {
  total: number;
  stages: Record<string, boolean>;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active task state - the current objective
  const [activeTask, setActiveTask] = useState<ActiveTask>({
    id: "1",
    objective: "Close Villa Booking - €2,500",
    target: "Marcus Weber",
    stage: "booking",
    deadline: "Today 6PM",
    priority: "hot",
  });
  const [showTaskEditor, setShowTaskEditor] = useState(false);

  // Lead scoring for current conversation
  const [leadScore, setLeadScore] = useState<LeadScore>({ total: 0, stages: {} });

  // Daily goals
  const [goals] = useState([
    { id: "1", title: "Daily Revenue", current: 3250, target: 5000, unit: "€" },
    { id: "2", title: "Leads Converted", current: 3, target: 10, unit: "" },
    { id: "3", title: "Bookings", current: 2, target: 5, unit: "" },
  ]);

  useEffect(() => {
    fetchConversations();
  }, [searchQuery, selectedChannel]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    let query = supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (searchQuery) {
      query = query.ilike("guest_name", `%${searchQuery}%`);
    }

    if (selectedChannel && Object.keys(channelConfig).includes(selectedChannel)) {
      query = query.eq("channel", selectedChannel as any);
    }

    const { data, error } = await query;
    if (!error && data) {
      setConversations(data as Conversation[]);
    }
    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
      calculateLeadScore(data as Message[]);
    }

    // Mark as read
    await supabase
      .from("conversations")
      .update({ unread_count: 0 })
      .eq("id", conversationId);
  };

  const calculateLeadScore = (msgs: Message[]) => {
    const content = msgs.map((m) => m.content.toLowerCase()).join(" ");
    const stages: Record<string, boolean> = {};
    let total = 0;

    if (msgs.length > 0) { stages.attention = true; total += 10; }
    if (/my name is|i'm |i am /i.test(content)) { stages.name = true; total += 15; }
    if (/\d{9,}|@|email/i.test(content)) { stages.contact = true; total += 20; }
    if (/bedroom|villa|apartment|property/i.test(content)) { stages.property = true; total += 25; }
    if (/photo|image|picture/i.test(content)) { stages.images = true; total += 30; }
    if (/street|address|location|calle/i.test(content)) { stages.address = true; total += 25; }
    if (/book|reserve|available|date/i.test(content)) { stages.booking = true; total += 35; }
    if (/pay|card|transfer|invoice/i.test(content)) { stages.payment = true; total += 100; }

    setLeadScore({ total, stages });
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

  const insertQuickResponse = (response: string) => {
    setNewMessage(response);
  };

  const toggleStage = (stageId: string) => {
    setLeadScore((prev) => {
      const newStages = { ...prev.stages, [stageId]: !prev.stages[stageId] };
      const stage = extractionStages.find((s) => s.id === stageId);
      const pointChange = stage ? (newStages[stageId] ? stage.points : -stage.points) : 0;
      return { total: prev.total + pointChange, stages: newStages };
    });
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const revenueProgress = (companyMission.currentRevenue / companyMission.dailyGoal) * 100;

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.guest_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = !selectedChannel || c.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* MISSION HEADER - The WHY we do this */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 border-b p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-amber-500" />
                <div>
                  <h1 className="text-lg font-bold tracking-tight">{companyMission.title}</h1>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3 text-primary" />
                    {companyMission.objective}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                {companyMission.values.map((value) => (
                  <Badge key={value} variant="outline" className="text-xs border-primary/30">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Revenue Tracker */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span className="text-lg font-bold text-emerald-600">
                    €{companyMission.currentRevenue.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / €{companyMission.dailyGoal.toLocaleString()}
                  </span>
                </div>
                <Progress value={revenueProgress} className="h-2 w-40" />
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                {Math.round(revenueProgress)}%
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE TASK BANNER - Current Objective */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-rose-500/20 border-b p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center animate-pulse",
                activeTask.priority === "hot" ? "bg-rose-500/20" : 
                activeTask.priority === "warm" ? "bg-amber-500/20" : "bg-blue-500/20"
              )}>
                {activeTask.priority === "hot" ? (
                  <Flame className="h-6 w-6 text-rose-500" />
                ) : activeTask.priority === "warm" ? (
                  <Zap className="h-6 w-6 text-amber-500" />
                ) : (
                  <Target className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "text-xs uppercase tracking-wide",
                    activeTask.priority === "hot" ? "bg-rose-500" : 
                    activeTask.priority === "warm" ? "bg-amber-500" : "bg-blue-500"
                  )}>
                    {activeTask.priority} lead
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activeTask.deadline}
                  </span>
                </div>
                <h2 className="text-xl font-bold mt-1">{activeTask.objective}</h2>
                <p className="text-sm text-muted-foreground">
                  Target: <span className="font-medium text-foreground">{activeTask.target}</span>
                  <span className="mx-2">•</span>
                  Stage: <span className="font-medium text-primary capitalize">{activeTask.stage}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTaskEditor(true)}>
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-green-600">
                <Play className="h-4 w-4 mr-1" />
                Start
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
                All
              </button>
              {Object.entries(channelConfig).slice(0, 8).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedChannel(key)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                      selectedChannel === key
                        ? cn(config.bgColor, config.color, "border-current")
                        : "bg-background hover:bg-muted border-border"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{config.label}</span>
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
            {/* Search */}
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

            {/* Conversations */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredConversations.map((conv) => {
                  const config = channelConfig[conv.channel] || channelConfig.other;
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

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header with Lead Score */}
                <div className="border-b p-3 bg-background">
                  <div className="flex items-center justify-between">
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
                      <div>
                        <h3 className="font-semibold">{selectedConversation.guest_name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {(() => {
                            const config = channelConfig[selectedConversation.channel] || channelConfig.other;
                            const Icon = config.icon;
                            return (
                              <>
                                <Icon className={cn("h-3 w-3", config.color)} />
                                <span>{config.label}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Lead Score */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Lead Score</div>
                        <div className="flex items-center gap-1">
                          <Trophy className={cn(
                            "h-4 w-4",
                            leadScore.total >= 200 ? "text-emerald-500" :
                            leadScore.total >= 100 ? "text-amber-500" : "text-muted-foreground"
                          )} />
                          <span className="font-bold text-lg">{leadScore.total}</span>
                          <span className="text-xs text-muted-foreground">/ 260</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full border-4 border-primary/20 flex items-center justify-center relative overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-primary to-emerald-500"
                          style={{ height: `${(leadScore.total / 260) * 100}%`, bottom: 0, top: 'auto' }}
                        />
                        <span className="relative font-bold text-sm">{Math.round((leadScore.total / 260) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extraction Progress - Gamified Funnel */}
                <div className="border-b p-2 bg-muted/30">
                  <ScrollArea className="w-full">
                    <div className="flex items-center gap-1 pb-1">
                      {extractionStages.map((stage, index) => {
                        const Icon = stage.icon;
                        const isComplete = leadScore.stages[stage.id];
                        return (
                          <button
                            key={stage.id}
                            onClick={() => toggleStage(stage.id)}
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0",
                              isComplete 
                                ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30" 
                                : "bg-muted hover:bg-muted/80 text-muted-foreground"
                            )}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Icon className={cn("h-3.5 w-3.5", stage.color)} />
                            )}
                            <span>{stage.label}</span>
                            <Badge variant="outline" className="h-4 px-1 text-[10px]">
                              +{stage.points}
                            </Badge>
                            {index < extractionStages.length - 1 && (
                              <ChevronRight className="h-3 w-3 text-muted-foreground/50 ml-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
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

                {/* Quick Responses - Output Extractors */}
                <div className="border-t p-2 bg-muted/30">
                  <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-1">
                      {extractionStages.map((stage) => {
                        if (!leadScore.stages[stage.id] && quickResponses[stage.id]) {
                          return (
                            <Button
                              key={stage.id}
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs shrink-0 gap-1"
                              onClick={() => insertQuickResponse(quickResponses[stage.id][0])}
                            >
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              Get {stage.label}
                            </Button>
                          );
                        }
                        return null;
                      })}
                      <Button variant="outline" size="sm" className="h-7 text-xs shrink-0 gap-1 text-emerald-600 border-emerald-500/50">
                        <DollarSign className="h-3 w-3" />
                        Close Deal
                      </Button>
                    </div>
                  </ScrollArea>
                </div>

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
              /* Empty State - Goals Dashboard */
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="max-w-2xl w-full space-y-6">
                  <div className="text-center mb-8">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <h2 className="text-2xl font-bold mb-2">Intelligent Output Extractor</h2>
                    <p className="text-muted-foreground">
                      Select a conversation to begin extracting valuable outputs from visitors
                    </p>
                  </div>

                  {/* Goals Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {goals.map((goal) => (
                      <Card key={goal.id} className="bg-gradient-to-br from-background to-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">{goal.title}</span>
                            <Trophy className={cn(
                              "h-4 w-4",
                              goal.current >= goal.target ? "text-emerald-500" : "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex items-end gap-1 mb-2">
                            <span className="text-3xl font-bold">{goal.unit}{goal.current}</span>
                            <span className="text-sm text-muted-foreground mb-1">/ {goal.target}</span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Extraction Funnel Visual */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        Output Extraction Funnel
                      </h3>
                      <div className="space-y-2">
                        {extractionStages.map((stage, i) => {
                          const Icon = stage.icon;
                          const width = 100 - (i * 10);
                          return (
                            <div key={stage.id} className="flex items-center gap-3">
                              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", stage.bg)}>
                                <Icon className={cn("h-4 w-4", stage.color)} />
                              </div>
                              <div className="flex-1">
                                <div 
                                  className={cn("h-6 rounded-r-full flex items-center px-3", stage.bg)}
                                  style={{ width: `${width}%` }}
                                >
                                  <span className="text-xs font-medium">{stage.label}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">+{stage.points}pts</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Lead Intelligence */}
          {selectedConversation && (
            <div className="hidden xl:flex w-72 border-l bg-muted/30 flex-col">
              <div className="p-3 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Lead Intelligence
                </h3>
              </div>

              <ScrollArea className="flex-1 p-3">
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">Contact</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{selectedConversation.guest_name}</span>
                        {leadScore.stages.name && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{selectedConversation.guest_email || "Not captured"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{selectedConversation.guest_phone || "Not captured"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Actions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">Next Actions</h4>
                    <div className="space-y-2">
                      {extractionStages.filter(s => !leadScore.stages[s.id]).slice(0, 3).map((stage) => {
                        const Icon = stage.icon;
                        return (
                          <div key={stage.id} className="flex items-center gap-2 p-2 rounded-lg bg-background border">
                            <Icon className={cn("h-4 w-4", stage.color)} />
                            <span className="text-sm flex-1">Get {stage.label}</span>
                            <Badge variant="outline" className="text-xs">+{stage.points}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Money Focus Card */}
                  <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                        <span className="font-semibold text-emerald-600">Revenue Target</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">€2,500</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Potential booking value
                      </p>
                      <Button size="sm" className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Send Payment Link
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-background border text-center">
                      <div className="text-2xl font-bold">{messages.length}</div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                    <div className="p-3 rounded-lg bg-background border text-center">
                      <div className="text-2xl font-bold text-primary">
                        {Object.values(leadScore.stages).filter(Boolean).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Outputs</div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Task Editor Dialog */}
      <Dialog open={showTaskEditor} onOpenChange={setShowTaskEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Edit Active Task
            </DialogTitle>
            <DialogDescription>
              Define your current objective for maximum focus
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Objective</label>
              <Input 
                value={activeTask.objective} 
                onChange={(e) => setActiveTask({ ...activeTask, objective: e.target.value })}
                placeholder="e.g., Close Villa Booking - €2,500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Person</label>
              <Input 
                value={activeTask.target} 
                onChange={(e) => setActiveTask({ ...activeTask, target: e.target.value })}
                placeholder="e.g., Marcus Weber"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stage</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border bg-background"
                  value={activeTask.stage}
                  onChange={(e) => setActiveTask({ ...activeTask, stage: e.target.value })}
                >
                  {extractionStages.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border bg-background"
                  value={activeTask.priority}
                  onChange={(e) => setActiveTask({ ...activeTask, priority: e.target.value as "hot" | "warm" | "cold" })}
                >
                  <option value="hot">🔥 Hot</option>
                  <option value="warm">⚡ Warm</option>
                  <option value="cold">❄️ Cold</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Input 
                value={activeTask.deadline} 
                onChange={(e) => setActiveTask({ ...activeTask, deadline: e.target.value })}
                placeholder="e.g., Today 6PM"
              />
            </div>
            <Button onClick={() => setShowTaskEditor(false)} className="w-full">
              Save Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
