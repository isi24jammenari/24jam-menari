"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Toggle = {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: string;
};

const INITIAL_TOGGLES: Toggle[] = [
  {
    id: "formulir-lanjutan",
    label: "Aktifkan Formulir Lanjutan",
    description:
      "Jika diaktifkan, seluruh user yang membuka dashboard akan otomatis diwajibkan mengisi formulir lanjutan (Proposal, Surat Undangan, Form Peserta) sebelum bisa mengakses halaman lain.",
    icon: "📋",
    enabled: false,
    category: "Formulir",
  },
  {
    id: "edit-formulir",
    label: "Izinkan Edit Formulir Tahap 1",
    description:
      "Jika dimatikan, user tidak dapat mengubah isian formulir dasar mereka (nama kelompok, kota, judul tari, dll).",
    icon: "✎",
    enabled: true,
    category: "Formulir",
  },
  {
    id: "pendaftaran-baru",
    label: "Buka Pendaftaran Baru",
    description:
      "Jika dimatikan, halaman pemilihan venue dan slot tidak dapat diakses. Pendaftaran ditutup sepenuhnya.",
    icon: "🎫",
    enabled: true,
    category: "Sistem",
  },
  {
    id: "permintaan-pindah",
    label: "Terima Permintaan Pindah Slot",
    description:
      "Jika dimatikan, tombol 'Ingin pindah jam/venue' di dashboard user tidak akan muncul.",
    icon: "🔄",
    enabled: true,
    category: "Sistem",
  },
];

export default function ManagementTab() {
  const [toggles, setToggles] = useState<Toggle[]>(INITIAL_TOGGLES);
  const [lastChanged, setLastChanged] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
    setLastChanged(id);
    setTimeout(() => setLastChanged(null), 2000);
  };

  const categories = [...new Set(INITIAL_TOGGLES.map((t) => t.category))];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-tradisional text-2xl font-bold text-primary">
          Pengelolaan Sistem
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Aktifkan atau matikan fitur sistem secara langsung. Perubahan berlaku
          seketika.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-4">
            <h4 className="text-lg font-bold text-secondary">{category}</h4>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            {toggles
              .filter((t) => t.category === category)
              .map((toggle) => (
                <Card
                  key={toggle.id}
                  className={`batik-border border-0 transition-all duration-300 ${
                    lastChanged === toggle.id ? "shadow-lg scale-[1.01]" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <span className="text-3xl mt-0.5">{toggle.icon}</span>

                      {/* Label & deskripsi */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-lg font-semibold text-foreground">
                            {toggle.label}
                          </p>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                              toggle.enabled
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {toggle.enabled ? "● Aktif" : "○ Nonaktif"}
                          </span>
                          {lastChanged === toggle.id && (
                            <span className="text-xs text-accent font-medium animate-pulse">
                              ✓ Disimpan
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {toggle.description}
                        </p>
                      </div>

                      {/* Toggle switch */}
                      <button
                        onClick={() => handleToggle(toggle.id)}
                        className={`relative flex-shrink-0 w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          toggle.enabled ? "bg-primary" : "bg-muted"
                        }`}
                        role="switch"
                        aria-checked={toggle.enabled}
                      >
                        <span
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                            toggle.enabled ? "translate-x-9" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      <Separator />

      {/* Formulir Lanjutan — Preview */}
      {toggles.find((t) => t.id === "formulir-lanjutan")?.enabled && (
        <div className="space-y-4">
          <h4 className="text-tradisional text-xl font-bold text-primary">
            Preview Formulir Lanjutan
          </h4>
          <p className="text-sm text-muted-foreground">
            Ini adalah tampilan yang akan dilihat user saat formulir lanjutan
            diaktifkan.
          </p>

          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="p-6 space-y-5">
              {/* Proposal */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-foreground block">
                  File / Link Proposal
                </label>
                <div className="flex gap-3 flex-wrap">
                  <input
                    disabled
                    placeholder="Masukkan link atau upload file proposal"
                    className="flex-1 min-w-0 text-base px-4 py-3 rounded-xl border-2 border-input bg-background text-muted-foreground"
                  />
                  <button
                    disabled
                    className="px-4 py-3 rounded-xl border-2 border-accent text-accent font-semibold text-sm whitespace-nowrap opacity-70"
                  >
                    📄 Download Template
                  </button>
                </div>
              </div>

              <Separator />

              {/* Surat Undangan */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-foreground block">
                  Surat Undangan
                </label>
                <div className="bg-muted rounded-xl p-4 text-sm text-foreground leading-relaxed">
                  <p className="font-semibold mb-1">ℹ️ Tentang Surat Undangan</p>
                  <p className="text-muted-foreground">
                    Surat undangan resmi akan dikirimkan oleh panitia 24 Jam
                    Menari ke alamat email yang Anda daftarkan, setelah proses
                    verifikasi administrasi selesai. Harap pantau email Anda
                    secara berkala. Jika dalam 7 hari belum menerima surat,
                    silakan hubungi panitia.
                  </p>
                </div>
                <input
                  disabled
                  placeholder="Upload surat undangan yang telah Anda terima"
                  className="w-full text-base px-4 py-3 rounded-xl border-2 border-input bg-background text-muted-foreground"
                />
              </div>

              <Separator />

              {/* Form Peserta */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-foreground block">
                  Upload Form Peserta
                </label>
                <div className="flex gap-3 flex-wrap">
                  <input
                    disabled
                    placeholder="Upload form peserta yang sudah diisi"
                    className="flex-1 min-w-0 text-base px-4 py-3 rounded-xl border-2 border-input bg-background text-muted-foreground"
                  />
                  <button
                    disabled
                    className="px-4 py-3 rounded-xl border-2 border-accent text-accent font-semibold text-sm whitespace-nowrap opacity-70"
                  >
                    📄 Download Template
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
