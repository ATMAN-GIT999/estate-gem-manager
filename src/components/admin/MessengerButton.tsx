import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import MessengerPanel from "./MessengerPanel";
import ChannelSettingsDialog from "./ChannelSettingsDialog";

export default function MessengerButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("unread_count");

      if (!error && data) {
        const total = data.reduce((sum, c) => sum + (c.unread_count || 0), 0);
        setUnreadCount(total);
      }
    };

    fetchUnreadCount();

    // Subscribe to conversation changes
    const channel = supabase
      .channel("unread-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => fetchUnreadCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "transition-transform hover:scale-105"
        )}
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-6 min-w-[24px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      <MessengerPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpenSettings={() => {
          setSettingsOpen(true);
        }}
      />

      <ChannelSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
}
