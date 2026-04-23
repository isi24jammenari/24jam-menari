"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { getTenantStatus } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentTimer from "@/components/booking/PaymentTimer";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("order_id");
  const expiresAtParam = searchParams.get("expires_at");
  const methodParam = searchParams.get("method");
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  const expiryDate = expiresAtParam 
    ? new Date(expiresAtParam) 
    : new Date(Date.now() + 15 * 60 * 1000);

  useEffect(() => {
    if (!orderId) { router.push("/"); return; }

    // MENANGKAP DATA PAYMENT DARI STORAGE
    const storedData = sessionStorage.getItem('tenant_payment_data');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
    }

    const checkStatus = async () => {
      try {
        const res = await getTenantStatus(orderId);
        if (res.data.status === "success") {
          sessionStorage.removeItem('tenant_payment_data');
          router.push(`/form?order_id=${orderId}`);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const interval = setInterval(checkStatus, 5000); 
    checkStatus();
    return () => clearInterval(interval);
  }, [orderId, router]);

  if (loading && !paymentData) return (
    <div className="min-h-[60vh] flex items-center justify-center text-primary font-bold animate-pulse uppercase tracking-widest">
      Menyiapkan Tagihan...
    </div>
  );

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-12">
        <SectionTitle 
          title="Selesaikan Pembayaran" 
          subtitle="Sistem telah mengunci stand Anda. Segera lakukan pembayaran sebelum waktu habis."
          className="mb-10"
        />

        <Card className="bg-card/50 border border-border/60 rounded-3xl overflow-hidden batik-border shadow-2xl">
          <div className="bg-primary/10 p-4 border-b border-primary/20 flex justify-between items-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Order: {orderId}</span>
            <Badge variant="outline" className="border-primary text-primary animate-pulse font-bold">Menunggu Pembayaran</Badge>
          </div>
          
          <CardContent className="pt-10 pb-10 space-y-8 text-center">
            <div className="flex justify-center scale-110">
              <PaymentTimer 
                expiryTimestamp={expiryDate.getTime()} 
                onExpire={() => {
                  alert("Waktu habis. Slot telah dibebaskan kembali.");
                  router.push("/");
                }}
              />
            </div>

            {/* AREA RENDER QRIS ATAU VA */}
            {paymentData && (
              <div className="bg-background rounded-2xl p-6 border-2 border-primary/20 inline-block min-w-[280px]">
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mb-4">Metode: {methodParam}</p>
                
                {paymentData.qr_code_url && (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                      <img src={paymentData.qr_code_url} alt="QR Code Payment" className="w-48 h-48" />
                    </div>
                    {paymentData.gopay_deeplink && (
                      <a href={paymentData.gopay_deeplink} className="bg-[#00a5cf] text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                        Buka Aplikasi Gojek
                      </a>
                    )}
                  </div>
                )}

                {paymentData.va_number && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Nomor Virtual Account</p>
                    <p className="text-3xl font-mono font-black text-primary tracking-wider">{paymentData.va_number}</p>
                  </div>
                )}

                {paymentData.biller_code && (
                  <div className="text-center space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Kode Perusahaan (Biller Code)</p>
                      <p className="text-xl font-mono font-black text-primary">{paymentData.biller_code}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nomor Pembayaran (Bill Key)</p>
                      <p className="text-2xl font-mono font-black text-accent">{paymentData.bill_key}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-background/50 rounded-2xl p-6 border border-border text-left">
               <p className="text-accent font-bold uppercase tracking-widest text-xs border-b border-border pb-3 mb-3">Informasi Penting</p>
               <p className="text-sm text-foreground/80 italic">Halaman ini akan otomatis berpindah ke formulir kelengkapan data setelah pembayaran berhasil terdeteksi. Jangan tutup layar ini hingga status berubah.</p>
            </div>

            <Button 
              variant="link" 
              className="text-muted-foreground hover:text-destructive transition-colors text-xs font-bold uppercase tracking-widest"
              onClick={() => {
                sessionStorage.removeItem('tenant_payment_data');
                router.push("/");
              }}
            >
              ← Batal & Kembali ke Denah
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default function TenantPaymentPage() {
  return (
    <Suspense fallback={<div className="h-[60vh] flex items-center justify-center text-primary">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}