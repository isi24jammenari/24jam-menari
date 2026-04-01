"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import OverviewTab from "@/components/dashboard/admin/OverviewTab";
import RundownTab from "@/components/dashboard/admin/RundownTab";
import ManagementTab from "@/components/dashboard/admin/ManagementTab";
import { Badge } from "@/components/ui/badge";

type Tab = "overview" | "user" | "pengelolaan";

const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "user", label: "Rundown User", icon: "📋" },
  { id: "pengelolaan", label: "Pengelolaan", icon: "⚙️" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted-foreground text-lg">Panel Administrasi</p>
        <h1 className="text-tradisional text-4xl font-bold text-primary leading-tight">
          Dashboard Admin
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-px w-10 bg-accent opacity-60" />
          <span className="text-accent text-sm">✦</span>
          <span className="text-muted-foreground text-sm">
            24Jam Menari
          </span>
        </div>
      </div>

      {/* Tab Navigator */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-5 py-3 rounded-t-xl text-lg font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <Badge className="ml-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
                {tab.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "user" && <RundownTab />}
        {activeTab === "pengelolaan" && <ManagementTab />}
      </div>
    </PageWrapper>
  );
}