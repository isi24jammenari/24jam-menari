"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import ScheduleTab from "@/components/dashboard/user/ScheduleTab";
import FormTab from "@/components/dashboard/user/FormTab";
import DocumentsTab from "@/components/dashboard/user/DocumentsTab";

type Tab = "jadwal" | "formulir" | "dokumen";

export default function UserDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("formulir"); // Default langsung ke formulir
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [formStatus, setFormStatus] = useState<"empty" | "draft" | "completed">("empty");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
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
        if (!data) return;
        if (data?.data) {
          setUser(data.data);
        }
        // Chain fetch untuk cek status form (Gatekeeper)
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/schedule`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
      })
      .then((res) => (res ? res.json() : null))
      .then((scheduleData) => {
        if (scheduleData?.data?.[0]) {
          const status = scheduleData.data[0].performance?.status || "empty";
          setFormStatus(status);
          if (status === "completed") {
            setActiveTab("jadwal"); // Jika sudah beres, default ke jadwal
          }
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
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Memuat dashboard...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "jadwal", label: "Jadwal & Venue", icon: "📅" },
    { id: "formulir", label: "Formulir", icon: "📋" },
    { id: "dokumen", label: "Dokumen", icon: "📁" },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted-foreground text-lg">Selamat datang kembali,</p>
        <h1 className="text-tradisional text-4xl font-bold text-primary leading-tight">
          {user?.name ?? "—"}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-px w-10 bg-accent opacity-60" />
          <span className="text-accent text-sm">✦</span>
        </div>
      </div>

      {/* Tab Navigator */}
      <div className="flex gap-2 mb-8 border-b border-border pb-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          // Kunci tab dokumen jika form belum completed
          const isLocked = tab.id === "dokumen" && formStatus !== "completed";

          return (
            <button
              key={tab.id}
              onClick={() => !isLocked && setActiveTab(tab.id)}
              disabled={isLocked}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : isLocked
                  ? "text-muted-foreground/40 cursor-not-allowed bg-muted/50"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              {isLocked && <span className="text-sm">🔒</span>}
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "jadwal" && <ScheduleTab />}
        {activeTab === "formulir" && <FormTab />}
        {activeTab === "dokumen" && <DocumentsTab />}
      </div>
    </PageWrapper>
  );
}