import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import laundryPortalAPI from "../../services/laundryPortalAPI";
import ServiceCard from "../../components/ServiceCard";
import ServiceCardSkeleton from "../../components/ServiceCardSkeleton";
import { Star, MessageSquareText } from "lucide-react";

export default function Home() {
    const { isLoggedIn, user, logout } = useAuth();
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [testimonialsLoading, setTestimonialsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(3);

    useEffect(() => {
        laundryPortalAPI.fetchServices().then((data) => {
            setServices(data);
            setServicesLoading(false);
        });
    }, []);

    const fetchTestimonialsData = useCallback(async () => {
        const data = await laundryPortalAPI.fetchTestimonials();
        setTestimonials(data);
        setTestimonialsLoading(false);
    }, []);

    useEffect(() => {
        fetchTestimonialsData();
        const interval = setInterval(fetchTestimonialsData, 30000);
        return () => clearInterval(interval);
    }, [fetchTestimonialsData]);

    // Responsive cards per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCardsPerPage(1);
            } else if (window.innerWidth < 1024) {
                setCardsPerPage(2);
            } else {
                setCardsPerPage(3);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Paginate testimonials into pages
    const pages = [];
    for (let i = 0; i < testimonials.length; i += cardsPerPage) {
        pages.push(testimonials.slice(i, i + cardsPerPage));
    }
    const totalPages = pages.length;

    // Reset current page if out of bounds after resize
    useEffect(() => {
        if (currentPage >= totalPages) {
            setCurrentPage(Math.max(0, totalPages - 1));
        }
    }, [currentPage, totalPages]);

    // Auto-rotation
    useEffect(() => {
        if (totalPages <= 1) return;
        const interval = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages);
        }, 5000);
        return () => clearInterval(interval);
    }, [totalPages]);

    const goToPage = useCallback((index) => {
        setCurrentPage(index);
    }, []);

    const prevPage = useCallback(() => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }, [totalPages]);

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    }, [totalPages]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={18}
                fill={i < rating ? "#f59e0b" : "transparent"}
                stroke={i < rating ? "#f59e0b" : "#d1d5db"}
                strokeWidth={1.5}
                className="transition-all duration-200"
            />
        ));
    };

    return (
        <div className="min-h-screen bg-white font-['DM_Sans',sans-serif]">
            {/* ── HEADER ── */}
            <header className="sticky top-0 z-50 border-b border-teal-100 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 no-underline">
                        <img
                            src="/img/BrightWashNoBg.png"
                            alt="BrightWash"
                            className="h-9 w-9 object-contain"
                        />
                        <span className="font-['DM_Serif_Display',serif] text-[1.3rem] text-teal-700 no-underline">
                            BrightWash
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {[
                            { label: "Layanan", href: "#layanan" },
                            { label: "Testimoni", href: "#testimoni" },
                            { label: "Tentang", href: "#tentang" },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-gray-700 no-underline transition-colors duration-200 hover:text-teal-500"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Auth Buttons / Profile */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/member-portal"
                                    className="rounded-xl border-[1.5px] border-teal-500 bg-teal-500 px-5 py-2 text-sm font-medium text-white no-underline shadow-lg shadow-teal-500/25 transition-all duration-200 hover:border-teal-700 hover:bg-teal-700"
                                >
                                    Member Portal
                                </Link>

                                {/* Profile Avatar + Info */}
                                <div className="flex cursor-default items-center gap-2.5 rounded-xl border-[1.5px] border-teal-100 bg-teal-50 py-1.5 pl-1.5 pr-3.5 transition-all duration-200">
                                    {/* Avatar */}
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
                                        style={{
                                            background:
                                                user?.plan === "platinum"
                                                    ? "linear-gradient(135deg, #475569, #1e293b)"
                                                    : user?.plan === "gold"
                                                        ? "linear-gradient(135deg, #f59e0b, #d97706)"
                                                        : "linear-gradient(135deg, #94a3b8, #64748b)",
                                            boxShadow: "0 2px 8px rgba(20,184,166,0.2)",
                                        }}
                                    >
                                        {(user?.fullname || user?.username || "U").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + Tier */}
                                    <div className="leading-tight">
                                        <p className="text-[0.8rem] font-semibold text-teal-700">
                                            {user?.fullname || user?.username}
                                        </p>
                                        <span
                                            className="text-[0.65rem] font-bold uppercase tracking-wider"
                                            style={{
                                                color:
                                                    user?.plan === "platinum"
                                                        ? "#475569"
                                                        : user?.plan === "gold"
                                                            ? "#d97706"
                                                            : "#64748b",
                                            }}
                                        >
                                            {user?.membershipData?.membershipLevel || user?.plan || "Member"}
                                        </span>
                                    </div>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={() => {
                                        logout();
                                    }}
                                    title="Logout"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border-[1.5px] border-red-200 bg-transparent text-red-500 transition-all duration-200 hover:bg-red-50"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-xl border-[1.5px] border-teal-500 bg-transparent px-5 py-2 text-sm font-medium text-teal-500 no-underline transition-all duration-200 hover:bg-teal-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-xl border-[1.5px] border-teal-500 bg-teal-500 px-5 py-2 text-sm font-medium text-white no-underline shadow-lg shadow-teal-500/25 transition-all duration-200 hover:border-teal-700 hover:bg-teal-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ── HERO ── */}
            <section className="relative overflow-hidden">
                {/* Decorative blobs */}
                <div
                    className="pointer-events-none absolute -top-28 right-[-80px] h-[400px] w-[400px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
                    }}
                />
                <div
                    className="pointer-events-none absolute -bottom-14 left-[-40px] h-[250px] w-[250px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
                    }}
                />

                <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-block rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-[0.8rem] font-medium text-teal-700">
                            Laundry Terpercaya #1
                        </div>

                        <h1 className="mb-5 font-['DM_Serif_Display',serif] text-[clamp(2rem,5vw,3.2rem)] leading-tight text-slate-800">
                            Pakaian Bersih,
                            <br />
                            <span className="text-teal-500">Hidup Lebih Nyaman</span>
                        </h1>

                        <p className="mb-8 max-w-[480px] text-[1.05rem] leading-relaxed text-slate-500">
                            BrightWash menyediakan layanan laundry profesional dengan
                            kualitas terbaik. Serahkan urusan cuci pakaian Anda, kami
                            yang kerjakan dengan sepenuh hati.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-7 py-3.5 text-[0.95rem] font-semibold text-white no-underline shadow-lg shadow-teal-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-700"
                            >
                                Mulai Sekarang
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <a
                                href="#layanan"
                                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-teal-200 bg-transparent px-7 py-3.5 text-[0.95rem] font-medium text-teal-500 no-underline transition-all duration-200 hover:bg-teal-50"
                            >
                                Lihat Layanan
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex gap-10">
                            {[
                                { num: "2.500+", label: "Pelanggan Puas" },
                                { num: "15.000+", label: "Order Selesai" },
                                { num: "4.9", label: "Rating" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <p className="font-['DM_Serif_Display',serif] text-2xl text-teal-500">
                                        {s.num}
                                    </p>
                                    <p className="text-[0.8rem] text-slate-400">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section
                id="layanan"
                className="border-y border-teal-100 bg-teal-50/30"
            >
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-14 text-center">
                        <h2 className="mb-2 font-['DM_Serif_Display',serif] text-3xl text-slate-800">
                            Layanan Kami
                        </h2>
                        <p className="text-[0.95rem] text-slate-500">
                            Berbagai pilihan layanan laundry untuk kebutuhan Anda
                        </p>
                    </div>

                    {servicesLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <ServiceCardSkeleton key={i} variant="landing" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    variant="landing"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section id="testimoni" className="mx-auto max-w-6xl px-6 py-20">
                <div className="mb-14 text-center">
                    <h2 className="mb-2 font-['DM_Serif_Display',serif] text-3xl text-slate-800">
                        Apa Kata Pelanggan
                    </h2>
                    <p className="text-[0.95rem] text-slate-500">
                        Kepercayaan dan kepuasan Anda adalah prioritas utama kami
                    </p>
                </div>

                {testimonialsLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex min-h-[280px] animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                            >
                                <div className="mb-4 h-8 w-8 rounded-full bg-slate-200" />
                                <div className="mb-4 flex gap-1">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <div
                                            key={j}
                                            className="h-4 w-4 rounded bg-slate-200"
                                        />
                                    ))}
                                </div>
                                <div className="mb-4 space-y-2">
                                    <div className="h-3 w-60 rounded bg-slate-100" />
                                    <div className="h-3 w-48 rounded bg-slate-100" />
                                </div>
                                <div className="h-4 w-24 rounded bg-slate-200" />
                            </div>
                        ))}
                    </div>
                ) : !testimonials.length ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquareText className="mb-4 h-12 w-12 text-slate-300" />
                        <p className="text-[0.95rem] font-medium text-slate-500">
                            Belum ada testimonial dari pelanggan.
                        </p>
                        <p className="mt-1 text-[0.85rem] text-slate-400">
                            Testimonial akan muncul setelah pelanggan memberikan ulasan.
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Previous arrow */}
                        <button
                            onClick={prevPage}
                            className="absolute -left-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-teal-500 hover:text-teal-500 hover:shadow-lg hover:shadow-teal-500/15 md:flex"
                            aria-label="Previous testimonials"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        {/* Carousel track */}
                        <div className="mx-0.5 overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentPage * 100}%)`,
                                }}
                            >
                                {pages.map((page, pageIdx) => (
                                    <div
                                        key={pageIdx}
                                        className="flex w-full flex-shrink-0 gap-6"
                                        style={{
                                            gridTemplateColumns: `repeat(${Math.min(page.length, cardsPerPage)}, minmax(0, 1fr))`,
                                        }}
                                    >
                                        {page.map((testimonial) => (
                                            <div
                                                key={testimonial.id || testimonial.name}
                                                className="relative flex min-h-[280px] flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/50"
                                            >
                                                {/* Decorative quote */}
                                                <div className="mb-2 select-none font-['DM_Serif_Display',serif] text-[2.5rem] leading-none text-teal-100">
                                                    &ldquo;
                                                </div>

                                                {/* Stars */}
                                                <div className="mb-3.5 flex justify-center gap-0.5">
                                                    {renderStars(testimonial.rating)}
                                                </div>

                                                {/* Feedback */}
                                                <p className="mb-4 max-w-[320px] flex-1 text-[0.88rem] italic leading-relaxed text-slate-600">
                                                    {testimonial.text}
                                                </p>

                                                {/* Service Name */}
                                                {testimonial.service_name && (
                                                    <p className="mb-2 text-[0.75rem] font-medium text-teal-500">
                                                        {testimonial.service_name}
                                                    </p>
                                                )}

                                                {/* Name */}
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                                    <p className="text-[0.85rem] font-semibold text-teal-700">
                                                        {testimonial.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next arrow */}
                        <button
                            onClick={nextPage}
                            className="absolute -right-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-teal-500 hover:text-teal-500 hover:shadow-lg hover:shadow-teal-500/15 md:flex"
                            aria-label="Next testimonials"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Dot indicators */}
                {!testimonialsLoading && totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className="h-2.5 rounded-full border-none p-0 transition-all duration-300"
                                style={{
                                    width: index === currentPage ? 28 : 10,
                                    background:
                                        index === currentPage ? "#14b8a6" : "#e2e8f0",
                                }}
                                aria-label={`Go to testimonial page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ── CTA ── */}
            <section className="border-t border-white/10 bg-gradient-to-r from-teal-700 via-teal-500 to-cyan-500">
                <div className="mx-auto max-w-6xl px-6 py-16 text-center">
                    <h2 className="mb-3 font-['DM_Serif_Display',serif] text-3xl text-white">
                        Siap untuk Pakaian yang Lebih Bersih?
                    </h2>
                    <p className="mx-auto mb-7 max-w-[480px] text-base leading-relaxed text-teal-100">
                        Daftar sekarang dan nikmati kemudahan layanan laundry
                        BrightWash langsung dari genggaman tangan Anda.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block rounded-xl bg-white px-9 py-3.5 text-[0.95rem] font-semibold text-teal-700 no-underline shadow-lg shadow-black/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
                    >
                        Daftar Gratis
                    </Link>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/5 bg-slate-900">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <img
                                src="/img/BrightWashNoBg.png"
                                alt="BrightWash"
                                className="h-8 w-8 object-contain"
                            />
                            <span className="font-['DM_Serif_Display',serif] text-[1.1rem] text-slate-300">
                                BrightWash
                            </span>
                        </div>

                        <p className="text-[0.8rem] text-slate-500">
                            &copy; 2025 BrightWash. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
