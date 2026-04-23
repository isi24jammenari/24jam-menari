"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTenantStands, holdTenantStand } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Stand {
  id: string;
  stand_number: number;
  price: number;
  is_booked: boolean;
}

export default function TenantLandingPage() {
  const router = useRouter();
  const [stands, setStands] = useState<Stand[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal & Form
  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pendaftar_name: "",
    pendaftar_email: "",
    phone: "",
    payment_method: ""
  });

  useEffect(() => {
    fetchStands();
  }, []);

  const fetchStands = async () => {
    try {
      const res = await getTenantStands();
      setStands(res.data);
    } catch (error) {
      console.error("Gagal mengambil data stand", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (stand: Stand) => {
    setSelectedStand(stand);
    setIsModalOpen(true);
  };

  const handleHold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStand || !formData.payment_method) return;

    setIsSubmitting(true);
    try {
      const res = await holdTenantStand({
        stand_id: selectedStand.id,
        ...formData
      });
      // Membawa order_id dan waktu expired ke halaman payment
      router.push(`/payment?order_id=${res.data.order_id}&expires_at=${res.data.expires_at}`);
    } catch (error: any) {
      alert(error.message || "Gagal melakukan booking stand.");
      fetchStands(); // Refresh status stand jika ternyata direbut orang
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#000000] text-white min-h-screen pb-20">
      {/* HEADER SECTION */}
      <section className="pt-16 pb-12 px-4 border-b border-[#6849cf]/50 bg-[#000000] text-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#c6ff33] uppercase tracking-tighter mb-4">
          Pendaftaran Tenant Bazaar
        </h1>
        <h2 className="text-xl md:text-2xl text-[#ff00cc] font-bold tracking-widest uppercase">
          24 Jam Menari #20 - ISI Surakarta 2026
        </h2>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* KOLOM KIRI: RULES */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#000000] border-[#6849cf] rounded-none">
            <CardHeader className="border-b border-[#6849cf]/30 bg-[#6849cf]/10">
              <CardTitle className="text-[#c6ff33] uppercase tracking-widest text-lg">Aturan & Tata Tertib</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm text-gray-300 space-y-4">
              <p><strong className="text-[#ff00cc]">Takeaway Only:</strong> Wajib kemasan, dilarang dine-in.</p>
              <Separator className="bg-[#6849cf]/30" />
              <p><strong className="text-[#ff00cc]">Loading In:</strong> 28 April 2026, 15.00 WIB.</p>
              <Separator className="bg-[#6849cf]/30" />
              <p><strong className="text-[#ff00cc]">Non-Refundable:</strong> Uang pendaftaran tidak dapat dikembalikan jika mengundurkan diri.</p>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: GRID */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-4 gap-4 p-4 border border-[#6849cf]/30 bg-[#6849cf]/5">
            {stands.map((stand) => (
              <button
                key={stand.id}
                disabled={stand.is_booked}
                onClick={() => handleOpenModal(stand)}
                className={`relative aspect-square flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                  stand.is_booked 
                    ? "bg-[#ff00cc] border-[#ff00cc] opacity-50 cursor-not-allowed" 
                    : "bg-[#000000] border-[#6849cf]/50 hover:border-[#c6ff33] hover:shadow-[0_0_15px_rgba(198,255,51,0.5)]"
                }`}
              >
                <span className={`text-4xl font-black ${stand.is_booked ? "text-black" : "text-[#c6ff33]"}`}>
                  {stand.stand_number}
                </span>
                {stand.is_booked && <Badge className="absolute bottom-2 bg-black text-white text-[8px] rounded-none border-none">SOLD</Badge>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL FORM TAHAP 1 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#000000] border-2 border-[#6849cf] text-white rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#c6ff33] uppercase">Booking Stand #{selectedStand?.stand_number}</DialogTitle>
            <DialogDescription className="text-gray-400">Isi data diri untuk melanjutkan pembayaran stand seharga Rp 1.800.000</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleHold} className="space-y-5 mt-4">
            <div className="space-y-2 flex flex-col">
              <label htmlFor="name" className="text-sm font-bold text-[#ff00cc] uppercase tracking-wider">Nama Pendaftar</label>
              <input 
                id="name" 
                type="text"
                required 
                className="w-full bg-black border border-[#6849cf] rounded-none p-2.5 text-white focus:outline-none focus:border-[#c6ff33] transition-colors" 
                value={formData.pendaftar_name} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, pendaftar_name: e.target.value})} 
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label htmlFor="email" className="text-sm font-bold text-[#ff00cc] uppercase tracking-wider">Email Aktif</label>
              <input 
                id="email" 
                type="email" 
                required 
                className="w-full bg-black border border-[#6849cf] rounded-none p-2.5 text-white focus:outline-none focus:border-[#c6ff33] transition-colors" 
                value={formData.pendaftar_email} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, pendaftar_email: e.target.value})} 
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label htmlFor="phone" className="text-sm font-bold text-[#ff00cc] uppercase tracking-wider">Nomor WhatsApp</label>
              <input 
                id="phone" 
                type="text"
                required 
                className="w-full bg-black border border-[#6849cf] rounded-none p-2.5 text-white focus:outline-none focus:border-[#c6ff33] transition-colors" 
                value={formData.phone} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            
            <div className="space-y-3 pt-2 border-t border-[#6849cf]/30">
              <label className="text-sm font-bold text-[#c6ff33] uppercase tracking-wider">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {['bni', 'bri', 'mandiri', 'gopay', 'qris'].map((m) => (
                  <Button 
                    key={m} 
                    type="button" 
                    variant="outline" 
                    className={`uppercase text-[10px] font-bold rounded-none border-[#6849cf] transition-all ${formData.payment_method === m ? "bg-[#c6ff33] text-black border-[#c6ff33]" : "bg-black text-gray-400 hover:text-white"}`}
                    onClick={() => setFormData({...formData, payment_method: m})}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button type="submit" disabled={isSubmitting || !formData.payment_method} className="w-full bg-[#6849cf] text-white font-black uppercase tracking-widest rounded-none hover:bg-[#ff00cc] transition-all h-12">
                {isSubmitting ? "MEMPROSES..." : "KUNCI STAND & BAYAR"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}