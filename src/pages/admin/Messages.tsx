import { useState } from "react";
import Navigation from "@/components/Navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MessengerPanel from "@/components/admin/MessengerPanel";
import ChannelSettingsDialog from "@/components/admin/ChannelSettingsDialog";

export default function MessagesPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navigation />
        <main className="flex-1 relative">
          {/* Full-page messenger */}
          <div className="absolute inset-0 pt-20">
            <MessengerPanel
              isOpen={true}
              onClose={() => {}}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
        </main>
      </div>
      <ChannelSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
