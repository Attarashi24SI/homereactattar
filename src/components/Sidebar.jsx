import { AiFillAlipaySquare } from "react-icons/ai"; 
import React from "react";
import { NavLink } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";
import {
    Bell,
    ClipboardList,
    CreditCard,
    Crown,
    History,
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Settings,
    MessageCircle,
    HelpCircle,
    SearchCheck,
    Tags,
    Moon,
    Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { isLight, toggleTheme } = useTheme();
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const menuClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive
            ? isLight
                ? "bg-white text-teal-700 shadow-[0_10px_24px_rgba(15,118,110,0.10)] ring-1 ring-teal-100"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md font-semibold"
            : isLight
                ? "text-slate-500 hover:bg-white/75 hover:text-teal-700"
                : "text-gray-400 hover:bg-white/10"
        }`;

    return (
        <aside className={`sticky top-0 h-screen w-64 shrink-0 border-r text-gray-300 flex flex-col justify-between p-5 ${isLight ? "border-teal-100/80 bg-white/90 shadow-[8px_0_30px_rgba(15,23,42,0.04)] backdrop-blur" : "border-white/10 bg-[#0b0f19]"}`}>

            {/* Top */}
            <div className="overflow-y-auto pr-1">

                {/* Logo */}
                <div className="mb-8 flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl shadow-sm ${isLight ? "bg-gradient-to-br from-teal-400 to-cyan-600 shadow-teal-200" : "bg-gradient-to-tr from-cyan-400 to-blue-500"}`}></div>
                    <h1 className={`${isLight ? "text-slate-800" : "text-gray-100"} text-lg font-bold tracking-tight`}>Bright Wash</h1>
                </div>

                {/* MENU */}
                <div className="mb-6">
                    <p className={`mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] ${isLight ? "text-slate-400" : "text-gray-500"}`}>
                        {isAdmin ? "Admin Panel" : "Member Menu"}
                    </p>

                    <ul className="space-y-1.5">
                        {isAdmin ? (
                            <>
                                <li>
                                    <NavLink to="/dashboard" end className={menuClass}>
                                        <LayoutDashboard size={18} /> Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/customers" className={menuClass}>
                                        <BsPersonFill size={18} /> Customers
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/orders" className={menuClass}>
                                        <ShoppingCart size={18} /> Orders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/notifications" className={menuClass}>
                                        <Bell size={18} /> Notifikasi
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/payments" className={menuClass}>
                                        <CreditCard size={18} /> Pembayaran
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/membership" className={menuClass}>
                                        <Crown size={18} /> Membership
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/member-portal" className={menuClass}>
                                        <ShoppingBag size={18} /> Member Portal
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/tracking" className={menuClass}>
                                        <SearchCheck size={18} /> Tracking Status
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/services-pricing" className={menuClass}>
                                        <Tags size={18} /> Layanan & Harga
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/history" className={menuClass}>
                                        <History size={18} /> Riwayat Order
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* OTHERS
                <div>
                    <p className={`text-xs mb-3 ${isLight ? "text-white/70" : "text-gray-500"}`}>OTHERS</p>

                    <div className="flex flex-col gap-2">

                        <SidebarItem icon={<Settings size={18} />} label="Settings" isLight={isLight} />

                        <div className="relative">
                            <SidebarItem icon={<MessageCircle size={18} />} label="Messages" isLight={isLight} />
                            <span className="absolute right-3 top-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                                10
                            </span>
                        </div>

                        <SidebarItem icon={<HelpCircle size={18} />} label="Help & Support" isLight={isLight} />

                    </div>
                </div> */}
            </div>

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isLight ? "bg-teal-50 text-teal-700 ring-1 ring-teal-100 hover:bg-teal-100" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                >
                    {isLight ? <Moon size={17} /> : <Sun size={17} />}
                    {isLight ? "Dark Mode" : "Light Mode"}
                </button>

                {/* Bottom Profile */}
                <div className={`${isLight ? "bg-slate-50 ring-1 ring-slate-200" : "bg-white/5"} flex items-center gap-3 rounded-2xl p-3`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${isLight ? "bg-gradient-to-br from-teal-400 to-cyan-600" : "bg-gradient-to-tr from-cyan-400 to-blue-500"}`}>
                        {(user?.fullname || user?.username || "U").charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isLight ? "text-slate-700" : "text-gray-300"}`}>{user?.fullname || user?.username || "Guest"}</p>
                        <p className={`text-xs uppercase font-bold ${isAdmin ? "text-red-500" : isLight ? "text-teal-600" : "text-teal-400"}`}>
                            {isAdmin ? "Admin" : "Member"}
                        </p>
                    </div>

                    <button
                        onClick={() => { logout(); navigate("/"); }}
                        title="Logout"
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${isLight ? "text-slate-400 hover:bg-red-50 hover:text-red-500" : "text-gray-500 hover:bg-red-500/10 hover:text-red-400"}`}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

const SidebarItem = ({ icon, label, isLight }) => {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${isLight ? "text-white/85 hover:bg-white/15 hover:text-white" : "text-gray-400 hover:bg-white/10"}`}>
            {icon}
            <span className="text-sm">{label}</span>
        </div>
    );
};

export default Sidebar;
