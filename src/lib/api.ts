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

// Interceptor untuk menangani error global (misal: token expired / belum login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Jika butuh aksi spesifik saat user tidak terautentikasi, tangani di sini
      console.warn("Unauthorized access - harap login kembali.");
    }
    return Promise.reject(error);
  }
);

export default api;