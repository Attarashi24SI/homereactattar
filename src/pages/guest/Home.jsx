import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import laundryPortalAPI, { formatCurrency } from "../../services/laundryPortalAPI";
import {
    Bed,
    Droplets,
    Footprints,
    Shirt,
    Sparkles,
    Star,
    Zap,
} from "lucide-react";

const iconMap = { Droplets, Shirt, Zap, Bed, Footprints, Sparkles };
const colorMap = {
    teal: "linear-gradient(135deg, #14b8a6, #0d9488)",
    cyan: "linear-gradient(135deg, #06b6d4, #0e7490)",
    amber: "linear-gradient(135deg, #f59e0b, #d97706)",
    indigo: "linear-gradient(135deg, #6366f1, #4f46e5)",
    emerald: "linear-gradient(135deg, #10b981, #059669)",
    violet: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
};

const defaultGradient = "linear-gradient(135deg, #14b8a6, #0d9488)";

const testimonials = [
    {
        name: "Sarah Wijaya",
        rating: 5,
        text: "Very fast service and the clothes were perfectly clean. Highly recommended!",
    },
    {
        name: "Budi Santoso",
        rating: 5,
        text: "Pelayanan sangat memuaskan, pakaian wangi dan rapi. Sudah langganan sejak 3 bulan lalu.",
    },
    {
        name: "Dian Permata",
        rating: 4,
        text: "Super express 3 jam benar-benar tepat waktu. Cocok untuk kebutuhan mendesak.",
    },
    {
        name: "Rina Marlina",
        rating: 5,
        text: "Harga terjangkau dengan kualitas premium. Tim BrightWash sangat profesional.",
    },
    {
        name: "Andi Pratama",
        rating: 4,
        text: "Layanan setrika premiumnya luar biasa. Rapi dan wangi tahan lama.",
    },
];

export default function Home() {
    const { isLoggedIn, user, logout } = useAuth();
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(3);

    useEffect(() => {
        laundryPortalAPI.fetchServices().then(setServices);
    }, []);

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
    }, [totalPages]);

    // Auto-rotation
    useEffect(() => {
        if (totalPages <= 1) return;
        const interval = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages);
        }, 5000);
        return () => clearInterval(interval);
    }, [totalPages]);

    const goToPage = (index) => {
        setCurrentPage(index);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={18}
                fill={i < rating ? "#f59e0b" : "transparent"}
                stroke={i < rating ? "#f59e0b" : "#d1d5db"}
                strokeWidth={1.5}
                style={{ transition: "all 0.2s" }}
            />
        ));
    };

    return (
        <div className="min-h-screen" style={{ background: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display@0;1&display=swap');
            `}</style>

            {/* HEADER */}
            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #ccfbf1",
                }}
            >
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
                        <img
                            src="/img/BrightWashNoBg.png"
                            alt="BrightWash"
                            style={{ width: 36, height: 36, objectFit: "contain" }}
                        />
                        <span
                            style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: "1.3rem",
                                color: "#0f766e",
                            }}
                        >
                            BrightWash
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {[
                            { label: "Layanan", href: "#layanan" },
                            { label: "Testimoni", href: "#testimoni" },
                            { label: "Tentang", href: "#tentang" },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    color: "#374151",
                                    textDecoration: "none",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => (e.target.style.color = "#14b8a6")}
                                onMouseLeave={(e) => (e.target.style.color = "#374151")}
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
                                    style={{
                                        padding: "8px 20px",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: "#ffffff",
                                        background: "#14b8a6",
                                        border: "1.5px solid #14b8a6",
                                        borderRadius: 10,
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        boxShadow: "0 4px 14px rgba(20,184,166,0.25)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#0f766e";
                                        e.currentTarget.style.borderColor = "#0f766e";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#14b8a6";
                                        e.currentTarget.style.borderColor = "#14b8a6";
                                    }}
                                >
                                    Member Portal
                                </Link>

                                {/* Profile Avatar + Info */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "6px 14px 6px 6px",
                                        borderRadius: 14,
                                        border: "1.5px solid #ccfbf1",
                                        background: "#f0fdfa",
                                        transition: "all 0.2s",
                                        cursor: "default",
                                    }}
                                >
                                    {/* Avatar */}
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: user?.plan === "platinum"
                                                ? "linear-gradient(135deg, #475569, #1e293b)"
                                                : user?.plan === "gold"
                                                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                                                    : "linear-gradient(135deg, #94a3b8, #64748b)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.85rem",
                                            fontWeight: 700,
                                            color: "#ffffff",
                                            boxShadow: "0 2px 8px rgba(20,184,166,0.2)",
                                        }}
                                    >
                                        {(user?.fullname || user?.username || "U").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + Tier */}
                                    <div style={{ lineHeight: 1.3 }}>
                                        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f766e" }}>
                                            {user?.fullname || user?.username}
                                        </p>
                                        <span
                                            style={{
                                                fontSize: "0.65rem",
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                color: user?.plan === "platinum"
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
                                    onClick={() => { logout(); }}
                                    title="Logout"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 10,
                                        border: "1.5px solid #fecaca",
                                        background: "transparent",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        color: "#ef4444",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#fef2f2";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                    style={{
                                        padding: "8px 20px",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: "#14b8a6",
                                        border: "1.5px solid #14b8a6",
                                        borderRadius: 10,
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        background: "transparent",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#f0fdfa";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    style={{
                                        padding: "8px 20px",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: "#ffffff",
                                        background: "#14b8a6",
                                        border: "1.5px solid #14b8a6",
                                        borderRadius: 10,
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        boxShadow: "0 4px 14px rgba(20,184,166,0.25)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#0f766e";
                                        e.currentTarget.style.borderColor = "#0f766e";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#14b8a6";
                                        e.currentTarget.style.borderColor = "#14b8a6";
                                    }}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div
                    style={{
                        position: "absolute",
                        top: -120,
                        right: -80,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -60,
                        left: -40,
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
                    }}
                />

                <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
                    <div className="max-w-2xl">
                        <div
                            className="inline-block mb-4 px-4 py-1.5 rounded-full"
                            style={{
                                background: "#f0fdfa",
                                border: "1px solid #ccfbf1",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                color: "#0f766e",
                            }}
                        >
                            Laundry Terpercaya #1
                        </div>

                        <h1
                            style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                                color: "#1e293b",
                                lineHeight: 1.15,
                                marginBottom: 20,
                            }}
                        >
                            Pakaian Bersih,
                            <br />
                            <span style={{ color: "#14b8a6" }}>Hidup Lebih Nyaman</span>
                        </h1>

                        <p
                            style={{
                                fontSize: "1.05rem",
                                color: "#64748b",
                                lineHeight: 1.7,
                                maxWidth: 480,
                                marginBottom: 32,
                            }}
                        >
                            BrightWash menyediakan layanan laundry profesional dengan
                            kualitas terbaik. Serahkan urusan cuci pakaian Anda, kami
                            yang kerjakan dengan sepenuh hati.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "14px 28px",
                                    background: "#14b8a6",
                                    color: "#ffffff",
                                    borderRadius: 12,
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    boxShadow: "0 8px 24px rgba(20,184,166,0.3)",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#0f766e";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#14b8a6";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                Mulai Sekarang
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <a
                                href="#layanan"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "14px 28px",
                                    background: "transparent",
                                    color: "#14b8a6",
                                    border: "1.5px solid #99f6e4",
                                    borderRadius: 12,
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#f0fdfa";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                Lihat Layanan
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-10 mt-12">
                            {[
                                { num: "2.500+", label: "Pelanggan Puas" },
                                { num: "15.000+", label: "Order Selesai" },
                                { num: "4.9", label: "Rating" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <p
                                        style={{
                                            fontFamily: "'DM Serif Display', serif",
                                            fontSize: "1.5rem",
                                            color: "#14b8a6",
                                        }}
                                    >
                                        {s.num}
                                    </p>
                                    <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section
                id="layanan"
                style={{
                    background: "#f8fffe",
                    borderTop: "1px solid #ccfbf1",
                    borderBottom: "1px solid #ccfbf1",
                }}
            >
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="text-center mb-14">
                        <h2
                            style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: "2rem",
                                color: "#1e293b",
                                marginBottom: 8,
                            }}
                        >
                            Layanan Kami
                        </h2>
                        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                            Berbagai pilihan layanan laundry untuk kebutuhan Anda
                        </p>
                    </div>

                    {services.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        border: "3px solid #ccfbf1",
                                        borderTopColor: "#14b8a6",
                                        animation: "spin 0.8s linear infinite",
                                        margin: "0 auto 16px",
                                    }}
                                />
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Memuat layanan...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => {
                                const Icon = iconMap[service.icon] || Droplets;
                                const gradient = colorMap[service.color] || defaultGradient;
                            return (
                                        <div
                                            key={service.id}
                                            style={{
                                                background: "#ffffff",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: 16,
                                                padding: "28px 24px",
                                                transition: "all 0.25s",
                                                cursor: "default",
                                                display: "flex",
                                                flexDirection: "column",
                                                minHeight: 340,
                                            }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "#99f6e4";
                                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,184,166,0.1)";
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "#e2e8f0";
                                            e.currentTarget.style.boxShadow = "none";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 12,
                                                background: gradient,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: 16,
                                                color: "#ffffff",
                                                boxShadow: "0 4px 12px rgba(20,184,166,0.2)",
                                            }}
                                        >
                                            <Icon size={24} strokeWidth={1.8} />
                                        </div>

                                        {service.category && (
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: "fit-content",
                                                    padding: "4px 12px",
                                                    borderRadius: 8,
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.05em",
                                                    background: "#f0fdfa",
                                                    color: "#0f766e",
                                                    marginBottom: 10,
                                                }}
                                            >
                                                {service.category}
                                            </span>
                                        )}

                                        <h3
                                            style={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                color: "#1e293b",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {service.name}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#64748b",
                                                lineHeight: 1.6,
                                                flex: 1,
                                            }}
                                        >
                                            {service.description}
                                        </p>

                                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                                            <p
                                                style={{
                                                    fontSize: "1.1rem",
                                                    fontWeight: 700,
                                                    color: "#0f766e",
                                                }}
                                            >
                                                {formatCurrency(service.price)}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#94a3b8",
                                                    marginTop: 2,
                                                }}
                                            >
                                                per {service.unit}
                                                {service.estimated_duration ? ` · ${service.estimated_duration}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="testimoni" className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <h2
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: "2rem",
                            color: "#1e293b",
                            marginBottom: 8,
                        }}
                    >
                        Apa Kata Pelanggan
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                        Kepercayaan dan kepuasan Anda adalah prioritas utama kami
                    </p>
                </div>

                <div className="relative">
                    {/* Previous arrow */}
                    <button
                        onClick={prevPage}
                        className="hidden md:flex items-center justify-center"
                        style={{
                            position: "absolute",
                            left: -20,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid #e2e8f0",
                            background: "#ffffff",
                            cursor: "pointer",
                            color: "#64748b",
                            transition: "all 0.2s",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#14b8a6";
                            e.currentTarget.style.color = "#14b8a6";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(20,184,166,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#64748b";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                        }}
                        aria-label="Previous testimonials"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Carousel track */}
                    <div className="overflow-hidden" style={{ margin: "0 4px" }}>
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentPage * 100}%)` }}
                        >
                            {pages.map((page, pageIdx) => (
                                <div
                                    key={pageIdx}
                                    className="flex-shrink-0 w-full grid gap-6"
                                    style={{
                                        gridTemplateColumns: `repeat(${Math.min(page.length, cardsPerPage)}, minmax(0, 1fr))`,
                                        paddingRight: 0,
                                    }}
                                >
                                    {page.map((testimonial) => (
                                        <div
                                            key={testimonial.name}
                                            style={{
                                                background: "#ffffff",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: 20,
                                                padding: "32px 24px",
                                                textAlign: "center",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                                                transition: "all 0.3s ease",
                                                minHeight: 280,
                                                position: "relative",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = "#99f6e4";
                                                e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,184,166,0.1)";
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = "#e2e8f0";
                                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)";
                                                e.currentTarget.style.transform = "translateY(0)";
                                            }}
                                        >
                                            {/* Decorative quote */}
                                            <div
                                                style={{
                                                    fontSize: "2.5rem",
                                                    lineHeight: 1,
                                                    color: "#ccfbf1",
                                                    fontFamily: "'DM Serif Display', serif",
                                                    userSelect: "none",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                &ldquo;
                                            </div>

                                            {/* Stars */}
                                            <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 14 }}>
                                                {renderStars(testimonial.rating)}
                                            </div>

                                            {/* Feedback */}
                                            <p
                                                style={{
                                                    fontSize: "0.88rem",
                                                    color: "#475569",
                                                    lineHeight: 1.6,
                                                    fontStyle: "italic",
                                                    flex: 1,
                                                    marginBottom: 16,
                                                    maxWidth: 320,
                                                }}
                                            >
                                                {testimonial.text}
                                            </p>

                                            {/* Name */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div
                                                    style={{
                                                        width: 5,
                                                        height: 5,
                                                        borderRadius: "50%",
                                                        background: "#14b8a6",
                                                    }}
                                                />
                                                <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f766e" }}>
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
                        className="hidden md:flex items-center justify-center"
                        style={{
                            position: "absolute",
                            right: -20,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid #e2e8f0",
                            background: "#ffffff",
                            cursor: "pointer",
                            color: "#64748b",
                            transition: "all 0.2s",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#14b8a6";
                            e.currentTarget.style.color = "#14b8a6";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(20,184,166,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#64748b";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                        }}
                        aria-label="Next testimonials"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* Dot indicators */}
                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                        marginTop: 24,
                    }}
                >
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            style={{
                                width: index === currentPage ? 28 : 10,
                                height: 10,
                                borderRadius: 5,
                                border: "none",
                                background: index === currentPage ? "#14b8a6" : "#e2e8f0",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                padding: 0,
                            }}
                            aria-label={`Go to testimonial page ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section
                id="tentang"
                style={{
                    background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #06b6d4 100%)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                    <h2
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: "2rem",
                            color: "#ffffff",
                            marginBottom: 12,
                        }}
                    >
                        Siap untuk Pakaian yang Lebih Bersih?
                    </h2>
                    <p
                        style={{
                            fontSize: "1rem",
                            color: "#ccfbf1",
                            maxWidth: 480,
                            margin: "0 auto 28px",
                            lineHeight: 1.6,
                        }}
                    >
                        Daftar sekarang dan nikmati kemudahan layanan laundry
                        BrightWash langsung dari genggaman tangan Anda.
                    </p>
                    <Link
                        to="/register"
                        style={{
                            display: "inline-block",
                            padding: "14px 36px",
                            background: "#ffffff",
                            color: "#0f766e",
                            borderRadius: 12,
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                        }}
                    >
                        Daftar Gratis
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer
                style={{
                    background: "#0f172a",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <img
                                src="/img/BrightWashNoBg.png"
                                alt="BrightWash"
                                style={{ width: 32, height: 32, objectFit: "contain" }}
                            />
                            <span
                                style={{
                                    fontFamily: "'DM Serif Display', serif",
                                    fontSize: "1.1rem",
                                    color: "#e2e8f0",
                                }}
                            >
                                BrightWash
                            </span>
                        </div>

                        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            &copy; 2025 BrightWash. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
