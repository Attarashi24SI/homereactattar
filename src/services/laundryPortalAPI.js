import axios from "axios";

const SUPABASE_URL = "https://gqfmyeatzyhlpwaayyrw.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZm15ZWF0enlobHB3YWF5eXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTc2OTcsImV4cCI6MjA5NjUzMzY5N30.aBIEH-skNf5p8eHN0g56h7SPNIw_4gRIrtPFUTblg1g";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
};

export const TRACKING_STEPS = [
    "Pending",
    "Confirmed",
    "Received",
    "Washing",
    "Drying",
    "Ironing",
    "Quality Check",
    "Ready Pickup",
    "Completed",
];

export const STATUS_COPY = {
    Pending: ["Pesanan dibuat", "Pesanan laundry berhasil dibuat dan menunggu konfirmasi."],
    Confirmed: ["Pesanan dikonfirmasi", "Tim BrightWash sudah mengonfirmasi detail pesanan."],
    Received: ["Laundry diterima", "Item laundry sudah diterima oleh outlet."],
    Washing: ["Proses cuci", "Item sedang dalam proses pencucian."],
    Drying: ["Proses pengeringan", "Item sedang dikeringkan."],
    Ironing: ["Proses setrika", "Item sedang disetrika dan dirapikan."],
    "Quality Check": ["Quality check", "Tim memeriksa hasil laundry sebelum diserahkan."],
    "Ready Pickup": ["Siap diambil", "Laundry sudah siap untuk diambil atau dikirim."],
    Completed: ["Selesai", "Pesanan laundry sudah selesai."],
};

export const FALLBACK_SERVICES = [
    ["11111111-1111-4111-8111-111111111111", "Cuci Komplit (Cuci + Setrika)", "Laundry Reguler", "Paket pencucian lengkap termasuk pencucian, pengeringan, dan penyetrikaan pakaian.", 10000, "Kg", "2 Hari", "Droplets", "teal"],
    ["22222222-2222-4222-8222-222222222222", "Setrika Saja", "Laundry Reguler", "Layanan penyetrikaan pakaian.", 7000, "Kg", "1 Hari", "Shirt", "cyan"],
    ["33333333-3333-4333-8333-333333333333", "Super Express 3 Jam", "Express", "Laundry selesai sekitar 3 jam.", 15000, "Kg", "3 Jam", "Zap", "amber"],
    ["44444444-4444-4444-8444-444444444444", "Bedcover & Blanket", "Bedding", "Pencucian bedcover dan selimut.", 25000, "Kg", "3 Hari", "Bed", "indigo"],
    ["55555555-5555-4555-8555-555555555555", "Premium Shoes Clean", "Shoes Care", "Pembersihan sepatu dengan treatment khusus.", 35000, "Pasang", "2 Hari", "Footprints", "emerald"],
    ["66666666-6666-4666-8666-666666666666", "Premium Satuan (Jas/Gaun)", "Premium", "Pencucian jas, blazer, dress, dan gaun.", 15000, "Pcs", "2 Hari", "Sparkles", "violet"],
].map(([id, name, category, description, price, unit, estimated_duration, icon, color]) => ({
    id,
    name,
    category,
    description,
    price,
    stock: 9999,
    unit,
    estimated_duration,
    icon,
    color,
    is_active: true,
}));

const parseDurationToDate = (duration) => {
    const date = new Date();
    const amount = Number(String(duration || "1").match(/\d+/)?.[0] || 1);
    if (/jam/i.test(duration || "")) date.setHours(date.getHours() + amount);
    else date.setDate(date.getDate() + amount);
    return date;
};

const generateInvoiceNumber = () => {
    const ymd = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `BW-${ymd}-${random}`;
};

export const getUserId = (user) => {
    if (!user) return null;
    if (user.id && /^[0-9a-f-]{36}$/i.test(user.id)) return user.id;
    if (user.profile_id && /^[0-9a-f-]{36}$/i.test(user.profile_id)) return user.profile_id;
    if (user.customerid && /^[0-9a-f-]{36}$/i.test(user.customerid)) return user.customerid;
    return null;
};

const ensureProfile = async (user) => {
    const existingId = getUserId(user);
    if (existingId) return existingId;
    if (!user?.customerid) throw new Error("Profil member belum memiliki customerid.");

    const query = `${SUPABASE_URL}/profiles?customerid=eq.${encodeURIComponent(user.customerid)}&select=id&limit=1`;
    const existing = await axios.get(query, { headers });
    if (existing.data?.[0]?.id) return existing.data[0].id;

    const profilePayload = {
        id: crypto.randomUUID(),
        customerid: user.customerid,
        full_name: user.fullname || user.username || "Member",
        points: 0,
        tier: user.plan || "Silver",
    };

    const created = await axios.post(`${SUPABASE_URL}/profiles`, profilePayload, { headers });
    if (!created.data?.[0]?.id) throw new Error("Gagal membuat profile member.");
    return created.data[0].id;
};

export const getStepIndex = (status) => {
    const index = TRACKING_STEPS.findIndex((step) => step.toLowerCase() === String(status || "").toLowerCase());
    return index >= 0 ? index : 0;
};

export const getProgressPercent = (status) =>
    Math.round((getStepIndex(status) / (TRACKING_STEPS.length - 1)) * 100);

export const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));

export const normalizeOrder = (order) => {
    const items = Array.isArray(order.order_items) ? order.order_items : [];
    const firstItem = items[0] || null;
    const service = firstItem?.products || null;

    return {
        ...order,
        current_step: order.current_step || order.status || "Pending",
        service_name: service?.name || order.service_type || "Laundry Service",
        service_unit: service?.unit || "Kg",
        quantity: firstItem?.quantity || 0,
        item_price: firstItem?.price || order.total_amount || 0,
        tracking: Array.isArray(order.order_tracking)
            ? [...order.order_tracking].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            : [],
    };
};

export const laundryPortalAPI = {
    async fetchServices() {
        try {
            const query = `${SUPABASE_URL}/products?is_active=eq.true&select=*&order=created_at.asc`;
            const response = await axios.get(query, { headers });
            return response.data?.length ? response.data : FALLBACK_SERVICES;
        } catch (error) {
            console.warn("Menggunakan fallback layanan laundry:", error.response?.data || error.message);
            return FALLBACK_SERVICES;
        }
    },

    async fetchOrders(user) {
        try {
            const userId = user?.customerid ? await ensureProfile(user) : getUserId(user);
            const userFilter = userId ? `user_id=eq.${encodeURIComponent(userId)}&` : "";
            const query = `${SUPABASE_URL}/orders?${userFilter}select=*,order_items(*,products(*)),order_tracking(*)&order=created_at.desc`;
            const response = await axios.get(query, { headers });
            return (response.data || []).map(normalizeOrder);
        } catch (error) {
            console.warn("Gagal mengambil order member:", error.response?.data || error.message);
            return [];
        }
    },

    async fetchOrderByInvoice(invoice) {
        try {
            const query = `${SUPABASE_URL}/orders?invoice_number=eq.${encodeURIComponent(invoice)}&select=*,order_items(*,products(*)),order_tracking(*)&limit=1`;
            const response = await axios.get(query, { headers });
            return response.data?.[0] ? normalizeOrder(response.data[0]) : null;
        } catch (error) {
            console.warn("Gagal mengambil detail tracking:", error.response?.data || error.message);
            return null;
        }
    },

    async createOrder({ user, cart, pickupMethod = "Drop Off" }) {
        const profileId = await ensureProfile(user);
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tier = String(user?.tier || user?.plan || "Silver").toLowerCase();
        const discountRate = tier === "platinum" ? 0.2 : tier === "gold" ? 0.15 : 0.1;
        const discountApplied = Math.round(totalAmount * discountRate);
        const finalAmount = totalAmount - discountApplied;
        const pointsEarned = Math.floor(finalAmount / 10000);
        const slowest = cart.reduce((selected, item) => parseDurationToDate(item.estimated_duration) > parseDurationToDate(selected.estimated_duration) ? item : selected, cart[0]);
        const estimatedFinish = parseDurationToDate(slowest?.estimated_duration).toISOString();
        const invoiceNumber = generateInvoiceNumber();

        const orderPayload = {
            user_id: profileId,
            total_amount: totalAmount,
            discount_applied: discountApplied,
            final_amount: finalAmount,
            points_earned: pointsEarned,
            status: "Pending",
            invoice_number: invoiceNumber,
            service_type: cart.map((item) => item.name).join(", "),
            pickup_method: pickupMethod,
            estimated_finish: estimatedFinish,
            payment_status: "Unpaid",
            current_step: "Pending",
        };

        try {
            const orderResponse = await axios.post(`${SUPABASE_URL}/orders`, orderPayload, { headers });
            const createdOrder = orderResponse.data?.[0];
            if (!createdOrder?.id) throw new Error("Order berhasil dikirim, tetapi ID order tidak diterima.");

            await axios.post(
                `${SUPABASE_URL}/order_items`,
                cart.map((item) => ({
                    order_id: createdOrder.id,
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                { headers },
            );

            const [title, description] = STATUS_COPY.Pending;
            await axios.post(`${SUPABASE_URL}/order_tracking`, {
                order_id: createdOrder.id,
                status: "Pending",
                title,
                description,
                updated_by: profileId,
            }, { headers });

            return { ...createdOrder, invoice_number: invoiceNumber, estimated_finish: estimatedFinish };
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.hint || error.message;
            throw new Error(message || "Gagal membuat order di Supabase.");
        }
    },
};

export default laundryPortalAPI;
