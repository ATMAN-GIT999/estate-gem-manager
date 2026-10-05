import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InlineEditProvider } from "./contexts/InlineEditContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { CookieConsentProvider } from "./contexts/CookieConsentContext";
import EditModeToggle from "./components/admin/EditModeToggle";
import RequireAdmin from "./components/admin/RequireAdmin";
import WhatsAppButton from "./components/WhatsAppButton";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import IstriaProject from "./pages/IstriaProject";
import Evaluate from "./pages/Evaluate";
import Auth from "./pages/Auth";
import PropertyDetail from "./pages/PropertyDetail";
import Properties from "./pages/Properties";
import VacationRentals from "./pages/VacationRentals";
import WinterRentals from "./pages/WinterRentals";
import WinterRentalCity from "./pages/WinterRentalCity";
import WinterRentalDetail from "./pages/WinterRentalDetail";
import VacationRentalCity from "./pages/VacationRentalCity";
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
const AdminWinterRentals = lazy(() => import("./pages/admin/WinterRentals"));
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
          <LocaleProvider>
          <CookieConsentProvider>
            <ScrollToTop />
            <EditModeToggle />
            <WhatsAppButton />
            <CookieConsentBanner />
            <Suspense fallback={<RouteFallback />}>
            <PageTransition>
            <Routes>
            <Route path="/" element={<Index />} />
            {/* Removed from the header and the site (Almedin, 29.09.2026) —
                same reasoning as /business-areas just below: a client-side
                redirect rather than deleting the route outright, so an old
                bookmark, backlink or indexed Google result still lands
                somewhere real instead of on NotFound. */}
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/istria" element={<IstriaProject />} />
            {/* Orphaned page, not a nav item anymore, and a stale duplicate of
                /property-management's positioning (docs/PROJECT.md D2). A
                client-side redirect rather than deleting the route outright,
                so an old bookmark or backlink still lands somewhere real. */}
            <Route path="/business-areas" element={<Navigate to="/property-management" replace />} />
            <Route path="/property-management" element={<PropertyManagementPage />} />
            <Route path="/guaranteed-income" element={<GuaranteedIncomePage />} />
            <Route path="/renovations" element={<RenovationsPage />} />
            <Route path="/investments" element={<InvestmentsPage />} />
            <Route path="/evaluate" element={<Evaluate />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/property/:slug" element={<PropertyDetail />} />
            <Route path="/vacation-rentals" element={<VacationRentals />} />
            <Route path="/vacation-rentals/:city" element={<VacationRentalCity />} />
            <Route path="/winter-rentals" element={<WinterRentals />} />
            <Route path="/winter-rentals/:city" element={<WinterRentalCity />} />
            <Route path="/winter-rentals/:city/:slug" element={<WinterRentalDetail />} />
            {/* Every /admin/* route behind one gate (docs/PROJECT.md C8) —
                see RequireAdmin for why this used to let a visitor with no
                admin role open the page shell at all, RLS or not. */}
            <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/properties" element={<RequireAdmin><AdminProperties /></RequireAdmin>} />
            <Route path="/admin/winter-rentals" element={<RequireAdmin><AdminWinterRentals /></RequireAdmin>} />
            <Route path="/admin/bookings" element={<RequireAdmin><AdminBookings /></RequireAdmin>} />
            <Route path="/admin/blog" element={<RequireAdmin><AdminBlog /></RequireAdmin>} />
            <Route path="/admin/analytics" element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />
            <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
            <Route path="/admin/marketing" element={<RequireAdmin><AdminMarketing /></RequireAdmin>} />
            <Route path="/admin/tasks" element={<RequireAdmin><AdminTasks /></RequireAdmin>} />
            <Route path="/admin/calendar" element={<RequireAdmin><AdminCalendar /></RequireAdmin>} />
            <Route path="/admin/messages" element={<RequireAdmin><AdminMessages /></RequireAdmin>} />
            <Route path="/admin/create" element={<RequireAdmin><AdminCreate /></RequireAdmin>} />
            <Route path="/admin/builder" element={<RequireAdmin><AdminBuilder /></RequireAdmin>} />
            <Route path="/admin/test-harness" element={<RequireAdmin><AdminTestHarness /></RequireAdmin>} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/p/:slug" element={<DynamicPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </PageTransition>
            </Suspense>
          </CookieConsentProvider>
          </LocaleProvider>
          </InlineEditProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
