import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InlineEditProvider } from "./contexts/InlineEditContext";
import EditModeToggle from "./components/admin/EditModeToggle";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Evaluate from "./pages/Evaluate";
import Auth from "./pages/Auth";
import PropertyDetail from "./pages/PropertyDetail";
import Properties from "./pages/Properties";
import Book from "./pages/Book";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProperties from "./pages/admin/Properties";
import AdminBookings from "./pages/admin/Bookings";
import AdminBlog from "./pages/admin/Blog";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminMarketing from "./pages/admin/Marketing";
import AdminTasks from "./pages/admin/Tasks";
import AdminCalendar from "./pages/admin/Calendar";
import AdminMessages from "./pages/admin/Messages";
import AdminCreate from "./pages/admin/Create";
import AdminBuilder from "./pages/admin/Builder";
import AdminTestHarness from "./pages/admin/TestHarness";
import DynamicPage from "./pages/DynamicPage";
import AvisoLegal from "./pages/AvisoLegal";
import UpdatePassword from "./pages/UpdatePassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <InlineEditProvider>
            <EditModeToggle />
            <WhatsAppButton />
            <Routes>
            <Route path="/" element={<Index />} />

            {/* The seven former info routes now live as sections of the
                one-pager. They redirect rather than 404, so existing links,
                bookmarks and anything already indexed keep working. The page
                components are still in src/pages/ but are no longer imported —
                delete them once the experiment is settled. */}
            <Route path="/about" element={<Navigate to="/#about" replace />} />
            <Route path="/projects" element={<Navigate to="/#projects" replace />} />
            <Route path="/business-areas" element={<Navigate to="/#business-areas" replace />} />
            <Route path="/property-management" element={<Navigate to="/#business-areas" replace />} />
            <Route path="/guaranteed-income" element={<Navigate to="/#business-areas" replace />} />
            <Route path="/renovations" element={<Navigate to="/#business-areas" replace />} />
            <Route path="/investments" element={<Navigate to="/#business-areas" replace />} />

            <Route path="/evaluate" element={<Evaluate />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/book" element={<Book />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/property/:slug" element={<PropertyDetail />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/marketing" element={<AdminMarketing />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/calendar" element={<AdminCalendar />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/create" element={<AdminCreate />} />
            <Route path="/admin/builder" element={<AdminBuilder />} />
            <Route path="/admin/test-harness" element={<AdminTestHarness />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/p/:slug" element={<DynamicPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </InlineEditProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
