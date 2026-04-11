"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ManagementTab() {
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [certRes, formRes] = await Promise.all([
          api.get('/admin/settings/certificate-status'),
          api.get('/admin/settings/form-edit-status')
        ]);
        setIsCertOpen(certRes.data.data.is_open);
        setIsFormOpen(formRes.data.data.is_open);
      } catch (error) {
        console.error("Gagal mengambil pengaturan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const toggleCertAccess = async () => {
    setIsSaving(true);
    try {
      const newState = !isCertOpen;
      await api.post('/admin/settings/toggle-certificate', { is_open: newState });
      setIsCertOpen(newState);
      alert(`Akses E-Sertifikat berhasil ${newState ? 'DIBUKA' : 'DITUTUP'}.`);
    } catch (error) {
      alert("Gagal mengubah status sertifikat.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFormAccess = async () => {
    setIsSaving(true);
    try {
      const newState = !isFormOpen;
      await api.post('/admin/settings/toggle-form-edit', { is_open: newState });
      setIsFormOpen(newState);
      alert(`Akses Edit Formulir Bebas berhasil ${newState ? 'DIBUKA' : 'DITUTUP (Hanya via Revisi)'}.`);
    } catch (error) {
      alert("Gagal mengubah status formulir.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center py-10 animate-pulse text-muted-foreground">Memuat pengaturan...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-tradisional text-2xl font-bold text-primary">Pengelolaan Sistem</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Atur akses dan fitur global untuk peserta.</p>
      </div>

      {/* CARD 1: FORMULIR */}
      <div className="batik-border rounded-xl overflow-hidden bg-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-foreground">Akses Edit Bebas Formulir</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Jika <strong>DITUTUP</strong>, peserta tidak bisa lagi mengubah jadwal secara langsung. Setiap klik 'Simpan' akan masuk ke tab <strong>Antrean Revisi</strong> untuk disetujui Admin.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto border p-2 rounded-xl bg-background shadow-sm">
            <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${isFormOpen ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
              Status: {isFormOpen ? 'DIBUKA BEBAS' : 'DITUTUP (KARANTINA)'}
            </span>
            <Button 
              onClick={toggleFormAccess} 
              disabled={isSaving}
              variant={isFormOpen ? "destructive" : "default"}
              className="font-bold whitespace-nowrap"
            >
              {isFormOpen ? 'Tutup Akses Edit' : 'Buka Akses Edit'}
            </Button>
          </div>
        </div>
      </div>

      {/* CARD 2: SERTIFIKAT */}
      <div className="batik-border rounded-xl overflow-hidden bg-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-foreground">Akses Download E-Sertifikat</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Jika <strong>DIBUKA</strong>, tombol "Download E-Sertifikat" akan muncul di Dashboard User bagi peserta yang datanya berstatus Final.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto border p-2 rounded-xl bg-background shadow-sm">
            <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${isCertOpen ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
              Status: {isCertOpen ? 'DIBUKA' : 'DITUTUP'}
            </span>
            <Button 
              onClick={toggleCertAccess} 
              disabled={isSaving}
              variant={isCertOpen ? "destructive" : "default"}
              className="font-bold whitespace-nowrap"
            >
              {isCertOpen ? 'Tutup Sertifikat' : 'Buka Sertifikat'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}