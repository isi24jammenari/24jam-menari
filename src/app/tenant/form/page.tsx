"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTenantStatus, submitTenantForm } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BookingData {
  status: string;
  access_code: string;
  pendaftar_name: string;
  tenant_name: string | null;
  product_type: string | null;
  stand_number: number;
}

function FormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderIdParam = searchParams.get("order_id");
  
  const [step, setStep] = useState<"verify" | "fill" | "success">("verify");
  const [loading, setLoading] = useState(true);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  
  const [formData, setFormData] = useState({
    tenant_name: "",
    product_type: ""
  });

  // Verifikasi Awal (Jika ada order_id di URL)
  useEffect(() => {
    if (orderIdParam) {
      handleVerify(orderIdParam, "order_id");
    } else {
      setLoading(false);
    }
  }, [orderIdParam]);

  const handleVerify = async (val: string, type: "order_id" | "access_code") => {
    setLoading(true);
    try {
      const res = await getTenantStatus(val); // Backend mendukung lookup by order_id
      const data = res.data;

      if (data.status !== "success") {
        alert("Transaksi ini belum lunas atau sudah expired.");
        router.push("/");
        return;
      }

      setBookingData(data);
      
      // Jika sudah pernah isi form sebelumnya, langsung ke tiket
      if (data.tenant_name && data.product_type) {
        setStep("success");
      } else {
        setStep("fill");
      }
    } catch (error: any) {
      alert(error.message || "Gagal memverifikasi akses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData) return;

    setLoading(true);
    try {
      await submitTenantForm({
        order_id: orderIdParam || undefined,
        access_code: bookingData.access_code,
        ...formData
      });
      
      // Update local state untuk tampilan tiket
      setBookingData({
        ...bookingData,
        ...formData
      });
      setStep("success");
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan formulir.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#c6ff33] font-black uppercase tracking-widest">Memproses...</div>;

  // TAMPILAN 1: LOGIN KODE AKSES (Jika tidak ada order_id)
  if (step === "verify") {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <Card className="bg-black border-2 border-[#6849cf] rounded-none">
          <CardHeader>
            <CardTitle className="text-xl font-black text-[#c6ff33] uppercase">Masuk Dashboard Tenant</CardTitle>
            <p className="text-xs text-gray-400">Gunakan Kode Akses dari email Anda untuk melihat tiket atau melengkapi data.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-[#ff00cc] uppercase">Kode Akses (Contoh: TNT-XXXXXX)</label>
              <input 
                className="bg-black border border-[#6849cf] p-3 text-white uppercase tracking-widest focus:outline-none focus:border-[#c6ff33]"
                value={accessCodeInput}
                onChange={(e) => setAccessCodeInput(e.target.value)}
                placeholder="TNT-"
              />
            </div>
            <Button 
              className="w-full bg-[#6849cf] hover:bg-[#ff00cc] text-white font-black rounded-none transition-all"
              onClick={() => handleVerify(accessCodeInput, "access_code")}
            >
              VERIFIKASI KODE
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TAMPILAN 2: FORMULIR KELENGKAPAN (Tahap 2)
  if (step === "fill") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-[#c6ff33] uppercase mb-2">Lengkapi Data Tenant</h2>
        <p className="text-[#6849cf] text-sm mb-8 font-bold uppercase tracking-widest">Stand #{bookingData?.stand_number} - {bookingData?.pendaftar_name}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-black border-2 border-[#6849cf] rounded-none">
            <CardContent className="pt-6 space-y-5">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#ff00cc] uppercase tracking-wider">Nama Brand / Tenant</label>
                <input 
                  required
                  className="bg-black border border-[#6849cf] p-3 text-white focus:outline-none focus:border-[#c6ff33]"
                  value={formData.tenant_name}
                  onChange={(e) => setFormData({...formData, tenant_name: e.target.value})}
                  placeholder="Contoh: Es Teh Solo Mantap"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#ff00cc] uppercase tracking-wider">Jenis Produk Jualan</label>
                <input 
                  required
                  className="bg-black border border-[#6849cf] p-3 text-white focus:outline-none focus:border-[#c6ff33]"
                  value={formData.product_type}
                  onChange={(e) => setFormData({...formData, product_type: e.target.value})}
                  placeholder="Contoh: Minuman Dingin & Snack"
                />
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full bg-[#c6ff33] text-black hover:bg-[#ff00cc] hover:text-white font-black h-14 text-lg rounded-none transition-all shadow-[0_0_20px_rgba(198,255,51,0.3)]">
            SIMPAN & TERBITKAN TIKET
          </Button>
        </form>
      </div>
    );
  }

  // TAMPILAN 3: TIKET / KONFIRMASI SUKSES
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <Badge className="bg-[#c6ff33] text-black mb-4 px-4 py-1 rounded-none font-black uppercase">Terverifikasi</Badge>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Tiket Stand Tenant</h2>
      </div>

      <Card className="bg-black border-2 border-[#ff00cc] rounded-none overflow-hidden shadow-[0_0_30px_rgba(255,0,204,0.2)]">
        <div className="bg-[#ff00cc] p-4 flex justify-between items-center">
          <span className="font-black text-black uppercase tracking-widest">24 Jam Menari #20</span>
          <span className="font-bold text-black">NO: {bookingData?.access_code}</span>
        </div>
        <CardContent className="pt-8 pb-10 px-8 space-y-6 relative">
          {/* Watermark Stand Number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-[#6849cf]/10 pointer-events-none">
            {bookingData?.stand_number}
          </div>

          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-[#6849cf] uppercase">Nama Tenant</p>
              <p className="text-xl font-black text-[#c6ff33] uppercase leading-tight">{bookingData?.tenant_name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#6849cf] uppercase">Nomor Stand</p>
              <p className="text-4xl font-black text-white italic">#{bookingData?.stand_number}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6849cf] uppercase">Pendaftar</p>
              <p className="text-sm font-bold text-gray-300">{bookingData?.pendaftar_name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#6849cf] uppercase">Produk</p>
              <p className="text-sm font-bold text-gray-300 uppercase">{bookingData?.product_type}</p>
            </div>
          </div>

          <Separator className="bg-[#ff00cc]/30" />

          <div className="space-y-2 text-xs text-gray-400">
            <p>• Loading In: <strong>28 April 2026, 15.00 WIB</strong></p>
            <p>• Lokasi: <strong>Halaman Teater Besar ISI Surakarta</strong></p>
            <p>• Wajib membawa screenshot tiket ini saat verifikasi lokasi.</p>
          </div>

          <Button 
            className="w-full bg-white text-black font-black uppercase rounded-none mt-4 hover:bg-gray-200"
            onClick={() => window.print()}
          >
            Cetak / Simpan PDF
          </Button>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest">
        Ada kendala? <a href="https://wa.me/6281331073894" className="text-[#6849cf] underline">Hubungi Panitia Bazaar</a>
      </p>
    </div>
  );
}

export default function TenantFormPage() {
  return (
    <div className="min-h-screen bg-black">
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-[#6849cf]">Loading...</div>}>
        <FormContent />
      </Suspense>
    </div>
  );
}