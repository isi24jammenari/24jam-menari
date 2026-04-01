"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";

// Sesuai dengan Migration 14 Kolom di Backend
type FormData = {
  group_name: string;
  contact_person: string;
  cp_name: string;
  category: string;
  supporters: string;
  dance_title: string;
  duration: string;
  synopsis: string;
  arrival_departure: string;
  music_type: string;
  instruments: string;
  property_setting: string;
  certificate_names: string;
};

type FieldError = Partial<Record<keyof FormData, string>>;

export default function FormTab() {
  const [form, setForm] = useState<FormData>({
    group_name: "",
    contact_person: "",
    cp_name: "",
    category: "",
    supporters: "",
    dance_title: "",
    duration: "",
    synopsis: "",
    arrival_departure: "",
    music_type: "",
    instruments: "",
    property_setting: "",
    certificate_names: "",
  });
  
  const [errors, setErrors] = useState<FieldError>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"empty" | "draft" | "completed">("empty");

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const res = await api.get('/user/schedule');
        const scheduleData = res.data.data[0]; 
        
        if (scheduleData) {
          setBookingId(scheduleData.id);
          if (scheduleData.performance) {
            setForm({
              group_name: scheduleData.performance.group_name || "",
              contact_person: scheduleData.performance.contact_person || "",
              cp_name: scheduleData.performance.cp_name || "",
              category: scheduleData.performance.category || "",
              supporters: scheduleData.performance.supporters || "",
              dance_title: scheduleData.performance.dance_title || "",
              duration: scheduleData.performance.duration || "",
              synopsis: scheduleData.performance.synopsis || "",
              arrival_departure: scheduleData.performance.arrival_departure || "",
              music_type: scheduleData.performance.music_type || "",
              instruments: scheduleData.performance.instruments || "",
              property_setting: scheduleData.performance.property_setting || "",
              certificate_names: scheduleData.performance.certificate_names || "",
            });
            setFormStatus(scheduleData.performance.status);
            
            if (scheduleData.performance.status === 'completed') {
              setIsEditing(false);
            }
          }
        }
      } catch (error) {
        console.error("Gagal menarik data jadwal:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  const canEdit = formStatus !== "completed";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStrict = (): boolean => {
    const newErrors: FieldError = {};
    const requiredFields: (keyof FormData)[] = [
      "group_name", "contact_person", "cp_name", "category", "supporters", 
      "dance_title", "duration", "synopsis", "arrival_departure", "music_type", "certificate_names"
    ];

    requiredFields.forEach(field => {
      if (!form[field] || form[field].trim() === "") {
        newErrors[field] = "Field ini wajib diisi untuk Submit Final.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (action: "draft" | "submit") => {
    if (!bookingId) return alert("Error: ID Booking tidak ditemukan.");
    
    if (action === "submit" && !validateStrict()) {
      alert("⚠️ Harap lengkapi semua field yang diwajibkan sebelum Submit Final!");
      return;
    }

    setIsSaving(true);
    try {
      await api.post('/user/performance', {
        booking_id: bookingId,
        action: action,
        ...form
      });
      
      setFormStatus(action === "submit" ? "completed" : "draft");
      setIsEditing(false);
      alert(action === "submit" ? "✅ Formulir final berhasil disubmit!" : "💾 Draft berhasil disimpan!");
      
      if(action === "submit") window.location.reload(); // Refresh untuk buka Gatekeeper
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="animate-pulse py-8">Memuat formulir...</div>;
  if (!bookingId) return <div className="text-destructive">Data jadwal tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3">
        <span className="text-xl">⏰</span>
        <div>
          <p className="font-bold text-destructive">Batas Akhir Pengisian Formulir</p>
          <p className="text-sm text-destructive mt-0.5">Semua data pementasan (Submit Final) WAJIB diselesaikan paling lambat <strong>10 April 2026 Pukul 12:00 WIB</strong>.</p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">Formulir Kelengkapan Karya</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Isi data sesuai dengan format PDF 24 Jam Menari.</p>
        </div>
        <span className={`text-sm px-4 py-1.5 rounded-full font-semibold ${formStatus === "empty" ? "bg-destructive/10 text-destructive" : formStatus === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
          {formStatus === "empty" ? "⚠ Belum diisi" : formStatus === "completed" ? "✓ Lengkap (Final)" : "✎ Status: Draft"}
        </span>
      </div>

      <div className="space-y-5 bg-card border rounded-2xl p-6">
        {/* Helper render untuk input */}
        {([
          { key: "group_name", label: "1. Nama Peserta / Grup", type: "text" },
          { key: "contact_person", label: "2. Contact Person (Nomor WhatsApp / Telepon)", type: "tel", hint: "Contoh: 08123456789" },
          { key: "cp_name", label: "3. Nama CP (Narahubung)", type: "text" },
          { key: "category", label: "4. Kategori Peserta", type: "select", options: ["Anak-anak", "Remaja", "Dewasa", "Disabilitas"] },
          { key: "supporters", label: "5. Pendukung Karya", type: "textarea", hint: "Sebutkan jumlah dan rincian penari/pemusik." },
          { key: "dance_title", label: "6. Judul Karya", type: "text" },
          { key: "duration", label: "7. Durasi Karya", type: "text" },
          { key: "synopsis", label: "8. Sinopsis Karya", type: "textarea" },
          { key: "arrival_departure", label: "9. Rencana Kedatangan & Kepulangan", type: "text" },
          { key: "music_type", label: "10. Keterangan Musik", type: "select", options: ["Live", "Playback"] },
          { key: "instruments", label: "11. Alat Musik yang Dipakai (Jika Live)", type: "textarea", hint: "Kosongkan jika Playback" },
          { key: "property_setting", label: "12. Keterangan Property / Setting Panggung", type: "textarea", hint: "Jelaskan singkat jika membawa/menggunakan properti khusus." },
          { key: "certificate_names", label: "13. Daftar Nama untuk Sertifikat", type: "textarea", hint: "Tuliskan nama lengkap + gelar (jika ada) dan jabatan/casting." },
        ] as { key: keyof FormData; label: string; type: "text" | "textarea" | "select"; hint?: string; options?: string[] }[]).map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-base font-semibold text-foreground block">
              {field.label} {field.key !== "instruments" && field.key !== "property_setting" && <span className="text-destructive">*</span>}
            </label>
            {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}

            {isEditing && canEdit ? (
              <>
                {field.type === "textarea" ? (
                  <textarea name={field.key} value={form[field.key as keyof FormData]} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary" />
                ) : field.type === "select" ? (
                  <select name={field.key} value={form[field.key as keyof FormData]} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary">
                    <option value="">-- Pilih --</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input type="text" name={field.key} value={form[field.key as keyof FormData]} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary" />
                )}
                {errors[field.key as keyof FormData] && <p className="text-sm text-destructive">{errors[field.key as keyof FormData]}</p>}
              </>
            ) : (
              <div className="px-4 py-3 rounded-xl bg-muted border border-border text-base whitespace-pre-wrap">
                {form[field.key as keyof FormData] ? <span className="text-foreground">{form[field.key as keyof FormData]}</span> : <span className="text-muted-foreground italic">Belum diisi</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="w-full py-6 text-lg" size="lg">✎ Edit / Lengkapi Formulir</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 py-6 text-lg">Batal</Button>
              <Button variant="secondary" onClick={() => handleSave("draft")} disabled={isSaving} className="flex-1 py-6 text-lg bg-accent/20 text-accent hover:bg-accent/30">💾 Simpan Draft</Button>
              <Button onClick={() => handleSave("submit")} disabled={isSaving} className="flex-1 py-6 text-lg">✅ Submit Final</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}