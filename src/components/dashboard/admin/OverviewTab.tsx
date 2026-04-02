"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/data/venues";
import { jsPDF } from "jspdf";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OverviewTab() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchOverview = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/admin/overview?page=${pageNumber}`);
      setData(res.data.data);
      setPage(pageNumber);
    } catch (error: any) {
      console.error("Gagal menarik data overview", error);
      setErrorMsg(error.response?.data?.message || "Error 500: Terjadi fatal error di Backend Laravel.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const generateInvoice = (mutation: any) => {
    // Generate Invoice PDF di sisi Frontend (Tanpa membebani backend)
    const doc = new jsPDF();
    const date = new Date(mutation.created_at).toLocaleString('id-ID');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INVOICE PEMBAYARAN", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Event: 24 Jam Menari ISI Surakarta", 105, 30, { align: "center" });
    doc.text("Status: LUNAS (PAID)", 105, 37, { align: "center" });

    doc.line(20, 45, 190, 45); // Garis

    doc.setFont("helvetica", "bold");
    doc.text("ID Booking:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(mutation.id, 60, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Tanggal:", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(date, 60, 70);

    doc.setFont("helvetica", "bold");
    doc.text("Nama Akun:", 20, 80);
    doc.setFont("helvetica", "normal");
    doc.text(mutation.user?.name || "-", 60, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Email Akun:", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(mutation.user?.email || "-", 60, 90);

    doc.setFont("helvetica", "bold");
    doc.text("Venue/Jam:", 20, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`${mutation.time_slot?.venue?.name} (${mutation.time_slot?.time_range})`, 60, 100);

    doc.line(20, 110, 190, 110); // Garis

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Total Bayar:", 20, 125);
    doc.text(formatPrice(mutation.amount), 60, 125);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Invoice ini digenerate secara otomatis oleh sistem admin.", 105, 270, { align: "center" });

    doc.save(`Invoice_${mutation.user?.name}_${mutation.id.substring(0,6)}.pdf`);
  };

  if (errorMsg) return <div className="py-10 text-red-500 font-bold text-center border-2 border-red-500 rounded-xl bg-red-500/10 p-4">Backend Error: {errorMsg}</div>;
  if (!data) return <div className="animate-pulse py-10 text-muted-foreground text-center">Memuat statistik...</div>;

  const { stats, mutations } = data;

  return (
    <div className="space-y-8">
      {/* 1. Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Penghasilan Bersih</p>
          <p className="text-3xl font-black text-primary">{formatPrice(stats.total_income)}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Total Slot Event</p>
          <p className="text-3xl font-black text-foreground">{stats.total_slots} <span className="text-base font-medium">Slot</span></p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Slot Terisi</p>
          <p className="text-3xl font-black text-accent">{stats.booked_slots} <span className="text-base font-medium">Grup</span></p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Sisa Slot</p>
          <p className="text-3xl font-black text-green-600">{stats.available_slots} <span className="text-base font-medium">Kosong</span></p>
        </div>
      </div>

      {/* 2. Tabel Mutasi (Dengan Pagination & Invoice) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">Mutasi Pembayaran Berhasil</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Daftar transaksi yang sudah Lunas, diurutkan dari yang terbaru.</p>
        </div>

        <div className="batik-border rounded-xl overflow-hidden bg-card">
          <div className="overflow-x-auto relative min-h-[200px]">
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                 <span className="font-bold text-primary">Memuat data...</span>
              </div>
            )}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tanggal & ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pendaftar</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Jumlah (Slot)</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nominal</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mutations.data.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada mutasi masuk.</td></tr>
                ) : (
                  mutations.data.map((mut: any) => (
                    <tr key={mut.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground whitespace-nowrap">{new Date(mut.created_at).toLocaleString('id-ID')}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">ID: {mut.id.split('-')[0]}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-foreground">{mut.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{mut.user?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-bold">1 Slot</Badge>
                      </td>
                      <td className="px-4 py-3 font-bold text-primary">
                        {formatPrice(mut.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button onClick={() => generateInvoice(mut)} size="sm" variant="secondary" className="text-xs font-bold">
                          📄 Download Invoice
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {mutations.last_page > 1 && (
            <div className="bg-muted border-t border-border px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Menampilkan Halaman {mutations.current_page} dari {mutations.last_page}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchOverview(page - 1)} 
                  disabled={page === 1 || isLoading}
                >
                  ← Sebelumnya
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchOverview(page + 1)} 
                  disabled={page === mutations.last_page || isLoading}
                >
                  Selanjutnya →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}