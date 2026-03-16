"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type FormData = {
  namaKelompok: string;
  kota: string;
  namaKontak: string;
  cp: string;
  judulTari: string;
  durasiKarya: string;
};

type FieldError = Partial<Record<keyof FormData, string>>;

// Simulasi: apakah admin mengizinkan edit
const ADMIN_EDIT_ENABLED = true;

const fields: {
  key: keyof FormData;
  label: string;
  placeholder: string;
  hint?: string;
  type?: string;
}[] = [
  { key: "namaKelompok", label: "Nama Kelompok / Sanggar / Perorangan", placeholder: "Sanggar Tari Sekar Jawi" },
  { key: "kota", label: "Kota", placeholder: "Yogyakarta" },
  { key: "namaKontak", label: "Nama Narahubung", placeholder: "Budi Santoso" },
  { key: "cp", label: "Nomor CP (WhatsApp/Telepon)", placeholder: "08123456789", type: "tel" },
  { key: "judulTari", label: "Judul Tari / Karya", placeholder: "Tari Bedhaya Ketawang" },
  {
    key: "durasiKarya",
    label: "Durasi Karya",
    placeholder: "20 menit",
    hint: "Sesuaikan dengan durasi slot yang dipilih.",
  },
];

export default function FormTab() {
  const [form, setForm] = useState<FormData>({
    namaKelompok: "",
    kota: "",
    namaKontak: "",
    cp: "",
    judulTari: "",
    durasiKarya: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEmpty = Object.values(form).every((v) => v.trim() === "");
  const canEdit = ADMIN_EDIT_ENABLED;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setIsSaved(false);
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.namaKelompok.trim()) newErrors.namaKelompok = "Tidak boleh kosong.";
    if (!form.kota.trim()) newErrors.kota = "Tidak boleh kosong.";
    if (!form.namaKontak.trim()) newErrors.namaKontak = "Tidak boleh kosong.";
    if (!form.cp.trim()) newErrors.cp = "Tidak boleh kosong.";
    if (!form.judulTari.trim()) newErrors.judulTari = "Tidak boleh kosong.";
    if (!form.durasiKarya.trim()) newErrors.durasiKarya = "Tidak boleh kosong.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setIsEditing(false);
    }, 900);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">
            Formulir Penampilan
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {canEdit
              ? "Pengisian formulir masih dibuka oleh panitia."
              : "Pengisian formulir telah ditutup oleh panitia."}
          </p>
        </div>
        {/* Badge status isian */}
        <span
          className={`text-sm px-4 py-1.5 rounded-full font-semibold ${
            isEmpty
              ? "bg-destructive/10 text-destructive"
              : isSaved
              ? "bg-primary/10 text-primary"
              : "bg-accent/10 text-accent"
          }`}
        >
          {isEmpty ? "⚠ Belum diisi" : isSaved ? "✓ Tersimpan" : "✎ Ada perubahan"}
        </span>
      </div>

      {/* Peringatan jika kosong */}
      {isEmpty && !isEditing && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-destructive">Formulir belum diisi</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Silakan lengkapi data penampilan Anda sebelum batas waktu yang
              ditentukan panitia.
            </p>
          </div>
        </div>
      )}

      {/* Edit tidak tersedia */}
      {!canEdit && (
        <div className="flex items-start gap-3 bg-muted border border-border rounded-xl p-4">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-foreground">
            Panitia telah menutup fitur pengisian formulir. Data yang
            tersimpan tidak dapat diubah saat ini.
          </p>
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

      {/* Aksi */}
      {canEdit && (
        <>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full text-lg py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              size="lg"
            >
              ✎ Edit Formulir
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 text-lg py-6"
                size="lg"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 text-lg py-6"
                size="lg"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Menyimpan...
                  </span>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {isSaved && !isEditing && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-xl">✅</span>
          <p className="text-sm font-medium text-primary">
            Formulir berhasil disimpan.
          </p>
        </div>
      )}
    </div>
  );
}
