"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import ScheduleTab from "@/components/dashboard/user/ScheduleTab";
import FormTab from "@/components/dashboard/user/FormTab";
import { useBookingStore } from "@/lib/store/bookingStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Simulasi: admin menolak permintaan pindah slot
const MOCK_REJECTION = true;

type Tab = "jadwal" | "formulir";

export default function UserDashboardPage() {
  const router = useRouter();
  const { paymentStatus, userName, selectedVenueName, selectedSlotTime } =
    useBookingStore();

  const [activeTab, setActiveTab] = useState<Tab>("jadwal");
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);

  // Guard
  useEffect(() => {
    if (paymentStatus !== "success") {
      router.replace("/");
    }
  }, [paymentStatus, router]);

  // Simulasi popup penolakan dari admin
  useEffect(() => {
    if (MOCK_REJECTION) {
      const timer = setTimeout(() => setShowRejectionPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (paymentStatus !== "success") return null;

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
          {userName}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-px w-10 bg-accent opacity-60" />
          <span className="text-accent text-sm">✦</span>
          <span className="text-muted-foreground text-sm">
            {selectedVenueName} · {selectedSlotTime}
          </span>
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

      {/* Popup: Penolakan Pindah Slot oleh Admin */}
      <Dialog open={showRejectionPopup} onOpenChange={setShowRejectionPopup}>
        <DialogContent className="text-center max-w-md">
          <DialogHeader>
            <DialogTitle className="text-tradisional text-2xl text-destructive">
              ❌ Permintaan Tidak Disetujui
            </DialogTitle>
            <DialogDescription className="text-base mt-2 space-y-2">
              <span className="block">
                Permintaan pindah slot Anda{" "}
                <strong>tidak disetujui</strong> oleh panitia.
              </span>
              <span className="block text-muted-foreground">
                Slot penampilan Anda tetap di:
              </span>
              <div className="bg-muted rounded-lg px-4 py-3 text-left space-y-1">
                <p className="font-semibold text-foreground">
                  {selectedVenueName}
                </p>
                <p className="text-muted-foreground">{selectedSlotTime}</p>
              </div>
              <span className="block text-sm text-muted-foreground">
                Jika ada pertanyaan, silakan hubungi panitia secara langsung.
              </span>
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowRejectionPopup(false)}
            className="w-full mt-2 text-lg py-6"
          >
            Mengerti
          </Button>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
