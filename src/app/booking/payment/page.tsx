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

import Image from "next/image"; // Tambahkan import Image di atas jika belum ada

type PaymentMethod = "bni" | "bri" | "mandiri" | "gopay" | "qris" | null;

const PAYMENT_METHODS = [
  { id: "bni", label: "BNI Virtual Account", img: "/BNI.png" },
  { id: "bri", label: "BRI Virtual Account", img: "/BRI.png" },
  { id: "mandiri", label: "Mandiri Virtual Account", img: "/Mandiri.png" },
  { id: "gopay", label: "GoPay", img: "/GoPay.png" },
  { id: "qris", label: "QRIS", img: "/QRIS.png" },
] as const;

// ─── Session persistence ───────────────────────────────────────────────────
const SESSION_KEY = "pending_payment";

type PendingPayment = {
  bookingId: string;
  paymentInstructions: any;
  timerExpiry: number;
};

function savePendingPayment(data: PendingPayment) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch (_) {}
}

function loadPendingPayment(): PendingPayment | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function clearPendingPayment() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
}
// ──────────────────────────────────────────────────────────────────────────

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
    bookingId,
    setBookingId,
  } = useBookingStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);
  // ✅ FIX RACE: Tambah flag untuk tahu apakah restore sudah selesai
  const [isRestored, setIsRestored] = useState(false);
  // ✅ State untuk feedback tombol salin URL
  const [copied, setCopied] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback((id: string) => {
    if (pollingRef.current) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/status/${id}`,
          { headers: { Accept: "application/json" } }
        );
        const data = await res.json();

        if (data.data?.status === "success") {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setPaymentStatus("success");
          setShowSuccessDialog(true);
        } else if (
          data.data?.status === "failed" ||
          data.data?.status === "expired"
        ) {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setPaymentStatus("expired");
          setShowExpiredDialog(true);
        }
      } catch (err) {
        console.warn("Polling error:", err);
      }
    }, 5000);
  }, [setPaymentStatus]);

  // ✅ RESTORE: Pulihkan state dari sessionStorage, set isRestored setelah selesai
  useEffect(() => {
    const saved = loadPendingPayment();
    if (saved && Date.now() < saved.timerExpiry) {
      setBookingId(saved.bookingId);
      setPaymentInstructions(saved.paymentInstructions);
      useBookingStore.setState({
        timerExpiry: saved.timerExpiry,
        paymentStatus: "pending",
      });
      startPolling(saved.bookingId);
    } else if (saved) {
      clearPendingPayment();
    }
    setIsRestored(true); // ← selalu set true setelah restore selesai
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard: redirect hanya setelah restore selesai
  useEffect(() => {
    if (!isRestored) return; // tunggu restore dulu
    if (!selectedVenueName || !selectedSlotTime) {
      router.replace("/");
    }
  }, [isRestored, selectedVenueName, selectedSlotTime, router]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleExpire = useCallback(() => {
    setPaymentStatus("expired");
    setShowExpiredDialog(true);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, [setPaymentStatus]);

  const handleExpiredClose = () => {
    clearPendingPayment();
    setShowExpiredDialog(false);
    resetBooking();
    router.replace("/");
  };

  const handleSuccessClose = () => {
    clearPendingPayment();
    setShowSuccessDialog(false);
    router.push("/booking/register");
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

      if (resData.data?.booking_id) {
        setBookingId(resData.data.booking_id);
      }

      startPaymentTimer();
      setPaymentInstructions(resData.data);
      setIsProcessing(false);

      if (resData.data?.booking_id) {
        startPolling(resData.data.booking_id);
      }

      if (resData.data?.booking_id) {
        savePendingPayment({
          bookingId: resData.data.booking_id,
          paymentInstructions: resData.data,
          timerExpiry: Date.now() + 15 * 60 * 1000,
        });
      }

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan sistem.");
      setIsProcessing(false);
    }
  };

  // ✅ FIX RACE: Tunggu restore selesai dulu sebelum render apapun
  if (!isRestored) return null;

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

        {/* Timer */}
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
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:border-accent/50"
                      }`}
                    >
                      <div className="relative w-16 h-8 shrink-0 flex items-center justify-center bg-white rounded p-1">
                        <Image 
                          src={method.img} 
                          alt={`${method.label} Logo`} 
                          fill 
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
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
          <CardContent className="p-8 text-center space-y-6">
            {/* Logo Metode yang Terpilih */}
            <div className="flex justify-center mb-2">
              <div className="relative w-32 h-16">
                <Image
                  src={`/${paymentInstructions.payment_method.toUpperCase()}.png`}
                  alt={paymentInstructions.payment_method}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            </div>

            <h2 className="text-tradisional text-2xl font-bold text-primary">
              Selesaikan Pembayaran Anda
            </h2>
            <Separator className="bg-primary/20" />

            {/* Area Kode / QR */}
            <div className="py-4">
              {/* QRIS & GoPay */}
              {(paymentInstructions.payment_method === "qris" || paymentInstructions.payment_method === "gopay") && 
              paymentInstructions.qr_code_url && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                    Scan QR Berikut
                  </p>
                  <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-primary/10">
                    <img
                      src={paymentInstructions.qr_code_url}
                      alt="Payment QR"
                      className="w-64 h-64"
                    />
                  </div>
                  {paymentInstructions.gopay_deeplink && (
                    <a 
                      href={paymentInstructions.gopay_deeplink} 
                      target="_blank" 
                      className="mt-2 bg-[#00AED6] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      📱 Bayar via Aplikasi Gojek
                    </a>
                  )}
                </div>
              )}

              {/* Virtual Account (BNI, BRI) */}
              {["bni", "bri"].includes(paymentInstructions.payment_method) && paymentInstructions.va_number && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                    Nomor Virtual Account
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-4xl font-black text-foreground tracking-[0.2em] bg-background px-6 py-4 rounded-2xl border-2 border-primary/20 shadow-inner">
                      {paymentInstructions.va_number}
                    </p>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleCopyUrl(paymentInstructions.va_number)}
                      className="h-14 w-14 rounded-xl"
                    >
                      {copied ? "✓" : "📋"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Mandiri (Bill Payment) */}
              {paymentInstructions.payment_method === "mandiri" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-background p-4 rounded-xl border border-primary/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Biller Code</p>
                    <p className="text-xl font-bold">{paymentInstructions.biller_code}</p>
                  </div>
                  <div className="bg-background p-4 rounded-xl border border-primary/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Bill Key</p>
                    <p className="text-xl font-bold">{paymentInstructions.bill_key}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tata Cara Pembayaran Spesifik */}
            <div className="text-left bg-background/50 rounded-2xl p-6 border border-primary/5">
              <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-primary">
                <span className="text-lg">ℹ️</span> Instruksi Pembayaran:
              </h4>
              <div className="text-xs space-y-4 text-muted-foreground leading-relaxed">
                {paymentInstructions.payment_method === 'bri' && (
                  <ul className="list-decimal pl-4 space-y-2">
                    <li><strong>BRIMO:</strong> Login &gt; Pilih BRIVA &gt; Masukkan nomor VA &gt; Konfirmasi &gt; Masukkan PIN.</li>
                    <li><strong>ATM BRI:</strong> Masukkan Kartu &gt; Transaksi Lain &gt; Pembayaran &gt; Lainnya &gt; BRIVA &gt; Masukkan nomor VA &gt; Bayar.</li>
                  </ul>
                )}
                {paymentInstructions.payment_method === 'bni' && (
                  <ul className="list-decimal pl-4 space-y-2">
                    <li><strong>BNI Mobile:</strong> Login &gt; Transfer &gt; Virtual Account Billing &gt; Pilih Tab Input Baru &gt; Masukkan nomor VA &gt; Bayar.</li>
                    <li><strong>ATM BNI:</strong> Menu Lain &gt; Transfer &gt; Virtual Account Billing &gt; Masukkan nomor VA &gt; Konfirmasi.</li>
                  </ul>
                )}
                {paymentInstructions.payment_method === 'mandiri' && (
                  <ul className="list-decimal pl-4 space-y-2">
                    <li><strong>Livin' Mandiri:</strong> Login &gt; Bayar &gt; Buat Pembayaran Baru &gt; Multipayment &gt; Pilih Midtrans &gt; Masukkan Biller & Bill Key.</li>
                    <li><strong>ATM Mandiri:</strong> Bayar/Beli &gt; Lainnya &gt; Multipayment &gt; Masukkan Kode Biller &gt; Masukkan Bill Key.</li>
                  </ul>
                )}
                {(paymentInstructions.payment_method === 'qris' || paymentInstructions.payment_method === 'gopay') && (
                  <ul className="list-decimal pl-4 space-y-2">
                    <li>Buka aplikasi pembayaran pilihan Anda (Gojek, ShopeePay, Dana, LinkAja, atau Mobile Banking).</li>
                    <li>Pilih opsi <strong>Scan QR</strong>.</li>
                    <li>Scan gambar QR di atas atau unggah screenshot QR ini jika membayar lewat satu HP yang sama.</li>
                    <li>Periksa nominal dan konfirmasi pembayaran.</li>
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary animate-pulse">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Menunggu konfirmasi pembayaran otomatis...
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
            <Button onClick={handleExpiredClose} className="w-full mt-4 text-lg py-6">
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
            <Button onClick={handleSuccessClose} className="w-full mt-2 text-lg py-6">
              Lanjut Buat Akun →
            </Button>
          </DialogContent>
        </Dialog>
      </PageWrapper>
    </>
  );
}