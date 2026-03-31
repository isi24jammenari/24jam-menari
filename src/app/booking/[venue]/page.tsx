"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
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
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-lg font-medium"
      >
        ← Kembali ke Pilih Venue
      </button>

      {/* Header venue tanpa icon */}
      <div className="mb-10">
        <h1 className="text-tradisional text-4xl md:text-5xl font-bold text-foreground">
          {venue.name}
        </h1>
        <p className="text-xl font-bold text-primary tracking-widest mt-2">
          {venue.festivalName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Fasilitas & Jam */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="space-y-6">
            {/* Kotak Fasilitas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fasilitas Venue */}
              <div className="bg-card/50 border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border/50 pb-2">
                  🏛️ Fasilitas Venue
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {venue.venueFacilities.map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fasilitas Festival */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-primary mb-4 border-b border-primary/20 pb-2">
                  ✨ Benefit {venue.festivalName}
                </h3>
                <ul className="space-y-2 text-sm text-foreground">
                  {venue.festivalFacilities.map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-accent mt-0.5">✓</span>
                      <span className="leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kotak Syarat dan Ketentuan Baru */}
            <div className="bg-background border border-border/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent"></div>
              <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border/50 pb-2 flex items-center gap-2">
                <span>📋</span> Syarat dan Ketentuan
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
                <li>Tidak bisa berpindah venue dan jam.</li>
                <li>Apabila peserta mengundurkan diri, uang pendaftaran tidak dapat dikembalikan.</li>
                <li>Peserta boleh menyajikan lebih dari satu karya dengan total durasi yang sudah ditentukan.</li>
                <li>Peserta wajib hadir 60 menit sebelum waktu pementasan.</li>
                <li>Ruang tunggu pementasan hanya digunakan untuk transit sebelum pementasan.</li>
                <li>Bagi peserta yang membutuhkan surat pengantar untuk instansi tertentu bisa menghubungi <a href="https://wa.me/6282123239004" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-pink-500 underline font-bold transition-colors">CP. 0821-2323-9004 (PANITIA 24JAM MENARI ISI SURAKARTA)</a>.</li>
                <li>Peserta wajib mengirim revisi data maksimal 15 April 2026 pukul:22.00 WIB.</li>
              </ol>
            </div>
          </div>

          {/* Grid slot */}
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
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Venue</span>
                    <span className="font-semibold leading-tight">{venue.name}</span>
                    <span className="text-primary text-sm font-bold">{venue.festivalName}</span>
                  </div>

                  <div className="flex justify-between mt-4">
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
                      <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
                        <span className="text-muted-foreground">Total Harga</span>
                        <span className="text-2xl font-bold text-accent">
                          {formatPrice(localSelected.price)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={handleLanjut}
                  disabled={!localSelected}
                  className="w-full text-lg py-6 font-semibold mt-4"
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