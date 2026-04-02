"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/data/venues";
import { jsPDF } from "jspdf";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Komponen helper untuk Copy to Clipboard
const CopyableToken = ({ token }: { token: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2 bg-background w-fit px-2 py-1 rounded-md border border-border mt-1.5 shadow-sm">
      <p className="text-[11px] text-foreground font-mono font-bold tracking-widest">{token || "TIDAK ADA TOKEN"}</p>
      <button 
        onClick={handleCopy}
        className="text-muted-foreground hover:text-primary transition-all text-xs active:scale-90"
        title="Copy Token Klaim"
      >
        {copied ? "✅" : "📋"}
      </button>
    </div>
  );
};

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
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm overflow-hidden flex flex-col justify-center">
          <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider mb-1 truncate">Penghasilan Bersih</p>
          <p className="text-2xl lg:text-xl xl:text-2xl font-black text-primary truncate" title={formatPrice(stats.total_income)}>
            {formatPrice(stats.total_income)}
          </p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm overflow-hidden flex flex-col justify-center">
          <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider mb-1 truncate">Total Slot Event</p>
          <p className="text-2xl lg:text-xl xl:text-2xl font-black text-foreground truncate">{stats.total_slots} <span className="text-sm font-medium">Slot</span></p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm overflow-hidden flex flex-col justify-center">
          <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider mb-1 truncate">Slot Terisi</p>
          <p className="text-2xl lg:text-xl xl:text-2xl font-black text-accent truncate">{stats.booked_slots} <span className="text-sm font-medium">Grup</span></p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 shadow-sm overflow-hidden flex flex-col justify-center">
          <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider mb-1 truncate">Sisa Slot</p>
          <p className="text-2xl lg:text-xl xl:text-2xl font-black text-green-600 truncate">{stats.available_slots} <span className="text-sm font-medium">Kosong</span></p>
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
                <tr className="bg-muted border-b border-border whitespace-nowrap">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tanggal</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Token Klaim</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pendaftar</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Venue & Jadwal</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Festival</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nominal & Pembayaran</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mutations.data.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Belum ada mutasi masuk.</td></tr>
                ) : (
                  mutations.data.map((mut: any) => (
                    <tr key={mut.id} className="transition-colors hover:bg-muted/50">
                      
                      {/* 1. Tanggal */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground whitespace-nowrap">
                          {new Date(mut.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </td>
                      
                      {/* 2. Token Klaim */}
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-800 border-slate-300">
                          {mut.midtrans_order_id || mut.id.split('-')[0]}
                        </Badge>
                      </td>
                      
                      {/* 3. Pendaftar */}
                      <td className="px-4 py-3">
                        <p className="font-bold text-foreground truncate max-w-[150px]">{mut.user?.name || "Belum Ada Akun"}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{mut.user?.email || "-"}</p>
                      </td>
                      
                      {/* 4. Venue & Jadwal */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-bold text-foreground text-sm">{mut.time_slot?.venue?.name || "-"}</p>
                        <Badge variant="outline" className="mt-1 text-xs font-semibold bg-primary/5 text-primary border-primary/20">
                          {mut.time_slot?.time_range || "-"}
                        </Badge>
                      </td>

                      {/* 5. Festival */}
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 bg-accent/10 text-accent font-bold text-xs rounded-md uppercase tracking-wider">
                          {mut.time_slot?.venue?.festival_name || "FESTIVAL"}
                        </span>
                      </td>

                      {/* 6. Nominal & Pembayaran */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-bold text-primary">{formatPrice(mut.amount)}</p>
                        {mut.payment_method && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded uppercase tracking-wider">
                            {mut.payment_method}
                          </span>
                        )}
                      </td>

                      {/* 7. Aksi */}
                      <td className="px-4 py-3 text-right">
                        <Button 
                          onClick={() => generateInvoice(mut)} 
                          size="sm" 
                          variant="secondary" 
                          className="text-xs font-bold whitespace-nowrap shadow-sm hover:scale-105 transition-transform"
                        >
                          📄 Invoice/Nota
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