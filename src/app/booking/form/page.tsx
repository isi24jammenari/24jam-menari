"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingStore } from "@/lib/store/bookingStore";

export default function BookingFormPage() {
  const router = useRouter();
  const { selectedVenueName, selectedSlotTime, setRegistrant } = useBookingStore();

  const [formData, setFormData] = useState({
    nama: "",
    kota: "",
    namaKontak: "",
    cp: "",
    judulTari: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = 
    formData.nama.trim() !== "" && 
    formData.kota.trim() !== "" && 
    formData.namaKontak.trim() !== "" && 
    formData.cp.trim() !== "" && 
    formData.judulTari.trim() !== "";

  const handleSave = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    // TODO: [BACKEND] Integrasikan API Endpoint untuk menyimpan form pementasan di sini
    // try {
    //   await fetch('/api/booking', { method: 'POST', body: JSON.stringify(formData) });
    // } catch (error) { console.error(error); return; }

    // Simulasi delay jaringan (hapus setTimeout ini saat backend sudah siap)
    setTimeout(() => {
      setRegistrant({
        ...formData,
        formStatus: "lengkap",
      });
      setIsSubmitting(false);

      // FIX ARSITEKTUR: Setelah form lengkap, arahkan ke Dashboard User, bukan kembali ke Register
      router.push("/dashboard/user");
    }, 1000);
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <SectionTitle
          title="Data Penampilan"
          subtitle="Mohon lengkapi data penampilan Anda untuk keperluan rundown dan administrasi."
          className="mb-8"
        />

        <Card className="bg-primary/5 border-primary/20 mb-8">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Slot Terpilih</p>
              <p className="text-lg font-bold text-primary">{selectedVenueName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Waktu</p>
              <p className="text-lg font-bold text-foreground">{selectedSlotTime}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wide">
              Nama Kelompok / Sanggar <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Masukkan nama pendaftar"
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wide">
              Asal Kota <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.kota}
              onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
              placeholder="Contoh: Surakarta"
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wide">
              Nama Narahubung <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.namaKontak}
              onChange={(e) => setFormData({ ...formData, namaKontak: e.target.value })}
              placeholder="Nama lengkap penanggung jawab"
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wide">
              Nomor WhatsApp <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.cp}
              onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
              placeholder="0812xxxx"
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wide">
              Judul Tarian <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.judulTari}
              onChange={(e) => setFormData({ ...formData, judulTari: e.target.value })}
              placeholder="Masukkan judul karya"
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isSubmitting}
              className="w-full text-lg py-7 font-bold shadow-lg shadow-primary/20"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-lg">⏳</span>
                  Menyimpan Data...
                </span>
              ) : isFormValid ? (
                "Selesaikan Pendaftaran →"
              ) : (
                "Harap Lengkapi Seluruh Data"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4 italic">
              * Seluruh data wajib diisi untuk melanjutkan pendaftaran.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}