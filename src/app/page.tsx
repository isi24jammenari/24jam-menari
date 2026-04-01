"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import VenueCard from "@/components/booking/VenueCard";
import { useBookingStore } from "@/lib/store/bookingStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";

// Komponen Pemicu Fetching Venues
function VenueLoader() {
  const { venues, isLoadingVenues, fetchVenues } = useBookingStore();

  useEffect(() => {
    if (venues.length === 0) {
      fetchVenues();
    }
  }, [venues.length, fetchVenues]);

  if (isLoadingVenues) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Menghubungkan ke server pendaftaran...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setPaymentStatus } = useBookingStore();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setShowLoginDialog(true);
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Email dan password tidak boleh kosong.");
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
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
    <>
      {/* Hero */}
      <section className="text-center pt-4 pb-12 px-4 relative">
        {/* Jejeran Logo Penyelenggara */}
        <div className="flex items-center justify-center mb-14 max-w-fit mx-auto py-3 px-5 sm:px-6 rounded-2xl border border-primary/30 bg-primary/5 shadow-sm">
          {/* Dinamis: Grid HP, Flex Wrap PC */}
          <div className="grid grid-cols-3 lg:flex lg:flex-wrap gap-x-4 gap-y-4 sm:gap-5 md:gap-6 items-center justify-center justify-items-center">
            {[
              { src: "/tutwuri.webp", alt: "Tut Wuri Handayani" },
              { src: "/kemenkebud.webp", alt: "Kemenkebud" },
              { src: "/isi.webp", alt: "ISI" },
              { src: "/himaswariska.webp", alt: "Himaswariska" },
              { src: "/himakorin.webp", alt: "Himakorin" },
              { src: "/isisolo.webp", alt: "ISI Solo" },
              { src: "/artistik.webp", alt: "Artistik" },
              { src: "/blu.webp", alt: "BLU" },
              { src: "/berdampak.webp", alt: "Berdampak" },
              { src: "/sjs.webp", alt: "Solo Java Solo" },
            ].map((logo) => (
              <Image
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                width={40}
                height={40}
                priority
                className="h-5 sm:h-7 md:h-8 w-auto object-contain"
              />
            ))}
          </div>
        </div>

        {/* Teks Utama Hero */}
        <div className="space-y-3 mb-10">
          <p className="text-lg md:text-3xl font-semibold tracking-[0.2em] text-accent uppercase">
            HARI TARI DUNIA KE - 20
          </p>
          <h1 className="text-tradisional text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight">
            24 JAM MENARI ISI SURAKARTA
          </h1>
          <p className="text-xl md:text-4xl font-light text-muted-foreground italic pt-2">
            "Tanpa Batas : Menembus Medan Budaya"
          </p>
        </div>

        {/* Ornamen Pembatas */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-accent/50" />
          <span className="text-accent text-xl">❦</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        {/* Tombol Akses */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => {
              const venueSection = document.getElementById("venue-section");
              venueSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center gap-3 bg-primary text-primary-foreground text-xl font-bold px-10 py-5 rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <span className="relative z-10">Mulai Mendaftar ↓</span>
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

      {/* Panduan Pendaftaran & Video */}
      <section className="mb-20 px-4 max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="bg-card/50 border border-border/60 rounded-3xl p-8 md:p-12 relative overflow-hidden batik-border">
          <p className="text-center text-muted-foreground mb-8">
            Ikuti langkah-langkah mudah berikut untuk memastikan pendaftaran pementasan Anda berhasil.
          </p>
          <div className="space-y-8 relative z-10">
            {[
              { n: "1", t: "Pilih Venue & Waktu", d: "Gulir ke bawah ke bagian 'Pilih Venue'. Klik venue yang Anda inginkan, lalu pilih jam kosong (slot) untuk penampilan Anda." },
              { n: "2", t: "Selesaikan Pembayaran", d: "Setelah memilih jam, Anda memiliki waktu 15 menit untuk melakukan transfer agar jadwal tersebut tidak diambil orang lain." },
              { n: "3", t: "Buat Akun Anda", d: "Setelah pembayaran berhasil, Anda akan diminta memasukkan Email dan Password untuk membuat akun pendaftaran." },
              { n: "4", t: "Isi Formulir Penampilan", d: "Masuk ke Dashboard menggunakan akun yang baru dibuat. Lengkapi data diri, judul tarian, dan kebutuhan panggung." },
              { n: "5", t: "Selesai & Cek Status", d: "Data Anda tersimpan. Anda dapat kembali masuk ke Dashboard kapan saja untuk mengecek jadwal dan status." },
            ].map((step) => (
              <div key={step.n} className="flex gap-5 md:gap-6 items-start">
                <span className="flex-shrink-0 inline-flex w-12 h-12 md:w-14 md:h-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-md border-4 border-background">
                  {step.n}
                </span>
                <div className="pt-1 md:pt-2">
                  <p className="font-bold text-xl text-foreground">{step.t}</p>
                  <p className="text-base text-muted-foreground leading-relaxed mt-1 md:mt-2">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorial */}
        <div className="space-y-4">
          <h4 className="text-center font-semibold text-lg text-foreground">
            Masih Bingung? Tonton Video Panduan Berikut:
          </h4>
          <div className="relative w-full aspect-video bg-black/60 border border-border rounded-2xl overflow-hidden shadow-lg group flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
            
            <div className="relative z-10 w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center text-primary-foreground shadow-xl group-hover:scale-110 group-hover:bg-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="ml-2">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
              <span className="bg-background/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-foreground">
                Klik untuk memutar video tutorial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider Venue */}
      <div id="venue-section" className="flex items-center gap-6 mb-12 scroll-mt-24">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
        <h3 className="text-accent tracking-widest uppercase text-sm font-bold">Pilih Venue</h3>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
      </div>

      {/* Venue Cards (Dinamis dari Database) */}
      <section className="mt-6 max-w-5xl mx-auto pb-12 min-h-[400px]">
        <SectionTitle
          title="Venue Penampilan"
          subtitle="Pilih salah satu dari venue berikut untuk melihat ketersediaan jam show."
          className="mb-8"
        />
        
        {/* Panggil fungsi fetch jika belum ada data */}
        <VenueLoader />

      </section>

      {/* REDUNDANT FOOTER TEXT HAS BEEN REMOVED FROM HERE */}

      {/* Dialog Login */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md batik-border border-0">
          <DialogHeader>
            <DialogTitle className="text-tradisional text-2xl text-primary">
              🔐 Masuk ke Dashboard
            </DialogTitle>
            <DialogDescription className="text-base">
              Masukkan email dan password akun Anda yang sudah terdaftar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
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

            {loginError && (
              <p className="text-sm text-destructive font-medium">{loginError}</p>
            )}

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
    </>
  );
}

export default function HomePage() {
  return (
    <PageWrapper>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-primary font-medium">Memuat Halaman...</div>}>
        <HomeContent />
      </Suspense>
    </PageWrapper>
  );
}