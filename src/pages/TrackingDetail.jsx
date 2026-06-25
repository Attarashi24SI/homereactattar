import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../context/ThemeContext";
import laundryPortalAPI, { TRACKING_STEPS, formatCurrency, getProgressPercent, getStepIndex, STATUS_COPY } from "../services/laundryPortalAPI";
import { Check, Circle } from "lucide-react";

export default function TrackingDetail() {
    const { invoice } = useParams();
    const { isLight } = useTheme();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        laundryPortalAPI.fetchOrderByInvoice(invoice).then((data) => {
            setOrder(data);
            setIsLoading(false);
        });
    }, [invoice]);

    if (isLoading) {
        return <main><PageHeader title="Tracking Detail" breadcrumb={["Home", "Tracking", invoice]} /><p className={isLight ? "text-slate-500" : "text-gray-400"}>Loading detail...</p></main>;
    }

    if (!order) {
        return <main><PageHeader title="Tracking Detail" breadcrumb={["Home", "Tracking", invoice]} /><p className="text-red-500">Invoice tidak ditemukan.</p></main>;
    }

    const progress = getProgressPercent(order.current_step);
    const currentIndex = getStepIndex(order.current_step);

    return (
        <main className="space-y-6">
            <PageHeader title="Tracking Detail" breadcrumb={["Home", "Tracking", order.invoice_number]} />

            <section className={`rounded-2xl border p-6 shadow-sm ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/35"}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-teal-600" : "text-teal-300"}`}>Invoice Number</p>
                        <h1 className={`mt-1 text-2xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>{order.invoice_number}</h1>
                        <p className={`mt-2 text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Estimasi selesai {order.estimated_finish ? new Date(order.estimated_finish).toLocaleString("id-ID") : "-"}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${isLight ? "bg-teal-100 text-teal-700" : "bg-teal-500/20 text-teal-300"}`}>{order.current_step}</span>
                </div>
                <div className="mt-6">
                    <div className={`h-2 rounded-full ${isLight ? "bg-slate-100" : "bg-white/10"}`}>
                        <div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" style={{ width: `${progress}%` }} />
                    </div>
                    <div className={`mt-2 flex justify-between text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className={`rounded-2xl border p-5 shadow-sm ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/35"}`}>
                    <h2 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Timeline</h2>
                    <div className="mt-5 space-y-4">
                        {TRACKING_STEPS.map((step, index) => {
                            const done = index <= currentIndex;
                            const trackingRow = order.tracking.find((item) => item.status === step);
                            const [fallbackTitle, fallbackDescription] = STATUS_COPY[step] || [step, ""];
                            return (
                                <div key={step} className="flex gap-3">
                                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-teal-500 text-white" : isLight ? "bg-slate-100 text-slate-400" : "bg-white/10 text-gray-500"}`}>
                                        {done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isLight ? "text-slate-800" : "text-white"}`}>{trackingRow?.title || fallbackTitle}</p>
                                        <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>{trackingRow?.description || fallbackDescription}</p>
                                        {trackingRow?.created_at && <p className={`mt-1 text-xs ${isLight ? "text-slate-400" : "text-gray-500"}`}>{new Date(trackingRow.created_at).toLocaleString("id-ID")}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={`rounded-2xl border p-5 shadow-sm ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/35"}`}>
                    <h2 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Order Information</h2>
                    <div className="mt-4 space-y-3">
                        <Info label="Service" value={order.service_name} isLight={isLight} />
                        <Info label="Quantity" value={`${order.quantity} ${order.service_unit}`} isLight={isLight} />
                        <Info label="Price" value={formatCurrency(order.total_amount)} isLight={isLight} />
                        <Info label="Discount" value={`- ${formatCurrency(order.discount_applied)}`} isLight={isLight} />
                        <Info label="Final Price" value={formatCurrency(order.final_amount)} isLight={isLight} strong />
                        <Info label="Payment Status" value={order.payment_status || "-"} isLight={isLight} />
                        <Info label="Points Earned" value={`${order.points_earned || 0} pts`} isLight={isLight} />
                    </div>
                    <Link to="/tracking" className={`mt-5 block rounded-xl px-4 py-2 text-center text-sm font-semibold ${isLight ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-cyan-500 text-white hover:bg-cyan-400"}`}>Kembali ke Tracking</Link>
                </div>
            </section>
        </main>
    );
}

function Info({ label, value, isLight, strong = false }) {
    return (
        <div className={`flex items-start justify-between gap-4 border-b pb-3 text-sm ${isLight ? "border-slate-100" : "border-white/10"}`}>
            <span className={isLight ? "text-slate-500" : "text-gray-400"}>{label}</span>
            <span className={`${strong ? "font-black" : "font-semibold"} text-right ${isLight ? "text-slate-800" : "text-white"}`}>{value}</span>
        </div>
    );
}

