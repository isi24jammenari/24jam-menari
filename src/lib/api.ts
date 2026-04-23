import axios from "axios";

// Ambil URL dari environment, fallback ke localhost Laravel jika tidak ada
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // Mutlak wajib bernilai true agar Laravel Sanctum bisa membaca session/cookie CORS
  withCredentials: true, 
});

// ==========================================
// ✅ REQUEST INTERCEPTOR (YANG SEBELUMNYA HILANG)
// Mengambil token dari localStorage dan menaruhnya di Headers
// ==========================================
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==========================================
// ✅ RESPONSE INTERCEPTOR
// Menangani Error Global (misal: token expired / belum login)
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - token tidak valid atau expired.");
      
      // Redirect paksa ke halaman login baru & hapus token usang
      if (typeof window !== 'undefined') {
        // Cek apakah sedang di halaman login/register agar tidak infinite loop
        if (!window.location.pathname.includes('/auth/login') && !window.location.pathname.includes('/booking/register')) {
            localStorage.removeItem("access_token");
            window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// TENANT / BAZAAR API ENDPOINTS
// ==========================================

export const getTenantStands = async () => {
  try {
    const response = await api.get('/tenant/stands');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data stand tenant');
  }
};

export const holdTenantStand = async (data: {
  stand_id: string;
  payment_method: string;
  pendaftar_name: string;
  pendaftar_email: string;
  phone: string;
}) => {
  try {
    const response = await api.post('/tenant/booking/hold', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal booking stand');
  }
};

export const getTenantStatus = async (orderId: string) => {
  try {
    const response = await api.get(`/tenant/booking/status/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil status transaksi');
  }
};

export const submitTenantForm = async (data: {
  order_id?: string;
  access_code?: string;
  tenant_name: string;
  product_type: string;
}) => {
  try {
    const response = await api.post('/tenant/booking/submit-form', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal submit formulir');
  }
};

export default api;