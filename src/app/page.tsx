"use client";

import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import VenueCard from "@/components/booking/VenueCard";
import { venues } from "@/lib/data/venues";
import { useBookingStore } from "@/lib/store/bookingStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, userName, paymentStatus, setUser, setPaymentStatus } =
    useBookingStore();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Simulasi login — demo statis
  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Email dan password tidak boleh kosong.");
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      // Simulasi: ambil nama dari email
      const name = loginForm.email.split("@")[0];
      setUser(loginForm.email, name);
      setPaymentStatus("success");
      setIsLoggingIn(false);
      setShowLoginDialog(false);
      setLoginError("");
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="text-center py-12 px-4">
        <div className="inline-block mb-4">
          <span className="text-6xl">🎭</span>
        </div>
        <h1 className="text-tradisional text-5xl md:text-6xl font-bold text-primary leading-tight">
          24 Jam Menari
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Platform pendaftaran resmi slot penampilan seni.<br />
          Pilih venue dan waktu tampil Anda.
        </p>

        {/* Ornamen */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px w-16 bg-accent opacity-60" />
          <span className="text-accent text-xl">✦</span>
          <div className="h-px w-16 bg-accent opacity-60" />
        </div>

        {/* ── Tombol Akses ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Tombol User */}
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/dashboard/user")}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-lg font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-md"
            >
              📅 Cek Dashboard Saya
            </button>
          ) : (
            <button
              onClick={() => setShowLoginDialog(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-lg font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-md"
            >
              🔐 Masuk ke Dashboard
            </button>
          )}

          {/* Tombol Admin — sementara untuk tester */}
          <button
            onClick={() => router.push("/dashboard/admin")}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground text-lg font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-md"
          >
            ⚙️ Admin (Tester)
          </button>
        </div>

        {/* Greeting jika sudah login */}
        {isLoggedIn && userName && (
          <p className="mt-3 text-base text-muted-foreground">
            Masuk sebagai{" "}
            <span className="font-semibold text-foreground">{userName}</span>
          </p>
        )}

        {/* Info */}
        <div className="mt-8 inline-flex flex-col sm:flex-row gap-4 text-sm">
          <div className="bg-card batik-border rounded-lg px-5 py-3 text-muted-foreground">
            🕐 <span className="font-semibold text-foreground">1 slot</span> per kelompok/perorangan
          </div>
          <div className="bg-card batik-border rounded-lg px-5 py-3 text-muted-foreground">
            ⏳ Waktu pembayaran{" "}
            <span className="font-semibold text-foreground">15 menit</span> setelah memilih
          </div>
          <div className="bg-card batik-border rounded-lg px-5 py-3 text-muted-foreground">
            🎫 Slot bersifat{" "}
            <span className="font-semibold text-foreground">eksklusif</span> per penampil
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-sm tracking-widest uppercase">
          Pilih Venue
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Venue Cards */}
      <section className="mt-6">
        <SectionTitle
          title="Venue Penampilan"
          subtitle="Pilih salah satu dari empat venue berikut untuk melihat ketersediaan jam show."
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      {/* Panduan */}
      <section className="mt-16 bg-card batik-border rounded-xl p-8">
        <SectionTitle
          title="Panduan Pendaftaran"
          subtitle="Ikuti langkah berikut untuk mendaftarkan penampilan Anda."
          className="mb-6"
        />
        <ol className="space-y-4">
          {[
            { step: "1", title: "Pilih Venue", desc: "Pilih salah satu dari empat venue yang tersedia sesuai kebutuhan penampilan Anda." },
            { step: "2", title: "Pilih Jam Show", desc: "Lihat ketersediaan slot dan pilih jam yang sesuai. Setiap slot hanya untuk satu penampil." },
            { step: "3", title: "Lakukan Pembayaran", desc: "Selesaikan pembayaran dalam 15 menit. Slot akan dikunci sementara selama proses ini." },
            { step: "4", title: "Buat Akun & Isi Formulir", desc: "Setelah pembayaran berhasil, buat akun untuk mengakses dashboard dan isi data penampilan Anda." },
          ].map((item) => (
            <li key={item.step} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {item.step}
              </span>
              <div>
                <p className="font-semibold text-lg text-foreground">{item.title}</p>
                <p className="text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Dialog Login */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-tradisional text-2xl text-primary">
              🔐 Masuk ke Dashboard
            </DialogTitle>
            <DialogDescription className="text-base">
              Masukkan email dan password akun Anda yang sudah terdaftar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((p) => ({ ...p, email: e.target.value }))
                }
                onKeyDown={handleKeyDown}
                placeholder="contoh@email.com"
                className="w-full text-lg px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground block">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((p) => ({ ...p, password: e.target.value }))
                }
                onKeyDown={handleKeyDown}
                placeholder="Masukkan password"
                className="w-full text-lg px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>

            {/* Error */}
            {loginError && (
              <p className="text-sm text-destructive">{loginError}</p>
            )}

            {/* Info demo */}
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-sm text-foreground">
              💡 <span className="font-semibold">Mode Demo:</span> Isi email
              dan password apapun untuk masuk.
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLoginDialog(false);
                  setLoginError("");
                }}
                className="flex-1 text-lg py-6"
              >
                Batal
              </Button>
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex-1 text-lg py-6"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Masuk...
                  </span>
                ) : (
                  "Masuk →"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
