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
import { CheckCircle2, Info, AlertTriangle, Phone, Clock } from "lucide-react";

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
        <p className="text-muted-foreground max-w-2xl mx-auto italic">"Silakan periksa denah dan pilih nomor stand yang tersedia di bawah untuk memulai proses administrasi."</p>
      </section>

      {/* RUANG INFORMASI: Grid 1 Kolom (Vertikal ke Bawah Sesuai Permintaan) */}
      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto mb-20 px-4">
        
        {/* KARTU 1: Syarat & Ketentuan */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <Info size={18} /> Syarat dan Ketentuan Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 flex-1">
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p className="flex gap-3 items-start"><span className="text-accent font-black">1.</span> <span>Pendaftaran peserta bazar wajib melalui link yang telah ditentukan panitia.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">2.</span> <span>Peserta memilih nomor stand dan menyelesaikan administrasi pada link yang telah disediakan panitia:<br/>
              - Pemilihan nomor stand dan pembayaran stand. Harga per stand <strong>Rp. 1.200.000,-</strong> (diberikan durasi waktu <strong>15 menit</strong> untuk menyelesaikan pembayaran).<br/>
              - Registrasi akun dan mengisi formulir pendaftaran yang berisikan nama pendaftar, nomor stand, nama tenant, jenis produk, nomor kontak aktif, email aktif, dan file bukti pembayaran melalui link pendaftaran.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">3.</span> <span>Produk yang dijual wajib dalam bentuk kemasan / <strong>takeaway</strong>. Panitia tidak menyediakan tempat untuk <em>dine in</em>.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">4.</span> <span>Peserta bazar <strong>tidak dapat berpindah ke nomor stand yang lain</strong> atau mengambil fasilitas seperti meja/kursi dari stand lain, dan wajib menandatangani surat perjanjian tenan bazar pada tanggal 28 April 2026 pada saat <em>loading in</em> stand.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">5.</span> <span>Jadwal Loading in: <strong>28 April 2026 Pukul 17.00 WIB</strong>. Loading out: <strong>30 April pukul 09.00 WIB</strong>.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">6.</span> <span>Apabila peserta mengundurkan diri, uang pendaftaran stand <strong>tidak dapat dikembalikan</strong>.</span></p>
            </div>
            <div className="pt-6 border-t border-border/50 mt-6">
              <p className="text-xs font-bold text-accent uppercase mb-2">Contact Person Bazar:</p>
              <a href="https://wa.me/6281331073894" target="_blank" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                 <Phone size={16} className="text-primary" /> Sri Lestariningsih (0813-3107-3894)
              </a>
            </div>
          </CardContent>
        </Card>

        {/* KARTU 2: Fasilitas */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col">
          <CardHeader className="bg-primary/10 border-b border-primary/20 py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-accent text-sm uppercase tracking-widest font-black">
              <CheckCircle2 size={18} /> Fasilitas Bazar (18 Stand)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 flex-1">
            <ul className="space-y-3">
              {[
                "18 Stand dengan lokasi di halaman parkir Teater Besar ISI Surakarta",
                "Tenda 3*3",
                "Meja 60 x 120 cm",
                "2 Kursi lipat",
                "Kelistrikan 450 watt (MCB, Stop Kontak dan lampu)",
                "Air",
                "Kebersihan"
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* KARTU 3: Tata Tertib */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <AlertTriangle size={18} /> Tata Tertib
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8 flex-1 flex flex-col">
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Bazaar adalah area yang disediakan panitia untuk digunakan hanya untuk menjual produk barang/jasa yang berhubungan dengan produk yang telah didaftarkan kepada panitia melalui link pendaftaran yang tersedia.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Peserta harus menaati waktu loading in tgl 28 April 2026 pukul 17.00 WIB dan loading out 30 April 2026 pukul 09.00 sesuai dengan ketentuan.</span></p>
              <div className="flex gap-3 items-start">
                <span className="text-accent font-black">•</span> 
                <div>
                  Jam operasional stand bazar:
                  <ul className="list-none pl-0 mt-2 space-y-1">
                    <li>- 28 April 2026 Pukul 17.00 - 21.00 WIB</li>
                    <li>- 29 April 2026 Pukul 05.00 s/d 30 April pukul 09.00 WIB</li>
                  </ul>
                </div>
              </div>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Apabila ada produk air mineral yang diperjual-belikan <strong>WAJIB dari merk Aqua</strong>.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Peserta tidak diperbolehkan pindah stand, menggunakan area bazar melebihi stand yang ditentukan, mengambil fasilitas dari stand lain, membuat kegaduhan atau keributan dengan semua pihak yang ada di lokasi stand dan dilarang keras merusak fasilitas yang diberikan oleh panitia bazar.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Peserta bazar harus menjaga kebersihan stand selama bazar berlangsung.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Peserta bazar harus menjaga barang berharga dan berbagai perlengkapan peserta bazar dijaga dengan baik secara pribadi. Apabila terjadi kehilangan dan kerusakan karena keteledoran peserta, hal tersebut di luar tanggung jawab Tim Panitia Bazaar.</span></p>
            </div>

            <div className="mt-auto bg-destructive/10 border border-destructive/20 p-5 rounded-2xl">
              <p className="font-black text-destructive text-sm uppercase tracking-widest mb-3">Catatan Tambahan Bagi Peserta:</p>
              <ul className="list-disc pl-5 space-y-3 text-sm text-foreground/90 leading-relaxed">
                <li>Akses jalan raya antara Pendhapa dan Teater Besar tidak ditutup. Dengan demikian asongan dan pedagang lainnya tetap masuk di area pertunjukan (pendhapa dan teater kapal).</li>
                <li>Panitia memiliki kewenangan untuk mengingatkan asongan dan pedagang lain apabila masuk di area bazaar. Trotoar area parkir Teater Besar dan area parkir Teater Kecil di luar kewenangan panitia bazaar.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AREA DENAH & PEMILIHAN STAND (DIPISAH) */}
      <section className="max-w-5xl mx-auto pb-24 px-4">
        
        {/* 1. GAMBAR DENAH DI ATAS */}
        <div className="w-full bg-card rounded-3xl overflow-hidden border-2 border-border shadow-md mb-12">
          <Image
            src="/denah-tenant.webp"
            alt="Denah Teater Besar ISI Surakarta"
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>

        {/* 2. JUDUL PILIH STAND */}
        <SectionTitle 
          title="Pilih Lokasi Stand" 
          subtitle="Cocokkan nomor dengan denah di atas. Warna hijau menandakan stand tersedia untuk dipesan." 
          className="mb-8" 
        />
        
        {/* 3. GRID TOMBOL STAND 1-18 DI BAWAHNYA */}
        {loading ? (
           <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
        ) : stands.length === 0 ? (
           <div className="text-center text-muted-foreground italic py-10">Data denah stand belum tersedia atau gagal dimuat.</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {stands.map((stand) => (
              <button
                key={stand.id}
                disabled={stand.is_booked}
                onClick={() => { setSelectedStand(stand); setIsModalOpen(true); }}
                className={`aspect-square rounded-3xl flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden group ${
                  stand.is_booked 
                    ? "bg-secondary/30 border-border/50 cursor-not-allowed" 
                    : "bg-accent/10 border-accent/30 hover:bg-accent hover:border-accent hover:scale-105 shadow-lg shadow-accent/5"
                }`}
              >
                <span className={`text-3xl sm:text-4xl md:text-5xl font-black transition-colors ${stand.is_booked ? "text-muted-foreground/50" : "text-accent group-hover:text-accent-foreground"}`}>
                  {stand.stand_number}
                </span>
                {stand.is_booked && <Badge className="absolute bottom-2 bg-muted-foreground/20 text-muted-foreground border-none text-[8px] sm:text-[10px] px-2 uppercase tracking-widest rounded-full">Booked</Badge>}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Modal Form Pembayaran */}
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