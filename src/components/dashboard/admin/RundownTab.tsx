"use client";

import { venues, formatPrice } from "@/lib/data/venues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";

export default function RundownTab() {
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    venues.forEach((venue) => {
      const rows = venue.slots.map((slot) => {
        const r = slot.registrant;
        return {
          "Jam Show": slot.time,
          "Harga": formatPrice(slot.price),
          "Status": slot.isBooked ? "Terisi" : "Kosong",
          "Nama Kelompok/Sanggar": r?.nama ?? "-",
          "Kota": r?.kota ?? "-",
          "Narahubung": r?.namaKontak ?? "-",
          "CP": r?.cp ?? "-",
          "Judul Tari": r?.judulTari ?? "-",
          "Durasi": r?.durasiKarya ?? "-",
          "Status Formulir": r?.formStatus ?? "-",
        };
      });
      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = [
        { wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 32 },
        { wch: 16 }, { wch: 22 }, { wch: 16 }, { wch: 28 },
        { wch: 12 }, { wch: 14 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, venue.name);
    });
    XLSX.writeFile(wb, "Rundown_24JamMenari.xlsx");
  };

  const formBadge = (status?: string) => {
    if (status === "lengkap")
      return <Badge className="bg-primary/10 text-primary border-primary/20 border">✓ Lengkap</Badge>;
    if (status === "sebagian")
      return <Badge className="bg-accent/10 text-accent border-accent/20 border">⚠ Sebagian</Badge>;
    if (status === "kosong")
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20 border">✕ Kosong</Badge>;
    return <Badge variant="outline" className="text-muted-foreground">—</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-tradisional text-2xl font-bold text-primary">
            Rundown Peserta
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Seluruh peserta per venue dan jam show.
          </p>
        </div>
        <Button onClick={handleDownload} className="flex items-center gap-2 text-base px-6 py-5" size="lg">
          📥 Download Rundown Excel
        </Button>
      </div>

      {venues.map((venue) => (
        <div key={venue.id} className="batik-border rounded-xl overflow-hidden">
          <div className="bg-primary px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">{venue.icon}</span>
            <span className="text-tradisional text-lg font-bold text-primary-foreground">
              {venue.name}
            </span>
            <span className="ml-auto text-sm text-primary-foreground/70">
              {venue.slots.filter((s) => s.isBooked).length} / {venue.slots.length} terisi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  {["Jam", "Status", "Nama Kelompok", "Kota", "Judul Tari", "Durasi", "Formulir"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {venue.slots.map((slot, i) => {
                  const r = slot.registrant;
                  return (
                    <tr
                      key={slot.id}
                      className={`border-b border-border transition-colors hover:bg-muted/50 ${
                        i % 2 === 0 ? "bg-card" : "bg-background"
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                        {slot.time}
                      </td>
                      <td className="px-4 py-3">
                        {slot.isBooked ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20 border">Terisi</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Kosong</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">
                        {r?.nama ?? <span className="text-muted-foreground italic">—</span>}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {r?.kota ?? <span className="text-muted-foreground italic">—</span>}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {r?.judulTari ?? <span className="text-muted-foreground italic">—</span>}
                      </td>
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">
                        {r?.durasiKarya ?? <span className="text-muted-foreground italic">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {formBadge(r?.formStatus)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
