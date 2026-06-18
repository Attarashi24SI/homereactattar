import React from "react";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../context/ThemeContext";

const trackingSteps = ["Order diterima", "Dicuci", "Disetrika", "Siap diambil"];

export default function TrackingStatus() {
    const { isLight } = useTheme();
    const inputClass = `flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-teal-400 ${isLight ? "border-slate-100 bg-white text-slate-700 placeholder:text-slate-400" : "border-white/10 bg-[#0f1724] text-white placeholder:text-gray-500"}`;

    return (
        <main className="space-y-6">
            <PageHeader title="Tracking Status" breadcrumb={["Home", "Tracking Status"]} />

            <section className={`rounded-lg border p-5 shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 text-slate-700 shadow-teal-100" : "border-white/5 bg-[#06090f] text-white shadow-black/30"}`}>
                <div className="mb-5 flex gap-3">
                    <input className={inputClass} placeholder="Masukkan kode order" />
                    <button className={`rounded-lg px-5 py-2 text-sm font-semibold text-white ${isLight ? "bg-teal-500 hover:bg-teal-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                        Cek Status
                    </button>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    {trackingSteps.map((step, index) => (
                        <div key={step} className={`rounded-lg border p-4 ${isLight ? "border-teal-100 bg-white" : "border-white/5 bg-white/5"}`}>
                            <p className={`text-xs ${isLight ? "text-teal-600" : "text-emerald-300"}`}>Step {index + 1}</p>
                            <h3 className="mt-2 font-semibold">{step}</h3>
                            <p className={`mt-2 text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                {index < 2 ? "Selesai" : "Menunggu proses"}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
