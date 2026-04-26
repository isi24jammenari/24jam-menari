"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { getTenantAdminData, exportTenantCsv, toggleTenantStand, toggleAllTenantStands, manualRegisterTenant } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LayoutDashboard, Download, Store, Users, Wallet, Lock, Unlock, Settings2 } from "lucide-react";

export default function TenantAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({ total_income: 0, total_tenants: 0, empty_stands: 0 });
  const [participants, setParticipants] = useState<any[]>([]);
  const [stands, setStands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // State Manajemen Manual
  const [manageStand, setManageStand] = useState<any>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualForm, setManualForm] = useState({
    pendaftar_name: '', pendaftar_email: '', phone: '', tenant_name: '', product_type: '', payment_method: 'CASH'
  });

  const fetchData = async () => {
    try {
      const res = await getTenantAdminData();
      setStats(res.data.stats);
      setParticipants(res.data.participants);
      setStands(res.data.stands || []);
    } catch (e) {
      alert("Akses Ditolak. Mohon Login Admin.");
      router.push("/auth/login");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [router]);

  const handleExport = async () => {
    setExporting(true);
    try { await exportTenantCsv(); } 
    catch (e: any) { alert(e.message); } 
    finally { setExporting(false); }
  };

  // --- FUNGSI MANAJEMEN ---
  const handleToggleStand = async (id: string) => {
    if (!confirm("Ubah status ketersediaan stand ini?")) return;
    setIsProcessing(true);
    try {
      await toggleTenantStand(id);
      await fetchData();
      setIsManageModalOpen(false);
    } catch (e: any) { alert("Gagal mengubah status."); }
    finally { setIsProcessing(false); }
  };

  const handleToggleAll = async (action: 'lock'|'unlock') => {
    if (!confirm(`Anda yakin ingin ${action === 'lock' ? 'MENUTUP' : 'MEMBUKA'} seluruh stand?`)) return;
    try {
      await toggleAllTenantStands(action);
      await fetchData();
    } catch (e: any) { alert("Aksi massal gagal."); }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await manualRegisterTenant({ stand_id: manageStand.id, ...manualForm });
      alert("Stand berhasil didaftarkan secara manual.");
      await fetchData();
      setIsManageModalOpen(false);
      setManualForm({ pendaftar_name: '', pendaftar_email: '', phone: '', tenant_name: '', product_type: '', payment_method: 'CASH' });
    } catch (e: any) { alert(e.message || "Pendaftaran manual gagal."); }
    finally { setIsProcessing(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse font-bold uppercase tracking-widest">Memuat Panel Pengendali...</div>;

  return (
    <PageWrapper>
      <div className="py-12 space-y-12 max-w-[90rem] mx-auto px-4">
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
          <SectionTitle title="Panel Bazaar" subtitle="Pantau pendapatan dan manajemen slot tenant secara real-time." className="text-left mb-0" />
          <Button onClick={handleExport} disabled={exporting} className="rounded-full px-8 py-6 font-bold shadow-xl shadow-primary/20 bg-primary hover:scale-105 transition-all gap-2">
            <Download size={20} /> {exporting ? "Mengekspor..." : "Export Data Excel"}
          </Button>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Total Pendapatan", val: `Rp ${stats.total_income.toLocaleString('id-ID')}`, icon: <Wallet className="text-primary" />, border: "border-primary/30" },
            { label: "Tenant Terverifikasi", val: `${stats.total_tenants} Pendaftar`, icon: <Store className="text-accent" />, border: "border-accent/30" },
            { label: "Sisa Slot Kosong", val: `${stats.empty_stands} Stand`, icon: <Users className="text-destructive" />, border: "border-destructive/30" },
          ].map((item, idx) => (
            <Card key={idx} className={`bg-card/40 border ${item.border} rounded-3xl p-6 shadow-sm`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                {item.icon}
              </div>
              <p className="text-3xl font-black text-foreground italic">{item.val}</p>
            </Card>
          ))}
        </div>

        {/* FITUR BARU: GRID MANAJEMEN STAND */}
        <Card className="bg-card/30 border border-border/60 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
               <h3 className="font-black text-xl flex items-center gap-2 text-primary"><Settings2 size={24}/> Pengendalian Stand</h3>
               <p className="text-sm text-muted-foreground">Klik nomor stand untuk mendaftarkan secara manual atau menutup paksa slot.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleToggleAll('lock')} variant="destructive" className="font-bold tracking-wide"><Lock size={16} className="mr-2"/> Tutup Semua Slot</Button>
              <Button onClick={() => handleToggleAll('unlock')} variant="outline" className="font-bold text-primary border-primary/30"><Unlock size={16} className="mr-2"/> Buka Semua Slot</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
            {stands.map((stand) => (
              <button
                key={stand.id}
                onClick={() => { setManageStand(stand); setIsManageModalOpen(true); }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden group hover:scale-105 shadow-sm ${
                  stand.is_booked ? "bg-secondary/80 border-border/50" : "bg-[#c6ff33]/20 border-primary/30 hover:border-primary hover:bg-[#c6ff33]"
                }`}
              >
                <span className={`text-2xl font-black transition-colors ${stand.is_booked ? "text-muted-foreground/60" : "text-primary"}`}>
                  {stand.stand_number}
                </span>
                {stand.is_booked && <Lock size={12} className="absolute bottom-2 text-muted-foreground/40" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Tabel Tenant Eksisting */}
        <Card className="bg-card/50 border border-border/60 rounded-3xl overflow-hidden batik-border">
          <div className="p-6 bg-primary/5 border-b border-border flex items-center gap-2">
            <LayoutDashboard size={18} className="text-primary" />
            <p className="font-bold text-sm uppercase tracking-widest">Daftar Pendaftar Terverifikasi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 text-accent uppercase font-black text-[11px] tracking-tighter whitespace-nowrap">
                <tr>
                  <th className="px-8 py-5">Stand</th>
                  <th className="px-8 py-5">Waktu & Metode</th>
                  <th className="px-8 py-5">Brand & Produk</th>
                  <th className="px-8 py-5">Identitas Pendaftar</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {participants.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-bold italic">Belum ada tenant yang lunas.</td></tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-6 font-black text-4xl text-primary/40 group-hover:text-primary transition-colors italic">#{p.stand?.stand_number}</td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <p className="font-bold text-foreground">{new Date(p.updated_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })} WIB</p>
                        <Badge variant="outline" className="mt-1.5 bg-secondary/30 text-[10px] uppercase font-black tracking-widest text-primary border-primary/20">{p.payment_method || "-"}</Badge>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-foreground text-lg uppercase leading-none mb-1">{p.tenant_name || "BELUM ISI FORM"}</p>
                        <p className="text-xs text-muted-foreground font-medium italic">{p.product_type || "-"}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-foreground">{p.pendaftar_name}</p>
                        <p className="text-xs text-muted-foreground">{p.pendaftar_email}</p>
                        <p className="text-xs text-primary font-mono mt-0.5">{p.phone}</p>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-accent/10 text-accent border-accent/20 rounded-full px-4 py-1 font-bold uppercase text-[10px]">Success</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* MODAL MANAJEMEN STAND MANUAL */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-2xl w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-primary border-b border-border/50 pb-4 mb-2">Kelola Stand #{manageStand?.stand_number}</DialogTitle>
          </DialogHeader>
          
          {manageStand?.is_booked ? (
            <div className="space-y-6 py-6 text-center">
              <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={40} /></div>
              <p className="text-base font-medium">Stand ini sedang dalam status <strong>Terkunci atau Sudah Disewa</strong>.</p>
              <Button onClick={() => handleToggleStand(manageStand.id)} disabled={isProcessing} variant="outline" className="w-full border-primary text-primary font-bold py-7 text-lg rounded-xl hover:bg-primary hover:text-white">
                {isProcessing ? "Memproses..." : "Buka Slot Ini (Tersedia Kembali)"}
              </Button>
              <p className="text-xs text-destructive italic mt-4">*Hati-hati, membuka slot yang sudah dibayar oleh tenant akan memicu bentrok pesanan ganda.</p>
            </div>
          ) : (
            <div className="space-y-6 pt-4">
              <div className="bg-destructive/5 border border-destructive/20 p-5 rounded-xl flex justify-between items-center gap-4">
                <span className="text-sm font-bold text-destructive leading-tight">Tutup stand ini agar tidak bisa dipesan dari halaman pendaftaran publik?</span>
                <Button variant="destructive" size="default" disabled={isProcessing} onClick={() => handleToggleStand(manageStand.id)} className="font-black whitespace-nowrap px-6">
                  Kunci Slot
                </Button>
              </div>
              
              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div><div className="relative flex justify-center text-sm uppercase"><span className="bg-card px-4 text-muted-foreground font-black tracking-widest">Atau Pendaftaran Manual</span></div></div>

              <form onSubmit={handleManualRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <input required placeholder="Nama Pendaftar *" value={manualForm.pendaftar_name} onChange={e=>setManualForm({...manualForm, pendaftar_name: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary text-sm" />
                   <input required placeholder="No. WhatsApp *" value={manualForm.phone} onChange={e=>setManualForm({...manualForm, phone: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <input type="email" placeholder="Email (Opsional)" value={manualForm.pendaftar_email} onChange={e=>setManualForm({...manualForm, pendaftar_email: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary text-sm" />
                <div className="grid grid-cols-2 gap-4">
                   <input required placeholder="Nama Brand/Tenant *" value={manualForm.tenant_name} onChange={e=>setManualForm({...manualForm, tenant_name: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary text-sm" />
                   <input required placeholder="Jenis Produk *" value={manualForm.product_type} onChange={e=>setManualForm({...manualForm, product_type: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="pt-2">
                   <select value={manualForm.payment_method} onChange={e=>setManualForm({...manualForm, payment_method: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary text-sm font-bold font-mono">
                      <option value="CASH">💵 DIBAYAR CASH LUNAS</option>
                      <option value="MANUAL_TRANSFER">💳 TRANSFER MANUAL PANITIA</option>
                      <option value="UNDANGAN_FREE">🎁 GRATIS / UNDANGAN KHUSUS</option>
                   </select>
                </div>
                <Button type="submit" disabled={isProcessing} className="w-full mt-4 py-7 text-lg rounded-xl font-bold bg-accent hover:bg-accent/80 text-accent-foreground shadow-lg">
                  {isProcessing ? "Menyimpan Data..." : "Simpan Pendaftaran Manual"}
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}