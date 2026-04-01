"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/data/venues";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";

type OverviewData = {
  total_revenue: number;
  total_slots: number;
  booked_slots: number;
  occupancy_rate: number;
  data_completion: {
    completed: number;
    draft: number;
    empty: number;
    total_need_action: number;
  };
};

export default function OverviewTab() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/admin/overview');
        setData(res.data.data);
      } catch (error) {
        console.error("Gagal menarik data overview admin:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10 animate-pulse text-muted-foreground">Memuat statistik...</div>;
  }

  if (!data) return null;

  const totalEmptySlots = data.total_slots - data.booked_slots;

  return (
    <div className="space-y-8">
      {/* Kartu Ringkasan Penjualan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="batik-border border-0 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-sm font-bold text-primary uppercase tracking-wide">
              Total Pendapatan
            </p>
            <p className="text-3xl font-black text-primary mt-1">
              {formatPrice(data.total_revenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Dari {data.booked_slots} transaksi sukses
            </p>
          </CardContent>
        </Card>

        <Card className="batik-border border-0">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Total Slot Terisi
            </p>
            <p className="text-3xl font-bold text-accent mt-1">
              {data.booked_slots}
              <span className="text-base font-normal text-muted-foreground">
                {" "}/ {data.total_slots}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.occupancy_rate}% Occupancy Rate
            </p>
          </CardContent>
        </Card>

        <Card className="batik-border border-0">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Slot Masih Kosong
            </p>
            <p className="text-3xl font-bold text-secondary mt-1">
              {totalEmptySlots}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              slot belum terjual
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-6 mt-8 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
        <h3 className="text-accent tracking-widest uppercase text-sm font-bold">Status Data Peserta</h3>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
      </div>

      {/* ✅ 1. Tambahan Baru: Kartu Ringkasan Status Kelengkapan Data */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center">
            <p className="text-4xl font-black text-primary">{data.data_completion.completed}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Data Final (Siap)</p>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center">
            <p className="text-4xl font-black text-accent">{data.data_completion.draft}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Status Draft</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center">
            <p className="text-4xl font-black text-destructive">{data.data_completion.empty}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Belum Isi Form</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 bg-accent/5 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center">
            <p className="text-4xl font-black text-accent">{data.data_completion.total_need_action}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-accent mt-1">Butuh Tindakan (Follow Up)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}