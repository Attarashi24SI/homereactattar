import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminRoute - Only accessible by admin users.
 * Redirects to login if not authenticated.
 * Redirects to / (home) if authenticated but not admin.
 */
export const AdminRoute = () => {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
};

/**
 * MemberRoute - Only accessible by regular (non-admin) users.
 * Redirects to login if not authenticated.
 * Redirects to /dashboard if user is admin.
 */
export const MemberRoute = () => {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (isAdmin) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};

/**
 * AuthRequired - Any authenticated user (admin or member).
 * Redirects to login if not authenticated.
 */
export const AuthRequired = () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    return <Outlet />;
};
