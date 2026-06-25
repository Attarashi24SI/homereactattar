import { createContext, useContext, useState, useEffect } from "react";
import { customerAPI } from "../services/customerAPI";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("brightwash_user");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("brightwash_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("brightwash_user");
        }
    }, [user]);

    /**
     * Login flow:
     * - Both admin and customer log in via the same user table (username + password)
     * - Admin (role="admin"): store basic user info, redirect to dashboard
     * - Customer (role="customer"): fetch customer profile + membership, redirect to member-portal
     * @param {string} username - from user table
     * @param {string} role - from user table (admin/customer)
     */
    const login = async (username, role = "customer") => {
        try {
            if (role === "admin") {
                // Admin login - just store basic info
                const sessionUser = {
                    username: username,
                    role: "admin",
                };
                setUser(sessionUser);
                return { success: true, user: sessionUser };
            }

            // Customer login - fetch customer profile
            const customer = await customerAPI.fetchCustomerByUsername(username);
            if (!customer) {
                return { success: false, error: "Profil customer tidak ditemukan" };
            }

            // Fetch membership by customerid
            const membership = await customerAPI.fetchMembershipByCustomerId(customer.customerid);

            const sessionUser = {
                customerid: customer.customerid,
                fullname: customer.fullname,
                username: customer.username,
                gender: customer.gender,
                birthDate: customer.birthDate,
                plan: customer.plan,
                profilePhoto: customer.profilePhoto,
                membershipData: membership,
                role: "customer",
            };
            setUser(sessionUser);
            return { success: true, user: sessionUser };
        } catch (err) {
            console.error("Login fetch profile error:", err);
            return { success: false, error: err.message || "Gagal mengambil profil" };
        }
    };

    const logout = () => {
        setUser(null);
    };

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
