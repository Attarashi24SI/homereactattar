import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { AdminRoute, MemberRoute } from "./components/RouteGuards";
import Loading from "./components/Loading";

function App() {
  // Admin pages
  const Dashboard = React.lazy(() => import("./pages/Dashboard"));
  const Customers = React.lazy(() => import("./pages/Customers"));
  const CustomersDetail = React.lazy(() => import("./pages/CustomersDetail"));
  const Orders = React.lazy(() => import("./pages/Orders"));
  const OrdersDetail = React.lazy(() => import("./pages/OrdersDetail"));
  const Notifications = React.lazy(() => import("./pages/Notifications"));
  const Payments = React.lazy(() => import("./pages/Payments"));
  const Membership = React.lazy(() => import("./pages/Membership"));

  // Member pages
  const MemberPortal = React.lazy(() => import("./pages/MemberPortal"));
  const TrackingStatus = React.lazy(() => import("./pages/TrackingStatus"));
  const TrackingDetail = React.lazy(() => import("./pages/TrackingDetail"));
  const History = React.lazy(() => import("./pages/History"));
  const OrderHistory = React.lazy(() => import("./pages/OrderHistory"));
  const ServicesPricing = React.lazy(() => import("./pages/ServicesPricing"));

  // Guest pages
  const Home = React.lazy(() => import("./pages/guest/Home"));

  // Layout
  const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
  const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

  // Auth pages
  const Login = React.lazy(() => import("./pages/auth/Login"));
  const Register = React.lazy(() => import("./pages/auth/Register"));
  const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <SearchProvider>
          <Routes>
            {/* Guest landing page */}
            <Route path="/" element={<Home />} />

            {/* Admin routes - requires role=admin */}
            <Route element={<AdminRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id" element={<CustomersDetail />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrdersDetail />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/membership" element={<Membership />} />
              </Route>
            </Route>

            {/* Member routes - requires authenticated non-admin user */}
            <Route element={<MemberRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/member-portal" element={<MemberPortal />} />
                <Route path="/tracking" element={<TrackingStatus />} />
                <Route path="/tracking/:invoice" element={<TrackingDetail />} />
                <Route path="/history" element={<History />} />
                <Route path="/tracking-status" element={<TrackingStatus />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/services-pricing" element={<ServicesPricing />} />
              </Route>
            </Route>

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot />} />
            </Route>
          </Routes>
          </SearchProvider>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
