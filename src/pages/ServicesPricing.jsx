import React from "react";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../context/ThemeContext";
import services from "../Laporanp4/data/data.json";

const formatPrice = (price) => new Intl.NumberFormat("id-ID").format(price * 1000);

export default function ServicesPricing() {
    const { isLight } = useTheme();

    return (
        <main className="space-y-6">
            <PageHeader title="Layanan & Harga" breadcrumb={["Home", "Layanan & Harga"]} />

            <section className={`rounded-lg border p-5 shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 text-slate-700 shadow-teal-100" : "border-white/5 bg-[#06090f] text-white shadow-black/30"}`}>
                <div className="mb-4 flex justify-end">
                    <button className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${isLight ? "bg-rose-400 hover:bg-rose-500" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                        + Tambah Layanan
                    </button>
                </div>

                <div className={`overflow-auto rounded-lg border ${isLight ? "border-slate-100" : "border-white/5"}`}>
                    <table className={`w-full min-w-[640px] text-left text-sm ${isLight ? "text-slate-700" : "text-gray-300"}`}>
                        <thead className={`text-xs uppercase tracking-wide ${isLight ? "bg-white text-slate-400" : "bg-[#0f1724] text-gray-400"}`}>
                            <tr>
                                <th className="px-5 py-4">Layanan</th>
                                <th className="px-5 py-4">Kategori</th>
                                <th className="px-5 py-4">Harga</th>
                                <th className="px-5 py-4">Rating</th>
                                <th className="px-5 py-4">Penyedia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className={`border-t ${isLight ? "border-slate-100 hover:bg-white" : "border-white/5 hover:bg-white/5"}`}>
                                    <td className={`px-5 py-4 font-medium ${isLight ? "text-slate-700" : "text-white"}`}>{service.name}</td>
                                    <td className="px-5 py-4">{service.category}</td>
                                    <td className="px-5 py-4">Rp {formatPrice(service.price)}</td>
                                    <td className="px-5 py-4">{service.rating}</td>
                                    <td className="px-5 py-4">{service.provider?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
