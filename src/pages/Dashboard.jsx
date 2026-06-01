import React from "react";
import PageHeader from "../components/PageHeader";
import ordersData from "../assets/data/order.json";
import MetricCard from "../components/MetricCard";
import { useTheme } from "../context/ThemeContext";

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);

const getOrderSummary = () => {
    const completedOrders = ordersData.filter((order) => order.status === "Completed");
    const pendingOrders = ordersData.filter((order) => order.status === "Pending");
    const cancelledOrders = ordersData.filter((order) => order.status === "Cancelled");
    const revenue = completedOrders.reduce(
        (total, order) => total + order.total,
        0,
    );

    return {
        revenue,
        totalOrders: ordersData.length,
        completed: completedOrders.length,
        pending: pendingOrders.length,
        cancelled: cancelledOrders.length,
    };
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartData = Object.values(
    ordersData.reduce((result, order) => {
        const date = new Date(order.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        if (!result[key]) {
            result[key] = {
                key,
                month: monthNames[date.getMonth()],
                revenue: 0,
                orders: 0,
            };
        }

        result[key].orders += 1;

        if (order.status === "Completed") {
            result[key].revenue += order.total;
        }

        return result;
    }, {}),
).sort((a, b) => a.key.localeCompare(b.key));

const Dashboard = () => {
    const summary = getOrderSummary();

    const metrics = [
        {
            label: "Total Pendapatan",
            value: formatCurrency(summary.revenue),
            change: "Revenue",
            positive: true,
            description: "completed orders",
            line: "M8 35 C18 22 28 22 38 36 S58 52 70 32 S88 9 104 16",
        },
        {
            label: "Total Orders",
            value: summary.totalOrders,
            change: "Orders",
            positive: true,
            description: "all status",
            line: "M8 32 C18 34 24 18 34 21 S43 6 51 23 S63 17 70 31 S88 28 104 43",
        },
        {
            label: "Completed",
            value: summary.completed,
            change: "Done",
            positive: true,
            description: "successful orders",
            line: "M8 31 C18 22 26 35 35 25 S50 34 57 44 S68 8 82 17 S94 25 104 18",
        },
        {
            label: "Pending",
            value: summary.pending,
            change: "Waiting",
            positive: false,
            description: "needs follow up",
            line: "M8 24 C18 38 26 30 35 36 S50 20 58 28 S75 42 86 28 S96 18 104 23",
        },
        {
            label: "Cancelled",
            value: summary.cancelled,
            change: "Cancel",
            positive: false,
            description: "cancelled orders",
            line: "M8 18 C18 28 25 42 38 34 S55 13 68 25 S84 45 104 38",
        },
    ];

    return (
        <main className="space-y-6">
            <PageHeader
                title="Dashboard"
                breadcrumb={["Home", "Dashboard"]}
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                {metrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <RevenueChart />
                <OrdersChart />
            </section>
        </main>
    );
};

const RevenueChart = () => {
    const { isLight } = useTheme();
    const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);
    const chartWidth = 560;
    const chartHeight = 190;
    const leftPadding = 42;
    const rightPadding = 25;
    const xStep =
        chartData.length > 1
            ? (chartWidth - leftPadding - rightPadding) / (chartData.length - 1)
            : 0;

    const points = chartData
        .map((item, index) => {
            const x = leftPadding + index * xStep;
            const y = chartHeight - (item.revenue / maxRevenue) * 140;
            return `${x},${y}`;
        })
        .join(" ");

    const totalRevenue = chartData.reduce((total, item) => total + item.revenue, 0);

    return (
        <div className={`rounded-lg border p-6 shadow-2xl ${isLight ? "border-white bg-white text-slate-700 shadow-gray-100" : "border-transparent bg-[#06090f] text-white shadow-black/30"}`}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Revenue Trend</h2>
                    <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Completed orders revenue by month</p>
                </div>
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-emerald-300"}`}>
                    {formatCurrency(totalRevenue)}
                </span>
            </div>

            <svg viewBox="0 0 560 230" className="h-72 w-full">
                {[40, 80, 120, 160].map((y) => (
                    <line
                        key={y}
                        x1="40"
                        x2="535"
                        y1={y}
                        y2={y}
                        stroke={isLight ? "rgba(15,118,110,0.12)" : "rgba(255,255,255,0.08)"}
                    />
                ))}

                <polyline
                    points={points}
                    fill="none"
                    stroke={isLight ? "#A280FF" : "#4de0c0"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                />

                {chartData.map((item, index) => {
                    const x = leftPadding + index * xStep;
                    const y = chartHeight - (item.revenue / maxRevenue) * 140;

                    return (
                        <g key={item.key}>
                            <circle cx={x} cy={y} r="5" fill={isLight ? "#A280FF" : "#4de0c0"} />
                            <text
                                x={x}
                                y="220"
                                textAnchor="middle"
                                className={`${isLight ? "fill-slate-400" : "fill-gray-400"} text-xs`}
                            >
                                {item.month}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const OrdersChart = () => {
    const { isLight } = useTheme();
    const maxOrders = Math.max(...chartData.map((item) => item.orders), 1);

    return (
        <div className={`rounded-lg border p-6 shadow-2xl ${isLight ? "border-white bg-white text-slate-700 shadow-gray-100" : "border-transparent bg-[#06090f] text-white shadow-black/30"}`}>
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Order Volume</h2>
                <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Orders compared by month</p>
            </div>

            <div className="flex h-72 items-end gap-4">
                {chartData.map((item) => (
                    <div key={item.key} className="flex flex-1 flex-col items-center gap-3">
                        <div className={`flex h-56 w-full items-end ${isLight ? "bg-white" : "bg-white/5"}`}>
                            <div
                                className={isLight ? "w-full bg-purple-300" : "w-full bg-gradient-to-t from-cyan-500 to-emerald-300"}
                                style={{ height: `${(item.orders / maxOrders) * 100}%` }}
                            ></div>
                        </div>
                        <span className={`text-xs ${isLight ? "text-slate-400" : "text-gray-400"}`}>{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
