import { Check, Plus } from "lucide-react";
import { formatCurrency } from "../services/laundryPortalAPI";
import {
    Bed,
    Droplets,
    Footprints,
    Shirt,
    Sparkles,
    Zap,
} from "lucide-react";

export const iconMap = { Droplets, Shirt, Zap, Bed, Footprints, Sparkles };

export const colorGradientMap = {
    teal: "linear-gradient(135deg, #14b8a6, #0d9488)",
    cyan: "linear-gradient(135deg, #06b6d4, #0e7490)",
    amber: "linear-gradient(135deg, #f59e0b, #d97706)",
    indigo: "linear-gradient(135deg, #6366f1, #4f46e5)",
    emerald: "linear-gradient(135deg, #10b981, #059669)",
    violet: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
};

export const colorTailwindMap = {
    teal: "from-teal-500 to-cyan-500",
    cyan: "from-cyan-500 to-sky-500",
    amber: "from-amber-500 to-orange-500",
    indigo: "from-indigo-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    violet: "from-violet-500 to-fuchsia-500",
};

const defaultGradient = "linear-gradient(135deg, #14b8a6, #0d9488)";
const defaultTailwind = "from-teal-500 to-cyan-500";

export default function ServiceCard({
    service,
    variant = "landing",
    isLight = true,
    onAddToCart,
    inCart = false,
}) {
    const Icon = iconMap[service.icon] || Droplets;

    if (variant === "portal") {
        const gradient = colorTailwindMap[service.color] || defaultTailwind;

        return (
            <div
                className={`group flex flex-col rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                    isLight
                        ? "border-slate-200/80 bg-white shadow-slate-200/70 hover:border-teal-200"
                        : "border-white/5 bg-[#06090f]/95 shadow-black/30 hover:border-teal-500/20"
                }`}
            >
                <div
                    className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
                >
                    <Icon className="h-16 w-16" strokeWidth={1.8} />
                </div>
                <div className="flex flex-1 flex-col pt-4">
                    {service.category && (
                        <span
                            className={`mb-2 w-fit rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                isLight
                                    ? "bg-teal-50 text-teal-700"
                                    : "bg-teal-500/10 text-teal-300"
                            }`}
                        >
                            {service.category}
                        </span>
                    )}
                    <h3
                        className={`text-sm font-bold leading-snug ${
                            isLight ? "text-slate-900" : "text-white"
                        }`}
                    >
                        {service.name}
                    </h3>
                    <p
                        className={`mt-1 text-xs leading-relaxed ${
                            isLight ? "text-slate-500" : "text-gray-400"
                        }`}
                    >
                        {service.description}
                    </p>
                    <div className="mt-auto pt-4">
                        <p
                            className={`text-lg font-black ${
                                isLight ? "text-teal-700" : "text-teal-400"
                            }`}
                        >
                            {formatCurrency(service.price)}
                        </p>
                        <p
                            className={`text-xs ${
                                isLight ? "text-slate-400" : "text-gray-500"
                            }`}
                        >
                            per {service.unit}
                            {service.estimated_duration
                                ? ` · ${service.estimated_duration}`
                                : ""}
                        </p>
                    </div>
                    {onAddToCart && (
                        <button
                            onClick={() => onAddToCart(service)}
                            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
                                inCart
                                    ? isLight
                                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                        : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                                    : isLight
                                      ? "bg-teal-600 text-white shadow-md hover:bg-teal-700"
                                      : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md hover:shadow-lg"
                            }`}
                        >
                            {inCart ? (
                                <>
                                    <Check className="h-4 w-4" /> Dalam
                                    Keranjang
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" /> Masukkan
                                    Keranjang
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Landing page variant (default)
    const gradient = colorGradientMap[service.color] || defaultGradient;

    return (
        <div
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/50"
            style={{ minHeight: 340 }}
        >
            <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: gradient, boxShadow: "0 4px 12px rgba(20,184,166,0.2)" }}
            >
                <Icon size={24} strokeWidth={1.8} />
            </div>

            {service.category && (
                <span className="mb-2.5 w-fit rounded-lg bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    {service.category}
                </span>
            )}

            <h3 className="mb-2 text-base font-semibold text-slate-800">
                {service.name}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-slate-500">
                {service.description}
            </p>

            <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-lg font-bold text-teal-700">
                    {formatCurrency(service.price)}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                    per {service.unit}
                    {service.estimated_duration
                        ? ` · ${service.estimated_duration}`
                        : ""}
                </p>
            </div>
        </div>
    );
}
