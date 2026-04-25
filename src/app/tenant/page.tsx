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

      {/* RUANG INFORMASI: Syarat, Fasilitas & Tata Tertib (Sesuai Revisi) */}
      <div className="max-w-5xl mx-auto space-y-6 mb-20 px-4">
        
        {/* Card 1: Fasilitas */}
        <Card className="bg-card/50 border border-border/60 rounded-3xl overflow-hidden batik-border shadow-md">
          <div className="bg-primary/10 border-b border-primary/20 px-8 py-4">
            <h3 className="text-accent font-bold uppercase tracking-widest text-sm">Fasilitas Bazar (18 Stand)</h3>
          </div>
          <CardContent className="p-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-foreground/80 list-disc pl-5">
              <li>18 Stand dengan lokasi di halaman parkir Teater Besar ISI Surakarta</li>
              <li>Tenda 3*3</li>
              <li>Meja 60 x 120 cm</li>
              <li>2 Kursi lipat</li>
              <li>Kelistrikan 450 watt (MCB, Stop Kontak dan lampu)</li>
              <li>Air & Kebersihan</li>
            </ul>
          </CardContent>
        </Card>

        {/* Card 2: Syarat & Ketentuan */}
        <Card className="bg-card/30 border border-border/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-background/80 border-b border-border px-8 py-4">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm">Syarat dan Ketentuan Pendaftaran</h3>
          </div>
          <CardContent className="p-8">
            <div className="space-y-4 text-sm text-foreground/80">
              <p className="flex gap-3 items-start"><span className="text-accent font-black">1.</span> <span>Pendaftaran peserta bazar wajib melalui link yang telah ditentukan panitia.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">2.</span> <span>Peserta memilih nomor stand dan menyelesaikan administrasi pada link yang telah disediakan panitia:<br/>
              - Pemilihan nomor stand dan pembayaran stand. Harga per stand <strong>Rp. 1.200.000,-</strong> (diberikan durasi waktu <strong>15 menit</strong> untuk menyelesaikan pembayaran).<br/>
              - Registrasi akun dan mengisi formulir pendaftaran yang berisikan nama pendaftar, nomor stand, nama tenant, jenis produk, nomor kontak aktif, email aktif, dan file bukti pembayaran melalui link pendaftaran.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">3.</span> <span>Produk yang dijual wajib dalam bentuk kemasan / <strong>takeaway</strong>. Panitia tidak menyediakan tempat untuk <em>dine in</em>.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">4.</span> <span>Peserta bazar <strong>tidak dapat berpindah ke nomor stand yang lain</strong> atau mengambil fasilitas seperti meja/kursi dari stand lain, dan wajib menandatangani surat perjanjian tenan bazar pada tanggal 28 April 2026 pada saat <em>loading in</em> stand.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">5.</span> <span>Jadwal Loading in: <strong>28 April 2026 Pukul 17.00 WIB</strong>. Loading out: <strong>30 April pukul 09.00 WIB</strong>.</span></p>
              <p className="flex gap-3 items-start"><span className="text-accent font-black">6.</span> <span>Apabila peserta mengundurkan diri, uang pendaftaran stand <strong>tidak dapat dikembalikan</strong>.</span></p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Tata Tertib */}
        <Card className="bg-card/30 border border-border/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-background/80 border-b border-border px-8 py-4">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm">Tata Tertib</h3>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-foreground/80">
              <div className="space-y-4">
                <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Bazaar adalah area yang disediakan panitia untuk digunakan hanya untuk menjual produk barang/jasa yang berhubungan dengan produk yang telah didaftarkan kepada panitia melalui link pendaftaran.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Peserta harus menaati waktu loading in tgl 28 April 2026 pukul 17.00 WIB dan loading out 30 April 2026 pukul 09.00.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Jam operasional stand bazar:<br/>- 28 April 2026 Pukul 17.00 - 21.00 WIB<br/>- 29 April 2026 Pukul 05.00 s/d 30 April pukul 09.00 WIB</span></p>
              </div>
              <div className="space-y-4">
                <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Apabila ada produk air mineral yang diperjual-belikan <strong>WAJIB dari merk Aqua</strong>.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Peserta tidak diperbolehkan pindah stand, menggunakan area bazar melebihi stand, mengambil fasilitas dari stand lain, membuat keributan, dan dilarang keras merusak fasilitas.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Peserta bazar harus menjaga kebersihan stand selama bazar berlangsung.</span></p>
                <p className="flex gap-3 items-start"><span className="text-accent font-black">•</span> <span>Barang berharga dijaga secara pribadi. Kehilangan dan kerusakan karena keteledoran peserta <strong>di luar tanggung jawab Tim Panitia Bazaar</strong>.</span></p>
              </div>
            </div>
            
            <div className="mt-8 bg-destructive/10 border border-destructive/30 p-5 rounded-xl">
              <p className="text-destructive font-black text-xs uppercase tracking-widest mb-2">Catatan Tambahan bagi Peserta:</p>
              <ul className="text-xs text-foreground/80 space-y-2 list-disc pl-4">
                <li>Akses jalan raya antara Pendhapa dan Teater Besar tidak ditutup. Dengan demikian asongan dan pedagang lainnya tetap masuk di area pertunjukan (pendhapa dan teater kapal).</li>
                <li>Panitia memiliki kewenangan untuk mengingatkan asongan dan pedagang lain apabila masuk di area bazaar. <strong>Trotoar area parkir Teater Besar dan area parkir Teater Kecil di luar kewenangan panitia bazaar.</strong></li>
              </ul>
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