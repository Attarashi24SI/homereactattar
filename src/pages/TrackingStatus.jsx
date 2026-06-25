import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import laundryPortalAPI, { formatCurrency, getProgressPercent } from "../services/laundryPortalAPI";
import { CheckCircle2, Clock3, SearchCheck, WalletCards } from "lucide-react";

const filters = ["All", "Processing", "Ready Pickup", "Completed", "Cancelled"];

const isProcessing = (status) => !["Ready Pickup", "Completed", "Cancelled"].includes(status);

export default function TrackingStatus() {
    const { isLight } = useTheme();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        laundryPortalAPI.fetchOrders(user).then((data) => {
            setOrders(data);
            setIsLoading(false);
        });
    }, [user]);

    const summary = useMemo(() => ({
        processing: orders.filter((order) => isProcessing(order.current_step)).length,
        completed: orders.filter((order) => order.current_step === "Completed").length,
        spending: orders.reduce((sum, order) => sum + Number(order.final_amount || 0), 0),
        points: orders.reduce((sum, order) => sum + Number(order.points_earned || 0), 0),
    }), [orders]);

    const filteredOrders = useMemo(() => orders.filter((order) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Processing") return isProcessing(order.current_step);
        return order.current_step === activeFilter;
    }), [activeFilter, orders]);

    const metrics = [
        { label: "Laundry in Progress", value: summary.processing, change: "Aktif", positive: true, description: "sedang diproses", icon: Clock3 },
        { label: "Completed Orders", value: summary.completed, change: "Selesai", positive: true, description: "order selesai", icon: CheckCircle2 },
        { label: "Total Spending", value: formatCurrency(summary.spending), change: "Member", positive: true, description: "total transaksi", icon: WalletCards },
        { label: "Reward Points", value: summary.points, change: "Points", positive: true, description: "poin diperoleh", icon: SearchCheck },
    ];

    return (
        <main className="space-y-6">
            <PageHeader title="Tracking" breadcrumb={["Home", "Tracking"]} />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
            </section>

            <section className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeFilter === filter ? isLight ? "bg-teal-600 text-white shadow-md" : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md" : isLight ? "border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700" : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
                    >
                        {filter}
                    </button>
                ))}
            </section>

            <section className="grid gap-4">
                {isLoading ? (
                    <div className={`rounded-2xl border p-6 text-sm ${isLight ? "border-slate-200 bg-white text-slate-500" : "border-white/5 bg-[#06090f] text-gray-400"}`}>Loading tracking...</div>
                ) : filteredOrders.length ? filteredOrders.map((order) => (
                    <OrderTrackingCard key={order.id} order={order} isLight={isLight} />
                )) : (
                    <div className={`rounded-2xl border p-6 text-sm ${isLight ? "border-slate-200 bg-white text-slate-500" : "border-white/5 bg-[#06090f] text-gray-400"}`}>Belum ada order pada filter ini.</div>
                )}
            </section>
        </main>
    );
}

function OrderTrackingCard({ order, isLight }) {
    const progress = getProgressPercent(order.current_step);

    return (
        <article className={`rounded-2xl border p-5 shadow-sm ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/35"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-teal-600" : "text-teal-300"}`}>{order.invoice_number || order.id}</p>
                    <h2 className={`mt-1 text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{order.service_name}</h2>
                    <p className={`mt-1 text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                        Estimasi selesai {order.estimated_finish ? new Date(order.estimated_finish).toLocaleString("id-ID") : "-"}
                    </p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(order.current_step, isLight)}`}>{order.current_step}</span>
                    <Link to={`/tracking/${order.invoice_number}`} className={`rounded-xl px-4 py-2 text-sm font-semibold ${isLight ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-cyan-500 text-white hover:bg-cyan-400"}`}>
                        View Detail
                    </Link>
                </div>
            </div>
            <div className="mt-4">
                <div className={`h-2 rounded-full ${isLight ? "bg-slate-100" : "bg-white/10"}`}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" style={{ width: `${progress}%` }} />
                </div>
                <div className={`mt-2 flex justify-between text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </article>
    );
}

const badgeClass = (status, isLight) => {
    if (status === "Completed") return isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/20 text-emerald-300";
    if (status === "Ready Pickup") return isLight ? "bg-amber-100 text-amber-700" : "bg-amber-500/20 text-amber-300";
    if (status === "Cancelled") return isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-300";
    return isLight ? "bg-teal-100 text-teal-700" : "bg-teal-500/20 text-teal-300";
};

