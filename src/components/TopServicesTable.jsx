import { useTheme } from "../context/ThemeContext";

export default function TopServicesTable() {
    const { isLight } = useTheme();

    const services = [
        {
            service: "Laundry Kiloan",
            orders: 120,
            trend: "up",
        },
        {
            service: "Express",
            orders: 85,
            trend: "up",
        },
        {
            service: "Sepatu",
            orders: 45,
            trend: "down",
        },
        {
            service: "Karpet",
            orders: 20,
            trend: "up",
        },
        {
            service: "Bed Cover",
            orders: 15,
            trend: "down",
        },
    ];

    const totalOrders = services.reduce(
        (sum, item) => sum + item.orders,
        0,
    );

    return (
        <div
            className={`rounded-2xl border p-5 shadow-xl ${
                isLight
                    ? "border-slate-200/80 bg-white text-slate-700 shadow-slate-200/70"
                    : "border-transparent bg-[#06090f] text-white shadow-black/30"
            }`}
        >
            <div className="mb-4">
                <h2
                    className={`text-lg font-bold tracking-tight ${
                        isLight
                            ? "text-slate-950"
                            : "text-white"
                    }`}
                >
                    Top Services
                </h2>

                <p
                    className={`mt-1 text-sm font-medium ${
                        isLight
                            ? "text-slate-500"
                            : "text-gray-400"
                    }`}
                >
                    Orders contribution by service
                </p>
            </div>

            <div
                className={`overflow-hidden rounded-xl border ${
                    isLight
                        ? "border-slate-200"
                        : "border-white/10"
                }`}
            >
                <table className="w-full text-sm">
                    <thead>
                        <tr
                            className={
                                isLight
                                    ? "bg-slate-50"
                                    : "bg-white/5"
                            }
                        >
                            <th className="px-4 py-3 text-left font-semibold">
                                Service
                            </th>

                            <th className="px-4 py-3 text-center font-semibold">
                                Orders
                            </th>

                            <th className="px-4 py-3 text-center font-semibold">
                                Trend
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {services.map((item, index) => (
                            <tr
                                key={item.service}
                                className={`border-t transition-colors ${
                                    isLight
                                        ? "border-slate-100 hover:bg-slate-50"
                                        : "border-white/5 hover:bg-white/[0.03]"
                                } ${
                                    index % 2 === 1
                                        ? isLight
                                            ? "bg-slate-50/40"
                                            : "bg-white/[0.02]"
                                        : ""
                                }`}
                            >
                                <td className="px-4 py-3 font-medium">
                                    {item.service}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {item.orders}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                            item.trend === "up"
                                                ? isLight
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-emerald-500/10 text-emerald-400"
                                                : isLight
                                                ? "bg-red-50 text-red-600"
                                                : "bg-red-500/10 text-red-400"
                                        }`}
                                    >
                                        {item.trend === "up"
                                            ? "▲"
                                            : "▼"}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        <tr
                            className={`border-t-2 font-bold ${
                                isLight
                                    ? "border-slate-200 bg-slate-100"
                                    : "border-white/10 bg-white/[0.05]"
                            }`}
                        >
                            <td className="px-4 py-3">
                                Total
                            </td>

                            <td className="px-4 py-3 text-center">
                                {totalOrders}
                            </td>

                            <td className="px-4 py-3 text-center">
                                ▲
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
