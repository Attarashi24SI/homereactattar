import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import laundryPortalAPI, { FALLBACK_SERVICES, formatCurrency } from "../services/laundryPortalAPI";
import {
    Bed,
    Check,
    Crown,
    Droplets,
    Footprints,
    LogOut,
    Minus,
    Package,
    Plus,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Tag,
    Trash2,
    Zap,
} from "lucide-react";

const iconMap = { Droplets, Shirt, Zap, Bed, Footprints, Sparkles };
const colorClass = {
    teal: "from-teal-500 to-cyan-500",
    cyan: "from-cyan-500 to-sky-500",
    amber: "from-amber-500 to-orange-500",
    indigo: "from-indigo-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    violet: "from-violet-500 to-fuchsia-500",
};

export default function MemberPortal() {
    const { isLight } = useTheme();
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useAuth();
    const [services, setServices] = useState(FALLBACK_SERVICES);
    const [activeCategory, setActiveCategory] = useState("Semua Layanan");
    const [cart, setCart] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [pickupMethod, setPickupMethod] = useState("Drop Off");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        laundryPortalAPI.fetchServices().then(setServices);
    }, []);

    const categories = useMemo(
        () => ["Semua Layanan", ...Array.from(new Set(services.map((service) => service.category).filter(Boolean)))],
        [services],
    );

    const filteredServices = useMemo(() => {
        if (activeCategory === "Semua Layanan") return services;
        return services.filter((service) => service.category === activeCategory);
    }, [activeCategory, services]);

    if (!user) return null;

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tier = String(user.tier || user.plan || "Silver").toLowerCase();
    const discountRate = tier === "platinum" ? 0.2 : tier === "gold" ? 0.15 : 0.1;
    const discount = Math.round(subtotal * discountRate);
    const finalTotal = subtotal - discount;
    const points = Math.floor(finalTotal / 10000);

    const tierColor =
        tier === "platinum"
            ? { bg: "from-slate-700 to-slate-900", text: "text-slate-100", badge: "bg-slate-800 text-white" }
            : tier === "gold"
                ? { bg: "from-amber-500 to-amber-700", text: "text-amber-50", badge: "bg-amber-500 text-white" }
                : { bg: "from-slate-400 to-slate-600", text: "text-slate-100", badge: "bg-slate-500 text-white" };

    const addToCart = (service) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.productId === service.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === service.id ? { ...item, quantity: item.quantity + 1 } : item,
                );
            }
            return [
                ...prev,
                {
                    productId: service.id,
                    name: service.name,
                    price: Number(service.price),
                    quantity: 1,
                    unit: service.unit,
                    estimated_duration: service.estimated_duration,
                },
            ];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) =>
            prev
                .map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
                .filter((item) => item.quantity > 0),
        );
    };

    const removeItem = (productId) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
    };

    const handleCheckout = async () => {
        if (!cart.length) return;
        setIsSubmitting(true);
        setCheckoutError("");
        try {
            const order = await laundryPortalAPI.createOrder({ user, cart, pickupMethod });
            setCart([]);
            setActiveStep(0);
            navigate(`/tracking/${order.invoice_number}`);
        } catch (error) {
            setCheckoutError(error.response?.data?.message || error.message || "Gagal membuat order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="space-y-6">
            <section className={`relative overflow-hidden rounded-2xl border p-6 shadow-lg ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f]/95 shadow-black/35"}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${tierColor.bg} opacity-[0.06]`} />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tierColor.bg} text-2xl font-bold ${tierColor.text} shadow-lg`}>
                            {(user.fullname || user.username || "U").charAt(0)}
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                                {user.fullname || user.username}
                            </h2>
                            <div className="mt-1 flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${tierColor.badge}`}>
                                    <Crown className="h-3 w-3" />
                                    {user.tier || user.plan || "Silver"}
                                </span>
                                <span className={`text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                    Diskon {(discountRate * 100).toFixed(0)}%
                                </span>
                            </div>
                            <p className={`mt-1 text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                Pilih layanan laundry, masukkan ke keranjang, lalu lanjut checkout.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveStep(1)}
                            className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition ${isLight ? "border-slate-200 bg-white hover:bg-teal-50" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                            title="Cart"
                        >
                            <ShoppingCart className={`h-5 w-5 ${isLight ? "text-teal-600" : "text-teal-400"}`} />
                            {cartCount > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => { logout(); navigate("/"); }}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${isLight ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" : "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </section>

            <section className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-sm ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f]/95 shadow-black/35"}`}>
                <ShoppingBag className={`h-5 w-5 ${isLight ? "text-teal-600" : "text-teal-400"}`} />
                {["Katalog", "Checkout"].map((step, index) => (
                    <button
                        key={step}
                        type="button"
                        onClick={() => setActiveStep(index)}
                        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${activeStep === index ? isLight ? "bg-teal-600 text-white shadow-md" : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md" : isLight ? "bg-slate-100 text-slate-500" : "bg-white/5 text-gray-500"}`}
                    >
                        {activeStep > index && <Check className="h-3.5 w-3.5" />}
                        {step}
                    </button>
                ))}
                {cartCount > 0 && (
                    <span className={`ml-auto text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                        {cartCount} item layanan · {formatCurrency(subtotal)}
                    </span>
                )}
            </section>

            {activeStep === 0 ? (
                <>
                    <section className="flex flex-wrap items-center gap-2">
                        <Tag className={`mr-1 h-4 w-4 ${isLight ? "text-slate-400" : "text-gray-500"}`} />
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? isLight ? "bg-teal-600 text-white shadow-md" : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md" : isLight ? "border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700" : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
                            >
                                {category}
                            </button>
                        ))}
                    </section>

                    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredServices.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                isLight={isLight}
                                onAddToCart={addToCart}
                                inCart={cart.some((item) => item.productId === service.id)}
                            />
                        ))}
                    </section>

                    {!filteredServices.length && (
                        <div className={`rounded-2xl border p-12 text-center ${isLight ? "border-slate-200 bg-white" : "border-white/5 bg-[#06090f]"}`}>
                            <Package className={`mx-auto mb-3 h-10 w-10 ${isLight ? "text-slate-300" : "text-gray-600"}`} />
                            <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>Belum ada layanan di kategori ini.</p>
                        </div>
                    )}
                </>
            ) : (
                <section className={`grid gap-5 lg:grid-cols-[1.5fr_1fr]`}>
                    <div className={`rounded-2xl border p-5 shadow-sm ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/35"}`}>
                        <h2 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Keranjang Laundry</h2>
                        <div className="mt-4 space-y-3">
                            {cart.length ? cart.map((item) => (
                                <div key={item.productId} className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${isLight ? "border-slate-100 bg-slate-50" : "border-white/10 bg-white/5"}`}>
                                    <div>
                                        <p className={`font-semibold ${isLight ? "text-slate-800" : "text-white"}`}>{item.name}</p>
                                        <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>{formatCurrency(item.price)} / {item.unit} · Estimasi {item.estimated_duration}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => updateQuantity(item.productId, -1)} className={iconButtonClass(isLight)}><Minus className="h-4 w-4" /></button>
                                        <span className={`w-10 text-center text-sm font-bold ${isLight ? "text-slate-700" : "text-white"}`}>{item.quantity}</span>
                                        <button type="button" onClick={() => updateQuantity(item.productId, 1)} className={iconButtonClass(isLight)}><Plus className="h-4 w-4" /></button>
                                        <button type="button" onClick={() => removeItem(item.productId)} className={iconButtonClass(isLight, true)}><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            )) : (
                                <p className={`rounded-xl border p-5 text-sm ${isLight ? "border-slate-100 text-slate-500" : "border-white/10 text-gray-400"}`}>Keranjang masih kosong.</p>
                            )}
                        </div>
                    </div>

                    <div className={`rounded-2xl border p-5 shadow-sm ${isLight ? "border-slate-200 bg-white shadow-slate-200/70" : "border-white/5 bg-[#06090f] shadow-black/35"}`}>
                        <h2 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Checkout</h2>
                        <div className="mt-4 space-y-4">
                            <label className="block">
                                <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-gray-300"}`}>Metode Pickup</span>
                                <select value={pickupMethod} onChange={(e) => setPickupMethod(e.target.value)} className={selectClass(isLight)}>
                                    <option>Drop Off</option>
                                    <option>Pickup Kurir</option>
                                </select>
                            </label>
                            <div className={`rounded-xl border px-3 py-2.5 text-sm ${isLight ? "border-amber-100 bg-amber-50 text-amber-700" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>
                                Status pembayaran akan ditentukan oleh admin.
                            </div>
                            <div className={`space-y-2 rounded-xl p-4 ${isLight ? "bg-slate-50" : "bg-white/5"}`}>
                                <SummaryLine label="Subtotal" value={formatCurrency(subtotal)} isLight={isLight} />
                                <SummaryLine label={`Diskon member (${(discountRate * 100).toFixed(0)}%)`} value={`- ${formatCurrency(discount)}`} isLight={isLight} />
                                <SummaryLine label="Final" value={formatCurrency(finalTotal)} isLight={isLight} strong />
                                <SummaryLine label="Reward Points" value={`${points} pts`} isLight={isLight} />
                            </div>
                            {checkoutError && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">{checkoutError}</p>}
                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={!cart.length || isSubmitting}
                                className={`w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${isLight ? "bg-teal-600 hover:bg-teal-700" : "bg-gradient-to-r from-cyan-500 to-teal-500"}`}
                            >
                                {isSubmitting ? "Membuat Order..." : "Buat Order"}
                            </button>
                            <Link to="/tracking" className={`block text-center text-sm font-semibold ${isLight ? "text-teal-700" : "text-teal-300"}`}>Lihat tracking order</Link>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

function ServiceCard({ service, isLight, onAddToCart, inCart }) {
    const Icon = iconMap[service.icon] || Droplets;
    const gradient = colorClass[service.color] || colorClass.teal;

    return (
        <div className={`group flex flex-col rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${isLight ? "border-slate-200/80 bg-white shadow-slate-200/70 hover:border-teal-200" : "border-white/5 bg-[#06090f]/95 shadow-black/30 hover:border-teal-500/20"}`}>
            <div className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                <Icon className="h-16 w-16" strokeWidth={1.8} />
            </div>
            <div className="flex flex-1 flex-col pt-4">
                <span className={`mb-2 w-fit rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${isLight ? "bg-teal-50 text-teal-700" : "bg-teal-500/10 text-teal-300"}`}>{service.category}</span>
                <h3 className={`text-sm font-bold leading-snug ${isLight ? "text-slate-900" : "text-white"}`}>{service.name}</h3>
                <p className={`mt-1 text-xs leading-relaxed ${isLight ? "text-slate-500" : "text-gray-400"}`}>{service.description}</p>
                <div className="mt-auto pt-4">
                    <p className={`text-lg font-black ${isLight ? "text-teal-700" : "text-teal-400"}`}>{formatCurrency(service.price)}</p>
                    <p className={`text-xs ${isLight ? "text-slate-400" : "text-gray-500"}`}>per {service.unit} · Estimasi {service.estimated_duration}</p>
                </div>
                <button
                    onClick={() => onAddToCart(service)}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${inCart ? isLight ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30" : isLight ? "bg-teal-600 text-white shadow-md hover:bg-teal-700" : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md hover:shadow-lg"}`}
                >
                    {inCart ? <><Check className="h-4 w-4" /> Dalam Keranjang</> : <><Plus className="h-4 w-4" /> Masukkan Keranjang</>}
                </button>
            </div>
        </div>
    );
}

function SummaryLine({ label, value, isLight, strong = false }) {
    return (
        <div className={`flex items-center justify-between text-sm ${strong ? "font-black" : "font-medium"} ${isLight ? "text-slate-700" : "text-gray-300"}`}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}

const iconButtonClass = (isLight, danger = false) =>
    `flex h-9 w-9 items-center justify-center rounded-lg border transition ${danger ? isLight ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100" : "border-red-500/20 bg-red-500/10 text-red-400" : isLight ? "border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700" : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"}`;

const selectClass = (isLight) =>
    `mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${isLight ? "border-slate-200 bg-white text-slate-700 focus:border-teal-400" : "border-white/10 bg-[#0f1724] text-white focus:border-cyan-400"}`;
