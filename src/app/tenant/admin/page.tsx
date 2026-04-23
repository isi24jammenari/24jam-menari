"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTenantAdminData, exportTenantCsv } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Participant {
  id: string;
  pendaftar_name: string;
  pendaftar_email: string;
  phone: string;
  tenant_name: string | null;
  product_type: string | null;
  status: string;
  stand: { stand_number: number } | null;
}

interface AdminStats {
  total_income: number;
  total_tenants: number;
  empty_stands: number;
}

export default function TenantAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({ total_income: 0, total_tenants: 0, empty_stands: 0 });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTenantAdminData();
      setStats(res.data.stats);
      setParticipants(res.data.participants);
    } catch (error: any) {
      alert("Akses Ditolak: Anda harus login sebagai Admin terlebih dahulu.");
      router.push("/auth/login"); // Tendang ke halaman login utama
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportTenantCsv();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#000000] flex items-center justify-center text-[#c6ff33] font-black uppercase tracking-widest">Memuat Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#000000] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#6849cf]/50 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#c6ff33] uppercase tracking-wider">Dashboard Panitia Tenant</h1>
            <p className="text-[#6849cf] text-sm font-bold uppercase tracking-widest mt-1">24 Jam Menari #20 - ISI Surakarta</p>
          </div>
          <Button 
            onClick={handleExport}
            disabled={exporting}
            className="bg-[#ff00cc] text-white hover:bg-[#6849cf] font-black uppercase rounded-none transition-all"
          >
            {exporting ? "MENYIAPKAN FILE..." : "DOWNLOAD CSV DATA"}
          </Button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#000000] border-[#c6ff33] rounded-none shadow-[0_0_15px_rgba(198,255,51,0.1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Pendapatan Bersih</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-[#c6ff33]">
                Rp {stats.total_income.toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#000000] border-[#ff00cc] rounded-none shadow-[0_0_15px_rgba(255,0,204,0.1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stand Lunas / Terisi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-[#ff00cc]">{stats.total_tenants} Tenant</p>
            </CardContent>
          </Card>
          <Card className="bg-[#000000] border-[#6849cf] rounded-none shadow-[0_0_15px_rgba(104,73,207,0.1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sisa Stand Kosong</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-[#6849cf]">{stats.empty_stands} Stand</p>
            </CardContent>
          </Card>
        </div>

        {/* DATA TABLE */}
        <Card className="bg-[#000000] border-2 border-[#6849cf] rounded-none">
          <CardHeader className="border-b border-[#6849cf]/30 bg-[#6849cf]/10">
            <CardTitle className="text-[#c6ff33] uppercase tracking-widest">Daftar Tenant Terverifikasi</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#ff00cc] uppercase bg-black border-b border-[#6849cf]">
                <tr>
                  <th className="px-6 py-4">Stand</th>
                  <th className="px-6 py-4">Brand / Produk</th>
                  <th className="px-6 py-4">Identitas Pendaftar</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-bold uppercase tracking-widest">
                      Belum ada tenant yang lunas
                    </td>
                  </tr>
                ) : (
                  participants.map((p, index) => (
                    <tr key={p.id} className={`border-b border-[#6849cf]/20 ${index % 2 === 0 ? 'bg-[#6849cf]/5' : 'bg-black'} hover:bg-[#6849cf]/20 transition-colors`}>
                      <td className="px-6 py-4 font-black text-2xl text-white">
                        #{p.stand?.stand_number}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#c6ff33] uppercase">{p.tenant_name || <span className="text-gray-500 italic">Belum Isi Form</span>}</p>
                        <p className="text-xs text-gray-400 uppercase">{p.product_type || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{p.pendaftar_name}</p>
                        <p className="text-xs text-[#6849cf]">{p.pendaftar_email}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-[#ff00cc]">
                        {p.phone}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-[#c6ff33] text-black hover:bg-[#c6ff33] rounded-none uppercase font-black text-[10px]">
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}