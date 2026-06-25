import axios from 'axios';

// URL of the Supabase "user" table
const API_URL = "https://gqfmyeatzyhlpwaayyrw.supabase.co/rest/v1/user";

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZm15ZWF0enlobHB3YWF5eXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTc2OTcsImV4cCI6MjA5NjUzMzY5N30.aBIEH-skNf5p8eHN0g56h7SPNIw_4gRIrtPFUTblg1g";

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

/**
 * Check if username already exists in user table.
 */
export const checkUsernameExists = async (username) => {
  try {
    const query = `${API_URL}?username=eq.${encodeURIComponent(username)}&select=username`;
    const response = await axios.get(query, { headers });
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error('Check username error:', error);
    return false;
  }
};

/**
 * Check if email already exists in user table.
 */
export const checkEmailExists = async (email) => {
  try {
    const query = `${API_URL}?email=eq.${encodeURIComponent(email)}&select=email`;
    const response = await axios.get(query, { headers });
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error('Check email error:', error);
    return false;
  }
};

/**
 * Register a new user.
 * Columns: uid (auto), username, password, role, email, customerid (FK)
 */
export const registerUser = async (payload) => {
  try {
    const response = await axios.post(API_URL, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Failed to register user:', error.response?.data || error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Login a user by checking username and password.
 */
export const loginUser = async ({ username, password }) => {
  try {
    const query = `${API_URL}?username=eq.${encodeURIComponent(username)}&password=eq.${encodeURIComponent(password)}`;
    const response = await axios.get(query, { headers });
    return response.data;
  } catch (error) {
    console.error('Failed to login user:', error.response?.data || error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export default { registerUser, loginUser, checkUsernameExists, checkEmailExists };
