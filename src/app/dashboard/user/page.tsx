// src/app/dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import ScheduleTab from "@/components/dashboard/user/ScheduleTab";
import FormTab from "@/components/dashboard/user/FormTab";

type Tab = "jadwal" | "formulir";

export default function UserDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("jadwal");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // ✅ FIX 4: Redirect ke /?login=true — bukan /login yang tidak ada
      router.replace("/?login=true");
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
          // Token invalid/expired — hapus token lama, arahkan ke dialog login
          localStorage.removeItem("access_token");
          // ✅ FIX 4: Sama — redirect ke homepage dengan dialog login terbuka
          router.replace("/?login=true");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data?.data) {
          setUser(data.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        // Network error — redirect ke login juga
        localStorage.removeItem("access_token");
        router.replace("/?login=true");
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
      <div className="flex gap-2 mb-8 border-b border-border pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-lg font-semibold transition-all ${
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

      {/* Tab Content */}
      <div>
        {activeTab === "jadwal" && <ScheduleTab />}
        {activeTab === "formulir" && <FormTab />}
      </div>
    </PageWrapper>
  );
}