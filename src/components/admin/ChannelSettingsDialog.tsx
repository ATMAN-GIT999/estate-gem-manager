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
    description: string;
    fields: { key: string; label: string; type: string; placeholder: string }[];
    docUrl?: string;
  }
> = {
  whatsapp: {
    icon: Phone,
    label: "WhatsApp Business",
    color: "bg-green-500",
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
        // Initialize form data from metadata
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Channel Settings</DialogTitle>
          <DialogDescription>
            Connect your messaging channels to receive and respond to guest messages
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {Object.entries(channelConfig).map(([key, config]) => {
              const connection = connections.find((c) => c.channel === key);
              const isConnected = connection?.is_connected || false;
              const Icon = config.icon;

              return (
                <div
                  key={key}
                  className={cn(
                    "border rounded-lg p-4 transition-colors",
                    isConnected && "border-green-500/50 bg-green-500/5"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg text-white", config.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{config.label}</h3>
                          {isConnected ? (
                            <Badge variant="default" className="bg-green-500 text-xs">
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

                  {/* Credential Fields */}
                  <div className="grid gap-3 pl-11">
                    {config.fields.map((field) => (
                      <div key={field.key} className="grid gap-1.5">
                        <Label htmlFor={`${key}-${field.key}`} className="text-sm">
                          {field.label}
                        </Label>
                        <Input
                          id={`${key}-${field.key}`}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[key]?.[field.key] || ""}
                          onChange={(e) => handleFieldChange(key, field.key, e.target.value)}
                          disabled={saving === key}
                        />
                      </div>
                    ))}
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveCredentials(key)}
                        disabled={saving === key}
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
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
