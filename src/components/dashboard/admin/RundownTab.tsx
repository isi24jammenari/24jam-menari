"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import api from "@/lib/api";

export default function RundownTab() {
  const [rundownData, setRundownData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchRundown = async () => {
      try {
        const res = await api.get('/admin/participants'); // Pakai endpoint yang sama
        setRundownData(res.data.data);
      } catch (error: any) {
        console.error("Gagal menarik data rundown:", error);
        setErrorMsg(error.response?.data?.message || "Gagal memuat data rundown.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRundown();
  }, []);

  const handleDownloadRundown = () => {
    if (rundownData.length === 0) return alert("Belum ada data untuk diexport.");

    const wb = XLSX.utils.book_new();
    
    // 1. Ambil daftar Venue yang unik dari data
    const venues = Array.from(new Set(rundownData.map(item => item.time_slot?.venue?.name).filter(Boolean)));

    // 2. Looping per Venue dan buat sheet masing-masing
    venues.forEach((venueName) => {
      // Filter data spesifik untuk venue ini
      const venueData = rundownData.filter(item => item.time_slot?.venue?.name === venueName);
      
      // Sort berdasarkan Jam Tampil (Ascending)
      venueData.sort((a, b) => ((a.time_slot?.time_range || "") > (b.time_slot?.time_range || "")) ? 1 : -1);

      // Map ke format baris (MENGHILANGKAN NAMA AKUN, SINOPSIS, KEDATANGAN, DAN SERTIFIKAT)
      const rows = venueData.map((item, index) => {
        const perf = item.performance || {};
        const works = perf.works?.map((w: any) => `${w.title} (${w.duration}m)`).join(" | ") || "-";
        const instruments = perf.instruments?.join(", ") || "-";

        return {
          "No": index + 1,
          "Jam Tampil": item.time_slot?.time_range || "-",
          "Nama Kelompok / Sanggar": perf.group_name || "-",
          "Nama Narahubung": perf.cp_name || "-",
          "WA Narahubung": perf.contact_person || "-",
          "Kategori": perf.category || "-",
          "Pendukung Karya": perf.supporters || "-",
          "Judul Karya & Durasi": works,
          "Jenis Musik": perf.music_type || "-",
          "Alat Musik": instruments,
          "Keterangan Properti": perf.property_setting || "-",
        };
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      
      // Lebar kolom custom agar rapi
      ws["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 25 }, { wch: 30 }];

      // Potong nama sheet jika kepanjangan (Maks 31 karakter aturan Excel)
      const safeSheetName = String(venueName).substring(0, 31).replace(/[\\/*?:[\]]/g, '');
      XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
    });

    XLSX.writeFile(wb, `Rundown_Per_Venue_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (isLoading) return <div className="text-center py-10 animate-pulse text-muted-foreground">Memuat urutan rundown...</div>;
  if (errorMsg) return <div className="text-center py-10 text-red-500 font-bold border-2 border-red-500 rounded-xl bg-red-500/10 p-4">{errorMsg}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">Rundown Panggung Terpisah</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Urutan pementasan. Saat Export, data akan terpisah otomatis per Venue (Sheet).</p>
        </div>
        <Button onClick={handleDownloadRundown} variant="secondary" className="flex items-center gap-2 text-base px-6 py-5 bg-accent/20 text-accent hover:bg-accent/30" size="lg">
          📄 Download Rundown Terpisah
        </Button>
      </div>

      <div className="batik-border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Venue & Jam</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nama Kelompok</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Karya & Durasi</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Kesiapan Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rundownData.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Belum ada rundown.</td></tr>
              ) : (
                rundownData.map((item) => {
                  const perf = item.performance || {};
                  const isReady = perf.status === 'completed';

                  return (
                  <tr key={item.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-semibold text-foreground">{item.time_slot?.time_range}</p>
                      <p className="text-xs text-muted-foreground font-bold mt-0.5 text-primary">{item.time_slot?.venue?.name}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {perf.group_name || <span className="text-muted-foreground italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {perf.works?.map((w:any) => w.title).join(", ") || <span className="text-muted-foreground italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isReady ? <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Siap Tampil</Badge> : <Badge variant="destructive">Data Belum Lengkap</Badge>}
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}