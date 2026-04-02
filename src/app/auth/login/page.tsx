"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBookingStore } from "@/lib/store/bookingStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useBookingStore();
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Email dan password tidak boleh kosong.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Email atau password salah.");
      }

      // Simpan token ke localStorage
      localStorage.setItem("access_token", resData.data.access_token);
      
      // Update store user
      // Update store user
      setUser(resData.data.user.email, resData.data.user.name);

      setIsLoggingIn(false);
      
      // Arahkan ke dashboard berdasarkan deteksi domain
      // Menggunakan window.location.href untuk HARD REFRESH agar cache Next.js ter-reset dan token terbaca sempurna
      const isAdminDomain = window.location.hostname.includes("admin");
      
      if (isAdminDomain) {
        window.location.href = "/dashboard/admin";
      } else {
        window.location.href = "/dashboard/user";
      }

    } catch (error: any) {
      setLoginError(error.message || "Terjadi kesalahan. Coba lagi.");
      setIsLoggingIn(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <PageWrapper narrow>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
        <Card className="w-full max-w-md batik-border border-0 shadow-xl bg-card">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-tradisional text-3xl text-primary">
              🔐 Masuk ke Dashboard
            </CardTitle>
            <CardDescription className="text-base">
              Masukkan email dan password akun pendaftaran Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="contoh@email.com"
                className="w-full text-lg px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="Masukkan password"
                className="w-full text-lg px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>

            {loginError && (
              <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-xl">
                ⚠️ {loginError}
              </p>
            )}

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-foreground mt-2">
              <p className="font-semibold text-primary mb-1">💡 Informasi Akun</p>
              <p className="text-muted-foreground leading-relaxed">
                Akun dibuat otomatis setelah pembayaran slot pementasan berhasil. Belum punya akun? Silakan pilih venue dan selesaikan pembayaran terlebih dahulu di halaman utama.
              </p>
              <div className="mt-4 pt-4 border-t border-primary/10">
                <p className="text-destructive font-semibold mb-2 text-center">Sudah bayar tapi terkeluar?</p>
                <Button 
                  variant="outline" 
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive/10" 
                  onClick={() => router.push('/booking/claim')}
                  type="button"
                >
                   Klaim Jadwal & Buat Akun
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full text-lg py-6 mt-4 font-bold"
              size="lg"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Memproses...
                </span>
              ) : (
                "Masuk ke Dashboard →"
              )}
            </Button>
            
            <div className="text-center mt-2">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')} 
                className="text-muted-foreground hover:text-primary"
              >
                ← Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}