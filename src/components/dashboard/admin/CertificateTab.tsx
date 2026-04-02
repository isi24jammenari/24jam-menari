"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function CertificateTab() {
  const [stats, setStats] = useState<{ total_valid_groups: number, total_certificates: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/certificates/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error("Gagal menarik statistik sertifikat", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleDownloadZip = async () => {
    if (!stats || stats.total_certificates === 0) {
      return alert("Tidak ada sertifikat yang bisa digenerate (Belum ada grup yang berstatus Final).");
    }

    const confirmDownload = confirm(`Sistem akan menggenerate ${stats.total_certificates} file PDF sertifikat dan mengompresnya menjadi ZIP. Proses ini sangat berat dan dapat memakan waktu 1-3 menit. Lanjutkan?`);
    if (!confirmDownload) return;

    setIsDownloading(true);
    try {
      // WAJIB responseType: 'blob' agar Axios bisa membaca file binary (.zip)
      const response = await api.get('/admin/certificates/download-zip', {
        responseType: 'blob'
      });

      // Membuat link download siluman (invisible) untuk memicu download di browser
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const dateStr = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `E-Sertifikat-Master-24JamMenari-${dateStr}.zip`);
      
      document.body.appendChild(link);
      link.click();
      
      // Bersihkan memori browser setelah download
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mendownload ZIP", error);
      alert("Gagal mengkompilasi file ZIP. Jika jumlah peserta sangat banyak, server mungkin mengalami Timeout. Silakan coba lagi nanti.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <div className="text-center py-10 animate-pulse text-muted-foreground">Memuat data E-Sertifikat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">Manajemen E-Sertifikat</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Pantau kesiapan data dan compile (satukan) seluruh PDF sertifikat ke dalam file ZIP.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="text-5xl">🎭</div>
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Grup Siap Tampil (Final)</p>
            <p className="text-3xl font-black text-foreground">{stats?.total_valid_groups || 0} <span className="text-base font-medium">Grup</span></p>
          </div>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="text-5xl">🎓</div>
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Total E-Sertifikat</p>
            <p className="text-3xl font-black text-primary">{stats?.total_certificates || 0} <span className="text-base font-medium">Lembar PDF</span></p>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 border-2 border-accent/20 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-background p-4 rounded-full shadow-sm">
          <span className="text-4xl">🗂️</span>
        </div>
        <div>
          <h4 className="text-xl font-bold text-accent">Kompilasi Seluruh E-Sertifikat (.ZIP)</h4>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mt-2">
            Sistem akan memproses {stats?.total_certificates || 0} nama, mencetaknya di atas template PDF, dan membungkusnya dalam satu file ZIP. Setiap grup akan dipisah dalam folder masing-masing secara rapi.
          </p>
        </div>
        
        <Button 
          onClick={handleDownloadZip} 
          disabled={isDownloading || !stats || stats.total_certificates === 0}
          size="lg" 
          className={`mt-4 px-8 py-6 text-lg font-bold shadow-lg ${isDownloading ? 'animate-pulse' : ''}`}
        >
          {isDownloading ? '⏳ Sedang Memproses ZIP (Mohon Jangan Tutup Tab Ini)...' : '📥 Download ZIP E-Sertifikat'}
        </Button>
        
        {isDownloading && (
          <p className="text-sm text-destructive font-bold mt-2 animate-bounce">
            ⚠️ PERINGATAN: Proses ini membutuhkan RAM dan CPU server yang tinggi. Mohon tunggu.
          </p>
        )}
      </div>
    </div>
  );
}