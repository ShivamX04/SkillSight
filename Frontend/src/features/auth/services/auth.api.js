import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ REGISTER
export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }
}

// ✅ LOGIN
export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

// ✅ LOGOUT
export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
}

// ✅ GET CURRENT USER
export async function getMe() {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (err) {
    console.error("GetMe error:", err);
    throw err;
  }
}