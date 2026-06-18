import axios from 'axios';

// TODO: Ganti dengan URL API Customer Anda
const API_URL = "https://gqfmyeatzyhlpwaayyrw.supabase.co/rest/v1/customer"; // URL tabel customer Supabase

// TODO: Ganti dengan API Key Anda
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZm15ZWF0enlobHB3YWF5eXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTc2OTcsImV4cCI6MjA5NjUzMzY5N30.aBIEH-skNf5p8eHN0g56h7SPNIw_4gRIrtPFUTblg1g";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const customerAPI = {
    /**
     * Mengambil daftar semua customer
     */
    async fetchCustomers() {
        try {
            const response = await axios.get(API_URL, { headers });
            return response.data;
        } catch (error) {
            console.error("Gagal mengambil data customer:", error);
            throw error;
        }
    },

    /**
     * Menambahkan customer baru
     * @param {Object} customerData - Objek data customer baru
     */
    async createCustomer(customerData) {
        try {
            const response = await axios.post(API_URL, customerData, { headers });
            return response.data;
        } catch (error) {
            console.error("Gagal menambahkan customer baru:", error);
            throw error;
        }
    },

    /**
     * Mengupdate data customer yang sudah ada
     * (Format URL/Query bisa disesuaikan dengan aturan API Anda, misal Supabase menggunakan ?id=eq.{id})
     */
    async updateCustomer(id, customerData) {
        try {
            const response = await axios.patch(`${API_URL}?id=eq.${id}`, customerData, { headers });
            return response.data;
        } catch (error) {
            console.error("Gagal mengupdate customer:", error);
            throw error;
        }
    },

    /**
     * Menghapus customer
     */
    async deleteCustomer(id) {
        try {
            const response = await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error("Gagal menghapus customer:", error);
            throw error;
        }
    }
};
