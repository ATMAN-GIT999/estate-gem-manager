import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InlineEditProvider } from "./contexts/InlineEditContext";
import EditModeToggle from "./components/admin/EditModeToggle";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Projects from "./pages/Projects";
import BusinessAreasPage from "./pages/BusinessAreasPage";
import Evaluate from "./pages/Evaluate";
import Auth from "./pages/Auth";
import PropertyDetail from "./pages/PropertyDetail";
import Properties from "./pages/Properties";
import Book from "./pages/Book";
import BookingConfirmation from "./pages/BookingConfirmation";
import PropertyManagementPage from "./pages/PropertyManagementPage";
import GuaranteedIncomePage from "./pages/GuaranteedIncomePage";
import RenovationsPage from "./pages/RenovationsPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import DynamicPage from "./pages/DynamicPage";
import AvisoLegal from "./pages/AvisoLegal";
import UpdatePassword from "./pages/UpdatePassword";

/**
 * The admin area is split out of the main bundle.
 *
 * Every one of these was a static import, so a guest opening a property photo
 * downloaded the dashboard, the analytics charts and the whole of grapesjs —
 * a full visual page editor — before the first image appeared. None of it is
 * reachable without logging in.
 *
 * `lazy()` per route rather than one shared admin chunk: an admin who opens
 * Bookings has no reason to pull the page builder either.
 */
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProperties = lazy(() => import("./pages/admin/Properties"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminMarketing = lazy(() => import("./pages/admin/Marketing"));
const AdminTasks = lazy(() => import("./pages/admin/Tasks"));
const AdminCalendar = lazy(() => import("./pages/admin/Calendar"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const AdminCreate = lazy(() => import("./pages/admin/Create"));
const AdminBuilder = lazy(() => import("./pages/admin/Builder"));
const AdminTestHarness = lazy(() => import("./pages/admin/TestHarness"));

const queryClient = new QueryClient();

/** Only ever seen on a lazy route; the public pages are still eager. */
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

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
            <Suspense fallback={<RouteFallback />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/business-areas" element={<BusinessAreasPage />} />
            <Route path="/property-management" element={<PropertyManagementPage />} />
            <Route path="/guaranteed-income" element={<GuaranteedIncomePage />} />
            <Route path="/renovations" element={<RenovationsPage />} />
            <Route path="/investments" element={<InvestmentsPage />} />
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
            </Suspense>
          </InlineEditProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
