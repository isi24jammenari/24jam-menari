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

  // INJEKSI DENAH INTERAKTIF: KOORDINAT 18 STAND
  // X = Kiri ke Kanan (Left), Y = Atas ke Bawah (Top)
  // (Sesuaikan nilai persentase ini setelah halaman dirender agar letaknya pas di kotak denah Anda)
  const standPositions: Record<number, { top: string; left: string }> = {
    1: { top: "25%", left: "15%" },
    2: { top: "25%", left: "25%" },
    3: { top: "25%", left: "35%" },
    4: { top: "25%", left: "45%" },
    5: { top: "25%", left: "55%" },
    6: { top: "25%", left: "65%" },
    7: { top: "50%", left: "15%" },
    8: { top: "50%", left: "25%" },
    9: { top: "50%", left: "35%" },
    10: { top: "50%", left: "45%" },
    11: { top: "50%", left: "55%" },
    12: { top: "50%", left: "65%" },
    13: { top: "75%", left: "15%" },
    14: { top: "75%", left: "25%" },
    15: { top: "75%", left: "35%" },
    16: { top: "75%", left: "45%" },
    17: { top: "75%", left: "55%" },
    18: { top: "75%", left: "65%" },
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

      {/* RUANG INFORMASI: Grid 1 Kolom (Vertikal ke bawah) dengan Teks Utuh */}
      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto mb-20 px-4">
        
        {/* KARTU 1: Syarat & Ketentuan */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <Info size={18} /> Syarat dan ketentuan Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 flex-1">
            <ol className="list-decimal pl-5 space-y-3 text-sm text-foreground/80 leading-relaxed font-medium">
              <li>Pendaftaran peserta bazar wajib melalui link yang telah ditentukan panitia</li>
              <li>
                Peserta memilih nomor stand dan menyelesaikan administrasi pada link yang telah disediakan panitia:
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Pemilihan nomor stand dan pembayaran stand. Harga per stand <strong>Rp. 1.200.000,-</strong> (diberikan durasi waktu <strong>15 menit</strong> untuk menyelesaikan pembayaran).</li>
                  <li>Registrasi akun dan mengisi formulir pendaftaran yang berisikan nama pendaftar, nomor stand, nama tenant, jenis produk, nomor kontak aktif, email aktif, dan file bukti pembayaran melalui link pendaftaran.</li>
                </ul>
              </li>
              <li>Produk yang dijual wajib dalam bentuk kemasan / takeaway. Panitia tidak menyediakan tempat untuk dine in.</li>
              <li>Peserta bazar tidak dapat berpindah ke nomor stand yang lain atau mengambil fasilitas seperti meja/krsi dari stand lain, dan wajib menandatangi surat perjanjian tenan bazar pada tanggal 28 April 2026 pada saat loading in stand.</li>
              <li>Jadwal Loading in 28 April 2026 Pukul 17.00 WIB Loading out 30 April pukul 09.00 WIB</li>
              <li>Apabila peserta mengundurkan diri, uang pendaftaran stand tidak dapat dikembalikan.</li>
              <li>Contact Person Bazar :<br/>Sri Lestariningsih (0813-3107-3894)</li>
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
          <CardContent className="p-6 md:p-8 flex-1">
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed font-medium">
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

        {/* KARTU 3: Tata Tertib & Catatan */}
        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-md batik-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-background/80 border-b border-border py-4 px-6">
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <AlertTriangle size={18} /> Tata Tertib
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8 flex-1 flex flex-col">
            <ul className="list-disc pl-5 space-y-3 text-sm text-foreground/80 leading-relaxed font-medium">
              <li>Bazaar adalah area yang disediakan panitia untuk digunakan hanya untuk menjual produk barang/jasa yang berhubungan dengan yang produk yang telah didaftarkan kepada panitia melalui link pendaftaran yang tersedia.</li>
              <li>Peserta harus menaati waktu loading in tgl 28 April 2026 pukul 17.00 WIB dan loading out 30 April 2026 pukul 09.00 sesuai dengan ketentuan.</li>
              <li>
                Jam operasional stand bazar:
                <ul className="list-none pl-0 mt-2 space-y-1">
                  <li>28 April 2026 Pukul 17.00 - 21.00 WIB</li>
                  <li>29 April 2026 Pukul 05.00 s/d 30 April pukul 09.00 WIB</li>
                </ul>
              </li>
              <li>Apabila ada produk air mineral yang diperjual-belikan WAJIB dari merk Aqua.</li>
              <li>Peserta tidak diperbolehkan pindah stand, menggunakan area bazar melebihi stand yang ditentukan, mengambil fasilitas dari stand lain, membuat kegaduhan atau keributan dengan semua pihak yang ada di lokasi stand dan dilarang keras merusak fasilitas yang diberikan oleh panitia bazar.</li>
              <li>Peserta bazar harus menjaga kebersihan stand selama bazar berlangsung</li>
              <li>Peserta bazar harus menjaga barang berharga dan berbagai perlengkapan peserta bazaar dijaga dengan baik secara pribadi. Apabila terjadi kehilangan dan kerusakan karena keteledoran peserta, hal tersebut di luar tanggung jawab Tim Panitia Bazaar</li>
            </ul>

            <div className="mt-auto bg-destructive/10 border border-destructive/20 p-5 rounded-2xl">
              <p className="font-black text-destructive text-sm uppercase tracking-widest mb-3">Catatan tambahan bagi peserta</p>
              <ul className="list-disc pl-4 space-y-3 text-sm text-foreground/90 font-medium leading-relaxed">
                <li>Akses jalan raya antara Pendhapa dan Teater Besar tidak ditutup. Dengan demikian asongan dan pedagang lainnya tetap masuk di area pertunjukan (pendhapa dan teater kapal).</li>
                <li>Panitia memiliki kewenangan untuk mengingatkan asongan dan pedagang lain apabila masuk di area bazaar. Trotoar area parkir Teater Besar dan area parkir Teater Kecil di luar kewenangan panitia bazaar.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DENAH INTERAKTIF STAND BAZAAR */}
      <section className="max-w-6xl mx-auto pb-24 px-4">
        <SectionTitle 
          title="Pilih Lokasi Stand" 
          subtitle="Klik pada nomor stand di atas denah untuk melakukan pemesanan. Warna hijau menandakan stand tersedia." 
          className="mb-12" 
        />
        
        {loading ? (
           <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
        ) : stands.length === 0 ? (
           <div className="text-center text-muted-foreground italic py-10">Data denah stand belum tersedia atau gagal dimuat.</div>
        ) : (
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-card rounded-3xl overflow-hidden border-4 border-border shadow-2xl">
            {/* GAMBAR BACKGROUND DENAH */}
            <Image
              src="/denah-tenant.webp.jpg" // Mutlak dipastikan nama file ini sudah benar di public/
              alt="Denah Teater Besar ISI Surakarta"
              fill
              className="object-cover md:object-contain opacity-95"
              unoptimized
            />

            {/* OVERLAY TOMBOL STAND BERDASARKAN KOORDINAT PERSENTASE */}
            {stands.map((stand) => {
              const pos = standPositions[stand.stand_number] || { top: "50%", left: "50%" };
              
              return (
                <button
                  key={stand.id}
                  disabled={stand.is_booked}
                  onClick={() => { setSelectedStand(stand); setIsModalOpen(true); }}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all font-black text-xs sm:text-sm md:text-lg lg:text-2xl shadow-lg border-[3px] hover:z-50 ${
                    stand.is_booked 
                      ? "bg-secondary/90 border-border cursor-not-allowed text-muted-foreground" 
                      : "bg-[#c6ff33] border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-125 hover:shadow-[0_0_20px_rgba(198,255,51,0.8)] cursor-pointer"
                  }`}
                >
                  {stand.stand_number}
                </button>
              );
            })}
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