import React from "react";
import { ChevronDown, Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ProfileAvatar from "./ProfileAvatar";

const Header = () => {
    const { isLight } = useTheme();

    return (
        <header className={`w-full rounded-2xl px-5 py-4 shadow-sm ${isLight ? "border border-slate-200/80 bg-white/95 shadow-slate-200/70" : "bg-gradient-to-r from-[#263f31] via-[#49d6ad] to-[#086a82] shadow-black/25"}`}>
            <div className="flex items-center justify-between gap-6">
                <div className={`flex h-11 w-[360px] items-center rounded-xl border px-4 transition-all focus-within:ring-4 ${isLight ? "border-slate-200 bg-slate-50 focus-within:border-teal-400 focus-within:bg-white focus-within:ring-teal-100" : "border-white/10 bg-[#0a2630]/85 shadow-black/20 focus-within:ring-white/10"}`}>
                    <Search className={`mr-3 h-4 w-4 ${isLight ? "text-teal-600" : "text-gray-200"}`} />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className={`w-full bg-transparent text-sm font-medium outline-none ${isLight ? "text-slate-700 placeholder:text-slate-400" : "text-white placeholder:text-gray-200"}`}
                    />
                </div>

                <div className={`flex items-center justify-end gap-3 rounded-xl border px-3 py-2 ${isLight ? "border-slate-200 bg-white shadow-sm" : "border-white/10 bg-white/5"}`}>
                    <div className="text-right">
                        <p className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-white"}`}>Uroos Fatima</p>
                        <p className={`text-xs ${isLight ? "text-slate-500" : "text-white/65"}`}>uroos.design@gmail.com</p>
                    </div>

                    <ProfileAvatar name="Uroos Fatima" />

                    <button className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${isLight ? "text-slate-500 hover:bg-slate-100 hover:text-teal-700" : "text-white/85 hover:bg-white/10"}`}>
                        <ChevronDown className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
