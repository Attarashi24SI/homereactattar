import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const MetricCard = ({ metric }) => {
    const { isLight } = useTheme();
    const Icon = metric.positive ? TrendingUp : TrendingDown;
    const tone = metric.positive
        ? isLight
            ? "bg-teal-100 text-teal-700"
            : "bg-emerald-500/15 text-emerald-300"
        : isLight
            ? "bg-amber-100 text-amber-700"
            : "bg-red-500/15 text-red-300";

    return (
        <article className={`min-h-28 rounded-lg border p-5 shadow-2xl ${isLight ? "border-teal-100 bg-white shadow-teal-100" : "border-white/5 bg-[#06090f]/95 shadow-black/35"}`}>
            <div>
                <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-300"}`}>{metric.label}</p>
                <p className={`mt-2 text-2xl font-bold ${isLight ? "text-black" : "text-white"}`}>
                    {metric.value}
                </p>
                <div className={`mt-3 flex items-center gap-2 text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${tone}`}>
                        <Icon className="h-3 w-3" />
                        {metric.change}
                    </span>
                    {metric.description}
                </div>
            </div>
        </article>
    );
};

export default MetricCard;
