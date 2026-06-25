import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    User,
    CreditCard,
    Clock,
    Truck,
    Calendar,
    CheckCircle2,
    Circle,
    AlertCircle,
    Save,
    RefreshCw,
    MapPin,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import { StatusBadge } from "../components/Badge";
import { useTheme } from "../context/ThemeContext";
import adminOrdersAPI, { ORDER_STEPS } from "../services/adminOrdersAPI";

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));

const PAYMENT_OPTIONS = ["Unpaid", "Paid", "Refunded", "Cancelled"];

export default function OrdersDetail() {
    const { id } = useParams();
    const { isLight } = useTheme();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [newStatus, setNewStatus] = useState("");
    const [newPayment, setNewPayment] = useState("");
    const [newEstimate, setNewEstimate] = useState("");

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const data = await adminOrdersAPI.fetchAdminOrderById(id);
            setOrder(data);
            if (data) {
                setNewStatus(data.current_step || "Pending");
                setNewPayment(data.payment_status || "Unpaid");
                setNewEstimate(data.estimated_finish ? data.estimated_finish.slice(0, 16) : "");
            }
        } catch (err) {
            console.error("Gagal mengambil detail order:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === order.current_step) return;
        setSaving(true);
        try {
            await adminOrdersAPI.updateOrderStatus(order.id, newStatus);
            showMessage("success", `Status berhasil diubah ke "${newStatus}".`);
            await fetchOrder();
        } catch (err) {
            showMessage("error", err.message || "Gagal mengubah status.");
        } finally {
            setSaving(false);
        }
    };

    const handlePaymentUpdate = async () => {
        if (!newPayment || newPayment === order.payment_status) return;
        setSaving(true);
        try {
            await adminOrdersAPI.updatePaymentStatus(order.id, newPayment);
            showMessage("success", `Payment status berhasil diubah ke "${newPayment}".`);
            await fetchOrder();
        } catch (err) {
            showMessage("error", err.message || "Gagal mengubah payment status.");
        } finally {
            setSaving(false);
        }
    };

    const handleEstimateUpdate = async () => {
        if (!newEstimate) return;
        setSaving(true);
        try {
            await adminOrdersAPI.updateEstimatedFinish(order.id, new Date(newEstimate).toISOString());
            showMessage("success", "Estimate finish berhasil diubah.");
            await fetchOrder();
        } catch (err) {
            showMessage("error", err.message || "Gagal mengubah estimate finish.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="space-y-6">
                <PageHeader title="Order Detail" breadcrumb={["Home", "Orders", "Detail"]} />
                <div className={`flex items-center justify-center rounded-2xl border py-20 shadow-xl ${isLight ? "border-slate-200 bg-white" : "border-white/5 bg-[#06090f]"}`}>
                    <div className="flex flex-col items-center gap-3">
                        <RefreshCw className={`h-8 w-8 animate-spin ${isLight ? "text-teal-500" : "text-emerald-400"}`} />
                        <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>Memuat detail order...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="space-y-6">
                <PageHeader title="Order Detail" breadcrumb={["Home", "Orders", "Detail"]} />
                <div className={`flex flex-col items-center justify-center rounded-2xl border py-20 shadow-xl ${isLight ? "border-slate-200 bg-white" : "border-white/5 bg-[#06090f]"}`}>
                    <AlertCircle className={`h-12 w-12 mb-3 ${isLight ? "text-slate-300" : "text-gray-600"}`} />
                    <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>Order tidak ditemukan.</p>
                    <Link to="/orders" className={`mt-4 text-sm font-semibold ${isLight ? "text-teal-600 hover:text-teal-700" : "text-emerald-400 hover:text-emerald-300"}`}>
                        Kembali ke daftar orders
                    </Link>
                </div>
            </main>
        );
    }

    const items = order.items || [];
    const tracking = order.tracking || [];

    const summaryMetrics = [
        {
            label: "Total Amount",
            value: formatCurrency(order.total_amount),
            change: "sebelum diskon",
            positive: true,
            description: "subtotal order",
        },
        {
            label: "Discount",
            value: formatCurrency(order.discount_applied),
            change: "diskon",
            positive: false,
            description: "tier discount",
        },
        {
            label: "Final Amount",
            value: formatCurrency(order.final_amount),
            change: "setelah diskon",
            positive: true,
            description: "yang harus dibayar",
        },
        {
            label: "Points Earned",
            value: order.points_earned || 0,
            change: "poin",
            positive: true,
            description: "poin didapat",
        },
    ];

    const stepIndex = ORDER_STEPS.indexOf(order.current_step);
    const progressPercent = Math.round((Math.max(0, stepIndex) / (ORDER_STEPS.length - 2)) * 100);

    return (
        <main className="space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    to="/orders"
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:shadow-md ${isLight ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"}`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Link>
            </div>

            <PageHeader
                title={`Order ${order.invoice_number || ""}`}
                breadcrumb={["Home", "Orders", order.invoice_number || "Detail"]}
            />

            {message && (
                <div className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
                    message.type === "success"
                        ? isLight
                            ? "border-teal-200 bg-teal-50 text-teal-700"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : isLight
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}>
                    {message.type === "success" ? "\u2713" : "\u2717"} {message.text}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryMetrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                ))}
            </section>

            <div className={`rounded-2xl border p-5 shadow-xl ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Progress Order</h3>
                    <StatusBadge status={order.current_step} />
                </div>
                <div className={`w-full h-2.5 rounded-full ${isLight ? "bg-slate-100" : "bg-white/10"}`}>
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isLight ? "bg-gradient-to-r from-teal-500 to-cyan-400" : "bg-gradient-to-r from-emerald-500 to-cyan-400"}`}
                        style={{ width: `${Math.max(5, progressPercent)}%` }}
                    />
                </div>
                <p className={`mt-2 text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>{progressPercent}% selesai</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <div className="space-y-6">
                    <div className={`rounded-2xl border p-6 shadow-xl ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                        <h3 className={`mb-4 flex items-center gap-2 text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                            <Package className={`h-4 w-4 ${isLight ? "text-teal-500" : "text-emerald-400"}`} />
                            Informasi Order
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoRow label="Invoice Number" value={order.invoice_number} isLight={isLight} />
                            <InfoRow label="Service Type" value={order.service_type} isLight={isLight} />
                            <InfoRow label="Pickup Method" value={order.pickup_method} icon={<MapPin className="h-3.5 w-3.5" />} isLight={isLight} />
                            <InfoRow label="Payment Status" value={order.payment_status} badge isLight={isLight} />
                            <InfoRow label="Current Step" value={order.current_step} badge isLight={isLight} />
                            <InfoRow label="Created At" value={formatDate(order.created_at)} isLight={isLight} />
                            <InfoRow label="Estimated Finish" value={formatDate(order.estimated_finish)} isLight={isLight} />
                            <InfoRow label="Updated At" value={formatDate(order.updated_at)} isLight={isLight} />
                        </div>
                    </div>

                    <div className={`rounded-2xl border p-6 shadow-xl ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                        <h3 className={`mb-4 flex items-center gap-2 text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                            <User className={`h-4 w-4 ${isLight ? "text-teal-500" : "text-emerald-400"}`} />
                            Informasi Pelanggan
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoRow label="Nama" value={order.customer_name} isLight={isLight} />
                            <InfoRow label="Customer ID" value={order.customer_id} isLight={isLight} />
                            <InfoRow label="User ID" value={order.user_id} isLight={isLight} />
                        </div>
                    </div>

                    <div className={`rounded-2xl border p-6 shadow-xl ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                        <h3 className={`mb-4 flex items-center gap-2 text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                            <Truck className={`h-4 w-4 ${isLight ? "text-teal-500" : "text-emerald-400"}`} />
                            Item Pesanan
                        </h3>
                        {items.length === 0 ? (
                            <p className={`text-sm ${isLight ? "text-slate-400" : "text-gray-500"}`}>Tidak ada item.</p>
                        ) : (
                            <div className={`overflow-x-auto rounded-xl border ${isLight ? "border-slate-200" : "border-white/10"}`}>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isLight ? "bg-slate-50" : "bg-white/5"}>
                                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"}`}>Produk</th>
                                            <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"}`}>Qty</th>
                                            <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"}`}>Harga</th>
                                            <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"}`}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, idx) => (
                                            <tr key={item.id || idx} className={`border-t ${isLight ? "border-slate-100" : "border-white/5"}`}>
                                                <td className={`px-4 py-3 font-medium ${isLight ? "text-slate-800" : "text-white"}`}>
                                                    {item.products?.name || item.product_id || "-"}
                                                </td>
                                                <td className={`px-4 py-3 text-center ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                                                    {item.quantity}
                                                </td>
                                                <td className={`px-4 py-3 text-right ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td className={`px-4 py-3 text-right font-medium ${isLight ? "text-slate-800" : "text-white"}`}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`rounded-2xl border p-6 shadow-xl ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                        <h3 className={`mb-4 flex items-center gap-2 text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                            <CheckCircle2 className={`h-4 w-4 ${isLight ? "text-teal-500" : "text-emerald-400"}`} />
                            Kelola Status
                        </h3>

                        <div className="mb-4">
                            <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                Order Status
                            </label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${isLight ? "border-slate-200 bg-slate-50 text-slate-900" : "border-white/10 bg-white/5 text-white"}`}
                            >
                                {ORDER_STEPS.map((step) => (
                                    <option key={step} value={step}>{step}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={saving || newStatus === order.current_step}
                                className={`mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isLight
                                        ? "bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-500/20"
                                        : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                                }`}
                            >
                                <Save className="h-4 w-4" />
                                {saving ? "Menyimpan..." : "Ubah Status"}
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                Payment Status
                            </label>
                            <select
                                value={newPayment}
                                onChange={(e) => setNewPayment(e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${isLight ? "border-slate-200 bg-slate-50 text-slate-900" : "border-white/10 bg-white/5 text-white"}`}
                            >
                                {PAYMENT_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <button
                                onClick={handlePaymentUpdate}
                                disabled={saving || newPayment === order.payment_status}
                                className={`mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isLight
                                        ? "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20"
                                        : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                                }`}
                            >
                                <CreditCard className="h-4 w-4" />
                                {saving ? "Menyimpan..." : "Ubah Payment"}
                            </button>
                        </div>

                        <div>
                            <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                Estimated Finish
                            </label>
                            <input
                                type="datetime-local"
                                value={newEstimate}
                                onChange={(e) => setNewEstimate(e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${isLight ? "border-slate-200 bg-slate-50 text-slate-900" : "border-white/10 bg-white/5 text-white"}`}
                            />
                            <button
                                onClick={handleEstimateUpdate}
                                disabled={saving || !newEstimate}
                                className={`mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isLight
                                        ? "bg-slate-500 text-white hover:bg-slate-600 shadow-md shadow-slate-500/20"
                                        : "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border border-gray-500/30"
                                }`}
                            >
                                <Calendar className="h-4 w-4" />
                                {saving ? "Menyimpan..." : "Ubah Estimate"}
                            </button>
                        </div>
                    </div>

                    <div className={`rounded-2xl border p-6 shadow-xl ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
                        <h3 className={`mb-4 flex items-center gap-2 text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                            <Clock className={`h-4 w-4 ${isLight ? "text-teal-500" : "text-emerald-400"}`} />
                            Tracking Timeline
                        </h3>
                        {tracking.length === 0 ? (
                            <p className={`text-sm ${isLight ? "text-slate-400" : "text-gray-500"}`}>Belum ada tracking.</p>
                        ) : (
                            <div className="relative ml-1 space-y-0">
                                {tracking.map((track, idx) => {
                                    const isLast = idx === tracking.length - 1;
                                    return (
                                        <div key={track.id || idx} className="relative flex gap-3 pb-6 last:pb-0">
                                            {!isLast && (
                                                <div className={`absolute left-[9px] top-5 h-full w-0.5 ${isLight ? "bg-slate-200" : "bg-white/10"}`} />
                                            )}
                                            <div className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                                isLast
                                                    ? isLight
                                                        ? "bg-teal-500 text-white"
                                                        : "bg-emerald-500 text-white"
                                                    : isLight
                                                        ? "bg-slate-200 text-slate-500"
                                                        : "bg-white/10 text-gray-400"
                                            }`}>
                                                {isLast ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-2 w-2" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold ${isLast ? (isLight ? "text-teal-700" : "text-emerald-300") : (isLight ? "text-slate-700" : "text-gray-300")}`}>
                                                    {track.title || track.status}
                                                </p>
                                                {track.description && (
                                                    <p className={`mt-0.5 text-xs ${isLight ? "text-slate-500" : "text-gray-500"}`}>
                                                        {track.description}
                                                    </p>
                                                )}
                                                <p className={`mt-1 text-[11px] ${isLight ? "text-slate-400" : "text-gray-600"}`}>
                                                    {formatDate(track.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

function InfoRow({ label, value, icon, badge, isLight }) {
    return (
        <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-gray-500"}`}>{label}</p>
            <div className="mt-1 flex items-center gap-1.5">
                {icon && <span className={isLight ? "text-slate-400" : "text-gray-500"}>{icon}</span>}
                {badge ? (
                    <StatusBadge status={value} />
                ) : (
                    <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-white"}`}>{value || "-"}</p>
                )}
            </div>
        </div>
    );
}
