"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/lib/store/bookingStore";
import { formatPrice } from "@/lib/data/venues";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldError = Partial<Record<keyof FormState, string>>;

// Helper: baca bookingId dari sessionStorage sebagai fallback
function getBookingIdFromSession(): string | null {
  try {
    const raw = sessionStorage.getItem("pending_payment");
    return raw ? JSON.parse(raw).bookingId : null;
  } catch {
    return null;
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const {
    selectedVenueName,
    selectedSlotTime,
    selectedSlotPrice,
    paymentStatus,
    bookingId,
    setUser,
    setLoggedIn,
  } = useBookingStore();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ FIX 2: Flag agar guard tidak redirect sebelum sessionStorage dicek
  const [isRestored, setIsRestored] = useState(false);

  // ✅ FIX 2: Cek store ATAU sessionStorage — jangan redirect jika session masih ada
  useEffect(() => {
    const sessionBookingId = getBookingIdFromSession();
    const hasStore = paymentStatus === "success" && !!bookingId;
    const hasSession = !!sessionBookingId;

    if (!hasStore && !hasSession) {
      router.replace("/");
    } else {
      setIsRestored(true);
    }
  }, [paymentStatus, bookingId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError(null);
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.name.trim()) newErrors.name = "Nama tidak boleh kosong.";
    if (!form.email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!form.password) {
      newErrors.password = "Password tidak boleh kosong.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // ✅ FIX 2: Ambil bookingId dari store, fallback ke sessionStorage
    const activeBookingId = bookingId ?? getBookingIdFromSession();
    if (!activeBookingId) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.confirmPassword,
            booking_id: activeBookingId,
          }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        const firstError = resData.errors
          ? Object.values(resData.errors as Record<string, string[]>)[0]?.[0]
          : resData.message;
        throw new Error(firstError || "Gagal membuat akun.");
      }

      // ✅ FIX 1: Key "access_token" — konsisten dengan yang dibaca di dashboard
      if (resData.data?.access_token) {
        localStorage.setItem("access_token", resData.data.access_token);
      }

      // Bersihkan session pembayaran karena sudah selesai dipakai
      try { sessionStorage.removeItem("pending_payment"); } catch (_) {}

      // Update store
      setUser(form.email, form.name);
      setLoggedIn(true);
      setIsSubmitting(false);

      // ✅ FIX 3: Arahkan ke dashboard/user — bukan /booking/form yang tidak ada
      router.push("/dashboard/user");
    } catch (error: any) {
      setServerError(error.message || "Terjadi kesalahan. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  // Tunggu hasil cek guard sebelum render
  if (!isRestored) return null;

  return (
    <PageWrapper narrow>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎊</div>
        <h1 className="text-tradisional text-4xl font-bold text-primary">
          Buat Akun Anda
        </h1>
        <p className="text-muted-foreground mt-2 text-lg leading-relaxed">
          Pembayaran berhasil! Buat akun untuk mengakses <br />
          dashboard dan melengkapi data penampilan Anda.
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-12 bg-accent opacity-60" />
          <span className="text-accent">✦</span>
          <div className="h-px w-12 bg-accent opacity-60" />
        </div>
      </div>

      {/* Ringkasan slot yang sudah dibeli */}
      <Card className="bg-primary/5 border-primary/20 border mb-6">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wide">
            Slot yang berhasil dikunci
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎭</span>
              <div>
                <p className="font-bold text-lg text-foreground">
                  {selectedVenueName}
                </p>
                <p className="text-muted-foreground">{selectedSlotTime}</p>
              </div>
            </div>
            <span className="text-xl font-bold text-primary">
              {formatPrice(selectedSlotPrice ?? 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Form Buat Akun */}
      <Card className="batik-border border-0">
        <CardContent className="p-6">
          <h2 className="text-tradisional text-xl font-bold text-primary mb-4">
            Data Akun
          </h2>
          <Separator className="mb-6" />

          {serverError && (
            <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Nama */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Nama Lengkap <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
                className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.name ? "border-destructive" : "border-input"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.email ? "border-destructive" : "border-input"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors pr-36 ${
                    errors.password ? "border-destructive" : "border-input"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
                >
                  {showPassword ? "🙈 Sembunyikan" : "👁️ Tampilkan"}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Konfirmasi Password <span className="text-destructive">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password Anda"
                className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.confirmPassword ? "border-destructive" : "border-input"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Separator />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-xl py-7 font-semibold"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-lg">⏳</span>
                  Membuat akun...
                </span>
              ) : (
                "Buat Akun & Masuk ke Dashboard →"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Akun ini akan digunakan untuk mengakses dashboard penampilan Anda
            </p>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
