import React from "react";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../context/ThemeContext";
import payments from "../assets/data/payment.json";

export default function Payments() {
    const { isLight } = useTheme();

    return (
        <main className="space-y-6">
            <PageHeader title="Pembayaran" breadcrumb={["Home", "Pembayaran"]} />

            <section className={`rounded-lg border p-5 shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 text-slate-700 shadow-teal-100" : "border-white/5 bg-[#06090f] text-white shadow-black/30"}`}>
                <div className="grid gap-4 md:grid-cols-3">
                    {payments.slice(0, 12).map((payment) => (
                        <article key={payment.paymentId} className={`rounded-lg border p-4 ${isLight ? "border-teal-100 bg-white" : "border-white/5 bg-white/5"}`}>
                            <p className={`text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>{payment.paymentId}</p>
                            <h2 className="mt-2 font-semibold">{payment.orderId}</h2>
                            <p className={`mt-1 text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>{new Date(payment.paymentDate).toLocaleDateString("id-ID")}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span>{payment.paymentMethod}</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${payment.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                    {payment.paymentStatus}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
