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
        
        {/* KARTU 1: Syarat & Ketentuan */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <Info size={18} /> Syarat dan ketentuan Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <ol className="list-decimal pl-5 space-y-3 text-xs text-foreground/80 leading-relaxed font-medium">
              <li>Pendaftaran peserta bazar wajib melalui link yang telah ditentukan panitia</li>
              <li>
                Peserta memilih nomor stand dan menyelesaikan administrasi pada link yang telah disediakan panitia:
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Pemilihan nomor stand dan pembayaran stand. Harga per stand <strong>Rp. 1.200.000,-</strong> (diberikan durasi waktu <strong>15 menit</strong> untuk menyelesaikan pembayaran).</li>
                  <li>Registrasi akun dan mengisi formulir pendaftaran yang berisikan nama pendaftar, nomor stand, nama tenant, jenis produk, nomor kontak aktif, email aktif, dan file bukti pembayaran melalui link pendaftaran.</li>
                </ul>
              </li>
              <li>Produk yang dijual wajib dalam bentuk kemasan / takeaway. Panitia tidak menyediakan tempat untuk dine in.</li>
              <li>Peserta bazar tidak dapat berpindah ke nomor stand yang lain atau mengambil fasilitas seperti meja/kursi dari stand lain, dan wajib menandatangi surat perjanjian tenan bazar pada tanggal 28 April 2026 pada saat loading in stand.</li>
              <li>Jadwal Loading in 28 April 2026 Pukul 17.00 WIB Loading out 30 April pukul 09.00 WIB</li>
              <li>Apabila peserta mengundurkan diri, uang pendaftaran stand tidak dapat dikembalikan.</li>
              <li>Contact Person Bazar : Sri Lestariningsih (0813-3107-3894)</li>
            </ol>
          </CardContent>
        </Card>

        {/* KARTU 2: Fasilitas */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-primary/10 border-b border-primary/20 py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-accent text-sm uppercase tracking-widest font-black">
              <CheckCircle2 size={18} /> Fasilitas Bazar (18 Stand)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <ul className="list-disc pl-5 space-y-3 text-xs text-foreground/80 leading-relaxed font-medium">
              <li>18 Stand dengan lokasi di halaman parkir Teater Besar ISI Surakarta</li>
              <li>Tenda 3*3</li>
              <li>Meja 60 x 120 cm</li>
              <li>2 Kursi lipat</li>
              <li>Kelistrikan 450 watt (MCB, Stop Kontak dan lampu)</li>
              <li>Air</li>
              <li>Kebersihan</li>
            </ul>
          </CardContent>
        </Card>

        {/* KARTU 3: Tata Tertib */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <AlertTriangle size={18} /> Tata Tertib
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
            <ul className="list-disc pl-5 space-y-3 text-xs text-foreground/80 leading-relaxed font-medium">
              <li>Bazaar adalah area yang disediakan panitia untuk digunakan hanya untuk menjual produk barang/jasa yang berhubungan dengan yang produk yang telah didaftarkan kepada panitia melalui link pendaftaran yang tersedia.</li>
              <li>Peserta harus menaati waktu loading in tgl 28 April 2026 pukul 17.00 WIB dan loading out 30 April 2026 pukul 09.00 sesuai dengan ketentuan.</li>
              <li>
                Jam operasional stand bazar:
                <ul className="list-[circle] pl-5 mt-2 space-y-1">
                  <li>28 April 2026 Pukul 17.00 - 21.00 WIB</li>
                  <li>29 April 2026 Pukul 05.00 s/d 30 April pukul 09.00 WIB</li>
                </ul>
              </li>
              <li className="font-bold text-accent">Apabila ada produk air mineral yang diperjual-belikan WAJIB dari merk Aqua.</li>
              <li>Peserta tidak diperbolehkan pindah stand, menggunakan area bazar melebihi stand yang ditentukan, mengambil fasilitas dari stand lain, membuat kegaduhan atau keributan dengan semua pihak yang ada di lokasi stand dan dilarang keras merusak fasilitas yang diberikan oleh panitia bazar.</li>
              <li>Peserta bazar harus menjaga kebersihan stand selama bazar berlangsung</li>
              <li>Peserta bazar harus menjaga barang berharga dan berbagai perlengkapan peserta bazaar dijaga dengan baik secara pribadi. Apabila terjadi kehilangan dan kerusakan karena keteledoran peserta, hal tersebut di luar tanggung jawab Tim Panitia Bazaar</li>
            </ul>

            <div className="mt-auto bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
              <p className="font-black text-destructive text-[10px] uppercase tracking-widest mb-2">Catatan tambahan bagi peserta</p>
              <ul className="list-disc pl-4 space-y-2 text-[11px] text-foreground/90 font-medium leading-snug">
                <li>Akses jalan raya antara Pendhapa dan Teater Besar tidak ditutup. Dengan demikian asongan dan pedagang lainnya tetap masuk di area pertunjukan (pendhapa dan teater kapal).</li>
                <li>Panitia memiliki kewenangan untuk mengingatkan asongan dan pedagang lain apabila masuk di area bazaar. Trotoar area parkir Teater Besar dan area parkir Teater Kecil di luar kewenangan panitia bazaar.</li>
              </ul>
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