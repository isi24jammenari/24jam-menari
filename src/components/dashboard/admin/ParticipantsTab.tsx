"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import api from "@/lib/api";

export default function ParticipantsTab() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await api.get('/admin/participants');
        setParticipants(res.data.data);
      } catch (error: any) {
        console.error("Gagal menarik data peserta:", error);
        setErrorMsg(error.response?.data?.message || "Gagal memuat data peserta.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  const handleDownloadExcel = () => {
    const rows = participants.map((item) => {
      const perf = item.performance || {};
      
      // Formatting Array to String
      const works = perf.works?.map((w: any) => `${w.title} (${w.duration}m)`).join(" | ") || "-";
      const instruments = perf.instruments?.join(", ") || "-";
      const certNames = perf.certificate_names?.join(", ") || "-";

      return {
        "ID Booking": item.id.split('-')[0],
        "Tgl Pendaftaran": new Date(item.created_at).toLocaleString('id-ID'),
        "Akun Pendaftar": item.user?.name || "-",
        "Email Akun": item.user?.email || "-",
        "Venue Terpilih": item.time_slot?.venue?.name || "-",
        "Jam Tampil": item.time_slot?.time_range || "-",
        "Nama Peserta / Grup": perf.group_name || "-",
        "Nama Narahubung": perf.cp_name || "-",
        "WA Narahubung": perf.contact_person || "-",
        "Kategori": perf.category || "-",
        "Pendukung Karya": perf.supporters || "-",
        "Daftar Karya & Durasi": works,
        "Sinopsis": perf.works?.map((w: any) => w.synopsis).join(" \n\n ") || "-",
        "Kedatangan & Kepulangan": perf.arrival_departure || "-",
        "Jenis Musik": perf.music_type || "-",
        "Alat Musik (Live)": instruments,
        "Keterangan Properti": perf.property_setting || "-",
        "Daftar Nama Sertifikat": certNames,
        "Status Formulir": perf.status === 'completed' ? 'Final' : (perf.status === 'draft' ? 'Draft' : 'Belum Diisi')
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    
    // Auto-width column adjustment (Basic)
    ws["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 40 }, { wch: 50 }, { wch: 30 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 50 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(wb, ws, "Semua_Data_Penari");
    XLSX.writeFile(wb, `Database_Peserta_24JamMenari_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (isLoading) return <div className="text-center py-10 animate-pulse text-muted-foreground">Memuat data peserta...</div>;
  if (errorMsg) return <div className="text-center py-10 text-red-500 font-bold border-2 border-red-500 rounded-xl bg-red-500/10 p-4">{errorMsg}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">Data Diri & Formulir Peserta</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Database lengkap seluruh isian formulir peserta.</p>
        </div>
        <Button onClick={handleDownloadExcel} className="flex items-center gap-2 text-base px-6 py-5" size="lg">
          📥 Download Excel Lengkap
        </Button>
      </div>

      <div className="batik-border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pendaftar</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nama Grup / Sanggar</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Kontak (CP)</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {participants.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada peserta terdaftar.</td></tr>
              ) : (
                participants.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{item.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{item.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.performance?.group_name || <span className="text-muted-foreground italic">Belum diisi</span>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.performance?.cp_name || "-"}</p>
                      <p className="text-xs text-muted-foreground">{item.performance?.contact_person || "-"}</p>
                    </td>
                    <td className="px-4 py-3">{item.performance?.category || "-"}</td>
                    <td className="px-4 py-3">
                       {item.performance?.status === 'completed' ? <Badge className="bg-primary text-primary-foreground">Final</Badge> : (item.performance?.status === 'draft' ? <Badge variant="secondary">Draft</Badge> : <Badge variant="destructive">Kosong</Badge>)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}