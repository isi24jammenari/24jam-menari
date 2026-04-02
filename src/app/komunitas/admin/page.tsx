"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import NonstopTab from "@/components/dashboard/admin/NonstopTab";

export default function KomunitasAdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Proteksi Lapis Baja: Wajib Login & Wajib Admin
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/komunitas/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token tidak valid");
        return res.json();
      })
      .then((data) => {
        if (data?.data?.role !== "admin") {
          alert("Akses ditolak. Dasbor ini khusus Admin.");
          localStorage.removeItem("access_token");
          router.replace("/auth/login");
          return;
        }
        setAdminUser(data.data);
        setIsLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        router.replace("/auth/login");
      });
  }, [router]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-lg">Pusat Komando Eksklusif,</p>
          <h1 className="text-tradisional text-4xl font-bold text-destructive leading-tight">
            Komunitas Non-Stop
          </h1>
          <p className="text-sm font-bold mt-1 text-foreground">Admin: {adminUser?.name}</p>
        </div>
        
        {/* TOMBOL JEMBATAN KEMBALI KE DASBOR UTAMA */}
        <button 
          onClick={() => router.push('/dashboard/admin')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground font-bold rounded-xl shadow-sm hover:bg-secondary/80 transition-all"
        >
          ← Kembali ke Dasbor Venue (Utama)
        </button>
      </div>

      {/* Konten Utama Tabel & Statistik Nonstop */}
      <div className="mt-8">
        <NonstopTab />
      </div>

    </PageWrapper>
  );
}