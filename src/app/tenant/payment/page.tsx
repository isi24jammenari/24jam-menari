"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTenantStatus } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentTimer from "@/components/booking/PaymentTimer"; 

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("order_id");
  const expiresAtParam = searchParams.get("expires_at");
  
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  // Parsing waktu expired untuk timer
  const expiryDate = expiresAtParam 
    ? new Date(expiresAtParam) 
    : new Date(Date.now() + 15 * 60 * 1000);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await getTenantStatus(orderId);
        setStatus(res.data.status);
        
        if (res.data.status === "success") {
          // Redirect ke formulir tahap 2
          router.push(`/form?order_id=${orderId}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(checkStatus, 5000); 
    checkStatus();

    return () => clearInterval(interval);
  }, [orderId, router]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#c6ff33] font-black tracking-widest uppercase">Verifikasi Transaksi...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <Card className="bg-black border-2 border-[#6849cf] rounded-none shadow-[0_0_20px_rgba(104,73,207,0.3)]">
        <CardHeader className="text-center border-b border-[#6849cf]/30 pb-6">
          <CardTitle className="text-3xl font-black text-[#ff00cc] uppercase tracking-wider">Selesaikan Pembayaran</CardTitle>
          <p className="text-xs text-gray-400 mt-2 tracking-widest">ORDER ID: {orderId}</p>
        </CardHeader>
        <CardContent className="pt-8 space-y-8 text-center">
          
          <div className="flex justify-center scale-110 my-4">
            {/* PERBAIKAN TS ERROR: Gunakan .getTime() agar menjadi number */}
            <PaymentTimer 
              expiryTimestamp={expiryDate.getTime()} 
              onExpire={() => {
                alert("Waktu pembayaran telah habis. Silakan pilih stand kembali.");
                router.push("/");
              }}
            />
          </div>

          <div className="bg-[#6849cf]/10 p-6 border border-dashed border-[#6849cf] text-left">
            <p className="text-[#c6ff33] text-sm mb-4 font-bold uppercase tracking-wider">Instruksi Pembayaran</p>
            <div className="text-sm text-gray-300 space-y-3">
              <p className="flex gap-2">
                <span className="text-[#ff00cc] font-black">1.</span> 
                Silakan cek Email / WhatsApp Anda untuk mendapatkan detail Virtual Account (VA) atau QRIS Midtrans.
              </p>
              <p className="flex gap-2">
                <span className="text-[#ff00cc] font-black">2.</span> 
                Gunakan nominal yang sesuai hingga digit terakhir agar otomatis terverifikasi.
              </p>
              <p className="flex gap-2">
                <span className="text-[#ff00cc] font-black">3.</span> 
                Halaman ini akan otomatis beralih ke Formulir Kelengkapan Tenant setelah pembayaran sukses.
              </p>
            </div>
          </div>

          <Button 
            variant="link" 
            className="text-[#6849cf] text-xs font-bold uppercase tracking-widest hover:text-[#ff00cc]"
            onClick={() => router.push("/")}
          >
            ← Batal & Kembali ke Denah
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TenantPaymentPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-[#6849cf]">Loading...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}