"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      
      // Simpan data payment ke sessionStorage (PENTING untuk halaman selanjutnya)
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
      {/* Hero Section dengan Tipografi yang Diperbaiki */}
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

      {/* Rules & Facilities Card (Sama dengan sebelumnya) */}
      <div className="max-w-5xl mx-auto space-y-6 mb-20 px-4">
        <Card className="bg-card/50 border border-border/60 rounded-3xl overflow-hidden batik-border shadow-md">
          <div className="bg-primary/10 border-b border-primary/20 px-8 py-4">
            <h3 className="text-accent font-bold uppercase tracking-widest text-sm">Fasilitas Bazar & Jadwal (16 Stand)</h3>
          </div>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-primary mb-4 text-sm uppercase">Fasilitas yang didapat:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                <li>Lokasi di halaman parkir Teater Besar ISI Surakarta</li>
                <li>Tenda sanavil 3x3, Meja, dan Kursi</li>
                <li>Kelistrikan 450 watt (MCB, Stop Kontak dan lampu)</li>
                <li>Air & Kebersihan</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-primary mb-4 text-sm uppercase">Waktu & Operasional:</p>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex justify-between border-b border-border/50 pb-2"><span>Loading In</span> <span className="font-bold">28 April 2026, 15.00 WIB</span></li>
                <li className="flex justify-between border-b border-border/50 pb-2"><span>Operasional Hari 1</span> <span className="font-bold">28 April, 17.00 - 21.00 WIB</span></li>
                <li className="flex justify-between border-b border-border/50 pb-2 text-right"><span>Operasional Hari 2 & 3</span> <span className="font-bold">29 April (05.00 WIB) <br/>s/d 30 April (09.00 WIB)</span></li>
                <li className="flex justify-between"><span>Loading Out</span> <span className="font-bold">30 April 2026, 09.00 WIB</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border border-border/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-background/80 border-b border-border px-8 py-4">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm">Syarat, Ketentuan & Tata Tertib</h3>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-foreground/80">
              <div className="space-y-4">
                <p className="flex gap-3 items-start"><span className="text-accent font-black">1.</span> <span>Pendaftaran wajib melalui link resmi. Selesaikan pembayaran dalam <strong>15 menit</strong> setelah memilih stand. Lengkapi formulir pendaftaran setelah pembayaran sukses.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">2.</span> <span>Produk wajib dalam bentuk kemasan / <strong>takeaway</strong>. Panitia tidak menyediakan tempat untuk <em>dine in</em>.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">3.</span> <span>Hanya diperbolehkan menjual produk yang telah didaftarkan. Dilarang menggunakan area melebihi stand.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">4.</span> <span>Dilarang keras merusak fasilitas, dan wajib menjaga kebersihan stand selama acara.</span></p>
              </div>
              <div className="space-y-4">
                <p className="flex gap-3 items-start"><span className="text-accent font-black">5.</span> <span>Peserta <strong>tidak dapat berpindah stand</strong> dan wajib menandatangani surat perjanjian pada tanggal 28 April 2026 saat <em>loading in</em>.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">6.</span> <span>Uang pendaftaran <strong>tidak dapat dikembalikan</strong> apabila peserta mengundurkan diri.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">7.</span> <span>Barang berharga dijaga secara pribadi. Kehilangan dan kerusakan karena keteledoran peserta <strong>di luar tanggung jawab Panitia</strong>.</span></p>
              </div>
            </div>
            <div className="mt-8 bg-destructive/10 border border-destructive/30 p-4 rounded-xl">
              <p className="text-destructive font-bold text-xs uppercase mb-2">Catatan Tambahan Panitia:</p>
              <p className="text-xs text-foreground/80">Akses jalan raya antara Pendhapa dan Teater Besar tidak ditutup. Asongan dan pedagang lainnya tetap masuk di area pertunjukan. Panitia memiliki kewenangan mengingatkan asongan yang masuk area bazaar, namun <strong>trotoar area parkir Teater Besar dan Kecil di luar kewenangan panitia bazaar</strong>.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="max-w-4xl mx-auto pb-24 px-4">
        {/* Teks Penjelasan Warna yang Diperbaiki */}
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

      {/* REVISI MODAL FORM: 3 Baris & Menampilkan Logo */}
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
                    className={`relative py-3 flex items-center justify-center rounded-xl border-2 transition-all ${formData.payment_method === method ? "border-primary bg-primary/10 shadow-md" : "bg-background border-input hover:border-primary/50"}`}
                  >
                    <Image src={logoPath} alt={method} width={60} height={20} className="object-contain h-5" unoptimized />
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