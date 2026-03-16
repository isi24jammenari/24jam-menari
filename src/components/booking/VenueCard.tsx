"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const prices = [...new Set(venue.slots.map((s) => s.price))].sort(
    (a, b) => a - b
  );
  const isFull = availableSlots === 0;

  const handlePilih = () => {
    selectVenue(venue.id, venue.name);
    router.push(`/booking/${venue.id}`);
  };

  return (
    <div className="batik-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Card className="border-0 bg-card h-full">
        <CardContent className="p-6 flex flex-col gap-4 h-full">
          {/* Icon & Nama */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{venue.icon}</span>
              <div>
                <h3 className="text-tradisional text-2xl font-bold text-primary">
                  {venue.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {venue.description}
                </p>
              </div>
            </div>
          </div>

          {/* Harga */}
          <div className="flex flex-wrap gap-2">
            {prices.map((price) => (
              <Badge
                key={price}
                variant="outline"
                className="text-sm px-3 py-1 border-accent text-accent font-semibold"
              >
                {formatPrice(price)}
              </Badge>
            ))}
          </div>

          {/* Ketersediaan slot */}
          <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Slot tersedia
            </span>
            <span
              className={`text-lg font-bold ${
                isFull ? "text-destructive" : "text-primary"
              }`}
            >
              {availableSlots}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {totalSlots} jam
              </span>
            </span>
          </div>

          {/* Tombol */}
          <div className="mt-auto pt-2">
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
