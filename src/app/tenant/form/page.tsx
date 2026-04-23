"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { getTenantStatus, submitTenantForm } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function FormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const [step, setStep] = useState<"verify" | "fill" | "success">("verify");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [accessCode, setAccessCode] = useState("");
  const [formData, setFormData] = useState({ tenant_name: "", product_type: "" });

  useEffect(() => { if (orderId) handleVerify(orderId, "order_id"); else setLoading(false); }, [orderId]);

  const handleVerify = async (val: string, type: string) => {
    setLoading(true);
    try {
      const res = await getTenantStatus(val);
      if (res.data.status !== "success") { alert("Transaksi belum lunas."); router.push("/"); return; }
      setBooking(res.data);
      if (res.data.tenant_name) setStep("success"); else setStep("fill");
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitTenantForm({ access_code: booking.access_code, ...formData });
      setBooking({ ...booking, ...formData });
      setStep("success");
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse">Menghubungkan...</div>;

  if (step === "verify") {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto py-20 text-center">
          <SectionTitle title="Akses Tenant" subtitle="Gunakan Kode Akses dari email Anda." className="mb-12" />
          <div className="space-y-6">
            <input className="w-full px-6 py-4 rounded-full border-2 border-input bg-card text-center text-2xl font-bold uppercase tracking-widest text-primary focus:ring-2 focus:ring-accent outline-none" value={accessCode} onChange={(e)=>setAccessCode(e.target.value)} placeholder="TNT-XXXX" />
            <Button onClick={() => handleVerify(accessCode, "code")} className="w-full py-7 rounded-full text-lg font-bold shadow-xl shadow-primary/20">Verifikasi Kode →</Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (step === "fill") {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          <SectionTitle title="Detail Tenant" subtitle="Mohon lengkapi data jualan Anda untuk keperluan denah dan keamanan." className="mb-12" />
          <Card className="bg-primary/5 border-primary/20 mb-10 rounded-2xl">
            <CardContent className="p-6 flex justify-between items-center italic">
              <div><p className="text-xs text-muted-foreground uppercase font-bold">Stand</p><p className="text-2xl font-black text-primary">#{booking.stand_number}</p></div>
              <div className="text-right"><p className="text-xs text-muted-foreground uppercase font-bold">Pendaftar</p><p className="font-bold text-foreground">{booking.pendaftar_name}</p></div>
            </CardContent>
          </Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2"><label className="text-sm font-bold uppercase">Nama Brand / Tenant</label><input required className="w-full px-5 py-4 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none" value={formData.tenant_name} onChange={(e)=>setFormData({...formData, tenant_name: e.target.value})} placeholder="Es Teh Solo..." /></div>
            <div className="space-y-2"><label className="text-sm font-bold uppercase">Jenis Produk</label><input required className="w-full px-5 py-4 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none" value={formData.product_type} onChange={(e)=>setFormData({...formData, product_type: e.target.value})} placeholder="Minuman & Cemilan..." /></div>
            <Button type="submit" className="w-full py-8 text-xl font-bold rounded-full shadow-2xl shadow-primary/20">Simpan & Terbitkan Tiket →</Button>
          </form>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* TAMPILAN DI LAYAR (Hanya muncul di web, hilang saat diprint) */}
      <div className="max-w-2xl mx-auto py-12 text-center no-print">
        <div className="mb-6 animate-bounce"><span className="text-6xl">✅</span></div>
        <SectionTitle title="Pendaftaran Berhasil" subtitle="Tiket digital Anda telah terbit. Silakan cetak atau simpan sebagai PDF." />
        <Button 
          onClick={() => window.print()} 
          className="mt-8 rounded-full px-10 py-6 font-bold shadow-xl shadow-primary/20 bg-primary hover:scale-105 transition-all gap-2"
        >
          <span>Cetak Tiket / Simpan PDF</span>
        </Button>
      </div>

      {/* AREA TIKET A5 (Hanya muncul saat proses Print/Download PDF) */}
      <div className="ticket-container bg-white text-black p-0 mx-auto overflow-hidden">
        <div className="a5-ticket relative border-[12px] border-double border-[#6849cf]/20 m-0 p-10 flex flex-col justify-between h-full bg-[#fafafa]">
          
          <div className="absolute top-4 left-4 opacity-10 text-4xl">❦</div>
          <div className="absolute top-4 right-4 opacity-10 text-4xl">❦</div>

          {/* Header Tiket */}
          <div className="text-center border-b-2 border-black/10 pb-6">
            <h2 className="text-tradisional text-4xl font-black text-[#6849cf] leading-none mb-2">24 JAM MENARI #20</h2>
            <p className="font-bold tracking-[0.4em] uppercase text-xs text-gray-500">ISI SURAKARTA • 2026</p>
          </div>

          {/* Body Tiket */}
          <div className="py-10 space-y-12">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Nomor Stand</p>
                <p className="text-7xl font-black italic leading-none">#{booking?.stand_number}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Kode Akses</p>
                <p className="bg-black text-white px-4 py-2 font-mono font-bold text-xl">{booking?.access_code}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 border-y border-dashed border-black/20 py-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6849cf] mb-1">Nama Brand / Tenant</p>
                <p className="text-3xl font-bold uppercase tracking-tight">{booking?.tenant_name}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Jenis Produk</p>
                  <p className="font-bold uppercase">{booking?.product_type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pendaftar</p>
                  <p className="font-bold uppercase">{booking?.pendaftar_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer & Aturan Tiket */}
          <div className="bg-[#6849cf]/5 p-6 rounded-xl space-y-3">
            <p className="text-[10px] font-black uppercase text-[#6849cf] border-b border-[#6849cf]/20 pb-2">Informasi Penting:</p>
            <ul className="text-[10px] text-gray-600 space-y-1 font-medium italic">
              <li>• Loading In: 28 April 2026, Pukul 15.00 WIB.</li>
              <li>• Lokasi: Halaman Parkir Teater Besar ISI Surakarta.</li>
              <li>• Wajib menunjukkan tiket ini (cetak/digital) kepada panitia saat kedatangan.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* STYLE CSS KHUSUS UNTUK PRINT MEDIA (Otomatis potong A5 Landscape) */}
      <style jsx global>{`
        @media screen {
          .ticket-container {
            display: none; /* Sembunyikan cetakan di layar browser */
          }
        }

        @media print {
          @page {
            size: A5 landscape; /* Memaksa PDF berukuran A5 Landscape */
            margin: 0;
          }
          
          body * {
            visibility: hidden; /* Sembunyikan elemen web lainnya saat diprint */
          }

          .no-print { display: none !important; }

          .ticket-container, .ticket-container * {
            visibility: visible; /* Hanya area ini yang masuk PDF */
          }

          .ticket-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 148mm;
            display: block !important;
            margin: 0;
            padding: 0;
          }

          .a5-ticket {
            height: 100%;
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </PageWrapper>
  );
}

export default function TenantFormPage() { return <Suspense><FormContent /></Suspense>; }