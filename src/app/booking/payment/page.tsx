// src/app/booking/payment/page.tsx
"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import PaymentTimer from "@/components/booking/PaymentTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useBookingStore } from "@/lib/store/bookingStore";
import { formatPrice } from "@/lib/data/venues";

type PaymentMethod = "bca" | "bni" | "bri" | "mandiri" | "qris" | null;

// OPTIMASI: Tarik array statis keluar dari komponen agar tidak di-recreate di setiap render
const PAYMENT_METHODS = [
  { id: "bca", label: "BCA Virtual Account", icon: "🏦" },
  { id: "bni", label: "BNI Virtual Account", icon: "🏦" },
  { id: "bri", label: "BRI Virtual Account", icon: "🏦" },
  { id: "mandiri", label: "Mandiri Virtual Account", icon: "🏦" },
  { id: "qris", label: "QRIS", icon: "📱" },
] as const;

export default function PaymentPage() {
  const router = useRouter();
  const {
    selectedVenueName,
    selectedSlotTime,
    selectedSlotPrice,
    selectedSlotId,
    paymentStatus,
    timerExpiry,
    startPaymentTimer,
    setPaymentStatus,
    resetBooking,
    // ✅ FIX 1 & 2: Tarik bookingId dan setBookingId dari store
    bookingId,
    setBookingId,
  } = useBookingStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);

  // ✅ FIX 3: Ref untuk interval polling agar bisa di-clear dengan aman
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Guard: redirect jika tidak ada pilihan venue/waktu
  useEffect(() => {
    if (!selectedVenueName || !selectedSlotTime) {
      router.replace("/");
    }
  }, [selectedVenueName, selectedSlotTime, router]);

  // ✅ FIX 2: HAPUS useEffect startPaymentTimer yang lama.
  // Timer sekarang hanya dipanggil di dalam handleBayar() setelah API sukses.

  // ✅ FIX 3: Polling logic — cek status booking ke backend setiap 5 detik
  const startPolling = useCallback((id: string) => {
    // Jangan dobel polling jika sudah jalan
    if (pollingRef.current) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/status/${id}`,
          {
            headers: { Accept: "application/json" },
          }
        );
        const data = await res.json();

        if (data.data?.status === "success") {
          // Hentikan polling, tampilkan dialog sukses
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setPaymentStatus("success");
          setShowSuccessDialog(true);
        } else if (
          data.data?.status === "failed" ||
          data.data?.status === "expired"
        ) {
          // Hentikan polling, tampilkan dialog expired
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setPaymentStatus("expired");
          setShowExpiredDialog(true);
        }
        // Jika masih "pending", biarkan polling lanjut
      } catch (err) {
        // Jika network error, polling tetap lanjut sampai timer frontend habis
        console.warn("Polling error:", err);
      }
    }, 5000); // Cek setiap 5 detik
  }, [setPaymentStatus]);

  // Bersihkan polling saat komponen unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleExpire = useCallback(() => {
    setPaymentStatus("expired");
    setShowExpiredDialog(true);
    // Hentikan polling jika timer frontend habis duluan
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, [setPaymentStatus]);

  const handleExpiredClose = () => {
    setShowExpiredDialog(false);
    resetBooking();
    router.replace("/");
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    // ✅ FIX 5: bookingId sudah ada di store, halaman register bisa membacanya langsung
    router.push("/booking/register");
  };

  const handleBayar = async () => {
    if (!selectedMethod || !selectedSlotId) return;
    setIsProcessing(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/hold`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          time_slot_id: selectedSlotId,
          payment_method: selectedMethod,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Gagal membuat pesanan.");
      }

      // ✅ FIX 1: Simpan booking_id ke store setelah API berhasil
      if (resData.data?.booking_id) {
        setBookingId(resData.data.booking_id);
      }

      // ✅ FIX 2: Start timer SETELAH API berhasil, bukan saat halaman dibuka
      startPaymentTimer();

      // Simpan instruksi pembayaran dari Core API ke state
      setPaymentInstructions(resData.data);
      setIsProcessing(false);

      // ✅ FIX 3: Mulai polling status pembayaran ke backend
      if (resData.data?.booking_id) {
        startPolling(resData.data.booking_id);
      }

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan sistem.");
      setIsProcessing(false);
    }
  };

  if (!selectedVenueName || !selectedSlotTime || !selectedSlotPrice) {
    return null;
  }

  return (
    <>
      <PageWrapper narrow>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-tradisional text-4xl font-bold text-primary">
            Pembayaran
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Selesaikan pembayaran sebelum waktu habis
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12 bg-accent opacity-60" />
            <span className="text-accent">✦</span>
            <div className="h-px w-12 bg-accent opacity-60" />
          </div>
        </div>

        {/* Timer — hanya tampil setelah API hold berhasil (paymentStatus === "pending") */}
        {timerExpiry && paymentStatus === "pending" && (
          <div className="flex justify-center mb-8">
            <Card className="batik-border border-0 px-10 py-6">
              <PaymentTimer
                expiryTimestamp={timerExpiry}
                onExpire={handleExpire}
              />
            </Card>
          </div>
        )}

        {/* Ringkasan Pesanan */}
        <Card className="batik-border border-0 mb-6">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-tradisional text-xl font-bold text-primary">
              Ringkasan Pesanan
            </h2>
            <Separator />
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Venue</span>
                <span className="font-semibold">{selectedVenueName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jam Show</span>
                <span className="font-semibold">{selectedSlotTime}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-lg">Total Pembayaran</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(selectedSlotPrice)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kontainer Dinamis: Pilih Metode vs Instruksi Pembayaran */}
        {!paymentInstructions ? (
          <>
            {/* Metode Pembayaran */}
            <Card className="batik-border border-0 mb-6">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-tradisional text-xl font-bold text-primary">
                  Metode Pembayaran
                </h2>
                <Separator />
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-accent"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-lg font-medium">{method.label}</span>
                      {selectedMethod === method.id && (
                        <span className="ml-auto text-primary font-bold text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tombol Bayar */}
            <Button
              onClick={handleBayar}
              disabled={!selectedMethod || isProcessing}
              className="w-full text-xl py-7 font-semibold"
              size="lg"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-lg">⏳</span>
                  Memproses Server...
                </span>
              ) : selectedMethod ? (
                `Dapatkan Kode Pembayaran →`
              ) : (
                "Pilih Metode Pembayaran Dulu"
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              🔒 Transaksi aman menggunakan Midtrans Core API
            </p>
          </>
        ) : (
          <Card className="batik-border border-0 mb-6 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-tradisional text-2xl font-bold text-primary">
                Selesaikan Pembayaran Anda
              </h2>
              <Separator className="bg-primary/20" />
              
              <div className="py-4">
                {paymentInstructions.payment_method === "qris" && paymentInstructions.qr_code_url && (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Scan QRIS Berikut</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={paymentInstructions.qr_code_url} alt="QRIS Code" className="w-64 h-64 border-4 border-white rounded-xl shadow-lg" />
                  </div>
                )}

                {["bca", "bni", "bri"].includes(paymentInstructions.payment_method) && paymentInstructions.va_number && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">
                      Virtual Account {paymentInstructions.payment_method.toUpperCase()}
                    </p>
                    <p className="text-4xl font-black text-foreground tracking-widest bg-background p-4 rounded-xl border-2 border-primary/20 inline-block">
                      {paymentInstructions.va_number}
                    </p>
                  </div>
                )}

                {paymentInstructions.payment_method === "mandiri" && paymentInstructions.biller_code && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Biller Code</p>
                      <p className="text-2xl font-black text-foreground bg-background p-2 rounded-lg border-2 border-primary/20 inline-block">
                        {paymentInstructions.biller_code}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Nomor VA (Bill Key)</p>
                      <p className="text-3xl font-black text-foreground bg-background p-3 rounded-xl border-2 border-primary/20 inline-block">
                        {paymentInstructions.bill_key}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ FIX 3 & 4: Indikator polling menggantikan Dev Mode Button */}
              <p className="text-muted-foreground text-sm">
                Sistem akan otomatis memverifikasi pembayaran Anda. Halaman ini akan berpindah sendiri setelah pembayaran terkonfirmasi.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Menunggu konfirmasi pembayaran...
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog: Waktu Habis */}
        <Dialog open={showExpiredDialog} onOpenChange={() => {}}>
          <DialogContent className="text-center" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-tradisional text-2xl text-destructive">
                ⏰ Waktu Pembayaran Habis
              </DialogTitle>
              <DialogDescription className="text-base mt-2 space-y-2">
                <span className="block">
                  Batas waktu pembayaran telah berakhir. Slot yang Anda pilih
                  telah <strong>dikembalikan</strong> ke daftar tersedia.
                </span>
                <span className="block text-muted-foreground">
                  Silakan ulangi proses pendaftaran dari awal.
                </span>
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={handleExpiredClose}
              className="w-full mt-4 text-lg py-6"
            >
              Kembali ke Beranda
            </Button>
          </DialogContent>
        </Dialog>

        {/* Dialog: Pembayaran Sukses */}
        <Dialog open={showSuccessDialog} onOpenChange={() => {}}>
          <DialogContent className="text-center" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-tradisional text-2xl text-primary">
                🎉 Pembayaran Berhasil!
              </DialogTitle>
              <DialogDescription className="text-base mt-2 space-y-2">
                <span className="block">
                  Slot penampilan Anda telah berhasil dikunci.
                </span>
                <div className="bg-muted rounded-lg p-4 my-3 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-semibold">{selectedVenueName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jam Show</span>
                    <span className="font-semibold">{selectedSlotTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Dibayar</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(selectedSlotPrice)}
                    </span>
                  </div>
                </div>
                <span className="block text-muted-foreground">
                  Selanjutnya, buat akun untuk mengakses dashboard penampilan Anda.
                </span>
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={handleSuccessClose}
              className="w-full mt-2 text-lg py-6"
            >
              Lanjut Buat Akun →
            </Button>
          </DialogContent>
        </Dialog>
      </PageWrapper>
    </>
  );
}