"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/lib/store/bookingStore";

type FormData = {
  namaKelompok: string;
  kota: string;
  namaKontak: string;
  cp: string;
  judulTari: string;
  durasiKarya: string;
};

type FieldError = Partial<Record<keyof FormData, string>>;

const EMPTY_FORM: FormData = {
  namaKelompok: "",
  kota: "",
  namaKontak: "",
  cp: "",
  judulTari: "",
  durasiKarya: "",
};

const fields: {
  key: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  hint?: string;
}[] = [
  {
    key: "namaKelompok",
    label: "Nama Kelompok / Sanggar / Perorangan",
    placeholder: "Contoh: Sanggar Tari Sekar Jawi",
    hint: "Isi sesuai nama resmi yang akan tercantum di rundown acara.",
  },
  {
    key: "kota",
    label: "Kota",
    placeholder: "Contoh: Yogyakarta",
  },
  {
    key: "namaKontak",
    label: "Nama Narahubung",
    placeholder: "Contoh: Budi Santoso",
    hint: "Orang yang dapat dihubungi terkait penampilan ini.",
  },
  {
    key: "cp",
    label: "Nomor CP (WhatsApp/Telepon)",
    placeholder: "Contoh: 08123456789",
    type: "tel",
  },
  {
    key: "judulTari",
    label: "Judul Tari / Karya",
    placeholder: "Contoh: Tari Bedhaya Ketawang",
  },
  {
    key: "durasiKarya",
    label: "Durasi Karya",
    placeholder: "Contoh: 20 menit",
    hint: "Sesuaikan dengan durasi slot yang telah Anda pilih.",
  },
];

export default function FormPage() {
  const router = useRouter();
  const { paymentStatus, userName, selectedVenueName, selectedSlotTime } =
    useBookingStore();

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldError>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMode, setSaveMode] = useState<"save" | "skip">("save");

  // Guard
  useEffect(() => {
    if (paymentStatus !== "success") {
      router.replace("/");
    }
  }, [paymentStatus, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setIsSaved(false);
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.namaKelompok.trim())
      newErrors.namaKelompok = "Nama kelompok tidak boleh kosong.";
    if (!form.kota.trim()) newErrors.kota = "Kota tidak boleh kosong.";
    if (!form.namaKontak.trim())
      newErrors.namaKontak = "Nama narahubung tidak boleh kosong.";
    if (!form.cp.trim()) {
      newErrors.cp = "Nomor CP tidak boleh kosong.";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(form.cp)) {
      newErrors.cp = "Format nomor tidak valid.";
    }
    if (!form.judulTari.trim())
      newErrors.judulTari = "Judul tari tidak boleh kosong.";
    if (!form.durasiKarya.trim())
      newErrors.durasiKarya = "Durasi karya tidak boleh kosong.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);
    // Simulasi simpan (demo statis)
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setSaveMode("save");
    }, 1000);
  };

  const handleSkip = () => {
    setSaveMode("skip");
    router.push("/dashboard/user");
  };

  const handleToDashboard = () => {
    router.push("/dashboard/user");
  };

  if (paymentStatus !== "success") return null;

  return (
    <PageWrapper narrow>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">📋</div>
        <h1 className="text-tradisional text-4xl font-bold text-primary">
          Formulir Penampilan
        </h1>
        <p className="text-muted-foreground mt-2 text-lg leading-relaxed">
          Selamat datang,{" "}
          <span className="font-semibold text-foreground">{userName}</span>!
          <br />
          Isi data penampilan Anda di bawah ini.
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-12 bg-accent opacity-60" />
          <span className="text-accent">✦</span>
          <div className="h-px w-12 bg-accent opacity-60" />
        </div>
      </div>

      {/* Info slot */}
      <Card className="bg-primary/5 border-primary/20 border mb-6">
        <CardContent className="p-4 flex items-center gap-4">
          <span className="text-3xl">🎭</span>
          <div>
            <p className="font-bold text-foreground">{selectedVenueName}</p>
            <p className="text-muted-foreground text-sm">{selectedSlotTime}</p>
          </div>
          <span className="ml-auto text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
            Slot Terkunci ✓
          </span>
        </CardContent>
      </Card>

      {/* Info editable */}
      <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
        <span className="text-xl mt-0.5">💡</span>
        <p className="text-sm text-foreground leading-relaxed">
          Formulir ini <strong>dapat dilewati</strong> dan diisi kapan saja
          melalui dashboard Anda, selama fitur pengisian masih diaktifkan oleh
          panitia. Namun kami sarankan untuk mengisi sekarang.
        </p>
      </div>

      {/* Form */}
      <Card className="batik-border border-0">
        <CardContent className="p-6">
          <h2 className="text-tradisional text-xl font-bold text-primary mb-1">
            Data Penampilan
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Semua kolom bertanda{" "}
            <span className="text-destructive font-bold">*</span> wajib diisi
            sebelum menyimpan.
          </p>
          <Separator className="mb-6" />

          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-base font-semibold text-foreground block">
                  {field.label}{" "}
                  <span className="text-destructive">*</span>
                </label>
                {field.hint && (
                  <p className="text-sm text-muted-foreground -mt-1">
                    {field.hint}
                  </p>
                )}
                <input
                  type={field.type ?? "text"}
                  name={field.key}
                  value={form[field.key]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full text-lg px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors[field.key]
                      ? "border-destructive"
                      : "border-input"
                  }`}
                />
                {errors[field.key] && (
                  <p className="text-sm text-destructive">
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Status simpan */}
          {isSaved && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4">
              <span className="text-xl">✅</span>
              <p className="text-sm font-medium text-primary">
                Formulir berhasil disimpan! Anda dapat mengubahnya kapan saja
                dari dashboard.
              </p>
            </div>
          )}

          {/* Tombol aksi */}
          <div className="flex flex-col gap-3">
            {!isSaved ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full text-xl py-7 font-semibold"
                  size="lg"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Formulir →"
                  )}
                </Button>
                <button
                  onClick={handleSkip}
                  className="text-center text-muted-foreground hover:text-primary transition-colors text-base underline underline-offset-4 py-2"
                >
                  Lewati dulu, isi nanti di dashboard
                </button>
              </>
            ) : (
              <Button
                onClick={handleToDashboard}
                className="w-full text-xl py-7 font-semibold"
                size="lg"
              >
                Masuk ke Dashboard →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
