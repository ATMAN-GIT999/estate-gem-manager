import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InlineEditProvider } from "./contexts/InlineEditContext";
import EditModeToggle from "./components/admin/EditModeToggle";
import WhatsAppButton from "./components/WhatsAppButton";

/**
 * Eager: the pages a visitor can arrive on from a search result or a shared
 * link. They are what the prerender captures and what LCP is measured on, so
 * loading them in the main chunk is the point.
 */
import Index from "./pages/Index";
import PropertyManagementPage from "./pages/PropertyManagementPage";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Projects from "./pages/Projects";
import GuaranteedIncomePage from "./pages/GuaranteedIncomePage";
import RenovationsPage from "./pages/RenovationsPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import AvisoLegal from "./pages/AvisoLegal";
import NotFound from "./pages/NotFound";

/**
 * Lazy: everything a first-time visitor cannot reach without first clicking
 * something, and everything behind a login.
 *
 * The whole app used to ship as one 2.8MB chunk, which meant a guest reading
 * the landing page downloaded fifteen admin screens, a charting library and
 * the page builder before the hero could paint. None of that is reachable
 * without signing in; /evaluate pulls in recharts and is one click past a
 * form. Splitting them out costs a network round-trip at the moment someone
 * actually navigates there — which is the right place to pay it.
 */
const Evaluate = lazy(() => import("./pages/Evaluate"));
const Auth = lazy(() => import("./pages/Auth"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const Book = lazy(() => import("./pages/Book"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));

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

/**
 * Deliberately bare. Only lazy routes can show it, and they are all reached by
 * clicking rather than by landing, so the page frame is already on screen —
 * a spinner in the middle of an otherwise-loaded page reads as a fault.
 */
const RouteFallback = () => <div className="min-h-screen" />;

const App = () => (
  <HelmetProvider>
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

                  {/* The site serves two audiences with two different intents,
                      so they get two entry points: "/" is the guest landing
                      page and /property-management is the owner page. Folding
                      both into one scroll made a single URL compete with
                      itself — for readers and for search, where one page
                      cannot rank for "villa rental Marbella" and "property
                      management Costa del Sol" at once.

                      The remaining detail pages hang off the owner branch and
                      the footer. /business-areas is the one legacy redirect:
                      it was the old catch-all services route and now belongs
                      to the owner page. */}
                  <Route path="/property-management" element={<PropertyManagementPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/guaranteed-income" element={<GuaranteedIncomePage />} />
                  <Route path="/renovations" element={<RenovationsPage />} />
                  <Route path="/investments" element={<InvestmentsPage />} />
                  <Route path="/business-areas" element={<Navigate to="/property-management" replace />} />

                  <Route path="/properties" element={<Properties />} />
                  <Route path="/property/:slug" element={<PropertyDetail />} />
                  <Route path="/aviso-legal" element={<AvisoLegal />} />

                  <Route path="/evaluate" element={<Evaluate />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route path="/book" element={<Book />} />
                  <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                  <Route path="/p/:slug" element={<DynamicPage />} />

                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
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

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </InlineEditProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
