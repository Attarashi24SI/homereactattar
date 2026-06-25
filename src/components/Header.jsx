import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bell, Search, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";

const Header = () => {
    const { isLight } = useTheme();
    const { searchQuery, setSearchQuery } = useSearch();
    const navigate = useNavigate();

    return (
        <header className={`w-full rounded-2xl px-5 py-4 shadow-sm ${isLight ? "border border-slate-200/80 bg-white/95 shadow-slate-200/70" : "bg-gradient-to-r from-[#263f31] via-[#49d6ad] to-[#086a82] shadow-black/25"}`}>
            <div className="flex items-center justify-between gap-6">
                <div className={`flex h-11 w-[360px] items-center rounded-xl border px-4 transition-all focus-within:ring-4 ${isLight ? "border-slate-200 bg-slate-50 focus-within:border-teal-400 focus-within:bg-white focus-within:ring-teal-100" : "border-white/10 bg-[#0a2630]/85 shadow-black/20 focus-within:ring-white/10"}`}>
                    <Search className={`mr-3 h-4 w-4 ${isLight ? "text-teal-600" : "text-gray-200"}`} />
                    <input
                        type="text"
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full bg-transparent text-sm font-medium outline-none ${isLight ? "text-slate-700 placeholder:text-slate-400" : "text-white placeholder:text-gray-200"}`}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className={`ml-1 flex h-6 w-6 items-center justify-center rounded-full transition ${
                                isLight
                                    ? "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                                    : "text-gray-500 hover:bg-white/10 hover:text-gray-300"
                            }`}
                            title="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${isLight ? "border-slate-200 bg-white text-slate-500 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300" : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`}
                        title="Kembali"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Notification Button */}
                    <Link
                        to="/notifications"
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${isLight ? "border-slate-200 bg-white text-slate-500 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300" : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`}
                        title="Notifikasi"
                    >
                        <Bell className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
