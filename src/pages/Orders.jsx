import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, RefreshCw, Package, Clock } from "lucide-react";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";
import { StatusBadge } from "../components/Badge";
import { useTheme } from "../context/ThemeContext";
import adminOrdersAPI, { ORDER_STEPS } from "../services/adminOrdersAPI";

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));

const FILTER_OPTIONS = ["All", ...ORDER_STEPS];

export default function Orders() {
    const { isLight } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminOrdersAPI.fetchAdminOrders();
            setOrders(data);
        } catch (err) {
            console.error("Gagal mengambil orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        let result = orders;

        if (activeFilter !== "All") {
            result = result.filter((o) => o.current_step === activeFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (o) =>
                    (o.invoice_number || "").toLowerCase().includes(q) ||
                    (o.customer_name || "").toLowerCase().includes(q) ||
                    (o.customer_id || "").toLowerCase().includes(q) ||
                    (o.service_type || "").toLowerCase().includes(q)
            );
        }

        return result;
    }, [orders, activeFilter, searchQuery]);

    const metrics = useMemo(() => {
        const total = orders.length;
        const belumSelesai = orders.filter(
            (o) => o.current_step !== "Completed" && o.current_step !== "Cancelled"
        ).length;
        const readyPickup = orders.filter((o) => o.current_step === "Ready Pickup").length;
        const completed = orders.filter((o) => o.current_step === "Completed").length;
        const cancelled = orders.filter((o) => o.current_step === "Cancelled").length;

        return [
            {
                label: "Total Orders",
                value: total,
                change: `${total} total`,
                positive: true,
                description: "semua order masuk",
            },
            {
                label: "Belum Selesai",
                value: belumSelesai,
                change: `${belumSelesai} aktif`,
                positive: false,
                description: "order dalam proses",
            },
            {
                label: "Ready Pickup",
                value: readyPickup,
                change: `${readyPickup} siap`,
                positive: true,
                description: "menunggu diambil",
            },
            {
                label: "Order Selesai",
                value: completed,
                change: `${completed} done`,
                positive: true,
                description: "pesanan selesai",
            },
            {
                label: "Cancelled",
                value: cancelled,
                change: `${cancelled} batal`,
                positive: false,
                description: "pesanan dibatalkan",
            },
        ];
    }, [orders]);

    return (
        <main className="space-y-6">
            <PageHeader title="Orders Management" breadcrumb={["Home", "Orders"]} />

            {/* Summary Cards */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {metrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                ))}
            </section>

            {/* Search & Filter Bar */}
            <div className={`flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f]/95 shadow-black/35"}`}>
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isLight ? "text-slate-400" : "text-gray-500"}`} />
                    <input
                        type="text"
                        placeholder="Cari invoice, nama pelanggan, customer ID, service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${isLight ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400" : "border-white/10 bg-white/5 text-white placeholder:text-gray-500"}`}
                    />
                </div>

                {/* Refresh */}
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 ${isLight ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"}`}
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className={`flex flex-wrap gap-2 ${isLight ? "" : ""}`}>
                {FILTER_OPTIONS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                            activeFilter === filter
                                ? isLight
                                    ? "border-teal-300 bg-teal-500 text-white shadow-md shadow-teal-500/20"
                                    : "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                                : isLight
                                    ? "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-600"
                                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            {loading ? (
                <div className={`flex items-center justify-center rounded-2xl border py-20 shadow-xl ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                    <div className="flex flex-col items-center gap-3">
                        <RefreshCw className={`h-8 w-8 animate-spin ${isLight ? "text-teal-500" : "text-emerald-400"}`} />
                        <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>Memuat data orders...</p>
                    </div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className={`flex items-center justify-center rounded-2xl border py-20 shadow-xl ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                    <div className="flex flex-col items-center gap-3">
                        <Package className={`h-12 w-12 ${isLight ? "text-slate-300" : "text-gray-600"}`} />
                        <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>Tidak ada order ditemukan.</p>
                    </div>
                </div>
            ) : (
                <DataTable
                    columns={["Invoice", "Pelanggan", "Service", "Total", "Payment", "Status", "Created At", "Est. Finish", "Aksi"]}
                >
                    {filteredOrders.map((order) => (
                        <tr
                            key={order.id}
                            className={`transition-colors ${isLight ? "hover:bg-teal-50/70" : "hover:bg-white/5"}`}
                        >
                            <td className={`border-b px-6 py-4 font-semibold ${isLight ? "border-slate-100 text-teal-700" : "border-white/5 text-emerald-400"}`}>
                                {order.invoice_number || "-"}
                            </td>
                            <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                                <div>
                                    <p className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>{order.customer_name}</p>
                                    <p className={`text-xs ${isLight ? "text-slate-400" : "text-gray-500"}`}>{order.customer_id}</p>
                                </div>
                            </td>
                            <td className={`border-b px-6 py-4 text-sm ${isLight ? "border-slate-100 text-slate-600" : "border-white/5 text-gray-400"}`}>
                                {order.service_type || "-"}
                            </td>
                            <td className={`border-b px-6 py-4 font-medium ${isLight ? "border-slate-100 text-slate-800" : "border-white/5 text-white"}`}>
                                {formatCurrency(order.final_amount || order.total_amount)}
                            </td>
                            <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                                <StatusBadge status={order.payment_status || "Unpaid"} />
                            </td>
                            <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                                <StatusBadge status={order.current_step} />
                            </td>
                            <td className={`border-b px-6 py-4 text-sm ${isLight ? "border-slate-100 text-slate-600" : "border-white/5 text-gray-400"}`}>
                                {formatDate(order.created_at)}
                            </td>
                            <td className={`border-b px-6 py-4 text-sm ${isLight ? "border-slate-100 text-slate-600" : "border-white/5 text-gray-400"}`}>
                                {formatDate(order.estimated_finish)}
                            </td>
                            <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                                <Link
                                    to={`/orders/${order.id}`}
                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:shadow-md ${isLight ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"}`}
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    Kelola
                                </Link>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            )}
        </main>
    );
}
