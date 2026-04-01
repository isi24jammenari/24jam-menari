"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/data/venues";
import { useBookingStore } from "@/lib/store/bookingStore";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function ScheduleTab() {
  const { venues, fetchVenues } = useBookingStore();
  
  // State baru untuk menyimpan data asli dari database
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Tarik daftar semua venue (untuk global map)
    if (venues.length === 0) fetchVenues();

    // 2. Tarik jadwal spesifik milik user yang login dari API backend
    const fetchMySchedule = async () => {
      try {
        const res = await api.get('/user/schedule');
        if (res.data && res.data.data) {
          setMyBookings(res.data.data);
        }
      } catch (error) {
        console.error("Gagal menarik data jadwal user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMySchedule();
  }, [venues.length, fetchVenues]);

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground py-10">Memuat jadwal Anda...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Slot milik user dari Database Asli */}
      <div className="space-y-4">
        <h3 className="text-tradisional text-2xl font-bold text-primary">
          Slot Penampilan Anda
        </h3>
        {myBookings.length > 0 ? (
          myBookings.map((booking) => {
            // Laravel mereturn relasi camelCase menjadi snake_case by default, kita handle keduanya agar aman
            const timeSlot = booking.time_slot || booking.timeSlot;
            const venueName = timeSlot?.venue?.name || "Venue Tidak Diketahui";
            const timeRange = timeSlot?.time_range || timeSlot?.time || "Waktu Tidak Diketahui";

            return (
              <div key={booking.id} className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl">🎭</span>
                  <div>
                    <p className="text-2xl font-bold text-primary">{venueName}</p>
                    <p className="text-lg text-foreground">{timeRange}</p>
                  </div>
                  <Badge className="ml-auto bg-primary text-primary-foreground text-sm px-3 py-1">
                    ✓ Terkunci & Lunas
                  </Badge>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5 text-destructive font-medium">
            Anda belum memiliki jadwal penampilan yang terkunci.
          </div>
        )}
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
                  {venue.festivalName || "Festival 24 Jam Menari"}
                </span>
                <span className="ml-auto text-sm text-muted-foreground font-medium">
                  {venue.slots?.filter((s: any) => !s.isBooked).length || 0} slot tersedia
                </span>
              </div>

              {/* Grid slot */}
              <div className="bg-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {venue.slots?.map((slot: any) => {
                  // Cek apakah slot ini dibooking oleh user yang sedang login
                  const isMySlot = myBookings.some((b) => b.time_slot_id === slot.id || (b.time_slot && b.time_slot.id === slot.id));
                  const isBooked = slot.isBooked;

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
                        {slot.time || slot.time_range}
                      </p>

                      {/* Status */}
                      {isMySlot ? (
                        <p className="text-xs mt-0.5 text-primary-foreground/80 font-medium">
                          ★ Slot Anda
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