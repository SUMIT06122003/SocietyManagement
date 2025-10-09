// Resident Pages
import ResidentDashboard from "./pages/Resident/ResidentDashboard";
import PayMaintenance from "./pages/Resident/PayMaintenance";
import Amenities from "./pages/Resident/Amenities";
import BookClubhouse from "./pages/Resident/BookClubhouse";
import Complaints from "./pages/Resident/Complaints";

// Watchman Pages
import WatchmanDashboard from "./pages/Watchman/WatchmanDashboard";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateWatchman from "./pages/Admin/CreateWatchman";
import MaintenanceStatus from "./pages/Admin/MaintenanceStatus";
import ComplaintsView from "./pages/Admin/ComplaintsView";
import AmenitiesRequests from "./pages/Admin/AmenitiesRequests";
import ClubHouseBookings from "./pages/Admin/ClubHouseBookings"; // make sure file is named ClubHouseBookings.js
import VisitorsView from "./pages/Admin/VisitorsView";
// --- Resident Routes ---
export const residentRoutes = [
  { path: "/resident/dashboard", element: <ResidentDashboard /> },
  { path: "/resident/pay-maintenance", element: <PayMaintenance /> },
  { path: "/resident/amenities", element: <Amenities /> },
  { path: "/resident/book-clubhouse", element: <BookClubhouse /> },
  { path: "/resident/complaints", element: <Complaints /> },
];

// --- Watchman Routes ---
export const watchmanRoutes = [
  { path: "/watchman/dashboard", element: <WatchmanDashboard /> },
];

// --- Admin Routes ---
export const adminRoutes = [
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/create-watchman", element: <CreateWatchman /> },
  { path: "/admin/maintenance-status", element: <MaintenanceStatus /> },
  { path: "/admin/complaints-view", element: <ComplaintsView /> },
  { path: "/admin/amenities-requests", element: <AmenitiesRequests /> },
  { path: "/admin/clubhouse-bookings", element: <ClubHouseBookings /> },
   { path: "/admin/visitors", element: <VisitorsView /> },
];
