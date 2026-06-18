import React from "react";
import { useTheme } from "../context/ThemeContext";

const FormInput = ({ className = "", ...props }) => {
    const { isLight } = useTheme();
    const themeClass = isLight
        ? "border-slate-100 bg-white text-slate-700 placeholder:text-slate-400"
        : "border-white/10 bg-[#0f1724] text-white placeholder:text-gray-500";

    return (
        <input
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-teal-400 ${themeClass} ${className}`}
            {...props}
        />
    );
};

export default FormInput;
