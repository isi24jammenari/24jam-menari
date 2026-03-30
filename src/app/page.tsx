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
      <section className="text-center pt-4 pb-12 px-4">
        
        {/* Jejeran Logo Penyelenggara (Di-highlight Oranye/Primary) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-14 max-w-fit mx-auto overflow-x-auto py-3 px-6 rounded-2xl border border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(194,118,55,0.15)]">
          <img src="/24jammenari.png" alt="24jam" className="h-6 w-auto hover:scale-105 transition-transform" />
          <div className="w-px h-6 bg-primary/30 mx-1" />
          <img src="/tutwuri.png" alt="tutwuri" className="h-6 w-auto" />
          <img src="/kemendisintek.png" alt="kemendisintek" className="h-6 w-auto" />
          <img src="/isi.png" alt="isi" className="h-6 w-auto" />
          <img src="/himaswariska.png" alt="himaswariska" className="h-6 w-auto" />
          <img src="/himakorin.png" alt="himakorin" className="h-6 w-auto" />
          <img src="/sjs.png" alt="sjs" className="h-6 w-auto" />
        </div>

        {/* Teks Utama (Urutan Direvisi) */}
        <div className="space-y-3 mb-10">
          <p className="text-lg md:text-xl font-semibold tracking-[0.2em] text-accent uppercase">
            HARI TARI DUNIA KE - 20
          </p>
          <h1 className="text-tradisional text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight">
            24 JAM MENARI SURAKARTA
          </h1>
          <p className="text-xl md:text-2xl font-light text-muted-foreground italic pt-2">
            "Tanpa Batas : Menembus Medan Budaya"
          </p>
        </div>

        {/* Ornamen Pembatas */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-accent/50" />
          <span className="text-accent text-xl">❦</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        {/* Tombol Akses (Tengah) */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowLoginDialog(true)}
            className="group relative flex items-center gap-3 bg-primary text-primary-foreground text-xl font-bold px-10 py-5 rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <span className="relative z-10">Mulai Mendaftar</span>
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </section>

      {/* Divider Panduan Pendaftaran */}
      <div className="flex items-center gap-6 mb-10 max-w-5xl mx-auto px-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
        <h3 className="text-accent tracking-widest uppercase text-sm font-bold">Panduan Pendaftaran</h3>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
      </div>

      {/* Panduan Pendaftaran */}
      <section className="mb-20 px-4">
        <div className="bg-card/50 border border-border/60 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
          {/* SectionTitle dihapus karena fungsinya sudah digantikan oleh Divider di atasnya, 
              kita biarkan isinya fokus ke grid langkah-langkah */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", t: "Pilih Venue", d: "Cari panggung pendaftaran yang tersedia." },
              { n: "2", t: "Pembayaran", d: "Selesaikan transaksi dan buat akun." },
              { n: "3", t: "Konfirmasi", d: "Mendapat bukti pendaftaran resmi." },
            ].map((step) => (
              <div key={step.n} className="space-y-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {step.n}
                </span>
                <p className="font-bold text-lg text-foreground">{step.t}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider Venue */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
        <h3 className="text-accent tracking-widest uppercase text-sm font-bold">Pilih Venue</h3>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
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
