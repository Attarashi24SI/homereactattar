import React, { useRef } from "react";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../context/ThemeContext";

const notifications = [
    { title: "Order diterima", message: "Laundry pelanggan sudah masuk ke sistem.", time: "10 menit lalu" },
    { title: "Order selesai", message: "Pesanan siap diambil atau dikirim.", time: "1 jam lalu" },
    { title: "Pembayaran diterima", message: "Status pembayaran berhasil diperbarui.", time: "Kemarin" },
];

export default function Notifications() {
    const { isLight } = useTheme();

    // useRef 
    const latestNotificationRef = useRef(null);

    const scrollToLatestNotification = () => {
        latestNotificationRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <main className="space-y-6">
            <PageHeader title="Notifikasi" breadcrumb={["Home", "Notifikasi"]} />

            <button
                type="button"
                onClick={scrollToLatestNotification}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${isLight ? "bg-teal-100 text-teal-600 hover:bg-teal-200" : "bg-white/10 text-white hover:bg-white/15"}`}
            >
                Terbaru
            </button>

            <section className="space-y-3">
                {notifications.map((item, index) => (
                    <article
                        key={item.title}
                        ref={index === 0 ? latestNotificationRef : null}
                        className={`rounded-lg border p-5 shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 text-slate-700 shadow-teal-100" : "border-white/5 bg-[#06090f] text-white shadow-black/30"}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-semibold">{item.title}</h2>
                                <p className={`mt-1 text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>{item.message}</p>
                            </div>
                            <span className={`text-xs ${isLight ? "text-teal-600" : "text-emerald-300"}`}>{item.time}</span>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
