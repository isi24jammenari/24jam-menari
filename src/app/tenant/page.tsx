"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { getTenantStands, holdTenantStand } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info, AlertTriangle, Phone, Clock } from "lucide-react"; // TAMBAHAN IKON

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

  const paymentLogos: Record<string, string> = {
    bni: "/BNI.png",
    bri: "/BRI.png",
    mandiri: "/Mandiri.png",
    gopay: "/GoPay.png",
    qris: "/QRIS.png"
  };

  useEffect(() => { fetchStands(); }, []);
  
  const fetchStands = async () => {
    try { 
      const res = await getTenantStands(); 
      const standsData = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setStands(standsData); 
    } 
    catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleHold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await holdTenantStand({ stand_id: selectedStand.id, ...formData });
      sessionStorage.setItem('tenant_payment_data', JSON.stringify(res.data));
      router.push(`/payment?order_id=${res.data.order_id}&expires_at=${res.data.expires_at}&method=${formData.payment_method}`);
    } catch (error: any) {
      alert(error.message);
      fetchStands();
      setIsModalOpen(false);
    } finally { setIsSubmitting(false); }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="text-center pt-10 pb-12 px-4">
        <p className="text-sm md:text-base font-bold tracking-[0.3em] text-accent uppercase mb-4">Pendaftaran Tenant</p>
        <h1 className="text-tradisional text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-8 max-w-4xl mx-auto">
          Bazaar 24Jam Menari<br/>ISI Surakarta
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-accent/50" />
          <span className="text-accent text-xl">❦</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent/50" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto italic">"Silakan pilih nomor stand yang tersedia pada denah di bawah untuk memulai proses administrasi."</p>
      </section>

      {/* RUANG INFORMASI: Diubah menjadi Grid 3 Kolom (PC) & 1 Kolom (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[85rem] mx-auto mb-20 px-4">
        
        {/* KARTU 1: Fasilitas */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-primary/10 border-b border-primary/20 py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-accent text-sm uppercase tracking-widest font-black">
              <CheckCircle2 size={18} /> Fasilitas Bazar (18 Stand)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <ul className="space-y-4">
              {[
                "Lokasi di halaman parkir Teater Besar ISI Surakarta",
                "Tenda 3x3",
                "Meja 60 x 120 cm",
                "2 Kursi lipat",
                "Kelistrikan 450 watt (MCB, Stop Kontak dan lampu)",
                "Air & Kebersihan"
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/80 leading-snug">
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* KARTU 2: Syarat & Ketentuan */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <Info size={18} /> Pendaftaran & Biaya
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
            <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Harga Per Stand</p>
              <p className="text-3xl font-black text-primary italic">Rp 1.200.000</p>
              <p className="text-[10px] italic text-destructive font-bold mt-2 flex items-start gap-1">
                <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                Diberikan waktu 15 menit untuk menyelesaikan pembayaran setelah pilih stand.
              </p>
            </div>
            <div className="space-y-3 text-xs text-foreground/80 leading-relaxed font-medium">
              <p className="flex gap-2 items-start"><span className="text-primary font-black">•</span> <span>Wajib mengisi formulir pendaftaran secara lengkap melalui link.</span></p>
              <p className="flex gap-2 items-start"><span className="text-primary font-black">•</span> <span>Produk wajib kemasan / <strong>takeaway</strong> (Panitia tidak menyediakan tempat <em>dine in</em>).</span></p>
              <p className="flex gap-2 items-start"><span className="text-primary font-black">•</span> <span>Dilarang pindah stand / mengambil fasilitas meja kursi dari stand lain.</span></p>
              <p className="flex gap-2 items-start"><span className="text-primary font-black">•</span> <span>Uang pendaftaran <strong>tidak dapat dikembalikan</strong> jika mengundurkan diri.</span></p>
            </div>
            <div className="pt-4 border-t border-border mt-auto">
              <p className="text-[10px] font-bold text-accent uppercase mb-2">Contact Person Bazar:</p>
              <a href="https://wa.me/6281331073894" target="_blank" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                 <Phone size={14} className="text-primary" /> 0813-3107-3894 (Sri Lestariningsih)
              </a>
            </div>
          </CardContent>
        </Card>

        {/* KARTU 3: Tata Tertib */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <AlertTriangle size={18} /> Tata Tertib & Operasional
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
            <div className="bg-card p-4 rounded-xl border border-border">
               <p className="text-[10px] font-black text-primary uppercase mb-2 flex items-center gap-1">
                 <Clock size={12} /> Jadwal Penting
               </p>
               <div className="space-y-2 text-[11px] font-medium uppercase tracking-tight text-foreground/90">
                 <div className="flex justify-between border-b border-border/50 pb-1"><span>Loading In</span> <span>28 Apr, 17.00 WIB</span></div>
                 <div className="flex justify-between border-b border-border/50 pb-1"><span>Operasional Hari 1</span> <span>28 Apr, 17.00 - 21.00</span></div>
                 <div className="flex justify-between border-b border-border/50 pb-1"><span>Operasional Hari 2-3</span> <span>29 Apr (05.00) - 30 Apr (09.00)</span></div>
                 <div className="flex justify-between text-destructive"><span>Loading Out</span> <span>30 Apr, 09.00 WIB</span></div>
               </div>
            </div>

            <div className="bg-accent/10 p-3 rounded-xl border border-accent/20 text-xs text-foreground/90 font-bold flex gap-2 items-start">
              <span className="text-accent text-lg leading-none">💧</span>
              <span>Apabila ada produk air mineral yang diperjual-belikan WAJIB dari merk AQUA.</span>
            </div>
            
            <div className="space-y-2 text-[10px] text-muted-foreground leading-snug flex-1">
              <p>• Area bazar hanya untuk menjual produk yang telah didaftarkan.</p>
              <p>• Dilarang menggunakan area melebihi stand, membuat keributan, dan merusak fasilitas panitia.</p>
              <p>• Kehilangan barang pribadi akibat keteledoran peserta adalah <strong>di luar tanggung jawab panitia</strong>.</p>
            </div>

            <div className="mt-auto bg-destructive/5 border border-destructive/20 p-3 rounded-xl text-[10px] text-foreground/80 leading-snug">
              <span className="font-bold text-destructive uppercase">Catatan:</span> Akses jalan Pendhapa-Teater Besar tidak ditutup. Asongan mungkin masuk. Panitia akan mengingatkan, namun trotoar area parkir Teater Besar dan Kecil di luar kewenangan panitia bazar.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Stand */}
      <section className="max-w-4xl mx-auto pb-24 px-4">
        <SectionTitle title="Denah Stand Bazaar" subtitle="Warna abu-abu menandakan stand sudah dipesan, warna hijau menandakan stand masih bisa dipesan." className="mb-12" />
        
        {loading ? (
           <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
        ) : stands.length === 0 ? (
           <div className="text-center text-muted-foreground italic py-10">Data denah stand belum tersedia atau gagal dimuat.</div>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stands.map((stand) => (
              <button
                key={stand.id}
                disabled={stand.is_booked}
                onClick={() => { setSelectedStand(stand); setIsModalOpen(true); }}
                className={`aspect-square rounded-3xl flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden group ${stand.is_booked ? "bg-secondary/30 border-border/50 cursor-not-allowed" : "bg-accent/10 border-accent/30 hover:bg-accent hover:border-accent hover:scale-105 shadow-lg shadow-accent/5"}`}
              >
                <span className={`text-3xl sm:text-4xl md:text-5xl font-black transition-colors ${stand.is_booked ? "text-muted-foreground/50" : "text-accent group-hover:text-accent-foreground"}`}>{stand.stand_number}</span>
                {stand.is_booked && <Badge className="absolute bottom-3 bg-muted-foreground/20 text-muted-foreground border-none text-[8px] sm:text-[10px] px-2 uppercase tracking-widest rounded-full">Booked</Badge>}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Modal Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border rounded-3xl p-6 sm:p-8 max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-primary">Booking Stand #{selectedStand?.stand_number}</DialogTitle>
            <DialogDescription className="italic text-xs sm:text-sm">Mohon isi identitas pendaftar untuk pembuatan tagihan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleHold} className="space-y-4 mt-2">
            <div className="space-y-2 flex flex-col">
              <label className="text-[10px] sm:text-xs font-bold text-foreground uppercase tracking-widest text-left">Nama Pendaftar</label>
              <input required className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm" value={formData.pendaftar_name} onChange={(e)=>setFormData({...formData, pendaftar_name: e.target.value})} />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-[10px] sm:text-xs font-bold text-foreground uppercase tracking-widest text-left">Email</label>
              <input type="email" required className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm" value={formData.pendaftar_email} onChange={(e)=>setFormData({...formData, pendaftar_email: e.target.value})} />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-[10px] sm:text-xs font-bold text-foreground uppercase tracking-widest text-left">No. WhatsApp</label>
              <input required className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
            </div>
            
            <div className="space-y-3 pt-2">
              <label className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest block text-left">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(paymentLogos).map(([method, logoPath]) => (
                  <button 
                    key={method} type="button" 
                    onClick={() => setFormData({...formData, payment_method: method})} 
                    className={`relative py-3 flex items-center justify-center rounded-xl border-2 transition-all ${
                      formData.payment_method === method 
                        ? "bg-[#c6ff33] border-primary shadow-[0_0_15px_rgba(198,255,51,0.8)] scale-105 z-10" 
                        : "bg-[#c6ff33]/80 border-transparent hover:bg-[#c6ff33]"
                    }`}
                  >
                    <Image src={logoPath} alt={method} width={60} height={20} className="object-contain h-6" unoptimized />
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting || !formData.payment_method} className="w-full py-6 sm:py-7 text-sm sm:text-lg font-bold rounded-full shadow-xl shadow-primary/20 mt-4">
              {isSubmitting ? "Memproses..." : "Selesaikan Pendaftaran →"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}