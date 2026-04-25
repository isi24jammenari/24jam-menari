"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store/bookingStore";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TenantAdminLogin() {
  const router = useRouter();
  const { setUser } = useBookingStore();

  // State Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg("");

    try {
      // 1. Memanggil route /tenant/auth/login yang sudah kita buat di backend sebelumnya
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Gagal masuk. Silakan periksa kembali kredensial Anda.");

      // 2. Simpan token ke localStorage persis seperti login utama
      localStorage.setItem("access_token", resData.data.access_token);
      setUser(resData.data.user.email, resData.data.user.name);
      
      // 3. Arahkan mutlak ke halaman admin tenant
      window.location.href = "/admin";

    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <PageWrapper narrow>
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-12 px-4 relative">
        {/* Dekorasi Latar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardHeader className="text-center space-y-2 pb-8 pt-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-inner border border-primary/20">
              <span className="text-3xl">🔐</span>
            </div>
            <CardTitle className="text-3xl font-black text-foreground tracking-tight">
              Admin Bazaar Tenant
            </CardTitle>
            <CardDescription className="text-base font-medium">
              Masuk untuk memverifikasi pendaftaran tenant
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {errorMsg && (
              <div className="mb-6 p-4 bg-destructive/10 border-l-4 border-destructive rounded-r-lg text-destructive text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="text-lg">⚠️</span>
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Alamat Email Admin</label>
                <input
                  type="email"
                  required
                  placeholder="admin@tenant.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-muted-foreground/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-muted-foreground/60 tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl mt-2"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin text-xl">⏳</span> Memverifikasi...
                  </span>
                ) : "Masuk ke Dasbor"}
              </Button>
            </form>
            
            <div className="mt-8 text-center text-xs text-muted-foreground italic">
              Area ini diakses secara terbatas hanya oleh Panitia Bazaar 24 Jam Menari.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}