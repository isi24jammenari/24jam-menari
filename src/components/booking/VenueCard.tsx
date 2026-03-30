"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/bookingStore";
import { Venue, formatPrice } from "@/lib/data/venues";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const router = useRouter();
  const { selectVenue } = useBookingStore();

  const availableSlots = venue.slots.filter((s) => !s.isBooked).length;
  const totalSlots = venue.slots.length;
  const isFull = availableSlots === 0;
  // Ambil harga dari slot pertama sebagai representasi harga paket
  const price = venue.slots[0]?.price || 0;

  const handlePilih = () => {
    selectVenue(venue.id, venue.name);
    router.push(`/booking/${venue.id}`);
  };

  return (
    <div className="batik-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Card className="border-0 bg-card h-full">
        <CardContent className="p-6 flex flex-col gap-4 h-full">
          {/* Nama Venue & Festival */}
          <div>
            <h3 className="text-tradisional text-xl md:text-2xl font-bold text-foreground">
              {venue.name}
            </h3>
            <p className="text-lg font-bold text-primary tracking-widest mt-1">
              {venue.festivalName}
            </p>
          </div>

          {/* Harga */}
          <div className="text-2xl font-bold text-accent">
            {formatPrice(price)}
          </div>

          {/* Fasilitas Venue (Ringkas) */}
          <ul className="text-sm text-muted-foreground space-y-1.5 flex-1 mt-2">
            {venue.venueFacilities.slice(0, 4).map((fasilitas, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span className="leading-tight">{fasilitas}</span>
              </li>
            ))}
            {venue.venueFacilities.length > 4 && (
              <li className="text-xs italic mt-1">+ fasilitas lainnya...</li>
            )}
          </ul>

          {/* Ketersediaan slot */}
          <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 mt-4">
            <span className="text-sm text-muted-foreground">Slot tersedia</span>
            <span
              className={`text-lg font-bold ${
                isFull ? "text-destructive" : "text-primary"
              }`}
            >
              {availableSlots}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {totalSlots}
              </span>
            </span>
          </div>

          {/* Tombol */}
          <div className="mt-2 pt-2">
            <Button
              onClick={handlePilih}
              disabled={isFull}
              className="w-full text-lg py-6 font-semibold"
              size="lg"
            >
              {isFull ? "Slot Penuh" : "Pilih Venue Ini →"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}