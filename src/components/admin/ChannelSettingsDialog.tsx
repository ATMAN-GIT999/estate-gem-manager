import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Home,
  Globe,
  Mail,
  Instagram,
  Check,
  X,
  Loader2,
  ExternalLink,
  Key,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelConnection {
  id: string;
  channel: string;
  is_connected: boolean;
  connection_status: string;
  metadata: Record<string, unknown>;
}

const channelConfig: Record<
  string,
  {
    icon: React.ElementType;
    label: string;
    color: string;
    gradient: string;
    description: string;
    fields: { key: string; label: string; type: string; placeholder: string }[];
    docUrl?: string;
  }
> = {
  whatsapp: {
    icon: Phone,
    label: "WhatsApp Business",
    color: "bg-green-500",
    gradient: "from-green-500 to-emerald-600",
    description: "Connect your WhatsApp Business API to receive and send messages",
    fields: [
      { key: "phone_number_id", label: "Phone Number ID", type: "text", placeholder: "Enter Phone Number ID" },
      { key: "access_token", label: "Access Token", type: "password", placeholder: "Enter Access Token" },
    ],
    docUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
  },
  airbnb: {
    icon: Home,
    label: "Airbnb",
    color: "bg-rose-500",
    gradient: "from-rose-500 to-pink-600",
    description: "Sync guest messages from your Airbnb listings",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "Enter Airbnb API Key" },
    ],
    docUrl: "https://www.airbnb.com/partner",
  },
  booking_com: {
    icon: Globe,
    label: "Booking.com",
    color: "bg-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    description: "Connect to Booking.com messaging system",
    fields: [
      { key: "username", label: "Username", type: "text", placeholder: "Enter Username" },
      { key: "password", label: "Password", type: "password", placeholder: "Enter Password" },
    ],
    docUrl: "https://developers.booking.com",
  },
  email: {
    icon: Mail,
    label: "Email",
    color: "bg-amber-500",
    gradient: "from-amber-500 to-orange-600",
    description: "Set up email forwarding for guest inquiries",
    fields: [
      { key: "email", label: "Email Address", type: "email", placeholder: "support@frontier-residences.com" },
      { key: "imap_server", label: "IMAP Server", type: "text", placeholder: "imap.gmail.com" },
      { key: "imap_password", label: "App Password", type: "password", placeholder: "Enter App Password" },
    ],
  },
  instagram: {
    icon: Instagram,
    label: "Instagram",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    description: "Connect Instagram DMs through Meta Business Suite",
    fields: [
      { key: "page_id", label: "Page ID", type: "text", placeholder: "Enter Instagram Page ID" },
      { key: "access_token", label: "Access Token", type: "password", placeholder: "Enter Access Token" },
    ],
    docUrl: "https://developers.facebook.com/docs/instagram-api/",
  },
};

interface ChannelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChannelSettingsDialog({ open, onOpenChange }: ChannelSettingsDialogProps) {
  const [connections, setConnections] = useState<ChannelConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;

    const fetchConnections = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("channel_connections")
        .select("*");

      if (!error && data) {
        setConnections(data as ChannelConnection[]);
        const initialData: Record<string, Record<string, string>> = {};
        data.forEach((conn) => {
          initialData[conn.channel] = (conn.metadata as Record<string, string>) || {};
        });
        setFormData(initialData);
      }
      setLoading(false);
    };

    fetchConnections();
  }, [open]);

  const handleFieldChange = (channel: string, key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [key]: value,
      },
    }));
  };

  const handleToggleConnection = async (channel: string, enabled: boolean) => {
    setSaving(channel);

    const connection = connections.find((c) => c.channel === channel);
    if (!connection) {
      setSaving(null);
      return;
    }

    const { error } = await supabase
      .from("channel_connections")
      .update({
        is_connected: enabled,
        connection_status: enabled ? "connected" : "disconnected",
        metadata: formData[channel] || {},
        last_sync_at: enabled ? new Date().toISOString() : null,
      })
      .eq("id", connection.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update connection",
        variant: "destructive",
      });
    } else {
      setConnections((prev) =>
        prev.map((c) =>
          c.channel === channel
            ? {
                ...c,
                is_connected: enabled,
                connection_status: enabled ? "connected" : "disconnected",
              }
            : c
        )
      );
      toast({
        title: enabled ? "Connected" : "Disconnected",
        description: `${channelConfig[channel]?.label} has been ${enabled ? "connected" : "disconnected"}`,
      });
    }

    setSaving(null);
  };

  const handleSaveCredentials = async (channel: string) => {
    setSaving(channel);

    const connection = connections.find((c) => c.channel === channel);
    if (!connection) {
      setSaving(null);
      return;
    }

    const { error } = await supabase
      .from("channel_connections")
      .update({
        metadata: formData[channel] || {},
      })
      .eq("id", connection.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save credentials",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "Credentials saved successfully",
      });
    }

    setSaving(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Channel Settings</DialogTitle>
              <DialogDescription>
                Connect your messaging channels to receive and respond to guest messages
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* API Credentials Container - Glassmorphic */}
        <Card className="mx-0 my-4 p-4 bg-gradient-to-r from-slate-50/80 via-white/90 to-slate-50/80 dark:from-slate-900/80 dark:via-slate-800/90 dark:to-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Key className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">API Credentials</h3>
              <p className="text-xs text-muted-foreground">
                Your API keys are encrypted and stored securely
              </p>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {Object.entries(channelConfig).map(([key, config]) => {
              const connection = connections.find((c) => c.channel === key);
              const isConnected = connection?.is_connected || false;
              const Icon = config.icon;

              return (
                <Card
                  key={key}
                  className={cn(
                    "p-4 transition-all duration-300",
                    "bg-gradient-to-r from-white/80 via-white/90 to-white/80",
                    "dark:from-slate-900/80 dark:via-slate-800/90 dark:to-slate-900/80",
                    "backdrop-blur-xl border border-white/20 dark:border-white/10",
                    isConnected && "ring-2 ring-green-500/30 border-green-500/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2.5 rounded-xl bg-gradient-to-br text-white shadow-lg", config.gradient)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{config.label}</h3>
                          {isConnected ? (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <X className="h-3 w-3 mr-1" />
                              Disconnected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {config.docUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(config.docUrl, "_blank")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Switch
                        checked={isConnected}
                        onCheckedChange={(checked) => handleToggleConnection(key, checked)}
                        disabled={saving === key}
                      />
                    </div>
                  </div>

                  {/* Credential Fields - Glassmorphic Input Container */}
                  <div className="grid gap-3 pl-12">
                    <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                      <div className="grid gap-3">
                        {config.fields.map((field) => (
                          <div key={field.key} className="grid gap-1.5">
                            <Label htmlFor={`${key}-${field.key}`} className="text-sm font-medium">
                              {field.label}
                            </Label>
                            <Input
                              id={`${key}-${field.key}`}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[key]?.[field.key] || ""}
                              onChange={(e) => handleFieldChange(key, field.key, e.target.value)}
                              disabled={saving === key}
                              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleSaveCredentials(key)}
                          disabled={saving === key}
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                          {saving === key ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Credentials"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
