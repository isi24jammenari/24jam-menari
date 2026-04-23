"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { getTenantStatus } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentTimer from "@/components/booking/PaymentTimer";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("order_id");
  const expiresAtParam = searchParams.get("expires_at");
  
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  const expiryDate = expiresAtParam 
    ? new Date(expiresAtParam) 
    : new Date(Date.now() + 15 * 60 * 1000);

  useEffect(() => {
    if (!orderId) { router.push("/"); return; }

    const checkStatus = async () => {
      try {
        const res = await getTenantStatus(orderId);
        setStatus(res.data.status);
        if (res.data.status === "success") {
          router.push(`/form?order_id=${orderId}`);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const interval = setInterval(checkStatus, 5000); 
    checkStatus();
    return () => clearInterval(interval);
  }, [orderId, router]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-primary font-bold animate-pulse uppercase tracking-widest">
      Menghubungkan ke Gateway...
    </div>
  );

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-12">
        <SectionTitle 
          title="Selesaikan Pembayaran" 
          subtitle="Segera lakukan transfer agar nomor stand Anda tidak dibatalkan otomatis oleh sistem."
          className="mb-12"
        />

        <Card className="bg-card/50 border border-border/60 rounded-3xl overflow-hidden batik-border shadow-2xl">
          <div className="bg-primary/10 p-4 border-b border-primary/20 flex justify-between items-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Order ID: {orderId}</span>
            <Badge variant="outline" className="border-primary text-primary animate-pulse font-bold">Menunggu Pembayaran</Badge>
          </div>
          
          <CardContent className="pt-12 pb-10 space-y-10 text-center">
            <div className="flex justify-center scale-125">
              <PaymentTimer 
                expiryTimestamp={expiryDate.getTime()} 
                onExpire={() => {
                  alert("Waktu habis. Silakan pilih stand kembali.");
                  router.push("/");
                }}
              />
            </div>

            <div className="bg-background/50 rounded-2xl p-8 border border-border space-y-6">
              <p className="text-accent font-bold uppercase tracking-widest text-sm border-b border-border pb-4">Instruksi Pembayaran</p>
              <div className="text-sm text-foreground/80 space-y-4 text-left italic">
                <p className="flex gap-3"><span className="text-primary font-bold">1.</span> Detail Virtual Account / QRIS telah dikirimkan ke Email & WhatsApp Anda.</p>
                <p className="flex gap-3"><span className="text-primary font-bold">2.</span> Gunakan nominal persis hingga digit terakhir agar sistem dapat melakukan verifikasi otomatis.</p>
                <p className="flex gap-3"><span className="text-primary font-bold">3.</span> Setelah pembayaran diterima, halaman ini akan otomatis berpindah ke formulir kelengkapan data.</p>
              </div>
            </div>

            <Button 
              variant="link" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
              onClick={() => router.push("/")}
            >
              ← Batalkan & Kembali ke Denah
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