import axios from "axios";

const SUPABASE_URL = "https://gqfmyeatzyhlpwaayyrw.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZm15ZWF0enlobHB3YWF5eXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTc2OTcsImV4cCI6MjA5NjUzMzY5N30.aBIEH-skNf5p8eHN0g56h7SPNIw_4gRIrtPFUTblg1g";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
};

export const ORDER_STEPS = [
    "Pending",
    "Confirmed",
    "Received",
    "Washing",
    "Drying",
    "Ironing",
    "Quality Check",
    "Ready Pickup",
    "Completed",
    "Cancelled",
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
    Cancelled: ["Dibatalkan", "Pesanan laundry dibatalkan oleh admin."],
};

const normalizeOrder = (order) => ({
    ...order,
    current_step: order.current_step || order.status || "Pending",
    service_name: order.service_type || "Laundry Service",
    tracking: Array.isArray(order.order_tracking)
        ? [...order.order_tracking].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        : [],
    items: Array.isArray(order.order_items) ? order.order_items : [],
    customer_name: order.profiles?.full_name || "-",
    customer_id: order.profiles?.customerid || "-",
});

const fetchWithRetry = async (url, options = {}, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await axios.get(url, { ...options, headers });
        } catch (error) {
            if (i === retries) throw error;
            await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        }
    }
};

const approveFeedback = async (feedbackId, approve = true) => {
    if (!feedbackId) throw new Error("Feedback ID harus diisi.");
    try {
        await axios.patch(
            `${SUPABASE_URL}/feedback?id=eq.${encodeURIComponent(feedbackId)}`,
            { is_approved: approve, updated_at: new Date().toISOString() },
            { headers }
        );
        return { success: true };
    } catch (error) {
        const message = error.response?.data?.message || error.response?.data?.hint || error.message;
        throw new Error(message || "Gagal mengubah status feedback.");
    }
};

const adminOrdersAPI = {
    async fetchAdminOrders() {
        try {
            const query = `${SUPABASE_URL}/orders?select=*,order_items(*,products(*)),order_tracking(*),profiles!orders_user_id_fkey(full_name,customerid)&order=created_at.desc`;
            const response = await fetchWithRetry(query);
            return (response.data || []).map(normalizeOrder);
        } catch (error) {
            console.warn("Gagal mengambil data orders admin:", error.response?.data || error.message);
            return [];
        }
    },

    async fetchAdminOrderById(orderId) {
        try {
            const query = `${SUPABASE_URL}/orders?id=eq.${encodeURIComponent(orderId)}&select=*,order_items(*,products(*)),order_tracking(*),profiles!orders_user_id_fkey(full_name,customerid)&limit=1`;
            const response = await fetchWithRetry(query);
            return response.data?.[0] ? normalizeOrder(response.data[0]) : null;
        } catch (error) {
            console.warn("Gagal mengambil detail order admin:", error.response?.data || error.message);
            return null;
        }
    },

    async updateOrderStatus(orderId, status, adminId = null) {
        if (!orderId || !status) throw new Error("orderId dan status harus diisi.");
        const [title, description] = STATUS_COPY[status] || [status, `Status diubah ke ${status}.`];
        const now = new Date().toISOString();

        try {
            await axios.patch(
                `${SUPABASE_URL}/orders?id=eq.${encodeURIComponent(orderId)}`,
                { current_step: status, status, updated_at: now },
                { headers }
            );

            const trackingPayload = {
                order_id: orderId,
                status,
                title,
                description,
                updated_by: adminId,
                created_at: now,
            };
            await axios.post(`${SUPABASE_URL}/order_tracking`, trackingPayload, { headers });

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.hint || error.message;
            throw new Error(message || "Gagal mengubah status order.");
        }
    },

    async updatePaymentStatus(orderId, paymentStatus) {
        if (!orderId || !paymentStatus) throw new Error("orderId dan paymentStatus harus diisi.");

        try {
            await axios.patch(
                `${SUPABASE_URL}/orders?id=eq.${encodeURIComponent(orderId)}`,
                { payment_status: paymentStatus, updated_at: new Date().toISOString() },
                { headers }
            );
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.hint || error.message;
            throw new Error(message || "Gagal mengubah payment status.");
        }
    },

    async updateEstimatedFinish(orderId, estimatedFinish) {
        if (!orderId) throw new Error("orderId harus diisi.");

        try {
            await axios.patch(
                `${SUPABASE_URL}/orders?id=eq.${encodeURIComponent(orderId)}`,
                { estimated_finish: estimatedFinish, updated_at: new Date().toISOString() },
                { headers }
            );
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.hint || error.message;
            throw new Error(message || "Gagal mengubah estimated finish.");
        }
    },
};

export { approveFeedback };

export default adminOrdersAPI;
