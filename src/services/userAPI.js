import axios from 'axios';

// URL of the Supabase "users" table – adjust if your table name differs
const API_URL = "https://gqfmyeatzyhlpwaayyrw.supabase.co/rest/v1/user";

// API Key – same as used in customerAPI.js
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZm15ZWF0enlobHB3YWF5eXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTc2OTcsImV4cCI6MjA5NjUzMzY5N30.aBIEH-skNf5p8eHN0g56h7SPNIw_4gRIrtPFUTblg1g";

// Headers required by Supabase REST API
const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  // Ask Supabase to return the newly created row
  Prefer: "return=representation",
};

/**
 * Register a new user.
 * The Supabase table must have an auto‑increment primary key (uid).
 * Payload: { username, password, role }
 */
export const registerUser = async (payload) => {
  try {
    const response = await axios.post(API_URL, payload, { headers });
    // Supabase returns the inserted record(s) in response.data
    return response.data;
  } catch (error) {
    console.error('Failed to register user:', error.response?.data || error);
    // Provide a clearer error message when Supabase returns one
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Login a user by checking username and password against the Supabase table.
 * Returns the matching user record(s) if credentials are correct.
 */
export const loginUser = async ({ username, password }) => {
  try {
    // Supabase filter syntax: ?username=eq.{username}&password=eq.{password}
    const query = `${API_URL}?username=eq.${encodeURIComponent(username)}&password=eq.${encodeURIComponent(password)}`;
    const response = await axios.get(query, { headers });
    return response.data; // should be an array of matching rows (empty if none)
  } catch (error) {
    console.error('Failed to login user:', error.response?.data || error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export default { registerUser, loginUser };