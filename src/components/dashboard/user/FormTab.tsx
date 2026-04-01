"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";

type Work = { title: string; duration: number };

type FormData = {
  group_name: string;
  contact_person: string;
  cp_name: string;
  category: string;
  supporters: string;
  works: Work[];
  synopsis: string;
  arrival_departure: string;
  music_type: string;
  instruments: string[];
  property_setting: string;
  certificate_names: string[];
};

export default function FormTab() {
  const [form, setForm] = useState<FormData>({
    group_name: "", contact_person: "", cp_name: "", category: "", supporters: "",
    works: [{ title: "", duration: 0 }],
    synopsis: "", arrival_departure: "", music_type: "",
    instruments: [""], property_setting: "", certificate_names: [""],
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"empty" | "draft" | "completed">("empty");

  // ATUR MAKSIMAL DURASI DI SINI (Contoh: 30 Menit)
  const MAX_DURATION = 30; 
  
  // Kalkulasi Total Durasi Otomatis
  const totalDuration = form.works.reduce((total, work) => total + (Number(work.duration) || 0), 0);
  const isDurationExceeded = totalDuration > MAX_DURATION;

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
              synopsis: scheduleData.performance.synopsis || "",
              arrival_departure: scheduleData.performance.arrival_departure || "",
              music_type: scheduleData.performance.music_type || "",
              property_setting: scheduleData.performance.property_setting || "",
              // Array Fallback
              works: scheduleData.performance.works?.length ? scheduleData.performance.works : [{ title: "", duration: 0 }],
              instruments: scheduleData.performance.instruments?.length ? scheduleData.performance.instruments : [""],
              certificate_names: scheduleData.performance.certificate_names?.length ? scheduleData.performance.certificate_names : [""],
            });
            setFormStatus(scheduleData.performance.status);
            if (scheduleData.performance.status === 'completed') setIsEditing(false);
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

  // Helpers untuk form text biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Helpers untuk Array: Works (Judul & Durasi)
  const updateWork = (idx: number, field: "title" | "duration", val: string | number) => {
    const newWorks = [...form.works];
    newWorks[idx] = { ...newWorks[idx], [field]: val };
    setForm({ ...form, works: newWorks });
  };
  const addWork = () => setForm({ ...form, works: [...form.works, { title: "", duration: 0 }] });
  const removeWork = (idx: number) => setForm({ ...form, works: form.works.filter((_, i) => i !== idx) });

  // Helpers untuk Array: String (Alat Musik & Sertifikat)
  const updateArray = (field: "instruments" | "certificate_names", idx: number, val: string) => {
    const newArr = [...form[field]];
    newArr[idx] = val;
    setForm({ ...form, [field]: newArr });
  };
  const addArray = (field: "instruments" | "certificate_names") => setForm({ ...form, [field]: [...form[field], ""] });
  const removeArray = (field: "instruments" | "certificate_names", idx: number) => setForm({ ...form, [field]: form[field].filter((_, i) => i !== idx) });

  const handleSave = async (action: "draft" | "submit") => {
    if (!bookingId) return alert("Error: ID Booking tidak ditemukan.");
    
    // Cek Gatekeeper Durasi (Hanya cegah submit jika kelebihan)
    if (action === "submit" && isDurationExceeded) {
      alert(`⚠️ Gagal! Total durasi karya Anda (${totalDuration} Menit) melebihi batas maksimal yang diperbolehkan (${MAX_DURATION} Menit).`);
      return;
    }

    // Filter array kosong sebelum dikirim
    const payload = {
      ...form,
      booking_id: bookingId,
      action: action,
      works: form.works.filter(w => w.title.trim() !== "" && w.duration > 0),
      instruments: form.music_type === 'Live' ? form.instruments.filter(i => i.trim() !== "") : [],
      certificate_names: form.certificate_names.filter(n => n.trim() !== ""),
    };

    if (action === "submit") {
      if (!payload.group_name || !payload.contact_person || !payload.music_type || payload.works.length === 0 || payload.certificate_names.length === 0) {
         return alert("⚠️ Harap isi semua field wajib (termasuk minimal 1 Judul Karya dan 1 Nama Sertifikat).");
      }
    }

    setIsSaving(true);
    try {
      await api.post('/user/performance', payload);
      setFormStatus(action === "submit" ? "completed" : "draft");
      setIsEditing(false);
      alert(action === "submit" ? "✅ Formulir final berhasil disubmit!" : "💾 Draft berhasil disimpan!");
      if(action === "submit") window.location.reload(); 
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="animate-pulse py-8">Memuat formulir...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">Formulir Pementasan</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Lengkapi data untuk keperluan sertifikat & rundown.</p>
        </div>
        <span className={`text-sm px-4 py-1.5 rounded-full font-semibold ${formStatus === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
          {formStatus === "completed" ? "✓ Lengkap (Final)" : "✎ Status: Draft"}
        </span>
      </div>

      <div className="space-y-5 bg-card border rounded-2xl p-6">
        
        {/* === FIELD BIASA === */}
        <div className="space-y-4">
           {/* (1) Group Name */}
           <div><label className="font-semibold block mb-1">1. Nama Peserta / Grup *</label>
           {isEditing ? <input type="text" name="group_name" value={form.group_name} onChange={handleChange} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-muted rounded-xl">{form.group_name || '-'}</div>}</div>
           
           {/* (2 & 3) CP & Nama CP */}
           <div className="grid grid-cols-2 gap-4">
             <div><label className="font-semibold block mb-1">2. No WhatsApp CP *</label>
             {isEditing ? <input type="tel" name="contact_person" value={form.contact_person} onChange={handleChange} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-muted rounded-xl">{form.contact_person || '-'}</div>}</div>
             <div><label className="font-semibold block mb-1">3. Nama Narahubung *</label>
             {isEditing ? <input type="text" name="cp_name" value={form.cp_name} onChange={handleChange} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-muted rounded-xl">{form.cp_name || '-'}</div>}</div>
           </div>
           
           {/* (4) Kategori */}
           <div><label className="font-semibold block mb-1">4. Kategori *</label>
           {isEditing ? <select name="category" value={form.category} onChange={handleChange} className="w-full p-3 border-2 rounded-xl">
             <option value="">-- Pilih --</option><option>Anak-anak</option><option>Remaja</option><option>Dewasa</option><option>Disabilitas</option>
           </select> : <div className="p-3 bg-muted rounded-xl">{form.category || '-'}</div>}</div>
        </div>

        <Separator className="my-6" />

        {/* === DYNAMIC ARRAY: JUDUL & DURASI (WORKS) === */}
        <div className="space-y-3">
          <label className="font-semibold text-lg text-primary block">5. Daftar Karya & Durasi *</label>
          <p className="text-sm text-muted-foreground">Anda bisa mendaftarkan lebih dari 1 karya selama total durasi tidak melebihi batas.</p>
          
          <div className="space-y-3">
            {form.works.map((work, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <div className="flex-1">
                  {isEditing ? <input type="text" placeholder="Judul Tari..." value={work.title} onChange={(e) => updateWork(idx, "title", e.target.value)} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-muted border rounded-xl flex-1">{work.title || '-'}</div>}
                </div>
                <div className="w-32">
                  {isEditing ? <input type="number" min="1" placeholder="Menit" value={work.duration || ''} onChange={(e) => updateWork(idx, "duration", e.target.value)} className="w-full p-3 border-2 rounded-xl text-center" /> : <div className="p-3 bg-muted border rounded-xl text-center">{work.duration} mnt</div>}
                </div>
                {isEditing && form.works.length > 1 && (
                  <Button variant="destructive" size="icon" onClick={() => removeWork(idx)}>✖</Button>
                )}
              </div>
            ))}
          </div>
          {isEditing && <Button variant="outline" size="sm" onClick={addWork} className="mt-2 text-primary border-primary">+ Tambah Karya Lainnya</Button>}

          {/* GATEKEEPER UI (Indikator Durasi) */}
          <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${isDurationExceeded ? 'bg-destructive/10 border-destructive' : 'bg-green-500/10 border-green-500/50'}`}>
             <span className="font-bold text-foreground">Total Durasi Berjalan:</span>
             <span className={`text-xl font-bold ${isDurationExceeded ? 'text-destructive' : 'text-green-600'}`}>{totalDuration} / {MAX_DURATION} Menit</span>
          </div>
          {isDurationExceeded && (
             <p className="text-sm text-destructive font-bold animate-pulse">⚠️ Peringatan: Total durasi melebihi batas {MAX_DURATION} menit. Hapus karya atau kurangi durasi agar bisa melakukan Submit Final.</p>
          )}
        </div>

        <Separator className="my-6" />

        {/* === SINOPSIS & KEDATANGAN === */}
        <div className="space-y-4">
           <div><label className="font-semibold block mb-1">6. Sinopsis Karya *</label>
           {isEditing ? <textarea name="synopsis" value={form.synopsis} onChange={handleChange} rows={3} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-muted rounded-xl whitespace-pre-wrap">{form.synopsis || '-'}</div>}</div>
           
           <div><label className="font-semibold block mb-1">7. Rencana Kedatangan & Kepulangan *</label>
           {isEditing ? <input type="text" name="arrival_departure" value={form.arrival_departure} onChange={handleChange} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-muted rounded-xl">{form.arrival_departure || '-'}</div>}</div>
        </div>

        <Separator className="my-6" />

        {/* === MUSIK & INSTRUMEN (DYNAMIC LIST) === */}
        <div className="space-y-4">
          <div><label className="font-semibold block mb-1">8. Keterangan Musik *</label>
           {isEditing ? <select name="music_type" value={form.music_type} onChange={handleChange} className="w-full p-3 border-2 rounded-xl">
             <option value="">-- Pilih --</option><option>Live</option><option>Playback</option>
           </select> : <div className="p-3 bg-muted rounded-xl">{form.music_type || '-'}</div>}</div>

          {form.music_type === 'Live' && (
            <div className="space-y-3 p-4 bg-accent/5 border border-accent/20 rounded-xl">
              <label className="font-semibold block text-accent">9. Daftar Alat Musik (Khusus Live)</label>
              {form.instruments.map((inst, idx) => (
                <div key={idx} className="flex gap-2">
                  {isEditing ? <input type="text" placeholder="Nama alat musik..." value={inst} onChange={(e) => updateArray("instruments", idx, e.target.value)} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-background border rounded-xl flex-1">{inst || '-'}</div>}
                  {isEditing && form.instruments.length > 1 && <Button variant="destructive" size="icon" onClick={() => removeArray("instruments", idx)}>✖</Button>}
                </div>
              ))}
              {isEditing && <Button variant="outline" size="sm" onClick={() => addArray("instruments")} className="text-accent border-accent mt-2">+ Tambah Alat Musik</Button>}
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* === SERTIFIKAT (DYNAMIC LIST) === */}
        <div className="space-y-3">
          <label className="font-semibold text-lg text-primary block">10. Daftar Nama untuk Sertifikat *</label>
          <p className="text-sm text-muted-foreground">Sistem akan mencetak sertifikat sebanyak nama yang Anda masukkan di bawah ini.</p>
          {form.certificate_names.map((name, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="p-3 bg-muted/50 border rounded-xl font-bold text-muted-foreground w-12 text-center">{idx + 1}</div>
              {isEditing ? <input type="text" placeholder="Nama Lengkap & Gelar (Budi Santoso, S.Sn)" value={name} onChange={(e) => updateArray("certificate_names", idx, e.target.value)} className="w-full p-3 border-2 rounded-xl" /> : <div className="p-3 bg-muted border rounded-xl flex-1">{name || '-'}</div>}
              {isEditing && form.certificate_names.length > 1 && <Button variant="destructive" size="icon" onClick={() => removeArray("certificate_names", idx)}>✖</Button>}
            </div>
          ))}
          {isEditing && <Button variant="outline" size="sm" onClick={() => addArray("certificate_names")} className="text-primary border-primary mt-2">+ Tambah Penerima Sertifikat</Button>}
        </div>

      </div>

      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="w-full py-6 text-lg" size="lg">✎ Edit / Lengkapi Formulir</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 py-6 text-lg">Batal</Button>
              <Button variant="secondary" onClick={() => handleSave("draft")} disabled={isSaving} className="flex-1 py-6 text-lg bg-accent/20 text-accent hover:bg-accent/30">💾 Simpan Draft</Button>
              {/* TOMBOL SUBMIT FINAL DIBLOKIR JIKA DURASI OVERLIMIT */}
              <Button onClick={() => handleSave("submit")} disabled={isSaving || isDurationExceeded} className={`flex-1 py-6 text-lg ${isDurationExceeded ? 'opacity-50 cursor-not-allowed' : ''}`}>✅ Submit Final</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}