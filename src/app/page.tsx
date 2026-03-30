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
      <section className="text-center pt-2 pb-12 px-4">
        
        {/* 1. Jejeran Logo Penyelenggara (Diperkecil dan ditarik ke atas) */}
        <div className="flex items-center justify-start md:justify-center gap-3 sm:gap-4 md:gap-5 mb-8 opacity-90 bg-card/60 py-2.5 px-4 rounded-2xl border border-border max-w-fit mx-auto overflow-x-auto scrollbar-hide">
          <img src="/24jammenari.png" alt="24 Jam Menari" className="h-6 sm:h-7 md:h-9 w-auto object-contain flex-shrink-0" />
          <div className="w-px h-6 sm:h-7 md:h-9 bg-border mx-1 flex-shrink-0" />
          <img src="/tutwuri.png" alt="Tut Wuri Handayani" className="h-6 sm:h-7 md:h-9 w-auto object-contain flex-shrink-0" />
          <img src="/kemendisintek.png" alt="Kemendikbudristek" className="h-6 sm:h-7 md:h-9 w-auto object-contain flex-shrink-0" />
          <img src="/isi.png" alt="ISI Surakarta" className="h-6 sm:h-7 md:h-9 w-auto object-contain flex-shrink-0" />
          <img src="/himaswariska.png" alt="HIMASWARISKA" className="h-6 sm:h-7 md:h-9 w-auto object-contain flex-shrink-0" />
          <img src="/himakorin.png" alt="HIMAKORIN" className="h-6 sm:h-7 md:h-9 w-auto object-contain flex-shrink-0" />
          <img src="/sjs.png" alt="SJS" className="h-6 sm:h-7 md:h-9 w-auto object-contain flex-shrink-0" />
        </div>

        {/* 2. Logo Utama Besar */}
        <div className="inline-block mb-4">
          <img src="/24jammenari.png" alt="Logo Utama 24 Jam Menari" className="w-28 h-28 md:w-36 md:h-36 object-contain mx-auto drop-shadow-md" />
        </div>

        {/* 3. Teks Utama (Warna dikembalikan ke text-primary bawaan) */}
        <h2 className="text-lg md:text-xl font-medium tracking-widest text-muted-foreground uppercase mb-2">
          HARI TARI DUNIA KE - 20
        </h2>
        <h1 className="text-tradisional text-5xl md:text-7xl font-bold text-primary leading-tight drop-shadow-sm">
          24JAM MENARI SURAKARTA
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-light text-foreground max-w-2xl mx-auto leading-relaxed italic">
          "Tanpa Batas : Menembus Medan Budaya"
        </p>

        {/* Ornamen */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="h-px w-16 bg-accent opacity-60" />
          <span className="text-accent text-xl">✦</span>
          <div className="h-px w-16 bg-accent opacity-60" />
        </div>

        {/* 4. Tombol Akses (Warna dikembalikan ke bg-primary bawaan) */}
        <div className="mt-8 flex justify-center w-full">
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/dashboard/user")}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground text-lg font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-md w-full sm:w-auto"
            >
              📅 Cek Dashboard Saya
            </button>
          ) : (
            <button
              onClick={() => setShowLoginDialog(true)}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground text-lg font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-md w-full sm:w-auto"
            >
              🔐 Masuk ke Dashboard
            </button>
          )}
        </div>

        {/* Greeting jika sudah login */}
        {isLoggedIn && userName && (
          <p className="mt-3 text-base text-muted-foreground text-center">
            Masuk sebagai{" "}
            <span className="font-semibold text-foreground">{userName}</span>
          </p>
        )}

        {/* Info Box */}
        <div className="mt-8 inline-flex flex-col sm:flex-row gap-4 text-sm justify-center">
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

      {/* 5. Panduan Pendaftaran */}
      <section className="mt-8 mb-16 bg-card/50 batik-border rounded-xl p-8 max-w-4xl mx-auto shadow-sm">
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
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">
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

      {/* Divider Venue */}
      <div className="flex items-center gap-4 my-4 max-w-5xl mx-auto">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-sm tracking-widest uppercase">
          Pilih Venue
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Venue Cards */}
      <section className="mt-6 max-w-5xl mx-auto pb-12">
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
