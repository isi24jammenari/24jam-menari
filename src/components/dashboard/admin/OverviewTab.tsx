"use client";

import { venues, formatPrice } from "@/lib/data/venues";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OverviewTab() {
  const venueStats = venues.map((venue) => {
    const totalSlots = venue.slots.length;
    const bookedSlots = venue.slots.filter((s) => s.isBooked).length;
    const emptySlots = totalSlots - bookedSlots;
    const revenue = venue.slots
      .filter((s) => s.isBooked)
      .reduce((acc, s) => acc + s.price, 0);
    const fillPercent = Math.round((bookedSlots / totalSlots) * 100);
    return { venue, totalSlots, bookedSlots, emptySlots, revenue, fillPercent };
  });

  const totalRevenue = venueStats.reduce((a, v) => a + v.revenue, 0);
  const totalBooked = venueStats.reduce((a, v) => a + v.bookedSlots, 0);
  const totalSlots = venueStats.reduce((a, v) => a + v.totalSlots, 0);
  const totalEmpty = venueStats.reduce((a, v) => a + v.emptySlots, 0);

  return (
    <div className="space-y-8">
      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="batik-border border-0">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Total Pendapatan
            </p>
            <p className="text-3xl font-bold text-primary mt-1">
              {formatPrice(totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBooked} transaksi berhasil
            </p>
          </CardContent>
        </Card>

        <Card className="batik-border border-0">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Total Slot Terisi
            </p>
            <p className="text-3xl font-bold text-accent mt-1">
              {totalBooked}
              <span className="text-base font-normal text-muted-foreground">
                {" "}/ {totalSlots}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              dari seluruh venue
            </p>
          </CardContent>
        </Card>

        <Card className="batik-border border-0">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Slot Masih Kosong
            </p>
            <p className="text-3xl font-bold text-secondary mt-1">
              {totalEmpty}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              slot belum terdaftar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detail per venue */}
      <div className="space-y-4">
        <h3 className="text-tradisional text-2xl font-bold text-primary">
          Status Per Venue
        </h3>
        {venueStats.map(({ venue, totalSlots, bookedSlots, emptySlots, revenue, fillPercent }) => (
          <Card key={venue.id} className="batik-border border-0">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-tradisional text-lg font-bold text-primary">
                        {venue.name}
                      </p>
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {venue.festivalName}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {bookedSlots} terisi · {emptySlots} kosong
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-accent">
                    {formatPrice(revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">pendapatan venue ini</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tingkat pengisian</span>
                  <span>{fillPercent || 0}%</span>
                </div>
                <Progress value={fillPercent || 0} className="h-3" />
              </div>

              {/* Grid slot mini dengan nama */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {venue.slots.map((slot) => (
                  <span
                    key={slot.id}
                    title={slot.isBooked ? `${slot.time} — ${slot.registrant?.nama ?? "Terisi"}` : slot.time}
                    className={`text-xs px-2 py-0.5 rounded-md border font-medium cursor-default ${
                      slot.isBooked
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border"
                    }`}
                  >
                    {slot.time.split("–")[0].trim()}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}