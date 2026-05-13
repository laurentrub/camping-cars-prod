import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { SiteLayout } from "@/components/SiteLayout";
import Index from "./pages/Index.tsx";
import Catalogue from "./pages/Catalogue.tsx";
import VehicleDetail from "./pages/VehicleDetail.tsx";
import Services from "./pages/Services.tsx";
import Reprise from "./pages/Reprise.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import Reservation from "./pages/Reservation.tsx";
import ReservationConfirmation from "./pages/ReservationConfirmation.tsx";

import Favorites from "./pages/Favorites.tsx";
import AdminAuth from "./pages/admin/AdminAuth.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminVehicles from "./pages/admin/AdminVehicles.tsx";
import AdminLeads from "./pages/admin/AdminLeads.tsx";
import AdminTradeIns from "./pages/admin/AdminTradeIns.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminReservations from "./pages/admin/AdminReservations.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/vehicule/:slug" element={<VehicleDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reprise" element={<Reprise />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/reserver/:slug" element={<Reservation />} />
            <Route path="/reservation/:reference" element={<ReservationConfirmation />} />
          </Route>

          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="trade-ins" element={<AdminTradeIns />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
