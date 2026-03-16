"use client";

import { useEffect, useCallback, useState } from "react";
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

export default function PaymentPage() {
  const router = useRouter();
  const {
    selectedVenueName,
    selectedSlotTime,
    selectedSlotPrice,
    paymentStatus,
    timerExpiry,
    startPaymentTimer,
    setPaymentStatus,
    resetBooking,
  } = useBookingStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Guard: redirect jika tidak ada pilihan
  useEffect(() => {
    if (!selectedVenueName || !selectedSlotTime) {
      router.replace("/");
    }
  }, [selectedVenueName, selectedSlotTime, router]);

  // Mulai timer saat halaman dibuka
  useEffect(() => {
    if (paymentStatus === "idle") {
      startPaymentTimer();
    }
  }, [paymentStatus, startPaymentTimer]);

  const handleExpire = useCallback(() => {
    setPaymentStatus("expired");
    setShowExpiredDialog(true);
  }, [setPaymentStatus]);

  const handleExpiredClose = () => {
    setShowExpiredDialog(false);
    resetBooking();
    router.replace("/");
  };

  const handleBayar = () => {
    if (!selectedMethod) return;
    // Simulasi pembayaran sukses (demo statis)
    setPaymentStatus("success");
    setShowSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    router.push("/booking/register");
  };

  const paymentMethods = [
    { id: "bca", label: "BCA Virtual Account", icon: "🏦" },
    { id: "bni", label: "BNI Virtual Account", icon: "🏦" },
    { id: "bri", label: "BRI Virtual Account", icon: "🏦" },
    { id: "mandiri", label: "Mandiri Virtual Account", icon: "🏦" },
    { id: "qris", label: "QRIS", icon: "📱" },
  ] as const;

  if (!selectedVenueName || !selectedSlotTime || !selectedSlotPrice) {
    return null;
  }

  return (
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

      {/* Metode Pembayaran */}
      <Card className="batik-border border-0 mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-tradisional text-xl font-bold text-primary">
            Metode Pembayaran
          </h2>
          <Separator />
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
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
        disabled={!selectedMethod || paymentStatus !== "pending"}
        className="w-full text-xl py-7 font-semibold"
        size="lg"
      >
        {selectedMethod
          ? `Bayar ${formatPrice(selectedSlotPrice)} →`
          : "Pilih Metode Pembayaran Dulu"}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        🔒 Pembayaran diproses dengan aman melalui Midtrans
      </p>

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
  );
}
