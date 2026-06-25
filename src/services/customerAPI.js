import axios from 'axios';

// URL matches actual Supabase table name: "customer" (not "customers")
const API_URL = "https://gqfmyeatzyhlpwaayyrw.supabase.co/rest/v1/customer";

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZm15ZWF0enlobHB3YWF5eXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTc2OTcsImV4cCI6MjA5NjUzMzY5N30.aBIEH-skNf5p8eHN0g56h7SPNIw_4gRIrtPFUTblg1g";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const customerAPI = {
    /**
     * Fetch customer by username (actual column: username)
     */
    async fetchCustomerByUsername(username) {
        try {
            const response = await axios.get(
                `${API_URL}?username=eq.${encodeURIComponent(username)}`,
                { headers }
            );
            return response.data && response.data.length > 0 ? response.data[0] : null;
        } catch (error) {
            console.error("Gagal mengambil data customer:", error);
            throw error;
        }
    },

    /**
     * Fetch membership by customerid (actual column: customerid)
     */
    async fetchMembershipByCustomerId(customerid) {
        try {
            const MEMBERSHIP_URL = API_URL.replace('/customer', '/membership');
            const response = await axios.get(
                `${MEMBERSHIP_URL}?customerId=eq.${encodeURIComponent(customerid)}`,
                { headers }
            );
            return response.data && response.data.length > 0 ? response.data[0] : null;
        } catch (error) {
            console.error("Gagal mengambil data membership:", error);
            return null;
        }
    },

    /**
     * Fetch all customers
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
     * Create a new customer
     * Actual columns: customerid, fullname, username, gender, birthDate, plan
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
     * Update customer by customerid
     */
    async updateCustomer(customerid, customerData) {
        try {
            const response = await axios.patch(
                `${API_URL}?customerid=eq.${customerid}`,
                customerData,
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error("Gagal mengupdate customer:", error);
            throw error;
        }
    },

    /**
     * Delete customer by customerid
     */
    async deleteCustomer(customerid) {
        try {
            const response = await axios.delete(
                `${API_URL}?customerid=eq.${customerid}`,
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error("Gagal menghapus customer:", error);
            throw error;
        }
    },
};
