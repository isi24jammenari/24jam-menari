"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import api from "@/lib/api";

// Helper mutlak untuk mencegah Crash akibat String/Array dari Backend
const safeParse = (data: any) => {
  if (!data) return [];
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return []; }
  }
  return Array.isArray(data) ? data : [];
};

export default function RundownTab() {
  const [rundownData, setRundownData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchRundown = async () => {
      try {
        const res = await api.get('/admin/participants'); 
        setRundownData(res.data.data || res.data); // Antisipasi jika format data array langsung
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
    const venues = Array.from(new Set(rundownData.map(item => item.time_slot?.venue?.name).filter(Boolean)));

    venues.forEach((venueName) => {
      const venueData = rundownData.filter(item => item.time_slot?.venue?.name === venueName);
      venueData.sort((a, b) => ((a.time_slot?.time_range || "") > (b.time_slot?.time_range || "")) ? 1 : -1);

      const rows = venueData.map((item, index) => {
        const perf = item.performance || {};
        const worksArray = safeParse(perf.works);
        const instrumentsArray = safeParse(perf.instruments);

        const works = worksArray.map((w: any) => `${w.title} (${w.duration}m)`).join(" | ") || "-";
        const instruments = instrumentsArray.join(", ") || "-";

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
      ws["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 25 }, { wch: 30 }];

      const safeSheetName = String(venueName).substring(0, 31).replace(/[\\/*?:[\]]/g, '');
      XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
    });

    XLSX.writeFile(wb, `Rundown_Per_Venue_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (isLoading) return <div className="text-center py-10 animate-pulse text-muted-foreground">Memuat urutan rundown...</div>;
  if (errorMsg) return <div className="text-center py-10 text-red-500 font-bold border-2 border-red-500 rounded-xl bg-red-500/10 p-4">{errorMsg}</div>;

  // Mendapatkan daftar Venue unik dari data yang masuk
  const uniqueVenues = Array.from(new Set(rundownData.map(item => item.time_slot?.venue?.name).filter(Boolean)));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">Rundown Panggung Terpisah</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Jadwal telah dipisahkan per Venue secara otomatis.</p>
        </div>
        <Button onClick={handleDownloadRundown} variant="secondary" className="flex items-center gap-2 text-base px-6 py-5 bg-accent/20 text-accent hover:bg-accent/30" size="lg">
          📄 Download Excel Terpisah
        </Button>
      </div>

      {uniqueVenues.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">Belum ada rundown.</div>
      ) : (
        uniqueVenues.map((venueName, index) => {
          // Filter & Sort per Venue
          const venueData = rundownData
            .filter(item => item.time_slot?.venue?.name === venueName)
            .sort((a, b) => ((a.time_slot?.time_range || "") > (b.time_slot?.time_range || "")) ? 1 : -1);

          return (
            <div key={index} className="batik-border rounded-xl overflow-hidden bg-card mb-8 shadow-sm">
              <div className="bg-primary/10 px-4 py-3 border-b border-border flex justify-between items-center">
                <h4 className="font-bold text-primary text-lg">{venueName as string}</h4>
                <Badge variant="outline" className="bg-background">{venueData.length} Slot Terisi</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-32">Jam Tampil</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nama Kelompok</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Karya & Durasi</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {venueData.map((item) => {
                      const perf = item.performance || {};
                      const isReady = perf.status === 'completed';
                      const worksArray = safeParse(perf.works);

                      return (
                      <tr key={item.id} className="transition-colors hover:bg-muted/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="outline" className="font-mono text-sm bg-primary/5 text-primary border-primary/20">
                            {item.time_slot?.time_range}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-foreground font-bold">
                          {perf.group_name || <span className="text-muted-foreground italic font-normal">—</span>}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {worksArray.length > 0 ? worksArray.map((w:any) => w.title).join(", ") : <span className="text-muted-foreground italic">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isReady ? <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Siap Tampil</Badge> : <Badge variant="destructive">Belum Lengkap</Badge>}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}