"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/data/venues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import api from "@/lib/api";

type RundownItem = {
  id: string;
  timeSlot: {
    time_range: string;
    venue: {
      name: string;
    }
  };
  amount: number;
  user: {
    name: string;
    email: string;
    phone_number: string;
  };
  performance: {
    status: 'draft' | 'completed';
    group_name: string;
    city: string;
    contact_name: string;
    whatsapp_number: string;
    dance_title: string;
  } | null;
};

export default function RundownTab() {
  const [rundownData, setRundownData] = useState<RundownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRundown = async () => {
      try {
        const res = await api.get('/admin/rundown');
        setRundownData(res.data.data);
      } catch (error) {
        console.error("Gagal menarik data rundown admin:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRundown();
  }, []);

  const handleDownload = () => {
    const rows = rundownData.map((item) => ({
      "Venue": item.timeSlot?.venue?.name || "-",
      "Jam Show": item.timeSlot?.time_range || "-",
      "Akun Pendaftar": item.user?.name || "-",
      "Email": item.user?.email || "-",
      "Nama Kelompok/Sanggar": item.performance?.group_name || "-",
      "Kota": item.performance?.city || "-",
      "Narahubung (Pementasan)": item.performance?.contact_name || "-",
      "WA (Pementasan)": item.performance?.whatsapp_number || "-",
      "Judul Tari": item.performance?.dance_title || "-",
      "Status Data": item.performance?.status === 'completed' ? 'Final' : (item.performance?.status === 'draft' ? 'Draft' : 'Belum Isi'),
      "Total Bayar": formatPrice(item.amount),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    
    // Auto width untuk kolom Excel
    ws["!cols"] = [
      { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 25 }, 
      { wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, 
      { wch: 30 }, { wch: 12 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Rundown_Peserta");
    XLSX.writeFile(wb, "Rundown_24JamMenari_Lengkap.xlsx");
  };

  // ✅ 1. Logika render Badge Status
  const getStatusBadge = (perf: RundownItem['performance']) => {
    if (!perf) {
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20 border">✕ Kosong</Badge>;
    }
    if (perf.status === "completed") {
      return <Badge className="bg-primary/10 text-primary border-primary/20 border">✓ Final</Badge>;
    }
    return <Badge className="bg-accent/10 text-accent border-accent/20 border">✎ Draft</Badge>;
  };

  if (isLoading) {
    return <div className="text-center py-10 animate-pulse text-muted-foreground">Memuat tabel rundown...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">
            Rundown & Database Peserta
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Daftar seluruh transaksi yang berhasil dibayar.
          </p>
        </div>
        <Button onClick={handleDownload} className="flex items-center gap-2 text-base px-6 py-5" size="lg">
          📥 Download Master Excel
        </Button>
      </div>

      <div className="batik-border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Venue & Jam</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Akun Pendaftar</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Nama Kelompok</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Judul Karya</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Status Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rundownData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada peserta yang mendaftar.</td>
                </tr>
              ) : (
                rundownData.map((item, i) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-semibold text-foreground">{item.timeSlot?.time_range}</p>
                      <p className="text-xs text-muted-foreground">{item.timeSlot?.venue?.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{item.user?.phone_number}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {item.performance?.group_name || <span className="text-muted-foreground italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {item.performance?.dance_title || <span className="text-muted-foreground italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(item.performance)}
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