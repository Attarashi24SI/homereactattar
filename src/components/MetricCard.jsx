import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const MetricCard = ({ metric }) => {
    const { isLight } = useTheme();
    const Icon = metric.positive ? TrendingUp : TrendingDown;
    const tone = metric.positive
        ? isLight
            ? "bg-teal-50 text-teal-700 ring-1 ring-teal-100"
            : "bg-emerald-500/15 text-emerald-300"
        : isLight
            ? "bg-amber-100 text-amber-700"
            : "bg-red-500/15 text-red-300";

    return (
        <article className={`min-h-32 rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${isLight ? "border-slate-200/80 bg-white text-slate-800 shadow-slate-200/70 hover:border-teal-100 hover:shadow-teal-100/70" : "border-white/5 bg-[#06090f]/95 shadow-black/35"}`}>
            <div className="flex items-start justify-between gap-3">
                <p className={`text-[13px] font-semibold uppercase tracking-[0.08em] ${isLight ? "text-slate-500" : "text-gray-300"}`}>{metric.label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${isLight ? "bg-teal-50 text-teal-600 ring-1 ring-teal-100" : "bg-white/5 text-emerald-300"}`}>
                    <Icon className="h-4 w-4" />
                </span>
            </div>

            <p className={`mt-4 text-[26px] font-black leading-none tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}>
                {metric.value}
            </p>

            <div className={`mt-4 flex flex-wrap items-center gap-2 text-xs font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${tone}`}>
                    {metric.change}
                </span>
                <span>{metric.description}</span>
            </div>
        </article>
    );
};

export default MetricCard;
