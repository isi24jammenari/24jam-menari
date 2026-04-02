"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NonstopTab() {
  const [dancers, setDancers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_pendaftar: 0 });
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch Data Awal
  useEffect(() => {
    fetchData();
    fetchStatus();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/komunitas/overview');
      setDancers(res.data.data.dancers.data);
      setStats(res.data.data.stats);
    } catch (error) {
      console.error("Gagal mengambil data komunitas", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await api.get('/komunitas/status');
      setIsOpen(res.data.data.is_open);
    } catch (error) {
      console.error("Gagal mengambil status form", error);
    }
  };

  // Eksekusi Toggle Buka/Tutup
  const handleToggleStatus = async () => {
    const newState = !isOpen;
    const confirmMsg = newState 
      ? "Apakah Anda yakin ingin MEMBUKA KEMBALI pendaftaran?" 
      : "Apakah Anda yakin ingin MENUTUP pendaftaran? Pendaftar tidak akan bisa mengakses form lagi.";
      
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.post('/admin/komunitas/toggle-status', { is_open: newState });
      setIsOpen(newState);
      alert(`Formulir berhasil ${newState ? 'dibuka' : 'ditutup'}.`);
    } catch (error) {
      alert("Gagal mengubah status formulir.");
    }
  };

  // Eksekusi Download CSV
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/admin/komunitas/export', {
        responseType: 'blob', // Wajib untuk file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Data_Pendaftar_Penari_Nonstop_2026.csv');
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Gagal mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse font-bold text-primary">Memuat Data Komunitas...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* HEADER & KONTROL UTAMA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border-2 border-border shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-foreground">Manajemen Penari Non-Stop</h2>
          <p className="text-muted-foreground font-medium mt-1">
            Total Pendaftar: <span className="text-primary font-bold text-lg">{stats.total_pendaftar} Orang</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            onClick={handleExportCsv} 
            disabled={isExporting || stats.total_pendaftar === 0}
            className="font-bold shadow-md h-12"
          >
            {isExporting ? "Mengekspor..." : "📥 Download Data (CSV)"}
          </Button>

          <Button 
            onClick={handleToggleStatus} 
            variant={isOpen ? "destructive" : "default"}
            className={`font-bold shadow-md h-12 ${!isOpen && 'bg-green-600 hover:bg-green-700'}`}
          >
            {isOpen ? "🛑 Tutup Pendaftaran" : "✅ Buka Pendaftaran"}
          </Button>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-primary font-medium flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <p>Seluruh file (Surat Sehat, CV, Foto, Video) otomatis masuk ke akun <strong>Google Drive Panitia</strong>. Gunakan file CSV untuk mencocokkan data teks dengan file di dalam Drive.</p>
      </div>

      {/* TABEL PENDAFTAR */}
      <Card className="border-2 border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted border-b border-border whitespace-nowrap">
                <th className="px-6 py-4 font-bold text-muted-foreground">Waktu Daftar</th>
                <th className="px-6 py-4 font-bold text-muted-foreground">Nama & Kontak</th>
                <th className="px-6 py-4 font-bold text-muted-foreground">Karya Masterpiece</th>
                <th className="px-6 py-4 font-bold text-muted-foreground">Pendamping</th>
                <th className="px-6 py-4 font-bold text-muted-foreground text-center">Status File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dancers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground font-medium">
                    Belum ada pendaftar Penari Non-Stop.
                  </td>
                </tr>
              ) : (
                dancers.map((dancer: any) => (
                  <tr key={dancer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {new Date(dancer.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-base">{dancer.name}</p>
                      <p className="text-xs text-muted-foreground">{dancer.email}</p>
                      <p className="text-xs text-primary font-bold mt-1">WA: {dancer.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground max-w-[200px] truncate" title={dancer.masterpiece_title}>
                        {dancer.masterpiece_title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap max-w-[200px]">
                        {dancer.companions_identity}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold">
                        Lengkap di G-Drive
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}