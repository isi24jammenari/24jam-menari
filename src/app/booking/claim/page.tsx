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
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-12 px-4 relative">
        {/* Dekorasi Latar (Sama seperti Login) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden relative">
          {/* Gradien Atas */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-destructive via-accent to-primary" />
          
          <CardHeader className="text-center space-y-2 pb-6 pt-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-inner border border-destructive/20">
              <span className="text-3xl">🔐</span>
            </div>
            <CardTitle className="text-3xl font-black text-foreground tracking-tight">
              Klaim Jadwal
            </CardTitle>
            <CardDescription className="text-base font-medium text-destructive">
              Sistem Pemulihan Keamanan Ketat
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            
            <div className="mb-6 bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-sm text-foreground shadow-sm">
              <p className="font-bold text-destructive mb-2 flex items-center gap-2">
                <span className="text-lg">⚠️</span> Akses Terbatas
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4 font-medium">
                Untuk mencegah pencurian jadwal, Anda memerlukan <strong>Token Klaim</strong> dari panitia.
              </p>
              <a 
                href="https://wa.me/6282123239004?text=Halo%20Admin,%20saya%20sudah%20bayar%20tapi%20terkeluar.%20Ini%20bukti%20transfernya." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#20b858] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-xl">💬</span> Hubungi Admin (WhatsApp)
              </a>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Token Klaim (Order ID)</label>
                <input
                  type="text"
                  placeholder="24JAM-ABCD-123456"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-mono text-center tracking-[0.2em] uppercase placeholder:text-muted-foreground/40 font-bold"
                  value={claimToken}
                  onChange={(e) => setClaimToken(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleClaim()}
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 text-center shadow-sm">
                  <span className="text-lg">❌</span>
                  <p>{errorMsg}</p>
                </div>
              )}

              <Button
                onClick={handleClaim}
                disabled={!claimToken || isLoading}
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin text-xl">⏳</span> Memverifikasi...
                  </span>
                ) : "Validasi Token →"}
              </Button>
            </div>
            
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 font-bold text-muted-foreground">Atau</span>
              </div>
            </div>

            <div className="text-center mt-6">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/auth/login')} 
                className="w-full h-12 text-muted-foreground hover:text-foreground font-bold rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                ← Batal & Kembali ke Login
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}