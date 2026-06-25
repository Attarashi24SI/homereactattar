import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const services = [
    {
        icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
        title: "Cuci Reguler",
        desc: "Layanan cuci standar dengan hasil bersih dan wangi. Cocok untuk kebutuhan sehari-hari.",
    },
    {
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
        title: "Cuci Express",
        desc: "Layanan cepat selesai dalam hitungan jam. Prioritas untuk yang butuh segera.",
    },
    {
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        title: "Dry Cleaning",
        desc: "Perawatan khusus untuk pakaian sensitif seperti jas, gaun, dan bahan delicate.",
    },
    {
        icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
        title: "Setrika & Press",
        desc: "Layanan setrika profesional dengan hasil rapi dan wangi tahan lama.",
    },
];

const plans = [
    {
        name: "SILVER",
        price: "150.000",
        features: [
            "Cuci Reguler 5 kg/bulan",
            "Setrika Standar",
            "Pengiriman 2x/bulan",
            "Deterjen Standar",
        ],
    },
    {
        name: "GOLD",
        price: "200.000",
        popular: true,
        features: [
            "Cuci Reguler 10 kg/bulan",
            "Setrika Premium",
            "Pengiriman 4x/bulan",
            "Deterjen Premium",
            "Pewangi Pilihan",
        ],
    },
    {
        name: "PLATINUM",
        price: "300.000",
        features: [
            "Cuci Reguler 20 kg/bulan",
            "Setrika & Press Premium",
            "Pengiriman Unlimited",
            "Deterjen & Pewangi Premium",
            "Dry Cleaning 5 pcs/bulan",
            "Prioritas Express",
        ],
    },
];

export default function Home() {
    const { isLoggedIn, user, logout } = useAuth();

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
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "#14b8a6",
                                boxShadow: "0 4px 12px rgba(20,184,166,0.3)",
                            }}
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
                        {["Layanan", "Harga", "Tentang"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
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
                                {item}
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

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {services.map((s) => (
                            <div
                                key={s.title}
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 16,
                                    padding: "28px 24px",
                                    transition: "all 0.25s",
                                    cursor: "default",
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
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        background: "#f0fdfa",
                                        border: "1px solid #ccfbf1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 16,
                                    }}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#14b8a6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d={s.icon} />
                                    </svg>
                                </div>
                                <h3
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        color: "#1e293b",
                                        marginBottom: 8,
                                    }}
                                >
                                    {s.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "#64748b",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section id="harga" className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <h2
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: "2rem",
                            color: "#1e293b",
                            marginBottom: 8,
                        }}
                    >
                        Paket Langganan
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                        Pilih paket yang sesuai kebutuhan laundry Anda
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            style={{
                                position: "relative",
                                background: plan.popular ? "#0f766e" : "#ffffff",
                                border: plan.popular
                                    ? "2px solid #14b8a6"
                                    : "1px solid #e2e8f0",
                                borderRadius: 20,
                                padding: "32px 28px",
                                transition: "all 0.25s",
                                overflow: "hidden",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = plan.popular
                                    ? "0 20px 50px rgba(15,118,110,0.3)"
                                    : "0 12px 32px rgba(0,0,0,0.06)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {plan.popular && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 16,
                                        right: -28,
                                        background: "#fbbf24",
                                        color: "#78350f",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        padding: "4px 36px",
                                        transform: "rotate(45deg)",
                                    }}
                                >
                                    POPULER
                                </div>
                            )}

                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    color: plan.popular ? "#99f6e4" : "#94a3b8",
                                    marginBottom: 4,
                                }}
                            >
                                {plan.name}
                            </p>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span
                                    style={{
                                        fontFamily: "'DM Serif Display', serif",
                                        fontSize: "2.2rem",
                                        color: plan.popular ? "#ffffff" : "#1e293b",
                                    }}
                                >
                                    Rp {plan.price}
                                </span>
                                <span
                                    style={{
                                        fontSize: "0.85rem",
                                        color: plan.popular ? "#99f6e4" : "#94a3b8",
                                    }}
                                >
                                    /bulan
                                </span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f) => (
                                    <li
                                        key={f}
                                        className="flex items-center gap-2"
                                        style={{
                                            fontSize: "0.85rem",
                                            color: plan.popular ? "#e2e8f0" : "#475569",
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={plan.popular ? "#99f6e4" : "#14b8a6"}
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/register"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    padding: "12px",
                                    borderRadius: 12,
                                    fontSize: "0.9rem",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                    background: plan.popular
                                        ? "#ffffff"
                                        : "#f0fdfa",
                                    color: plan.popular ? "#0f766e" : "#14b8a6",
                                    border: plan.popular
                                        ? "none"
                                        : "1.5px solid #99f6e4",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = plan.popular
                                        ? "#f0fdfa"
                                        : "#14b8a6";
                                    e.currentTarget.style.color = plan.popular
                                        ? "#0f766e"
                                        : "#ffffff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = plan.popular
                                        ? "#ffffff"
                                        : "#f0fdfa";
                                    e.currentTarget.style.color = plan.popular
                                        ? "#0f766e"
                                        : "#14b8a6";
                                }}
                            >
                                Pilih Paket
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section
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
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 7,
                                    background: "#14b8a6",
                                }}
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
