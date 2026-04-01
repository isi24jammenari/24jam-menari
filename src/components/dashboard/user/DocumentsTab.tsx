"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";

export default function DocumentsTab() {
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/user/schedule");
        // Mengambil jadwal pertama milik user
        if (res.data.data && res.data.data.length > 0) {
          setBookingData(res.data.data[0]);
        }
      } catch (error) {
        console.error("Gagal memuat status dokumen:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const isCompleted = bookingData?.performance?.status === "completed";

  const handleDownload = async (endpoint: string, filename: string) => {
    try {
      // Menggunakan blob karena API mengembalikan stream file PDF
      const response = await api.get(endpoint, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Gagal mengunduh berkas. Pastikan koneksi stabil.");
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center animate-pulse text-muted-foreground">Memeriksa akses dokumen...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-tradisional text-2xl font-bold text-primary">Unduh Dokumen</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Akses berkas administrasi dan sertifikat penampilan Anda.
        </p>
      </div>

      {!isCompleted ? (
        <Card className="border-destructive/20 bg-destructive/5 batik-border border-0">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <span className="text-4xl">🔒</span>
            <div className="space-y-1">
              <p className="font-bold text-destructive text-lg">Fitur Terkunci</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Anda belum dapat mengunduh dokumen pementasan. Silakan lengkapi dan <strong>Submit Final</strong> data Anda pada tab <strong>Formulir</strong> terlebih dahulu.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proposal Acara */}
          <Card className="batik-border border-0">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📄</span>
                <div>
                  <p className="font-bold text-lg">Proposal Acara</p>
                  <p className="text-xs text-muted-foreground">Informasi lengkap mengenai rundown dan teknis 24 Jam Menari.</p>
                </div>
              </div>
              <Button 
                onClick={() => handleDownload("/user/documents/proposal", "Proposal_24_Jam_Menari.pdf")}
                className="w-full"
              >
                Unduh PDF
              </Button>
            </CardContent>
          </Card>

          {/* Surat Undangan */}
          <Card className="batik-border border-0">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">✉️</span>
                <div>
                  <p className="font-bold text-lg">Surat Undangan</p>
                  <p className="text-xs text-muted-foreground">Surat resmi delegasi penampilan untuk instansi/sanggar Anda.</p>
                </div>
              </div>
              <Button 
                onClick={() => handleDownload(`/user/documents/invitation/${bookingData.id}`, `Undangan_${bookingData.performance.group_name}.pdf`)}
                className="w-full"
              >
                Unduh PDF
              </Button>
            </CardContent>
          </Card>

          {/* E-Sertifikat */}
          <Card className="batik-border border-0 md:col-span-2">
            <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🏆</span>
                <div>
                  <p className="font-bold text-lg">E-Sertifikat Penampilan</p>
                  <p className="text-xs text-muted-foreground">Akan tersedia untuk diunduh setelah acara pementasan selesai.</p>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => handleDownload(`/user/documents/certificate/${bookingData.id}`, `Sertifikat_${bookingData.performance.group_name}.pdf`)}
                className="w-full sm:w-auto"
              >
                Unduh Sertifikat
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}