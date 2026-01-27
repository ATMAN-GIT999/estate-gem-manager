import Navigation from "@/components/Navigation";
import CalendarIntegration from "@/components/admin/CalendarIntegration";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
          <CalendarIntegration />
        </main>
      </div>
    </div>
  );
}
