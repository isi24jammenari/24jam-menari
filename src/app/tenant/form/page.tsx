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
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="mb-10 animate-bounce"><span className="text-6xl">✅</span></div>
        <SectionTitle title="Pendaftaran Selesai" subtitle="Tiket digital Anda telah terbit. Harap simpan atau cetak tiket di bawah ini." />
        <Card className="bg-card border-border rounded-3xl overflow-hidden mt-12 batik-border shadow-2xl">
          <div className="bg-primary p-4 text-primary-foreground font-black tracking-widest flex justify-between"><span>HTD SURAKARTA 2026</span><span>{booking.access_code}</span></div>
          <CardContent className="p-10 space-y-8">
            <div className="flex justify-between border-b border-border pb-6"><div className="text-left"><p className="text-xs text-muted-foreground uppercase font-bold">Stand</p><p className="text-5xl font-black text-primary italic">#{booking.stand_number}</p></div><div className="text-right"><p className="text-xs text-muted-foreground uppercase font-bold">Brand</p><p className="text-2xl font-bold text-foreground uppercase">{booking.tenant_name}</p></div></div>
            <div className="grid grid-cols-2 text-left gap-6 text-sm"><div className="space-y-1"><p className="text-muted-foreground font-bold">NAMA</p><p className="font-bold">{booking.pendaftar_name}</p></div><div className="space-y-1 text-right"><p className="text-muted-foreground font-bold">PRODUK</p><p className="font-bold uppercase">{booking.product_type}</p></div></div>
            <Button onClick={()=>window.print()} variant="outline" className="w-full rounded-full py-6 font-bold border-2">Cetak Tiket / Simpan PDF</Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default function TenantFormPage() { return <Suspense><FormContent /></Suspense>; }