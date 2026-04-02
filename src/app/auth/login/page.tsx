"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store/bookingStore";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useBookingStore();

  // State Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State Lupa Password
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<"email" | "token">("email");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Gagal masuk. Silakan periksa kembali kredensial Anda.");

      localStorage.setItem("access_token", resData.data.access_token);
      setUser(resData.data.user.email, resData.data.user.name);
      
      const isAdminDomain = window.location.hostname.includes("admin");
      window.location.href = isAdminDomain ? "/dashboard/admin" : "/dashboard/user";

    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendOTP = async () => {
    if (!forgotEmail) return;
    setIsForgotLoading(true);
    setForgotError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim OTP.");

      setForgotStep("token");
      setForgotSuccess("Kode OTP 6 digit telah dikirim ke email Anda.");
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setForgotError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsForgotLoading(true);
    setForgotError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ 
          email: forgotEmail, 
          token: resetToken, 
          password: newPassword, 
          password_confirmation: confirmPassword 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mereset password.");

      // Reset Sukses, tutup modal dan isi form login
      setIsForgotModalOpen(false);
      setEmail(forgotEmail);
      setPassword(newPassword);
      setForgotStep("email");
      setErrorMsg("Password berhasil diubah. Silakan klik Masuk.");
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setIsForgotLoading(false);
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
              <span className="text-3xl">🎭</span>
            </div>
            <CardTitle className="text-3xl font-black text-foreground tracking-tight">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-base font-medium">
              Masuk ke dasbor portal 24 Jam Menari
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
                <label className="text-sm font-bold text-foreground">Alamat Email</label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-muted-foreground/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Kata Sandi</label>
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotModalOpen(true); setForgotStep("email"); setForgotError(""); setForgotSuccess(""); }}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    Lupa Password?
                  </button>
                </div>
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
                    <span className="animate-spin text-xl">⏳</span> Memproses...
                  </span>
                ) : "Masuk ke Dasbor"}
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 font-bold text-muted-foreground">Butuh Bantuan?</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-sm flex gap-3">
                <span className="text-xl">💡</span>
                <div className="text-muted-foreground leading-relaxed">
                  Akun dibuat otomatis setelah pembayaran slot berhasil. Belum punya akun? Selesaikan pembayaran terlebih dahulu di halaman utama.
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-12 border-destructive/30 text-destructive hover:bg-destructive/10 font-bold rounded-xl" 
                onClick={() => router.push('/booking/claim')}
                type="button"
              >
                Sudah bayar tapi belum buat akun? Klaim Disini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL LUPA PASSWORD */}
      <Dialog open={isForgotModalOpen} onOpenChange={setIsForgotModalOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-primary" />
          <DialogHeader className="pt-4 pb-2">
            <DialogTitle className="text-2xl font-black text-center">Pulihkan Akses</DialogTitle>
            <DialogDescription className="text-center font-medium">
              {forgotStep === "email" ? "Masukkan email yang terdaftar untuk menerima kode OTP." : "Masukkan 6 digit kode OTP dan password baru Anda."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {forgotError && <p className="text-sm font-bold text-destructive text-center bg-destructive/10 py-2 rounded-lg">{forgotError}</p>}
            {forgotSuccess && <p className="text-sm font-bold text-green-600 text-center bg-green-50 py-2 rounded-lg">{forgotSuccess}</p>}

            {forgotStep === "email" ? (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email terdaftar..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary transition-all font-medium"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <Button onClick={handleSendOTP} disabled={isForgotLoading || !forgotEmail} className="w-full h-12 font-bold rounded-xl">
                  {isForgotLoading ? "Mengirim OTP..." : "Kirim Kode OTP"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <input
                  type="text"
                  placeholder="Kode OTP 6 Digit"
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary transition-all font-mono text-center tracking-[0.5em] text-lg uppercase"
                  maxLength={6}
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password Baru"
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Ulangi Password Baru"
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={handleResetPassword} disabled={isForgotLoading || !resetToken || !newPassword} className="w-full h-12 font-bold rounded-xl">
                  {isForgotLoading ? "Memproses..." : "Simpan Password Baru"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}