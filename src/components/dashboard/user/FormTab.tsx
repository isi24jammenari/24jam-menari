"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";

// ✅ 1. Samakan key dengan database backend
type FormData = {
  group_name: string;
  city: string;
  contact_name: string;
  whatsapp_number: string;
  dance_title: string;
};

type FieldError = Partial<Record<keyof FormData, string>>;

const ADMIN_EDIT_ENABLED = true;

const fields: {
  key: keyof FormData;
  label: string;
  placeholder: string;
  hint?: string;
  type?: string;
}[] = [
  { key: "group_name", label: "Nama Kelompok / Sanggar / Perorangan", placeholder: "Sanggar Tari Sekar Jawi" },
  { key: "city", label: "Kota", placeholder: "Yogyakarta" },
  { key: "contact_name", label: "Nama Narahubung", placeholder: "Budi Santoso" },
  { key: "whatsapp_number", label: "Nomor CP (WhatsApp/Telepon)", placeholder: "08123456789", type: "tel" },
  { key: "dance_title", label: "Judul Tari / Karya", placeholder: "Tari Bedhaya Ketawang" },
];

export default function FormTab() {
  const [form, setForm] = useState<FormData>({
    group_name: "",
    city: "",
    contact_name: "",
    whatsapp_number: "",
    dance_title: "",
  });
  
  const [errors, setErrors] = useState<FieldError>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk menyimpan ID Booking dan Status dari Backend
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"empty" | "draft" | "completed">("empty");

  // ✅ 2. Tarik data eksisting dari API saat komponen dimuat
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const res = await api.get('/user/schedule');
        const scheduleData = res.data.data[0]; // Asumsi user memiliki 1 jadwal
        
        if (scheduleData) {
          setBookingId(scheduleData.id);
          
          if (scheduleData.performance) {
            setForm({
              group_name: scheduleData.performance.group_name || "",
              city: scheduleData.performance.city || "",
              contact_name: scheduleData.performance.contact_name || "",
              whatsapp_number: scheduleData.performance.whatsapp_number || "",
              dance_title: scheduleData.performance.dance_title || "",
            });
            setFormStatus(scheduleData.performance.status);
            
            // Jika status sudah final, otomatis matikan mode edit
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

  // Hanya izinkan edit jika admin buka akses DAN status belum final
  const canEdit = ADMIN_EDIT_ENABLED && formStatus !== "completed";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ✅ 3. Validasi ketat (Hanya dipanggil saat Submit Final)
  const validateStrict = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.group_name.trim()) newErrors.group_name = "Tidak boleh kosong.";
    if (!form.city.trim()) newErrors.city = "Tidak boleh kosong.";
    if (!form.contact_name.trim()) newErrors.contact_name = "Tidak boleh kosong.";
    if (!form.whatsapp_number.trim()) newErrors.whatsapp_number = "Tidak boleh kosong.";
    if (!form.dance_title.trim()) newErrors.dance_title = "Tidak boleh kosong.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ 4. Fungsi handle save mendukung action dinamis
  const handleSave = async (action: "draft" | "submit") => {
    if (!bookingId) return alert("Error: ID Booking tidak ditemukan.");
    
    // Jika submit final, lakukan validasi ketat
    if (action === "submit" && !validateStrict()) {
      alert("Harap lengkapi semua data sebelum Submit Final.");
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
      
      alert(action === "submit" ? "Formulir final berhasil disubmit!" : "Draft berhasil disimpan!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse py-8">Memuat data formulir...</div>;
  }

  if (!bookingId) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive">
        Data jadwal tidak ditemukan. Pastikan Anda telah mengunci jadwal dan menyelesaikan pembayaran.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">
            Formulir Karya Pementasan
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formStatus === "completed" 
              ? "Data karya Anda telah disubmit final dan siap diproses panitia."
              : canEdit
              ? "Silakan lengkapi data karya Anda. Anda bisa menyimpannya sementara sebagai Draft."
              : "Pengisian formulir telah ditutup oleh panitia."}
          </p>
        </div>
        
        {/* Badge status isian dinamis */}
        <span
          className={`text-sm px-4 py-1.5 rounded-full font-semibold ${
            formStatus === "empty"
              ? "bg-destructive/10 text-destructive"
              : formStatus === "completed"
              ? "bg-primary/10 text-primary"
              : "bg-accent/10 text-accent"
          }`}
        >
          {formStatus === "empty" ? "⚠ Belum diisi" : formStatus === "completed" ? "✓ Lengkap (Final)" : "✎ Status: Draft"}
        </span>
      </div>

      {/* Peringatan jika masih empty/draft */}
      {formStatus !== "completed" && !isEditing && (
        <div className="flex items-start gap-3 bg-accent/10 border border-accent/20 rounded-xl p-4">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-accent">Data Belum Final</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Anda tidak bisa mengunduh Dokumen dan Sertifikat sebelum melakukan <strong>Submit Final</strong> pada formulir ini.
            </p>
          </div>
        </div>
      )}

      {/* Isian / Tampilan */}
      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-base font-semibold text-foreground block">
              {field.label}
            </label>
            {field.hint && (
              <p className="text-sm text-muted-foreground">{field.hint}</p>
            )}

            {isEditing && canEdit ? (
              <>
                <input
                  type={field.type ?? "text"}
                  name={field.key}
                  value={form[field.key]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors[field.key] ? "border-destructive" : "border-input"
                  }`}
                />
                {errors[field.key] && (
                  <p className="text-sm text-destructive">{errors[field.key]}</p>
                )}
              </>
            ) : (
              <div className="px-4 py-3 rounded-xl bg-muted border border-border text-lg">
                {form[field.key] ? (
                  <span className="text-foreground">{form[field.key]}</span>
                ) : (
                  <span className="text-muted-foreground italic">Belum diisi</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Area Tombol Aksi */}
      {canEdit && (
        <>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full text-lg py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              size="lg"
            >
              ✎ {formStatus === "empty" ? "Isi Formulir" : "Lanjutkan Edit Formulir"}
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 text-lg py-6"
                size="lg"
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="flex-1 text-lg py-6 bg-accent/20 text-accent hover:bg-accent/30"
                size="lg"
              >
                {isSaving ? "⏳ Menyimpan..." : "💾 Simpan Draft"}
              </Button>
              <Button
                onClick={() => handleSave("submit")}
                disabled={isSaving}
                className="flex-1 text-lg py-6"
                size="lg"
              >
                {isSaving ? "⏳ Memproses..." : "✅ Submit Final"}
              </Button>
            </div>
          )}
        </>
      )}

      {formStatus === "completed" && !isEditing && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-xl">🔒</span>
          <p className="text-sm font-medium text-primary">
            Data dikunci karena sudah disubmit final. Hubungi panitia jika ada perubahan mendesak.
          </p>
        </div>
      )}
    </div>
  );
}