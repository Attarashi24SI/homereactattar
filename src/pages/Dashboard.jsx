import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import ordersData from "../assets/data/order.json";
import customersData from "../assets/data/customer.json";
import paymentsData from "../assets/data/payment.json";
import MetricCard from "../components/MetricCard";
import TopServicesTable from "../components/TopServicesTable";
import { useTheme } from "../context/ThemeContext";

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);

const formatCompactCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
    }).format(value);

const getOrderSummary = () => {
    const completedOrders = ordersData.filter((order) => order.status === "Completed");
    const pendingOrders = ordersData.filter((order) => order.status === "Pending");
    const cancelledOrders = ordersData.filter((order) => order.status === "Cancelled");
    const paidPayments = paymentsData.filter((payment) => payment.paymentStatus === "Paid");
    const unpaidPayments = paymentsData.filter((payment) => payment.paymentStatus === "Unpaid");
    const revenue = completedOrders.reduce(
        (total, order) => total + order.total,
        0,
    );

    return {
        revenue,
        totalOrders: ordersData.length,
        totalCustomers: customersData.length,
        totalPayments: paymentsData.length,
        completed: completedOrders.length,
        pending: pendingOrders.length,
        cancelled: cancelledOrders.length,
        paid: paidPayments.length,
        unpaid: unpaidPayments.length,
    };
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartData = Object.values(
    ordersData.reduce((result, order) => {
        const date = new Date(order.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!result[key]) {
            result[key] = {
                key,
                month: monthNames[date.getMonth()],
                year: date.getFullYear(),
                revenue: 0,
                orders: 0,
                completed: 0,
            };
        }

        result[key].orders += 1;

        if (order.status === "Completed") {
            result[key].revenue += order.total;
            result[key].completed += 1;
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
            change: `${summary.completed} completed`,
            positive: true,
            description: "from completed orders",
            line: "M8 35 C18 22 28 22 38 36 S58 52 70 32 S88 9 104 16",
        },
        {
            label: "Total Customers",
            value: summary.totalCustomers,
            change: "Customers",
            positive: true,
            description: "registered customers",
            line: "M8 32 C18 34 24 18 34 21 S43 6 51 23 S63 17 70 31 S88 28 104 43",
        },
        {
            label: "Total Orders",
            value: summary.totalOrders,
            change: `${summary.pending} pending`,
            positive: true,
            description: `${summary.cancelled} cancelled`,
            line: "M8 31 C18 22 26 35 35 25 S50 34 57 44 S68 8 82 17 S94 25 104 18",
        },
        {
            label: "Paid Payments",
            value: summary.paid,
            change: `${summary.unpaid} unpaid`,
            positive: true,
            description: `${summary.totalPayments} total payments`,
            line: "M8 24 C18 38 26 30 35 36 S50 20 58 28 S75 42 86 28 S96 18 104 23",
        },
        {
            label: "Completed Orders",
            value: summary.completed,
            change: "Done",
            positive: true,
            description: "successful orders",
            line: "M8 18 C18 28 25 42 38 34 S55 13 68 25 S84 45 104 38",
        },
    ];

    return (
        <main className="space-y-5">
            <PageHeader
                title="Dashboard"
                breadcrumb={["Home", "Dashboard"]}
            />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {metrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[2fr_1fr_1fr]">
                <RevenueChart />
                <OrdersChart />
                <TopServicesTable />
            </section>
        </main>
    );
};

const RevenueChart = () => {
    const { isLight } = useTheme();
    const [hovered, setHovered] = useState(null);

    const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);

    const chartWidth = 560;
    const chartHeight = 190;
    const leftPadding = 60;
    const rightPadding = 25;

    const xStep =
        chartData.length > 1
            ? (chartWidth - leftPadding - rightPadding) /
            (chartData.length - 1)
            : 0;

    const getPointX = (index) =>
        chartData.length > 1
            ? leftPadding + index * xStep
            : chartWidth / 2;

    const getPointY = (revenue) =>
        chartHeight - (revenue / maxRevenue) * 165;

    const points = chartData
        .map((item, index) => {
            const x = getPointX(index);
            const y = getPointY(item.revenue);

            return `${x},${y}`;
        })
        .join(" ");

    const totalRevenue = chartData.reduce(
        (total, item) => total + item.revenue,
        0,
    );

    const yAxisLabels = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div
            className={`relative rounded-2xl border p-5 shadow-xl ${isLight
                ? "border-slate-200/80 bg-white text-slate-700 shadow-slate-200/70"
                : "border-transparent bg-[#06090f] text-white shadow-black/30"
                }`}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2
                        className={`text-lg font-bold tracking-tight ${isLight
                            ? "text-slate-950"
                            : "text-white"
                            }`}
                    >
                        Revenue Trend
                    </h2>

                    <p
                        className={`mt-1 text-sm font-medium ${isLight
                            ? "text-slate-500"
                            : "text-gray-400"
                            }`}
                    >
                        Completed orders revenue by month
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1.5 text-sm font-bold ${isLight
                        ? "bg-teal-50 text-teal-700 ring-1 ring-teal-100"
                        : "bg-emerald-500/10 text-emerald-300"
                        }`}
                >
                    {formatCurrency(totalRevenue)}
                </span>
            </div>

            <div className="relative">
                <svg
                    viewBox="0 0 560 230"
                    className={`h-72 w-full rounded-2xl border ${isLight
                        ? "border-slate-100 bg-gradient-to-b from-slate-50 to-white"
                        : "border-white/5 bg-white/[0.03]"
                        }`}
                >
                    {yAxisLabels.map((value, index) => {
                        const y = 180 - value * 160;

                        const revenueValue = Math.round(
                            (maxRevenue * value) / 1000000,
                        );

                        return (
                            <g key={index}>
                                <line
                                    x1="55"
                                    x2="535"
                                    y1={y}
                                    y2={y}
                                    stroke={
                                        isLight
                                            ? "rgba(148,163,184,0.15)"
                                            : "rgba(255,255,255,0.06)"
                                    }
                                />

                                <text
                                    x="48"
                                    y={y + 4}
                                    textAnchor="end"
                                    className={`text-[10px] ${isLight
                                        ? "fill-slate-400"
                                        : "fill-gray-500"
                                        }`}
                                >
                                    {revenueValue} jt
                                </text>
                            </g>
                        );
                    })}

                    {hovered && (
                        <line
                            x1={hovered.x}
                            x2={hovered.x}
                            y1="20"
                            y2="190"
                            stroke="#14b8a6"
                            strokeDasharray="5 5"
                            opacity="0.7"
                        />
                    )}

                    <polyline
                        points={points}
                        fill="none"
                        stroke={
                            isLight
                                ? "#14b8a6"
                                : "#4de0c0"
                        }
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                    />

                    {chartData.map((item, index) => {
                        const x = getPointX(index);
                        const y = getPointY(item.revenue);

                        return (
                            <g key={item.key}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={
                                        hovered?.key === item.key
                                            ? 8
                                            : 5
                                    }
                                    fill={
                                        isLight
                                            ? "#14b8a6"
                                            : "#4de0c0"
                                    }
                                    className="cursor-pointer transition-all duration-150"
                                    onMouseEnter={() =>
                                        setHovered({
                                            ...item,
                                            x,
                                            y,
                                        })
                                    }
                                    onMouseLeave={() =>
                                        setHovered(null)
                                    }
                                />

                                <text
                                    x={x}
                                    y="220"
                                    textAnchor="middle"
                                    className={`text-xs ${isLight
                                        ? "fill-slate-400"
                                        : "fill-gray-400"
                                        }`}
                                >
                                    {item.month}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {hovered && (
                    <div
                        className="pointer-events-none absolute z-20 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
                        style={{
                            left: `${(hovered.x / 560) * 100}%`,
                            top: "95px",
                            transform: "translateX(-50%)",
                        }}
                    >
                        <p className="text-xs text-slate-500">
                            {hovered.month} {hovered.year}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                            Revenue
                        </p>

                        <p className="text-sm font-bold text-slate-900">
                            {formatCurrency(
                                hovered.revenue,
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const OrdersChart = () => {
    const { isLight } = useTheme();
    const [hovered, setHovered] = useState(null);
    const maxOrders = Math.max(...chartData.map((item) => item.orders), 1);

    return (
        <div className={`rounded-2xl border p-5 shadow-xl ${isLight ? "border-slate-200/80 bg-white text-slate-700 shadow-slate-200/70" : "border-transparent bg-[#06090f] text-white shadow-black/30"}`}>
            <div className="mb-4">
                <h2 className={`text-lg font-bold tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}>Order Volume</h2>
                <p className={`mt-1 text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>Orders compared by month</p>
            </div>

            <div className={`flex h-72 items-end gap-3 rounded-2xl border p-4 ${isLight ? "border-slate-100 bg-gradient-to-b from-slate-50 to-white" : "border-white/5 bg-white/[0.03]"}`}>
                {chartData.map((item) => (
                    <div
                        key={item.key}
                        className="relative flex flex-1 flex-col items-center gap-3"
                        onMouseEnter={() => setHovered(item)}
                        onMouseLeave={() => setHovered(null)}
                    >

                        {/* Tooltip Element (pointer-events-none to avoid leaving the bar) */}
                        {hovered?.key === item.key && (
                            <div className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -top-14 z-50 rounded-xl border p-2 shadow-xl whitespace-nowrap transition-all duration-150 ${isLight ? "border-slate-200 bg-white text-slate-900 shadow-slate-200/50" : "border-white/10 bg-[#1a1f2b] text-white shadow-black/50"}`}>
                                <p className={`text-[10px] font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                    {item.month} {item.year}
                                </p>
                                <p className="text-xs font-bold">
                                    {item.orders} Orders
                                </p>
                            </div>
                        )}

                        <div className={`flex h-48 w-full items-end rounded-xl ${isLight ? "bg-teal-50/80 ring-1 ring-teal-100/70" : "bg-white/5"}`}>
                            <div
                                className={isLight ? "w-full rounded-t-xl bg-gradient-to-t from-teal-500 to-cyan-300 shadow-[0_-8px_18px_rgba(20,184,166,0.18)]" : "w-full rounded-t-lg bg-gradient-to-t from-cyan-500 to-emerald-300"}
                                style={{ height: `${(item.orders / maxOrders) * 100}%` }}
                            ></div>
                        </div>
                        <div className="text-center">
                            <p className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-gray-200"}`}>{item.orders} orders</p>
                            <span className={`text-xs ${isLight ? "text-slate-400" : "text-gray-400"}`}>{item.month}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
