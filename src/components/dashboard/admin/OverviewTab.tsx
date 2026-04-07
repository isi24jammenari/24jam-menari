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
    <div className="flex items-center gap-2 bg-background w-fit px-2 py-1 rounded-md border border-border shadow-sm">
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

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      // INJEKSI TIMESTAMP: Memaksa Browser & Server tidak menggunakan Cache basi!
      const res = await api.get(`/admin/overview?t=${new Date().getTime()}`);
      setData(res.data.data);
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
    const doc = new jsPDF();
    const date = new Date(mutation.created_at).toLocaleString('id-ID');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INVOICE PEMBAYARAN", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Event: 24 Jam Menari ISI Surakarta", 105, 30, { align: "center" });
    doc.text("Status: LUNAS (PAID)", 105, 37, { align: "center" });

    doc.line(20, 45, 190, 45); 

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
    doc.text(`${mutation.time_slot?.venue?.name || 'VENUE ERROR'} (${mutation.time_slot?.time_range || 'JAM ERROR'})`, 60, 100);

    doc.line(20, 110, 190, 110); 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Total Bayar:", 20, 125);
    doc.text(formatPrice(mutation.amount), 60, 125);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Invoice ini digenerate secara otomatis oleh sistem admin.", 105, 270, { align: "center" });

    doc.save(`Invoice_${mutation.user?.name || 'User'}_${mutation.id.substring(0,6)}.pdf`);
  };

  if (errorMsg) return <div className="py-10 text-red-500 font-bold text-center border-2 border-red-500 rounded-xl bg-red-500/10 p-4">Backend Error: {errorMsg}</div>;
  if (!data) return <div className="animate-pulse py-10 text-muted-foreground text-center">Memuat statistik...</div>;

  const { stats, mutations } = data;
  const allMutations = mutations?.data || [];
  
  // Mencari daftar Venue yang unik secara aman (Mencegah Silent Drop)
  const uniqueVenues = Array.from(new Set(allMutations.map((item: any) => item.time_slot?.venue?.name).filter(Boolean)));
  
  // MENDETEKSI DATA YANG DIBUANG OLEH FILTER REACT
  const lostMutations = allMutations.filter((item: any) => !item.time_slot?.venue?.name);
  const isTk2ExistInJson = allMutations.some((m: any) => m.time_slot_id === 'tk2-2');

  return (
    <div className="space-y-8">
      
      {/* ========================================================= */}
      {/* 🔴 X-RAY DEBUGGER: MENDETEKSI KEBOHONGAN SERVER / FRONTEND */}
      {/* ========================================================= */}
      <div className="bg-red-50 border-2 border-red-500 p-5 rounded-xl shadow-sm">
        <h3 className="font-black text-red-700 text-lg mb-2">🚨 X-RAY SYSTEM DEBUGGER 🚨</h3>
        <ul className="space-y-1 text-sm text-red-900 font-medium">
          <li>1. Total Data Transaksi Mentah dari API API: <span className="font-black text-lg bg-red-200 px-2 py-0.5 rounded">{allMutations.length}</span></li>
          <li>2. Apakah slot <code className="bg-red-200 px-1 rounded">tk2-2</code> berhasil dikirim Laravel ke Frontend? 
            {isTk2ExistInJson ? (
              <span className="ml-2 font-black text-green-700 bg-green-200 px-2 py-0.5 rounded">ADA ✅ (Backend Sehat)</span>
            ) : (
              <span className="ml-2 font-black text-white bg-red-600 px-2 py-0.5 rounded">TIDAK ADA ❌ (Server Anda Masih Pakai Kode Lama!)</span>
            )}
          </li>
          <li>3. Jumlah Data yang relasi Venue-nya terputus/dibuang React: <span className="font-black bg-red-200 px-2 py-0.5 rounded">{lostMutations.length}</span></li>
        </ul>
      </div>

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

      {/* TABEL LOST & FOUND (DATA YANG DIBUANG REACT) */}
      {lostMutations.length > 0 && (
        <div className="border-2 border-orange-500 rounded-xl overflow-hidden bg-orange-50 mb-8 shadow-sm">
          <div className="bg-orange-500 text-white px-4 py-3 border-b border-orange-600 flex justify-between items-center">
            <h4 className="font-bold text-lg">⚠️ LOST & FOUND (Data Gagal Render)</h4>
            <Badge variant="secondary" className="bg-white text-orange-600">{lostMutations.length} Tersangkut</Badge>
          </div>
          <div className="overflow-x-auto relative min-h-[100px] bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {lostMutations.map((mut: any) => (
                  <tr key={mut.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-sm font-bold text-red-500">ID SLOT: {mut.time_slot_id}</td>
                    <td className="px-4 py-3"><CopyableToken token={mut.midtrans_order_id || mut.id.split('-')[0]} /></td>
                    <td className="px-4 py-3 font-bold text-primary">{formatPrice(mut.amount)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button onClick={() => generateInvoice(mut)} size="sm" variant="secondary" className="text-xs font-bold">📄 Invoice</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Tabel Mutasi (Dipisah Per Venue) */}
      <div className="space-y-4">
        {uniqueVenues.length === 0 && lostMutations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">Belum ada mutasi masuk.</div>
        ) : (
          uniqueVenues.map((venueName, index) => {
            const venueData = allMutations
              .filter((item: any) => item.time_slot?.venue?.name === venueName)
              .sort((a: any, b: any) => ((a.time_slot?.time_range || "") > (b.time_slot?.time_range || "")) ? 1 : -1);

            return (
              <div key={index} className="batik-border rounded-xl overflow-hidden bg-card mb-8 shadow-sm">
                <div className="bg-primary/10 px-4 py-3 border-b border-border flex justify-between items-center">
                  <h4 className="font-bold text-primary text-lg">{venueName as string}</h4>
                  <Badge variant="outline" className="bg-background">{venueData.length} Slot Lunas</Badge>
                </div>
                <div className="overflow-x-auto relative min-h-[100px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border whitespace-nowrap">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-40">Jam Tampil</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pendaftar</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Token Klaim</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pembayaran</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Waktu Transaksi</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {venueData.map((mut: any) => (
                        <tr key={mut.id} className="transition-colors hover:bg-muted/50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge variant="outline" className="font-mono text-sm bg-primary/5 text-primary border-primary/20">
                              {mut.time_slot?.time_range || "-"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-foreground truncate max-w-[200px]">{mut.user?.name || "Belum Ada Akun"}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{mut.user?.email || "-"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <CopyableToken token={mut.midtrans_order_id || mut.id.split('-')[0]} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <p className="font-bold text-primary">{formatPrice(mut.amount)}</p>
                            {mut.payment_method && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded uppercase tracking-wider">
                                {mut.payment_method}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(mut.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button onClick={() => generateInvoice(mut)} size="sm" variant="secondary" className="text-xs font-bold whitespace-nowrap shadow-sm hover:scale-105 transition-transform">
                              📄 Invoice
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}