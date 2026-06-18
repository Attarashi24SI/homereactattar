import React from "react";
import { useTheme } from "../context/ThemeContext";

const DataTable = ({ columns, children, compact = false }) => {
    const { isLight } = useTheme();

    return (
        <div className={`${compact ? "max-h-[260px]" : "max-h-[390px]"} overflow-auto rounded-2xl border shadow-xl ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
            <table className={`w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm ${isLight ? "text-slate-700" : "text-gray-300"}`}>
                <thead className={`sticky top-0 z-10 text-[11px] uppercase tracking-[0.14em] ${isLight ? "bg-teal-50 text-teal-700" : "bg-[#0f1724] text-gray-400"}`}>
                    <tr>
                        {columns.map((column) => (
                            <th key={column} className={`border-b px-6 py-4 font-bold first:rounded-tl-2xl last:rounded-tr-2xl ${isLight ? "border-slate-200" : "border-white/5"}`}>
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
};

export default DataTable;
