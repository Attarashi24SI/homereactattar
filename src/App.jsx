import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";
import { ThemeProvider } from "./context/ThemeContext";
import Loading from "./components/Loading";

function App() {
  // pages
  const Dashboard = React.lazy(() => import("./pages/Dashboard"));
  const Customers = React.lazy(() => import("./pages/Customers"));
  const CustomersDetail = React.lazy(() => import("./pages/CustomersDetail"));
  const Orders = React.lazy(() => import("./pages/Orders"));
  const OrdersDetail = React.lazy(() => import("./pages/OrdersDetail"));

  const Notifications = React.lazy(() => import("./pages/Notifications"));
  const OrderHistory = React.lazy(() => import("./pages/OrderHistory"));
  const Payments = React.lazy(() => import("./pages/Payments"));
  const ServicesPricing = React.lazy(() => import("./pages/ServicesPricing"));
  const TrackingStatus = React.lazy(() => import("./pages/TrackingStatus"));

  // Layout
  const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
  const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

  // Auth pages
  const Login = React.lazy(() => import("./pages/auth/Login"));
  const Register = React.lazy(() => import("./pages/auth/Register"));
  const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

  return (
    <ThemeProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomersDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrdersDetail />} />

            <Route path="/tracking-status" element={<TrackingStatus />} />
            <Route path="/services-pricing" element={<ServicesPricing />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/payments" element={<Payments />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
