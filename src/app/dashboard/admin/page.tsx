"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import OverviewTab from "@/components/dashboard/admin/OverviewTab";
import ParticipantsTab from "@/components/dashboard/admin/ParticipantsTab";
import RundownTab from "@/components/dashboard/admin/RundownTab";
import ManagementTab from "@/components/dashboard/admin/ManagementTab";
import CertificateTab from "@/components/dashboard/admin/CertificateTab"; 

type Tab = "overview" | "peserta" | "rundown" | "pengelolaan" | "sertifikat";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("access_token");
          router.replace("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.data) {
          if (data.data.role !== "admin") {
            alert("Akses ditolak. Anda bukan admin.");
            localStorage.removeItem("access_token");
            router.replace("/auth/login");
            return;
          }
          setAdminUser(data.data);
        }
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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview & Mutasi", icon: "📊" },
    { id: "peserta", label: "Data Diri Penari", icon: "👥" },
    { id: "rundown", label: "Rundown", icon: "⏱️" },
    { id: "pengelolaan", label: "Pengelolaan", icon: "⚙️" },
    { id: "sertifikat", label: "E-Sertifikat", icon: "🎓" },
  ];

  return (
    <PageWrapper>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-lg">Portal Manajemen Utama,</p>
          <h1 className="text-tradisional text-4xl font-bold text-primary leading-tight">
            {adminUser?.name ?? "Admin"}
          </h1>
        </div>

        {/* TOMBOL JEMBATAN KE DASBOR KOMUNITAS */}
        <button 
          onClick={() => router.push('/komunitas/admin')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-destructive text-white font-black rounded-xl shadow-lg hover:bg-destructive/90 transition-all hover:scale-105"
        >
          🔥 Buka Dasbor Penari Non-Stop →
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border pb-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "peserta" && <ParticipantsTab />} 
        {activeTab === "rundown" && <RundownTab />}
        {activeTab === "pengelolaan" && <ManagementTab />}
        {activeTab === "sertifikat" && <CertificateTab />}
      </div>
    </PageWrapper>
  );
}