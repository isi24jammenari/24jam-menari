"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RequestsTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/revisions/pending');
      setRequests(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data revisi", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!window.confirm(`Yakin ingin ${action === 'approve' ? 'MENYETUJUI' : 'MENOLAK'} perubahan ini?`)) return;
    
    setIsProcessing(true);
    try {
      await api.post(`/admin/revisions/${id}/${action}`);
      alert(action === 'approve' ? '✅ Revisi disetujui. Database utama telah diperbarui.' : '❌ Revisi ditolak.');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      alert("Gagal memproses revisi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="animate-pulse p-8 text-center">Memuat antrean revisi...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border-l-4 border-amber-500 p-5 rounded-r-xl">
        <h2 className="text-xl font-black text-amber-700">Permintaan Edit Formulir (Karantina)</h2>
        <p className="text-amber-600 font-medium text-sm mt-1">
          Daftar user yang mencoba mengubah data pementasan mereka setelah batas waktu deadline. Perubahan tidak akan masuk ke rundown sebelum Anda menyetujuinya.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="border-dashed border-2 border-border shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <span className="text-5xl mb-4 opacity-50">📭</span>
            <p className="font-bold">Tidak ada antrean permintaan edit.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="border-2 border-amber-500/30 shadow-md bg-card hover:border-amber-500 transition-colors">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md inline-block mb-2">Menunggu Review</p>
                    <h3 className="font-black text-lg text-foreground truncate">{req.booking.user.name}</h3>
                    <p className="text-xs text-muted-foreground">{req.booking.timeSlot.venue.name}</p>
                  </div>
                </div>
                
                <div className="text-sm bg-muted p-3 rounded-lg border border-border">
                  <p className="font-semibold">Nama Grup Baru:</p>
                  <p className="truncate text-primary">{req.revised_data.group_name}</p>
                </div>

                <Button onClick={() => setSelectedRequest(req)} className="w-full font-bold bg-amber-600 hover:bg-amber-700 text-white">
                  🔍 Tinjau Perubahan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL DIFF-VIEWER UNTUK ADMIN */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-border">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <span>⚖️</span> Komparasi Data Formulir
            </DialogTitle>
            <p className="text-sm text-muted-foreground font-medium">Pemohon: <strong>{selectedRequest?.booking.user.name}</strong> ({selectedRequest?.booking.user.email})</p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* KOLOM KIRI: DATA LAMA (ASLI) */}
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-3 rounded-xl text-center sticky top-0 z-10 backdrop-blur-sm">
                  <h4 className="font-black text-slate-500 dark:text-slate-400">DATA SAAT INI (LAMA)</h4>
                </div>
                <div className="space-y-4">
                  <InfoBox label="Nama Grup" value={selectedRequest?.booking.performance?.group_name || 'Kosong'} />
                  <InfoBox label="Narahubung (CP)" value={`${selectedRequest?.booking.performance?.cp_name || '-'} (${selectedRequest?.booking.performance?.contact_person || '-'})`} />
                  <InfoBox label="Jumlah Karya" value={`${selectedRequest?.booking.performance?.works?.length || 0} Karya`} />
                  <InfoBox label="Durasi Total" value={`${selectedRequest?.booking.performance?.works?.reduce((sum: number, w: any) => sum + Number(w.duration), 0) || 0} Menit`} />
                  <div className="bg-muted p-3 rounded-xl border border-border">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Detail Karya Lama:</p>
                    {selectedRequest?.booking.performance?.works?.map((w: any, i: number) => (
                      <p key={i} className="text-sm font-medium border-b border-border/50 pb-1 mb-1 last:border-0">- {w.title} ({w.duration} mnt)</p>
                    )) || <p className="text-sm">-</p>}
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: DATA BARU (REVISI) */}
              <div className="space-y-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700/50 p-3 rounded-xl text-center sticky top-0 z-10 backdrop-blur-sm">
                  <h4 className="font-black text-amber-700 dark:text-amber-500">DATA PENGAJUAN BARU</h4>
                </div>
                <div className="space-y-4">
                  <InfoBox label="Nama Grup" value={selectedRequest?.revised_data.group_name} highlight={selectedRequest?.booking.performance?.group_name !== selectedRequest?.revised_data.group_name} />
                  <InfoBox label="Narahubung (CP)" value={`${selectedRequest?.revised_data.cp_name} (${selectedRequest?.revised_data.contact_person})`} />
                  <InfoBox label="Jumlah Karya" value={`${selectedRequest?.revised_data.works?.length || 0} Karya`} />
                  <InfoBox label="Durasi Total" value={`${selectedRequest?.revised_data.works?.reduce((sum: number, w: any) => sum + Number(w.duration), 0) || 0} Menit`} />
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-bold text-amber-700 mb-2">Detail Karya Baru:</p>
                    {selectedRequest?.revised_data.works?.map((w: any, i: number) => (
                      <p key={i} className="text-sm font-medium border-b border-amber-200/50 pb-1 mb-1 last:border-0 text-amber-900 dark:text-amber-300">- {w.title} ({w.duration} mnt)</p>
                    )) || <p className="text-sm">-</p>}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedRequest(null)} disabled={isProcessing} className="font-bold">
              Tutup
            </Button>
            <Button variant="destructive" onClick={() => handleAction(selectedRequest.id, 'reject')} disabled={isProcessing} className="font-bold">
              ❌ Tolak Perubahan
            </Button>
            <Button variant="default" onClick={() => handleAction(selectedRequest.id, 'approve')} disabled={isProcessing} className="font-bold bg-green-600 hover:bg-green-700 text-white">
              ✅ Setujui & Timpa Database
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mini Component untuk UI Label/Value
function InfoBox({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${highlight ? 'bg-amber-100/50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50' : 'bg-background border-border'}`}>
      <p className="text-xs font-bold text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}