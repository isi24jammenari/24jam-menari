"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { getTenantStands, holdTenantStand } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TenantLandingPage() {
  const router = useRouter();
  const [stands, setStands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStand, setSelectedStand] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pendaftar_name: "", pendaftar_email: "", phone: "", payment_method: ""
  });

  useEffect(() => { fetchStands(); }, []);
  const fetchStands = async () => {
    try { const res = await getTenantStands(); setStands(res.data); } 
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleHold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await holdTenantStand({ stand_id: selectedStand.id, ...formData });
      router.push(`/payment?order_id=${res.data.order_id}&expires_at=${res.data.expires_at}`);
    } catch (error: any) {
      alert(error.message);
      fetchStands();
      setIsModalOpen(false);
    } finally { setIsSubmitting(false); }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="text-center pt-8 pb-16 px-4">
        <p className="text-lg md:text-2xl font-bold tracking-[0.3em] text-accent uppercase mb-4">
          Pendaftaran Bazaar
        </p>
        <h1 className="text-tradisional text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-tight mb-6">
          TENANT #20 <br /> ISI SURAKARTA
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-accent/50" />
          <span className="text-accent text-xl">❦</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent/50" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto italic">
          "Silakan pilih nomor stand yang tersedia pada denah di bawah untuk memulai proses administrasi."
        </p>
      </section>

      {/* Rules & Facilities Card (Dari PDF) */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="bg-card/50 border border-border/60 rounded-3xl p-8 relative overflow-hidden batik-border">
          <h3 className="text-accent font-bold uppercase tracking-widest text-sm mb-6">Syarat & Ketentuan</h3>
          <ul className="space-y-4 text-sm text-foreground/80">
            <li className="flex gap-3">
              <span className="text-primary font-bold">01</span>
              <p>Pembayaran wajib diselesaikan dalam durasi <strong>15 menit</strong> setelah booking stand.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">02</span>
              <p>Produk wajib dalam bentuk kemasan / <strong>takeaway</strong>. Panitia tidak menyediakan tempat <em>dine-in</em>.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">03</span>
              <p>Peserta tidak diperbolehkan pindah stand dan wajib menjaga kebersihan selama acara.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">04</span>
              <p>Uang pendaftaran <strong>tidak dapat dikembalikan</strong> apabila peserta mengundurkan diri.</p>
            </li>
          </ul>
        </div>

        <div className="bg-card/30 border border-border/60 rounded-3xl p-8">
          <h3 className="text-accent font-bold uppercase tracking-widest text-sm mb-6">Fasilitas & Jadwal</h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold mb-8">
            <div className="bg-background/50 p-3 rounded-xl border border-border italic text-center">Tenda Sanavil 3x3</div>
            <div className="bg-background/50 p-3 rounded-xl border border-border italic text-center">Listrik 450 Watt</div>
            <div className="bg-background/50 p-3 rounded-xl border border-border italic text-center">Meja & Kursi</div>
            <div className="bg-background/50 p-3 rounded-xl border border-border italic text-center">Keamanan & Air</div>
          </div>
          <div className="space-y-2 border-t border-border pt-6 text-xs text-muted-foreground uppercase tracking-widest font-bold">
            <p className="flex justify-between"><span>Loading In:</span> <span className="text-foreground">28 April, 15.00 WIB</span></p>
            <p className="flex justify-between"><span>Hari 1:</span> <span className="text-foreground">28 April, 17.00 - 21.00</span></p>
            <p className="flex justify-between"><span>Hari 2-3:</span> <span className="text-foreground">29 Apr (05.00) - 30 Apr (09.00)</span></p>
          </div>
        </div>
      </div>

      {/* Grid Stand */}
      <section className="max-w-4xl mx-auto pb-24">
        <SectionTitle title="Denah Stand Bazaar" subtitle="Warna primer menunjukkan stand masih tersedia untuk dipesan." className="mb-12" />
        {loading ? (
           <div className="flex justify-center py-20 animate-pulse text-primary font-bold">Menghubungkan ke Denah...</div>
        ) : (
          <div className="grid grid-cols-4 gap-4 md:gap-6">
            {stands.map((stand) => (
              <button
                key={stand.id}
                disabled={stand.is_booked}
                onClick={() => { setSelectedStand(stand); setIsModalOpen(true); }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden group ${
                  stand.is_booked 
                    ? "bg-secondary/20 border-border opacity-40 cursor-not-allowed" 
                    : "bg-primary/10 border-primary/30 hover:bg-primary hover:border-primary hover:scale-105 shadow-lg shadow-primary/5"
                }`}
              >
                <span className={`text-4xl font-black ${stand.is_booked ? "text-muted-foreground" : "text-primary group-hover:text-primary-foreground"}`}>
                  {stand.stand_number}
                </span>
                {stand.is_booked && <Badge className="absolute bottom-2 bg-destructive text-[8px] px-1">SOLD</Badge>}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Dialog Form Tahap 1 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Booking Stand #{selectedStand?.stand_number}</DialogTitle>
            <DialogDescription className="italic">Mohon isi identitas pendaftar untuk pembuatan invoice pembayaran.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleHold} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase">Nama Pendaftar</label>
              <input required className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all" value={formData.pendaftar_name} onChange={(e)=>setFormData({...formData, pendaftar_name: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase">Email</label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all" value={formData.pendaftar_email} onChange={(e)=>setFormData({...formData, pendaftar_email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase">No. WhatsApp</label>
                <input required className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-accent uppercase">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {['bni', 'bri', 'mandiri', 'gopay', 'qris'].map((m) => (
                  <button key={m} type="button" onClick={() => setFormData({...formData, payment_method: m})} className={`py-2 rounded-lg border-2 text-[10px] font-black uppercase transition-all ${formData.payment_method === m ? "bg-accent border-accent text-accent-foreground" : "border-input hover:border-primary"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting || !formData.payment_method} className="w-full py-7 text-lg font-bold rounded-full shadow-xl shadow-primary/20">
              {isSubmitting ? "Memproses..." : "Selesaikan Pendaftaran →"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}