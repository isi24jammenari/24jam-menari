"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import { getTenantAdminData, exportTenantCsv } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Download, Store, Users, Wallet } from "lucide-react";

export default function TenantAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({ total_income: 0, total_tenants: 0, empty_stands: 0 });
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTenantAdminData();
        setStats(res.data.stats);
        setParticipants(res.data.participants);
      } catch (e) {
        alert("Akses Ditolak. Mohon Login Admin.");
        router.push("/auth/login");
      } finally { setLoading(false); }
    };
    fetchData();
  }, [router]);

  const handleExport = async () => {
    setExporting(true);
    try { await exportTenantCsv(); } 
    catch (e: any) { alert(e.message); } 
    finally { setExporting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse font-bold uppercase">Memuat Data Panel...</div>;

  return (
    <PageWrapper>
      <div className="py-12 space-y-12">
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-10">
          <SectionTitle 
            title="Panel Bazaar" 
            subtitle="Pantau pendapatan dan manajemen slot tenant secara real-time."
            className="text-left mb-0"
          />
          <Button 
            onClick={handleExport}
            disabled={exporting}
            className="rounded-full px-8 py-6 font-bold shadow-xl shadow-primary/20 bg-primary hover:scale-105 transition-all gap-2"
          >
            <Download size={20} />
            {exporting ? "Mengekspor..." : "Export Data Tenant"}
          </Button>
        </div>

        {/* Statistik Berbasis Kartu Melengkung */}
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

        {/* Tabel Tenant Gaya Profesional */}
        <Card className="bg-card/50 border border-border/60 rounded-3xl overflow-hidden batik-border">
          <div className="p-6 bg-primary/5 border-b border-border flex items-center gap-2">
            <LayoutDashboard size={18} className="text-primary" />
            <p className="font-bold text-sm uppercase tracking-widest">Daftar Pendaftar Terverifikasi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 text-accent uppercase font-black text-[11px] tracking-tighter">
                <tr>
                  <th className="px-8 py-5">Stand</th>
                  <th className="px-8 py-5">Brand & Produk</th>
                  <th className="px-8 py-5">Identitas Pendaftar</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {participants.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-muted-foreground font-bold italic">Belum ada tenant yang lunas.</td></tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-6 font-black text-4xl text-primary/40 group-hover:text-primary transition-colors italic">#{p.stand?.stand_number}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-foreground text-lg uppercase leading-none mb-1">{p.tenant_name || "BELUM ISI FORM"}</p>
                        <p className="text-xs text-muted-foreground font-medium italic">{p.product_type || "-"}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-foreground">{p.pendaftar_name}</p>
                        <p className="text-xs text-primary font-mono">{p.phone}</p>
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
    </PageWrapper>
  );
}