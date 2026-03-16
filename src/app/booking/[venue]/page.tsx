"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionTitle from "@/components/shared/SectionTitle";
import TimeSlotGrid from "@/components/booking/TimeSlotGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingStore } from "@/lib/store/bookingStore";
import { getVenueById, TimeSlot, formatPrice } from "@/lib/data/venues";

interface Props {
  params: Promise<{ venue: string }>;
}

export default function VenuePage({ params }: Props) {
  const { venue: venueId } = use(params);
  const router = useRouter();
  const { selectVenue, selectSlot, selectedSlotId } = useBookingStore();

  const venue = getVenueById(venueId);
  if (!venue) notFound();

  const [localSelected, setLocalSelected] = useState<TimeSlot | null>(null);

  const handleSelect = (slot: TimeSlot) => {
    setLocalSelected(slot);
    selectVenue(venue.id, venue.name);
    selectSlot(slot.id, slot.time, slot.price);
  };

  const handleLanjut = () => {
    if (!localSelected) return;
    router.push("/booking/payment");
  };

  return (
    <PageWrapper>
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-lg"
      >
        ← Kembali ke Pilih Venue
      </button>

      {/* Header venue */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-6xl">{venue.icon}</span>
        <div>
          <SectionTitle
            title={venue.name}
            subtitle={venue.description}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid slot — kiri */}
        <div className="lg:col-span-2">
          <TimeSlotGrid
            slots={venue.slots}
            selectedSlotId={localSelected?.id ?? null}
            onSelect={handleSelect}
          />
        </div>

        {/* Panel ringkasan — kanan sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="batik-border border-0">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-tradisional text-xl font-bold text-primary">
                  Ringkasan Pilihan
                </h3>

                <div className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-semibold">{venue.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jam Show</span>
                    <span className="font-semibold">
                      {localSelected ? localSelected.time : (
                        <span className="text-muted-foreground italic text-sm">
                          Belum dipilih
                        </span>
                      )}
                    </span>
                  </div>

                  {localSelected && (
                    <>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(localSelected.price)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={handleLanjut}
                  disabled={!localSelected}
                  className="w-full text-lg py-6 font-semibold mt-2"
                  size="lg"
                >
                  Lanjut ke Pembayaran →
                </Button>

                {!localSelected && (
                  <p className="text-center text-sm text-muted-foreground">
                    Pilih jam show terlebih dahulu
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Info timer */}
            <Card className="bg-accent/10 border-accent/30 border">
              <CardContent className="p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  ⏳ <span className="font-semibold">Perhatian:</span> Setelah
                  melanjutkan ke pembayaran, slot akan dikunci sementara selama{" "}
                  <span className="font-semibold text-primary">15 menit</span>.
                  Selesaikan pembayaran sebelum waktu habis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
