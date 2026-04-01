"use client";

import { formatPrice } from "@/lib/data/venues";
import { useBookingStore } from "@/lib/store/bookingStore";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export default function ScheduleTab() {
  const { venues, fetchVenues, selectedVenueId, selectedSlotId, selectedVenueName, selectedSlotTime } =
    useBookingStore();

  useEffect(() => {
    if (venues.length === 0) fetchVenues();
  }, [venues.length, fetchVenues]);

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
              <div className="bg-card px-5 py-3 border-b border-border flex items-center flex-wrap gap-3">
                <span className="text-tradisional text-lg font-bold text-primary">
                  {venue.name}
                </span>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {venue.festivalName}
                </span>
                <span className="ml-auto text-sm text-muted-foreground font-medium">
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
    </div>
  );
}