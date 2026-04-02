"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store/bookingStore";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ClaimPage() {
  const router = useRouter();
  const { setBookingId, selectVenue, selectSlot } = useBookingStore();

  const [claimToken, setClaimToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClaim = async () => {
    if (!claimToken) return;
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ claim_token: claimToken.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memverifikasi token.");

      // Injeksi data rahasia dari backend ke memori Zustand
      setBookingId(data.data.booking_id);
      selectVenue(data.data.venue_id, data.data.venue_name);
      selectSlot(data.data.slot_id, data.data.time_range, 0); 

      // Lempar ke halaman registrasi
      router.push("/booking/register");

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper narrow>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
        <Card className="w-full max-w-md batik-border border-0 shadow-xl bg-card">
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-tradisional text-3xl text-primary">
              🔒 Klaim Jadwal
            </CardTitle>
            <CardDescription className="text-base text-destructive font-medium">
              Sistem Keamanan Ketat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-sm text-foreground">
              <p className="font-bold text-destructive mb-2">⚠️ Akses Terbatas</p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Untuk mencegah pencurian jadwal, Anda memerlukan <strong>Token Klaim</strong> dari panitia.
              </p>
              <a 
                href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20sudah%20bayar%20tapi%20terkeluar.%20Ini%20bukti%20transfernya." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-[#25D366] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#20b858] transition-colors"
              >
                Chat Admin via WhatsApp
              </a>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">Masukkan Token Klaim (Order ID)</label>
              <input
                type="text"
                placeholder="Contoh: 24JAM-ABCD-123456"
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background font-mono text-center tracking-widest uppercase focus:ring-2 focus:ring-primary transition-all"
                value={claimToken}
                onChange={(e) => setClaimToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleClaim()}
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-center animate-pulse">
                ❌ {errorMsg}
              </p>
            )}

            <Button
              onClick={handleClaim}
              disabled={!claimToken || isLoading}
              className="w-full text-lg py-6 font-bold"
            >
              {isLoading ? "Memverifikasi..." : "Validasi Token →"}
            </Button>
            
            <div className="text-center">
              <Button variant="ghost" onClick={() => router.push('/auth/login')} className="text-muted-foreground">
                ← Batal & Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}