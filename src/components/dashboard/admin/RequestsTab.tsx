"use client";

import { useState } from "react";
import { venues, formatPrice } from "@/lib/data/venues";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type RequestStatus = "pending" | "approved_payment" | "approved_refund" | "rejected";

type MoveRequest = {
  id: string;
  userName: string;
  fromVenue: string;
  fromSlot: string;
  fromPrice: number;
  toVenueId: string;
  toSlotId: string;
  toVenue: string;
  toSlot: string;
  toPrice: number;
  alasan: string;
  status: RequestStatus;
};

const MOCK_REQUESTS: MoveRequest[] = [
  {
    id: "req-001",
    userName: "Sanggar Sekar Jawi",
    fromVenue: "Pendopo",
    fromSlot: "09.00 – 09.20",
    fromPrice: 750000,
    toVenueId: "teater-besar",
    toSlotId: "tb-2000",
    toVenue: "Teater Besar",
    toSlot: "20.00 – 20.30",
    toPrice: 1250000,
    alasan: "Ingin tampil di panggung yang lebih besar untuk koreografi kami.",
    status: "pending",
  },
  {
    id: "req-002",
    userName: "Tari Nusantara Group",
    fromVenue: "Teater Besar",
    fromSlot: "21.00 – 21.30",
    fromPrice: 1250000,
    toVenueId: "pendopo",
    toSlotId: "pendopo-1300",
    toVenue: "Pendopo",
    toSlot: "13.00 – 13.20",
    toPrice: 750000,
    alasan: "Peserta kami banyak yang lansia, lebih nyaman di sore hari.",
    status: "pending",
  },
];

export default function RequestsTab() {
  const [requests, setRequests] = useState<MoveRequest[]>(MOCK_REQUESTS);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    request: MoveRequest | null;
    action: "approve" | "reject" | null;
  }>({ open: false, request: null, action: null });

  const handleAction = (req: MoveRequest, action: "approve" | "reject") => {
    setConfirmDialog({ open: true, request: req, action });
  };

  const handleConfirm = () => {
    const { request, action } = confirmDialog;
    if (!request || !action) return;

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== request.id) return r;
        if (action === "reject") return { ...r, status: "rejected" };
        if (action === "approve") {
          return {
            ...r,
            status:
              r.toPrice > r.fromPrice
                ? "approved_payment"
                : "approved_refund",
          };
        }
        return r;
      })
    );
    setConfirmDialog({ open: false, request: null, action: null });
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  const statusLabel: Record<RequestStatus, { label: string; color: string }> = {
    pending: { label: "Menunggu", color: "bg-accent/10 text-accent" },
    approved_payment: { label: "Disetujui — Menunggu Pembayaran", color: "bg-primary/10 text-primary" },
    approved_refund: { label: "Disetujui — Menunggu Refund", color: "bg-primary/10 text-primary" },
    rejected: { label: "Ditolak", color: "bg-destructive/10 text-destructive" },
  };

  const RequestCard = ({ req }: { req: MoveRequest }) => {
    const priceDiff = req.toPrice - req.fromPrice;
    const isPending = req.status === "pending";

    return (
      <Card className="batik-border border-0">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-lg font-bold text-foreground">{req.userName}</p>
              <p className="text-sm text-muted-foreground">#{req.id}</p>
            </div>
            <span
              className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                statusLabel[req.status].color
              }`}
            >
              {statusLabel[req.status].label}
            </span>
          </div>

          {/* Dari → Ke */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Dari
              </p>
              <p className="font-semibold text-foreground">{req.fromVenue}</p>
              <p className="text-sm text-muted-foreground">{req.fromSlot}</p>
              <p className="text-sm font-medium text-accent mt-1">
                {formatPrice(req.fromPrice)}
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Ke
              </p>
              <p className="font-semibold text-foreground">{req.toVenue}</p>
              <p className="text-sm text-muted-foreground">{req.toSlot}</p>
              <p className="text-sm font-medium text-accent mt-1">
                {formatPrice(req.toPrice)}
              </p>
            </div>
          </div>

          {/* Selisih harga */}
          {priceDiff !== 0 && (
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                priceDiff > 0
                  ? "bg-primary/10 text-primary"
                  : "bg-accent/10 text-accent"
              }`}
            >
              <span>{priceDiff > 0 ? "💳" : "💰"}</span>
              {priceDiff > 0
                ? `User perlu membayar tambahan ${formatPrice(priceDiff)}`
                : `User akan mendapat pengembalian dana ${formatPrice(Math.abs(priceDiff))}`}
            </div>
          )}

          {/* Alasan */}
          {req.alasan && (
            <div className="text-sm text-muted-foreground italic border-l-2 border-accent pl-3">
              "{req.alasan}"
            </div>
          )}

          {/* Tombol aksi */}
          {isPending && (
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() => handleAction(req, "reject")}
                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
              >
                ✕ Tolak
              </Button>
              <Button
                onClick={() => handleAction(req, "approve")}
                className="flex-1"
              >
                ✓ Setujui
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Pending */}
      <div>
        <h3 className="text-tradisional text-2xl font-bold text-primary mb-4">
          Menunggu Keputusan{" "}
          {pendingRequests.length > 0 && (
            <Badge className="ml-2 bg-accent text-accent-foreground text-sm">
              {pendingRequests.length}
            </Badge>
          )}
        </h3>
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-lg">
            Tidak ada permintaan yang menunggu.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <RequestCard key={req.id} req={req} />
            ))}
          </div>
        )}
      </div>

      {/* Sudah diproses */}
      {processedRequests.length > 0 && (
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary mb-4">
            Sudah Diproses
          </h3>
          <div className="space-y-4">
            {processedRequests.map((req) => (
              <RequestCard key={req.id} req={req} />
            ))}
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(o) =>
          setConfirmDialog((p) => ({ ...p, open: o }))
        }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-tradisional text-2xl text-primary">
              {confirmDialog.action === "approve"
                ? "✓ Setujui Permintaan?"
                : "✕ Tolak Permintaan?"}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {confirmDialog.action === "approve" && confirmDialog.request && (
                <>
                  {confirmDialog.request.toPrice >
                  confirmDialog.request.fromPrice ? (
                    <span>
                      Slot baru lebih mahal. User akan diminta membayar selisih{" "}
                      <strong>
                        {formatPrice(
                          confirmDialog.request.toPrice -
                            confirmDialog.request.fromPrice
                        )}
                      </strong>{" "}
                      dalam <strong>12 jam</strong>.
                    </span>
                  ) : confirmDialog.request.toPrice <
                    confirmDialog.request.fromPrice ? (
                    <span>
                      Slot baru lebih murah. User akan mendapat pengembalian dana{" "}
                      <strong>
                        {formatPrice(
                          confirmDialog.request.fromPrice -
                            confirmDialog.request.toPrice
                        )}
                      </strong>
                      . Konfirmasi kepada user bahwa refund menunggu pengumuman
                      resmi.
                    </span>
                  ) : (
                    <span>
                      Harga sama. Slot akan langsung dipindahkan.
                    </span>
                  )}
                </>
              )}
              {confirmDialog.action === "reject" && (
                <span>
                  Permintaan akan ditolak dan user akan mendapat notifikasi
                  di dashboardnya.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, request: null, action: null })
              }
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 ${
                confirmDialog.action === "reject"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }`}
            >
              Ya, {confirmDialog.action === "approve" ? "Setujui" : "Tolak"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
