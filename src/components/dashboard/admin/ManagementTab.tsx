"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ManagementTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/admin/settings/certificate-status');
        setIsOpen(res.data.data.is_open);
      } catch (error) {
        console.error("Gagal mengambil status sertifikat", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const toggleAccess = async () => {
    setIsSaving(true);
    try {
      const newState = !isOpen;
      await api.post('/admin/settings/toggle-certificate', { is_open: newState });
      setIsOpen(newState);
      alert(`Akses E-Sertifikat berhasil ${newState ? 'DIBUKA' : 'DITUTUP'} untuk peserta.`);
    } catch (error) {
      console.error("Gagal mengubah status", error);
      alert("Terjadi kesalahan saat mengubah status pengaturan.");
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

      <div className="batik-border rounded-xl overflow-hidden bg-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-foreground">Akses Download E-Sertifikat</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Jika diaktifkan (Dibuka), tombol "Download E-Sertifikat" akan muncul di Dashboard User bagi peserta yang datanya sudah berstatus <strong>Final</strong>.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto border p-2 rounded-xl bg-background">
            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${isOpen ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
              Status: {isOpen ? 'DIBUKA' : 'DITUTUP'}
            </span>
            <Button 
              onClick={toggleAccess} 
              disabled={isSaving}
              variant={isOpen ? "destructive" : "default"}
              className="font-bold"
            >
              {isOpen ? 'Tutup Akses User' : 'Buka Akses User'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}