"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/lib/store/bookingStore";
import { formatPrice } from "@/lib/data/venues";

// ✅ 1. Tambahkan field baru di FormState
type FormState = {
  name: string;
  email: string;
  phone_number: string;
  institution_name: string;
  address: string;
  password: string;
  confirmPassword: string;
};

type FieldError = Partial<Record<keyof FormState, string>>;

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

  // ✅ 2. Masukkan inisial state untuk field baru
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone_number: "",
    institution_name: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError(null);
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ✅ 3. Tambahkan validasi form untuk data diri baru
  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.name.trim()) newErrors.name = "Nama tidak boleh kosong.";
    if (!form.email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    
    if (!form.phone_number.trim()) newErrors.phone_number = "Nomor Telepon/WA tidak boleh kosong.";
    if (!form.institution_name.trim()) newErrors.institution_name = "Nama Sanggar/Institusi tidak boleh kosong.";
    if (!form.address.trim()) newErrors.address = "Alamat tidak boleh kosong.";

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

    const activeBookingId = bookingId ?? getBookingIdFromSession();
    if (!activeBookingId) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      // ✅ 4. Kirim data baru ke backend
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
            phone_number: form.phone_number,
            institution_name: form.institution_name,
            address: form.address,
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

      if (resData.data?.access_token) {
        localStorage.setItem("access_token", resData.data.access_token);
      }

      try { sessionStorage.removeItem("pending_payment"); } catch (_) {}

      setUser(form.email, form.name);
      setLoggedIn(true);
      setIsSubmitting(false);

      router.push("/dashboard/user");
    } catch (error: any) {
      setServerError(error.message || "Terjadi kesalahan. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (!isRestored) return null;

  return (
    <PageWrapper narrow>
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

      <Card className="batik-border border-0">
        <CardContent className="p-6">
          <h2 className="text-tradisional text-xl font-bold text-primary mb-4">
            Data Diri & Akun
          </h2>
          <Separator className="mb-6" />

          {serverError && (
            <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Nama Lengkap Penanggung Jawab <span className="text-destructive">*</span>
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
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Email Aktif <span className="text-destructive">*</span>
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
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* ✅ 5. UI Baru: Nomor WA */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Nomor Telepon / WhatsApp <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="08123456789"
                className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.phone_number ? "border-destructive" : "border-input"
                }`}
              />
              {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number}</p>}
            </div>

            {/* ✅ 5. UI Baru: Institusi */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Nama Sanggar / Institusi <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="institution_name"
                value={form.institution_name}
                onChange={handleChange}
                placeholder="Contoh: Sanggar Tari Kinasih / ISI Surakarta"
                className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.institution_name ? "border-destructive" : "border-input"
                }`}
              />
              {errors.institution_name && <p className="text-sm text-destructive">{errors.institution_name}</p>}
            </div>

            {/* ✅ 5. UI Baru: Alamat */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Alamat Lengkap <span className="text-destructive">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap (Jalan, Kota/Kabupaten, Provinsi)"
                rows={3}
                className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
                  errors.address ? "border-destructive" : "border-input"
                }`}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Buat Password <span className="text-destructive">*</span>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm font-medium"
                >
                  {showPassword ? "🙈 Sembunyikan" : "👁️ Tampilkan"}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

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
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Separator />

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