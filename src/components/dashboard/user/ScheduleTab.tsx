"use client";

import { venues } from "@/lib/data/venues";
import { formatPrice } from "@/lib/data/venues";
import { useBookingStore } from "@/lib/store/bookingStore";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ScheduleTab() {
  const { selectedVenueId, selectedSlotId, selectedVenueName, selectedSlotTime } =
    useBookingStore();
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [moveSubmitted, setMoveSubmitted] = useState(false);
  const [moveForm, setMoveForm] = useState({
    venueId: "",
    slotId: "",
    alasan: "",
  });

  const selectedMoveVenue = venues.find((v) => v.id === moveForm.venueId);

  const handleSubmitMove = () => {
    if (!moveForm.venueId || !moveForm.slotId) return;
    setMoveSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* Slot milik user */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Slot Penampilan Anda
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-4xl">🎭</span>
          <div>
            <p className="text-2xl font-bold text-primary">{selectedVenueName}</p>
            <p className="text-lg text-foreground">{selectedSlotTime}</p>
          </div>
          <Badge className="ml-auto bg-primary text-primary-foreground text-sm px-3 py-1">
            ✓ Terkunci
          </Badge>
        </div>
        <button
          onClick={() => { setShowMoveDialog(true); setMoveSubmitted(false); }}
          className="mt-4 text-sm text-accent underline underline-offset-4 hover:text-primary transition-colors"
        >
          Ingin pindah jam/venue? Cek ketersediaan
        </button>
      </div>

      {/* Jadwal seluruh venue */}
      <div>
        <h3 className="text-tradisional text-2xl font-bold text-primary mb-5">
          Jadwal Seluruh Venue
        </h3>
        <div className="space-y-6">
          {venues.map((venue) => (
            <div key={venue.id} className="batik-border rounded-xl overflow-hidden">
              {/* Header venue */}
              <div className="bg-card px-5 py-3 border-b border-border flex items-center gap-3">
                <span className="text-2xl">{venue.icon}</span>
                <span className="text-tradisional text-lg font-bold text-primary">
                  {venue.name}
                </span>
                <span className="ml-auto text-sm text-muted-foreground">
                  {venue.slots.filter((s) => !s.isBooked).length} slot tersedia
                </span>
              </div>

              {/* Grid slot */}
              <div className="bg-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {venue.slots.map((slot) => {
                  const isMySlot =
                    venue.id === selectedVenueId && slot.id === selectedSlotId;
                  const isBooked = slot.isBooked;
                  const nama = slot.registrant?.nama;

                  return (
                    <div
                      key={slot.id}
                      className={`rounded-lg px-3 py-2.5 border transition-colors ${
                        isMySlot
                          ? "bg-primary text-primary-foreground border-primary"
                          : isBooked
                          ? "bg-muted/60 text-muted-foreground border-border"
                          : "bg-background text-foreground border-border"
                      }`}
                    >
                      {/* Jam */}
                      <p className={`font-bold text-base leading-tight ${
                        isMySlot ? "text-primary-foreground" : "text-foreground"
                      }`}>
                        {slot.time}
                      </p>

                      {/* Nama sanggar / status */}
                      {isMySlot ? (
                        <p className="text-xs mt-0.5 text-primary-foreground/80 font-medium">
                          ★ Slot Anda
                        </p>
                      ) : isBooked && nama ? (
                        <p className="text-xs mt-0.5 text-muted-foreground truncate" title={nama}>
                          {nama}
                        </p>
                      ) : isBooked ? (
                        <p className="text-xs mt-0.5 text-muted-foreground italic">
                          Terisi
                        </p>
                      ) : (
                        <p className="text-xs mt-0.5 text-accent font-medium">
                          {formatPrice(slot.price)} · Tersedia
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog Pindah Slot */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-tradisional text-2xl text-primary">
              Permintaan Pindah Slot
            </DialogTitle>
            <DialogDescription className="text-base">
              Pilih venue dan jam baru yang Anda inginkan. Permintaan akan
              ditinjau oleh admin.
            </DialogDescription>
          </DialogHeader>

          {moveSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <span className="text-5xl">📨</span>
              <p className="text-lg font-semibold text-primary">
                Permintaan Terkirim!
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Permintaan pindah slot Anda sedang ditinjau oleh admin.
                Anda akan mendapat notifikasi di dashboard jika sudah ada
                keputusan.
              </p>
              <Button onClick={() => setShowMoveDialog(false)} className="w-full mt-2">
                Tutup
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="bg-muted rounded-lg px-4 py-3 text-sm">
                <span className="text-muted-foreground">Slot saat ini: </span>
                <span className="font-semibold text-foreground">
                  {selectedVenueName} — {selectedSlotTime}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-base font-semibold block">
                  Venue Baru <span className="text-destructive">*</span>
                </label>
                <select
                  value={moveForm.venueId}
                  onChange={(e) =>
                    setMoveForm((p) => ({ ...p, venueId: e.target.value, slotId: "" }))
                  }
                  className="w-full text-base px-4 py-3 rounded-xl border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">— Pilih venue —</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.icon} {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMoveVenue && (
                <div className="space-y-2">
                  <label className="text-base font-semibold block">
                    Jam Baru <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={moveForm.slotId}
                    onChange={(e) =>
                      setMoveForm((p) => ({ ...p, slotId: e.target.value }))
                    }
                    className="w-full text-base px-4 py-3 rounded-xl border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">— Pilih jam —</option>
                    {selectedMoveVenue.slots
                      .filter((s) => !s.isBooked && s.id !== selectedSlotId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.time} — {formatPrice(s.price)}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-base font-semibold block">
                  Alasan Pindah
                </label>
                <textarea
                  value={moveForm.alasan}
                  onChange={(e) =>
                    setMoveForm((p) => ({ ...p, alasan: e.target.value }))
                  }
                  placeholder="Tuliskan alasan Anda ingin pindah slot (opsional)"
                  rows={3}
                  className="w-full text-base px-4 py-3 rounded-xl border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowMoveDialog(false)} className="flex-1">
                  Batal
                </Button>
                <Button
                  onClick={handleSubmitMove}
                  disabled={!moveForm.venueId || !moveForm.slotId}
                  className="flex-1"
                >
                  Kirim Permintaan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
