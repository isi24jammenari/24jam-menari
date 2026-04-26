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
import { LayoutDashboard, Download, Store, Users, Wallet, Lock, Unlock, Settings2, ShieldAlert, UserCheck, Edit3 } from "lucide-react";

export default function TenantAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({ total_income: 0, total_tenants: 0, empty_stands: 0 });
  const [participants, setParticipants] = useState<any[]>([]);
  const [stands, setStands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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

  const handleToggleStand = async (id: string) => {
    if (!confirm("Ubah status ketersediaan stand ini?")) return;
    setIsProcessing(true);
    try {
      await toggleTenantStand(id);
      await fetchData();
      setIsManageModalOpen(false);
    } catch (e: any) { alert(e.response?.data?.message || "Aksi gagal."); }
    finally { setIsProcessing(false); }
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
    } catch (e: any) { alert(e.response?.data?.message || "Pendaftaran manual gagal."); }
    finally { setIsProcessing(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse font-bold uppercase tracking-widest">Memuat Panel Pengendali...</div>;

  return (
    <PageWrapper>
      <div className="py-12 space-y-12 max-w-[90rem] mx-auto px-4">
        {/* Header & Statistik (Sama seperti sebelumnya) */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
          <SectionTitle title="Panel Bazaar" subtitle="Manajemen slot tenant dengan proteksi data user asli." className="text-left mb-0" />
          <Button onClick={handleExport} disabled={exporting} className="rounded-full px-8 py-6 font-bold shadow-xl shadow-primary/20 bg-primary hover:scale-105 transition-all gap-2">
            <Download size={20} /> Export Data Excel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card/40 border border-primary/30 rounded-3xl p-6 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-4">Total Pendapatan</p>
                <p className="text-3xl font-black text-foreground italic">Rp {stats.total_income.toLocaleString('id-ID')}</p>
            </Card>
            <Card className="bg-card/40 border border-accent/30 rounded-3xl p-6 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-4">Tenant Lunas</p>
                <p className="text-3xl font-black text-foreground italic">{stats.total_tenants} Pendaftar</p>
            </Card>
            <Card className="bg-card/40 border border-destructive/30 rounded-3xl p-6 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-4">Slot Tersedia</p>
                <p className="text-3xl font-black text-foreground italic">{stats.empty_stands} Stand</p>
            </Card>
        </div>

        {/* PENGENDALIAN STAND BERDASARKAN TIPE */}
        <Card className="bg-card/30 border border-border/60 rounded-3xl p-8">
          <div className="mb-8">
             <h3 className="font-black text-xl flex items-center gap-2 text-primary"><Settings2 size={24}/> Grid Kontrol Stand</h3>
             <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-[#c6ff33] rounded-full border border-primary/30" /> Tersedia</div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-orange-500 rounded-full" /> Tutup Manual</div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-blue-500 rounded-full" /> Daftar Manual</div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-destructive rounded-full" /> User Asli (Locked)</div>
             </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-4">
            {stands.map((stand) => (
              <button
                key={stand.id}
                onClick={() => { setManageStand(stand); setIsManageModalOpen(true); }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden group hover:scale-105 shadow-md ${
                  stand.status_type === 'real_user_paid' ? "bg-destructive/20 border-destructive" :
                  stand.status_type === 'manual_registered' ? "bg-blue-500/20 border-blue-500" :
                  stand.status_type === 'manual_locked' ? "bg-orange-500/20 border-orange-500" :
                  "bg-[#c6ff33]/20 border-primary/30 hover:border-primary hover:bg-[#c6ff33]"
                }`}
              >
                <span className={`text-2xl font-black ${
                    stand.status_type === 'real_user_paid' ? "text-destructive" :
                    stand.status_type === 'manual_registered' ? "text-blue-600" :
                    stand.status_type === 'manual_locked' ? "text-orange-600" : "text-primary"
                }`}>
                  {stand.stand_number}
                </span>
                {stand.status_type === 'real_user_paid' && <ShieldAlert size={12} className="absolute bottom-2 text-destructive" />}
                {stand.status_type === 'manual_registered' && <UserCheck size={12} className="absolute bottom-2 text-blue-600" />}
                {stand.status_type === 'manual_locked' && <Lock size={12} className="absolute bottom-2 text-orange-600" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Tabel Tenant Sukses (Sama seperti sebelumnya) */}
        <Card className="bg-card/50 border border-border/60 rounded-3xl overflow-hidden batik-border">
          <div className="p-6 bg-primary/5 border-b border-border flex items-center gap-2">
            <LayoutDashboard size={18} className="text-primary" />
            <p className="font-bold text-sm uppercase tracking-widest">Detail Pendaftar Lunas</p>
          </div>
          <div className="overflow-x-auto">
             {/* Tampilkan tabel participants dari API */}
             <table className="w-full text-sm text-left">
                <thead className="bg-background/50 text-accent uppercase font-black text-[11px]">
                    <tr><th className="px-8 py-5">Stand</th><th className="px-8 py-5">Waktu</th><th className="px-8 py-5">Brand</th><th className="px-8 py-5">Pendaftar</th><th className="px-8 py-5">Tipe</th></tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                    {participants.map(p => (
                        <tr key={p.id} className="hover:bg-primary/5">
                            <td className="px-8 py-6 font-black text-xl text-primary italic">#{p.stand?.stand_number}</td>
                            <td className="px-8 py-6 font-bold">{new Date(p.updated_at).toLocaleString('id-ID', {dateStyle:'short', timeStyle:'short'})}</td>
                            <td className="px-8 py-6"><p className="font-black uppercase">{p.tenant_name}</p></td>
                            <td className="px-8 py-6"><p className="font-bold">{p.pendaftar_name}</p><p className="text-xs text-muted-foreground">{p.phone}</p></td>
                            <td className="px-8 py-6">
                                <Badge className={p.midtrans_order_id.startsWith('MANUAL-') ? "bg-blue-500" : "bg-destructive"}>
                                    {p.midtrans_order_id.startsWith('MANUAL-') ? "MANUAL" : "USER ASLI"}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </Card>
      </div>

      {/* MODAL KENDALI CERDAS */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-2xl w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-primary border-b border-border/50 pb-4 mb-2">Kelola Stand #{manageStand?.stand_number}</DialogTitle>
          </DialogHeader>
          
          {/* KONDISI 1: LOCKED BY USER ASLI (TIDAK BISA DIUBAH SAMA SEKALI) */}
          {manageStand?.status_type === 'real_user_paid' && (
            <div className="space-y-6 py-10 text-center">
              <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-destructive/20 animate-pulse"><ShieldAlert size={48} /></div>
              <div>
                 <p className="text-2xl font-black text-foreground uppercase tracking-tight">Stand Terkunci Sistem</p>
                 <p className="text-muted-foreground mt-2 font-medium">Stand ini telah dibayar secara sah oleh user asli melalui portal publik.</p>
              </div>
              <div className="bg-background/50 border-2 border-destructive/30 p-6 rounded-2xl text-left">
                  <p className="text-xs font-black text-destructive uppercase mb-2">Detail Pemilik:</p>
                  <p className="font-black text-lg">{manageStand.booking_detail.tenant_name}</p>
                  <p className="text-sm font-bold text-muted-foreground">{manageStand.booking_detail.pendaftar_name} ({manageStand.booking_detail.phone})</p>
              </div>
              <Button disabled className="w-full py-8 text-lg rounded-xl opacity-50 cursor-not-allowed bg-muted text-muted-foreground font-black">AKSES DITUTUP OLEH SISTEM</Button>
            </div>
          )}

          {/* KONDISI 2: REGISTERED MANUAL (BISA DIBUKA KEMBALI) */}
          {manageStand?.status_type === 'manual_registered' && (
             <div className="space-y-6 py-6">
                <div className="flex items-center gap-4 bg-blue-500/10 p-6 rounded-2xl border-2 border-blue-500/30">
                    <UserCheck className="text-blue-500" size={32}/>
                    <div>
                        <p className="font-black text-blue-700 uppercase">Pendaftaran Manual</p>
                        <p className="text-xs font-bold text-blue-600/70 italic">Terdaftar atas nama {manageStand.booking_detail.tenant_name}</p>
                    </div>
                </div>
                <Button onClick={() => handleToggleStand(manageStand.id)} disabled={isProcessing} variant="outline" className="w-full border-blue-500 text-blue-600 font-bold py-7 text-lg rounded-xl hover:bg-blue-500 hover:text-white">
                   Batalkan & Buka Slot Ini
                </Button>
             </div>
          )}

          {/* KONDISI 3: TUTUP MANUAL (BISA LANGSUNG REGISTER) */}
          {manageStand?.status_type === 'manual_locked' && (
             <div className="space-y-6">
                <div className="bg-orange-500/10 border-2 border-orange-500/20 p-6 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="font-black text-orange-700 uppercase">Status: Tutup Manual</p>
                        <p className="text-xs text-orange-600">Stand ditutup sementara tanpa data pendaftar.</p>
                    </div>
                    <Button variant="outline" className="border-orange-500 text-orange-600 font-black" onClick={() => handleToggleStand(manageStand.id)}>BUKA KEMBALI</Button>
                </div>
                <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-4 text-muted-foreground font-black tracking-widest">Isi Data Untuk Daftar Manual</span></div></div>
                {renderManualForm()}
             </div>
          )}

          {/* KONDISI 4: AVAILABLE (KUNCI ATAU REGISTER) */}
          {manageStand?.status_type === 'available' && (
            <div className="space-y-6">
              <div className="bg-destructive/5 border border-destructive/20 p-5 rounded-xl flex justify-between items-center gap-4">
                <span className="text-sm font-bold text-destructive leading-tight">Hanya tutup sementara stand ini agar tidak bisa dipesan publik?</span>
                <Button variant="destructive" size="default" disabled={isProcessing} onClick={() => handleToggleStand(manageStand.id)} className="font-black">Kunci Slot</Button>
              </div>
              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-4 text-muted-foreground font-black tracking-widest">Atau Pendaftaran Manual</span></div></div>
              {renderManualForm()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );

  function renderManualForm() {
    return (
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
            <select value={manualForm.payment_method} onChange={e=>setManualForm({...manualForm, payment_method: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-background focus:ring-2 focus:ring-primary text-sm font-bold font-mono">
                <option value="CASH">💵 DIBAYAR CASH LUNAS</option>
                <option value="MANUAL_TRANSFER">💳 TRANSFER MANUAL PANITIA</option>
                <option value="UNDANGAN_FREE">🎁 GRATIS / UNDANGAN KHUSUS</option>
            </select>
            <Button type="submit" disabled={isProcessing} className="w-full mt-4 py-7 text-lg rounded-xl font-bold bg-accent hover:bg-accent/80 text-accent-foreground shadow-lg">
                {isProcessing ? "Menyimpan Data..." : "Simpan Pendaftaran Manual"}
            </Button>
        </form>
    );
  }
}