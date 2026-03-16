"use client";

import { TimeSlot, formatPrice } from "@/lib/data/venues";
import { cn } from "@/lib/utils";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelect: (slot: TimeSlot) => void;
}

export default function TimeSlotGrid({
  slots,
  selectedSlotId,
  onSelect,
}: TimeSlotGridProps) {
  const groups = [
    { label: "🌅 Pagi", range: [6, 12], slots: [] as TimeSlot[] },
    { label: "☀️ Siang", range: [12, 15], slots: [] as TimeSlot[] },
    { label: "🌇 Sore", range: [15, 19], slots: [] as TimeSlot[] },
    { label: "🌙 Malam", range: [19, 25], slots: [] as TimeSlot[] },
  ];

  slots.forEach((slot) => {
    const hour = parseInt(slot.time.split(".")[0]);
    const group = groups.find((g) => hour >= g.range[0] && hour < g.range[1]);
    if (group) group.slots.push(slot);
  });

  const activeGroups = groups.filter((g) => g.slots.length > 0);

  return (
    <div className="space-y-8">
      {activeGroups.map((group) => (
        <div key={group.label}>
          <h3 className="text-lg font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            {group.label}
            <span className="text-sm font-normal">
              ({group.slots.filter((s) => !s.isBooked).length} tersedia)
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {group.slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              const isBooked = slot.isBooked;
              const nama = slot.registrant?.nama;

              return (
                <button
                  key={slot.id}
                  onClick={() => !isBooked && onSelect(slot)}
                  disabled={isBooked}
                  className={cn(
                    "relative rounded-xl border-2 p-4 text-left transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isBooked &&
                      "bg-muted border-border cursor-not-allowed",
                    !isBooked &&
                      !isSelected &&
                      "bg-card border-border hover:border-accent hover:shadow-md cursor-pointer",
                    isSelected &&
                      "bg-primary border-primary text-primary-foreground shadow-lg scale-[1.02]"
                  )}
                >
                  {/* Waktu */}
                  <p className={cn(
                    "text-xl font-bold leading-tight",
                    isSelected ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {slot.time}
                  </p>

                  {/* Info bawah */}
                  {isBooked ? (
                    <p className="text-xs mt-1 text-muted-foreground truncate" title={nama}>
                      {nama ?? "Terisi"}
                    </p>
                  ) : (
                    <p className={cn(
                      "text-sm mt-1 font-semibold",
                      isSelected ? "text-primary-foreground/80" : "text-accent"
                    )}>
                      {formatPrice(slot.price)}
                    </p>
                  )}

                  {/* Badge pojok */}
                  {isBooked && (
                    <span className="absolute top-2 right-2 text-xs bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full">
                      Penuh
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-xs bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-full">
                      ✓ Dipilih
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
